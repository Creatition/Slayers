// =============================================================================
// SLAYERS — src/data.js
// Constants, configs, abilities. Defines globals consumed by entities.js + index.html.
// Load order: data.js -> entities.js -> inline index.html script
// =============================================================================

// ============================================================
// CONSTANTS — meta / save / trials
// ============================================================
const STASH_SIZE_INIT = 10;
const SAVE_KEY = 'slayers-save';
const SAVE_VERSION = 1;
const TRIAL_MAX_TIER = 5;
const TRIAL_MULT = { 1: 1.5, 2: 2.0, 3: 2.7, 4: 3.6, 5: 5.0 };

// ============================================================
// BIOME
// ============================================================
const BIOME = {
  CRYPT:      { id: 'crypt',      name: 'The Crypt',        bg: '#15181a', grid: '#1d2220', decoColors: ['#3a3f3a', '#2a2e2a', '#4a4f44', '#557755'] },
  FROSTSPIRE: { id: 'frostspire', name: 'Frostspire Peaks', bg: '#1a2030', grid: '#232c3c', decoColors: ['#5a7090', '#3a4a60', '#88aabb', '#aaccff'] },
  INFERNO:    { id: 'inferno',    name: 'Infernal Depths',  bg: '#1a0e0a', grid: '#2a1410', decoColors: ['#5a2010', '#7a3020', '#aa4020', '#ff8040'] },
  VOID:       { id: 'void',       name: 'The Void Throne',  bg: '#10081a', grid: '#180c28', decoColors: ['#4a2a6a', '#3a1a5a', '#aa66ff', '#dd99ff'] },
};
function biomeFor(w) {
  if (w <= 5)  return BIOME.CRYPT;
  if (w <= 10) return BIOME.FROSTSPIRE;
  if (w <= 15) return BIOME.INFERNO;
  return BIOME.VOID;
}
function currentBiome() { return biomeFor(currentWave); }

// ============================================================
// ITEM SYSTEM
// ============================================================
const SLOT_ORDER = ['helm', 'amulet', 'chest', 'offhand', 'gloves', 'belt', 'boots', 'ring1', 'ring2', 'weapon'];
const SLOT_LABEL = {
  helm: 'HELM', chest: 'CHEST', gloves: 'GLOVES', boots: 'BOOTS', belt: 'BELT',
  amulet: 'AMULET', ring1: 'RING I', ring2: 'RING II', weapon: 'WEAPON', offhand: 'OFFHAND',
};
const RARITY = {
  WHITE:  { id: 'white',  name: 'Common',    color: '#cccccc', affixMin: 0, affixMax: 1, weight: 60, dmgMult: 1.00 },
  BLUE:   { id: 'blue',   name: 'Magic',     color: '#5599ff', affixMin: 2, affixMax: 3, weight: 25, dmgMult: 1.15 },
  YELLOW: { id: 'yellow', name: 'Rare',      color: '#ffcc33', affixMin: 4, affixMax: 4, weight: 10, dmgMult: 1.30 },
  ORANGE: { id: 'orange', name: 'Legendary', color: '#ff8000', affixMin: 4, affixMax: 4, weight: 4,  dmgMult: 1.50 },
  GREEN:  { id: 'green',  name: 'Set',       color: '#33cc55', affixMin: 4, affixMax: 4, weight: 1,  dmgMult: 1.40 },
};
const RARITY_LIST = [RARITY.WHITE, RARITY.BLUE, RARITY.YELLOW, RARITY.ORANGE, RARITY.GREEN];

