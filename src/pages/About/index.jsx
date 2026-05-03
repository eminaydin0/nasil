import { useEffect } from 'react';
import { Users, Target, Heart, Building2 } from 'lucide-react';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import { PAGE_SEO, SCHEMA_TEMPLATES, SITE_CONFIG } from '../../constants/seo';
import { trackPageView } from '../../utils/analytics';

function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView('/hakkimizda');
  }, []);

  // Structured Data
  const structuredData = [
    SCHEMA_TEMPLATES.webPage(
      PAGE_SEO.about.title,
      PAGE_SEO.about.description,
      '/hakkimizda'
    ),
    SCHEMA_TEMPLATES.organization,
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: PAGE_SEO.about.title,
      description: PAGE_SEO.about.description,
      url: `${SITE_CONFIG.url}/hakkimizda`,
      mainEntity: SCHEMA_TEMPLATES.organization,
    },
  ];

  // Breadcrumb
  const breadcrumbs = [
    { name: 'Hakkımızda', url: null },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <SEO 
        title={PAGE_SEO.about.title}
        description={PAGE_SEO.about.description}
        keywords={PAGE_SEO.about.keywords}
        url="/hakkimizda"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-6">
              <Users className="text-orange-600" size={32} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4">
              Hakkımızda
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Geleneksel Türk oyunlarını ve popüler kutu oyunlarını dijital dünyada yaşatıyoruz.
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Mission Section */}
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                  <Target className="text-orange-600" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Misyonumuz</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Kuralı Ne?, geleneksel Türk oyunlarını ve popüler kutu oyunlarını dijital dünyada yaşatmak, 
                    yeni nesillere aktarmak ve oyun severlere rehberlik etmek amacıyla kurulmuş kapsamlı bir oyun kütüphanesidir.
                  </p>
                </div>
              </div>
            </div>

            {/* Vision Section */}
            <div className="p-8 border-b border-gray-100 bg-gray-50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                  <Heart className="text-orange-600" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Vizyonumuz</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Amacımız, unutulmaya yüz tutmuş sokak oyunlarından, strateji dolu kart oyunlarına kadar geniş bir yelpazede 
                    doğru ve anlaşılır bilgiler sunmaktır. Her oyunun kurallarını, püf noktalarını ve oynanış şekillerini 
                    detaylı bir şekilde inceleyerek ziyaretçilerimize sunuyoruz.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="p-8 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Rakamlarla Biz</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-black text-orange-600 mb-2">50+</div>
                  <div className="text-gray-600 text-sm font-medium">Oyun Rehberi</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-orange-600 mb-2">6</div>
                  <div className="text-gray-600 text-sm font-medium">Kategori</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-orange-600 mb-2">7+</div>
                  <div className="text-gray-600 text-sm font-medium">Yardımcı Araç</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-orange-600 mb-2">%100</div>
                  <div className="text-gray-600 text-sm font-medium">Ücretsiz</div>
                </div>
              </div>
            </div>

            {/* Company Section */}
            <div className="p-8 bg-gradient-to-br from-orange-50 to-amber-50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                  <Building2 className="text-orange-600" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Kurumsal</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Bu site, <span className="font-bold text-orange-600">Zenvolab</span> şirketi tarafından kurulmuştur.
                    Kullanıcı deneyimini ön planda tutan, modern ve hızlı bir web deneyimi sunmayı hedefleyen bu platform,
                    sürekli güncellenen içeriğiyle oyun severlerin hizmetindedir.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600 shadow-sm">React</span>
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600 shadow-sm">Tailwind CSS</span>
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600 shadow-sm">Supabase</span>
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600 shadow-sm">Vite</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Sorularınız veya önerileriniz mi var?</p>
            <a 
              href="/iletisim" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors"
            >
              Bize Ulaşın
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
