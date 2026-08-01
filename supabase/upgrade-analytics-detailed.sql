-- =====================================================
-- Detaylı Analytics RPC'leri
-- Supabase SQL Editor'da çalıştırın
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_analytics_events_type_created
  ON analytics_events (event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_session_created
  ON analytics_events (session_id, created_at);

-- 1) Dashboard — bounce = tek sayfa oturum; süre = oturum başına MAX(duration)
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

  WITH session_metrics AS (
    SELECT
      session_id,
      COUNT(*) FILTER (WHERE event_type = 'page_view') AS page_views,
      MAX(
        CASE
          WHEN event_type = 'session_duration'
            AND (event_data->>'duration') ~ '^[0-9]+(\.[0-9]+)?$'
          THEN (event_data->>'duration')::numeric
          ELSE NULL
        END
      ) AS duration
    FROM analytics_events
    WHERE created_at >= p_start_date
      AND session_id IS NOT NULL
    GROUP BY session_id
  )
  SELECT
    COALESCE(AVG(duration) FILTER (WHERE duration IS NOT NULL AND duration > 0), 0),
    COALESCE(
      (COUNT(*) FILTER (WHERE page_views <= 1) * 100.0 / NULLIF(COUNT(*), 0)),
      0
    )
  INTO v_avg_time, v_bounce_rate
  FROM session_metrics;

  WITH devices AS (
    SELECT DISTINCT ON (session_id)
      session_id,
      event_data->>'device_type' AS device
    FROM analytics_events
    WHERE event_type = 'device_info'
      AND created_at >= p_start_date
      AND session_id IS NOT NULL
    ORDER BY session_id, created_at ASC
  ),
  counted AS (
    SELECT device, COUNT(*) AS cnt FROM devices WHERE device IS NOT NULL GROUP BY device
  ),
  total_dev AS (SELECT SUM(cnt) AS total FROM counted)
  SELECT json_build_object(
    'desktop', COALESCE((SELECT ROUND(cnt * 100.0 / NULLIF(total, 0)) FROM counted, total_dev WHERE device = 'desktop'), 0),
    'mobile', COALESCE((SELECT ROUND(cnt * 100.0 / NULLIF(total, 0)) FROM counted, total_dev WHERE device = 'mobile'), 0),
    'tablet', COALESCE((SELECT ROUND(cnt * 100.0 / NULLIF(total, 0)) FROM counted, total_dev WHERE device = 'tablet'), 0)
  ) INTO v_device_stats;

  WITH sources AS (
    SELECT DISTINCT ON (session_id)
      session_id,
      event_data->>'source' AS source
    FROM analytics_events
    WHERE event_type = 'traffic_source'
      AND created_at >= p_start_date
      AND session_id IS NOT NULL
    ORDER BY session_id, created_at ASC
  ),
  counted AS (
    SELECT source, COUNT(*) AS cnt FROM sources WHERE source IS NOT NULL GROUP BY source
  ),
  total_src AS (SELECT SUM(cnt) AS total FROM counted)
  SELECT json_build_object(
    'direct', COALESCE((SELECT ROUND(cnt * 100.0 / NULLIF(total, 0)) FROM counted, total_src WHERE source = 'direct'), 0),
    'search', COALESCE((SELECT ROUND(cnt * 100.0 / NULLIF(total, 0)) FROM counted, total_src WHERE source = 'search'), 0),
    'social', COALESCE((SELECT ROUND(cnt * 100.0 / NULLIF(total, 0)) FROM counted, total_src WHERE source = 'social'), 0),
    'referral', COALESCE((SELECT ROUND(cnt * 100.0 / NULLIF(total, 0)) FROM counted, total_src WHERE source = 'referral'), 0)
  ) INTO v_traffic_sources;

  v_result := json_build_object(
    'totalPageViews', v_total_page_views,
    'totalComments', v_total_comments,
    'totalShares', v_total_shares,
    'totalSearches', v_total_searches,
    'uniqueSessions', v_unique_sessions,
    'avgTimeOnSite', ROUND(v_avg_time, 0),
    'bounceRate', ROUND(v_bounce_rate, 0),
    'deviceStats', COALESCE(v_device_stats, '{"desktop":0,"mobile":0,"tablet":0}'::json),
    'trafficSources', COALESCE(v_traffic_sources, '{"direct":0,"search":0,"social":0,"referral":0}'::json)
  );

  RETURN v_result;
END;
$$;

