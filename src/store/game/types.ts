import type { UpgradeData, PrestigePower, BossFightState } from '../../types';

/**
 * Yardımcı birimlerin miktarını tutan yardımcı interface.
 * Anahtar: Helper ID, Değer: Miktar
 */
export interface HelperCounts {
  [helperId: string]: number;
}

/**
 * Ritüellerin aktiflik durumunu ve sayacını tutan yapı.
 */
export interface RitualState {
  isActive: boolean;
  countdown: number; // Bir sonraki ritüele kalan saniye
  activeMultiplier: number;
  activeUntil: number; // Bitiş zaman damgası (timestamp)
}

/**
 * Uygulama içi bildirimlerin yapısı.
 */
export interface AppNotification {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning';
}

/**
 * Ana Oyun Durumu (GameState) arayüzü.
 * Tüm kaynaklar, birimler, yükseltmeler ve aksiyonları içerir.
 */
export interface GameState {
  // --- Kaynaklar (Resources) ---
  se: number;           // Ruh Özü (Soul Essence)
  totalSE: number;      // Tüm zamanların toplamı (Prestige hesaplaması için)
  curseStones: number;  // Lanetli Taşlar (L1 Prestige)
  dc: number;           // Karanlık Kristaller (L2 Prestige)
  sd: number;           // Çözülme Kıvılcımı (L3 Prestige)
  vt: number;           // Boşluk Tozu (Boss ödülü)
  clickPower: number;   // Temel tıklama gücü
  totalClicks: number;  // Toplam tıklama sayısı

  // --- Birimler ve Gelişmeler ---
  helpers: HelperCounts;
  upgrades: UpgradeData[];

  // --- Prestij Sistemleri ---
  prestigeCount: number;
  prestigePowers: PrestigePower[];
  
  prestigeCountDC: number;
  prestigePowersDC: PrestigePower[];
  
  prestigeCountSD: number;
  prestigePowersSD: PrestigePower[];

  // --- Ritüel ve Frenzy (Çılgınlık) ---
  ritual: RitualState;
  frenzy: {
    active: boolean;
    clickTimestamps: number[];
    endsAt: number;
  };

  // --- Meta ve Sistem ---
  lastSaveTime: number;
  currentRegionIndex: number;
  notifications: AppNotification[];

  // --- Boss Savaşı ---
  bossFight: BossFightState;

  // --- Artifaktlar (Kalıcılık için) ---
  artifacts: string[];

  // --- Birim Özel Durumları (Zamanlayıcılar) ---
  obliteratedTimer: number; // Obliterated God için 100s sayacı
  obliteratedActiveUntil: number; // Burst bitiş zamanı

  // --- Aksiyonlar (Actions) ---
  click: () => void;
  buyHelper: (helperId: string) => void;
  buyUpgrade: (upgradeId: string) => void;
  performRitual: (ritualId: string) => { success: boolean; reward: string };
  prestige: () => void;
  buyPrestigePower: (powerId: string) => void;
  
  prestigeDC: () => void;
  buyPrestigePowerDC: (powerId: string) => void;

  prestigeSD: () => void;
  buyPrestigePowerSD: (powerId: string) => void;

  tick: (deltaSeconds: number) => void;
  loadSave: () => void;
  saveGame: () => void;
  processOffline: () => void;
  addNotification: (message: string, type?: 'info' | 'success' | 'warning') => void;
  removeNotification: (id: number) => void;
  resetGame: () => void;
  
  addSE: (amount: number) => void;
  addCS: (amount: number) => void;
  addVT: (amount: number) => void;

  // --- Boss Aksiyonları ---
  startBossFight: (bossId: string) => void;
  attackBoss: () => void;
  endBossFight: () => void;
}
