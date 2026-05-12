# Slayers — Steam Release Roadmap

*Version 0.1 — 2026-05-11*

Companion doc to [DESIGN.md](./DESIGN.md). This captures the path from "vibe-coded HTML5 game" to "Slayers on Steam."

---

## Status

Currently building in HTML5 / vanilla JS (DESIGN.md Phase 0 done, Phase 1 in progress). Steam-specific work begins when the game is feature-complete and playtested — likely after DESIGN.md Phase 8.

---

## Phase A — Build the game

**Where we are now.** Keep iterating through DESIGN.md Phases 0–10. Don't optimize for Steam yet.

The architecture decisions already in place make this Steam-friendly:

- Clean input abstraction layer (already supports keyboard + Xbox + PS5)
- Modular game logic that doesn't touch the DOM
- localStorage save state behind a wrapper (when added in DESIGN.md Phase 8)
- No external CDN dependencies — all assets local

---

## Phase B — Package for desktop

**Trigger:** game is fun, feature-complete, and playtested. Wrap the HTML5 app as a native executable.

### Option 1: Tauri (recommended)
- Rust + system webview
- ~10 MB final bundle
- Fast startup, modern, well-supported
- Steeper setup than Electron but worth it for the size
- Setup: install Rust, install Tauri CLI, point at `index.html`, configure `tauri.conf.json`, build for Windows + macOS + Linux

### Option 2: Electron
- Chromium bundled
- ~150 MB final bundle
- Dead simple — Discord, VS Code, Slack use it
- Setup: `npm init`, install electron, write a 20-line `main.js` that opens our index.html, package with electron-builder

**Lean:** Tauri. A 10 MB pixel-art game feels right; a 150 MB pixel-art game does not.

### Queue around DESIGN.md Phase 8–9
At that point we have a real game; the wrapping becomes mechanical work.

---

## Phase C — Integrate Steamworks

After packaging, integrate Steam's SDK:

- **Achievements** — DESIGN.md unlock conditions (beat Crypt boss, etc.) become real Steam achievements
- **Leaderboards** — global high scores per Slayer Trial tier
- **Cloud saves** — sync stash + meta unlocks across devices via Steam Cloud
- **Steam Input** — replaces our gamepad code. Steam handles ALL controller mapping (Xbox, PS5, Switch Pro, Steam Deck, third-party). Players remap bindings via the Steam overlay. Half a day of work for major QoL.
- **Friends + activity** — Steam friends can see what you're playing

### Steam Deck verification
Pixel art + controller-first design = should verify easily. The pre-launch checklist (default controller support, readable text at 1280×800, no Windows-specific dependencies, suspend/resume safe) is mostly free given our choices.

---

## Phase D — Steam Direct + Store Page

### One-time costs
- **Steam Direct fee:** $100 USD per game (recoupable after enough sales)

### Store page assets needed
- Header capsule (1280×620)
- Small / main / library capsules (multiple sizes)
- 5+ in-game screenshots (1920×1080 ideally)
- Short trailer (60–90 seconds, gameplay-focused)
- Description copy (short + detailed)
- Tags (pixel art, roguelike, action, indie, etc.)
- Pricing decision

### Marketing pre-launch
- Build a wishlist — announce 3–6 months before launch
- Post devlogs (Reddit r/IndieDev, Bluesky/Twitter, YouTube/TikTok dev clips)
- Free demo at Steam Next Fest (quarterly festival, big visibility bump)
- Discord community is optional but compounds

### Steam Direct review
- ~30 day review window before publishable
- Build a buffer into the launch timeline

---

## Phase E — Launch

Pick a release date. Get verified. Ship. Patch.

Post-launch:
- Patches for bugs / balance
- Free content updates (new classes, biomes, items) sustain interest and bring back lapsed players
- Consider a paid expansion / DLC after first major milestone

---

## What to do NOW that helps later

We're already doing most of these — listed as confirmation:

1. **Input abstraction layer** — done. Easy to swap onto Steam Input later.
2. **No external CDNs** — done. All assets local. Required for offline play + Steam Deck.
3. **Save data behind a wrapper** — to do in DESIGN.md Phase 8. Makes the localStorage → Steam Cloud swap a one-file change.
4. **Settings as a config object** — to do alongside save data. Keeps player prefs portable to a settings file or Steam Cloud.
5. **Pixel-perfect rendering at low internal resolution** — done. Scales cleanly to Steam Deck (1280×800), 1080p, 1440p, 4K.

---

## Open questions / decisions deferred

- **Pricing** — defer until we know how much content ships at launch ($5? $10? $15?)
- **Free demo strategy** — Steam Next Fest cycle dictates this
- **Soundtrack** — original or licensed? Defer until polish phase
- **Modding support** — interesting if a community materializes; not launch-critical
- **Mobile port** — possible later via Capacitor or React Native wrap, but Steam first

---

*Living document. Update as decisions get made.*
