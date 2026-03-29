import type { RegionData } from '../types';

export const REGIONS: RegionData[] = [
  {
    id: 'graveyard',
    name: 'Çürük Mezarlık',
    seThreshold: 0,
    atmosphere: 'Soluk yeşil, sis efektleri, baykuş sesi',
    color: '#4a7c59',
    bgGradient: 'radial-gradient(ellipse at 50% 100%, #0d1f14 0%, #050d08 60%, #020508 100%)',
    bonus: { type: 'production', value: 1.05, description: 'Mezarlık Sessizliği (%5 Üretim)' }
  },
  {
    id: 'cursed_forest',
    name: 'Lanetli Orman',
    seThreshold: 50000,
    atmosphere: 'Derin mor, titreyen yapraklar, rüzgar sesi',
    color: '#7c4a9e',
    bgGradient: 'radial-gradient(ellipse at 50% 100%, #1a0a2e 0%, #0d0518 60%, #03010a 100%)',
    bonus: { type: 'production', value: 1.15, description: 'Orman Fısıltıları (%15 Üretim)' }
  },
  {
    id: 'abandoned_castle',
    name: 'Terk Edilmiş Kale',
    seThreshold: 1500000,
    atmosphere: 'Taş gri, alev parçacıkları, uzak zincir sesi',
    color: '#8a8a8a',
    bgGradient: 'radial-gradient(ellipse at 50% 100%, #1a1a1a 0%, #0d0d0d 60%, #050505 100%)',
    bonus: { type: 'click', value: 1.25, description: 'Kale Yankısı (%25 Tıklama)' }
  },
  {
    id: 'cursed_city',
    name: 'Lanetli Şehir',
    seThreshold: 75000000,
    atmosphere: 'Kırmızı-siyah, yıkık binalar, çığlık ambiyansı',
    color: '#c0392b',
    bgGradient: 'radial-gradient(ellipse at 50% 100%, #2d0a08 0%, #1a0505 60%, #080202 100%)',
    bonus: { type: 'production', value: 1.4, description: 'Şehir Kaosu (%40 Üretim)' }
  },
  {
    id: 'dark_temple',
    name: 'Karanlık Tapınak',
    seThreshold: 5000000000,
    atmosphere: 'Saf siyah, rünler parlıyor, ritüel davul sesi',
    color: '#1a1a2e',
    bgGradient: 'radial-gradient(ellipse at 50% 100%, #05051a 0%, #020210 60%, #010108 100%)',
    bonus: { type: 'cost', value: 0.85, description: 'Tapınak Bağışı (-%15 Birim Maliyeti)' }
  },
  {
    id: 'death_throne',
    name: 'Ölüm Tahtı',
    seThreshold: 200000000000,
    atmosphere: 'Altın & mor, kayan yıldızlar, sessizlik',
    color: '#d4af37',
    bgGradient: 'radial-gradient(ellipse at 50% 100%, #1a1000 0%, #0d0800 60%, #050300 100%)',
    bonus: { type: 'all', value: 1.6, description: 'Hükümdar Kudreti (%60 Tüm Güç)' }
  },
  {
    id: 'frozen_steppe',
    name: 'Ebedi Donmuş Bozkir',
    seThreshold: 2000000000000,
    atmosphere: 'Buz mavisi, donmuş efektler, rüzgar sesi, kar taneleri',
    color: '#7dd3fc',
    bgGradient: 'radial-gradient(ellipse at 50% 0%, #001830 0%, #000c1a 50%, #000408 100%)',
    bonus: { type: 'production', value: 1.8, description: 'Donmuş Bereket (%80 Üretim)' }
  },
  {
    id: 'abyss_city',
    name: 'Uçurum Şehri',
    seThreshold: 25000000000000,
    atmosphere: 'Derin gri-mor, uçurum kenarı, uzak çığlıklar',
    color: '#8b5cf6',
    bgGradient: 'radial-gradient(ellipse at 50% 100%, #0d0520 0%, #060010 55%, #010005 100%)',
    bonus: { type: 'click', value: 2.0, description: 'Uçurum Odağı (2x Tıklama)' }
  },
  {
    id: 'dream_shards',
    name: 'Rüya Kırıkları',
    seThreshold: 350000000000000,
    atmosphere: 'Parıldayan kırık cam efekti, pastel rüzyarlar, rüya çanı sesi',
    color: '#f0abfc',
    bgGradient: 'radial-gradient(ellipse at 30% 40%, #1a0a1e 0%, #0d0118 50%, #030007 100%)',
    bonus: { type: 'production', value: 2.5, description: 'Rüya Enerjisi (2.5x Üretim)' }
  },
  {
    id: 'void_heart',
    name: 'Yokluğun Kalbi',
    seThreshold: 5000000000000000,
    atmosphere: 'Siyah boşluk, darbeli yokluk dalgaları, derin uğultu',
    color: '#1e1b4b',
    bgGradient: 'radial-gradient(ellipse at 50% 50%, #050014 0%, #020009 60%, #000003 100%)',
    bonus: { type: 'all', value: 3.5, description: 'Yokluk Gücü (3.5x Tüm Güç)' }
  },
  {
    id: 'beginning_end',
    name: 'Başlangıcın Sonu',
    seThreshold: Infinity,
    atmosphere: 'Saf beyaz ve siyah, sonsuz döngü, monark müzik',
    color: '#ffffff',
    bgGradient: 'radial-gradient(ellipse at 50% 50%, #101010 0%, #050505 60%, #000000 100%)',
    bonus: { type: 'all', value: 10.0, description: 'Sonsuzluk Mührü (10x Tüm Güç)' }
  },
];
