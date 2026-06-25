# SEO Rehberi - Nasıl Oynanır

Bu döküman, Nasıl Oynanır web sitesinin SEO (Arama Motoru Optimizasyonu) yapısını ve nasıl kullanılacağını açıklar.

## İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [SEO Bileşeni Kullanımı](#seo-bileşeni-kullanımı)
3. [Breadcrumb Kullanımı](#breadcrumb-kullanımı)
4. [Structured Data (Schema.org)](#structured-data-schemaorg)
5. [Sitemap Yönetimi](#sitemap-yönetimi)
6. [Meta Tag Referansı](#meta-tag-referansı)
7. [En İyi Uygulamalar](#en-iyi-uygulamalar)
8. [Sorun Giderme](#sorun-giderme)

---

## Genel Bakış

SEO yapısı şu bileşenlerden oluşur:

```
src/
├── constants/
│   └── seo.js              # SEO yapılandırma ve şablonları
├── components/
│   └── common/
│       ├── SEO.jsx         # Ana SEO bileşeni
│       └── Breadcrumb.jsx  # Breadcrumb bileşeni
scripts/
└── generate-sitemap.js     # Sitemap oluşturucu
public/
├── robots.txt              # Crawler kuralları
├── sitemap.xml             # Ana sitemap
├── sitemap-games.xml       # Oyunlar sitemap
└── sitemap-index.xml       # Sitemap indeksi
```

---

## SEO Bileşeni Kullanımı

### Temel Kullanım

```jsx
import SEO from '../../components/common/SEO';

function MyPage() {
  return (
    <div>
      <SEO 
        title="Sayfa Başlığı"
        description="Sayfa açıklaması - 150-160 karakter arasında olmalı."
        keywords="anahtar, kelimeler, virgülle, ayrılmış"
        url="/sayfa-url"
      />
      {/* Sayfa içeriği */}
    </div>
  );
}
```

### Gelişmiş Kullanım (Article/Blog)

```jsx
<SEO 
  title="Okey Nasıl Oynanır?"
  description="Okey oyununun detaylı kuralları ve stratejileri."
  keywords="okey, nasıl oynanır, kuralları"
  image="https://example.com/okey.jpg"
  url="/oyun/okey"
  type="article"
  publishedTime="2024-01-15T10:00:00Z"
  modifiedTime="2024-01-20T15:30:00Z"
  section="Masa Oyunları"
  tags={['okey', 'masa oyunları', 'türk oyunları']}
  structuredData={mySchema}
  breadcrumbs={[
    { name: 'Tüm Oyunlar', url: '/oyunlar' },
    { name: 'Okey', url: null }
  ]}
/>
```

### Tüm Props

| Prop | Tip | Varsayılan | Açıklama |
|------|-----|------------|----------|
| `title` | string | - | Sayfa başlığı |
| `description` | string | DEFAULT_META.description | Meta açıklama |
| `keywords` | string | DEFAULT_META.keywords | Anahtar kelimeler |
| `image` | string | defaultImage | OG/Twitter görseli |
| `url` | string | '' | Canonical URL (path) |
| `type` | string | 'website' | OG tipi (website, article) |
| `structuredData` | object/array | - | JSON-LD şemaları |
| `robots` | string | 'index, follow' | Robots direktifi |
| `author` | string | SITE_CONFIG.author | Yazar |
| `publishedTime` | string | - | Yayın tarihi (ISO) |
| `modifiedTime` | string | - | Güncelleme tarihi |
| `section` | string | - | Makale bölümü |
| `tags` | array | [] | Makale etiketleri |
| `noindex` | boolean | false | Sayfayı indexleme |
| `breadcrumbs` | array | - | Breadcrumb öğeleri |
| `locale` | string | 'tr_TR' | Dil/bölge |

---

## Breadcrumb Kullanımı

### Temel Kullanım

```jsx
import Breadcrumb from '../../components/common/Breadcrumb';

function MyPage() {
  const breadcrumbs = [
    { name: 'Kategori', url: '/kategori' },
    { name: 'Alt Sayfa', url: null } // Son öğe, link yok
  ];

  return (
    <div>
      <Breadcrumb items={breadcrumbs} />
      {/* Sayfa içeriği */}
    </div>
  );
}
```

### Hazır Şablonlar

```jsx
import { BREADCRUMB_TEMPLATES } from '../../components/common/Breadcrumb';

// Oyun detay sayfası için
const breadcrumbs = BREADCRUMB_TEMPLATES.gameDetail('Okey', 'Masa Oyunları');

// Kategori sayfası için
const breadcrumbs = BREADCRUMB_TEMPLATES.category('Kağıt Oyunları');

// Araç sayfası için
const breadcrumbs = BREADCRUMB_TEMPLATES.tool('Okey Sayacı');
```

### Props

| Prop | Tip | Varsayılan | Açıklama |
|------|-----|------------|----------|
| `items` | array | [] | Breadcrumb öğeleri |
| `showHome` | boolean | true | Ana sayfa linki göster |
| `className` | string | '' | Ek CSS sınıfları |
| `compact` | boolean | false | Kompakt görünüm |
| `separator` | string | 'chevron' | Ayırıcı tipi |

---

## Structured Data (Schema.org)

### Mevcut Şema Fonksiyonları

```js
import { 
  generateGameSchema,
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateItemListSchema,
  generateCollectionPageSchema,
  SCHEMA_TEMPLATES
} from '../../constants/seo';
```

### Oyun Şeması (HowTo)

```jsx
const gameSchema = generateGameSchema(game);
// {
//   "@type": "HowTo",
//   "name": "Okey Nasıl Oynanır",
//   "step": [...],
//   "tip": [...]
// }
```

### Article Şeması

```jsx
const articleSchema = generateArticleSchema(game);
// {
//   "@type": "Article",
//   "headline": "...",
//   "author": {...},
//   "datePublished": "..."
// }
```

### FAQ Şeması

```jsx
const faqSchema = generateFAQSchema([
  { question: 'Okey nasıl oynanır?', answer: '...' },
  { question: 'Kaç kişi ile oynanır?', answer: '...' }
]);
```

### ItemList Şeması (Oyun Listesi)

```jsx
const listSchema = generateItemListSchema(games, 'Popüler Oyunlar');
```

---

## Sitemap Yönetimi

### Sitemap Oluşturma

```bash
# Sitemap'i yeniden oluştur
npm run build:sitemap

# veya
node scripts/generate-sitemap.js
```

### Oluşturulan Dosyalar

- `public/sitemap.xml` - Ana sitemap (tüm sayfalar)
- `public/sitemap-games.xml` - Sadece oyunlar
- `public/sitemap-index.xml` - Sitemap indeksi

### Otomatik Güncelleme

Sitemap'i şu durumlarda yeniden oluşturun:
- Yeni oyun eklendiğinde
- Yeni sayfa eklendiğinde
- Kategori değişikliğinde
- Deploy öncesi

---

## Meta Tag Referansı

### Temel Meta Tags

| Tag | Kullanım |
|-----|----------|
| `<title>` | Sayfa başlığı - max 60 karakter |
| `meta description` | Açıklama - 150-160 karakter |
| `meta keywords` | Anahtar kelimeler (isteğe bağlı) |
| `link canonical` | Canonical URL |

### Open Graph Tags

| Tag | Kullanım |
|-----|----------|
| `og:title` | Başlık (sosyal medya) |
| `og:description` | Açıklama |
| `og:image` | Görsel (1200x630 önerilir) |
| `og:url` | Sayfa URL'i |
| `og:type` | website / article |
| `og:locale` | tr_TR |

### Twitter Cards

| Tag | Kullanım |
|-----|----------|
| `twitter:card` | summary_large_image |
| `twitter:title` | Başlık |
| `twitter:description` | Açıklama |
| `twitter:image` | Görsel |

---

## En İyi Uygulamalar

### Başlıklar (Titles)

✅ **Doğru:**
- "Okey Nasıl Oynanır? Kuralları ve İpuçları - Nasıl Oynanır"
- "Batak Oyunu Rehberi: Detaylı Kurallar - Nasıl Oynanır"

❌ **Yanlış:**
- "Okey" (çok kısa)
- "Okey Nasıl Oynanır Detaylı Rehber Kurallar İpuçları Stratejiler..." (çok uzun)

### Açıklamalar (Descriptions)

✅ **Doğru:**
- "Okey nasıl oynanır? 4 kişiyle oynanan bu geleneksel Türk oyununun kurallarını, stratejilerini ve püf noktalarını öğrenin. Adım adım rehber!"

❌ **Yanlış:**
- "Okey oyunu." (çok kısa, bilgi yok)
- Aynı açıklamayı birden fazla sayfada kullanmak

### Görseller

- OG görseli: 1200x630 piksel
- Alt text her zaman ekleyin
- Dosya boyutunu optimize edin (WebP tercih edin)

### URL Yapısı

✅ **Doğru:**
- `/oyun/101-okey`
- `/kategori/kagit-oyunlari`

❌ **Yanlış:**
- `/game?id=123`
- `/kategori/Ka%C4%9F%C4%B1t%20Oyunlar%C4%B1` (Türkçe karakterler encode edilmiş)

---

## Sorun Giderme

### Schema Validation

Schema'ları test etmek için:
1. [Google Rich Results Test](https://search.google.com/test/rich-results)
2. [Schema.org Validator](https://validator.schema.org/)

### Meta Tag Kontrolü

```bash
# Sayfa meta tag'lerini kontrol et
curl -s "https://kuraline.xyz/oyun/okey" | grep -E "<title>|<meta"
```

### Sitemap Kontrolü

1. `https://kuraline.xyz/sitemap.xml` adresini ziyaret edin
2. XML doğrulaması için: [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)

### Google Search Console

1. Search Console'a sitemap'i gönderin
2. Index Coverage raporunu kontrol edin
3. Mobile Usability sorunlarını düzeltin

---

## Checklist: Yeni Sayfa Ekleme

- [ ] SEO bileşeni eklendi
- [ ] Title ve description optimize edildi
- [ ] Breadcrumb eklendi
- [ ] Structured data eklendi (gerekiyorsa)
- [ ] Canonical URL doğru
- [ ] OG görseli var
- [ ] Sitemap güncellendi
- [ ] robots.txt kontrol edildi

---

## Kaynaklar

- [Google SEO Başlangıç Rehberi](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Schema.org](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Google Search Console](https://search.google.com/search-console)

---

*Son güncelleme: Ocak 2026*
