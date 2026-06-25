/** Halı saha diziliş pozisyonları — dikey saha, yukarı rakip kale */

export const HALISAHA_PRESETS = {
  5: [
    {
      id: '2-1-1',
      label: '2-1-1',
      desc: 'Dengeli — 2 defans, 1 orta, 1 forvet',
      slots: [
        { x: 50, y: 88, role: 'KL' },
        { x: 28, y: 68, role: 'DF' },
        { x: 72, y: 68, role: 'DF' },
        { x: 50, y: 48, role: 'OS' },
        { x: 50, y: 28, role: 'FV' },
      ],
    },
    {
      id: '1-2-1',
      label: '1-2-1',
      desc: 'Orta ağırlıklı — geniş orta saha, tek forvet',
      slots: [
        { x: 50, y: 88, role: 'KL' },
        { x: 50, y: 70, role: 'DF' },
        { x: 30, y: 50, role: 'OS' },
        { x: 70, y: 50, role: 'OS' },
        { x: 50, y: 28, role: 'FV' },
      ],
    },
    {
      id: '1-1-2',
      label: '1-1-2',
      desc: 'Hücum — tek defans, çift forvet',
      slots: [
        { x: 50, y: 88, role: 'KL' },
        { x: 50, y: 70, role: 'DF' },
        { x: 50, y: 50, role: 'OS' },
        { x: 32, y: 30, role: 'FV' },
        { x: 68, y: 30, role: 'FV' },
      ],
    },
    {
      id: '3-1-0',
      label: '3-1-0',
      desc: 'Defansif — 3 defans, kompakt orta saha',
      slots: [
        { x: 50, y: 88, role: 'KL' },
        { x: 22, y: 68, role: 'DF' },
        { x: 50, y: 68, role: 'DF' },
        { x: 78, y: 68, role: 'DF' },
        { x: 50, y: 45, role: 'OS' },
      ],
    },
  ],
  6: [
    {
      id: '2-2-1',
      label: '2-2-1',
      desc: 'Dengeli — klasik halı saha dizilişi',
      slots: [
        { x: 50, y: 88, role: 'KL' },
        { x: 25, y: 70, role: 'DF' },
        { x: 75, y: 70, role: 'DF' },
        { x: 35, y: 50, role: 'OS' },
        { x: 65, y: 50, role: 'OS' },
        { x: 50, y: 28, role: 'FV' },
      ],
    },
    {
      id: '2-1-2',
      label: '2-1-2',
      desc: 'Hücum — çift forvet, tek orta saha',
      slots: [
        { x: 50, y: 88, role: 'KL' },
        { x: 28, y: 70, role: 'DF' },
        { x: 72, y: 70, role: 'DF' },
        { x: 50, y: 50, role: 'OS' },
        { x: 35, y: 28, role: 'FV' },
        { x: 65, y: 28, role: 'FV' },
      ],
    },
    {
      id: '1-2-2',
      label: '1-2-2',
      desc: 'Ofansif — geniş orta, çift forvet',
      slots: [
        { x: 50, y: 88, role: 'KL' },
        { x: 50, y: 72, role: 'DF' },
        { x: 32, y: 52, role: 'OS' },
        { x: 68, y: 52, role: 'OS' },
        { x: 35, y: 28, role: 'FV' },
        { x: 65, y: 28, role: 'FV' },
      ],
    },
    {
      id: '3-1-1',
      label: '3-1-1',
      desc: 'Defansif — üçlü savunma hattı',
      slots: [
        { x: 50, y: 88, role: 'KL' },
        { x: 20, y: 70, role: 'DF' },
        { x: 50, y: 70, role: 'DF' },
        { x: 80, y: 70, role: 'DF' },
        { x: 50, y: 48, role: 'OS' },
        { x: 50, y: 28, role: 'FV' },
      ],
    },
    {
      id: '1-3-1',
      label: '1-3-1',
      desc: 'Orta saha baskısı — geniş üçlü orta',
      slots: [
        { x: 50, y: 88, role: 'KL' },
        { x: 50, y: 72, role: 'DF' },
        { x: 22, y: 52, role: 'OS' },
        { x: 50, y: 52, role: 'OS' },
        { x: 78, y: 52, role: 'OS' },
        { x: 50, y: 28, role: 'FV' },
      ],
    },
  ],
  7: [
    {
      id: '3-2-1',
      label: '3-2-1',
      desc: 'Dengeli — sağlam defans, çift orta',
      slots: [
        { x: 50, y: 90, role: 'KL' },
        { x: 18, y: 72, role: 'DF' },
        { x: 50, y: 72, role: 'DF' },
        { x: 82, y: 72, role: 'DF' },
        { x: 32, y: 48, role: 'OS' },
        { x: 68, y: 48, role: 'OS' },
        { x: 50, y: 26, role: 'FV' },
      ],
    },
    {
      id: '2-3-1',
      label: '2-3-1',
      desc: 'Orta kontrol — üçlü orta saha',
      slots: [
        { x: 50, y: 90, role: 'KL' },
        { x: 28, y: 72, role: 'DF' },
        { x: 72, y: 72, role: 'DF' },
        { x: 22, y: 50, role: 'OS' },
        { x: 50, y: 50, role: 'OS' },
        { x: 78, y: 50, role: 'OS' },
        { x: 50, y: 26, role: 'FV' },
      ],
    },
    {
      id: '2-2-2',
      label: '2-2-2',
      desc: 'Simetrik — çift hat her bölgede',
      slots: [
        { x: 50, y: 90, role: 'KL' },
        { x: 28, y: 72, role: 'DF' },
        { x: 72, y: 72, role: 'DF' },
        { x: 32, y: 50, role: 'OS' },
        { x: 68, y: 50, role: 'OS' },
        { x: 35, y: 28, role: 'FV' },
        { x: 65, y: 28, role: 'FV' },
      ],
    },
    {
      id: '3-1-2',
      label: '3-1-2',
      desc: 'Hücum — çift forvet, tek pivot',
      slots: [
        { x: 50, y: 90, role: 'KL' },
        { x: 18, y: 72, role: 'DF' },
        { x: 50, y: 72, role: 'DF' },
        { x: 82, y: 72, role: 'DF' },
        { x: 50, y: 50, role: 'OS' },
        { x: 35, y: 28, role: 'FV' },
        { x: 65, y: 28, role: 'FV' },
      ],
    },
    {
      id: '2-1-3',
      label: '2-1-3',
      desc: 'All-out attack — üçlü forvet hattı',
      slots: [
        { x: 50, y: 90, role: 'KL' },
        { x: 28, y: 72, role: 'DF' },
        { x: 72, y: 72, role: 'DF' },
        { x: 50, y: 52, role: 'OS' },
        { x: 22, y: 28, role: 'FV' },
        { x: 50, y: 24, role: 'FV' },
        { x: 78, y: 28, role: 'FV' },
      ],
    },
  ],
};

