// face.js (ui) — la cara reactiva del marine (wow-02). Dibujada por codigo.
// Reacciona a: nivel de vida (5 etapas), direccion del daño (mirada), y eventos
// (ouch / evil al recoger / god / muerta). El ancla emocional del HUD.

import { angleDelta } from '../engine/mathx.js';

const SKIN = '#c89a6a', SKIN_D = '#a06a3a', HAIR = '#3a2410', HAIR_H = '#5a3a1c',
  EYE = '#e8e0d0', PUP = '#1a1a1a', BLOOD = '#a01010', BLOOD2 = '#d22020',
  MOUTH = '#2a0c0c', TEETH = '#d8c8a0';
const rect = (ctx, x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x | 0, y | 0, w | 0, h | 0); };

/** Deriva el estado de la cara desde el player + tiempo (para la mirada idle). */
export function faceState(player, time = 0) {
  if (player.dead) return { stage: 4, look: 0, expr: 'dead' };
  const h = player.health;
  const stage = h > 80 ? 0 : h > 60 ? 1 : h > 40 ? 2 : h > 20 ? 3 : 4;
  let look;
  if (player.damageFlash > 0.25) {
    const rel = angleDelta(player.angle, player.lastDamageDir);
    look = rel > 0.4 ? 1 : rel < -0.4 ? -1 : 0;
  } else {
    look = [-1, 0, 1, 0][(time * 0.8 | 0) % 4]; // mirada idle ciclica
  }
  let expr = 'normal';
  if (player.invuln > 0) expr = 'god';
  else if (player.damageFlash > 0.6) expr = 'ouch';
  else if (player.pickupFlash > 0.3) expr = 'evil';
  return { stage, look, expr };
}

export function drawFace(ctx, ox, oy, state) {
  const { stage = 0, look = 0, expr = 'normal' } = state;
  rect(ctx, ox, oy, 30, 30, '#160f08');
  rect(ctx, ox + 1, oy + 1, 28, 28, '#0c0805');
  if (expr === 'dead') return drawDead(ctx, ox, oy);

  const x = ox + 3, y = oy + 3;
  // pelo
  rect(ctx, x + 3, y, 18, 5, HAIR);
  rect(ctx, x + 3, y, 18, 2, HAIR_H);
  rect(ctx, x + 1, y + 2, 2, 12, HAIR); rect(ctx, x + 21, y + 2, 2, 12, HAIR);
  // cara
  rect(ctx, x + 3, y + 4, 18, 17, SKIN);
  rect(ctx, x + 3, y + 18, 18, 3, SKIN_D);
  // cejas (mas bajas/duras con el daño)
  const browH = stage > 2 ? 2 : 1;
  rect(ctx, x + 4, y + 6, 6, browH, HAIR);
  rect(ctx, x + 14, y + 6, 6, browH, HAIR);
  // ojos
  rect(ctx, x + 5, y + 7, 5, 4, EYE); rect(ctx, x + 14, y + 7, 5, 4, EYE);
  const ex = look * 2;
  rect(ctx, x + 7 + ex, y + 8, 2, 2, expr === 'god' ? '#80e0ff' : PUP);
  rect(ctx, x + 16 + ex, y + 8, 2, 2, expr === 'god' ? '#80e0ff' : PUP);
  // nariz
  rect(ctx, x + 11, y + 10, 2, 5, SKIN_D);
  // boca
  if (expr === 'ouch') { rect(ctx, x + 8, y + 16, 8, 4, MOUTH); rect(ctx, x + 9, y + 16, 6, 1, TEETH); }
  else if (expr === 'evil') { rect(ctx, x + 7, y + 17, 11, 2, MOUTH); rect(ctx, x + 16, y + 16, 2, 1, MOUTH); }
  else { rect(ctx, x + 8, y + 17, 8, 2, MOUTH); }
  // bigote/sombra
  rect(ctx, x + 8, y + 15, 8, 1, SKIN_D);

  // sangre creciente por etapa
  if (stage >= 1) rect(ctx, x + 16, y + 2, 2, 7, BLOOD);
  if (stage >= 2) { rect(ctx, x + 5, y + 4, 2, 9, BLOOD); rect(ctx, x + 4, y + 11, 4, 2, BLOOD2); }
  if (stage >= 3) { rect(ctx, x + 12, y + 1, 3, 9, BLOOD2); rect(ctx, x + 9, y + 12, 3, 3, BLOOD); }
  if (stage >= 4) { rect(ctx, x + 3, y + 4, 18, 2, BLOOD2); rect(ctx, x + 13, y + 7, 5, 4, BLOOD); rect(ctx, x + 6, y + 13, 9, 2, BLOOD); }
}

function drawDead(ctx, ox, oy) {
  const x = ox + 3, y = oy + 3;
  rect(ctx, x + 3, y + 5, 18, 16, '#8a5a3a');
  rect(ctx, x + 3, y + 4, 18, 4, BLOOD);
  rect(ctx, x + 5, y + 9, 12, 3, '#7a0c0c');
  // ojos en X
  rect(ctx, x + 6, y + 9, 4, 1, '#000'); rect(ctx, x + 7, y + 8, 1, 3, '#000');
  rect(ctx, x + 14, y + 9, 4, 1, '#000'); rect(ctx, x + 15, y + 8, 1, 3, '#000');
  rect(ctx, x + 8, y + 16, 8, 2, '#2a0606');
  rect(ctx, x + 2, y + 18, 20, 3, BLOOD); // chorrea
}
