import { create } from 'zustand';
import { 
  HELPERS, 
  UPGRADES, 
  PRESTIGE_POWERS, 
  PRESTIGE_POWERS_DC, 
  PRESTIGE_POWERS_SD, 
  OFFLINE_MAX_SECONDS, 
  FRENZY_CLICKS_REQUIRED, 
  FRENZY_WINDOW_MS, 
  FRENZY_DURATION_MS, 
  FRENZY_MULTIPLIER, 
  REGIONS 
} from '../data/gameData';
import { BOSSES } from '../data/bossData';
import { useSkillTreeStore } from './skillTreeStore';
import { useArtifactStore } from './artifactStore';
import { useBuildingStore } from './buildingStore';
import { 
  calcHelperCost, 
  calcCurseStones, 
  calcDarkCrystals, 
  calcDissolutionSparks, 
  calcMilestoneBonus 
} from '../systems/numberUtils';
import { ARTIFACTS } from '../data/artifactData';

// Modüler dosyalarımızdan içe aktarıyoruz (Importing from modular files)
import { GameState, HelperCounts, AppNotification, RitualState } from './game/types';
export type { GameState, HelperCounts, AppNotification, RitualState };
import { getInitialState, SAVE_KEY } from './game/initialState';
import { calcSEperSec, calcClickValue } from './game/calculations';

/**
 * Lich's Ascendancy Ana Oyun Deposu (Main Game Store)
 * Tüm kaynak yönetimi ve oyun döngüsü burada gerçekleşir.
 */
