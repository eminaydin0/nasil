import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const COLOR_OPTIONS = [
  { value: 'red', label: 'Kırmızı' },
  { value: 'orange', label: 'Turuncu' },
  { value: 'purple', label: 'Mor' },
  { value: 'blue', label: 'Mavi' },
  { value: 'green', label: 'Yeşil' },
  { value: 'indigo', label: 'İndigo' },
  { value: 'gray', label: 'Gri' },
];

function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [gameCounts, setGameCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    color: 'gray',
    order_index: 0,
    is_active: true,
  });

  const loadCategories = async () => {
    try {
      setLoading(true);
      
      // Kategorileri ve oyun sayılarını paralel çek
      const [catResult, gamesResult] = await Promise.all([
        supabase
          .from('categories')
          .select('*')
          .order('order_index', { ascending: true }),
        supabase
          .from('games')
          .select('category'),
      ]);

      if (catResult.error) throw catResult.error;
      setCategories(catResult.data || []);

      // Oyun sayılarını hesapla
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
      color: 'gray',
      order_index: categories.length + 1,
      is_active: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (cat) => {
    setFormData({
      name: cat.name,
      description: cat.description || '',
      image_url: cat.image_url || '',
      color: cat.color || 'gray',
      order_index: cat.order_index || 0,
      is_active: cat.is_active ?? true,
    });
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
    const warningMsg = gameCount > 0
      ? `⚠️ "${cat.name}" kategorisinde ${gameCount} oyun var!\n\nKategoriyi silersen bu oyunlar kategorisiz kalır. Emin misin?`
      : `"${cat.name}" kategorisini silmek istediğinizden emin misiniz?`;

    if (!window.confirm(warningMsg)) {
      return;
    }

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
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Kategori Yönetimi</h2>
          <p className="text-sm text-gray-500 mt-1">
            Oyun kategorilerini ekleyin, düzenleyin veya silin. Sıra numarası listede görünüm sırasını belirler.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setFormData({
              name: '',
              description: '',
              image_url: '',
              color: 'gray',
              order_index: categories.length + 1,
              is_active: true,
            });
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
        >
          <Plus size={18} />
          {showForm ? 'İptal' : 'Yeni Kategori'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">
            {editingId ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Adı *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Örn: Kağıt Oyunları"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Renk</label>
              <select
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              >
                {COLOR_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sıra</label>
              <input
                type="number"
                min="1"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                placeholder="Kategori hakkında kısa açıklama"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Görsel URL</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="https://..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">Aktif (sitede görünsün)</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 font-medium flex items-center gap-2"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {editingId ? 'Güncelle' : 'Ekle'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              İptal
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Sıra</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Kategori</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Oyun</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Renk</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Durum</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-gray-500">
                  Henüz kategori yok. Yeni kategori ekleyin.
                </td>
              </tr>
            ) : (
              categories.map((cat) => {
                const gameCount = gameCounts[cat.name] || 0;
                const colorMap = {
                  red: '#ef4444',
                  orange: '#f97316',
                  purple: '#a855f7',
                  blue: '#3b82f6',
                  green: '#22c55e',
                  indigo: '#6366f1',
                  gray: '#9ca3af',
                };
                return (
                  <tr
                    key={cat.id}
                    className={`border-b border-gray-100 hover:bg-gray-50/50 ${!cat.is_active ? 'opacity-50 bg-gray-50' : ''}`}
                  >
                    <td className="py-3 px-4 text-sm text-gray-600">{cat.order_index}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{cat.name}</div>
                      {cat.description && (
                        <div className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{cat.description}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-medium ${gameCount > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                        {gameCount}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className="inline-block w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: colorMap[cat.color] || '#9ca3af' }}
                        title={cat.color}
                      />
                    </td>
                    <td className="py-3 px-4">
                      {cat.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <Eye size={12} /> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                          <EyeOff size={12} /> Pasif
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(cat)}
                          className={`p-2 rounded-lg transition-colors ${
                            cat.is_active
                              ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                              : 'text-green-500 hover:text-green-700 hover:bg-green-50'
                          }`}
                          title={cat.is_active ? 'Pasifleştir' : 'Aktifleştir'}
                        >
                          {cat.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(cat)}
                          className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Sil"
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
  );
}

export default CategoryManager;
