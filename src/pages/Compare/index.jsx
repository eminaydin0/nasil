import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Users,
  Tag,
  ListChecks,
  Lightbulb,
  Star,
  Trophy,
  Sparkles,
} from 'lucide-react';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import DifficultyBadge from '../../components/game/DifficultyBadge';
import PlayTimeBadge from '../../components/game/PlayTimeBadge';
import { supabase } from '../../lib/supabase';
import { trackPageView } from '../../utils/analytics';
import {
  buildComparisonSeoMeta,
  buildComparisonStructuredData,
} from '../../lib/seoEngine';

const DIFFICULTY_RANK = { Kolay: 1, Orta: 2, Zor: 3 };

function parsePlayerCount(playersText) {
  if (!playersText) return 0;
  const match = String(playersText).match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

function mapGame(row, ratingSummary = { count: 0, average: 0 }) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    players: row.players,
    difficulty: row.difficulty,
    image: row.image,
    shortDescription: row.short_description,
    description: row.description,
    rules: Array.isArray(row.rules) ? row.rules : [],
    tips: Array.isArray(row.tips) ? row.tips : [],
    playTimeMinutes: row.play_time_minutes || null,
    ratingCount: ratingSummary.count,
    ratingAverage: ratingSummary.average,
  };
}

function ParseSlugs(comparison) {
  if (!comparison || !comparison.includes('-vs-')) return null;
  const [slugA, slugB] = comparison.split('-vs-');
  if (!slugA || !slugB) return null;
  return { slugA, slugB };
}

function ComparisonCell({ valueA, valueB, betterIndex }) {
  const a = `flex-1 p-4 ${betterIndex === 0 ? 'bg-green-50' : ''}`;
  const b = `flex-1 p-4 ${betterIndex === 1 ? 'bg-green-50' : ''}`;
  return (
    <div className="flex items-stretch border-b border-warm-100 last:border-b-0">
      <div className={a}>{valueA}</div>
      <div className="w-px bg-warm-100" />
      <div className={b}>{valueB}</div>
    </div>
  );
}

function ComparisonRow({ label, icon, valueA, valueB, betterIndex }) {
  return (
    <div className="bg-white">
      <div className="px-4 pt-4 pb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-warm-500 border-b border-warm-100">
        {icon}
        <span>{label}</span>
      </div>
      <ComparisonCell valueA={valueA} valueB={valueB} betterIndex={betterIndex} />
    </div>
  );
}

function GameHeaderCard({ game }) {
  return (
    <Link
      to={`/oyun/${game.slug}`}
      className="block group bg-white rounded-2xl overflow-hidden border border-warm-100 shadow-sm hover:shadow-lg transition-shadow"
    >
      <div className="aspect-[16/9] bg-warm-100 overflow-hidden">
        <img
          src={game.image}
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
          width="640"
          height="360"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop';
          }}
        />
      </div>
      <div className="p-5">
        <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">{game.category}</span>
        <h2 className="text-xl font-bold text-warm-900 mt-1 mb-2 group-hover:text-orange-600 transition-colors">
          {game.name}
        </h2>
        <p className="text-sm text-warm-600 line-clamp-2">{game.shortDescription}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-orange-600">
          Detay sayfasını gör <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}

