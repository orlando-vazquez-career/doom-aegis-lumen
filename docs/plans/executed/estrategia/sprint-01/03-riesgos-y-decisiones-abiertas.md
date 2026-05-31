# 03 — Riesgos y decisiones abiertas

## Riesgos (scope C)

| # | Riesgo | Severidad | Mitigación |
|---|---|---|---|
| R1 | **Sprites procedurales se ven mal.** No puedo autorear PNGs; dibujo demonios pixel-art por código. | Alta | La baja resolución + CRT/scanlines son *forgiving* y esconden el origen procedural. Silueta legible > detalle. Critique Loop multimodal corrige. |
| R2 | **Perf con scope C.** Proyectiles + partículas + multi-enemigo + floor-casting en Canvas 2D. | Media | Resolución interna baja (≈320–480 px ancho) escalada; floor-casting optimizado; pooling de partículas; perfilar en Evidence. |
| R3 | **Correctness pareja en superficie grande** (la advertencia de AEGIS sobre scope C). | Media | Bloques tácticos con criterio de done verificable; no avanzo de bloque sin que el anterior corra limpio. |
| R4 | **Audio molesto / clippeando** (síntesis cruda). | Baja | Envelopes ADSR, gain master, mute toggle, respeto a primer gesto de usuario (autoplay policy). |
| R5 | **Scope creep dentro de C.** | Media | Out-of-scope explícito en doc 01; el Gate 1 congela el alcance. |

## Decisiones cerradas por el orquestador (fase Arquitectura)

Resueltas en `docs/plans/arquitectura/` — no requieren al humano:
- Motor: Canvas 2D raycaster (no WebGL). Ver ADR-01.
- Assets: 100% procedurales. Ver ADR-02.
- Estructura: ES modules sin bundler. Ver ADR-03.
- Loop: timestep fijo con acumulador. Ver ADR-04.

## Decisiones que SÍ requieren al humano (van a Gate 1)

1. **Dirección estética** — LUMEN genera 3-4 variaciones radicalmente distintas; el director elige UNA. Es *su* decisión por diseño del protocolo (el ojo del director es la herramienta).
2. **Confirmación de scope C** — ya elegido en Gate 0, se reconfirma al ver el desglose táctico real.

## Memoria cross-session (opcional, degradable)

El protocolo contempla una capa opcional de memoria persistente cross-session. El repo es nuevo (sin contexto histórico de diseño de DOOM), así que esa capa no aporta recall en este sprint — es **degradable, no bloqueante**. Las decisiones clave (ADRs, pattern de raycaster, hallazgos de audio) quedan persistidas en los devlogs y ADRs del repo.
