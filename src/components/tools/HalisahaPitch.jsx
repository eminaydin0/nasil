import { useRef, useState, useCallback, useEffect, useId } from 'react';
import { clampPitchPosition, colorToTextContrast, getPlayerJerseyColor } from './halisahaFormations';

function PitchMarkings({ fieldId }) {
  return (
    <>
      {Array.from({ length: 14 }).map((_, i) => (
        <rect
          key={i}
          x="4"
          y={4 + i * 9.6}
          width="92"
          height="9.6"
          fill={i % 2 === 0 ? '#2f9340' : '#389e49'}
        />
      ))}

      <rect x="4" y="4" width="92" height="132" rx="2" fill={`url(#${fieldId}-grassOverlay)`} />

      <rect
        x="4"
        y="4"
        width="92"
        height="132"
        rx="2"
        fill="none"
        stroke="#f1f5f9"
        strokeWidth="0.6"
        opacity="0.92"
      />

      <line x1="4" y1="70" x2="96" y2="70" stroke="#f1f5f9" strokeWidth="0.55" opacity="0.88" />
      <circle cx="50" cy="70" r="11" fill="none" stroke="#f1f5f9" strokeWidth="0.55" opacity="0.88" />
      <circle cx="50" cy="70" r="0.9" fill="#f1f5f9" opacity="0.9" />

      <rect x="22" y="104" width="56" height="22" fill="none" stroke="#f1f5f9" strokeWidth="0.55" opacity="0.88" />
      <rect x="34" y="118" width="32" height="8" fill="none" stroke="#f1f5f9" strokeWidth="0.48" opacity="0.82" />
      <circle cx="50" cy="112" r="0.75" fill="#f1f5f9" opacity="0.85" />

      <rect x="22" y="14" width="56" height="22" fill="none" stroke="#f1f5f9" strokeWidth="0.55" opacity="0.88" />
      <rect x="34" y="14" width="32" height="8" fill="none" stroke="#f1f5f9" strokeWidth="0.48" opacity="0.82" />
      <circle cx="50" cy="28" r="0.75" fill="#f1f5f9" opacity="0.85" />

      <path d="M 4 10 A 6 6 0 0 0 10 4" fill="none" stroke="#f1f5f9" strokeWidth="0.42" opacity="0.72" />
      <path d="M 90 4 A 6 6 0 0 0 96 10" fill="none" stroke="#f1f5f9" strokeWidth="0.42" opacity="0.72" />
      <path d="M 4 130 A 6 6 0 0 1 10 136" fill="none" stroke="#f1f5f9" strokeWidth="0.42" opacity="0.72" />
      <path d="M 96 130 A 6 6 0 0 1 90 136" fill="none" stroke="#f1f5f9" strokeWidth="0.42" opacity="0.72" />

      <rect x="42" y="2" width="16" height="3" fill="none" stroke="#f1f5f9" strokeWidth="0.48" opacity="0.68" />
      <rect x="42" y="135" width="16" height="3" fill="none" stroke="#f1f5f9" strokeWidth="0.48" opacity="0.68" />
    </>
  );
}

