# Analytics Doğruluk Kontrolü

## ✅ Kurulum Kontrol Listesi

Bu adımlar tamamsa analytics doğru çalışır:

| # | Adım | Dosya | Durum |
|---|------|-------|-------|
| 1 | analytics_events tablosu | `fix-analytics.sql` | Supabase'de çalıştırıldı mı? |
| 2 | get_dashboard_stats RPC | `fix-analytics.sql` | Aynı dosyada |
| 3 | top_games_weekly view | `create-analytics-views.sql` | Supabase'de çalıştırıldı mı? |
| 4 | recent_activity view | `create-analytics-views.sql` | Aynı dosyada |

## Veri Akışı

### Ana Metrikler (get_dashboard_stats RPC)
- **analytics_events** tablosundan okur
- Zaman filtresi: p_start_date parametresi

### En Popüler Oyunlar (top_games_weekly view)
- **game_views** → görüntülenme sayısı
- **comments** → yorum sayısı
- **analytics_events** → paylaşım sayısı (share_click)

### Son Aktiviteler (recent_activity view)
- **analytics_events** → game_view, comment_submit, share_click, search, page_view

### Frontend Tracking (otomatik)
- `initGA()` → Sayfa yüklenince: device, traffic, page_view
- `initSession()` → Oturum: session_duration (30sn'de bir + sayfa kapanışta)
- `trackGameView()` → Oyun detay sayfası açılınca
- `trackCommentSubmit()` → Yorum gönderilince

## Veri Neden 0 Olabilir?

1. **fix-analytics.sql hiç çalıştırılmadı** → RPC hata verir, localStorage fallback kullanılır (cihaz/trafik)
2. **Yeni kurulum** → analytics_events boş, henüz event toplanmamış
3. **game_views tablosu boş** → Oyun sayfalarındaki view increment çalışmıyor olabilir (ayrı mekanizma)

## Hızlı Test

1. Siteyi aç, birkaç sayfa gezin
2. Bir oyun detay sayfasına gir
3. 1-2 dakika bekle
4. Admin → Analytics sayfasına git, "Son 24 Saat" seç
5. Görüntülenme ve aktivite sayıları artmış olmalı
