# wow-ADR-01 — CRT como lente no negociable

**Estado**: propuesto (se confirma en Gate 1) · **Decisión audaz #1**

## Qué

Todo el render del viewport pasa por un post-proceso CRT: **scanlines**, **viñeta**, **curvatura sutil** de pantalla, **aberración cromática** leve en los bordes, y **bloom** selectivo en los rojos/luces. Aplica a >30% del viewport → se declara como decisión audaz (anti-pattern check de Material.0 ✓).

## Por qué (audacia, no default)

El campo renderiza píxeles limpios a pantalla. Eso lee como "demo de raycasting", no como DOOM en un monitor CRT de 1993. La lente CRT es el **aire del mundo**: unifica los assets procedurales (esconde costuras), da época, y convierte la baja resolución de una limitación en una estética intencional.

## Cómo (alto nivel, sin comprometer implementación)

Shader-like en Canvas 2D: el buffer interno se compone con una capa de scanlines (CSS/canvas), curvatura por sampling o por transform, aberración por offset de canales RGB en los bordes. Costo controlado (post de pantalla completa una vez por frame). Toggle de accesibilidad (`prefers-reduced-motion` baja la intensidad de flicker/aberración).

## Trade-off

Costo de frame del post-proceso (R2 perf). Mitigación: la intensidad es ajustable y el post es O(píxeles de pantalla) una sola vez. Si Evidence muestra que come el budget, se baja curvatura/aberración antes que scanlines (las scanlines son el 80% del efecto por el 20% del costo).

## Intensidad por variación

A '93: moderada, cálida. · B Neon: fuerte bloom, glow. · C Demake: fósforo extremo + roll. · D Industrial: leve, más "monitor de panel" que TV.