const ITEM_BASES = [
  { id: 'cap',    name: 'Leather Cap',    slot: 'helm',    letter: 'H' },
  { id: 'tunic',  name: 'Leather Tunic',  slot: 'chest',   letter: 'C' },
  { id: 'gloves', name: 'Cloth Gloves',   slot: 'gloves',  letter: 'G' },
  { id: 'boots',  name: 'Soft Boots',     slot: 'boots',   letter: 'F' },
  { id: 'belt',   name: 'Worn Belt',      slot: 'belt',    letter: 'L' },
  { id: 'amulet', name: 'Tin Amulet',     slot: 'amulet',  letter: 'A' },
  { id: 'ring',   name: 'Iron Ring',      slot: 'ring',    letter: 'R' },
  { id: 'bow',    name: 'Hunter Bow',     slot: 'weapon',  letter: 'W' },
  { id: 'quiver', name: 'Tattered Quiver',slot: 'offhand', letter: 'Q' },
];
const AFFIX_POOL = [
  { id: 'maxhp',        min: 5,  max: 22, fmt: (v) => `+${v} Max HP`,         apply: (p, v) => { p.bonusMaxHp += v; } },
  { id: 'dmg_pct',      min: 5,  max: 18, fmt: (v) => `+${v}% Damage`,        apply: (p, v) => { p.bonusDmgPct += v; } },
  { id: 'firerate_pct', min: 5,  max: 18, fmt: (v) => `+${v}% Attack Speed`,  apply: (p, v) => { p.bonusFireRatePct += v; } },
  { id: 'regen',        min: 1,  max: 3,  fmt: (v) => `+${v} HP/sec Regen`,   apply: (p, v) => { p.bonusRegen += v; } },
  { id: 'pickup',       min: 5,  max: 15, fmt: (v) => `+${v} Pickup Range`,   apply: (p, v) => { p.bonusPickupRange += v; } },
  { id: 'movespeed',    min: 5,  max: 15, fmt: (v) => `+${v} Move Speed`,     apply: (p, v) => { p.bonusMoveSpeed += v; } },
  { id: 'armor',        min: 1,  max: 5,  fmt: (v) => `+${v} Armor`,          apply: (p, v) => { p.bonusArmor += v; } },
  { id: 'crit_chance',  min: 2,  max: 9,  fmt: (v) => `+${v}% Crit Chance`,   apply: (p, v) => { p.bonusCritChance += v; } },
  { id: 'max_focus',    min: 5,  max: 25, fmt: (v) => `+${v} Max Focus`,      apply: (p, v) => { p.bonusMaxResource += v; } },
  { id: 'focus_regen',  min: 1,  max: 5,  fmt: (v) => `+${v} Focus/sec`,      apply: (p, v) => { p.bonusResourceRegen += v; } },
];

function rngInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function rngPick(arr) { return arr[rngInt(0, arr.length - 1)]; }
function pickWeightedRarity() {
  const total = RARITY_LIST.reduce((s, r) => s + r.weight, 0);
  let roll = Math.random() * total;
  for (const r of RARITY_LIST) { roll -= r.weight; if (roll <= 0) return r; }
  return RARITY.WHITE;
}
function rollAffixes(count) {
  const pool = AFFIX_POOL.slice();
  const out = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = rngInt(0, pool.length - 1);
    const def = pool.splice(idx, 1)[0];
    out.push({ def, value: rngInt(def.min, def.max) });
  }
  return out;
}
let nextItemId = 1;
function generateItem() {
  const rarity = pickWeightedRarity();
  const base = rngPick(ITEM_BASES);
  return { id: nextItemId++, base, rarity, affixes: rollAffixes(rngInt(rarity.affixMin, rarity.affixMax)) };
}
function itemDisplayName(item) { return `${item.rarity.name} ${item.base.name}`; }

// ============================================================
// ECONOMY
// ============================================================
const RARITY_PRICE = { white: 12, blue: 30, yellow: 80, orange: 200, green: 250 };
const RARITY_MAT   = { white: 'bone', blue: 'arcane', yellow: 'essence', orange: 'fragment', green: 'fragment' };
const RARITY_REROLL = {
  white:  { gold: 5,   mat: 'bone',     count: 1 },
  blue:   { gold: 15,  mat: 'arcane',   count: 1 },
  yellow: { gold: 40,  mat: 'essence',  count: 1 },
  orange: { gold: 100, mat: 'fragment', count: 1 },
  green:  { gold: 80,  mat: 'fragment', count: 1 },
};
const MAT_LABELS = { bone: 'BONE', arcane: 'ARCANE', essence: 'ESSENCE', fragment: 'FRAGMENT' };
const MAT_COLORS = { bone: '#d0d0c0', arcane: '#5599ff', essence: '#ffcc33', fragment: '#ff8000' };
function itemPrice(item) { return RARITY_PRICE[item.rarity.id] || 10; }
function rerollSpec(item) { return RARITY_REROLL[item.rarity.id]; }
function salvageGold(item) { return Math.floor(itemPrice(item) * 0.5); }

