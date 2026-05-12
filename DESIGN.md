# Slayers — Game Design Document

*Version 0.1 — 2026-05-11*

---

## Concept

Slayers is a top-down arena auto-shooter — the Brotato rhythm of 20 timed waves and rapid level-up choices — fused with the deep itemization of Diablo: rarity tiers, affix rolls, a full 10-slot equipment loadout, salvage and crafting, and the dopamine of loot dropping on enemy corpses.

Each run lasts ~15 minutes. Each loot drop could be the one that defines the build. Each class plays differently because of its abilities and resource pool. Death is permanent for that run, but a small persistent stash carries your favorite finds between runs.

**Player fantasy:** "I am a tiny pixel-art demigod scything through hordes, picking up legendary trinkets, and getting more dangerous every wave."

---

## Design Pillars

1. **Tight runs, deep loot.** 15-minute sessions with itemization that has real decisions inside that window.
2. **Class identity through resources and abilities.** Auto-attacks are the floor; abilities + class resources are the ceiling.
3. **Diablo loot drama.** Items have rarity, affixes, and roll within stat ranges. Drops feel meaningful.
4. **Roguelite stakes, meta growth.** Lose everything on death, but the stash and unlocks keep the meta moving forward.
5. **Browser-first, Steam-portable.** Ship fast in HTML5; keep architecture clean enough to port if it grows.

---

## Core Loop

### In-run loop

Wave starts → enemies spawn → auto-attack + abilities → enemies drop XP gems, gold, and loot → pick up XP/gold auto-magnet, walk over gear to pick it up → wave ends → between-wave shop/blacksmith → level-up passive choice if leveled → next wave. Every 5th wave is a boss. Boss kill = active ability draft.

### Meta loop

Finish or die → return to home base → bank up to 1 item to stash → spend run rewards on permanent unlocks (classes, stash slots, starter weapon options) → start new run or jump into Slayer Trials.

---

## Combat System

### Auto-basic attacks

Every weapon fires automatically at its own attack-speed cadence, targeting the nearest valid enemy in range. Weapons can be equipped in main-hand and off-hand. Dual-wield classes (Rogue) can equip two main-hand weapons. Multiple weapons fire simultaneously.

### Active abilities

You start each run with **zero** abilities. After every boss kill (4 total), you're offered a draft of 3 abilities with visible rarity tiers. Pick one. By the end of a clean run you have 4 abilities, mapped to keys Q / W / E / R.

- **Bosses 1 and 2:** drafts pull only from your class's pool
- **Bosses 3 and 4:** drafts are mixed — off-class abilities can appear as wildcards

Abilities share the loot rarity ladder: White, Blue, Yellow, Orange. Same Fireball at different rarities = different damage, area, ticks, or special modifiers. A Legendary Fireball might leave a lingering burn field; a White Fireball is just a fireball.

### Class resources

Each class has a unique resource that fuels abilities. Shown as a bar directly under HP.

| Class | Resource | Behavior |
|---|---|---|
| Wizard | Mana | Large pool, slow passive regen |
| Warrior | Rage | Builds from damage dealt/taken, decays out of combat |
| Archer | Focus | Small pool, fast regen, crits restore bonus chunks |
| Rogue | Energy | Fast regen, also consumed by dodge/dash |
| Monk | Spirit | Builds per basic-attack hit on enemies |
| Paladin | Fury | Builds primarily from taking damage |
| Witch Doctor | Mojo | Hybrid; builds from minion deaths and casts |

### Elite enemies

Mixed into normal waves are **elite enemies** — single tougher units with 1–2 random affixes (Vortex pulls player in, Fire Trail leaves burn ground, Shielded must be broken before damage applies, Frozen Aura slows nearby, etc.). Elites are guaranteed to drop a magic-or-better item. They are the in-wave moments of tension.

---

## Classes

### Launch trio

- **Archer** — Long-range, high crit, low HP. Weapon family: bows, crossbows. Resource: Focus.
- **Wizard** — Elemental projectiles and AoE. Glass cannon. Weapon family: staves, wands, orbs. Resource: Mana.
- **Warrior** — Melee cleave with HP and armor. Weapon family: swords, axes, maces. Resource: Rage.

### Unlock roster

