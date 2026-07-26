import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, Upload, Image as ImageIcon, ArrowUp, ArrowDown, Search, Gamepad2, Images } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { useConfirm, Modal, Button } from '../ui';
import { AdminToolbar } from './adminUi';

/** Hero carousel slayt yönetimi */
function CarouselManager({ games = [] }) {
  const confirm = useConfirm();
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
    button_text: 'Kuralı Ne?',
    button_link: '/oyunlar',
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
    const slide = slides.find((s) => s.id === id);
    const ok = await confirm({
      type: 'danger',
      title: 'Slaytı sil',
      description: slide?.title
        ? `"${slide.title}" slaytı kalıcı olarak silinecek.`
        : 'Bu slayt kalıcı olarak silinecek.',
      confirmText: 'Evet, Sil',
      cancelText: 'Vazgeç',
    });
    if (!ok) return;

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
      button_text: 'Kuralı Ne?'
    }));
    setShowGameSelector(false);
    toast.success(`${game.name} bilgileri aktarıldı`);
  };

  const closeEditor = () => {
    setIsEditing(false);
    setCurrentSlide(null);
    setShowGameSelector(false);
    setSearchTerm('');
  };

  return (
    <div className="space-y-5">
      <AdminToolbar
        actions={
          <Button
            type="button"
            variant="primary"
            size="md"
            iconLeft={Plus}
            onClick={() => {
              setCurrentSlide(initialSlideState);
              setIsEditing(true);
            }}
          >
            Yeni Slayt
          </Button>
        }
      />

      <Modal
        open={isEditing && !!currentSlide}
        onClose={closeEditor}
        title={currentSlide?.id ? 'Slaytı Düzenle' : 'Yeni Slayt Ekle'}
        description="Görsel, başlık ve buton linki ana sayfa hero alanında görünür."
        icon={Images}
        size="2xl"
      >
        {currentSlide && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="overflow-hidden rounded-xl border border-orange-100 bg-orange-50">
              <button
                type="button"
                onClick={() => setShowGameSelector(!showGameSelector)}
                className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-orange-100/50"
              >
                <div className="flex items-center gap-2 font-semibold text-orange-800">
                  <Gamepad2 size={18} />
                  <span>Mevcut bir oyundan bilgi çek</span>
                </div>
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-600">
                  {showGameSelector ? 'Gizle' : 'Oyun Seç'}
                </span>
              </button>

              {showGameSelector && (
                <div className="border-t border-orange-100 bg-white p-4">
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" size={16} />
                    <input
                      type="text"
                      placeholder="Oyun ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-xl border-2 border-warm-200 py-2 pl-9 pr-4 text-sm outline-none focus:border-orange-400"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto rounded-xl border border-warm-100">
                    {games.filter((g) =>
                      g.name.toLowerCase().includes(searchTerm.toLowerCase())
                    ).length > 0 ? (
                      <div className="divide-y divide-warm-50">
                        {games
                          .filter((g) =>
                            g.name.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map((game) => (
                            <button
                              key={game.id}
                              type="button"
                              onClick={() => handleGameSelect(game)}
                              className="group flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-orange-50"
                            >
                              <img
                                src={game.image}
                                alt=""
                                className="h-8 w-8 rounded-lg bg-warm-100 object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-semibold text-charcoal-900 group-hover:text-orange-700">
                                  {game.name}
                                </div>
                                <div className="truncate text-xs text-warm-500">{game.category}</div>
                              </div>
                              <span className="text-xs font-bold text-orange-600 opacity-0 transition-opacity group-hover:opacity-100">
                                Seç
                              </span>
                            </button>
                          ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-warm-500">Oyun bulunamadı</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-warm-600">
                    Başlık
                  </label>
                  <input
                    type="text"
                    value={currentSlide.title}
                    onChange={(e) =>
                      setCurrentSlide((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full rounded-xl border-2 border-warm-200 px-3.5 py-2.5 text-sm outline-none focus:border-orange-400"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-warm-600">
                    Açıklama
                  </label>
                  <textarea
                    value={currentSlide.description}
                    onChange={(e) =>
                      setCurrentSlide((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="h-24 w-full resize-none rounded-xl border-2 border-warm-200 px-3.5 py-2.5 text-sm outline-none focus:border-orange-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-warm-600">
                      Rozet
                    </label>
                    <input
                      type="text"
                      value={currentSlide.badge}
                      onChange={(e) =>
                        setCurrentSlide((prev) => ({ ...prev, badge: e.target.value }))
                      }
                      className="w-full rounded-xl border-2 border-warm-200 px-3.5 py-2.5 text-sm outline-none focus:border-orange-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-warm-600">
                      Durum
                    </label>
                    <select
                      value={String(currentSlide.is_active)}
                      onChange={(e) =>
                        setCurrentSlide((prev) => ({
                          ...prev,
                          is_active: e.target.value === 'true',
                        }))
                      }
                      className="w-full rounded-xl border-2 border-warm-200 px-3.5 py-2.5 text-sm outline-none focus:border-orange-400"
                    >
                      <option value="true">Aktif</option>
                      <option value="false">Pasif</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-warm-600">
                      Buton Metni
                    </label>
                    <input
                      type="text"
                      value={currentSlide.button_text}
                      onChange={(e) =>
                        setCurrentSlide((prev) => ({ ...prev, button_text: e.target.value }))
                      }
                      className="w-full rounded-xl border-2 border-warm-200 px-3.5 py-2.5 text-sm outline-none focus:border-orange-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-warm-600">
                      Buton Linki
                    </label>
                    <input
                      type="text"
                      value={currentSlide.button_link}
                      onChange={(e) =>
                        setCurrentSlide((prev) => ({ ...prev, button_link: e.target.value }))
                      }
                      className="w-full rounded-xl border-2 border-warm-200 px-3.5 py-2.5 text-sm outline-none focus:border-orange-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-warm-600">
                  Görsel
                </label>
                <div className="rounded-xl border-2 border-dashed border-warm-200 p-3 text-center">
                  {currentSlide.image_url ? (
                    <div className="group relative">
                      <img
                        src={currentSlide.image_url}
                        alt=""
                        className="h-48 w-full rounded-lg object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-charcoal-900/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <label className="cursor-pointer rounded-lg bg-white px-4 py-2 text-sm font-bold text-charcoal-900 hover:bg-cream-50">
                          Değiştir
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg transition-colors hover:bg-cream-50">
                      <ImageIcon className="mb-2 h-12 w-12 text-warm-300" />
                      <span className="text-sm text-warm-500">Resim yüklemek için tıklayın</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                  {uploading && (
                    <p className="mt-2 text-sm font-semibold text-orange-600">Yükleniyor...</p>
                  )}
                </div>
                <p className="mt-2 text-xs text-warm-500">
                  Önerilen boyut: 1920×1080px veya benzer oranlar.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-warm-100 pt-4">
              <button
                type="button"
                onClick={closeEditor}
                className="rounded-xl border border-warm-200 bg-white px-4 py-2.5 text-sm font-semibold text-warm-700 hover:bg-warm-50"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2.5 text-sm font-bold text-white shadow-warm-glow disabled:opacity-50"
              >
                <Save size={16} />
                Kaydet
              </button>
            </div>
          </form>
        )}
      </Modal>

      <div className="overflow-hidden rounded-2xl border border-warm-200/60 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-warm-200 bg-cream-50">
              <tr>
                <th className="w-20 px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-warm-600">
                  Sıra
                </th>
                <th className="w-32 px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-warm-600">
                  Görsel
                </th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-warm-600">
                  Başlık / Açıklama
                </th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-warm-600">
                  Durum
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-warm-600">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-100">
              {slides.map((slide, index) => (
                <tr key={slide.id} className="transition-colors hover:bg-cream-50">
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        className="rounded-lg p-1 text-warm-500 hover:bg-warm-100 disabled:opacity-30"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === slides.length - 1}
                        className="rounded-lg p-1 text-warm-500 hover:bg-warm-100 disabled:opacity-30"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <img
                      src={slide.image_url}
                      alt=""
                      className="h-12 w-20 rounded-lg bg-warm-100 object-cover"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-charcoal-900">{slide.title}</div>
                    <div className="line-clamp-1 text-sm text-warm-500">{slide.description}</div>
                    <div className="mt-1 inline-block rounded-full bg-warm-100 px-2 py-0.5 text-[11px] font-bold text-warm-600">
                      {slide.badge}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-bold ${
                        slide.is_active
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-warm-100 text-warm-600'
                      }`}
                    >
                      {slide.is_active ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentSlide(slide);
                          setIsEditing(true);
                        }}
                        className="grid h-8 w-8 place-items-center rounded-lg text-blue-600 hover:bg-blue-50"
                        title="Düzenle"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(slide.id)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-rose-600 hover:bg-rose-50"
                        title="Sil"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {slides.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-14 text-center text-sm text-warm-500">
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
