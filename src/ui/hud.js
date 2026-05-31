// hud.js (ui) — status bar estilo STBAR de DOOM con fuente pixel roja procedural.
// Sectores: AMMO · HEALTH · ARMS · FACE · ARMOR · KEYS · resumen de municion.

import { drawFace, faceState } from './face.js';
import { WEAPONS } from '../game/weapons.js';

// Fuente bitmap 3x5 (numeros + simbolos). Slab dura, sin anti-alias (DESIGN.md).
const G = {
  '0': ['111', '101', '101', '101', '111'], '1': ['010', '010', '010', '010', '010'],
  '2': ['111', '001', '111', '100', '111'], '3': ['111', '001', '111', '001', '111'],
  '4': ['101', '101', '111', '001', '001'], '5': ['111', '100', '111', '001', '111'],
  '6': ['111', '100', '111', '101', '111'], '7': ['111', '001', '010', '010', '010'],
  '8': ['111', '101', '111', '101', '111'], '9': ['111', '101', '111', '001', '111'],
  '%': ['101', '001', '010', '100', '101'], '/': ['001', '001', '010', '100', '100'], ' ': ['000', '000', '000', '000', '000'],
};
const BONE = '#d8c8a0', RED = '#d22020', RED_HOT = '#ff3a1a', GREEN = '#6abe30',
  PANEL = '#2a1d12', PANEL_H = '#4a3220', LABEL = '#8a7048', DIM = '#5a4a30';

function num(ctx, x, y, str, s, color) {
  ctx.fillStyle = color;
  let cx = x;
  for (const ch of String(str)) {
    const g = G[ch] || G[' '];
    for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) if (g[r][c] === '1') ctx.fillRect(cx + c * s, y + r * s, s, s);
    cx += 4 * s;
  }
}
function label(ctx, t, x, y) { ctx.fillStyle = LABEL; ctx.font = '6px "Courier New", monospace'; ctx.textBaseline = 'top'; ctx.fillText(t, x, y); }
function bevel(ctx, x, y, w, h) {
  ctx.fillStyle = '#160f08'; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#3a2a18'; ctx.fillRect(x, y, w, 1); ctx.fillStyle = '#0a0604'; ctx.fillRect(x, y + h - 1, w, 1);
}

export function drawHud(ctx, world, W, VH, H) {
  const p = world.player;
  const y0 = VH, bh = H - VH;
  ctx.fillStyle = PANEL; ctx.fillRect(0, y0, W, bh);
  ctx.fillStyle = PANEL_H; ctx.fillRect(0, y0, W, 1);
  ctx.fillStyle = '#160f08'; ctx.fillRect(0, y0 + 1, W, 1);

  // AMMO
  const d = WEAPONS[p.current];
  const ammo = d.ammo ? p.ammo[d.ammo] : '';
  label(ctx, 'AMMO', 6, y0 + 4);
  num(ctx, 8, y0 + 12, ammo === '' ? '  ' : ammo, 4, RED);

  // HEALTH
  label(ctx, 'HEALTH', 46, y0 + 4);
  num(ctx, 46, y0 + 12, (p.health | 0) + '%', 4, p.health <= 30 ? RED_HOT : BONE);

  // ARMS grid
  label(ctx, 'ARMS', 100, y0 + 4);
  const slots = [['1', 'fist'], ['2', 'pistol'], ['3', 'shotgun'], ['4', 'chaingun'], ['5', 'plasma']];
  slots.forEach(([n, k], i) => {
    const owned = p.weapons[k], cur = p.current === k;
    num(ctx, 100 + (i % 3) * 12, y0 + 12 + ((i / 3) | 0) * 9, n, 2, cur ? RED_HOT : owned ? BONE : DIM);
  });

  // FACE (ancla central)
  bevel(ctx, 143, y0, 32, 32);
  drawFace(ctx, 144, y0 + 1, faceState(p, world.time));

  // ARMOR
  label(ctx, 'ARMOR', 182, y0 + 4);
  num(ctx, 182, y0 + 12, (p.armor | 0) + '%', 4, GREEN);

  // KEYS
  label(ctx, 'KEYS', 236, y0 + 4);
  if (p.keys.has('red')) { ctx.fillStyle = RED; ctx.fillRect(236, y0 + 13, 7, 10); ctx.fillStyle = '#000'; ctx.fillRect(238, y0 + 15, 3, 3); }
  else { ctx.fillStyle = DIM; ctx.fillRect(236, y0 + 13, 7, 10); }

  // resumen de municion (derecha)
  ctx.font = '6px "Courier New", monospace'; ctx.textBaseline = 'top';
  const lines = [['BUL', p.ammo.bullets, p.current === 'pistol' || p.current === 'chaingun'],
                 ['SHL', p.ammo.shells, p.current === 'shotgun'],
                 ['CEL', p.ammo.cells, p.current === 'plasma']];
  lines.forEach(([t, v, hot], i) => {
    ctx.fillStyle = hot ? RED : LABEL; ctx.fillText(t, 266, y0 + 5 + i * 9);
    ctx.fillStyle = hot ? BONE : DIM; ctx.fillText(String(v), 288, y0 + 5 + i * 9);
  });
}

/** Mensajes efimeros arriba-izquierda del viewport. */
export function drawMessages(ctx, world) {
  ctx.font = '7px "Courier New", monospace'; ctx.textBaseline = 'top';
  world.messages.forEach((m, i) => {
    ctx.fillStyle = '#000'; ctx.fillText(m.text, 5, 5 + i * 9);
    ctx.fillStyle = m.ttl < 0.6 ? '#9a8a5a' : '#e8d8a8'; ctx.fillText(m.text, 4, 4 + i * 9);
  });
}
