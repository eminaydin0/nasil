import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Upload, Image as ImageIcon, ArrowUp, ArrowDown, Search, Gamepad2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

function CarouselManager({ games = [] }) {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Game selector state
  const [showGameSelector, setShowGameSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const initialSlideState = {
    title: '',
    description: '',
    image_url: '',
    badge: 'ÖNE ÇIKAN',
    button_text: 'Nasıl Oynanır?',
    button_link: '#oyunlar',
    order_index: 0,
    is_active: true
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('carousel_slides')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error('Error fetching slides:', error);
      toast.error('Slaytlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `carousel/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('game-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('game-images')
        .getPublicUrl(filePath);

      setCurrentSlide(prev => ({ ...prev, image_url: publicUrl }));
      toast.success('Resim yüklendi');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Resim yüklenirken hata oluştu');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (currentSlide.id) {
        const { error } = await supabase
          .from('carousel_slides')
          .update(currentSlide)
          .eq('id', currentSlide.id);
        if (error) throw error;
        toast.success('Slayt güncellendi');
      } else {
        const { error } = await supabase
          .from('carousel_slides')
          .insert([{ ...currentSlide, order_index: slides.length }]);
        if (error) throw error;
        toast.success('Yeni slayt eklendi');
      }

      setIsEditing(false);
      setCurrentSlide(null);
      fetchSlides();
    } catch (error) {
      console.error('Error saving slide:', error);
      toast.error('Kaydedilirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu slaytı silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('carousel_slides')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Slayt silindi');
      fetchSlides();
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast.error('Silinirken hata oluştu');
    }
  };

  const handleMove = async (index, direction) => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === slides.length - 1)
    ) return;

    const newSlides = [...slides];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap order_index
    const tempOrder = newSlides[index].order_index;
    newSlides[index].order_index = newSlides[targetIndex].order_index;
    newSlides[targetIndex].order_index = tempOrder;

    // Swap positions in array
    [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];

    setSlides(newSlides);

    // Update in DB
    try {
      const updates = newSlides.map(s => ({
        id: s.id,
        order_index: s.order_index
      }));

      for (const update of updates) {
        await supabase
          .from('carousel_slides')
          .update({ order_index: update.order_index })
          .eq('id', update.id);
      }
    } catch (error) {
      console.error('Error reordering slides:', error);
      toast.error('Sıralama güncellenirken hata oluştu');
      fetchSlides(); // Revert on error
    }
  };

  const handleGameSelect = (game) => {
    setCurrentSlide(prev => ({
      ...prev,
      title: game.name,
      description: game.shortDescription || (game.description ? game.description.substring(0, 150) + '...' : ''),
      image_url: game.image,
      button_link: `/oyun/${game.slug}`,
      button_text: 'Nasıl Oynanır?'
    }));
    setShowGameSelector(false);
    toast.success(`${game.name} bilgileri aktarıldı`);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {currentSlide.id ? 'Slaytı Düzenle' : 'Yeni Slayt Ekle'}
          </h2>
          <button
            onClick={() => {
              setIsEditing(false);
              setCurrentSlide(null);
              setShowGameSelector(false);
            }}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Game Selector Helper */}
          <div className="bg-orange-50 rounded-xl border border-orange-100 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowGameSelector(!showGameSelector)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-orange-100/50 transition-colors"
            >
              <div className="flex items-center gap-2 text-orange-800 font-medium">
                <Gamepad2 size={20} />
                <span>Mevcut bir oyundan bilgi çek</span>
              </div>
              <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                {showGameSelector ? 'Gizle' : 'Oyun Seç'}
              </span>
            </button>

            {showGameSelector && (
              <div className="p-4 border-t border-orange-100 bg-white">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Oyun ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    autoFocus
                  />
                </div>
                <div className="max-h-48 overflow-y-auto border border-gray-100 rounded-lg">
                  {games.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase())).length > 0 ? (
                    <div className="divide-y divide-gray-50">
                      {games
                        .filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map(game => (
                          <button
                            key={game.id}
                            type="button"
                            onClick={() => handleGameSelect(game)}
                            className="w-full px-3 py-2 text-left hover:bg-orange-50 flex items-center gap-3 transition-colors group"
                          >
                            <img src={game.image} alt={game.name} className="w-8 h-8 rounded object-cover bg-gray-100" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 group-hover:text-orange-700">{game.name}</div>
                              <div className="text-xs text-gray-500 truncate">{game.category}</div>
                            </div>
                            <span className="text-xs text-orange-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                              Seç
                            </span>
                          </button>
                        ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">Oyun bulunamadı</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                <input
                  type="text"
                  value={currentSlide.title}
                  onChange={e => setCurrentSlide(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <textarea
                  value={currentSlide.description}
                  onChange={e => setCurrentSlide(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none h-24"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rozet (Badge)</label>
                  <input
                    type="text"
                    value={currentSlide.badge}
                    onChange={e => setCurrentSlide(prev => ({ ...prev, badge: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                  <select
                    value={currentSlide.is_active}
                    onChange={e => setCurrentSlide(prev => ({ ...prev, is_active: e.target.value === 'true' }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  >
                    <option value="true">Aktif</option>
                    <option value="false">Pasif</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buton Metni</label>
                  <input
                    type="text"
                    value={currentSlide.button_text}
                    onChange={e => setCurrentSlide(prev => ({ ...prev, button_text: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buton Linki</label>
                  <input
                    type="text"
                    value={currentSlide.button_link}
                    onChange={e => setCurrentSlide(prev => ({ ...prev, button_link: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Görsel</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                {currentSlide.image_url ? (
                  <div className="relative group">
                    <img 
                      src={currentSlide.image_url} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                      <label className="cursor-pointer px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100">
                        Değiştir
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center h-48 hover:bg-gray-50 rounded-lg transition-colors">
                    <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Resim yüklemek için tıklayın</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                )}
                {uploading && <p className="text-sm text-orange-600 mt-2">Yükleniyor...</p>}
              </div>
              <div className="text-xs text-gray-500">
                Önerilen boyut: 1920x1080px veya benzer oranlar.
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setCurrentSlide(null);
              }}
              className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={20} />
              Kaydet
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Carousel Yönetimi</h2>
        <button
          onClick={() => {
            setCurrentSlide(initialSlideState);
            setIsEditing(true);
          }}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Yeni Slayt Ekle
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-700 w-20">Sıra</th>
                <th className="px-6 py-4 font-semibold text-gray-700 w-32">Görsel</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Başlık / Açıklama</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Durum</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {slides.map((slide, index) => (
                <tr key={slide.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <button 
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button 
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === slides.length - 1}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <img 
                      src={slide.image_url} 
                      alt={slide.title} 
                      className="w-20 h-12 object-cover rounded-lg bg-gray-100"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{slide.title}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">{slide.description}</div>
                    <div className="mt-1 inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {slide.badge}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      slide.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {slide.is_active ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setCurrentSlide(slide);
                          setIsEditing(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(slide.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {slides.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    Henüz hiç slayt eklenmemiş.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CarouselManager;