-- 2) Günlük özet
CREATE OR REPLACE FUNCTION get_analytics_daily_stats(p_start_date TIMESTAMPTZ)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_result JSON;
BEGIN
  WITH day_base AS (
    SELECT
      date_trunc('day', created_at AT TIME ZONE 'Europe/Istanbul')::date AS day,
      session_id,
      event_type,
      event_data,
      created_at
    FROM analytics_events
    WHERE created_at >= p_start_date
  ),
  per_day AS (
    SELECT
      day,
      COUNT(*) FILTER (WHERE event_type = 'page_view') AS page_views,
      COUNT(DISTINCT session_id) AS sessions,
      COUNT(*) FILTER (WHERE event_type = 'comment_submit') AS comments,
      COUNT(*) FILTER (WHERE event_type = 'search') AS searches,
      COUNT(*) FILTER (WHERE event_type = 'share_click') AS shares
    FROM day_base
    GROUP BY day
  ),
  session_day AS (
    SELECT
      date_trunc('day', MIN(created_at) AT TIME ZONE 'Europe/Istanbul')::date AS day,
      session_id,
      COUNT(*) FILTER (WHERE event_type = 'page_view') AS page_views,
      MAX(
        CASE
          WHEN event_type = 'session_duration'
            AND (event_data->>'duration') ~ '^[0-9]+(\.[0-9]+)?$'
          THEN (event_data->>'duration')::numeric
          ELSE NULL
        END
      ) AS duration
    FROM analytics_events
    WHERE created_at >= p_start_date
      AND session_id IS NOT NULL
    GROUP BY session_id
  ),
  bounce_day AS (
    SELECT
      day,
      COUNT(*) AS sessions,
      COUNT(*) FILTER (WHERE page_views <= 1) AS bounced,
      ROUND(AVG(duration) FILTER (WHERE duration IS NOT NULL AND duration > 0)) AS avg_duration
    FROM session_day
    GROUP BY day
  )
  SELECT COALESCE(json_agg(
    json_build_object(
      'date', p.day,
      'pageViews', p.page_views,
      'sessions', p.sessions,
      'comments', p.comments,
      'searches', p.searches,
      'shares', p.shares,
      'bounceRate', ROUND(COALESCE(b.bounced * 100.0 / NULLIF(b.sessions, 0), 0)),
      'avgDuration', COALESCE(b.avg_duration, 0)
    )
    ORDER BY p.day ASC
  ), '[]'::json)
  INTO v_result
  FROM per_day p
  LEFT JOIN bounce_day b ON b.day = p.day;

  RETURN v_result;
END;
$$;

-- 3) Saatlik dağılım (Europe/Istanbul)
CREATE OR REPLACE FUNCTION get_analytics_hourly_stats(p_start_date TIMESTAMPTZ)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_result JSON;
BEGIN
  WITH hours AS (
    SELECT generate_series(0, 23) AS hour
  ),
  counted AS (
    SELECT
      EXTRACT(HOUR FROM created_at AT TIME ZONE 'Europe/Istanbul')::int AS hour,
      COUNT(*) FILTER (WHERE event_type = 'page_view') AS page_views,
      COUNT(DISTINCT session_id) AS sessions
    FROM analytics_events
    WHERE created_at >= p_start_date
    GROUP BY 1
  )
  SELECT COALESCE(json_agg(
    json_build_object(
      'hour', h.hour,
      'pageViews', COALESCE(c.page_views, 0),
      'sessions', COALESCE(c.sessions, 0)
    )
    ORDER BY h.hour
  ), '[]'::json)
  INTO v_result
  FROM hours h
  LEFT JOIN counted c ON c.hour = h.hour;

  RETURN v_result;
END;
$$;

