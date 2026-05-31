# DOOM — recreated via AEGIS · LUMEN

A playable, DOOM-style first-person shooter for the browser. **Vanilla JavaScript, Canvas 2D
raycaster, zero runtime dependencies, 100% procedural assets** — every texture, sprite, sound, and
the HUD marine face is generated in code. No binary files.

Built as an experiment: can a disciplined, multi-phase process (the **AEGIS** engineering protocol +
the **LUMEN** art-direction protocol, with human gates) recreate DOOM *better* than 15 frontier LLMs
answering the same prompt in a single shot? The benchmark is Artificial Analysis's
[*Can it recreate DOOM?*](https://artificialanalysis.ai/microevals/can-it-recreate-doom-1750418219118)
microeval.

## The wedge: what the field systematically misses

Across the 15 single-shot models in the benchmark CSV:

| Feature | Field coverage | Here |
|---|---:|:--|
| Procedural **audio** | **0 / 15** | ✅ shotgun, growls, fireballs, doors, pickups, pain, ambient drone |
| Reactive **DOOMguy face** | **~0 / 15** | ✅ 5 health stages × damage direction × expressions |
| Committed **art direction** | generic | ✅ Hell-Brown '93 + CRT lens + procedural grime |
| Floor/ceiling casting | 4 / 15 | ✅ |
| Doors / minimap | 4 / 15 · 2 / 15 | ✅ both |

We chose the **most faithful** visual direction on purpose — so the win comes from *execution*
(sound, the living face, correctness, completeness), not visual gimmickry.

## Play it

ES modules must be served over HTTP (not `file://`):

```bash
npm run dev          # tiny static server on http://localhost:8123  (no install needed to play)
```

**Controls** — `WASD` move · `mouse`/arrows look · `click`/`Ctrl` fire · `Space`/`E` use ·
`Shift` run · `1-5` weapons · `Tab` map · `M` mute · `P` pause.

## What's in it

Raycaster with textured walls + floor/ceiling, billboarded sprites with z-buffer occlusion ·
3 enemy types with distinct AI (hitscan zombie, fireball imp, charging pinky) · 4 weapons + fists ·
projectiles, particles, blood · pickups, locked doors, exit switches · 2 hand-built levels ·
title / game-over / victory / pause · minimap · reactive status bar.

Performance: ~4 ms/frame, ~238 fps of headroom (measured in headless software rendering — a real
GPU browser is faster).

## How it was built

Engineering lifecycle (AEGIS): Strategy → Architecture → Tactics → **Gate 1** → Execution →
Guardrails → **Gate 2** → State-sync. Art direction (LUMEN): Lens → UX → **Gate 1** → Material
(aesthetic pillars · variations · tokens · build) → Visual Critique Loop → Evidence → **Gate 2** →
Narrative. The full paper trail lives in `docs/` (plans, ADRs, aesthetic pillars, the 4 explored
visual directions, critique rounds, a11y/perf/heuristic evidence, devlogs).

## Attribution

Benchmark data © [Artificial Analysis](https://artificialanalysis.ai). DOOM is a trademark of
id Software / ZeniMax; this is an original homage in the DOOM idiom (no id assets used — everything
is procedural). MIT licensed.
