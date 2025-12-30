# Analytics Implementation - Supabase Integration

## 📊 Genel Bakış

Site artık Supabase tabanlı kapsamlı bir analytics sistemi kullanıyor. Tüm kullanıcı etkinlikleri gerçek zamanlı olarak `analytics_events` tablosuna kaydediliyor.

## 🗄️ Veritabanı Şeması

### Analytics Events Tablosu
```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB,
  game_id INTEGER,
  session_id VARCHAR(255),
  user_agent TEXT,
  ip_hash VARCHAR(64),
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Event Tipleri
- **page_view**: Sayfa görüntülemeleri
- **game_view**: Oyun detay sayfası görüntülemeleri
- **comment_submit**: Yorum gönderme
- **share_click**: Sosyal medya paylaşımları
- **search**: Arama sorguları
- **session_duration**: Oturum süreleri
- **device_info**: Cihaz bilgileri
- **traffic_source**: Trafik kaynakları

## 📈 Analytics Views

### 1. daily_analytics
Günlük istatistikler - event tiplerine göre günlük sayılar

### 2. game_analytics
Oyun bazlı metrikler - görüntülenme, yorum, paylaşım sayıları

### 3. hourly_traffic
Saatlik trafik analizi - son 7 günün saatlik verileri

### 4. recent_activity
Son 24 saatteki aktiviteler

### 5. weekly_summary
Haftalık özet raporlar

### 6. top_games_weekly
En popüler oyunlar - engagement score ile sıralı

## 🔧 Kullanılan Fonksiyonlar

### src/utils/analytics.js

#### Temel Tracking Fonksiyonları
```javascript
// Sayfa görüntüleme
trackPageView(url)

// Oyun görüntüleme
trackGameView(gameName, gameId)

// Arama
trackGameSearch(searchTerm)

// Yorum
trackCommentSubmit(gameName, gameId, rating)

// Paylaşım
trackShare(platform, gameName, gameId)
```

#### Session Yönetimi
```javascript
// Session başlatma
initSession()

// Session süresi güncelleme
updateSessionDuration()

// Session tracking
trackSession()
```

#### Admin Fonksiyonları
```javascript
// Analytics verileri çekme
fetchAnalyticsFromSupabase(timeRange)

// Top oyunlar
getTopGames(limit)

// Saatlik trafik
getHourlyTraffic()

// Son aktiviteler
getRecentActivity(limit)

