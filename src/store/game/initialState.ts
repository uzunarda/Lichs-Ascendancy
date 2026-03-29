import { UPGRADES, PRESTIGE_POWERS, PRESTIGE_POWERS_DC, PRESTIGE_POWERS_SD } from '../../data/gameData';
import type { GameState, HelperCounts, AppNotification } from './types';

/** 
 * Yerel depolama anahtarı (Local Storage Key) 
 */
export const SAVE_KEY = 'lichs_ascendancy_save';

/**
 * Bildirimler için benzersiz ID sayacı 
 */
export let notifId = 0;

/**
 * Oyunun başlangıç durumunu (Initial State) döndüren fonksiyon.
 * Yeni oyun veya prestij sıfırlamalarında kullanılır.
 */
export function getInitialState(): Omit<GameState, 'click' | 'buyHelper' | 'buyUpgrade' | 'performRitual' | 'prestige' | 'buyPrestigePower' | 'prestigeDC' | 'buyPrestigePowerDC' | 'prestigeSD' | 'buyPrestigePowerSD' | 'tick' | 'loadSave' | 'saveGame' | 'processOffline' | 'addNotification' | 'removeNotification' | 'resetGame' | 'addSE' | 'addCS' | 'addVT' | 'startBossFight' | 'attackBoss' | 'endBossFight'> {
  return {
    se: 0,
    totalSE: 0,
    curseStones: 0,
    dc: 0,
    sd: 0,
    vt: 0,
    clickPower: 1,
    totalClicks: 0,
    helpers: {} as HelperCounts,
    upgrades: UPGRADES.map(u => ({ ...u })),
    prestigeCount: 0,
    prestigePowers: PRESTIGE_POWERS.map(p => ({ ...p })),
    prestigeCountDC: 0,
    prestigePowersDC: PRESTIGE_POWERS_DC.map(p => ({ ...p })),
    prestigeCountSD: 0,
    prestigePowersSD: PRESTIGE_POWERS_SD.map(p => ({ ...p })),
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
    notifications: [] as AppNotification[],
    bossFight: {
      activeBossId: null,
      currentHp: 0,
      timeLeft: 0,
      isVictory: false,
      isDefeat: false,
    },
    artifacts: [] as string[],
    obliteratedTimer: 0,
    obliteratedActiveUntil: 0,
  };
}
