import { useRef, useState, useCallback, useEffect } from 'react';
import { clampPitchPosition, colorToTextContrast, getPlayerJerseyColor } from './halisahaFormations';

const PITCH_BG = '/media/tools/halisaha-pitch.jpg?v=2';

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
          className="halisaha-name-tag mt-1.5 w-full max-w-[5.5rem] rounded-full px-2 py-1.5 text-center text-base font-extrabold text-white outline-none ring-2 ring-orange-400 sm:text-sm"
          placeholder="İsim"
        />
      ) : (
        <button
          type="button"
          onClick={() => onStartEdit(player.id)}
          onPointerDown={(e) => e.stopPropagation()}
          className={`halisaha-name-tag mt-1.5 max-w-full truncate rounded-full px-2 py-1 text-center font-extrabold leading-tight text-white ${
            compact ? 'min-h-[1.35rem] text-[10px] sm:text-[11px]' : 'min-h-[1.55rem] text-[11px] sm:text-xs'
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
  formatLabel,
  tacticLabel,
  onPlayerMove,
  onPlayerNameChange,
}) {
  const fieldRef = useRef(null);
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
    <div className="halisaha-pitch-root mx-auto w-full max-w-[min(100%,420px)] lg:max-w-[min(100%,520px)]">
      {(formatLabel || tacticLabel) && (
        <div className="halisaha-pitch-meta mb-1.5 flex items-center justify-between gap-2 px-1 lg:hidden">
          {formatLabel ? <span className="halisaha-meta-badge">{formatLabel}</span> : <span />}
          {tacticLabel ? (
            <span className="halisaha-meta-badge text-orange-300/90">{tacticLabel}</span>
          ) : null}
        </div>
      )}

      <div className="halisaha-pitch-frame">
        <div className="halisaha-pitch-inner">
          <div
            ref={fieldRef}
            className="halisaha-pitch-field relative w-full touch-none overflow-hidden bg-[#07140c]"
          >
            <img
              src={PITCH_BG}
              alt=""
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-center"
              aria-hidden
            />

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
  );
}

export { colorToTextContrast };
