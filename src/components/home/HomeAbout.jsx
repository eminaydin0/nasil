import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { SITE_CONFIG } from '../../constants/seo';
import { useSiteStats, floorStat } from '../../hooks/useSiteStats';

const FALLBACK = {
  title: 'Kültürel Mirasımız',
  subtitle: 'Geleneksel oyunlarımızı yaşatıyoruz',
  content:
    'Geleneksel Türk oyunları, yüzyıllardır nesilden nesile aktarılan kültürel mirasımızın önemli bir parçasıdır.\n\nTeknolojinin hızla geliştiği günümüzde, bu geleneksel oyunları dijital ortamda belgeleyerek gelecek nesillere aktarmak ve yaşatmak istiyoruz.',
};

function formatPlus(n) {
  const value = floorStat(n);
  if (value >= 5) return `${value.toLocaleString('tr-TR')}+`;
  return value > 0 ? String(value) : '—';
}

function HomeAbout() {
  const { stats } = useSiteStats();
  const [copy, setCopy] = useState(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('title, subtitle, content')
          .eq('section_key', 'cultural_heritage')
          .single();
        if (cancelled || error || !data) return;
        setCopy({
          title: data.title || FALLBACK.title,
          subtitle: data.subtitle || FALLBACK.subtitle,
          content: data.content || FALLBACK.content,
        });
      } catch {
        /* varsayılan metin kalır */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const paragraphs = copy.content.split('\n').map((line) => line.trim()).filter(Boolean).slice(0, 4);
  const statsRow = [
    { value: formatPlus(stats.games), label: 'Oyun rehberi' },
    { value: formatPlus(stats.reads), label: 'Okuma' },
    { value: formatPlus(stats.categories), label: 'Kategori' },
    { value: formatPlus(stats.comments), label: 'Topluluk yorumu' },
  ];

  return (
    <section className="home-block" aria-labelledby="home-letter-title">
      <div className="home-block-head">
        <div>
          <p className="home-kicker">{copy.title}</p>
          <h2 id="home-letter-title">{copy.subtitle}</h2>
        </div>
        <Link to="/hakkimizda" className="home-text-link">
          Hakkımızda
          <ArrowUpRight size={15} aria-hidden />
        </Link>
      </div>

      <div className="home-letter">
        <div className="home-letter-copy">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="home-letter-by">
            {SITE_CONFIG.name}, {SITE_CONFIG.creator.name} tarafından geliştirildi ve {SITE_CONFIG.company} tarafından yayınlanır. {SITE_CONFIG.creator.tagline}
          </p>
          <Link to="/iletisim" className="home-text-link">
            Bize ulaşın
            <ArrowUpRight size={15} aria-hidden />
          </Link>
        </div>

        <div className="home-letter-notes">
          <article>
            <h3>Misyonumuz</h3>
            <p>
              Geleneksel Türk oyunlarını ve sevilen kutu, kart oyunlarını doğru kurallarla dijitalde topluyoruz. Rehber sade Türkçe ve her zaman ücretsiz.
            </p>
          </article>
          <article>
            <h3>Vizyonumuz</h3>
            <p>
              Sokaktan salona kadar her oyunu anlaşılır kılavuzlar ve pratik araçlarla güçlendirmek. Tartışılan masada son söz net bilgiye kalsın.
            </p>
          </article>
        </div>
      </div>

      <dl className="home-letter-stats">
        {statsRow.map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default HomeAbout;
