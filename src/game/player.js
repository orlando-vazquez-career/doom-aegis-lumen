// player.js — movimiento, colision circle-vs-grid, vida/armor/inventario.
// El comportamiento de armas vive en weapons.js (B.5); aca solo el estado.

import { HALF_PI, TAU, clamp, normAngle } from '../engine/mathx.js';

const MOUSE_SENS = 0.0023;
const TURN_SPEED = 2.7;     // rad/s con teclado
const MOVE_SPEED = 3.1;     // celdas/s
const RUN_MULT = 1.7;
const RADIUS = 0.22;

export class Player {
  constructor(start) {
    this.placeAt(start);
    this.maxHealth = 100;
    this.health = 100;
    this.armor = 0;
    this.weapons = { fist: true, pistol: true, shotgun: false, chaingun: false, plasma: false };
    this.current = 'pistol';
    this.ammo = { bullets: 50, shells: 0, cells: 0 };
    this.keys = new Set();
    this.bob = 0;
    this.bobActive = 0;
    this.lastDamageDir = 0;   // angulo relativo del ultimo golpe (para la cara)
    this.damageFlash = 0;     // 0..1 tinte rojo de pantalla
    this.pickupFlash = 0;     // 0..1 tinte de pickup
    this.weaponCooldown = 0;  // s hasta poder disparar
    this.muzzle = 0;          // s de muzzle flash visible
    this.kick = 0;            // 0..1 retroceso del viewmodel
    this.dead = false;
    this.invuln = 0;
  }

  placeAt(start) {
    this.x = start.x; this.y = start.y; this.angle = start.angle || 0;
  }

  update(dt, input, world) {
    if (this.dead) return;
    // rotacion
    const turn = (input.turnR ? 1 : 0) - (input.turnL ? 1 : 0);
    this.angle += turn * TURN_SPEED * dt;
    this.angle += input.takeMouseDX() * MOUSE_SENS;
    this.angle = normAngle(this.angle);

    // traslacion
    const mf = (input.forward ? 1 : 0) - (input.back ? 1 : 0);
    const ms = (input.strafeR ? 1 : 0) - (input.strafeL ? 1 : 0);
    const spd = MOVE_SPEED * (input.run ? RUN_MULT : 1) * dt;
    const ca = Math.cos(this.angle), sa = Math.sin(this.angle);
    const dx = (ca * mf + Math.cos(this.angle + HALF_PI) * ms) * spd;
    const dy = (sa * mf + Math.sin(this.angle + HALF_PI) * ms) * spd;
    this.tryMove(world, dx, dy);

    // head bob
    if (mf || ms) { this.bobActive = Math.min(1, this.bobActive + dt * 4); this.bob += dt * (input.run ? 13 : 9); }
    else { this.bobActive = Math.max(0, this.bobActive - dt * 6); }

    // decays
    this.damageFlash = Math.max(0, this.damageFlash - dt * 2.2);
    this.pickupFlash = Math.max(0, this.pickupFlash - dt * 3);
    this.weaponCooldown = Math.max(0, this.weaponCooldown - dt);
    this.muzzle = Math.max(0, this.muzzle - dt);
    this.kick = Math.max(0, this.kick - dt * 6);
    if (this.invuln > 0) this.invuln -= dt;
  }

  collidesAt(world, x, y) {
    const r = RADIUS;
    return (
      world.isSolid(x - r, y - r) || world.isSolid(x + r, y - r) ||
      world.isSolid(x - r, y + r) || world.isSolid(x + r, y + r)
    );
  }

  tryMove(world, dx, dy) {
    if (!this.collidesAt(world, this.x + dx, this.y)) this.x += dx;
    if (!this.collidesAt(world, this.x, this.y + dy)) this.y += dy;
  }

  takeDamage(amount, fromAngle = null) {
    if (this.dead || this.invuln > 0) return;
    // armadura absorbe 1/3
    if (this.armor > 0) {
      const absorbed = Math.min(this.armor, amount / 3);
      this.armor -= absorbed; amount -= absorbed;
    }
    this.health -= amount;
    this.damageFlash = Math.min(1, this.damageFlash + amount / 40 + 0.15);
    if (fromAngle !== null) this.lastDamageDir = fromAngle;
    if (this.health <= 0) { this.health = 0; this.dead = true; }
  }

  heal(amount, max = 100) { this.health = clamp(this.health + amount, 0, max); this.pickupFlash = 0.6; }
  addArmor(amount, max = 100) { this.armor = clamp(this.armor + amount, 0, max); this.pickupFlash = 0.6; }
}