-- 4) Referrer / kaynak detayı
CREATE OR REPLACE FUNCTION get_analytics_referrer_stats(p_start_date TIMESTAMPTZ, p_limit INT DEFAULT 25)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_result JSON;
BEGIN
  WITH first_hits AS (
    SELECT DISTINCT ON (session_id)
      session_id,
      referrer,
      event_data->>'source' AS source,
      event_data->>'referrer_host' AS referrer_host,
      event_data->>'utm_source' AS utm_source,
      event_data->>'utm_medium' AS utm_medium,
      event_data->>'utm_campaign' AS utm_campaign
    FROM analytics_events
    WHERE created_at >= p_start_date
      AND session_id IS NOT NULL
      AND event_type IN ('session_start', 'traffic_source', 'page_view')
    ORDER BY session_id, created_at ASC
  ),
  normalized AS (
    SELECT
      session_id,
      COALESCE(
        NULLIF(referrer_host, ''),
        CASE
          WHEN referrer IS NULL OR referrer = '' OR referrer = 'direct' THEN 'direct'
          ELSE regexp_replace(referrer, '^https?://([^/]+).*$', '\1')
        END
      ) AS host,
      COALESCE(NULLIF(source, ''), 'direct') AS source,
      utm_source,
      utm_medium,
      utm_campaign
    FROM first_hits
  ),
  by_host AS (
    SELECT host, source, COUNT(*) AS sessions
    FROM normalized
    GROUP BY host, source
    ORDER BY sessions DESC
    LIMIT GREATEST(p_limit, 1)
  )
  SELECT COALESCE(json_agg(
    json_build_object(
      'host', host,
      'source', source,
      'sessions', sessions
    )
  ), '[]'::json)
  INTO v_result
  FROM by_host;

  RETURN v_result;
END;
$$;

-- 5) Son oturumlar (kim / nereden / ne yaptı)
CREATE OR REPLACE FUNCTION get_analytics_sessions(p_start_date TIMESTAMPTZ, p_limit INT DEFAULT 75)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_result JSON;
BEGIN
  WITH scoped AS (
    SELECT *
    FROM analytics_events
    WHERE created_at >= p_start_date
      AND session_id IS NOT NULL
  ),
  metrics AS (
    SELECT
      session_id,
      MIN(created_at) AS started_at,
      MAX(created_at) AS last_at,
      COUNT(*) FILTER (WHERE event_type = 'page_view') AS page_views,
      COUNT(*) FILTER (WHERE event_type = 'game_view') AS game_views,
      COUNT(*) FILTER (WHERE event_type = 'search') AS searches,
      COUNT(*) FILTER (WHERE event_type = 'comment_submit') AS comments,
      MAX(
        CASE
          WHEN event_type = 'session_duration'
            AND (event_data->>'duration') ~ '^[0-9]+(\.[0-9]+)?$'
          THEN (event_data->>'duration')::numeric
          ELSE NULL
        END
      ) AS duration,
      (ARRAY_AGG(event_data->>'page' ORDER BY created_at)
        FILTER (WHERE event_type = 'page_view' AND event_data->>'page' IS NOT NULL))[1] AS landing_page,
      (ARRAY_AGG(event_data->>'page' ORDER BY created_at DESC)
        FILTER (WHERE event_type = 'page_view' AND event_data->>'page' IS NOT NULL))[1] AS exit_page,
      (ARRAY_AGG(referrer ORDER BY created_at)
        FILTER (WHERE referrer IS NOT NULL AND referrer <> ''))[1] AS referrer,
      (ARRAY_AGG(event_data->>'device_type' ORDER BY created_at)
        FILTER (WHERE event_type = 'device_info'))[1] AS device,
      (ARRAY_AGG(event_data->>'source' ORDER BY created_at)
        FILTER (WHERE event_type = 'traffic_source'))[1] AS source,
      (ARRAY_AGG(event_data->>'user_id' ORDER BY created_at)
        FILTER (WHERE event_data->>'user_id' IS NOT NULL))[1] AS user_id,
      (ARRAY_AGG(event_data->>'user_email' ORDER BY created_at)
        FILTER (WHERE event_data->>'user_email' IS NOT NULL))[1] AS user_email,
      (ARRAY_AGG(user_agent ORDER BY created_at)
        FILTER (WHERE user_agent IS NOT NULL))[1] AS user_agent,
      (ARRAY_AGG(event_data->>'utm_source' ORDER BY created_at)
        FILTER (WHERE event_data->>'utm_source' IS NOT NULL))[1] AS utm_source,
      ARRAY_REMOVE(ARRAY_AGG(DISTINCT event_data->>'page')
        FILTER (WHERE event_type = 'page_view'), NULL) AS pages
    FROM scoped
    GROUP BY session_id
  )
  SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
  INTO v_result
  FROM (
    SELECT
      session_id AS id,
      started_at AS "startedAt",
      last_at AS "lastAt",
      page_views AS "pageViews",
      game_views AS "gameViews",
      searches,
      comments,
      COALESCE(duration, 0) AS duration,
      landing_page AS "landingPage",
      exit_page AS "exitPage",
      COALESCE(referrer, 'direct') AS referrer,
      COALESCE(device, 'unknown') AS device,
      COALESCE(source, 'direct') AS source,
      user_id AS "userId",
      user_email AS "userEmail",
      user_agent AS "userAgent",
      utm_source AS "utmSource",
      COALESCE(pages, ARRAY[]::text[]) AS pages,
      (page_views <= 1) AS bounced
    FROM metrics
    ORDER BY started_at DESC
    LIMIT GREATEST(p_limit, 1)
  ) t;

  RETURN v_result;