- **Rogue** (dual-wield) — Fast attacks from two weapons, dodge-heavy. Weapon family: daggers, hand crossbows. Resource: Energy. **Unlock:** beat the Crypt boss.
- **Monk** — Mobile melee, dash-based, builds resource through combo flow. Weapon family: fist weapons, quarterstaves. Resource: Spirit. **Unlock:** beat the Frostspire boss.
- **Paladin** — Tanky retaliation, holy damage, shield. Weapon family: sword + shield, holy hammers. Resource: Fury. **Unlock:** complete a full 20-wave run.
- **Witch Doctor** — Summons minions, poison and hex DoTs. Weapon family: blowguns, ceremonial knives. Resource: Mojo. **Unlock:** win a run without taking damage in any boss fight.

### Starting loadout

At run start, the class is offered a small pool of starter weapons (3 options) to pick from. The pool is intentionally small initially; unlocking more starter options is part of meta progression.

### Sample ability flavor (not locked, scoped during build)

- **Wizard:** Fireball, Frost Nova, Chain Lightning, Meteor, Arcane Orb
- **Warrior:** Whirlwind, Ground Slam, War Cry, Charge, Cleave
- **Archer:** Multi-shot, Rain of Arrows, Explosive Arrow, Hawk Eye
- **Rogue:** Shadowstep, Fan of Knives, Smoke Bomb, Backstab
- **Monk:** Cyclone Kick, Wave of Force, Healing Wind, Dash Strike
- **Paladin:** Consecration, Smite, Holy Shield, Lay on Hands
- **Witch Doctor:** Summon Zombies, Poison Cloud, Hex, Spirit Walk

---

## Gear System

### Equipment slots (10 total)

Helm, Chest, Gloves, Boots, Belt, Amulet, Ring 1, Ring 2, Main-hand weapon, Off-hand (shield / focus / quiver / second weapon for dual-wielders).

### Rarity tiers

| Tier | Color | Affixes | Notes |
|---|---|---|---|
| Common | White | 0–1 | Lowest stat ranges, common drop |
| Magic | Blue | 2–3 | Mid stat ranges |
| Rare | Yellow | 4 | Solid stat ranges |
| Legendary | Orange | 4 + 1 unique modifier | Game-changing modifier per item |
| Set | Green | Fixed affixes | Set bonuses unlock at 2/3/5/6 pieces equipped |

### Affix system

Affixes roll from pools weighted by item type and biome of origin. Each affix has a stat range (e.g. +10–25% crit chance). Higher item levels lift the floor and ceiling of those ranges.

**Affix categories:**

- **Offensive** — flat/percent damage, crit chance, crit multi, attack speed, elemental damage, on-hit procs (bleed, burn, freeze, shock, poison)
- **Defensive** — HP, armor, dodge, regen, resists per element, damage reduction
- **Utility** — pickup range, XP gain, gold find, mat find, movement speed
- **Build-defining** (legendary only) — examples: *"Your bleeds tick twice as fast"*, *"Crits chain to 2 nearby enemies"*, *"Every 5th shot fires a fireball"*, *"Frost damage now also burns"*

### Weapons

Weapons roll like other gear plus weapon-specific data: base damage range, base attack speed, range, projectile type. Legendary weapons can roll game-changing modifiers ("Shots split into 3", "Pierces all enemies", "Summons a shade on critical").

### Sockets and gems

Some items roll with 1–3 sockets (more sockets possible at higher rarity). Gems drop separately as loot:

- Ruby — fire damage
- Sapphire — cold damage
- Topaz — lightning damage
- Emerald — poison damage
- Diamond — all resists
- Skull — life leech
- Amethyst — mana (or class resource) regen

Slot a gem into a socket to add its bonus. Gems themselves have quality tiers (chipped → flawless → perfect).

### Durability

All gear has durability (e.g. 100/100). Durability only decreases on death.

- **Standard mode:** irrelevant — you lose all gear on death
- **Slayer Trials:** each equipped piece loses 25% durability per death. At 0 durability, item stats are halved until repaired at the blacksmith. Repair cost scales with rarity.

---

## Biomes and Bosses

The 20-wave run is split into 4 acts, each with a distinct biome, enemy palette, terrain hazards, and themed loot affix bias.

### Act I — The Crypt (waves 1–5)

