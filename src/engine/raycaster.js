// raycaster.js — render del mundo: DDA de paredes (anti-fisheye por distancia
// perpendicular), floor/ceiling casting incremental por fila, z-buffer por
// columna para oclusion de sprites, y puertas que deslizan hacia arriba.

import { shade } from './palette.js';

const TW = 64, TH = 64, PLANE = 0.66; // PLANE -> ~66 grados de FOV horizontal

/**
 * @param fb {buf32:Uint32Array, W, H, VH, centerY}
 * @param world World
 * @param tex {walls:[], floor, ceil}
 * @param zbuf Float32Array(W) — distancia perpendicular por columna (out)
 */
export function renderWorld(fb, world, tex, zbuf) {
  const { buf32, W, VH, centerY } = fb;
  const p = world.player;
  const dirX = Math.cos(p.angle), dirY = Math.sin(p.angle);
  const planeX = -dirY * PLANE, planeY = dirX * PLANE;
  const posX = p.x, posY = p.y;

  // ---- Floor + ceiling (por fila, incremental: O(pixeles), no raycast/pixel) ----
  const floorData = tex.floor.data, ceilData = tex.ceil.data;
  const posZ = 0.5 * VH;
  for (let pRow = 1; pRow <= centerY; pRow++) {
    const rowDistance = posZ / pRow;
    const stepX = (rowDistance * 2 * planeX) / W;
    const stepY = (rowDistance * 2 * planeY) / W;
    let fx = posX + rowDistance * (dirX - planeX);
    let fy = posY + rowDistance * (dirY - planeY);
    let lum = 1.12 - rowDistance / 16; if (lum > 1) lum = 1; else if (lum < 0.2) lum = 0.2;
    const floorY = centerY + pRow, ceilY = centerY - pRow;
    const floorBase = floorY * W, ceilBase = ceilY * W;
    const drawFloor = floorY < VH, drawCeil = ceilY >= 0;
    for (let x = 0; x < W; x++) {
      const tx = ((fx * TW) | 0) & (TW - 1);
      const ty = ((fy * TH) | 0) & (TH - 1);
      if (drawFloor) buf32[floorBase + x] = shade(floorData[ty * TW + tx], lum);
      if (drawCeil) buf32[ceilBase + x] = shade(ceilData[ty * TW + tx], lum * 0.88);
      fx += stepX; fy += stepY;
    }
  }

  // ---- Walls (por columna, DDA) ----
  for (let x = 0; x < W; x++) {
    const cameraX = (2 * x) / W - 1;
    const rayDirX = dirX + planeX * cameraX;
    const rayDirY = dirY + planeY * cameraX;
    let mapX = posX | 0, mapY = posY | 0;
    const deltaX = rayDirX === 0 ? 1e30 : Math.abs(1 / rayDirX);
    const deltaY = rayDirY === 0 ? 1e30 : Math.abs(1 / rayDirY);
    let stepX, stepY, sideX, sideY;
    if (rayDirX < 0) { stepX = -1; sideX = (posX - mapX) * deltaX; } else { stepX = 1; sideX = (mapX + 1 - posX) * deltaX; }
    if (rayDirY < 0) { stepY = -1; sideY = (posY - mapY) * deltaY; } else { stepY = 1; sideY = (mapY + 1 - posY) * deltaY; }

    let side = 0, hitCell = 0, doorOpen = 0, guard = 0;
    while (guard++ < 80) {
      if (sideX < sideY) { sideX += deltaX; mapX += stepX; side = 0; }
      else { sideY += deltaY; mapY += stepY; side = 1; }
      const c = world.cell(mapX, mapY);
      if (c > 0) {
        if (c === 7) { const d = world.doorAt(mapX, mapY); const o = d ? d.open : 0; if (o >= 0.95) continue; doorOpen = o; }
        hitCell = c; break;
      }
    }
    if (!hitCell) { zbuf[x] = 1e30; continue; }

    const perp = side === 0 ? sideX - deltaX : sideY - deltaY;
    const dist = perp < 1e-4 ? 1e-4 : perp;
    const lineHeight = VH / dist;
    const drawStart = -lineHeight / 2 + centerY;
    const drawEnd = lineHeight / 2 + centerY;
    let bottom = drawEnd;
    if (hitCell === 7 && doorOpen > 0) bottom -= doorOpen * lineHeight; // slide-up

    let wallX = side === 0 ? posY + dist * rayDirY : posX + dist * rayDirX;
    wallX -= Math.floor(wallX);
    let texX = (wallX * TW) | 0;
    if (side === 0 && rayDirX > 0) texX = TW - 1 - texX;
    if (side === 1 && rayDirY < 0) texX = TW - 1 - texX;

    const texData = tex.walls[hitCell].data;
    let lum = 1.12 - dist / 16; if (lum > 1) lum = 1; else if (lum < 0.2) lum = 0.2;
    if (side === 1) lum *= 0.78; // caras N-S mas oscuras -> profundidad

    const y0 = drawStart < 0 ? 0 : drawStart | 0;
    const y1 = (bottom > VH ? VH : bottom) | 0;
    const texStep = TH / lineHeight;
    let texPos = (y0 - centerY + lineHeight / 2) * texStep;
    for (let y = y0; y < y1; y++) {
      const ty = (texPos | 0) & (TH - 1);
      texPos += texStep;
      buf32[y * W + x] = shade(texData[ty * TW + texX], lum);
    }
    zbuf[x] = dist;
  }
}
