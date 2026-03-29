import { create } from 'zustand';
import { ARTIFACTS, ARTIFACT_SETS } from '../data/artifactData';

interface ArtifactState {
  owned: string[]; // array of artifact IDs
  
  // Actions
  addArtifact: (id: string) => void;
  hasArtifact: (id: string) => boolean;
  getSetCount: (setId: string) => number;
  isSetComplete: (setId: string) => boolean;
  
  // Calculated bonuses
  getGlobalSEMult: () => number;
  getClickPowerMult: () => number;
  getBossDamageMult: () => number;
  getVTMountBonus: () => number;
  
  // New getters
  getFlatSEBonus: () => number;
  getHelperMult: (helperId: string) => number;
  getRitualMult: () => number;
  getRitualDurationMult: () => number;
  getRitualChanceBonus: () => number;
  getPrestigeCurrencyBonus: (type: 'dc' | 'sd') => number;
  getDPMult: () => number;
  getOfflineMult: () => number;
  getTickHaste: () => number;
  getBuildTimeMult: () => number;

  loadArtifacts: (ids: string[]) => void;
}

export const useArtifactStore = create<ArtifactState>((set, get) => ({
  owned: [],

  addArtifact: (id: string) => {
    if (get().owned.includes(id)) return;
    set(s => ({ owned: [...s.owned, id] }));
  },

  hasArtifact: (id: string) => get().owned.includes(id),

  getSetCount: (setId: string) => {
    const owned = get().owned;
    return ARTIFACTS.filter(a => a.setId === setId && owned.includes(a.id)).length;
  },

  isSetComplete: (setId: string) => {
    const setDef = ARTIFACT_SETS.find(s => s.id === setId);
    if (!setDef) return false;
    return get().getSetCount(setId) >= setDef.count;
  },

  getGlobalSEMult: () => {
    let mult = 1;
    const owned = get().owned;
    
    if (owned.includes('lich_crown_shard')) mult *= 1.5;
    
    // Set bonuses
    if (get().isSetComplete('death_legacy')) {
      mult *= 2;
    }

    return mult;
  },

  getFlatSEBonus: () => {
    let bonus = 0;
    if (get().owned.includes('dusty_tome')) bonus += 50;
    return bonus;
  },

  getHelperMult: (helperId: string) => {
    let mult = 1;
    const owned = get().owned;
    if (owned.includes('master_amulet')) mult *= 1.2;
    if (helperId === 'zombie_harvester' && owned.includes('broken_skull')) mult *= 1.1;
    return mult;
  },

  getClickPowerMult: () => {
    let mult = 1;
    const owned = get().owned;
    if (owned.includes('vampire_fang')) mult *= 1.1;
    return mult;
  },

  getRitualMult: () => {
    let mult = 1;
    if (get().owned.includes('blood_ruby')) mult *= 1.2;
    return mult;
  },

  getRitualDurationMult: () => {
      let mult = 1;
      if (get().owned.includes('silver_chalice')) mult *= 1.2;
      return mult;
  },

  getRitualChanceBonus: () => {
      let bonus = 0;
      if (get().owned.includes('dark_candle')) bonus += 0.01;
      return bonus;
  },

  getPrestigeCurrencyBonus: (type) => {
      let bonus = 0;
      const owned = get().owned;
      if (type === 'dc' && owned.includes('void_heart')) bonus += 1;
      if (type === 'sd' && owned.includes('eternal_spark')) bonus += 1;
      return bonus;
  },

  getDPMult: () => {
    let mult = 1;
    const owned = get().owned;
    if (owned.includes('dream_lens')) mult *= 1.25;
    if (get().isSetComplete('dream_weaver')) mult *= 2;
    return mult;
  },

  getOfflineMult: () => {
    let mult = 1;
    const owned = get().owned;
    if (owned.includes('emerald_eye')) mult *= 1.1;
    return mult;
  },

  getTickHaste: () => {
    let haste = 0;
    const owned = get().owned;
    if (owned.includes('rift_engine')) haste += 0.05;
    if (owned.includes('shadow_feather')) haste += 0.05;
    return haste;
  },

  getBuildTimeMult: () => {
    let mult = 1;
    if (get().owned.includes('skeleton_key')) mult *= 0.85;
    return mult;
  },

  getBossDamageMult: () => {
    let mult = 1;
    const owned = get().owned;
    if (owned.includes('executioner_axe')) mult *= 1.25;
    if (owned.includes('soul_reaper')) mult *= 10;
    if (get().isSetComplete('war_master')) mult *= 3;
    return mult;
  },

  getVTMountBonus: () => {
    let bonus = 0;
    const owned = get().owned;
    if (owned.includes('void_shard')) bonus += 1;
    return bonus;
  },

  loadArtifacts: (ids: string[]) => set({ owned: ids || [] }),
}));
