import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CARD_FALLBACK_IMAGE, handleImageFallback } from '../../constants/media';
import { coverSrc } from '../../lib/coverImage';
import { supabase } from '../../lib/supabase';

function formatVisits(n) {
  const value = Number(n) || 0;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M+`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}K+`;
  return value.toLocaleString('tr-TR');
}

async function loadTopPages() {
  const { data, error } = await supabase
    .from('game_views')
    .select('view_count, game:games(id, slug, name, category, image)')
    .order('view_count', { ascending: false })
    .limit(5);

  if (error) throw error;

  return (data || [])
    .map((row) => {
      const game = row.game;
      if (!game?.slug) return null;
      return {
        id: game.id,
        slug: game.slug,
        name: game.name,
        category: game.category,
        image: game.image,
        views: Number(row.view_count) || 0,
      };
    })
    .filter(Boolean);
}

function HomeTopPages() {
  const [pages, setPages] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let live = true;

    loadTopPages()
      .then((rows) => {
        if (!live) return;
        setPages(rows);
      })
      .catch((err) => {
        console.error('Top pages load failed:', err);
        if (!live) return;
        setPages([]);
      })
      .finally(() => {
        if (live) setReady(true);
      });

    return () => {
      live = false;
    };
  }, []);

  if (ready && pages.length === 0) return null;

  return (
    <section className="home-block" aria-labelledby="home-top-pages-title">
      <div className="home-block-head">
        <div>
          <p className="home-kicker">En çok girilen sayfalar</p>
          <h2 id="home-top-pages-title">Şu an en çok bakılanlar</h2>
        </div>
        <Link to="/oyunlar" className="home-text-link">
          Tüm Oyunlar
          <ArrowRight size={15} aria-hidden />
        </Link>
      </div>

      <div className="home-top-pages">
        {!ready
          ? [1, 2, 3, 4, 5].map((n) => <div key={n} className="home-top-card home-skeleton" aria-hidden />)
          : pages.map((game, index) => (
              <Link key={game.id} to={`/oyun/${game.slug}`} className="home-top-card">
                <span className="home-top-rank" aria-hidden>
                  {index + 1}
                </span>
                <span className="home-top-media">
                  <img
                    src={coverSrc(game, 640) || CARD_FALLBACK_IMAGE}
                    alt=""
                    width="320"
                    height="180"
                    loading="lazy"
                    decoding="async"
                    onError={handleImageFallback}
                  />
                </span>
                <span className="home-top-copy">
                  <strong>{game.name}</strong>
                  <em>
                    <i />
                    {formatVisits(game.views)} görüntülenme
                  </em>
                </span>
              </Link>
            ))}
      </div>
    </section>
  );
}

export default HomeTopPages;
