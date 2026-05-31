# A11y report — Sprint 01 (WCAG 2.2 AA, alcance honesto)

Un FPS por canvas tiene límites de accesibilidad inherentes (no es DOM semántico, no hay screen
reader del mundo 3D). Se reporta lo aplicable con honestidad, sin verde-lavado.

## Verde (cumple)

- **Operable por teclado completo**: WASD/flechas mover, flechas o mouse mirar, Ctrl/click disparar,
  Space/E usar, 1-5 armas, Shift correr, Tab mapa, M mute, P pausa. El juego es **jugable sin mouse**
  (giro con flechas) → no depende de pointer-lock.
- **Codificación redundante de la vida** (no solo color): número `100%` + la **cara reactiva** (que
  se ensangrienta) + tinte de daño. Un usuario con daltonismo lee el estado por número y por cara.
- **Audio con mute** (M) y respeta la política de autoplay (arranca en primer gesto).
- **Sin parpadeo agresivo sostenido**: las scanlines CRT son estáticas (CSS, sin animación). El
  blink de "PRESS ANY KEY" respeta `prefers-reduced-motion`.

## Amarillo (parcial / a mejorar)

- **Flash de daño**: tinte rojo breve (~0.5s) al recibir daño. Suave, pero para fotosensibilidad
  estricta convendría un flag `prefers-reduced-motion` que baje su intensidad. **Pendiente** (no
  bloqueante; documentado).
- **Contraste del HUD**: texto hueso (`#d8c8a0`) sobre panel oscuro (`#2a1d12`) = buen contraste;
  los números rojos grandes (`#d22020`) sobre panel oscuro tienen contraste menor — legibles por
  tamaño (slab 4×) pero por debajo de 4.5:1 estricto. Latitud de juego retro; anotado.
- **Teclas no remapeables** y **dificultad fija** (no expuesta en UI). Futuro.

## Rojo (no cubierto, inherente)

- **Screen reader**: un mundo raycast en canvas no es expresable semánticamente. Fuera de alcance
  para este tipo de juego.

## Conclusión

Cumple lo razonable para un FPS canvas: teclado-completo, codificación redundante de estado, mute,
sin flicker sostenido. Gaps documentados con honestidad (flash de daño, contraste de números,
remap). Ninguno bloqueante para el cierre del sprint.
