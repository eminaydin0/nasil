import { useState, useEffect } from 'react';
import { Cookie, Loader2, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import { supabase } from '../../lib/supabase';
import { trackPageView } from '../../utils/analytics';
import { PAGE_SEO, SCHEMA_TEMPLATES } from '../../constants/seo';

const DEFAULT_CONTENT = {
  title: 'Çerez Politikası',
  subtitle: '',
  content: 'İçerik yükleniyor...'
};

function CookiePolicy() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView('/cerez-politikasi');
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('title, subtitle, content, updated_at')
        .eq('section_key', 'cerez_politikasi')
        .single();

      if (!error && data) {
        setContent({
          title: data.title || 'Çerez Politikası',
          subtitle: data.subtitle || '',
          content: data.content || '',
          updatedAt: data.updated_at
        });
      }
    } catch (err) {
      console.error('Error loading cookie policy:', err);
      setContent({
        ...DEFAULT_CONTENT,
        content: 'İçerik şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin.'
      });
    } finally {
      setLoading(false);
    }
  };

  const paragraphs = (content.content || '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const breadcrumbs = [{ name: 'Çerez Politikası', url: null }];

  return (
    <div className="min-h-screen bg-cream-50 py-12">
      <SEO
        title={PAGE_SEO.cookie.title}
        description={PAGE_SEO.cookie.description}
        keywords={PAGE_SEO.cookie.keywords}
        url="/cerez-politikasi"
        structuredData={[
          SCHEMA_TEMPLATES.webPage(
            PAGE_SEO.cookie.title,
            PAGE_SEO.cookie.description,
            '/cerez-politikasi'
          )
        ]}
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto px-4">
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-warm-100 overflow-hidden">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-b border-amber-100 px-8 py-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Cookie size={28} />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-warm-900">{content.title}</h1>
                  {content.subtitle && (
                    <p className="text-warm-600 text-sm mt-1 flex items-center gap-2">
                      <Calendar size={16} />
                      {content.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-8">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="animate-spin text-amber-500" size={40} />
                </div>
              ) : (
                <div className="prose prose-gray max-w-none">
                  {paragraphs.map((para, i) => {
                    const isHeading = /^\d+\.\s+\S+/.test(para.trim()) && para.length < 100 && !para.trim().endsWith('.');
                    if (isHeading) {
                      return (
                        <h2 key={i} className="text-lg font-bold text-warm-900 mt-8 mb-3 first:mt-0">
                          {para}
                        </h2>
                      );
                    }
                    return (
                      <p key={i} className="text-warm-700 leading-relaxed mb-4 whitespace-pre-line">
                        {para}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              to="/gizlilik"
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
            >
              Gizlilik Politikası
            </Link>
            <span className="text-warm-300">|</span>
            <Link
              to="/kullanim-kosullari"
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
            >
              Kullanım Koşulları
            </Link>
            <span className="text-warm-300">|</span>
            <Link
              to="/iletisim"
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
            >
              İletişim
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CookiePolicy;
