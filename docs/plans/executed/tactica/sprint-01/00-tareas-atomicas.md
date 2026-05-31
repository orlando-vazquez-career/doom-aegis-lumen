# Táctica — Sprint 01 · Tareas atómicas (AEGIS)

Descomposición de Scope C en **bloques** con criterio de done **verificable**. Orden = dependencias. El orquestador ejecuta en consola, bloque por bloque, sin avanzar si el anterior no corre limpio (mitiga R3: correctness pareja en superficie grande).

Leyenda done: ✅ = criterio observable que prueba el bloque.

---

## B.0 — Bootstrap & loop
- `index.html` (canvas, overlay HUD DOM, overlay CRT, `<script type=module>`), `src/main.js`, `src/engine/mathx.js`.
- Game loop timestep fijo + acumulador; state machine `title/play/paused/dead/victory`.
- Static server doc + `.gitignore` + CLAUDE.md mínimo.
- ✅ Canvas pinta; loop estable a 60fps (contador visible); `title`→`play` con tecla.

## B.1 — Raycaster walls + movimiento
- `engine/raycaster.js` (DDA, paredes color sólido primero), `engine/input.js` (teclado + pointer-lock), `game/player.js` (mov + strafe + colisión circle-vs-grid), `game/level.js` (grid de prueba).
- ✅ Camino por un grid; sin fisheye (corrección coseno); no atravieso paredes; mouse-look fluido.

## B.2 — Texturas + floor/ceiling
- `engine/textures.js` (generación procedural con dither/grain/seed — wow-03), columnas texturizadas, floor/ceiling casting incremental (perf, R2).
- ✅ Paredes + piso + techo texturizados con grima; sin tearing; frame ≤16ms en el test level.

## B.3 — Sprites billboard
- `engine/spriteArt.js` (sprites procedurales), `engine/sprites.js` (billboard + z-buffer de la pasada de paredes + sorting por distancia).
- ✅ Un sprite se ocluye correctamente tras paredes y se ordena con otros sprites; sin "flotar".

## B.4 — Audio procedural  *(independiente, puede ir en paralelo desde B.1)*
- `engine/audio.js`: Web Audio, SFX sintetizados (pistola, escopeta, chaingun, plasma, growl, muerte, puerta, pickup, dolor, click-seco), drone ambiente, master gain + mute, unlock en primer gesto.
- ✅ Cada SFX suena al disparar su trigger de test; mute funciona; no clippea (ADSR + gain).

## B.5 — Armas
- `game/weapons.js`: defs (pistola, escopeta spread, chaingun, plasma), fire hitscan + proyectil, munición, cadencia; sprite de arma + bob + muzzle flash + anim de disparo; switch 1-6 / rueda.
- ✅ Disparo descuenta munición; spread de escopeta; switch entre armas; sin munición → click seco + auto-switch.

## B.6 — Enemigos + IA
- `game/enemies.js`: 3 arquetipos (zombie=hitscan, imp=proyectil, pinky=melee-charge), state machine `idle/chase/attack/pain/die`, line-of-sight, frames de sprite por estado/ángulo.
- ✅ Enemigo detecta (LOS+rango), persigue, ataca según arquetipo, entra en pain, muere con gibs + sonido.

## B.7 — Proyectiles + partículas
- `game/projectiles.js` (fireball del imp esquivable, plasma del player), `game/particles.js` (sangre, puff de bala, explosión) — **pooled** (sin alloc en hot path, R2).
- ✅ Fireball viaja y es esquivable; plasma impacta; sangre al herir; partículas vuelven al pool (sin leak).

## B.8 — Things: pickups, puertas, salida
- `game/things.js`: pickups (health/armor/ammo/weapon/key) con sprite + recogida + sonido; puertas (open/close animadas, key-locked); switch/exit de salida.
- ✅ Pickup suma y suena (no duplica arma); puerta abre con sonido; puerta con llave bloquea + mensaje; exit avanza nivel.

## B.9 — Niveles + dificultad
- `game/level.js` extendido: ≥2 niveles diseñados a mano (grid + spawns + exit + par-time), transición con fade, escala de dificultad (más/duros enemigos).
- ✅ 2 niveles jugables; exit del 1 → carga 2; estado (arma/munición/vida) persiste entre niveles.

## B.10 — HUD + cara reactiva
- `ui/hud.js` (status bar: ammo/health/ARMS/armor/keys), `ui/face.js` (cara procedural reactiva — wow-02: 5 etapas vida × dirección daño × expresiones × idle), `ui/minimap.js`.
- ✅ HUD refleja valores reales; cara cambia con vida/daño/pickup/muerte; minimapa muestra player+paredes+enemigos.

## B.11 — Pantallas + post CRT + pulido
- `ui/screens.js` (title/game-over/victory/mensajes), post-proceso CRT (wow-01: scanlines/viñeta/curvatura/aberración/bloom), pausa, toggle reduce-motion.
- ✅ Flujo completo title→play→death/victory→title; lente CRT visible; controles en title; pausa con Esc.

---

## Mapa de dependencias

```
B.0 ─▶ B.1 ─▶ B.2 ─▶ B.3 ─┬─▶ B.5 ─▶ B.6 ─▶ B.7 ─▶ B.8 ─▶ B.9 ─▶ B.10 ─▶ B.11
                          │
B.4 (audio) ──────────────┘   (independiente; se cablea en B.5+)
```

## Criterio de done del sprint (Gate 2)

Todos los ✅ verdes + los 6 criterios de éxito de `estrategia/01` + Critique Loop ejecutado + Evidence (a11y/perf/heurística) sin rojos críticos. Recién ahí State-Sync.

## Nota de ejecución AEGIS

Sin subagentes. Bloques en consola, observables. Tras cada bloque: reporte breve + verificación (en muchos casos vía screenshot del juego corriendo, que además alimenta el Visual Critique Loop de LUMEN — doble uso).