export default function ComparePage() {
  const { comparison } = useParams();
  const navigate = useNavigate();
  const slugs = useMemo(() => ParseSlugs(comparison), [comparison]);

  const [gameA, setGameA] = useState(null);
  const [gameB, setGameB] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slugs) {
      setError('Geçersiz karşılaştırma URL\'si');
      setLoading(false);
      return;
    }
    loadGames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comparison]);

  useEffect(() => {
    if (gameA && gameB) {
      trackPageView(`/karsilastir/${gameA.slug}-vs-${gameB.slug}`);
    }
  }, [gameA, gameB]);

  const loadGames = async () => {
    setLoading(true);
    setError(null);
    try {
      const [resA, resB, ratingsRes] = await Promise.all([
        supabase
          .from('games')
          .select('id, slug, name, category, players, difficulty, image, short_description, description, rules, tips, play_time_minutes')
          .eq('slug', slugs.slugA)
          .maybeSingle(),
        supabase
          .from('games')
          .select('id, slug, name, category, players, difficulty, image, short_description, description, rules, tips, play_time_minutes')
          .eq('slug', slugs.slugB)
          .maybeSingle(),
        supabase
          .from('game_ratings')
          .select('game_id, rating'),
      ]);

      if (resA.error || !resA.data) throw new Error(`Oyun bulunamadı: ${slugs.slugA}`);
      if (resB.error || !resB.data) throw new Error(`Oyun bulunamadı: ${slugs.slugB}`);

      const ratings = ratingsRes.data || [];
      const summarize = (id) => {
        const list = ratings.filter((r) => r.game_id === id);
        if (list.length === 0) return { count: 0, average: 0 };
        return {
          count: list.length,
          average: list.reduce((sum, r) => sum + (r.rating || 0), 0) / list.length,
        };
      };

      setGameA(mapGame(resA.data, summarize(resA.data.id)));
      setGameB(mapGame(resB.data, summarize(resB.data.id)));
    } catch (err) {
      console.error('Compare loading error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbs = useMemo(() => {
    if (!gameA || !gameB) return [];
    return [
      { name: 'Tüm Oyunlar', url: '/oyunlar' },
      { name: 'Karşılaştırma', url: '/oyunlar' },
      { name: `${gameA.name} vs ${gameB.name}`, url: null },
    ];
  }, [gameA, gameB]);

  const structuredData = useMemo(() => {
    if (!gameA || !gameB) return null;
    return buildComparisonStructuredData(gameA, gameB);
  }, [gameA, gameB]);

  const seoMeta = useMemo(() => {
    if (!gameA || !gameB) return {};
    return buildComparisonSeoMeta(gameA, gameB);
  }, [gameA, gameB]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-warm-600">Karşılaştırma yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !gameA || !gameB) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-white rounded-2xl p-8 border border-warm-100 shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <Sparkles className="text-red-500" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-warm-900 mb-2">Karşılaştırma yapılamadı</h1>
          <p className="text-warm-600 mb-6">{error || 'Oyunlardan biri bulunamadı.'}</p>
          <button
            onClick={() => navigate('/oyunlar')}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Tüm Oyunlara Dön
          </button>
        </div>
      </div>
    );
  }

  // Karsilastirma metrikleri
  const playersA = parsePlayerCount(gameA.players);
  const playersB = parsePlayerCount(gameB.players);
  const difficultyA = DIFFICULTY_RANK[gameA.difficulty] || 0;
  const difficultyB = DIFFICULTY_RANK[gameB.difficulty] || 0;
  const rulesCountA = gameA.rules.length;
  const rulesCountB = gameB.rules.length;
  const tipsCountA = gameA.tips.length;
  const tipsCountB = gameB.tips.length;
  const ratingA = gameA.ratingAverage || 0;
  const ratingB = gameB.ratingAverage || 0;

  // "Hangisi daha basit/popüler" mantigi
  const simplerIndex = difficultyA === difficultyB
    ? (rulesCountA < rulesCountB ? 0 : rulesCountB < rulesCountA ? 1 : -1)
    : (difficultyA < difficultyB ? 0 : 1);
  const popularIndex = ratingA === ratingB ? -1 : (ratingA > ratingB ? 0 : 1);
  const moreContentIndex = (rulesCountA + tipsCountA) === (rulesCountB + tipsCountB)
    ? -1
    : ((rulesCountA + tipsCountA) > (rulesCountB + tipsCountB) ? 0 : 1);

  const verdictA = simplerIndex === 0 ? 'Daha hızlı öğrenilir' : popularIndex === 0 ? 'Daha çok beğeniliyor' : moreContentIndex === 0 ? 'Daha derin içerik' : 'Klasik bir alternatif';
  const verdictB = simplerIndex === 1 ? 'Daha hızlı öğrenilir' : popularIndex === 1 ? 'Daha çok beğeniliyor' : moreContentIndex === 1 ? 'Daha derin içerik' : 'Klasik bir alternatif';

  return (
    <div className="min-h-screen bg-cream-50">
      <SEO
        title={seoMeta.title}
        description={seoMeta.description}
        keywords={seoMeta.keywords}
        url={seoMeta.url}
        type="website"
        image={seoMeta.image}
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        <header className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold border border-orange-200">
            <Trophy size={14} />
            Karşılaştırma
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-warm-900 mt-3 tracking-tight">
            {gameA.name} <span className="text-orange-500">vs</span> {gameB.name}
          </h1>
          <p className="text-warm-600 mt-2 max-w-2xl mx-auto">
            İki oyunun kuralları, oyuncu sayısı, zorluk seviyesi ve süresi yan yana. Sana hangisi daha uygun?
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <GameHeaderCard game={gameA} />
          <GameHeaderCard game={gameB} />
        </div>

        <div className="bg-white border border-warm-100 rounded-2xl overflow-hidden shadow-sm divide-y divide-warm-100 mb-6">
          <ComparisonRow
            label="Kategori"
            icon={<Tag size={14} />}
            valueA={<span className="font-semibold text-warm-900">{gameA.category}</span>}
            valueB={<span className="font-semibold text-warm-900">{gameB.category}</span>}
            betterIndex={-1}
          />
          <ComparisonRow
            label="Oyuncu sayısı"
            icon={<Users size={14} />}
            valueA={<span className="font-semibold text-warm-900">{gameA.players}</span>}
            valueB={<span className="font-semibold text-warm-900">{gameB.players}</span>}
            betterIndex={playersA === playersB ? -1 : (playersA > playersB ? 0 : 1)}
          />
          <ComparisonRow
            label="Zorluk"
            icon={<Sparkles size={14} />}
            valueA={<DifficultyBadge difficulty={gameA.difficulty} />}
            valueB={<DifficultyBadge difficulty={gameB.difficulty} />}
            betterIndex={simplerIndex}
          />
          <ComparisonRow
            label="Oyun süresi"
            icon={<Sparkles size={14} />}
            valueA={gameA.playTimeMinutes ? <PlayTimeBadge minutes={gameA.playTimeMinutes} /> : <span className="text-warm-400 text-sm">—</span>}
            valueB={gameB.playTimeMinutes ? <PlayTimeBadge minutes={gameB.playTimeMinutes} /> : <span className="text-warm-400 text-sm">—</span>}
            betterIndex={
              !gameA.playTimeMinutes || !gameB.playTimeMinutes
                ? -1
                : gameA.playTimeMinutes < gameB.playTimeMinutes ? 0 : gameB.playTimeMinutes < gameA.playTimeMinutes ? 1 : -1
            }
          />
          <ComparisonRow
            label="Kural sayısı"
            icon={<ListChecks size={14} />}
            valueA={<span className="font-semibold text-warm-900">{rulesCountA} kural</span>}
            valueB={<span className="font-semibold text-warm-900">{rulesCountB} kural</span>}
            betterIndex={rulesCountA === rulesCountB ? -1 : (rulesCountA < rulesCountB ? 0 : 1)}
          />
          <ComparisonRow
            label="İpucu sayısı"
            icon={<Lightbulb size={14} />}
            valueA={<span className="font-semibold text-warm-900">{tipsCountA} ipucu</span>}
            valueB={<span className="font-semibold text-warm-900">{tipsCountB} ipucu</span>}
            betterIndex={tipsCountA === tipsCountB ? -1 : (tipsCountA > tipsCountB ? 0 : 1)}
          />
          <ComparisonRow
            label="Topluluk puanı"
            icon={<Star size={14} />}
            valueA={
              gameA.ratingCount > 0 ? (
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-400 fill-yellow-400" size={18} />
                  <span className="font-bold text-warm-900">{ratingA.toFixed(1)}</span>
                  <span className="text-xs text-warm-500">({gameA.ratingCount} oy)</span>
                </div>
              ) : (
                <span className="text-warm-400 text-sm">Henüz oy yok</span>
              )
            }
            valueB={
              gameB.ratingCount > 0 ? (
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-400 fill-yellow-400" size={18} />
                  <span className="font-bold text-warm-900">{ratingB.toFixed(1)}</span>
                  <span className="text-xs text-warm-500">({gameB.ratingCount} oy)</span>
                </div>
              ) : (
                <span className="text-warm-400 text-sm">Henüz oy yok</span>
              )
            }
            betterIndex={popularIndex}
          />
        </div>

        <section
          aria-labelledby="kararim-baslik"
          className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6 mb-6"
        >
          <h2 id="kararim-baslik" className="text-xl font-bold text-warm-900 mb-4 flex items-center gap-2">
            <Trophy className="text-orange-500" size={22} />
            Hangisi sana göre?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 border border-warm-100">
              <h3 className="text-base font-bold text-warm-900 mb-1">{gameA.name}</h3>
              <p className="text-sm text-warm-600 mb-3">{verdictA}.</p>
              <Link
                to={`/oyun/${gameA.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700"
              >
                Kuralları öğren <ArrowRight size={14} />
              </Link>
            </div>
            <div className="bg-white rounded-xl p-4 border border-warm-100">
              <h3 className="text-base font-bold text-warm-900 mb-1">{gameB.name}</h3>
              <p className="text-sm text-warm-600 mb-3">{verdictB}.</p>
              <Link
                to={`/oyun/${gameB.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700"
              >
                Kuralları öğren <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        <section className="text-center">
          <p className="text-sm text-warm-500">
            Başka bir karşılaştırma denemek ister misin? <Link to="/oyunlar" className="text-orange-600 font-semibold hover:underline">Tüm oyunlara göz at →</Link>
          </p>
          <p className="text-xs text-warm-400 mt-2">
            <a
              href={`${SITE_CONFIG.url}/karsilastir/${gameA.slug}-vs-${gameB.slug}`}
              className="hover:underline"
            >
              Bu sayfayı paylaş
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
