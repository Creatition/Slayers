// ============================================================
// SPRITES — Procedural pixel-art renderer.
//
// Each sprite is a small pixel matrix encoded as:
//   { w, h, palette, rows }
// where `rows` is an array of strings — each character is either
// '.' (transparent) or an index into `palette` (0..9, a..z).
//
// drawSprite(ctx, sprite, cx, cy, flip) renders centered at (cx, cy).
//
// Why ASCII rows? They're vibe-friendly: you can read & edit the
// sprite directly in the source file without any external tool.
// We can swap any single sprite for a PNG later without changing
// any draw call — drawSprite is the only API the game uses.
// ============================================================

// Look up a palette character — supports 0-9 (10 slots) and a-z (26 more).
// Total addressable: 36 colors per sprite, plenty for pixel art.
function _palIdx(ch) {
  const c = ch.charCodeAt(0);
  if (c >= 48 && c <= 57) return c - 48;        // 0-9 -> 0-9
  if (c >= 97 && c <= 122) return 10 + c - 97;  // a-z -> 10-35
  return -1;
}

// Draw a sprite centered on (cx, cy). flip=true mirrors horizontally.
// hitFlash: optional bool — paints all opaque pixels white (for damage feedback).
// scale: integer pixel scale (1 = native, 2 = each sprite pixel becomes 2×2). Default 1.
function drawSprite(ctx, sprite, cx, cy, flip, hitFlash, scale) {
  if (!sprite) return;
  const s = Math.max(1, scale | 0);
  const sx = Math.floor(cx - (sprite.w * s) / 2);
  const sy = Math.floor(cy - (sprite.h * s) / 2);
  for (let r = 0; r < sprite.h; r++) {
    const row = sprite.rows[r];
    if (!row) continue;
    for (let c = 0; c < sprite.w; c++) {
      const ch = row[c];
      if (!ch || ch === '.') continue;
      const idx = _palIdx(ch);
      if (idx < 0) continue;
      const color = hitFlash ? '#ffffff' : sprite.palette[idx];
      if (!color) continue;
      const drawCol = flip ? (sprite.w - 1 - c) : c;
      ctx.fillStyle = color;
      ctx.fillRect(sx + drawCol * s, sy + r * s, s, s);
    }
  }
}

// ============================================================
// PALETTES — shared color sets
// ============================================================
// Palette index conventions used across the player sprites:
//   0 = outline (very dark)
//   1 = skin shadow
//   2 = skin
//   3 = hair / accent
//   4 = primary armor/cloth dark
//   5 = primary armor/cloth light
//   6 = secondary (boots / belt)
//   7 = weapon highlight
//   8 = weapon body
//   9 = eyes / detail

// ============================================================
// PLAYER SPRITES
// ============================================================
// All player sprites are 10×14 with center of mass roughly at row 8.
// Facing-right is canonical; flip=true mirrors for facing-left.
// Outline is index 0, body palettes vary per class.

const SPRITE_ARCHER = {
  w: 10, h: 14,
  // 0=outline(near-black) 1=skin-shadow(tanned) 2=skin(tanned) 3=unused
  // 4=hood-dark 5=tunic-light 6=belt 7=bow-string 8=bow-wood 9=eye-amber
  palette: [
    '#070906', '#7a4c1c', '#c28030', '#070906',
    '#0c2810', '#1a4c18', '#5a3810', '#f0d040',
    '#7a4818', '#e87010',
  ],
  rows: [
    '..04440...',
    '.0444440..',
    '.0444440..',
    '.0492940..',
    '.0442240..',
    '..04420...',
    '.04444487.',
    '0455554708',
    '0455554708',
    '0466664408',
    '.04555408.',
    '.04..4408.',
    '.04..4408.',
    '.06..60.8.'
  ],
};

const SPRITE_WIZARD = {
  w: 10, h: 14,
  // 0=outline(near-black) 1=skin-shadow 2=skin-pale 3=beard-grey
  // 4=robe-near-black 5=robe-dark-violet 6=gold-trim 7=staff-orb 8=staff-wood 9=eye
  palette: [
    '#070610', '#907060', '#d8c0a0', '#9090a8',
    '#100630', '#281268', '#c09020', '#aaddff',
    '#4a3818', '#070610',
  ],
  rows: [
    '...04440..',
    '..044440..',
    '0044444400',
    '.0332230..',
    '.0392290.7',
    '.0333330.8',
    '.04444487.',
    '0455554487',
    '0455554488',
    '0466666488',
    '.04555488.',
    '.04..4488.',
    '.04..4488.',
    '.04..40.8.'
  ],
};

const SPRITE_WARRIOR = {
  w: 10, h: 14,
  // 0=outline(near-black) 1=skin-shadow 2=skin 3=hair-blood-red
  // 4=armor-near-black 5=armor-steel 6=belt-leather 7=blade-gleam 8=blade-body 9=eye
  palette: [
    '#0a0808', '#9a4c18', '#e09050', '#cc1a00',
    '#222028', '#545060', '#3a2810', '#f0f0f8',
    '#686878', '#0a0808',
  ],
  rows: [
    '..03330...',
    '.0333330..',
    '.0322230..',
    '.0392290..',
    '.0322220.8',
    '..00220..8',
    '.04444408.',
    '0455554408',
    '0455554478',
    '0466666408',
    '.04555408.',
    '.04..40.8.',
    '.04..40.8.',
    '.06..60.8.'
  ],
};


const SPRITE_ROGUE = {
  w: 10, h: 14,
  // 0=outline(near-black) 1=skin-shadow 2=skin 3=hood-near-black
  // 4=leather-dark-violet 5=leather-violet 6=belt-dark 7=blade-shine 8=blade 9=eye-TEAL
  palette: [
    '#06040e', '#907050', '#c89060', '#160828',
    '#2a1460', '#502898', '#0e0820', '#d8d4f0',
    '#8858c0', '#00f0d0',
  ],
  rows: [
    '..03330...',
    '.0333330..',
    '.0333340..',
    '.0309940..',
    '.0334430..',
    '..03430...',
    '.04444487.',
    '0455554487',
    '0455554488',
    '0466666488',
    '.04555488.',
    '.04..4488.',
    '.04..4488.',
    '.06..60.8.'
  ],
};

const SPRITE_MONK = {
  w: 10, h: 14,
  // 0=outline(near-black) 1=skin-shadow 2=skin 3=topknot-dark
  // 4=gi-dark-orange 5=gi-bright-orange 6=sash-gold 7=wrap-pale-gold 8=accent 9=eye-FIRE
  palette: [
    '#080808', '#9a5018', '#e09050', '#1a1008',
    '#8c3c08', '#e06010', '#e8a000', '#ffe880',
    '#c87000', '#ff8800',
  ],
  rows: [
    '...03330..',
    '..033330..',
    '.0322230..',
    '.0392290..',
    '.0322220..',
    '..00220...',
    '.0444447..',
    '0455554477',
    '0455554472',
    '0466666472',
    '.04555.7..',
    '.04..40...',
    '.04..40...',
    '.02..20...'
  ],
};

const SPRITE_PALADIN = {
  w: 10, h: 14,
  // 0=outline(near-black) 1=skin-shadow 2=skin 3=unused
  // 4=plate-dark-steel 5=plate-blue-grey 6=plate-highlight+cross 7=hammer-HOLY-GOLD 8=haft 9=visor-GLOW
  palette: [
    '#0c0c18', '#a08050', '#e0c090', '#0c0c18',
    '#282840', '#5868a0', '#dde8ff', '#ffe840',
    '#5a4818', '#ffe840',
  ],
  rows: [
    '..04440...',
    '.0444440..',
    '.0444620..',
    '.0499940..',
    '.0444440..',
    '..04440...',
    '.04444487.',
    '0456554487',
    '0456554488',
    '0466666488',
    '5455556488',
    '.04..4488.',
    '.04..40..8',
    '.06..60...'
  ],
};

const SPRITE_WITCH_DOCTOR = {
  w: 10, h: 14,
  // 0=outline(near-black) 1=skin-shadow 2=skin 3=bone-ivory
  // 4=robe-near-black 5=robe-dark-green 6=beads-ORANGE 7=staff-glow-GREEN 8=staff-wood 9=eye-GREEN
  palette: [
    '#040c04', '#9a6030', '#d09050', '#e0d8a0',
    '#080e08', '#142a14', '#e05a00', '#66ff44',
    '#3a2010', '#66ff44',
  ],
  rows: [
    '.03333340.',
    '0333333330',
    '.0333340..',
    '.0399940..',
    '.0333340..',
    '..03340...',
    '.04444487.',
    '0455554487',
    '0455554488',
    '0466666488',
    '.04555488.',
    '.04..4488.',
    '.04..4488.',
    '.04..40.8.'
  ],
};

const SPRITE_NECROMANCER = {
  w: 10, h: 14,
  // 0=outline(near-black) 1=skin-shadow 2=skin-pale-corpse 3=cowl-near-black
  // 4=robe-near-black 5=robe-very-dark-purple 6=trim-purple 7=staff-bone-glow 8=staff-bone 9=eye-MAGENTA
  palette: [
    '#04040e', '#786050', '#c0a890', '#060410',
    '#080618', '#160e30', '#5028a0', '#f0c0ff',
    '#9878d0', '#ff00ff',
  ],
  rows: [
    '..03330...',
    '.0333330..',
    '.0333330..',
    '.0309930..',
    '.0333320..',
    '..03320...',
    '.04444487.',
    '0455554487',
    '0455554488',
    '0466554488',
    '.04555488.',
    '.04..4488.',
    '.04..4488.',
    '.04..40.8.'
  ],
};

// ============================================================
// DRUID — antler crown, bark/leaf armor, nature-glow staff, bare feet
// 0=outline 1=skin-shadow 2=skin 3=antler 4=bark-dark 5=bark-light
// 6=leaf-trim 7=staff-glow(green) 8=staff-wood 9=eye-glow(green)
// ============================================================
const SPRITE_DRUID = {
  w: 10, h: 14,
  // 0=outline(near-black) 1=skin-shadow 2=skin 3=antler-bone-brown
  // 4=bark-near-black 5=bark-dark-green 6=leaf-trim-BRIGHT 7=staff-glow-GREEN 8=staff-wood 9=eye-EMERALD
  palette: [
    '#04100a', '#9a7040', '#d8a860', '#8a5c1c',
    '#0a2008', '#1a5010', '#4aaa18', '#88ff44',
    '#5a3a14', '#44ff88',
  ],
  rows: [
    '..03.30...',
    '.0333330..',
    '.0322230..',
    '.0392290..',
    '.0322220..',
    '..00220...',
    '.04444487.',
    '0455554487',
    '0455554488',
    '0466554488',
    '.04555488.',
    '.04..4488.',
    '.04..4488.',
    '.04..40.8.'
  ],
};

// ============================================================
// AMAZONIAN — red feather headdress, tanned skin, tribal leather,
//             bone-tipped spear. Distinct from Ranger (darker + spear).
// 0=outline 1=skin-shadow(tanned) 2=skin(tanned) 3=feather(red-orange)
// 4=leather-dark 5=leather-light 6=gold-bone-trim 7=spear-tip(bone)
// 8=spear-shaft 9=eye
// ============================================================
const SPRITE_AMAZONIAN = {
  w: 10, h: 14,
  // 0=outline(near-black) 1=skin-shadow(deep-tan) 2=skin(vivid-tan) 3=feather-RED-ORANGE
  // 4=leather-dark 5=leather-light 6=gold-trim 7=spear-tip-IVORY 8=spear-shaft 9=eye
  palette: [
    '#100806', '#7a4818', '#c87830', '#e03c00',
    '#3a2010', '#7a4820', '#e0a820', '#f8f0d0',
    '#7a4c18', '#100806',
  ],
  rows: [
    '..03330...',
    '.0333330..',
    '.0322230..',
    '.0392290..',
    '.0322220..',
    '..00220...',
    '.04444487.',
    '0455554487',
    '0455554488',
    '0466664488',
    '.04555488.',
    '.04..4488.',
    '.04..4488.',
    '.06..60.8.'
  ],
};

// ============================================================
// DRUID DRAGON FORM — fiery orange scales, bone horns, yellow eyes, fire glow right side
// 0=dark-outline 1=scale-shadow(dark-red) 2=scale-main(red-orange) 3=horn(bone-ivory)
// 4=armor-dark 5=armor-main 6=belly-orange 7=fire-glow 8=eye-yellow 9=claw-ivory
// ============================================================
const SPRITE_DRUID_DRAGON = {
  w: 10, h: 14,
  palette: [
    '#060200', '#5a1800', '#c84800', '#ead870',
    '#1a0a00', '#7a2c10', '#ffa020', '#ff6600',
    '#ffee00', '#f0e8b0',
  ],
  rows: [
    '..03.30...',
    '.0333330..',
    '.0322230..',
    '.0382280..',
    '.0322220..',
    '..00220...',
    '.04444476.',
    '0455554476',
    '0455554477',
    '0466554477',
    '.04555477.',
    '.04..4477.',
    '.04..4477.',
    '.04..40.7.',
  ],
};

// ============================================================
// DRUID PANTHER FORM — near-black fur, golden yellow eyes, ivory claws
// 0=outline 1=fur-shadow 2=fur-main(deep black) 3=marking 4=body-dark
// 5=body 6=belly(slightly lighter) 7=dark 8=eye(golden-yellow) 9=claw(light-tan)
// ============================================================
const SPRITE_DRUID_PANTHER = {
  w: 10, h: 14,
  palette: [
    '#030203', '#0c0a0c', '#141214', '#1e1a1e',
    '#0c0a0c', '#1e1a1e', '#2a2628', '#0c0a0c',
    '#ffd000', '#c8b090',
  ],
  rows: [
    '..03.30...',
    '.0333330..',
    '.0222230..',
    '.0282280..',
    '.0222220..',
    '..00220...',
    '.04444489.',
    '0455554489',
    '0455554499',
    '0466554499',
    '.04555499.',
    '.04..4499.',
    '.04..4499.',
    '.04..40.9.',
  ],
};

const PLAYER_SPRITES = {
  ranger:        SPRITE_ARCHER,       // Archer sprite repurposed for Ranger
  sorcerer:      SPRITE_WIZARD,       // Wizard sprite repurposed for Sorcerer
  berserker:     SPRITE_WARRIOR,      // Warrior sprite repurposed for Berserker
  assassin:      SPRITE_ROGUE,        // Rogue sprite repurposed for Assassin
  templar:       SPRITE_MONK,         // Monk sprite repurposed for Templar
  crusader:      SPRITE_PALADIN,      // Paladin sprite repurposed for Crusader
  shaman:        SPRITE_WITCH_DOCTOR, // Witch Doctor sprite repurposed for Shaman
  necromancer:   SPRITE_NECROMANCER,
  druid:         SPRITE_DRUID,        // Human form
  druid_dragon:  SPRITE_DRUID_DRAGON, // Dragon Wild Shape form
  druid_panther: SPRITE_DRUID_PANTHER,// Panther Wild Shape form
  amazonian:     SPRITE_AMAZONIAN,    // unique Amazonian sprite
};


