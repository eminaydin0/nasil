import { useEffect } from 'react';
import SEO from '../../components/common/SEO';
import {
  Dices,
  Trophy,
  PencilLine,
  Users,
  ArrowRight,
  Grid3X3,
  Sparkles,
  Wand2,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CARD_GRADS = [
  'from-pink-500/[0.12] via-fuchsia-500/[0.06] to-transparent',
  'from-red-500/[0.12] via-orange-500/[0.08] to-transparent',
  'from-indigo-500/[0.12] via-violet-500/[0.06] to-transparent',
  'from-emerald-500/[0.12] via-teal-500/[0.06] to-transparent',
  'from-amber-500/[0.14] via-orange-400/[0.07] to-transparent',
  'from-orange-500/[0.14] via-rose-500/[0.06] to-transparent',
  'from-sky-500/[0.12] via-blue-500/[0.06] to-transparent',
];

function ToolHubCard({
  title,
  description,
  icon: Icon,
  link,
  badge,
  index,
  accentClass = '',
}) {
  const g = CARD_GRADS[index % CARD_GRADS.length];
  return (
    <Link
      to={link}
      className={`group relative flex h-full animate-fade-up flex-col overflow-hidden rounded-[1.375rem] border border-warm-200/70 bg-white/85 p-[1px] shadow-soft backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-orange-300/60 hover:shadow-warm-glow`}
      style={{ animationDelay: `${Math.min(index, 12) * 55}ms` }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${g} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
      <div className="relative flex h-full flex-col rounded-[1.3rem] bg-gradient-to-b from-white/95 via-cream-50/60 to-transparent p-6 sm:p-7">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-orange-500/15 to-red-500/20 ring-1 ring-orange-500/25 transition-all duration-500 group-hover:scale-105 group-hover:shadow-soft-md ${accentClass}`}
          >
            <Icon className="h-6 w-6 text-orange-600" aria-hidden />
          </div>
          {badge ? (
            <span className="rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-soft">
              {badge}
            </span>
          ) : null}
        </div>
        <h3 className="font-display mb-2 text-[1.0625rem] font-bold leading-snug tracking-tight text-charcoal-900 transition-colors group-hover:text-orange-700">
          {title}
        </h3>
        <p className="mb-6 grow text-sm leading-relaxed text-warm-600">{description}</p>
        <div className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-orange-700">
          <span>Araca git</span>
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1.5"
            aria-hidden
          />
        </div>
      </div>
    </Link>
  );
}

export default function ToolsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tools = [
    {
      title: '101 Okey Yazboz',
      description:
        'Yüzbir oyunu için ceza puanlarını ve bitişleri tek ekrandan yönetin. Hızlı butonlar, el geçmişi ve otomatik toplamlar.',
      icon: Grid3X3,
      link: '/araclar/101-yazboz',
      badge: 'Yeni',
    },
    {
      title: 'Okey Puan Sayacı',
      description:
        'Düşmeli okeyde ceza puanlarını kaybetmeyin. Normal ve okey çift bitiş seçenekleriyle her eli doğru işleyin.',
      icon: Trophy,
      link: '/araclar/okey-sayaci',
      badge: 'Popüler',
    },
    {
      title: 'Batak & King Yazboz',
      description:
        'İhaleli batak veya king gece keyfi için yazboz. Her turu yazın; toplamlar alta düşer, kağıtlı karmaşa bitsin.',
      icon: PencilLine,
      link: '/araclar/batak-yazboz',
    },
    {
      title: 'Takım Oluşturucu',
      description:
        'İsimleri satır satır yazın — takımlar adil şekilde rastgele dağılsın. Oyun gecesi tartışması yok.',
      icon: Users,
      link: '/araclar/takim-olusturucu',
    },
    {
      title: 'Halısaha Takım Oluşturucu',
      description:
        '5v5, 6v6 veya 7v7. Forma renkleriyle sahada iki takım — gerçek saha hissini grafik olarak görün.',
      icon: Users,
      link: '/araclar/halisaha-takim-olusturucu',
    },
    {
      title: 'Zar At',
      description:
        'Çift zar, tek zar, animasyonlu atışlar ve otomatik özet geçmiş. Kayıp zar günleri bitti.',
      icon: Dices,
      link: '/araclar/zar-at',
    },
    {
      title: 'Basit Skor Tablosu',
      description:
        'Her oyuna uyumlu nötr tablo; isimleri özgürce düzenleyin, sıralama hep güncellensin.',
      icon: Trophy,
      link: '/araclar/skor-tablosu',
    },
  ];

  const featured = tools[0];
  const FeaturedIcon = featured.icon;
  const rest = tools.slice(1);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-cream-100 font-sans">
      <SEO
        title="Oyun Araçları — Okey, Batak, Zar ve Takım"
        description="Kuralı Ne? araç koleksiyonu: Okey yazboz, zar atma, batak king tablosu, takım oluşturucular ve daha fazlası."
        url="/araclar"
      />

      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[15%] -top-[35%] h-[70vmin] w-[70vmin] rounded-full bg-gradient-to-br from-orange-400/30 to-transparent blur-3xl" />
        <div className="absolute -bottom-[20%] -right-[15%] h-[60vmin] w-[60vmin] rounded-full bg-gradient-to-tl from-rose-400/25 via-amber-300/15 to-transparent blur-3xl" />
        <div className="absolute left-[20%] top-[40%] h-px w-32 rotate-[-28deg] bg-gradient-to-r from-transparent via-orange-400/40 to-transparent" />
        <div className="absolute right-[15%] top-[65%] h-px w-24 rotate-[18deg] bg-gradient-to-r from-transparent via-accent-400/35 to-transparent" />
      </div>

      {/* Hero */}
      <header className="relative z-[1] border-b border-warm-200/50 bg-gradient-to-b from-white/85 via-cream-50/50 to-transparent px-4 pb-16 pt-10 backdrop-blur-md sm:pb-20 sm:pt-14 md:pt-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mx-auto mb-10 max-w-3xl animate-fade-in text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-orange-900">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Oyun araç koleksiyonu
              <span className="rounded-full bg-charcoal-900 px-2 py-0.5 text-[10px] font-bold tracking-wide text-cream-50">
                {tools.length} araç
              </span>
            </span>
            <h1 className="font-display mt-6 text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[1.08] tracking-tight text-charcoal-900">
              Masanın dijital yarısı
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-warm-600 sm:text-lg">
              Zar, yazboz, skor tablosu ve takım kurulumu tek bir sıcak, hızlı arayüzde. Mobil uyumlu, ücretsiz, kayıtsız kullanılabilir.
            </p>
            <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold uppercase tracking-widest text-warm-400">
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" /> Anında yükleme
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-warm-300 sm:inline" />
              <span className="flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-orange-500" aria-hidden /> Sıcağa yakışan tasarım
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-warm-300 md:inline" />
              <span>Manrope tipografi</span>
            </div>
          </div>

          {/* Featured (bento) */}
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
            <Link
              to={featured.link}
              className="group relative overflow-hidden rounded-[1.625rem] border border-orange-400/35 bg-gradient-to-br from-orange-500 via-orange-600 to-red-700 p-[1px] shadow-warm-glow lg:col-span-7 animate-fade-up"
              style={{ animationDelay: '40ms' }}
            >
              <div className="relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-[1.575rem] bg-gradient-to-br from-charcoal-900/92 via-orange-950/90 to-orange-950/95 p-7 text-white sm:min-h-[280px] sm:p-10">
                <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-orange-500/30 blur-[80px]" />
                <div className="absolute -bottom-28 -right-12 h-56 w-72 rounded-full bg-red-600/35 blur-[70px]" />
                <div className="relative flex flex-wrap items-start justify-between gap-4">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15 ring-2 ring-white/25 backdrop-blur-sm">
                    <FeaturedIcon className="h-7 w-7" aria-hidden />
                  </div>
                  {featured.badge ? (
                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-700 shadow-soft">
                      {featured.badge}
                    </span>
                  ) : null}
                </div>
                <div className="relative mt-10 max-w-lg">
                  <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-orange-100/85">
                    Öne çıkan
                  </p>
                  <h2 className="font-display mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">
                    {featured.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-orange-50/85 sm:text-base">
                    {featured.description}
                  </p>
                </div>
                <span className="relative mt-8 inline-flex items-center gap-2 text-sm font-bold text-white transition-transform group-hover:translate-x-1">
                  Şimdi aç
                  <ArrowRight size={18} aria-hidden />
                </span>
              </div>
            </Link>

            <div className="flex animate-fade-up flex-col justify-between rounded-[1.625rem] border border-warm-200/70 bg-white/85 p-[1px] shadow-soft-xl backdrop-blur-md lg:col-span-5 [animation-delay:120ms]">
              <div className="rounded-[1.575rem] bg-gradient-to-b from-white to-cream-100/70 p-7 sm:p-8">
                <h3 className="font-display text-lg font-bold text-charcoal-900">Neden Kuralı Ne? araçları?</h3>
                <ul className="mt-6 space-y-5 text-sm text-warm-600">
                  <li className="flex gap-3">
                    <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-orange-500/15 text-orange-700">
                      1
                    </span>
                    <span>Gerçek oyun kurallarına göre yazılmış, Türk oyuncuya göre süslendi.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-orange-500/15 text-orange-700">
                      2
                    </span>
                    <span>Telefonda masaüstünde kusursuz: büyük dokunma hedefleri ve net yazılar.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-orange-500/15 text-orange-700">
                      3
                    </span>
                    <span>Şık bildirimler ve animasyonlar; performans dostu kod.</span>
                  </li>
                </ul>
                <Link
                  to="/iletisim"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-orange-700 underline-offset-4 hover:text-orange-800 hover:underline"
                >
                  Yeni araç fikrin var mı? Yaz.
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Grid */}
      <main className="relative z-[1] flex-1 px-4 pb-16 pt-4 sm:pb-20 md:pb-24">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-10 flex animate-fade-in flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-charcoal-900 sm:text-3xl">
                Tüm araçlar
              </h2>
              <p className="mt-1 text-sm text-warm-600">Birinden diğerine geçiş anında.</p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {rest.map((tool, idx) => (
              <ToolHubCard key={tool.link} {...tool} index={idx + 1} />
            ))}
            <div
              className="flex animate-fade-up flex-col items-center justify-center rounded-[1.375rem] border-2 border-dashed border-warm-300/80 bg-white/60 p-8 text-center transition-colors hover:border-orange-400/50 hover:bg-orange-50/30"
              style={{ animationDelay: `${400}ms` }}
            >
              <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-warm-100 to-orange-50 ring-2 ring-orange-400/25">
                <Sparkles className="h-7 w-7 text-orange-600" aria-hidden />
              </div>
              <p className="font-display font-bold text-charcoal-800">Çok yakında daha fazlası</p>
              <p className="mt-2 max-w-[14rem] text-xs leading-relaxed text-warm-500">
                Hakem sayacı, süreölçer, turnuva tablosu… İstediğin aracı söyle, sıraya alalım.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
