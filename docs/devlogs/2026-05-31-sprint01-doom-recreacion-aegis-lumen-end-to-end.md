# Sprint 01 — Recreación de DOOM end-to-end con AEGIS + LUMEN

**Fecha**: 2026-05-31
**Fases ejecutadas**: estrategia → arquitectura → táctica → ⏸Gate 1⏸ → ejecución → guardrails → ⏸Gate 2⏸ → state-sync
**Plan origen**: `docs/plans/executed/estrategia/sprint-01/01-overview-alcance-actores.md`
**Repos afectados**: `can-it-recreate-doom` (nuevo)
**Tests**: `node --check` 26/26 módulos · verificación funcional dirigida vía `__DOOM` (combate, IA, pickups, puertas, nivel 2) · perf probe
**Build**: OK — jugable en `http://localhost:8123`

## Resumen

Experimento: ¿AEGIS+LUMEN (proceso disciplinado con gates) supera a 15 modelos frontier one-shot
recreando DOOM? Se construyó una web app jugable estilo DOOM en **vanilla JS, cero deps de runtime,
assets 100% procedurales**. La tesis competitiva se confirmó en la práctica: el campo omite
sistemáticamente **audio (0/15), la cara reactiva del marine (~0/15) y dirección de arte committed**
— los tres están entregados acá, sobre la dirección visual más fiel ("Hell-Brown '93"), de modo que
la ventaja es de **ejecución**, no de truco visual.

## Cambios entregados

**Motor** (`src/engine/`): raycaster DDA con corrección anti-fisheye, floor/ceiling casting
incremental, z-buffer por columna, puertas deslizantes · sprites billboard con oclusión · texturas
y sprites procedurales con grima/dither (seed-reproducibles) · Web Audio SFX procedurales · input
teclado+pointer-lock · loop de timestep fijo.

**Gameplay** (`src/game/`): player (mov/colisión/vida/armor/inventario) · 4 armas (pistola, escopeta
con spread, chaingun, plasma) + puños · 3 enemigos con FSM e IA distinta (zombie hitscan, imp
fireball, pinky melee) · proyectiles · partículas pooled · pickups, puertas con llave, switch de
salida · 2 niveles con transición.

**UI** (`src/ui/`): status bar STBAR (ammo/health/ARMS/**cara**/armor/keys) con fuente pixel roja ·
**cara reactiva** del marine (5 etapas × dirección de daño × expresiones) · minimapa · title /
game-over / victory / pausa · viewmodel de arma con bob + muzzle flash.

## Decisiones técnicas tomadas

- **Canvas 2D raycaster, no WebGL/Three.js** (ADR-01): traducción honesta de DOOM, look pixelado
  auténtico, control total de píxel para CRT, cero deps. 4 modelos del campo usaron Three.js → se
  ve "3D moderno", no DOOM.
- **Assets 100% procedurales** (ADR-01/wow-03): el orquestador no puede autorear binarios → se
  convirtió la limitación en firma estética (grima). Repo 100% texto, reproducible, sin licencias.
- **Resolución interna 320×200** (auténtica DOOM) en vez de 480×270: más barata y más fiel.
- **Reconciliación de protocolos**: AEGIS v2.0 prohíbe subagentes; LUMEN Material.1 los pide para
  variaciones. Se resolvió generando las 4 variaciones **inline por el orquestador** (sin spawnear
  agentes), respetando la regla dura de AEGIS. Todo el sprint se ejecutó en consola, observable.

## Incidentes durante la ejecución

- **rAF throttling en headless**: el FPS in-game leía ~4-6 en Playwright headless (no es perf real,
  es throttle de `requestAnimationFrame`). Se mitigó con un **perf probe de cómputo directo**
  (`__DOOM.benchRender`) → 4.2 ms/frame, ~238 fps headroom. Lección: no medir FPS por rAF en headless.
- **Driving por inputs scripteados** poco fiable por el slow-motion de headless → se adoptó
  verificación **determinista** vía `__DOOM.step()`/`fire()` (teleport + avanzar sim N ticks).
- **Bug de mirror en sprites**: el rifle asimétrico del zombie se borraba con `mirror()` → se pasó a
  dibujo explícito. Quirk cosmético residual: el imp en pose de ataque muestra fireball en ambas
  manos (no bloqueante, documentado).

## Cómo reproducir / verificar

```bash
npm run dev                  # http://localhost:8123  (jugar; cero install para jugar)
node --check src/**/*.js     # sintaxis
node tools/_verify.mjs out.png "<js via __DOOM>"   # verificación dirigida + screenshot
```
Captura de combate de referencia: `docs/design/evidence/sprint-01/visual-regression/money-shot.png`.

## Resultado del experimento (vs baseline CSV)

Confirmado en pantalla: los 3 diferenciadores que el campo omite (audio, cara reactiva, arte
committed) + completitud (floor-casting, puertas, minimapa, multinivel, 3 enemigos, 4 armas) +
correctness (sin fisheye, z-sort correcto, colisión robusta, timestep fijo). La ventaja del proceso
no fue "más líneas" sino **identidad sensorial + correctness**, exactamente la hipótesis de la fase
Estrategia.

## Pendiente (futuro sprint)

- Pulido de arte procedural (techo de detalle; el ojo del director podría pedir otra vuelta).
- Imp ataque: fireball en una sola mano (dibujar tras `mirror`).
- Diseño de niveles: auditar reachability a fondo; más niveles.
- A11y: flag `prefers-reduced-motion` que baje el flash de daño; contraste de números del HUD.
- Stretch del out-of-scope: touch/móvil, sonido con más cuerpo, más enemigos (proyectiles del pinky, etc.).

## Uso y costo

| Modelo | Input tokens | Output tokens | USD | Duración |
|---|---|---|---|---|
| claude-opus-4-8 (1M) | no instrumentado | no instrumentado | n/d | sesión única |

> El harness de esta sesión no instrumenta tokens/costo con precisión. Se registra el modelo y se
> marca n/d en vez de fabricar cifras (honestidad sobre el ledger, per AEGIS).

## Referencias

- Estrategia: `docs/plans/executed/estrategia/sprint-01/`
- ADRs: `docs/plans/executed/arquitectura/`
- Tareas atómicas: `docs/plans/executed/tactica/sprint-01/00-tareas-atomicas.md`
- LUMEN (dirección de arte): `docs/design/devlogs/2026-05-31-sprint-01.md`
- Evidence: `docs/design/evidence/sprint-01/` (perf, a11y, heurística)
- Critique Loop: `docs/design/plans/executed/material/sprint-01/critique-rounds.md`
