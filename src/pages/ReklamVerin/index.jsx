import { useState, useEffect } from 'react';
import { Megaphone, Loader2, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import { supabase } from '../../lib/supabase';
import { trackPageView } from '../../utils/analytics';
import { PAGE_SEO, SCHEMA_TEMPLATES } from '../../constants/seo';

const DEFAULT_CONTENT = {
  title: 'Reklam Verin',
  subtitle: '',
  content: 'İçerik yükleniyor...'
};

function ReklamVerin() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView('/reklam-verin');
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('title, subtitle, content, updated_at')
        .eq('section_key', 'reklam_verin')
        .single();

      if (!error && data) {
        setContent({
          title: data.title || 'Reklam Verin',
          subtitle: data.subtitle || '',
          content: data.content || '',
          updatedAt: data.updated_at
        });
      }
    } catch (err) {
      console.error('Error loading reklam verin:', err);
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

  const breadcrumbs = [{ name: 'Reklam Verin', url: null }];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <SEO
        title={PAGE_SEO.reklamVerin.title}
        description={PAGE_SEO.reklamVerin.description}
        keywords={PAGE_SEO.reklamVerin.keywords}
        url="/reklam-verin"
        structuredData={[
          SCHEMA_TEMPLATES.webPage(
            PAGE_SEO.reklamVerin.title,
            PAGE_SEO.reklamVerin.description,
            '/reklam-verin'
          )
        ]}
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto px-4">
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-b border-emerald-100 px-8 py-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Megaphone size={28} />
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

            <div className="p-8">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="animate-spin text-emerald-500" size={40} />
                </div>
              ) : (
                <div className="prose prose-gray max-w-none">
                  {paragraphs.map((para, i) => {
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

          <div className="mt-8 flex justify-center">
            <Link
              to="/iletisim"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg"
            >
              <Megaphone size={20} />
              Reklam Talebi Gönder
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm">
            <Link to="/hakkimizda" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Hakkımızda
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/iletisim" className="text-emerald-600 hover:text-emerald-700 font-medium">
              İletişim
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReklamVerin;
