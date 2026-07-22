import { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  Newspaper,
  Save,
  Star,
  Upload,
  ImageIcon,
  ExternalLink,
  Copy,
  Filter,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase, uploadNewsImage, deleteGameImage } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { useConfirm, Modal } from '../ui';
import AdminPageHeader from './AdminPageHeader';
import { slugify } from '../../utils/slugify';
import { calculateReadTimeMinutes, NEWS_CATEGORIES } from '../../utils/newsContent';
import { analyzeNewsSeo } from '../../lib/newsAlgorithm';
import NewsSeoPreview from './NewsSeoPreview';
import NewsContentEditor from './NewsContentEditor';

const EMPTY_FORM = {
  title: '',
  slug: '',
  subtitle: '',
  excerpt: '',
  content: '',
  cover_image: '',
  category: 'Oyun Dünyası',
  tags: '',
  related_game_id: '',
  author: 'Kuralı Ne?',
  author_avatar: '',
  seo_title: '',
  seo_description: '',
  is_published: false,
  is_featured: false,
  published_at: '',
};

function NewsManager() {
  const confirm = useConfirm();
  const [posts, setPosts] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [slugManual, setSlugManual] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [coverPreview, setCoverPreview] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');

  const loadData = async () => {
    try {
      setLoading(true);
      const [newsResult, gamesResult] = await Promise.all([
        supabase
          .from('news_posts')
          .select('*, related_game:games!related_game_id(id, name, slug)')
          .order('created_at', { ascending: false }),
        supabase.from('games').select('id, name, slug').order('name'),
      ]);

      if (newsResult.error) throw newsResult.error;
      setPosts(newsResult.data || []);
      setGames(gamesResult.data || []);
    } catch (error) {
      console.error('Error loading news:', error);
      toast.error('Haberler yüklenirken hata oluştu. Tablo oluşturuldu mu?');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
    setSlugManual(false);
    setCoverPreview('');
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Dosya boyutu 5MB\'dan küçük olmalıdır');
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Sadece resim dosyaları yüklenebilir');
      return;
    }

    setUploading(true);
    const slug = formData.slug || slugify(formData.title) || 'haber';
    try {
      const url = await uploadNewsImage(file, slug);
      if (url) {
        setFormData((prev) => ({ ...prev, cover_image: url }));
        setCoverPreview(url);
        toast.success('Kapak görseli yüklendi');
      } else {
        toast.error('Görsel yüklenemedi');
      }
    } catch {
      toast.error('Yükleme hatası');
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const url = await uploadNewsImage(file, `${formData.slug || 'yazar'}-avatar`);
      if (url) {
        setFormData((prev) => ({ ...prev, author_avatar: url }));
        toast.success('Yazar fotoğrafı yüklendi');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (post) => {
    setFormData({
      title: post.title || '',
      slug: post.slug || '',
      subtitle: post.subtitle || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      cover_image: post.cover_image || '',
      category: post.category || 'Oyun Dünyası',
      tags: (post.tags || []).join(', '),
      related_game_id: post.related_game_id ? String(post.related_game_id) : '',
      author: post.author || 'Kuralı Ne?',
      author_avatar: post.author_avatar || '',
      seo_title: post.seo_title || '',
      seo_description: post.seo_description || '',
      is_published: post.is_published ?? false,
      is_featured: post.is_featured ?? false,
      published_at: post.published_at
        ? new Date(post.published_at).toISOString().slice(0, 16)
        : '',
    });
    setCoverPreview(post.cover_image || '');
    setEditingId(post.id);
    setSlugManual(true);
    setShowForm(true);
  };

  const handleTitleChange = (title) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: slugManual ? prev.slug : slugify(title),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Başlık zorunludur');
      return;
    }
    if (!formData.slug.trim()) {
      toast.error('Slug zorunludur');
      return;
    }
    if (!formData.content.trim()) {
      toast.error('İçerik zorunludur');
      return;
    }

    setSaving(true);
    try {
      const tags = formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      let publishedAt = formData.published_at
        ? new Date(formData.published_at).toISOString()
        : null;

      if (formData.is_published && !publishedAt) {
        publishedAt = new Date().toISOString();
      }

      const readTime = calculateReadTimeMinutes(formData.content);

      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        subtitle: formData.subtitle.trim() || null,
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        cover_image: formData.cover_image.trim() || null,
        category: formData.category,
        tags,
        related_game_id: (() => {
          const id = Number(formData.related_game_id);
          return formData.related_game_id && Number.isFinite(id) && id > 0 ? id : null;
        })(),
        author: formData.author.trim() || 'Kuralı Ne?',
        author_avatar: formData.author_avatar.trim() || null,
        seo_title: formData.seo_title.trim() || null,
        seo_description: formData.seo_description.trim() || null,
        read_time_minutes: readTime,
        is_published: formData.is_published,
        is_featured: formData.is_featured,
        published_at: formData.is_published ? publishedAt : null,
      };

      if (editingId) {
        const { error } = await supabase
          .from('news_posts')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
        toast.success('Haber güncellendi');
      } else {
        const { error } = await supabase.from('news_posts').insert([payload]);
        if (error) throw error;
        toast.success('Haber eklendi');
      }

      resetForm();
      loadData();
    } catch (error) {
      console.error('Save news error:', error);
      const msg = error?.message || '';
      const details = error?.details ? ` (${error.details})` : '';
      if (msg.includes('duplicate') || msg.includes('unique')) {
        toast.error('Bu slug zaten kullanılıyor');
      } else if (msg.includes('column') || msg.includes('schema cache')) {
        toast.error(
          'Veritabanı güncel değil. Supabase SQL Editor\'da fix-news-posts-table.sql dosyasını çalıştırın.',
          { duration: 6000 }
        );
      } else if (msg.includes('foreign key') || msg.includes('related_game_id')) {
        toast.error('İlgili oyun geçersiz — oyun seçimini kaldırıp tekrar deneyin');
      } else {
        toast.error(`Kaydedilemedi: ${msg}${details}`, { duration: 5000 });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (post) => {
    const ok = await confirm({
      title: 'Haberi sil',
      description: `"${post.title}" silinsin mi?`,
      confirmText: 'Sil',
      type: 'danger',
    });
    if (!ok) return;

    try {
      const { error } = await supabase.from('news_posts').delete().eq('id', post.id);
      if (error) throw error;
      toast.success('Haber silindi');
      loadData();
    } catch (error) {
      console.error('Delete news error:', error);
      toast.error('Silinirken hata oluştu');
    }
  };

  const togglePublished = async (post) => {
    try {
      const next = !post.is_published;
      const { error } = await supabase
        .from('news_posts')
        .update({
          is_published: next,
          published_at: next
            ? post.published_at || new Date().toISOString()
            : null,
        })
        .eq('id', post.id);
      if (error) throw error;
      toast.success(next ? 'Haber yayınlandı' : 'Haber taslağa alındı');
      loadData();
    } catch (_error) {
      toast.error('Durum güncellenemedi');
    }
  };

  const handleDuplicate = async (post) => {
    const ok = await confirm({
      title: 'Haberi kopyala',
      description: `"${post.title}" taslağı olarak kopyalansın mı?`,
      confirmText: 'Kopyala',
    });
    if (!ok) return;

    try {
      const baseSlug = `${post.slug}-kopya`;
      let newSlug = baseSlug;
      let n = 1;
      while (posts.some((p) => p.slug === newSlug)) {
        newSlug = `${baseSlug}-${n}`;
        n += 1;
      }

      const readTime = calculateReadTimeMinutes(post.content || '');

      const { error } = await supabase.from('news_posts').insert([
        {
          title: `${post.title} (Kopya)`,
          slug: newSlug,
          subtitle: post.subtitle,
          excerpt: post.excerpt,
          content: post.content,
          cover_image: post.cover_image,
          category: post.category,
          tags: post.tags || [],
          related_game_id: post.related_game_id,
          author: post.author,
          author_avatar: post.author_avatar,
          seo_title: post.seo_title,
          seo_description: post.seo_description,
          read_time_minutes: readTime,
          is_published: false,
          is_featured: false,
          published_at: null,
          view_count: 0,
        },
      ]);

      if (error) throw error;
      toast.success('Haber kopyalandı (taslak)');
      loadData();
    } catch (err) {
      console.error(err);
      toast.error('Kopyalanamadı');
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (statusFilter === 'published' && !post.is_published) return false;
      if (statusFilter === 'draft' && post.is_published) return false;
      if (categoryFilter !== 'all' && post.category !== categoryFilter) return false;
      if (featuredFilter === 'featured' && !post.is_featured) return false;
      return true;
    });
  }, [posts, statusFilter, categoryFilter, featuredFilter]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-orange-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        description="Oyun dünyası haberlerini ekleyin, düzenleyin ve yayınlayın"
        actions={
          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2.5 text-sm font-bold text-white shadow-warm-glow transition-all hover:-translate-y-0.5"
          >
            <Plus size={16} />
            Yeni Haber
          </button>
        }
      />

      <Modal
        open={showForm}
        onClose={resetForm}
        title={editingId ? 'Haberi Düzenle' : 'Yeni Haber'}
        description="Kapak, içerik ve SEO alanlarını doldurun; kaydettikten sonra listede görünür."
        icon={Newspaper}
        size="3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold text-warm-700">Başlık *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm"
                placeholder="GTA 6 ne zaman çıkacak? Fiyat ve çıkış tarihi"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-warm-700">Slug *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => {
                  setSlugManual(true);
                  setFormData((prev) => ({ ...prev, slug: e.target.value }));
                }}
                className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm font-mono"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-warm-700">Kategori</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm"
              >
                {NEWS_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold text-warm-700">Alt başlık (spot)</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm"
                placeholder="Manşette görünen kısa vurgu cümlesi"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold text-warm-700">Özet (meta / kart)</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                rows={2}
                className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm"
                placeholder="Kısa özet — arama sonuçlarında görünür"
              />
            </div>

            <div className="sm:col-span-2">
              <NewsContentEditor
                value={formData.content}
                onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
                newsSlug={formData.slug || slugify(formData.title) || 'haber'}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold text-warm-700">Kapak görseli</label>
              <input
                type="url"
                value={formData.cover_image}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, cover_image: e.target.value }));
                  setCoverPreview(e.target.value);
                }}
                className="mb-2 w-full rounded-lg border border-warm-200 px-3 py-2 text-sm"
                placeholder="URL veya aşağıdan yükle"
              />
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-warm-200 px-4 py-6 transition hover:border-orange-400">
                <Upload size={20} className="text-warm-400" />
                <span className="text-sm text-warm-600">
                  {uploading ? 'Yükleniyor...' : 'Bilgisayardan kapak fotoğrafı yükle'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={handleCoverUpload}
                />
              </label>
              {(coverPreview || formData.cover_image) && (
                <div className="relative mt-3 inline-block">
                  <img
                    src={coverPreview || formData.cover_image}
                    alt="Kapak önizleme"
                    className="h-36 w-auto max-w-full rounded-lg border border-warm-200 object-cover"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      const url = formData.cover_image;
                      setFormData((prev) => ({ ...prev, cover_image: '' }));
                      setCoverPreview('');
                      if (url?.includes('supabase')) await deleteGameImage(url);
                    }}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow"
                    aria-label="Görseli kaldır"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-warm-700">İlgili oyun</label>
              <select
                value={formData.related_game_id}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, related_game_id: e.target.value }))
                }
                className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm"
              >
                <option value="">Seçilmedi</option>
                {games.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-warm-700">Etiketler</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm"
                placeholder="GTA 6, Rockstar, çıkış tarihi"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-warm-700">Yazar</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-warm-700">Yazar fotoğrafı</label>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-warm-200 px-3 py-2 text-sm text-warm-600 hover:border-orange-300">
                <ImageIcon size={18} />
                {formData.author_avatar ? 'Değiştir' : 'Yükle'}
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>
              {formData.author_avatar && (
                <img src={formData.author_avatar} alt="" className="mt-2 h-12 w-12 rounded-full object-cover" />
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold text-warm-700">SEO başlığı</label>
              <input
                type="text"
                value={formData.seo_title}
                onChange={(e) => setFormData((prev) => ({ ...prev, seo_title: e.target.value }))}
                className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm"
                placeholder="Boş bırakılırsa haber başlığı kullanılır (ideal: 30–60 karakter)"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold text-warm-700">SEO açıklaması</label>
              <textarea
                value={formData.seo_description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, seo_description: e.target.value }))
                }
                rows={2}
                className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm"
                placeholder="Google sonuçları için (ideal: 70–160 karakter)"
              />
            </div>

            <div className="sm:col-span-2">
              <NewsSeoPreview post={formData} />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-warm-700">Yayın tarihi</label>
              <input
                type="datetime-local"
                value={formData.published_at}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, published_at: e.target.value }))
                }
                className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-warm-700">
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, is_published: e.target.checked }))
                  }
                  className="rounded border-warm-300 text-orange-600"
                />
                Yayında
              </label>
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-warm-700">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, is_featured: e.target.checked }))
                  }
                  className="rounded border-warm-300 text-orange-600"
                />
                Öne çıkan
              </label>
            </div>
          </div>

          <div className="mt-2 flex justify-end gap-3 border-t border-warm-100 pt-4">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-warm-200 px-4 py-2 text-sm font-bold text-warm-700 hover:bg-warm-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2 text-sm font-bold text-white shadow-warm-glow disabled:opacity-60"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Kaydet
            </button>
          </div>
        </form>
      </Modal>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-warm-200 bg-white py-16 text-center">
          <Newspaper className="mx-auto mb-3 text-warm-300" size={40} />
          <p className="font-semibold text-warm-700">Henüz haber yok</p>
          <p className="mt-1 text-sm text-warm-500">
            İlk haberi ekleyerek başlayın veya SQL tablosunu oluşturduğunuzdan emin olun.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-warm-600">
                <Filter size={15} />
                Filtre
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-warm-200 px-3 py-2 text-sm"
              >
                <option value="all">Tüm durumlar</option>
                <option value="published">Yayında</option>
                <option value="draft">Taslak</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-lg border border-warm-200 px-3 py-2 text-sm"
              >
                <option value="all">Tüm kategoriler</option>
                {NEWS_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <select
                value={featuredFilter}
                onChange={(e) => setFeaturedFilter(e.target.value)}
                className="rounded-lg border border-warm-200 px-3 py-2 text-sm"
              >
                <option value="all">Tüm haberler</option>
                <option value="featured">Sadece öne çıkan</option>
              </select>
              <span className="text-sm text-warm-500">
                {filteredPosts.length} / {posts.length} haber
              </span>
            </div>

        <div className="overflow-hidden rounded-2xl border border-warm-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-warm-100 bg-cream-50 text-xs font-bold uppercase tracking-wide text-warm-500">
                <tr>
                  <th className="px-4 py-3">Başlık</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Durum</th>
                  <th className="px-4 py-3">SEO</th>
                  <th className="px-4 py-3">Görüntülenme</th>
                  <th className="px-4 py-3">Tarih</th>
                  <th className="px-4 py-3 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100">
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-warm-500">
                      Filtreye uygun haber bulunamadı
                    </td>
                  </tr>
                ) : (
                filteredPosts.map((post) => {
                  const seo = analyzeNewsSeo(post);
                  const seoClass =
                    seo.score >= 80
                      ? 'bg-emerald-100 text-emerald-700'
                      : seo.score >= 60
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700';

                  return (
                  <tr key={post.id} className="hover:bg-cream-50/80">
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        {post.is_featured && (
                          <Star size={14} className="mt-0.5 shrink-0 fill-amber-400 text-amber-400" />
                        )}
                        <div>
                          <p className="font-semibold text-warm-900 line-clamp-1">{post.title}</p>
                          <p className="text-xs text-warm-500">/haberler/{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-warm-600">{post.category}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => togglePublished(post)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                          post.is_published
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-warm-100 text-warm-600'
                        }`}
                      >
                        {post.is_published ? (
                          <>
                            <Eye size={12} /> Yayında
                          </>
                        ) : (
                          <>
                            <EyeOff size={12} /> Taslak
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-black ${seoClass}`}
                        title={seo.issues.concat(seo.suggestions).join(' · ') || 'SEO iyi'}
                      >
                        {seo.score}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-warm-500">
                      {(post.view_count ?? 0).toLocaleString('tr-TR')}
                    </td>
                    <td className="px-4 py-3 text-warm-500">
                      {formatDate(post.published_at || post.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {post.is_published && (
                          <Link
                            to={`/haberler/${post.slug}`}
                            target="_blank"
                            className="rounded-lg p-2 text-warm-500 hover:bg-blue-50 hover:text-blue-600"
                            aria-label="Sitede gör"
                            title="Sitede gör"
                          >
                            <ExternalLink size={16} />
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDuplicate(post)}
                          className="rounded-lg p-2 text-warm-500 hover:bg-cream-100 hover:text-warm-800"
                          aria-label="Kopyala"
                          title="Taslak olarak kopyala"
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(post)}
                          className="rounded-lg p-2 text-warm-500 hover:bg-orange-50 hover:text-orange-600"
                          aria-label="Düzenle"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(post)}
                          className="rounded-lg p-2 text-warm-500 hover:bg-red-50 hover:text-red-600"
                          aria-label="Sil"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })
                )}
              </tbody>
            </table>
          </div>
        </div>
        </>
      )}
    </div>
  );
}

export default NewsManager;
