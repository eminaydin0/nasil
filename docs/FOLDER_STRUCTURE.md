# Proje Klasör Yapısı

Bu proje profesyonel bir React klasör yapısı kullanmaktadır.

## Dizin Yapısı

```
src/
├── components/              # Tüm yeniden kullanılabilir componentler
│   ├── common/             # Ortak, genel amaçlı componentler
│   │   ├── LoadingSpinner.jsx
│   │   ├── SkeletonLoader.jsx
│   │   ├── StarRating.jsx
│   │   └── index.js        # Barrel export
│   │
│   ├── layout/             # Layout componentleri
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── index.js
│   │
│   ├── home/               # Ana sayfa componentleri
│   │   ├── CategoryCard.jsx
│   │   ├── FeatureCard.jsx
│   │   ├── GameCard.jsx
│   │   ├── GameOfTheDay.jsx
│   │   ├── GameRecommendations.jsx
│   │   ├── TestimonialCard.jsx
│   │   └── index.js
│   │
│   ├── game/               # Oyun detay sayfası componentleri
│   │   ├── CommentSection.jsx
│   │   ├── SocialShare.jsx
│   │   └── index.js
│   │
│   └── admin/              # Admin panel componentleri
│       ├── AdminHeader.jsx
│       ├── AdminLogin.jsx
│       ├── AdminStats.jsx
│       ├── AnalyticsDashboard.jsx
│       ├── CommentsManager.jsx
│       ├── GameModal.jsx
│       ├── GamesTable.jsx
│       ├── TopGames.jsx
│       └── index.js
│
├── pages/                  # Sayfa componentleri
│   ├── HomePage/
│   │   └── index.jsx
│   ├── GameDetail/
│   │   └── index.jsx
│   └── AdminPanel/
│       └── index.jsx
│
├── lib/                    # Üçüncü parti kütüphane konfigürasyonları
│   └── supabase.js
│
├── utils/                  # Yardımcı fonksiyonlar
│   └── analytics.js
│
├── data/                   # Statik veri dosyaları
│   ├── games.js
│   └── games.js.backup
│
├── assets/                 # Statik dosyalar (resimler, fontlar, vb.)
│
├── App.jsx                 # Ana uygulama component'i
├── main.jsx               # Uygulama giriş noktası
└── index.css              # Global stiller
```

## Import Kuralları

### Barrel Exports Kullanımı

Her klasörde `index.js` dosyası bulunur ve componentleri export eder:

```javascript
// ✅ Önerilen
import { LoadingSpinner, SkeletonLoader } from '@/components/common';
import { Header, Footer } from '@/components/layout';

// ❌ Önerilmeyen
import LoadingSpinner from '@/components/common/LoadingSpinner';
import SkeletonLoader from '@/components/common/SkeletonLoader';
```

### Relative Imports

Dosyalar arası importlarda relative path kullanılır:

```javascript
// pages/HomePage/index.jsx içinde
import { GameCard } from '../../components/home';
import { SkeletonLoader } from '../../components/common';

// components/game/CommentSection.jsx içinde
import { StarRating } from '../common';
import { supabase } from '../../lib/supabase';
```

## Component Organizasyon Prensipleri

### 1. Common Components
Tüm proje boyunca kullanılabilen, bağımsız componentler:
- **LoadingSpinner**: Yükleme animasyonu
- **SkeletonLoader**: İskelet ekran yükleyici
- **StarRating**: Yıldız rating componenti

### 2. Layout Components
Sayfa düzeni için kullanılan componentler:
- **Header**: Site başlığı ve navigasyon
- **Footer**: Site alt bilgi

### 3. Feature-Based Components
Belirli sayfalara/özelliklere özel componentler:
- **home/**: Ana sayfa componentleri
- **game/**: Oyun detay sayfası componentleri
- **admin/**: Admin panel componentleri

## Yeni Component Ekleme

1. Uygun klasörü belirle (common, layout, home, game, admin)
2. Component dosyasını oluştur
3. İlgili `index.js` dosyasına export ekle

```javascript
// components/common/NewComponent.jsx
function NewComponent() {
  return <div>New Component</div>;
}
export default NewComponent;

// components/common/index.js
export { default as NewComponent } from './NewComponent';
```

## Naming Conventions

- **Component dosyaları**: PascalCase (örn: `GameCard.jsx`)
- **Utility dosyaları**: camelCase (örn: `analytics.js`)
- **Klasörler**: camelCase (örn: `components/home`)
- **Page klasörleri**: PascalCase (örn: `pages/HomePage`)

## Best Practices

1. ✅ Her component kendi dosyasında olmalı
2. ✅ İlgili componentler birlikte gruplanmalı
3. ✅ Barrel exports kullanılmalı
4. ✅ Relative imports net ve tutarlı olmalı
5. ✅ Component içinde business logic minimum olmalı
6. ✅ Büyük componentler daha küçük parçalara ayrılmalı