// ============================================================
// ITEM SPRITES — 10×10 pixel icons rendered at scale 2 = 20×20px.
// Palette: 0=dark outline  1=shadow/body-dark  2=body-main  3=highlight/detail
// ============================================================
const ITEM_SPRITES = {

  // ── ARMOR ───────────────────────────────────────────────────────────────
  cap: {        // Helm: domed top, T-visor slot
    w: 10, h: 10,
    palette: ['#1a1008','#5a4030','#a07848','#e0c088'],
    rows: [
      '...01110..', // dome peak
      '..011110..',
      '.01111110.',
      '0111111110', // full dome
      '0111111110',
      '0111001110', // T-visor slot
      '0111001110',
      '0000000000', // brim
      '.0......0.',
      '..........', ],
  },
  tunic: {      // Chest: shoulder pads, V-neck, body
    w: 10, h: 10,
    palette: ['#1a1008','#2a3848','#3a5868','#88c0d8'],
    rows: [
      '0.011110.0', // shoulder pads
      '0011111100', // shoulders connect
      '0122222210', // V-neck chest
      '0122222210',
      '0122222210', // body
      '0122222210',
      '0122222210',
      '0.022220.0', // hem
      '..........', '..........', ],
  },
  gloves: {     // Gauntlet: four fingers + knuckle line
    w: 10, h: 10,
    palette: ['#1a1008','#603818','#9a6030','#d0a060'],
    rows: [
      '.01.010.0.', // finger tips
      '0111011100', // fingers
      '0111011110', // fingers full
      '0333333330', // knuckle highlight row
      '0111111110', // back of hand
      '0111111110',
      '.011111100', // cuff taper
      '..0111100.', // cuff
      '..........', '..........', ],
  },
  boots: {      // Boot: side silhouette, distinct toe + heel
    w: 10, h: 10,
    palette: ['#1a1008','#3a2010','#6a3820','#a06030'],
    rows: [
      '...01110..',  // shin top
      '..0111100.',
      '..0111100.',
      '.011111100',
      '.011111100', // ankle
      '.011111110', // ankle fill
      '0111111110', // foot
      '0111111110',
      '0000000000', // sole
      '..........', ],
  },
  belt: {       // Belt: wide band, prominent gold buckle center
    w: 10, h: 10,
    palette: ['#1a1008','#3a2010','#7a4820','#e8b020'],
    rows: [
      '..........',
      '0111111110',
      '0111111110', // strap
      '0113333110', // gold buckle
      '0113333110', // gold buckle
      '0111111110', // strap
      '0111111110',
      '0000000000',
      '..........', '..........', ],
  },

  // ── JEWELRY ─────────────────────────────────────────────────────────────
  amulet: {     // Pendant: chain link + large teardrop gem
    w: 10, h: 10,
    palette: ['#1a1008','#888898','#44aaff','#aaddff'],
    rows: [
      '....01....',  // chain top
      '...0110...',
      '...0110...',
      '..011110..',  // gem top
      '.01122110.',
      '0112222110', // gem center
      '0112222110',
      '.01122110.',
      '..011110..',
      '...0000...', ],
  },
  ring: {       // Ring: clear band + prominent gem on top
    w: 10, h: 10,
    palette: ['#1a1008','#b89020','#ffd040','#ff4488'],
    rows: [
      '....0220..',  // gem
      '...022220.',
      '..02.3.220', // gem + highlight
      '..022.220.',
      '.0......0.',  // band sides
      '0..0000..0',
      '0.0....0.0', // band
      '.0......0.',
      '..000000..',
      '..........', ],
  },

  // ── WEAPONS ─────────────────────────────────────────────────────────────
  bow: {        // Bow: clear D-curve, visible string
    w: 10, h: 10,
    palette: ['#1a1008','#6a3e10','#c09060','#d8d8d8'],
    rows: [
      '..00....3.', // tip + string
      '.0110...3.',
      '011110..3.',
      '0111110.3.',
      '01111103..',
      '0111110.3.',
      '011110..3.',
      '.0110...3.',
      '..00....3.',
      '..........', ],
  },
  quiver: {     // Quiver: visible arrow shafts + flights
    w: 10, h: 10,
    palette: ['#1a1008','#5a3010','#b87828','#c8c880'],
    rows: [
      '.3.33.3.0.',  // arrow flights (gold)
      '.1.11.1.0.',  // shafts
      '0111111110',  // quiver top
      '0111111110',
      '0112111210',  // texture
      '0112111210',
      '0111111110',
      '0111111110',
      '.011111100',  // closed bottom
      '..........', ],
  },
  sword: {      // Sword: diagonal from top-right to bottom-left, clear guard
    w: 10, h: 10,
    palette: ['#1a1008','#c0c8d8','#e8f0ff','#d0a820'],
    rows: [
      '.......001',  // tip
      '......0110',
      '.....01100',
      '....011000',
      '..33011000',  // crossguard (gold)
      '3300.11000',  // guard extends
      '0..0.11000',  // grip
      '0....01100',  // grip
      '.....0.000',  // pommel
      '..........', ],
  },
  axe: {        // Axe: large crescent blade upper-right + handle going down-left
    w: 10, h: 10,
    palette: ['#1a1008','#c0b8a8','#e0d8c8','#6a4820'],
    rows: [
      '.....00000',  // blade top
      '....011110',  // blade
      '...0111110',
      '..01111110',  // blade wide
      '..01111110',
      '..01113.00',  // blade + handle join
      '..0.0.3...',
      '.....03...',  // handle
      '.....030..',
      '.....0....',  ],
  },
  dagger: {     // Dagger: short compact blade, T crossguard, round pommel
    w: 10, h: 10,
    palette: ['#1a1008','#c0c8d8','#e8f0ff','#d0a820'],
    rows: [
      '......001.',  // tip
      '.....01120',
      '....011200',
      '...011200.',
      '..33..000.',  // crossguard (gold)
      '33.....0..',
      '0.......0.',  // grip
      '.0.....0..',  // grip
      '..00000...',  // round pommel
      '..........', ],
  },
  staff: {      // Staff: large glowing orb top, long straight shaft
    w: 10, h: 10,
    palette: ['#1a1008','#3a2808','#99bbff','#ddeeff'],
    rows: [
      '...02220..',  // orb
      '..0222220.',
      '.03222230.',  // orb with highlights
      '.02222220.',
      '..0222220.',
      '...02220..',  // orb bottom
      '....010...',  // shaft
      '....010...',
      '....010...',
      '....010...', ],
  },
  wand: {       // Wand: gem tip + thin tapered handle
    w: 10, h: 10,
    palette: ['#1a1008','#5a2808','#ff66ff','#ffaaff'],
    rows: [
      '...02220..',  // gem
      '..022320..',  // gem highlight
      '...02220..',
      '....010...',  // neck
      '....010...',  // handle
      '....010...',
      '....010...',
      '....010...',
      '.........',
      '..........', ],
  },
  mace: {       // Mace: spiky ball head + thick handle
    w: 10, h: 10,
    palette: ['#1a1008','#b0a890','#d8d0b8','#c8a020'],
    rows: [
      '....010...',  // spike top
      '..0.010.0.',  // side spikes
      '..0111110.',  // head
      '.011111110',  // head wide
      '.011111110',
      '..0111110.',  // head bottom
      '..0.010.0.',  // side spikes
      '....030...',  // neck (gold band)
      '....010...',  // handle
      '....010...', ],
  },

  // ── OFF-HANDS ────────────────────────────────────────────────────────────
  shield: {     // Shield: heater shape, cross emblem
    w: 10, h: 10,
    palette: ['#1a1008','#4a4840','#909098','#d0a820'],
    rows: [
      '0111111110',  // top edge
      '0122222210',
      '0122222210',
      '0123332210',  // cross arm (gold)
      '0123332210',
      '0123332210',  // cross arm
      '.012222100',
      '..0122100.',  // taper
      '...01100..',
      '....000...', ],
  },
  orb: {        // Orb: glowing sphere with inner light
    w: 10, h: 10,
    palette: ['#1a1008','#2a1448','#9966ee','#ddaaff'],
    rows: [
      '...01110..',  // top
      '..0122210.',
      '.012333210',  // bright inner glow
      '0123333210',  // center
      '0123333210',
      '.012333210',
      '.012222210',
      '..0122210.',
      '...01110..',
      '..........', ],
  },
};
// ============================================================
// ENEMY SPRITES — biome-themed palettes
// ============================================================
// Sized roughly the same as the player (10×12-14) so combat reads cleanly
// at 2x render scale. Rat is smaller; Yeti is bigger.

// --- CRYPT biome -------------------------------------------------

const SPRITE_SKELETON = {
  w: 10, h: 13,
  // 0=outline 1=bone-shadow 2=bone 3=bone-light 4=eye-glow(red)
  // 5=ribs-shadow 6=teeth-bright
  palette: [
    '#1a0e08', '#9a9080', '#d8d0b0', '#f0e8c8',
    '#ff3030', '#7a7060', '#fffae0',
  ],
  rows: [
    '...0000...',  //  0  skull top
    '..022220..',  //  1  skull
    '.02333320.',  //  2  forehead
    '.02400420.',  //  3  eye sockets (red glow)
    '.02233320.',  //  4  cheekbones
    '..0666660.',  //  5  teeth row
    '...0220...',  //  6  neck
    '.02222220.',  //  7  collarbone
    '0233333320',  //  8  ribs upper
    '0255555520',  //  9  ribs (shaded)
    '0233333320',  // 10  ribs lower
    '.02....20.',  // 11  pelvis / legs
    '.02....20.',  // 12  legs
  ],
};

const SPRITE_ZOMBIE = {
  w: 10, h: 13,
  // 0=outline 1=flesh-shadow 2=flesh 3=flesh-highlight 4=blood
  // 5=rag-dark 6=rag 7=eye(yellow) 8=wound
  palette: [
    '#1a0e08', '#4a5a30', '#6a8a4a', '#a0c060',
    '#aa1010', '#2a2515', '#4a4030', '#ffff40',
    '#2a4020',
  ],
  rows: [
    '..02220...',  //  0  hair / top
    '.0233320..',  //  1  head top
    '.0273720..',  //  2  eyes (yellow)
    '.0222220..',  //  3  cheeks
    '.0244420..',  //  4  bloody mouth
    '..02220...',  //  5  chin
    '.05666650.',  //  6  shoulders rags
    '0566666650',  //  7  torso
    '0586666850',  //  8  torso with wounds
    '0566666650',  //  9  belt area
    '.05666650.',  // 10  hips
    '.02....20.',  // 11  legs
    '.02....20.',  // 12  legs
  ],
};

const SPRITE_RAT = {
  w: 11, h: 8,
  // 0=outline 1=fur-shadow 2=fur 3=fur-highlight 4=eye(red) 5=tail
  palette: [
    '#1a0e08', '#3a2a18', '#6b5034', '#8a6840',
    '#ff3030', '#4a3a20',
  ],
  rows: [
    '....00.....',  // 0  ears
    '..0220.....',  // 1  ear/head
    '.0232400...',  // 2  head + eye
    '02333322000',  // 3  body
    '02333333355',  // 4  body + tail
    '02333333200',  // 5  belly + tail tip
    '.02..2.....',  // 6  legs
    '..0..0.....',  // 7  feet
  ],
};

// --- TUNDRA biome -----------------------------------------------

const SPRITE_YETI = {
  w: 14, h: 16,
  // 0=outline 1=fur-shadow 2=fur 3=fur-highlight 4=ice(blue)
  // 5=mouth-dark 6=eye-glow 7=tooth
  palette: [
    '#1a0e08', '#8aa0b0', '#d8e8f0', '#ffffff',
    '#5599ff', '#3a2020', '#aaccff', '#fff0e0',
  ],
  rows: [
    '....000000....',  //  0  head top
    '...02333320...',  //  1
    '..0233333320..',  //  2
    '..0233333320..',  //  3  upper face
    '..0263333620..',  //  4  eyes (blue glow)
    '..0233553320..',  //  5  mouth shadow
    '..0237337320..',  //  6  teeth
    '..0233333320..',  //  7  jaw
    '.022222222220.',  //  8  shoulders fur
    '0233333333320.',  //  9  chest
    '0233344433320.',  // 10  chest with ice patch
    '0233333333320.',  // 11  belly
    '0223333333220.',  // 12  hips
    '.022......220.',  // 13  legs / arms
    '.022......220.',  // 14  legs
    '..00......00..',  // 15  feet
  ],
};

const SPRITE_FROSTWOLF = {
  w: 14, h: 9,
  // 0=outline 1=fur-shadow 2=fur 3=fur-highlight 4=eye(blue) 5=fang
  palette: [
    '#1a0e08', '#557080', '#88aac0', '#bbdde8',
    '#3366ff', '#ffffff',
  ],
  rows: [
    '..00..........',  //  0  ear
    '.0220.........',  //  1  ear
    '023240........',  //  2  head + eye
    '02233320......',  //  3  head front + fang (5)
    '02333333322000',  //  4  body
    '02333333333335',  //  5  back + tail tip
    '02333333333320',  //  6  belly + tail
    '.02..02..02...',  //  7  legs
    '..0...0...0...',  //  8  feet
  ],
};

// --- INFERNO biome ----------------------------------------------

const SPRITE_IMP = {
  w: 11, h: 11,
  // 0=outline 1=skin-shadow 2=skin(red) 3=skin-highlight 4=horn-shadow
  // 5=horn 6=eye(yellow) 7=wing 8=fang
  palette: [
    '#1a0e08', '#7a1010', '#cc2020', '#ff4030',
    '#4a2010', '#aa6020', '#ffff20', '#3a1a1a',
    '#fff0e0',
  ],
  rows: [
    '.05...05...',  //  0  horns
    '.055.055...',  //  1  horns
    '..0222200..',  //  2  head
    '.02333320..',  //  3  forehead
    '.02060620..',  //  4  yellow eyes
    '.02238820..',  //  5  mouth + fangs
    '70222220007',  //  6  wings flanking shoulders
    '70222222207',  //  7  shoulders
    '.02222220..',  //  8  body
    '..02..20...',  //  9  legs
    '..00..00...',  // 10  feet
  ],
};

const SPRITE_HELLHOUND = {
  w: 14, h: 9,
  // 0=outline 1=fur-shadow 2=fur(dark) 3=ember(orange) 4=eye(red) 5=fang
  // 6=mane(fire)
  palette: [
    '#1a0e08', '#2a0808', '#3a1010', '#ff5520',
    '#ff2020', '#fffae0', '#ff8800',
  ],
  rows: [
    '.06...........',  //  0  mane tuft
    '06606.........',  //  1  mane
    '0224000.......',  //  2  head + red eye
    '0226662222000.',  //  3  mane along neck/back
    '0222333333330.',  //  4  body
    '0223333333335.',  //  5  body + tail
    '0222223333220.',  //  6  belly
    '.02.02.02.02..',  //  7  legs
    '..0..0..0..0..',  //  8  feet
  ],
};

// --- VOID biome -------------------------------------------------

const SPRITE_SHADOW = {
  w: 10, h: 14,
  // 0=outline(dark) 1=body-dark 2=body-mid 3=body-light 4=eye(violet glow)
  // 5=eye-core(white) 6=wisp
  palette: [
    '#1a0a2a', '#2a1a4a', '#5533aa', '#aa66ff',
    '#dd99ff', '#ffffff', '#7a4ac0',
  ],
  rows: [
    '...0660...',  //  0  wispy crown
    '..066660..',  //  1  hood top
    '.06333360.',  //  2  hood
    '.06322360.',  //  3  hood
    '.06405460.',  //  4  eyes (4=glow, 5=core)
    '.06322360.',  //  5  cheeks
    '.06322260.',  //  6  chin
    '0622222220',  //  7  shoulders
    '0211111110',  //  8  body
    '0211111110',  //  9  body
    '0211111110',  // 10  body
    '0621111160',  // 11  body fade
    '.062.660..',  // 12  body wisp
    '..06.06...',  // 13  trailing wisps
  ],
};

const SPRITE_VOIDCASTER = {
  w: 11, h: 14,
  // 0=outline 1=hood-dark 2=hood 3=hood-light 4=face-shadow 5=eye-glow
  // 6=robe-trim(gold)
  palette: [
    '#1a0e2a', '#2a1a4a', '#5533aa', '#aa66ff',
    '#1a0a1a', '#ff60ff', '#ffd040',
  ],
  rows: [
    '...0000....',  //  0  hood top
    '..033330...',  //  1  hood
    '.03333330..',  //  2  hood sides
    '.04555540..',  //  3  shadowed face + eyes
    '.04444440..',  //  4  shadow
    '.03333330..',  //  5  hood lower
    '.02333320..',  //  6  shoulders
    '.02333320..',  //  7  robe
    '.02666620..',  //  8  belt trim (gold)
    '.02333320..',  //  9  robe
    '.02333320..',  // 10  robe
    '.02333320..',  // 11  robe lower
    '.02....20..',  // 12  hem
    '.02....20..',  // 13  hem
  ],
};
// Note: the floating purple orb is drawn separately in entities.js
// at an animated y position so the staff appears to bob.

