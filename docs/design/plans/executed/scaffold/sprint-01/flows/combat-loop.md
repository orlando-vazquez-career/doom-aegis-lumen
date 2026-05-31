# Flow — Loop de combate (la interacción central)

## Happy path

1. Player ve enemigo (sprite billboard, idle/patrol).
2. Enemigo detecta al player (line-of-sight + rango) → estado `chase`.
3. Player apunta (mouse-look) y dispara (click / Ctrl).
   - Hitscan (pistola/escopeta/chaingun): raycast instantáneo → si pega, daño + sangre + reacción.
   - Proyectil del player (plasma): spawnea bolt que viaja.
4. Enemigo entra en `pain` (chance), reproduce growl, parpadea.
5. Vida del enemigo ≤ 0 → `die` (animación de muerte) → corpse (sprite estático) + gib particles + sonido de muerte.
6. Player recoge pickups que dropea / que hay en el nivel.

## Enemy attacks (3 arquetipos)

| Enemigo | Ataque | Telegraph |
|---|---|---|
| Zombie | Hitscan a distancia | Levanta arma, flash |
| Imp | Lanza fireball (proyectil esquivable) | Wind-up + glow en las manos |
| Pinky | Carga melee | Acelera hacia el player, gruñido |

## Edge cases / errores a manejar

- Disparo sin munición → click seco (sonido) + auto-switch a arma con munición o a puños.
- Enemigo pierde line-of-sight → `search` unos segundos, luego `idle`.
- Player muere (vida ≤ 0) → cara gibbed, freeze de input de combate, prompt de reinicio.
- Proyectil pega pared → explota (partícula) y se despawnea (pooling: vuelve al pool).
- Dos enemigos en la misma columna de pantalla → z-sort correcto (más cercano ocluye).
- Pickup ya tomado / arma ya en inventario → solo suma munición, no duplica.
- Puerta bloqueada (requiere llave) → mensaje HUD + sonido de bloqueo.

## Sensación objetivo (cross-ref JTBD)

Cada disparo: **audio + flash + impacto visible**. La ausencia de cualquiera de los tres rompe el job ("se siente como DOOM"). Es el non-negotiable del flow.
