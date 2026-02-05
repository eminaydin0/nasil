# Kullanıcı Özellikleri Yol Haritası

## 📊 Mevcut Durum

### Var Olan Özellikler
- ✅ Kayıt/Giriş (Supabase Auth)
- ✅ Profil sayfası
- ✅ Avatar seçimi (14 farklı avatar)
- ✅ Yorum yazma
- ✅ Yorumlara yanıt verme
- ✅ Yorum beğenme
- ✅ Misafir kullanıcı desteği

---

## 🎯 Eklenebilecek Özellikler

### 1. **GAMIFICATION & ROZETLER** 🏆
*Kullanıcı etkileşimini artırır*

#### A. Rozet Sistemi
```sql
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  badge_type VARCHAR NOT NULL,
  earned_at TIMESTAMP DEFAULT NOW(),
  badge_data JSONB
);
```

**Rozet Türleri:**
- 🥇 **İlk Adım**: İlk yorumunu yap
- 💯 **Yorumcu**: 10 yorum yaz
- 🌟 **Süper Yorumcu**: 50 yorum yaz
- 👑 **Efsane**: 100 yorum yaz
- ❤️ **Popüler**: 50 beğeni al
- 🔥 **Trend Setter**: En çok beğenilen yorumu yaz
- 📚 **Okur**: 50 oyun görüntüle
- 🎮 **Oyuncu**: Her kategoriden en az 1 oyun görüntüle
- ⭐ **Kritik**: 5 yıldızlı yorum yaz
- 🎯 **Hedef Odaklı**: 7 gün üst üste siteyi ziyaret et

#### B. Seviye Sistemi
```sql
ALTER TABLE profiles ADD COLUMN level INT DEFAULT 1;
ALTER TABLE profiles ADD COLUMN xp INT DEFAULT 0;
```

**XP Kazanma:**
- Yorum yaz: +10 XP
- Yanıt yaz: +5 XP
- Beğeni al: +2 XP
- Oyun görüntüle: +1 XP
- Günlük giriş: +5 XP

**Seviyeler:**
- 1-99: Çaylak
- 100-499: Acemi
- 500-999: Oyuncu
- 1000-2499: Uzman
- 2500+: Efsane

---

### 2. **FAVORİLER & KAYDETME** ⭐

```sql
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  game_id INT REFERENCES games(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_favorites_game ON user_favorites(game_id);
```

**Özellikler:**
- Oyunları favorilere ekle
- Favoriler listesi (profilde)
- Favori oyunlar için bildirim (yeni ipucu eklendiğinde)
- Favorileri paylaş

---

### 3. **OYUN GEÇMİŞİ** 📖

```sql
CREATE TABLE user_game_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  game_id INT REFERENCES games(id),
  viewed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_history_user ON user_game_history(user_id);
```

**Özellikler:**
- Son görüntülenen oyunlar
- En çok görüntülenen oyunlarım
- Görüntüleme geçmişini temizle

---

### 4. **SKOR TAKİBİ** 🎯

```sql
CREATE TABLE user_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  game_id INT REFERENCES games(id),
  score INT NOT NULL,
  opponent_names TEXT[],
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Özellikler:**
- Okey/Batak skorlarını kaydet
- Skor geçmişi
- İstatistikler (kazanma oranı, ortalama skor)
- Rakip takibi
- Grafik gösterimi

---

### 5. **SOSYAL ÖZELLİKLER** 👥

#### A. Takip Sistemi
```sql
CREATE TABLE user_follows (
  follower_id UUID REFERENCES auth.users(id),
  following_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);
```

**Özellikler:**
- Kullanıcıları takip et
- Takipçi/Takip edilen listeleri
- Takip edilen kullanıcıların yorumlarını görüntüle

#### B. Bildirimler
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  type VARCHAR NOT NULL,
  content TEXT NOT NULL,
  link VARCHAR,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Bildirim Türleri:**
- Yorumuna yanıt geldi
- Yorumun beğenildi
- Takip ettiğin kullanıcı yorum yaptı
- Yeni rozet kazandın
- Favori oyununa yeni ipucu eklendi

---

### 6. **PROFİL GENİŞLETMELERİ** 👤

```sql
ALTER TABLE profiles ADD COLUMN bio TEXT;
ALTER TABLE profiles ADD COLUMN location VARCHAR;
ALTER TABLE profiles ADD COLUMN favorite_game INT REFERENCES games(id);
ALTER TABLE profiles ADD COLUMN twitter_handle VARCHAR;
ALTER TABLE profiles ADD COLUMN instagram_handle VARCHAR;
ALTER TABLE profiles ADD COLUMN website_url VARCHAR;
ALTER TABLE profiles ADD COLUMN privacy_settings JSONB DEFAULT '{"show_email": false, "show_activity": true}';
```

**Eklenecek Alanlar:**
- Biyografi (250 karakter)
- Konum (şehir)
- Favori oyun
- Sosyal medya linkleri
- Kişisel website
- Gizlilik ayarları

---

### 7. **İÇERİK KATKISI** ✍️

```sql
CREATE TABLE user_contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  contribution_type VARCHAR NOT NULL,
  content JSONB NOT NULL,
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Özellikler:**
- Oyun öner
- İpucu ekle
- Hata bildir
- Çeviri öner
- Moderasyon puanı

---

### 8. **PREMİUM ÖZELLİKLER** 💎

```sql
ALTER TABLE profiles ADD COLUMN is_premium BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN premium_expires_at TIMESTAMP;
```