const ENEMY_SPRITES = {
  skeleton:   SPRITE_SKELETON,
  zombie:     SPRITE_ZOMBIE,
  rat:        SPRITE_RAT,
  yeti:       SPRITE_YETI,
  frostWolf:  SPRITE_FROSTWOLF,
  imp:        SPRITE_IMP,
  hellhound:  SPRITE_HELLHOUND,
  shadow:     SPRITE_SHADOW,
  voidCaster: SPRITE_VOIDCASTER,
};

// ============================================================
// BOSS SPRITES — bigger silhouettes per biome
// ============================================================
// Bosses are 18-22 wide, 22-24 tall. They render with scale=2 like
// other entities so the final on-screen size is ~36-44 internal px wide.

// --- Wave 5: BoneLord (Crypt) ----------------------------------
// Crowned skeleton king with red eyes, gold crown, dark cape.
const SPRITE_BONELORD = {
  w: 20, h: 22,
  // 0=outline 1=bone-shadow 2=bone 3=bone-light 4=eye-glow(red)
  // 5=cape-dark 6=cape 7=crown-gold 8=crown-bright 9=teeth
  palette: [
    '#1a0e08', '#9a9080', '#d8d0b0', '#f0e8c8',
    '#ff2020', '#2a1a25', '#4a2a3a', '#aa7820',
    '#ffd040', '#fffae0',
  ],
  rows: [
    '.......0707070......',  //  0  crown spike tips
    '......077787770.....',  //  1  crown spikes
    '......088888880.....',  //  2  crown band
    '......077777770.....',  //  3  crown base
    '......022222220.....',  //  4  skull top
    '.....02333333320....',  //  5  forehead
    '.....02333333320....',  //  6  skull
    '.....02400440020....',  //  7  red glowing eyes
    '.....02333333320....',  //  8  cheekbones
    '......02222222 0....',  //  9  jaw
    '......0099999000....',  // 10  teeth row
    '.....055566655550...',  // 11  cape shoulders
    '....05566333366550..',  // 12  cape + chest
    '....05663222336650..',  // 13  cape + ribs
    '....05663333336650..',  // 14  cape + ribs
    '....05663222336650..',  // 15  cape + ribs
    '....05566333366550..',  // 16  cape + waist
    '.....0556666665550..',  // 17  cape narrowing
    '......055555555.....',  // 18  cape bottom
    '.......03.....30....',  // 19  legs
    '.......03.....30....',  // 20  legs
    '.......00.....00....',  // 21  feet
  ],
};
// Fix row 9 stray space, row 10 fewer-9s pad
SPRITE_BONELORD.rows[9]  = '......0222222200....';
SPRITE_BONELORD.rows[10] = '.......09999990.....';

// --- Wave 10: IceGiant (Tundra) --------------------------------
// Massive hulking ice creature. Ice shard horns on top.
const SPRITE_ICEGIANT = {
  w: 22, h: 24,
  // 0=outline 1=fur-shadow 2=fur 3=fur-light 4=ice(blue) 5=ice-bright
  // 6=eye-glow(bright-blue) 7=mouth-dark 8=tooth
  palette: [
    '#1a0e08', '#7a90a0', '#c8dde8', '#f0faff',
    '#4477cc', '#88bbff', '#aaccff', '#1a0e1a',
    '#fff0e0',
  ],
  rows: [
    '.........044.0440.....',  //  0  ice horn tips
    '........04540454......',  //  1  horns
    '........05450545......',  //  2  horns
    '........044040440.....',  //  3  horn bases
    '.......0233333320.....',  //  4  head top
    '......023333333320....',  //  5  head
    '......023333333320....',  //  6  head
    '......026303330360....',  //  7  blue glowing eyes
    '......023333333320....',  //  8  cheeks
    '......023377773320....',  //  9  mouth shadow
    '......023378873320....',  // 10  teeth
    '......023333333320....',  // 11  chin
    '.....02333333333320...',  // 12  shoulders fur
    '....023333333333320...',  // 13  chest
    '....023334444433320...',  // 14  ice patch on chest
    '....023344555443320...',  // 15  ice highlight
    '....023333444333320...',  // 16  ice patch
    '....023333333333320...',  // 17  belly
    '....023333333333320...',  // 18  hips
    '.....022222222220.....',  // 19  hip line
    '.....022.......020....',  // 20  legs gap
    '....0222.......0220...',  // 21  legs
    '....0222.......0220...',  // 22  legs
    '....00...........00...',  // 23  feet
  ],
};

// --- Wave 15: Pyromancer (Inferno) -----------------------------
// Red-robed fire mage with a flame burning above the hood, holding
// a flaming orb/staff. Phase-relevant feel: hostile and bright.
const SPRITE_PYROMANCER = {
  w: 18, h: 22,
  // 0=outline 1=skin-shadow 2=robe-dark 3=robe 4=robe-light
  // 5=flame-yellow 6=flame-orange 7=flame-red 8=eye-yellow 9=belt-gold
  palette: [
    '#1a0e08', '#5a1010', '#7a1010', '#cc2020',
    '#ff4030', '#ffdd00', '#ff8800', '#ff3010',
    '#ffff60', '#ffd040',
  ],
  rows: [
    '........5.........',  //  0  flame tip
    '.......555........',  //  1  flame
    '......57575.......',  //  2  flame
    '......56565.......',  //  3  flame mid
    '.....0676767 0....',  //  4  flame base
    '.....076666670....',  //  5  flame in hood
    '.....032222230....',  //  6  hood top
    '....03333333330...',  //  7  hood
    '....03388888330...',  //  8  eye/face shadow + yellow eyes
    '....03333333330...',  //  9  face
    '....02333333320...',  // 10  hood sides
    '...0233333333320..',  // 11  shoulders
    '..023333344433320.',  // 12  robe with highlight
    '..023333333333320.',  // 13  robe
    '..029999999999920.',  // 14  belt trim (gold)
    '..023333333333320.',  // 15  robe
    '..023333333333320.',  // 16  robe lower
    '...02333333333320.',  // 17  robe
    '....023333333320..',  // 18  robe narrowing
    '.....0233333320...',  // 19  hem
    '.....02......20...',  // 20  feet area
    '.....00......00...',  // 21  feet
  ],
};
// Tidy row 4 (had stray space)
SPRITE_PYROMANCER.rows[4] = '.....0676767 0....';
SPRITE_PYROMANCER.rows[4] = '.....06767670.....';

// --- Wave 20: SlayerKiller (Void) ------------------------------
// Tall void figure with wispy form. Eye color overridden at draw
// time based on phase (1=violet, 2=magenta, 3=hot-pink/red).
const SPRITE_SLAYERKILLER = {
  w: 20, h: 24,
  // 0=outline 1=body-dark 2=body 3=body-light 4=eye-glow(violet base)
  // 5=eye-core(white) 6=wisp 7=hood-trim 8=accent-dark 9=void-energy
  palette: [
    '#1a0a2a', '#1a0a3a', '#3a1a5a', '#5533aa',
    '#aa66ff', '#ffffff', '#7a4ac0', '#ddaaff',
    '#0a0a1a', '#aa66ff',
  ],
  rows: [
    '......0666660.......',  //  0  wisp crown
    '.....06666666 0.....',  //  1  wisps
    '....06322222 360....',  //  2  hood top
    '...063322 223360....',  //  3  hood
    '...063322 223360....',  //  4  hood
    '...0633 22 23360....',  //  5  face shadow
    '...06345 5 543 60...',  //  6  eyes with white cores
    '...06322 222 360....',  //  7  cheeks
    '...06322 222 360....',  //  8  chin
    '...06777777777 60...',  //  9  hood collar (light)
    '...06222222222 60...',  // 10  shoulders
    '...0612222222 1 60..',  // 11  body
    '...061222222221 60..',  // 12  body
    '...061222222221 60..',  // 13  body
    '...061222 22221 60..',  // 14  body
    '...061222 22221 60..',  // 15  body
    '...061222 22221 60..',  // 16  body
    '...066222222266600..',  // 17  body lower
    '..0666222226666660..',  // 18  body fades to wisps
    '.0666.....06666660..',  // 19  trailing wisps
    '06666.......06666...',  // 20  wisps
    '0666.........666....',  // 21  wisps
    '060...........0.....',  // 22  wisps
    '.....................'   // 23  bottom (empty)
  ],
};
// SlayerKiller rows had stray spaces from designing; normalize them
SPRITE_SLAYERKILLER.rows[1]  = '.....066666660......';
SPRITE_SLAYERKILLER.rows[2]  = '....063222222360....';
SPRITE_SLAYERKILLER.rows[3]  = '...06322222223360...';
SPRITE_SLAYERKILLER.rows[4]  = '...06322222223360...';
SPRITE_SLAYERKILLER.rows[5]  = '...06322222223360...';
SPRITE_SLAYERKILLER.rows[6]  = '...06322402240360...';  // two distinct eyes at cols 8,12
SPRITE_SLAYERKILLER.rows[7]  = '...06322222223360...';
SPRITE_SLAYERKILLER.rows[8]  = '...06322222223360...';
SPRITE_SLAYERKILLER.rows[9]  = '...06777777777360...';
SPRITE_SLAYERKILLER.rows[10] = '...06222222222360...';
SPRITE_SLAYERKILLER.rows[11] = '...06122222222160...';
SPRITE_SLAYERKILLER.rows[12] = '...06122222222160...';
SPRITE_SLAYERKILLER.rows[13] = '...06122222222160...';
SPRITE_SLAYERKILLER.rows[14] = '...06122222222160...';
SPRITE_SLAYERKILLER.rows[15] = '...06122222222160...';
SPRITE_SLAYERKILLER.rows[16] = '...06122222222160...';
SPRITE_SLAYERKILLER.rows[17] = '...06622222222660...';
SPRITE_SLAYERKILLER.rows[18] = '..0666222222266660..';
SPRITE_SLAYERKILLER.rows[19] = '.0666.....06666660..';
SPRITE_SLAYERKILLER.rows[20] = '06660........066600.';
SPRITE_SLAYERKILLER.rows[21] = '0660..........066...';
SPRITE_SLAYERKILLER.rows[22] = '.0.............0....';
SPRITE_SLAYERKILLER.rows[23] = '....................';


// ============================================================
// NPC SPRITES — Hub screen characters.
// All 10×14 like the player sprites; drawn at scale=2 in drawHubScreen.
// ============================================================

const SPRITE_NPC_BLACKSMITH = {
  w: 10, h: 14,
  // 0=outline 1=skin-dk 2=skin 3=beard/hair-dk
  // 4=apron-dk 5=apron-mid 6=hammer-wood 7=hammer-metal
  // 8=leather-shirt 9=fire-orange
  palette: [
    '#1a0e08', '#8a5030', '#c07848', '#2a1005',
    '#6a3010', '#a05030', '#7a6858', '#c0b8a8',
    '#d06030', '#ff8800',
  ],
  rows: [
    '..03330...',  // 0  hair
    '.0322230..',  // 1  head/hair
    '.0302030..',  // 2  eyes (0=dark pupils)
    '.0322230..',  // 3  face
    '.0333330..',  // 4  full beard
    '0085558500',  // 5  wide shoulders (8=leather, 5=apron-mid)
    '0085558500',  // 6  upper body
    '0085558560',  // 7  body + hammer shaft (6=wood at col 8)
    '0085558577',  // 8  hammer head (7=metal at cols 8-9)
    '0084448500',  // 9  lower body (4=apron-dk belt)
    '0084448500',  // 10 lower
    '.0404040..',  // 11 legs
    '.0404040..',  // 12 legs
    '.0808080..',  // 13 boots
  ],
};

const SPRITE_NPC_JEWELER = {
  w: 10, h: 14,
  // 0=outline 1=skin-dk 2=skin 3=hat/robe-dk-purple
  // 4=hat-mid-purple 5=robe-lt-purple 6=gem-blue 7=gem-glow
  // 8=gold-chain/monocle 9=accent
  palette: [
    '#1a0a18', '#8a5030', '#c07848', '#3a2070',
    '#6644aa', '#9966dd', '#44aaff', '#88ccff',
    '#ffdd00', '#cc44cc',
  ],
  rows: [
    '.....4....',  // 0  hat tip (1px)
    '....0440..',  // 1  hat upper
    '...04440..',  // 2  hat
    '..044440..',  // 3  hat brim
    '.0322230..',  // 4  face
    '.0302030..',  // 5  eyes
    '.0322830..',  // 6  face + gold monocle (8=gold at col 5)
    '.0355530..',  // 7  collar
    '.0355530..',  // 8  slim robe body
    '.0356530..',  // 9  body + gem (6=blue)
    '.0357530..',  // 10 gem highlight (7=bright blue)
    '.0355530..',  // 11 lower robe
    '.0355530..',  // 12 lower robe
    '.0353530..',  // 13 robe hem/boots
  ],
};

const SPRITE_NPC_STASH = {
  w: 10, h: 14,
  // 0=outline 1=armor-dk 2=armor-mid 3=armor-lt
  // 4=hood-dk-blue 5=hood-mid-blue 6=chain-mail 7=metal-shine
  // 8=gold-trim 9=red-eyes
  palette: [
    '#101020', '#303848', '#506070', '#8090a8',
    '#2030a0', '#4060d0', '#c0c8d8', '#e8f0ff',
    '#ffd040', '#cc2020',
  ],
  rows: [
    '...04440..',  // 0  hood top
    '..044440..',  // 1  hood upper
    '..044440..',  // 2  hood (face fully shadowed)
    '..049940..',  // 3  glowing red eyes (9) under hood
    '..044440..',  // 4  lower hood shadow
    '.0323230..',  // 5  armored shoulders (3=light, 2=mid)
    '.0226220..',  // 6  chest (6=chain-mail center)
    '0023662200',  // 7  wider chest plate
    '0023662200',  // 8  armor torso
    '0023882200',  // 9  gold trim (8=gold at cols 4-5)
    '0023662200',  // 10 lower armor
    '.0202020..',  // 11 greaves (plated legs)
    '.0202020..',  // 12 greaves
    '.0606060..',  // 13 sabatons/boots
  ],
};

const SPRITE_NPC_SHOPKEEPER = {
  w: 10, h: 14,
  // 0=outline 1=skin-dk 2=skin 3=hat-dk-brown
  // 4=hat-mid-brown 5=hat-lt-tan 6=cloth-dk 7=cloth-mid
  // 8=gold-coin 9=red-vest-accent
  palette: [
    '#1a0e08', '#8a5030', '#c07848', '#3a2008',
    '#7a5020', '#b07828', '#6a4018', '#9a6830',
    '#ffd040', '#cc4040',
  ],
  rows: [
    '0044444400',  // 0  wide merchant hat brim (edge to edge)
    '..044440..',  // 1  hat crown
    '..044440..',  // 2  hat crown
    '...0440...',  // 3  hat top
    '.0322230..',  // 4  face
    '.0302030..',  // 5  eyes
    '.0322230..',  // 6  face (cheeks)
    '.0329930..',  // 7  smile (9=red mouth, 2px)
    '.0677670..',  // 8  collar/vest
    '.0677870..',  // 9  vest + coin (8=gold at col 5)
    '.0678870..',  // 10 more coin (big fat gold piece)
    '.0677670..',  // 11 lower body
    '.0677670..',  // 12 lower body
    '.0737070..',  // 13 boots
  ],
};

const NPC_SPRITES = {
  blacksmith: SPRITE_NPC_BLACKSMITH,
  jeweler:    SPRITE_NPC_JEWELER,
  stash:      SPRITE_NPC_STASH,
  shop:       SPRITE_NPC_SHOPKEEPER,
};

const BOSS_SPRITES = {
  BoneLord:     SPRITE_BONELORD,
  IceGiant:     SPRITE_ICEGIANT,
  Pyromancer:   SPRITE_PYROMANCER,
  SlayerKiller: SPRITE_SLAYERKILLER,
};


// ============================================================
// BERSERKER ANIMATED SPRITE — Local PixelLab PNG frames
// Assets/Berserker_Berserker_warrior_in_heavy_full/animations/
//   {animFolder}/{direction}/frame_NNN.png
// 8-direction: direction chosen from player velocity each frame.
// Attack has no NE/NW dirs — NE falls back to E, NW to W.
// ============================================================
const BERSERKER_DRAW_SIZE = 80; // logical px (tune to taste)

