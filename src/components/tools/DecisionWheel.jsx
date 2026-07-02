import { useCallback, useMemo, useRef, useState } from 'react';
import { CircleDot, Plus, RotateCw, Sparkles, Trash2 } from 'lucide-react';
import { tool } from './toolStyles';

const WHEEL_COLORS = [
  '#f97316',
  '#ec4899',
  '#8b5cf6',
  '#3b82f6',
  '#10b981',
  '#eab308',
  '#ef4444',
  '#06b6d4',
  '#14b8a6',
  '#a855f7',
  '#f43f5e',
  '#64748b',
];

const DEFAULT_OPTIONS = ['Takım A', 'Takım B', 'Berabere', 'Tekrar oyna'];

function parseOptions(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 12);
}

export default function DecisionWheel() {
  const [rawText, setRawText] = useState(DEFAULT_OPTIONS.join('\n'));
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const rotationRef = useRef(0);

  const options = useMemo(() => parseOptions(rawText), [rawText]);
  const segmentAngle = options.length > 0 ? 360 / options.length : 0;

  const conicGradient = useMemo(() => {
    if (options.length === 0) return 'conic-gradient(#e7e5e4 0deg 360deg)';
    const step = 100 / options.length;
    const stops = options
      .map((_, i) => {
        const color = WHEEL_COLORS[i % WHEEL_COLORS.length];
        return `${color} ${i * step}% ${(i + 1) * step}%`;
      })
      .join(', ');
    return `conic-gradient(from -90deg, ${stops})`;
  }, [options]);

  const spin = useCallback(() => {
    if (options.length < 2 || spinning) return;

    const winnerIndex = Math.floor(Math.random() * options.length);
    const centerAngle = winnerIndex * segmentAngle + segmentAngle / 2;
    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const target = rotationRef.current + extraSpins * 360 + (360 - centerAngle);

    setSpinning(true);
    setWinner(null);
    rotationRef.current = target;
    setRotation(target);

    window.setTimeout(() => {
      setSpinning(false);
      setWinner({ label: options[winnerIndex], index: winnerIndex });
    }, 4200);
  }, [options, segmentAngle, spinning]);

  const addPreset = () => {
    setRawText((prev) => {
      const current = parseOptions(prev);
      if (current.length >= 12) return prev;
      return [...current, `Seçenek ${current.length + 1}`].join('\n');
    });
  };

  return (
    <div className="relative min-w-0 overflow-x-clip p-4 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:items-start">
        <div className="flex flex-col items-center">
          <div className="wheel-stage">
            <div className="wheel-pointer" aria-hidden />
            <div
              className={`wheel-disc ${spinning ? 'wheel-disc--spinning' : ''}`}
              style={{
                background: conicGradient,
                transform: `rotate(${rotation}deg)`,
              }}
              role="img"
              aria-label="Karar çarkı"
            >
              {options.map((label, i) => {
                const angle = i * segmentAngle + segmentAngle / 2;
                return (
                  <span
                    key={`${label}-${i}`}
                    className="wheel-label"
                    style={{ transform: `rotate(${angle}deg) translateY(-105px) rotate(90deg)` }}
                  >
                    {label.length > 14 ? `${label.slice(0, 12)}…` : label}
                  </span>
                );
              })}
            </div>
            <div className="wheel-hub" aria-hidden>
              <CircleDot size={22} className="text-white" />
            </div>
          </div>

          {winner && !spinning && (
            <div className="wheel-result mt-6">
              <Sparkles size={16} aria-hidden />
              <span>
                Sonuç: <strong>{winner.label}</strong>
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={spin}
            disabled={options.length < 2 || spinning}
            className={`${tool.primaryBtn} mt-6 max-w-xs`}
          >
            <RotateCw size={18} className={spinning ? 'animate-spin' : ''} aria-hidden />
            {spinning ? 'Çark dönüyor…' : 'Çarkı çevir'}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="wheel-options" className={tool.label}>
              Seçenekler (satır başına bir tane, en fazla 12)
            </label>
            <textarea
              id="wheel-options"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className={tool.textarea}
              placeholder={'Takım A\nTakım B\nBerabere'}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={addPreset} className={tool.secondaryBtn}>
              <Plus size={16} aria-hidden />
              Seçenek ekle
            </button>
            <button
              type="button"
              onClick={() => setRawText(DEFAULT_OPTIONS.join('\n'))}
              className={tool.secondaryBtn}
            >
              <Trash2 size={16} aria-hidden />
              Sıfırla
            </button>
          </div>

          <p className="text-xs leading-relaxed text-warm-500">
            {options.length} seçenek · Kura, ceza seçimi, kimin başlayacağı gibi kararlar için ideal.
          </p>
        </div>
      </div>
    </div>
  );
}
