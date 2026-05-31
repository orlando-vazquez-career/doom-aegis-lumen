// palette.js — implementacion-maquina de los tokens de DESIGN.md (direccion A).
// Colores empacados little-endian RGBA (0xAABBGGRR) para escritura rapida en
// el framebuffer Uint32. Cross-ref: DESIGN.md frontmatter.

import { clamp } from './mathx.js';

/** Empaca r,g,b,a -> uint32 little-endian (formato del ImageData.data como Uint32). */
export const rgb = (r, g, b, a = 255) =>
  (((a << 24) | (b << 16) | (g << 8) | r) >>> 0);

/** Desde hex "#rrggbb". */
export function hex(h) {
  const n = parseInt(h.replace('#', ''), 16);
  return rgb((n >> 16) & 255, (n >> 8) & 255, n & 255);
}

export const R = (c) => c & 255;
export const G = (c) => (c >> 8) & 255;
export const B = (c) => (c >> 16) & 255;
export const A = (c) => (c >>> 24) & 255;

/** Multiplica el color por un factor de brillo f (shading por distancia/sector). */
export function shade(c, f) {
  const r = (R(c) * f) | 0, g = (G(c) * f) | 0, b = (B(c) * f) | 0;
  return rgb(r > 255 ? 255 : r, g > 255 ? 255 : g, b > 255 ? 255 : b, A(c));
}

/** Mezcla lineal de dos colores empacados, t en [0,1]. */
export function mix(c0, c1, t) {
  return rgb(
    (R(c0) + (R(c1) - R(c0)) * t) | 0,
    (G(c0) + (G(c1) - G(c0)) * t) | 0,
    (B(c0) + (B(c1) - B(c0)) * t) | 0
  );
}

/** Suma ruido +/- n a un color (grima/grain). */
export function jitter(c, n) {
  return rgb(
    clamp(R(c) + n, 0, 255),
    clamp(G(c) + n, 0, 255),
    clamp(B(c) + n, 0, 255)
  );
}

// --- Paleta Hell-Brown '93 (tokens primitivos) ---
export const PAL = {
  black: hex('#0a0806'),
  techbase: [hex('#6b4a2b'), hex('#4a3220'), hex('#2a1d12')],
  blood: [hex('#a01010'), hex('#d22020'), hex('#ff3a1a')],
  toxic: [hex('#2f6e16'), hex('#6abe30')],
  bone: hex('#d8c8a0'),
  boneDim: hex('#b8a070'),
  steel: [hex('#5a5a5e'), hex('#3a3a3e')],
  hazard: hex('#c8a014'),
  rust: [hex('#7a3a18'), hex('#a85a28')],
  flesh: [hex('#7a1414'), hex('#a82828'), hex('#5a0a0a')],
};

// Bayer 4x4 ordenado, valores en [0,1) — base de la grima dithered (wow-03).
export const BAYER4 = [
  0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5,
].map((v) => v / 16);
export const bayer = (x, y) => BAYER4[((y & 3) << 2) + (x & 3)];
