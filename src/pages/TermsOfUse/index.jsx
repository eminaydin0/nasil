import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import SiteDocPage from '../../components/common/SiteDocPage';
import { supabase } from '../../lib/supabase';
import { PAGE_SEO, SCHEMA_TEMPLATES } from '../../constants/seo';

const DEFAULT_CONTENT = {
  title: 'Kullanım Koşulları',
  subtitle: '',
  content: 'İçerik yükleniyor...',
};

export default function TermsOfUse() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    let cancelled = false;

    (async () => {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('title, subtitle, content, updated_at')
          .eq('section_key', 'kullanim_kosullari')
          .single();

        if (cancelled) return;
        if (!error && data) {
          setContent({
            title: data.title || 'Kullanım Koşulları',
            subtitle: data.subtitle || '',
            content: data.content || '',
          });
        }
      } catch (err) {
        console.error('Error loading terms:', err);
        if (!cancelled) {
          setContent({
            ...DEFAULT_CONTENT,
            content: 'İçerik şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin.',
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SiteDocPage
      title={content.title}
      subtitle={content.subtitle}
      content={content.content}
      loading={loading}
      icon={FileText}
      accent="orange"
      seo={{
        title: PAGE_SEO.terms.title,
        description: PAGE_SEO.terms.description,
        keywords: PAGE_SEO.terms.keywords,
        url: '/kullanim-kosullari',
        structuredData: [
          SCHEMA_TEMPLATES.webPage(
            PAGE_SEO.terms.title,
            PAGE_SEO.terms.description,
            '/kullanim-kosullari'
          ),
        ],
      }}
      breadcrumbs={[{ name: 'Kullanım Koşulları', url: null }]}
      relatedLinks={[
        { to: '/gizlilik', label: 'Gizlilik Politikası' },
        { to: '/cerez-politikasi', label: 'Çerez Politikası' },
        { to: '/iletisim', label: 'İletişim' },
      ]}
    />
  );
}
