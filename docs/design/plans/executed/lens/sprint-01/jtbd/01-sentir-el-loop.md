# JTBD — Sentir el loop visceral de DOOM en segundos

## Job statement

> Cuando **abro una recreación de DOOM en el browser**,
> quiero **estar disparando a un demonio en un pasillo que se ve, suena y se mueve como DOOM, casi de inmediato**,
> para **revivir el rush de 1993 sin fricción de setup ni decepción de "es solo un demo técnico"**.

## Dimensiones del outcome

| Dimensión | Métrica de éxito del job |
|---|---|
| **Funcional** | De cargar a disparar: < 10 s. Combate legible: sé qué me daña y desde dónde. |
| **Emocional** | Tensión + power-fantasy. El escopetazo se *siente*. La penumbra inquieta. |
| **Social** | "Compartible": el primer screenshot/clip ya se lee como DOOM (no necesita explicación). |

## Fuerzas (JTBD switch)

- **Empuje**: nostalgia, curiosidad de "¿qué tan bien se puede en web?".
- **Atracción**: la promesa de DOOM instantáneo.
- **Ansiedad/hábito**: "seguro es otro raycaster genérico sin alma" ← **esta es la objeción que el sprint debe demoler**. La demolemos con audio + cara + arte committed.

## Traducción a requisitos de diseño

1. Boot a juego en < 10 s, title screen skippable con cualquier tecla.
2. Audio activo desde el primer disparo (tras el gesto de inicio, por autoplay policy).
3. Onboarding cero: los controles se muestran en el HUD/title, no en un modal.
4. El primer pasillo ya tiene un enemigo a la vista — el loop arranca solo.
