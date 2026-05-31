# Wireframes textuales — Sprint 01

Composición semántica de cada pantalla. Define la grilla del HUD que Material implementa. (Estética concreta = variación elegida en Gate 1; esto es la **estructura**.)

## TITLE

```
┌──────────────────────────────────────────────────┐
│                                                    │
│                                                    │
│            ███▄  ███   ███   ███▄ ▄███             │  ← logo DOOM-idiom (procedural, angular, metal)
│            █  █  █  █  █ █ █  █  █ █  █             │
│            ███▀  ███   ███   █  █   █  █            │
│                                                    │
│                R E C R E A T E D                   │  ← subtítulo
│                                                    │
│              ▸ PRESS ANY KEY TO PLAY ◂             │  ← blink
│                                                    │
│   WASD move · MOUSE look · CLICK/CTRL fire         │  ← controles (reconocimiento>recuerdo)
│   1-6 weapons · SHIFT run · E use · ESC pause      │
│                                                    │
│                  click to lock mouse               │
└──────────────────────────────────────────────────┘
```

## PLAY — viewport + status bar (idioma DOOM STBAR)

```
┌──────────────────────────────────────────────────┐
│ ░ msg line: "picked up the shotgun!"              │  ← mensajes efímeros HUD (top-left)
│                                          ┌──────┐ │
│                                          │ MINI │ │  ← minimapa (top-right, toggle TAB)
│              3D VIEWPORT                  │ MAP  │ │
│            (raycast walls +              └──────┘ │
│             floor/ceiling)                        │
│                                                    │
│                   ▟███▙   ← weapon sprite (bottom-center, bob)
│                  ▟█████▙                           │
├──────────────────────────────────────────────────┤
│ AMMO │ HEALTH │ ▢▢▢ ARMS │  ( FACE ) │ ARMOR │KEYS│  ← STATUS BAR
│  50  │  100%  │ 2 3 4    │  ( ◣_◢ )  │  50%  │ ▮▮ │
│      │        │ 5 6 7    │           │       │    │
└──────────────────────────────────────────────────┘
        ▲          ▲           ▲            ▲       ▲
      munición   vida    armas tenidas   CARA    armor+llaves
      del arma   (rojo   (grid, la       REACTIVA
      activa     si baja) activa brilla) (centro, ancla emocional)
```

**Anatomía de la status bar (de izq a der), fiel al STBAR de DOOM:**
1. **AMMO** — número grande de munición del arma activa.
2. **HEALTH** — porcentaje; cambia a rojo y "tiembla" en vida baja.
3. **ARMS** — grilla de números de armas poseídas (la activa resaltada).
4. **FACE** — la cara del marine, **centro absoluto**, ancla de identidad. Reacciona: mira a la dirección del daño, sangra al perder vida, sonríe con pickups, gibbed al morir.
5. **ARMOR** — porcentaje de armadura.
6. **KEYS** — llaves recogidas (color-coded).

## GAME OVER / VICTORY

```
┌──────────────────────┐    ┌──────────────────────┐
│      YOU DIED         │    │     LEVEL CLEARED     │
│     ( gibbed face )   │    │   KILLS   12/12       │
│                       │    │   SECRETS  2/3        │
│   KILLS 8 · time 2:14 │    │   TIME    2:41        │
│   ▸ PRESS ANY KEY ◂   │    │   ▸ PRESS ANY KEY ◂   │
└──────────────────────┘    └──────────────────────┘
```

La cara del marine aparece en ambas pantallas finales — refuerza el ancla de identidad de principio a fin.
