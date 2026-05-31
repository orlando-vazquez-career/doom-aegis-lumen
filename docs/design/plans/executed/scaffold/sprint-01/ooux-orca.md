# OOUX-ORCA (mínimo) — Sprint 01

Per LUMEN v0.10.0 finding α: ORCA en forma mínima para un FPS (objetos con relaciones simples). Sirve como catálogo-contrato para el build, no como ceremonia.

## Objects + Attributes + CTAs

| Object | Attributes clave | Relationships | CTAs (acciones) |
|---|---|---|---|
| **Player** | pos, ángulo, vida, armor, inventario armas, munición×tipo, llaves | *tiene* Weapon activa; *está en* Level | mover, strafe, mirar, disparar, cambiar arma, usar/abrir |
| **Weapon** | tipo, daño, spread, rate, munición-tipo, sprite/anim | *pertenece a* Player; *consume* Ammo; *genera* Hitscan o Projectile | disparar |
| **Enemy** | tipo, vida, estado(idle/chase/attack/pain/die), pos, sprite-frames | *ataca a* Player; *dropea* Pickup; *vive en* Level | atacar, morir |
| **Projectile** | pos, vel, daño, owner, sprite | *lanzado por* Enemy/Weapon; *colisiona con* Player/Wall/Enemy | viajar, impactar |
| **Pickup** | tipo(health/armor/ammo/weapon/key), valor, sprite | *en* Level; *recogido por* Player | recoger |
| **Door** | pos, estado(closed/opening/open/closing), llave-requerida | *en* Level; *bloquea* Player | abrir |
| **Level** | grid, texturas, spawns(enemy/pickup), exit, par-time | *contiene* todo lo anterior | cargar, salir |

## Relationships map (texto)

```
Level ──contiene──▶ {Walls, Doors, Pickups, EnemySpawns, Exit}
Player ──empuña──▶ Weapon ──dispara──▶ Hitscan|Projectile ──daña──▶ Enemy
Enemy  ──ataca───▶ Hitscan|Projectile ──daña──▶ Player
Enemy  ──muere───▶ (opcional) Pickup
Player ──toca────▶ Pickup | Door | Exit
```

Este catálogo mapea 1:1 a los módulos de `src/game/` del ADR-02. Coherencia object→módulo intencional.
