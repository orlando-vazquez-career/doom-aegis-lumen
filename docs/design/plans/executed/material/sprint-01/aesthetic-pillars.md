# Material.0 — Aesthetic Pillars · Sprint 01

> **Disclaimer del director (honestidad, no ritual).** LUMEN exige declarar horas de diseño mirado recientemente porque el ojo es la herramienta. En este sprint el *curador* es el orquestador (Claude) proponiendo; el **ojo que decide es el del director en Gate 1**. El orquestador no reemplaza criterio cultivado — sube el piso eliminando el defaulteo genérico. El techo lo pone la elección humana entre las variaciones.

## Referencias visuales (degradación honesta de binarios)

Material.0 pide screenshots descargados a `refs/`. En esta sesión **no hay fetch de imágenes a disco**; las refs se documentan por URL + qué tomar con precisión quirúrgica (mismo valor curatorial, sin el binario). NO son refs genéricas (nada de Tailwind UI / Dribbble — anti-pattern auto-check).

| Ref | URL | Qué tomar específicamente |
|---|---|---|
| DOOM (1993) in-game | doomwiki.org/wiki/DOOM | La paleta marrón-techbase + rojo sangre; la penumbra sectorizada; densidad sucia de las paredes. |
| STBAR (status bar original) | doomwiki.org/wiki/Status_bar | La anatomía: ammo·health·ARMS·FACE·armor·keys. La cara al centro. |
| Caras del marine (STFST*) | doomwiki.org/wiki/Doomguy (sprites de cara) | Las 5 etapas de vida × 3 direcciones de mirada + ouch + god + dead. El lenguaje facial. |
| La fuente del HUD (DOOM "big red font") | doomwiki.org/wiki/Font | Slab roja, angular, con sombra dura. Cero anti-alias. |
| PSX DOOM colored lighting | doomwiki.org/wiki/PlayStation_Doom | Luz sectorial de color (para la variación Hell-Neon). |
| SIGIL (Romero, 2019) | romero.com/sigil | Negro black-metal + rojo (para Hell-Neon). |
| El logo DOOM | doomwiki.org/wiki/Doom_(franchise) | Geometría angular, metálica, perspectiva agresiva. |

## Vibe statement (meta-vibe del sprint)

> **"Infierno físico."**

Visceral, táctil, opresivo, sucio. (Bann checked: NO usa "modern / clean / minimal / premium / elegant".) DOOM no es elegante — es carnicería con estética. La identidad emerge de la *suciedad comprometida*, no de la pulcritud.

Cada variación (Material.1) es una **lente distinta sobre este mismo infierno físico**. La paleta y la tipografía concretas se fijan al elegir variación; el *compromiso con lo visceral* es compartido y no negociable.

## 3 decisiones audaces declaradas (cada una con wow-ADR)

1. **CRT como lente no negociable** — `wow-01-crt-lens.md`. Todo el render pasa por scanlines + viñeta + curvatura sutil + aberración cromática + bloom en los rojos. No es "efecto opcional"; es el aire del mundo. >30% del viewport afectado → declarado como decisión audaz (anti-pattern check ✓).
2. **La cara reactiva como protagonista emocional** — `wow-02-living-face.md`. La cara del marine no es decoración: es el sistema de feedback de vida primario, animada, mirando, sangrando. El campo la omite; nosotros la hacemos co-protagonista.
3. **Grima procedural** — `wow-03-procedural-grime.md`. Cada textura y sprite lleva dithering Bayer + ruido + asimetría. Prohibido el degradado limpio. La suciedad ES la marca. Convierte la limitación procedural en firma estética.

## Banned aesthetic moves (PER-SPRINT, no globales)

- Flat design / Material Design / "2020 SaaS".
- Paletas pastel o desaturadas (salvo que la variación Demake lo redefina como 1-bit intencional).
- Fuentes sans modernas (Inter/Roboto/Helvetica) en cualquier UI del juego.
- Esquinas redondeadas en la status bar o botones.
- Degradados suaves SIN dithering.
- Layout "centered hero + features" (plantilla SaaS).
- Drop-shadows blandas como decoración (la sombra de DOOM es dura, 1px, negra).
- Espacio negativo vacío "respirando" — DOOM es denso. (Densidad calibrada, no vacío.)

## Composición pre-código (cajas grises)

Ver `scaffold/wireframes-textuales.md` para la grilla completa. Resumen de pesos visuales:

```
┌───────────────────────────────┐
│ ▓▓▓▓▓ viewport 78% alto ▓▓▓▓▓ │  ← el mundo. Penumbra, profundidad, el ojo vive acá.
│ ▓▓▓▓▓  (CRT lens sobre todo) ▓ │
│ ▓▓▓▓▓▓▓▓▓ weapon bob ▓▓▓▓▓▓▓▓ │
├───────────────────────────────┤
│ STATUS BAR 22% · densa ·       │  ← contrapeso pesado, ornamentado, anclado abajo.
│ FACE al centro = punto focal   │
└───────────────────────────────┘
```

El ojo cae al centro-bajo (la cara) y sube al mundo. Asimetría top-pesada-en-info, bottom-pesada-en-densidad. NO simétrico, NO centrado-vacío.
