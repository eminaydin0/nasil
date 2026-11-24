import { Link } from 'react-router-dom';
import { ArrowRight, Gamepad2, LayoutGrid } from 'lucide-react';
import { categoryPath } from '../../utils/categorySlug';

const VISIBLE = 8;

function Tile({ to, icon: Icon, label, hint, accent = false }) {
  return (
    <Link to={to} className={`home-cat${accent ? ' home-cat--accent' : ''}`}>
      <span className="home-cat-icon" aria-hidden>
        {Icon ? <Icon size={22} strokeWidth={1.75} /> : null}
      </span>
      <span className="home-cat-copy">
        <strong>{label}</strong>
        {hint ? <em>{hint}</em> : null}
      </span>
    </Link>
  );
}

function HomeCategoryRail({ categories = [], loading = false }) {
  const visible = categories.slice(0, VISIBLE);
  const hidden = categories.length - visible.length;
  const total = categories.reduce((sum, category) => sum + (category.count || 0), 0);

  return (
    <section className="home-block" aria-labelledby="home-cats-title">
      <div className="home-block-head">
        <div>
          <p className="home-kicker">Oyun kategorileri</p>
          <h2 id="home-cats-title">Hangi oyunu oynamak istersin?</h2>
        </div>
        <Link to="/oyunlar" className="home-text-link">
          Tüm Kategoriler
          <ArrowRight size={15} aria-hidden />
        </Link>
      </div>

      <div className="home-cats">
        <Tile
          to="/oyunlar"
          icon={Gamepad2}
          label="Tüm Oyunlar"
          hint={total > 0 ? `${total} Oyun` : 'Hepsini keşfet'}
          accent
        />
        {loading && categories.length === 0
          ? [1, 2, 3, 4, 5, 6, 7, 8].map((n) => <div key={n} className="home-cat home-skeleton" aria-hidden />)
          : visible.map((category) => (
              <Tile
                key={category.name}
                to={categoryPath(category.name)}
                icon={category.icon}
                label={category.name}
                hint={typeof category.count === 'number' ? `${category.count} Oyun` : null}
              />
            ))}
        {!loading && (
          <Tile
            to="/oyunlar"
            icon={LayoutGrid}
            label="Tüm Kategoriler"
            hint={hidden > 0 ? `+${hidden} kategori` : 'Hepsini gör'}
          />
        )}
      </div>
    </section>
  );
}

export default HomeCategoryRail;