// Günlük analytics
getDailyAnalytics(days)
```

## 📱 Sayfa Entegrasyonları

### HomePage (src/pages/HomePage/index.jsx)
- ✅ Sayfa görüntüleme tracking
- ✅ Arama tracking (1 saniyelik debounce ile)
- ✅ Session başlatma

### GameDetail (src/pages/GameDetail/index.jsx)
- ✅ Oyun görüntüleme tracking
- ✅ View count güncelleme
- ✅ Sayfa görüntüleme tracking

### CommentSection (src/components/game/CommentSection.jsx)
- ✅ Yorum gönderme tracking
- ✅ Rating bilgisi ile birlikte

### SocialShare (src/components/game/SocialShare.jsx)
- ✅ Tüm paylaşım platformları için tracking
- ✅ Facebook, Twitter, WhatsApp, Link kopyalama

### App.jsx
- ✅ Uygulama başlangıcında session başlatma
- ✅ Cihaz ve trafik kaynağı tracking

## 📊 Admin Dashboard

### src/components/admin/AnalyticsDashboard.jsx

#### Özellikler:
- ✅ Zaman aralığı filtreleme (24 saat, 7 gün, 30 gün)
- ✅ Gerçek zamanlı metrikler
- ✅ Cihaz dağılımı (Desktop, Mobile, Tablet)
- ✅ Trafik kaynakları (Direct, Search, Social, Referral)
- ✅ En popüler oyunlar (engagement score ile)
- ✅ Son aktiviteler listesi
- ✅ Bounce rate ve sayfa/oturum metrikleri

#### Gösterilen Metrikler:
1. **Toplam Görüntülenme** - Tüm sayfa görüntülemeleri
2. **Benzersiz Oturum** - Unique session sayısı
3. **Toplam Yorum** - Gönderilen yorum sayısı
4. **Arama Sayısı** - Yapılan arama sorguları
5. **Ort. Süre** - Ortalama ziyaret süresi (saniye)
6. **Bounce Rate** - 5 saniyeden az kalan oturumlar
7. **Sayfa/Oturum** - Oturum başına sayfa görüntüleme
8. **Paylaşım** - Sosyal medya paylaşımları

## 🔐 Güvenlik ve Gizlilik

### RLS Politikaları
- ✅ Public write - Herkes event ekleyebilir
- ✅ Public read - Herkes okuyabilir (admin dashboard için)
- ✅ IP adresi hash'leme devre dışı (gereksiz)
- ✅ Session ID ile tracking (browser tab bazlı)

### Session Yönetimi
- Session ID: `sessionStorage` kullanılıyor (tab kapanınca sıfırlanır)
- Local storage: Sadece fallback veriler için (cihaz, trafik)
- 30 saniyede bir otomatik session duration güncelleme

## 🚀 Kurulum ve Kullanım

### 1. Supabase SQL Şemasını Çalıştırın
SQL dosyasını Supabase SQL Editor'de çalıştırın (sağlanan SQL şema dosyası).

### 2. Supabase Connection
`src/lib/supabase.js` dosyasında connection ayarlarınızın doğru olduğundan emin olun.

### 3. Test
1. Siteyi ziyaret edin
2. Bir oyun görüntüleyin
3. Arama yapın
4. Yorum gönderin
5. Paylaşım yapın
6. Admin panel'de analytics'i kontrol edin

## 📝 Notlar

### Önemli Değişiklikler
- ❌ Google Analytics entegrasyonu kaldırıldı
- ✅ Tamamen Supabase tabanlı sistem
- ✅ Gerçek zamanlı tracking
- ✅ Daha detaylı metrikler
- ✅ Privacy-friendly (IP hash yok, sadece session ID)

### LocalStorage Kullanımı
LocalStorage artık sadece **fallback** için kullanılıyor:
- `device_visits`: Cihaz istatistikleri
- `traffic_sources`: Trafik kaynakları
- `user_sessions`: Kullanıcı oturumları

Ana veri kaynağı **Supabase analytics_events** tablosudur.

### Performance
- İndeksler eklendi (event_type, game_id, created_at, session_id)
- Composite index (event_type + game_id + created_at)
- Views kullanılarak query performansı artırıldı

## 🔄 Realtime Özellikler

Realtime güncellemeler için Supabase Realtime kullanılabilir:
```javascript
const subscription = supabase
  .channel('analytics_events')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'analytics_events' },
    (payload) => {
      console.log('New event:', payload.new);
    }
  )
  .subscribe();
```

## 📊 Veri Temizleme

90 günden eski veriler için otomatik temizleme fonksiyonu:
```sql
SELECT cleanup_old_analytics_events();
```

Bu fonksiyonu bir cron job ile periyodik olarak çalıştırabilirsiniz.

## ✅ Test Checklist

- [x] Sayfa görüntüleme tracking çalışıyor
- [x] Oyun görüntüleme tracking çalışıyor
- [x] Arama tracking çalışıyor (debounce ile)
- [x] Yorum tracking çalışıyor
- [x] Paylaşım tracking çalışıyor
- [x] Session tracking çalışıyor
- [x] Admin dashboard verileri gösteriyor
- [x] Zaman aralığı filtreleme çalışıyor
- [x] Top games listesi doğru
- [x] Recent activity gösteriliyor

## 🎉 Sonuç

Analytics sistemi başarıyla Supabase'e entegre edildi. Artık tüm kullanıcı etkinlikleri gerçek zamanlı olarak takip ediliyor ve admin panelinde detaylı raporlar görüntülenebiliyor.
