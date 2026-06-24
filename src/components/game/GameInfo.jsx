import { Users, MapPin, Printer } from 'lucide-react';
import DifficultyBadge from './DifficultyBadge';
import PlayTimeBadge from './PlayTimeBadge';
import { Button } from '../ui';
import { SITE_CONFIG } from '../../constants/seo';

function escapeHtml(value) {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function printGameRules(game) {
  const rules = Array.isArray(game.rules) ? game.rules : [];
  const tips = Array.isArray(game.tips) ? game.tips : [];
  const rulesHtml = rules.map((rule) => `<li style="margin-bottom: 0.75rem; line-height: 1.5;">${escapeHtml(rule)}</li>`).join('');
  const tipsHtml = tips.map((tip) => `<li style="margin-bottom: 0.5rem;">${escapeHtml(tip)}</li>`).join('');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(game.name)} - Oyun Kuralları</title>
  <style>
    body { font-family: 'Manrope', system-ui, sans-serif; max-width: 600px; margin: 2rem auto; padding: 0 1rem; color: #1c1917; }
    h1 { font-size: 1.75rem; margin-bottom: 0.5rem; letter-spacing: -0.02em; }
    .meta { font-size: 0.875rem; color: #78716c; margin-bottom: 1.5rem; }
    h2 { font-size: 1.25rem; margin-top: 1.75rem; margin-bottom: 0.75rem; letter-spacing: -0.015em; }
    ul, ol { padding-left: 1.25rem; margin: 0; }
    li { margin-bottom: 0.5rem; line-height: 1.55; }
    p { margin: 0 0 0.5rem; line-height: 1.55; }
    .footer { margin-top: 2rem; font-size: 0.75rem; color: #a8a29e; }
  </style>
</head>
<body>
  <h1>${escapeHtml(game.name)}</h1>
  <p class="meta">${escapeHtml(game.category)} · ${escapeHtml(game.players)} · ${escapeHtml(game.difficulty || '')}</p>
  <p>${escapeHtml(game.description || '')}</p>
  ${rules.length ? `<h2>Oyun Kuralları</h2><ol>${rulesHtml}</ol>` : ''}
  ${tips.length ? `<h2>İpuçları</h2><ul>${tipsHtml}</ul>` : ''}
  <p class="footer">Kaynak: ${escapeHtml(SITE_CONFIG.url.replace('https://', ''))}</p>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
  }, 250);
}

export default function GameInfo({ game }) {
  return (
    <div className="bg-white rounded-2xl shadow-soft border border-warm-200/70 p-5 md:p-6 mb-6">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-11 h-11 bg-cream-100 border border-warm-200/60 rounded-xl shadow-soft">
            <Users className="text-warm-700" size={20} aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-warm-500 font-semibold">Oyuncu</p>
            <p className="font-bold text-warm-900 text-sm tracking-tight">{game.players}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-11 h-11 bg-cream-100 border border-warm-200/60 rounded-xl shadow-soft">
            <MapPin className="text-warm-700" size={20} aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-warm-500 font-semibold">Kategori</p>
            <p className="font-bold text-warm-900 text-sm tracking-tight">{game.category}</p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <DifficultyBadge difficulty={game.difficulty} />
          <PlayTimeBadge minutes={game.playTimeMinutes} />
        </div>

        <div className="ml-auto">
          <Button
            variant="secondary"
            size="md"
            iconLeft={Printer}
            onClick={() => printGameRules(game)}
          >
            Kuralları Yazdır
          </Button>
        </div>
      </div>
    </div>
  );
}
