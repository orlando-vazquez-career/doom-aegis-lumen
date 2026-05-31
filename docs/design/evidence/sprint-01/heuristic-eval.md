# Heuristic eval — Sprint 01 (Nielsen 10 + lente DOOM)

| # | Heurística | Estado | Nota |
|---|---|---|---|
| 1 | Visibilidad del estado | 🟢 | HUD STBAR completo: ammo/health/ARMS/cara/armor/keys + mensajes efímeros + minimapa. La cara comunica vida de un vistazo. |
| 2 | Match con el mundo real (= DOOM canónico) | 🟢 | Estética techbase Hell-Brown committed, cara del marine, fuente slab roja, CRT. Se lee como DOOM, no como template HTML5. |
| 3 | Control y libertad del usuario | 🟢 | Pausa (P), mute (M), reinicio tras muerte, salir de pointer-lock con Esc. |
| 4 | Consistencia y estándares | 🟢 | Controles WASD+mouse estándar de FPS; 1-5 armas como DOOM; convenciones respetadas. |
| 5 | Prevención de errores | 🟡 | Auto-switch al quedarse sin munición evita el "click seco infinito". Puerta con llave avisa antes de bloquear. Falta confirmación al salir del nivel (menor). |
| 6 | Reconocimiento > recuerdo | 🟢 | Controles listados en el title; iconografía del HUD (ARMS grid muestra qué armas hay). |
| 7 | Flexibilidad y eficiencia | 🟢 | Correr (Shift), strafe, cambio directo de arma por número, mapa toggle. |
| 8 | Diseño estético y minimalista (bien entendido) | 🟢 | DOOM **no** es minimal: densidad calibrada (Visual DNA axioma 3). El HUD está lleno pero jerarquizado (la cara es el foco). |
| 9 | Ayuda a reconocer/recuperar errores | 🟡 | Mensajes HUD ("you need a red key", "no ammo" implícito por click seco). Podría ser más explícito. |
| 10 | Ayuda y documentación | 🟢 | Title screen lista todos los controles; el juego es auto-explicativo (loop DOOM conocido). |

## Lente DOOM (los 3 diferenciadores del baseline)

- **Audio** (0/15 del campo) → 🟢 presente: escopeta, growls, puertas, pickups, dolor, ambiente.
- **Cara reactiva** (~0/15) → 🟢 presente y co-protagonista del HUD.
- **Dirección de arte committed** → 🟢 Hell-Brown '93 con CRT, grima, 3 enemigos legibles.

## Veredicto

Sin rojos. Dos amarillos menores (prevención/recuperación de errores más explícita) anotados como
pulido futuro, no bloqueantes. Los 3 diferenciadores de la tesis competitiva están en pantalla.
