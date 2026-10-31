import { Link } from 'react-router-dom';
import { ArrowUpRight, LayoutGrid } from 'lucide-react';
import { categoryPath } from '../../utils/categorySlug';

function Tile({ to, icon: Icon, label, hint, accent = false }) {
  return (
    <Link to={to} className={`home-cat${accent ? ' home-cat--accent' : ''}`}>
      <span className="home-cat-icon" aria-hidden>
        {Icon ? <Icon size={18} /> : null}
      </span>
      <span className="home-cat-copy">
        <strong>{label}</strong>
        {hint ? <em>{hint}</em> : null}
      </span>
      <ArrowUpRight size={15} className="home-cat-arrow" aria-hidden />
    </Link>
  );
}

function HomeCategoryRail({ categories = [], loading = false }) {
  return (
    <section className="home-block" aria-labelledby="home-cats-title">
      <div className="home-block-head">
        <div>
          <p className="home-kicker">Oyun kategorileri</p>
          <h2 id="home-cats-title">Hangi oyunu oynamak istersin?</h2>
        </div>
        <Link to="/oyunlar" className="home-text-link">
          Tüm oyunlar
          <ArrowUpRight size={15} aria-hidden />
        </Link>
      </div>

      <div className="home-cats">
        <Tile to="/oyunlar" icon={LayoutGrid} label="Tüm Oyunlar" hint="Hepsini keşfet" accent />
        {loading && categories.length === 0
          ? [1, 2, 3, 4, 5, 6, 7].map((n) => <div key={n} className="home-cat home-skeleton" aria-hidden />)
          : categories.map((category) => (
              <Tile
                key={category.name}
                to={categoryPath(category.name)}
                icon={category.icon}
                label={category.name}
                hint={typeof category.count === 'number' ? `${category.count} oyun` : null}
              />
            ))}
      </div>
    </section>
  );
}

export default HomeCategoryRail;
