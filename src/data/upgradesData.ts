import type { UpgradeData } from '../types';

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
  // --- FAZ 7: Yeni tier yükseltimleri ---
  { id: 'helper_void_1', name: 'Yokluk Harmonisi', category: 'helper', cost: 60000000, description: 'Yokluk Gezgini SE/sn x2', effect: 'void_wanderer*2', unlockCondition: 'void_wanderer>=10', purchased: false },
  { id: 'helper_abyss_1', name: 'Derin Mimar', category: 'helper', cost: 700000000, description: 'Uçurum Mimarı SE/sn x2', effect: 'abyss_architect*2', unlockCondition: 'abyss_architect>=10', purchased: false },
  { id: 'helper_god_1', name: 'Yok Olmuş Evrim', category: 'helper', cost: 10000000000, description: 'Yok Olmuş Tanrı SE/sn x2', effect: 'obliterated_god*2', unlockCondition: 'obliterated_god>=10', purchased: false },
  { id: 'synergy_void_realm', name: 'Yokluk Paktı', category: 'synergy', cost: 500000000, description: 'Gezgin + Mimar birlikte üretimi x1.5', effect: 'void_synergy*1.5', unlockCondition: 'void_wanderer>=5&&abyss_architect>=3', purchased: false },
  { id: 'passive_frozen_soul', name: 'Donmuş Ruh', category: 'passive', cost: 2000000000, description: 'Offline birikim 8s → 16s', effect: 'offlineMax*2', unlockCondition: 'se>=2000000000000', purchased: false },
  { id: 'ritual_dream_1', name: 'Rüya Ritüeli', category: 'ritual', cost: 500000000000, description: 'Ritüel başarı şansı +%25', effect: 'ritualChance+0.25', unlockCondition: 'se>=350000000000000', purchased: false },
];
