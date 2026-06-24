import { Link } from 'react-router-dom';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { getRelatedTools, TOOL_FEATURES } from '../../constants/tools';

const colorMap = {
  orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
  red: { bg: 'bg-red-50', text: 'text-red-600' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  sky: { bg: 'bg-sky-50', text: 'text-sky-600' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
};

function RelatedToolLink({ tool }) {
  const c = colorMap[tool.color] || colorMap.orange;
  const Icon = tool.icon;

  return (
    <Link
      to={tool.link}
      className="group flex items-center gap-3 rounded-xl border border-warm-200/70 bg-cream-50/50 p-3 transition-colors hover:border-orange-200 hover:bg-orange-50/40"
    >
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${c.bg}`}>
        <Icon className={`h-4 w-4 ${c.text}`} aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-warm-900 group-hover:text-orange-700">
          {tool.title}
        </span>
      </span>
      <ArrowRight size={14} className="shrink-0 text-warm-400 transition-transform group-hover:translate-x-0.5 group-hover:text-orange-600" />
    </Link>
  );
}

export function ToolFeaturesCard({ className = '' }) {
  return (
    <div className={`rounded-2xl border border-warm-200/70 bg-white p-5 shadow-soft ${className}`}>
      <div className="mb-3 flex items-center gap-2">
        <Sparkles size={16} className="text-orange-600" aria-hidden />
        <h3 className="text-sm font-bold text-warm-900">Bu araçlar</h3>
      </div>
      <ul className="space-y-2.5">
        {TOOL_FEATURES.map(({ label }) => (
          <li key={label} className="flex items-center gap-2 text-sm text-warm-600">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100">
              <Check size={12} className="text-orange-600" strokeWidth={3} aria-hidden />
            </span>
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RelatedToolsCard({ currentLink, className = '' }) {
  const related = getRelatedTools(currentLink, 5);

  return (
    <div className={`rounded-2xl border border-warm-200/70 bg-white p-5 shadow-soft ${className}`}>
      <h3 className="mb-3 text-sm font-bold text-warm-900">Diğer araçlar</h3>
      <div className="space-y-2">
        {related.map((tool) => (
          <RelatedToolLink key={tool.id} tool={tool} />
        ))}
      </div>
      <Link
        to="/araclar"
        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700"
      >
        Tüm araçları gör
        <ArrowRight size={12} aria-hidden />
      </Link>
    </div>
  );
}

export function RelatedToolsStrip({ currentLink, title = 'Diğer araçlar' }) {
  const related = getRelatedTools(currentLink, 4);

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-lg font-extrabold text-warm-900">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((tool) => (
          <RelatedToolLink key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}
