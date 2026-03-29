import { HELPERS, FRENZY_MULTIPLIER, REGIONS } from '../../data/gameData';
import { useArtifactStore } from '../artifactStore';
import { useBuildingStore } from '../buildingStore';
import { calcMilestoneBonus } from '../../systems/numberUtils';
import type { UpgradeData, PrestigePower } from '../../types';
import type { GameState, HelperCounts } from './types';

/**
 * Saniyelik Ruh Özü (SE) üretimini hesaplar.
 * Tüm birimler, yükseltmeler, prestij güçleri ve artifaktları hesaba katar.
 */
export function calcSEperSec(
    helpers: HelperCounts, 
    upgrades: UpgradeData[], 
    prestigePowers: PrestigePower[], 
    state: GameState
): number {
  let total = 0;
  
  const artifactStore = useArtifactStore.getState();
  const flatBonus = artifactStore.getFlatSEBonus();
  const buildBonus = useBuildingStore.getState().totalSEBonus;

  // Bölge Bonusu (Region Bonus)
  const currentRegion = REGIONS[state.currentRegionIndex];
  let regionMult = 1;
  if (currentRegion?.bonus && (currentRegion.bonus.type === 'production' || currentRegion.bonus.type === 'all')) {
    regionMult = currentRegion.bonus.value;
  }

  // Abyss Architect (Tier 8) sayısına göre Milestone hızlandırması
  const architectCount = helpers['abyss_architect'] ?? 0;

  // Zombie Harvester (Tier 2) Çevresel Hız Bonusu: Harvester başına tüm üretime +%1
  const harvesterCount = helpers['zombie_harvester'] ?? 0;
  const harvesterMult = 1 + (harvesterCount * 0.01);

  // Her bir yardımcı birim tipini dön ve üretimini hesapla
  for (const helper of HELPERS) {
    const count = helpers[helper.id] ?? 0;
    if (count === 0) continue;

    // Temel Üretim * Adet * Gelişim Bonusu (Milestone)
    let rate = helper.baseSEperSec * count * calcMilestoneBonus(count, architectCount);

    // Birim bazlı yükseltmeler (örnek: x2 çarpanlar)
    const helperUpgrade = upgrades.find(u => u.effect === `${helper.id}*2` && u.purchased);
    if (helperUpgrade) rate *= 2;

    // Artifaktlardan gelen birim çarpanı
    rate *= artifactStore.getHelperMult(helper.id);

    // Sinerjiler
    if (helper.id === 'zombie_harvester') {
      const boneArmy = upgrades.find(u => u.id === 'synergy_bone_army' && u.purchased);
      if (boneArmy) rate *= 3;
    }
    
    // Vampir Ajan uyuma riski (%10 şansla %50 üretim kaybı)
    if (helper.id === 'vampire_agent') {
      const noSleep = upgrades.find(u => u.id === 'synergy_night_lord' && u.purchased) ||
                      prestigePowers.find(u => u.id === 'vampiric_embrace' && u.purchased);
      if (!noSleep && Math.random() < 0.10) {
        rate *= 0.5;
      }
    }

    total += rate;
  }

  // Sabit bonusları ekle ve Harvester çarpanını uygula
  total += (flatBonus + buildBonus) * harvesterMult;

  // L1 Prestij Güçleri (Undying Body)
  const undying = prestigePowers.find(p => p.id === 'undying_body' && p.purchased);
  if (undying) total *= 1.25;

  // L2 Prestij Güçleri (Shadow Efficiency)
  const hasShadowEff = state.prestigePowersDC?.find(p => p.id === 'shadow_efficiency' && p.purchased);
  if (hasShadowEff) total *= 2;

  // L3 Prestij Güçleri (Absolute Power)
  const hasAbsPower = state.prestigePowersSD?.find(p => p.id === 'absolute_power' && p.purchased);
  if (hasAbsPower) total *= 10;

  // Yok Olmuş Tanrı (Tier 9) Periyodik Üretim Patlaması (x5)
  const isObliteratedBurst = Date.now() < state.obliteratedActiveUntil;
  if (isObliteratedBurst) total *= 5;

  // Bölge Çarpanı Uygula
  total *= regionMult;

  // Küresel Artifakt Çarpanı
  total *= artifactStore.getGlobalSEMult();

  return total;
}

/**
 * Tek bir tıklamanın değerini hesaplar.
 */
export function calcClickValue(
    basePower: number, 
    upgrades: UpgradeData[], 
    prestigePowers: PrestigePower[], 
    ritualMult: number, 
    isFrenzy: boolean, 
    clickMult: number, 
    helpers: HelperCounts, 
    totalCPS: number, 
    state: GameState
): number {
  let powerMult = 1;
  const artifactStore = useArtifactStore.getState();

  // Bölge Bonusu (Region Bonus)
  const currentRegion = REGIONS[state.currentRegionIndex];
  let regionClickMult = 1;
  if (currentRegion?.bonus && (currentRegion.bonus.type === 'click' || currentRegion.bonus.type === 'all')) {
    regionClickMult = currentRegion.bonus.value;
  }

  // Tıklama Yükseltmeleri (x2, x3, x5)
  upgrades.forEach(u => {
    if (u.purchased && u.category === 'click') {
      if (u.effect === 'clickPower*2') powerMult *= 2;
      if (u.effect === 'clickPower*3') powerMult *= 3;
      if (u.effect === 'clickPower*5') powerMult *= 5;
    }
  });

  // L1 Prestij Güçleri (Bone Armor)
  const boneArmor = prestigePowers.find(p => p.id === 'bone_armor' && p.purchased);
  if (boneArmor) powerMult *= 1.1;

  // L2 Prestij Güçleri (Crystal Focus)
  const crystalFocus = state.prestigePowersDC?.find(p => p.id === 'crystal_focus' && p.purchased);
  if (crystalFocus) powerMult *= 5;

  // L3 Prestij Güçleri (Spark Burst)
  const sparkBurst = state.prestigePowersSD?.find(p => p.id === 'spark_burst' && p.purchased);
  if (sparkBurst) powerMult *= 25; 

  // Bina ve Artifakt çarpanları
  powerMult *= useBuildingStore.getState().totalClickBonus;
  powerMult *= artifactStore.getClickPowerMult();

  // Frenzy, Ritüel ve Bölge çarpanları
  const frenzyMult = isFrenzy ? FRENZY_MULTIPLIER : 1;
  const totalBasePower = basePower * powerMult * frenzyMult * ritualMult * clickMult * regionClickMult;

  // CPS'e (Saniyelik Üretim) dayalı ek güçler
  let cpsAddition = 0;
  HELPERS.forEach(h => {
    const count = helpers[h.id] || 0;
    if (count > 0) {
      // Bazı birimler doğrudan tıklama gücü verir
      if (h.baseClickPower) cpsAddition += h.baseClickPower * count;
      // Bazı birimler toplam CPS'in yüzdesi kadar tıklama gücü ekler
      if (h.cpsMultiplier) cpsAddition += totalCPS * (h.cpsMultiplier * count);
    }
  });

  return totalBasePower + cpsAddition;
}
