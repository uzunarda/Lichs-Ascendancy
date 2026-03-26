export interface HelperData {
  id: string;
  name: string;
  tier: number;
  baseSEperSec: number;
  baseCost: number;
  description: string;
  special: string;
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
}

export interface PrestigePower {
  id: string;
  name: string;
  cost: number;
  description: string;
  purchased: boolean;
}
