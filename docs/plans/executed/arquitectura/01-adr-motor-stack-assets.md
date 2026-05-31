# ADR-01 — Motor, stack y assets

**Estado**: aceptado · **Fecha**: 2026-05-31 · **Fase**: Arquitectura (AEGIS)
**Decisores**: orquestador (cierra decisión técnica no trivial sin humano, per AEGIS).

## Contexto

Scope C requiere raycaster con floor-casting, sprites, proyectiles, partículas, multi-nivel, HUD rico y audio — todo en web, sin assets binarios, jugable abriendo un archivo.

## Decisión 1 — Motor: Canvas 2D raycaster (DDA), NO WebGL/Three.js

**Elegido**: raycasting por columnas con algoritmo DDA sobre un grid, escribiendo a un `ImageData` de resolución interna baja (~480×270) escalado a pantalla con `image-rendering: pixelated`.

**Alternativas**:
- *WebGL puro*: máximo rendimiento, pero reescribe el problema como rasterización 3D y pierde el look pixelado 2.5D auténtico; más superficie de bug; over-engineering para el target.
- *Three.js*: 4 modelos del campo lo usaron → produce un "3D moderno" que **no se siente DOOM**. Además dependencia de runtime pesada. Rechazado por dirección de arte (LUMEN) y por la regla de cero-dependencias.

**Rationale**: el raycaster por columnas es la traducción honesta de DOOM a web. La resolución interna baja es simultáneamente (a) perf, (b) estética auténtica, (c) tolerancia para assets procedurales (R1). Control total de cada píxel → habilita CRT/scanlines/dithering en post.

**Trade-off aceptado**: sin geometría no-ortogonal real (paredes diagonales) ni habitaciones-sobre-habitaciones. DOOM original tampoco tenía lo segundo. Suficiente para el idioma.

## Decisión 2 — Assets 100% procedurales

Texturas de pared/piso/techo, sprites de enemigos/armas/items, y la cara del HUD se **generan por código** a canvases offscreen en el boot, y se leen como arrays de píxeles para el raycaster.

**Rationale**: (a) el orquestador no puede autorear binarios; (b) repo 100% texto = reproducible, diffeable, sin licencias; (c) control de arte total para matchear la variación estética elegida; (d) convierte una limitación en flex.

**Trade-off**: arte procedural tiene techo de detalle más bajo que pixel-art a mano. Mitigado por R1 (baja-res + CRT) y el Critique Loop.

## Decisión 3 — Sin secretos, sin red, sin eval

Juego 100% client-side, sin fetch externo, sin `eval`/`Function(string)`. Simplifica el security audit de Guardrails a casi trivial y garantiza que corre offline desde `file://` o un static server.

## Consecuencias

- Dev/run: basta un static server (`npx serve` o `python -m http.server`) por la policy de ES modules sobre `file://`. Documentar en CLAUDE.md.
- Perf: presupuesto de frame dominado por floor-casting; perfilar en Evidence (R2).
- Testing: lógica pura (raycaster math, colisión, AI state) es unit-testeable sin DOM.
