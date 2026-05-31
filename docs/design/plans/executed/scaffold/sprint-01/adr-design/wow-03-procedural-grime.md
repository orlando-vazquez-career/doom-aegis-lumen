# wow-ADR-03 — Grima procedural como firma

**Estado**: propuesto (se confirma en Gate 1) · **Decisión audaz #3**

## Qué

Ningún asset procedural es "limpio". Toda textura (pared/piso/techo) y todo sprite lleva:
- **Dithering Bayer** (ordenado) para sombreado y transiciones de profundidad.
- **Ruido** (grain) de bajo nivel sobre cada superficie.
- **Asimetría** intencional (manchas, daño, variación célula-a-célula) para que no se lea "tile repetido perfecto".

## Por qué (audacia)

Convierte la principal limitación del enfoque (assets generados por código, sin pixel-art a mano) en la **firma estética**. La suciedad comprometida es exactamente lo que separa DOOM ('93, sucio, orgánico) de un template HTML5 limpio. Anti-default directo contra el "Tailwind genérico" que disparó el bump de LUMEN v0.10.0.

## Cómo (alto nivel)

Funciones de generación de textura que recibe `(seed, palette, grimeLevel)` y componen base + manchas + dither + grain a un canvas offscreen → `ImageData` para el raycaster. RNG con seed para reproducibilidad (mismo nivel = mismas texturas siempre).

## Trade-off

Demasiada grima puede volverse **ruido** que daña la legibilidad (especialmente en variación C Demake, que ya es dither puro). Mitigación: `grimeLevel` calibrado por variación; el Critique Loop mide "ruido vs. legibilidad" como dimensión explícita; las superficies de gameplay-crítico (puertas, switches, pickups) llevan menos grima y más contraste para que se lean.

## Interacción con la variación elegida

A '93: grima cálida marrón. · B Neon: grima = niebla + glow noise. · C Demake: ES el dither, al máximo. · D Industrial: grima = óxido, rayones, manchas de aceite sobre metal.
