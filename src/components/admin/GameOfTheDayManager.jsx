import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Search, Sparkles, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GameOfTheDayManager() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedGameId, setSelectedGameId] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [currentSelection, setCurrentSelection] = useState(null);

  useEffect(() => {
    fetchGames();
    fetchCurrentSelection();
  }, []);

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('id, name, category')
        .order('name');
      
      if (error) throw error;
      setGames(data);
    } catch (error) {
      console.error('Error fetching games:', error);
      toast.error('Oyunlar yüklenirken hata oluştu');
    }
  };

  const fetchCurrentSelection = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_game_selection')
        .select(`
          *,
          game:games (
            id,
            name,
            image
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setCurrentSelection(data);
        setSelectedGameId(data.game_id);
        setCustomTitle(data.custom_title || '');
        setCustomDescription(data.custom_description || '');
      }
    } catch (error) {
      console.error('Error fetching current selection:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedGameId) {
      toast.error('Lütfen bir oyun seçin');
      return;
    }

    setSaving(true);
    try {
      // Önceki seçimleri pasif yap (isteğe bağlı, ama temiz tutmak için iyi)
      await supabase
        .from('daily_game_selection')
        .update({ is_active: false })
        .eq('is_active', true);

      // Yeni seçimi ekle
      const { error } = await supabase
        .from('daily_game_selection')
        .insert({
          game_id: selectedGameId,
          custom_title: customTitle,
          custom_description: customDescription,
          is_active: true
        });

      if (error) throw error;

      toast.success('Günün oyunu güncellendi');
      fetchCurrentSelection();
    } catch (error) {
      console.error('Error saving selection:', error);
      toast.error('Kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const filteredGames = games.filter(game => 
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center">Yükleniyor...</div>;

  return (
    <div className="space-y-5">
      <p className="text-sm text-warm-600">Ana sayfada gösterilecek öne çıkan oyunu seçin</p>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        {/* Sol Kolon: Seçim Formu */}
        <div className="rounded-2xl border border-warm-200/60 bg-white p-5 shadow-soft sm:p-6">
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-warm-600">
                Oyun Seçin
              </label>
              
              {/* Arama Kutusu */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" size={18} />
                <input
                  type="text"
                  placeholder="Listede oyun ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border-2 border-warm-200 bg-cream-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-orange-400"
                />
              </div>

              {/* Oyun Listesi */}
              <div className="max-h-60 overflow-y-auto overflow-hidden rounded-xl border border-warm-200 bg-white">
                {filteredGames.length > 0 ? (
                  <div className="divide-y divide-warm-100">
                    {filteredGames.map(game => (
                      <button
                        key={game.id}
                        onClick={() => setSelectedGameId(game.id)}
                        className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-orange-50 ${
                          selectedGameId == game.id ? 'bg-orange-50 border-l-4 border-orange-500' : ''
                        }`}
                      >
                        <span className={`font-medium ${selectedGameId == game.id ? 'text-orange-900' : 'text-gray-700'}`}>
                          {game.name}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {game.category}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    Oyun bulunamadı
                  </div>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                <Sparkles size={12} />
                Listeden bir oyun seçerek günün oyunu olarak ayarlayabilirsiniz.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Özel Başlık (İsteğe Bağlı)
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Örn: Haftanın En Çok Oynanan Oyunu"
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Özel Açıklama (İsteğe Bağlı)
              </label>
              <textarea
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                placeholder="Oyunun orijinal açıklamasını ezmek için buraya yazın..."
                rows={3}
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              <Save size={20} />
              {saving ? 'Kaydediliyor...' : 'Seçimi Kaydet'}
            </button>
          </div>
        </div>

        {/* Sağ Kolon: Önizleme */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="text-orange-500" size={20} />
            Aktif Seçim
          </h3>
          
          {currentSelection ? (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative h-48">
                <img 
                  src={currentSelection.game?.image} 
                  alt={currentSelection.game?.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-xs font-bold bg-orange-500 px-2 py-1 rounded mb-2 inline-block">
                    GÜNÜN OYUNU
                  </div>
                  <h4 className="text-xl font-bold">
                    {currentSelection.custom_title || currentSelection.game?.name}
                  </h4>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 text-sm line-clamp-3">
                  {currentSelection.custom_description || "Oyunun orijinal açıklaması kullanılacak."}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                  <Calendar size={14} />
                  <span>Seçim Tarihi: {new Date(currentSelection.created_at).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Henüz bir oyun seçilmemiş.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
