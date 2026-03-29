import { BossData } from '../types';

export const BOSSES: BossData[] = [
  {
    id: 'voice_of_void',
    name: 'Yokluğun Sesi',
    description: 'Boşluğun ilk fısıltısı. Onu susturmak için çok miktarda ruh özü gerekir.',
    maxHp: 1000000, // 1M
    timeLimit: 60,  // 1 Min
    rewards: {
      vt: 50,
      dp: 5,
    },
    unlockCondition: {
      minSe: 500000,
    },
  },
  {
    id: 'shadow_of_abyss',
    name: 'Uçurumun Gölgesi',
    description: 'Derinliklerden gelen karanlık bir yansıma.',
    maxHp: 100000000, // 100M
    timeLimit: 90,
    rewards: {
      vt: 250,
      dp: 20,
    },
    unlockCondition: {
      minSe: 50000000,
    },
  },
  {
    id: 'nightmare_sovereign',
    name: 'Kabus Hükümdarı',
    description: 'Kabusların efendisi, gerçekliği bükebilen bir güç.',
    maxHp: 5000000000, // 5B
    timeLimit: 120,
    rewards: {
      vt: 1200,
      dp: 75,
    },
    unlockCondition: {
      minSe: 2500000000,
    },
  },
  {
    id: 'eternal_void',
    name: 'Ebedi Boşluk',
    description: 'Sonun başlangıcı, her şeyi yutan sonsuz sessizlik.',
    maxHp: 1000000000000, // 1T
    timeLimit: 180,
    rewards: {
      vt: 6000,
      dp: 250,
    },
    unlockCondition: {
      minSe: 500000000000,
    },
  },
  {
    id: 'prime_void',
    name: 'İlk Yokluk',
    description: 'Her şeyin başladığı ve bittiği nokta. Gerçek final mücadelesi.',
    maxHp: 100000000000000, // 100T
    timeLimit: 300,
    rewards: {
      vt: 30000,
      dp: 1000,
    },
    unlockCondition: {
      minSe: 50000000000000,
    },
  },
];