const _BERK_BASE = 'Assets/Berserker_Berserker_warrior_in_heavy_full/animations/';
const _BERK_IDLE_MAIN = 'Heavy_armored_berserker_standing_still_with_subtle-519bbda5';
const _BERK_IDLE_NE   = 'Heavy_armored_berserker_standing_still_with_subtle-92f9a4a2';
const _BERK_RUN_MAIN  = 'Heavy_armored_berserker_running_with_massive_axe_b-cbf68ed2';
const _BERK_RUN_NE    = 'Heavy_armored_berserker_running_with_massive_axe_b-1f72a7ea';
const _BERK_ATK       = 'Berserker_axe_attack_frame_1_wind-up_with_axe_pull-458fd81a';

// { animState: { fps, loop, dirs: { dirName: { folder, count, useDir? } } } }
const BERSERKER_ANIM_DEF = {
  idle: {
    fps: 4, loop: true,
    dirs: {
      'east':       { folder: _BERK_IDLE_MAIN, count: 4 },
      'north-east': { folder: _BERK_IDLE_NE,   count: 4 },
      'north':      { folder: _BERK_IDLE_MAIN, count: 4 },
      'north-west': { folder: _BERK_IDLE_MAIN, count: 4 },
      'west':       { folder: _BERK_IDLE_MAIN, count: 4 },
      'south-west': { folder: _BERK_IDLE_MAIN, count: 4 },
      'south':      { folder: _BERK_IDLE_MAIN, count: 4 },
      'south-east': { folder: _BERK_IDLE_MAIN, count: 4 },
    },
  },
  run: {
    fps: 8, loop: true,
    dirs: {
      'east':       { folder: _BERK_RUN_MAIN, count: 4 },
      'north-east': { folder: _BERK_RUN_NE,   count: 4 },
      'north':      { folder: _BERK_RUN_MAIN, count: 4 },
      'north-west': { folder: _BERK_RUN_MAIN, count: 4 },
      'west':       { folder: _BERK_RUN_MAIN, count: 4 },
      'south-west': { folder: _BERK_RUN_MAIN, count: 4 },
      'south':      { folder: _BERK_RUN_MAIN, count: 4 },
      'south-east': { folder: _BERK_RUN_MAIN, count: 4 },
    },
  },
  attack: {
    fps: 12, loop: false,
    // NE not in source → use east frames; NW not in source → use west frames
    dirs: {
      'east':       { folder: _BERK_ATK, count: 5 },
      'north-east': { folder: _BERK_ATK, count: 5, useDir: 'east' },
      'north':      { folder: _BERK_ATK, count: 5 },
      'north-west': { folder: _BERK_ATK, count: 5, useDir: 'west' },
      'west':       { folder: _BERK_ATK, count: 5 },
      'south-west': { folder: _BERK_ATK, count: 5 },
      'south':      { folder: _BERK_ATK, count: 5 },
      'south-east': { folder: _BERK_ATK, count: 5 },
    },
  },
};


// _berkFrames[animState][dirName][frameIdx] = HTMLImageElement
// Images are deduplicated by path — fallback dirs reuse the same Image objects.
const _berkFrames = {};
let _berkTotalFrames = 0, _berkLoadedFrames = 0;
let _berkReady = false;

(function _loadBerserkerFrames() {
  const cache = new Map(); // path -> Image, prevents loading the same PNG twice
  for (const [animName, animDef] of Object.entries(BERSERKER_ANIM_DEF)) {
    _berkFrames[animName] = {};
    for (const [dirName, dirCfg] of Object.entries(animDef.dirs)) {
      const realDir = dirCfg.useDir || dirName;
      const frames  = [];
      for (let i = 0; i < dirCfg.count; i++) {
        const pad  = String(i).padStart(3, '0');
        const src  = _BERK_BASE + dirCfg.folder + '/' + realDir + '/frame_' + pad + '.png';
        let img = cache.get(src);
        if (!img) {
          img = new Image();
          _berkTotalFrames++;
          img.onload  = () => { if (++_berkLoadedFrames >= _berkTotalFrames) _berkReady = true; };
          img.onerror = () => { _berkLoadedFrames++; };
          img.src = src;
          cache.set(src, img);
        }
        frames.push(img);
      }
      _berkFrames[animName][dirName] = frames;
    }
  }
})();

// Convert velocity vector to 8-way compass direction string.
// Returns null when stationary.
function _velToDir8(vx, vy) {
  if (Math.abs(vx) < 0.5 && Math.abs(vy) < 0.5) return null;
  const deg = ((Math.atan2(vy, vx) * 180 / Math.PI) + 360) % 360;
  const DIR8 = ['east','south-east','south','south-west','west','north-west','north','north-east'];
  return DIR8[Math.round(deg / 45) % 8];
}

class BerserkerAnimator {
  constructor() {
    this.state         = 'idle';
    this.frame         = 0;
    this.timer         = 0;
    this.dir           = 'south';
    this._attackLocked = false;
  }

  update(dt, isMoving, isAttacking, vx, vy) {
    const newDir = _velToDir8(vx || 0, vy || 0);
    if (newDir) this.dir = newDir;

    if (isAttacking && !this._attackLocked) {
      this.state = 'attack'; this.frame = 0; this.timer = 0;
      this._attackLocked = true;
    }

    const animDef    = BERSERKER_ANIM_DEF[this.state];
    const dirCfg     = animDef.dirs[this.dir];
    const frameCount = dirCfg ? dirCfg.count : 4;
    this.timer += dt;
    const frameDur = 1 / animDef.fps;
    while (this.timer >= frameDur) {
      this.timer -= frameDur;
      this.frame++;
      if (this.frame >= frameCount) {
        if (animDef.loop) {
          this.frame = 0;
        } else {
          this.frame = frameCount - 1;
          this._attackLocked = false;
        }
      }
    }

    if (this.state === 'attack' && !this._attackLocked) {
      this.state = isMoving ? 'run' : 'idle';
      this.frame = 0; this.timer = 0;
    }

    if (this.state !== 'attack') {
      const want = isMoving ? 'run' : 'idle';
      if (want !== this.state) {
        this.state = want; this.frame = 0; this.timer = 0;
      }
    }
  }

  draw(ctx, cx, cy, flash) {
    if (!_berkReady) return false;
    const dirFrames = _berkFrames[this.state] && _berkFrames[this.state][this.dir];
    if (!dirFrames) return false;
    const img = dirFrames[Math.min(this.frame, dirFrames.length - 1)];
    if (!img || !img.complete || img.naturalWidth === 0) return false;
    const s = BERSERKER_DRAW_SIZE;
    ctx.save();
    ctx.drawImage(img, cx - s / 2, cy - s / 2, s, s);
    if (flash) {
      ctx.filter = 'brightness(10) saturate(0)';
      ctx.globalAlpha = 0.75;
      ctx.drawImage(img, cx - s / 2, cy - s / 2, s, s);
      ctx.filter = 'none'; ctx.globalAlpha = 1;
    }
    ctx.restore();
    return true;
  }
}

// ============================================================
// CHAR RIG — procedural animated pixel-art characters (detailed).
// Code-driven skeleton with dark outlines, multi-tone shading,
// hands, flared robes, capes, and per-class signature details.
// 4-directional (down/up/side); animated idle + run + attack.
// Draws only with fillRect/fillStyle/globalAlpha so it runs in the
// browser AND in the offline PNG preview harness unchanged.
// API: drawCharacter(ctx, cx, cy, opts)
// ============================================================

const CLASS_RIGS = {
  ranger: {
    skin: '#c28030', skinSh: '#8a5a20', hair: '#3a2410', ol: '#0a1408',
    body: '#1f5a26', bodyLt: '#33843a', bodySh: '#123a18',
    belt: '#5a3a18', accent: '#ffd23f', boot: '#3a2a16',
    headgear: 'hood', hoodCol: '#1f5a26', back: 'quiver',
    feather: '#ffd23f', cloak: '#16401c', pauldron: '#4a3018', strap: true,
    weapon: 'bow', wpnMain: '#7a5320', wpnLt: '#b88a3c', wpnAcc: '#ffd23f', wpnStyle: 'bow',
  },
  sorcerer: {
    skin: '#d8c0a0', skinSh: '#a08868', hair: '#b8b8c8', ol: '#0a0820',
    body: '#2a1860', bodyLt: '#4326a0', bodySh: '#160a38', beard: '#d2d2e2',
    belt: '#c09020', accent: '#aaccff', boot: '#160a36', hem: '#1a0e48',
    headgear: 'wizhat', hatCol: '#2a1860', robe: true, emblem: 'star', glowEye: true, robeStar: '#aaccff',
    weapon: 'staff', wpnMain: '#6a4a28', wpnLt: '#9a7038', wpnAcc: '#aaccff', wpnStyle: 'cast',
  },
  assassin: {
    skin: '#c8a878', skinSh: '#90744a', hair: '#1a1024', ol: '#080610',
    body: '#33254a', bodyLt: '#5a4486', bodySh: '#1c1230',
    belt: '#241830', accent: '#cc88ff', boot: '#1c1230',
    headgear: 'hood', hoodCol: '#3a2a52', mask: true, glowEye: true, scarf: '#cc88ff', shoulderGuard: '#241636', straps: true,
    weapon: 'dagger', wpnMain: '#cfcfe0', wpnLt: '#ffffff', wpnAcc: '#cc88ff', wpnStyle: 'dagger',
  },
  templar: {
    skin: '#caa070', skinSh: '#946c40', hair: '#2a1a0e', ol: '#1a1006',
    body: '#dccc9e', bodyLt: '#f2e6bc', bodySh: '#aa9a64',
    belt: '#b06028', accent: '#ffcc66', boot: '#8a5020', sash: '#c0402a', hem: '#c2b282',
    headgear: 'bald', robe: true, beads: '#b06028', bare: true,
    weapon: 'bostaff', wpnMain: '#7a5028', wpnLt: '#b88a4a', wpnAcc: '#ffcc66', wpnStyle: 'bostaff',
  },
  crusader: {
    skin: '#d0a878', skinSh: '#9a7848', hair: '#5a3a18', ol: '#15171e',
    body: '#bcc4d2', bodyLt: '#eef2fa', bodySh: '#7c8492',
    belt: '#c8a020', accent: '#ffe866', boot: '#8088924', boot: '#788090',
    headgear: 'helm', helmCol: '#d2d8e2', cape: '#c01e2c', back: 'cape',
    emblem: 'cross', pauldron: '#e2e8f2', gorget: true, greaves: true,
    weapon: 'sword', wpnMain: '#dce0e8', wpnLt: '#ffffff', wpnAcc: '#ffe866', wpnStyle: 'sword',
  },
  druid: {
    skin: '#c89868', skinSh: '#947046', hair: '#4a6a2a', ol: '#10240e',
    body: '#4a6a32', bodyLt: '#71964a', bodySh: '#314a20',
    belt: '#6a4a28', accent: '#aaee66', boot: '#5a3a1c', hem: '#324c1c',
    headgear: 'antler', cape: '#3a5a24', robe: true, emblem: 'leaf', glowEye: true, leafShoulder: true,
    weapon: 'druidstaff', wpnMain: '#6a4a28', wpnLt: '#9a7038', wpnAcc: '#aaee66', wpnStyle: 'cast',
  },
  shaman: {
    skin: '#7a4a2a', skinSh: '#552f18', hair: '#1a1208', ol: '#0e1a08',
    body: '#3a6a2a', bodyLt: '#5aa040', bodySh: '#254a1c',
    belt: '#caa84a', accent: '#aaff44', boot: '#3a2a16', hem: '#2a4a18',
    headgear: 'mask', maskCol: '#caa84a', back: 'totem', robe: true, emblem: 'bone',
    warpaint: '#cc4422', necklace: true, grass: true,
    weapon: 'fetish', wpnMain: '#6a4a28', wpnLt: '#caa84a', wpnAcc: '#aaff44', wpnStyle: 'cast',
  },
  necromancer: {
    skin: '#c8c4cc', skinSh: '#928e98', hair: '#1a1426', ol: '#080610',
    body: '#2a1f3e', bodyLt: '#4a3868', bodySh: '#180f28',
    belt: '#7a6a9a', accent: '#ccbbee', boot: '#180f28', hem: '#1a1030',
    headgear: 'hood', hoodCol: '#221830', back: 'bonespikes', robe: true, emblem: 'skull',
    glowEye: true, tattered: true, bonePauldron: true,
    weapon: 'scythe', wpnMain: '#5a4a6a', wpnLt: '#8a7aa0', wpnAcc: '#ccbbee', wpnStyle: 'scythe',
  },
  amazonian: {
    skin: '#cc9460', skinSh: '#996840', hair: '#3a240e', ol: '#1a1006',
    body: '#9a5a2a', bodyLt: '#cc8442', bodySh: '#6e3e1c',
    belt: '#caa84a', accent: '#ddaa33', boot: '#7a4a22',
    headgear: 'ponytail', shield: true, emblem: 'chevron', warpaint: '#ddaa33',
    armband: true, pauldron: '#caa84a', braid: true,
    weapon: 'spear', wpnMain: '#8a6028', wpnLt: '#caa84a', wpnAcc: '#ddaa33', wpnStyle: 'spear',
  },
  druid_dragon: { form: 'dragon', ol: '#3a1208', body: '#c2462e', bodyLt: '#ee7446', bodySh: '#7e2818', belly: '#e8c060', accent: '#ffcc44', wing: '#8a2c1c', wingLt: '#b24024' },
  druid_panther:{ form: 'panther', ol: '#050409', body: '#221d2a', bodyLt: '#3c3448', bodySh: '#0c0a12', eye: '#cc88ff', accent: '#cc88ff' },
};

function rigDir4(dir8) {
  if (!dir8) return { dir: 'down', flip: false };
  switch (dir8) {
    case 'east':       return { dir: 'side', flip: false };
    case 'west':       return { dir: 'side', flip: true };
    case 'north':      return { dir: 'up',   flip: false };
    case 'south':      return { dir: 'down', flip: false };
    case 'north-east': return { dir: 'up',   flip: false };
    case 'north-west': return { dir: 'up',   flip: true };
    case 'south-east': return { dir: 'down', flip: false };
    case 'south-west': return { dir: 'down', flip: true };
    default:           return { dir: 'down', flip: false };
  }
}

