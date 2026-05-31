# LUMEN Lens — 00 Scope · Sprint 01 (DOOM web app)

**Escala declarada por el director**: **M-L** (vista/experiencia nueva completa desde cero).

Esto activa como **obligatorias**: Material.0 Aesthetic Pillars, Material.1 Variation (3-4 direcciones), Visual Critique Loop multi-resolución (≤3 rounds). Ver `LUMEN-PROTOCOL.md §Escalas`.

## Objetivo del sprint (lente de dirección de arte)

No "hacer un juego que funcione" (eso es AEGIS). LUMEN responde: **¿cómo se ve, se siente y suena DOOM de forma que el jugador lo reconozca en la córnea antes que en el cerebro?**

El fracaso a evitar está documentado en el génesis de LUMEN: *"diseño tan básico sacado directo de Tailwind me da cosita"*. La traducción a este sprint: **un DOOM que parece un template de juego HTML5 genérico es un fracaso aunque sea técnicamente correcto.** DOOM tiene una identidad visual y sonora feroz, específica, de 1993, id Software, infierno-sobre-base-tecnológica. Hay que comprometerse con ella, no inferir un promedio.

## Por qué LUMEN aplica acá (no es ceremonia)

La regla del protocolo: *"si la decisión va a vivir en el design system después del sprint, pasa por LUMEN"*. Acá **todo** es decisión de design system naciente: paleta, tipografía, el lenguaje del HUD, el tratamiento CRT, la cara del marine, la gramática de las texturas. Es un repo nuevo arrancando su sistema visual desde cero — caso de uso central de LUMEN.

## Nota sobre OOUX-ORCA

Per el criterio de LUMEN (v0.10.0): ORCA es para dominios con relaciones ricas (e-commerce, SaaS multi-objeto). Un FPS tiene objetos (player, enemy, weapon, pickup, door) con relaciones simples y bien entendidas. **ORCA se ejerce en forma mínima** (un solo doc liviano en UX scaffold), no como ceremonia completa. Honestidad sobre ritualismo.

## Inputs de Lens en este directorio

- `personas/jugador-doom.md` — una persona (el sprint tiene un solo arquetipo dominante).
- `jtbd/01-sentir-el-loop.md` — el job emocional central.
- `journey-y-audit.md` — journey del primer minuto + audit heurístico del *estado del arte* (qué hacen mal los 15 del CSV).
- `perf-budget.md` — presupuesto de performance (un FPS es perf-crítico).
