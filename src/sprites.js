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
  // 0=outline 1=skin-shadow 2=skin 3=hair(brown) 4=tunic-dark(forest)
  // 5=tunic-light 6=boots/belt 7=bowstring 8=bow 9=eye
  palette: [
    '#1a0e08', '#a87850', '#e8c898', '#5a3a20',
    '#2a5530', '#4a8050', '#6a4828', '#e8d090',
    '#8a6230', '#1a0e08',
  ],
  rows: [
    '..00000...',  //  0  hair top
    '.0333330..',  //  1  hair
    '.0322230..',  //  2  forehead
    '.0392290..',  //  3  eyes
    '.0322220..',  //  4  cheeks
    '..00220...',  //  5  chin
    '.04444408.',  //  6  shoulders + bow notch
    '0455554408',  //  7  chest with bow tip
    '0455554478',  //  8  string + bow body
    '.04555408.',  //  9  waist + bow
    '.04555408.',  // 10  hips + bow
    '.04..40...',  // 11  legs
    '.04..40...',  // 12  legs
    '.06..60...',  // 13  boots
  ],
};

const SPRITE_WIZARD = {
  w: 10, h: 14,
  // 0=outline 1=skin-shadow 2=skin 3=beard(grey) 4=robe-dark(purple)
  // 5=robe-light 6=trim(gold) 7=staff-orb 8=staff-wood 9=eye
  palette: [
    '#1a0e08', '#a87850', '#e8c898', '#b0b0b8',
    '#3a2055', '#5a3a85', '#d8a838', '#aaccff',
    '#5a3a20', '#1a0e08',
  ],
  rows: [
    '..04440...',  //  0  pointed hat top
    '.0444440..',  //  1  hat
    '.0444440..',  //  2  hat brim
    '.0322230..',  //  3  forehead
    '.0392290.7',  //  4  eyes + orb glow
    '.0322220.8',  //  5  cheek + staff orb
    '.03333308.',  //  6  beard
    '0455554408',  //  7  shoulders robe
    '0455554408',  //  8  robe body + staff
    '0466666408',  //  9  belt
    '04555540.8',  // 10  hips
    '04555540.8',  // 11  robe
    '.04...0...',  // 12  hem
    '.04....0..',  // 13  hem
  ],
};

const SPRITE_WARRIOR = {
  w: 10, h: 14,
  // 0=outline 1=skin-shadow 2=skin 3=hair(red) 4=armor-dark(steel)
  // 5=armor-light 6=boots/leather 7=sword-hilt 8=sword-blade 9=eye
  palette: [
    '#1a0e08', '#a87850', '#e8c898', '#a83020',
    '#4a4a55', '#8a8a98', '#5a3a20', '#d8a838',
    '#d8d8e0', '#1a0e08',
  ],
  rows: [
    '..03330...',  //  0  hair top
    '.0333330..',  //  1  hair
    '.0322230..',  //  2  forehead
    '.0392290..',  //  3  eyes
    '.0322220.8',  //  4  cheek + sword tip
    '..00220..8',  //  5  chin + blade
    '.04444408.',  //  6  pauldrons + blade
    '0455554408',  //  7  chest plate
    '0455554478',  //  8  armor + hilt
    '0466666408',  //  9  belt + grip
    '.04555408.',  // 10  hips
    '.04...40..',  // 11  legs
    '.04...40..',  // 12  legs
    '.06...60..',  // 13  boots
  ],
};


const SPRITE_ROGUE = {
  w: 10, h: 14,
  // 0=outline 1=skin-shadow 2=skin 3=hood-dark 4=leather-dark 5=leather-light 6=belt 7=blade 8=hilt 9=eye-glow
  palette: [
    '#0e081a', '#a87850', '#e8c898', '#2a1048',
    '#4a2878', '#7848a8', '#1e0e38', '#c8c0e8',
    '#8858b0', '#cc88ff',
  ],
  rows: [
    '..03330...',  //  0  hood top
    '.0333330..',  //  1  hood
    '.0333340..',  //  2  hood brim (skin barely)
    '.0309940..',  //  3  glowing eyes
    '.0334430..',  //  4  mask shadow
    '..03430...',  //  5  chin guard
    '.04444487.',  //  6  shoulders + dagger tip
    '0455554487',  //  7  chest + dagger
    '0455554488',  //  8  body + dagger
    '0466666488',  //  9  belt + hilt
    '.04555488.',  // 10  hips
    '.04..4488.',  // 11  legs
    '.04..40...',  // 12  legs
    '.06..60...',  // 13  boots
  ],
};