export const useGameStore = create<GameState>((set, get) => ({
  // Başlangıç durumunu yayıyoruz (Spreading initial state)
  ...getInitialState(),

  /**
   * Oyuncu tıkladığında gerçekleşen işlemler.
   * SE üretimini hesaplar, Frenzy durumunu takip eder ve Boss'a hasar verir.
   */
  click: () => {
    const state = get();
    const now = Date.now();

    // 1. Frenzy (Çılgınlık) takibi: Hızlı tıklamalar Frenzy modunu açar
    const recentClicks = [...state.frenzy.clickTimestamps.filter(t => now - t < FRENZY_WINDOW_MS), now];
    let frenzyActive = state.frenzy.active;
    let frenzyEndsAt = state.frenzy.endsAt;

    if (!frenzyActive && recentClicks.length >= FRENZY_CLICKS_REQUIRED) {
      frenzyActive = true;
      frenzyEndsAt = now + FRENZY_DURATION_MS;
    }
    if (frenzyActive && now > frenzyEndsAt) {
      frenzyActive = false;
    }

    const isFrenzy = frenzyActive && now <= frenzyEndsAt;
    
    // 2. Ritüel ve Tıklama Gücü Çarpanlarını belirle
    const ritualMult = state.ritual.activeMultiplier > 1 && Date.now() < state.ritual.activeUntil
      ? state.ritual.activeMultiplier : 1;
    
    const clickMult = useSkillTreeStore.getState().bonuses.clickMult;
    const totalCPS = calcSEperSec(state.helpers, state.upgrades, state.prestigePowers, state);
    
    // 3. Ne kadar SE kazanıldığını hesapla
    const gained = calcClickValue(
      state.clickPower, 
      state.upgrades, 
      state.prestigePowers, 
      ritualMult, 
      isFrenzy, 
      clickMult, 
      state.helpers, 
      totalCPS, 
      state
    );

    // 4. Boss dövüşü aktifse hasar ver
    if (state.bossFight.activeBossId) {
      get().attackBoss();
    }

    // 5. Durumu (state) güncelle
    set(s => ({
      se: s.se + gained,
      totalSE: s.totalSE + gained,
      totalClicks: s.totalClicks + 1,
      frenzy: {
        active: frenzyActive,
        clickTimestamps: recentClicks.slice(-100), // Son 100 tıklamayı tut
        endsAt: frenzyEndsAt,
      },
    }));
  },

  /**
   * Yardımcı birim (Helper) satın alma işlemi.
   */
  buyHelper: (helperId: string) => {
    const state = get();
    const helperData = HELPERS.find(h => h.id === helperId);
    if (!helperData) return;

    const currentCount = state.helpers[helperId] ?? 0;
    
    // Monarch Authority (L2 Prestij): %20 indirim sağlar
    const hasMonarch = state.prestigePowersDC.find(p => p.id === 'monarch_authority' && p.purchased);
    let discount = hasMonarch ? 0.8 : 1;

    // Bölge Bonusu: Bazı bölgeler birim maliyetini düşürür
    const currentRegion = REGIONS[state.currentRegionIndex];
    if (currentRegion?.bonus?.type === 'cost') {
      discount *= currentRegion.bonus.value;
    }
    
    const cost = Math.floor(calcHelperCost(helperData.baseCost, currentCount) * discount);

    if (state.se < cost) return;

    // Nightmare beast (Tier 5): Satın alındığında otomatik Küçük Ritüel başlatır
    if (helperId === 'nightmare_beast') {
      const ritualData = { mult: 1.5, duration: 10000 };
      const durationMult = useArtifactStore.getState().getRitualDurationMult();
      
      set(s => ({
        ritual: {
          ...s.ritual,
          activeMultiplier: ritualData.mult * useArtifactStore.getState().getRitualMult(),
          activeUntil: Date.now() + ritualData.duration * durationMult,
        },
      }));
      get().addNotification('Kabus Canavarı Ritüel başlattı!', 'success');
    }

    const newCount = currentCount + 1;
    
    // Milestones: Her 10 birimde bir başarım bildirimi
    if (newCount % 10 === 0) {
      get().addNotification(`Başarım: ${helperData.name} x${newCount} ulaştı. (Çarpan +%15)`, 'success');
    }

    set(s => ({
      se: s.se - cost,
      helpers: { ...s.helpers, [helperId]: newCount },
    }));
  },

  /**
   * Kalıcı geliştirmeleri (Upgrades) satın alma işlemi.
   */
  buyUpgrade: (upgradeId: string) => {
    const state = get();
    const upgrade = state.upgrades.find(u => u.id === upgradeId);
    if (!upgrade || upgrade.purchased || state.se < upgrade.cost) return;

    set(s => ({
      se: s.se - upgrade.cost,
      upgrades: s.upgrades.map(u => u.id === upgradeId ? { ...u, purchased: true } : u),
    }));
  },

  /**
   * Farklı türdeki ritüelleri gerçekleştirme işlemi.
   */
  performRitual: (ritualId: string) => {
    const state = get();
    const rituals: Record<string, { cost: number; chance: number; mult: number; duration: number; clickBonus?: number }> = {
      small_ritual:    { cost: 100,   chance: 0.8,  mult: 1.5,  duration: 10000 },
      medium_ritual:   { cost: 1000,  chance: 0.6,  mult: 3,    duration: 15000 },
      large_ritual:    { cost: 10000, chance: 0.4,  mult: 1,    duration: 0, clickBonus: 0.05 },
      nightmare_ritual:{ cost: 0,     chance: 0.25, mult: 1,    duration: 0 },
    };
    const ritualData = rituals[ritualId];

    if (!ritualData || state.se < ritualData.cost) {
      return { success: false, reward: 'Yetersiz Ruh Özü' };
    }

    // Başarı şansı bonusları (Artifaktlar ve yardımcı birimler)
    const lichBonus = (state.helpers['lich_apprentice'] ?? 0) * 0.05;
    const artifactChance = useArtifactStore.getState().getRitualChanceBonus();
    const chanceUpgrade = state.upgrades.find(u => u.effect === 'ritualChance+0.1' && u.purchased) ? 0.1 : 0;
    
    const successChance = Math.min(0.95, ritualData.chance + lichBonus + chanceUpgrade + artifactChance);
    const success = Math.random() < successChance;

    if (success) {
      if (ritualId === 'large_ritual') {
        // Büyük ritüel kalıcı tıklama gücü verir
        set(s => ({
          se: s.se - ritualData.cost,
          clickPower: s.clickPower * 1.05,
        }));
        return { success: true, reward: 'ClickPower kalıcı +%5!' };
      } else {
        // Diğer ritüeller geçici üretim çarpanı verir
        const durationBonus = state.upgrades.find(u => u.effect === 'ritualDuration+5' && u.purchased) ? 5000 : 0;
        const hasEternal = state.prestigePowersDC.find(p => p.id === 'eternal_ritual' && p.purchased);
        const durationMult = (hasEternal ? 2 : 1) * useArtifactStore.getState().getRitualDurationMult();
        
        set(s => ({
          se: s.se - ritualData.cost,
          ritual: {
            ...s.ritual,
            activeMultiplier: ritualData.mult * useArtifactStore.getState().getRitualMult(),
            activeUntil: Date.now() + (ritualData.duration + durationBonus) * durationMult,
          },
        }));
        return { success: true, reward: `SE x${ritualData.mult} aktif!` };
      }
    } else {
      set(s => ({ se: s.se - ritualData.cost }));
      return { success: false, reward: 'Ritüel başarısız...' };
    }
  },

  /**
   * L1 Prestij (Lanetli Taşlar) işlemi.
   */
  prestige: () => {
    const state = get();
    const earned = calcCurseStones(state.totalSE);
    if (earned === 0) return;

    const darkDemigodCount = state.helpers['dark_demigod'] ?? 0;
    const bonus = darkDemigodCount > 0 ? Math.floor(earned * 0.05) : 0;
    const initial = getInitialState();
    const soulCollector = state.prestigePowers.find(p => p.id === 'soul_collector' && p.purchased);

    set({
      ...initial,
      curseStones: state.curseStones + earned + bonus,
      prestigeCount: state.prestigeCount + 1,
      prestigePowers: state.prestigePowers,
      se: soulCollector ? 10 : 0,
      lastSaveTime: Date.now(),
    });
  },

  buyPrestigePower: (powerId) => {
    const state = get();
    const power = state.prestigePowers.find(p => p.id === powerId);
    if (!power || power.purchased || state.curseStones < power.cost) return;

    set(s => ({
      curseStones: s.curseStones - power.cost,
      prestigePowers: s.prestigePowers.map(p => p.id === powerId ? { ...p, purchased: true } : p),
    }));
  },

  /**
   * L2 Prestij (Karanlık Kristaller) işlemi.
   */
  prestigeDC: () => {
    const state = get();
    const earned = calcDarkCrystals(state.curseStones);
    if (earned === 0) return;

    const initial = getInitialState();
    const hasLegacy = state.prestigePowersSD.find(p => p.id === 'lich_legacy' && p.purchased);

    set({
      ...initial,
      dc: state.dc + earned + useArtifactStore.getState().getPrestigeCurrencyBonus('dc'),
      prestigeCountDC: state.prestigeCountDC + 1,
      prestigePowersDC: state.prestigePowersDC,
      prestigePowersSD: state.prestigePowersSD,
      sd: state.sd,
      curseStones: hasLegacy ? 1000 : 0,
      lastSaveTime: Date.now(),
    });
  },

  buyPrestigePowerDC: (powerId) => {
    const state = get();
    const power = state.prestigePowersDC.find(p => p.id === powerId);
    if (!power || power.purchased || state.dc < power.cost) return;

    set(s => ({
      dc: s.dc - power.cost,
      prestigePowersDC: s.prestigePowersDC.map(p => p.id === powerId ? { ...p, purchased: true } : p),
    }));
  },

  /**
   * L3 Prestij (Çözülme Kıvılcımları) işlemi.
   */
  prestigeSD: () => {
    const state = get();
    const earned = calcDissolutionSparks(state.dc);
    if (earned === 0) return;

    const initial = getInitialState();
    const hasLegacy = state.prestigePowersSD.find(p => p.id === 'lich_legacy' && p.purchased);

    set({
      ...initial,
      sd: state.sd + earned + useArtifactStore.getState().getPrestigeCurrencyBonus('sd'),
      prestigeCountSD: state.prestigeCountSD + 1,
      prestigePowersSD: state.prestigePowersSD,
      curseStones: hasLegacy ? 1000 : 0,
      dc: hasLegacy ? 100 : 0,
      lastSaveTime: Date.now(),
    });
  },

  buyPrestigePowerSD: (powerId) => {
    const state = get();
    const power = state.prestigePowersSD.find(p => p.id === powerId);
    if (!power || power.purchased || state.sd < power.cost) return;

    set(s => ({
      sd: s.sd - power.cost,
      prestigePowersSD: s.prestigePowersSD.map(p => p.id === powerId ? { ...p, purchased: true } : p),
    }));
  },

  /**
   * Oyunun ana saniye döngüsü (Tick).
   * Kaynak üretimini her saniye günceller.
   */
  tick: (deltaSeconds) => {
    const state = get();
    
    // Zaman Çarpanları
    const hasTimeBender = state.prestigePowersSD.find(p => p.id === 'time_bender' && p.purchased);
    const tickHaste = useArtifactStore.getState().getTickHaste();
    const effectiveDelta = deltaSeconds * (hasTimeBender ? 1.1 : 1.0) * (1 + tickHaste);

    // Saniyelik üretim hesaplama
    const sePerSec = calcSEperSec(state.helpers, state.upgrades, state.prestigePowers, state);
    const now = Date.now();
    const ritualMult = state.ritual.activeMultiplier > 1 && now < state.ritual.activeUntil ? state.ritual.activeMultiplier : 1;

    // Frenzy kontrolü
    let frenzy = state.frenzy;
    if (frenzy.active && now > frenzy.endsAt) frenzy = { ...frenzy, active: false };
    const frenzyMult = frenzy.active ? FRENZY_MULTIPLIER : 1;

    // Kazanılan miktar
    const gained = sePerSec * effectiveDelta * ritualMult * frenzyMult;

    // Ritüel sayacı
    let ritualCountdown = state.ritual.countdown - effectiveDelta;
    let ritualActive = state.ritual.isActive;
    if (ritualCountdown <= 0) {
      ritualCountdown = 60 + Math.random() * 60; // 60-120 saniye arası
      ritualActive = true;
    }

    // Yokluk Gezgini (Tier 7): Her tick'te %0.5 şansla bonus SE patlaması
    const wandererCount = state.helpers['void_wanderer'] ?? 0;
    let wandererBonusSE = 0;
    if (wandererCount > 0 && Math.random() < 0.005) {
      wandererBonusSE = sePerSec * 5; // 5 saniyelik üretim
      get().addNotification('Yokluk Gezgini boşluktan enerji çekti!', 'info');
    }

    // Yok Olmuş Tanrı (Tier 9): Her 100 saniyede bir 10 saniyelik patlama (x5)
    const godCount = state.helpers['obliterated_god'] ?? 0;
    let newObliteratedTimer = state.obliteratedTimer;
    let newObliteratedActiveUntil = state.obliteratedActiveUntil;
    if (godCount > 0) {
      newObliteratedTimer += effectiveDelta;
      if (newObliteratedTimer >= 100) {
        newObliteratedTimer = 0;
        newObliteratedActiveUntil = Date.now() + 10000;
        get().addNotification('Yok Olmuş Tanrı kükrüyor! Üretim x5!', 'success');
      }
    }

    // Dünya (Bölge) ilerlemesi
    const newTotalSE = state.totalSE + gained + wandererBonusSE;
    let regionIndex = 0;
    for (let i = REGIONS.length - 1; i >= 0; i--) {
      if (newTotalSE >= REGIONS[i].seThreshold) { regionIndex = i; break; }
    }

    // Kaynakları ve zamanlayıcıları güncelle
    set(s => ({
      se: s.se + gained + wandererBonusSE,
      totalSE: s.totalSE + gained + wandererBonusSE,
      frenzy,
      obliteratedTimer: newObliteratedTimer,
      obliteratedActiveUntil: newObliteratedActiveUntil,
      ritual: { ...s.ritual, countdown: ritualCountdown, isActive: ritualActive },
      currentRegionIndex: regionIndex,
    }));

    // Boss Savaşı durumunu güncelle
    if (state.bossFight.activeBossId && !state.bossFight.isVictory && !state.bossFight.isDefeat) {
      const bossDamage = gained;
      const newHp = Math.max(0, state.bossFight.currentHp - bossDamage);
      const newTimeLeft = state.bossFight.timeLeft - effectiveDelta;
      if (newHp <= 0) {
        set(s => ({ bossFight: { ...s.bossFight, currentHp: 0, isVictory: true } }));
        setTimeout(() => get().endBossFight(), 2000);
      } else if (newTimeLeft <= 0) {
        set(s => ({ bossFight: { ...s.bossFight, timeLeft: 0, isDefeat: true } }));
        setTimeout(() => get().endBossFight(), 2000);
      } else {
        set(s => ({ bossFight: { ...s.bossFight, currentHp: newHp, timeLeft: newTimeLeft } }));
      }
    }
  },

  /**
   * Oyunu yerel depolamaya (Local Storage) kaydeder.
   */
  saveGame: () => {
    const state = get();
    const saveData = {
      se: state.se, totalSE: state.totalSE, curseStones: state.curseStones,
      dc: state.dc, sd: state.sd, vt: state.vt, clickPower: state.clickPower,
      totalClicks: state.totalClicks, helpers: state.helpers, upgrades: state.upgrades,
      prestigePowers: state.prestigePowers, prestigePowersDC: state.prestigePowersDC,
      prestigePowersSD: state.prestigePowersSD, prestigeCount: state.prestigeCount,
      prestigeCountDC: state.prestigeCountDC, prestigeCountSD: state.prestigeCountSD,
      currentRegionIndex: state.currentRegionIndex, 
      artifacts: useArtifactStore.getState().owned, savedAt: Date.now(),
    };
    
    // Doğrulama Hash'i oluştur (Cheat prevention)
    const jsonStr = JSON.stringify(saveData);
    let hash = 0;
    for (let i = 0; i < jsonStr.length; i++) {
      hash = ((hash << 5) - hash) + jsonStr.charCodeAt(i);
      hash |= 0;
    }
    
    localStorage.setItem(SAVE_KEY, JSON.stringify({ data: saveData, hash }));
    set({ lastSaveTime: Date.now() });
  },

  /**
   * Oyunu yerel depolamadan yükler.
   */
  loadSave: () => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      let data = parsed.data || parsed;
      
      set({
        se: data.se ?? 0, totalSE: data.totalSE ?? 0, curseStones: data.curseStones ?? 0,
        dc: data.dc ?? 0, sd: data.sd ?? 0, vt: data.vt ?? 0, clickPower: data.clickPower ?? 1,
        totalClicks: data.totalClicks ?? 0, helpers: data.helpers ?? {},
        upgrades: data.upgrades ?? UPGRADES.map(u => ({ ...u })),
        prestigePowers: data.prestigePowers ?? PRESTIGE_POWERS.map(p => ({ ...p })),
        prestigePowersDC: data.prestigePowersDC ?? PRESTIGE_POWERS_DC.map(p => ({ ...p })),
        prestigePowersSD: data.prestigePowersSD ?? PRESTIGE_POWERS_SD.map(p => ({ ...p })),
        prestigeCount: data.prestigeCount ?? 0, prestigeCountDC: data.prestigeCountDC ?? 0,
        prestigeCountSD: data.prestigeCountSD ?? 0, currentRegionIndex: data.currentRegionIndex ?? 0,
        artifacts: data.artifacts ?? [], lastSaveTime: data.savedAt ?? Date.now(),
      });
      // Artifakt deposunu ayrıca yükle
      if (data.artifacts) useArtifactStore.getState().loadArtifacts(data.artifacts);
    } catch (e) {
      console.error('Save load failed:', e);
    }
  },

  /**
   * Çevrimdışı (Offline) üretimi işler.
   */
  processOffline: () => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const data = parsed.data || parsed;
      const savedAt = data.savedAt ?? Date.now();
      
      // Gece Görüşü yeteneği çevrimdışı süreyi uzatır
      const hasNightVision = data.prestigePowers?.find((p: any) => p.id === 'night_vision' && p.purchased);
      const maxSeconds = hasNightVision ? OFFLINE_MAX_SECONDS * 1.5 : OFFLINE_MAX_SECONDS;
      
      const offlineSeconds = Math.min((Date.now() - savedAt) / 1000, maxSeconds);
      if (offlineSeconds < 10) return;

      const state = get();
      const sePerSec = calcSEperSec(state.helpers, state.upgrades, state.prestigePowers, state);
      const offlineMult = useArtifactStore.getState().getOfflineMult();
      const earned = sePerSec * offlineSeconds * offlineMult;
      
      set(s => ({ se: s.se + earned, totalSE: s.totalSE + earned }));
    } catch (e) {
      console.error('Offline process failed:', e);
    }
  },

  /**
   * Bildirim ekleme ve otomatik silme.
   */
  addNotification: (message, type = 'info') => {
    // notifId statik olduğu için içe aktarılan initial'dan değil, globals'den yönetilmeli (basitleştirildi)
    const id = Date.now(); 
    set(s => ({ notifications: [...s.notifications, { id, message, type }] }));
    setTimeout(() => get().removeNotification(id), 4000);
  },

  removeNotification: (id) => set(s => ({ notifications: s.notifications.filter(n => n.id !== id) })),

  /**
   * Tüm ilerlemeyi sıfırlar (Tehlikeli!).
   */
  resetGame: () => { localStorage.removeItem(SAVE_KEY); set(getInitialState()); },

  // --- Hızlı Değer Ekleme API'ları ---
  addSE: (amount) => set(s => ({ se: s.se + amount, totalSE: s.totalSE + amount })),
  addCS: (amount) => set(s => ({ curseStones: s.curseStones + amount })),
  addVT: (amount) => set(s => ({ vt: s.vt + amount })),

  /**
   * Boss dövüşünü başlatır.
   */
  startBossFight: (bossId) => {
    const state = get();
    const boss = BOSSES.find(b => b.id === bossId);
    if (!boss) return;
    
    // Void Lord (L3) %25 HP indirimi sağlar
    const hasVoidLord = state.prestigePowersSD.find(p => p.id === 'void_lord' && p.purchased);
    const bossHp = hasVoidLord ? boss.maxHp * 0.75 : boss.maxHp;
    
    set({ bossFight: { activeBossId: bossId, currentHp: bossHp, timeLeft: boss.timeLimit, isVictory: false, isDefeat: false } });
  },

  /**
   * Boss'a doğrudan tıklayarak saldırma.
   */
  attackBoss: () => {
    const state = get();
    if (!state.bossFight.activeBossId) return;
    const now = Date.now();
    const isFrenzy = state.frenzy.active && now <= state.frenzy.endsAt;
    const ritualMult = state.ritual.activeMultiplier > 1 && now < state.ritual.activeUntil ? state.ritual.activeMultiplier : 1;
    const clickMult = useSkillTreeStore.getState().bonuses.clickMult;
    const totalCPS = calcSEperSec(state.helpers, state.upgrades, state.prestigePowers, state);
    const damage = calcClickValue(state.clickPower, state.upgrades, state.prestigePowers, ritualMult, isFrenzy, clickMult, state.helpers, totalCPS, state);
    
    set(s => ({ bossFight: { ...s.bossFight, currentHp: Math.max(0, s.bossFight.currentHp - damage) } }));
    
    if (get().bossFight.currentHp <= 0 && !get().bossFight.isVictory) {
      set(s => ({ bossFight: { ...s.bossFight, isVictory: true } }));
      setTimeout(() => get().endBossFight(), 2000);
    }
  },

  /**
   * Boss dövüşü bittiğinde ödülleri dağıtma.
   */
  endBossFight: () => {
    const state = get();
    const { activeBossId, isVictory } = state.bossFight;
    if (!activeBossId) return;
    
    if (isVictory) {
      const boss = BOSSES.find(b => b.id === activeBossId);
      if (boss) {
        get().addNotification(`${boss.name} mağlup edildi!`, 'success');
        const hasMiner = state.prestigePowersDC.find(p => p.id === 'void_miner' && p.purchased);
        const hasWalker = state.prestigePowersDC.find(p => p.id === 'dream_walker' && p.purchased);
        set(s => ({ vt: s.vt + boss.rewards.vt * (hasMiner ? 2 : 1) }));
        useSkillTreeStore.getState().addDP(boss.rewards.dp * (hasWalker ? 1.5 : 1));
        
        // Artifakt Düşme Şansı (%20)
        if (Math.random() < 0.20) {
          const possible = ARTIFACTS.filter(a => !useArtifactStore.getState().owned.includes(a.id));
          if (possible.length > 0) {
            const dropped = possible[Math.floor(Math.random() * possible.length)];
            useArtifactStore.getState().addArtifact(dropped.id);
            get().addNotification(`Artifakt Bulundu: ${dropped.name}!`, 'success');
          }
        }
      }
    } else get().addNotification('Boss savaşı başarısız...', 'warning');
    
    set({ bossFight: { activeBossId: null, currentHp: 0, timeLeft: 0, isVictory: false, isDefeat: false } });
  },
}));

