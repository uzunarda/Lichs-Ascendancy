# 🏴 LICH'S ASCENDANCY — GELİŞTİRME YOL HARİTASI

> Bu doküman, GDD v2.0 + v3.0 + v4.0 temel alınarak oluşturulmuştur.
> `[x]` = Tamamlandı · `[/]` = Kısmen Yapıldı · `[ ]` = Yapılmadı

---

## ═══ V1 — CORE OYUN (Web Edition) ═══

### FAZ 1 — Prototype ⏱ 1–2 hafta

- [x] Vite + React 18 + TypeScript + Zustand proje kurulumu
- [x] `gameStore.ts` ile merkezi state yönetimi
- [x] Tıklama sistemi — Lich kafatası ikonu, SE kazanımı (`LichSkull.tsx`)
- [x] Frenzy Combo — 10 sn'de 50 tıklama → SE x3 (5 sn)
- [x] İlk 3 Helper tanımı (İskelet İşçi, Zombi Hasat Edici, Vampir Ajan)
- [x] Helper satın alma & maliyet formülü (`cost(n) = baseCost × 1.15^n`)
- [x] Milestone bonus sistemi (`totalRate × 1.15^floor(count/10)`)
- [x] Temel UI düzeni — ResourceBar, LichSkull, HelperPanel
- [x] Sayı formatlama (K / M / B / bilimsel notasyon) (`numberUtils.ts`)
- [x] `index.css` — dark fantasy renk paleti, Cinzel + Crimson Pro fontları

---

### FAZ 2 — Core Loop ⏱ 2–3 hafta

- [x] 6 Helper'ın tamamı (İskelet İşçi → Karanlık Yarı-Tanrı) tanımlı & çalışıyor
- [x] Upgrade sistemi — Click, Helper, Synergy kategorileri (`UpgradePanel.tsx`)
  - [x] Click Upgrades (3 adet: x2, x3, x5)
  - [x] Helper Upgrades (İskelet İşçi x2, Zombi Hasat Edici x2)
  - [x] Synergy Upgrades (Kemik Ordusu, Gece Efendisi)
  - [ ] Ritual Upgrades (ritüel başarı şansı & ödül artışı)
  - [ ] Passive Upgrades (offline kazanım süresi uzatma — prestige para birimiyle)
- [x] Save/Load sistemi — `localStorage` ile JSON kayıt
- [ ] Save hash doğrulama (cheating önlemi)
- [x] Otomatik kayıt (30 sn interval + beforeunload)

---

### FAZ 3 — Ritual & Bölge ⏱ 2–3 hafta

- [x] Ritüel sistemi — 4 tier (Küçük, Orta, Büyük, Kâbus) (`RitualPanel.tsx`)
- [x] Ritüel cooldown (60–120 sn arası rastgele)
- [x] Lich Çırağı: her birim ritüel başarı şansını +%5 artırıyor
- [x] 6 bölge tanımı — SE eşiği, CSS renk, gradient arka plan (`gameData.ts`)
- [x] Bölge geçişleri — totalSE bazlı otomatik ilerleme
- [x] CSS atmosfer geçişleri — `transition-all duration-[2000ms]`
- [x] Bölge haritası UI (`RegionMap.tsx`)

---

### FAZ 4 — Prestige ⏱ 2–3 hafta

- [x] Ölüm Döngüsü prestige mekaniği
- [x] Lanet Taşı kazanım formülü — `floor(sqrt(totalSE / 1,000,000))`
- [x] Prestige mağazası — 6 kalıcı güç (`PrestigePanel.tsx`)
  - [x] Kemik Zırhı (ClickPower +%10)
  - [x] Gece Görüşü (Offline 8s → 12s) — tanımlandı ama efekt tam uygulanmamış olabilir
  - [x] Ruh Toplayıcı (Başlangıç SE x10)
  - [x] Vampirik Kucaklama (Vampir uyumaz)
  - [x] Ölümsüz Beden (Tüm üretim x1.25)
  - [x] Lanetli Taht (Yeni bölge açar)
- [x] Prestige'de SE, helper, upgrade sıfırlanıyor; Lanet Taşları kalıcı
- [x] Offline progress — maks 8 saat birikim, açılışta toast bildirimi
- [x] Karanlık Yarı-Tanrı Prestige bonusu (%5 ekstra taş)

---

### FAZ 5 — Ses & Sanat ⏱ 2–3 hafta

- [ ] Howler.js entegrasyonu
- [ ] Tıklama sesi (kemik crack)
- [ ] Frenzy aktif sesi (davul + korku teli)
- [ ] Helper satın alma sesi (zincir çıkartma)
- [ ] Ritüel açma / başarı / başarısızlık sesleri
- [ ] Prestige sesi
- [ ] Bölge geçiş ses fadeout/fade-in
- [ ] SVG sprite asset'leri (helper ikonları, UI öğeleri)
- [x] CSS animasyonlar (`animation.css` — glow-pulse, frenzy-pulse, particle-float, vb.)
- [ ] Ruh parçacık efektleri tıklamada

