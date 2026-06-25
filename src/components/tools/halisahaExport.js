/** Halı saha dizilişini PNG olarak indirir (canvas) */

import { SITE_CONFIG } from '../../constants/seo';
import { getPlayerJerseyColor, colorToTextContrast } from './halisahaFormations';

const SITE_DOMAIN = SITE_CONFIG.url.replace(/^https?:\/\//, '');

const ROLE_LABELS = {
  KL: 'Kaleci',
  DF: 'Defans',
  OS: 'Orta Saha',
  FV: 'Forvet',
};

const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

let logoCache = null;

function loadLogo() {
  if (logoCache) return Promise.resolve(logoCache);
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      logoCache = img;
      resolve(img);
    };
    img.onerror = () => resolve(null);
    img.src = '/logo.svg';
  });
}

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

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

function drawCaptainBadge(ctx, px, py, radius) {
  const badgeR = radius * 0.42;
  const bx = px + radius * 0.65;
  const by = py - radius * 0.65;

  ctx.beginPath();
  ctx.arc(bx, by, badgeR, 0, Math.PI * 2);
  ctx.fillStyle = '#1c1917';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#fb923c';
  ctx.font = `800 ${Math.max(8, badgeR * 1.1)}px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('C', bx, by + 0.5);
}

function drawPlayer(ctx, player, teamColor, field, playerRadius = 22, fontSize = 18) {
  const { x, y, w, h } = field;
  const px = x + (player.x / 100) * w;
  const py = y + (player.y / 100) * h;
  const jerseyColor = getPlayerJerseyColor(player, teamColor);

  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 2;

  ctx.beginPath();
  ctx.arc(px, py, playerRadius, 0, Math.PI * 2);
  ctx.fillStyle = jerseyColor;
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = playerRadius > 18 ? 3 : 2.5;
  ctx.stroke();

  if (player.isCaptain) {
    ctx.shadowColor = 'transparent';
    drawCaptainBadge(ctx, px, py, playerRadius);
  }

  ctx.shadowColor = 'transparent';

  const label = player.name.trim()
    ? player.name.trim().split(' ')[0]
    : player.role;

  ctx.font = `bold ${fontSize}px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur = 4;
  ctx.fillText(label, px, py + playerRadius + 4, field.w * 0.35);
  ctx.shadowColor = 'transparent';
}

function drawBackground(ctx, width, height) {
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#0c0a09');
  bg.addColorStop(0.4, '#14532d');
  bg.addColorStop(1, '#0c0a09');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
}

function drawMetaChip(ctx, text, x, y) {
  ctx.font = `600 12px ${FONT}`;
  const padX = 12;
  const chipW = ctx.measureText(text).width + padX * 2;
  roundRect(ctx, x, y, chipW, 28, 14);
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + padX, y + 14);
  return chipW + 8;
}

function drawHeader(ctx, width, logo, { title, subtitle, chips = [] }) {
  let chipX = 48;
  const chipY = 96;
  chips.forEach((chip) => {
    chipX += drawMetaChip(ctx, chip, chipX, chipY);
  });

  ctx.fillStyle = '#fed7aa';
  ctx.font = `600 12px ${FONT}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('DİZİLİŞ', 48, 38);

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold 30px ${FONT}`;
  ctx.fillText(title, 48, 72);

  if (subtitle) {
    ctx.fillStyle = 'rgba(255,255,255,0.72)';
    ctx.font = `500 14px ${FONT}`;
    ctx.fillText(subtitle, 48, 132, width - 200);
  }

  if (logo) {
    const logoH = 40;
    const logoW = (logo.width / logo.height) * logoH;
    ctx.drawImage(logo, width - 48 - logoW, 28, logoW, logoH);
  }
}

function drawTeamBadge(ctx, label, color, x, y) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold 20px ${FONT}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x + 16, y);
}

function rosterCardHeight(playerCount, hasTitle = true) {
  const rowH = 34;
  const pad = 14;
  const headerH = hasTitle ? 36 : 0;
  return headerH + playerCount * rowH + pad * 2;
}

function drawPlayerRoster(ctx, players, teamColor, x, y, w, title) {
  const rowH = 34;
  const pad = 14;
  const headerH = title ? 36 : 0;
  const cardH = rosterCardHeight(players.length, Boolean(title));

  roundRect(ctx, x, y, w, cardH, 14);
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1;
  ctx.stroke();

  if (title) {
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.font = `700 10px ${FONT}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(title.toUpperCase(), x + pad, y + 22);
  }

  const startY = y + pad + headerH;

  players.forEach((player, i) => {
    const rowY = startY + i * rowH + rowH / 2;
    const jerseyColor = getPlayerJerseyColor(player, teamColor);

    ctx.fillStyle = jerseyColor;
    roundRect(ctx, x + pad, rowY - 11, 36, 22, 6);
    ctx.fill();
    ctx.fillStyle = colorToTextContrast(jerseyColor);
    ctx.font = `800 10px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(player.role, x + pad + 18, rowY);

    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = `500 12px ${FONT}`;
    const roleLabel = ROLE_LABELS[player.role] || player.role;
    ctx.fillText(player.isCaptain ? `${roleLabel} · Kaptan` : roleLabel, x + pad + 48, rowY);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = `600 13px ${FONT}`;
    const name = player.name.trim() || '—';
    ctx.fillText(player.isCaptain ? `${name} (C)` : name, x + w - pad, rowY);
  });

  return cardH;
}