// ── Dışa Aktarılan Yardımcı Fonksiyonlar (UI İçin) ──────────────────────────

/** Mevcut toplam saniyelik üretimi döndürür */
export function calcCurrentSEperSec(): number {
  const state = useGameStore.getState();
  return calcSEperSec(state.helpers, state.upgrades, state.prestigePowers, state);
}

/** Mevcut tek tık değerini döndürür */
export function calcCurrentClickValue(): number {
  const state = useGameStore.getState();
  const now = Date.now();
  const isFrenzy = state.frenzy.active && now <= state.frenzy.endsAt;
  const ritualMult = state.ritual.activeMultiplier > 1 && now < state.ritual.activeUntil ? state.ritual.activeMultiplier : 1;
  const clickMult = useSkillTreeStore.getState().bonuses.clickMult;
  const totalCPS = calcSEperSec(state.helpers, state.upgrades, state.prestigePowers, state);
  return calcClickValue(state.clickPower, state.upgrades, state.prestigePowers, ritualMult, isFrenzy, clickMult, state.helpers, totalCPS, state);
}

/** Belirli bir birimin toplam üretim katkısını hesaplar */
export function calcHelperContribution(helperId: string): number {
  const state = useGameStore.getState();
  const count = state.helpers[helperId] ?? 0;
  if (count === 0) return 0;
  
  const helper = HELPERS.find(h => h.id === helperId);
  if (!helper) return 0;
  
  const architectCount = state.helpers['abyss_architect'] ?? 0;
  let rate = helper.baseSEperSec * count * calcMilestoneBonus(count, architectCount);
  const helperUpgrade = state.upgrades.find(u => u.effect === `${helper.id}*2` && u.purchased);
  if (helperUpgrade) rate *= 2;
  
  const artifactStore = useArtifactStore.getState();
  rate *= artifactStore.getHelperMult(helper.id);
  
  if (helper.id === 'zombie_harvester') {
    const boneArmy = state.upgrades.find(u => u.id === 'synergy_bone_army' && u.purchased);
    if (boneArmy) rate *= 3;
  }
  
  const undying = state.prestigePowers.find(p => p.id === 'undying_body' && p.purchased);
  if (undying) rate *= 1.25;
  
  const hasShadowEff = state.prestigePowersDC?.find(p => p.id === 'shadow_efficiency' && p.purchased);
  if (hasShadowEff) rate *= 2;
  
  const hasAbsPower = state.prestigePowersSD?.find(p => p.id === 'absolute_power' && p.purchased);
  if (hasAbsPower) rate *= 10;
  
  const isObliteratedBurst = Date.now() < state.obliteratedActiveUntil;
  if (isObliteratedBurst) rate *= 5;
  
  rate *= artifactStore.getGlobalSEMult();
  return rate;
}