// ============================================================
// CLASS SYSTEM
// ============================================================
const CLASS = {
  ARCHER: {
    id: 'archer', name: 'Archer', color: '#7ad96b',
    desc: 'Fast and crit-heavy. Auto-fires arrows. Crits refund Focus.',
    baseMaxHp: 80, baseSpeed: 105, baseCritChance: 5,
    weaponDamage: 4, weaponFireRate: 2.2, weaponRange: 210, weaponProjSpeed: 290,
    resourceName: 'FOCUS', resourceColor: '#ffd23f',
    baseMaxResource: 100, baseResourceRegen: 15, critResourceGain: 18,
    signature: 'multishot',
  },
  WIZARD: {
    id: 'wizard', name: 'Wizard', color: '#5599ff',
    desc: 'Glass cannon. Slow heavy spells. Bigger Mana pool, slower regen.',
    baseMaxHp: 60, baseSpeed: 95, baseCritChance: 3,
    weaponDamage: 7, weaponFireRate: 1.4, weaponRange: 240, weaponProjSpeed: 240,
    resourceName: 'MANA', resourceColor: '#5599ff',
    baseMaxResource: 140, baseResourceRegen: 8, critResourceGain: 0,
    signature: 'fireball',
  },
  WARRIOR: {
    id: 'warrior', name: 'Warrior', color: '#cc4040',
    desc: 'Tanky melee cleaver. Rage builds from dealing and taking hits.',
    baseMaxHp: 140, baseSpeed: 90, baseCritChance: 4,
    weaponDamage: 11, weaponFireRate: 1.6, weaponRange: 52, weaponProjSpeed: 1,
    meleeRange: 52,
    rageOnHit: 5, rageOnTake: 12,
    resourceName: 'RAGE', resourceColor: '#ff6060',
    baseMaxResource: 150, baseResourceRegen: 0, critResourceGain: 0,
    signature: 'whirlwind',
  },
};
function getClassById(id) {
  if (id === 'wizard') return CLASS.WIZARD;
  if (id === 'warrior') return CLASS.WARRIOR;
  return CLASS.ARCHER;
}

