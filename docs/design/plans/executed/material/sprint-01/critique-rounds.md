# Visual Critique Loop — Sprint 01 (LUMEN Fase 3.5)

Render del dev server → captura Playwright headless → lectura multimodal (visión) →
gap report → fix **1 weak point por round** → re-captura → comparación. ≤3 rounds.
Screenshots en `docs/design/critique/sprint-01/`.

> **Nota de método**: el agente que ejerce el sprint **sí tiene visión multimodal**, así que
> interpretó los pixels directamente (no se requirió el fallback de director eyeball de v0.11.0).
> Multi-res verificada a 1920×1080 (`r3-1920.png`): letterbox simétrico, sin el whitespace
> asimétrico que originó el patch v0.11.0. Anti-pattern "responsive solo a 1440" no aplica
> (canvas de aspecto fijo centrado).

## Round 1 — Iluminación / contraste

- **Captura**: `r1-gameplay-1280.png` (antes) → `r1-gameplay-after.png` (después).
- **Gap report**: la escena se leía **turbia y oscura**. El shading por distancia (`1 - d/13`,
  min 0.12) + la viñeta CRT (box-shadow 140px @0.7, radial 0.55) se apilaban y enturbiaban el
  techbase. DOOM '93 tiene más rango tonal y zonas iluminadas.
- **Fix (1 weak point: brillo del sistema de luz)**: curva de shading a `1.12 - d/16` (más
  brillo cerca, falloff más suave, min 0.2) en walls/floor/ceiling/sprites/partículas; side-shade
  0.7→0.78; viñeta CRT a 110px @0.5 + radial 0.4; scanline 0.20→0.16.
- **Resultado**: rango tonal recuperado, techbase legible, mantiene profundidad (lejos sigue
  oscuro). Gap cerrado ~estimado 60%. ✅ proceder.

## Round 2 — Silueta del imp

- **Captura**: `r2-imp.png`.
- **Gap report**: el imp se leía como **masa roja redonda**, no como demonio (R1 materializado).
  Es el sprite más visto del juego.
- **Fix (1 weak point: legibilidad del imp)**: redibujo con silueta clara — postura encorvada,
  cuernos curvos, **ojos amarillos brillantes**, garras blancas, hombros con espigas, piernas
  digitigradas. Mitad izquierda + `mirror()`.
- **Resultado**: ahora se lee inequívocamente como imp. ✅ proceder.

## Round 3 — Coherencia de los tres enemigos

- **Captura**: `r3-enemies.png` (los 3 juntos) + `r3-1920.png` (multi-res).
- **Gap report**: zombie y pinky seguían en el estándar viejo (blobs), rompiendo la **coherencia
  sistémica** (Visual DNA axioma 1) contra el imp ya mejorado.
- **Fix (1 weak point: coherencia de enemigos)**: zombie → soldado de uniforme verde con casco,
  rifle y ojos huecos (dibujo explícito, sin el `mirror()` que glitcheaba el rifle asimétrico);
  pinky → demonio rosa cuadrúpedo con fauces de dientes y ojos amarillos.
- **Resultado**: los tres enemigos legibles, distintos y del mismo sistema visual (rojo/rosa/verde
  sobre la paleta Hell-Brown). ✅ loop cerrado en 3 rounds (no se alcanzó round 4 → Material.0
  estaba bien calibrado).

## Veredicto del loop

El piso visual subió de "blobs en penumbra turbia" a "DOOM techbase legible con demonios
reconocibles, cara reactiva y CRT". Las 3 decisiones audaces (CRT-lens, cara viva, grima) se
sostienen en pantalla. Pendiente de techo: el arte procedural tiene límite de detalle — el ojo
del director (LUMEN "Sobre el ojo del director") podría pedir otra vuelta, pero el piso objetivo
del sprint está alcanzado.