---

### FAZ 6 — QA & Yayın ⏱ 1–2 hafta

- [ ] Kapsamlı bug testi (tüm mekanikler)
- [ ] Balans ayarları (helper fiyatları, ritüel şansları, prestige eğrisi)
- [ ] Tooltip sistemi tüm elementlere uygulanması
  - [x] `TooltipWrapper.tsx` bileşeni mevcut
  - [ ] Tüm interaktif öğelere uygulanması
- [ ] Notification / Badge animasyon sistemi (milestone bildirim)
- [ ] Erişilebilirlik
  - [ ] Renk körü modu (sembollerle destekleme)
  - [ ] Font boyutu ayarı (CSS variable)
  - [ ] Klavye desteği (Space = tıklama, Tab navigasyonu)
- [ ] itch.io sayfa tasarımı
- [ ] Vercel / GitHub Pages deploy
- [ ] Production build optimizasyonu

---

## ═══ V2 — KARANLIĞIN ŞAFAĞI ═══

### FAZ 7 — Yeni Bölgeler ⏱ 2–3 hafta

- [ ] 5 yeni bölge (Bölge 7–11) — CSS atmosfer + gradient
  - [ ] Ebedi Donmuş Bozkır — Buzul helper'ları, Donma Ritüeli
  - [ ] Uçurum Şehri — Uçurum Tüccarı, Kule Yapıları
  - [ ] Rüya Kırıkları — Rüya Parçası kaynağı, Rüya Ritüeli
  - [ ] Yokluğun Kalbi — Yokluk Dalgaları, Boss spawn
  - [ ] Başlangıcın Sonu — True Endgame, sonsuz döngü modu
- [ ] Yeni kaynaklar: Dondurulmuş Ruh Özü (FSE), Rüya Parçası (DP), Yokluk Tozu (VT)
- [ ] 3 yeni Helper tier'ı (Void Gezgini, Uçurum Mimarı, Yok Olmuş Tanrı)
- [ ] `RegionMap.tsx` güncellenmesi (11 bölge)

---

### FAZ 8 — Hane Sistemi (Yapı İnşası) ⏱ 3–4 hafta

- [ ] `buildingStore.ts` — yeni Zustand store
- [ ] 8 yapı tipi (Ruh Çukuru → Ebediyet Tahtı)
- [ ] İnşaat timer sistemi (tick-based, `completesAt` timestamp)
- [ ] Bölge başına maks 5 slot (+2 prestige ile)
- [ ] Yapı sinerji sistemi (4 sinerji kombinasyonu)
- [ ] `BuildingPanel.tsx` UI bileşeni

---

### FAZ 9 — Lanet Ağacı (Skill Tree) ⏱ 3–4 hafta

- [ ] `skillTreeStore.ts` — yeni Zustand store
- [ ] Rüya Parçası (DP) kaynak sistemi
- [ ] 4 dal: Ölüm, Çürüme, Kaos, Yokluk (gizli)
- [ ] 44 node toplam + dallar arası çelişki sistemi
- [ ] Yokluk Yolu — geri alınamaz, uyarı modali
- [ ] `SkillTreeView.tsx` — SVG tabanlı ağaç görselleştirmesi

---

### FAZ 10 — Boss Savaşları ⏱ 2–3 hafta

- [ ] `bossFight` state'i gameStore'a eklenmesi
- [ ] 5 boss: Yokluğun Sesi → İlk Yokluk (Final)
- [ ] Tick-based savaş mekaniği (SE ≈ HP)
- [ ] Boss özel yetenekleri
- [ ] `BossBanner.tsx` — boss HP çubuğu
- [ ] Void Tozu + Rüya Parçası ödül drop sistemi

---

### FAZ 11 — Yeni Prestige Katmanları ⏱ 2–3 hafta

- [ ] 2. Kat: Karanlık Çözülüş — Karanlık Kristal para birimi
- [ ] 3. Kat: Çözülme — Çözülme Kıvılcımı para birimi
- [ ] Karanlık Kristal Mağazası (7 güç)
- [ ] Çözülme Kıvılcımı Mağazası (6 güç)
- [ ] Katmanlı sıfırlama mekaniğii

---

### FAZ 12 — Koridor & Artifakt ⏱ 2–3 hafta

- [ ] `eventStore.ts` — rastgele olay sistemi
- [ ] 7 olay tipi (Gezgin Ruh, Lanetli Eşya, vb.)
- [ ] 30 sn karar süresi, bölgeye özgü olaylar
- [ ] `EventBanner.tsx` — olay bildirimi UI
- [ ] `artifactStore.ts` — artifakt koleksiyon sistemi
- [ ] 5 artifakt tier'ı (Sıradan → Benzersiz)
- [ ] Set bonusları (5 set)
- [ ] `ArtifactCard.tsx` — koleksiyon UI

