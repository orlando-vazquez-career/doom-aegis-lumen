// things.js — pickups (con efecto), puertas (con/ sin llave) y switch de salida.

export function makePickup(type, x, y, art) {
  const SPMAP = { health: 'health', armor: 'armor', ammo: 'ammo', shotgun: 'shotgun', chaingun: 'chaingun', plasma: 'plasma', key: 'key' };
  return { type, x, y, sprite: art.pickups[SPMAP[type] || type], taken: false };
}

const WEAPON_PK = new Set(['shotgun', 'chaingun', 'plasma']);

export function updatePickups(world, audio) {
  const p = world.player;
  let changed = false;
  for (const pk of world.pickups) {
    if (pk.taken) continue;
    if (Math.hypot(p.x - pk.x, p.y - pk.y) < 0.5 && applyPickup(p, pk, world)) {
      pk.taken = true; changed = true;
      audio.pickup(WEAPON_PK.has(pk.type) ? 'weapon' : 'item');
    }
  }
  if (changed) world.pickups = world.pickups.filter((pk) => !pk.taken);
}

function applyPickup(p, pk, world) {
  switch (pk.type) {
    case 'health': if (p.health >= 100) return false; p.heal(25); world.addMessage('picked up a medikit'); return true;
    case 'armor': if (p.armor >= 100) return false; p.addArmor(100); world.addMessage('picked up armor'); return true;
    case 'ammo': p.ammo.bullets += 12; world.addMessage('picked up a clip'); return true;
    case 'shotgun': { const had = p.weapons.shotgun; p.weapons.shotgun = true; p.ammo.shells += 8; if (!had) { p.current = 'shotgun'; world.addMessage('you got the shotgun!'); } else world.addMessage('picked up shells'); return true; }
    case 'chaingun': { const had = p.weapons.chaingun; p.weapons.chaingun = true; p.ammo.bullets += 20; if (!had) { p.current = 'chaingun'; world.addMessage('you got the chaingun!'); } else world.addMessage('picked up bullets'); return true; }
    case 'plasma': { const had = p.weapons.plasma; p.weapons.plasma = true; p.ammo.cells += 40; if (!had) { p.current = 'plasma'; world.addMessage('you got the plasma gun!'); } else world.addMessage('picked up cells'); return true; }
    case 'key': p.keys.add('red'); world.addMessage('picked up a red key'); return true;
    default: return false;
  }
}

/** Accion "usar" (Space/E): abre puerta de enfrente o activa la salida. */
export function tryUse(world, audio) {
  const p = world.player;
  const cx = (p.x + Math.cos(p.angle) * 0.8) | 0;
  const cy = (p.y + Math.sin(p.angle) * 0.8) | 0;
  const c = world.cell(cx, cy);
  if (c === 7) {
    const d = world.doorAt(cx, cy); if (!d) return;
    if (d.locked && !p.keys.has('red')) { world.addMessage('you need a red key'); audio.noAmmo(); return; }
    if (d.state === 'closed' || d.state === 'closing') { d.state = 'opening'; audio.door(); }
  } else if (c === 8) {
    world.requestExit = true; audio.door(); world.addMessage('exit!');
  }
}

export function updateDoors(world, dt) {
  const p = world.player;
  for (const d of world.doors.values()) {
    if (d.state === 'opening') { d.open += dt * 1.6; if (d.open >= 1) { d.open = 1; d.state = 'open'; d.timer = 4; } }
    else if (d.state === 'open') {
      d.timer -= dt;
      if (d.timer <= 0) {
        if ((p.x | 0) === d.x && (p.y | 0) === d.y) d.timer = 1; // no cerrar sobre el player
        else d.state = 'closing';
      }
    } else if (d.state === 'closing') { d.open -= dt * 1.6; if (d.open <= 0) { d.open = 0; d.state = 'closed'; } }
  }
}
