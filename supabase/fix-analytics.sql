-- Analytics Event Tablosu (Eğer yoksa)
CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  game_id BIGINT, -- games tablosuna referans olabilir ama zorunlu değil
  session_id TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performans için indeksler
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id);

-- RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Herkese yazma izni (Track etmek için)
DROP POLICY IF EXISTS "Analytics Insert Public" ON analytics_events;
CREATE POLICY "Analytics Insert Public" ON analytics_events FOR INSERT TO public WITH CHECK (true);

-- Sadece adminlere okuma izni (Güvenlik için önemli, ama development'ta esnetilebilir)
-- Şimdilik herkes okusun ki dashboard çalışsın, sonra auth eklenebilir.
DROP POLICY IF EXISTS "Analytics Select Public" ON analytics_events;
CREATE POLICY "Analytics Select Public" ON analytics_events FOR SELECT TO public USING (true);


-- 1. Dashboard İstatistikleri için RPC Fonksiyonu
-- Tüm hesaplamaları veritabanında yaparak 1000 satır limitine takılmayı önler
CREATE OR REPLACE FUNCTION get_dashboard_stats(p_start_date TIMESTAMPTZ)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_total_page_views BIGINT;
  v_total_comments BIGINT;
  v_total_shares BIGINT;
  v_total_searches BIGINT;
  v_unique_sessions BIGINT;
  v_avg_time NUMERIC;
  v_bounce_rate NUMERIC;
  v_device_stats JSON;
  v_traffic_sources JSON;
  v_result JSON;
BEGIN
  -- Temel Sayaçlar
  SELECT 
    COUNT(*) FILTER (WHERE event_type = 'page_view'),
    COUNT(*) FILTER (WHERE event_type = 'comment_submit'),
    COUNT(*) FILTER (WHERE event_type = 'share_click'),
    COUNT(*) FILTER (WHERE event_type = 'search'),
    COUNT(DISTINCT session_id)
  INTO 
    v_total_page_views,
    v_total_comments,
    v_total_shares,
    v_total_searches,
    v_unique_sessions
  FROM analytics_events
  WHERE created_at >= p_start_date;

  -- Süre ve Bounce Rate Hesaplaması
  WITH duration_stats AS (
    SELECT 
      (event_data->>'duration')::numeric as duration
    FROM analytics_events
    WHERE event_type = 'session_duration'
      AND created_at >= p_start_date
  )
  SELECT 
    COALESCE(AVG(duration), 0),
    COALESCE(
      (COUNT(*) FILTER (WHERE duration < 5.0) * 100.0 / NULLIF(COUNT(*), 0)), 
      0
    )
  INTO v_avg_time, v_bounce_rate
  FROM duration_stats;

  -- Cihaz İstatistikleri
  WITH devices AS (
    SELECT 
      event_data->>'device_type' as device,
      count(*) as cnt
    FROM analytics_events
    WHERE event_type = 'device_info'
      AND created_at >= p_start_date
    GROUP BY 1
  ),
  total_dev AS (SELECT sum(cnt) as total FROM devices)
  SELECT json_build_object(
    'desktop', COALESCE((SELECT round(cnt * 100.0 / total) FROM devices, total_dev WHERE device = 'desktop'), 0),
    'mobile', COALESCE((SELECT round(cnt * 100.0 / total) FROM devices, total_dev WHERE device = 'mobile'), 0),
    'tablet', COALESCE((SELECT round(cnt * 100.0 / total) FROM devices, total_dev WHERE device = 'tablet'), 0)
  ) INTO v_device_stats;

  -- Trafik Kaynakları
  WITH sources AS (
    SELECT 
      event_data->>'source' as source,
      count(*) as cnt
    FROM analytics_events
    WHERE event_type = 'traffic_source'
      AND created_at >= p_start_date
    GROUP BY 1
  ),
  total_src AS (SELECT sum(cnt) as total FROM sources)
  SELECT json_build_object(
    'direct', COALESCE((SELECT round(cnt * 100.0 / total) FROM sources, total_src WHERE source = 'direct'), 0),
    'search', COALESCE((SELECT round(cnt * 100.0 / total) FROM sources, total_src WHERE source = 'search'), 0),
    'social', COALESCE((SELECT round(cnt * 100.0 / total) FROM sources, total_src WHERE source = 'social'), 0),
    'referral', COALESCE((SELECT round(cnt * 100.0 / total) FROM sources, total_src WHERE source = 'referral'), 0)
  ) INTO v_traffic_sources;

  v_result := json_build_object(
    'totalPageViews', v_total_page_views,
    'totalComments', v_total_comments,
    'totalShares', v_total_shares,
    'totalSearches', v_total_searches,
    'uniqueSessions', v_unique_sessions,
    'avgTimeOnSite', round(v_avg_time, 0),
    'bounceRate', round(v_bounce_rate, 0),
    'deviceStats', COALESCE(v_device_stats, '{"desktop":0, "mobile":0, "tablet":0}'::json),
    'trafficSources', COALESCE(v_traffic_sources, '{"direct":0, "search":0, "social":0, "referral":0}'::json)
  );

  RETURN v_result;
END;
$$;


-- 2. Grafik Verisi için RPC Fonksiyonu
-- Seçilen zaman aralığına göre (saatlik veya günlük) gruplanmış veri döndürür
CREATE OR REPLACE FUNCTION get_analytics_chart_data(
  p_start_date TIMESTAMPTZ,
  p_interval TEXT DEFAULT 'day'
)
RETURNS TABLE (
  date_bucket TIMESTAMPTZ,
  view_count BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    date_trunc(p_interval, created_at) as bucket,
    count(*) as cnt
  FROM analytics_events
  WHERE 
    event_type = 'page_view' 
    AND created_at >= p_start_date
  GROUP BY bucket
  ORDER BY bucket ASC;
END;
$$;
