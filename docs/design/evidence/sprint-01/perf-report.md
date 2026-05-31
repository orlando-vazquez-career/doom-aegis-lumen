# Perf report — Sprint 01

## Metodología

Probe de cómputo directo en el browser (`__DOOM.benchRender` / `benchStep`), **no** el FPS de
`requestAnimationFrame` (que headless throttlea y engaña). Medido en **chromium headless con render
por software** → cota **conservadora**: un browser real con GPU es más rápido.

Escena de medición: nivel 1 cargado, 7 enemigos activos, ~240 partículas de sangre vivas durante
el bench de render, floor/ceiling casting completo a 320×200.

## Resultados

| Métrica | Valor | Budget | Veredicto |
|---|---|---|---|
| **Render / frame** | 4.18 ms | ≤ 16.6 ms | ✅ 25% del budget |
| Step de simulación / tick | 0.014 ms | — | ✅ despreciable |
| **Frame total (render+step)** | 4.20 ms | ≤ 16.6 ms | ✅ |
| **FPS headroom** | **~238 fps** | ≥ 60 fps | ✅ ~4× margen |
| Deps de runtime | 0 | 0 | ✅ |
| Assets binarios | 0 bytes | 0 | ✅ |

## Análisis

- El costo domina en el render (floor/ceiling + walls + sprites + partículas). 4.18 ms incluye el
  peor caso con ~240 partículas — aún así 25% del budget.
- La simulación (IA, física, colisión, proyectiles) es prácticamente gratis (0.014 ms/tick).
- Optimizaciones que pagan (del perf-budget de Lens): floor-casting **incremental por fila** (no
  raycast/pixel), z-buffer de una pasada, partículas **pooled** (sin alloc en hot path), un solo
  `putImageData` por frame.

## Conclusión

Budget de 60fps cumplido con ~4× de margen en la medición conservadora. R2 (perf con scope C)
**mitigado y validado**. Hardware modesto debería sostener 60fps holgado.
