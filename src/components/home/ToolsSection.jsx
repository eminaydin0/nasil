import { Link } from 'react-router-dom';
import { ArrowRight, Wrench } from 'lucide-react';
import { SectionHeader } from '../ui';
import { getHomeTools } from '../../constants/tools';

const COLOR_THEMES = {
  orange: {
    bg: 'home-tool-card--orange',
    icon: 'text-orange-600',
    chip: 'bg-orange-500/15 text-orange-700',
  },
  red: {
    bg: 'home-tool-card--red',
    icon: 'text-red-600',
    chip: 'bg-red-500/15 text-red-700',
  },
  amber: {
    bg: 'home-tool-card--amber',
    icon: 'text-amber-600',
    chip: 'bg-amber-500/15 text-amber-800',
  },
  rose: {
    bg: 'home-tool-card--rose',
    icon: 'text-rose-600',
    chip: 'bg-rose-500/15 text-rose-700',
  },
  emerald: {
    bg: 'home-tool-card--emerald',
    icon: 'text-emerald-600',
    chip: 'bg-emerald-500/15 text-emerald-700',
  },
  sky: {
    bg: 'home-tool-card--sky',
    icon: 'text-sky-600',
    chip: 'bg-sky-500/15 text-sky-700',
  },
  violet: {
    bg: 'home-tool-card--violet',
    icon: 'text-violet-600',
    chip: 'bg-violet-500/15 text-violet-700',
  },
  fuchsia: {
    bg: 'home-tool-card--fuchsia',
    icon: 'text-fuchsia-600',
    chip: 'bg-fuchsia-500/15 text-fuchsia-700',
  },
  indigo: {
    bg: 'home-tool-card--indigo',
    icon: 'text-indigo-600',
    chip: 'bg-indigo-500/15 text-indigo-700',
  },
};

function ToolMiniCard({ tool }) {
  const Icon = tool.icon;
  const theme = COLOR_THEMES[tool.color] || COLOR_THEMES.orange;
  const isPopular = tool.badge === 'Popüler';

  return (
    <Link to={tool.link} className={`home-tool-card ${theme.bg}`}>
      <div className="home-tool-card-shine" aria-hidden />

      {tool.badge && (
        <span
          className={`home-tool-card-badge ${isPopular ? 'home-tool-card-badge--popular' : ''}`}
        >
          {tool.badge}
        </span>
      )}

      <div className={`home-tool-card-icon ${theme.icon}`}>
        <Icon size={22} aria-hidden />
      </div>

      <h3 className="home-tool-card-title">{tool.title}</h3>
      <p className="home-tool-card-desc">{tool.description}</p>

      <span className={`home-tool-card-chip ${theme.chip}`}>
        Dene
        <ArrowRight size={14} aria-hidden />
      </span>
    </Link>
  );
}

export default function ToolsSection() {
  const tools = getHomeTools();

  return (
    <section className="home-tools-section relative">
      <SectionHeader
        title="Oyun Araçları"
        subtitle="Ücretsiz & hazır"
        icon={Wrench}
        iconColor="text-orange-600"
        iconBg="bg-orange-50"
        link="/araclar"
        linkText="Tüm Araçlar"
      />

      <div className="home-tools-grid home-tools-grid--home">
        {tools.map((tool) => (
          <ToolMiniCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}
