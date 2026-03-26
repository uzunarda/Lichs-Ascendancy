import type { HelperData, RitualData, RegionData, PrestigePower, UpgradeData } from '../types';

export const HELPERS: HelperData[] = [
  {
    id: 'skeleton_worker',
    name: 'İskelet İşçi',
    tier: 1,
    baseSEperSec: 0.5,
    baseCost: 10,
    description: 'Güvenilir, hızlanmaz ama hiç durmaz.',
    special: 'Hiç durmaz',
  },
  {
    id: 'zombie_harvester',
    name: 'Zombi Hasat Edici',
    tier: 2,
    baseSEperSec: 3,
    baseCost: 100,
    description: 'Çevresindeki helper\'ları %10 hızlandırır.',
    special: 'AoE +%10 hız',
  },
  {
    id: 'vampire_agent',
    name: 'Vampir Ajan',
    tier: 3,
    baseSEperSec: 20,
    baseCost: 1000,
    description: '%10 ihtimalle 1 saniye uyuyakalır.',
    special: 'Uyuma riski',
  },
  {
    id: 'lich_apprentice',
    name: 'Lich Çırağı',
    tier: 4,
    baseSEperSec: 150,
    baseCost: 10000,
    description: 'Pasif büyü üretir; Ritüel başarı şansını +%5 artırır.',
    special: 'Ritüel +%5',
  },
  {
    id: 'nightmare_beast',
    name: 'Kabus Canavarı',
    tier: 5,
    baseSEperSec: 1200,
    baseCost: 100000,
    description: 'Her satın alımda küçük Ritüel otomatik tetikler.',
    special: 'Otomatik Ritüel',
  },
  {
    id: 'dark_demigod',
    name: 'Karanlık Yarı-Tanrı',
    tier: 6,
    baseSEperSec: 10000,
    baseCost: 1000000,
    description: 'Prestige sırasında gelirin %5\'ini prestige para birimine dönüştürür.',
    special: 'Prestige bonus',
  },
];

export const RITUALS: RitualData[] = [
  {
    id: 'small_ritual',
    name: 'Küçük Ritüel',
    seCost: 100,
    successChance: 0.8,
    reward: 'SE x1.5 (10 sn)',
    tier: 'small',
  },
  {
    id: 'medium_ritual',
    name: 'Orta Ritüel',
    seCost: 1000,
    extraCost: '1 Kemik',
    successChance: 0.6,
    reward: 'SE x3 (15 sn) veya Helper hızı x2',
    tier: 'medium',
  },
  {
    id: 'large_ritual',
    name: 'Büyük Ritüel',
    seCost: 10000,
    extraCost: '3 Item',
    successChance: 0.4,
    reward: 'Kalıcı ClickPower +%5',
    tier: 'large',
  },
  {
    id: 'nightmare_ritual',
    name: 'Kâbus Ritüeli',
    seCost: 0,
    extraCost: 'Prestige Materyali',
    successChance: 0.25,
    reward: 'Nadir passive güç açma',
    tier: 'nightmare',
  },
];

export const REGIONS: RegionData[] = [
  {
    id: 'graveyard',
    name: 'Çürük Mezarlık',
    seThreshold: 0,
    atmosphere: 'Soluk yeşil, sis efektleri, baykuş sesi',
    color: '#4a7c59',
    bgGradient: 'radial-gradient(ellipse at 50% 100%, #0d1f14 0%, #050d08 60%, #020508 100%)',
  },
  {
    id: 'cursed_forest',
    name: 'Lanetli Orman',
    seThreshold: 10000,
    atmosphere: 'Derin mor, titreyen yapraklar, rüzgar sesi',
    color: '#7c4a9e',
    bgGradient: 'radial-gradient(ellipse at 50% 100%, #1a0a2e 0%, #0d0518 60%, #03010a 100%)',
  },
  {
    id: 'abandoned_castle',
    name: 'Terk Edilmiş Kale',
    seThreshold: 500000,
    atmosphere: 'Taş gri, alev parçacıkları, uzak zincir sesi',
    color: '#8a8a8a',
    bgGradient: 'radial-gradient(ellipse at 50% 100%, #1a1a1a 0%, #0d0d0d 60%, #050505 100%)',
  },
  {
    id: 'cursed_city',
    name: 'Lanetli Şehir',
    seThreshold: 25000000,
    atmosphere: 'Kırmızı-siyah, yıkık binalar, çığlık ambiyansı',
    color: '#c0392b',
    bgGradient: 'radial-gradient(ellipse at 50% 100%, #2d0a08 0%, #1a0505 60%, #080202 100%)',
  },
  {
    id: 'dark_temple',
    name: 'Karanlık Tapınak',
    seThreshold: 1000000000,
    atmosphere: 'Saf siyah, rünler parlıyor, ritüel davul sesi',
    color: '#1a1a2e',
    bgGradient: 'radial-gradient(ellipse at 50% 100%, #05051a 0%, #020210 60%, #010108 100%)',
  },
  {
    id: 'death_throne',
    name: 'Ölüm Tahtı',
    seThreshold: Infinity,
    atmosphere: 'Altın & mor, kayan yıldızlar, sessizlik',
    color: '#d4af37',
    bgGradient: 'radial-gradient(ellipse at 50% 100%, #1a1000 0%, #0d0800 60%, #050300 100%)',
  },
];

