// spriteArt.js — generacion procedural de sprites (enemigos, items, proyectiles).
// Cada sprite = {w,h,data:Uint32Array, worldH}. alpha 0 = transparente.
// Silueta legible > detalle: la baja-res + CRT son forgiving (mitiga R1).

import { mulberry32, hashStr } from './mathx.js';
import { rgb, hex, shade, PAL } from './palette.js';

const T = 0; // transparente
const spr = (w, h, worldH = 0.9) => ({ w, h, data: new Uint32Array(w * h), worldH });
const sset = (s, x, y, c) => { if (x >= 0 && x < s.w && y >= 0 && y < s.h) s.data[y * s.w + x] = c; };
function srect(s, x0, y0, w, h, c) { for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) sset(s, x, y, c); }
function sdisc(s, cx, cy, rx, ry, c) {
  for (let y = -ry; y <= ry; y++) for (let x = -rx; x <= rx; x++)
    if ((x * x) / (rx * rx) + (y * y) / (ry * ry) <= 1) sset(s, cx + x, cy + y, c);
}
/** Refleja la mitad izquierda sobre la derecha (simetria con asimetria de grima previa). */
function mirror(s) {
  for (let y = 0; y < s.h; y++) for (let x = 0; x < (s.w >> 1); x++) {
    const c = s.data[y * s.w + x]; if (c) sset(s, s.w - 1 - x, y, c);
  }
}
/** Sombra dura: oscurece el borde inferior-derecho de cada pixel opaco (acabado). */
function outline(s, c = PAL.black) {
  const out = s.data.slice();
  for (let y = 0; y < s.h; y++) for (let x = 0; x < s.w; x++) {
    if (s.data[y * s.w + x]) continue;
    const n = (x > 0 && s.data[y * s.w + x - 1]) || (y > 0 && s.data[(y - 1) * s.w + x]) ||
              (x < s.w - 1 && s.data[y * s.w + x + 1]) || (y < s.h - 1 && s.data[(y + 1) * s.w + x]);
    if (n) out[y * s.w + x] = c;
  }
  s.data.set(out);
}
function grimeSpr(s, rng, amt = 10) {
  for (let i = 0; i < s.data.length; i++) {
    if (!s.data[i]) continue;
    const n = ((rng() * 2 - 1) * amt) | 0;
    const c = s.data[i];
    s.data[i] = rgb(
      Math.max(0, Math.min(255, (c & 255) + n)),
      Math.max(0, Math.min(255, ((c >> 8) & 255) + n)),
      Math.max(0, Math.min(255, ((c >> 16) & 255) + n)),
    );
  }
}

// ---------- IMP (demonio marron-rojo, encorvado, cuernos, lanza fireballs) ----------
// Se dibuja la mitad izquierda (x<15) y mirror() completa la derecha -> silueta simetrica.
function imp(rng, pose) {
  const s = spr(30, 40, 0.95);
  const skin = PAL.flesh[1], dark = PAL.flesh[2], spike = PAL.boneDim, eye = hex('#ffd020'), claw = PAL.bone;
  const atk = pose === 'attack';
  // pierna digitigrada izq (muslo + pantorrilla + garra)
  srect(s, 10, 30, 4, 5, dark);
  srect(s, 9, 34, 3, 4, skin);
  sset(s, 8, 38, claw); sset(s, 9, 38, claw);
  // torso encorvado (se ensancha hacia los hombros)
  for (let y = 15; y < 31; y++) { const w = 3 + ((30 - y) * 0.45 | 0); srect(s, 15 - w, y, w, 1, skin); }
  for (let y = 21; y < 30; y++) srect(s, 12, y, 3, 1, dark); // vientre sombreado
  // hombro con espigas
  sset(s, 6, 15, spike); sset(s, 5, 16, spike); sset(s, 7, 14, spike);
  // brazo
  if (atk) { srect(s, 5, 13, 3, 7, skin); sdisc(s, 4, 11, 4, 4, PAL.blood[2]); sdisc(s, 4, 11, 2, 2, hex('#ff8020')); } // alza + fireball
  else { srect(s, 6, 20, 3, 10, skin); sset(s, 5, 29, claw); sset(s, 6, 30, claw); } // baja + garra
  // cuello + cabeza adelantada
  srect(s, 13, 13, 3, 3, dark);
  sdisc(s, 14, 10, 5, 5, skin);
  srect(s, 11, 10, 5, 2, dark); // ceja prominente
  // cuerno curvo
  sset(s, 11, 5, spike); sset(s, 11, 6, spike); sset(s, 12, 4, spike); sset(s, 13, 3, spike);
  // ojo brillante
  if (pose !== 'pain') { sset(s, 12, 9, eye); sset(s, 13, 9, eye); }
  else { sset(s, 12, 9, PAL.black); }
  // boca con colmillos
  srect(s, 11, 13, 5, 1, PAL.black);
  sset(s, 11, 14, claw); sset(s, 13, 14, claw);
  mirror(s);
  outline(s);
  grimeSpr(s, rng, 8);
  return s;
}

