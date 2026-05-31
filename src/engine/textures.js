// textures.js — generacion procedural de texturas (wow-03 grima).
// Cada textura es {w,h,data:Uint32Array}. Seed -> mismas texturas (reproducible).
// Indexadas por id de celda del grid (1..8); floor/ceil aparte.

import { mulberry32, hashStr, clamp } from './mathx.js';
import { rgb, hex, shade, mix, jitter, PAL, bayer } from './palette.js';

const W = 64, H = 64;
const makeTex = () => ({ w: W, h: H, data: new Uint32Array(W * H) });
const put = (t, x, y, c) => { if (x >= 0 && x < W && y >= 0 && y < H) t.data[y * W + x] = c; };
const vline = (t, x, y0, y1, c) => { for (let y = y0; y < y1; y++) put(t, x, y, c); };
const hline = (t, x0, x1, y, c) => { for (let x = x0; x < x1; x++) put(t, x, y, c); };
const fill = (t, c) => t.data.fill(c);

/** Pasada final de grano + dither ordenado: la firma "sucia" (wow-03). */
function grime(t, rng, amt = 12) {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const n = (((rng() * 2 - 1) * amt) + (bayer(x, y) - 0.5) * amt) | 0;
      t.data[i] = jitter(t.data[i], n);
    }
  }
}

/** Mancha circular de oscurecimiento (suciedad/daño). */
function blot(t, rng, cx, cy, r, f) {
  for (let y = -r; y <= r; y++)
    for (let x = -r; x <= r; x++)
      if (x * x + y * y <= r * r && rng() > 0.35) {
        const i = ((cy + y) & 63) * W + ((cx + x) & 63);
        t.data[i] = shade(t.data[i], f);
      }
}

function texTechMetal(rng) {
  const t = makeTex();
  const base = PAL.techbase[0];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++)
    t.data[y * W + x] = shade(base, 0.78 + 0.22 * (1 - y / H));
  for (let y = 0; y < H; y += 16) { hline(t, 0, W, y, PAL.techbase[2]); hline(t, 0, W, y + 1, shade(base, 1.18)); }
  for (let x = 0; x < W; x += 32) vline(t, x, 0, H, PAL.techbase[2]);
  for (let y = 8; y < H; y += 16) for (let x = 8; x < W; x += 16) {
    put(t, x, y, PAL.boneDim); put(t, x + 1, y, PAL.techbase[2]); put(t, x, y + 1, PAL.techbase[2]);
  }
  const stains = 3 + (rng() * 3 | 0);
  for (let s = 0; s < stains; s++) blot(t, rng, rng() * W | 0, rng() * H | 0, 2 + (rng() * 4 | 0), 0.62);
  grime(t, rng, 11);
  return t;
}

function texConcrete(rng) {
  const t = makeTex();
  const base = hex('#5a5048');
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++)
    t.data[y * W + x] = shade(base, 0.85 + 0.15 * rng());
  // cracks ramificadas
  const cracks = 2 + (rng() * 2 | 0);
  for (let c = 0; c < cracks; c++) {
    let x = rng() * W | 0, y = rng() * H | 0, dir = rng() * 6.28;
    const len = 24 + (rng() * 30 | 0);
    for (let i = 0; i < len; i++) {
      put(t, x, y, PAL.black); put(t, x + 1, y, shade(base, 0.6));
      dir += (rng() - 0.5) * 0.8; x = (x + Math.cos(dir)) | 0; y = (y + Math.sin(dir)) | 0;
      if (x < 0 || x >= W || y < 0 || y >= H) break;
    }
  }
  grime(t, rng, 14);
  return t;
}

function texFlesh(rng) {
  const t = makeTex();
  const base = PAL.flesh[0];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const v = Math.sin(x * 0.2) * Math.cos(y * 0.18);
    t.data[y * W + x] = mix(base, PAL.flesh[2], 0.5 + 0.5 * v);
  }
  // venas pulsantes
  const veins = 5 + (rng() * 4 | 0);
  for (let v = 0; v < veins; v++) {
    let x = rng() * W | 0, y = rng() * H | 0, dir = rng() * 6.28;
    for (let i = 0; i < 30; i++) {
      put(t, x, y, PAL.flesh[2]); put(t, x, y + 1, shade(PAL.flesh[1], 1.1));
      dir += (rng() - 0.5) * 1.1; x = (x + Math.cos(dir) * 1.4) | 0; y = (y + Math.sin(dir) * 1.4) | 0;
      if (x < 0 || x >= W || y < 0 || y >= H) break;
    }
  }
  // nodulos
  for (let n = 0; n < 6; n++) { const cx = rng() * W | 0, cy = rng() * H | 0; blot(t, rng, cx, cy, 3, 1.25); put(t, cx, cy, PAL.blood[2]); }
  grime(t, rng, 10);
  return t;
}

function texTechPanel(rng) {
  const t = texTechMetal(rng);
  // luces indicadoras verdes/rojas
  for (let y = 6; y < H; y += 20) for (let x = 6; x < W; x += 14) {
    const on = rng() > 0.4;
    const c = on ? (rng() > 0.5 ? PAL.toxic[1] : PAL.blood[2]) : PAL.techbase[2];
    put(t, x, y, c); put(t, x + 1, y, c); put(t, x, y + 1, c); put(t, x + 1, y + 1, c);
    if (on) { put(t, x - 1, y, shade(c, 0.5)); put(t, x + 2, y + 1, shade(c, 0.5)); }
  }
  return t;
}

