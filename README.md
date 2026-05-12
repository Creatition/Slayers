# Slayers

A top-down arena auto-shooter that fuses **Brotato**'s tight 20-wave rhythm with **Diablo**'s deep itemization — rarity tiers, affix rolls, full equipment loadouts, salvage and crafting, and the dopamine of loot dropping on enemy corpses.

> Each run is ~15 minutes. Each loot drop could be the one that defines the build. Each class plays differently because of its abilities and resource pool.

## Status

**Phase 0 — Foundation.** Movable hero, skeleton enemies that walk toward you, controller + keyboard support, particle juice on kills. Foundations only — no HP, weapons, abilities, or loot yet.

See [DESIGN.md](./DESIGN.md) for the full design doc and phased build plan.

## Play

Open `index.html` in a browser. No build step, no install.

### Controls

| Action | Keyboard | Xbox | PS5 |
|---|---|---|---|
| Move | WASD / Arrows | Left stick / D-pad | Left stick / D-pad |

Gamepad note: most browsers require a user gesture (any click or keypress) before exposing connected gamepads. If your controller doesn't register, click the canvas first.

## Tech

- HTML5 Canvas + vanilla JS, no build step
- Browser Gamepad API (Xbox + PS5 DualSense)
- Pixel art, low internal resolution (640×360) scaled crisp via `image-rendering: pixelated`
- Architecture kept portable — when the game is fun, package via Tauri or Electron for a potential Steam release

## Roadmap

See the **Phased Build Plan** section in [DESIGN.md](./DESIGN.md). Currently between Phase 0 and Phase 1.

## License

TBD — currently all rights reserved.