// ---------- ZOMBIE (ex-humano soldado, uniforme verde, con rifle) ----------
// Dibujado explicito simetrico (sin mirror, que glitcheaba el rifle asimetrico).
function zombie(rng, pose) {
  const s = spr(28, 40, 0.95);
  const uni = hex('#5a6a30'), uniD = hex('#3a4a1c'), skin = hex('#b0a080'), boot = PAL.techbase[2], gun = PAL.steel[1], blood = PAL.blood[0];
  srect(s, 9, 31, 4, 6, uniD); srect(s, 15, 31, 4, 6, uniD);      // piernas
  srect(s, 8, 37, 5, 2, boot); srect(s, 15, 37, 5, 2, boot);      // botas
  srect(s, 8, 18, 12, 14, uni);                                   // torso
  srect(s, 8, 18, 12, 2, hex('#6a7a40'));                         // highlight hombros
  srect(s, 12, 20, 4, 10, uniD);                                  // sombra central
  srect(s, 5, 20, 3, 10, uni); srect(s, 20, 20, 3, 10, uni);      // brazos
  sdisc(s, 14, 13, 5, 4, skin);                                   // cara
  srect(s, 9, 8, 10, 4, uniD); srect(s, 9, 8, 10, 1, hex('#6a7a40')); // casco
  sset(s, 12, 13, PAL.black); sset(s, 16, 13, PAL.black);         // ojos huecos
  srect(s, 13, 16, 3, 1, PAL.black);                             // boca
  if (pose === 'pain') srect(s, 11, 10, 6, 3, blood);
  if (pose === 'attack') { srect(s, 18, 20, 3, 5, uni); srect(s, 20, 21, 8, 2, gun); sset(s, 27, 21, PAL.blood[2]); } // rifle
  outline(s);
  grimeSpr(s, rng, 9);
  return s;
}

// ---------- PINKY (demonio rosa, cuadrupedo, mandibula enorme) ----------
function pinky(rng, pose) {
  const s = spr(40, 30, 0.8);
  const body = hex('#c06070'), dark = hex('#7a3848'), tooth = PAL.bone, gum = PAL.blood[0], eye = hex('#ffd020');
  const open = pose === 'attack' ? 6 : 3;
  srect(s, 9, 23, 4, 6, dark); srect(s, 16, 24, 4, 5, dark);
  srect(s, 23, 24, 4, 5, dark); srect(s, 30, 23, 4, 6, dark);     // 4 patas
  sdisc(s, 24, 16, 13, 8, body); sdisc(s, 26, 18, 9, 5, dark);    // cuerpo macizo
  sdisc(s, 13, 15, 9, 8, body);                                   // cabeza grande
  srect(s, 2, 14, 14, open, gum);                                 // mandibula abierta
  for (let x = 3; x < 16; x += 2) { sset(s, x, 14, tooth); sset(s, x, 13 + open, tooth); }
  srect(s, 2, 13, 14, 1, dark); srect(s, 2, 14 + open, 14, 1, dark); // labios
  sset(s, 14, 9, eye); sset(s, 17, 9, eye);                       // ojos
  sset(s, 11, 6, PAL.boneDim); sset(s, 18, 6, PAL.boneDim);       // cuernitos
  if (pose === 'pain') srect(s, 10, 16, 12, 3, PAL.blood[1]);
  outline(s);
  grimeSpr(s, rng, 9);
  return s;
}

// ---------- corpse / gib ----------
function corpse(rng, w = 30) {
  const s = spr(w, 40, 0.3);
  srect(s, 4, 34, w - 8, 4, PAL.blood[0]); // charco
  sdisc(s, w >> 1, 35, (w >> 1) - 3, 3, PAL.blood[1]);
  for (let i = 0; i < 6; i++) sset(s, (4 + rng() * (w - 8)) | 0, 33 + (rng() * 4 | 0), PAL.flesh[1]);
  outline(s);
  return s;
}

