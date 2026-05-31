// enemies.js — 3 arquetipos + maquina de estados idle/chase/attack/pain/die.
// LOS via world.lineOfSight. Frame de sprite seleccionado por estado/anim.

import { makeProjectile } from './projectiles.js';

export const ENEMY_DEFS = {
  zombie: { hp: 24, speed: 1.2, radius: 0.3, sight: 11, range: 7.5, attack: 'hitscan',   dmg: [3, 9],  cooldown: 1.2, pain: 0.45 },
  imp:    { hp: 40, speed: 1.4, radius: 0.3, sight: 12, range: 9,   attack: 'projectile', proj: 'fireball', dmg: [6, 15], cooldown: 1.6, pain: 0.35 },
  pinky:  { hp: 90, speed: 2.3, radius: 0.35, sight: 12, range: 1.3, attack: 'melee',     dmg: [6, 14], cooldown: 0.6, pain: 0.2 },
};

export function makeEnemy(type, x, y, art, difficulty = 1) {
  const d = ENEMY_DEFS[type];
  return {
    type, x, y,
    hp: Math.round(d.hp * (1 + (difficulty - 1) * 0.3)),
    radius: d.radius, speed: d.speed, sight: d.sight, range: d.range,
    attack: d.attack, proj: d.proj, dmg: d.dmg, attackCooldown: d.cooldown, painChance: d.pain,
    state: 'idle', cooldown: Math.random() * 0.5, anim: Math.random() * 2,
    attackT: 0, painT: 0, dieT: 0, dead: false, lastSeen: null,
    sprite: art.enemies[type].walk[0],
  };
}

function solidFor(world, x, y, r) {
  return world.isSolid(x - r, y - r) || world.isSolid(x + r, y - r) ||
         world.isSolid(x - r, y + r) || world.isSolid(x + r, y + r);
}

const dmgRoll = (r) => r[0] + Math.random() * (r[1] - r[0]);

function doAttack(e, world, audio, art, ang) {
  const p = world.player;
  if (e.attack === 'hitscan') {
    if (world.lineOfSight(e.x, e.y, p.x, p.y)) {
      audio.shoot('pistol');
      if (Math.random() < 0.72) { p.takeDamage(dmgRoll(e.dmg), Math.atan2(e.y - p.y, e.x - p.x)); audio.pain(); }
    }
  } else if (e.attack === 'melee') {
    if (Math.hypot(p.x - e.x, p.y - e.y) < e.range + 0.25) {
      audio.growl(e.type);
      p.takeDamage(dmgRoll(e.dmg), Math.atan2(e.y - p.y, e.x - p.x)); audio.pain();
    }
  } else if (e.attack === 'projectile') {
    audio.fireball();
    world.projectiles.push(makeProjectile(e.proj, e.x + Math.cos(ang) * 0.4, e.y + Math.sin(ang) * 0.4, ang, dmgRoll(e.dmg), 'enemy', art));
  }
}

export function damageEnemy(e, dmg, world, audio, art) {
  if (e.dead) return;
  e.hp -= dmg;
  if (e.hp <= 0) {
    e.dead = true; e.state = 'die'; e.dieT = 0;
    e.sprite = art.enemies[e.type].dead;
    world.kills++;
    audio.die(e.type);
    world.particles.spawnGib(e.x, e.y);
  } else if (Math.random() < e.painChance) {
    e.state = 'pain'; e.painT = 0.22; e.sprite = art.enemies[e.type].pain;
    audio.growl(e.type);
  }
}

export function updateEnemy(e, dt, world, audio, art) {
  const A = art.enemies[e.type];
  if (e.dead) { e.dieT += dt; e.sprite = A.dead; return; }

  const p = world.player;
  const dx = p.x - e.x, dy = p.y - e.y;
  const distP = Math.hypot(dx, dy);
  const ang = Math.atan2(dy, dx);
  e.cooldown -= dt; e.anim += dt;

  if (e.painT > 0) { e.painT -= dt; e.sprite = A.pain; return; }
  if (e.state === 'attack') { e.attackT -= dt; e.sprite = A.attack; if (e.attackT <= 0) e.state = 'chase'; return; }

  const sees = !p.dead && distP < e.sight && world.lineOfSight(e.x, e.y, p.x, p.y);
  if (sees) e.lastSeen = { x: p.x, y: p.y };

  if (e.state === 'idle') {
    if (sees) { e.state = 'chase'; audio.growl(e.type); }
    e.sprite = A.walk[0];
    return;
  }

  // chase
  if (sees && distP <= e.range && e.cooldown <= 0) {
    e.state = 'attack'; e.attackT = 0.28; e.cooldown = e.attackCooldown; e.sprite = A.attack;
    doAttack(e, world, audio, art, ang);
    return;
  }

  const target = e.lastSeen || p;
  const mvAng = Math.atan2(target.y - e.y, target.x - e.x);
  const spd = e.speed * dt;
  const nx = e.x + Math.cos(mvAng) * spd, ny = e.y + Math.sin(mvAng) * spd;
  if (!solidFor(world, nx, e.y, e.radius)) e.x = nx;
  if (!solidFor(world, e.x, ny, e.radius)) e.y = ny;
  e.sprite = A.walk[((e.anim * e.speed * 2) | 0) & 1];

  if (!sees && e.lastSeen && Math.hypot(e.lastSeen.x - e.x, e.lastSeen.y - e.y) < 0.4) {
    e.lastSeen = null; e.state = 'idle';
  }
}
