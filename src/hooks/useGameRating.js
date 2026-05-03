import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const SESSION_KEY = 'no_session_id';

function getOrCreateSessionId() {
  if (typeof window === 'undefined') return null;
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      const rand = (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : `s-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      id = rand;
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

/**
 * Bir oyun icin hizli yildiz puanlamasi yonetimi.
 * - Tum puanlari ceker, ortalama ve toplam dondurur
 * - Mevcut kullanicinin/misafirin verdigi puani dondurur
 * - submitRating(rating) ile puan eklenir/guncellenir
 *
 * AggregateRating schema'si icin: { count, average, userRating }
 */
export function useGameRating(gameId) {
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const [average, setAverage] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const sessionId = getOrCreateSessionId();

  const load = useCallback(async () => {
    if (!gameId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data: allRatings, error } = await supabase
        .from('game_ratings')
        .select('rating, user_id, session_id')
        .eq('game_id', gameId);

      if (error) throw error;
      const list = allRatings || [];

      setCount(list.length);
      setAverage(list.length > 0
        ? list.reduce((sum, r) => sum + (r.rating || 0), 0) / list.length
        : 0);

      const own = list.find((r) => {
        if (user && r.user_id === user.id) return true;
        if (!user && sessionId && r.session_id === sessionId) return true;
        return false;
      });
      setUserRating(own?.rating || 0);
    } catch (err) {
      console.error('Error loading game ratings:', err);
      setCount(0);
      setAverage(0);
      setUserRating(0);
    } finally {
      setLoading(false);
    }
  }, [gameId, user, sessionId]);

  useEffect(() => {
    load();
  }, [load]);

  const submitRating = useCallback(async (rating) => {
    if (!gameId) return false;
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return false;
    if (!user && !sessionId) return false;

    setSubmitting(true);
    const previousUser = userRating;
    const previousAvg = average;
    const previousCount = count;

    // Optimistic update
    const isUpdate = previousUser > 0;
    const nextCount = isUpdate ? previousCount : previousCount + 1;
    const nextSum = (previousAvg * previousCount) - (isUpdate ? previousUser : 0) + rating;
    const nextAvg = nextCount > 0 ? nextSum / nextCount : 0;
    setUserRating(rating);
    setAverage(nextAvg);
    setCount(nextCount);

    try {
      const conflictTarget = user ? 'game_id,user_id' : 'game_id,session_id';
      const payload = user
        ? { game_id: gameId, user_id: user.id, session_id: null, rating }
        : { game_id: gameId, user_id: null, session_id: sessionId, rating };

      const { error } = await supabase
        .from('game_ratings')
        .upsert(payload, { onConflict: conflictTarget });

      if (error) throw error;
      // Yine de kesin sayilar icin yeniden yukle (dusuk maliyetli)
      await load();
      return true;
    } catch (err) {
      console.error('Error submitting rating:', err);
      // Revert
      setUserRating(previousUser);
      setAverage(previousAvg);
      setCount(previousCount);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [gameId, user, sessionId, userRating, average, count, load]);

  return {
    count,
    average,
    userRating,
    loading,
    submitting,
    submitRating,
    refetch: load,
  };
}