- **Vibe:** dark stone, fog, sickly green lighting
- **Enemies:** skeletons, zombies, bone wraiths
- **Hazards:** patches of grasping hands that slow movement
- **Loot bias:** physical damage, bleed on hit
- **Boss (wave 5):** **The Bone Lord** — summons skeleton waves, melee swing in cone

### Act II — Frostspire Peaks (waves 6–10)

- **Vibe:** white/blue snow, jagged cliffs, blizzard particles
- **Enemies:** yetis, ice wraiths, frost wolves
- **Hazards:** ice floor that reduces friction; falling icicles
- **Loot bias:** cold damage, slow on hit, freeze chance
- **Boss (wave 10):** **The Ice Giant** — slam attack with shockwave rings, summons ice walls

### Act III — Infernal Depths (waves 11–15)

- **Vibe:** red/orange, lava cracks, ember particles
- **Enemies:** imps, hellhounds, lava elementals
- **Hazards:** lava pools, fire geysers
- **Loot bias:** fire damage, burn DoT
- **Boss (wave 15):** **The Pyromancer** — teleport-based, leaves fire pools, casts meteor rings

### Act IV — The Void Throne (waves 16–20)

- **Vibe:** purple/black, reality-warp distortions, starfield
- **Enemies:** shadows, void casters, abominations
- **Hazards:** rift portals that spawn ambushes
- **Loot bias:** lightning, chaos (random elemental), highest legendary chance
- **Boss (wave 20):** **The Slayer-Killer** — multi-phase final boss, drops guaranteed orange

---

## Economy

### Gold

Primary currency. Drops from enemies. Used to:

- Buy items in the shop
- Pay for shop refresh (escalating cost per refresh)
- Pay for level-up choice rerolls (escalating cost per reroll)
- Repair gear in Trials mode
- Identify rare/legendary items at the blacksmith

### Crafting materials

Salvaging gear at the blacksmith returns mats tiered by rarity:

- **Bone Shards** — from White
- **Arcane Dust** — from Blue
- **Glimmering Essence** — from Yellow
- **Legendary Fragments** — from Orange

### Blacksmith services

- **Salvage** — break down an item into mats of its tier
- **Reroll affixes** — random new affix roll on an item (costs gold + mats)
- **Add socket** — adds an empty socket to a socketless item (costs mats)
- **Identify** — orange and yellow drops can spawn unidentified; ID at a small gold cost reveals affixes
- **Transmute** — combine 3 items of same rarity into 1 random item of the next rarity tier (D2-cube spirit)
- **Upgrade** — risky: spend mats for a chance to raise an item's rarity. On fail, lose the item
- **Repair** (Trials only) — restore durability, cost scales with rarity

### Shop

Between waves, a refresh of items appears for sale. Limited slots. Reroll-the-shop button costs escalating gold (1g, 3g, 9g, 27g) per refresh within the same intermission.

### Reroll philosophy

Both shop refresh and level-up passive choice rerolls follow the same escalating-cost pattern: every reroll within the same decision point costs ~3× the previous. This makes early rerolls casual and late rerolls a real commitment.

---

## Progression

### In-run progression

- **XP gems** drop from enemies and auto-magnet to the player within pickup range. Picking them up fills the XP bar. Level-up triggers a Brotato-style "pick 1 of 3" passive/stat-bump screen between waves.
- **Boss kills** trigger an active ability draft (pick 1 of 3, visible rarity).
- **Loot drops** lie on the ground; walk over to pick up.

### Meta progression

- **Persistent stash** — at the end of any run (win or die), you can save 1 item from that run's inventory to the stash. Stash starts at 10 slots.
- **Class unlocks** — each non-starter class has a specific achievement (see Classes section).
- **Stash expansion** — completing each Slayer Trial tier adds 5 stash slots.
- **Starter pool expansion** — meta milestones unlock additional starting weapon options for each class.

### Slayer Trials (challenge mode)

Endgame loop after beating the base game once. You equip stash gear into a full 10-slot loadout, then run a 20-wave gauntlet at multiplied difficulty (more enemy HP, more spawns, more elites). Rewards: bigger loot tables, unique-only drops from the final boss, Mythic shards for ultimate items.

**Trial tiers:** I, II, III, … each progressively harder with better rewards.

**Trial death rules:**

- Keep your gear; each equipped piece loses 25% durability per death
- No loot drops on a failed trial — the run is forfeit
- The trial tier you were attempting locks back one level until re-cleared (light tension, no rage-quit)