// ============================================================
// ABILITIES
// ============================================================
const ABILITIES = {
  multishot: {
    id: 'multishot', name: 'Multishot', letter: 'M', classOf: 'archer',
    desc: '3 arrows in spread (+20% dmg)',
    cost: 25, cooldown: 1.8, color: '#ffd23f',
    cast: (player, slot) => {
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const target = findNearestEnemy(player.x, player.y, player.weaponRange * 1.5);
      if (!target) return false;
      const baseAngle = Math.atan2(target.y - player.y, target.x - player.x);
      const arrows = slot && slot.rarity && slot.rarity.id === 'orange' ? 5 : 3;
      const halfSpread = arrows > 3 ? 0.46 : 0.35;
      for (let i = 0; i < arrows; i++) {
        const t = arrows === 1 ? 0 : (i / (arrows - 1)) * 2 - 1;
        const a = baseAngle + t * halfSpread;
        const sp = player.weaponProjSpeed;
        let dmg = player.weaponDamage * player.dmgMult * 1.20 * rDmg;
        const isCrit = Math.random() * 100 < player.critChance;
        if (isCrit) { dmg *= 2; player.onCrit(); }
        projectiles.push(new Projectile(player.x, player.y, Math.cos(a) * sp, Math.sin(a) * sp, dmg, player.weaponRange / sp + 0.15, isCrit));
      }
      spawnBurst(player.x, player.y, ['#ffd040', '#fff7a0', '#ffffff'], 8);
      shake = Math.min(shake + 1.5, 5);
      return true;
    },
  },
  rainOfArrows: {
    id: 'rainOfArrows', name: 'Rain of Arrows', letter: 'R', classOf: 'archer',
    desc: 'AoE rain on target (3x dmg)',
    cost: 40, cooldown: 4.0, color: '#ffaa44',
    cast: (player, slot) => {
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const target = findNearestEnemy(player.x, player.y, 280);
      if (!target) return false;
      const isLegend = slot && slot.rarity && slot.rarity.id === 'orange';
      const radius = isLegend ? 70 : 50;
      const dmg = player.weaponDamage * player.dmgMult * 3.0 * rDmg;
      for (const e of enemies) {
        if (!e.alive) continue;
        const dx = e.x - target.x, dy = e.y - target.y;
        if (dx*dx + dy*dy < radius*radius) {
          const isCrit = Math.random() * 100 < player.critChance;
          const finalDmg = isCrit ? dmg * 2 : dmg;
          const died = e.takeDamage(finalDmg);
          if (isCrit) player.onCrit();
          if (died) handleEnemyDeath(e);
        }
      }
      for (let i = 0; i < 28; i++) {
        const offX = (Math.random() - 0.5) * radius * 2;
        const offY = (Math.random() - 0.5) * radius * 2;
        if (offX*offX + offY*offY < radius*radius) {
          spawnBurst(target.x + offX, target.y + offY, ['#fff7a0', '#ffd040'], 2);
        }
      }
      shake = Math.min(shake + 3, 6);
      return true;
    },
  },
  piercingShot: {
    id: 'piercingShot', name: 'Piercing Shot', letter: 'P', classOf: 'archer',
    desc: 'Pierces all enemies (+150% dmg)',
    cost: 30, cooldown: 2.5, color: '#5599ff',
    cast: (player, slot) => {
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const target = findNearestEnemy(player.x, player.y, player.weaponRange * 2);
      if (!target) return false;
      const dx = target.x - player.x, dy = target.y - player.y;
      const d = Math.hypot(dx, dy);
      if (d < 0.01) return false;
      const sp = player.weaponProjSpeed * 1.4;
      let dmg = player.weaponDamage * player.dmgMult * 2.5 * rDmg;
      const isCrit = Math.random() * 100 < player.critChance;
      if (isCrit) { dmg *= 2; player.onCrit(); }
      const proj = new Projectile(player.x, player.y, (dx/d) * sp, (dy/d) * sp, dmg, 1.2, isCrit);
      proj.piercing = true;
      proj.r = 4;
      projectiles.push(proj);
      spawnBurst(player.x, player.y, ['#5599ff', '#aaccff'], 8);
      return true;
    },
  },
  hawkEye: {
    id: 'hawkEye', name: 'Hawk Eye', letter: 'E', classOf: 'archer',
    desc: '+30% crit & atk speed (5s)',
    cost: 50, cooldown: 12.0, color: '#33cc55',
    cast: (player, slot) => {
      const isLegend = slot && slot.rarity && slot.rarity.id === 'orange';
      player.hawkEyeTimer = isLegend ? 8 : 5;
      spawnBurst(player.x, player.y, ['#33cc55', '#88ff88', '#ffffff'], 12);
      return true;
    },
  },
  arrowVolley: {
    id: 'arrowVolley', name: 'Arrow Volley', letter: 'V', classOf: 'archer',
    desc: '8 arrows in full circle',
    cost: 35, cooldown: 3.0, color: '#ff8000',
    cast: (player, slot) => {
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const isLegend = slot && slot.rarity && slot.rarity.id === 'orange';
      const arrows = isLegend ? 12 : 8;
      for (let i = 0; i < arrows; i++) {
        const a = (i / arrows) * Math.PI * 2;
        const sp = player.weaponProjSpeed;
        let dmg = player.weaponDamage * player.dmgMult * 1.0 * rDmg;
        const isCrit = Math.random() * 100 < player.critChance;
        if (isCrit) { dmg *= 2; player.onCrit(); }
        projectiles.push(new Projectile(player.x, player.y, Math.cos(a) * sp, Math.sin(a) * sp, dmg, player.weaponRange / sp + 0.1, isCrit));
      }
      spawnBurst(player.x, player.y, ['#ff8000', '#ffaa00', '#ffd040'], 12);
      shake = Math.min(shake + 2, 5);
      return true;
    },
  },
  fireball: {
    id: 'fireball', name: 'Fireball', letter: 'F', classOf: 'wizard',
    desc: 'Big projectile, explodes on impact', cost: 30, cooldown: 1.5, color: '#ff5520',
    cast: (player, slot) => {
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const isLegend = slot && slot.rarity && slot.rarity.id === 'orange';
      const target = findNearestEnemy(player.x, player.y, player.weaponRange * 1.6);
      if (!target) return false;
      const dx = target.x - player.x, dy = target.y - player.y;
      const d = Math.hypot(dx, dy);
      if (d < 0.01) return false;
      const sp = player.weaponProjSpeed;
      let dmg = player.weaponDamage * player.dmgMult * 1.4 * rDmg;
      const isCrit = Math.random() * 100 < player.critChance;
      if (isCrit) { dmg *= 2; player.onCrit(); }
      const proj = new Projectile(player.x, player.y, (dx/d) * sp, (dy/d) * sp, dmg, d / sp + 0.15, isCrit);
      proj.r = 5;
      proj.theme = 'fire';
      proj.explosive = true;
      proj.explosionRadius = isLegend ? 60 : 40;
      proj.explosionDamage = dmg * 0.9;
      projectiles.push(proj);
      spawnBurst(player.x, player.y, ['#ff5520', '#ffaa00', '#ffdd00'], 8);
      return true;
    },
  },
  frostNova: {
    id: 'frostNova', name: 'Frost Nova', letter: 'N', classOf: 'wizard',
    desc: 'AoE around player, slows enemies', cost: 50, cooldown: 5.0, color: '#aaccff',
    cast: (player, slot) => {
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const isLegend = slot && slot.rarity && slot.rarity.id === 'orange';
      const radius = 80;
      const dmg = player.weaponDamage * player.dmgMult * 1.8 * rDmg;
      const slowDur = isLegend ? 4 : 2.5;
      for (const e of enemies) {
        if (!e.alive) continue;
        const dx = e.x - player.x, dy = e.y - player.y;
        if (dx*dx + dy*dy < radius*radius) {
          const isCrit = Math.random() * 100 < player.critChance;
          const finalDmg = isCrit ? dmg * 2 : dmg;
          const died = e.takeDamage(finalDmg);
          if (isCrit) player.onCrit();
          e.slowTimer = slowDur;
          e.slowFactor = 0.4;
          if (died) handleEnemyDeath(e);
        }
      }
      for (let i = 0; i < 36; i++) {
        const a = (i / 36) * Math.PI * 2;
        const r = 30 + Math.random() * radius;
        spawnBurst(player.x + Math.cos(a) * r * 0.6, player.y + Math.sin(a) * r * 0.6, ['#aaccff', '#5599ff', '#ffffff'], 2);
      }
      groundEffects.push({ type: 'shockwave', x: player.x, y: player.y, r: 10, maxR: radius, damage: 0, life: 0.5, maxLife: 0.5, color: '#aaccff', hit: new Set(), target: 'none' });
      shake = Math.min(shake + 2, 5);
      return true;
    },
  },
  chainLightning: {
    id: 'chainLightning', name: 'Chain Lightning', letter: 'L', classOf: 'wizard',
    desc: 'Hits target, chains to 3 nearby', cost: 40, cooldown: 2.5, color: '#ffff80',
    cast: (player, slot) => {
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const isLegend = slot && slot.rarity && slot.rarity.id === 'orange';
      const maxChains = isLegend ? 5 : 3;
      let target = findNearestEnemy(player.x, player.y, player.weaponRange * 1.4);
      if (!target) return false;
      const hit = new Set();
      let lastX = player.x, lastY = player.y;
      let dmg = player.weaponDamage * player.dmgMult * 1.8 * rDmg;
      for (let i = 0; i <= maxChains; i++) {
        if (!target || hit.has(target) || !target.alive) break;
        hit.add(target);
        const isCrit = Math.random() * 100 < player.critChance;
        const finalDmg = isCrit ? dmg * 2 : dmg;
        const died = target.takeDamage(finalDmg);
        if (isCrit) player.onCrit();
        const steps = 8;
        for (let s = 0; s <= steps; s++) {
          const lx = lastX + (target.x - lastX) * (s / steps) + (Math.random() - 0.5) * 6;
          const ly = lastY + (target.y - lastY) * (s / steps) + (Math.random() - 0.5) * 6;
          particles.push(new Particle(lx, ly, 0, 0, '#ffff80', 0.3, 2));
        }
        if (died) handleEnemyDeath(target);
        lastX = target.x; lastY = target.y;
        let nextBest = null, nextD = 90;
        for (const e of enemies) {
          if (!e.alive || hit.has(e)) continue;
          const d = Math.hypot(e.x - lastX, e.y - lastY);
          if (d < nextD) { nextD = d; nextBest = e; }
        }
        target = nextBest;
        dmg *= 0.8;
      }
      spawnBurst(player.x, player.y, ['#ffff80', '#ffffff'], 6);
      shake = Math.min(shake + 2, 5);
      return true;
    },
  },
  arcaneOrb: {
    id: 'arcaneOrb', name: 'Arcane Orb', letter: 'O', classOf: 'wizard',
    desc: 'Slow piercing orb, big damage', cost: 45, cooldown: 3.0, color: '#aa66ff',
    cast: (player, slot) => {
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const isLegend = slot && slot.rarity && slot.rarity.id === 'orange';
      const target = findNearestEnemy(player.x, player.y, player.weaponRange * 2);
      if (!target) return false;
      const dx = target.x - player.x, dy = target.y - player.y;
      const d = Math.hypot(dx, dy);
      if (d < 0.01) return false;
      const sp = player.weaponProjSpeed * 0.5;
      let dmg = player.weaponDamage * player.dmgMult * 3.0 * rDmg;
      const isCrit = Math.random() * 100 < player.critChance;
      if (isCrit) { dmg *= 2; player.onCrit(); }
      const proj = new Projectile(player.x, player.y, (dx/d) * sp, (dy/d) * sp, dmg, 2.5, isCrit);
      proj.piercing = true;
      proj.r = isLegend ? 8 : 6;
      proj.theme = 'arcane';
      projectiles.push(proj);
      spawnBurst(player.x, player.y, ['#aa66ff', '#dd99ff', '#ffffff'], 10);
      return true;
    },
  },
  whirlwind: {
    id: 'whirlwind', name: 'Whirlwind', letter: 'W', classOf: 'warrior',
    desc: 'Spin attack, big AoE around you', cost: 30, cooldown: 2.0, color: '#ff6060',
    cast: (player, slot) => {
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const isLegend = slot && slot.rarity && slot.rarity.id === 'orange';
      const radius = isLegend ? 95 : 75;
      const dmg = player.weaponDamage * player.dmgMult * 2.4 * rDmg * (player.warCryTimer > 0 ? 1.4 : 1);
      for (const e of enemies) {
        if (!e.alive) continue;
        const dx = e.x - player.x, dy = e.y - player.y;
        if (dx*dx + dy*dy < radius*radius) {
          const isCrit = Math.random() * 100 < player.critChance;
          const finalDmg = isCrit ? dmg * 2 : dmg;
          const died = e.takeDamage(finalDmg);
          spawnBurst(e.x, e.y, ['#cc4040', '#ff6060', '#ffaa40'], 4);
          if (isCrit) player.onCrit();
          if (died) { if (e.isBoss) handleBossDeath(e); else handleEnemyDeath(e); }
        }
      }
      for (let i = 0; i < 28; i++) {
        const a = (i / 28) * Math.PI * 2;
        spawnBurst(player.x + Math.cos(a) * radius * 0.7, player.y + Math.sin(a) * radius * 0.7, ['#cc4040', '#ff6060'], 2);
      }
      groundEffects.push({ type: 'shockwave', x: player.x, y: player.y, r: 10, maxR: radius, damage: 0, life: 0.4, maxLife: 0.4, color: '#ff6060', hit: new Set(), target: 'none' });
      shake = Math.min(shake + 3, 6);
      return true;
    },
  },
  cleave: {
    id: 'cleave', name: 'Cleave', letter: 'C', classOf: 'warrior',
    desc: 'Massive forward swing (250% dmg)', cost: 25, cooldown: 2.0, color: '#ffaa40',
    cast: (player, slot) => {
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const isLegend = slot && slot.rarity && slot.rarity.id === 'orange';
      const cone = isLegend ? 1.6 : 1.2;
      const range = 90;
      const dmg = player.weaponDamage * player.dmgMult * 2.6 * rDmg * (player.warCryTimer > 0 ? 1.4 : 1);
      const faceAngle = player.facing >= 0 ? 0 : Math.PI;
      let hitAny = false;
      for (const e of enemies) {
        if (!e.alive) continue;
        const dx = e.x - player.x, dy = e.y - player.y;
        if (dx*dx + dy*dy > range * range) continue;
        const ang = Math.atan2(dy, dx);
        let diff = Math.abs(ang - faceAngle);
        if (diff > Math.PI) diff = 2 * Math.PI - diff;
        if (diff < cone / 2) {
          hitAny = true;
          const isCrit = Math.random() * 100 < player.critChance;
          const finalDmg = isCrit ? dmg * 2 : dmg;
          const died = e.takeDamage(finalDmg);
          spawnBurst(e.x, e.y, ['#ffaa40', '#ff6020', '#ffffff'], 6);
          if (isCrit) player.onCrit();
          if (died) { if (e.isBoss) handleBossDeath(e); else handleEnemyDeath(e); }
        }
      }
      spawnBurst(player.x + player.facing * 20, player.y, ['#ffaa40', '#ff6020', '#ffffff'], 14);
      if (hitAny) shake = Math.min(shake + 4, 7);
      return true;
    },
  },
  warCry: {
    id: 'warCry', name: 'War Cry', letter: 'Y', classOf: 'warrior',
    desc: '+40% damage for 6s', cost: 50, cooldown: 14.0, color: '#cc4040',
    cast: (player, slot) => {
      const isLegend = slot && slot.rarity && slot.rarity.id === 'orange';
      player.warCryTimer = isLegend ? 10 : 6;
      spawnBurst(player.x, player.y, ['#cc4040', '#ff6060', '#ffaa40', '#ffffff'], 16);
      return true;
    },
  },
  charge: {
    id: 'charge', name: 'Charge', letter: 'H', classOf: 'warrior',
    desc: 'Dash to enemy, damage path (200% dmg)', cost: 35, cooldown: 3.0, color: '#ffaa40',
    cast: (player, slot) => {
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const target = findNearestEnemy(player.x, player.y, 250);
      if (!target) return false;
      const startX = player.x, startY = player.y;
      const dx = target.x - startX, dy = target.y - startY;
      const d = Math.hypot(dx, dy);
      if (d < 1) return false;
      const stepX = dx / d, stepY = dy / d;
      const pathW = 30;
      const dmg = player.weaponDamage * player.dmgMult * 2.0 * rDmg * (player.warCryTimer > 0 ? 1.4 : 1);
      for (const e of enemies) {
        if (!e.alive) continue;
        const ex = e.x - startX, ey = e.y - startY;
        const proj = ex * stepX + ey * stepY;
        if (proj < 0 || proj > d) continue;
        const perpX = ex - proj * stepX, perpY = ey - proj * stepY;
        if (Math.hypot(perpX, perpY) < pathW) {
          const isCrit = Math.random() * 100 < player.critChance;
          const finalDmg = isCrit ? dmg * 2 : dmg;
          const died = e.takeDamage(finalDmg);
          spawnBurst(e.x, e.y, ['#ff6020', '#ffaa40'], 5);
          if (isCrit) player.onCrit();
          if (died) { if (e.isBoss) handleBossDeath(e); else handleEnemyDeath(e); }
        }
      }
      player.x = Math.max(player.r, Math.min(W - player.r, target.x - stepX * 15));
      player.y = Math.max(player.r, Math.min(H - player.r, target.y - stepY * 15));
      for (let i = 0; i < 18; i++) {
        const t = i / 18;
        spawnBurst(startX + dx * t, startY + dy * t, ['#cc4040', '#ff6060'], 2);
      }
      shake = Math.min(shake + 3, 6);
      player.iframeTimer = Math.max(player.iframeTimer, 0.35);
      return true;
    },
  },
  groundSlam: {
    id: 'groundSlam', name: 'Ground Slam', letter: 'S', classOf: 'warrior',
    desc: 'AoE slam, slows enemies', cost: 45, cooldown: 4.5, color: '#cc6020',
    cast: (player, slot) => {
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const isLegend = slot && slot.rarity && slot.rarity.id === 'orange';
      const radius = isLegend ? 115 : 90;
      const dmg = player.weaponDamage * player.dmgMult * 2.2 * rDmg * (player.warCryTimer > 0 ? 1.4 : 1);
      const slowDur = isLegend ? 3.5 : 2.5;
      for (const e of enemies) {
        if (!e.alive) continue;
        const dx = e.x - player.x, dy = e.y - player.y;
        if (dx*dx + dy*dy < radius*radius) {
          const isCrit = Math.random() * 100 < player.critChance;
          const finalDmg = isCrit ? dmg * 2 : dmg;
          const died = e.takeDamage(finalDmg);
          e.slowTimer = slowDur;
          e.slowFactor = 0.45;
          if (isCrit) player.onCrit();
          if (died) { if (e.isBoss) handleBossDeath(e); else handleEnemyDeath(e); }
        }
      }
      groundEffects.push({ type: 'shockwave', x: player.x, y: player.y, r: 10, maxR: radius, damage: 0, life: 0.55, maxLife: 0.55, color: '#cc6020', hit: new Set(), target: 'none' });
      spawnBurst(player.x, player.y, ['#cc6020', '#ffaa40', '#ffffff'], 20);
      shake = Math.min(shake + 5, 9);
      return true;
    },
  },
  meteor: {
    id: 'meteor', name: 'Meteor', letter: 'T', classOf: 'wizard',
    desc: 'Falling meteor, big AoE (delay)', cost: 60, cooldown: 4.5, color: '#ff4400',
    cast: (player, slot) => {
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const isLegend = slot && slot.rarity && slot.rarity.id === 'orange';
      const target = findNearestEnemy(player.x, player.y, 280);
      if (!target) return false;
      const meteors = isLegend ? 2 : 1;
      const dmg = player.weaponDamage * player.dmgMult * 4.0 * rDmg;
      for (let i = 0; i < meteors; i++) {
        const offX = i === 0 ? 0 : (Math.random() - 0.5) * 60;
        const offY = i === 0 ? 0 : (Math.random() - 0.5) * 60;
        groundEffects.push({ type: 'meteor', x: target.x + offX, y: target.y + offY, r: 0, maxR: 55, damage: dmg, life: 1.0, maxLife: 1.0, color: '#ff4400', hit: new Set(), exploded: false, target: 'enemy' });
      }
      spawnBurst(player.x, player.y, ['#ff4400', '#ff8800', '#ffdd00'], 8);
      return true;
    },
  },
};
const ABILITY_LIST = Object.values(ABILITIES);
function classAbilities(classId) {
  return ABILITY_LIST.filter(a => !a.classOf || a.classOf === classId);
}

