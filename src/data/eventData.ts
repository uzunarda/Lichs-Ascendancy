import type { GameEvent } from '../types';

export const GAME_EVENTS: GameEvent[] = [
  {
    id: 'wandering_soul',
    name: 'Gezgin Ruh',
    description: 'Yolunu kaybetmiş bir ruh, huzur veya intikam arıyor. Ona nasıl yaklaşacaksın?',
    duration: 30,
    weight: 10,
    choices: [
      {
        id: 'consume',
        label: 'Tüket',
        description: 'Ruhu özüne katarak güçlen.',
        result: { se: 5000, message: 'Ruhun acısı sana güç verdi! (+5,000 SE)', type: 'success' }
      },
      {
        id: 'release',
        label: 'Serbest Bırak',
        description: 'Ruhu özgürleştirerek minnetini kazan.',
        result: { vt: 5, message: 'Ruh huzura ererken sana bir tutam Yokluk Tozu bıraktı. (+5 VT)', type: 'info' }
      }
    ]
  },
  {
    id: 'cursed_relic',
    name: 'Lanetli Eşya',
    description: 'Mezarlıkta parıldayan, etrafına soğuk bir aura yayan antik bir eşya buldun.',
    duration: 30,
    weight: 8,
    choices: [
      {
        id: 'take_risk',
        label: 'Risk Al',
        description: 'Eşyayı incele. Tehlikeli olabilir.',
        result: { se: 20000, vt: 10, message: 'Antik mühürü kırdın ve hazineyi ele geçirdin!', type: 'success' }
      },
      {
        id: 'destroy',
        label: 'Yok Et',
        description: 'Tehlikeyi ortadan kaldır.',
        result: { dp: 10, message: 'Eşyayı parçaladığında rüya parçaları etrafa saçıldı. (+10 DP)', type: 'info' }
      }
    ]
  },
  {
    id: 'void_rift',
    name: 'Yokluk Çatlağı',
    description: 'Zeminde havaya mor ışıklar saçan bir çatlak belirdi. İçinden derin fısıltılar geliyor.',
    duration: 30,
    weight: 5,
    minRegion: 5, // Requires some progress
    choices: [
      {
        id: 'step_in',
        label: 'İçine Adım At',
        description: 'Boyutlar arası bir yolculuk.',
        result: { se: 100000, vt: 25, message: 'Yokluğun derinliklerinden büyük bir güçle döndün!', type: 'success' }
      },
      {
        id: 'seal',
        label: 'Mühürle',
        description: 'Gerçekliği koru.',
        result: { cs: 10, message: 'Çatlağı mühürlemek sana Lanet Taşları kazandırdı. (+10 💎)', type: 'success' }
      }
    ]
  },
  {
    id: 'ancient_library',
    name: 'Kadim Kütüphane',
    description: 'Tozlu raflar arasında yasaklanmış bilgiler barındıran bir kitap buldun.',
    duration: 30,
    weight: 7,
    choices: [
      {
        id: 'study',
        label: 'Çalış',
        description: 'Bilgi güçtür.',
        result: { dp: 50, message: 'Yasaklı büyüler sana yeni ufuklar açtı. (+50 DP)', type: 'info' }
      },
      {
        id: 'burn',
        label: 'Yak',
        description: 'İnsanlığın iyiliği için...',
        result: { se: 500000, message: 'Küllerinden büyük bir enerji açığa çıktı.', type: 'warning' }
      }
    ]
  },
  {
    id: 'gravedigger_heist',
    name: 'Mezarcı Soygunu',
    description: 'Bir grup hırsız senin kutsal mezarlığını yağmalamaya çalışıyor!',
    duration: 30,
    weight: 12,
    choices: [
      {
        id: 'execute',
        label: 'İnfaz Et',
        description: 'Hizmetçilerine emret.',
        result: { se: 10000, message: 'Hırsızların ruhları toplandı.', type: 'success' }
      },
      {
        id: 'enslave',
        label: 'Köleleştir',
        description: 'Orduna kat.',
        result: { se: 5000, vt: 2, message: 'Hırsızlar artık senin için çalışıyor.', type: 'info' }
      }
    ]
  },
  {
    id: 'soul_storm',
    name: 'Ruh Fırtınası',
    description: 'Gökyüzü karardı ve huzursuz ruhların fırtınası başladı.',
    duration: 30,
    weight: 6,
    choices: [
      {
        id: 'absorb',
        label: 'Em',
        description: 'Fırtınanın merkezinde dur.',
        result: { se: 250000, message: 'Fırtına dindiğinde daha güçlüydün.', type: 'success' }
      },
      {
        id: 'disperse',
        label: 'Dağıt',
        description: 'Fırtınayı sakinleştir.',
        result: { vt: 15, message: 'Ruhlar dağılırken geride Yokluk Tozu bıraktı.', type: 'info' }
      }
    ]
  },
  {
    id: 'dark_pact',
    name: 'Karanlık Pakt',
    description: 'Gölgeden gelen bir varlık seninle bir anlaşma yapmak istiyor.',
    duration: 30,
    weight: 4,
    choices: [
      {
        id: 'accept',
        label: 'Kabul Et',
        description: 'Büyük bedeller, büyük ödüller.',
        result: { cs: 100, vt: 50, dp: 200, message: 'Pakt mühürlendi. Karanlık seni kutsadı.', type: 'success' }
      },
      {
        id: 'reject',
        label: 'Reddet',
        description: 'Kimseye borçlu kalma.',
        result: { se: 10000, message: 'Varlık hırıldayarak gölgelere geri döndü.', type: 'warning' }
      }
    ]
  }
];
