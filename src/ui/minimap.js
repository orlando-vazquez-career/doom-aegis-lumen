// minimap.js (ui) — minimapa compacto arriba-derecha. Toggle con Tab.

export function drawMinimap(ctx, world, W) {
  const lv = world.level;
  const cell = Math.max(2, Math.min(3, (W * 0.32 / lv.w) | 0));
  const mw = lv.w * cell, mh = lv.h * cell;
  const ox = W - mw - 4, oy = 4;

  ctx.globalAlpha = 0.78;
  ctx.fillStyle = '#000'; ctx.fillRect(ox - 1, oy - 1, mw + 2, mh + 2);
  ctx.globalAlpha = 1;

  for (let y = 0; y < lv.h; y++) {
    for (let x = 0; x < lv.w; x++) {
      const c = world.cell(x, y);
      if (!c) continue;
      ctx.fillStyle = c === 7 ? '#c8a014' : c === 8 ? '#d22020' : '#6b4a2b';
      ctx.fillRect(ox + x * cell, oy + y * cell, cell, cell);
    }
  }
  for (const pk of world.pickups) { ctx.fillStyle = '#6abe30'; ctx.fillRect((ox + pk.x * cell - 1) | 0, (oy + pk.y * cell - 1) | 0, 2, 2); }
  for (const e of world.enemies) { if (e.dead) continue; ctx.fillStyle = '#ff3a1a'; ctx.fillRect((ox + e.x * cell - 1) | 0, (oy + e.y * cell - 1) | 0, 2, 2); }

  const px = ox + world.player.x * cell, py = oy + world.player.y * cell;
  ctx.fillStyle = '#fff'; ctx.fillRect((px - 1) | 0, (py - 1) | 0, 3, 3);
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(px, py);
  ctx.lineTo(px + Math.cos(world.player.angle) * 6, py + Math.sin(world.player.angle) * 6);
  ctx.stroke();
}
