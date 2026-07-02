import { useState, useEffect, useMemo } from 'react';
import { Trash2, Upload, X, Image as ImageIcon, PlayCircle, HelpCircle, Clock } from 'lucide-react';
import { uploadGameImage, uploadMultipleGameImages, deleteGameImage } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { useConfirm } from '../ui';
import GameSeoPreview from './GameSeoPreview';
import GameModalDigitalFields from './GameModalDigitalFields';
import AiAssistButton from './AiAssistButton';
import { AI_TASKS } from '../../lib/ai';
import {
  emptyDigitalInfo,
  normalizeDigitalInfo,
  cleanDigitalInfoForSave,
  isDigitalGameCategory,
} from '../../constants/digitalGames';

// Slug oluşturma (Türkçe karakterleri normalize eder)
function generateSlug(name) {
  if (!name || typeof name !== 'string') return 'game';
  const turkishMap = {
    'ç': 'c', 'Ç': 'C', 'ğ': 'g', 'Ğ': 'G', 'ı': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O', 'ş': 's', 'Ş': 'S', 'ü': 'u', 'Ü': 'U'
  };
  return name
    .split('')
    .map(char => turkishMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'game';
}

// Oyun verisini form formatına normalleştir (eski oyunlar için uyumluluk)
function normalizeGameToFormData(game, defaultCategory) {
  if (!game) {
    return {
      id: null,
      name: '',
      slug: '',
      category: defaultCategory,
      players: '',
      difficulty: 'Kolay',
      image: '',
      gallery: [],
      shortDescription: '',
      description: '',
      rules: [''],
      tips: [''],
      videoUrl: '',
      videoTitle: '',
      playTimeMinutes: '',
      faq: [],
      digitalInfo: emptyDigitalInfo(),
    };
  }

  // gallery: [{image_url}] veya ['url1','url2'] formatlarını destekle
  let gallery = [];
  if (Array.isArray(game.gallery)) {
    gallery = game.gallery.map((item) =>
      typeof item === 'string' ? item : (item?.image_url || item?.url || '')
    ).filter(Boolean);
  }

  // rules ve tips: null/undefined veya string ise diziye çevir
  const rules = Array.isArray(game.rules) && game.rules.length > 0
    ? game.rules
    : (game.rules ? [String(game.rules)] : ['']);
  const tips = Array.isArray(game.tips) && game.tips.length > 0
    ? game.tips
    : (game.tips ? [String(game.tips)] : ['']);

  // FAQ: [{question, answer}] dizisi (eski oyunlarda yok)
  const faq = Array.isArray(game.faq)
    ? game.faq.filter((item) => item && (item.question || item.answer))
    : [];

  return {
    id: game.id,
    name: game.name || '',
    slug: game.slug || generateSlug(game.name),
    category: game.category || defaultCategory,
    players: game.players || '',
    difficulty: game.difficulty || 'Kolay',
    image: game.image || '',
    gallery,
    shortDescription: game.shortDescription ?? game.short_description ?? '',
    description: game.description ?? '',
    rules,
    tips,
    videoUrl: game.videoUrl ?? game.video_url ?? '',
    videoTitle: game.videoTitle ?? game.video_title ?? '',
    playTimeMinutes: game.playTimeMinutes ?? game.play_time_minutes ?? '',
    faq,
    digitalInfo: normalizeDigitalInfo(game.digitalInfo ?? game.digital_info),
  };
}

function GameModal({ game, categories = [], onSave, onClose }) {
  const confirm = useConfirm();
  const categoryNames = categories?.length > 0 ? categories.map((c) => c.name) : [];
  const defaultCategory = categoryNames[0] || 'Dış Mekan';
  const options = [...new Set([...(categoryNames || []), game?.category].filter(Boolean))];

  const initialFormData = useMemo(
    () => normalizeGameToFormData(game, defaultCategory),
    [game?.id]
  );

  const [formData, setFormData] = useState(initialFormData);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(initialFormData.image || '');

  // Oyun değiştiğinde formu senkronize et (eski oyunlar için önemli)
  useEffect(() => {
    const normalized = normalizeGameToFormData(game, defaultCategory);
    setFormData(normalized);
    setImagePreview(normalized.image || '');
  }, [game?.id]);

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
    const slug = (formData.slug || generateSlug(formData.name) || `game-${formData.id || Date.now()}`).replace(/[^a-z0-9-]/g, '-');
    
    try {
      const imageUrl = await uploadGameImage(file, slug || 'game');
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

    // Dosya boyutu kontrolü
    const invalidFiles = files.filter(f => f.size > 5 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      toast.error('Bazı dosyalar 5MB\'dan büyük!');
      return;
    }

    setUploading(true);
    const slug = (formData.slug || generateSlug(formData.name) || `game-${formData.id || Date.now()}`).replace(/[^a-z0-9-]/g, '-');
    
    try {
      const imageUrls = await uploadMultipleGameImages(files, slug || 'game');
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
    const ok = await confirm({
      type: 'danger',
      title: 'Resmi sil',
      description: 'Bu galeri resmini silmek istediğinizden emin misiniz?',
      confirmText: 'Evet, Sil',
      cancelText: 'Vazgeç',
    });
    if (!ok) return;
    const newGallery = formData.gallery.filter((_, i) => i !== index);
    setFormData({ ...formData, gallery: newGallery });
    if (imageUrl.includes('supabase')) {
      await deleteGameImage(imageUrl);
    }
    toast.success('Resim silindi!');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const slug = formData.slug || generateSlug(formData.name);
    // FAQ icindeki tamamen bos kayitlari at
    const cleanedFaq = (formData.faq || []).filter(
      (item) => (item.question || '').trim() && (item.answer || '').trim()
    );
    const playTime = formData.playTimeMinutes === '' || formData.playTimeMinutes == null
      ? null
      : Number(formData.playTimeMinutes) || null;

    onSave({
      ...formData,
      slug,
      faq: cleanedFaq,
      playTimeMinutes: playTime,
      videoUrl: (formData.videoUrl || '').trim() || null,
      videoTitle: (formData.videoTitle || '').trim() || null,
      digitalInfo: isDigitalGameCategory(formData.category)
        ? cleanDigitalInfoForSave(formData.digitalInfo)
        : null,
    });
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

  // FAQ handlers
  const handleFaqChange = (index, field, value) => {
    const newFaq = [...(formData.faq || [])];
    newFaq[index] = { ...(newFaq[index] || {}), [field]: value };
    setFormData({ ...formData, faq: newFaq });
  };

  const addFaq = () => {
    setFormData({ ...formData, faq: [...(formData.faq || []), { question: '', answer: '' }] });
  };

  const removeFaq = (index) => {
    const newFaq = (formData.faq || []).filter((_, i) => i !== index);
    setFormData({ ...formData, faq: newFaq });
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
                {options.length > 0 ? (
                  options.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Kağıt Oyunları">Kağıt Oyunları</option>
                    <option value="Masa Oyunları">Masa Oyunları</option>
                    <option value="Kutu Oyunları">Kutu Oyunları</option>
                    <option value="Zeka Oyunları">Zeka Oyunları</option>
                    <option value="Dış Mekan">Dış Mekan</option>
                    <option value="İç Mekan">İç Mekan</option>
                  </>
                )}
              </select>
              <p className="text-xs text-gray-500 mt-1">Admin panelinden Kategoriler sekmesinde yeni kategori ekleyebilirsiniz.</p>
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
                  {uploading ? 'Yükleniyor...' : 'Birden fazla resim seçin (Sınırsız)'}
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                className="hidden"
                disabled={uploading}
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

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-violet-100 bg-violet-50/60 px-4 py-3">
            <p className="text-xs text-violet-800">
              Oyun adını yazdıktan sonra AI ile açıklama, kurallar ve ipuçları önerebilirsin.
            </p>
            <AiAssistButton
              task={AI_TASKS.GAME_CONTENT}
              payload={{
                name: formData.name,
                category: formData.category,
                players: formData.players,
              }}
              disabled={!formData.name?.trim()}
              onResult={(data) => {
                setFormData((prev) => ({
                  ...prev,
                  shortDescription: data.shortDescription || prev.shortDescription,
                  description: data.description || prev.description,
                  rules: Array.isArray(data.rules) && data.rules.length ? data.rules : prev.rules,
                  tips: Array.isArray(data.tips) && data.tips.length ? data.tips : prev.tips,
                }));
              }}
            />
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

          <GameModalDigitalFields
            category={formData.category}
            digitalInfo={formData.digitalInfo}
            onChange={(digitalInfo) => setFormData({ ...formData, digitalInfo })}
          />

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {isDigitalGameCategory(formData.category) ? 'Nasıl Oynanır *' : 'Oyun Kuralları *'}
              </label>
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

          {/* SEO odakli zenginlestirme alanlari */}
          <div className="rounded-xl border border-orange-100 bg-orange-50/40 p-5 space-y-5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-orange-500 text-white">
                <PlayCircle size={16} />
              </span>
              <div>
                <h3 className="text-sm font-bold text-gray-900">SEO Zenginleştirmeleri</h3>
                <p className="text-xs text-gray-500">Bu alanlar Google rich snippet'leri için kullanılır. Hepsi opsiyoneldir.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
                  <PlayCircle size={14} className="text-orange-500" />
                  Video URL (YouTube/Vimeo)
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                  placeholder="https://youtube.com/watch?v=..."
                />
                <p className="text-xs text-gray-500 mt-1">Video carousel sonuçlarına girer (VideoObject schema).</p>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
                  <Clock size={14} className="text-orange-500" />
                  Tahmini oyun süresi (dakika)
                </label>
                <input
                  type="number"
                  min="1"
                  max="600"
                  value={formData.playTimeMinutes}
                  onChange={(e) => setFormData({ ...formData, playTimeMinutes: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                  placeholder="Örn: 45"
                />
                <p className="text-xs text-gray-500 mt-1">Boş bırakırsan rozet ve schema'da gösterilmez.</p>
              </div>
            </div>

            {formData.videoUrl && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Video başlığı (opsiyonel)
                </label>
                <input
                  type="text"
                  value={formData.videoTitle}
                  onChange={(e) => setFormData({ ...formData, videoTitle: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                  placeholder="Boş bırakırsan oyun adından otomatik üretilir"
                />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                  <HelpCircle size={14} className="text-orange-500" />
                  Sık Sorulan Sorular (FAQ)
                </label>
                <button
                  type="button"
                  onClick={addFaq}
                  className="text-orange-600 text-sm hover:text-orange-700 font-medium"
                >
                  + Soru Ekle
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                FAQPage rich snippet'i için. Eklediğin sorular Google sonuçlarında öne çıkan kutucuk olarak görünebilir.
              </p>
              {formData.faq.length === 0 && (
                <p className="text-sm text-gray-400 italic px-3 py-4 bg-white rounded-lg border border-dashed border-gray-200 text-center">
                  Henüz soru yok. "+ Soru Ekle" ile başla.
                </p>
              )}
              <div className="space-y-3">
                {formData.faq.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-gray-500">Soru {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeFaq(index)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                        aria-label="Bu soruyu sil"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={item.question || ''}
                      onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                      placeholder="Soru (örn: Bu oyunda kaç kart kullanılır?)"
                    />
                    <textarea
                      value={item.answer || ''}
                      onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                      rows="3"
                      placeholder="Cevap (kısa ve net olsun, Google için ideal)"
                    />
                  </div>
                ))}
              </div>
            </div>

            <GameSeoPreview formData={formData} />
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
