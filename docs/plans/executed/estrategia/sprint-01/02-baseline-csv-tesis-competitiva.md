# 02 — Baseline CSV y tesis competitiva

## Fuente

`can-it-recreate-doom-1750418219118-responses.csv` — export del microeval de [Artificial Analysis](https://artificialanalysis.ai/microevals/can-it-recreate-doom-1750418219118). 15 modelos frontier, una respuesta one-shot cada uno al prompt *"Recreate the FPS game DOOM as a web app."*

## Panorama del campo (15 modelos)

Tamaño de respuesta: de 4.2 KB (GPT-5 ChatGPT) a 78.5 KB (Gemini 2.5 Pro). Técnica dominante: **raycasting Canvas 2D** (Wolfenstein/DOOM 2.5D). Minoría usa WebGL/Three.js (MiniMax, o3, Command A, gpt-oss).

### Matriz de features (detección por regex sobre el código)

| Feature | Cobertura | Lectura estratégica |
|---|---:|---|
| Enemigos / sprites | 15/15 | Mesa de apuestas. No diferencia. |
| Disparo | 13/15 | Esperado. |
| HUD con vida | 13/15 | Esperado. |
| Texturas en paredes | ~9/15 | La mitad usa colores planos. |
| Floor/ceiling casting | 4/15 | La mayoría deja piso/techo liso (más barato, menos inmersivo). |
| Puertas | 4/15 | Raro. |
| Minimapa | 2/15 | Raro. |
| **Sonido** | **0/15** | **NADIE.** DOOM sin audio es medio DOOM. |
| **Cara de DOOMguy reactiva** | **~0/15** | El ícono más reconocible del HUD, ausente. |

## Tesis competitiva — dónde gana AEGIS+LUMEN

El one-shot optimiza "demostrar que entendí raycasting" y se queda sin presupuesto cognitivo para identidad. Nuestros vectores de victoria, en orden de leverage:

1. **Audio procedural (0/15).** Máximo leverage: nadie lo tiene y define el feel. Web Audio sintetiza escopetazo, growl, puerta, pickup, dolor, drone ambiente — sin un solo binario.
2. **Cara del marine reactiva (~0/15).** El elemento de identidad de DOOM. Dibujada por código, reacciona a vida/daño/pickup. Barato en bytes, altísimo en reconocimiento.
3. **Dirección de arte comprometida (LUMEN).** El campo produce "competencia genérica". LUMEN obliga pilares estéticos, decisiones audaces declaradas, y un Critique Loop multimodal. Esto sube el piso de 3→6/10; el ojo del director sube el techo.
4. **Correctness de ingeniería (AEGIS).** Raycasting sin fisheye, z-sorting de sprites correcto, colisión robusta, timestep fijo. Los one-shot frecuentemente tienen bugs sutiles (fisheye, sprites que "flotan", clipping).
5. **Completitud sin sprawl roto.** Floor-casting + puertas + minimapa + multi-nivel — features que <30% del campo tiene, ejecutadas con calidad pareja.

## Riesgo de la tesis

El modelo más completo del campo (Gemini, 78 KB) ya cubre mucho. Nuestra ventaja **no** es "más líneas" — es **identidad + correctness + el trío que nadie hace**. Si terminamos con audio mediocre o arte genérico, perdemos la tesis aunque el motor funcione. Por eso LUMEN no es opcional acá.
