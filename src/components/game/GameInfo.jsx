import { Users, MapPin, Printer } from 'lucide-react';

function printGameRules(game) {
  const rules = game.rules || [];
  const tips = game.tips || [];
  const rulesHtml = rules.map((rule) => `<li style="margin-bottom: 0.75rem; line-height: 1.5;">${rule}</li>`).join('');
  const tipsHtml = tips.map((tip) => `<li style="margin-bottom: 0.5rem;">${tip}</li>`).join('');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${game.name} - Oyun Kuralları</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 600px; margin: 2rem auto; padding: 0 1rem; color: #333; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    .meta { font-size: 0.875rem; color: #666; margin-bottom: 1.5rem; }
    h2 { font-size: 1.125rem; margin-top: 1.5rem; margin-bottom: 0.75rem; }
    ul { padding-left: 1.25rem; margin: 0; }
    p { margin: 0 0 0.5rem; line-height: 1.5; }
  </style>
</head>
<body>
  <h1>${game.name}</h1>
  <p class="meta">${game.category} · ${game.players} · ${game.difficulty || ''}</p>
  <p>${game.description || ''}</p>
  ${rules.length ? `<h2>Oyun Kuralları</h2><ol>${rulesHtml}</ol>` : ''}
  ${tips.length ? `<h2>İpuçları</h2><ul>${tipsHtml}</ul>` : ''}
  <p style="margin-top: 2rem; font-size: 0.75rem; color: #999;">Kaynak: nasiloynanir.com</p>
</body>
</html>`;

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
  }, 250);
}

export default function GameInfo({ game }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Users className="text-gray-700" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Oyuncu Sayısı</p>
            <p className="font-semibold text-gray-900 text-sm">{game.players}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <MapPin className="text-gray-700" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Kategori</p>
            <p className="font-semibold text-gray-900 text-sm">{game.category}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => printGameRules(game)}
          className="ml-auto inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors"
        >
          <Printer size={18} />
          Kuralları Yazdır
        </button>
      </div>
    </div>
  );
}
