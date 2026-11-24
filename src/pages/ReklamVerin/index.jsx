import { useState, useEffect } from 'react';
import { Megaphone } from 'lucide-react';
import SiteDocPage from '../../components/common/SiteDocPage';
import { supabase } from '../../lib/supabase';
import { PAGE_SEO, SCHEMA_TEMPLATES } from '../../constants/seo';

const DEFAULT_CONTENT = {
  title: 'Reklam Verin',
  subtitle: '',
  content: 'İçerik yükleniyor...',
};

export default function ReklamVerin() {
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
          .eq('section_key', 'reklam_verin')
          .single();

        if (cancelled) return;
        if (!error && data) {
          setContent({
            title: data.title || 'Reklam Verin',
            subtitle: data.subtitle || '',
            content: data.content || '',
          });
        }
      } catch (err) {
        console.error('Error loading reklam verin:', err);
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
      icon={Megaphone}
      accent="emerald"
      seo={{
        title: PAGE_SEO.reklamVerin.title,
        description: PAGE_SEO.reklamVerin.description,
        keywords: PAGE_SEO.reklamVerin.keywords,
        url: '/reklam-verin',
        structuredData: [
          SCHEMA_TEMPLATES.webPage(
            PAGE_SEO.reklamVerin.title,
            PAGE_SEO.reklamVerin.description,
            '/reklam-verin'
          ),
        ],
      }}
      breadcrumbs={[{ name: 'Reklam Verin', url: null }]}
      cta={{
        to: '/iletisim',
        label: 'Reklam Talebi Gönder',
        icon: Megaphone,
      }}
      relatedLinks={[
        { to: '/hakkimizda', label: 'Hakkımızda' },
        { to: '/iletisim', label: 'İletişim' },
      ]}
    />
  );
}
