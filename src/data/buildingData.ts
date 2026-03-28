import type { BuildingData } from '../types';

// ────────────────────────────────────────────────────────────────────────────
// BUILDINGS — 8 tiers, Ruh Çukuru → Ebediyet Tahtı
// ────────────────────────────────────────────────────────────────────────────
export const BUILDINGS: BuildingData[] = [
  {
    id: 'soul_pit',
    name: 'Ruh Çukuru',
    category: 'soul',
    cost: 5000,
    buildTimeSec: 30,
    description: 'Yerin altında biriken ruh enerjisini sürekli toplar.',
    effect: '+5 SE/sn',
    sePerSecBonus: 5,
    requiresRegion: 0,
  },
  {
    id: 'bone_forge',
    name: 'Kemik Dövme Ocağı',
    category: 'military',
    cost: 50000,
    buildTimeSec: 120,
    description: 'İskelet birliklerinin hasar ve üretimini artırır.',
    effect: 'İskelet İşçi üretimi x1.5',
    sePerSecBonus: 25,
    synergyWith: ['soul_pit'],
    requiresRegion: 0,
  },
  {
    id: 'ritual_altar',
    name: 'Ritüel Sunağı',
    category: 'ritual',
    cost: 200000,
    buildTimeSec: 300,
    description: 'Ritüeller arası bekleme süresini azaltır ve başarı şansını artırır.',
    effect: 'Ritüel cooldown -%30 · başarı şansı +%15',
    synergyWith: ['soul_pit', 'bone_forge'],
    requiresRegion: 1,
  },
  {
    id: 'shadow_vault',
    name: 'Gölge Kasası',
    category: 'soul',
    cost: 1500000,
    buildTimeSec: 600,
    description: 'Offline birikimi %50 artırır; taban SE üretimini güçlendirir.',
    effect: 'Offline üretim x1.5 · +100 SE/sn',
    sePerSecBonus: 100,
    requiresRegion: 2,
  },
  {
    id: 'nightmare_spire',
    name: 'Kabus Kulesi',
    category: 'military',
    cost: 10000000,
    buildTimeSec: 1200,
    description: 'Tüm askeri birimlerin katkısını periyodik olarak ikiye katlar (60s\'de bir).',
    effect: 'Askeri birimler her 60s\'de x2 anlık üretim',
    synergyWith: ['bone_forge'],
    requiresRegion: 3,
  },
  {
    id: 'void_sanctum',
    name: 'Yokluk Tapınağı',
    category: 'ritual',
    cost: 100000000,
    buildTimeSec: 3600,
    description: 'Yokluk gücüyle beslenen bu yapı tüm üretimi kalıcı olarak güçlendirir.',
    effect: 'Tüm SE üretimi x1.25 (kalıcı)',
    synergyWith: ['ritual_altar', 'shadow_vault'],
    requiresRegion: 4,
  },
  {
    id: 'lich_citadel',
    name: 'Lich Kalesi',
    category: 'prestige',
    cost: 2000000000,
    buildTimeSec: 7200,
    description: 'Prestige sonrası başlangıç SE\'sini 100 kat artırır ve ekstra yapı slotu açar.',
    effect: 'Başlangıç SE x100 · +1 yapı slotu',
    slotUnlock: true,
    synergyWith: ['void_sanctum'],
    requiresRegion: 5,
  },
  {
    id: 'eternity_throne',
    name: 'Ebediyet Tahtı',
    category: 'prestige',
    cost: 100000000000,
    buildTimeSec: 86400, // 24 hours!
    description: 'Lich\'in nihai tahtı. Tüm sistemlere %50 kalıcı bonus uygular.',
    effect: 'Tüm üretim x1.5 · Click Power x2 · +2 yapı slotu',
    sePerSecBonus: 10000,
    clickBonus: 2,
    slotUnlock: true,
    synergyWith: ['lich_citadel', 'void_sanctum', 'nightmare_spire'],
    requiresRegion: 6,
  },
];

// 4 Sinerji kombinasyonu
export const BUILDING_SYNERGIES = [
  {
    id: 'dark_foundation',
    name: 'Karanlık Temel',
    buildings: ['soul_pit', 'bone_forge'],
    description: 'Çukur + Ocak: İskelet üretimi ek x1.3',
    bonus: 'skeleton_worker_x1.3',
  },
  {
    id: 'ritual_convergence',
    name: 'Ritüel Yakınsama',
    buildings: ['ritual_altar', 'void_sanctum'],
    description: 'Sunak + Tapınak: Tüm ritüel ödülleri x2',
    bonus: 'ritual_reward_x2',
  },
  {
    id: 'nightmare_order',
    name: 'Kabus Düzeni',
    buildings: ['nightmare_spire', 'lich_citadel'],
    description: 'Kule + Kale: Prestige bonusu +%25',
    bonus: 'prestige_bonus_0.25',
  },
  {
    id: 'void_eternity',
    name: 'Yokluk Sonsuzluğu',
    buildings: ['void_sanctum', 'eternity_throne'],
    description: 'Tapınak + Taht: Tüm üretim ek x1.5',
    bonus: 'global_x1.5',
  },
];

export const BUILDING_BASE_SLOTS = 5; // per region
export const BUILDING_PRESTIGE_EXTRA_SLOTS = 2;