---

## UI / HUD

### In-arena HUD

- Top-left: HP bar, resource bar (color-coded per class)
- Bottom-center: ability bar (4 slots, Q/W/E/R, cooldowns + resource cost shown)
- Top-right: wave timer, current wave number
- Bottom-left: gold counter, current equipped weapon icons
- Across the top: XP bar
- Damage numbers float over enemies on hit (small, fast)

### Between-wave screens

- **Inventory** — drag-and-drop into 10 equipment slots. Tooltips show affixes, rarity, durability.
- **Shop** — items for sale grid, refresh button with escalating cost
- **Blacksmith** — tabs for salvage / reroll / socket / identify / transmute / upgrade / repair

### Meta screens

- **Stash** — grid view of all banked items, drag from inventory to stash, sort/filter
- **Character select** — locked/unlocked indicators with hint text for unlock conditions
- **Slayer Trials** — tier selection screen, shows multiplier and best clear

### Controls

Slayers supports keyboard/mouse **and** gamepad (Xbox and PS5 DualSense via the browser Gamepad API). The game auto-detects connected controllers and swaps button prompts in the HUD to match the active input device. Players can play with either at any time.

#### Keyboard + mouse

- **WASD** — movement
- **1 / 2 / 3 / 4** — abilities 1–4 (number row keeps the home row free for movement)
- **Space** — class-specific action (Rogue dash, Monk dash strike, Paladin block, etc.)
- **Tab** or **I** — toggle inventory between waves
- **Esc** — close menus / pause
- **R** — restart on death screen
- **Left-click** — UI interaction (no aim required; auto-targeting handles combat)
- **Right-click** (optional) — manual aim override toward cursor

#### Gamepad (Xbox / PS5 DualSense)

| Action | Xbox | PS5 |
|---|---|---|
| Movement | Left stick | Left stick |
| Manual aim (optional override) | Right stick | Right stick |
| Ability 1 | A | Cross (✕) |
| Ability 2 | B | Circle (○) |
| Ability 3 | X | Square (□) |
| Ability 4 | Y | Triangle (△) |
| Class action (dash/block) | LB | L1 |
| Quick pickup / interact | RB | R1 |
| Pause | Menu | Options |
| Inventory (between waves) | View | Create |
| Menu navigation | D-pad / Left stick | D-pad / Left stick |
| Menu confirm / cancel | A / B | ✕ / ○ |

Auto-targeting still handles basic attacks in both modes. The right stick is an *optional* aim override for players who want manual control over ability direction (e.g. aiming a Fireball cone) — abilities default to firing toward the nearest enemy if no stick input is given.

**Fancy DualSense features** (adaptive triggers, haptics) are deferred to the Steam port phase — the browser Gamepad API doesn't expose them reliably yet.

---

## Tech & Architecture

### Stack

- **HTML5 Canvas + vanilla JS** (ES modules)
- Single `index.html` entry, modular JS files
- No build step initially — use native ES module imports
- `localStorage` for save data (stash, unlocks, settings)
- **Browser Gamepad API** for Xbox / PS5 controller support (auto-detection, hot-swap with keyboard)
- Pixel art assets — start with simple primitives, replace with sprites in polish phase

### Input abstraction

A unified input layer (`/src/core/input.js`) translates raw keyboard, mouse, and gamepad signals into a common set of game actions (`MOVE_X`, `MOVE_Y`, `ABILITY_1..4`, `CLASS_ACTION`, `PAUSE`, `INVENTORY`, `AIM_X`, `AIM_Y`, etc.). Game logic only reads these abstract actions — it never touches the raw input source. This makes:

- Hot-swapping between keyboard and controller mid-run trivial
- Future remapping UI a small feature, not a rewrite
- The Steam port simpler (Steam Input maps to the same abstract actions)

### Proposed module structure

```
/index.html
/style.css
/src/
  /core/
    loop.js        # main game loop, state machine
    input.js       # keyboard/mouse handling
    rng.js         # seedable random for testing
  /game/
    player.js      # player state, movement, equipment
    enemies/       # enemy types + AI
    weapons/       # weapon definitions, projectiles
    abilities/     # ability definitions, effects
    items/         # item generation, affixes, rarity rolls
    biomes/        # act definitions, enemy spawn tables, palettes
    economy.js     # shop, blacksmith, crafting
    progression.js # XP, level-up, ability drafts
  /render/
    canvas.js      # thin renderer, replaceable
    hud.js         # in-arena HUD
    screens.js     # menus, inventory, shop, blacksmith
  /save/
    storage.js     # localStorage wrapper
    save_format.js # versioned save data
/assets/
  /sprites/
  /audio/         # later
```