const SPRITE_MONK = {
  w: 10, h: 14,
  // 0=outline 1=skin-shadow 2=skin 3=topknot 4=gi-dark 5=gi-light 6=sash-gold 7=wrap 8=accent 9=eye
  palette: [
    '#1a0e08', '#a87850', '#e8c898', '#2a1a08',
    '#7a3c10', '#d07028', '#d8a020', '#e8d098',
    '#a05818', '#1a0e08',
  ],
  rows: [
    '...03330..',  //  0  topknot tip
    '..033330..',  //  1  topknot
    '.0322230..',  //  2  forehead
    '.0392290..',  //  3  eyes
    '.0322220..',  //  4  cheeks
    '..00220...',  //  5  chin
    '.0444447..',  //  6  gi shoulders + raised fist
    '0455554477',  //  7  gi chest + fist out
    '0455554472',  //  8  gi body + bare forearm
    '0466666472',  //  9  sash + arm
    '.04555.7..',  // 10  hips + fist level
    '.04..40...',  // 11  legs
    '.04..40...',  // 12  legs
    '.02..20...',  // 13  bare feet
  ],
};

const SPRITE_PALADIN = {
  w: 10, h: 14,
  // 0=outline 1=skin-shadow 2=skin 3=gold-trim 4=plate-dark 5=plate-light 6=gold 7=hammer-head 8=haft 9=visor
  palette: [
    '#1a1008', '#a87850', '#e8c898', '#d8a828',
    '#4a4840', '#9a9888', '#c8a020', '#906820',
    '#4a2c18', '#1a1008',
  ],
  rows: [
    '..04440...',  //  0  helm dome top
    '.0444440..',  //  1  helm dome
    '.0444420..',  //  2  helm face gap
    '.0499940..',  //  3  visor slit (eyes)
    '.0444440..',  //  4  full visor lower
    '..04440...',  //  5  chin guard
    '.04444487.',  //  6  pauldrons + hammer head
    '0455556487',  //  7  chest plate + hammer
    '0455556488',  //  8  armor body + haft
    '0466666488',  //  9  belt + haft
    '5455556488',  // 10  hips + haft
    '.04..4488.',  // 11  legs
    '.04..40..8',  // 12  legs + butt end
    '.06..60...',  // 13  greaves
  ],
};

const SPRITE_WITCH_DOCTOR = {
  w: 10, h: 14,
  // 0=outline 1=skin-shadow 2=skin 3=bone-mask 4=robe-dark 5=robe-light 6=beads-orange 7=staff-glow 8=staff-wood 9=eye-hollow
  palette: [
    '#0a1208', '#a87850', '#e8c898', '#d8d0b0',
    '#183818', '#2a5828', '#d87020', '#77ff88',
    '#4a3018', '#0a1208',
  ],
  rows: [
    '.03333340.',  //  0  headdress wide
    '0333333330',  //  1  headdress
    '.0333340..',  //  2  skull mask top
    '.0399940..',  //  3  hollow eye sockets
    '.0333340..',  //  4  skull lower
    '..03340...',  //  5  jaw
    '.04444487.',  //  6  robe shoulders + staff glow
    '0455554487',  //  7  robe chest + staff
    '0455554488',  //  8  robe body
    '0466666488',  //  9  bead necklace + staff
    '.04555488.',  // 10  robe hem
    '.04..4488.',  // 11  legs
    '.04..4488.',  // 12  legs
    '.04..40.8.',  // 13  hem end + staff tip
  ],
};