function drawCharacter(ctx, cx, cy, o) {
  const rig = o.rig || CLASS_RIGS[o.classId];
  if (!rig) return;
  const s = o.s || 2;
  const flip = !!o.flip;
  const dir = o.dir || 'down';
  const state = o.state || 'idle';
  const t = o.t || 0;
  const aT = (o.attackT === undefined) ? -1 : o.attackT;
  const flash = !!o.flash;
  const OL = rig.ol || '#0a0712';

  function col(c) { return flash ? '#ffffff' : c; }
  function blk(ax, ay, aw, ah, c, alpha) {
    if (alpha !== undefined) ctx.globalAlpha = alpha;
    ctx.fillStyle = col(c);
    const x = flip ? (cx - (ax + aw) * s) : (cx + ax * s);
    ctx.fillRect(Math.round(x), Math.round(cy + ay * s), Math.max(1, Math.ceil(aw * s)), Math.max(1, Math.ceil(ah * s)));
    if (alpha !== undefined) ctx.globalAlpha = 1;
  }
  function disc(ax, ay, ar, c, alpha) {
    if (alpha !== undefined) ctx.globalAlpha = alpha;
    ctx.fillStyle = col(c);
    for (let dy = -Math.ceil(ar); dy <= Math.ceil(ar); dy++) {
      const dx = Math.sqrt(Math.max(0, ar * ar - dy * dy));
      if (dx <= 0) continue;
      const x0 = ax - dx, w = 2 * dx;
      const x = flip ? (cx - (x0 + w) * s) : (cx + x0 * s);
      ctx.fillRect(Math.round(x), Math.round(cy + (ay + dy) * s), Math.max(1, Math.ceil(w * s)), Math.max(1, Math.ceil(s)));
    }
    if (alpha !== undefined) ctx.globalAlpha = 1;
  }
  function bar(x0, y0, x1, y1, th, c, alpha) {
    const steps = Math.max(2, Math.ceil(Math.hypot(x1 - x0, y1 - y0)));
    for (let i = 0; i <= steps; i++) { const u = i / steps; disc(x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, th, c, alpha); }
  }
  // outlined limb + ball + hand
  function limb(x0, y0, x1, y1, th, c) { bar(x0, y0, x1, y1, th + 0.5, OL); bar(x0, y0, x1, y1, th, c); }
  function ball(ax, ay, ar, c) { disc(ax, ay, ar + 0.5, OL); disc(ax, ay, ar, c); }
  function hand(ax, ay) { ball(ax, ay, 0.95, rig.skin); }

  if (rig.form === 'dragon') { drawDragon(); return; }
  if (rig.form === 'panther') { drawPanther(); return; }

  const runF = 11;
  let bob, legPh, armPh, lean;
  if (state === 'run') {
    bob = Math.abs(Math.sin(t * runF)) * 1.3; legPh = Math.sin(t * runF); armPh = Math.sin(t * runF + Math.PI); lean = 1.4;
  } else if (state === 'attack') {
    bob = 0.3; legPh = 0; armPh = 0; lean = 1.0 + (aT >= 0 ? Math.sin(aT * Math.PI) * 1.2 : 0);
  } else {
    bob = Math.sin(t * 2.6) * 0.4 + 0.4; legPh = 0; armPh = Math.sin(t * 2.6) * 0.18; lean = 0;
  }
  const upY = -bob;
  const footY = 13;
  const hipY = 4 + upY * 0.3;
  const shY = -5 + upY;
  const headY = -11 + upY;
  const topX = lean * 0.5;

  // SHADOW
  ctx.globalAlpha = 0.30; ctx.fillStyle = '#000';
  const shW = 7 * s;
  ctx.fillRect(Math.round(cx - shW / 2), Math.round(cy + (footY + 0.5) * s), shW, Math.max(1, Math.round(1.3 * s)));
  ctx.globalAlpha = 1;

  // BACK ACCESSORY (behind everything)
  if (rig.back === 'quiver') { blk(-3.5, shY + 0.6, 1.8, 6.2, OL); blk(-3.3, shY + 0.8, 1.4, 5.8, '#3a2412'); for (let i = 0; i < 3; i++) { blk(-3.3 + i * 0.55, shY + 0.1, 0.5, 1.3, '#caa84a'); blk(-3.25 + i * 0.55, shY - 0.2, 0.4, 0.5, rig.accent); } }
  if (rig.back === 'bonespikes') { for (let i = 0; i < 5; i++) { const yy = shY - 0.5 + i * 1.5; bar(-2.2, yy + 0.8, -4.2 - i * 0.25, yy - 0.6, 0.8, OL); bar(-2.2, yy + 0.8, -4.2 - i * 0.25, yy - 0.6, 0.45, '#e8e2f2'); } }
  if (rig.back === 'totem') { blk(-3.9, shY - 1.4, 2.0, 8.4, OL); blk(-3.7, shY - 1.2, 1.6, 8.0, '#6a4a28'); disc(-2.9, shY - 1.0, 1.1, '#caa84a'); blk(-3.4, shY - 1.2, 0.5, 0.5, '#1a0e08'); blk(-2.7, shY - 1.2, 0.5, 0.5, '#1a0e08'); blk(-3.6, shY + 1.4, 1.4, 1.0, '#cc4422'); blk(-3.6, shY + 3.0, 1.4, 1.0, '#ffd23f'); blk(-3.6, shY + 4.4, 1.4, 1.0, rig.accent); }

  // CAPE (behind body)
  if (rig.cape && dir !== 'down') {
    const flow = state === 'run' ? Math.sin(t * runF) * 1.6 : Math.sin(t * 2.2) * 0.6;
    bar(-1, shY + 0.2, -2.8 - flow, hipY + 3, 2.7, OL);
    bar(-1, shY + 0.2, -2.6 - flow, hipY + 2.6, 2.3, rig.cape);
    bar(-2.6 - flow, hipY + 2.6, -2.2 - flow, footY - 0.5, 1.7, rig.cape);
    blk(-1.6, shY - 0.2, 1.2, 1.2, rig.accent, 0.9); // clasp
  } else if (rig.cape && dir === 'down') {
    blk(-4.5, shY + 0.4, 1.5, footY - shY - 1, OL);
    blk(3.0, shY + 0.4, 1.5, footY - shY - 1, OL);
    blk(-4.3, shY + 0.6, 1.1, footY - shY - 1.4, rig.cape);
    blk(3.2, shY + 0.6, 1.1, footY - shY - 1.4, rig.cape);
  }
  // short cloak (ranger)
  if (rig.cloak && dir !== 'down') {
    const flow = state === 'run' ? Math.sin(t * runF) * 1.2 : Math.sin(t * 2.4) * 0.4;
    bar(-1.4, shY + 0.4, -2.6 - flow, hipY + 1.5, 2.1, OL);
    bar(-1.4, shY + 0.4, -2.4 - flow, hipY + 1.2, 1.7, rig.cloak);
  }

  // BACK ARM
  const back = armPose(-1, armPh);
  limb(back.shX, shY + 0.5, (back.shX + back.hx) / 2, (shY + back.hy) / 2, 1.25, rig.bodySh);
  limb((back.shX + back.hx) / 2, (shY + back.hy) / 2, back.hx, back.hy, 1.1, rig.bodySh);
  if (!rig.robe || dir === 'side') hand(back.hx, back.hy);

  // LEGS or ROBE
  if (rig.robe) drawRobe();
  else {
    if (dir === 'side') { drawLeg(-1, -legPh, rig.bodySh); drawLeg(1, legPh, rig.body); }
    else { drawLeg(-1, legPh, rig.bodySh); drawLeg(1, -legPh, rig.body); }
  }

  // TORSO
  limb(0, hipY + 0.3, topX, shY + 0.5, 3.1, rig.body);
  // shading
  blk((flip ? 1.4 : -3.0) + topX * 0.4, shY, 1.3, hipY - shY + 0.6, rig.bodySh, 0.85);
  blk((flip ? -2.6 : 1.3) + topX * 0.4, shY + 0.4, 1.2, hipY - shY - 0.4, rig.bodyLt, 0.85);
  // belt
  if (!rig.robe || rig.bare) { blk(-3, hipY - 0.6, 6, 1.4, OL); blk(-2.7, hipY - 0.4, 5.4, 1.0, rig.belt); blk(-0.7, hipY - 0.5, 1.4, 1.2, rig.accent); }
  // straps / sash / beads
  if (rig.strap) { bar(-2.6, shY + 0.5, 2.4, hipY, 0.5, '#3a2412'); }
  if (rig.straps) { bar(-2.4, shY + 0.6, 2.2, hipY - 0.2, 0.45, '#140c1c'); bar(2.4, shY + 0.6, -2.2, hipY - 0.2, 0.45, '#140c1c'); }
  if (rig.sash) { blk(0.2, shY + 0.6, 1.4, hipY - shY + 1, rig.sash, 0.95); }
  if (rig.bare) { blk(-1.6, shY + 1, 3.2, 3.2, rig.skin); blk(-1.6, shY + 1, 1.0, 3.2, rig.skinSh, 0.5); } // bare chest
  if (rig.beads) { for (let i = 0; i < 4; i++) blk(-1.4 + i * 0.9, shY + 0.6, 0.6, 0.6, rig.beads); }
  if (rig.necklace) { for (let i = 0; i < 5; i++) blk(-1.8 + i * 0.8, shY + 0.4, 0.6, 0.7, '#e8e0d0'); }
  // chest emblem
  drawEmblem();

  // HEAD
  const hX = topX * 0.7;
  blk(hX - 0.7, shY - 1.4, 1.6, 1.6, rig.skinSh); // neck
  ball(hX, headY, 3.0, rig.skin);
  disc(hX + (flip ? 1.1 : -1.1), headY + 0.7, 1.9, rig.skinSh, 0.45); // jaw shade
  drawHead(hX, headY);

  // PAULDRONS (over shoulders)
  if (rig.pauldron) {
    ball(armPose(1, 0).shX, shY + 0.1, 1.6, rig.pauldron);
    if (dir !== 'side') ball(armPose(-1, 0).shX, shY + 0.1, 1.6, rig.pauldron);
  }
  if (rig.bonePauldron) {
    ball(armPose(1, 0).shX, shY, 1.5, '#d8d2e4'); bar(armPose(1, 0).shX, shY - 0.4, armPose(1, 0).shX + 0.8, shY - 2, 0.5, '#e8e2f2');
  }
  if (rig.shoulderGuard) { ball(armPose(1, 0).shX, shY + 0.1, 1.4, rig.shoulderGuard); }
  if (rig.leafShoulder) { for (let d2 = -1; d2 <= 1; d2 += 2) { if (dir === 'side' && d2 < 0) continue; blk(d2 * 2.4 - 0.5, shY - 0.4, 1.0, 0.8, rig.bodyLt); blk(d2 * 2.8 - 0.4, shY - 0.9, 0.7, 0.7, rig.accent); } }
  if (rig.armband) { blk(armPose(1, 0).shX - 0.8, shY + 1.6, 1.6, 0.7, rig.accent); }

  // FRONT ARM + WEAPON
  const fr = armPose(1, -armPh);
  const skinArm = rig.bare ? rig.skin : rig.bodyLt;
  limb(fr.shX, shY + 0.5, (fr.shX + fr.hx) / 2, (shY + fr.hy) / 2, 1.25, skinArm);
  limb((fr.shX + fr.hx) / 2, (shY + fr.hy) / 2, fr.hx, fr.hy, 1.1, rig.skin);
  hand(fr.hx, fr.hy);
  drawWeapon(fr.hx, fr.hy);

  // ---- inner helpers ----
  function armPose(front, swing) {
    const shX = front * (dir === 'side' ? 1.2 : 3.2) + lean * 0.3;
    let hx, hy;
    if (dir === 'side') {
      if (front > 0 && state === 'attack' && aT >= 0) { const sw = -0.9 + aT * 2.0; hx = shX + Math.cos(sw) * 6.5; hy = shY + 2 + Math.sin(sw) * 6.5; }
      else { hx = shX + 2.2 + swing * 1.6 + lean; hy = hipY + 1 + Math.abs(swing) * 0.5; }
    } else {
      hx = shX + front * 0.6; hy = hipY + 1 + swing * 1.2;
      if (front > 0 && state === 'attack' && aT >= 0) { hx = shX + 1.5; hy = shY + 1 + (1 - aT) * 4; }
    }
    return { shX, shY, hx, hy };
  }
  function drawLeg(side, ph, shade) {
    const hipX = side * 1.6;
    let footX, fY;
    if (dir === 'side') { footX = side * 1.2 + ph * 4; fY = footY - Math.max(0, ph * side) * 1.5; }
    else { footX = side * 2.0; fY = footY - Math.abs(ph) * (side > 0 ? 1.6 : 0); }
    const kneeX = (hipX + footX) / 2 + (dir === 'side' ? 0.6 : 0);
    const kneeY = (hipY + fY) / 2 + 0.6;
    limb(hipX, hipY, kneeX, kneeY, 1.45, shade);
    limb(kneeX, kneeY, footX, fY, 1.3, shade);
    if (rig.greaves) { blk(kneeX - 1.2, kneeY, 2.4, 2.4, rig.bodyLt, 0.9); }
    blk(footX - 1.7, fY - 0.4, 3.4, 1.8, OL);
    blk(footX - 1.5, fY - 0.3, 3.0, 1.4, rig.boot);
    blk(footX + (side > 0 ? 0.6 : -1.4), fY - 0.2, 0.8, 0.5, rig.skinSh, 0.4);
  }
  function drawRobe() {
    const sway = state === 'run' ? Math.sin(t * runF) * 1.5 : Math.sin(t * 2.2) * 0.55;
    const hemY = 12.6, topY = hipY - 1;
    // peek feet
    const f1 = state === 'run' ? Math.sin(t * runF) * 1.6 : 0;
    blk(-2.3 + f1 * 0.4, hemY - 0.3, 2.0, 1.6, OL); blk(-2.1 + f1 * 0.4, hemY - 0.2, 1.6, 1.2, rig.boot);
    blk(0.4 - f1 * 0.4, hemY - 0.3, 2.0, 1.6, OL); blk(0.5 - f1 * 0.4, hemY - 0.2, 1.6, 1.2, rig.boot);
    // outline pass
    for (let yy = topY; yy <= hemY; yy += 1) { const tt = (yy - topY) / (hemY - topY); const hw = 2.6 + tt * 2.9; const off = sway * tt; blk(-hw - 0.4 + off, yy, hw * 2 + 0.8, 1.25, OL); }
    // fill pass
    for (let yy = topY; yy <= hemY; yy += 1) {
      const tt = (yy - topY) / (hemY - topY); const hw = 2.6 + tt * 2.9; const off = sway * tt;
      blk(-hw + off, yy, hw * 2, 1.12, rig.body);
      blk(-0.9 + off + topX * 0.3, yy, 1.7, 1.12, rig.bodyLt, 0.6);
      blk(-hw + off, yy, 1.1, 1.12, rig.bodySh, 0.85);
    }
    const hwB = 2.6 + 2.9, offB = sway;
    blk(-hwB + offB, hemY, hwB * 2, 0.8, rig.hem || rig.belt);
    if (rig.tattered) for (let i = 0; i < 8; i++) { const xx = -hwB + i * (hwB * 2 / 7) + offB; blk(xx, hemY + 0.4, 1.0, 0.5 + (i % 2) * 1.0, rig.body); blk(xx, hemY + 0.4, 1.0, 0.4, OL); }
    if (rig.grass) for (let i = 0; i < 10; i++) { const xx = -hwB + i * (hwB * 2 / 9) + offB; const gl = 1.6 + (i % 3) * 0.6; blk(xx, hemY - 0.2, 0.9, gl, rig.bodyLt); blk(xx, hemY - 0.2 + gl - 0.4, 0.9, 0.4, OL); }
    if (rig.robeStar) for (let i = 0; i < 4; i++) { blk(-2 + (i % 2) * 3 + (i > 1 ? 1 : -1), hipY + 2 + i * 2.2, 0.7, 0.7, rig.robeStar, 0.8); }
  }
  function drawEmblem() {
    if (!rig.emblem || dir === 'up') return;
    const ex = topX * 0.4, ey = shY + 2.3;
    if (rig.emblem === 'cross') { blk(ex - 0.45, ey - 1.3, 1.0, 3.2, rig.accent); blk(ex - 1.3, ey - 0.3, 2.6, 1.0, rig.accent); blk(ex - 0.25, ey - 1.1, 0.6, 0.6, '#ffffff', 0.8); }
    else if (rig.emblem === 'leaf') { disc(ex, ey + 0.2, 1.2, rig.accent); blk(ex - 0.2, ey - 1.2, 0.5, 2.8, rig.bodySh); blk(ex - 0.7, ey, 1.4, 0.4, rig.bodySh, 0.7); }
    else if (rig.emblem === 'skull') { disc(ex, ey, 1.3, '#e8e0f2'); blk(ex - 0.8, ey - 0.2, 0.6, 0.6, '#140018'); blk(ex + 0.3, ey - 0.2, 0.6, 0.6, '#140018'); blk(ex - 0.2, ey + 0.8, 0.5, 0.6, '#140018'); }
    else if (rig.emblem === 'bone') { blk(ex - 0.3, ey - 1.3, 0.7, 2.8, '#e8e0d0'); blk(ex - 0.9, ey - 1.3, 1.8, 0.5, '#e8e0d0'); blk(ex - 0.9, ey + 1.0, 1.8, 0.5, '#e8e0d0'); }
    else if (rig.emblem === 'star') { blk(ex - 0.3, ey - 1.3, 0.7, 2.8, rig.accent); blk(ex - 1.3, ey - 0.3, 2.8, 0.7, rig.accent); blk(ex - 0.9, ey - 0.9, 1.9, 1.9, rig.accent, 0.55); }
    else if (rig.emblem === 'chevron') { bar(ex - 1.5, ey - 0.9, ex, ey + 0.7, 0.45, rig.accent); bar(ex, ey + 0.7, ex + 1.5, ey - 0.9, 0.45, rig.accent); }
  }
  function drawHead(hcx, hcy) {
    const g = rig.headgear;
    if (g === 'hood') {
      disc(hcx, hcy - 0.5, 3.5, OL); disc(hcx, hcy - 0.45, 3.2, rig.hoodCol || rig.body);
      disc(hcx + (flip ? -0.7 : 0.7), hcy + 0.5, 2.6, rig.skin); // face opening
      disc(hcx + (flip ? 1.4 : -1.4), hcy + 0.1, 1.9, OL, 0.55); // inner hood shadow
      blk(hcx - 3.4, hcy - 0.6, 1.3, 3.4, rig.bodySh, 0.9); blk(hcx + 2.1, hcy - 0.6, 1.3, 3.4, rig.bodySh, 0.9);
      blk(hcx - 0.6, hcy - 3.4, 1.2, 1.0, rig.hoodCol || rig.body); // hood peak
      if (rig.feather) { bar(hcx + (flip ? -2.4 : 2.4), hcy - 2.4, hcx + (flip ? -3.6 : 3.6), hcy - 5.4, 0.5, OL); bar(hcx + (flip ? -2.4 : 2.4), hcy - 2.4, hcx + (flip ? -3.4 : 3.4), hcy - 5.2, 0.35, rig.feather); }
    } else if (g === 'wizhat') {
      for (let i = 0; i < 8; i++) { const wlen = 2.7 - i * 0.32; blk(hcx - wlen - 0.3 + i * 0.12, hcy - 2.2 - i * 0.95, (wlen + 0.3) * 2, 1.05, OL); blk(hcx - wlen + i * 0.12, hcy - 2.2 - i * 0.95, wlen * 2, 1.0, rig.hatCol); }
      blk(hcx - 3.7, hcy - 2.6, 7.4, 1.3, OL); blk(hcx - 3.5, hcy - 2.5, 7.0, 1.0, rig.bodyLt);
      blk(hcx + 1.0 - (state === 'run' ? Math.sin(t * runF) : 0), hcy - 8.6, 1.0, 1.0, rig.accent); // star on tip
      if (rig.beard) { blk(hcx - 1.7, hcy + 1.4, 3.4, 1.0, OL); blk(hcx - 1.5, hcy + 1.5, 3.0, 3.0, rig.beard); blk(hcx - 1.0, hcy + 3.8, 2.0, 1.6, rig.beard); }
    } else if (g === 'helm') {
      ball(hcx, hcy - 0.6, 3.3, rig.helmCol);
      blk(hcx - 3.3, hcy - 0.2, 6.6, 1.3, rig.helmCol); blk(hcx - 3.3, hcy + 1.0, 6.6, 0.5, rig.bodySh, 0.6);
      blk(hcx - 0.6, hcy - 4.2, 1.2, 1.8, OL); blk(hcx - 0.5, hcy - 4.0, 1.0, 1.6, rig.accent);
      const pl = state === 'run' ? Math.sin(t * runF) * 1.2 : 0;
      bar(hcx, hcy - 4.0, hcx + (flip ? -2 : 2) - pl, hcy - 6.2, 0.8, OL); bar(hcx, hcy - 4.0, hcx + (flip ? -1.8 : 1.8) - pl, hcy - 6.0, 0.55, rig.cape || rig.accent);
      blk(hcx - 0.5, hcy - 0.4, 1.0, 2.6, '#0a0c10'); blk(hcx - 2.3, hcy + 0.2, 4.6, 0.9, '#0a0c10'); // T-visor
      if (rig.gorget) blk(hcx - 1.8, hcy + 2.4, 3.6, 1.0, rig.bodyLt, 0.9);
    } else if (g === 'mask') {
      ball(hcx, hcy - 0.2, 3.1, rig.maskCol);
      blk(hcx - 2.0, hcy - 0.5, 1.5, 1.1, '#160a04'); blk(hcx + 0.6, hcy - 0.5, 1.5, 1.1, '#160a04');
      blk(hcx - 0.5, hcy + 0.9, 1.0, 2.0, '#160a04');
      blk(hcx - 2.0, hcy - 0.5, 1.5, 0.4, rig.accent, 0.7); blk(hcx + 0.6, hcy - 0.5, 1.5, 0.4, rig.accent, 0.7); // painted brow
      bar(hcx - 1.2, hcy - 3.0, hcx - 3.2, hcy - 5.8, 0.7, OL); bar(hcx - 1.2, hcy - 3.0, hcx - 3.0, hcy - 5.6, 0.45, rig.accent);
      bar(hcx + 1.2, hcy - 3.0, hcx + 3.2, hcy - 5.8, 0.7, OL); bar(hcx + 1.2, hcy - 3.0, hcx + 3.0, hcy - 5.6, 0.45, '#cc4422');
    } else if (g === 'antler') {
      ball(hcx, hcy, 3.0, rig.skin);
      blk(hcx - 2.7, hcy - 2.3, 5.4, 1.4, OL); blk(hcx - 2.5, hcy - 2.2, 5.0, 1.1, rig.hair);
      for (const d2 of [-1, 1]) { bar(hcx + d2 * 1.7, hcy - 2.2, hcx + d2 * 3.4, hcy - 5.6, 0.6, '#8a6a3a'); bar(hcx + d2 * 3.4, hcy - 4.4, hcx + d2 * 4.6, hcy - 5.2, 0.5, '#8a6a3a'); bar(hcx + d2 * 2.7, hcy - 3.6, hcx + d2 * 3.9, hcy - 4.2, 0.45, '#8a6a3a'); blk(hcx + d2 * 1.0, hcy - 2.8, 0.7, 0.7, rig.accent, 0.8); }
      drawFace(hcx, hcy);
    } else if (g === 'ponytail') {
    } else if (g === 'ponytail') {
      ball(hcx, hcy, 3.0, rig.skin);
      blk(hcx - 3.1, hcy - 2.7, 6.2, 1.7, OL); blk(hcx - 2.9, hcy - 2.6, 5.8, 1.3, rig.hair);
      const sway = state === 'run' ? Math.sin(t * runF) * 1.4 : Math.sin(t * 2.4) * 0.55;
      bar(hcx - 2.6, hcy - 1.6, hcx - 4.4 - sway, hcy + 2.8, 1.1, OL); bar(hcx - 2.6, hcy - 1.6, hcx - 4.2 - sway, hcy + 2.6, 0.85, rig.hair);
      if (rig.braid) for (let i = 0; i < 3; i++) blk(hcx - 3.4 - i * 0.5 - sway * (i / 3), hcy + 0.2 + i * 1.0, 1.0, 0.5, rig.accent, 0.6);
      blk(hcx - 0.7, hcy - 3.3, 2.2, 1.2, rig.accent, 0.85);
      drawFace(hcx, hcy);
    } else if (g === 'bald') {
      ball(hcx, hcy, 3.0, rig.skin);
      blk(hcx - 1.5, hcy - 3.1, 3.0, 1.1, rig.skinSh, 0.45);
      blk(hcx - 0.5, hcy - 4.2, 1.0, 1.5, OL); blk(hcx - 0.4, hcy - 4.0, 0.8, 1.2, rig.hair);
      drawFace(hcx, hcy);
    } else { ball(hcx, hcy, 3.0, rig.skin); drawFace(hcx, hcy); }
    if (rig.mask && g === 'hood') { blk(hcx - 1.9, hcy + 0.9, 3.8, 1.9, OL); blk(hcx - 1.7, hcy + 1.0, 3.4, 1.5, rig.bodySh); }
    if ((g === 'hood' || g === 'wizhat') && dir !== 'up') drawFace(hcx + (flip ? -0.5 : 0.5), hcy + 0.5);
    if (rig.warpaint && dir !== 'up' && g !== 'mask') { blk(hcx - 1.6, hcy + 0.2, 0.5, 1.4, rig.warpaint, 0.85); blk(hcx + 1.1, hcy + 0.2, 0.5, 1.4, rig.warpaint, 0.85); }
  }
  function drawFace(hcx, hcy) {
    if (dir === 'up') return;
    const ec = rig.glowEye ? rig.accent : '#161018';
    if (dir === 'side') {
      blk(hcx + (flip ? -1.9 : 1.0), hcy - 0.2, 0.9, 1.1, '#161018');
      blk(hcx + (flip ? -1.8 : 1.1), hcy - 0.1, 0.55, 0.6, ec, rig.glowEye ? 1 : 0.95);
      if (rig.glowEye) blk(hcx + (flip ? -2.0 : 0.9), hcy - 0.3, 0.95, 1.0, ec, 0.25);
      blk(hcx + (flip ? -2.6 : 2.0), hcy + 0.4, 0.6, 0.6, rig.skinSh, 0.5);
    } else {
      blk(hcx - 1.5, hcy - 0.2, 0.95, 1.1, '#161018'); blk(hcx + 0.6, hcy - 0.2, 0.95, 1.1, '#161018');
      blk(hcx - 1.4, hcy - 0.1, 0.5, 0.55, ec, rig.glowEye ? 1 : 0.9); blk(hcx + 0.7, hcy - 0.1, 0.5, 0.55, ec, rig.glowEye ? 1 : 0.9);
      if (rig.glowEye) { blk(hcx - 1.6, hcy - 0.3, 0.9, 0.95, ec, 0.22); blk(hcx + 0.5, hcy - 0.3, 0.9, 0.95, ec, 0.22); }
    }
  }
  function drawWeapon(wx, wy) {
    const st = o.wpnStyle || rig.wpnStyle;
    let ang;
    if (state === 'attack' && aT >= 0 && dir === 'side') ang = -0.9 + aT * 2.0;
    else if (dir === 'side') ang = 0.1;
    else ang = (dir === 'up') ? -1.3 : 1.0;
    const ax = Math.cos(ang), ay = Math.sin(ang);
    const idle = Math.sin(t * 2.5) * 0.15;
    if (st === 'bow') {
      bar(wx - 0.3, wy - 4.4, wx + 1.6, wy, 0.95, OL); bar(wx - 0.3, wy + 4.4, wx + 1.6, wy, 0.95, OL);
      bar(wx, wy - 4, wx + 1.4, wy, 0.65, rig.wpnMain); bar(wx, wy + 4, wx + 1.4, wy, 0.65, rig.wpnMain);
      blk(wx - 0.2, wy - 4.4, 0.8, 0.8, rig.wpnLt); blk(wx - 0.2, wy + 3.7, 0.8, 0.8, rig.wpnLt);
      ctx.globalAlpha = 0.9; bar(wx - 0.2, wy - 4, wx - 0.2, wy + 4, 0.22, '#e8e8e8'); ctx.globalAlpha = 1;
      if (state === 'attack') { const pull = aT < 0.5 ? aT : (1 - aT); bar(wx - pull * 3, wy, wx + 4.5, wy, 0.5, OL); bar(wx - pull * 3, wy, wx + 4.5, wy, 0.3, rig.wpnAcc); blk(wx + 4.3, wy - 0.4, 1.0, 1.0, '#ffffff'); }
    } else if (st === 'cast') {
      bar(wx, wy + 3, wx + (flip ? -0.6 : 0.6), wy - 6 + idle, 1.1, OL);
      bar(wx, wy + 3, wx + (flip ? -0.6 : 0.6), wy - 6 + idle, 0.75, rig.wpnMain);
      const gx = wx + (flip ? -0.6 : 0.6), gy = wy - 6.5 + idle, pulse = 0.7 + 0.3 * Math.sin(t * 6);
      ctx.globalAlpha = 0.5 * pulse; disc(gx, gy, 2.6, rig.wpnAcc); ctx.globalAlpha = 1;
      disc(gx, gy, 1.5, OL); disc(gx, gy, 1.2, rig.wpnAcc); disc(gx, gy, 0.6, '#ffffff');
      if (state === 'attack' && aT >= 0) { ctx.globalAlpha = 0.7 * (1 - aT); disc(gx, gy, 2.0 + aT * 2.8, rig.wpnAcc, 0.5 * (1 - aT)); ctx.globalAlpha = 1; }
    } else if (st === 'bostaff') {
      const spin = (state === 'attack' && aT >= 0) ? aT * 2.4 : 0.5 + idle;
      const dx = Math.cos(spin), dy = Math.sin(spin);
      bar(wx - dx * 5.2, wy - dy * 5.2, wx + dx * 5.2, wy + dy * 5.2, 0.95, OL);
      bar(wx - dx * 5, wy - dy * 5, wx + dx * 5, wy + dy * 5, 0.65, rig.wpnMain);
      blk(wx + dx * 5 - 0.5, wy + dy * 5 - 0.5, 1.1, 1.1, rig.wpnAcc); blk(wx - dx * 5 - 0.5, wy - dy * 5 - 0.5, 1.1, 1.1, rig.wpnAcc);
    } else if (st === 'dagger') {
      bar(wx, wy, wx + ax * 4.4, wy + ay * 4.4, 1.0, OL);
      bar(wx, wy, wx + ax * 4, wy + ay * 4, 0.65, rig.wpnMain);
      blk(wx + ax * 4 - 0.4, wy + ay * 4 - 0.4, 1.1, 1.1, rig.wpnLt);
      blk(wx - 0.6, wy - 0.6, 1.3, 1.3, rig.wpnAcc, 0.85);
      bar(wx - 1.4, wy + 0.6, wx - 1.4 - ax * 3, wy + 0.6 - ay * 3, 0.5, OL, 0.7);
    } else if (st === 'sword') {
      bar(wx, wy, wx + ax * 7.4, wy + ay * 7.4, 1.0, OL);
      bar(wx, wy, wx + ax * 7, wy + ay * 7, 0.7, rig.wpnMain);
      blk(wx + ax * 7 - 0.4, wy + ay * 7 - 0.4, 1.1, 1.1, '#ffffff');
      bar(wx - ax * 1.3 - ay * 1.7, wy - ay * 1.3 + ax * 1.7, wx - ax * 1.3 + ay * 1.7, wy - ay * 1.3 - ax * 1.7, 0.65, rig.wpnAcc);
      if (state === 'attack' && aT >= 0) { ctx.globalAlpha = 0.5 * (1 - aT); bar(wx + ax * 3, wy + ay * 3, wx + ax * 8, wy + ay * 8, 1.4, '#ffffff', 0.5 * (1 - aT)); ctx.globalAlpha = 1; }
    } else if (st === 'scythe') {
      bar(wx, wy + 5, wx, wy - 7.5 + idle, 1.05, OL);
      bar(wx, wy + 5, wx, wy - 7 + idle, 0.7, rig.wpnMain);
      bar(wx, wy - 7 + idle, wx + (flip ? -3.6 : 3.6), wy - 6 + idle, 0.95, OL);
      bar(wx, wy - 7 + idle, wx + (flip ? -3.5 : 3.5), wy - 6 + idle, 0.6, rig.wpnLt);
      bar(wx + (flip ? -3.5 : 3.5), wy - 6 + idle, wx + (flip ? -4.2 : 4.2), wy - 3.3 + idle, 0.55, rig.wpnLt);
      if (state === 'attack' && aT >= 0) { ctx.globalAlpha = 0.6 * (1 - aT); bar(wx, wy - 6, wx + (flip ? -6.5 : 6.5), wy - 1.5, 0.5, rig.wpnAcc); ctx.globalAlpha = 1; }
    } else if (st === 'spear') {
      const L = state === 'attack' && aT >= 0 ? 8 + aT * 4.5 : 8;
      bar(wx - ax * 3, wy - ay * 3, wx + ax * L, wy + ay * L, 0.85, OL);
      bar(wx - ax * 3, wy - ay * 3, wx + ax * L, wy + ay * L, 0.5, rig.wpnMain);
      blk(wx + ax * L - 0.5, wy + ay * L - 0.5, 1.3, 1.3, rig.wpnLt);
      bar(wx + ax * (L - 1.5) - ay, wy + ay * (L - 1.5) + ax, wx + ax * (L - 1.5) + ay, wy + ay * (L - 1.5) - ax, 0.45, rig.wpnAcc);
      blk(wx - ax * 3 - 0.4, wy - ay * 3 - 0.4, 0.9, 0.9, rig.accent);
      if (rig.shield) { blk(wx - 4.6, wy - 2.2, 1.6, 4.6, OL); blk(wx - 4.4, wy - 2.0, 1.2, 4.2, rig.accent, 0.9); blk(wx - 4.0, wy - 0.4, 0.5, 1.0, rig.bodySh); }
    } else if (st === 'fetish') {
      bar(wx, wy + 3, wx, wy - 5 + idle, 0.95, OL); bar(wx, wy + 3, wx, wy - 5 + idle, 0.6, rig.wpnMain);
      ball(wx, wy - 5.6 + idle, 1.6, '#caa84a');
      blk(wx - 0.9, wy - 5.7 + idle, 0.7, 0.7, '#1a0e08'); blk(wx + 0.3, wy - 5.7 + idle, 0.7, 0.7, '#1a0e08');
      blk(wx - 0.4, wy - 4.4 + idle, 0.8, 0.6, '#1a0e08');
      blk(wx - 1.7, wy - 3.4, 0.7, 1.1, rig.wpnAcc); blk(wx + 1.0, wy - 3.4, 0.7, 1.1, '#cc4422');
    } else if (st === 'druidstaff') {
      bar(wx, wy + 3, wx, wy - 6 + idle, 1.05, OL); bar(wx, wy + 3, wx, wy - 6 + idle, 0.7, rig.wpnMain);
      ball(wx, wy - 6.6 + idle, 1.2, '#6a4a28');
      for (const d2 of [-1, 1]) blk(wx + d2 * 1.4 - 0.3, wy - 7.6 + idle, 1.2, 1.0, rig.accent);
      const pulse = 0.6 + 0.4 * Math.sin(t * 5); ctx.globalAlpha = pulse; disc(wx, wy - 6.6 + idle, 0.6, rig.accent); ctx.globalAlpha = 1;
    }
  }

  function drawDragon() {
    const fly = Math.sin(t * (state === 'run' ? 10 : 4));
    ctx.globalAlpha = 0.3; ctx.fillStyle = '#000'; ctx.fillRect(Math.round(cx - 8 * s), Math.round(cy + 13 * s), 16 * s, Math.round(1.5 * s)); ctx.globalAlpha = 1;
    limb(-2, 6, -7, 4 + fly, 1.7, rig.bodySh); limb(-7, 4 + fly, -10.5, 6 + fly * 1.5, 1.0, rig.bodySh);
    blk(-11.4, 5.2 + fly * 1.5, 1.8, 1.8, OL); blk(-11.2, 5.4 + fly * 1.5, 1.4, 1.4, rig.accent);
    ctx.globalAlpha = 0.9; bar(1, -3, 4.5, -8 - fly * 2, 1.1, rig.wing); blk(3.5, -9 - fly * 2, 3, 2.5, rig.wing, 0.75); ctx.globalAlpha = 1;
    limb(2, 6, 3.6, 12, 1.6, rig.bodySh); blk(2.6, 11.5, 2.8, 1.8, OL); blk(2.8, 11.6, 2.4, 1.4, rig.bodySh);
    limb(-1, 6, -1.6, 12, 1.5, rig.body); blk(-3.0, 11.5, 2.8, 1.8, OL); blk(-2.8, 11.6, 2.4, 1.4, rig.body);
    limb(-2, 6, 2, -4, 3.3, rig.body);
    blk(0.6, -3, 2.0, 9, rig.belly, 0.92); for (let i = 0; i < 5; i++) blk(0.6, -2.6 + i * 1.8, 2.0, 0.4, rig.bodySh, 0.4);
    blk(-3.2, -4, 1.5, 9, rig.bodySh, 0.85);
    for (let i = 0; i < 6; i++) { bar(-1.6 + i * 0.7, -3 + i * 1.7, -2.8 + i * 0.7, -5.2 + i * 1.7, 0.7, OL); bar(-1.6 + i * 0.7, -3 + i * 1.7, -2.8 + i * 0.7, -5.2 + i * 1.7, 0.45, rig.accent); }
    ctx.globalAlpha = 0.97; bar(-1, -3, -6, -8.5 - fly * 2, 1.3, OL); bar(-1, -3, -6, -8.5 - fly * 2, 0.95, rig.wing); bar(-6, -8.5 - fly * 2, -9.5, -3 - fly, 0.7, rig.wing);
    blk(-9.5, -4.5 - fly, 4.5, 3.2, rig.wing, 0.85); for (let i = 0; i < 3; i++) bar(-2 - i * 2.5, -4.5 - fly * 1.5, -7 - i * 0.8, -2 - fly, 0.35, rig.wingLt, 0.7); ctx.globalAlpha = 1;
    limb(1.5, -3, 3.6, -9, 2.0, rig.body);
    ball(4.3, -10, 2.6, rig.body); blk(4.6, -10.2, 3.8, 2.4, OL); blk(4.8, -10, 3.4, 2.0, rig.body);
    blk(7.6, -9.6, 1.1, 1.5, rig.bodyLt); blk(6.4, -8.6, 1.8, 0.5, rig.bodySh, 0.6);
    blk(5.5, -11.2, 1.3, 1.1, rig.accent); blk(5.7, -11.0, 0.6, 0.5, '#ffffff');
    for (const d2 of [3.6, 4.8]) { bar(d2, -11.6, d2 - 1.2, -14.4, 0.7, OL); bar(d2, -11.6, d2 - 1.2, -14.2, 0.45, '#e8d0a0'); }
    blk(4.4, -10.6, 1.6, 0.5, rig.bodyLt, 0.6);
    if (state === 'attack' && aT >= 0) {
      ctx.globalAlpha = 0.85 * (1 - aT * 0.5);
      disc(8.6 + aT * 3, -9, 1.5 + aT * 2.2, '#ffaa33'); disc(10.4 + aT * 4, -9, 1.1 + aT * 1.6, '#ff5522', 0.85); disc(8.4 + aT * 2, -9, 0.9, '#ffee88'); disc(12 + aT * 4, -9, 0.7, '#ff3311', 0.7);
      ctx.globalAlpha = 1;
    }
  }
  function drawPanther() {
    const run = state === 'run' ? Math.sin(t * 16) : 0;
    const breathe = Math.sin(t * 3) * 0.3;
    ctx.globalAlpha = 0.32; ctx.fillStyle = '#000'; ctx.fillRect(Math.round(cx - 9 * s), Math.round(cy + 8 * s), 18 * s, Math.round(1.5 * s)); ctx.globalAlpha = 1;
    limb(-6, 3, -9, 0, 1.0, rig.bodySh); limb(-9, 0, -10.2, -3, 0.8, rig.bodySh); blk(-11, -4, 1.6, 1.6, OL); blk(-10.8, -3.8, 1.2, 1.2, rig.bodyLt);
    limb(-4, 3, -4 + run * 2, 8, 1.0, rig.bodySh); blk(-5.2 + run * 2, 7.4, 2.6, 1.5, OL); blk(-5 + run * 2, 7.6, 2.2, 1.1, rig.bodySh);
    limb(4, 3, 4 - run * 2, 8, 1.0, rig.bodySh); blk(2.8 - run * 2, 7.4, 2.6, 1.5, OL); blk(3 - run * 2, 7.6, 2.2, 1.1, rig.bodySh);
    limb(-6, 2 + breathe, 5, 1 + breathe, 3.1, rig.body);
    blk(-6, 3.4, 11, 1.2, rig.bodySh, 0.6);
    blk(-5, -0.6 + breathe, 9, 0.8, rig.bodyLt, 0.4);
    limb(-3.5, 3, -3.5 - run * 2, 8.4, 1.15, rig.body); blk(-4.8 - run * 2, 7.9, 2.8, 1.6, OL); blk(-4.6 - run * 2, 8.0, 2.4, 1.2, rig.body);
    limb(4.2, 3, 4.2 + run * 2, 8.4, 1.15, rig.body); blk(3.0 + run * 2, 7.9, 2.8, 1.6, OL); blk(3.2 + run * 2, 8.0, 2.4, 1.2, rig.body);
    disc(-4.5, 1.5 + breathe, 2.7, rig.body); disc(4, 1 + breathe, 2.5, rig.bodyLt);
    ball(6.6, 0 + breathe, 2.5, rig.body);
    blk(7.6, 0.3 + breathe, 2.6, 2.0, OL); blk(7.8, 0.4 + breathe, 2.2, 1.6, rig.body);
    for (const ex of [5.3, 7.5]) { bar(ex, -2.0 + breathe, ex - 0.4, -3.8 + breathe, 0.8, OL); bar(ex, -2.0 + breathe, ex - 0.4, -3.6 + breathe, 0.5, rig.body); }
    blk(6.9, -0.5 + breathe, 1.2, 0.9, rig.eye); blk(7.2, -0.4 + breathe, 0.5, 0.4, '#ffffff'); blk(6.7, -0.7 + breathe, 1.6, 1.3, rig.eye, 0.25);
    blk(9.6, 0.6 + breathe, 0.6, 0.6, rig.bodySh);
    blk(8.6, 1.8 + breathe, 0.4, 0.9, '#ffffff'); blk(9.3, 1.8 + breathe, 0.4, 0.9, '#ffffff');
    if (state === 'attack' && aT >= 0) { for (let i = -1; i <= 1; i++) { bar(9.5, -1 + i * 1.5, 9.5 + aT * 5.5, 1 + i * 1.9, 0.55, OL, 0.8 * (1 - aT)); bar(9.5, -1 + i * 1.5, 9.5 + aT * 5.5, 1 + i * 1.9, 0.35, rig.accent, 0.9 * (1 - aT)); } }
  }
}

