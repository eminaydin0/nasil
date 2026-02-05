import { useState, useEffect } from 'react';
import { FileText, Loader2, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import { supabase } from '../../lib/supabase';
import { trackPageView } from '../../utils/analytics';
import { PAGE_SEO, SCHEMA_TEMPLATES } from '../../constants/seo';

const DEFAULT_CONTENT = {
  title: 'Kullanım Koşulları',
  subtitle: '',
  content: 'İçerik yükleniyor...'
};

function TermsOfUse() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView('/kullanim-kosullari');
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('title, subtitle, content, updated_at')
        .eq('section_key', 'kullanim_kosullari')
        .single();

      if (!error && data) {
        setContent({
          title: data.title || 'Kullanım Koşulları',
          subtitle: data.subtitle || '',
          content: data.content || '',
          updatedAt: data.updated_at
        });
      }
    } catch (err) {
      console.error('Error loading terms:', err);
      setContent({
        ...DEFAULT_CONTENT,
        content: 'İçerik şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Paragrafları böl (çift satır sonu)
  const paragraphs = (content.content || '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const breadcrumbs = [{ name: 'Kullanım Koşulları', url: null }];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <SEO
        title={PAGE_SEO.terms.title}
        description={PAGE_SEO.terms.description}
        keywords={PAGE_SEO.terms.keywords}
        url="/kullanim-kosullari"
        structuredData={[
          SCHEMA_TEMPLATES.webPage(
            PAGE_SEO.terms.title,
            PAGE_SEO.terms.description,
            '/kullanim-kosullari'
          )
        ]}
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto px-4">
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-b border-orange-100 px-8 py-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <FileText size={28} />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-gray-900">{content.title}</h1>
                  {content.subtitle && (
                    <p className="text-gray-600 text-sm mt-1 flex items-center gap-2">
                      <Calendar size={16} />
                      {content.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="animate-spin text-orange-500" size={40} />
                </div>
              ) : (
                <div className="prose prose-gray max-w-none">
                  {paragraphs.map((para, i) => {
                    // Madde başlığı (1. GENEL BİLGİLER gibi)
                    const isHeading = /^\d+\.\s+\S+/.test(para.trim()) && para.length < 100 && !para.trim().endsWith('.');
                    if (isHeading) {
                      return (
                        <h2 key={i} className="text-lg font-bold text-gray-900 mt-8 mb-3 first:mt-0">
                          {para}
                        </h2>
                      );
                    }
                    return (
                      <p key={i} className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
                        {para}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Back link */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              to="/gizlilik"
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
            >
              Gizlilik Politikası
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              to="/cerez-politikasi"
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
            >
              Çerez Politikası
            </Link>
            <span className="text-gray-300">|</span>
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

export default TermsOfUse;