/** @deprecated — preset listesinden türetilir */
export const HALISAHA_TACTICS = Object.fromEntries(
  Object.entries(HALISAHA_PRESETS).map(([format, presets]) => [
    format,
    { label: presets[0].label, desc: presets[0].desc },
  ])
);

/** @deprecated — varsayılan preset slotları */
export const HALISAHA_FORMATIONS = Object.fromEntries(
  Object.entries(HALISAHA_PRESETS).map(([format, presets]) => [format, presets[0].slots])
);

export function getPresets(format) {
  return HALISAHA_PRESETS[format] || [];
}

export function getDefaultPresetId(format) {
  return getPresets(format)[0]?.id ?? '';
}

export function getPreset(format, presetId) {
  const presets = getPresets(format);
  return presets.find((p) => p.id === presetId) || presets[0];
}

export function colorToTextContrast(hex) {
  if (!hex) return '#000';
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#1c1917' : '#fff';
}

export function clampPitchPosition(x, y) {
  return {
    x: Math.min(92, Math.max(8, x)),
    y: Math.min(94, Math.max(8, y)),
  };
}

export function applyPresetToPlayers(players, slots) {
  return players.map((player, i) => {
    const slot = slots[i];
    if (!slot) return player;
    return { ...player, x: slot.x, y: slot.y, role: slot.role };
  });
}

export function createDefaultTeamPlayers(format, teamKey, presetId) {
  const preset = getPreset(format, presetId);
  return preset.slots.map((slot, i) => ({
    id: `${teamKey}-${format}-${i}`,
    name: '',
    x: slot.x,
    y: slot.y,
    role: slot.role,
  }));
}

export function buildDefaultTeams(format, colorA, colorB, presetId) {
  const id = presetId ?? getDefaultPresetId(format);
  return [
    { label: 'Takım A', color: colorA, players: createDefaultTeamPlayers(format, 'A', id) },
    { label: 'Takım B', color: colorB, players: createDefaultTeamPlayers(format, 'B', id) },
  ];
}
