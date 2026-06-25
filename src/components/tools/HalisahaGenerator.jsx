import { useState, useEffect, useCallback } from 'react';
import { Shuffle, RefreshCw, LayoutGrid, Download } from 'lucide-react';
import { showSuccess, showError } from '../../utils/toast';
import { tool } from './toolStyles';
import HalisahaPitch, { colorToTextContrast } from './HalisahaPitch';
import { downloadLineupPng, downloadBothTeamsLineupPng } from './halisahaExport';
import {
  getPresets,
  getPreset,
  getDefaultPresetId,
  applyPresetToPlayers,
  buildDefaultTeams,
} from './halisahaFormations';

const PITCH_TYPES = [
  { id: 'halisaha', label: 'Halı Saha' },
  { id: 'cim', label: 'Çim' },
];

function ColorPicker({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-warm-200/70 bg-white px-3 py-2.5">
      <span className="text-xs font-semibold text-warm-700">{label}</span>
      <div className="flex items-center gap-2">
        <span
          className="h-7 w-7 rounded-lg border border-warm-200/80 shadow-soft ring-1 ring-black/5"
          style={{ backgroundColor: value }}
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-10 cursor-pointer rounded-lg border-0 bg-transparent p-0"
          aria-label={label}
        />
      </div>
    </div>
  );
}

