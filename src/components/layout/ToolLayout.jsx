import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import SEO from '../common/SEO';

const ACCENTS = {
  orange: {
    orb1: 'from-orange-400/35',
    orb2: 'from-rose-400/25',
    iconBg: 'from-orange-400/90 to-red-600',
    iconRing: 'ring-orange-300/40',
    glow: 'shadow-[0_0_80px_-20px_rgba(249,115,22,0.45)]',
  },
  pink: {
    orb1: 'from-pink-400/30',
    orb2: 'from-fuchsia-400/25',
    iconBg: 'from-pink-400 to-fuchsia-600',
    iconRing: 'ring-pink-300/40',
    glow: 'shadow-[0_0_80px_-20px_rgba(236,72,153,0.4)]',
  },
  red: {
    orb1: 'from-red-400/30',
    orb2: 'from-orange-400/25',
    iconBg: 'from-red-500 to-orange-600',
    iconRing: 'ring-red-300/35',
    glow: 'shadow-[0_0_80px_-20px_rgba(239,68,68,0.4)]',
  },
  blue: {
    orb1: 'from-sky-400/28',
    orb2: 'from-indigo-400/28',
    iconBg: 'from-sky-500 to-indigo-600',
    iconRing: 'ring-sky-300/35',
    glow: 'shadow-[0_0_80px_-20px_rgba(14,165,233,0.35)]',
  },
  green: {
    orb1: 'from-emerald-400/28',
    orb2: 'from-teal-400/28',
    iconBg: 'from-emerald-500 to-teal-600',
    iconRing: 'ring-emerald-300/35',
    glow: 'shadow-[0_0_80px_-20px_rgba(16,185,129,0.35)]',
  },
  indigo: {
    orb1: 'from-indigo-400/30',
    orb2: 'from-violet-400/28',
    iconBg: 'from-indigo-500 to-violet-600',
    iconRing: 'ring-indigo-300/35',
    glow: 'shadow-[0_0_70px_-20px_rgba(99,102,241,0.4)]',
  },
  purple: {
    orb1: 'from-purple-400/28',
    orb2: 'from-pink-400/22',
    iconBg: 'from-purple-500 to-pink-600',
    iconRing: 'ring-purple-300/35',
    glow: 'shadow-[0_0_70px_-20px_rgba(168,85,247,0.35)]',
  },
  yellow: {
    orb1: 'from-amber-400/35',
    orb2: 'from-orange-400/22',
    iconBg: 'from-amber-500 to-orange-600',
    iconRing: 'ring-amber-300/35',
    glow: 'shadow-[0_0_70px_-20px_rgba(245,158,11,0.4)]',
  },
};

/**
 * Premium araç sayfası iskelesi — sıcak arka plan, cam hero, degrade çerçeve
 */