const SPRITE_NECROMANCER = {
  w: 10, h: 14,
  // 0=outline 1=skin-shadow 2=skin(pale) 3=cowl-deep 4=robe-dark 5=robe-mid 6=trim-purple 7=bone-glow 8=staff-bone 9=eye-glow
  palette: [
    '#0e0818', '#907060', '#d8c8b8', '#0a0618',
    '#1a1230', '#2e224a', '#6644a0', '#ddccff',
    '#9988cc', '#cc00ff',
  ],
  rows: [
    '..03330...',  //  0  cowl peak
    '.0333330..',  //  1  cowl deep
    '.0333330..',  //  2  cowl shadow
    '.0309930..',  //  3  pale glowing eyes
    '.0333320..',  //  4  lower cowl (pale jaw)
    '..03320...',  //  5  chin
    '.04444487.',  //  6  robe shoulders + staff glow
    '0455554487',  //  7  robe chest + staff
    '0455554488',  //  8  robe body
    '0466554488',  //  9  robe trim + staff
    '.04555488.',  // 10  robe hem
    '.04..4488.',  // 11  legs
    '.04..4488.',  // 12  legs
    '.04..40.8.',  // 13  hem + staff tip
  ],
};

const PLAYER_SPRITES = {
  archer:      SPRITE_ARCHER,
  wizard:      SPRITE_WIZARD,
  warrior:     SPRITE_WARRIOR,
  rogue:       SPRITE_ROGUE,
  monk:        SPRITE_MONK,
  paladin:     SPRITE_PALADIN,
  witchdoctor: SPRITE_WITCH_DOCTOR,
  necromancer: SPRITE_NECROMANCER,
};


