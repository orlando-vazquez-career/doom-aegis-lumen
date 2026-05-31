// sprites.js — render de billboards con oclusion por z-buffer (por columna) y
// alpha por pixel. Recibe una lista de entidades {x,y,sprite}. Desacoplado de World.

import { shade } from './palette.js';

const PLANE = 0.66;

/**
 * @param fb {buf32,W,H,VH,centerY}
 * @param player {x,y,angle}
 * @param entities [{x,y,sprite:{w,h,data,worldH}}]
 * @param zbuf Float32Array — distancias de pared por columna (de renderWorld)
 */
export function renderSprites(fb, player, entities, zbuf) {
  const { buf32, W, VH, centerY } = fb;
  const posX = player.x, posY = player.y;
  const dirX = Math.cos(player.angle), dirY = Math.sin(player.angle);
  const planeX = -dirY * PLANE, planeY = dirX * PLANE;

  // recolectar + ordenar lejos->cerca
  const list = [];
  for (const e of entities) {
    if (!e.sprite) continue;
    const dx = e.x - posX, dy = e.y - posY;
    list.push({ e, d: dx * dx + dy * dy });
  }
  list.sort((a, b) => b.d - a.d);

  const invDet = 1 / (planeX * dirY - dirX * planeY);
  for (const { e } of list) {
    const sx = e.x - posX, sy = e.y - posY;
    const tX = invDet * (dirY * sx - dirX * sy);
    const tY = invDet * (-planeY * sx + planeX * sy); // profundidad
    if (tY <= 0.05) continue;

    const sprite = e.sprite, sw = sprite.w, sh = sprite.h, worldH = sprite.worldH || 0.9;
    const screenXc = (W / 2) * (1 + tX / tY);
    const cellH = VH / tY;
    const spriteH = cellH * worldH;
    const spriteW = spriteH * (sw / sh);
    const floorLine = centerY + cellH / 2;
    const startY = (floorLine - spriteH) | 0;
    const endY = Math.min(VH, floorLine | 0);
    const startX = (screenXc - spriteW / 2) | 0;
    const endX = (screenXc + spriteW / 2) | 0;
    const y0 = Math.max(0, startY);
    let lum = 1.12 - tY / 16; if (lum > 1) lum = 1; else if (lum < 0.25) lum = 0.25;

    for (let x = startX; x < endX; x++) {
      if (x < 0 || x >= W) continue;
      if (tY >= zbuf[x]) continue; // ocluido por pared
      const texX = (((x - startX) * sw) / spriteW) | 0;
      if (texX < 0 || texX >= sw) continue;
      for (let y = y0; y < endY; y++) {
        const texY = (((y - startY) * sh) / spriteH) | 0;
        if (texY < 0 || texY >= sh) continue;
        const c = sprite.data[texY * sw + texX];
        if (c === 0) continue; // transparente
        buf32[y * W + x] = shade(c, lum);
      }
    }
  }
}
