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

const PLAYER_SPRITES = {
  ranger:      SPRITE_ARCHER,       // Archer sprite repurposed for Ranger
  sorcerer:    SPRITE_WIZARD,       // Wizard sprite repurposed for Sorcerer
  berserker:   SPRITE_WARRIOR,      // Warrior sprite repurposed for Berserker
  assassin:    SPRITE_ROGUE,        // Rogue sprite repurposed for Assassin
  templar:     SPRITE_MONK,         // Monk sprite repurposed for Templar
  crusader:    SPRITE_PALADIN,      // Paladin sprite repurposed for Crusader
  shaman:      SPRITE_WITCH_DOCTOR, // Witch Doctor sprite repurposed for Shaman
  necromancer: SPRITE_NECROMANCER,
  druid:       SPRITE_DRUID,        // unique Druid sprite
  amazonian:   SPRITE_AMAZONIAN,    // unique Amazonian sprite
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
// BERSERKER ANIMATED SPRITE — PixelLab PNG frames
// 248×248px source, drawn at BERSERKER_DRAW_SIZE logical px.
// Only east direction loaded — flipped for west (facing left).
// ============================================================
const BERSERKER_DRAW_SIZE = 40; // tune this to taste

const _BERK_CDN = 'https://backblaze.pixellab.ai/file/pixellab-characters/' +
  'e24e58b2-a3f5-431f-9a72-1decbe56c99c/' +
  '077c2ac9-77c2-4aac-9595-269166c29ba2/animations/';

const BERSERKER_ANIM_CFG = {
  idle:   { id: '30439036-5547-4980-8405-718a58fe2e6b', count: 4, fps: 2,  loop: true  },
  run:    { id: '64784ee9-fce5-4468-b640-9a014474e96f', count: 4, fps: 8,  loop: true  },
  attack: { id: '6d7da304-028c-45bd-8737-ec8d6708760c', count: 5, fps: 12, loop: false },
};

// Shared preloaded frames — loaded once, reused by all Berserker Player instances.
const _berkFrames = { idle: [], run: [], attack: [] };
let _berkReady = false;

function _loadBerserkerFrames() {
  let total = 0, done = 0;
  for (const [state, cfg] of Object.entries(BERSERKER_ANIM_CFG)) {
    for (let i = 0; i < cfg.count; i++) {
      total++;
      const img = new Image();
      img.src = `${_BERK_CDN}${cfg.id}/east/${i}.png`;
      img.onload  = () => { if (++done >= total) _berkReady = true; };
      img.onerror = () => { ++done; };  // individual frame failure is non-fatal
      _berkFrames[state].push(img);
    }
  }
}
_loadBerserkerFrames();

class BerserkerAnimator {
  constructor() {
    this.state  = 'idle';
    this.frame  = 0;
    this.timer  = 0;
    this._attackLocked = false; // true while non-looping attack plays out
  }

  update(dt, isMoving, isAttacking) {
    // Trigger attack anim on swing start
    if (isAttacking && !this._attackLocked) {
      this.state = 'attack';
      this.frame = 0;
      this.timer = 0;
      this._attackLocked = true;
    }

    // Advance frame
    const cfg = BERSERKER_ANIM_CFG[this.state];
    this.timer += dt;
    const frameDur = 1 / cfg.fps;
    while (this.timer >= frameDur) {
      this.timer -= frameDur;
      this.frame++;
      if (this.frame >= cfg.count) {
        if (cfg.loop) {
          this.frame = 0;
        } else {
          this.frame = cfg.count - 1; // hold last frame
          this._attackLocked = false; // unlock so next swing can retrigger
        }
      }
    }

    // Return from completed attack to movement state
    if (!this._attackLocked && this.state === 'attack' && this.frame === cfg.count - 1) {
      const next = isMoving ? 'run' : 'idle';
      this.state = next;
      this.frame = 0;
      this.timer = 0;
    }

    // Switch between idle / run when not attacking
    if (this.state !== 'attack') {
      const want = isMoving ? 'run' : 'idle';
      if (want !== this.state) {
        this.state = want;
        this.frame = 0;
        this.timer = 0;
      }
    }
  }

  // Returns true if it drew, false to signal fallback to ASCII sprite.
  draw(ctx, cx, cy, flip, flash) {
    if (!_berkReady) return false;
    const imgs = _berkFrames[this.state];
    const img  = imgs[Math.min(this.frame, imgs.length - 1)];
    if (!img || !img.complete || img.naturalWidth === 0) return false;

    const s  = BERSERKER_DRAW_SIZE;
    const dx = flip ? cx + s / 2 : cx - s / 2; // negative dw handles mirror
    const dw = flip ? -s : s;

    ctx.save();
    if (flash) {
      // White-flash: draw normal then overlay
      ctx.drawImage(img, dx, cy - s / 2, dw, s);
      ctx.filter = 'brightness(10) saturate(0)';
      ctx.globalAlpha = 0.75;
      ctx.drawImage(img, dx, cy - s / 2, dw, s);
      ctx.filter = 'none';
      ctx.globalAlpha = 1;
    } else {
      ctx.drawImage(img, dx, cy - s / 2, dw, s);
    }
    ctx.restore();
    return true;
  }
}
