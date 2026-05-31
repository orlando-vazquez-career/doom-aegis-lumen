# ADR-02 — Modularidad ES y game loop

**Estado**: aceptado · **Fecha**: 2026-05-31 · **Fase**: Arquitectura (AEGIS)

## Decisión 1 — ES modules nativos, sin bundler

El campo entregó casi todo en archivos HTML monolíticos (un `<script>` gigante). Scope C es demasiado para un archivo y AEGIS exige unidades pequeñas y testeables (filosofía de "isolation and clarity").

Estructura:

```
index.html            # canvas, overlay HUD DOM, overlay CRT, <script type=module>
src/
  main.js             # bootstrap, state machine (title/play/dead/victory), game loop
  engine/
    raycaster.js      # DDA walls + floor/ceiling casting → ImageData
    sprites.js        # billboard render con z-buffer + sorting
    textures.js       # generación procedural de texturas (pared/piso/techo)
    spriteArt.js      # generación procedural de sprites (enemigos/armas/items)
    audio.js          # Web Audio: SFX procedurales + ambiente
    input.js          # teclado + pointer-lock mouse
    mathx.js          # helpers (clamp, lerp, vec, RNG con seed)
  game/
    player.js         # movimiento, colisión, inventario, vida/armor
    weapons.js        # defs de armas, fire (hitscan + spread), munición, anim
    enemies.js        # tipos + state machine AI (idle/chase/attack/pain/die)
    projectiles.js    # fireballs, plasma
    particles.js      # sangre, puffs, explosiones (pooled)
    things.js         # pickups, puertas, switch de salida
    level.js          # mapas grid, spawns, transición de nivel, dificultad
    world.js          # estado mutable del mundo + update tick
  ui/
    hud.js            # status bar, contadores, arma activa
    face.js           # cara DOOMguy procedural reactiva
    minimap.js        # minimapa
    screens.js        # title/game-over/victory/mensajes
  styles/
    game.css          # layout, CRT/scanline overlay, tokens consumidos
DESIGN.md             # contrato visual (LUMEN)
```

**Trade-off**: ES modules requieren servir por HTTP (no `file://`) por CORS de módulos. Aceptado — un static server de una línea. Documentado.

## Decisión 2 — Game loop de timestep fijo con acumulador

`requestAnimationFrame` da el ritmo de render; la simulación avanza en pasos fijos (p.ej. 1/60 s) con un acumulador. Render interpola si hace falta.

**Rationale**: física/AI/colisión deterministas e independientes del framerate. Evita el bug clásico del campo: velocidad de movimiento atada a FPS (corrés más rápido en una máquina veloz). Pausa limpia, y spiral-of-death cap.

**Trade-off**: leve complejidad extra vs. `dt` crudo. Justificado por correctness (criterio de éxito #4).