function texRust(rng) {
  const t = makeTex();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const streak = Math.sin(x * 0.5 + y * 0.05);
    t.data[y * W + x] = mix(PAL.rust[0], PAL.rust[1], 0.5 + 0.5 * streak);
  }
  for (let s = 0; s < 8; s++) {
    let x = rng() * W | 0; const y0 = rng() * H | 0;
    for (let y = y0; y < H; y++) { put(t, x, y, shade(PAL.rust[0], 0.7)); if (rng() > 0.7) x += (rng() > 0.5 ? 1 : -1); }
  }
  grime(t, rng, 13);
  return t;
}

function texMarble(rng) {
  const t = makeTex();
  const base = hex('#c8c0a8');
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++)
    t.data[y * W + x] = shade(base, 0.82 + 0.18 * Math.sin(x * 0.1 + y * 0.07));
  // venas verdes
  for (let v = 0; v < 4; v++) {
    let x = rng() * W | 0, y = 0, dir = 1.4 + (rng() - 0.5);
    while (y < H) { put(t, x, y, PAL.toxic[0]); dir += (rng() - 0.5) * 0.7; x = (x + Math.cos(dir)) | 0; y += 1; }
  }
  // craneo central simple
  const cx = 32, cy = 30;
  for (let y = -10; y <= 10; y++) for (let x = -8; x <= 8; x++) {
    if (x * x * 1.4 + y * y <= 80) put(t, cx + x, cy + y, shade(base, 1.12));
  }
  put(t, cx - 4, cy - 1, PAL.black); put(t, cx - 3, cy - 1, PAL.black);
  put(t, cx + 3, cy - 1, PAL.black); put(t, cx + 4, cy - 1, PAL.black);
  for (let x = -3; x <= 3; x++) put(t, cx + x, cy + 7, PAL.black);
  grime(t, rng, 9);
  return t;
}

function texDoor(rng) {
  const t = makeTex();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++)
    t.data[y * W + x] = shade(PAL.steel[0], 0.7 + 0.3 * (1 - Math.abs(x - 32) / 32));
  vline(t, 31, 0, H, PAL.black); vline(t, 32, 0, H, shade(PAL.steel[0], 1.3)); // seam central
  // hazard stripes en los bordes
  for (let y = 0; y < H; y++) {
    const stripe = (((y + 0) >> 2) & 1) ? PAL.hazard : PAL.black;
    for (let x = 0; x < 5; x++) { put(t, x, y, stripe); put(t, W - 1 - x, y, stripe); }
  }
  // ventanita
  for (let y = 14; y < 26; y++) for (let x = 22; x < 42; x++) if (x < 30 || x > 33) put(t, x, y, shade(PAL.toxic[0], 0.8));
  grime(t, rng, 8);
  return t;
}

function texExit(rng) {
  const t = texTechMetal(rng);
  // panel de switch central
  for (let y = 18; y < 46; y++) for (let x = 22; x < 42; x++) put(t, x, y, PAL.techbase[2]);
  for (let y = 22; y < 42; y++) for (let x = 26; x < 38; x++) put(t, x, y, PAL.blood[0]);
  // palanca
  for (let y = 24; y < 40; y++) { put(t, 31, y, PAL.boneDim); put(t, 32, y, PAL.bone); }
  for (let x = 28; x < 36; x++) { put(t, x, 24, PAL.steel[1]); put(t, x, 39, PAL.steel[1]); }
  hline(t, 22, 42, 17, PAL.hazard); hline(t, 22, 42, 46, PAL.hazard);
  grime(t, rng, 9);
  return t;
}

function texFloor(rng) {
  const t = makeTex();
  const base = hex('#3a2c1c');
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++)
    t.data[y * W + x] = shade(base, 0.8 + 0.2 * rng());
  for (let y = 0; y < H; y += 16) hline(t, 0, W, y, PAL.black);
  for (let x = 0; x < W; x += 16) vline(t, x, 0, H, PAL.black);
  for (let s = 0; s < 6; s++) blot(t, rng, rng() * W | 0, rng() * H | 0, 3 + (rng() * 3 | 0), 0.7);
  grime(t, rng, 13);
  return t;
}

function texCeil(rng) {
  const t = makeTex();
  const base = hex('#1a140e');
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++)
    t.data[y * W + x] = shade(base, 0.85 + 0.15 * rng());
  for (let s = 0; s < 5; s++) blot(t, rng, rng() * W | 0, rng() * H | 0, 4, 0.6);
  grime(t, rng, 10);
  return t;
}

/** Construye el set completo. walls[id] indexado por valor de celda (1..8). */
export function buildTextures(seedStr = 'hell-brown-93') {
  const rng = mulberry32(hashStr(seedStr));
  return {
    walls: [
      null,              // 0 empty
      texTechMetal(rng), // 1
      texConcrete(rng),  // 2
      texFlesh(rng),     // 3
      texTechPanel(rng), // 4
      texRust(rng),      // 5
      texMarble(rng),    // 6
      texDoor(rng),      // 7 door
      texExit(rng),      // 8 exit switch
    ],
    floor: texFloor(rng),
    ceil: texCeil(rng),
  };
}
