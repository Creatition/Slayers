# Slayers — Art Checklist

All art is procedural pixel art in `src/sprites.js` (10×14 player, 10-14×9-16 enemies, 18-22×22-24 bosses, 10×10 items).
Tick a box when the sprite is in code and visually polished.

---

## PLAYER CHARACTERS (8 classes)
All exist. Review for polish / distinctiveness.

- [x] Archer — green palette, bow baked in
- [x] Wizard — blue palette, staff baked in
- [x] Warrior — red palette, sword baked in
- [x] Rogue — purple palette, daggers baked in
- [x] Monk — orange palette, fist stance
- [x] Paladin — gold palette, hammer baked in
- [x] Witch Doctor — green palette, voodoo staff baked in
- [x] Necromancer — purple/grey palette, orb baked in

**Future (palette swap system):**
- [ ] Armor-dark slot (palette[4]) tints on chest equip
- [ ] Armor-light slot (palette[5]) tints on chest equip
- [ ] Boot slot (palette[6]) tints on boot equip
- [ ] Helm overlay sprite (optional, Option B)

---

## BIOMES (4 existing + proposed new ones)

### Existing
- [x] The Crypt — dark grey/green palette, grid deco defined
- [x] Frostspire Peaks — blue/icy palette, grid deco defined
- [x] Infernal Depths — red/orange palette, grid deco defined
- [x] The Void Throne — deep purple palette, grid deco defined

### Proposed new biomes (for random round rotation)
- [ ] **Verdant Ruins** — overgrown ancient temple; greens, mossy stone, vines
- [ ] **Blighted Swamp** — murky green-brown, fog, rotting wood
- [ ] **Crystal Caverns** — teal/cyan, glowing crystal formations
- [ ] **Ashen Wastes** — grey/white ash, bone fields, low contrast
- [ ] **Storm Peaks** — dark blue-grey, lightning, jagged rock

**Biome assets needed per biome:**
- [ ] Background color (`bg`)
- [ ] Grid/tile color (`grid`)
- [ ] 4× decoration colors (`decoColors`) for scatter deco
- [ ] Unique deco sprite(s) — e.g. skull pile, ice shard, lava vent, void crystal *(currently none exist)*

---

## ENEMIES

### Crypt
- [x] Skeleton — 10×13, grey bones
- [x] Zombie — 10×13, rotting green/brown
- [x] Crypt Rat — 11×8, small brown rodent

### Frostspire
- [x] Yeti — 14×16, white/blue bulky
- [x] Frost Wolf — 14×9, icy wolf silhouette

### Infernal Depths
- [x] Imp — 10×12, red winged demon
- [x] Hellhound — 14×11, dark red fire dog

### The Void
- [x] Shadow — 10×14, dark purple wispy
- [x] Void Caster — 10×14, purple orb caster

### Needed for new biomes
- [ ] **Verdant Ruins** — Vine Crawler (small), Stone Golem (large)
- [ ] **Blighted Swamp** — Bog Witch (ranged), Sludge Hulk (melee tank)
- [ ] **Crystal Caverns** — Crystal Spider (fast), Shard Elemental (ranged)
- [ ] **Ashen Wastes** — Ash Wraith (fast), Bone Colossus (slow tank)
- [ ] **Storm Peaks** — Thunder Hawk (fast flyer feel), Storm Giant (slow heavy)

---

## BOSSES (1 per biome)

### Existing
- [x] Bone Lord — Crypt boss, 18-22× crowned skeleton king
- [x] Ice Giant — Frostspire boss, large frost giant
- [x] Pyromancer — Inferno boss, fire mage
- [x] Slayer Killer — Void boss, tall dark void figure

### Needed for new biomes
- [ ] **Verdant Ruins boss** — Ancient Guardian (stone idol, vine tendrils)
- [ ] **Blighted Swamp boss** — The Hag Queen (witch on throne of bones)
- [ ] **Crystal Caverns boss** — Prism Wyrm (crystal dragon silhouette)
- [ ] **Ashen Wastes boss** — The Pale Titan (massive bleached colossus)
- [ ] **Storm Peaks boss** — Stormcaller (floating elemental lord)

---

## ITEM ICONS (10×10, rendered in inventory/loot UI)

### Armor
- [x] Leather Cap (helm)
- [x] Leather Tunic (chest)
- [x] Cloth Gloves
- [x] Soft Boots
- [x] Worn Belt

### Accessories
- [x] Tin Amulet
- [x] Iron Ring

### Weapons
- [x] Hunter Bow (ranged)
- [x] Iron Sword (melee)
- [x] Hand Axe (melee)
- [x] Sharp Dagger (melee)
- [x] Gnarled Staff (ranged)
- [x] Carved Wand (ranged)
- [x] Spiked Mace (melee)

### Offhand
- [x] Tattered Quiver
- [x] Wooden Shield
- [x] Magic Orb

### Missing item tiers (same slots, upgraded looks)
- [ ] Magic (blue glow variant palette per weapon type)
- [ ] Rare (yellow glow variant)
- [ ] Legendary (orange glow variant)
*(Currently all icons are single sprites — rarity shown only by color border in UI. Could add glow pixels to icon palette.)*

---

## UI / CHROME ART

- [x] XP bar
- [x] HP bar
- [x] Resource (Focus) bar
- [x] Minimap
- [x] Inventory grid
- [x] Wave/biome label
- [ ] **Biome transition screen** — splash art or color wash when new biome starts
- [ ] **Boss intro card** — name + portrait frame when boss spawns
- [ ] **Death screen illustration**
- [ ] **Victory screen illustration**

---

## EFFECTS / PARTICLES
*(Procedural, not sprites — but worth auditing)*

- [x] XP orb
- [x] Hit flash (white)
- [x] Crit spark burst
- [x] Death burst (color per enemy)
- [x] Loot drop glow
- [x] Shockwave ring (abilities)
- [x] Meteor ground FX
- [ ] **Biome-specific ground deco** — scattered static prop sprites per biome (tombstones, ice shards, lava cracks, void portals)
- [ ] **Weather layer** — snow particles (Frostspire), ember drift (Inferno), void wisps (Void)

---

## SUMMARY

| Category | Done | TODO |
|---|---|---|
| Player sprites | 8/8 | palette-swap system |
| Biomes | 4/9 | 5 new biomes |
| Enemy sprites | 9/9 existing | 10 new (2 per new biome) |
| Boss sprites | 4/9 existing | 5 new bosses |
| Item icons | 17/17 existing | glow tiers (optional) |
| UI chrome | 6/10 | transitions, boss card, end screens |
| Ground deco | 0 | per-biome prop sprites |

**Priority order for new content:** Biome defs (colors only, fast) → enemies per biome → bosses → deco sprites → UI chrome
