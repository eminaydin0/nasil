import { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';
import SiteDocPage from '../../components/common/SiteDocPage';
import { supabase } from '../../lib/supabase';
import { PAGE_SEO, SCHEMA_TEMPLATES } from '../../constants/seo';

const DEFAULT_CONTENT = {
  title: 'Çerez Politikası',
  subtitle: '',
  content: 'İçerik yükleniyor...',
};

export default function CookiePolicy() {
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
          .eq('section_key', 'cerez_politikasi')
          .single();

        if (cancelled) return;
        if (!error && data) {
          setContent({
            title: data.title || 'Çerez Politikası',
            subtitle: data.subtitle || '',
            content: data.content || '',
          });
        }
      } catch (err) {
        console.error('Error loading cookie policy:', err);
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
      icon={Cookie}
      accent="amber"
      seo={{
        title: PAGE_SEO.cookie.title,
        description: PAGE_SEO.cookie.description,
        keywords: PAGE_SEO.cookie.keywords,
        url: '/cerez-politikasi',
        structuredData: [
          SCHEMA_TEMPLATES.webPage(
            PAGE_SEO.cookie.title,
            PAGE_SEO.cookie.description,
            '/cerez-politikasi'
          ),
        ],
      }}
      breadcrumbs={[{ name: 'Çerez Politikası', url: null }]}
      relatedLinks={[
        { to: '/gizlilik', label: 'Gizlilik Politikası' },
        { to: '/kullanim-kosullari', label: 'Kullanım Koşulları' },
        { to: '/iletisim', label: 'İletişim' },
      ]}
    />
  );
}