function castAbility(slotIdx) {
  if (slotIdx < 0 || slotIdx > 3) return;
  const slot = player.abilities[slotIdx];
  if (!slot) return;
  if (player.abilityCooldowns[slotIdx] > 0) return;
  if (player.resource < slot.def.cost) return;
  const ok = slot.def.cast(player, slot);
  if (ok) {
    player.resource -= slot.def.cost;
    player.abilityCooldowns[slotIdx] = slot.def.cooldown;
  }
}

// ============================================================
// LEVEL-UP STAT POOL
// ============================================================
const STAT_POOL = [
  { id: 'maxhp',       name: '+20 Max HP',        desc: 'Higher max + heal 20',  color: '#ff6b6b', apply: (p) => { p.baseMaxHp += 20; p.recomputeStats(); p.hp = Math.min(p.maxHp, p.hp + 20); } },
  { id: 'damage',      name: '+15% Damage',        desc: 'Hits hit harder',       color: '#ffaa44', apply: (p) => { p.baseDmgMult *= 1.15; p.recomputeStats(); } },
  { id: 'firerate',    name: '+20% Attack Speed',  desc: 'Fire faster',           color: '#ffd23f', apply: (p) => { p.baseFireRateMult *= 1.2; p.recomputeStats(); } },
  { id: 'pickup',      name: '+10 Pickup Range',   desc: 'Magnet items further',  color: '#9b59ff', apply: (p) => { p.basePickupRange += 10; p.recomputeStats(); } },
  { id: 'speed',       name: '+15 Move Speed',     desc: 'Run faster',            color: '#4ecdc4', apply: (p) => { p.baseSpeed += 15; p.recomputeStats(); } },
  { id: 'regen',       name: '+1 HP / sec',        desc: 'Passive healing',       color: '#7ad96b', apply: (p) => { p.baseRegen += 1; p.recomputeStats(); } },
  { id: 'focus_regen', name: '+3 Focus/sec',       desc: 'Regen abilities faster',color: '#ffd23f', apply: (p) => { p.baseResourceRegen += 3; p.recomputeStats(); } },
  { id: 'crit',        name: '+5% Crit Chance',    desc: 'More crits',            color: '#ff8800', apply: (p) => { p.baseCritChance += 5; p.recomputeStats(); } },
];
function rollLevelUpChoices() { return [...STAT_POOL].sort(() => Math.random() - 0.5).slice(0, 3); }

