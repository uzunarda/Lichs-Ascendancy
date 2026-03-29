import type { RitualData } from '../types';

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