// ============================================================
// CharAnimator — drives drawCharacter() for the 9 non-Berserker
// classes. Same interface as BerserkerAnimator so Player.draw can
// use either: update(dt,isMoving,isAttacking,vx,vy) + draw(ctx,cx,cy,flash,classKey).
// ============================================================
class CharAnimator {
  constructor(classId) {
    this.classId = classId;
    this.t = 0;
    this.dir8 = 'south';
    this.state = 'idle';
    this.attackT = -1;
    this.attackDur = 0.30;
    this._wasAttacking = false;
  }
  update(dt, isMoving, isAttacking, vx, vy) {
    this.t += dt;
    const nd = _velToDir8(vx || 0, vy || 0);
    if (nd) this.dir8 = nd;
    if (isAttacking && !this._wasAttacking && this.attackT < 0) this.attackT = 0;
    this._wasAttacking = isAttacking;
    if (this.attackT >= 0) {
      this.attackT += dt / this.attackDur;
      if (this.attackT >= 1) this.attackT = -1;
    }
    this.state = (this.attackT >= 0) ? 'attack' : (isMoving ? 'run' : 'idle');
  }
  draw(ctx, cx, cy, flash, classKey) {
    if (typeof drawCharacter !== 'function') return false;
    const d = rigDir4(this.dir8);
    drawCharacter(ctx, cx, cy, {
      classId: classKey || this.classId, dir: d.dir, flip: d.flip,
      state: this.state, t: this.t, attackT: this.attackT, flash: !!flash, s: 2,
    });
    return true;
  }
}