// ============================================================
// WAVE / BOSS LOGIC
// ============================================================
function isBossWave(w) { return w > 0 && w % 5 === 0; }
function isFinalWave(w) { return w === 20; }
function trialMultiplier() {
  if (runMode !== 'trial') return 1;
  return TRIAL_MULT[trialTier] || 1;
}
function waveConfig(w) {
  const tm = trialMultiplier();
  const speedTm = 1 + (tm - 1) * 0.4;
  return {
    duration:       isBossWave(w) ? 999 : Math.min(20 + (w - 1) * 3, 50),
    spawnInterval:  Math.max(0.7 - (w - 1) * 0.04, 0.18) / Math.sqrt(tm),
    enemyHpMult:    (1 + (w - 1) * 0.18) * tm,
    enemySpeedMult: (1 + (w - 1) * 0.04) * speedTm,
    enemyDmgMult:   (1 + (w - 1) * 0.08) * tm,
  };
}

// ============================================================
// ENEMY TYPES
// ============================================================
const ENEMY_TYPES = {
  skeleton:   { hp: 8,  speedRange: [38, 56],  dmg: 5,  r: 4, name: 'Skeleton' },
  zombie:     { hp: 18, speedRange: [22, 32],  dmg: 8,  r: 5, name: 'Zombie' },
  rat:        { hp: 3,  speedRange: [78, 100], dmg: 3,  r: 3, name: 'Crypt Rat' },
  yeti:       { hp: 28, speedRange: [28, 38],  dmg: 11, r: 6, name: 'Yeti' },
  frostWolf:  { hp: 7,  speedRange: [85, 110], dmg: 6,  r: 4, name: 'Frost Wolf' },
  imp:        { hp: 5,  speedRange: [60, 80],  dmg: 5,  r: 3, name: 'Imp', ranged: true },
  hellhound:  { hp: 16, speedRange: [55, 75],  dmg: 10, r: 4, name: 'Hellhound' },
  shadow:     { hp: 22, speedRange: [40, 55],  dmg: 12, r: 5, name: 'Shadow' },
  voidCaster: { hp: 12, speedRange: [25, 35],  dmg: 8,  r: 4, name: 'Void Caster', ranged: true },
};
function pickEnemyType(w) {
  const biome = biomeFor(w);
  if (biome === BIOME.CRYPT) {
    if (w === 1) return 'skeleton';
    if (w === 2) return Math.random() < 0.8 ? 'skeleton' : 'rat';
    if (w === 3) { const r = Math.random(); if (r < 0.5) return 'skeleton'; if (r < 0.75) return 'rat'; return 'zombie'; }
    const r = Math.random(); if (r < 0.4) return 'skeleton'; if (r < 0.7) return 'rat'; return 'zombie';
  }
  if (biome === BIOME.FROSTSPIRE) {
    const r = Math.random();
    if (r < 0.40) return 'frostWolf';
    if (r < 0.75) return 'yeti';
    return 'rat';
  }
  if (biome === BIOME.INFERNO) {
    const r = Math.random();
    if (r < 0.45) return 'imp';
    if (r < 0.80) return 'hellhound';
    return 'rat';
  }
  const r = Math.random();
  if (r < 0.40) return 'shadow';
  if (r < 0.75) return 'voidCaster';
  return 'zombie';
}