export default function ToolLayout({
  title,
  description,
  icon: IconComponent,
  iconColor = 'orange',
  badge,
  children,
  helpContent,
  seoTitle,
  seoDescription,
  seoUrl,
}) {
  const a = ACCENTS[iconColor] || ACCENTS.orange;

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-cream-100 font-sans">
      <SEO title={seoTitle || `${title} - Kuralı Ne?`} description={seoDescription || description} url={seoUrl} />

      {/* Atmosfer */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={`absolute -left-[20%] -top-[30%] h-[55vh] w-[55vh] rounded-full bg-gradient-to-br ${a.orb1} to-transparent blur-3xl opacity-90`} />
        <div className={`absolute -bottom-[25%] -right-[15%] h-[45vh] w-[45vh] rounded-full bg-gradient-to-tl ${a.orb2} to-transparent blur-3xl opacity-70`} />
        <div className="absolute left-1/2 top-[8%] h-px w-[min(520px,80vw)] -translate-x-1/2 bg-gradient-to-r from-transparent via-orange-400/35 to-transparent" />
      </div>

      {/* Hero */}
      {title && description ? (
        <div className="relative border-b border-warm-200/60 bg-cream-50/40 backdrop-blur-md">
          <div className="container mx-auto max-w-6xl px-4 py-10 sm:py-14 md:py-16">
            <nav className="animate-fade-in mb-8 flex flex-wrap items-center gap-2 text-xs font-semibold text-warm-500">
              <Link to="/" className="transition-colors hover:text-orange-600">
                Ana Sayfa
              </Link>
              <span className="text-warm-300">/</span>
              <Link to="/araclar" className="transition-colors hover:text-orange-600">
                Araçlar
              </Link>
              <span className="text-warm-300">/</span>
              <span className="text-charcoal-900">{title}</span>
            </nav>

            <div className="grid items-center gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
              {/* İkon blok — yüzen cam panel */}
              <div className="relative mx-auto flex w-full max-w-[280px] justify-center animate-fade-up lg:mx-0">
                <div className={`absolute inset-[10%] rounded-[2rem] bg-gradient-to-br ${a.iconBg} opacity-20 blur-2xl`} />
                <div
                  className={`animate-float relative flex aspect-square w-full max-w-[260px] items-center justify-center rounded-[2rem] bg-gradient-to-br from-white via-cream-50 to-warm-100/80 p-8 ring-1 ring-warm-200/70 ${a.glow} shadow-soft-xl`}
                >
                  <div
                    className={`grid h-[min(144px,40vw)] w-[min(144px,40vw)] place-items-center rounded-3xl bg-gradient-to-br ${a.iconBg} p-px shadow-lg ring-2 ${a.iconRing}`}
                  >
                    <div className="grid h-full w-full place-items-center rounded-[1.375rem] bg-white/10 backdrop-blur-[2px]">
                      {IconComponent && (
                        <IconComponent className="h-[52%] w-[52%] text-white drop-shadow-md" aria-hidden />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Metin */}
              <div className="animate-fade-up flex flex-col justify-center space-y-4 text-center lg:text-left [animation-delay:80ms]">
                <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200/70 bg-orange-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-orange-800">
                    <Sparkles className="h-3 w-3" />
                    Ücretsiz & çevrimiçi
                  </span>
                  {badge ? (
                    <span className="rounded-full bg-charcoal-900 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cream-50">
                      {badge}
                    </span>
                  ) : null}
                </div>
                <h1 className="font-display text-[clamp(1.75rem,4vw,2.65rem)] font-extrabold leading-[1.1] tracking-tight text-charcoal-900">
                  {title}
                </h1>
                <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-warm-600 lg:mx-0 lg:max-w-2xl">
                  {description}
                </p>
                <Link
                  to="/araclar"
                  className="group mx-auto mt-2 inline-flex w-fit items-center gap-2 rounded-xl border border-warm-300/70 bg-white/80 px-4 py-2.5 text-sm font-bold text-warm-800 shadow-soft transition-all hover:border-orange-300 hover:bg-orange-50/80 lg:mx-0"
                >
                  <ArrowLeft
                    size={18}
                    className="transition-transform group-hover:-translate-x-1"
                  />
                  Tüm araçlara dön
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* İçerik */}
      <div
        className={
          title && description
            ? 'container relative z-[1] mx-auto max-w-6xl flex-1 px-4 py-10 sm:py-12 md:py-14'
            : 'relative z-[1] flex min-h-0 flex-1 flex-col overflow-hidden'
        }
      >
        <div className={title && description ? 'mx-auto max-w-5xl' : 'flex h-full min-h-0 flex-1'}>
          <div
            className={
              title && description
                ? `relative rounded-[1.75rem] border border-warm-200/80 bg-gradient-to-b from-white to-cream-50/70 p-[1px] shadow-soft-xl ${a.glow.replace('80px', '40px')}`
                : 'flex h-full min-h-0 w-full flex-1 flex-col'
            }
          >
            <div
              className={
                title && description
                  ? 'overflow-hidden rounded-[1.625rem] bg-white/95 backdrop-blur-sm'
                  : 'flex h-full min-h-0 w-full flex-1 flex-col'
              }
            >
              {children}
            </div>
          </div>

          {/* Yardım kutusu */}
          {helpContent && (
            <div
              className={`relative overflow-hidden rounded-3xl border border-warm-200/70 bg-gradient-to-br from-orange-50/80 via-white to-cream-100/90 p-[1px] shadow-soft-lg ${title && description ? 'mx-auto mt-10 max-w-5xl' : 'mx-auto mt-6 max-w-5xl px-1'}`}
            >
              <div className="rounded-[calc(1.5rem-1px)] bg-white/85 p-8 backdrop-blur-sm sm:p-10">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-px flex-1 max-w-[3rem] bg-gradient-to-r from-orange-400 to-transparent" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-warm-500">
                    Yardım & ipuçları
                  </span>
                  <span className="h-px flex-1 max-w-[3rem] bg-gradient-to-l from-orange-400 to-transparent" />
                </div>
                <div className="prose-tool max-w-none text-warm-700 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-charcoal-900 [&_strong]:font-bold [&_strong]:text-charcoal-900">
                  {helpContent}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
