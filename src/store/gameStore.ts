import { create } from 'zustand';
import { HELPERS, UPGRADES, PRESTIGE_POWERS, OFFLINE_MAX_SECONDS, FRENZY_CLICKS_REQUIRED, FRENZY_WINDOW_MS, FRENZY_DURATION_MS, FRENZY_MULTIPLIER, REGIONS } from '../data/gameData';
import { calcHelperCost, calcCurseStones, calcMilestoneBonus } from '../systems/numberUtils';
import type { UpgradeData, PrestigePower } from '../types';

interface HelperCounts {
  [helperId: string]: number;
}

interface RitualState {
  isActive: boolean;
  countdown: number; // seconds until next ritual
  activeMultiplier: number;
  activeUntil: number; // timestamp
}

interface GameState {
  // Resources
  se: number;
  totalSE: number; // all-time (for prestige calc)
  curseStones: number;
  clickPower: number;
  totalClicks: number;

  // Helpers
  helpers: HelperCounts;

  // Upgrades
  upgrades: UpgradeData[];

  // Prestige
  prestigePowers: PrestigePower[];
  prestigeCount: number;

  // Ritual
  ritual: RitualState;

  // Frenzy
  frenzy: {
    active: boolean;
    clickTimestamps: number[];
    endsAt: number;
  };

  // Meta
  lastSaveTime: number;
  currentRegionIndex: number;

  // Actions
  click: () => void;
  buyHelper: (helperId: string) => void;
  buyUpgrade: (upgradeId: string) => void;
  performRitual: (ritualId: string) => { success: boolean; reward: string };
  prestige: () => void;
  buyPrestigePower: (powerId: string) => void;
  tick: (deltaSeconds: number) => void;
  loadSave: () => void;
  saveGame: () => void;
  processOffline: () => void;
}

const SAVE_KEY = 'lichs_ascendancy_save';

function getInitialState() {
  return {
    se: 0,
    totalSE: 0,
    curseStones: 0,
    clickPower: 1,
    totalClicks: 0,
    helpers: {} as HelperCounts,
    upgrades: UPGRADES.map(u => ({ ...u })),
    prestigePowers: PRESTIGE_POWERS.map(p => ({ ...p })),
    prestigeCount: 0,
    ritual: {
      isActive: false,
      countdown: 60,
      activeMultiplier: 1,
      activeUntil: 0,
    },
    frenzy: {
      active: false,
      clickTimestamps: [] as number[],
      endsAt: 0,
    },
    lastSaveTime: Date.now(),
    currentRegionIndex: 0,
  };
}

function calcSEperSec(helpers: HelperCounts, upgrades: UpgradeData[], prestigePowers: PrestigePower[]): number {
  let total = 0;

  for (const helper of HELPERS) {
    const count = helpers[helper.id] ?? 0;
    if (count === 0) continue;

    let rate = helper.baseSEperSec * count * calcMilestoneBonus(count);

    // Helper upgrades
    const helperUpgrade = upgrades.find(u => u.effect === `${helper.id}*2` && u.purchased);
    if (helperUpgrade) rate *= 2;

    // Synergies
    if (helper.id === 'zombie_harvester') {
      const boneArmy = upgrades.find(u => u.id === 'synergy_bone_army' && u.purchased);
      if (boneArmy) rate *= 3;
    }
    if (helper.id === 'vampire_agent') {
      const noSleep = upgrades.find(u => u.id === 'synergy_night_lord' && u.purchased) ||
                      prestigePowers.find(u => u.id === 'vampiric_embrace' && u.purchased);
      if (!noSleep && Math.random() < 0.001) {
        // 0.1% chance per tick to "sleep" (just reduce output slightly)
        rate *= 0.9;
      }
    }

    total += rate;
  }

  // Undying body prestige power
  const undying = prestigePowers.find(p => p.id === 'undying_body' && p.purchased);
  if (undying) total *= 1.25;

  // Dark symphony synergy
  const darkDemigod = helpers['dark_demigod'] ?? 0;
  const lichApp = helpers['lich_apprentice'] ?? 0;
  if (darkDemigod >= 2 && lichApp >= 10) total *= 1.5;

  return total;
}

