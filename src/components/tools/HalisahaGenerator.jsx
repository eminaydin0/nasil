import { useState, useEffect, useCallback } from 'react';
import { Shuffle, RefreshCw, Download, Crown, Settings2, ChevronDown, ChevronUp } from 'lucide-react';
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

function HalisahaSettingsPanel({
  format,
  setFormat,
  presets,
  tacticId,
  applyTactic,
  teams,
  handleTeamLabelChange,
  teamAColor,
  setTeamAColor,
  teamBColor,
  setTeamBColor,
  bulkNames,
  setBulkNames,
  shuffleNamesToTeams,
  resetFormation,
  showHint = true,
}) {
  return (
    <div className="space-y-5">
      {showHint ? (
        <div className="rounded-2xl border border-orange-200/60 bg-gradient-to-br from-orange-50 to-amber-50/80 px-3.5 py-3 text-xs leading-relaxed text-warm-700 shadow-soft">
          <strong className="text-orange-800">Nasıl kullanılır?</strong>
          <br />
          Sahadaki numaralı formaları sürükle, isme dokunarak düzenle.
        </div>
      ) : null}

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

      <div className="hidden lg:block">
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

      <button type="button" onClick={resetFormation} className={`${tool.secondaryBtn} w-full`}>
        <RefreshCw size={18} /> Dizilişi sıfırla
      </button>
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
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);

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

  const settingsPanelProps = {
    format,
    setFormat,
    presets,
    tacticId,
    applyTactic,
    teams,
    handleTeamLabelChange,
    teamAColor,
    setTeamAColor,
    teamBColor,
    setTeamBColor,
    bulkNames,
    setBulkNames,
    shuffleNamesToTeams,
    resetFormation,
  };

  return (
    <div className="min-w-0 overflow-x-clip">
      <div className="flex flex-col lg:flex-row lg:items-start">
        {/* Saha — mobilde önce */}
        <div className="halisaha-studio relative order-1 flex min-w-0 flex-1 flex-col lg:order-2 lg:min-h-[540px]">
          {/* Mobil üst bar */}
          <div className="halisaha-toolbar relative z-20 sticky top-[var(--safe-top)]">
            <div className="flex items-center gap-2 px-3 py-2.5 sm:px-4">
              <div className="halisaha-team-switch flex min-w-0 flex-1 rounded-2xl p-1">
                {teams.map((team, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveTeamIdx(idx)}
                    className={`halisaha-team-tab flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-bold sm:px-3 ${
                      activeTeamIdx === idx
                        ? 'halisaha-team-tab--active text-charcoal-900'
                        : 'text-white/65 active:text-white'
                    }`}
                  >
                    <span
                      className="h-3.5 w-3.5 shrink-0 rounded-full ring-2 ring-white/25"
                      style={{ backgroundColor: team.color }}
                    />
                    <span className="truncate">{getTeamDisplayLabel(team.label, idx)}</span>
                  </button>
                ))}
              </div>

              <div className="relative shrink-0 lg:hidden">
                <select
                  value={format}
                  onChange={(e) => setFormat(Number(e.target.value))}
                  className="halisaha-glass appearance-none rounded-xl py-2.5 pl-3 pr-8 text-xs font-black text-white outline-none"
                  aria-label="Oyuncu sayısı"
                >
                  {HALISAHA_FORMATS.map((f) => (
                    <option key={f} value={f} className="bg-charcoal-900">
                      {f}v{f}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-white/50"
                  aria-hidden
                />
              </div>

              <button
                type="button"
                onClick={() => setMobileSettingsOpen((o) => !o)}
                className={`halisaha-glass shrink-0 rounded-xl p-2.5 transition lg:hidden ${
                  mobileSettingsOpen ? 'text-orange-300 ring-1 ring-orange-400/40' : 'text-white/75'
                }`}
                aria-label="Ayarlar"
                aria-expanded={mobileSettingsOpen}
              >
                <Settings2 size={18} />
              </button>
            </div>

            {/* Taktik şeridi */}
            <div className="halisaha-tactic-scroll flex gap-2 overflow-x-auto px-3 pb-2.5 sm:px-4 lg:hidden">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyTactic(preset.id)}
                  className={`halisaha-pill shrink-0 rounded-full px-4 py-2 text-xs font-bold text-white/85 active:scale-95 ${
                    tacticId === preset.id ? 'halisaha-pill--active text-white' : ''
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Masaüstü üst bar */}
            <div className="relative z-10 hidden flex-wrap items-center justify-between gap-3 px-4 py-3 lg:flex">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/80">
                  Diziliş stüdyosu
                </p>
                <p className="mt-0.5 text-sm font-semibold text-white/90">
                  {format}v{format}
                  <span className="mx-2 text-white/25">·</span>
                  <span className="text-orange-300/90">{activePreset.label}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadActive}
                  className="halisaha-btn-primary inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white transition hover:brightness-110"
                >
                  <Download size={14} />
                  Dizilişi indir
                </button>
                <button
                  type="button"
                  onClick={handleDownloadAll}
                  className="halisaha-btn-ghost inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white/90 transition hover:bg-white/12"
                >
                  <Download size={14} />
                  İkisini indir
                </button>
              </div>
            </div>
          </div>

          {/* Saha alanı */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-4 px-2 py-4 sm:px-4 sm:py-5">
            <HalisahaPitch
              players={activeTeam.players}
              color={activeTeam.color}
              perspective
              formatLabel={`${format}v${format}`}
              tacticLabel={activePreset.label}
              onPlayerMove={handlePlayerMove}
              onPlayerNameChange={handlePlayerNameChange}
            />

            {/* Kadro */}
            <div className="w-full max-w-lg">
              <div className="mb-2 flex items-center justify-between px-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
                  Kadro · kaptan seç
                </p>
                <p className="text-[10px] font-medium text-white/30">
                  {activeTeam.players.filter((p) => p.name.trim()).length}/{activeTeam.players.length} isim
                </p>
              </div>
              <div className="halisaha-roster-scroll overflow-x-auto pb-0.5">
                <ul className="flex w-max min-w-full justify-start gap-2 px-1 sm:flex-wrap sm:justify-center">
                  {activeTeam.players.map((p) => {
                    const jerseyColor = getPlayerJerseyColor(p, activeTeam.color);
                    return (
                      <li key={p.id} className="shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleCaptain(p.id)}
                          title={p.isCaptain ? 'Kaptanlığı kaldır' : 'Kaptan yap'}
                          className={`halisaha-roster-chip inline-flex min-h-[2.375rem] items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-white active:scale-95 ${
                            p.isCaptain ? 'halisaha-roster-chip--captain' : ''
                          }`}
                        >
                          <span
                            className="grid h-6 w-6 place-items-center rounded-full text-[10px] font-black shadow-sm ring-1 ring-white/20"
                            style={{
                              backgroundColor: jerseyColor,
                              color: colorToTextContrast(jerseyColor),
                            }}
                          >
                            {p.role}
                          </span>
                          {p.isCaptain ? (
                            <Crown size={12} className="text-amber-400" aria-hidden />
                          ) : null}
                          <span className={p.name.trim() ? 'text-white/90' : 'text-white/45'}>
                            {p.name.trim() ? p.name.split(' ')[0] : p.role}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          {/* Mobil alt bar */}
          <div className="halisaha-dock relative z-20 sticky bottom-0 px-3 py-3 lg:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={handleDownloadActive}
                className="halisaha-btn-primary inline-flex flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white active:scale-[0.98]"
              >
                <Download size={17} />
                PNG İndir
              </button>
              <button
                type="button"
                onClick={handleDownloadAll}
                className="halisaha-btn-ghost inline-flex flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white/90 active:scale-[0.98]"
              >
                <Download size={17} />
                İkisi
              </button>
            </div>
          </div>
        </div>

        {/* Ayarlar paneli — masaüstü sol sütun */}
        <aside className="order-2 hidden shrink-0 border-b border-warm-200/70 bg-gradient-to-b from-cream-50 to-white p-4 sm:p-6 lg:order-1 lg:block lg:w-[min(100%,300px)] lg:border-b-0 lg:border-r">
          <div className="mb-5 hidden lg:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-warm-400">Stüdyo</p>
            <h3 className="mt-1 text-base font-bold text-warm-900">Takım ayarları</h3>
          </div>
          <HalisahaSettingsPanel {...settingsPanelProps} />
        </aside>

        {/* Mobil ayarlar — açılır panel */}
        {mobileSettingsOpen ? (
          <div className="halisaha-settings-sheet order-3 rounded-t-2xl p-4 pt-5 lg:hidden">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-warm-200" aria-hidden />
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-warm-900">Takım ayarları</h3>
                <p className="mt-0.5 text-xs text-warm-500">İsim, renk ve toplu dağıtım</p>
              </div>
              <button
                type="button"
                onClick={() => setMobileSettingsOpen(false)}
                className="inline-flex items-center gap-1 rounded-full bg-warm-100 px-3 py-1.5 text-xs font-semibold text-warm-700"
              >
                Kapat
                <ChevronUp size={14} />
              </button>
            </div>
            <HalisahaSettingsPanel {...settingsPanelProps} showHint={false} />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setMobileSettingsOpen(true)}
            className="order-3 flex w-full items-center justify-center gap-2 border-t border-warm-200/80 bg-gradient-to-b from-white to-cream-50 px-4 py-3.5 text-sm font-semibold text-warm-700 active:bg-warm-50 lg:hidden"
          >
            <Settings2 size={16} className="text-orange-500" />
            Takım adı, renk ve toplu isim
            <ChevronDown size={16} className="text-warm-400" />
          </button>
        )}
      </div>
    </div>
  );
}