// ---------- proyectiles ----------
function ball(rng, core, glow, size = 12) {
  const s = spr(size, size, 0.3);
  const c = size >> 1;
  sdisc(s, c, c, c - 1, c - 1, glow);
  sdisc(s, c, c, c - 3, c - 3, core);
  sset(s, c - 1, c - 1, PAL.bone);
  grimeSpr(s, rng, 14);
  return s;
}

// ---------- pickups ----------
function medkit(rng) { const s = spr(16, 14, 0.4); srect(s, 1, 2, 14, 11, hex('#d8d0c0')); srect(s, 1, 2, 14, 2, PAL.blood[0]); srect(s, 6, 5, 4, 6, PAL.blood[1]); srect(s, 4, 7, 8, 2, PAL.blood[1]); outline(s); return s; }
function stim(rng) { const s = spr(14, 12, 0.35); srect(s, 1, 2, 12, 9, hex('#c8c0b0')); srect(s, 5, 4, 4, 5, PAL.blood[1]); outline(s); return s; }
function armorPk(rng, col) { const s = spr(16, 16, 0.45); for (let y = 0; y < 13; y++) { const w = 13 - Math.abs(y - 4) * 0.6 | 0; srect(s, 8 - (w >> 1), 2 + y, w, 1, y < 3 ? shade(col, 1.3) : col); } srect(s, 5, 4, 6, 4, shade(col, 0.6)); outline(s); return s; }
function clip(rng) { const s = spr(12, 8, 0.25); srect(s, 1, 1, 10, 6, PAL.steel[1]); srect(s, 1, 1, 10, 1, PAL.boneDim); outline(s); return s; }
function shellbox(rng) { const s = spr(16, 10, 0.3); srect(s, 1, 1, 14, 8, hex('#6a3a18')); for (let i = 0; i < 4; i++) sset(s, 3 + i * 3, 2, PAL.blood[2]); outline(s); return s; }
function gun(rng, col, len = 16) { const s = spr(len + 4, 12, 0.4); srect(s, 2, 5, len, 3, PAL.steel[0]); srect(s, 2, 8, 6, 3, hex('#3a2a1a')); srect(s, len - 2, 4, 4, 2, col); outline(s); return s; }
function keycard(rng) { const s = spr(10, 14, 0.4); srect(s, 1, 1, 8, 12, PAL.blood[1]); srect(s, 2, 3, 6, 3, PAL.bone); outline(s); return s; }

export function buildSprites(seedStr = 'hell-brown-93') {
  const rng = mulberry32(hashStr(seedStr));
  const mk = (fn, ...a) => fn(rng, ...a);
  return {
    enemies: {
      imp: { walk: [mk(imp, 'walk0'), mk(imp, 'walk1')], attack: mk(imp, 'attack'), pain: mk(imp, 'pain'), dead: mk(corpse, 30) },
      zombie: { walk: [mk(zombie, 'walk0'), mk(zombie, 'walk1')], attack: mk(zombie, 'attack'), pain: mk(zombie, 'pain'), dead: mk(corpse, 28) },
      pinky: { walk: [mk(pinky, 'walk0'), mk(pinky, 'walk1')], attack: mk(pinky, 'attack'), pain: mk(pinky, 'pain'), dead: mk(corpse, 40) },
    },
    projectiles: {
      fireball: [ball(rng, PAL.blood[2], PAL.blood[0], 12), ball(rng, hex('#ff8020'), PAL.blood[1], 14)],
      plasma: [ball(rng, hex('#8af0ff'), hex('#2080ff'), 10), ball(rng, hex('#c0ffff'), hex('#40a0ff'), 12)],
    },
    pickups: {
      health: medkit(rng), stim: stim(rng),
      armor: armorPk(rng, PAL.toxic[0]), megaarmor: armorPk(rng, hex('#3060c0')),
      ammo: clip(rng), shells: shellbox(rng),
      shotgun: gun(rng, PAL.blood[2], 18), chaingun: gun(rng, PAL.boneDim, 16), plasma: gun(rng, hex('#40a0ff'), 16),
      key: keycard(rng),
    },
  };
}
