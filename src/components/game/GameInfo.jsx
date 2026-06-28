import { Users, MapPin, Printer, Download, HardDrive, Monitor } from 'lucide-react';
import DifficultyBadge from './DifficultyBadge';
import PlayTimeBadge from './PlayTimeBadge';
import { Button } from '../ui';
import { SITE_CONFIG } from '../../constants/seo';
import {
  isDigitalGameCategory,
  normalizeDigitalInfo,
  getActiveDownloads,
} from '../../constants/digitalGames';

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
  const isDigital = isDigitalGameCategory(game.category);
  const rulesHeading = isDigital ? 'Nasıl Oynanır' : 'Oyun Kuralları';
  const rulesHtml = rules.map((rule) => `<li style="margin-bottom: 0.75rem; line-height: 1.5;">${escapeHtml(rule)}</li>`).join('');
  const tipsHtml = tips.map((tip) => `<li style="margin-bottom: 0.5rem;">${escapeHtml(tip)}</li>`).join('');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(game.name)} - ${escapeHtml(rulesHeading)}</title>
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
  ${rules.length ? `<h2>${escapeHtml(rulesHeading)}</h2><ol>${rulesHtml}</ol>` : ''}
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
  const isDigital = isDigitalGameCategory(game?.category);
  const digital = isDigital ? normalizeDigitalInfo(game.digitalInfo) : null;
  const downloads = digital ? getActiveDownloads(digital) : [];

  return (
    <div className="mb-6 rounded-2xl border border-warm-200/70 bg-white p-4 shadow-soft sm:p-5 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-warm-200/60 bg-cream-100 shadow-soft">
            <Users className="text-warm-700" size={20} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-warm-500">
              {isDigital ? 'Oyuncu sayısı / mod' : 'Oyuncu'}
            </p>
            <p className="text-sm font-bold tracking-tight text-warm-900">{game.players}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-warm-200/60 bg-cream-100 shadow-soft">
            <MapPin className="text-warm-700" size={20} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-warm-500">Kategori</p>
            <p className="text-sm font-bold tracking-tight text-warm-900">{game.category}</p>
          </div>
        </div>

        {digital?.fileSize?.trim() && (
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-warm-200/60 bg-cream-100 shadow-soft">
              <HardDrive className="text-orange-600" size={20} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-warm-500">Dosya boyutu</p>
              <p className="text-sm font-bold tracking-tight text-warm-900">{digital.fileSize}</p>
            </div>
          </div>
        )}

        {digital?.platforms?.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-warm-200/60 bg-cream-100 shadow-soft">
              <Monitor className="text-cyan-600" size={20} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-warm-500">Platform</p>
              <p className="text-sm font-bold tracking-tight text-warm-900">{digital.platforms.join(', ')}</p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <DifficultyBadge difficulty={game.difficulty} />
          <PlayTimeBadge minutes={game.playTimeMinutes} />
        </div>

        <div className="flex w-full flex-col gap-2 sm:ml-auto sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
          {downloads.map((item) => (
            <a
              key={`${item.label}-${item.url}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100 sm:w-auto"
            >
              <Download size={16} aria-hidden />
              {item.label || 'İndir'}
            </a>
          ))}
          <Button
            variant="secondary"
            size="md"
            iconLeft={Printer}
            onClick={() => printGameRules(game)}
            className="w-full sm:w-auto"
          >
            {isDigital ? 'Rehberi Yazdır' : 'Kuralları Yazdır'}
          </Button>
        </div>
      </div>
    </div>
  );
}
