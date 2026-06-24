import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  User,
  LogOut,
  Mail,
  Settings,
  Shield,
  Heart,
  Gamepad2,
  Wrench,
  Calendar,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import toast from 'react-hot-toast';
import { useFavorites } from '../../hooks/useFavorites';
import GameCard from '../../components/home/GameCard';
import { Avatar, Button, TextField } from '../../components/ui';

const AVATAR_OPTIONS = [
  'https://api.dicebear.com/9.x/adventurer/svg?seed=Felix',
  'https://api.dicebear.com/9.x/adventurer/svg?seed=Aneka',
  'https://api.dicebear.com/9.x/adventurer/svg?seed=Gizmo',
  'https://api.dicebear.com/9.x/adventurer/svg?seed=Baby',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Scooter',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Mimi',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Boots',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=Jack',
  'https://api.dicebear.com/9.x/bottts/svg?seed=Cuddles',
  'https://api.dicebear.com/9.x/bottts/svg?seed=Willow',
  'https://api.dicebear.com/9.x/bottts/svg?seed=Buster',
  'https://api.dicebear.com/9.x/micah/svg?seed=Midnight',
  'https://api.dicebear.com/9.x/micah/svg?seed=Bandit',
  'https://api.dicebear.com/9.x/micah/svg?seed=Bear',
];

const TABS = [
  { id: 'genel', label: 'Genel Bakış', icon: User, hash: '' },
  { id: 'favoriler', label: 'Favorilerim', icon: Heart, hash: '#favoriler' },
  { id: 'ayarlar', label: 'Ayarlar', icon: Settings, hash: '#hesap' },
];

const hashToTab = (hash) => {
  if (hash === '#favoriler') return 'favoriler';
  if (hash === '#hesap' || hash === '#ayarlar') return 'ayarlar';
  return 'genel';
};

function genderLabel(gender) {
  if (gender === 'male') return 'Erkek';
  if (gender === 'female') return 'Kadın';
  return gender ? 'Diğer' : null;
}

function InfoRow({ icon: Icon, label, value, valueClass = '' }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-warm-200/70 bg-cream-50 p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-orange-600 shadow-soft">
        <Icon size={18} aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-warm-500">{label}</p>
        <p className={`text-sm font-semibold text-warm-900 break-all ${valueClass}`}>{value}</p>
      </div>
    </div>
  );
}

