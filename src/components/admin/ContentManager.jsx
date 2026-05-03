import { useState, useEffect, useCallback } from 'react';
import {
  Save,
  Loader2,
  FileText,
  BookOpen,
  Shield,
  Cookie,
  Megaphone,
  Sparkles,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { TextField, Button } from '../ui';

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
    <div className="space-y-6">
      {/* Başlık */}
      <div className="overflow-hidden rounded-[1.5rem] border border-orange-400/35 bg-gradient-to-br from-charcoal-900 via-orange-950 to-red-950 p-[1px] shadow-soft-lg">
        <div className="flex flex-wrap items-start justify-between gap-4 rounded-[calc(1.5rem-1px)] bg-gradient-to-br from-charcoal-900/93 to-orange-950/95 px-5 py-5 sm:p-7">
          <div className="flex min-w-0 items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20">
              <Sparkles className="h-6 w-6 text-orange-300" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.26em] text-orange-100/85">Site içeriği</p>
              <h2 className="font-display mt-1 text-xl font-bold text-white sm:text-2xl tracking-tight">
                Metin blokları ve yasal sayfalar
              </h2>
              <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-orange-50/76">
                Hakkımızda sayfasındaki sıcak hikaye alanı ile ana sayfadaki blok aynı <strong>kültürel miras</strong>{' '}
                kaydından çekilir — buradan düzenler, canlı yayına yansıtırsınız.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bölüm seçici */}
      <div className="-mx-1 rounded-2xl border border-warm-200/70 bg-white/90 p-2 shadow-soft backdrop-blur-sm">
        <div className="-mx-0.5 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:gap-3">
          {CONTENT_SECTIONS.map(({ key, label, hint, icon: TabIcon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveSection(key)}
              className={`group flex min-w-[10.5rem] shrink-0 items-center gap-2.5 rounded-xl border-2 px-3.5 py-2.5 text-left transition-all sm:min-w-0 ${activeSection === key
                ? 'border-orange-500 bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-warm-glow'
                : 'border-warm-200 bg-cream-50 text-charcoal-900 hover:border-warm-300 hover:bg-white'}`}
            >
              <TabIcon
                size={18}
                className={activeSection === key ? 'text-white opacity-95' : 'text-orange-600'}
              />
              <span className="min-w-0">
                <span className={`block truncate text-xs font-black uppercase tracking-[0.1em] ${activeSection === key ? 'text-white/92' : 'text-warm-400'}`}>
                  {hint}
                </span>
                <span className="block truncate text-sm font-bold tracking-tight">{label}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

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
