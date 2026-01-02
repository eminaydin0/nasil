import { useState } from 'react';
import { Trash2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadGameImage, uploadMultipleGameImages, deleteGameImage } from '../../lib/supabase';
import toast from 'react-hot-toast';

function GameModal({ game, onSave, onClose }) {
  const [formData, setFormData] = useState(game || {
    name: '',
    category: 'Dış Mekan',
    players: '',
    difficulty: 'Kolay',
    image: '',
    gallery: [],
    shortDescription: '',
    description: '',
    rules: [''],
    tips: ['']
  });
  
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(formData.image || '');

  // Ana resim yükleme
  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Dosya boyutu 5MB\'dan küçük olmalıdır!');
      return;
    }

    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      toast.error('Sadece resim dosyaları yüklenebilir!');
      return;
    }

    setUploading(true);
    const slug = formData.slug || generateSlug(formData.name);
    
    try {
      const imageUrl = await uploadGameImage(file, slug);
      if (imageUrl) {
        setFormData({ ...formData, image: imageUrl });
        setImagePreview(imageUrl);
        toast.success('Resim başarıyla yüklendi!');
      } else {
        toast.error('Resim yüklenemedi!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Resim yüklenirken hata oluştu!');
    } finally {
      setUploading(false);
    }
  };

  // Galeri resimleri yükleme
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Maksimum 5 resim kontrolü
    const currentGalleryCount = (formData.gallery || []).length;
    if (currentGalleryCount + files.length > 5) {
      toast.error('En fazla 5 galeri resmi ekleyebilirsiniz!');
      return;
    }

    // Dosya boyutu kontrolü
    const invalidFiles = files.filter(f => f.size > 5 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      toast.error('Bazı dosyalar 5MB\'dan büyük!');
      return;
    }

    setUploading(true);
    const slug = formData.slug || generateSlug(formData.name);
    
    try {
      const imageUrls = await uploadMultipleGameImages(files, slug);
      if (imageUrls.length > 0) {
        const newGallery = [...(formData.gallery || []), ...imageUrls];
        setFormData({ ...formData, gallery: newGallery });
        toast.success(`${imageUrls.length} resim yüklendi!`);
      } else {
        toast.error('Resimler yüklenemedi!');
      }
    } catch (error) {
      console.error('Gallery upload error:', error);
      toast.error('Resimler yüklenirken hata oluştu!');
    } finally {
      setUploading(false);
    }
  };

  // Galeri resmini silme
  const handleRemoveGalleryImage = async (imageUrl, index) => {
    if (window.confirm('Bu resmi silmek istediğinizden emin misiniz?')) {
      const newGallery = formData.gallery.filter((_, i) => i !== index);
      setFormData({ ...formData, gallery: newGallery });
      
      // Storage'dan da sil (opsiyonel)
      if (imageUrl.includes('supabase')) {
        await deleteGameImage(imageUrl);
      }
      toast.success('Resim silindi!');
    }
  };

  // Slug oluşturma fonksiyonu
  const generateSlug = (name) => {
    const turkishMap = {
      'ç': 'c', 'Ç': 'C',
      'ğ': 'g', 'Ğ': 'G',
      'ı': 'i', 'İ': 'I',
      'ö': 'o', 'Ö': 'O',
      'ş': 's', 'Ş': 'S',
      'ü': 'u', 'Ü': 'U'
    };
    
    return name
      .split('')
      .map(char => turkishMap[char] || char)
      .join('')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const slug = formData.slug || generateSlug(formData.name);
    onSave({ ...formData, slug });
  };

  const handleRuleChange = (index, value) => {
    const newRules = [...formData.rules];
    newRules[index] = value;
    setFormData({ ...formData, rules: newRules });
  };

  const handleTipChange = (index, value) => {
    const newTips = [...formData.tips];
    newTips[index] = value;
    setFormData({ ...formData, tips: newTips });
  };

  const addRule = () => {
    setFormData({ ...formData, rules: [...formData.rules, ''] });
  };

  const addTip = () => {
    setFormData({ ...formData, tips: [...formData.tips, ''] });
  };

  const removeRule = (index) => {
    const newRules = formData.rules.filter((_, i) => i !== index);
    setFormData({ ...formData, rules: newRules });
  };

  const removeTip = (index) => {
    const newTips = formData.tips.filter((_, i) => i !== index);
    setFormData({ ...formData, tips: newTips });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">
            {game ? 'Oyunu Düzenle' : 'Yeni Oyun Ekle'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Oyun Adı *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                required
              >
                <option value="Dış Mekan">Dış Mekan</option>
                <option value="İç Mekan">İç Mekan</option>
                <option value="İç Mekan / Dış Mekan">İç Mekan / Dış Mekan</option>
                <option value="Masa Oyunları">Masa Oyunları</option>
                <option value="Kağıt Oyunları">Kağıt Oyunları</option>
                <option value="Kutu Oyunları">Kutu Oyunları</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Oyuncu Sayısı *</label>
              <input
                type="text"
                value={formData.players}
                onChange={(e) => setFormData({ ...formData, players: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Örn: 3+ kişi"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Zorluk *</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                required
              >
                <option value="Kolay">Kolay</option>
                <option value="Orta">Orta</option>
                <option value="Zor">Zor</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ana Görsel * 
              <span className="text-xs text-gray-500 ml-2">(Maks. 5MB)</span>
            </label>
            
            {/* URL Girişi */}
            <div className="space-y-3">
              <input
                type="url"
                value={formData.image}
                onChange={(e) => {
                  setFormData({ ...formData, image: e.target.value });
                  setImagePreview(e.target.value);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="https://example.com/image.jpg veya dosya yükleyin"
              />

              {/* Dosya Yükleme */}
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 transition-colors">
                    <Upload size={20} className="text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {uploading ? 'Yükleniyor...' : 'Bilgisayardan Yükle'}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>

              {/* Önizleme */}
              {imagePreview && (
                <div className="relative inline-block">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-40 h-32 object-cover rounded-lg border-2 border-gray-200" 
                  />
                </div>
              )}
            </div>
          </div>

          {/* Galeri Resimleri */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Galeri Resimleri
              <span className="text-xs text-gray-500 ml-2">(İsteğe bağlı, maks. 5 resim)</span>
            </label>
            
            <label className="cursor-pointer block">
              <div className="flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 transition-colors">
                <ImageIcon size={24} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  {uploading ? 'Yükleniyor...' : 'Birden fazla resim seçin (Maks. 5)'}
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                className="hidden"
                disabled={uploading || (formData.gallery || []).length >= 5}
              />
            </label>

            {/* Galeri Önizlemeleri */}
            {formData.gallery && formData.gallery.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-4">
                {formData.gallery.map((imgUrl, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={imgUrl} 
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(imgUrl, index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kısa Açıklama *</label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Detaylı Açıklama *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              rows="4"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Oyun Kuralları *</label>
              <button type="button" onClick={addRule} className="text-orange-600 text-sm hover:text-orange-700">
                + Kural Ekle
              </button>
            </div>
            <div className="space-y-2">
              {formData.rules.map((rule, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={rule}
                    onChange={(e) => handleRuleChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder={`Kural ${index + 1}`}
                    required
                  />
                  {formData.rules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRule(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">İpuçları *</label>
              <button type="button" onClick={addTip} className="text-orange-600 text-sm hover:text-orange-700">
                + İpucu Ekle
              </button>
            </div>
            <div className="space-y-2">
              {formData.tips.map((tip, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={tip}
                    onChange={(e) => handleTipChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder={`İpucu ${index + 1}`}
                    required
                  />
                  {formData.tips.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTip(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              {game ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GameModal;
