import type { PrestigePower } from '../types';

export const PRESTIGE_POWERS: PrestigePower[] = [
  { id: 'bone_armor', name: 'Kemik Zırhı', cost: 1, description: 'ClickPower kalıcı +%10', purchased: false },
  { id: 'night_vision', name: 'Gece Görüşü', cost: 3, description: 'Offline birikim 8s → 12s', purchased: false },
  { id: 'soul_collector', name: 'Ruh Toplayıcı', cost: 5, description: 'Başlangıç SE x10', purchased: false },
  { id: 'vampiric_embrace', name: 'Vampirik Kucaklama', cost: 8, description: 'Vampir Ajanlar hiç uyumaz', purchased: false },
  { id: 'undying_body', name: 'Ölümsüz Beden', cost: 15, description: 'Tüm üretim kalıcı x1.25', purchased: false },
  { id: 'cursed_throne', name: 'Lanetli Taht', cost: 50, description: 'Yeni bölge açılır: Ölüm Tapınağı', purchased: false },
];

export const PRESTIGE_POWERS_DC: PrestigePower[] = [
  { id: 'shadow_efficiency', name: 'Gölge Verimliliği', cost: 5, description: 'Tüm SE üretimi x2', purchased: false },
  { id: 'crystal_focus', name: 'Kristal Odaklanma', cost: 10, description: 'ClickPower x5', purchased: false },
  { id: 'eternal_ritual', name: 'Ebedi Ritüel', cost: 20, description: 'Ritüel süresi x2', purchased: false },
  { id: 'void_miner', name: 'Yokluk Madencisi', cost: 35, description: 'Void Dust (VT) kazancı x2', purchased: false },
  { id: 'dream_walker', name: 'Rüya Gezgini', cost: 50, description: 'Rüya Parçası (DP) kazancı x1.5', purchased: false },
  { id: 'dark_architecture', name: 'Karanlık Mimari', cost: 75, description: 'Bina inşa hızı x2', purchased: false },
  { id: 'monarch_authority', name: 'Hükümdar Yetkisi', cost: 100, description: 'Tüm Helper maliyetleri -%20', purchased: false },
];

export const PRESTIGE_POWERS_SD: PrestigePower[] = [
  { id: 'absolute_power', name: 'Mutlak Güç', cost: 2, description: 'Tüm üretim x10', purchased: false },
  { id: 'spark_burst', name: 'Kıvılcım Patlaması', cost: 5, description: 'ClickPower x25', purchased: false },
  { id: 'time_bender', name: 'Zaman Bükücü', cost: 10, description: 'Tick hızı +%10 (Çarpan)', purchased: false },
  { id: 'infinite_wisdom', name: 'Sonsuz Bilgelik', cost: 15, description: 'Lanet Ağacı (DP) maliyetleri -%50', purchased: false },
  { id: 'void_lord', name: 'Yokluk Efendisi', cost: 25, description: 'Boss canı -%25', purchased: false },
  { id: 'lich_legacy', name: 'Lich\'in Mirası', cost: 50, description: 'Döngü sonrası 1K Lanet Taşı ve 100 Kristal ile başla', purchased: false },
];
