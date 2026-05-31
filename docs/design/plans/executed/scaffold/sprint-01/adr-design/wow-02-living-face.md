# wow-ADR-02 — La cara reactiva como protagonista emocional

**Estado**: propuesto (se confirma en Gate 1) · **Decisión audaz #2**

## Qué

La cara del marine en el centro de la status bar no es un ícono estático: es el **sistema de feedback de vida primario**, dibujada proceduralmente y animada. Reacciona a:

- **Nivel de vida** → 5 etapas (100→80→60→40→20%), cada vez más herida y ensangrentada.
- **Dirección del daño** → mira a izquierda/derecha/frente según de dónde vino el golpe (como el STFTL/STFTR original).
- **Eventos** → mueca de dolor ("ouch") en golpe fuerte; sonrisa malévola al recoger arma/poder; cara "god mode" si hay invulnerabilidad; **gibbed** al morir.
- **Idle** → micro-animación cada ~2s (mira alrededor, parpadea) para que se sienta viva.

## Por qué (audacia)

Es **el elemento de identidad de DOOM que el campo omite (~0/15)** y es barato en bytes pero altísimo en reconocimiento (tesis competitiva #2). Convierte un número de vida en una cara humana que sufre — feedback emocional, no solo informacional. Es el ancla de la composición (wireframe: centro-bajo, punto focal).

## Cómo (alto nivel)

Generador procedural de cara por capas (base, ojos, boca, sangre, casco) en un canvas pequeño, parametrizado por `(healthStage, lookDir, expression)`. Sin sprite-sheet binario — se compone por código. Cachea las combinaciones usadas.

## Trade-off

Hacer que una cara procedural se vea bien (y no grotesca-por-error) es difícil (R1). Mitigación: baja resolución + CRT son forgiving; el Critique Loop multimodal evalúa específicamente la cara; silueta y expresión legibles > realismo.