END;
$$;

-- 6) Sayfa / arama / paylaşım aggregasyonları (1000 satır limiti yok)
CREATE OR REPLACE FUNCTION get_analytics_page_stats(p_start_date TIMESTAMPTZ, p_limit INT DEFAULT 50)
RETURNS JSON
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN (
    SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
    FROM (
      SELECT
        COALESCE(event_data->>'page', '/') AS path,
        COUNT(*) AS views
      FROM analytics_events
      WHERE event_type = 'page_view'
        AND created_at >= p_start_date
      GROUP BY 1
      ORDER BY views DESC
      LIMIT GREATEST(p_limit, 1)
    ) t
  );
END;
$$;

CREATE OR REPLACE FUNCTION get_analytics_search_stats(p_start_date TIMESTAMPTZ, p_limit INT DEFAULT 20)
RETURNS JSON
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN (
    SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
    FROM (
      SELECT
        LOWER(TRIM(event_data->>'search_term')) AS term,
        COUNT(*) AS count
      FROM analytics_events
      WHERE event_type = 'search'
        AND created_at >= p_start_date
        AND LENGTH(TRIM(COALESCE(event_data->>'search_term', ''))) >= 2
      GROUP BY 1
      ORDER BY count DESC
      LIMIT GREATEST(p_limit, 1)
    ) t
  );
END;
$$;

CREATE OR REPLACE FUNCTION get_analytics_share_stats(p_start_date TIMESTAMPTZ, p_limit INT DEFAULT 10)
RETURNS JSON
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN (
    SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
    FROM (
      SELECT
        LOWER(COALESCE(event_data->>'platform', 'bilinmeyen')) AS platform,
        COUNT(*) AS count
      FROM analytics_events
      WHERE event_type = 'share_click'
        AND created_at >= p_start_date
      GROUP BY 1
      ORDER BY count DESC
      LIMIT GREATEST(p_limit, 1)
    ) t
  );
END;
$$;

CREATE OR REPLACE FUNCTION get_analytics_top_games_stats(p_start_date TIMESTAMPTZ, p_limit INT DEFAULT 10)
RETURNS JSON
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN (
    SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
    FROM (
      SELECT
        game_id AS id,
        COUNT(*) FILTER (WHERE event_type = 'game_view') AS views,
        COUNT(*) FILTER (WHERE event_type = 'comment_submit') AS comments
      FROM analytics_events
      WHERE created_at >= p_start_date
        AND game_id IS NOT NULL
        AND event_type IN ('game_view', 'comment_submit')
      GROUP BY game_id
      ORDER BY views DESC, comments DESC
      LIMIT GREATEST(p_limit, 1)
    ) t
  );
END;
$$;

CREATE OR REPLACE FUNCTION get_analytics_funnel_stats(p_start_date TIMESTAMPTZ)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_home BIGINT;
  v_games BIGINT;
  v_comments BIGINT;
  v_shares BIGINT;
BEGIN
  SELECT
    COUNT(*) FILTER (
      WHERE event_type = 'page_view'
        AND (event_data->>'page' = '/' OR event_data->>'page' LIKE '/?%')
    ),
    COUNT(*) FILTER (WHERE event_type = 'game_view'),
    COUNT(*) FILTER (WHERE event_type = 'comment_submit'),
    COUNT(*) FILTER (WHERE event_type = 'share_click')
  INTO v_home, v_games, v_comments, v_shares
  FROM analytics_events
  WHERE created_at >= p_start_date;

  RETURN json_build_object(
    'homeViews', v_home,
    'gameViews', v_games,
    'comments', v_comments,
    'shares', v_shares,
    'homeToGame', CASE WHEN v_home > 0 THEN LEAST(ROUND(v_games * 100.0 / v_home), 100) ELSE 0 END,
    'gameToComment', CASE WHEN v_games > 0 THEN LEAST(ROUND(v_comments * 100.0 / v_games), 100) ELSE 0 END
  );
END;
$$;
