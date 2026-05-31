// screens.js (ui) — title, game-over, victory, pausa. Logo DOOM-idiom.

import { drawCentered } from './font.js';

export function drawTitle(ctx, W, H, t) {
  ctx.fillStyle = '#0a0806'; ctx.fillRect(0, 0, W, H);
  const grd = ctx.createLinearGradient(0, H * 0.45, 0, H);
  grd.addColorStop(0, '#0a0806'); grd.addColorStop(1, '#3a0c08');
  ctx.fillStyle = grd; ctx.fillRect(0, (H * 0.45) | 0, W, H);

  drawCentered(ctx, W / 2, 34, 'DOOM', 9, '#d22020', '#3a0606');
  drawCentered(ctx, W / 2, 88, 'RECREATED', 2, '#8a7048');
  drawCentered(ctx, W / 2, 102, 'AEGIS  //  LUMEN', 1, '#6abe30');

  if ((t * 1.6 | 0) % 2 === 0) drawCentered(ctx, W / 2, 128, 'PRESS ANY KEY', 2, '#ff3a1a', '#000');

  drawCentered(ctx, W / 2, 150, 'WASD MOVE   MOUSE LOOK   CLICK FIRE', 1, '#a89878');
  drawCentered(ctx, W / 2, 160, '1-5 WEAPONS   SHIFT RUN   E USE   TAB MAP', 1, '#a89878');
  drawCentered(ctx, W / 2, 178, 'CLICK TO LOCK MOUSE   ·   M MUTE', 1, '#6a5a3a');
}

export function drawEnd(ctx, W, VH, world, victory, t) {
  ctx.fillStyle = 'rgba(8,3,2,0.74)'; ctx.fillRect(0, 0, W, VH);
  drawCentered(ctx, W / 2, 28, victory ? 'VICTORY' : 'YOU DIED', 6, '#d22020', '#1a0303');
  drawCentered(ctx, W / 2, 78, 'KILLS ' + world.kills + ' / ' + world.totalKills, 2, '#d8c8a0');
  const m = (world.time / 60) | 0, s = ('' + ((world.time % 60) | 0)).padStart(2, '0');
  drawCentered(ctx, W / 2, 94, 'TIME ' + m + ':' + s, 2, '#d8c8a0');
  if ((t * 1.6 | 0) % 2 === 0) drawCentered(ctx, W / 2, 126, 'PRESS ANY KEY', 2, '#ff3a1a', '#000');
}

export function drawPaused(ctx, W, VH) {
  ctx.fillStyle = 'rgba(8,3,2,0.6)'; ctx.fillRect(0, 0, W, VH);
  drawCentered(ctx, W / 2, VH / 2 - 12, 'PAUSED', 5, '#d8c8a0', '#000');
  drawCentered(ctx, W / 2, VH / 2 + 18, 'P TO RESUME', 1, '#a89878');
}
