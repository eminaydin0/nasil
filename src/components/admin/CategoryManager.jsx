import { useState, useEffect } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  FolderTree,
  Save,
  Upload,
  X,
} from 'lucide-react';
import { supabase, uploadCategoryImage, deleteGameImage } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { useConfirm, Modal } from '../ui';
import AdminPageHeader from './AdminPageHeader';

const COLOR_OPTIONS = [
  { value: 'red', label: 'Kırmızı', hex: '#ef4444' },
  { value: 'orange', label: 'Turuncu', hex: '#f97316' },
  { value: 'amber', label: 'Amber', hex: '#f59e0b' },
  { value: 'green', label: 'Yeşil', hex: '#22c55e' },
  { value: 'emerald', label: 'Emerald', hex: '#10b981' },
  { value: 'teal', label: 'Teal', hex: '#14b8a6' },
  { value: 'blue', label: 'Mavi', hex: '#3b82f6' },
  { value: 'cyan', label: 'Cyan', hex: '#06b6d4' },
  { value: 'indigo', label: 'İndigo', hex: '#6366f1' },
  { value: 'purple', label: 'Mor', hex: '#a855f7' },
  { value: 'fuchsia', label: 'Fuchsia', hex: '#d946ef' },
  { value: 'pink', label: 'Pembe', hex: '#ec4899' },
  { value: 'gray', label: 'Gri', hex: '#9ca3af' },
];

function getColorHex(value) {
  return COLOR_OPTIONS.find((c) => c.value === value)?.hex || '#9ca3af';
}

