// projectiles.js — fireballs (enemigo) y plasma (player). Colision con
// paredes y entidades. Animacion de frame por tiempo.

import { damageEnemy } from './enemies.js';

const SPEED = { fireball: 6.5, plasma: 12 };

export function makeProjectile(kind, x, y, ang, dmg, owner, art) {
  const sp = SPEED[kind] || 8;
  const frames = art.projectiles[kind];
  return {
    kind, x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
    dmg, owner, life: 3, anim: 0, frames, sprite: frames[0], dead: false,
  };
}

export function updateProjectiles(world, dt, audio, art) {
  const p = world.player;
  for (const pr of world.projectiles) {
    if (pr.dead) continue;
    pr.life -= dt; pr.anim += dt;
    pr.sprite = pr.frames[((pr.anim * 12) | 0) % pr.frames.length];

    const nx = pr.x + pr.vx * dt, ny = pr.y + pr.vy * dt;
    if (world.isSolid(nx, ny)) { explode(pr, world, audio); continue; }
    pr.x = nx; pr.y = ny;

    if (pr.owner === 'enemy') {
      if (!p.dead && Math.hypot(p.x - pr.x, p.y - pr.y) < 0.36) {
        p.takeDamage(pr.dmg, Math.atan2(-pr.vy, -pr.vx)); audio.pain();
        explode(pr, world, audio); continue;
      }
    } else {
      for (const e of world.enemies) {
        if (e.dead) continue;
        if (Math.hypot(e.x - pr.x, e.y - pr.y) < e.radius + 0.18) {
          damageEnemy(e, pr.dmg, world, audio, art);
          explode(pr, world, audio); break;
        }
      }
    }
    if (pr.life <= 0) pr.dead = true;
  }
  if (world.projectiles.some((pr) => pr.dead)) world.projectiles = world.projectiles.filter((pr) => !pr.dead);
}

function explode(pr, world, audio) {
  pr.dead = true;
  if (pr.kind === 'fireball') { world.particles.spawnExplosion(pr.x, pr.y); audio.explosion(); }
  else { world.particles.spawnPuff(pr.x, pr.y, 6); }
}
