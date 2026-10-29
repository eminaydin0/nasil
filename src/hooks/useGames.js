import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/** Kart listesi. Kurallar ve uzun açıklama oyun sayfasında ayrıca çekilir. */
const LIST_SELECT = 'id,slug,name,category,players,difficulty,image,short_description,created_at';
const CACHE_KEY = 'kuraline-game-cards-v1';

function formatGame(game) {
  return {
    id: game.id,
    slug: game.slug,
    name: game.name,
    category: game.category,
    players: game.players,
    difficulty: game.difficulty,
    image: game.image,
    shortDescription: game.short_description,
    createdAt: game.created_at,
  };
}

function readSession() {
  if (typeof sessionStorage === 'undefined') return null;
  try {
    const parsed = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
    return Array.isArray(parsed) && parsed.length ? parsed : null;
  } catch {
    return null;
  }
}

function writeSession(games) {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(games));
  } catch {
    /* dolu depolama listeyi engellemesin */
  }
}

let memory = null;
let inflight = null;

async function fetchRows() {
  const prefetched = typeof window !== 'undefined' ? window.__gamesListPrefetch : null;
  if (prefetched) {
    window.__gamesListPrefetch = null;
    try {
      const data = await prefetched;
      if (Array.isArray(data)) return data.map(formatGame);
    } catch {
      /* ağ hatasında normal sorguya düş */
    }
  }

  const { data, error } = await supabase
    .from('games')
    .select(LIST_SELECT)
    .order('id', { ascending: true });

  if (error) throw error;
  return (data || []).map(formatGame);
}

function loadGames() {
  if (inflight) return inflight;

  inflight = fetchRows()
    .then((rows) => {
      memory = rows;
      writeSession(rows);
      return rows;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

if (typeof window !== 'undefined') {
  memory = readSession();
  loadGames();
}

export function useGames() {
  const [games, setGames] = useState(() => memory || []);
  const [loading, setLoading] = useState(() => !(memory && memory.length));
  const [error, setError] = useState(null);

  useEffect(() => {
    let live = true;

    loadGames()
      .then((rows) => {
        if (!live) return;
        setGames(rows);
        setError(null);
      })
      .catch((err) => {
        console.error('Error loading games:', err);
        if (!live) return;
        setError(err.message);
        if (!memory) setGames([]);
      })
      .finally(() => {
        if (live) setLoading(false);
      });

    return () => {
      live = false;
    };
  }, []);

  return { games, loading, error, refetch: loadGames };
}
