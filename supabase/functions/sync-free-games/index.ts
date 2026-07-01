// Supabase Edge Function — GamerPower → free_games sync
// Deploy: supabase functions deploy sync-free-games
// Cron: Perşembe 15:00 UTC (TR 18:00) — Supabase Dashboard veya pg_cron

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GAMERPOWER_URL = 'https://www.gamerpower.com/api/giveaways';

function normalize(raw) {
  if (!raw?.id || !raw?.title) return null;
  const url = raw.open_giveaway_url || '';
  if (!url) return null;
  return {
    external_id: String(raw.id),
    title: String(raw.title).trim(),
    image: raw.thumbnail || raw.image || null,
    platform: raw.platforms || 'PC',
    worth: raw.worth || 'N/A',
    end_date: raw.end_date || null,
    open_giveaway_url: url,
    giveaway_type: raw.type || 'Game',
    description: raw.description || null,
    is_active: true,
    synced_at: new Date().toISOString(),
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const url = new URL(req.url);
    const platform = url.searchParams.get('platform') || '';
    const apiUrl = platform ? `${GAMERPOWER_URL}?platform=${platform}` : GAMERPOWER_URL;

    const res = await fetch(apiUrl, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`GamerPower ${res.status}`);

    const raw = await res.json();
    if (!Array.isArray(raw)) throw new Error('Invalid API response');

    const items = raw.map(normalize).filter(Boolean);
    const now = new Date().toISOString();

    await supabase.from('free_games').update({ is_active: false }).eq('is_active', true);

    if (items.length > 0) {
      const { error } = await supabase.from('free_games').upsert(items, {
        onConflict: 'external_id',
      });
      if (error) throw error;
    }

    await supabase.from('free_games_sync_log').insert([
      {
        status: 'success',
        synced_count: items.length,
        message: `Edge Function: ${items.length} kayıt (${platform || 'all'})`,
      },
    ]);

    return new Response(JSON.stringify({ ok: true, count: items.length, synced_at: now }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
