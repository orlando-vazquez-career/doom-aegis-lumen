# Variation C — "Demake 1-bit / Phosphor Hell"

**Sesgo estético**: el meme "it runs DOOM" hecho dirección de arte. Un **demake de 2-3 colores con dithering Bayer total**, como si DOOM corriera en hardware imposible: una Mac Plus poseída, una terminal de fósforo, una calculadora del infierno.

## Paleta (elegir sub-variante en build)

```
SUB-C1 "Blood 1-bit":   #000000  +  #c41010  (+ #5a0808 dither mid)
SUB-C2 "Amber phosphor": #0a0a0a  +  #ffb000  (+ #6a4a00 dither mid)
```

Dos colores y medio. TODO se resuelve con **dithering ordenado Bayer 4×4**: las sombras, la profundidad por distancia (fog), los sprites. La profundidad del raycaster se expresa como densidad de dither, no como brillo.

## Tipografía

Bitmap 1-bit pura, blocosa, tipo fuente de BIOS / terminal. Sin curvas. El cursor del HUD podría parpadear como un prompt.

## Composición

Extrema y plana en color, **densa en textura de dither**. CRT phosphor glow fuerte (la única "suavidad" permitida es el bloom del fósforo). Scanline roll ocasional. La status bar parece la barra de una terminal de comando.

## Motion vocabulary

Transiciones por dithering (disolución). Estelas de decaimiento de fósforo (lo que se mueve deja un rastro tenue que decae). Roll de scanline. Glitch sutil al recibir daño.

## Motifs

Terminal de fósforo · Macintosh 1-bit · ASCII/PETSCII demoníaco · "wireframe del infierno" · el estético-meme de DOOM-en-todo. Pentagramas hechos de caracteres.

## style_vector

`1-bit · dithered · phosphor · high-concept · meme-core · maximally-shareable`

## Por qué elegirla

La más audaz y la más **compartible** (un screenshot de esto se vuelve viral solo: "DOOM pero demake de fósforo"). Convierte la limitación procedural en el chiste central. Diferenciación 10/10 vs. el campo. Riesgo: es la más alejada del DOOM "real" — apuesta de identidad sobre fidelidad. Legibilidad del combate a vigilar (dither puede ruido-ar la lectura de enemigos).
