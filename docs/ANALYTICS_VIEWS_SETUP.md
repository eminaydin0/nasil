# Analytics View Kurulumu

Analytics sayfasında "En Popüler Oyunlar" ve "Son Aktiviteler" bölümlerinin çalışması için bu view'ları oluşturmanız gerekir.

## Ön Koşul

Önce `fix-analytics.sql` dosyasını çalıştırmış olmalısınız (analytics_events tablosu ve get_dashboard_stats RPC fonksiyonu için).

## Kurulum

1. **Supabase Dashboard** → **SQL Editor** → **New Query**
2. `supabase/create-analytics-views.sql` dosyasının içeriğini yapıştırın
3. **Run** butonuna basın

## Oluşturulan View'lar

### top_games_weekly
- **game_id** – Oyun ID
- **views** – Görüntülenme sayısı (game_views tablosundan)
- **comments** – Yorum sayısı
- **shares** – Paylaşım sayısı (analytics_events)
- **engagement_score** – Etkileşim puanı

### recent_activity
- **id, event_type, event_data, game_id, session_id, created_at**
- Filtrelenen event tipleri: game_view, comment_submit, share_click, search, page_view

## Veri Kaynakları

| Veri            | Kaynak                          |
|-----------------|----------------------------------|
| Görüntülenme    | game_views.view_count           |
| Yorum sayısı    | comments tablosu                |
| Paylaşım        | analytics_events (share_click)   |
| Son aktiviteler | analytics_events                |
