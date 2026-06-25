/** Halı saha dizilişini PNG olarak indirir (canvas) */

const H = 1040;
const SINGLE_W = 720;
const DUAL_W = 1320;

function drawPitch(ctx, field) {
  const { x, y, w, h } = field;
  const stripeH = h / 12;

  for (let i = 0; i < 12; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#3d9b4a' : '#47ad55';
    ctx.fillRect(x, y + i * stripeH, w, stripeH);
  }

  const grad = ctx.createLinearGradient(x, y, x, y + h);
  grad.addColorStop(0, 'rgba(45,138,62,0.15)');
  grad.addColorStop(0.5, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(20,83,45,0.2)');
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);

  ctx.strokeStyle = 'rgba(248,250,252,0.95)';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);

  const midY = y + h / 2;
  ctx.beginPath();
  ctx.moveTo(x, midY);
  ctx.lineTo(x + w, midY);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x + w / 2, midY, w * 0.11, 0, Math.PI * 2);
  ctx.stroke();

  const boxW = w * 0.38;
  const boxH = h * 0.16;
  const boxX = x + (w - boxW) / 2;

  ctx.strokeRect(boxX, y + h - boxH, boxW, boxH);
  ctx.strokeRect(boxX, y + h - boxH * 0.38, boxW * 0.55, boxH * 0.38);
  ctx.strokeRect(boxX, y, boxW, boxH);
  ctx.strokeRect(boxX, y + boxH * 0.62, boxW * 0.55, boxH * 0.38);

  ctx.fillStyle = 'rgba(248,250,252,0.85)';
  ctx.beginPath();
  ctx.arc(x + w / 2, y + h - boxH * 0.55, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + w / 2, y + boxH * 0.45, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawPlayer(ctx, player, color, field, playerRadius = 22, fontSize = 18) {
  const { x, y, w, h } = field;
  const px = x + (player.x / 100) * w;
  const py = y + (player.y / 100) * h;

  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 2;

  ctx.beginPath();
  ctx.arc(px, py, playerRadius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = playerRadius > 18 ? 3 : 2.5;
  ctx.stroke();

  ctx.shadowColor = 'transparent';

  const label = player.name.trim()
    ? player.name.trim().split(' ')[0]
    : player.role;

  ctx.font = `bold ${fontSize}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur = 4;
  ctx.fillText(label, px, py + playerRadius + 4, field.w * 0.35);
  ctx.shadowColor = 'transparent';
}

function drawBackground(ctx, width) {
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#0c0a09');
  bg.addColorStop(0.45, '#14532d');
  bg.addColorStop(1, '#0c0a09');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, H);
}

function drawFooter(ctx, width) {
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font = '500 12px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('nasiloynanir.com', width - 48, H - 36);
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function singleFieldRect() {
  return { x: 48, y: 120, w: 624, h: 864 };
}

function dualFieldRects() {
  const fieldH = 820;
  const fieldW = Math.round(fieldH * (68 / 105));
  const gap = 36;
  const totalFieldsW = fieldW * 2 + gap;
  const startX = (DUAL_W - totalFieldsW) / 2;
  const fieldY = 130;

  return [
    { x: startX, y: fieldY, w: fieldW, h: fieldH },
    { x: startX + fieldW + gap, y: fieldY, w: fieldW, h: fieldH },
  ];
}

function triggerDownload(canvas, filename) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Görsel oluşturulamadı'));
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        resolve();
      },
      'image/png',
      1
    );
  });
}

export function renderSingleTeamCanvas({
  teamLabel,
  format,
  tacticLabel,
  pitchTypeLabel,
  color,
  players,
}) {
  const canvas = document.createElement('canvas');
  canvas.width = SINGLE_W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas desteklenmiyor');

  drawBackground(ctx, SINGLE_W);

  ctx.fillStyle = '#fed7aa';
  ctx.font = '600 13px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('DİZİLİŞ', 48, 44);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px system-ui, sans-serif';
  ctx.fillText(teamLabel, 48, 72);

  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = '500 16px system-ui, sans-serif';
  ctx.fillText(
    `${format}v${format} · ${tacticLabel} · ${pitchTypeLabel}`,
    48,
    98
  );

  const field = singleFieldRect();
  drawPitch(ctx, field);
  players.forEach((p) => drawPlayer(ctx, p, color, field));

  drawFooter(ctx, SINGLE_W);
  return canvas;
}

export function renderBothTeamsCanvas(teams, meta) {
  const canvas = document.createElement('canvas');
  canvas.width = DUAL_W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas desteklenmiyor');

  drawBackground(ctx, DUAL_W);

  ctx.fillStyle = '#fed7aa';
  ctx.font = '600 13px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DİZİLİŞ', DUAL_W / 2, 44);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px system-ui, sans-serif';
  ctx.fillText(`${meta.format}v${meta.format} · ${meta.tacticLabel}`, DUAL_W / 2, 72);

  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = '500 15px system-ui, sans-serif';
  ctx.fillText(meta.pitchTypeLabel, DUAL_W / 2, 98);

  const fields = dualFieldRects();

  teams.slice(0, 2).forEach((team, i) => {
    const field = fields[i];
    const labelY = field.y - 14;

    ctx.textAlign = 'center';
    ctx.fillStyle = team.color;
    ctx.beginPath();
    ctx.arc(field.x + field.w / 2 - 52, labelY - 4, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText(team.label, field.x + field.w / 2, labelY);

    drawPitch(ctx, field);
    team.players.forEach((p) => drawPlayer(ctx, p, team.color, field, 16, 14));
  });

  drawFooter(ctx, DUAL_W);
  return canvas;
}

export function downloadLineupPng(options) {
  const canvas = renderSingleTeamCanvas(options);
  const slug = slugify(options.teamLabel || 'takim');
  return triggerDownload(canvas, `dizilis-${slug}-${options.format}v${options.format}.png`);
}

export function downloadBothTeamsLineupPng(teams, meta) {
  const canvas = renderBothTeamsCanvas(teams, meta);
  return triggerDownload(canvas, `dizilis-${meta.format}v${meta.format}-iki-takim.png`);
}
