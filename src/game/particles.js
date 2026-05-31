// particles.js — sangre/puffs/explosiones/gibs. Pool fijo (sin alloc en hot path, R2).
// Render como puntos billboard con z (altura) y test de profundidad por columna.

import { shade, PAL, jitter } from '../engine/palette.js';

const PLANE = 0.66;
const GRAVITY = 5;

export class Particles {
  constructor(max = 600) {
    this.max = max;
    this.p = new Array(max);
    for (let i = 0; i < max; i++) this.p[i] = { active: false, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, life: 0, color: 0, size: 1, grav: 1 };
    this.head = 0;
  }

  _alloc() {
    for (let i = 0; i < this.max; i++) {
      const idx = (this.head + i) % this.max;
      if (!this.p[idx].active) { this.head = (idx + 1) % this.max; return this.p[idx]; }
    }
    const pt = this.p[this.head]; this.head = (this.head + 1) % this.max; return pt; // sobreescribe el mas viejo
  }

  emit(x, y, z, vx, vy, vz, life, color, size, grav = 1) {
    const pt = this._alloc();
    pt.active = true; pt.x = x; pt.y = y; pt.z = z;
    pt.vx = vx; pt.vy = vy; pt.vz = vz; pt.life = life; pt.color = color; pt.size = size; pt.grav = grav;
  }

  spawnBlood(x, y, n = 9) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283, s = 0.4 + Math.random() * 2.2;
      this.emit(x, y, 0.5 + Math.random() * 0.3, Math.cos(a) * s, Math.sin(a) * s, 1.2 + Math.random() * 2.2,
        0.5 + Math.random() * 0.5, jitter(PAL.blood[Math.random() * 3 | 0], 10), 1 + (Math.random() * 2 | 0));
    }
  }
  spawnPuff(x, y, n = 6) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283, s = 0.3 + Math.random() * 1.2;
      this.emit(x, y, 0.55 + Math.random() * 0.2, Math.cos(a) * s, Math.sin(a) * s, 0.6 + Math.random(),
        0.35 + Math.random() * 0.3, jitter(0xff8a8a8a, 12), 1, 0.3);
    }
  }
  spawnExplosion(x, y, n = 22) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283, s = 1 + Math.random() * 4;
      const col = [PAL.blood[2], 0xff2090ff & 0xffffffff, PAL.blood[1]][Math.random() * 3 | 0];
      this.emit(x, y, 0.5 + Math.random() * 0.4, Math.cos(a) * s, Math.sin(a) * s, 1 + Math.random() * 3,
        0.4 + Math.random() * 0.5, col, 1 + (Math.random() * 3 | 0), 0.6);
    }
  }
  spawnGib(x, y, n = 16) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283, s = 0.8 + Math.random() * 3;
      this.emit(x, y, 0.5 + Math.random() * 0.4, Math.cos(a) * s, Math.sin(a) * s, 2 + Math.random() * 3,
        0.7 + Math.random() * 0.6, jitter(PAL.blood[Math.random() * 2 | 0], 12), 2 + (Math.random() * 2 | 0));
    }
  }

  update(dt) {
    for (const pt of this.p) {
      if (!pt.active) continue;
      pt.life -= dt;
      pt.x += pt.vx * dt; pt.y += pt.vy * dt; pt.z += pt.vz * dt;
      pt.vz -= GRAVITY * pt.grav * dt;
      if (pt.z <= 0) { pt.z = 0; pt.vz = 0; pt.vx *= 0.6; pt.vy *= 0.6; }
      if (pt.life <= 0) pt.active = false;
    }
  }

  render(fb, player, zbuf) {
    const { buf32, W, VH, centerY } = fb;
    const dirX = Math.cos(player.angle), dirY = Math.sin(player.angle);
    const planeX = -dirY * PLANE, planeY = dirX * PLANE;
    const invDet = 1 / (planeX * dirY - dirX * planeY);
    for (const pt of this.p) {
      if (!pt.active) continue;
      const sx = pt.x - player.x, sy = pt.y - player.y;
      const tX = invDet * (dirY * sx - dirX * sy);
      const tY = invDet * (-planeY * sx + planeX * sy);
      if (tY <= 0.1) continue;
      const screenX = ((W / 2) * (1 + tX / tY)) | 0;
      if (screenX < 0 || screenX >= W || tY >= zbuf[screenX]) continue;
      const cellH = VH / tY;
      const screenY = (centerY + cellH / 2 - pt.z * cellH) | 0;
      let lum = 1.12 - tY / 16; if (lum > 1) lum = 1; else if (lum < 0.25) lum = 0.25;
      const c = shade(pt.color, lum);
      const s = pt.size;
      for (let oy = 0; oy < s; oy++) for (let ox = 0; ox < s; ox++) {
        const px = screenX + ox, py = screenY + oy;
        if (px >= 0 && px < W && py >= 0 && py < VH) buf32[py * W + px] = c;
      }
    }
  }
}