**Premium Kullanıcı Avantajları:**
- Reklamsız deneyim
- Özel avatar'lar
- Özel rozet çerçevesi
- Öncelikli destek
- Gelişmiş istatistikler
- Sınırsız favori
- Yorum vurgulama
- Özel profil teması

---

### 9. **LİDERLİK TABLOLARI** 📊

```sql
CREATE TABLE leaderboards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  leaderboard_type VARCHAR NOT NULL,
  score INT NOT NULL,
  rank INT,
  period VARCHAR NOT NULL,
  calculated_at TIMESTAMP DEFAULT NOW()
);
```

**Liderlik Türleri:**
- En çok yorum yapan
- En çok beğeni alan
- En aktif kullanıcı
- Günlük/Haftalık/Aylık/Tüm zamanlar

---

### 10. **ETKİLEŞİM ÖZELLİKLERİ** 💬

#### A. Yorumlara Reaksiyon
```sql
CREATE TABLE comment_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  comment_id UUID REFERENCES comments(id),
  reaction_type VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Reaksiyon Türleri:**
- 👍 Beğendim
- ❤️ Harika
- 😂 Komik
- 🤔 İlginç
- 💡 Faydalı

#### B. Yorum Raporlama
```sql
CREATE TABLE comment_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES auth.users(id),
  comment_id UUID REFERENCES comments(id),
  reason VARCHAR NOT NULL,
  details TEXT,
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Uygulama Öncelik Sırası

### **Faz 1: Temel Özellikler** (1-2 Hafta)
1. ✨ Favoriler sistemi
2. 📖 Oyun geçmişi
3. 🏆 Basit rozet sistemi (ilk 5 rozet)
4. 📊 Profil istatistikleri

### **Faz 2: Gamification** (2-3 Hafta)
1. 🎯 Seviye/XP sistemi
2. 🏅 Tüm rozet türleri
3. 📈 Liderlik tabloları
4. 🔔 Bildirim sistemi

### **Faz 3: Sosyal** (3-4 Hafta)
1. 👥 Takip sistemi
2. 💬 Gelişmiş yorum reaksiyonları
3. 🎮 Skor takibi
4. ✍️ İçerik katkısı

### **Faz 4: Premium** (Gelir Modeli)
1. 💎 Premium üyelik sistemi
2. 🎨 Özel avatarlar
3. 📊 Gelişmiş analytics
4. 🎁 Özel özellikler

---

## 💻 Örnek Kod: Favoriler Sistemi

### 1. Database Migration
```sql
-- /supabase/create-favorites-table.sql
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id INT REFERENCES games(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, game_id)
);

CREATE INDEX idx_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_favorites_game ON user_favorites(game_id);

-- RLS Policies
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites"
  ON user_favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON user_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites"
  ON user_favorites FOR DELETE
  USING (auth.uid() = user_id);
```

### 2. React Hook
```javascript
// /src/hooks/useFavorites.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('*, game:games(*)')
        .eq('user_id', user.id);
      
      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (gameId) => {
    if (!user) {
      toast.error('Favorilere eklemek için giriş yapın');
      return false;
    }

    const isFavorite = favorites.some(f => f.game_id === gameId);

    try {
      if (isFavorite) {
        await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('game_id', gameId);
        
        setFavorites(favorites.filter(f => f.game_id !== gameId));
        toast.success('Favorilerden kaldırıldı');
      } else {
        const { data, error } = await supabase
          .from('user_favorites')
          .insert([{ user_id: user.id, game_id: gameId }])
          .select('*, game:games(*)')
          .single();
        
        if (error) throw error;
        setFavorites([...favorites, data]);
        toast.success('Favorilere eklendi');
      }
      return true;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Bir hata oluştu');
      return false;
    }
  };

  const isFavorite = (gameId) => {
    return favorites.some(f => f.game_id === gameId);
  };

  useEffect(() => {
    loadFavorites();
  }, [user]);

  return { favorites, loading, toggleFavorite, isFavorite, refresh: loadFavorites };
};
```

### 3. Favorite Button Component
```javascript
// /src/components/common/FavoriteButton.jsx
import { Heart } from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';

export default function FavoriteButton({ gameId, className = '' }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(gameId);

  return (
    <button
      onClick={() => toggleFavorite(gameId)}
      className={`p-2 rounded-full transition-all ${
        favorite 
          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } ${className}`}
      title={favorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
    >
      <Heart 
        size={20} 
        className={favorite ? 'fill-current' : ''} 
      />
    </button>
  );
}
```

---

## 📌 Notlar

1. **Performans**: Büyük veri setleri için indexleme önemli
2. **Önbellekleme**: React Query veya SWR kullan
3. **Real-time**: Supabase Realtime için bildirimler
4. **Mobil**: Push notification desteği
5. **Analytics**: Kullanıcı davranışlarını takip et
6. **A/B Testing**: Yeni özellikleri test et
7. **GDPR**: Kullanıcı verilerini koru
8. **Rate Limiting**: API'leri koru

---

## 🎨 UI/UX Önerileri

1. **Onboarding**: Yeni kullanıcılar için rehber
2. **Gamification**: Görsel rozetler ve animasyonlar
3. **Progress Bars**: Seviye ve XP göstergeleri
4. **Notifications**: Toast ve in-app bildirimler
5. **Empty States**: Boş favoriler için çağrı
6. **Loading States**: Skeleton loaders
7. **Micro-interactions**: Beğeni animasyonları

---

**Hedef**: Kullanıcı etkileşimini %200 artırmak! 🚀
