import { useState, useEffect } from 'react';
import { Save, Loader2, FileText, BookOpen, Shield, Cookie, Megaphone } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const CONTENT_SECTIONS = [
  { key: 'cultural_heritage', label: 'Kültürel Miras', icon: BookOpen },
  { key: 'kullanim_kosullari', label: 'Kullanım Koşulları', icon: FileText },
  { key: 'gizlilik_politikasi', label: 'Gizlilik Politikası', icon: Shield },
  { key: 'cerez_politikasi', label: 'Çerez Politikası', icon: Cookie },
  { key: 'reklam_verin', label: 'Reklam Verin', icon: Megaphone },
];

const DEFAULTS = {
  cultural_heritage: {
    title: 'Kültürel Mirasımız',
    subtitle: 'Geleneksel Oyunlarımızı Yaşatıyoruz',
    content: 'Geleneksel Türk oyunları, yüzyıllardır nesilden nesile aktarılan kültürel mirasımızın önemli bir parçasıdır.'
  },
  kullanim_kosullari: {
    title: 'Kullanım Koşulları',
    subtitle: 'Son güncelleme: Ocak 2026',
    content: 'Kullanım koşulları metnini buradan düzenleyebilirsiniz. Paragraflar arasında boş satır bırakın.'
  },
  gizlilik_politikasi: {
    title: 'Gizlilik Politikası',
    subtitle: 'Son güncelleme: Ocak 2026',
    content: 'Gizlilik politikası metnini buradan düzenleyebilirsiniz. Paragraflar arasında boş satır bırakın.'
  },
  cerez_politikasi: {
    title: 'Çerez Politikası',
    subtitle: 'Son güncelleme: Ocak 2026',
    content: 'Çerez politikası metnini buradan düzenleyebilirsiniz. Paragraflar arasında boş satır bırakın.'
  },
  reklam_verin: {
    title: 'Reklam Verin',
    subtitle: 'Markanızı oyunseverlere ulaştırın',
    content: 'Reklam Verin sayfası metnini buradan düzenleyebilirsiniz. Paragraflar arasında boş satır bırakın.'
  }
};

function ContentManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('cultural_heritage');
  const [content, setContent] = useState({
    title: '',
    subtitle: '',
    content: ''
  });

  useEffect(() => {
    loadContent();
  }, [activeSection]);

  const loadContent = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section_key', activeSection)
        .single();

      const defaults = DEFAULTS[activeSection] || DEFAULTS.cultural_heritage;

      if (error) {
        if (error.code === 'PGRST116') {
          setContent(defaults);
        } else {
          throw error;
        }
      } else {
        setContent({
          title: data.title || defaults.title,
          subtitle: data.subtitle || defaults.subtitle,
          content: data.content || defaults.content
        });
      }
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('İçerik yüklenirken hata oluştu');
      setContent(DEFAULTS[activeSection] || DEFAULTS.cultural_heritage);
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
          section_key: activeSection,
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

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {CONTENT_SECTIONS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveSection(key)}
            className={`pb-3 px-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
              activeSection === key
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {CONTENT_SECTIONS.find((s) => s.key === activeSection)?.label} Düzenle
        </h2>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-orange-600" size={32} />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ana Başlık</label>
              <input
                type="text"
                value={content.title}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alt Başlık</label>
              <input
                type="text"
                value={content.subtitle}
                onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder={['kullanim_kosullari', 'gizlilik_politikasi', 'cerez_politikasi', 'reklam_verin'].includes(activeSection) ? 'Örn: Son güncelleme: Ocak 2026' : ''}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">İçerik Metni</label>
              <textarea
                value={content.content}
                onChange={(e) => setContent({ ...content, content: e.target.value })}
                rows={['kullanim_kosullari', 'gizlilik_politikasi', 'cerez_politikasi', 'reklam_verin'].includes(activeSection) ? 16 : 6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-sm"
                required
              />
              {['kullanim_kosullari', 'gizlilik_politikasi', 'cerez_politikasi', 'reklam_verin'].includes(activeSection) && (
                <p className="mt-1.5 text-xs text-gray-500">
                  Paragraflar arasında boş satır bırakın. "1. BAŞLIK" gibi kısa satırlar otomatik başlık olarak gösterilir.
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors font-medium"
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
        )}
      </div>
    </div>
  );
}

export default ContentManager;
