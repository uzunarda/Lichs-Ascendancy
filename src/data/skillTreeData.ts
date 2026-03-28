import type { SkillNode } from '../types';

// ────────────────────────────────────────────────────────────────────────────
// LANET AĞACI — 4 dal × ~11 node = 44 node toplam
//  col = sütun (0=kök, 1-4=tier), row = satır içi konum
// ────────────────────────────────────────────────────────────────────────────

export const SKILL_NODES: SkillNode[] = [

  // ─────────────── ÖLÜM DALI (death) ───────────────────────────────────────

  { id: 'death_root',    name: 'Ölümün Dokunuşu',  branch: 'death', col: 0, row: 0,
    dpCost: 1,  requires: [],             description: 'Lich gücünü ilk kez hisseder.',
    effect: 'Click Power +%15' },

  { id: 'death_1a',     name: 'Kemik Çatırdaması', branch: 'death', col: 1, row: 0,
    dpCost: 2,  requires: ['death_root'], description: 'İskelet işçilerin hızı artar.',
    effect: 'İskelet İşçi üretimi +%25' },

  { id: 'death_1b',     name: 'Ruh Emme',           branch: 'death', col: 1, row: 1,
    dpCost: 2,  requires: ['death_root'], description: 'Her klikten ekstra ruh özü toplanır.',
    effect: 'Click başına +%10 SE' },

  { id: 'death_2a',     name: 'Ölüm Ritmi',         branch: 'death', col: 2, row: 0,
    dpCost: 4,  requires: ['death_1a'],   description: 'Ritüel cooldown\'u azaltır.',
    effect: 'Ritüel bekleme -%20' },

  { id: 'death_2b',     name: 'Lanetli İrade',      branch: 'death', col: 2, row: 1,
    dpCost: 4,  requires: ['death_1b'],   description: 'Click power iyice güçlenir.',
    effect: 'Click Power x1.5' },

  { id: 'death_3',      name: 'Ölüm Hâkimi',        branch: 'death', col: 3, row: 0,
    dpCost: 8,  requires: ['death_2a', 'death_2b'],
    description: 'Tüm ölüm etkilerini birleştirir ve derinleştirir.',
    effect: 'Ölüm dalı bonusları x1.3 (yığılır)' },

  { id: 'death_mastery', name: 'Ölüm Ustalığı',     branch: 'death', col: 4, row: 0,
    dpCost: 15, requires: ['death_3'],
    description: 'En yüksek ölüm gücü. Tüm üretim artar.',
    effect: 'Global SE/sn +%20' },

  // ─────────────── ÇÜRÜME DALI (decay) ─────────────────────────────────────

  { id: 'decay_root',   name: 'Çürümüş Temeller',   branch: 'decay', col: 0, row: 1,
    dpCost: 1,  requires: [],             description: 'Çürüme gücünün ilk adımı.',
    effect: 'Zombi Hasat Edici üretimi +%20' },

  { id: 'decay_1a',    name: 'Ağır Ses',             branch: 'decay', col: 1, row: 2,
    dpCost: 2,  requires: ['decay_root'], description: 'Yer altı enerjisi toparlanır.',
    effect: '+10 SE/sn pasif' },

  { id: 'decay_1b',    name: 'Zehir Sisi',           branch: 'decay', col: 1, row: 3,
    dpCost: 2,  requires: ['decay_root'], description: 'Offline birikimi iyileştirir.',
    effect: 'Offline üretim +%30' },

  { id: 'decay_2a',    name: 'Çürük Doku',           branch: 'decay', col: 2, row: 2,
    dpCost: 4,  requires: ['decay_1a'],   description: 'Tüm yardımcı birimlere çürüme katar.',
    effect: 'Tüm helper\'lar +%15 üretim' },

  { id: 'decay_2b',    name: 'Gizli Lağımlar',      branch: 'decay', col: 2, row: 3,
    dpCost: 4,  requires: ['decay_1b'],   description: 'Prestige birikimini artırır.',
    effect: 'Prestige kazanılan taş +%25' },

  { id: 'decay_3',     name: 'Çürüme Fırtınası',    branch: 'decay', col: 3, row: 2,
    dpCost: 8,  requires: ['decay_2a', 'decay_2b'],
    description: 'Çürüme enerji fırtınasına dönüşür.',
    effect: 'Helper üretimi x1.4 (kalıcı)' },

  { id: 'decay_mastery', name: 'Çürüme Ustası',     branch: 'decay', col: 4, row: 2,
    dpCost: 15, requires: ['decay_3'],
    description: 'Çürümenin zirvesi. Yapılar daha hızlı tamamlanır.',
    effect: 'İnşaat süresi -%50' },

  // ─────────────── KAOS DALI (chaos) ───────────────────────────────────────

  { id: 'chaos_root',  name: 'Kaos Kıvılcımı',      branch: 'chaos', col: 0, row: 2,
    dpCost: 1,  requires: [],             description: 'Kaos gücünün başlangıcı.',
    effect: 'Frenzy klikleri için gereken sayı -%10' },

  { id: 'chaos_1a',   name: 'Rastgele Patlama',      branch: 'chaos', col: 1, row: 4,
    dpCost: 2,  requires: ['chaos_root'], description: 'Arada bir ekstra SE patlaması yaşanır.',
    effect: 'Her 30sn\'de bir 2x üretim (3sn)' },

  { id: 'chaos_1b',   name: 'Şans Tuzağı',          branch: 'chaos', col: 1, row: 5,
    dpCost: 2,  requires: ['chaos_root'], description: 'Ritüel başarı şansı dalgalanır ama ortalama yükselir.',
    effect: 'Ritüel başarı şansı +%20' },

  { id: 'chaos_2a',   name: 'Fırtına Göz',          branch: 'chaos', col: 2, row: 4,
    dpCost: 4,  requires: ['chaos_1a'],   description: 'Frenzy modu daha uzun sürer.',
    effect: 'Frenzy süresi +%50' },

  { id: 'chaos_2b',   name: 'Lanet Zincirleri',     branch: 'chaos', col: 2, row: 5,
    dpCost: 4,  requires: ['chaos_1b'],   description: 'Bir ritüel başarısı diğerini tetikler.',
    effect: 'Ritüel zinciri: %20 şansla çift ödül' },

  { id: 'chaos_3',    name: 'Saf Kaos',             branch: 'chaos', col: 3, row: 4,
    dpCost: 8,  requires: ['chaos_2a', 'chaos_2b'],
    description: 'Kaos tamamen kontrolsüz hale gelir — ve çok güçlü.',
    effect: 'Tüm kaos efektleri x2' },

  { id: 'chaos_mastery', name: 'Kaos Tanrısı',     branch: 'chaos', col: 4, row: 4,
    dpCost: 15, requires: ['chaos_3'],
    description: 'Kaosun zirvesi. Frenzy modu sürekli aktif kalabilir.',
    effect: 'Frenzy tetikleme eşiği -%50' },

  // ─────────────── YOKLUK DALI (void) — GERİ ALINAMAZ ─────────────────────

  { id: 'void_gate',   name: 'Yokluk Kapısı',       branch: 'void', col: 0, row: 3,
    dpCost: 3,  requires: ['death_mastery'],
    description: '⚠️ GERİ ALINAMAZ. Yokluk yoluna giriş.',
    effect: 'Lanet Taşı üretimi +%50',
    voidPath: true },

  { id: 'void_1',      name: 'Yokluk Fısıltısı',    branch: 'void', col: 1, row: 6,
    dpCost: 5,  requires: ['void_gate'],
    description: 'Yokluk sana fısıldar. Tüm üretim artar ama bir bedel vardır.',
    effect: 'Global x1.5 · Frenzy riski x2',
    voidPath: true },

  { id: 'void_2',      name: 'Yokluk Lekesi',       branch: 'void', col: 2, row: 6,
    dpCost: 10, requires: ['void_1'],
    description: 'Yokluk sana işlendi. Prestige başına daha fazla güç.',
    effect: 'Prestige taşı kazanımı x2',
    voidPath: true },

  { id: 'void_3',      name: 'Yokluğun Kucağı',     branch: 'void', col: 3, row: 6,
    dpCost: 20, requires: ['void_2'],
    description: 'Artık tam anlamıyla yoklukla bütünleştin.',
    effect: 'Tüm dalların bonusları +%30 yığılır',
    voidPath: true },

  { id: 'void_apotheosis', name: 'Yokluk İlahi Güç', branch: 'void', col: 4, row: 6,
    dpCost: 50, requires: ['void_3'],
    description: '⚠️ Nihai yokluk gücü. Gereksiz bir uyarı yok — sen zaten biliyorsun.',
    effect: 'Tüm üretim x3 · Click Power x5 · Lanet Taşı x2/sn',
    voidPath: true },
];

// Dal başına renk ve isim
export const BRANCH_META: Record<string, { color: string; label: string; icon: string }> = {
  death: { color: '#c0392b', label: 'Ölüm',   icon: '💀' },
  decay: { color: '#3a7a4a', label: 'Çürüme', icon: '🧫' },
  chaos: { color: '#e67e22', label: 'Kaos',   icon: '🌀' },
  void:  { color: '#a78bfa', label: 'Yokluk', icon: '🕳️' },
};
