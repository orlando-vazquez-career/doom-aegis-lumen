# 01 — Overview, alcance, actores, criterios

## Contexto

Experimento: ¿puede el binomio **AEGIS + LUMEN** (proceso disciplinado, multi-fase, con gates humanos) producir una recreación de DOOM **mejor** que la de 15 modelos frontier respondiendo en un solo disparo? El prompt del eval es literal: *"Recreate the FPS game DOOM as a web app."* El CSV de respuestas (`can-it-recreate-doom-...responses.csv`) es nuestro **baseline de referencia**, no material a copiar.

La hipótesis: el one-shot converge a un mínimo común (raycaster + enemigos + disparo + estética genérica) y **omite sistemáticamente** lo que da identidad a DOOM. El proceso disciplinado cubre esos huecos. Ver `02-baseline-csv-tesis-competitiva.md`.

## Alcance — Scope C (Máximo), elegido por el director en Gate 0

Entregable: **web app jugable de DOOM**, vanilla JS + Canvas 2D, sin dependencias de runtime, assets 100% procedurales (cero binarios). Incluye:

**Motor**
- Raycasting DDA con paredes texturizadas + floor/ceiling casting.
- Render de sprites billboard con z-buffer (oclusión correcta por columna).
- Resolución interna baja escalada con `image-rendering: pixelated` (look auténtico + perf).
- Game loop de timestep fijo (determinismo de física, independiente de FPS).

**Gameplay**
- Player: WASD + strafe, mouse-look (pointer lock), colisión circle-vs-grid, vida + armadura.
- 3+ tipos de enemigo con IA distinta: hitscan (zombie), proyectil (imp + fireball), melee-charge (pinky).
- 3+ armas con switching: pistola, escopeta (spread), chaingun, plasma.
- Proyectiles (fireballs, plasma), partículas (sangre, puffs, explosiones).
- Pickups (vida, armadura, munición, armas), puertas, switch de salida.
- Multi-nivel con transición y curva de dificultad.

**UI / identidad**
- Status bar con la **cara del DOOMguy dibujada proceduralmente** que reacciona a vida + dirección del daño + pickups.
- Munición / vida / armadura / arma activa.
- Minimapa.
- Title screen, game-over, victory, mensajes HUD.

**Audio**
- SFX procedurales (Web Audio): disparo por arma, growl/muerte de enemigo, puerta, pickup, dolor del player, ambiente drone.

## Actores

| Actor | Rol |
|---|---|
| **Player** (humano final) | Juega. Quiere el power-fantasy de DOOM en <10s, sin fricción de setup. |
| **Orquestador** (Claude, esta sesión) | Ejecuta TODO en consola, secuencial, sin subagentes (regla dura AEGIS v2.0.0). |
| **Director** (Orlando) | Aprueba en Gate 1 (plan + estética) y Gate 2 (cierre). Su ojo cultivado fija el techo de calidad (LUMEN "Sobre el ojo del director"). |

## Criterios de éxito (verificables)

1. El juego abre y es jugable en <10s desde un `index.html` servido localmente.
2. 60fps estables en hardware de escritorio moderno a resolución interna objetivo.
3. Implementa los **3 diferenciadores que el campo omite**: audio, cara reactiva, dirección de arte comprometida (no Tailwind genérico).
4. Raycasting sin fisheye, sin glitches de z-sorting de sprites, colisión sin atravesar paredes.
5. ≥3 enemigos, ≥3 armas, ≥2 niveles, loop de combate completo (spawn → combate → muerte/pickup → salida).
6. Paper trail completo de ambos protocolos (planes, ADRs, pillars, critique loop, evidence, devlogs).

## Out-of-scope (YAGNI explícito)

- WADs reales / assets originales de id Software (copyright + somos procedurales por diseño).
- Niveles canónicos exactos (E1M1) — hacemos niveles **originales en el idioma DOOM**.
- Multiplayer, networking, save games persistentes.
- Editor de niveles in-app.
- Soporte touch/móvil completo (teclado+mouse es el target; touch queda como posible stretch post-sprint).
- Paridad 1:1 con el engine BSP original (usamos grid raycaster, que es la elección honesta para web).
