import type { Artifact, ArtifactSet } from '../types';

export const ARTIFACT_SETS: ArtifactSet[] = [
  {
    id: 'death_legacy',
    name: 'Ölümün Mirası',
    count: 6,
    bonusDescription: 'Tüm SE üretimi x2',
    bonus: (s) => 2
  },
  {
    id: 'void_touch',
    name: 'Yokluk Dokunuşu',
    count: 6,
    bonusDescription: 'Yokluk Tozu kazanımı %50 daha fazla',
    bonus: (s) => 1.5
  },
  {
    id: 'dream_weaver',
    name: 'Rüya Dokumacı',
    count: 6,
    bonusDescription: 'Bosslardan gelen DP x2',
    bonus: (s) => 2
  },
  {
    id: 'war_master',
    name: 'Savaş Ustası',
    count: 6,
    bonusDescription: 'Bosslara verilen hasar x3',
    bonus: (s) => 3
  },
  {
    id: 'lich_greed',
    name: 'Lich\'in Açgözlülüğü',
    count: 6,
    bonusDescription: 'Lanet Taşı kazanımı x1.25',
    bonus: (s) => 1.25
  }
];

export const ARTIFACTS: Artifact[] = [
  // Common
  {
    id: 'rusty_dagger',
    name: 'Paslı Hançer',
    tier: 'common',
    description: 'Eski bir hırsızdan kalma.',
    effectDescription: 'Click Power +2',
    setId: 'war_master',
    baseEffect: (s) => 2
  },
  {
    id: 'broken_skull',
    name: 'Kırık Kafatası',
    tier: 'common',
    description: 'Sıradan bir iskeletin kalıntısı.',
    effectDescription: 'Zombiler %10 daha verimli',
    setId: 'death_legacy',
    baseEffect: (s) => 1.1
  },
  {
    id: 'dusty_tome',
    name: 'Tozlu Cilt',
    tier: 'common',
    description: 'Basit büyüler içeriyor.',
    effectDescription: 'SE per sec +50',
    setId: 'death_legacy',
    baseEffect: (s) => 50
  },

  // Rare
  {
    id: 'silver_chalice',
    name: 'Gümüş Kadeh',
    tier: 'rare',
    description: 'Ritüellerde kullanılmış.',
    effectDescription: 'Ritüel süresi +%20',
    setId: 'death_legacy',
    baseEffect: (s) => 1.2
  },
  {
    id: 'void_shard',
    name: 'Yokluk Parçası',
    tier: 'rare',
    description: 'Küçük bir boşluk enerjisi.',
    effectDescription: 'VT kazanımı +1',
    setId: 'void_touch',
    baseEffect: (s) => 1
  },

  // Epic
  {
    id: 'lich_crown_shard',
    name: 'Lich Tacı Parçası',
    tier: 'epic',
    description: 'Eski bir hükümdarın gücü.',
    effectDescription: 'Tüm üretim x1.5',
    setId: 'death_legacy',
    baseEffect: (s) => 1.5
  },
  {
    id: 'dream_lens',
    name: 'Rüya Merceği',
    tier: 'epic',
    description: 'Ötesini görmeni sağlar.',
    effectDescription: 'DP kazanımı +%25',
    setId: 'dream_weaver',
    baseEffect: (s) => 1.25
  },

  // Legendary
  {
    id: 'void_heart',
    name: 'Yokluk Kalbi',
    tier: 'legendary',
    description: 'Karanlığın atan kalbi.',
    effectDescription: 'DC kazanımı +1',
    setId: 'void_touch',
    baseEffect: (s) => 1
  },
  {
    id: 'eternal_spark',
    name: 'Ebedi Kıvılcım',
    tier: 'legendary',
    description: 'Sönmeyen bir ateş.',
    effectDescription: 'SD kazanımı +1',
    setId: 'dream_weaver',
    baseEffect: (s) => 1
  },

  // Epic
  {
    id: 'soul_reaper',
    name: 'Ruh Hasatçısı',
    tier: 'unique',
    description: 'Efsanevi tırpanın minyatürü.',
    effectDescription: 'Ölümün kendisi seninle.',
    setId: 'war_master',
    baseEffect: (s) => 10
  },

  // Additional 12
  {
    id: 'skeletal_rib',
    name: 'İskelet Kaburgası',
    tier: 'common',
    description: 'Dayanıklı görünüyor.',
    effectDescription: 'Savunma +10',
    setId: 'war_master',
    baseEffect: (s) => 10
  },
  {
    id: 'dark_candle',
    name: 'Karanlık Mum',
    tier: 'common',
    description: 'Asla sönmez.',
    effectDescription: 'Ritüel Şansı +1%',
    setId: 'death_legacy',
    baseEffect: (s) => 0.01
  },
  {
    id: 'old_coin',
    name: 'Eski Para',
    tier: 'common',
    description: 'Lanetli bir limandan.',
    effectDescription: 'SE per click +10',
    setId: 'lich_greed',
    baseEffect: (s) => 10
  },
  {
    id: 'shadow_feather',
    name: 'Gölge Tüyü',
    tier: 'rare',
    description: 'Yokluk kuşlarından düşmüş.',
    effectDescription: 'Hız +5%',
    setId: 'void_touch',
    baseEffect: (s) => 1.05
  },
  {
    id: 'vampire_fang',
    name: 'Vampir Dişi',
    tier: 'rare',
    description: 'Hala kan sızıyor.',
    effectDescription: 'Tıklama başına SE x1.1',
    setId: 'war_master',
    baseEffect: (s) => 1.1
  },
  {
    id: 'emerald_eye',
    name: 'Zümrüt Göz',
    tier: 'rare',
    description: 'Geleceği görüyor.',
    effectDescription: 'Offline kazanç +%10',
    setId: 'dream_weaver',
    baseEffect: (s) => 1.1
  },
  {
    id: 'executioner_axe',
    name: 'İnfazcı Baltası',
    tier: 'epic',
    description: 'Çok can yakmıştı.',
    effectDescription: 'Boss Hasarı +%25',
    setId: 'war_master',
    baseEffect: (s) => 1.25
  },
  {
    id: 'void_robe',
    name: 'Yokluk Cübbesi',
    tier: 'epic',
    description: 'Dokunulmaz kılar.',
    effectDescription: 'VT maliyetleri -%10',
    setId: 'void_touch',
    baseEffect: (s) => 0.9
  },
  {
    id: 'skeleton_key',
    name: 'Maymuncuk Şehir',
    tier: 'epic',
    description: 'Tüm kapıları açar.',
    effectDescription: 'Hane inşası -%15 süre',
    setId: 'lich_greed',
    baseEffect: (s) => 0.85
  },
  {
    id: 'blood_ruby',
    name: 'Kan Yakutu',
    tier: 'legendary',
    description: 'Ritüellerin can damarı.',
    effectDescription: 'Ritüel çarpanı x1.2',
    setId: 'death_legacy',
    baseEffect: (s) => 1.2
  },
  {
    id: 'rift_engine',
    name: 'Çatlak Motoru',
    tier: 'legendary',
    description: 'Boyutları zorlar.',
    effectDescription: 'Tick hızı +%5',
    setId: 'void_touch',
    baseEffect: (s) => 1.05
  },
  {
    id: 'master_amulet',
    name: 'Efendi Muskası',
    tier: 'legendary',
    description: 'Tek bir emir yeterli.',
    effectDescription: 'Helpers x1.2 üretim',
    setId: 'lich_greed',
    baseEffect: (s) => 1.2
  }
];
