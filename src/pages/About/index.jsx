import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Target,
  Heart,
  Building2,
  ArrowRight,
  MessageCircle,
  Info,
} from 'lucide-react';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import { PAGE_SEO, SCHEMA_TEMPLATES, SITE_CONFIG } from '../../constants/seo';
import { trackPageView } from '../../utils/analytics';
import { supabase } from '../../lib/supabase';
import { useSiteStats } from '../../hooks/useSiteStats';
import { Button } from '../../components/ui';

const CULTURAL_DEFAULT = {
  title: 'Kültürel Mirasımız',
  subtitle: 'Geleneksel oyunlarımızı yaşatıyoruz',
  content:
    'Geleneksel Türk oyunları, yüzyıllardır nesilden nesile aktarılan kültürel mirasımızın önemli bir parçasıdır.',
};

function formatPlus(n) {
  const v = Number(n) || 0;
  if (v >= 1000) return `${Math.floor(v / 100) * 100}+`;
  if (v >= 100) return `${Math.floor(v / 10) * 10}+`;
  if (v >= 10) return `${v}+`;
  return `${v}`;
}

function AboutCard({ icon: Icon, title, children, iconBg = 'bg-orange-50', iconColor = 'text-orange-600' }) {
  return (
    <section className="rounded-2xl border border-warm-200/70 bg-white p-6 shadow-soft">
      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
        <Icon className={`h-6 w-6 ${iconColor}`} aria-hidden />
      </div>
      <h2 className="text-lg font-extrabold text-warm-900">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-warm-600">{children}</div>
    </section>
  );
}

function About() {
  const { stats } = useSiteStats();
  const [cultural, setCultural] = useState(CULTURAL_DEFAULT);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView('/hakkimizda');
  }, []);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('title,subtitle,content')
          .eq('section_key', 'cultural_heritage')
          .single();
        if (cancel || error || !data) return;
        setCultural({
          title: data.title || CULTURAL_DEFAULT.title,
          subtitle: data.subtitle || CULTURAL_DEFAULT.subtitle,
          content: data.content || CULTURAL_DEFAULT.content,
        });
      } catch (_) {
        /* noop */
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  const structuredData = [
    SCHEMA_TEMPLATES.webPage(PAGE_SEO.about.title, PAGE_SEO.about.description, '/hakkimizda'),
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

  const breadcrumbs = [{ name: 'Hakkımızda', url: null }];

  const introParagraphs = cultural.content.split('\n').filter((p) => p.trim());

  const statItems = [
    { display: formatPlus(stats.games), label: 'Oyun rehberi' },
    { display: `${stats.categories || 6}`, label: 'Kategori' },
    { display: formatPlus(stats.comments), label: 'Topluluk yorumu' },
    { display: '%100', label: 'Ücretsiz' },
  ];

  return (
    <div className="min-h-screen bg-cream-50 py-12 font-sans">
      <SEO
        title={PAGE_SEO.about.title}
        description={PAGE_SEO.about.description}
        keywords={PAGE_SEO.about.keywords}
        url="/hakkimizda"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto px-4">
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        {/* Giriş */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-orange-100 p-3">
              <Info className="text-orange-600" size={32} aria-hidden />
            </div>
            <div>
              <h1 className="text-3xl font-black text-warm-900">Hakkımızda</h1>
              <p className="text-warm-600">Kuralı Ne? — Geleneksel oyun rehberiniz</p>
            </div>
          </div>

          <div className="rounded-2xl border border-warm-200/70 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm leading-relaxed text-warm-600 sm:text-base">
              Kuralı Ne?, Türk oyuncunun masası için kuralları toparlıyor: net anlatım, ücretsiz araçlar ve
              topluluk desteği. Geleneksel oyunları dijital ortamda yaşatmak amacıyla kurulduk.
            </p>
          </div>
        </div>

        {/* Kültürel miras — CMS */}
        <section className="mb-6 rounded-2xl border border-warm-200/70 bg-white p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">{cultural.title}</p>
          <h2 className="mt-2 text-lg font-extrabold text-warm-900">{cultural.subtitle}</h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-warm-600 sm:text-base">
            {introParagraphs.map((p, i) => (
              <p key={i}>{p.trim()}</p>
            ))}
          </div>
        </section>

        {/* Misyon & Vizyon */}
        <div className="mb-6 grid gap-6 sm:grid-cols-2">
          <AboutCard icon={Target} title="Misyonumuz">
            <p>
              Geleneksel Türk oyunlarını ve sevilen kutu/kart oyunlarını doğru kurallarla dijitalde
              topluyoruz: yeni nesiller öğrenir, eskiler doğruluğu bulur. Rehber sade Türkçe ve her zaman{' '}
              <span className="font-semibold text-orange-700">ücretsiz</span>.
            </p>
          </AboutCard>

          <AboutCard
            icon={Heart}
            title="Vizyonumuz"
            iconBg="bg-rose-50"
            iconColor="text-rose-600"
          >
            <p>
              Sokaktan salona kadar her oyunu anlaşılır kılavuzlar ve pratik araçlarla güçlendirmek istiyoruz.
              Hangi oyunda tartışılırsa tartışılmasın, son söz net bilgi ve iyi masa arkadaşlarına kalsın.
            </p>
          </AboutCard>
        </div>

        {/* İstatistikler */}
        <section className="mb-6 rounded-2xl border border-warm-200/70 bg-white p-6 shadow-soft">
          <h2 className="text-lg font-extrabold text-warm-900">Rakamlarla</h2>
          <p className="mt-1 text-sm text-warm-500">Sitemizin güncel özeti</p>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {statItems.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-warm-200/70 bg-cream-50 px-3 py-4 text-center"
              >
                <div className="text-2xl font-black text-orange-600">{s.display}</div>
                <div className="mt-1 text-sm font-semibold text-warm-800">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Kurumsal */}
        <AboutCard icon={Building2} title="Kurumsal">
          <p>
            Bu site <span className="font-semibold text-orange-700">Zenvolab</span> tarafından
            yayınlanmaktadır. İçerikler Supabase altyapısı üzerinde güvenle barındırılır; odak noktamız
            hızlı yüklenen arayüz ve sürekli güncellenen oyun rehberleri.
          </p>
        </AboutCard>

        {/* CTA */}
        <div className="mt-10 rounded-2xl border border-warm-200/70 bg-white p-6 text-center shadow-soft sm:p-8">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
            <MessageCircle className="h-6 w-6 text-orange-600" aria-hidden />
          </div>
          <p className="mx-auto max-w-md text-sm text-warm-600 sm:text-base">
            İşbirliği, geri bildirim veya sorularınız için bize yazabilirsiniz.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Button as={Link} to="/iletisim" size="md" iconRight={ArrowRight}>
              Bize ulaşın
            </Button>
            <Link
              to="/oyunlar"
              className="text-sm font-semibold text-orange-600 hover:text-orange-700"
            >
              Oyunları keşfet →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
