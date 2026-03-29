export interface HelperData {
  id: string;
  name: string;
  tier: number;
  baseSEperSec: number;
  baseCost: number;
  description: string;
  special: string;
  baseClickPower?: number; // Flat bonus per unit
  cpsMultiplier?: number;  // Percentage of total CPS per unit
}

export interface HelperState {
  count: number;
  level: number; // milestone tracking
}

export interface UpgradeData {
  id: string;
  name: string;
  category: 'click' | 'helper' | 'synergy' | 'ritual' | 'passive';
  cost: number;
  description: string;
  effect: string;
  unlockCondition: string;
  purchased: boolean;
}

export interface RitualData {
  id: string;
  name: string;
  seCost: number;
  extraCost?: string;
  successChance: number;
  reward: string;
  tier: 'small' | 'medium' | 'large' | 'nightmare';
}

export interface RegionData {
  id: string;
  name: string;
  seThreshold: number;
  atmosphere: string;
  color: string;
  bgGradient: string;
  bonus?: {
    type: 'production' | 'click' | 'cost' | 'all';
    value: number; // Multiplier (e.g., 1.2 = x1.2)
    description: string;
  };
}

export interface PrestigePower {
  id: string;
  name: string;
  cost: number;
  description: string;
  purchased: boolean;
}

// ─── Phase 8: Building System ───────────────────────────────────────────────

export type BuildingCategory = 'soul' | 'ritual' | 'military' | 'prestige';

export interface BuildingData {
  id: string;
  name: string;
  category: BuildingCategory;
  cost: number;           // SE cost to construct
  buildTimeSec: number;   // construction duration in seconds
  description: string;
  effect: string;         // human-readable effect
  sePerSecBonus?: number; // flat SE/s bonus on completion
  clickBonus?: number;    // multiplier on click power
  slotUnlock?: boolean;   // unlocks +1 building slot in the region
  synergyWith?: string[]; // IDs of buildings this synergizes with
  requiresRegion?: number; // minimum region index required
}

export interface BuildingInstance {
  id: string;           // buildingData id
  instanceId: string;   // unique per placed building
  startedAt: number;    // timestamp
  completesAt: number;  // timestamp
  completed: boolean;
}

// ─── Phase 9: Skill Tree ─────────────────────────────────────────────────────

export type SkillBranch = 'death' | 'decay' | 'chaos' | 'void';

export interface SkillNode {
  id: string;
  name: string;
  branch: SkillBranch;
  description: string;
  effect: string;
  dpCost: number;
  requires: string[];
  voidPath?: boolean;
  col: number;
  row: number;
}

// ─── Phase 10: Boss Fight System ─────────────────────────────────────────────

export interface BossData {
  id: string;
  name: string;
  description: string;
  maxHp: number;
  timeLimit: number; // in seconds
  rewards: {
    vt: number; // Void Dust
    dp: number; // Dream Fragments
  };
  unlockCondition?: {
    minSe?: number;
    minRegion?: number;
  };
}

export interface BossFightState {
  activeBossId: string | null;
  currentHp: number;
  timeLeft: number;
  isVictory: boolean;
  isDefeat: boolean;
}

// ─── Phase 12: Event System ───────────────────────────────────────────────────

export interface GameEventChoice {
  id: string;
  label: string;
  description: string;
  result: {
    se?: number;
    cs?: number; // curse stones
    vt?: number;
    dp?: number;
    message: string;
    type?: 'success' | 'warning' | 'info';
  };
  requirement?: {
    se?: number;
    cs?: number;
    vt?: number;
    dp?: number;
  };
}

export interface GameEvent {
  id: string;
  name: string;
  description: string;
  choices: GameEventChoice[];
  duration: number; // seconds to decide
  weight: number;   // probability weight
  minRegion?: number;
}

// ─── Phase 12: Artifact System ────────────────────────────────────────────────

export type ArtifactTier = 'common' | 'rare' | 'epic' | 'legendary' | 'unique';

export interface Artifact {
  id: string;
  name: string;
  tier: ArtifactTier;
  description: string;
  effectDescription: string;
  setId?: string;
  baseEffect: (state: any) => number; // multiplier or flat bonus
}

export interface ArtifactSet {
  id: string;
  name: string;
  count: number;
  bonusDescription: string;
  bonus: (state: any) => number;
}