### Steam portability

Keep gameplay logic free of DOM access. The renderer consumes game state, not the other way around. If we port to Electron/Tauri for Steam, only renderer + input need to change. If we ever rewrite in Godot, the design doc and balance numbers are the portable parts.

---

## Phased Build Plan

The plan is intentionally end-to-end-first: get a full run playable as fast as possible, then deepen each system.

### Phase 0 — Foundation
`index.html` + canvas + game loop + unified input layer (keyboard **and** gamepad from day one) + player movement + one enemy that walks toward the player + collision detection.
**Done when:** something moves on screen, responds to either keyboard or controller, and dies on contact.

### Phase 1 — Combat core
One auto-firing weapon (nearest-enemy targeting). XP gems drop, level-up triggers a stat-boost screen. Wave timer + waves of spawning enemies. Death + restart.
**Done when:** first playable mini-game exists.

### Phase 2 — Loot drops + equipment
Items drop from enemies. Inventory screen. 10 equipment slots functional. Affixes affect stats. Rarity visible by color.
**Done when:** it feels Diablo-flavored.

### Phase 3 — First class + abilities + resource
Implement Archer as the first proper class. Focus resource bar. Drafting one ability. Active-ability use with cooldown + resource cost.
**Done when:** combat has depth beyond auto-attacks.

### Phase 4 — Act I + first boss
Crypt biome palette and enemy roster. Wave 5 boss fight (Bone Lord). Boss-kill ability draft screen with visible rarity.
**Done when:** first full mini-run (waves 1–5) playable.

### Phase 5 — Shop, blacksmith, level-up rerolls
Between-wave shop with refresh. Blacksmith services (salvage, reroll, identify). Brotato-style level-up passive picks with escalating reroll cost.
**Done when:** the economy loop closes.

### Phase 6 — Acts II, III, IV
Frostspire, Inferno, Void biomes. Their bosses. Themed enemies, hazards, loot biases. Full 20-wave run playable end-to-end.
**Done when:** full game shell complete.

### Phase 7 — Second class (Wizard)
Validate that the class system extends cleanly. Mana resource. Wizard ability pool. Drop table bias for staves/wands.
**Done when:** two classes shipping.

### Phase 8 — Third class (Warrior) + meta progression
Rage resource. Melee feel pass. Persistent stash via localStorage. Class unlock achievements wired up. Save format versioned.
**Done when:** launch trio complete and meta progression hooks are live.

### Phase 9 — Slayer Trials
Trial tier select. Stash gear loadout into runs. Difficulty multipliers. Durability/repair system live. No-loot-on-fail rule.
**Done when:** endgame loop exists.

### Phase 10 — Polish
Pixel art sprite pass (replace primitives). Game juice (screenshake, hit flashes, damage numbers, particles). Sound + music. Balance pass on stats and drop rates.
**Done when:** it's something we'd actually show off.

### Beyond launch

- Unlock Rogue, Monk, Paladin, Witch Doctor classes
- More legendary items with unique mechanics
- Endless mode variants
- Steam port via Electron/Tauri (or full Godot rewrite if scale demands)

---

## Open Questions / TBD

These don't block Phase 0–3. Resolve as we approach the relevant phase.

- Number of unique legendaries at launch (working target: ~5 per slot type)
- Set design: how many sets at launch, what archetypes
- Mythic items: launch or post-launch?
- Difficulty curve specifics — enemy HP/damage scaling formula per wave
- Pixel art resolution (16×16 vs 32×32 sprites)
- Sound and music — defer to Phase 10
- Whether off-hand for non-dual-wielders has its own loot pool (focus, quiver, shield) or just shares ring/amulet pools
- Exact ability cap (4 confirmed but could grow with meta progression)
- Controller remapping UI — ship with fixed default bindings, add remapping in a later polish pass
- DualSense haptics and adaptive triggers — defer to Steam port

---

*This is a living document. Update it as decisions get made.*
