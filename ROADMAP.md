# 🏴 LICH'S ASCENDANCY — GELİŞTİRME YOL HARİTASI

> Bu doküman, GDD v2.0 + v3.0 + v4.0 temel alınarak oluşturulmuştur.
> `[x]` = Tamamlandı · `[/]` = Kısmen Yapıldı · `[ ]` = Yapılmadı

---

## ═══ V1 — CORE OYUN (Web Edition) ═══

> **Tamamlandı.** İlk 6 Faz (Prototype, Core Loop, Ritual & Bölge, Prestige, Ses & Sanat, QA & Yayın) başarıyla uygulandı ve proje V1 sürümüne ulaştı.

---

## ═══ V2 — KARANLIĞIN ŞAFAĞI ═══

### FAZ 7 — Yeni Bölgeler ⏱ 2–3 hafta ✅ TAMAMLANDI

- [x] 5 yeni bölge (Bölge 7–11) — CSS atmosfer + gradient
  - [x] Ebedi Donmuş Bozkır — Buz mavisi atmosfer, kar hissi
  - [x] Uçurum Şehri — Derin mor-gri, uçurum kenarı atmosferi
  - [x] Rüya Kırıkları — Pastel mor, kırık cam efekti
  - [x] Yokluğun Kalbi — Saf siyah yokluk, darbeli dalgalar
  - [x] Başlangıcın Sonu — True Endgame, sonsuz döngü modu
- [/] Yeni kaynaklar: FSE/DP/VT tip tanımları hazır, store entegrasyonu Faz 8'de
- [x] 3 yeni Helper tier'ı — Void Gezgini (T7), Uçurum Mimarı (T8), Yok Olmuş Tanrı (T9)
- [x] 6 yeni yükseltim eklendi (yokluk + mimar + tanrı + sinerji + passive + ritüel)
- [x] `RegionMap.tsx` güncellendi — 11 bölge, emoji ikonlar, V2 badge, per-region progress bar

---

### FAZ 8 — Hane Sistemi (Yapı İnşası) ⏱ 3–4 hafta ✅ TAMAMLANDI

- [x] `buildingStore.ts` — Zustand store, tick-based inşaat, sinerji hesaplama, SE/click bonus, save/load
- [x] 8 yapı tipi (Ruh Çukuru → Ebediyet Tahtı) — `buildingData.ts`
- [x] İnşaat timer sistemi (tick-based, `completesAt` timestamp)
- [x] Bölge başına maks 5 slot (+2 prestige, +1 yapı bazlı unlock)
- [x] 4 sinerji kombinasyonu (Karanlık Temel, Ritüel Yakınsama, Kabus Düzeni, Yokluk Sonsuzluğu)
- [x] `BuildingPanel.tsx` — 3 sekmeli UI (İnşa Et / Aktif / Sinerji), kategori renkleri, progress bar

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
| V1 | Faz 1–6 (Core, Ritual, Prestige, Polish) | ✅ Tamamlandı |
| V2 | Faz 7 (Yeni 5 Bölge + Yeni Helper Tierları) | ✅ Tamamlandı |
| V2 | Faz 8–13 | 🔴 Başlanmadı |
| V3 | Faz 14–22 | 🔴 Başlanmadı |

> **Sonraki Öncelikli Adımlar:**
> 1. V2 mimarisine geçiş ve Faz 7 geliştirmesi (Yeni 5 Bölge).
> 2. Yeni kaynaklar (FSE, DP, VT) ve 3 yeni Helper tier'ı.
> 3. Hane Sistemi altyapısı (`buildingStore.ts`) ve inşaat objeleri.
