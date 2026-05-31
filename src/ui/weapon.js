// weapon.js (ui) — viewmodel del arma en primera persona, dibujado con primitivas
// (sobre el frame ya volcado). Bob al caminar + kick al disparar + muzzle flash.

const C = { steel: '#6a6a70', mid: '#48484e', dark: '#26262a', wood: '#5a3a1a', bone: '#cfc0a0', flash: '#ffe070', flash2: '#ff9028', glow: '#7ad0ff' };
const rect = (ctx, x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x | 0, y | 0, w | 0, h | 0); };

export function drawWeapon(ctx, player, W, VH) {
  const bobX = Math.cos(player.bob) * 3 * player.bobActive;
  const bobY = Math.abs(Math.sin(player.bob)) * 3 * player.bobActive + player.kick * 7;
  const cx = (W / 2 + bobX) | 0;
  const y = (VH + 1 - bobY) | 0;
  const flash = player.muzzle > 0;
  switch (player.current) {
    case 'fist': return drawFist(ctx, cx, y);
    case 'pistol': return drawPistol(ctx, cx, y, flash);
    case 'shotgun': return drawShotgun(ctx, cx, y, flash);
    case 'chaingun': return drawChaingun(ctx, cx, y, flash);
    case 'plasma': return drawPlasma(ctx, cx, y, flash);
  }
}

function muzzle(ctx, x, y, big = 0) {
  rect(ctx, x - 4 - big, y - 4, 8 + big * 2, 8, C.flash);
  rect(ctx, x - 2, y - 8, 4, 8, C.flash);
  rect(ctx, x - 6 - big, y - 1, 12 + big * 2, 3, C.flash2);
  rect(ctx, x - 1, y - 10, 2, 4, '#fff');
}

function drawFist(ctx, cx, y) {
  rect(ctx, cx + 14, y - 22, 16, 22, C.bone);
  rect(ctx, cx + 14, y - 22, 16, 4, '#e8dcb8');
  for (let i = 0; i < 4; i++) rect(ctx, cx + 15 + i * 4, y - 22, 2, 8, C.dark);
}

function drawPistol(ctx, cx, y, flash) {
  rect(ctx, cx - 6, y - 8, 14, 8, C.dark);   // mano
  rect(ctx, cx - 4, y - 20, 9, 14, C.steel);  // cuerpo
  rect(ctx, cx - 2, y - 28, 5, 10, C.mid);    // canon
  if (flash) muzzle(ctx, cx, y - 28);
}

function drawShotgun(ctx, cx, y, flash) {
  rect(ctx, cx - 9, y - 6, 22, 6, C.wood);     // pump
  rect(ctx, cx - 6, y - 30, 14, 24, C.steel);  // cuerpo
  rect(ctx, cx - 5, y - 34, 5, 8, C.mid);      // canon 1
  rect(ctx, cx + 1, y - 34, 5, 8, C.mid);      // canon 2
  if (flash) muzzle(ctx, cx, y - 34, 2);
}

function drawChaingun(ctx, cx, y, flash) {
  rect(ctx, cx - 10, y - 8, 22, 8, C.dark);
  rect(ctx, cx - 8, y - 30, 18, 22, C.mid);
  for (let i = -1; i <= 1; i++) rect(ctx, cx + i * 6 - 2, y - 38, 4, 10, C.steel); // barriles
  if (flash) { muzzle(ctx, cx - 6, y - 38); muzzle(ctx, cx + 6, y - 38); muzzle(ctx, cx, y - 40, 1); }
}

function drawPlasma(ctx, cx, y, flash) {
  rect(ctx, cx - 8, y - 8, 18, 8, C.dark);
  rect(ctx, cx - 9, y - 30, 20, 22, C.steel);
  rect(ctx, cx - 4, y - 34, 9, 8, C.mid);
  rect(ctx, cx - 3, y - 33, 7, 4, C.glow); // nucleo brillante
  if (flash) { rect(ctx, cx - 6, y - 40, 12, 8, C.glow); rect(ctx, cx - 3, y - 44, 6, 6, '#dffaff'); }
}