function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { favorites, loading: favoritesLoading } = useFavorites();

  const [activeTab, setActiveTab] = useState(() => hashToTab(location.hash));
  const [displayName, setDisplayName] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  useEffect(() => {
    if (!user) navigate('/auth', { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    setActiveTab(hashToTab(location.hash));
  }, [location.hash]);

  useEffect(() => {
    setDisplayName(user?.user_metadata?.full_name || '');
  }, [user?.user_metadata?.full_name]);

  const currentAvatar = user?.user_metadata?.avatar_url;
  const email = user?.email || '';
  const fallbackName = email.split('@')[0] || 'Kullanıcı';
  const name = user?.user_metadata?.full_name || fallbackName;

  const memberSince = useMemo(() => {
    if (!user?.created_at) return null;
    return new Date(user.created_at).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [user?.created_at]);

  const emailVerified = !!user?.email_confirmed_at;

  const handleTabChange = (tab) => {
    setActiveTab(tab.id);
    const hash = tab.hash || '';
    navigate({ pathname: '/profil', hash: hash.replace('#', '') }, { replace: true });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Çıkış yapıldı');
      navigate('/');
    } catch {
      toast.error('Çıkış yapılırken bir hata oluştu');
    }
  };

  const handleAvatarSelect = async (url) => {
    if (!user) return;
    setAvatarLoading(true);
    try {
      const { error: authError } = await supabase.auth.updateUser({
        data: { avatar_url: url },
      });
      if (authError) throw authError;

      await supabase.from('profiles').update({ avatar_url: url }).eq('id', user.id);
      toast.success('Profil resmi güncellendi');
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error('Profil resmi güncellenemedi');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleSaveName = async (e) => {
    e.preventDefault();
    if (!user) return;
    const trimmed = displayName.trim();
    if (!trimmed) {
      toast.error('Ad soyad boş olamaz');
      return;
    }
    setSavingName(true);
    try {
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: trimmed },
      });
      if (authError) throw authError;

      await supabase.from('profiles').update({ full_name: trimmed }).eq('id', user.id);
      toast.success('Profil bilgileriniz güncellendi');
    } catch (error) {
      console.error('Error updating name:', error);
      toast.error('Kaydedilemedi, tekrar deneyin');
    } finally {
      setSavingName(false);
    }
  };

  if (!user) return null;

  const breadcrumbs = [{ name: 'Profilim', url: null }];

  const quickLinks = [
    { to: '/oyunlar', icon: Gamepad2, label: 'Oyunları keşfet', desc: 'Tüm oyun rehberi' },
    { to: '/araclar', icon: Wrench, label: 'Oyun araçları', desc: 'Yazboz, sayaç, zar' },
  ];

  return (
    <div className="min-h-screen bg-cream-50 py-12 font-sans">
      <SEO
        title="Profilim - Kuralı Ne?"
        description="Hesabınız, favorileriniz ve profil ayarları"
        url="/profil"
        noindex
      />

      <div className="container mx-auto px-4">
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Sol sidebar */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-24 space-y-4">
              <div className="overflow-hidden rounded-2xl border border-warm-200/70 bg-white shadow-soft">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 px-6 pb-12 pt-6 text-white">
                  <p className="text-xs font-semibold uppercase tracking-wide text-orange-100">Hesabım</p>
                </div>
                <div className="-mt-10 px-6 pb-6 text-center">
                  <div className="mx-auto inline-block rounded-full ring-4 ring-white">
                    <Avatar src={currentAvatar} name={name} size="xl" className="!h-20 !w-20 !text-xl" />
                  </div>
                  <h1 className="mt-3 text-lg font-extrabold text-warm-900">{name}</h1>
                  <p className="mt-0.5 truncate text-sm text-warm-500">{email}</p>
                  {emailVerified && (
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                      <CheckCircle2 size={12} aria-hidden />
                      E-posta doğrulandı
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-px border-t border-warm-100 bg-warm-100">
                  <div className="bg-white px-4 py-3 text-center">
                    <p className="text-xl font-black text-orange-600">{favorites.length}</p>
                    <p className="text-[11px] font-medium text-warm-500">Favori</p>
                  </div>
                  <div className="bg-white px-4 py-3 text-center">
                    <p className="text-sm font-bold text-warm-900 leading-tight">
                      {memberSince ? memberSince.split(' ').slice(-2).join(' ') : '—'}
                    </p>
                    <p className="text-[11px] font-medium text-warm-500">Üyelik</p>
                  </div>
                </div>
              </div>

              <nav className="rounded-2xl border border-warm-200/70 bg-white p-2 shadow-soft">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleTabChange(tab)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                        active
                          ? 'bg-orange-50 text-orange-700'
                          : 'text-warm-700 hover:bg-cream-50 hover:text-warm-900'
                      }`}
                    >
                      <Icon size={18} className={active ? 'text-orange-600' : 'text-warm-400'} aria-hidden />
                      {tab.label}
                      {tab.id === 'favoriler' && favorites.length > 0 && (
                        <span className="ml-auto rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700">
                          {favorites.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-2.5 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100"
              >
                <LogOut size={16} aria-hidden />
                Çıkış Yap
              </button>
            </div>
          </aside>

          {/* Sağ içerik */}
          <main className="lg:col-span-8 xl:col-span-9">
            {activeTab === 'genel' && (
              <div id="genel" className="space-y-6">
                <div className="rounded-2xl border border-warm-200/70 bg-white p-6 shadow-soft sm:p-8">
                  <h2 className="text-xl font-extrabold text-warm-900">Merhaba, {name.split(' ')[0]}!</h2>
                  <p className="mt-2 text-sm leading-relaxed text-warm-600 sm:text-base">
                    Favori oyunlarını kaydet, profilini özelleştir ve oyun araçlarımızla masada pratik kal.
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {quickLinks.map(({ to, icon: Icon, label, desc }) => (
                      <Link
                        key={to}
                        to={to}
                        className="group flex items-start gap-3 rounded-xl border border-warm-200/70 bg-cream-50 p-4 transition-colors hover:border-orange-200 hover:bg-orange-50/50"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-orange-600 shadow-soft transition-transform group-hover:scale-105">
                          <Icon size={20} aria-hidden />
                        </span>
                        <span>
                          <span className="block text-sm font-bold text-warm-900 group-hover:text-orange-700">
                            {label}
                          </span>
                          <span className="mt-0.5 block text-xs text-warm-500">{desc}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-warm-200/70 bg-white p-6 shadow-soft">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="text-lg font-extrabold text-warm-900">Son favoriler</h3>
                    {favorites.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleTabChange(TABS[1])}
                        className="text-sm font-semibold text-orange-600 hover:text-orange-700"
                      >
                        Tümünü gör →
                      </button>
                    )}
                  </div>
                  {favoritesLoading ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-48 animate-pulse rounded-2xl bg-warm-100" />
                      ))}
                    </div>
                  ) : favorites.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-warm-200 bg-cream-50 py-10 text-center">
                      <Heart className="mx-auto mb-3 text-warm-300" size={32} aria-hidden />
                      <p className="text-sm text-warm-600">Henüz favori oyununuz yok.</p>
                      <Link
                        to="/oyunlar"
                        className="mt-2 inline-block text-sm font-semibold text-orange-600 hover:text-orange-700"
                      >
                        Oyunları keşfedin →
                      </Link>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {favorites.slice(0, 2).map((fav) => {
                        const game = fav.game;
                        if (!game) return null;
                        return (
                          <GameCard
                            key={fav.id}
                            game={{
                              id: game.id,
                              slug: game.slug,
                              name: game.name,
                              category: game.category,
                              players: game.players,
                              image: game.image,
                              shortDescription: game.short_description,
                            }}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'favoriler' && (
              <div id="favoriler" className="scroll-mt-24 rounded-2xl border border-warm-200/70 bg-white p-6 shadow-soft sm:p-8">
                <h2 className="text-xl font-extrabold text-warm-900">Favori Oyunlarım</h2>
                <p className="mt-1 text-sm text-warm-500">
                  {favorites.length > 0
                    ? `${favorites.length} oyun favorilerinizde`
                    : 'Beğendiğiniz oyunları kalp ikonuyla kaydedin'}
                </p>

                <div className="mt-6">
                  {favoritesLoading ? (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-56 animate-pulse rounded-2xl bg-warm-100" />
                      ))}
                    </div>
                  ) : favorites.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-warm-200 bg-cream-50 py-16 text-center">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50">
                        <Heart className="text-orange-500" size={28} aria-hidden />
                      </div>
                      <p className="text-base font-semibold text-warm-800">Favori listeniz boş</p>
                      <p className="mx-auto mt-2 max-w-sm text-sm text-warm-500">
                        Oyun detay sayfasındaki kalp ikonuna basarak favorilerinize ekleyebilirsiniz.
                      </p>
                      <Link to="/oyunlar" className="mt-5 inline-block">
                        <Button size="md">Oyunlara git</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {favorites.map((fav) => {
                        const game = fav.game;
                        if (!game) return null;
                        return (
                          <GameCard
                            key={fav.id}
                            game={{
                              id: game.id,
                              slug: game.slug,
                              name: game.name,
                              category: game.category,
                              players: game.players,
                              image: game.image,
                              shortDescription: game.short_description,
                            }}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'ayarlar' && (
              <div id="hesap" className="scroll-mt-24 space-y-6">
                <div className="rounded-2xl border border-warm-200/70 bg-white p-6 shadow-soft sm:p-8">
                  <h2 className="text-xl font-extrabold text-warm-900">Profil fotoğrafı</h2>
                  <p className="mt-1 text-sm text-warm-500">Aşağıdan bir avatar seçin</p>

                  <div className="mt-5 flex items-center gap-4 rounded-xl border border-warm-200/70 bg-cream-50 p-4">
                    <Avatar src={currentAvatar} name={name} size="lg" ring />
                    <div>
                      <p className="text-sm font-semibold text-warm-900">{name}</p>
                      <p className="text-xs text-warm-500">Seçiminiz anında kaydedilir</p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-4 gap-3 sm:grid-cols-7">
                    {AVATAR_OPTIONS.map((avatar, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleAvatarSelect(avatar)}
                        disabled={avatarLoading}
                        className={`aspect-square overflow-hidden rounded-full border-2 bg-white transition-all hover:scale-105 disabled:opacity-50 ${
                          currentAvatar === avatar
                            ? 'border-orange-500 ring-2 ring-orange-200'
                            : 'border-warm-200 hover:border-orange-300'
                        }`}
                      >
                        <img src={avatar} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                  {avatarLoading && (
                    <p className="mt-3 text-xs font-medium text-orange-600">Kaydediliyor…</p>
                  )}
                </div>

                <div className="rounded-2xl border border-warm-200/70 bg-white p-6 shadow-soft sm:p-8">
                  <h2 className="text-xl font-extrabold text-warm-900">Görünen ad</h2>
                  <p className="mt-1 text-sm text-warm-500">Yorumlarda ve profilinizde görünür</p>

                  <form onSubmit={handleSaveName} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="flex-1">
                      <TextField
                        label="Ad Soyad"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Adınız ve soyadınız"
                        tone="subtle"
                      />
                    </div>
                    <Button type="submit" size="md" loading={savingName} className="sm:mb-0.5">
                      Kaydet
                    </Button>
                  </form>
                </div>

                <div className="rounded-2xl border border-warm-200/70 bg-white p-6 shadow-soft sm:p-8">
                  <h2 className="text-xl font-extrabold text-warm-900">Hesap bilgileri</h2>
                  <p className="mt-1 text-sm text-warm-500">Kayıt sırasında verdiğiniz bilgiler</p>

                  <div className="mt-5 space-y-3">
                    <InfoRow icon={Mail} label="E-posta" value={email} />
                    <InfoRow icon={User} label="Ad Soyad" value={user.user_metadata?.full_name} />
                    <InfoRow icon={Calendar} label="Üyelik tarihi" value={memberSince} />
                    <InfoRow
                      icon={Shield}
                      label="Hesap durumu"
                      value={emailVerified ? 'Aktif · Doğrulanmış' : 'Aktif'}
                      valueClass={emailVerified ? 'text-emerald-600' : ''}
                    />
                    <InfoRow
                      icon={Settings}
                      label="Doğum yılı"
                      value={user.user_metadata?.birth_year}
                    />
                    <InfoRow
                      icon={User}
                      label="Cinsiyet"
                      value={genderLabel(user.user_metadata?.gender)}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-orange-200/70 bg-orange-50/60 p-5">
                  <div className="flex gap-3">
                    <Sparkles className="shrink-0 text-orange-600" size={20} aria-hidden />
                    <div>
                      <p className="text-sm font-semibold text-orange-900">Yakında</p>
                      <p className="mt-1 text-sm text-orange-800/90">
                        Skor geçmişi, turnuva oluşturma ve şifre değiştirme özellikleri üzerinde çalışıyoruz.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
