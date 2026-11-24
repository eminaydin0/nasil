import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { SITE_TOOLS } from '../../constants/tools';

function HomeToolRail() {
  const featured = SITE_TOOLS.find((tool) => tool.featured) || SITE_TOOLS[0];
  const rest = SITE_TOOLS.filter((tool) => tool.id !== featured.id).slice(0, 6);

  return (
    <section className="home-block" aria-labelledby="home-tools-title">
      <div className="home-block-head">
        <div>
          <p className="home-kicker">Masa başı araçlar</p>
          <h2 id="home-tools-title">Oyununu kolaylaştıran araçlar</h2>
        </div>
        <Link to="/araclar" className="home-text-link">
          Tüm araçlar
          <ArrowUpRight size={15} aria-hidden />
        </Link>
      </div>

      <div className="home-tool-board">
        <Link to={featured.link} className="home-tool-feature">
          {featured.photo ? (
            <img
              src={featured.photo}
              alt=""
              className="home-tool-feature-photo"
              width="720"
              height="480"
              loading="lazy"
            />
          ) : null}
          <span className="home-tool-feature-shade" aria-hidden />
          {featured.badge ? <em>{featured.badge}</em> : null}
          <strong>{featured.title}</strong>
          <p>{featured.description}</p>
          <span className="home-tool-feature-go">
            Aracı aç
            <ArrowRight size={16} aria-hidden />
          </span>
        </Link>

        <div className="home-tool-grid">
          {rest.map((tool) => (
            <Link key={tool.id} to={tool.link} className="home-tool-tile">
              {tool.photo ? (
                <span className="home-tool-tile-shot">
                  <img src={tool.photo} alt="" width="160" height="100" loading="lazy" />
                </span>
              ) : null}
              <span className="home-tool-tile-copy">
                <strong>{tool.title}</strong>
                <small>{tool.description}</small>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeToolRail;
