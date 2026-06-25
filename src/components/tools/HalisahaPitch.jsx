import { useRef, useState, useCallback, useEffect } from 'react';
import { clampPitchPosition, colorToTextContrast } from './halisahaFormations';

const FIELD_ID = 'halisaha-field';

function PitchMarkings() {
  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => (
        <rect
          key={i}
          x="4"
          y={4 + i * 11.2}
          width="92"
          height="11.2"
          fill={i % 2 === 0 ? '#3d9b4a' : '#47ad55'}
        />
      ))}

      <rect x="4" y="4" width="92" height="132" rx="2" fill="url(#grassOverlay)" />

      <rect
        x="4"
        y="4"
        width="92"
        height="132"
        rx="2"
        fill="none"
        stroke="#f8fafc"
        strokeWidth="0.55"
        opacity="0.95"
      />

      <line x1="4" y1="70" x2="96" y2="70" stroke="#f8fafc" strokeWidth="0.5" opacity="0.9" />
      <circle cx="50" cy="70" r="11" fill="none" stroke="#f8fafc" strokeWidth="0.5" opacity="0.9" />
      <circle cx="50" cy="70" r="0.8" fill="#f8fafc" opacity="0.9" />

      <rect x="22" y="104" width="56" height="22" fill="none" stroke="#f8fafc" strokeWidth="0.5" opacity="0.9" />
      <rect x="34" y="118" width="32" height="8" fill="none" stroke="#f8fafc" strokeWidth="0.45" opacity="0.85" />
      <circle cx="50" cy="112" r="0.7" fill="#f8fafc" opacity="0.85" />

      <rect x="22" y="14" width="56" height="22" fill="none" stroke="#f8fafc" strokeWidth="0.5" opacity="0.9" />
      <rect x="34" y="14" width="32" height="8" fill="none" stroke="#f8fafc" strokeWidth="0.45" opacity="0.85" />
      <circle cx="50" cy="28" r="0.7" fill="#f8fafc" opacity="0.85" />

      <path d="M 4 10 A 6 6 0 0 0 10 4" fill="none" stroke="#f8fafc" strokeWidth="0.4" opacity="0.75" />
      <path d="M 90 4 A 6 6 0 0 0 96 10" fill="none" stroke="#f8fafc" strokeWidth="0.4" opacity="0.75" />
      <path d="M 4 130 A 6 6 0 0 1 10 136" fill="none" stroke="#f8fafc" strokeWidth="0.4" opacity="0.75" />
      <path d="M 96 130 A 6 6 0 0 1 90 136" fill="none" stroke="#f8fafc" strokeWidth="0.4" opacity="0.75" />

      <rect x="42" y="2" width="16" height="3" fill="none" stroke="#f8fafc" strokeWidth="0.45" opacity="0.7" />
      <rect x="42" y="135" width="16" height="3" fill="none" stroke="#f8fafc" strokeWidth="0.45" opacity="0.7" />
    </>
  );
}

function DraggablePlayer({
  player,
  color,
  isDragging,
  isEditing,
  onPointerDown,
  onNameChange,
  onStartEdit,
  onEndEdit,
}) {
  const displayName = player.name.trim() || player.role;
  const label = player.name.trim() ? player.name.split(' ')[0] : player.role;

  return (
    <div
      className="absolute z-10 flex w-[4.5rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center touch-none select-none sm:w-[5rem]"
      style={{ left: `${player.x}%`, top: `${player.y}%` }}
    >
      <button
        type="button"
        aria-label={`${displayName} — sürüklemek için basılı tut`}
        onPointerDown={(e) => onPointerDown(player.id, e)}
        className={`h-9 w-9 cursor-grab rounded-full border-[2.5px] border-white shadow-[0_2px_10px_rgba(0,0,0,0.4)] transition-transform active:cursor-grabbing sm:h-10 sm:w-10 ${
          isDragging ? 'z-20 scale-110 ring-2 ring-orange-300 ring-offset-1 ring-offset-transparent' : ''
        }`}
        style={{ backgroundColor: color }}
      />

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
          className="mt-1 w-full max-w-[5.5rem] rounded-md border border-white/40 bg-charcoal-900/90 px-1.5 py-0.5 text-center text-[10px] font-bold text-white outline-none ring-2 ring-orange-400 sm:text-[11px]"
          placeholder="İsim"
        />
      ) : (
        <button
          type="button"
          onClick={() => onStartEdit(player.id)}
          onPointerDown={(e) => e.stopPropagation()}
          className="mt-1 max-w-full truncate rounded px-1 py-0.5 text-center text-[10px] font-bold leading-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] hover:underline sm:text-[11px]"
        >
          {player.name.trim() ? label : `${player.role} · isim ver`}
        </button>
      )}
    </div>
  );
}

export default function HalisahaPitch({
  players = [],
  color,
  perspective = true,
  onPlayerMove,
  onPlayerNameChange,
}) {
  const fieldRef = useRef(null);
  const [draggingId, setDraggingId] = useState(null);
  const [editingId, setEditingId] = useState(null);

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
      className={`mx-auto w-full max-w-[320px] sm:max-w-[360px] ${perspective ? 'pitch-perspective' : ''}`}
    >
      <div className={perspective ? 'pitch-perspective-inner' : ''}>
        <div className="relative overflow-hidden rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.45)] ring-1 ring-white/10">
          <div
            ref={fieldRef}
            className="relative aspect-[68/105] w-full touch-none bg-green-800"
          >
            <svg viewBox="0 0 100 140" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
              <defs>
                <linearGradient id="grassOverlay" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2d8a3e" stopOpacity="0.15" />
                  <stop offset="50%" stopColor="#000" stopOpacity="0" />
                  <stop offset="100%" stopColor="#14532d" stopOpacity="0.2" />
                </linearGradient>
                <radialGradient id={`${FIELD_ID}-light`} cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#86efac" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#000" stopOpacity="0" />
                </radialGradient>
              </defs>
              <PitchMarkings />
              <rect x="4" y="4" width="92" height="132" fill={`url(#${FIELD_ID}-light)`} />
            </svg>

            {players.map((player) => (
              <DraggablePlayer
                key={player.id}
                player={player}
                color={color}
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

      <p className="mt-2 text-center text-[10px] font-medium text-white/50 sm:text-[11px]">
        Yuvarlağı sürükle · isme dokunarak düzenle
      </p>
    </div>
  );
}

export { colorToTextContrast };
