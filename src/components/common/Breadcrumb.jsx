import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * SEO-Friendly Breadcrumb Bileşeni
 * 
 * Navigation ve Schema.org markup ile birlikte breadcrumb gösterir
 * 
 * @param {array} items - Breadcrumb öğeleri [{name, url}]
 * @param {boolean} showHome - Ana sayfa linkini göster
 * @param {string} className - Ek CSS sınıfları
 * @param {boolean} compact - Kompakt görünüm (sadece mobil)
 * @param {string} separator - Ayırıcı ('chevron' veya 'slash')
 */
const Breadcrumb = ({ 
  items = [], 
  showHome = true, 
  className = '',
  compact = false,
  separator = 'chevron'
}) => {
  const location = useLocation();

  // Ana sayfa öğesini başa ekle
  const breadcrumbItems = showHome 
    ? [{ name: 'Ana Sayfa', url: '/' }, ...items]
    : items;

  // Boşsa gösterme
  if (breadcrumbItems.length === 0) return null;

  // Ayırıcı bileşeni
  const Separator = () => (
    separator === 'chevron' ? (
      <ChevronRight className="w-4 h-4 text-warm-400 shrink-0" />
    ) : (
      <span className="text-warm-400 mx-1">/</span>
    )
  );

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`${className}`}
    >
      <ol 
        className={`flex items-center ${compact ? 'flex-wrap' : ''} gap-1 text-sm`}
        itemScope 
        itemType="https://schema.org/BreadcrumbList"
      >
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const isHome = index === 0 && showHome;

          return (
            <li 
              key={index}
              className="flex items-center gap-1"
              itemProp="itemListElement" 
              itemScope 
              itemType="https://schema.org/ListItem"
            >
              {/* Ayırıcı (ilk öğede yok) */}
              {index > 0 && <Separator />}

              {isLast ? (
                // Son öğe - aktif sayfa (link değil)
                <span 
                  className="text-warm-900 font-medium truncate max-w-[200px]"
                  itemProp="name"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                // Link olan öğeler
                <Link
                  to={item.url}
                  className="text-warm-500 hover:text-orange-600 transition-colors flex items-center gap-1 group"
                  itemProp="item"
                >
                  {isHome && (
                    <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  )}
                  <span itemProp="name" className={isHome && !compact ? 'sr-only sm:not-sr-only' : ''}>
                    {item.name}
                  </span>
                </Link>
              )}

              {/* Schema.org position */}
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

/**
 * Sayfa bazlı otomatik breadcrumb oluşturucu
 * URL'den breadcrumb items oluşturur
 */
export function generateBreadcrumbsFromPath(pathname, customNames = {}) {
  const paths = pathname.split('/').filter(Boolean);
  const items = [];

  // URL segment'lerini breadcrumb'a çevir
  const segmentNames = {
    'oyunlar': 'Tüm Oyunlar',
    'oyun': 'Oyun',
    'kategori': 'Kategori',
    'araclar': 'Araçlar',
    'hakkimizda': 'Hakkımızda',
    'iletisim': 'İletişim',
    'auth': 'Giriş',
    'profil': 'Profilim',
    ...customNames,
  };

  let currentPath = '';
  
  paths.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Dinamik segment'leri atla (slug gibi) - son öğe için özel işlem yapılır
    if (index === paths.length - 1 && !segmentNames[segment]) {
      // Son segment dinamik, dışarıdan isim verilmeli
      return;
    }

    const name = segmentNames[segment] || decodeURIComponent(segment);
    
    items.push({
      name,
      url: currentPath,
    });
  });

  return items;
}

/**
 * Hazır breadcrumb şablonları
 */
export const BREADCRUMB_TEMPLATES = {
  // Oyun detay sayfası
  gameDetail: (gameName, category) => [
    { name: 'Tüm Oyunlar', url: '/oyunlar' },
    ...(category ? [{ name: category, url: `/kategori/${encodeURIComponent(category)}` }] : []),
    { name: gameName, url: null }, // Son öğe, URL yok
  ],

  // Kategori sayfası
  category: (categoryName) => [
    { name: 'Tüm Oyunlar', url: '/oyunlar' },
    { name: categoryName, url: null },
  ],

  // Araç sayfası
  tool: (toolName) => [
    { name: 'Araçlar', url: '/araclar' },
    { name: toolName, url: null },
  ],

  // Basit sayfalar
  simple: (pageName) => [
    { name: pageName, url: null },
  ],
};

export default Breadcrumb;