// ============================================================
// ENEMY RIG — procedural animated pixel-art monsters.
// Same art language as the player rig: dark outlines, shading,
// animated walk. drawEnemy(ctx, cx, cy, {type, t, flip, flash, s, alpha})
// Draws only with fillRect/fillStyle/globalAlpha (browser + preview).
// ============================================================

const ENEMY_RIGS = {
  skeleton:   { arch: 'humanoid', ol: '#15140c', body: '#d8d4c0', bodyLt: '#f0ecd8', bodySh: '#9a9484', eye: '#a8e0ff', ribs: true, skull: true, weapon: 'rustsword', F: 9 },
  zombie:     { arch: 'humanoid', ol: '#101a0a', body: '#5a7a3a', bodyLt: '#7a9a50', bodySh: '#3a5224', skin: '#86965a', eye: '#c8ff66', hunch: true, reach: true, torn: true, F: 5 },
  yeti:       { arch: 'humanoid', ol: '#222a32', body: '#dfe6ee', bodyLt: '#ffffff', bodySh: '#a8b4c2', skin: '#bcd2e2', eye: '#3a7acc', big: true, horns: true, bigArm: true, F: 5 },
  rat:        { arch: 'quad', ol: '#120e0a', body: '#6a5e52', bodyLt: '#8a7c6c', bodySh: '#443a30', ear: '#c88a86', eye: '#ff5544', tail: 'long', small: true, F: 18 },
  frostWolf:  { arch: 'quad', ol: '#142028', body: '#8fb6d6', bodyLt: '#c2e0f2', bodySh: '#566f88', eye: '#7af0ff', fur: true, fang: true, F: 14 },
  hellhound:  { arch: 'quad', ol: '#0e0604', body: '#34211e', bodyLt: '#5a302a', bodySh: '#1c0e0c', eye: '#ff7a22', mane: '#ff5511', fang: true, F: 15 },
  imp:        { arch: 'imp', ol: '#280a06', body: '#c83828', bodyLt: '#ee5a40', bodySh: '#8a2418', eye: '#ffdd44', horns: true, wings: true, tail: true, fireHand: true, F: 8 },
  shadow:     { arch: 'wraith', ol: '#060410', body: '#1e1830', bodyLt: '#36304e', bodySh: '#100a1c', eye: '#aef0ff', claws: true, baseAlpha: 0.82, F: 4 },
  voidCaster: { arch: 'caster', ol: '#100820', body: '#3a2458', bodyLt: '#56386e', bodySh: '#241038', eye: '#dd66ff', orb: '#aa66ff', hood: true, F: 4 },
};

