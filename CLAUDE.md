# CLAUDE.md — DOOM (AEGIS + LUMEN)

Reglas del repo para Claude Code. Recreación de DOOM como web app, construida con los protocolos
**AEGIS** (ingeniería) y **LUMEN** (dirección de arte). Sandbox/experimento.

## Qué es

Web app jugable estilo DOOM: raycaster Canvas 2D, **vanilla JS, cero dependencias de runtime,
assets 100% procedurales** (texturas, sprites, sonido y la cara del HUD se generan por código).
Resolución interna **320×200** (viewport 168 + status bar 32), escalada con `image-rendering: pixelated`.

## Cómo correr

El juego en sí **no requiere `npm install`** (cero deps de runtime). Pero los ES modules necesitan
servirse por HTTP (no `file://`).

```bash
npm run dev        # levanta tools/serve.mjs (static server con MIME correcto) en :8123
# abrir http://localhost:8123
```

`npm install` solo instala **playwright** (devDependency) para el harness de screenshots del Visual
Critique Loop (`tools/screenshot.mjs`, `tools/_verify.mjs`). No es necesario para jugar.

Controles: **WASD** mover · **mouse**/flechas mirar · **click/Ctrl** disparar · **Space/E** usar ·
**Shift** correr · **1-5** armas · **Tab** mapa · **M** mute · **P** pausa.

## Arquitectura (ver ADRs en docs/plans/executed/arquitectura/)

```
src/
  main.js              loop timestep fijo + state machine (title/play/paused/dead/victory)
  engine/
    raycaster.js       DDA walls + floor/ceiling casting + z-buffer
    sprites.js         billboards con oclusion por z-buffer
    textures.js        texturas procedurales (grima/dither — wow-03)
    spriteArt.js       sprites procedurales (enemigos/items/proyectiles)
    audio.js           Web Audio SFX procedurales (singleton `audio`)
    input.js           teclado + pointer-lock
    palette.js         tokens-maquina (cross-ref DESIGN.md) + helpers de color empacado
    mathx.js           helpers puros (RNG con seed, angulos)
  game/
    world.js           estado + queries (cell/door/solid/LOS) + spawn + transicion de nivel
    player.js          movimiento/colision/vida/inventario
    weapons.js         defs + fire (hitscan+proyectil)
    enemies.js         3 arquetipos + FSM idle/chase/attack/pain/die
    projectiles.js     fireball/plasma
    particles.js       sangre/puffs/explosiones (pool)
    things.js          pickups/puertas/salida
    level.js           mapas grid + parser resiliente
  ui/
    hud.js  face.js  minimap.js  screens.js  weapon.js  font.js
DESIGN.md              contrato visual (LUMEN), tokens primitivos+semanticos
```

## Convenciones

- **Sin dependencias de runtime.** Si algo necesita una lib, primero evaluar generarlo procedural.
- Colores empacados little-endian RGBA (`palette.rgb`) para escritura rápida en el framebuffer Uint32.
- Texturas/sprites con **seed** (`mulberry32`) → reproducibles.
- Render: `renderWorld` (ImageData) → `putImageData` → HUD/weapon con ctx 2D encima.
- No usar `Date.now()`/`Math.random()` donde se requiera determinismo de assets (usar RNG con seed).
- `window.__DOOM` expone hooks de debug/verificación (fire/step/bench/showMap) — inocuos, se podrían
  quitar para "producción".

## Protocolos

- **AEGIS** v2.1.0 — protocolo de ingeniería: ejecución secuencial en consola, sin subagentes.
- **LUMEN** v0.11.0 — protocolo de dirección de arte; Visual Critique Loop multimodal
  con Playwright (`tools/`). Dirección activa: **A "Hell-Brown '93"**.
- Devlogs: `docs/devlogs/` (AEGIS) y `docs/design/devlogs/` (LUMEN). Índices en `docs/INDEX.md` y
  `docs/design/INDEX.md`.

## Verificación

- Sintaxis: `node --check` sobre `src/**` y `tools/**` (26/26 OK al cierre del sprint 01).
- Visual + perf: `node tools/_verify.mjs <out.png> "<js setup>"` (teletransporta/mide vía `__DOOM`).
- Perf medida: ~4.2 ms/frame, ~238 fps headroom (headless software — cota conservadora).
