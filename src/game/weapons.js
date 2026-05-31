// weapons.js — defs de armas + logica de disparo (hitscan con spread + proyectil),
// municion, cooldown, switching, auto-switch al quedarse sin balas.

import { angleDelta } from '../engine/mathx.js';
import { makeProjectile } from './projectiles.js';
import { damageEnemy } from './enemies.js';

// dmg = [min,max]. rate = segundos entre disparos. ammo = clave en player.ammo (o null).
export const WEAPONS = {
  fist:     { name: 'FIST',     slot: 1, ammo: null,      dmg: [6, 20],  rate: 0.45, range: 1.2, pellets: 1, spread: 0,    sound: 'pistol' },
  pistol:   { name: 'PISTOL',   slot: 2, ammo: 'bullets', dmg: [8, 15],  rate: 0.28, range: 22,  pellets: 1, spread: 0.025, sound: 'pistol' },
  shotgun:  { name: 'SHOTGUN',  slot: 3, ammo: 'shells',  dmg: [5, 10],  rate: 0.8,  range: 18,  pellets: 7, spread: 0.13,  sound: 'shotgun' },
  chaingun: { name: 'CHAINGUN', slot: 4, ammo: 'bullets', dmg: [8, 15],  rate: 0.09, range: 22,  pellets: 1, spread: 0.055, sound: 'chaingun' },
  plasma:   { name: 'PLASMA',   slot: 5, ammo: 'cells',   dmg: [18, 38], rate: 0.11, range: 24,  projectile: 'plasma',     sound: 'plasma' },
};

const ORDER = ['plasma', 'chaingun', 'shotgun', 'pistol', 'fist'];
const rnd = (r) => (r[0] + Math.random() * (r[1] - r[0])) | 0;

export function switchWeapon(player, slot, audio) {
  for (const k in WEAPONS) {
    if (WEAPONS[k].slot === slot && player.weapons[k] && player.current !== k) {
      player.current = k; player.weaponCooldown = 0.15; audio.uiSelect(); return;
    }
  }
}

function autoSwitch(player, audio) {
  for (const k of ORDER) {
    const d = WEAPONS[k];
    if (player.weapons[k] && (!d.ammo || player.ammo[d.ammo] > 0)) { player.current = k; audio.uiSelect(); return; }
  }
}

/** Hitscan: distancia a la pared + enemigo mas cercano dentro del cono angular. */
function hitscan(world, p, ang, range) {
  const wall = world.rayWallDist(p.x, p.y, ang, range);
  let best = null, bestD = wall;
  for (const e of world.enemies) {
    if (e.dead) continue;
    const dx = e.x - p.x, dy = e.y - p.y;
    const dist = Math.hypot(dx, dy);
    if (dist > bestD) continue;
    const da = Math.abs(angleDelta(ang, Math.atan2(dy, dx)));
    if (da < Math.atan2(e.radius, Math.max(0.2, dist))) { best = e; bestD = dist; }
  }
  return { enemy: best, x: p.x + Math.cos(ang) * bestD, y: p.y + Math.sin(ang) * bestD };
}

export function fire(world, audio, art) {
  const p = world.player;
  if (p.dead || p.weaponCooldown > 0) return;
  const d = WEAPONS[p.current];
  if (d.ammo && p.ammo[d.ammo] <= 0) { audio.noAmmo(); p.weaponCooldown = 0.25; autoSwitch(p, audio); return; }

  p.weaponCooldown = d.rate;
  p.muzzle = 0.055;
  p.kick = 1;
  if (d.ammo) p.ammo[d.ammo]--;

  if (d.projectile) {
    audio.plasma();
    world.projectiles.push(makeProjectile(d.projectile, p.x + Math.cos(p.angle) * 0.4, p.y + Math.sin(p.angle) * 0.4, p.angle, rnd(d.dmg), 'player', art));
    return;
  }

  audio.shoot(d.sound);
  for (let i = 0; i < (d.pellets || 1); i++) {
    const ang = p.angle + (Math.random() - 0.5) * (d.spread || 0);
    const hit = hitscan(world, p, ang, d.range);
    if (hit.enemy) { damageEnemy(hit.enemy, rnd(d.dmg), world, audio, art); world.particles.spawnBlood(hit.x, hit.y); }
    else world.particles.spawnPuff(hit.x, hit.y);
  }
}