---

### FAZ 13 — Liderlik & QA ⏱ 2–3 hafta

- [ ] Opsiyonel skor API backend'i
- [ ] `leaderboardStore.ts`
- [ ] `LeaderboardModal.tsx`
- [ ] v2→v3 save migrasyon mekanizması
- [ ] Kapsamlı bug fix & balans

---

## ═══ V3 — LANET KONFEDERASYONU (Multiplayer) ═══

### FAZ 14 — Backend Temeli ⏱ 3–4 hafta

- [ ] Node.js + Express API Gateway
- [ ] PostgreSQL + Redis kurulumu
- [ ] Socket.io altyapısı
- [ ] Auth sistemi (Anonim Token → E-posta → Discord OAuth)
- [ ] Player sync API (anti-cheat doğrulama)

---

### FAZ 15 — Koven Sistemi (Guild) ⏱ 4–5 hafta

- [ ] Koven oluşturma/katılma/ayrılma
- [ ] 5 seviye hiyerarşi (Lanetli → Büyük Lich)
- [ ] Lanet Külü (LK) üretimi ve Hazine sistemi
- [ ] 8 Koven binası
- [ ] Koven misyonları (6 tip)
- [ ] Koven sohbet (Socket.io)

---

### FAZ 16 — Karanlık Pazar (Ticaret) ⏱ 3–4 hafta

- [ ] Order book modeli (emir defteri)
- [ ] Dinamik fiyatlandırma (arz-talep)
- [ ] 6 ticarete açık kaynak
- [ ] Komisyon & vergi sistemi
- [ ] Kovan içi bağış (vergisiz)

---

### FAZ 17 — Diplomasi & Savaş ⏱ 3–4 hafta

- [ ] 6 ilişki durumu (Tarafsız → Kan Yemini)
- [ ] Koven Savaşı eylemleri (Sabotaj, Ruh Hırsızlığı, Lanet Baskını, vb.)
- [ ] Savunma ve misilleme mekanikleri

---

### FAZ 18 — Dünya Olayları ⏱ 2–3 hafta

- [ ] Haftalık Dünya Olayları (6 tip)
- [ ] Koven Boss Baskınları (4 boss, 2–5 koven kooperasyonu)
- [ ] Dünya Patronu (aylık, tüm sunucu)
- [ ] Baskın rolleri: Hasar, Tank, Healer, Sabotör

---

### FAZ 19 — Rekabet & Sezonlar ⏱ 3–4 hafta

- [ ] 8 haftalık sezon yapısı
- [ ] Sezon puan sistemi
- [ ] 6 lig seviyesi (Kırık Kemik → Yokluk Lordu)
- [ ] 1v1 Düello sistemi (6 kategori)
- [ ] Bireysel haftalık turnuva
- [ ] Koven Turnuvası (2 haftada bir)

---

### FAZ 20 — Sosyal & Profil ⏱ 2–3 hafta

- [ ] Oyuncu profil sayfası (8 alan)
- [ ] Unvan sistemi (8+ unvan)
- [ ] Avatar çerçeveleri
- [ ] Arkadaş listesi & bildirimler

---

### FAZ 21 — Battle Pass & Sezon Özel ⏱ 2–3 hafta

- [ ] 5 sezon teması
- [ ] Battle Pass (ücretsiz + kozmetik-only ücretli)
- [ ] 50 kademe ödül sistemi
- [ ] Sezon özel kaynakları

---

### FAZ 22 — QA & Lansman ⏱ 2–3 hafta

- [ ] Stres testi
- [ ] Anti-cheat (sunucu tarafı doğrulama)
- [ ] GDPR uyumu
- [ ] Canlı yayın (v4.0 Launch)

---

## 📊 GENEL İLERLEME ÖZETİ

| Versiyon | Faz | Durum |
|----------|-----|-------|
| V1 | Faz 1 — Prototype | ✅ Tamamlandı |
| V1 | Faz 2 — Core Loop | 🟡 %85 (Ritual/Passive upgrade eksik) |
| V1 | Faz 3 — Ritual & Bölge | ✅ Tamamlandı |
| V1 | Faz 4 — Prestige | ✅ Tamamlandı |
| V1 | Faz 5 — Ses & Sanat | 🔴 %10 (Sadece CSS animasyonlar) |
| V1 | Faz 6 — QA & Yayın | 🔴 %5 (TooltipWrapper mevcut) |
| V2 | Faz 7–13 | 🔴 Başlanmadı |
| V3 | Faz 14–22 | 🔴 Başlanmadı |

> **Sonraki Öncelikli Adımlar:**
> 1. Faz 2'deki eksik upgrade'leri tamamla (Ritual + Passive)
> 2. Save hash doğrulaması ekle
> 3. Faz 5 — Ses sistemi (Howler.js)
> 4. Faz 6 — Tooltip yaygınlaştırma, erişilebilirlik, deploy
