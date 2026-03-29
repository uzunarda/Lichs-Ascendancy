import { create } from 'zustand';
import { SKILL_NODES } from '../data/skillTreeData';

// ─── State ───────────────────────────────────────────────────────────────────

interface SkillTreeState {
  // Dream Particles resource
  dp: number;
  totalDpEarned: number;

  // Purchased node IDs
  purchased: Set<string>;

  // Computed bonuses
  bonuses: {
    globalSEMult: number;      // multiplier on all SE/s
    clickMult: number;         // multiplier on click power
    ritualChanceBonus: number; // additive
    ritualCooldownMult: number;// multiplier (<=1 = faster)
    offlineMult: number;       // multiplier on offline gains
    buildTimeMult: number;     // multiplier on build time
    frenzyThresholdMult: number;
    curseStoneBonus: number;   // additive per-second
  };

  // Actions
  addDP: (amount: number) => void;
  canUnlock: (nodeId: string, costMult?: number) => boolean;
  unlockNode: (nodeId: string, costMult?: number) => boolean; // returns false if can't afford
  resetVoidPath: () => void; // intentionally not available — gated in UI
  loadSkillTree: (saved: { dp: number; purchased: string[] }) => void;
  saveSkillTree: () => { dp: number; purchased: string[] };
}

// ─── Bonus computation ───────────────────────────────────────────────────────

function calcBonuses(purchased: Set<string>) {
  const bonuses = {
    globalSEMult: 1,
    clickMult: 1,
    ritualChanceBonus: 0,
    ritualCooldownMult: 1,
    offlineMult: 1,
    buildTimeMult: 1,
    frenzyThresholdMult: 1,
    curseStoneBonus: 0,
  };

  for (const id of purchased) {
    switch (id) {
      case 'death_root':    bonuses.clickMult *= 1.15; break;
      case 'death_1a':      bonuses.globalSEMult *= 1.25; break;
      case 'death_1b':      bonuses.clickMult *= 1.10; break;
      case 'death_2a':      bonuses.ritualCooldownMult *= 0.80; break;
      case 'death_2b':      bonuses.clickMult *= 1.50; break;
      case 'death_3':       bonuses.globalSEMult *= 1.30; bonuses.clickMult *= 1.30; break;
      case 'death_mastery': bonuses.globalSEMult *= 1.20; break;

      case 'decay_root':    bonuses.globalSEMult *= 1.20; break;
      case 'decay_1a':      /* flat +10 SE/s handled in tick */ break;
      case 'decay_1b':      bonuses.offlineMult *= 1.30; break;
      case 'decay_2a':      bonuses.globalSEMult *= 1.15; break;
      case 'decay_2b':      /* prestige bonus — handled in prestige */ break;
      case 'decay_3':       bonuses.globalSEMult *= 1.40; break;
      case 'decay_mastery': bonuses.buildTimeMult *= 0.50; break;

      case 'chaos_root':    bonuses.frenzyThresholdMult *= 0.90; break;
      case 'chaos_1b':      bonuses.ritualChanceBonus += 0.20; break;
      case 'chaos_2a':      /* frenzy duration — handled in frenzy */ break;
      case 'chaos_3':       bonuses.ritualChanceBonus += 0.10; break;
      case 'chaos_mastery': bonuses.frenzyThresholdMult *= 0.50; break;

      case 'void_gate':  bonuses.curseStoneBonus += 0.5; break;
      case 'void_1':     bonuses.globalSEMult *= 1.50; break;
      case 'void_2':     /* prestige bonus */ break;
      case 'void_3':     bonuses.globalSEMult *= 1.30; bonuses.clickMult *= 1.30; break;
      case 'void_apotheosis':
        bonuses.globalSEMult *= 3;
        bonuses.clickMult *= 5;
        bonuses.curseStoneBonus += 2;
        break;
    }
  }

  return bonuses;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useSkillTreeStore = create<SkillTreeState>((set, get) => ({
  dp: 0,
  totalDpEarned: 0,
  purchased: new Set<string>(),
  bonuses: calcBonuses(new Set()),

  addDP(amount) {
    set(s => ({ dp: s.dp + amount, totalDpEarned: s.totalDpEarned + amount }));
  },

  canUnlock(nodeId, costMult = 1) {
    const state = get();
    const node = SKILL_NODES.find(n => n.id === nodeId);
    if (!node) return false;
    if (state.purchased.has(nodeId)) return false;
    
    const effectiveCost = Math.floor(node.dpCost * costMult);

    if (state.dp < effectiveCost) return false;
    return node.requires.every(req => state.purchased.has(req));
  },

  unlockNode(nodeId, costMult = 1) {
    const state = get();
    if (!state.canUnlock(nodeId, costMult)) return false;
    const node = SKILL_NODES.find(n => n.id === nodeId)!;

    const effectiveCost = Math.floor(node.dpCost * costMult);

    const next = new Set(state.purchased);
    next.add(nodeId);

    set({ dp: state.dp - effectiveCost, purchased: next, bonuses: calcBonuses(next) });
    return true;
  },

  resetVoidPath() {
    // intentionally a no-op in normal gameplay; kept for admin/debug use
  },

  loadSkillTree(saved) {
    const purchased = new Set(saved.purchased ?? []);
    set({ dp: saved.dp ?? 0, purchased, bonuses: calcBonuses(purchased) });
  },

  saveSkillTree() {
    const s = get();
    return { dp: s.dp, purchased: Array.from(s.purchased) };
  },
}));