export default function HalisahaGenerator() {
  const [format, setFormat] = useState(5);
  const [pitchType, setPitchType] = useState('halisaha');
  const [activeTeamIdx, setActiveTeamIdx] = useState(0);
  const [teamAColor, setTeamAColor] = useState('#ea580c');
  const [teamBColor, setTeamBColor] = useState('#0891b2');
  const [teams, setTeams] = useState(() => buildDefaultTeams(5, '#ea580c', '#0891b2'));
  const [bulkNames, setBulkNames] = useState('');
  const [tacticId, setTacticId] = useState(() => getDefaultPresetId(5));

  const presets = getPresets(format);
  const activePreset = getPreset(format, tacticId);
  const activeTeam = teams[activeTeamIdx];
  const pitchTypeLabel = PITCH_TYPES.find((p) => p.id === pitchType)?.label || 'Halı Saha';

  const exportMeta = {
    format,
    tacticLabel: activePreset.label,
    pitchTypeLabel,
  };

  const handleDownloadActive = async () => {
    try {
      await downloadLineupPng({
        ...exportMeta,
        teamLabel: activeTeam.label,
        color: activeTeam.color,
        players: activeTeam.players,
      });
      showSuccess(`${activeTeam.label} dizilişi indirildi`);
    } catch {
      showError('İndirme başarısız oldu');
    }
  };

  const handleDownloadAll = async () => {
    try {
      await downloadBothTeamsLineupPng(teams, exportMeta);
      showSuccess('İki takım tek görselde indirildi');
    } catch {
      showError('İndirme başarısız oldu');
    }
  };

  useEffect(() => {
    const defaultId = getDefaultPresetId(format);
    setTacticId(defaultId);
    setTeams((prev) => {
      const colors = [prev[0]?.color || teamAColor, prev[1]?.color || teamBColor];
      return buildDefaultTeams(format, colors[0], colors[1], defaultId).map((team, ti) => ({
        ...team,
        players: team.players.map((p, i) => ({
          ...p,
          name: prev[ti]?.players[i]?.name || '',
        })),
      }));
    });
  }, [format]);

  useEffect(() => {
    setTeams((prev) =>
      prev.map((t, i) => ({ ...t, color: i === 0 ? teamAColor : teamBColor }))
    );
  }, [teamAColor, teamBColor]);

  const updateActiveTeamPlayers = useCallback((updater) => {
    setTeams((prev) =>
      prev.map((team, i) =>
        i === activeTeamIdx ? { ...team, players: updater(team.players) } : team
      )
    );
  }, [activeTeamIdx]);

  const handlePlayerMove = useCallback(
    (playerId, x, y) => {
      updateActiveTeamPlayers((players) =>
        players.map((p) => (p.id === playerId ? { ...p, x, y } : p))
      );
    },
    [updateActiveTeamPlayers]
  );

  const handlePlayerNameChange = useCallback(
    (playerId, name) => {
      updateActiveTeamPlayers((players) =>
        players.map((p) => (p.id === playerId ? { ...p, name } : p))
      );
    },
    [updateActiveTeamPlayers]
  );

  const applyTactic = useCallback(
    (newTacticId) => {
      const preset = getPreset(format, newTacticId);
      setTacticId(newTacticId);
      setTeams((prev) =>
        prev.map((team) => ({
          ...team,
          players: applyPresetToPlayers(team.players, preset.slots),
        }))
      );
    },
    [format]
  );

  const resetFormation = () => {
    setTeams(buildDefaultTeams(format, teamAColor, teamBColor, tacticId));
    setBulkNames('');
    showSuccess('Diziliş sıfırlandı');
  };

  const shuffleNamesToTeams = () => {
    const list = bulkNames
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (list.length === 0) return;

    const shuffled = [...list].sort(() => Math.random() - 0.5);
    let idx = 0;

    setTeams((prev) =>
      prev.map((team) => ({
        ...team,
        players: team.players.map((p) => {
          if (idx >= shuffled.length) return p;
          const name = shuffled[idx];
          idx += 1;
          return { ...p, name };
        }),
      }))
    );

    showSuccess('İsimler takımlara dağıtıldı — konumları sürükleyerek ayarlayın');
  };

  return (
    <div className="min-w-0 overflow-x-clip">
      <div className="flex flex-col lg:min-h-[540px] lg:flex-row">
        <aside className="shrink-0 space-y-5 border-b border-warm-200/70 bg-gradient-to-b from-cream-50 to-white p-4 sm:p-6 lg:w-[min(100%,300px)] lg:border-b-0 lg:border-r">
          <div className="rounded-xl border border-orange-200/50 bg-orange-50/60 px-3 py-2.5 text-xs leading-relaxed text-warm-700">
            <strong className="text-orange-800">Nasıl kullanılır?</strong>
            <br />
            Sahadaki yuvarlaklara isim ver, sürükleyerek dizilişi kur.
          </div>

          <div>
            <label className={tool.label}>Saha tipi</label>
            <div className="grid grid-cols-2 gap-2">
              {PITCH_TYPES.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPitchType(id)}
                  className={`rounded-xl border-2 px-3 py-2.5 text-xs font-bold transition-all sm:text-sm ${
                    pitchType === id ? tool.toggleOn : `${tool.toggleOff} bg-white`
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={tool.label}>Oyuncu sayısı</label>
            <div className="grid grid-cols-3 gap-2">
              {[5, 6, 7].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  className={`rounded-xl border-2 px-2 py-2.5 text-sm font-bold transition-all ${
                    format === f ? tool.toggleOn : `${tool.toggleOff} bg-white`
                  }`}
                >
                  {f}v{f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={tool.label}>Hazır taktik</label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyTactic(preset.id)}
                  className={`rounded-xl border-2 px-2.5 py-2 text-left transition-all ${
                    tacticId === preset.id
                      ? tool.toggleOn
                      : `${tool.toggleOff} bg-white hover:border-orange-200`
                  }`}
                >
                  <span className="block text-sm font-black tracking-tight">{preset.label}</span>
                  <span className="mt-0.5 block text-[10px] font-medium leading-snug opacity-80">
                    {preset.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={tool.label}>Forma renkleri</label>
            <div className="space-y-2">
              <ColorPicker label="Takım A" value={teamAColor} onChange={setTeamAColor} />
              <ColorPicker label="Takım B" value={teamBColor} onChange={setTeamBColor} />
            </div>
          </div>

          <div>
            <label className={tool.label}>Toplu isim (isteğe bağlı)</label>
            <textarea
              value={bulkNames}
              onChange={(e) => setBulkNames(e.target.value)}
              placeholder={'Ahmet\nMehmet\nCan\n...'}
              className={`${tool.textarea} h-28`}
            />
            <button
              type="button"
              onClick={shuffleNamesToTeams}
              disabled={!bulkNames.trim()}
              className={`${tool.secondaryBtn} mt-2 w-full text-sm disabled:opacity-50`}
            >
              <Shuffle size={16} />
              İsimleri karışık dağıt
            </button>
          </div>

          <button type="button" onClick={resetFormation} className={tool.secondaryBtn}>
            <RefreshCw size={18} /> Dizilişi sıfırla
          </button>
        </aside>

        <div className="relative flex min-w-0 flex-1 flex-col bg-gradient-to-b from-charcoal-900 via-green-950 to-charcoal-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(249,115,22,0.08),transparent)]" />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-orange-300/90">
                Diziliş editörü
              </p>
              <p className="text-sm font-semibold text-white/90">
                {format}v{format} · {activePreset.label}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-xl border border-white/15 bg-black/30 p-1">
                {teams.map((team, idx) => (
                  <button
                    key={team.label}
                    type="button"
                    onClick={() => setActiveTeamIdx(idx)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                      activeTeamIdx === idx
                        ? 'bg-white text-charcoal-900 shadow-soft'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <span
                      className="h-3 w-3 rounded-full ring-1 ring-black/20"
                      style={{ backgroundColor: team.color }}
                    />
                    {team.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleDownloadActive}
                className="inline-flex items-center gap-1.5 rounded-xl border border-orange-400/40 bg-orange-500 px-3 py-2 text-xs font-bold text-white shadow-soft transition hover:bg-orange-400"
              >
                <Download size={14} />
                Dizilişi indir
              </button>
              <button
                type="button"
                onClick={handleDownloadAll}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold text-white/90 transition hover:bg-white/15"
              >
                <Download size={14} />
                İkisini indir
              </button>
            </div>
          </div>

          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-6 sm:py-8">
            <HalisahaPitch
              players={activeTeam.players}
              color={activeTeam.color}
              perspective
              onPlayerMove={handlePlayerMove}
              onPlayerNameChange={handlePlayerNameChange}
            />

            <ul className="mt-4 flex w-full max-w-[360px] flex-wrap justify-center gap-2">
              {activeTeam.players.map((p) => (
                <li
                  key={p.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm"
                >
                  <span
                    className="grid h-5 w-5 place-items-center rounded-full text-[9px] font-black"
                    style={{
                      backgroundColor: activeTeam.color,
                      color: colorToTextContrast(activeTeam.color),
                    }}
                  >
                    {p.role}
                  </span>
                  {p.name.trim() ? p.name.split(' ')[0] : '—'}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 border-t border-white/10 px-4 py-2.5 text-center">
            <p className="inline-flex items-center gap-1.5 text-[10px] font-medium text-white/45">
              <LayoutGrid size={12} />
              {activeTeam.players.length} oyuncu · {activePreset.label} · Takım {activeTeamIdx === 0 ? 'A' : 'B'} düzenleniyor
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