function drawFooter(ctx, width, height, logo) {
  const footerH = 64;
  const y = height - footerH;

  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, y, width, footerH);

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(width, y);
  ctx.stroke();

  let textX = 48;

  if (logo) {
    const logoH = 36;
    const logoW = (logo.width / logo.height) * logoH;
    ctx.drawImage(logo, 48, y + (footerH - logoH) / 2, logoW, logoH);
    textX = 48 + logoW + 14;
  }

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 14px ${FONT}`;
  ctx.fillText(SITE_CONFIG.name, textX, y + footerH / 2 - 8);

  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = `500 11px ${FONT}`;
  ctx.fillText(SITE_DOMAIN, textX, y + footerH / 2 + 10);

  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font = `500 11px ${FONT}`;
  const dateStr = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  ctx.fillText(dateStr, width - 48, y + footerH / 2);
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

export function renderSingleTeamCanvas(options) {
  const {
    teamLabel,
    format,
    tacticLabel,
    tacticDesc,
    color,
    players,
    logo,
  } = options;

  const W = 720;
  const field = { x: 120, y: 175, w: 480, h: Math.round(480 * (105 / 68)) };
  const rosterH = rosterCardHeight(players.length);
  const H = field.y + field.h + 28 + rosterH + 88;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas desteklenmiyor');

  drawBackground(ctx, W, H);

  drawHeader(ctx, W, logo, {
    title: teamLabel,
    subtitle: tacticDesc || '',
    chips: [`${format}v${format}`, tacticLabel],
  });

  drawTeamBadge(ctx, 'Kadro', color, 48, 158);

  drawPitch(ctx, field);
  players.forEach((p) => drawPlayer(ctx, p, color, field));

  const rosterY = field.y + field.h + 28;
  drawPlayerRoster(ctx, players, color, 48, rosterY, W - 96, 'Oyuncular');

  drawFooter(ctx, W, H, logo);
  return canvas;
}

export function renderBothTeamsCanvas(teams, meta, logo) {
  const W = 1320;
  const maxPlayers = Math.max(...teams.slice(0, 2).map((t) => t.players.length), 1);
  const fieldH = 680;
  const fieldW = Math.round(fieldH * (68 / 105));
  const gap = 40;
  const totalW = fieldW * 2 + gap;
  const startX = (W - totalW) / 2;
  const fieldY = 175;
  const rosterH = rosterCardHeight(maxPlayers);
  const H = fieldY + fieldH + 20 + rosterH + 88;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas desteklenmiyor');

  drawBackground(ctx, W, H);

  drawHeader(ctx, W, logo, {
    title: `${meta.format}v${meta.format} Maç Dizilişi`,
    subtitle: meta.tacticDesc || '',
    chips: [meta.tacticLabel, `${meta.format}v${meta.format}`],
  });

  const fields = [
    { x: startX, y: fieldY, w: fieldW, h: fieldH },
    { x: startX + fieldW + gap, y: fieldY, w: fieldW, h: fieldH },
  ];

  teams.slice(0, 2).forEach((team, i) => {
    const field = fields[i];
    drawTeamBadge(ctx, team.label, team.color, field.x, field.y - 22);
    drawPitch(ctx, field);
    team.players.forEach((p) => drawPlayer(ctx, p, team.color, field, 15, 13));

    const rosterY = field.y + field.h + 20;
    drawPlayerRoster(ctx, team.players, team.color, field.x, rosterY, field.w, 'Kadro');
  });

  drawFooter(ctx, W, H, logo);
  return canvas;
}

export async function downloadLineupPng(options) {
  const logo = await loadLogo();
  const canvas = renderSingleTeamCanvas({ ...options, logo });
  const slug = slugify(options.teamLabel || 'takim');
  return triggerDownload(canvas, `dizilis-${slug}-${options.format}v${options.format}.png`);
}

export async function downloadBothTeamsLineupPng(teams, meta) {
  const logo = await loadLogo();
  const canvas = renderBothTeamsCanvas(teams, meta, logo);
  return triggerDownload(canvas, `dizilis-${meta.format}v${meta.format}-iki-takim.png`);
}
