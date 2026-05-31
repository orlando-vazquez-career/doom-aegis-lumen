---
design_system: doom-aegis-lumen
version: 0.1.0
direction: "A — Hell-Brown '93"
internal_resolution: [320, 200]   # viewport 320x168 + status bar 320x32 (autentico DOOM)
primitives:
  colors:
    black:      "#0a0806"
    techbase:   ["#6b4a2b", "#4a3220", "#2a1d12"]
    blood:      ["#a01010", "#d22020", "#ff3a1a"]
    toxic:      ["#2f6e16", "#6abe30"]
    bone:       "#d8c8a0"
    bone_dim:   "#b8a070"
    steel:      ["#5a5a5e", "#3a3a3e"]
    hazard:     "#c8a014"
  typography:
    family: "procedural bitmap slab (generada en codigo, no webfont)"
    case: uppercase
    shadow: "hard 1px #000, sin anti-alias"
    banned: ["Inter", "Roboto", "Helvetica", "Arial", "cualquier sans moderna"]
  spacing: { unit: 1, hud_pad: 2 }     # en pixeles del buffer interno
  motion:
    easing: ["step", "linear"]          # nada de cubic-bezier "suave moderno"
    weapon_bob_hz: 2.2
    flicker: true
semantics:
  surface.world:      black
  surface.statusbar:  techbase[1]
  text.primary:       bone
  text.hud_number:    blood[1]
  text.danger:        blood[2]
  state.health_ok:    bone
  state.health_low:   blood[1]
  state.armor:        toxic[1]
  accent.toxic:       toxic[1]
  focus.ring:         blood[2]
---

# DESIGN.md — DOOM (AEGIS + LUMEN)

Contrato visual del repo. La capa semántica permite re-skin a las variaciones B/C/D tocando solo el mapeo. La implementación-máquina de estos tokens vive en `src/engine/palette.js` (cross-ref).

## Dirección activa

**A — Hell-Brown '93.** Vibe: *"infierno físico"*. Techbase sucia, sangre, verde tóxico. Ver `docs/design/plans/material/sprint-01/variations/a-hell-brown-93.md`.

## Las 3 decisiones audaces (wow-ADRs)

1. **CRT-lens** moderado/cálido sobre todo el render (`wow-01`).
2. **Cara reactiva** del marine como co-protagonista del HUD (`wow-02`).
3. **Grima procedural** (dither Bayer + grain + asimetría) en cada superficie (`wow-03`).

## Visual DNA (5 axiomas del wow — aplican a cada componente)

1. **Coherencia sistémica** — todo sale de la paleta marrón-sangre-tóxico y la grilla 320×200. Un pixel ajeno se nota.
2. **Diferenciación con propósito** — la cara reactiva y el audio existen porque el campo los omite, no por adorno.
3. **Densidad informacional calibrada** — DOOM es denso, no minimal. La status bar está llena pero jerarquizada (la cara es el foco).
4. **Acabado** — sombra dura 1px en tipografía, dither en gradientes, bisel en paneles. Los micro-detalles separan de "template HTML5".
5. **Personalidad emergente** — suciedad + cara viva + sonido visceral = se siente DOOM antes de razonarlo.

## Banned moves (per-sprint)

Flat design · pastel/desaturado · sans moderna · esquinas redondeadas en HUD · gradientes sin dither · layout centered-hero · drop-shadows blandas · espacio vacío "respirando".

## Reglas de composición

- Viewport 84% (168px) / status bar 16% (32px). La cara al centro de la barra = punto focal.
- Sombras: duras, 1px, negras. Nunca blur.
- Profundidad: shading por distancia (oscurece) + dither, no niebla suave.
