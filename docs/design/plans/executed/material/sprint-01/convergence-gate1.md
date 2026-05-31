# Material.2 — Convergence (Gate 1)

**Fecha**: 2026-05-31 · **Decisión del director en Gate 1.**

## Dirección elegida

**Variation A — "Hell-Brown '93"** (fidelidad reverente al DOOM original).

## Rationale del director (interpretada y asumida)

La variación A fue marcada en su propio preview con el riesgo *"es lo que un buen one-shot intentaría"*. Elegirla deliberadamente fija la tesis del sprint: **no competimos por audacia visual, competimos por EJECUCIÓN dentro del look canónico**. Ganamos donde el campo falla aunque intente el mismo look:

- **Audio procedural** (0/15 lo tiene).
- **Cara del marine reactiva** (~0/15).
- **Correctness** (sin fisheye, z-sort correcto, colisión robusta, timestep fijo).
- **Completitud** (floor-casting, puertas, minimapa, multi-nivel, partículas, 3 enemigos, 4 armas).

El look es el terreno conocido; la victoria es hacerlo *bien* y *completo* donde otros lo hacen a medias.

## Parámetros locked para el build

| Eje | Valor (de `variations/a-hell-brown-93.md`) |
|---|---|
| Paleta | techbase `#6b4a2b/#4a3220/#2a1d12` · blood `#a01010/#d22020/#ff3a1a` · toxic `#2f6e16/#6abe30` · bone `#d8c8a0` · black `#0a0806` |
| Tipografía | slab roja bitmap procedural, mayúsculas, sombra dura 1px, sin AA |
| CRT (wow-01) | intensidad **moderada y cálida** |
| Grima (wow-03) | cálida, marrón, dither Bayer + grain |
| Cara (wow-02) | confirmada como co-protagonista del HUD |

## Persistido para sprints futuros

B (Hell-Neon PSX/SIGIL), C (Demake 1-bit), D (Brutalist UAC) quedan documentadas en `variations/` como archivos versionados, para reuso o como base de un re-skin futuro (la capa semántica de tokens permite cambiar la dirección tocando un solo archivo de mapeo).