function DraggablePlayer({
  player,
  teamColor,
  compact = false,
  isDragging,
  isEditing,
  onPointerDown,
  onNameChange,
  onStartEdit,
  onEndEdit,
}) {
  const displayName = player.name.trim() || player.role;
  const label = player.name.trim() ? player.name.split(' ')[0] : player.role;
  const jerseyColor = getPlayerJerseyColor(player, teamColor);
  const textColor = colorToTextContrast(jerseyColor);
  const sizeClass = compact ? 'h-8 w-8 sm:h-9 sm:w-9 text-[9px]' : 'h-10 w-10 sm:h-11 sm:w-11 text-[10px]';
  const widthClass = compact ? 'w-[3.5rem] sm:w-[3.75rem]' : 'w-[4.25rem] sm:w-[5rem]';

  return (
    <div
      className={`absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center touch-none select-none ${widthClass}`}
      style={{ left: `${player.x}%`, top: `${player.y}%` }}
    >
      <div className="relative">
        <button
          type="button"
          aria-label={`${displayName}${player.isCaptain ? ' — kaptan' : ''} — sürüklemek için basılı tut`}
          onPointerDown={(e) => onPointerDown(player.id, e)}
          className={`halisaha-player-token grid cursor-grab place-items-center rounded-full font-black transition-transform active:cursor-grabbing active:scale-110 ${sizeClass} ${
            isDragging ? 'halisaha-player-token--drag z-20 scale-110' : ''
          } ${player.isCaptain && !isDragging ? 'ring-2 ring-amber-400/80 ring-offset-1 ring-offset-transparent' : ''}`}
          style={{
            background: `linear-gradient(160deg, ${jerseyColor} 0%, ${jerseyColor}dd 55%, ${jerseyColor}99 100%)`,
            color: textColor,
          }}
        >
          {player.role}
        </button>
        {player.isCaptain ? (
          <span
            className={`pointer-events-none absolute -right-1 -top-1 grid place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 font-black text-white shadow-md ring-[1.5px] ring-white ${
              compact ? 'h-3.5 w-3.5 text-[7px]' : 'h-4 w-4 text-[8px]'
            }`}
            aria-hidden
          >
            C
          </span>
        ) : null}
      </div>

      {isEditing ? (
        <input
          autoFocus
          type="text"
          value={player.name}
          onChange={(e) => onNameChange(player.id, e.target.value)}
          onBlur={() => onEndEdit()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape') onEndEdit();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="halisaha-name-tag mt-1.5 w-full max-w-[5.5rem] rounded-full px-2 py-1.5 text-center text-base font-bold text-white outline-none ring-2 ring-orange-400 sm:text-sm"
          placeholder="İsim"
        />
      ) : (
        <button
          type="button"
          onClick={() => onStartEdit(player.id)}
          onPointerDown={(e) => e.stopPropagation()}
          className={`halisaha-name-tag mt-1.5 max-w-full truncate rounded-full px-2 py-0.5 text-center font-semibold leading-tight text-white/95 ${
            compact ? 'min-h-[1.25rem] text-[9px] sm:text-[10px]' : 'min-h-[1.5rem] text-[10px] sm:text-[11px]'
          }`}
        >
          {player.name.trim() ? label : `${player.role} · isim`}
        </button>
      )}
    </div>
  );
}

export default function HalisahaPitch({
  players = [],
  color,
  perspective = true,
  formatLabel,
  tacticLabel,
  onPlayerMove,
  onPlayerNameChange,
}) {
  const fieldRef = useRef(null);
  const fieldId = useId().replace(/:/g, '');
  const [draggingId, setDraggingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const compact = players.length >= 9;

  const movePlayer = useCallback(
    (clientX, clientY, playerId) => {
      const el = fieldRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const rawX = ((clientX - rect.left) / rect.width) * 100;
      const rawY = ((clientY - rect.top) / rect.height) * 100;
      const { x, y } = clampPitchPosition(rawX, rawY);
      onPlayerMove?.(playerId, x, y);
    },
    [onPlayerMove]
  );

  const handlePointerDown = (playerId, e) => {
    if (editingId) return;
    e.preventDefault();
    setDraggingId(playerId);
  };

  useEffect(() => {
    if (!draggingId) return;

    const onMove = (e) => movePlayer(e.clientX, e.clientY, draggingId);
    const onUp = () => setDraggingId(null);

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [draggingId, movePlayer]);

  return (
    <div
      className={`mx-auto w-full max-w-none sm:max-w-[min(100%,380px)] lg:max-w-[min(100%,440px)] ${perspective ? 'pitch-perspective' : ''}`}
    >
      {(formatLabel || tacticLabel) && (
        <div className="mb-2 flex items-center justify-between gap-2 px-1 lg:hidden">
          {formatLabel ? <span className="halisaha-meta-badge">{formatLabel}</span> : <span />}
          {tacticLabel ? (
            <span className="halisaha-meta-badge text-orange-300/90">{tacticLabel}</span>
          ) : null}
        </div>
      )}

      <div className={perspective ? 'pitch-perspective-inner' : ''}>
        <div className="halisaha-pitch-frame">
          <div className="halisaha-pitch-inner">
            <div
              ref={fieldRef}
              className="relative aspect-[68/105] w-full touch-none bg-[#1a5c32]"
            >
              <svg viewBox="0 0 100 140" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
                <defs>
                  <linearGradient id={`${fieldId}-grassOverlay`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4ade80" stopOpacity="0.08" />
                    <stop offset="45%" stopColor="#000" stopOpacity="0" />
                    <stop offset="100%" stopColor="#052e16" stopOpacity="0.28" />
                  </linearGradient>
                  <radialGradient id={`${fieldId}-light`} cx="50%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0.14" />
                    <stop offset="100%" stopColor="#000" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id={`${fieldId}-vignette`} cx="50%" cy="50%" r="70%">
                    <stop offset="55%" stopColor="#000" stopOpacity="0" />
                    <stop offset="100%" stopColor="#000" stopOpacity="0.35" />
                  </radialGradient>
                </defs>
                <PitchMarkings fieldId={fieldId} />
                <rect x="4" y="4" width="92" height="132" fill={`url(#${fieldId}-light)`} />
                <rect x="4" y="4" width="92" height="132" fill={`url(#${fieldId}-vignette)`} />
              </svg>

              {players.map((player) => (
                <DraggablePlayer
                  key={player.id}
                  player={player}
                  teamColor={color}
                  compact={compact}
                  isDragging={draggingId === player.id}
                  isEditing={editingId === player.id}
                  onPointerDown={handlePointerDown}
                  onNameChange={onPlayerNameChange}
                  onStartEdit={setEditingId}
                  onEndEdit={() => setEditingId(null)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 hidden text-center text-[10px] font-medium tracking-wide text-white/40 sm:block">
        Sürükle · isme dokun · kadrodan kaptan seç
      </p>
    </div>
  );
}

export { colorToTextContrast };
