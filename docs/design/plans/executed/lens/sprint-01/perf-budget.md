# Perf budget — Sprint 01

Un FPS es perf-crítico: el feel de DOOM *es* su fluidez. Esto es presupuesto, no aspiración.

## Targets

| Métrica | Budget | Por qué |
|---|---|---|
| **Frame rate** | 60 fps sostenido (desktop moderno) | El movimiento plano y rápido de DOOM colapsa si cae el framerate. |
| **Frame time** | ≤ 16.6 ms; alarma a 14 ms | Margen para picos (muchos sprites/partículas). |
| **Resolución interna** | ~480×270 (16:9) escalada a viewport | Sweet spot perf/estética. Ajustable si sobra/falta budget. |
| **Tiempo a interactivo** | < 1 s en localhost (TTI), < 10 s percibido | JTBD: disparar en <10s. |
| **Peso JS (sin minificar)** | < 150 KB total, **0 deps de runtime** | Vanilla + procedural. El campo monolítico no tiene módulos; nosotros sí, pero seguimos siendo livianos. |
| **Assets binarios** | **0 bytes** | Todo procedural. |
| **Memoria** | Sin leaks; pools para partículas/proyectiles | Sesiones largas estables. |

## Presupuesto de frame (estimado, a validar en Evidence)

El costo dominante es el render por columna + floor-casting (por píxel del buffer interno). A 480×270 = 129,600 píxeles/frame en el peor caso de floor+ceiling. Estrategia:
- Floor/ceiling casting optimizado (incremental por fila, no por píxel-raycast).
- Z-buffer de una pasada para oclusión de sprites.
- Pooling de partículas/proyectiles (sin alloc en hot path).
- `ImageData` reusado, un solo `putImageData` por frame.

## Banderas rojas (Evidence debe cazarlas)

- GC pauses por allocs en el loop → pooling.
- `putImageData`/`drawImage` redundantes por frame.
- Floor-casting naïve (raycast por píxel) → usar el método incremental por fila.
- Reducción de movimiento ignorada (a11y) → respetar `prefers-reduced-motion` para shake/flashes.
