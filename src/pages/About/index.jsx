import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Target,
  Heart,
  Building2,
  Sparkles,
  ArrowRight,
  MessageCircle,
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
  const storyLead = introParagraphs[0]?.trim();

  const statItems = [
    {
      display: formatPlus(stats.games),
      label: 'Oyun rehberi',
      hint: 'İçeriği sürekli zenginleştiriyoruz',
    },
    {
      display: `${stats.categories || 6}`,
      label: 'Kategori',
      hint: 'Geniş seçim',
    },
    {
      display: formatPlus(stats.comments),
      label: 'Topluluk yorumları',
      hint: 'Masa kültürünü yaşatır',
    },
    {
      display: '%100',
      label: 'Ücretsiz',
      hint: 'Rehbere gömülü',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-cream-100 font-sans">
      <SEO
        title={PAGE_SEO.about.title}
        description={PAGE_SEO.about.description}
        keywords={PAGE_SEO.about.keywords}
        url="/hakkimizda"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
      />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[20%] -top-[35%] h-[72vmin] w-[72vmin] rounded-full bg-gradient-to-br from-orange-400/28 to-transparent blur-3xl" />
        <div className="absolute -bottom-[28%] -right-[12%] h-[62vmin] w-[62vmin] rounded-full bg-gradient-to-tl from-rose-400/22 via-amber-300/12 to-transparent blur-3xl" />
      </div>

      <div className="relative z-[1]">
        <div className="container mx-auto max-w-5xl px-4 pb-16 pt-10 md:pb-20 md:pt-14">
          <Breadcrumb items={breadcrumbs} className="mb-8 animate-fade-in" />

          <header className="mx-auto mb-14 max-w-3xl animate-fade-up text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-orange-900">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Biz kimiz?
            </span>
            <h1 className="font-display mt-5 text-[clamp(2.1rem,4.8vw,3.35rem)] font-extrabold leading-[1.08] tracking-tight text-charcoal-900">
              Hakkımızda
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-warm-600">
              Kuralı Ne?, Türk oyuncunun masası için kuralları toparlıyor: net anlatım, ücretsiz araçlar ve
              topluluk.
            </p>
          </header>

          {/* Kültürel miras — Admin &quot;İçerik&quot; ile senkron */}
          <section className="mb-10 animate-fade-up overflow-hidden rounded-[1.625rem] border border-orange-400/35 bg-gradient-to-br from-charcoal-900 via-orange-950 to-red-950 p-[1px] shadow-warm-glow">
            <div className="relative rounded-[calc(1.625rem-1px)] bg-gradient-to-br from-charcoal-900/92 via-orange-950/95 to-orange-950/98 px-6 py-8 text-orange-50 sm:px-10 sm:py-10">
              <div className="absolute -left-16 top-0 h-40 w-40 rounded-full bg-orange-500/35 blur-[70px]" aria-hidden />
              <div className="relative">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-100/85">
                  {cultural.title}
                </p>
                <h2 className="font-display mt-3 max-w-2xl text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
                  {cultural.subtitle}
                </h2>
                {storyLead && (
                  <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-orange-50/82">
                    {storyLead}
                  </p>
                )}
                <p className="mt-6 text-[11px] font-semibold uppercase tracking-widest text-orange-300/90">
                  Metin &quot;Yönetim → Site içeriği → Kültürel Miras&quot; bölümünden düzenlenir.
                </p>
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="group animate-fade-up rounded-[1.375rem] border border-warm-200/80 bg-white/90 p-7 shadow-soft-lg backdrop-blur-sm transition-all hover:border-orange-300/50 hover:shadow-soft-xl md:p-8">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-orange-400/25 to-red-500/25 ring-1 ring-orange-500/25">
                <Target className="h-6 w-6 text-orange-600" aria-hidden />
              </div>
              <h2 className="font-display text-xl font-bold text-charcoal-900 md:text-2xl">Misyonumuz</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-warm-600">
                Geleneksel Türk oyunlarını ve sevilen kutu/kart oyunlarını doğru kurallarla dijitalde
                topluyoruz: yeni nesiller öğrenir, eskiler doğruluğu bulur. Rehber sade Türkçe ve her zaman{' '}
                <span className="font-bold text-orange-700">ücretsiz</span>.
              </p>
            </section>

            <section className="group animate-fade-up rounded-[1.375rem] border border-warm-200/80 bg-gradient-to-b from-white to-cream-50/75 p-7 shadow-soft-lg backdrop-blur-sm transition-all hover:border-amber-300/40 hover:shadow-soft-xl md:p-8 [animation-delay:60ms]">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-pink-400/25 to-orange-400/25 ring-1 ring-pink-500/25">
                <Heart className="h-6 w-6 text-rose-600" aria-hidden />
              </div>
              <h2 className="font-display text-xl font-bold text-charcoal-900 md:text-2xl">Vizyonumuz</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-warm-600">
                Sokaktan salona kadar her oyunu anlaşılır kılavuzlar ve pratik araçlarla güçlendirmek istiyoruz.
                Hangi oyunda tartışılırsa tartışılmasın, son söz net bilgi ve iyi masa arkadaşlarına kalsın.
              </p>
            </section>
          </div>

          <section className="mt-10 animate-fade-up overflow-hidden rounded-[1.5rem] border border-warm-200/75 bg-white/95 p-[1px] shadow-soft-xl [animation-delay:100ms]">
            <div className="rounded-[calc(1.5rem-1px)] px-6 py-9 sm:p-10">
              <div className="mb-10 text-center">
                <h2 className="font-display text-2xl font-bold tracking-tight text-charcoal-900 md:text-[1.75rem]">
                  Rakamlarla biz
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-warm-500">
                  Ana sayfadaki ile aynı küresel özet cache’ten güncellenir.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                {statItems.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-warm-200/70 bg-gradient-to-b from-cream-50 to-white px-4 py-5 text-center shadow-soft"
                  >
                    <div className="font-display text-3xl font-black tracking-tighter text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text md:text-[2.125rem]">
                      {s.display}
                    </div>
                    <div className="mt-1 font-bold text-charcoal-900">{s.label}</div>
                    <div className="mt-1 text-[11px] font-medium uppercase tracking-wide text-warm-400">
                      {s.hint || s.sub}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="relative mt-10 animate-fade-up overflow-hidden rounded-[1.375rem] border border-warm-200/80 bg-white/92 p-7 shadow-soft-lg backdrop-blur-sm md:p-9 [animation-delay:140ms]">
            <div className="absolute -right-20 top-0 h-52 w-52 rounded-full bg-amber-200/35 blur-[80px]" aria-hidden />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-start">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white shadow-soft ring-1 ring-warm-200">
                <Building2 className="h-6 w-6 text-orange-600" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-xl font-bold text-charcoal-900 md:text-2xl">Kurumsal</h2>
                <p className="mt-4 text-[15px] leading-relaxed text-warm-600">
                  Bu site{' '}
                  <span className="font-bold text-orange-700">Zenvolab</span> tarafından yayınlanmaktadır.
                  Teknoloji yığınımız güvenli Supabase ile desteklenen modern bir SPA; odak hep hızlı yüklenen,
                  sıcak arayüz ve güncellenen içerik.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {['React', 'Vite', 'Tailwind', 'Supabase'].map((t) => (
                    <span
                      key={t}
                      className="rounded-xl border border-warm-200/80 bg-cream-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-warm-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="mt-14 flex animate-fade-up flex-col items-center justify-center gap-4 rounded-2xl border border-warm-200/70 bg-white/85 px-6 py-10 text-center shadow-soft-xl [animation-delay:180ms]">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-500/15">
              <MessageCircle className="h-6 w-6 text-orange-700" aria-hidden />
            </div>
            <p className="max-w-lg text-[15px] font-medium text-warm-700">
              İşbirliği, haklı bildiriminiz veya sadece &quot;merhaba&quot; için bir mesaj göndermeniz yeterli.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button as={Link} to="/iletisim" size="lg" iconRight={ArrowRight}>
                Bize ulaşın
              </Button>
              <Link
                to="/oyunlar"
                className="text-sm font-bold text-orange-700 underline-offset-4 transition-colors hover:text-orange-900 hover:underline"
              >
                Oyun veritabanı →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