export const useGameStore = create<GameState>((set, get) => ({
  ...getInitialState(),

  click: () => {
    const state = get();
    const now = Date.now();

    // Frenzy tracking
    const recentClicks = [...state.frenzy.clickTimestamps.filter(t => now - t < FRENZY_WINDOW_MS), now];
    let frenzyActive = state.frenzy.active;
    let frenzyEndsAt = state.frenzy.endsAt;

    if (!frenzyActive && recentClicks.length >= FRENZY_CLICKS_REQUIRED) {
      frenzyActive = true;
      frenzyEndsAt = now + FRENZY_DURATION_MS;
    }
    if (frenzyActive && now > frenzyEndsAt) {
      frenzyActive = false;
    }

    const isFrenzy = frenzyActive && now <= frenzyEndsAt;
    let power = state.clickPower;

    // Click upgrades
    state.upgrades.forEach(u => {
      if (u.purchased && u.category === 'click') {
        if (u.effect === 'clickPower*2') power *= 2;
        if (u.effect === 'clickPower*3') power *= 3;
        if (u.effect === 'clickPower*5') power *= 5;
      }
    });

    // Bone armor prestige
    const boneArmor = state.prestigePowers.find(p => p.id === 'bone_armor' && p.purchased);
    if (boneArmor) power *= 1.1;

    // Ritual multiplier
    const ritualMult = state.ritual.activeMultiplier > 1 && Date.now() < state.ritual.activeUntil
      ? state.ritual.activeMultiplier : 1;

    const gained = power * (isFrenzy ? FRENZY_MULTIPLIER : 1) * ritualMult;

    set(s => ({
      se: s.se + gained,
      totalSE: s.totalSE + gained,
      totalClicks: s.totalClicks + 1,
      frenzy: {
        active: frenzyActive,
        clickTimestamps: recentClicks.slice(-100),
        endsAt: frenzyEndsAt,
      },
    }));
  },

  buyHelper: (helperId: string) => {
    const state = get();
    const helperData = HELPERS.find(h => h.id === helperId);
    if (!helperData) return;

    const currentCount = state.helpers[helperId] ?? 0;
    const cost = calcHelperCost(helperData.baseCost, currentCount);

    if (state.se < cost) return;

    // Nightmare beast auto-ritual
    let bonusSE = 0;
    if (helperId === 'nightmare_beast') {
      bonusSE = 100; // small ritual auto reward
    }

    set(s => ({
      se: s.se - cost + bonusSE,
      helpers: { ...s.helpers, [helperId]: (s.helpers[helperId] ?? 0) + 1 },
    }));
  },

  buyUpgrade: (upgradeId: string) => {
    const state = get();
    const upgrade = state.upgrades.find(u => u.id === upgradeId);
    if (!upgrade || upgrade.purchased || state.se < upgrade.cost) return;

    set(s => ({
      se: s.se - upgrade.cost,
      upgrades: s.upgrades.map(u => u.id === upgradeId ? { ...u, purchased: true } : u),
    }));
  },

  performRitual: (ritualId: string) => {
    const state = get();
    const ritualData = {
      small_ritual:    { cost: 100,   chance: 0.8,  mult: 1.5,  duration: 10000 },
      medium_ritual:   { cost: 1000,  chance: 0.6,  mult: 3,    duration: 15000 },
      large_ritual:    { cost: 10000, chance: 0.4,  mult: 1,    duration: 0, clickBonus: 0.05 },
      nightmare_ritual:{ cost: 0,     chance: 0.25, mult: 1,    duration: 0 },
    }[ritualId];

    if (!ritualData || state.se < ritualData.cost) {
      return { success: false, reward: 'Yetersiz Ruh Özü' };
    }

    // Lich apprentice bonus
    const lichBonus = (state.helpers['lich_apprentice'] ?? 0) * 0.05;
    const successChance = Math.min(0.95, ritualData.chance + lichBonus);
    const success = Math.random() < successChance;

    if (success) {
      if (ritualId === 'large_ritual') {
        set(s => ({
          se: s.se - ritualData.cost,
          clickPower: s.clickPower * 1.05,
        }));
        return { success: true, reward: 'ClickPower kalıcı +%5!' };
      } else {
        set(s => ({
          se: s.se - ritualData.cost,
          ritual: {
            ...s.ritual,
            activeMultiplier: ritualData.mult,
            activeUntil: Date.now() + ritualData.duration,
          },
        }));
        return { success: true, reward: `SE x${ritualData.mult} aktif!` };
      }
    } else {
      set(s => ({ se: s.se - ritualData.cost }));
      return { success: false, reward: 'Ritüel başarısız...' };
    }
  },

  prestige: () => {
    const state = get();
    const earned = calcCurseStones(state.totalSE);
    if (earned === 0) return;

    // Dark demigod bonus: converts 5% of income to extra curseStones
    const darkDemigodCount = state.helpers['dark_demigod'] ?? 0;
    const bonus = darkDemigodCount > 0 ? Math.floor(earned * 0.05) : 0;

    const initial = getInitialState();

    // Soul collector: start with bonus SE
    const soulCollector = state.prestigePowers.find(p => p.id === 'soul_collector' && p.purchased);

    set({
      ...initial,
      curseStones: state.curseStones + earned + bonus,
      prestigeCount: state.prestigeCount + 1,
      prestigePowers: state.prestigePowers, // keep purchased powers
      se: soulCollector ? 10 : 0,
      lastSaveTime: Date.now(),
    });
  },

  buyPrestigePower: (powerId: string) => {
    const state = get();
    const power = state.prestigePowers.find(p => p.id === powerId);
    if (!power || power.purchased || state.curseStones < power.cost) return;

    set(s => ({
      curseStones: s.curseStones - power.cost,
      prestigePowers: s.prestigePowers.map(p => p.id === powerId ? { ...p, purchased: true } : p),
    }));
  },

  tick: (deltaSeconds: number) => {
    const state = get();
    const sePerSec = calcSEperSec(state.helpers, state.upgrades, state.prestigePowers);

    // Ritual multiplier
    const now = Date.now();
    const ritualMult = state.ritual.activeMultiplier > 1 && now < state.ritual.activeUntil
      ? state.ritual.activeMultiplier : 1;

    // Frenzy expiry
    let frenzy = state.frenzy;
    if (frenzy.active && now > frenzy.endsAt) {
      frenzy = { ...frenzy, active: false };
    }
    const frenzyMult = frenzy.active ? FRENZY_MULTIPLIER : 1;

    const gained = sePerSec * deltaSeconds * ritualMult * frenzyMult;

    // Ritual countdown
    let ritualCountdown = state.ritual.countdown - deltaSeconds;
    let ritualActive = state.ritual.isActive;
    if (ritualCountdown <= 0) {
      ritualCountdown = 60 + Math.random() * 60; // 60-120s
      ritualActive = true;
    }

    // Region update
    const newTotalSE = state.totalSE + gained;
    let regionIndex = 0;
    for (let i = REGIONS.length - 1; i >= 0; i--) {
      if (newTotalSE >= REGIONS[i].seThreshold) { regionIndex = i; break; }
    }

    set(s => ({
      se: s.se + gained,
      totalSE: s.totalSE + gained,
      frenzy,
      ritual: {
        ...s.ritual,
        countdown: ritualCountdown,
        isActive: ritualActive,
      },
      currentRegionIndex: regionIndex,
    }));
  },

  saveGame: () => {
    const state = get();
    const saveData = {
      se: state.se,
      totalSE: state.totalSE,
      curseStones: state.curseStones,
      clickPower: state.clickPower,
      totalClicks: state.totalClicks,
      helpers: state.helpers,
      upgrades: state.upgrades,
      prestigePowers: state.prestigePowers,
      prestigeCount: state.prestigeCount,
      currentRegionIndex: state.currentRegionIndex,
      savedAt: Date.now(),
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    set({ lastSaveTime: Date.now() });
  },

  loadSave: () => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      set({
        se: data.se ?? 0,
        totalSE: data.totalSE ?? 0,
        curseStones: data.curseStones ?? 0,
        clickPower: data.clickPower ?? 1,
        totalClicks: data.totalClicks ?? 0,
        helpers: data.helpers ?? {},
        upgrades: data.upgrades ?? UPGRADES.map(u => ({ ...u })),
        prestigePowers: data.prestigePowers ?? PRESTIGE_POWERS.map(p => ({ ...p })),
        prestigeCount: data.prestigeCount ?? 0,
        currentRegionIndex: data.currentRegionIndex ?? 0,
        lastSaveTime: data.savedAt ?? Date.now(),
      });
    } catch (e) {
      console.error('Save load failed:', e);
    }
  },

  processOffline: () => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      const savedAt = data.savedAt ?? Date.now();
      const offlineSeconds = Math.min((Date.now() - savedAt) / 1000, OFFLINE_MAX_SECONDS);
      if (offlineSeconds < 10) return;

      const state = get();
      const sePerSec = calcSEperSec(state.helpers, state.upgrades, state.prestigePowers);
      const earned = sePerSec * offlineSeconds;

      set(s => ({
        se: s.se + earned,
        totalSE: s.totalSE + earned,
      }));
    } catch (e) {
      console.error('Offline process failed:', e);
    }
  },
}));

export function calcCurrentSEperSec(): number {
  const state = useGameStore.getState();
  return calcSEperSec(state.helpers, state.upgrades, state.prestigePowers);
}
