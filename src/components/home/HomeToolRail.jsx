import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { SITE_TOOLS } from '../../constants/tools';

function HomeToolRail() {
  const tools = SITE_TOOLS;

  return (
    <section className="home-block" aria-labelledby="home-tools-title">
      <div className="home-block-head">
        <div>
          <p className="home-kicker">Popüler oyun araçları</p>
          <h2 id="home-tools-title">Oyununu kolaylaştıran araçlar</h2>
        </div>
        <Link to="/araclar" className="home-text-link">
          Tüm araçlar
          <ArrowUpRight size={15} aria-hidden />
        </Link>
      </div>
      <div className="home-tools home-scroll-row">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.id} to={tool.link} className="home-tool-pill home-scroll-item">
              <span className="home-tool-pill-icon" aria-hidden>
                <Icon size={18} />
              </span>
              <span>{tool.title}</span>
              <ChevronRight size={16} aria-hidden />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default HomeToolRail;
