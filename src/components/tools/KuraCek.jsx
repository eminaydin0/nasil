import { useCallback, useMemo, useRef, useState } from 'react';
import { Gift, Shuffle, Sparkles, Trash2, Users } from 'lucide-react';
import { tool } from './toolStyles';

const DEFAULT_NAMES = ['Ali', 'Ayşe', 'Mehmet', 'Zeynep', 'Can', 'Elif'];

function parseNames(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 50);
}

export default function KuraCek() {
  const [rawText, setRawText] = useState(DEFAULT_NAMES.join('\n'));
  const [displayName, setDisplayName] = useState('');
  const [winner, setWinner] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const timerRef = useRef(null);

  const names = useMemo(() => parseNames(rawText), [rawText]);

  const draw = useCallback(() => {
    if (names.length < 2 || drawing) return;

    const winnerIndex = Math.floor(Math.random() * names.length);
    const winnerName = names[winnerIndex];

    setDrawing(true);
    setWinner(null);

    let tick = 0;
    const totalTicks = 28 + Math.floor(Math.random() * 12);
    let delay = 40;

    const runTick = () => {
      const randomIndex = Math.floor(Math.random() * names.length);
      setDisplayName(names[randomIndex]);
      tick += 1;

      if (tick >= totalTicks) {
        setDisplayName(winnerName);
        setWinner(winnerName);
        setDrawing(false);
        return;
      }

      delay = Math.min(220, delay + 8);
      timerRef.current = window.setTimeout(runTick, delay);
    };

    runTick();
  }, [names, drawing]);

  return (
    <div className="relative min-w-0 overflow-x-clip p-4 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:items-start">
        <div className="flex flex-col items-center">
          <div className={`kura-drum ${drawing ? 'kura-drum--active' : ''}`}>
            <div className="kura-drum-glow" aria-hidden />
            <div className="kura-drum-inner">
              <Gift size={28} className="kura-drum-icon" aria-hidden />
              <p className="kura-drum-label">{drawing ? 'Kura dönüyor…' : 'Kazanan'}</p>
              <p className={`kura-drum-name ${drawing ? 'kura-drum-name--shuffle' : ''}`}>
                {displayName || winner || '—'}
              </p>
            </div>
            <div className="kura-drum-orbit" aria-hidden>
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="kura-drum-ball" style={{ '--i': i }} />
              ))}
            </div>
          </div>

          {winner && !drawing && (
            <div className="wheel-result mt-6">
              <Sparkles size={16} aria-hidden />
              <span>
                Tebrikler: <strong>{winner}</strong>
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={draw}
            disabled={names.length < 2 || drawing}
            className={`${tool.primaryBtn} mt-6 max-w-xs`}
          >
            <Shuffle size={18} className={drawing ? 'animate-pulse' : ''} aria-hidden />
            {drawing ? 'Çekiliyor…' : 'Kura çek'}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="kura-names" className={tool.label}>
              İsimler (satır başına bir tane, en fazla 50)
            </label>
            <textarea
              id="kura-names"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className={tool.textarea}
              placeholder={'Ali\nAyşe\nMehmet'}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              if (timerRef.current) window.clearTimeout(timerRef.current);
              setRawText(DEFAULT_NAMES.join('\n'));
              setDisplayName('');
              setWinner(null);
              setDrawing(false);
            }}
            className={tool.secondaryBtn}
          >
            <Trash2 size={16} aria-hidden />
            Sıfırla
          </button>

          {names.length > 0 && (
            <div className="kura-name-chips">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-warm-500">
                <Users size={12} aria-hidden />
                {names.length} katılımcı
              </p>
              <div className="flex flex-wrap gap-2">
                {names.map((name) => (
                  <span
                    key={name}
                    className={`kura-chip ${winner === name ? 'kura-chip--winner' : ''}`}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