function CategoryManager() {
  const confirm = useConfirm();
  const [categories, setCategories] = useState([]);
  const [gameCounts, setGameCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    color: 'orange',
    order_index: 0,
    is_active: true,
  });

  const loadCategories = async () => {
    try {
      setLoading(true);
      const [catResult, gamesResult] = await Promise.all([
        supabase.from('categories').select('*').order('order_index', { ascending: true }),
        supabase.from('games').select('category'),
      ]);

      if (catResult.error) throw catResult.error;
      setCategories(catResult.data || []);

      if (gamesResult.data) {
        const counts = {};
        gamesResult.data.forEach((g) => {
          counts[g.category] = (counts[g.category] || 0) + 1;
        });
        setGameCounts(counts);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Kategoriler yüklenirken hata oluştu');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image_url: '',
      color: 'orange',
      order_index: categories.length + 1,
      is_active: true,
    });
    setImagePreview('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Dosya boyutu 5MB'dan küçük olmalıdır");
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Sadece resim dosyaları yüklenebilir');
      return;
    }

    setUploading(true);
    try {
      const url = await uploadCategoryImage(file, formData.name || 'kategori');
      if (url) {
        setFormData((prev) => ({ ...prev, image_url: url }));
        setImagePreview(url);
        toast.success('Kategori görseli yüklendi');
      } else {
        toast.error('Görsel yüklenemedi');
      }
    } catch {
      toast.error('Yükleme hatası');
    } finally {
      setUploading(false);
    }
  };

  const handleClearImage = async () => {
    const url = formData.image_url;
    setFormData((prev) => ({ ...prev, image_url: '' }));
    setImagePreview('');
    if (url?.includes('supabase')) {
      await deleteGameImage(url);
    }
  };

  const handleEdit = (cat) => {
    setFormData({
      name: cat.name,
      description: cat.description || '',
      image_url: cat.image_url || '',
      color: cat.color || 'orange',
      order_index: cat.order_index || 0,
      is_active: cat.is_active ?? true,
    });
    setImagePreview(cat.image_url || '');
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Kategori adı zorunludur');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from('categories')
          .update({
            name: formData.name.trim(),
            description: formData.description.trim() || null,
            image_url: formData.image_url.trim() || null,
            color: formData.color,
            order_index: formData.order_index,
            is_active: formData.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Kategori güncellendi');
      } else {
        const { error } = await supabase.from('categories').insert([
          {
            name: formData.name.trim(),
            description: formData.description.trim() || null,
            image_url: formData.image_url.trim() || null,
            color: formData.color,
            order_index: formData.order_index || categories.length + 1,
            is_active: formData.is_active,
          },
        ]);

        if (error) throw error;
        toast.success('Kategori eklendi');
      }
      resetForm();
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      if (error.code === '23505') {
        toast.error('Bu isimde bir kategori zaten mevcut');
      } else {
        toast.error('Kategori kaydedilirken hata oluştu');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    const gameCount = gameCounts[cat.name] || 0;
    const ok = await confirm({
      type: 'danger',
      title: `"${cat.name}" kategorisini sil`,
      description:
        gameCount > 0
          ? `Bu kategoride ${gameCount} oyun bulunuyor. Kategoriyi silersen bu oyunlar kategorisiz kalır. Devam etmek istiyor musun?`
          : 'Bu kategoriyi kalıcı olarak silmek istediğinizden emin misiniz?',
      confirmText: 'Evet, Sil',
      cancelText: 'Vazgeç',
      requireText: gameCount > 0 ? 'SIL' : '',
    });
    if (!ok) return;

    try {
      const { error } = await supabase.from('categories').delete().eq('id', cat.id);

      if (error) throw error;
      toast.success('Kategori silindi');
      loadCategories();
      if (editingId === cat.id) resetForm();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Kategori silinirken hata oluştu');
    }
  };

  const handleToggleActive = async (cat) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_active: !cat.is_active, updated_at: new Date().toISOString() })
        .eq('id', cat.id);

      if (error) throw error;
      toast.success(cat.is_active ? 'Kategori pasifleştirildi' : 'Kategori aktifleştirildi');
      loadCategories();
    } catch (error) {
      console.error('Error toggling category:', error);
      toast.error('İşlem başarısız');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-warm-200/60 bg-white p-20 shadow-soft">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const activeCount = categories.filter((c) => c.is_active).length;

  return (
    <div className="space-y-5">
      <AdminPageHeader
        description={`${categories.length} kategori · ${activeCount} aktif · Sıralama listede görünüm sırasını belirler`}
        actions={
          <button
            type="button"
            onClick={() => {
              setFormData({
                name: '',
                description: '',
                image_url: '',
                color: 'orange',
                order_index: categories.length + 1,
                is_active: true,
              });
              setImagePreview('');
              setEditingId(null);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2.5 text-sm font-bold text-white shadow-warm-glow transition-all hover:-translate-y-0.5 hover:shadow-warm-glow-lg"
          >
            <Plus size={16} />
            Yeni Kategori
          </button>
        }
      />

      <Modal
        open={showForm}
        onClose={resetForm}
        title={editingId ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle'}
        description="Kategori adı, renk ve sıralama sitede görünümü etkiler."
        icon={FolderTree}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-warm-600">
                Kategori Adı *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border-2 border-warm-200 bg-white px-3.5 py-2.5 text-sm text-charcoal-900 placeholder-warm-400 transition-all focus:border-orange-400 focus:outline-none"
                placeholder="Örn: Kağıt Oyunları"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-warm-600">
                Sıra
              </label>
              <input
                type="number"
                min="1"
                value={formData.order_index}
                onChange={(e) =>
                  setFormData({ ...formData, order_index: parseInt(e.target.value) || 1 })
                }
                className="w-full rounded-xl border-2 border-warm-200 bg-white px-3.5 py-2.5 text-sm text-charcoal-900 transition-all focus:border-orange-400 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-warm-600">
                Açıklama
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="2"
                className="w-full resize-none rounded-xl border-2 border-warm-200 bg-white px-3.5 py-2.5 text-sm text-charcoal-900 placeholder-warm-400 transition-all focus:border-orange-400 focus:outline-none"
                placeholder="Kategori hakkında kısa açıklama"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-warm-600">
                Kategori görseli
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => {
                  setFormData({ ...formData, image_url: e.target.value });
                  setImagePreview(e.target.value);
                }}
                className="mb-2 w-full rounded-xl border-2 border-warm-200 bg-white px-3.5 py-2.5 text-sm text-charcoal-900 placeholder-warm-400 transition-all focus:border-orange-400 focus:outline-none"
                placeholder="URL yapıştır veya aşağıdan yükle"
              />
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-warm-200 px-4 py-5 transition hover:border-orange-400">
                {uploading ? (
                  <Loader2 size={18} className="animate-spin text-orange-500" />
                ) : (
                  <Upload size={18} className="text-warm-400" />
                )}
                <span className="text-sm text-warm-600">
                  {uploading ? 'Yükleniyor...' : 'Bilgisayardan fotoğraf yükle'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={handleImageUpload}
                />
              </label>
              {(imagePreview || formData.image_url) && (
                <div className="relative mt-3 inline-block">
                  <img
                    src={imagePreview || formData.image_url}
                    alt="Kategori önizleme"
                    className="h-28 w-auto max-w-full rounded-xl border border-warm-200 object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow"
                    aria-label="Görseli kaldır"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-warm-600">
                Renk
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((c) => {
                  const isActive = formData.color === c.value;
                  return (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: c.value })}
                      className={`group relative grid h-9 w-9 place-items-center rounded-xl shadow-soft transition-all duration-200 hover:-translate-y-0.5 ${
                        isActive ? 'ring-2 ring-charcoal-900 ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.label}
                    >
                      {isActive && (
                        <span className="text-xs font-bold text-white drop-shadow">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="flex cursor-pointer items-center gap-2 select-none">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 cursor-pointer rounded border-warm-300 text-orange-500 focus:ring-orange-500/30"
                />
                <span className="text-sm font-semibold text-warm-700">Aktif (sitede görünsün)</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2 border-t border-warm-100 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2.5 text-sm font-bold text-white shadow-warm-glow transition-all hover:-translate-y-0.5 hover:shadow-warm-glow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {editingId ? 'Güncelle' : 'Ekle'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-warm-200 bg-white px-4 py-2.5 text-sm font-semibold text-warm-700 transition-colors hover:bg-warm-100"
            >
              İptal
            </button>
          </div>
        </form>
      </Modal>

      {/* Liste */}
      <div className="overflow-hidden rounded-2xl border border-warm-200/60 bg-white shadow-soft">
        {categories.length === 0 ? (
          <div className="p-16 text-center">
            <FolderTree size={28} className="mx-auto mb-2 text-warm-400" />
            <p className="text-sm font-semibold text-warm-700">Henüz kategori yok</p>
            <p className="mt-1 text-xs text-warm-500">
              "Yeni Kategori" butonu ile ilkini ekleyin.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-warm-200 bg-cream-50">
              <tr>
                <th className="w-16 px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-warm-600">
                  Sıra
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-warm-600">
                  Kategori
                </th>
                <th className="hidden px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-warm-600 sm:table-cell">
                  Oyun
                </th>
                <th className="hidden px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-warm-600 md:table-cell">
                  Renk
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-warm-600">
                  Durum
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-warm-600">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => {
                const gameCount = gameCounts[cat.name] || 0;
                const hex = getColorHex(cat.color);
                return (
                  <tr
                    key={cat.id}
                    className={`border-b border-warm-100 transition-colors hover:bg-cream-50 ${
                      !cat.is_active ? 'opacity-60' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-sm font-bold text-warm-600">
                      <span className="grid h-7 w-7 place-items-center rounded-md bg-warm-100 text-xs">
                        {cat.order_index}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {cat.image_url ? (
                          <img
                            src={cat.image_url}
                            alt=""
                            className="h-9 w-9 shrink-0 rounded-xl object-cover"
                          />
                        ) : (
                          <span
                            className="h-9 w-9 shrink-0 rounded-xl"
                            style={{ backgroundColor: hex, boxShadow: `0 4px 14px -4px ${hex}99` }}
                          />
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-charcoal-900">{cat.name}</div>
                          {cat.description && (
                            <div className="truncate text-xs text-warm-500 sm:max-w-md">
                              {cat.description}
                            </div>
                          )}
                          <div className="mt-0.5 text-[11px] font-semibold text-warm-500 sm:hidden">
                            {gameCount} oyun
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span
                        className={`inline-flex rounded-md px-2 py-0.5 text-xs font-bold ${
                          gameCount > 0
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-warm-100 text-warm-500'
                        }`}
                      >
                        {gameCount}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <span
                        className="inline-block h-5 w-5 rounded-md border border-warm-300/60"
                        style={{ backgroundColor: hex }}
                        title={cat.color}
                      />
                    </td>
                    <td className="px-4 py-3">
                      {cat.is_active ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                          <Eye size={11} /> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-warm-200 px-2 py-0.5 text-[11px] font-bold text-warm-600">
                          <EyeOff size={11} /> Pasif
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(cat)}
                          className={`grid h-8 w-8 place-items-center rounded-lg transition-colors ${
                            cat.is_active
                              ? 'text-warm-500 hover:bg-warm-100 hover:text-warm-700'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={cat.is_active ? 'Pasifleştir' : 'Aktifleştir'}
                        >
                          {cat.is_active ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(cat)}
                          className="grid h-8 w-8 place-items-center rounded-lg text-blue-600 transition-colors hover:bg-blue-50"
                          title="Düzenle"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat)}
                          className="grid h-8 w-8 place-items-center rounded-lg text-rose-600 transition-colors hover:bg-rose-50"
                          title="Sil"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CategoryManager;
