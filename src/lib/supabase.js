import { createClient } from '@supabase/supabase-js';
import { slugify } from '../utils/slugify';

// Supabase proje bilgileri
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yjnipjcevnxrzlgfmeci.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqbmlwamNldm54cnpsZ2ZtZWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NDMyMjUsImV4cCI6MjA4MjUxOTIyNX0.tuUrVzxDlZssFm3pwhB-fSsiL8DQUErHmGeqngvQohc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Veritabanı fonksiyonları

// Oyunları getir
export const getGames = async () => {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .order('id', { ascending: true });
  
  if (error) {
    console.error('Error fetching games:', error);
    return [];
  }
  return data;
};

// Tek bir oyun getir
export const getGameBySlug = async (slug) => {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error('Error fetching game:', error);
    return null;
  }
  return data;
};

// Oyun ekle
export const addGame = async (gameData) => {
  const { data, error } = await supabase
    .from('games')
    .insert([gameData])
    .select();
  
  if (error) {
    console.error('Error adding game:', error);
    return null;
  }
  return data[0];
};

// Oyun güncelle
export const updateGame = async (id, gameData) => {
  const { data, error } = await supabase
    .from('games')
    .update(gameData)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating game:', error);
    return null;
  }
  return data[0];
};

// Oyun sil
export const deleteGame = async (id) => {
  const { error } = await supabase
    .from('games')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting game:', error);
    return false;
  }
  return true;
};

// Görüntülenme sayısını artır
export const incrementViews = async (gameId) => {
  const { error } = await supabase.rpc('increment_game_views', { game_id: gameId });
  
  if (error) {
    console.error('Error incrementing views:', error);
    return false;
  }
  return true;
};

// Yorumları getir
export const getComments = async (gameId) => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('game_id', gameId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
  return data;
};

// Yorum ekle
export const addComment = async (commentData) => {
  const { data, error } = await supabase
    .from('comments')
    .insert([commentData])
    .select();
  
  if (error) {
    console.error('Error adding comment:', error);
    return null;
  }
  return data[0];
};

// Yorum sil
export const deleteComment = async (commentId) => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);
  
  if (error) {
    console.error('Error deleting comment:', error);
    return false;
  }
  return true;
};

// Yorum güncelle (testimonial toggle için)
export const updateComment = async (commentId, updates) => {
  const { data, error } = await supabase
    .from('comments')
    .update(updates)
    .eq('id', commentId)
    .select();
  
  if (error) {
    console.error('Error updating comment:', error);
    return null;
  }
  return data[0];
};

// Testimonial yorumları getir
export const getTestimonials = async () => {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      games (name)
    `)
    .eq('is_testimonial', true)
    .order('created_at', { ascending: false })
    .limit(6);
  
  if (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
  return data;
};

// En yüksek puanlı yorumları getir
export const getTopRatedComments = async (limit = 3) => {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      games (name)
    `)
    .gte('rating', 4)
    .order('rating', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching top rated comments:', error);
    return [];
  }
  return data;
};

// Analytics: Toplam görüntülenmeleri getir
export const getTotalViews = async () => {
  const { data, error } = await supabase
    .from('games')
    .select('views');
  
  if (error) {
    console.error('Error fetching total views:', error);
    return 0;
  }
  return data.reduce((sum, game) => sum + (game.views || 0), 0);
};

// Analytics: Toplam yorum sayısı
export const getTotalComments = async () => {
  const { count, error } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error('Error fetching total comments:', error);
    return 0;
  }
  return count;
};

// Storage: Haber kapak görseli yükleme
export const uploadNewsImage = async (file, newsSlug) => {
  try {
    const slug =
      (newsSlug && String(newsSlug).replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')) ||
      'haber';
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${slug}-${timestamp}.${fileExt}`;
    const filePath = `news/${fileName}`;

    const { error } = await supabase.storage.from('game-images').upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      console.error('Error uploading news image:', error);
      return null;
    }

    const { data: urlData } = supabase.storage.from('game-images').getPublicUrl(filePath);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Failed to upload news image:', error);
    return null;
  }
};

// Storage: Kategori görseli yükleme
export const uploadCategoryImage = async (file, categoryName) => {
  try {
    const slug = slugify(categoryName) || 'kategori';
    const timestamp = Date.now();
    const fileExt = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const fileName = `${slug}-${timestamp}.${fileExt}`;
    const filePath = `categories/${fileName}`;

    const { error } = await supabase.storage.from('game-images').upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      console.error('Error uploading category image:', error);
      return null;
    }

    const { data: urlData } = supabase.storage.from('game-images').getPublicUrl(filePath);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Failed to upload category image:', error);
    return null;
  }
};

// Storage: Resim yükleme
export const uploadGameImage = async (file, gameSlug) => {
  try {
    // Slug temizle (boş veya geçersiz karakterler için)
    const slug = (gameSlug && String(gameSlug).replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')) || 'game';
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${slug}-${timestamp}.${fileExt}`;
    const filePath = `games/${fileName}`;

    // Dosyayı yükle
    const { data, error } = await supabase.storage
      .from('game-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    // Public URL'i al
    const { data: urlData } = supabase.storage
      .from('game-images')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Failed to upload image:', error);
    return null;
  }
};

// Storage: Birden fazla resim yükleme
export const uploadMultipleGameImages = async (files, gameSlug) => {
  try {
    const uploadPromises = files.map(file => uploadGameImage(file, gameSlug));
    const urls = await Promise.all(uploadPromises);
    return urls.filter(url => url !== null);
  } catch (error) {
    console.error('Failed to upload multiple images:', error);
    return [];
  }
};

// Storage: Resim silme
export const deleteGameImage = async (imageUrl) => {
  try {
    // URL'den dosya yolunu çıkar
    const urlParts = imageUrl.split('/game-images/');
    if (urlParts.length < 2) return false;
    
    const filePath = urlParts[1];
    
    const { error } = await supabase.storage
      .from('game-images')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Failed to delete image:', error);
    return false;
  }
};
