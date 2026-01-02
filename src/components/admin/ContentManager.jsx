import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

function ContentManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState({
    title: '',
    subtitle: '',
    content: ''
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section_key', 'cultural_heritage')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found, use defaults
          setContent({
            title: 'Kültürel Mirasımız',
            subtitle: 'Geleneksel Oyunlarımızı Yaşatıyoruz',
            content: 'Geleneksel Türk oyunları, yüzyıllardır nesilden nesile aktarılan kültürel mirasımızın önemli bir parçasıdır. Teknolojinin hızla geliştiği günümüzde, bu geleneksel oyunları dijital ortamda belgeleyerek gelecek nesillere aktarmak ve yaşatmak istiyoruz.'
          });
        } else {
          throw error;
        }
      } else {
        setContent({
          title: data.title,
          subtitle: data.subtitle,
          content: data.content
        });
      }
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('İçerik yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({
          section_key: 'cultural_heritage',
          title: content.title,
          subtitle: content.subtitle,
          content: content.content,
          updated_at: new Date().toISOString()
        }, { onConflict: 'section_key' });

      if (error) throw error;

      toast.success('İçerik başarıyla güncellendi');
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('İçerik kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Kültürel Miras Bölümü Düzenle</h2>
      
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ana Başlık
          </label>
          <input
            type="text"
            value={content.title}
            onChange={(e) => setContent({ ...content, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alt Başlık
          </label>
          <input
            type="text"
            value={content.subtitle}
            onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            İçerik Metni
          </label>
          <textarea
            value={content.content}
            onChange={(e) => setContent({ ...content, content: e.target.value })}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save size={20} />
                Kaydet
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ContentManager;
