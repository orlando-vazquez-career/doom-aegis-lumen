# Sitemap / IA — Sprint 01

Un FPS tiene IA mínima. Las "vistas" son estados de una máquina de estados, no rutas.

```
TITLE  ──any key──▶  PLAY ──┬─ death ─▶  GAME OVER ──any key──▶ TITLE
  ▲                         │
  └──────── any key ◀───────┴─ last level exit ─▶ VICTORY ──any key──▶ TITLE
```

- **TITLE** — logo DOOM-idiom, "PRESS ANY KEY", controles mínimos, hint de click-para-mouselook.
- **PLAY** — viewport raycast + HUD (status bar + cara + minimapa). Sub-estado: `PAUSED` (Esc).
- **GAME OVER** — pantalla de muerte (la cara del marine muerta/gibbed), stats, reinicio.
- **VICTORY** — fin del último nivel, stats (kills/secrets/time).

Transiciones entre niveles dentro de PLAY: switch de salida → fade → siguiente nivel (sin volver a TITLE).

Estado global persistente entre niveles: arma, munición, vida, armor, kills/secrets acumulados.