function drawEnemy(ctx, cx, cy, o) {
  const cfg = (o.rig) || ENEMY_RIGS[o.type];
  if (!cfg) return;
  const s = o.s || 2;
  const flip = !!o.flip;
  const t = o.t || 0;
  const flash = !!o.flash;
  const OL = cfg.ol || '#0a0710';
  const F = cfg.F || 8;
  const baseA = (o.alpha !== undefined) ? o.alpha : (cfg.baseAlpha !== undefined ? cfg.baseAlpha : 1);

  function col(c) { return flash ? '#ffffff' : c; }
  function blk(ax, ay, aw, ah, c, alpha) {
    ctx.globalAlpha = baseA * (alpha === undefined ? 1 : alpha);
    ctx.fillStyle = col(c);
    const x = flip ? (cx - (ax + aw) * s) : (cx + ax * s);
    ctx.fillRect(Math.round(x), Math.round(cy + ay * s), Math.max(1, Math.ceil(aw * s)), Math.max(1, Math.ceil(ah * s)));
    ctx.globalAlpha = 1;
  }
  function disc(ax, ay, ar, c, alpha) {
    ctx.globalAlpha = baseA * (alpha === undefined ? 1 : alpha);
    ctx.fillStyle = col(c);
    for (let dy = -Math.ceil(ar); dy <= Math.ceil(ar); dy++) {
      const dx = Math.sqrt(Math.max(0, ar * ar - dy * dy));
      if (dx <= 0) continue;
      const x0 = ax - dx, w = 2 * dx;
      const x = flip ? (cx - (x0 + w) * s) : (cx + x0 * s);
      ctx.fillRect(Math.round(x), Math.round(cy + (ay + dy) * s), Math.max(1, Math.ceil(w * s)), Math.max(1, Math.ceil(s)));
    }
    ctx.globalAlpha = 1;
  }
  function bar(x0, y0, x1, y1, th, c, alpha) {
    const steps = Math.max(2, Math.ceil(Math.hypot(x1 - x0, y1 - y0)));
    for (let i = 0; i <= steps; i++) { const u = i / steps; disc(x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, th, c, alpha); }
  }
  function limb(x0, y0, x1, y1, th, c) { bar(x0, y0, x1, y1, th + 0.5, OL); bar(x0, y0, x1, y1, th, c); }
  function ball(ax, ay, ar, c) { disc(ax, ay, ar + 0.5, OL); disc(ax, ay, ar, c); }
  function shadowOval(w) { ctx.globalAlpha = 0.3 * baseA; ctx.fillStyle = '#000'; ctx.fillRect(Math.round(cx - w * s / 2), Math.round(cy + 9 * s), w * s, Math.max(1, Math.round(1.4 * s))); ctx.globalAlpha = 1; }

  if (cfg.arch === 'humanoid') drawHumanoid();
  else if (cfg.arch === 'quad') drawQuad();
  else if (cfg.arch === 'imp') drawImp();
  else if (cfg.arch === 'wraith') drawWraith();
  else if (cfg.arch === 'caster') drawCaster();

  function drawHumanoid() {
    const big = cfg.big ? 1.25 : 1;
    const legPh = Math.sin(t * F), bob = Math.abs(Math.sin(t * F)) * 1.0;
    const hunch = cfg.hunch ? 2.0 : 0;
    shadowOval(7 * big);
    const hipY = (4 - bob * 0.3) * big, shY = (-5 - bob) * big, headY = (-10.5 - bob) * big - hunch * 0.3;
    const lean = hunch;
    // legs
    for (const side of [-1, 1]) {
      const ph = side > 0 ? legPh : -legPh;
      const footX = side * 1.3 * big + ph * 3.2 * big, fY = (12.5 * big) - Math.max(0, ph * side) * 1.4;
      limb(side * 1.4 * big, hipY, footX, fY, 1.4 * big, side > 0 ? cfg.body : cfg.bodySh);
      blk(footX - 1.5 * big, fY - 0.3, 3.0 * big, 1.5, OL);
      blk(footX - 1.3 * big, fY - 0.2, 2.6 * big, 1.1, side > 0 ? cfg.bodySh : OL);
    }
    // back arm
    const baX = -1.2 * big + lean, baHx = -2.6 * big + lean * 1.4, baHy = hipY + (cfg.reach ? -1 : 1.5);
    limb(baX, shY + 0.5, baHx, baHy, 1.15 * big, cfg.bodySh);
    // torso
    limb(0, hipY, lean, shY + 0.5, 2.9 * big, cfg.body);
    blk((flip ? 1.2 : -2.8) * big + lean, shY, 1.2 * big, hipY - shY, cfg.bodySh, 0.85);
    if (cfg.ribs) { for (let i = 0; i < 3; i++) blk(-1.8 * big, shY + 1 + i * 1.6, 3.6 * big, 0.5, cfg.bodySh, 0.85); blk(-0.4 * big, shY + 0.5, 0.8 * big, hipY - shY, cfg.bodySh, 0.6); }
    if (cfg.torn) { for (let i = 0; i < 4; i++) blk(-2.2 * big + i * 1.2, hipY - 0.4, 0.9, 1.0 + (i % 2) * 0.8, cfg.bodySh); }
    // head
    const hX = lean * 0.8;
    blk(hX - 0.7 * big, shY - 1.4, 1.5 * big, 1.6, cfg.skin || cfg.bodySh);
    ball(hX, headY, 2.7 * big, cfg.skin || cfg.body);
    if (cfg.skull) { blk(hX - 1.5 * big, headY - 0.3, 1.2 * big, 1.3, '#15140c'); blk(hX + 0.4 * big, headY - 0.3, 1.2 * big, 1.3, '#15140c'); blk(hX - 0.3 * big, headY + 1.4, 0.7 * big, 1.0, '#15140c'); disc(hX - 0.9 * big, headY - 0.0, 0.45, cfg.eye, 0.9); disc(hX + 0.9 * big, headY, 0.45, cfg.eye, 0.9); blk(hX - 1.5 * big, headY + 1.6, 3.0 * big, 0.4, OL, 0.6); }
    else { const ex = flip ? -0.9 * big : 0.6 * big; blk(hX + ex, headY - 0.2, 0.9 * big, 0.9, cfg.eye); if (cfg.eye) blk(hX + ex - 0.2, headY - 0.4, 1.2 * big, 1.2, cfg.eye, 0.2); }
    if (cfg.horns) { for (const d2 of [-1.4, 1.4]) { bar(hX + d2 * big, headY - 1.8 * big, hX + d2 * 1.5 * big, headY - 3.8 * big, 0.6, OL); bar(hX + d2 * big, headY - 1.8 * big, hX + d2 * 1.5 * big, headY - 3.6 * big, 0.4, '#e8e0c8'); } }
    // front arm
    const faHx = 2.6 * big + lean + (cfg.reach ? 1.5 : 0), faHy = cfg.reach ? shY + 2 : hipY + 1;
    limb(1.2 * big + lean, shY + 0.6, faHx, faHy, 1.2 * big, cfg.bodyLt);
    if (cfg.bigArm) { ball(faHx, faHy, 1.6 * big, cfg.body); ball((1.2 * big + faHx) / 2, (shY + faHy) / 2, 1.5 * big, cfg.body); }
    else ball(faHx, faHy, 0.95 * big, cfg.skin || cfg.body);
    if (cfg.weapon === 'rustsword') { const a2 = 0.2; bar(faHx, faHy, faHx + Math.cos(a2) * 6, faHy + Math.sin(a2) * 6, 0.85, OL); bar(faHx, faHy, faHx + Math.cos(a2) * 5.6, faHy + Math.sin(a2) * 5.6, 0.5, '#7a6a52'); blk(faHx + Math.cos(a2) * 5.6 - 0.3, faHy + Math.sin(a2) * 5.6 - 0.3, 0.9, 0.9, '#b8a884'); }
  }

  function drawQuad() {
    const sm = cfg.small ? 0.78 : 1;
    const gait = Math.sin(t * F), gait2 = Math.sin(t * F + Math.PI);
    const bodyY = 3 * sm + Math.abs(Math.sin(t * F * 2)) * 0.3;
    shadowOval(11 * sm);
    // far legs
    for (const [bx, g] of [[-3.5, gait2], [3.2, gait]]) { limb(bx * sm, bodyY, (bx + g * 2) * sm, 8 * sm, 0.85 * sm, cfg.bodySh); blk((bx + g * 2) * sm - 0.9, 7.4 * sm, 1.8 * sm, 1.2, OL); }
    // tail
    if (cfg.tail === 'long') { bar(-6 * sm, bodyY + 0.5, -10 * sm, bodyY - 1, 0.6, OL); bar(-6 * sm, bodyY + 0.5, -10 * sm, bodyY - 1, 0.4, cfg.bodySh); blk(-10.4 * sm, bodyY - 1.6, 1.0, 1.0, cfg.bodySh); }
    else { bar(-6 * sm, bodyY, -8.5 * sm, bodyY - 2.5, 0.9, OL); bar(-6 * sm, bodyY, -8.5 * sm, bodyY - 2.5, 0.6, cfg.body); }
    // body
    limb(-6 * sm, bodyY, 4.5 * sm, bodyY - 1, 2.7 * sm, cfg.body);
    blk(-6 * sm, bodyY + 1, 11 * sm, 1.0, cfg.bodySh, 0.55);
    blk(-4 * sm, bodyY - 2.4 * sm, 8 * sm, 0.8, cfg.bodyLt, 0.4);
    if (cfg.mane) { for (let i = 0; i < 6; i++) { const mx = (3.5 - i * 1.4) * sm; const fl = 1.4 + Math.sin(t * 9 + i) * 0.5; bar(mx, bodyY - 2 * sm, mx - 0.6, bodyY - 2 * sm - fl, 0.6, cfg.mane); blk(mx - 0.4, bodyY - 2 * sm - fl, 0.7, 0.7, '#ffdd55', 0.9); } }
    if (cfg.fur) { for (let i = 0; i < 5; i++) bar((3 - i * 1.5) * sm, bodyY - 2.2 * sm, (2.6 - i * 1.5) * sm, bodyY - 3.4 * sm, 0.45, cfg.bodyLt); }
    // near legs
    for (const [bx, g] of [[-3.2, gait], [3.6, gait2]]) { limb(bx * sm, bodyY, (bx + g * 2) * sm, 8.4 * sm, 0.95 * sm, cfg.body); blk((bx + g * 2) * sm - 1.0, 7.9 * sm, 2.0 * sm, 1.3, OL); blk((bx + g * 2) * sm - 0.8, 8.0 * sm, 1.6 * sm, 0.9, cfg.body); }
    // head
    const hx = 5.5 * sm, hy = (bodyY - 1.5);
    ball(hx, hy, 2.2 * sm, cfg.body);
    blk(hx + 1.0 * sm, hy + 0.2, 2.4 * sm, 1.6, OL); blk(hx + 1.2 * sm, hy + 0.3, 2.0 * sm, 1.2, cfg.body); // snout
    if (cfg.ear) { for (const ex of [4.6, 6.2]) { bar(ex * sm, hy - 1.8 * sm, (ex - 0.3) * sm, hy - 3.6 * sm, 0.7, OL); bar(ex * sm, hy - 1.8 * sm, (ex - 0.3) * sm, hy - 3.4 * sm, 0.45, cfg.ear); } }
    else { for (const ex of [4.8, 6.4]) { bar(ex * sm, hy - 1.6 * sm, (ex - 0.3) * sm, hy - 3.2 * sm, 0.7, OL); bar(ex * sm, hy - 1.6 * sm, (ex - 0.3) * sm, hy - 3.0 * sm, 0.45, cfg.body); } }
    blk(hx + 0.7 * sm, hy - 0.5, 1.0 * sm, 0.8, cfg.eye); blk(hx + 0.5 * sm, hy - 0.7, 1.4 * sm, 1.2, cfg.eye, 0.22);
    blk(hx + 2.8 * sm, hy + 0.4, 0.6, 0.6, OL); // nose
    if (cfg.fang) { blk(hx + 1.6 * sm, hy + 1.4, 0.4, 0.8, '#ffffff'); blk(hx + 2.4 * sm, hy + 1.4, 0.4, 0.8, '#ffffff'); }
  }

  function drawImp() {
    const hover = Math.sin(t * 3) * 0.6, wing = Math.sin(t * F);
    shadowOval(5);
    // tail
    bar(-2, 4, -5, 5 + hover, 0.6, OL); bar(-2, 4, -5, 5 + hover, 0.4, cfg.bodySh); blk(-5.6, 4.4 + hover, 1.4, 1.4, OL); bar(-5, 5 + hover, -6.2, 3.8 + hover, 0.4, cfg.accent || cfg.bodyLt);
    // wings
    for (const d2 of [-1, 1]) { const wy = -8 - Math.abs(wing) * 2 * (d2 > 0 ? 1 : 0.8); bar(d2 * 1, -3 + hover, d2 * 5, wy + hover, 1.0, OL); bar(d2 * 1, -3 + hover, d2 * 5, wy + hover, 0.7, cfg.bodySh); blk(d2 > 0 ? 3 : -6, wy + hover, 3, 3, cfg.bodySh, 0.8); }
    // legs (short)
    for (const side of [-1, 1]) { limb(side * 1.2, 3 + hover, side * 1.6, 7 + hover, 0.85, cfg.bodySh); blk(side * 1.6 - 0.9, 6.6 + hover, 1.8, 1.2, OL); }
    // body
    limb(0, 4 + hover, 0, -3 + hover, 2.4, cfg.body);
    blk(-0.6, -2 + hover, 1.4, 6, cfg.bodyLt, 0.5);
    // head
    ball(0.4, -6 + hover, 2.2, cfg.body);
    for (const d2 of [-1.3, 1.3]) { bar(d2, -7.4 + hover, d2 * 1.6, -9.6 + hover, 0.55, OL); bar(d2, -7.4 + hover, d2 * 1.6, -9.4 + hover, 0.35, cfg.bodySh); }
    const ex = flip ? -0.7 : 0.0; blk(ex - 0.8, -6.2 + hover, 0.8, 0.8, cfg.eye); blk(ex + 0.6, -6.2 + hover, 0.8, 0.8, cfg.eye);
    blk(-0.8, -4.6 + hover, 2.0, 0.5, OL, 0.7); // grin
    // fire hand
    if (cfg.fireHand) { const fx = 2.8, fy = 0 + hover; limb(1.2, -1 + hover, fx, fy, 1.0, cfg.bodyLt); const pulse = 0.7 + 0.3 * Math.sin(t * 10); disc(fx + 0.6, fy, 1.6 * pulse, '#ff7722', 0.85); disc(fx + 0.6, fy, 0.9, '#ffdd55'); disc(fx + 0.6, fy, 0.4, '#ffffff'); }
    else limb(1.2, -1 + hover, 2.6, 1 + hover, 1.0, cfg.bodyLt);
  }

  function drawWraith() {
    const hover = Math.sin(t * 3) * 0.7;
    ctx.globalAlpha = 0.18 * baseA; ctx.fillStyle = '#000'; ctx.fillRect(Math.round(cx - 5 * s), Math.round(cy + 9 * s), 10 * s, Math.round(1.2 * s)); ctx.globalAlpha = 1;
    // tattered lower wisps
    for (let i = 0; i < 5; i++) { const wx = -3.2 + i * 1.6; const wl = 4 + Math.sin(t * 4 + i) * 1.6 + (i % 2) * 1.5; bar(wx, 2 + hover, wx + Math.sin(t * 3 + i) * 1.2, 2 + hover + wl, 1.0, OL); bar(wx, 2 + hover, wx + Math.sin(t * 3 + i) * 1.2, 2 + hover + wl, 0.7, cfg.bodySh); }
    // cloak body
    limb(0, 3 + hover, 0, -4 + hover, 3.0, cfg.body);
    blk(-3.2, -4 + hover, 6.4, 7, cfg.body, 0.6);
    blk(-2.6, -3 + hover, 1.0, 6, cfg.bodyLt, 0.4);
    // hood
    ball(0, -6 + hover, 2.9, cfg.body);
    disc(0, -5.4 + hover, 2.3, OL, 0.85); // dark face void
    const ex = flip ? -1.1 : 0.2; disc(ex, -6 + hover, 0.6, cfg.eye); disc(ex + 1.4, -6 + hover, 0.6, cfg.eye);
    disc(ex, -6 + hover, 1.0, cfg.eye, 0.25); disc(ex + 1.4, -6 + hover, 1.0, cfg.eye, 0.25);
    // claws
    if (cfg.claws) for (const d2 of [-1, 1]) { const hx = d2 * 3.2, hy = 1 + hover; for (let k = -1; k <= 1; k++) bar(hx, hy, hx + d2 * 1.4, hy + 2 + k * 0.8, 0.4, cfg.bodyLt); }
  }

  function drawCaster() {
    const hover = Math.sin(t * 2.6) * 0.6;
    ctx.globalAlpha = 0.2 * baseA; ctx.fillStyle = '#000'; ctx.fillRect(Math.round(cx - 5 * s), Math.round(cy + 9 * s), 10 * s, Math.round(1.2 * s)); ctx.globalAlpha = 1;
    // robe to floor (flared)
    for (let yy = -2; yy <= 8; yy++) { const tt = (yy + 2) / 10; const hw = 1.8 + tt * 3.2; const off = Math.sin(t * 2 + tt * 3) * 0.6 * tt; blk(-hw - 0.4 + off, yy + hover * (1 - tt), hw * 2 + 0.8, 1.2, OL); }
    for (let yy = -2; yy <= 8; yy++) { const tt = (yy + 2) / 10; const hw = 1.8 + tt * 3.2; const off = Math.sin(t * 2 + tt * 3) * 0.6 * tt; blk(-hw + off, yy + hover * (1 - tt), hw * 2, 1.1, cfg.body); blk(-0.7 + off, yy + hover * (1 - tt), 1.4, 1.1, cfg.bodyLt, 0.5); blk(-hw + off, yy + hover * (1 - tt), 1.0, 1.1, cfg.bodySh, 0.7); }
    // hem fringe
    for (let i = 0; i < 7; i++) blk(-5 + i * 1.5, 8.6, 1.0, 0.6 + (i % 2) * 0.8, cfg.body);
    // hood
    ball(0, -4 + hover, 2.8, cfg.body);
    disc(0.3, -3.4 + hover, 2.2, OL, 0.8);
    const ex = flip ? -1.0 : 0.4; disc(ex, -4 + hover, 0.55, cfg.eye); disc(ex + 1.2, -4 + hover, 0.55, cfg.eye); disc(ex + 0.6, -4 + hover, 1.4, cfg.eye, 0.2);
    blk(-0.6, -1.4 + hover, 1.4, 1.0, cfg.bodyLt, 0.6); // chest rune
    // orb in hand
    const ox = 3.6, oy = -0.5 + hover, pulse = 0.6 + 0.4 * Math.sin(t * 5);
    limb(1.4, -1 + hover, ox - 0.6, oy, 0.9, cfg.bodySh);
    disc(ox, oy, 1.8 * pulse, cfg.orb, 0.5); disc(ox, oy, 1.1, cfg.orb); disc(ox, oy, 0.5, '#ffffff');
  }
}
