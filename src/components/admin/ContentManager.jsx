import { useState, useEffect, useCallback } from 'react';
import {
  Save,
  Loader2,
  FileText,
  BookOpen,
  Shield,
  Cookie,
  Megaphone,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { TextField, Button } from '../ui';
import { AdminToolbar, AdminFilterSelect } from './adminUi';

const CONTENT_SECTIONS = [
  { key: 'cultural_heritage', label: 'Kültürel Miras', hint: 'Hakkımızda & ana sayfa hikaye bloğu', icon: BookOpen },
  { key: 'kullanim_kosullari', label: 'Kullanım Koşulları', hint: '/kullanim-kosullari', icon: FileText },
  { key: 'gizlilik_politikasi', label: 'Gizlilik Politikası', hint: '/gizlilik', icon: Shield },
  { key: 'cerez_politikasi', label: 'Çerez Politikası', hint: '/cerez-politikasi', icon: Cookie },
  { key: 'reklam_verin', label: 'Reklam Verin', hint: '/reklam-verin', icon: Megaphone },
];

const DEFAULTS = {
  cultural_heritage: {
    title: 'Kültürel Mirasımız',
    subtitle: 'Geleneksel Oyunlarımızı Yaşatıyoruz',
    content:
      'Geleneksel Türk oyunları, yüzyıllardır nesilden nesile aktarılan kültürel mirasımızın önemli bir parçasıdır.',
  },
  kullanim_kosullari: {
    title: 'Kullanım Koşulları',
    subtitle: 'Son güncelleme: Ocak 2026',
    content: 'Kullanım koşulları metnini buradan düzenleyebilirsiniz. Paragraflar arasında boş satır bırakın.',
  },
  gizlilik_politikasi: {
    title: 'Gizlilik Politikası',
    subtitle: 'Son güncelleme: Ocak 2026',
    content: 'Gizlilik politikası metnini buradan düzenleyebilirsiniz. Paragraflar arasında boş satır bırakın.',
  },
  cerez_politikasi: {
    title: 'Çerez Politikası',
    subtitle: 'Son güncelleme: Ocak 2026',
    content: 'Çerez politikası metnini buradan düzenleyebilirsiniz. Paragraflar arasında boş satır bırakın.',
  },
  reklam_verin: {
    title: 'Reklam Verin',
    subtitle: 'Markanızı oyunseverlere ulaştırın',
    content:
      'Reklam Verin sayfası metnini buradan düzenleyebilirsiniz. Paragraflar arasında boş satır bırakın.',
  },
};

function ContentManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('cultural_heritage');
  const [content, setContent] = useState({
    title: '',
    subtitle: '',
    content: '',
  });

  const loadContent = useCallback(async () => {
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
          content: data.content || defaults.content,
        });
      }
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('İçerik yüklenirken hata oluştu');
      setContent(DEFAULTS[activeSection] || DEFAULTS.cultural_heritage);
    } finally {
      setLoading(false);
    }
  }, [activeSection]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase.from('site_content').upsert(
        {
          section_key: activeSection,
          title: content.title,
          subtitle: content.subtitle,
          content: content.content,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'section_key' },
      );

      if (error) throw error;

      toast.success('İçerik kaydedildi — sayfa bir sonraki ziyaretçide güncel olur.');
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Kayıt başarısız');
    } finally {
      setSaving(false);
    }
  };

  const meta = CONTENT_SECTIONS.find((s) => s.key === activeSection);
  const Icon = meta?.icon;
  const legalSection = ['kullanim_kosullari', 'gizlilik_politikasi', 'cerez_politikasi', 'reklam_verin'].includes(
    activeSection,
  );

  return (
    <div className="space-y-5">
      <AdminToolbar
        filters={
          <AdminFilterSelect
            value={activeSection}
            onChange={(e) => setActiveSection(e.target.value)}
            aria-label="İçerik bölümü"
            className="min-w-[16rem]"
          >
            {CONTENT_SECTIONS.map(({ key, label }) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </AdminFilterSelect>
        }
      />

      <div className="rounded-[1.5rem] border border-warm-200/80 bg-white shadow-soft-xl">
        <div className="relative border-b border-warm-200/70 px-6 py-5 sm:px-8">
          <div className="absolute inset-x-0 top-0 h-1 rounded-t-[calc(1.5rem-1px)] bg-gradient-to-r from-orange-400 via-orange-600 to-red-600" aria-hidden />
          <div className="flex flex-wrap items-center gap-3">
            {Icon && (
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-orange-500/15 ring-1 ring-orange-400/35">
                <Icon className="text-orange-700" size={20} aria-hidden />
              </div>
            )}
            <div>
              <h3 className="font-display text-lg font-bold tracking-tight text-charcoal-900 sm:text-xl">
                {meta?.label} düzenle
              </h3>
              <p className="text-xs font-semibold uppercase tracking-wide text-warm-500">{meta?.hint}</p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-orange-600" size={36} aria-hidden />
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-8">
              <TextField
                label="Ana başlık"
                value={content.title}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                tone="subtle"
                required
              />
              <TextField
                label="Alt başlık"
                value={content.subtitle}
                onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                tone="subtle"
                hint={legalSection ? 'Örn: Son güncelleme: Ocak 2026' : undefined}
                placeholder=""
              />

              <TextField
                as="textarea"
                label="İçerik gövdesi"
                rows={legalSection ? 18 : 8}
                value={content.content}
                onChange={(e) => setContent({ ...content, content: e.target.value })}
                tone="subtle"
                inputClassName="font-mono text-[13px] leading-relaxed py-4"
                required
              />

              {legalSection && (
                <p className="-mt-2 text-[11px] font-medium uppercase tracking-wide text-warm-400">
                  Boş satırlar ile paragrafları ayırın; uzun yasal metinleri tek seferde yapıştırabilirsiniz.
                </p>
              )}

              <div className="flex flex-wrap justify-end gap-3 border-t border-warm-200/70 pt-6">
                <Button type="submit" size="lg" loading={saving} iconRight={!saving ? Save : undefined}>
                  {saving ? 'Kaydediliyor…' : 'Değişiklikleri yayınla'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContentManager;
