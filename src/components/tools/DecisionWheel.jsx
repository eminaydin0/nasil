import { useCallback, useEffect, useRef, useState } from 'react';

const WHEEL_COLORS = ['#e31c79', '#f97316', '#f5c400', '#8fd14f', '#2f6fed', '#6d28d9'];
const MAX_OPTIONS = 12;

function parseOptions(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, MAX_OPTIONS);
}

export default function DecisionWheel() {
  const [options, setOptions] = useState([]);
  const [draft, setDraft] = useState('');
  const [bulk, setBulk] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [dropWinner, setDropWinner] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [cheer, setCheer] = useState(false);
  const rotationRef = useRef(0);
  const dropRef = useRef(false);
  dropRef.current = dropWinner;

  const segmentAngle = options.length > 0 ? 360 / options.length : 0;

  const conicGradient =
    options.length === 0
      ? 'conic-gradient(#292524 0deg 360deg)'
      : `conic-gradient(from 0deg, ${options
          .map((_, i) => {
            const color = WHEEL_COLORS[i % WHEEL_COLORS.length];
            const step = 100 / options.length;
            return `${color} ${i * step}% ${(i + 1) * step}%`;
          })
          .join(', ')})`;

  useEffect(() => {
    if (!cheer) return undefined;
    const id = window.setTimeout(() => setCheer(false), 3400);
    return () => window.clearTimeout(id);
  }, [cheer, winner]);

  const spin = useCallback(() => {
    if (options.length < 2 || spinning) return;

    const winnerIndex = Math.floor(Math.random() * options.length);
    const centerAngle = winnerIndex * segmentAngle + segmentAngle / 2;
    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const align = (360 - (centerAngle % 360)) % 360;
    const delta = (align - (rotationRef.current % 360) + 360) % 360;
    const target = rotationRef.current + extraSpins * 360 + delta;
    const label = options[winnerIndex];

    setSpinning(true);
    setWinner(null);
    setCheer(false);
    rotationRef.current = target;
    setRotation(target);

    window.setTimeout(() => {
      setSpinning(false);
      setWinner({ label, index: winnerIndex });
      setCheer(true);
      if (!dropRef.current) return;
      setOptions((current) => current.filter((_, index) => index !== winnerIndex));
      rotationRef.current = 0;
      setRotation(0);
    }, 4200);
  }, [options, segmentAngle, spinning]);

  const addOption = (event) => {
    event.preventDefault();
    const next = draft.trim();
    if (!next || options.length >= MAX_OPTIONS) return;
    setOptions((current) => [...current, next]);
    setDraft('');
    setWinner(null);
  };

  const removeOption = (index) => {
    setOptions((current) => current.filter((_, i) => i !== index));
    setWinner(null);
  };

  const toggleBulk = () => {
    if (bulk) {
      const parsed = parseOptions(bulkText);
      if (parsed.length > 0) setOptions(parsed);
      setBulk(false);
      setWinner(null);
      return;
    }
    setBulkText(options.join('\n'));
    setBulk(true);
  };

  return (
    <div className="wheel-app">
      {cheer && winner ? (
        <button type="button" className="wheel-cheer" onClick={() => setCheer(false)}>
          <span>Tebrikler</span>
          <strong>{winner.label}</strong>
        </button>
      ) : null}
      <aside className="wheel-panel">
        <button type="button" className="wheel-go" onClick={spin} disabled={options.length < 2 || spinning}>
          {spinning ? (
            'Çark dönüyor…'
          ) : (
            <>
              Çevir <i className="wheel-go-play" aria-hidden /> bas ve çarkı çevir!
            </>
          )}
        </button>

        <p className="wheel-count">Seçenek sayısı: {options.length}</p>
        {winner && !spinning ? (
          <p className="wheel-result">
            Sonuç: <strong>{winner.label}</strong>
          </p>
        ) : null}

        <div className="wheel-bulk">
          <span>Seçilen çıksın</span>
          <button
            type="button"
            className="wheel-switch"
            role="switch"
            aria-checked={dropWinner}
            aria-label="Seçilen çıksın"
            onClick={() => setDropWinner((on) => !on)}
          >
            <i />
          </button>
        </div>

        <div className="wheel-bulk">
          <span>Toplu Seçenek Gir</span>
          <button
            type="button"
            className="wheel-switch"
            role="switch"
            aria-checked={bulk}
            aria-label="Toplu seçenek gir"
            onClick={toggleBulk}
          >
            <i />
          </button>
        </div>

        {bulk ? (
          <textarea
            className="wheel-bulk-box"
            value={bulkText}
            onChange={(event) => setBulkText(event.target.value)}
            aria-label="Seçenekler, satır başına bir tane"
          />
        ) : (
          <>
            <form className="wheel-add" onSubmit={addOption}>
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Çarka seçenek ekleyin"
                aria-label="Çarka seçenek ekleyin"
                maxLength={40}
              />
              <button type="submit">Ekle</button>
            </form>
            {options.length === 0 ? (
              <p className="wheel-empty">Henüz seçenek yok. Eklediklerin çarka yazılır.</p>
            ) : (
              <ul className="wheel-list">
                {options.map((label, index) => (
                  <li key={`${label}-${index}`}>
                    <span>{label}</span>
                    <button type="button" aria-label={`${label} seçeneğini kaldır`} onClick={() => removeOption(index)}>
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </aside>

      <div className="wheel-stage">
        <div className="wheel-pointer" aria-hidden />
        <div
          className={`wheel-disc${spinning ? ' is-spinning' : ''}`}
          style={{ background: conicGradient, transform: `rotate(${rotation}deg)` }}
          role="img"
          aria-label="Karar çarkı"
        >
          {options.map((label, index) => {
            const angle = index * segmentAngle + segmentAngle / 2;
            const flip = angle > 90 && angle < 270;
            return (
              <span
                key={`${label}-${index}`}
                className="wheel-label"
                style={{ transform: `rotate(${angle}deg) translateY(-30cqw)` }}
              >
                <em className={flip ? 'is-flip' : undefined}>{label}</em>
              </span>
            );
          })}
        </div>
        <button
          type="button"
          className="wheel-hub"
          onClick={spin}
          disabled={options.length < 2 || spinning}
          aria-label="Çarkı çevir"
        />
      </div>
    </div>
  );
}
