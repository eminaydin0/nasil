import { useState, useEffect } from 'react';
import { Shield, Loader2, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import { supabase } from '../../lib/supabase';
import { PAGE_SEO, SCHEMA_TEMPLATES } from '../../constants/seo';

const DEFAULT_CONTENT = {
  title: 'Gizlilik Politikası',
  subtitle: '',
  content: 'İçerik yükleniyor...'
};

function PrivacyPolicy() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('title, subtitle, content, updated_at')
        .eq('section_key', 'gizlilik_politikasi')
        .single();

      if (!error && data) {
        setContent({
          title: data.title || 'Gizlilik Politikası',
          subtitle: data.subtitle || '',
          content: data.content || '',
          updatedAt: data.updated_at
        });
      }
    } catch (err) {
      console.error('Error loading privacy policy:', err);
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

  const breadcrumbs = [{ name: 'Gizlilik Politikası', url: null }];

  return (
    <div className="min-h-screen bg-cream-50 py-12">
      <SEO
        title={PAGE_SEO.privacy.title}
        description={PAGE_SEO.privacy.description}
        keywords={PAGE_SEO.privacy.keywords}
        url="/gizlilik"
        structuredData={[
          SCHEMA_TEMPLATES.webPage(
            PAGE_SEO.privacy.title,
            PAGE_SEO.privacy.description,
            '/gizlilik'
          )
        ]}
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto px-4">
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-warm-100 overflow-hidden">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-b border-indigo-100 px-8 py-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Shield size={28} />
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
                  <Loader2 className="animate-spin text-indigo-500" size={40} />
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
              to="/kullanim-kosullari"
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
            >
              Kullanım Koşulları
            </Link>
            <span className="text-warm-300">|</span>
            <Link
              to="/cerez-politikasi"
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
            >
              Çerez Politikası
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

export default PrivacyPolicy;
