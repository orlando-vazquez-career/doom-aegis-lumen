// world.js — estado mutable del mundo + queries (celda/puerta/colision/LOS) +
// spawn de entidades + transicion de nivel. ECS-lite: entidades = objetos planos.

import { loadLevel, levelCount } from './level.js';
import { Player } from './player.js';
import { Particles } from './particles.js';
import { makeEnemy } from './enemies.js';
import { makePickup } from './things.js';

export class World {
  constructor(levelIndex, art, difficulty = 1) {
    this.art = art;
    this.difficulty = difficulty;
    this.load(levelIndex);
  }

  load(levelIndex, keepPlayer = null) {
    this.levelIndex = levelIndex;
    this.level = loadLevel(levelIndex);
    this.player = keepPlayer || new Player(this.level.start);
    this.player.placeAt(this.level.start);
    this.player.keys.clear();
    this.player.dead = false;
    this.enemies = [];
    this.projectiles = [];
    this.pickups = [];
    this.particles = new Particles();
    this.doors = new Map();
    this.messages = [];
    this.time = 0;
    this.kills = 0;
    this.secrets = 0;
    this.requestExit = false;
    for (const d of this.level.doors) {
      this.doors.set(d.x + ',' + d.y, { x: d.x, y: d.y, open: 0, state: 'closed', locked: d.locked, timer: 0 });
    }
    this.spawnEntities();
    this.totalKills = this.enemies.length;
  }

  spawnEntities() {
    for (const s of this.level.spawns) {
      if (s.kind === 'enemy') this.enemies.push(makeEnemy(s.type, s.x, s.y, this.art, this.difficulty));
      else if (s.kind === 'pickup') this.pickups.push(makePickup(s.type, s.x, s.y, this.art));
    }
  }

  /** @returns true si hay mas niveles, false si era el ultimo (victoria). */
  nextLevel() {
    const next = this.levelIndex + 1;
    if (next >= levelCount) return false;
    this.load(next, this.player);
    return true;
  }

  cell(x, y) {
    const { w, h, cells } = this.level;
    if (x < 0 || y < 0 || x >= w || y >= h) return 1;
    return cells[(y | 0) * w + (x | 0)];
  }

  doorAt(x, y) { return this.doors.get((x | 0) + ',' + (y | 0)); }

  isSolid(x, y) {
    const c = this.cell(x, y);
    if (c === 0) return false;
    if (c === 7) { const d = this.doorAt(x, y); return !d || d.open < 0.85; }
    return true;
  }

  /** Distancia a la primera pared a lo largo de un rayo (para hitscan/telegraph). */
  rayWallDist(x, y, ang, max) {
    const c = Math.cos(ang), s = Math.sin(ang);
    let d = 0;
    while (d < max) { d += 0.05; if (this.isSolid(x + c * d, y + s * d)) return d - 0.05; }
    return max;
  }

  /** Linea de vista entre dos puntos (sin pared en medio). */
  lineOfSight(x0, y0, x1, y1) {
    const dx = x1 - x0, dy = y1 - y0;
    const steps = Math.ceil(Math.hypot(dx, dy) / 0.12);
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      if (this.isSolid(x0 + dx * t, y0 + dy * t)) return false;
    }
    return true;
  }

  addMessage(text, ttl = 3) {
    this.messages.push({ text: text.toUpperCase(), ttl });
    if (this.messages.length > 4) this.messages.shift();
  }

  updateMessages(dt) {
    if (!this.messages.length) return;
    for (const m of this.messages) m.ttl -= dt;
    this.messages = this.messages.filter((m) => m.ttl > 0);
  }
}
