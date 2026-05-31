// main.js — bootstrap, game loop de timestep fijo, state machine, wiring completo.

import { Input } from './engine/input.js';
import { buildTextures } from './engine/textures.js';
import { buildSprites } from './engine/spriteArt.js';
import { renderWorld } from './engine/raycaster.js';
import { renderSprites } from './engine/sprites.js';
import { audio } from './engine/audio.js';
import { World } from './game/world.js';
import { updateEnemy } from './game/enemies.js';
import { updateProjectiles } from './game/projectiles.js';
import { updatePickups, updateDoors, tryUse } from './game/things.js';
import { fire, switchWeapon } from './game/weapons.js';
import { drawWeapon } from './ui/weapon.js';
import { drawHud, drawMessages } from './ui/hud.js';
import { drawMinimap } from './ui/minimap.js';
import { drawTitle, drawEnd, drawPaused } from './ui/screens.js';

const W = 320, H = 200, VH = 168, centerY = (VH / 2) | 0;
const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d', { alpha: false });
ctx.imageSmoothingEnabled = false;
const img = ctx.createImageData(W, H);
const buf32 = new Uint32Array(img.data.buffer);
const zbuf = new Float32Array(W);
const fb = { buf32, W, H, VH, centerY };

const tex = buildTextures();
const art = buildSprites();
const input = new Input();
input.attach(canvas);
const difficulty = 1;
let world = new World(0, art, difficulty);
let state = 'title';     // title | play | paused | dead | victory
let endT = 0, clock = 0, showMap = false;

const hint = document.getElementById('hint');
function resize() {
  const s = Math.max(1, Math.min(innerWidth / W, innerHeight / H));
  canvas.style.width = (W * s) + 'px'; canvas.style.height = (H * s) + 'px';
}
addEventListener('resize', resize); resize();

function startGame() { audio.resume(); world = new World(0, art, difficulty); state = 'play'; endT = 0; }
function toTitle() { state = 'title'; }

function handleEdges() {
  audio.resume();
  const wd = input.weaponDigit();
  if (wd) switchWeapon(world.player, wd, audio);
  if (input.use) tryUse(world, audio);
  if (input.hit('KeyM')) audio.toggleMute();
  if (input.mapToggle) showMap = !showMap;
  if (input.hit('KeyP')) state = 'paused';
}

function step(dt) {
  const p = world.player;
  p.update(dt, input, world);
  if (input.fire) fire(world, audio, art);
  for (const e of world.enemies) updateEnemy(e, dt, world, audio, art);
  updateProjectiles(world, dt, audio, art);
  world.particles.update(dt);
  updateDoors(world, dt);
  updatePickups(world, audio);
  world.updateMessages(dt);
  world.time += dt;

  if (world.requestExit) {
    world.requestExit = false;
    if (world.nextLevel()) world.addMessage('entering ' + world.level.name);
    else { state = 'victory'; endT = 0; }
  }
  if (p.dead && state === 'play') { state = 'dead'; endT = 0; audio.playerDie(); }
}

function updateHint() { if (hint) hint.style.display = (state === 'play' && !input.locked) ? '' : 'none'; }

function render() {
  if (state === 'title') { drawTitle(ctx, W, H, clock); updateHint(); return; }

  renderWorld(fb, world, tex, zbuf);
  const ents = [];
  for (const e of world.enemies) ents.push(e);
  for (const pr of world.projectiles) ents.push(pr);
  for (const pk of world.pickups) ents.push(pk);
  renderSprites(fb, world.player, ents, zbuf);
  world.particles.render(fb, world.player, zbuf);
  ctx.putImageData(img, 0, 0);

  if (state === 'play' || state === 'paused') drawWeapon(ctx, world.player, W, VH);

  const p = world.player;
  if (p.damageFlash > 0) { ctx.fillStyle = `rgba(170,0,0,${p.damageFlash * 0.45})`; ctx.fillRect(0, 0, W, VH); }
  if (p.pickupFlash > 0) { ctx.fillStyle = `rgba(200,180,80,${p.pickupFlash * 0.3})`; ctx.fillRect(0, 0, W, VH); }

  drawHud(ctx, world, W, VH, H);
  drawMessages(ctx, world);
  if (showMap) drawMinimap(ctx, world, W);

  if (state === 'dead') drawEnd(ctx, W, VH, world, false, clock);
  else if (state === 'victory') drawEnd(ctx, W, VH, world, true, clock);
  else if (state === 'paused') drawPaused(ctx, W, VH);
  updateHint();
}

const STEP = 1 / 60;
let acc = 0, last = performance.now(), fps = 0, fpsAcc = 0, fpsCount = 0;

function frame(now) {
  let dt = (now - last) / 1000; last = now;
  if (dt > 0.25) dt = 0.25;
  clock += dt;

  if (state === 'title') { if (input.anyKey) startGame(); }
  else if (state === 'play') {
    handleEdges();
    acc += dt;
    let guard = 0;
    while (acc >= STEP && guard++ < 6) { step(STEP); acc -= STEP; }
  } else if (state === 'paused') {
    if (input.hit('KeyP') || input.hit('Escape')) state = 'play';
    acc = 0;
  } else { // dead | victory
    endT += dt; if (endT > 0.8 && input.anyKey) toTitle();
    acc = 0;
  }

  input.endFrame();
  render();

  fpsAcc += dt; fpsCount++;
  if (fpsAcc >= 0.5) { fps = fpsCount / fpsAcc; fpsAcc = 0; fpsCount = 0; }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

window.__DOOM = {
  get world() { return world; },
  get state() { return state; },
  set state(s) { state = s; },
  fire: () => fire(world, audio, art),
  step: (n = 1) => { for (let i = 0; i < n; i++) step(STEP); },
  set showMap(v) { showMap = v; },
  benchRender: (n = 120) => { const t = performance.now(); for (let i = 0; i < n; i++) render(); return +((performance.now() - t) / n).toFixed(3); },
  benchStep: (n = 600) => { const t = performance.now(); for (let i = 0; i < n; i++) step(STEP); return +((performance.now() - t) / n).toFixed(4); },
};