// ============================================================
// ITEM SPRITES — 8×8 pixel icons for each gear/weapon base.
// Rendered via drawSprite at scale 2 = 16×16 display pixels,
// centred inside each equipment/inventory slot.
// Palette slot 0 = dark outline; 1/2/3 = body colors.
// ============================================================
const ITEM_SPRITES = {
  // ── ARMOR ────────────────────────────────────────────────
  cap: {
    w: 8, h: 8,
    palette: ['#1a1008','#7a5030','#c08050','#3a2818'],
    rows: [
      '..0110..',  // dome top
      '.011110.',  // dome
      '01111110',  // brim row
      '00000000',  // brim flat
      '.0....0.',  // cheek guards
      '.0....0.',  // cheek guards
      '.000000.',  // chin
      '........',
    ],
  },
  tunic: {
    w: 8, h: 8,
    palette: ['#1a1008','#3a5060','#5a7888','#2a3840'],
    rows: [
      '0.0000.0',  // epaulettes
      '01111110',  // neckline
      '01222110',  // chest
      '01222110',  // body
      '01222110',  // body
      '01222110',  // lower
      '0.0110.0',  // hem split
      '........',
    ],
  },
  gloves: {
    w: 8, h: 8,
    palette: ['#1a1008','#6a4028','#a06840','#3a2010'],
    rows: [
      '.011.010',  // finger tips
      '01111110',  // fingers
      '01111110',  // knuckles
      '.011110.',  // palm
      '.011110.',  // palm
      '..0110..',  // cuff
      '........',
      '........',
    ],
  },
  boots: {
    w: 8, h: 8,
    palette: ['#1a1008','#4a2810','#7a4820','#2a1808'],
    rows: [
      '..0110..',  // shin top
      '.011110.',  // shin
      '.011110.',  // shin
      '01111110',  // ankle fill
      '01111100',  // toe begins
      '01111110',  // foot
      '00000000',  // sole
      '........',
    ],
  },
  belt: {
    w: 8, h: 8,
    palette: ['#1a1008','#4a2810','#c8901c','#7a4820'],
    rows: [
      '........',
      '01111110',  // top strap
      '01111110',  // strap
      '01.22.10',  // buckle center
      '01111110',  // strap
      '01111110',  // bottom strap
      '........',
      '........',
    ],
  },
  // ── JEWELRY ─────────────────────────────────────────────
  amulet: {
    w: 8, h: 8,
    palette: ['#1a1008','#888898','#88ccff','#4488cc'],
    rows: [
      '...01...',  // chain
      '..0110..',  // chain
      '.011110.',  // pendant
      '01222210',  // gem wide
      '.012210.',  // gem
      '..0220..',  // gem bottom
      '...02...',  // tip
      '........',
    ],
  },
  ring: {
    w: 8, h: 8,
    palette: ['#1a1008','#b89020','#ffe060','#805810'],
    rows: [
      '..0000..',
      '.0....0.',
      '0..22..0',  // gem
      '0..22..0',
      '0......0',
      '.0....0.',
      '..0000..',
      '........',
    ],
  },
  // ── WEAPONS ─────────────────────────────────────────────
  bow: {
    w: 8, h: 8,
    palette: ['#1a1008','#6a3e10','#c0a060','#d8d8d8'],
    rows: [
      '.0....3.',  // bow tip + string
      '.010..3.',  // bow curve
      '.010.030',  // bow + string mid
      '.010.030',
      '.010.030',
      '.010..3.',
      '.0....3.',  // bow tip + string
      '........',
    ],
  },
  quiver: {
    w: 8, h: 8,
    palette: ['#1a1008','#5a3010','#c09030','#c0a060'],
    rows: [
      '.333333.',  // arrow flights
      '.011110.',  // quiver top
      '01111110',
      '01111110',
      '01111110',
      '01111110',
      '.011110.',  // quiver bottom
      '........',
    ],
  },
  sword: {
    w: 8, h: 8,
    palette: ['#1a1008','#d0d0e0','#f0f0ff','#c0a020'],
    rows: [
      '......01',  // tip
      '.....010',  // blade
      '....0100',  // blade
      '...01300',  // guard start
      '..030100',  // crossguard
      '.030.0..',  // grip
      '030.....',  // pommel
      '0.......',
    ],
  },
  axe: {
    w: 8, h: 8,
    palette: ['#1a1008','#d0c8c0','#e8e0d8','#6a4020'],
    rows: [
      '...0000.',  // top of blade
      '..01110.',  // blade body
      '.0111100',  // blade wide
      '0111130.',  // blade + haft
      '.0111130',  // blade + haft
      '..01130.',  // lower
      '...030..',  // haft
      '...030..',  // haft end
    ],
  },
  dagger: {
    w: 8, h: 8,
    palette: ['#1a1008','#d0d0e0','#f0f0ff','#c0a020'],
    rows: [
      '....001.',  // tip
      '...0110.',  // blade
      '..01130.',  // guard
      '.030.0..',  // hilt
      '030.....',  // pommel
      '0.......',
      '........',
      '........',
    ],
  },
  staff: {
    w: 8, h: 8,
    palette: ['#1a1008','#6a4820','#aaccff','#7799ff'],
    rows: [
      '..0220..',  // orb top
      '.022220.',  // orb
      '.022220.',  // orb
      '..0220..',  // orb bottom
      '...10...',  // shaft
      '...10...',
      '...10...',
      '...10...',
    ],
  },
  wand: {
    w: 8, h: 8,
    palette: ['#1a1008','#6a3010','#ff88ff','#cc44cc'],
    rows: [
      '..0220..',  // gem
      '..0220..',  // gem
      '...10...',  // neck
      '...10...',  // handle
      '...10...',
      '...10...',
      '...10...',
      '........',
    ],
  },
  mace: {
    w: 8, h: 8,
    palette: ['#1a1008','#d0c0a0','#e8d8b8','#6a4820'],
    rows: [
      '.011110.',  // head
      '01111110',  // head
      '01111110',  // head
      '.011110.',  // neck
      '...30...',  // haft
      '...30...',
      '...30...',
      '...30...',
    ],
  },
  // ── OFF-HANDS ────────────────────────────────────────────
  shield: {
    w: 8, h: 8,
    palette: ['#1a1008','#5a5050','#9a9090','#d0a820'],
    rows: [
      '01111110',  // top
      '01222210',  // body
      '01222210',  // boss center
      '01232210',  // boss stud (gold 3)
      '01222210',  // body
      '.012210.',  // taper
      '..0110..',  // point
      '...00...',
    ],
  },
  orb: {
    w: 8, h: 8,
    palette: ['#1a1008','#2a1848','#8860e0','#ccaaff'],
    rows: [
      '..0110..',
      '.013310.',  // bright top highlight
      '.022220.',
      '01222210',  // widest
      '.022220.',
      '.012210.',
      '..0110..',
      '........',
    ],
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

const BOSS_SPRITES = {
  BoneLord:     SPRITE_BONELORD,
  IceGiant:     SPRITE_ICEGIANT,
  Pyromancer:   SPRITE_PYROMANCER,
  SlayerKiller: SPRITE_SLAYERKILLER,
};