export const PRESTIGE_POWERS: PrestigePower[] = [
  { id: 'bone_armor', name: 'Kemik Zırhı', cost: 1, description: 'ClickPower kalıcı +%10', purchased: false },
  { id: 'night_vision', name: 'Gece Görüşü', cost: 3, description: 'Offline birikim 8s → 12s', purchased: false },
  { id: 'soul_collector', name: 'Ruh Toplayıcı', cost: 5, description: 'Başlangıç SE x10', purchased: false },
  { id: 'vampiric_embrace', name: 'Vampirik Kucaklama', cost: 8, description: 'Vampir Ajanlar hiç uyumaz', purchased: false },
  { id: 'undying_body', name: 'Ölümsüz Beden', cost: 15, description: 'Tüm üretim kalıcı x1.25', purchased: false },
  { id: 'cursed_throne', name: 'Lanetli Taht', cost: 50, description: 'Yeni bölge açılır: Ölüm Tapınağı', purchased: false },
];

export const UPGRADES: UpgradeData[] = [
  { id: 'click_1', name: 'Güçlü Pençe', category: 'click', cost: 50, description: 'ClickPower x2', effect: 'clickPower*2', unlockCondition: 'se>=50', purchased: false },
  { id: 'click_2', name: 'Ruh Emici', category: 'click', cost: 500, description: 'ClickPower x3', effect: 'clickPower*3', unlockCondition: 'totalClicks>=100', purchased: false },
  { id: 'click_3', name: 'Lanetli Tırnak', category: 'click', cost: 5000, description: 'ClickPower x5', effect: 'clickPower*5', unlockCondition: 'se>=5000', purchased: false },
  { id: 'helper_skel_1', name: 'Kemik Güçlendirme', category: 'helper', cost: 200, description: 'İskelet İşçi SE/sn x2', effect: 'skeleton_worker*2', unlockCondition: 'skeleton_worker>=10', purchased: false },
  { id: 'helper_zombie_1', name: 'Zombi Evrim', category: 'helper', cost: 2000, description: 'Zombi Hasat Edici SE/sn x2', effect: 'zombie_harvester*2', unlockCondition: 'zombie_harvester>=10', purchased: false },
  { id: 'synergy_bone_army', name: 'Kemik Ordusu', category: 'synergy', cost: 10000, description: 'Hasat Edici üretimi x3', effect: 'zombie_harvester*3', unlockCondition: 'skeleton_worker>=10&&zombie_harvester>=5', purchased: false },
  { id: 'synergy_night_lord', name: 'Gece Efendisi', category: 'synergy', cost: 50000, description: 'Vampir Ajanlar hiç uyumaz', effect: 'vampire_no_sleep', unlockCondition: 'vampire_agent>=5&&lich_apprentice>=3', purchased: false },
  { id: 'ritual_time_1', name: 'Uzun Ritüel', category: 'ritual', cost: 2500, description: 'Ritüel süresi +5 sn', effect: 'ritualDuration+5', unlockCondition: 'se>=1000', purchased: false },
  { id: 'ritual_chance_1', name: 'Şanslı Kan', category: 'ritual', cost: 7500, description: 'Ritüel başarı şansı +%10', effect: 'ritualChance+0.1', unlockCondition: 'se>=5000', purchased: false },
];

export const FRENZY_CLICKS_REQUIRED = 50;
export const FRENZY_WINDOW_MS = 10000;
export const FRENZY_DURATION_MS = 5000;
export const FRENZY_MULTIPLIER = 3;
export const OFFLINE_MAX_SECONDS = 28800; // 8 hours
export const MILESTONE_INTERVAL = 10;
export const MILESTONE_BONUS = 0.15;
