# Kuralı Ne? — Kapsamlı SEO Strateji Kılavuzu

> **Site:** https://nasiloynanir.com  
> **Marka:** Kuralı Ne?  
> **Dil:** Türkçe (tr-TR)  
> **Niş:** Geleneksel Türk oyunları kuralları + dijital oyun araçları  
> **Son güncelleme:** Haziran 2026

---

## İçindekiler

1. [Executive Summary](#1-executive-summary)
2. [Marka & Konumlandırma](#2-marka--konumlandırma)
3. [Anahtar Kelime Evreni](#3-anahtar-kelime-evreni)
4. [Arama Niyeti Haritası](#4-arama-niyeti-haritası)
5. [Sayfa Bazlı SEO Spesifikasyonu](#5-sayfa-bazlı-seo-spesifikasyonu)
6. [Title & Description Formülleri](#6-title--description-formülleri)
7. [Hazır Meta Metinleri (Örnekler)](#7-hazır-meta-metinleri-örnekler)
8. [Schema.org / JSON-LD Envanteri](#8-schemaorg--json-ld-envanteri)
9. [İçerik SEO & E-E-A-T](#9-i̇çerik-seo--e-e-a-t)
10. [İç Linkleme Mimarisi](#10-i̇ç-linkleme-mimarisi)
11. [Araç Sayfaları SEO](#11-araç-sayfaları-seo)
12. [Karşılaştırma Sayfaları SEO](#12-karşılaştırma-sayfaları-seo)
13. [FAQ & Featured Snippet Stratejisi](#13-faq--featured-snippet-stratejisi)
14. [Görsel & Image SEO](#14-görsel--image-seo)
15. [Teknik SEO](#15-teknik-seo)
16. [Sitemap & robots.txt](#16-sitemap--robotstxt)
17. [CSR Sınırlaması & Prerender Yol Haritası](#17-csr-sınırlaması--prerender-yol-haritası)
18. [Google Search Console & Ölçümleme](#18-google-search-console--ölçümleme)
19. [Core Web Vitals & Performans SEO](#19-core-web-vitals--performans-seo)
20. [Sosyal Medya & Open Graph](#20-sosyal-medya--open-graph)
21. [Rakip & SERP Analizi Çerçevesi](#21-rakip--serp-analizi-çerçevesi)
22. [12 Aylık İçerik Takvimi](#22-12-aylık-i̇çerik-takvimi)
23. [Link Building & Dış SEO](#23-link-building--dış-seo)
24. [KPI'lar & Başarı Metrikleri](#24-kpilar--başarı-metrikleri)
25. [Acil Aksiyon Listesi (Öncelik Sırası)](#25-acil-aksiyon-listesi-öncelik-sırası)
26. [Dinamik SEO Motoru (seoEngine.js)](#26-dinamik-seo-motoru-seoenginejs)

---

## 1. Executive Summary

**Kuralı Ne?** Türkiye'de "X kuralı ne?", "X nasıl oynanır?" aramalarına odaklanan, yüksek niyetli (informational + transactional-light) bir oyun rehberi sitesidir. SEO avantajları:

| Güçlü yan | Zayıf yan |
|-----------|-----------|
| "Kuralı Ne?" marka sorgusu ile doğrudan uyum | Pure CSR — bot ilk HTML'de içerik görmeyebilir |
| HowTo + FAQ + Game schema altyapısı | Sitemap güncel değilse index gecikir |
| SearchAction (`/oyunlar?search=`) | `/auth`, `/profil` robots ile çelişki riski |
| Karşılaştırma sayfaları (X vs Y) | Anahtar kelime cannibalization riski (okey varyantları) |
| 7 interaktif araç = long-tail trafik | OG görseli (`og-image.jpg`) kontrol edilmeli |

**Birincil SEO hedefi:** Türkiye Google'da geleneksel oyun + kural sorgularında top 3.  
**İkincil hedef:** Araç sorgularında (101 yazboz, okey sayacı) organik trafik.  
**Üçüncül hedef:** Marka araması "Kuralı Ne?" dominasyonu.

---

## 2. Marka & Konumlandırma

### 2.1 Marka mesajı (SERP'te tutarlılık)

```
Kuralı Ne? = Geleneksel Türk oyunlarının kurallarını anlatan dijital rehber.
```

Her title'da marka suffix: `{Sayfa Başlığı} - Kuralı Ne?`  
Her description'da en az bir CTA kelimesi: *öğren, keşfet, adım adım, ücretsiz*.

### 2.2 Hedef kitle segmentleri

| Segment | Örnek sorgu | Sayfa tipi |
|---------|-------------|------------|
| Aile / ev oyunu | "pişti nasıl oynanır" | Oyun detay |
| Genç yetişkin | "101 okey kuralları" | Oyun detay + araç |
| Çocuk / ebeveyn | "saklambaç oyunu kuralları" | Oyun detay |
| Grup aktivitesi | "takım oluşturucu online" | Araç sayfası |
| Karar aşaması | "okey mi 101 okey mi" | Karşılaştırma |

### 2.3 Ton & dil (SEO copywriting)

- **Olumlu:** net, adım adım, Türkçe karakterler doğru (ı/İ, ş, ğ)
- **Olumsuz:** clickbait, ALL CAPS, keyword stuffing
- **Ideal description uzunluğu:** 145–160 karakter (Google snippet)
- **Ideal title uzunluğu:** 50–60 karakter (marka dahil ~70 max)

---

## 3. Anahtar Kelime Evreni

### Tier 1 — Head terms (yüksek hacim, yüksek rekabet)

| Anahtar kelime | Hedef URL | Öncelik |
|----------------|-----------|---------|
| okey kuralı ne | `/oyun/okey` veya `/oyun/düz-okey` | P0 |
| batak kuralı ne | `/oyun/batak` | P0 |
| pişti kuralı ne | `/oyun/pişti` | P0 |
| 101 okey kuralları | `/oyun/101-okey` | P0 |
| tavla nasıl oynanır | `/oyun/tavla` | P0 |
| saklambaç nasıl oynanır | `/oyun/saklambaç` | P1 |

### Tier 2 — Body terms (orta hacim)

| Anahtar kelime | Hedef URL |
|----------------|-----------|
| ihaleli batak kuralları | `/oyun/ihaleli-batak` |
| eşli batak | `/oyun/eşli-batak` |
| king oyunu kuralları | `/oyun/king` (varsa) |
| mangala nasıl oynanır | `/oyun/mangala` |
| körebe oyunu | `/oyun/körebe` |
| kağıt oyunları kuralları | `/kategori/Kağıt%20Oyunları` |
| masa oyunları kuralları | `/kategori/Masa%20Oyunları` |

### Tier 3 — Long-tail (düşük rekabet, yüksek dönüşüm)

| Anahtar kelime | Hedef URL |
|----------------|-----------|
| 101 okey yazboz online | `/araclar/101-yazboz` |
| okey puan sayacı düşmeli | `/araclar/okey-sayaci` |
| batak yazboz dijital | `/araclar/batak-yazboz` |
| halısaha takım oluşturucu | `/araclar/halisaha-takim-olusturucu` |
| okey mi 101 okey mi fark | `/karsilastir/...` |
| batak mı pişti mi | `/karsilastir/...` |

### Tier 4 — Marka & navigasyon

| Anahtar kelime | Hedef |
|----------------|-------|
| kuralı ne | `/` |
| kuralı ne oyunlar | `/oyunlar` |
| kuralı ne araçlar | `/araclar` |

### Tier 5 — Negatif anahtar kelimeler (hedefleme)

Bu sorgulara **bilerek** odaklanma veya sayfa oluşturma:

- okey indir, batak apk (oyun indirme niyeti)
- okey hilesi, batak hile (yanlış niyet)
- okey online oyna (casino/bahis çağrışımı — dikkatli)

---

## 4. Arama Niyeti Haritası

```
                    BİLGİ ARAMA                    ARAÇ/KULLANIM
                         │                              │
    ┌────────────────────┼──────────────────────────────┤
    │                    │                              │
    │  "okey kuralı ne"  │    "101 okey yazboz"         │
    │  "pişti kuralları" │    "okey sayacı"             │
    │                    │                              │
    │     OYUN DETAY     │       ARAÇ SAYFASI           │
    │   /oyun/:slug      │     /araclar/...             │
    └────────────────────┴──────────────────────────────┘
                         │
              "okey vs 101 okey"
                         │
                 KARŞILAŞTIRMA
              /karsilastir/:a-vs-b
```

### Intent → Schema eşlemesi

| Niyet | Schema |
|-------|--------|
| Nasıl oynanır | `HowTo` + `Game` |
| Kurallar listesi | `HowTo.step[]` |
| SSS | `FAQPage` |
| Video izle | `VideoObject` |
| Liste keşfi | `ItemList` + `CollectionPage` |
| Karşılaştır | `WebPage` + `ItemList` |

---

## 5. Sayfa Bazlı SEO Spesifikasyonu

### 5.1 Ana Sayfa `/`

| Alan | Değer |
|------|-------|
| **Title** | Kuralı Ne? - Geleneksel Türk Oyunları Rehberi |
| **Description** | Okey, Batak, Pişti, Saklambaç gibi geleneksel Türk oyunlarının kuralı ne? Detaylı kurallar, ipuçları ve stratejiler tek yerde. |
| **H1** | (Hero'da marka + value prop) |
| **Schema** | WebSite, Organization, FAQPage, ItemList |
| **Index** | index, follow |
| **Priority (sitemap)** | 1.0 |

**İç link hedefleri:** `/oyunlar`, `/araclar`, popüler 4 oyun, `/hakkimizda`

---

### 5.2 Tüm Oyunlar `/oyunlar`

| Alan | Değer |
|------|-------|
| **Title** | Tüm Oyunlar - Oyun Arşivi |
| **Description** | Geleneksel Türk oyunları arşivi. Kart, masa, sokak ve kutu oyunlarının kurallarını keşfedin. |
| **Schema** | WebPage + ItemList |
| **Canonical** | `/oyunlar` (search param için ayrı canonical stratejisi — bkz. §15) |

**Search URL:** `/oyunlar?search=okey` — SearchAction ile uyumlu, indexlenebilir.

---

### 5.3 Oyun Detay `/oyun/:slug`

| Alan | Formül |
|------|--------|
| **Title** | `{Oyun Adı} Kuralı Ne? - Kuralı Ne?` |
| **Description** | `{Oyun Adı} kuralı ne? {shortDescription ilk 120 karakter}. Detaylı kurallar, ipuçları ve stratejiler.` |
| **H1** | `{Oyun Adı}` veya `{Oyun Adı} Kuralı Ne?` (tek H1) |
| **Schema** | HowTo, Game, Article, VideoObject (varsa), FAQPage (varsa), BreadcrumbList |
| **Priority** | 0.9 |
| **changefreq** | weekly |

**On-page checklist:**
- [ ] H1 benzersiz
- [ ] İlk paragrafta hedef keyword doğal geçiş
- [ ] Kurallar numaralı liste (HowTo step ile 1:1)
- [ ] En az 3 iç link (kategori, benzer oyun, ilgili araç)
- [ ] FAQ bölümü (min 3 soru)
- [ ] Görsel alt text: `{Oyun adı} oyunu görseli`

---

### 5.4 Kategori `/kategori/:name`

| Alan | Formül |
|------|--------|
| **Title** | `{Kategori} Oyunları - Kuralı Ne?` |
| **Description** | `{Kategori} kategorisindeki tüm oyunların kuralları. {N} oyun, adım adım anlatım.` |
| **Schema** | CollectionPage + ItemList |
| **Priority** | 0.8 |

---

### 5.5 Araçlar listesi `/araclar`

| Alan | Değer |
|------|-------|
| **Title** | Oyun Araçları - Skor Tablosu ve Yardımcı Araçlar |
| **Description** | Okey sayacı, 101 yazboz, batak yazboz, takım oluşturucu ve daha fazlası. Ücretsiz, kayıtsız oyun araçları. |
| **Schema** | WebPage + ItemList (SoftwareApplication opsiyonel) |
| **Priority** | 0.8 |

---

### 5.6 Araç alt sayfaları

| URL | Title | Primary KW |
|-----|-------|------------|
| `/araclar/101-yazboz` | 101 Okey Yazboz - Online Ceza Hesaplama | 101 okey yazboz |
| `/araclar/okey-sayaci` | Okey Puan Sayacı - Düşmeli Okey | okey puan sayacı |
| `/araclar/batak-yazboz` | Batak Yazboz - King & İhaleli Batak | batak yazboz |
| `/araclar/takim-olusturucu` | Takım Oluşturucu - Rastgele Kura | takım oluşturucu |
| `/araclar/halisaha-takim-olusturucu` | Halısaha Takım Oluşturucu 5v5 6v6 | halısaha takım |
| `/araclar/zar-at` | Online Zar At - Tek ve Çift Zar | zar at online |
| `/araclar/skor-tablosu` | Skor Tablosu - Dijital Puan Tutucu | skor tablosu online |

**Schema önerisi (her araç):** `WebApplication` veya `SoftwareApplication`

```json
{
  "@type": "WebApplication",
  "name": "101 Okey Yazboz",
  "applicationCategory": "GameApplication",
  "operatingSystem": "Web",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY" },
  "inLanguage": "tr"
}
```

---

### 5.7 Karşılaştırma `/karsilastir/:a-vs-b`

| Alan | Formül |
|------|--------|
| **Title** | `{Oyun A} vs {Oyun B} - Hangisi Daha İyi? \| Kuralı Ne?` |
| **Description** | `{A} ve {B} karşılaştırması: oyuncu sayısı, zorluk, süre, kurallar. Hangisini seçmelisiniz?` |
| **Schema** | WebPage + ItemList (2 Game) |
| **Priority** | 0.7 |

---

### 5.8 Kurumsal sayfalar

| URL | Index | Not |
|-----|-------|-----|
| `/hakkimizda` | index | Organization schema güçlendir |
| `/iletisim` | index | ContactPage schema |
| `/kullanim-kosullari` | index | düşük priority |
| `/gizlilik` | index | KVKK |
| `/cerez-politikasi` | index | KVKK |
| `/reklam-verin` | index | B2B trafik |

---

### 5.9 Noindex sayfalar

| URL | robots | Gerekçe |
|-----|--------|---------|
| `/auth` | noindex | Utility, thin content |
| `/profil` | noindex | Kişisel, duplicate |
| `/admin-panel` | disallow | Güvenlik |
| 404 | noindex | Zaten var |

---

## 6. Title & Description Formülleri

### 6.1 Oyun detay title

```
{OyunAdı} Kuralı Ne?
→ generateTitle: "{OyunAdı} Kuralı Ne? - Kuralı Ne?"
```

Alternatif (varyant oyunlar için cannibalization önleme):
```
{OyunAdı} Nasıl Oynanır? Kurallar ve İpuçları
```

### 6.2 Oyun detay description

```
{OyunAdı} kuralı ne? {shortDescription}. 
{players} kişi · {difficulty} · Adım adım kurallar ve stratejiler.
```

Karakter limiti aşılırsa `shortDescription` kısalt.

### 6.3 Kategori description

```
{Kategori} oyunlarının tam listesi ve kuralları. 
Okey, Batak, Pişti... → Kategoriye özel 2-3 oyun adı geç.
```

### 6.4 Araç description

```
{AracAdı}: {tek cümle fayda}. Ücretsiz, kayıt gerektirmez, mobil uyumlu.
```

---

## 7. Hazır Meta Metinleri (Örnekler)

### 7.1 Popüler oyunlar

**Okey**
- Title: `Okey Kuralı Ne? - Kuralı Ne?`
- Description: `Okey kuralı ne? 4 kişilik klasik okeyin taş dağıtımı, grup-seri açma ve bitiş kuralları. Adım adım anlatım ve ipuçları.`

**101 Okey**
- Title: `101 Okey Kuralı Ne? - Kuralı Ne?`
- Description: `101 okey kuralları: ceza puanları, açma şartları, okeyle bitiş. Yüzbir okey nasıl oynanır — detaylı rehber.`

**Batak**
- Title: `Batak Kuralı Ne? - Kuralı Ne?`
- Description: `Batak kuralı ne? İhale, koz, el alma ve puan hesabı. 4 kişilik batağın tüm varyasyonlarına giriş.`

**Pişti**
- Title: `Pişti Kuralı Ne? - Kuralı Ne?`
- Description: `Pişti kuralı ne? Kart eşleştirme, pişti yapma ve vale kuralları. Hızlı tempolu kart oyunu rehberi.`

**Tavla**
- Title: `Tavla Kuralı Ne? - Kuralı Ne?`
- Description: `Tavla nasıl oynanır? Pul hareketi, vurma, kırma ve mars kuralları. Başlangıçtan ileri seviyeye.`

**Saklambaç**
- Title: `Saklambaç Kuralı Ne? - Kuralı Ne?`
- Description: `Saklambaç oyunu kuralları: sayma, saklanma alanı, ebe seçimi. Çocuklar için dış mekan oyunu rehberi.`

**Satranç**
- Title: `Satranç Kuralı Ne? - Kuralı Ne?`
- Description: `Satranç nasıl oynanır? Taş hareketleri, rok, şah mat ve temel açılışlar. Yeni başlayanlar için rehber.`

### 7.2 Araç sayfaları (optimize edilmiş)

**101 Yazboz**
- Title: `101 Okey Yazboz Online - Ceza Puanı Hesaplama | Kuralı Ne?`
- Description: `101 okey yazboz aracı: el geçmişi, ceza puanları, -101/-202 kısayolları. Ücretsiz online 101 yazboz — kayıt yok.`

**Okey Sayacı**
- Title: `Okey Puan Sayacı - Düşmeli Okey Online | Kuralı Ne?`
- Description: `Düşmeli okey puan sayacı. Normal bitiş 2 puan, okey/çift 4 puan — otomatik hesap. Kağıt kalem bırakın.`

---

## 8. Schema.org / JSON-LD Envanteri

### Mevcut (kodda var)

| Schema | Sayfa | Dosya |
|--------|-------|-------|
| Organization | Global | `seo.js`, `index.html` |
| WebSite + SearchAction | Ana sayfa | `index.html`, `HomePage` |
| FAQPage | Ana sayfa | `HomePage` |
| HowTo | Oyun detay | `generateGameSchema()` |
| Game | Oyun detay | `GameDetail` |
| Article | Oyun detay | `generateArticleSchema()` |
| VideoObject | Oyun detay (video varsa) | `generateVideoSchema()` |
| FAQPage | Oyun detay (FAQ varsa) | `generateFAQSchema()` |
| BreadcrumbList | Çoğu sayfa | `SEO.jsx` |
| ItemList | Oyun listesi | `generateItemListSchema()` |
| CollectionPage | Kategori | `generateCollectionPageSchema()` |
| WebPage | Kurumsal | `SCHEMA_TEMPLATES.webPage()` |

### Eklenecek (öneri)

| Schema | Sayfa | Öncelik |
|--------|-------|---------|
| WebApplication | Her araç | P1 |
| ContactPage | `/iletisim` | P2 |
| SiteNavigationElement | `/site-haritasi` | P2 |
| Review/AggregateRating | Oyun detay (yorumlardan) | P0 (kısmen var) |

### Schema doğrulama

- https://search.google.com/test/rich-results
- https://validator.schema.org/

---

## 9. İçerik SEO & E-E-A-T

### Experience (Deneyim)
- Her oyun sayfasında "Kimler oynar?", "Ne zaman oynanır?" paragrafı
- Gerçek kullanıcı yorumları (CommentSection) — UGC sinyali

### Expertise (Uzmanlık)
- Kurallar adım adım, numaralı
- İpuçları bölümü (HowTo.tip)
- Varyantlar ayrı başlık (İhaleli Batak vs Gömmeli Batak)

### Authoritativeness (Otorite)
- Hakkımızda: misyon, kültürel miras vurgusu
- Dış linkler: TDK benzeri kaynaklara nadiren, güvenilir referans
- Site yaşı + düzenli güncelleme (`dateModified` schema)

### Trustworthiness (Güven)
- Gizlilik, çerez, KVKK sayfaları
- İletişim bilgisi görünür
- HTTPS zorunlu
- Çerez onayı + analitik uyumu (KVKK)

### Minimum içerik derinliği (oyun detay)

| Bölüm | Min. |
|-------|------|
| Giriş paragraf | 80 kelime |
| Kurallar | 5+ adım |
| İpuçları | 3+ madde |
| FAQ | 3+ soru |
| İç link | 3+ |

---

## 10. İç Linkleme Mimarisi

### Hub & Spoke modeli

```
                    [Ana Sayfa]
                   /     |     \
            [Oyunlar] [Araçlar] [Hakkımızda]
               |          |
        [Kategori]    [Araç detay]
               |
         [Oyun detay] ←→ [Karşılaştırma]
               |
         [İlgili araç] (okey → okey sayacı)
```

### Anchor text kuralları

| İyi | Kötü |
|-----|------|
| "Okey kurallarını öğren" | "buraya tıkla" |
| "101 okey yazboz aracı" | "okey okey okey" |
| "Kağıt oyunları kategorisi" | keyword listesi |

### Oyun → Araç eşlemesi (gameTools.js ile)

- Okey / 101 Okey → `/araclar/101-yazboz`, `/araclar/okey-sayaci`
- Batak / King → `/araclar/batak-yazboz`
- Herhangi oyun → `/araclar/skor-tablosu`

### Footer link equity

Footer'daki Keşfet linkleri crawl budget için kritik — tüm tier-1 sayfalara path max 2 tık.

---

## 11. Araç Sayfaları SEO

### Unique value proposition (her araç sayfasında H2 altında)

1. **Problem:** "Masada kağıt kalem mi arıyorsunuz?"
2. **Çözüm:** "Bu araç otomatik hesaplar"
3. **Fark:** "Kayıt yok, ücretsiz, mobil"

### Long-tail hedefler

```
101 okey ceza puanları tablosu
101 okey el sayısı kaç
düşmeli okey kaç puandan başlar
batak king yazboz excel alternatifi
online zar at tavla
```

### İçerik bloğu önerisi (helpContent üstüne)

300 kelimelik SEO paragrafı: aracın ne işe yaradığı, hangi oyunla kullanıldığı, adım adım kullanım — **doğal keyword yoğunluğu %1-2**.

---

## 12. Karşılaştırma Sayfaları SEO

### Title pattern
`{A} vs {B}: Farklar, Kurallar ve Hangisi Seçilmeli?`

### İçerik yapısı (SERP featured list için)

1. H1: `{A} vs {B}`
2. H2: Hızlı karşılaştırma tablosu
3. H2: `{A} nedir?` + kısa özet + link
4. H2: `{B} nedir?` + kısa özet + link
5. H2: Hangisi kimler için?
6. H2: SSS

### Cannibalization önleme

Karşılaştırma sayfası oyun detay sayfasının yerine geçmemeli — farklı intent. Oyun detayda "Benzer oyunlar" linki, karşılaştırmada "Detaylı kurallar" linki.

---

## 13. FAQ & Featured Snippet Stratejisi

### Snippet-friendly soru formatları

```
{Oyun} kaç kişiyle oynanır?
{Oyun} ne kadar sürer?
{Oyun} nasıl kazanılır?
{Oyun} ile {Diğer oyun} arasındaki fark nedir?
{Oyun} ceza puanları nelerdir?
```

### Cevap formatı (40-60 kelime, doğrudan cevap ilk cümlede)

**Örnek:**
> **Okey kaç kişiyle oynanır?**  
> Okey 4 kişiyle oynanır. Her oyuncuya 14 taş dağıtılır; ilk oyuncuya 15 taş verilir ve oyunu o başlatır.

### FAQ schema — ana sayfa (mevcut, genişlet)

Eklenebilecek sorular:
- Tavla nasıl oynanır?
- Mangala nedir?
- Geleneksel Türk oyunları nelerdir?

---

## 14. Görsel & Image SEO

### Dosya adlandırma
```
okey-oyunu-kurallari.jpg  ✓
IMG_2847.jpg              ✗
```

### Alt text formülü
```
{Oyun adı} oyunu — {kategori} oyunu görseli
```

### OG Image gereksinimleri
- Boyut: 1200×630 px
- Format: JPG veya PNG
- Metin: marka + slogan (okunaklı)
- Dosya: `/public/og-image.jpg` — **varlığını doğrula**

### Image sitemap
`generate-sitemap.js` image extension kullanıyor — deploy öncesi script çalıştır.

---

## 15. Teknik SEO

### 15.1 Canonical stratejisi

| URL | Canonical |
|-----|-----------|
| `/oyunlar` | `/oyunlar` |
| `/oyunlar?search=okey` | Kendisi (SearchAction) veya `/oyunlar` (duplicate riski varsa noindex param) |
| `/oyun/okey` | `/oyun/okey` |
| Trailing slash | Tutarlı — slash'sız tercih |

### 15.2 robots.txt (mevcut — iyi)

- ✓ Admin, profil, auth disallow
- ✓ SearchAction search param allow
- ✓ Sitemap referansları
- ⚠ `Crawl-delay` Google tarafından yok sayılır (Bing/Yandex için OK)
- ⚠ `/auth` sitemap'te var ama robots'ta disallow — **sitemap'ten çıkar**

### 15.3 Hreflang

Tek dil (tr-TR) — mevcut yapı yeterli:
```html
<link rel="alternate" hreflang="tr" href="https://nasiloynanir.com/" />
<link rel="alternate" hreflang="x-default" href="https://nasiloynanir.com/" />
```

### 15.4 JavaScript SEO (kritik)

Site **CSR (Client-Side Rendering)**. Google JS render eder ama:
- İlk crawl gecikebilir
- Bing/Yandex daha zayıf
- Sosyal botlar (Facebook) kısmi

**Önerilen çözüm sırası:**
1. **Prerender** (vite-plugin-prerender veya prerender.io) — P0
2. **SSR** (Remix/Next migration) — uzun vade
3. **Dynamic rendering** — geçici

### 15.5 Kritik bug'lar (SEO etkisi)

| Bug | SEO etkisi | Fix |
|-----|------------|-----|
| Geçersiz oyun slug → sonsuz skeleton | Soft 404, crawl budget waste | 404 + noindex |
| Eski sitemap (araclar yok) | Sayfalar indexlenmez | `npm run generate-sitemap` |
| Analytics consent öncesi | KVKK riski | Consent gate |
| `GameInfo` footer "kuralin.ne" | Marka tutarsızlığı | nasiloynanir.com |

---

## 16. Sitemap & robots.txt

### Sitemap üretimi

```bash
# .env dosyasında Supabase credentials gerekli
node scripts/generate-sitemap.js
```

**Üretilen dosyalar:**
- `public/sitemap.xml` (ana)
- `public/sitemap-games.xml` (oyunlar)
- `public/sitemap-index.xml` (index)

### URL öncelik matrisi

| Tip | priority | changefreq |
|-----|----------|------------|
| Ana sayfa | 1.0 | daily |
| Oyun detay | 0.9 | weekly |
| Oyunlar listesi | 0.9 | daily |
| Kategori | 0.8 | weekly |
| Araçlar | 0.8 | weekly |
| Araç detay | 0.7 | monthly |
| Karşılaştırma | 0.7 | monthly |
| Kurumsal | 0.5-0.6 | monthly |

### Deploy checklist

- [ ] Sitemap güncel mi?
- [ ] Search Console'a sitemap submit
- [ ] robots.txt'deki sitemap URL'leri erişilebilir mi?
- [ ] 404 test URL'leri döndürüyor mu?

---

## 17. CSR Sınırlaması & Prerender Yol Haritası

### Faz 1 — Hızlı kazanım (1-2 gün)
- `vite-plugin-ssr` veya `vite-plugin-prerender` ile statik HTML üret
- Prerender listesi: `/`, `/oyunlar`, `/araclar`, top 20 oyun, tüm kategoriler

### Faz 2 — Dinamik prerender (1 hafta)
- Build sonrası Supabase'den slug listesi → tüm oyun sayfaları prerender
- Karşılaştırma sayfaları prerender

### Faz 3 — SSR migration (1-3 ay)
- Next.js App Router veya Remix
- Server-side data fetch + streaming

---

## 18. Google Search Console & Ölçümleme

### Kurulum checklist

- [ ] Domain property: `nasiloynanir.com`
- [ ] Sitemap submit: `sitemap-index.xml`
- [ ] URL inspection: top 10 oyun
- [ ] Core Web Vitals raporu
- [ ] Manual actions kontrolü

### Google Analytics 4 eventleri (SEO insight)

| Event | Parametre |
|-------|-----------|
| `page_view` | page_path |
| `search` | search_term |
| `game_view` | game_name, game_id |
| `tool_use` | tool_name |

### Search Console izlenecek metrikler

- Impressions / Clicks / CTR / Position (top 50 query)
- Coverage errors (404, soft 404, redirect)
- Mobile usability
- Rich results (FAQ, HowTo)

---

## 19. Core Web Vitals & Performans SEO

### Mevcut riskler

- JS bundle ~866 KB (gzip ~232 KB) — LCP etkiler
- Supabase client ilk yüklemede
- Google Fonts render-blocking

### Hedefler

| Metrik | Hedef |
|--------|-------|
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |

### Optimizasyon önerileri

1. Route-based code splitting (React.lazy)
2. Admin panel ayrı chunk (zaten ayrı route)
3. Font subsetting (Latin + Turkish)
4. Image lazy loading (mevcut — genişlet)
5. Preload LCP image (hero)

---

## 20. Sosyal Medya & Open Graph

### Paylaşım URL yapısı
```
https://nasiloynanir.com/oyun/{slug}
```

### OG tag checklist (SEO.jsx — mevcut)

- og:title, og:description, og:image (1200×630)
- twitter:card = summary_large_image
- twitter:site = @nasiloynanir

### Pinterest / WhatsApp

WhatsApp preview = OG tags. Pişti/Batak gibi görselli oyunlarda paylaşım CTR yüksek.

---

## 21. Rakip & SERP Analizi Çerçevesi

### Rakip tipleri

1. **Wiki / blog:** genel içerik, düşük derinlik
2. **Forum:** Quora, Ekşi, Reddit TR
3. **Video:** YouTube "okey nasıl oynanır"
4. **Uygulama store:** oyun indirme (farklı intent)

### SERP feature hedefleme

| Feature | Nasıl kazanılır |
|---------|-----------------|
| Featured snippet | FAQ + kısa cevap ilk paragraf |
| People Also Ask | FAQ schema + H2 sorular |
| Video carousel | VideoObject schema + YouTube embed |
| Sitelinks search box | SearchAction schema (✓ mevcut) |
| Rich stars | AggregateRating schema |

### Aylık rakip takibi (manuel)

1. Top 10 keyword için SERP screenshot
2. Rakip title/description analizi
3. Content gap listesi

---

## 22. 12 Aylık İçerik Takvimi

| Ay | Odak | Aksiyon |
|----|------|---------|
| 1 | Teknik temel | Sitemap, GSC, prerender top 20 |
| 2 | Okey cluster | 101, düz, perişan varyant iç linkleri |
| 3 | Batak cluster | ihaleli, eşli, gömmeli sayfalar |
| 4 | Çocuk oyunları | saklambaç, körebe, yakan top SEO |
| 5 | Araç SEO | 7 araç sayfası 500+ kelime içerik |
| 6 | Karşılaştırma | 10 yeni X vs Y sayfası |
| 7 | FAQ genişletme | Her oyuna +3 FAQ |
| 8 | Video SEO | Top 5 oyuna YouTube embed |
| 9 | Kutu oyunları | Monopoly, UNO, Tabu içerik |
| 10 | Blog / rehber | "Aile oyunları gecesi" hub sayfası |
| 11 | Link building | Kültür/education backlink |
| 12 | Review & refresh | Eski sayfaları güncelle (dateModified) |

---

## 23. Link Building & Dış SEO

### White-hat fırsatlar

1. **Kültür portalları** — geleneksel oyunlar listesi guest post
2. **Eğitim** — "sınıfta oynanabilecek oyunlar" rehberi
3. **Yerel medya** — "Türk oyun mirası dijitalleşiyor" haber
4. **Forum katılımı** — Ekşi/Reddit'te kaynak olarak site linki (spam değil)
5. **Araç embed** — "Sitemize yazboz ekleyin" widget (ileri seviye)

### Kaçınılacaklar

- Satın backlink paketleri
- PBN
- Anchor text over-optimization

---

## 24. KPI'lar & Başarı Metrikleri

### 3 ay hedefleri

| KPI | Hedef |
|-----|-------|
| Indexlenen sayfa | 100+ |
| Organik tıklama/ay | 1.000+ |
| Ortalama pozisyon (top 20 kw) | < 20 |
| Rich result görünüm | FAQ + HowTo |

### 12 ay hedefleri

| KPI | Hedef |
|-----|-------|
| Organik tıklama/ay | 10.000+ |
| Top 3 keyword sayısı | 15+ |
| Domain Rating | 20+ |
| Core Web Vitals | Tümü "Good" |

### Raporlama sıklığı

- **Haftalık:** GSC clicks, impressions
- **Aylık:** Keyword ranking, content published, technical audit
- **Çeyreklik:** Full SEO audit, competitor review

---

## 25. Acil Aksiyon Listesi (Öncelik Sırası)

### P0 — Yayın öncesi (1-3 gün)

- [ ] `node scripts/generate-sitemap.js` çalıştır ve deploy et
- [ ] Google Search Console kur + sitemap submit
- [ ] `og-image.jpg` var mı kontrol et (1200×630)
- [ ] Geçersiz oyun slug → 404 düzelt
- [ ] Çerez onayı → analitik gate (KVKK)
- [ ] `/auth` sitemap'ten çıkar

### P1 — İlk hafta

- [ ] Top 10 oyun için description optimizasyonu
- [ ] Her araç sayfasına 300 kelime SEO metni
- [ ] WebApplication schema araçlara ekle
- [ ] `sameAs` schema'ya sosyal medya linkleri
- [ ] Google site verification meta tag

### P2 — İlk ay

- [ ] Prerender top 30 sayfa
- [ ] `/site-haritasi` HTML sitemap sayfası
- [ ] Karşılaştırma sayfaları içerik genişletme
- [ ] Bundle splitting (performans)
- [ ] Bing Webmaster Tools

### P3 — Devam eden

- [ ] Aylık sitemap regen (CI/CD hook)
- [ ] Content refresh cycle
- [ ] Link building
- [ ] SSR/SSG migration değerlendirmesi

---

## Ek: Kod Referansları

| Dosya | Amaç |
|-------|------|
| `src/constants/seo.js` | Merkezi SEO config + schema generators |
| `src/constants/seoKeywords.js` | Anahtar kelime kümeleri + meta şablonları |
| `src/components/common/SEO.jsx` | Helmet meta + JSON-LD |
| `scripts/generate-sitemap.js` | Dinamik sitemap üretici |
| `public/robots.txt` | Crawl direktifleri |
| `index.html` | Static fallback meta + schema |

---

## Ek: Hızlı Copy-Paste Şablonları

### Yeni oyun eklendiğinde

```
Title: {NAME} Kuralı Ne?
Description: {NAME} kuralı ne? {1 cümle özet}. {players} kişi, {difficulty} seviye. Kurallar, ipuçları ve SSS.
Keywords: {name} kuralı ne, {name} nasıl oynanır, {name} kuralları, {category}
Schema: HowTo + Game + Article + Breadcrumb
Sitemap: generate-sitemap.js çalıştır
Internal links: kategori + 2 benzer oyun + ilgili araç
```

### Yeni araç eklendiğinde

```
Title: {TOOL} - {Fayda} | Kuralı Ne?
Description: {TOOL}: {fayda cümlesi}. Ücretsiz, kayıtsız, mobil uyumlu oyun aracı.
Schema: WebApplication
Sitemap: TOOL_PAGES array'e ekle
Cross-link: ilgili oyun detay sayfasından link
```

---

## 26. Dinamik SEO Motoru (seoEngine.js)

> **Kaynak kod:** `src/lib/seoEngine.js`  
> **Admin önizleme:** `src/components/admin/GameSeoPreview.jsx`

Supabase'den yüklenen oyun verisine göre meta, FAQ ve JSON-LD **otomatik** üretilir. Admin panelde manuel SEO alanı yok — form alanları dolduruldukça motor çıktıyı hesaplar.

### Girdi alanları → SEO çıktısı

| Admin alanı | Üretilen SEO |
|-------------|--------------|
| `name`, `slug` | Title: `{name} Kuralı Ne?`, URL, anahtar kelime çekirdeği |
| `shortDescription`, `description` | Meta description, Article/Game schema |
| `category` | Kategori anahtar kelimeleri, `article:section`, genre |
| `players` | Otomatik FAQ: "Kaç kişiyle oynanır?", QuantitativeValue schema |
| `difficulty` | FAQ + description parçası |
| `playTimeMinutes` | FAQ + `timeRequired` schema + description |
| `rules[]` | HowTo schema adımları, kural sayısı description'da, kural metninden keyword çıkarımı |
| `tips[]` | HowToTip schema, otomatik FAQ |
| `faq[]` (admin) | FAQPage schema — **öncelikli**; otomatik FAQ ile birleştirilir |
| `videoUrl`, `videoTitle` | VideoObject schema, otomatik FAQ |
| `image` | OG/Twitter görseli, Game schema image |
| Yorum puanları (runtime) | AggregateRating schema (HowTo + Game) |

### Otomatik FAQ mantığı

1. Admin'in girdiği SSS → doğrudan kullanılır  
2. Eksik alanlar için motor üretir: oyuncu sayısı, zorluk, süre, nasıl oynanır, kategori, ipucu, video  
3. Aynı soru metni tekrarlanmaz (admin öncelikli)  
4. Maksimum 12 SSS — sayfada `FAQAccordion` + JSON-LD aynı listeyi kullanır  

### İsim/kategori zekâsı

- **Okey, 101, Batak, Pişti, Tavla** vb. için ek long-tail keyword'ler (`NAME_PATTERN_BOOSTS`)
- **Kağıt/Masa/Kutu/Dış Mekan** kategorileri için synonym keyword'ler
- Kural metinlerinden 3+ harfli kelime çıkarımı (Türkçe stop-word filtresi)

### Sayfa entegrasyonları

| Sayfa | Fonksiyon |
|-------|-----------|
| `/oyun/:slug` | `buildGameSeoMeta`, `buildGameStructuredData` |
| `/kategori/:name` | `buildCategorySeoMeta` — listedeki oyun isimleri description'a eklenir |
| `/karsilastir/:a-vs-:b` | `buildComparisonSeoMeta` — oyuncu/zorluk/süre/kural sayısı karşılaştırmalı |
| `/oyunlar` | `buildAllGamesSeoMeta` — arama + kategori filtresine göre |
| `/` | `buildHomeSeoMeta`, `buildHomeFaqs` — DB'deki oyun sayısı ve popüler isimler |
| `/araclar/*` | `buildToolSeoMeta`, `buildToolStructuredData` (WebApplication) |

### Admin SEO skoru (0–100)

`previewGameSeo(formData)` admin modalda canlı gösterir:

- Google snippet simülasyonu  
- Title/description karakter sayacı  
- Schema türleri listesi  
- FAQ sayısı (admin + otomatik ayrımı)  
- Eksik alan uyarıları ve iyileştirme önerileri  

**85+** Mükemmel · **70+** İyi · **50+** Orta · altı Zayıf

### Yeni oyun eklerken checklist (otomatik)

Motor çalıştığı için manuel meta yazmaya gerek yok; admin formunu doldur:

1. ✅ İsim + slug  
2. ✅ Kısa açıklama (40–120 karakter ideal)  
3. ✅ En az 3 kural  
4. ✅ Oyuncu sayısı + zorluk  
5. ✅ Kapak görseli  
6. ⭐ 2–3 admin SSS (featured snippet için)  
7. ⭐ Oyun süresi + video URL (rich result bonus)  

---

*Bu doküman Kuralı Ne? projesinin canlı SEO referansıdır. Kod değişikliklerinde `src/constants/seo.js`, `src/constants/seoKeywords.js` ve `src/lib/seoEngine.js` dosyalarıyla senkron tutulmalıdır.*
