import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import SiteDocPage from '../../components/common/SiteDocPage';
import { supabase } from '../../lib/supabase';
import { PAGE_SEO, SCHEMA_TEMPLATES } from '../../constants/seo';

const DEFAULT_CONTENT = {
  title: 'Gizlilik Politikası',
  subtitle: '',
  content: 'İçerik yükleniyor...',
};

export default function PrivacyPolicy() {
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
          .eq('section_key', 'gizlilik_politikasi')
          .single();

        if (cancelled) return;
        if (!error && data) {
          setContent({
            title: data.title || 'Gizlilik Politikası',
            subtitle: data.subtitle || '',
            content: data.content || '',
          });
        }
      } catch (err) {
        console.error('Error loading privacy policy:', err);
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
      icon={Shield}
      accent="teal"
      seo={{
        title: PAGE_SEO.privacy.title,
        description: PAGE_SEO.privacy.description,
        keywords: PAGE_SEO.privacy.keywords,
        url: '/gizlilik',
        structuredData: [
          SCHEMA_TEMPLATES.webPage(
            PAGE_SEO.privacy.title,
            PAGE_SEO.privacy.description,
            '/gizlilik'
          ),
        ],
      }}
      breadcrumbs={[{ name: 'Gizlilik Politikası', url: null }]}
      relatedLinks={[
        { to: '/kullanim-kosullari', label: 'Kullanım Koşulları' },
        { to: '/cerez-politikasi', label: 'Çerez Politikası' },
        { to: '/iletisim', label: 'İletişim' },
      ]}
    />
  );
}
