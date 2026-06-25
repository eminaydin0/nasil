import { useState, useEffect, useCallback } from 'react';
import { Shuffle, RefreshCw, Download, Crown } from 'lucide-react';
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
  getPlayerJerseyColor,
  HALISAHA_FORMATS,
} from './halisahaFormations';

const DEFAULT_TEAM_LABELS = ['Takım A', 'Takım B'];

function getTeamDisplayLabel(label, idx) {
  const trimmed = label?.trim();
  return trimmed || DEFAULT_TEAM_LABELS[idx] || `Takım ${idx + 1}`;
}

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
  const [format, setFormat] = useState(7);
  const [activeTeamIdx, setActiveTeamIdx] = useState(0);
  const [teamAColor, setTeamAColor] = useState('#ea580c');
  const [teamBColor, setTeamBColor] = useState('#0891b2');
  const [teams, setTeams] = useState(() => buildDefaultTeams(7, '#ea580c', '#0891b2'));
  const [bulkNames, setBulkNames] = useState('');
  const [tacticId, setTacticId] = useState(() => getDefaultPresetId(7));

  const presets = getPresets(format);
  const activePreset = getPreset(format, tacticId);
  const activeTeam = teams[activeTeamIdx];

  const exportMeta = {
    format,
    tacticLabel: activePreset.label,
    tacticDesc: activePreset.desc,
  };

  const handleDownloadActive = async () => {
    try {
      await downloadLineupPng({
        ...exportMeta,
        teamLabel: getTeamDisplayLabel(activeTeam.label, activeTeamIdx),
        color: activeTeam.color,
        players: activeTeam.players,
      });
      showSuccess(`${getTeamDisplayLabel(activeTeam.label, activeTeamIdx)} dizilişi indirildi`);
    } catch {
      showError('İndirme başarısız oldu');
    }
  };

  const handleDownloadAll = async () => {
    try {
      await downloadBothTeamsLineupPng(
        teams.map((team, idx) => ({
          ...team,
          label: getTeamDisplayLabel(team.label, idx),
        })),
        exportMeta
      );
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
        label: prev[ti]?.label ?? team.label,
        players: team.players.map((p, i) => ({
          ...p,
          name: prev[ti]?.players[i]?.name || '',
          isCaptain: prev[ti]?.players[i]?.isCaptain ?? false,
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

  const handleToggleCaptain = useCallback(
    (playerId) => {
      updateActiveTeamPlayers((players) =>
        players.map((p) => ({
          ...p,
          isCaptain: p.id === playerId ? !p.isCaptain : false,
        }))
      );
    },
    [updateActiveTeamPlayers]
  );

  const handleTeamLabelChange = useCallback((teamIdx, label) => {
    setTeams((prev) =>
      prev.map((t, i) => (i === teamIdx ? { ...t, label: label.slice(0, 28) } : t))
    );
  }, []);

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
    setTeams((prev) =>
      buildDefaultTeams(format, teamAColor, teamBColor, tacticId).map((team, i) => ({
        ...team,
        label: prev[i]?.label ?? team.label,
      }))
    );
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
      <div className="flex flex-col lg:flex-row lg:items-start">
        <aside className="shrink-0 space-y-5 border-b border-warm-200/70 bg-gradient-to-b from-cream-50 to-white p-4 sm:p-6 lg:w-[min(100%,300px)] lg:border-b-0 lg:border-r">
          <div className="rounded-xl border border-orange-200/50 bg-orange-50/60 px-3 py-2.5 text-xs leading-relaxed text-warm-700">
            <strong className="text-orange-800">Nasıl kullanılır?</strong>
            <br />
            Sahadaki yuvarlaklara isim ver, sürükleyerek dizilişi kur.
          </div>

          <div>
            <label className={tool.label} htmlFor="halisaha-format">
              Oyuncu sayısı
            </label>
            <select
              id="halisaha-format"
              value={format}
              onChange={(e) => setFormat(Number(e.target.value))}
              className={`${tool.input} cursor-pointer font-bold`}
            >
              {HALISAHA_FORMATS.map((f) => (
                <option key={f} value={f}>
                  {f}v{f}
                </option>
              ))}
            </select>
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
            <label className={tool.label}>Takım adları</label>
            <div className="space-y-2">
              {teams.map((team, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={team.label}
                  onChange={(e) => handleTeamLabelChange(idx, e.target.value)}
                  placeholder={DEFAULT_TEAM_LABELS[idx]}
                  className={tool.input}
                  maxLength={28}
                  aria-label={`${DEFAULT_TEAM_LABELS[idx]} adı`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className={tool.label}>Forma renkleri</label>
            <div className="space-y-2">
              <ColorPicker
                label={getTeamDisplayLabel(teams[0]?.label, 0)}
                value={teamAColor}
                onChange={setTeamAColor}
              />
              <ColorPicker
                label={getTeamDisplayLabel(teams[1]?.label, 1)}
                value={teamBColor}
                onChange={setTeamBColor}
              />
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

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-3 py-2 sm:px-4">
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
                    key={idx}
                    type="button"
                    onClick={() => setActiveTeamIdx(idx)}
                    className={`flex max-w-[9rem] items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                      activeTeamIdx === idx
                        ? 'bg-white text-charcoal-900 shadow-soft'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <span
                      className="h-3 w-3 shrink-0 rounded-full ring-1 ring-black/20"
                      style={{ backgroundColor: team.color }}
                    />
                    <span className="truncate">{getTeamDisplayLabel(team.label, idx)}</span>
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

          <div className="relative z-10 flex flex-col items-center gap-2 px-3 py-3 sm:px-4 sm:py-4">
            <HalisahaPitch
              players={activeTeam.players}
              color={activeTeam.color}
              perspective
              onPlayerMove={handlePlayerMove}
              onPlayerNameChange={handlePlayerNameChange}
            />

            <ul className={`flex w-full flex-wrap justify-center gap-1.5 ${activeTeam.players.length >= 9 ? 'max-w-[440px]' : 'max-w-[400px]'}`}>
              {activeTeam.players.map((p) => {
                const jerseyColor = getPlayerJerseyColor(p, activeTeam.color);
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => handleToggleCaptain(p.id)}
                      title={p.isCaptain ? 'Kaptanlığı kaldır' : 'Kaptan yap'}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm transition-all ${
                        p.isCaptain
                          ? 'border-orange-400/60 bg-orange-500/25 ring-1 ring-orange-400/50'
                          : 'border-white/15 bg-black/35 hover:border-orange-400/40'
                      }`}
                    >
                      <span
                        className="grid h-5 w-5 place-items-center rounded-full text-[9px] font-black"
                        style={{
                          backgroundColor: jerseyColor,
                          color: colorToTextContrast(jerseyColor),
                        }}
                      >
                        {p.role}
                      </span>
                      {p.isCaptain ? <Crown size={11} className="text-orange-300" aria-hidden /> : null}
                      {p.name.trim() ? p.name.split(' ')[0] : '—'}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
