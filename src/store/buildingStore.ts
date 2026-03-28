import { create } from 'zustand';
import { BUILDINGS, BUILDING_SYNERGIES, BUILDING_BASE_SLOTS, BUILDING_PRESTIGE_EXTRA_SLOTS } from '../data/buildingData';
import type { BuildingInstance } from '../types';

// ─── State Interface ─────────────────────────────────────────────────────────

interface BuildingState {
  // buildings[regionIndex] = list of placed instances in that region
  buildings: Record<number, BuildingInstance[]>;
  extraSlots: number; // extra slots earned via prestige/buildings

  // Computed helpers
  totalSEBonus: number;    // sum of all completed sePerSecBonus
  totalClickBonus: number; // product of all completed clickBonus multipliers
  activeSynergies: string[]; // list of synergy IDs currently active

  // Actions
  startBuilding: (buildingId: string, regionIndex: number, seAvailable: number) => { success: boolean; cost: number };
  tickBuildings: (nowMs: number) => void;
  getSlots: (regionIndex: number, prestigeCount: number) => { used: number; total: number };
  getBuildingBonuses: () => { sePerSec: number; clickMultiplier: number };
  resetBuildings: () => void;
  loadBuildings: (saved: Partial<BuildingState>) => void;
  saveBuildings: () => Partial<BuildingState>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

let instanceCounter = 0;
function newInstanceId() {
  return `bi_${Date.now()}_${++instanceCounter}`;
}

function computeSynergies(allInstances: BuildingInstance[]): string[] {
  const completedIds = new Set(
    allInstances.filter(i => i.completed).map(i => i.id)
  );
  return BUILDING_SYNERGIES
    .filter(s => s.buildings.every(b => completedIds.has(b)))
    .map(s => s.id);
}

function computeBonuses(allInstances: BuildingInstance[]): { sePerSec: number; clickMultiplier: number } {
  const completed = allInstances.filter(i => i.completed);
  const activeSynergies = computeSynergies(allInstances);

  let sePerSec = 0;
  let clickMultiplier = 1;

  for (const inst of completed) {
    const data = BUILDINGS.find(b => b.id === inst.id);
    if (!data) continue;
    if (data.sePerSecBonus) sePerSec += data.sePerSecBonus;
    if (data.clickBonus)   clickMultiplier *= data.clickBonus;
  }

  // Apply synergy bonuses
  if (activeSynergies.includes('void_eternity')) sePerSec *= 1.5;

  return { sePerSec, clickMultiplier };
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useBuildingStore = create<BuildingState>((set, get) => ({
  buildings: {},
  extraSlots: 0,
  totalSEBonus: 0,
  totalClickBonus: 1,
  activeSynergies: [],

  // ── startBuilding ─────────────────────────────────────────────────────────
  startBuilding(buildingId, regionIndex, seAvailable) {
    const data = BUILDINGS.find(b => b.id === buildingId);
    if (!data) return { success: false, cost: 0 };

    const state = get();
    const regionBuildings = state.buildings[regionIndex] ?? [];
    const slots = state.getSlots(regionIndex, 0);

    if (regionBuildings.length >= slots.total) {
      return { success: false, cost: 0 }; // no slots
    }
    if (seAvailable < data.cost) {
      return { success: false, cost: data.cost };
    }

    const now = Date.now();
    const instance: BuildingInstance = {
      id: buildingId,
      instanceId: newInstanceId(),
      startedAt: now,
      completesAt: now + data.buildTimeSec * 1000,
      completed: false,
    };

    set(s => ({
      buildings: {
        ...s.buildings,
        [regionIndex]: [...(s.buildings[regionIndex] ?? []), instance],
      },
    }));

    return { success: true, cost: data.cost };
  },

  // ── tickBuildings ─────────────────────────────────────────────────────────
  tickBuildings(nowMs) {
    const state = get();
    let changed = false;

    const updatedBuildings: Record<number, BuildingInstance[]> = {};
    let extraSlotsFromBuildings = 0;

    for (const [regionStr, instances] of Object.entries(state.buildings)) {
      const regionIdx = Number(regionStr);
      updatedBuildings[regionIdx] = instances.map(inst => {
        if (!inst.completed && nowMs >= inst.completesAt) {
          changed = true;
          const data = BUILDINGS.find(b => b.id === inst.id);
          if (data?.slotUnlock) extraSlotsFromBuildings++;
          return { ...inst, completed: true };
        }
        return inst;
      });
    }

    if (changed) {
      const allInstances = Object.values(updatedBuildings).flat();
      const { sePerSec, clickMultiplier } = computeBonuses(allInstances);
      const synergies = computeSynergies(allInstances);

      set({
        buildings: updatedBuildings,
        extraSlots: extraSlotsFromBuildings,
        totalSEBonus: sePerSec,
        totalClickBonus: clickMultiplier,
        activeSynergies: synergies,
      });
    }
  },

  // ── getSlots ──────────────────────────────────────────────────────────────
  getSlots(regionIndex, prestigeCount) {
    const state = get();
    const used  = (state.buildings[regionIndex] ?? []).length;
    const total = BUILDING_BASE_SLOTS
      + Math.min(prestigeCount, 3) * BUILDING_PRESTIGE_EXTRA_SLOTS
      + state.extraSlots;
    return { used, total };
  },

  // ── getBuildingBonuses ────────────────────────────────────────────────────
  getBuildingBonuses() {
    const state = get();
    return { sePerSec: state.totalSEBonus, clickMultiplier: state.totalClickBonus };
  },

  // ── reset ─────────────────────────────────────────────────────────────────
  resetBuildings() {
    set({ buildings: {}, extraSlots: 0, totalSEBonus: 0, totalClickBonus: 1, activeSynergies: [] });
  },

  // ── persistence ───────────────────────────────────────────────────────────
  loadBuildings(saved) {
    if (!saved) return;
    const allInstances = Object.values(saved.buildings ?? {}).flat();
    const { sePerSec, clickMultiplier } = computeBonuses(allInstances);
    const synergies = computeSynergies(allInstances);
    set({
      buildings: saved.buildings ?? {},
      extraSlots: saved.extraSlots ?? 0,
      totalSEBonus: sePerSec,
      totalClickBonus: clickMultiplier,
      activeSynergies: synergies,
    });
  },

  saveBuildings() {
    const s = get();
    return { buildings: s.buildings, extraSlots: s.extraSlots };
  },
}));
