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
  FROSTSPIRE: { id: 'frostspire', tier: 1, name: 'Frostspire Peaks', bg: '#1a2030', grid: '#232c3c', decoColors: ['#5a7090', '#3a4a60', '#88aabb', '#aaccff'] },
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
  WHITE:  { id: 'white',  name: 'Common',    color: '#cccccc', affixMin: 0, affixMax: 1, weight: 600, dmgMult: 1.00 },
  BLUE:   { id: 'blue',   name: 'Magic',     color: '#5599ff', affixMin: 2, affixMax: 3, weight: 290, dmgMult: 1.15 },
  YELLOW: { id: 'yellow', tier: 1, name: 'Rare',      color: '#ffcc33', affixMin: 4, affixMax: 4, weight: 100, dmgMult: 1.30 },
  // Legendary: ~0.9% base (feels special). Set: ~0.1% (incredibly rare).
  // Unique: never in this pool — drops via special boss conditions only.
  ORANGE: { id: 'orange', tier: 1, name: 'Legendary', color: '#ff8000', affixMin: 4, affixMax: 4, weight: 9,   dmgMult: 1.50 },
  GREEN:  { id: 'green',  name: 'Set',       color: '#33cc55', affixMin: 4, affixMax: 4, weight: 1,   dmgMult: 1.40 },
};
const RARITY_LIST = [RARITY.WHITE, RARITY.BLUE, RARITY.YELLOW, RARITY.ORANGE, RARITY.GREEN];

const ITEM_BASES = [
  // Armor — maxSockets: chest/offhand get 2, small pieces get 1
  { id: 'cap',    name: 'Leather Cap',    slot: 'helm',    letter: 'H', maxSockets: 1 },
  { id: 'tunic',  name: 'Leather Tunic',  slot: 'chest',   letter: 'C', maxSockets: 2 },
  { id: 'gloves', tier: 1, name: 'Cloth Gloves',   slot: 'gloves',  letter: 'G', maxSockets: 1 },
  { id: 'boots',  name: 'Soft Boots',     slot: 'boots',   letter: 'F', maxSockets: 1 },
  { id: 'belt',   name: 'Worn Belt',      slot: 'belt',    letter: 'L', maxSockets: 1 },
  // Jewelry — amulet gets 1 socket, rings get 0 (too small)
  { id: 'amulet', tier: 1, name: 'Tin Amulet',     slot: 'amulet',  letter: 'A', maxSockets: 1 },
  { id: 'ring',   name: 'Iron Ring',      slot: 'ring',    letter: 'R', maxSockets: 0 },
  // Weapons — 2 sockets each
  { id: 'bow',    name: 'Hunter Bow',     slot: 'weapon',  letter: 'W', kind: 'ranged', maxSockets: 2 },
  { id: 'sword',  name: 'Iron Sword',     slot: 'weapon',  letter: 'W', kind: 'melee',  maxSockets: 2 },
  { id: 'axe',    name: 'Hand Axe',       slot: 'weapon',  letter: 'W', kind: 'melee',  maxSockets: 2 },
  { id: 'dagger', tier: 1, name: 'Sharp Dagger',   slot: 'weapon',  letter: 'W', kind: 'melee',  maxSockets: 2 },
  { id: 'staff',  name: 'Gnarled Staff',  slot: 'weapon',  letter: 'W', kind: 'ranged', maxSockets: 2 },
  { id: 'wand',   name: 'Carved Wand',    slot: 'weapon',  letter: 'W', kind: 'ranged', maxSockets: 2 },
  { id: 'mace',   name: 'Spiked Mace',    slot: 'weapon',  letter: 'W', kind: 'melee',  maxSockets: 2 },
  // Off-hands — shield/offhand get 2, quiver gets 1
  { id: 'quiver', tier: 1, name: 'Tattered Quiver',slot: 'offhand', letter: 'Q', maxSockets: 1 },
  { id: 'shield', tier: 1, name: 'Wooden Shield',  slot: 'offhand', letter: 'O', maxSockets: 2 },
  { id: 'orb',    name: 'Magic Orb',      slot: 'offhand', letter: 'O', maxSockets: 2 },
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
function pickWeightedRarity(iLvl) {
  iLvl = iLvl || 1;
  // Set items only drop at iLvl 20+. Legendary suppressed early too.
  const effective = RARITY_LIST.map(r => {
    if (r.id === 'green'  && iLvl < 20) return { ...r, weight: 0 };
    if (r.id === 'orange' && iLvl < 10) return { ...r, weight: Math.floor(r.weight * 0.2) };
    return r;
  });
  const total = effective.reduce((s, r) => s + r.weight, 0);
  let roll = Math.random() * total;
  for (const r of effective) { roll -= r.weight; if (roll <= 0) return RARITY_LIST.find(x=>x.id===r.id) || r; }
  return RARITY.WHITE;
}
function rollAffixes(count, iLvl) {
  iLvl = iLvl || 40; // default full value for legacy calls
  const scale = Math.max(0.3, 0.3 + 0.7 * (iLvl / 40)); // 30% at iLvl1 → 100% at iLvl40
  const pool = AFFIX_POOL.slice();
  const out = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = rngInt(0, pool.length - 1);
    const def = pool.splice(idx, 1)[0];
    const min = Math.max(1, Math.round(def.min * scale));
    const max = Math.max(min, Math.round(def.max * scale));
    out.push({ def, value: rngInt(min, max) });
  }
  return out;
}
let nextItemId = 1;
function _tagItem(item, iLvl) {
  item.itemLevel = iLvl || 1;
  item.sockets = []; // empty socket slots — Blacksmith adds actual socket slots
  if (item.rarity.id === 'green' && typeof SET_DEFS !== 'undefined' && SET_DEFS.length)
    item.setId = rngPick(SET_DEFS).id;
  if (item.rarity.id === 'orange' && typeof LEGENDARY_EFFECTS !== 'undefined' && LEGENDARY_EFFECTS.length)
    item.legendaryEffectId = rngPick(LEGENDARY_EFFECTS).id;
  return item;
}
function generateItem(iLvl) {
  if (iLvl === undefined) iLvl = typeof charLevel !== 'undefined' ? charLevel : 1;
  iLvl = Math.max(1, Math.min(40, iLvl));
  const rarity = pickWeightedRarity(iLvl);
  const base = rngPick(ITEM_BASES);
  const count = rngInt(rarity.affixMin, rarity.affixMax);
  return _tagItem({ id: nextItemId++, base, rarity, affixes: rollAffixes(count, iLvl) }, iLvl);
}
// Generate item with at least a minimum rarity (for elite drops)
function generateItemMinRarity(minId, iLvl) {
  if (iLvl === undefined) iLvl = typeof charLevel !== 'undefined' ? charLevel : 1;
  iLvl = Math.max(1, Math.min(40, iLvl));
  const order = { white: 0, blue: 1, yellow: 2, orange: 3, green: 4 };
  let rarity = pickWeightedRarity(iLvl);
  for (let i = 0; i < 20 && order[rarity.id] < order[minId]; i++) rarity = pickWeightedRarity(iLvl);
  if (order[rarity.id] < order[minId])
    rarity = RARITY_LIST.find(r => r.id === minId) || RARITY.YELLOW;
  const base = rngPick(ITEM_BASES);
  const count = rngInt(rarity.affixMin, rarity.affixMax);
  return _tagItem({ id: nextItemId++, base, rarity, affixes: rollAffixes(count, iLvl) }, iLvl);
}
// Class-biased item: prefers the class's weapon types, falls back to random
const CLASS_PREFERRED_BASES = {
  ranger:      ['bow','quiver','dagger','ring','amulet'],
  sorcerer:      ['staff','wand','orb','ring','amulet'],
  berserker:     ['sword','axe','mace','shield','belt'],
  assassin:       ['dagger','bow','ring','amulet','gloves'],
  templar:        ['orb','ring','gloves','amulet','boots'],
  crusader:     ['mace','shield','sword','belt','amulet'],
  shaman: ['staff','wand','orb','ring','amulet'],
  necromancer: ['staff','orb','wand','ring','amulet'],
  druid:       ['staff','orb','ring','amulet','boots'],
  amazonian:   ['bow','quiver','ring','amulet','gloves'],
};
function generateItemForClass(classId) {
  const preferred = CLASS_PREFERRED_BASES[classId] || [];
  // 55% chance to pick from preferred bases (if any)
  let base;
  if (preferred.length > 0 && Math.random() < 0.55) {
    const prefBases = ITEM_BASES.filter(b => preferred.includes(b.id));
    base = prefBases.length > 0 ? rngPick(prefBases) : rngPick(ITEM_BASES);
  } else {
    base = rngPick(ITEM_BASES);
  }
  if (typeof iLvl === 'undefined' || iLvl === undefined) iLvl = typeof charLevel !== 'undefined' ? charLevel : 1;
  iLvl = Math.max(1, Math.min(40, iLvl));
  const rarity = pickWeightedRarity(iLvl);
  const count = rngInt(rarity.affixMin, rarity.affixMax);
  return _tagItem({ id: nextItemId++, base, rarity, affixes: rollAffixes(count, iLvl) }, iLvl);
}
function itemDisplayName(item) {
  if (item.uniqueId) {
    const u = typeof UNIQUE_ITEMS !== 'undefined' ? UNIQUE_ITEMS.find(u => u.id === item.uniqueId) : null;
    return u ? u.name : `Unique ${item.base.name}`;
  }
  if (item.setId) {
    const s = typeof SET_DEFS !== 'undefined' ? SET_DEFS.find(s => s.id === item.setId) : null;
    return s ? `${s.name} ${item.base.name}` : `Set ${item.base.name}`;
  }
  if (item.legendaryEffectId) {
    const e = typeof LEGENDARY_EFFECTS !== 'undefined' ? LEGENDARY_EFFECTS.find(e => e.id === item.legendaryEffectId) : null;
    return e ? `${e.name} ${item.base.name}` : `${item.rarity.name} ${item.base.name}`;
  }
  return `${item.rarity.name} ${item.base.name}`;
}

// ============================================================
// SET PIECE SYNERGIES
// ============================================================
// bonus2/bonus4: { desc, apply(p), effect? }
// effect string is pushed into player.activeSetEffects for game-loop dispatch
const SET_DEFS = [
  {
    id: 'stormcaller', name: "Stormcaller's",
    desc: "Stormcaller's Regalia",
    bonus2: { desc: '+15% Crit Chance', apply: (p) => { p.bonusCritChance += 15; } },
    bonus4: { desc: '+30% Crit Dmg — Crits chain to 2 nearby enemies', apply: (p) => { p.bonusCritDmg += 0.3; }, effect: 'chain_crit' },
  },
  {
    id: 'ironclad', name: "Ironclad",
    desc: "Ironclad Panoply",
    bonus2: { desc: '+20 Armor', apply: (p) => { p.bonusArmor += 20; } },
    bonus4: { desc: '+20% Damage Reduction — Reflect 40% blocked damage', apply: (p) => { p.bonusDmgReduction = (p.bonusDmgReduction || 0) + 0.20; }, effect: 'damage_reflect' },
  },
  {
    id: 'shadowstrike', name: "Shadowstrike",
    desc: "Shadowstrike Garb",
    bonus2: { desc: '+20% Attack Speed', apply: (p) => { p.bonusFireRatePct += 20; } },
    bonus4: { desc: '+15% Move Speed — Kills grant 2s speed burst', apply: (p) => { p.bonusMoveSpeed += 15; }, effect: 'kill_speed_burst' },
  },
  {
    id: 'arcane_mastery', name: "Arcane",
    desc: "Arcane Mastery",
    bonus2: { desc: '+20% Damage', apply: (p) => { p.bonusDmgPct += 20; } },
    bonus4: { desc: '+30 Max Resource — Projectiles pierce 1 extra target', apply: (p) => { p.bonusMaxResource += 30; }, effect: 'pierce_one' },
  },
  {
    id: 'bloodlust', name: "Bloodlust",
    desc: "Bloodlust Warplate",
    bonus2: { desc: '+40 Max HP', apply: (p) => { p.bonusMaxHp += 40; } },
    bonus4: { desc: '+2 HP Regen — Kills restore 3% Max HP', apply: (p) => { p.bonusRegen += 2; }, effect: 'kill_heal' },
  },
  {
    id: 'wraithwalker', name: "Wraithwalker",
    desc: "Wraithwalker's Veil",
    bonus2: { desc: '+10% Dodge', apply: (p) => { p.bonusDodge += 10; } },
    bonus4: { desc: '+10% Dodge — Dodging triggers a projectile volley', apply: (p) => { p.bonusDodge += 10; }, effect: 'dodge_volley' },
  },
];
function getSetDef(id) { return SET_DEFS.find(s => s.id === id) || null; }
function getActiveSetBonuses(equipped) {
  const counts = {};
  for (const k in equipped) {
    const it = equipped[k];
    if (it && it.setId) counts[it.setId] = (counts[it.setId] || 0) + 1;
  }
  const result = []; // { def, piecesEquipped, bonus2Active, bonus4Active }
  for (const id in counts) {
    const def = getSetDef(id);
    if (!def) continue;
    result.push({ def, count: counts[id], bonus2: counts[id] >= 2, bonus4: counts[id] >= 4 });
  }
  return result;
}

// ============================================================
// LEGENDARY EFFECTS
// ============================================================
// procType: 'onHit' | 'onKill' | 'onCrit' | 'passive'
// procChance: 0-100 (ignored for passive)
// desc shown in tooltip; actual logic dispatched by id in index.html
const LEGENDARY_EFFECTS = [
  { id: 'searing',       name: 'Searing',       procType: 'onHit',   procChance: 25,
    desc: '25% on-hit: Burn 4 dmg/s for 3s' },
  { id: 'vampiric',      name: 'Vampiric',       procType: 'onKill',  procChance: 100,
    desc: 'On kill: Restore 8 HP' },
  { id: 'thunderclap',   name: 'Thunderclap',    procType: 'onCrit',  procChance: 100,
    desc: 'On crit: AoE explosion (50 dmg)' },
  { id: 'frostbite',     name: 'Frostbite',      procType: 'onHit',   procChance: 20,
    desc: '20% on-hit: Slow enemy 50% for 2s' },
  { id: 'berserker',     name: 'Berserker',      procType: 'onKill',  procChance: 100,
    desc: 'On kill: +20% damage for 3s (stacks 3×)' },
  { id: 'soul_harvest',  name: 'Soul Harvest',   procType: 'onKill',  procChance: 100,
    desc: 'On kill: Restore 18 resource' },
  { id: 'executioner',   name: 'Executioner',    procType: 'passive', procChance: 0,
    desc: 'Passive: +8% of enemy missing HP as bonus dmg' },
  { id: 'shrapnel',      name: 'Shrapnel',       procType: 'onHit',   procChance: 15,
    desc: '15% on-hit: Spawn 3 shrapnel projectiles' },
];
function getLegendaryEffect(id) { return LEGENDARY_EFFECTS.find(e => e.id === id) || null; }

// ============================================================
// UNIQUE ITEMS
// ============================================================
// Fixed-stat named items. uniqueEffect: { id, desc, apply(p) } for persistent stat passives.
// Gameplay ability hooks (stormrider speed burst etc.) dispatched by uniqueEffect.id in index.html.
const UNIQUE_ITEMS = [
  {
    id: 'deathwhisper', name: "Deathwhisper", baseId: 'bow', rarityId: 'orange',
    lore: 'Each arrow carries a sliver of the void.',
    affixes: [
      { defId: 'crit_chance', value: 15 },
      { defId: 'firerate_pct', value: 12 },
      { defId: 'dmg_pct', value: 10 },
    ],
    uniqueEffect: { id: 'deathwhisper_extra_arrows', desc: 'Multishot gains 2 extra projectiles permanently.' },
  },
  {
    id: 'soulreaper', name: "Soulreaper", baseId: 'staff', rarityId: 'orange',
    lore: 'Forged from the bones of a forgotten god.',
    affixes: [
      { defId: 'dmg_pct', value: 20 },
      { defId: 'max_focus', value: 25 },
      { defId: 'crit_chance', value: 8 },
    ],
    uniqueEffect: { id: 'soulreaper_pierce', desc: 'All projectiles pierce through enemies.' },
  },
  {
    id: 'razorwind', name: "Razorwind", baseId: 'sword', rarityId: 'orange',
    lore: 'The blade never dulls. Neither does its hunger.',
    affixes: [
      { defId: 'firerate_pct', value: 20 },
      { defId: 'armor', value: 10 },
      { defId: 'dmg_pct', value: 15 },
    ],
    uniqueEffect: { id: 'razorwind_4th_crit', desc: 'Every 4th attack is a guaranteed critical hit.' },
  },
  {
    id: 'eclipse', name: "Eclipse", baseId: 'orb', rarityId: 'orange',
    lore: 'The orb devours light, returning power to its bearer.',
    affixes: [
      { defId: 'max_focus', value: 30 },
      { defId: 'focus_regen', value: 4 },
      { defId: 'dmg_pct', value: 10 },
    ],
    uniqueEffect: { id: 'eclipse_cheap_abilities', desc: 'Active abilities cost 30% less resource.', apply: (p) => { p.abilityCostMult = (p.abilityCostMult || 1) * 0.70; } },
  },
  {
    id: 'bonecage', name: "Bonecage", baseId: 'cap', rarityId: 'orange',
    lore: 'The dead protect those who walk among them.',
    affixes: [
      { defId: 'maxhp', value: 50 },
      { defId: 'armor', value: 12 },
      { defId: 'regen', value: 2 },
    ],
    uniqueEffect: { id: 'bonecage_low_hp_shield', desc: 'Below 40% HP, take 25% less damage.' },
  },
  {
    id: 'heartseeker', name: "Heartseeker", baseId: 'amulet', rarityId: 'orange',
    lore: 'It beats in time with every heartbeat nearby.',
    affixes: [
      { defId: 'regen', value: 3 },
      { defId: 'maxhp', value: 20 },
      { defId: 'crit_chance', value: 8 },
    ],
    uniqueEffect: { id: 'heartseeker_double_regen', desc: 'HP Regen is doubled.', apply: (p) => { p.bonusRegen += p.regen; } },
  },
  {
    id: 'shadowcloak', name: "Shadowcloak", baseId: 'tunic', rarityId: 'orange',
    lore: 'Woven from shadows that never quite settled.',
    affixes: [
      { defId: 'armor', value: 10 },
      { defId: 'movespeed', value: 8 },
      { defId: 'pickup', value: 10 },
    ],
    uniqueEffect: { id: 'shadowcloak_first_dodge', desc: 'First hit each wave is always dodged.' },
  },
  {
    id: 'stormrider', name: "Stormrider", baseId: 'boots', rarityId: 'orange',
    lore: 'The lightning chose you. Keep moving.',
    affixes: [
      { defId: 'movespeed', value: 15 },
      { defId: 'crit_chance', value: 6 },
      { defId: 'firerate_pct', value: 8 },
    ],
    uniqueEffect: { id: 'stormrider_kill_speed', desc: 'Killing an enemy grants 60 Move Speed for 1.5s.' },
  },
];
function getUniqueDef(id) { return UNIQUE_ITEMS.find(u => u.id === id) || null; }
// Build a live item object from a unique definition
function generateUniqueItem(uniqueId) {
  const def = getUniqueDef(uniqueId);
  if (!def) return generateItemMinRarity('orange');
  const base = ITEM_BASES.find(b => b.id === def.baseId) || rngPick(ITEM_BASES);
  const rarity = RARITY.ORANGE;
  const affixes = (def.affixes || []).map(a => {
    const afxDef = AFFIX_POOL.find(d => d.id === a.defId);
    return afxDef ? { def: afxDef, value: a.value } : null;
  }).filter(Boolean);
  return { id: nextItemId++, base, rarity, affixes, uniqueId: def.id };
}

// ============================================================
// PARAGON BOARD
// ============================================================
const PARAGON_LEVEL_CAP = 100;
// 4 categories × 10 nodes each. apply(p) runs each session on resetWorld.
const PARAGON_BOARD = {
  offense: {
    label: 'OFFENSE', color: '#ff6644',
    nodes: [
      { id: 'p_atk1',  name: 'Predator',      row: 1, desc: '+3% Damage',            apply: (p) => { p.bonusDmgPct += 3; } },
      { id: 'p_atk2',  name: 'Sharpened',     row: 1, desc: '+2% Crit Chance',       apply: (p) => { p.bonusCritChance += 2; } },
      { id: 'p_atk3',  name: 'Swift Draw',    row: 2, desc: '+3% Attack Speed',      apply: (p) => { p.bonusFireRatePct += 3; } },
      { id: 'p_atk4',  name: 'Bloodied Edge', row: 2, desc: '+5% Crit Damage',       apply: (p) => { p.bonusCritDmg += 0.05; } },
      { id: 'p_atk5',  name: 'Relentless',    row: 3, desc: '+4% Damage',            apply: (p) => { p.bonusDmgPct += 4; } },
      { id: 'p_atk6',  name: 'Headhunter',    row: 3, desc: '+3% Crit Chance',       apply: (p) => { p.bonusCritChance += 3; } },
      { id: 'p_atk7',  name: 'Overclocked',   row: 4, desc: '+4% Attack Speed',      apply: (p) => { p.bonusFireRatePct += 4; } },
      { id: 'p_atk8',  name: 'Death Mark',    row: 4, desc: '+2% Overpower Chance',  apply: (p) => { p.baseOverpowerChance += 2; } },
      { id: 'p_atk9',  name: 'Annihilator',   row: 5, desc: '+6% Damage',            apply: (p) => { p.bonusDmgPct += 6; } },
      { id: 'p_atk10', name: 'Void Strike',   row: 5, desc: '+10% Crit Dmg, +4% Crit Chance', apply: (p) => { p.bonusCritDmg += 0.10; p.bonusCritChance += 4; } },
    ],
  },
  defense: {
    label: 'DEFENSE', color: '#4499ff',
    nodes: [
      { id: 'p_def1',  name: 'Fortified',     row: 1, desc: '+15 Max HP',            apply: (p) => { p.bonusMaxHp += 15; } },
      { id: 'p_def2',  name: 'Plated',        row: 1, desc: '+3 Armor',              apply: (p) => { p.bonusArmor += 3; } },
      { id: 'p_def3',  name: 'Ironhide',      row: 2, desc: '+20 Max HP',            apply: (p) => { p.bonusMaxHp += 20; } },
      { id: 'p_def4',  name: 'Warded',        row: 2, desc: '+2% Dodge',             apply: (p) => { p.bonusDodge += 2; } },
      { id: 'p_def5',  name: 'Second Wind',   row: 3, desc: '+1 HP Regen',           apply: (p) => { p.bonusRegen += 1; } },
      { id: 'p_def6',  name: 'Bulwark',       row: 3, desc: '+5 Armor',              apply: (p) => { p.bonusArmor += 5; } },
      { id: 'p_def7',  name: 'Resilient',     row: 4, desc: '+25 Max HP',            apply: (p) => { p.bonusMaxHp += 25; } },
      { id: 'p_def8',  name: 'Phantasm',      row: 4, desc: '+4% Dodge',             apply: (p) => { p.bonusDodge += 4; } },
      { id: 'p_def9',  name: 'Titan',         row: 5, desc: '+40 Max HP, +6 Armor',  apply: (p) => { p.bonusMaxHp += 40; p.bonusArmor += 6; } },
      { id: 'p_def10', name: 'Deathless',     row: 5, desc: '+2 HP Regen, +5% Dodge', apply: (p) => { p.bonusRegen += 2; p.bonusDodge += 5; } },
    ],
  },
  utility: {
    label: 'UTILITY', color: '#ffcc33',
    nodes: [
      { id: 'p_utl1',  name: 'Windfoot',      row: 1, desc: '+8 Move Speed',         apply: (p) => { p.bonusMoveSpeed += 8; } },
      { id: 'p_utl2',  name: 'Collector',     row: 1, desc: '+10 Pickup Range',      apply: (p) => { p.bonusPickupRange += 10; } },
      { id: 'p_utl3',  name: 'Prospector',    row: 2, desc: '+10% Gold Find',        apply: (p) => { p.goldFindBonus = (p.goldFindBonus || 1) + 0.10; } },
      { id: 'p_utl4',  name: 'Swiftness',     row: 2, desc: '+10 Move Speed',        apply: (p) => { p.bonusMoveSpeed += 10; } },
      { id: 'p_utl5',  name: 'Arcane Well',   row: 3, desc: '+20 Max Resource',      apply: (p) => { p.bonusMaxResource += 20; } },
      { id: 'p_utl6',  name: 'Mend',          row: 3, desc: '+1 HP Regen',           apply: (p) => { p.bonusRegen += 1; } },
      { id: 'p_utl7',  name: 'Streamlined',   row: 4, desc: '+15 Move Speed',        apply: (p) => { p.bonusMoveSpeed += 15; } },
      { id: 'p_utl8',  name: 'Hoarder',       row: 4, desc: '+15 Pickup Range',      apply: (p) => { p.bonusPickupRange += 15; } },
      { id: 'p_utl9',  name: 'Blazing Speed', row: 5, desc: '+20 Move Speed, +10 Pickup', apply: (p) => { p.bonusMoveSpeed += 20; p.bonusPickupRange += 10; } },
      { id: 'p_utl10', name: 'Font of Power', row: 5, desc: '+40 Max Resource, +3 Resource Regen', apply: (p) => { p.bonusMaxResource += 40; p.bonusResourceRegen += 3; } },
    ],
  },
  mastery: {
    label: 'MASTERY', color: '#cc66ff',
    nodes: [
      { id: 'p_mst1',  name: 'Tempered',      row: 1, desc: '+1% Damage per Char Level (additive)', apply: (p) => { if (typeof charLevel !== 'undefined') p.bonusDmgPct += charLevel; } },
      { id: 'p_mst2',  name: 'Veteran',       row: 1, desc: '+2% All Stats',          apply: (p) => { p.bonusDmgPct += 2; p.bonusFireRatePct += 2; p.bonusMoveSpeed += 4; } },
      { id: 'p_mst3',  name: 'Prodigy',       row: 2, desc: '+5% Crit on Abilities',  apply: (p) => { p.bonusCritChance += 5; } },
      { id: 'p_mst4',  name: 'Hardened',      row: 2, desc: '+5 Armor, +10 HP',       apply: (p) => { p.bonusArmor += 5; p.bonusMaxHp += 10; } },
      { id: 'p_mst5',  name: 'Overflowing',   row: 3, desc: '+3% Overpower Chance',   apply: (p) => { p.baseOverpowerChance += 3; } },
      { id: 'p_mst6',  name: 'Precision',     row: 3, desc: '+5% Crit Damage',        apply: (p) => { p.bonusCritDmg += 0.05; } },
      { id: 'p_mst7',  name: 'Undying',       row: 4, desc: '+30 Max HP, +2 Regen',   apply: (p) => { p.bonusMaxHp += 30; p.bonusRegen += 2; } },
      { id: 'p_mst8',  name: 'Ascendant',     row: 4, desc: '+5% Dmg, +5% Atk Speed', apply: (p) => { p.bonusDmgPct += 5; p.bonusFireRatePct += 5; } },
      { id: 'p_mst9',  name: 'Apex Predator', row: 5, desc: '+8% Dmg, +5% Crit, +5% Crit Dmg', apply: (p) => { p.bonusDmgPct += 8; p.bonusCritChance += 5; p.bonusCritDmg += 0.05; } },
      { id: 'p_mst10', name: 'Transcendence', row: 5, desc: 'All paragon bonuses doubled (additive 100% of prior gains)', apply: (p) => { /* applied at end of paragon pass in applyParagonToPlayer */ } },
    ],
  },
};
function getParagonNode(id) {
  for (const cat of Object.values(PARAGON_BOARD)) {
    const n = cat.nodes.find(n => n.id === id);
    if (n) return n;
  }
  return null;
}


// ============================================================
// GEM SYSTEM
// ============================================================
// 4 gem types × 5 quality tiers. Socketed into item socket slots by the Jeweler.
// Quality 0=Chipped, 1=Flawed, 2=Normal, 3=Flawless, 4=Perfect
const GEM_QUALITIES = [
  { id: 0, name: 'Chipped',  color: '#888888', minILvl: 1  },
  { id: 1, name: 'Flawed',   color: '#aaaaaa', minILvl: 10 },
  { id: 2, name: 'Normal',   color: '#cccccc', minILvl: 20 },
  { id: 3, name: 'Flawless', color: '#eeeebb', minILvl: 30 },
  { id: 4, name: 'Perfect',  color: '#ffffff', minILvl: 40 },
];
const GEM_TYPES = [
  {
    id: 'ruby', tier: 1, name: 'Ruby', color: '#ff3333',
    bonuses: [ '+3 HP, +1 Armor', '+6 HP, +2 Armor', '+10 HP, +3 Armor', '+16 HP, +5 Armor', '+25 HP, +8 Armor' ],
    apply: (p, q) => { const hp=[3,6,10,16,25][q]; const ar=[1,2,3,5,8][q]; p.bonusMaxHp+=hp; p.bonusArmor+=ar; },
  },
  {
    id: 'sapphire', tier: 1, name: 'Sapphire', color: '#3366ff',
    bonuses: [ '+5 Resource, +1 Regen', '+10 Resource, +1.5 Regen', '+18 Resource, +2 Regen', '+28 Resource, +3 Regen', '+40 Resource, +5 Regen' ],
    apply: (p, q) => { const rs=[5,10,18,28,40][q]; const rr=[1,1.5,2,3,5][q]; p.bonusMaxResource+=rs; p.bonusResourceRegen+=rr; },
  },
  {
    id: 'topaz', tier: 1, name: 'Topaz', color: '#ffcc00',
    bonuses: [ '+3% Dmg, +2% Atk Spd', '+5% Dmg, +4% Atk Spd', '+8% Dmg, +6% Atk Spd', '+13% Dmg, +10% Atk Spd', '+20% Dmg, +15% Atk Spd' ],
    apply: (p, q) => { const dm=[3,5,8,13,20][q]; const fs=[2,4,6,10,15][q]; p.bonusDmgPct+=dm; p.bonusFireRatePct+=fs; },
  },
  {
    id: 'emerald', tier: 1, name: 'Emerald', color: '#22cc55',
    bonuses: [ '+1% Crit, +1% Dodge', '+2% Crit, +2% Dodge', '+4% Crit, +3% Dodge', '+6% Crit, +5% Dodge', '+10% Crit, +8% Dodge' ],
    apply: (p, q) => { const cc=[1,2,4,6,10][q]; const dg=[1,2,3,5,8][q]; p.bonusCritChance+=cc; p.bonusDodge+=dg; },
  },
];
function getGemType(id) { return GEM_TYPES.find(g => g.id === id) || null; }
function getGemQuality(q) { return GEM_QUALITIES[Math.max(0, Math.min(4, q))] || GEM_QUALITIES[0]; }
function gemDisplayName(gem) {
  const t = getGemType(gem.typeId);
  const q = getGemQuality(gem.quality);
  return t ? `${q.name} ${t.name}` : 'Unknown Gem';
}
// Roll a gem drop based on iLvl — higher iLvl = better quality, rarer
function rollGemDrop(iLvl) {
  iLvl = iLvl || 1;
  // Quality determined by iLvl
  let quality = 0;
  if (iLvl >= 40) quality = Math.random() < 0.3 ? 4 : (Math.random() < 0.5 ? 3 : 2);
  else if (iLvl >= 30) quality = Math.random() < 0.4 ? 3 : (Math.random() < 0.5 ? 2 : 1);
  else if (iLvl >= 20) quality = Math.random() < 0.5 ? 2 : 1;
  else if (iLvl >= 10) quality = Math.random() < 0.4 ? 1 : 0;
  const typeId = rngPick(GEM_TYPES).id;
  return { typeId, quality };
}

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
  RANGER: {
    id: 'ranger', tier: 1, name: 'Ranger', color: '#7ad96b',
    desc: 'Fast and crit-heavy. Auto-fires arrows. Crits refund Focus.',
    baseMaxHp: 80, baseSpeed: 105, baseCritChance: 5,
    weaponDamage: 4, weaponFireRate: 2.2, weaponRange: 210, weaponProjSpeed: 290,
    defaultWeapon: 'bow', defaultWeaponKind: 'ranged',
    resourceName: 'FOCUS', resourceColor: '#ffd23f',
    baseMaxResource: 100, baseResourceRegen: 15, critResourceGain: 18,
    signature: 'multishot',
  },
  SORCERER: {
    id: 'sorcerer', tier: 1, name: 'Sorcerer', color: '#5599ff',
    desc: 'Glass cannon. Slow heavy spells. Bigger Mana pool, slower regen.',
    baseMaxHp: 60, baseSpeed: 95, baseCritChance: 3,
    weaponDamage: 7, weaponFireRate: 1.4, weaponRange: 240, weaponProjSpeed: 240,
    defaultWeapon: 'staff', defaultWeaponKind: 'ranged',
    resourceName: 'MANA', resourceColor: '#5599ff',
    baseMaxResource: 140, baseResourceRegen: 8, critResourceGain: 0,
    signature: 'fireball',
  },
  BERSERKER: {
    id: 'berserker', tier: 1, name: 'Berserker', color: '#cc4040',
    desc: 'Tanky melee cleaver. Rage builds from dealing and taking hits.',
    baseMaxHp: 140, baseSpeed: 90, baseCritChance: 4,
    weaponDamage: 11, weaponFireRate: 1.6, weaponRange: 52, weaponProjSpeed: 1,
    defaultWeapon: 'sword', defaultWeaponKind: 'melee',
    meleeRange: 52,
    rageOnHit: 5, rageOnTake: 12,
    resourceName: 'RAGE', resourceColor: '#ff6060',
    baseMaxResource: 150, baseResourceRegen: 0, critResourceGain: 0,
    signature: 'whirlwind',
  },
  ASSASSIN: {
    id: 'assassin', tier: 1, name: 'Assassin', color: '#cc88ff',
    desc: 'Fastest attacks, highest crit. ENERGY refills quickly.',
    baseMaxHp: 70, baseSpeed: 125, baseCritChance: 10,
    weaponDamage: 3, weaponFireRate: 3.0, weaponRange: 130, weaponProjSpeed: 340,
    defaultWeapon: 'dagger', defaultWeaponKind: 'ranged',
    resourceName: 'ENERGY', resourceColor: '#cc88ff',
    baseMaxResource: 80, baseResourceRegen: 30, critResourceGain: 0,
    signature: 'shadowStrike',
  },
  TEMPLAR: {
    id: 'templar', tier: 1, name: 'Templar', color: '#ffaa44',
    desc: 'Close-range brawler. Chi flows steadily. Heals through combat.',
    baseMaxHp: 90, baseSpeed: 115, baseCritChance: 5,
    weaponDamage: 5, weaponFireRate: 2.2, weaponRange: 110, weaponProjSpeed: 260,
    defaultWeapon: 'dagger', defaultWeaponKind: 'ranged',
    resourceName: 'CHI', resourceColor: '#ffaa44',
    baseMaxResource: 80, baseResourceRegen: 12, critResourceGain: 8,
    signature: 'fistsOfThunder',
  },
  CRUSADER: {
    id: 'crusader', tier: 1, name: 'Crusader', color: '#ffe866',
    desc: 'Holy tank. Hits heal. Consecrated ground burns the wicked.',
    baseMaxHp: 110, baseSpeed: 85, baseCritChance: 4,
    weaponDamage: 7, weaponFireRate: 1.5, weaponRange: 170, weaponProjSpeed: 230,
    defaultWeapon: 'mace', defaultWeaponKind: 'ranged',
    resourceName: 'HOLY POWER', resourceColor: '#ffe866',
    baseMaxResource: 100, baseResourceRegen: 7, critResourceGain: 0,
    signature: 'holyNova',
  },
  SHAMAN: {
    id: 'shaman', tier: 1, name: 'Shaman', color: '#55dd66',
    desc: 'Long-range hex caster. MOJO fuels devastating curses.',
    baseMaxHp: 75, baseSpeed: 88, baseCritChance: 3,
    weaponDamage: 4, weaponFireRate: 1.2, weaponRange: 260, weaponProjSpeed: 185,
    defaultWeapon: 'staff', defaultWeaponKind: 'ranged',
    resourceName: 'MOJO', resourceColor: '#55dd66',
    baseMaxResource: 120, baseResourceRegen: 8, critResourceGain: 0,
    signature: 'plagueFrogs',
  },
  NECROMANCER: {
    id: 'necromancer', tier: 1, name: 'Necromancer', color: '#9988cc',
    desc: 'Master of death. Bone spells pierce. Corpses fuel the army.',
    baseMaxHp: 65, baseSpeed: 88, baseCritChance: 4,
    weaponDamage: 5, weaponFireRate: 1.1, weaponRange: 230, weaponProjSpeed: 200,
    defaultWeapon: 'staff', defaultWeaponKind: 'ranged',
    resourceName: 'NECROTIC POWER', resourceColor: '#9988cc',
    baseMaxResource: 100, baseResourceRegen: 5, critResourceGain: 0,
    signature: 'boneSpear',
  },
  DRUID: {
    id: 'druid', tier: 1, name: 'Druid', color: '#66cc88',
    desc: 'Shapeshifter and summoner. Shift between Human, Dragon and Panther forms.',
    baseMaxHp: 95, baseSpeed: 98, baseCritChance: 4,
    weaponDamage: 6, weaponFireRate: 1.6, weaponRange: 160, weaponProjSpeed: 220,
    defaultWeapon: 'staff', defaultWeaponKind: 'ranged',
    resourceName: 'SPIRIT', resourceColor: '#66cc88',
    baseMaxResource: 100, baseResourceRegen: 5, critResourceGain: 0,
    wildShape: 'human',
    signature: 'shred',
  },
  AMAZONIAN: {
    id: 'amazonian', tier: 1, name: 'Amazonian', color: '#ddaa33',
    desc: 'Spirit-bonded javelin hunter. Bond with Eagle, Serpent, Wolf or Bear.',
    baseMaxHp: 75, baseSpeed: 118, baseCritChance: 8,
    weaponDamage: 5, weaponFireRate: 2.0, weaponRange: 220, weaponProjSpeed: 310,
    defaultWeapon: 'bow', defaultWeaponKind: 'ranged',
    resourceName: 'SPIRIT CHARGE', resourceColor: '#ddaa33',
    baseMaxResource: 100, baseResourceRegen: 0, critResourceGain: 8,
    spiritBond: 'eagle',
    signature: 'javelinVolley',
  },
};
function getClassById(id) {
  if (id === 'sorcerer')    return CLASS.SORCERER;
  if (id === 'berserker')   return CLASS.BERSERKER;
  if (id === 'assassin')    return CLASS.ASSASSIN;
  if (id === 'templar')     return CLASS.TEMPLAR;
  if (id === 'crusader')    return CLASS.CRUSADER;
  if (id === 'shaman')      return CLASS.SHAMAN;
  if (id === 'necromancer') return CLASS.NECROMANCER;
  if (id === 'druid')       return CLASS.DRUID;
  if (id === 'amazonian')   return CLASS.AMAZONIAN;
  return CLASS.RANGER;
}


// ============================================================
// ABILITIES
// ============================================================
const ABILITIES = {
  multishot: {
    id: 'multishot', tier: 1, name: 'Multishot', tier: 1, letter: 'M', classOf: 'ranger',
    desc: '3 arrows in spread (+20% dmg)',
    maxRank: 5, rankDesc: ['3 arrows +20% dmg', '4 arrows +30% dmg', '4 arrows piercing +50% dmg ★Notable', '5 arrows pierce-all +70% dmg', '6 arrows pierce-all +100% dmg ★Capstone: AoE burst per arrow'],
    cost: 25, cooldown: 1.8, color: '#ffd23f',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const isLegend = slot && slot.rarity && slot.rarity.id === 'orange';
      const target = findNearestEnemy(player.x, player.y, player.weaponRange * 1.5);
      if (!target) return false;
      const baseAngle = Math.atan2(target.y - player.y, target.x - player.x);
      const arrowBase = isLegend ? 5 : 3;
      const arrows = rank >= 5 ? 6 : rank >= 4 ? 5 : rank >= 2 ? Math.min(arrowBase + 1, 5) : arrowBase;
      const halfSpread = arrows > 3 ? 0.46 : 0.35;
      for (let i = 0; i < arrows; i++) {
        const t = arrows === 1 ? 0 : (i / (arrows - 1)) * 2 - 1;
        const a = baseAngle + t * halfSpread;
        const sp = player.weaponProjSpeed;
        let dmg = player.weaponDamage * player.dmgMult * 1.20 * rDmg * rScale * rScale;
        const isCrit = Math.random() * 100 < player.critChance;
        if (isCrit) { dmg *= 2; player.onCrit(); }
        const proj = new Projectile(player.x, player.y, Math.cos(a) * sp, Math.sin(a) * sp, dmg, player.weaponRange / sp + 0.15, isCrit);
        if (rank >= 3) proj.piercing = true; // Notable: piercing
        if (rank >= 5) { proj.explosive = true; proj.explosionRadius = 22; proj.explosionDamage = dmg * 0.5; } // Capstone
        projectiles.push(proj);
      }
      spawnBurst(player.x, player.y, ['#ffd040', '#fff7a0', '#ffffff'], 8);
      shake = Math.min(shake + 1.5, 5);
      return true;
    },
  },
  rainOfArrows: {
    id: 'rainOfArrows', tier: 1, name: 'Rain of Arrows', tier: 2, letter: 'R', classOf: 'ranger',
    desc: 'AoE rain on target (3x dmg)',
    maxRank: 5, rankDesc: ['AoE rain 3× dmg r=50', '3× dmg r=60 +20% power', '3.5× dmg r=70 ★Notable: burning ground 2s', '4× dmg r=80', '5× dmg r=100 ★Capstone: chains to 2nd target'],
    cost: 40, cooldown: 4.0, color: '#ffaa44',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const target = findNearestEnemy(player.x, player.y, 280);
      if (!target) return false;
      const isLegend = slot && slot.rarity && slot.rarity.id === 'orange';
      const radiusBase = isLegend ? 70 : 50;
      const radius = radiusBase + (rank - 1) * 10;
      const dmg = player.weaponDamage * player.dmgMult * 3.0 * rDmg * rScale * rScale;
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
      if (rank >= 3 && target) { // Notable: burning ground
        groundEffects.push({ type: 'shockwave', x: target.x, y: target.y, r: 5, maxR: radius, damage: player.weaponDamage * player.dmgMult * 0.3 * rScale, life: 3.0, maxLife: 3.0, color: '#ff8800', hit: new Set(), target: 'enemy' });
      }
      shake = Math.min(shake + 3, 6);
      return true;
    },
  },
  piercingShot: {
    id: 'piercingShot', tier: 1, name: 'Piercing Shot', tier: 1, letter: 'P', classOf: 'ranger',
    desc: 'Pierces all enemies (+150% dmg)',
    maxRank: 5, rankDesc: ['+250% dmg piercing', '300% dmg faster proj', '350% dmg ★Notable: slows hit enemies 2s', '425% dmg bigger hitbox', '500% dmg ★Capstone: shatters into 3 arcs'],
    cost: 30, cooldown: 2.5, color: '#5599ff',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const target = findNearestEnemy(player.x, player.y, player.weaponRange * 2);
      if (!target) return false;
      const dx = target.x - player.x, dy = target.y - player.y;
      const d = Math.hypot(dx, dy);
      if (d < 0.01) return false;
      const sp = player.weaponProjSpeed * 1.4;
      let dmg = player.weaponDamage * player.dmgMult * 2.5 * rDmg * rScale * rScale;
      const isCrit = Math.random() * 100 < player.critChance;
      if (isCrit) { dmg *= 2; player.onCrit(); }
      const proj = new Projectile(player.x, player.y, (dx/d) * sp, (dy/d) * sp, dmg, 1.2, isCrit);
      proj.piercing = true;
      proj.r = 4 + rank;
      if (rank >= 3) { proj.onHitSlow = 2.0; } // Notable: slow
      if (rank >= 5) { proj.splitOnKill = 3; } // Capstone: shatter
      projectiles.push(proj);
      spawnBurst(player.x, player.y, ['#5599ff', '#aaccff'], 8);
      return true;
    },
  },
  hawkEye: {
    id: 'hawkEye', tier: 1, name: 'Hawk Eye', tier: 1, letter: 'E', classOf: 'ranger',
    desc: '+30% crit & atk speed (5s)',
    maxRank: 5, rankDesc: ['+30% crit+spd 5s', '+35% crit+spd 6s', '+40% crit+spd 7s ★Notable: +50% crit dmg', '50% crit+spd 8s', '60% crit+spd 10s ★Capstone: auto-crits for duration'],
    cost: 50, cooldown: 12.0, color: '#33cc55',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const rScale = getRankScale(slot);
      const isLegend = slot && slot.rarity && slot.rarity.id === 'orange';
      const baseDur = isLegend ? 8 : 5;
      player.hawkEyeTimer = baseDur + (rank - 1) * 1.5;
      if (rank >= 5) player.hawkEyeAutoCrit = true; // Capstone: auto-crits
      spawnBurst(player.x, player.y, ['#33cc55', '#88ff88', '#ffffff'], 12);
      return true;
    },
  },
  arrowVolley: {
    id: 'arrowVolley', tier: 1, name: 'Arrow Volley', tier: 2, letter: 'V', classOf: 'ranger',
    desc: '8 arrows in full circle',
    maxRank: 5, rankDesc: ['8 arrows full circle', '10 arrows', '12 arrows ★Notable: arrows return once', '14 arrows return', '16 arrows ★Capstone: arrows orbit + homing'],
    cost: 35, cooldown: 3.0, color: '#ff8000',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const isLegend = slot && slot.rarity && slot.rarity.id === 'orange';
      const arrowCountV = isLegend ? 12 : [8,10,12,14,16][rank-1] || 8;
      for (let i = 0; i < arrowCountV; i++) {
        const a = (i / arrowCountV) * Math.PI * 2;
        const sp = player.weaponProjSpeed;
        let dmg = player.weaponDamage * player.dmgMult * 1.0 * rDmg * rScale * rScale;
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
    id: 'fireball', tier: 1, name: 'Fireball', tier: 1, letter: 'F', classOf: 'sorcerer',
    desc: 'Big projectile, explodes on impact', cost: 30, cooldown: 1.5, color: '#ff5520',
    maxRank: 5, rankDesc: ['Explodes r=40 1.4× dmg', '1.6× dmg r=50', '1.8× dmg r=60 ★Notable: explosion chains 1', '2.1× dmg r=70', '2.5× dmg r=80 ★Capstone: leaves 3s fire puddle'],
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const isLegend = slot && slot.rarity && slot.rarity.id === 'orange';
      const target = findNearestEnemy(player.x, player.y, player.weaponRange * 1.6);
      if (!target) return false;
      const dx = target.x - player.x, dy = target.y - player.y;
      const d = Math.hypot(dx, dy);
      if (d < 0.01) return false;
      const sp = player.weaponProjSpeed;
      let dmg = player.weaponDamage * player.dmgMult * 1.4 * rDmg * rScale * rScale;
      const isCrit = Math.random() * 100 < player.critChance;
      if (isCrit) { dmg *= 2; player.onCrit(); }
      const proj = new Projectile(player.x, player.y, (dx/d) * sp, (dy/d) * sp, dmg, d / sp + 0.15, isCrit);
      proj.r = 5 + rank;
      proj.theme = 'fire';
      proj.explosive = true;
      proj.explosionRadius = (isLegend ? 60 : 40) + (rank - 1) * 8;
      proj.explosionDamage = dmg * 0.9 * rScale;
      if (rank >= 5) proj.fireGround = true; // Capstone: fire puddle
      projectiles.push(proj);
      spawnBurst(player.x, player.y, ['#ff5520', '#ffaa00', '#ffdd00'], 8);
      return true;
    },
  },
  frostNova: {
    id: 'frostNova', tier: 1, name: 'Frost Nova', tier: 1, letter: 'N', classOf: 'sorcerer',
    desc: 'AoE around player, slows enemies', cost: 50, cooldown: 5.0, color: '#aaccff',
    maxRank: 5, rankDesc: ['AoE freeze r=80 1.8× slow', '2.0× dmg wider', '2.2× dmg ★Notable: full freeze 1.5s', '2.6× dmg', '3.0× dmg ★Capstone: ice shards burst outward'],
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const isLegend = slot && slot.rarity && slot.rarity.id === 'orange';
      const radius = 80;
      const dmg = player.weaponDamage * player.dmgMult * 1.8 * rDmg * rScale;
      const slowDur = (isLegend ? 4 : 2.5) + (rank - 1) * 0.4;
      const freezeFactor = rank >= 3 ? 0.05 : 0.4; // Notable: near-freeze
      for (const e of enemies) {
        if (!e.alive) continue;
        const dx = e.x - player.x, dy = e.y - player.y;
        if (dx*dx + dy*dy < radius*radius) {
          const isCrit = Math.random() * 100 < player.critChance;
          const finalDmg = isCrit ? (dmg * rScale) * 2 : dmg * rScale;
          const died = e.takeDamage(finalDmg);
          if (isCrit) player.onCrit();
          e.slowTimer = rank >= 3 ? Math.max(e.slowTimer || 0, 1.5) : slowDur;
          e.slowFactor = freezeFactor;
          if (died) handleEnemyDeath(e);
        }
      }
      if (rank >= 5) { // Capstone: ice shards burst
        for (let _i = 0; _i < 8; _i++) {
          const _a = (_i / 8) * Math.PI * 2;
          const _sp = player.weaponProjSpeed * 1.2;
          projectiles.push(new Projectile(player.x, player.y, Math.cos(_a)*_sp, Math.sin(_a)*_sp, dmg * 0.6 * rScale, 0.6, false));
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
    id: 'chainLightning', tier: 1, name: 'Chain Lightning', tier: 2, letter: 'L', classOf: 'sorcerer',
    desc: 'Hits target, chains to 3 nearby', cost: 40, cooldown: 2.5, color: '#ffff80',
    maxRank: 5, rankDesc: ['Chains 3 targets 1.8× dmg', 'Chains 4 1.9×', 'Chains 6 2.0× ★Notable: +2 chains', 'Chains 7 2.3×', 'Chains 8 2.8× ★Capstone: stun each jump 0.5s'],
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const isLegend = slot && slot.rarity && slot.rarity.id === 'orange';
      const maxChains = (isLegend ? 5 : 3) + Math.max(0, rank - 2) * 2; // rank3=+2 chains
      let target = findNearestEnemy(player.x, player.y, player.weaponRange * 1.4);
      if (!target) return false;
      const hit = new Set();
      let lastX = player.x, lastY = player.y;
      let dmg = player.weaponDamage * player.dmgMult * 1.8 * rDmg * rScale;
      for (let i = 0; i <= maxChains; i++) {
        if (!target || hit.has(target) || !target.alive) break;
        hit.add(target);
        const isCrit = Math.random() * 100 < player.critChance;
        const finalDmg = isCrit ? dmg * 2 : dmg;
        const died = target.takeDamage(finalDmg * rScale);
        if (isCrit) player.onCrit();
        if (rank >= 5) { target.slowTimer = Math.max(target.slowTimer||0, 0.6); target.slowFactor = 0.1; } // Capstone: stun
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
    id: 'arcaneOrb', tier: 1, name: 'Arcane Orb', tier: 2, letter: 'O', classOf: 'sorcerer',
    desc: 'Slow piercing orb, big damage', cost: 45, cooldown: 3.0, color: '#aa66ff',
    maxRank: 5, rankDesc: ['Slow piercing 3.0× dmg', '3.3× bigger orb', '3.6× ★Notable: splits into 2 on expiry', '4.0×', '5.0× ★Capstone: splits into 4 seeking orbs'],
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const isLegend = slot && slot.rarity && slot.rarity.id === 'orange';
      const target = findNearestEnemy(player.x, player.y, player.weaponRange * 2);
      if (!target) return false;
      const dx = target.x - player.x, dy = target.y - player.y;
      const d = Math.hypot(dx, dy);
      if (d < 0.01) return false;
      const sp = player.weaponProjSpeed * 0.5;
      let dmg = player.weaponDamage * player.dmgMult * 3.0 * rDmg * rScale * rScale;
      const isCrit = Math.random() * 100 < player.critChance;
      if (isCrit) { dmg *= 2; player.onCrit(); }
      const proj = new Projectile(player.x, player.y, (dx/d) * sp, (dy/d) * sp, dmg, 2.5, isCrit);
      proj.piercing = true;
      proj.r = (isLegend ? 8 : 6) + rank;
      proj.theme = 'arcane';
      if (rank >= 5) proj.splitOnExpire = 4; // Capstone: splits into 4
      projectiles.push(proj);
      spawnBurst(player.x, player.y, ['#aa66ff', '#dd99ff', '#ffffff'], 10);
      return true;
    },
  },
  whirlwind: {
    id: 'whirlwind', tier: 1, name: 'Whirlwind', tier: 2, letter: 'W', classOf: 'berserker',
    desc: 'Spin attack, big AoE around you', cost: 30, cooldown: 2.0, color: '#ff6060',
    maxRank: 5, rankDesc: ['AoE spin 2.4× dmg r=75', '2.6× r=80', '2.8× r=90 ★Notable: lifesteal 6% per hit', '3.2×', '4.0× ★Capstone: pulls enemies in while spinning'],
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const isLegend = slot && slot.rarity && slot.rarity.id === 'orange';
      const radius = (isLegend ? 95 : 75) + (rank - 1) * 8;
      const dmg = player.weaponDamage * player.dmgMult * 2.4 * rDmg * rScale * rScale * (player.warCryTimer > 0 ? 1.4 : 1);
      for (const e of enemies) {
        if (!e.alive) continue;
        const dx = e.x - player.x, dy = e.y - player.y;
        if (dx*dx + dy*dy < radius*radius) {
          const isCrit = Math.random() * 100 < player.critChance;
          const finalDmg = isCrit ? dmg * 2 : dmg;
          const died = e.takeDamage(finalDmg);
          spawnBurst(e.x, e.y, ['#cc4040', '#ff6060', '#ffaa40'], 4);
          if (isCrit) player.onCrit();
          if (rank >= 3) player.hp = Math.min(player.maxHp, player.hp + finalDmg * 0.06); // Notable: lifesteal
          if (rank >= 5 && !died) { e.x += dx * -0.12; e.y += dy * -0.12; } // Capstone: pull
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
    id: 'cleave', tier: 1, name: 'Cleave', tier: 1, letter: 'C', classOf: 'berserker',
    desc: 'Massive forward swing (250% dmg)', cost: 25, cooldown: 2.0, color: '#ffaa40',
    maxRank: 5, rankDesc: ['Cone 2.6× dmg', '2.8× wider cone', '3.0× ★Notable: applies bleed 3s', '3.5× wide', '4.0× ★Capstone: 180° sweep + 2s knockback'],
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const isLegend = slot && slot.rarity && slot.rarity.id === 'orange';
      const cone = (isLegend ? 1.6 : 1.2) + (rank >= 5 ? 1.5 : 0); // Capstone: 180deg
      const range = 90 + (rank - 1) * 6;
      const dmg = player.weaponDamage * player.dmgMult * 2.6 * rDmg * rScale * rScale * (player.warCryTimer > 0 ? 1.4 : 1);
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
          if (rank >= 3) { e.bleedTimer = (e.bleedTimer || 0) + 3.0; e.bleedDmg = dmg * 0.15; } // Notable: bleed
          if (died) { if (e.isBoss) handleBossDeath(e); else handleEnemyDeath(e); }
        }
      }
      spawnBurst(player.x + player.facing * 20, player.y, ['#ffaa40', '#ff6020', '#ffffff'], 14);
      if (hitAny) shake = Math.min(shake + 4, 7);
      return true;
    },
  },
  warCry: {
    id: 'warCry', tier: 1, name: 'War Cry', tier: 1, letter: 'Y', classOf: 'berserker',
    desc: '+40% damage for 6s', cost: 50, cooldown: 14.0, color: '#cc4040',
    maxRank: 5, rankDesc: ['+40% dmg 6s', '+40% dmg+speed 7s', '+50% dmg+spd 8s ★Notable: resets lowest CD', '60% 9s', '70% 12s ★Capstone: instantly fills resource'],
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const rScale = getRankScale(slot);
      const isLegend = slot && slot.rarity && slot.rarity.id === 'orange';
      player.warCryTimer = (isLegend ? 10 : 6) + (rank - 1) * 1.2;
      if (rank >= 3) { // Notable: reset lowest ability CD
        let lowestIdx = -1, lowestVal = 0;
        for (let _si = 1; _si < 6; _si++) { if (player.abilityCooldowns[_si] > lowestVal) { lowestVal = player.abilityCooldowns[_si]; lowestIdx = _si; } }
        if (lowestIdx >= 0) player.abilityCooldowns[lowestIdx] = 0;
      }
      if (rank >= 5) player.resource = player.maxResource; // Capstone
      spawnBurst(player.x, player.y, ['#cc4040', '#ff6060', '#ffaa40', '#ffffff'], 16);
      return true;
    },
  },
  charge: {
    id: 'charge', tier: 1, name: 'Charge', tier: 2, letter: 'H', classOf: 'berserker',
    desc: 'Dash to enemy, damage path (200% dmg)', cost: 35, cooldown: 3.0, color: '#ffaa40',
    maxRank: 5, rankDesc: ['Dash+path 2.0× dmg', '2.2× wider path', '2.5× ★Notable: stuns hit enemies 1.5s', '3.0×', '3.5× ★Capstone: triple charge + reset on kill'],
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const target = findNearestEnemy(player.x, player.y, 250);
      if (!target) return false;
      const startX = player.x, startY = player.y;
      const dx = target.x - startX, dy = target.y - startY;
      const d = Math.hypot(dx, dy);
      if (d < 1) return false;
      const stepX = dx / d, stepY = dy / d;
      const pathW = 30;
      const dmg = player.weaponDamage * player.dmgMult * 2.0 * rDmg * rScale * rScale * (player.warCryTimer > 0 ? 1.4 : 1);
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
          if (rank >= 3) { e.slowTimer = Math.max(e.slowTimer||0, 1.5); e.slowFactor = 0.05; } // Notable: stun
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
    id: 'groundSlam', tier: 1, name: 'Ground Slam', tier: 2, letter: 'S', classOf: 'berserker',
    desc: 'AoE slam, slows enemies', cost: 45, cooldown: 4.5, color: '#cc6020',
    maxRank: 5, rankDesc: ['AoE slow 2.2× dmg r=90', '2.4× r=100', '2.6× r=110 ★Notable: cracks persist 3s', '3.0×', '3.5× ★Capstone: 2× radius shockwave'],
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const isLegend = slot && slot.rarity && slot.rarity.id === 'orange';
      const radius = (isLegend ? 115 : 90) + (rank - 1) * 8;
      const dmg = player.weaponDamage * player.dmgMult * 2.2 * rDmg * rScale * rScale * (player.warCryTimer > 0 ? 1.4 : 1);
      const slowDur = (isLegend ? 3.5 : 2.5) + (rank - 1) * 0.3;
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
      if (rank >= 5) groundEffects.push({ type: 'shockwave', x: player.x, y: player.y, r: 10, maxR: radius * 1.8, damage: dmg * 0.4, life: 0.9, maxLife: 0.9, color: '#ff8800', hit: new Set(), target: 'enemy' }); // Capstone
      spawnBurst(player.x, player.y, ['#cc6020', '#ffaa40', '#ffffff'], 20);
      shake = Math.min(shake + 5, 9);
      return true;
    },
  },
  meteor: {
    id: 'meteor', tier: 1, name: 'Meteor', tier: 3, letter: 'T', classOf: 'sorcerer',
    desc: 'Falling meteor, big AoE (delay)', cost: 60, cooldown: 4.5, color: '#ff4400',
    maxRank: 5, rankDesc: ['Meteor 4.0× dmg r=60', '4.5× r=70', '5.0× r=80 ★Notable: scorches ground 3s', '5.8×', '7.0× ★Capstone: 2 simultaneous meteors'],
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const isLegend = slot && slot.rarity && slot.rarity.id === 'orange';
      const target = findNearestEnemy(player.x, player.y, 280);
      if (!target) return false;
      const meteors = isLegend ? 2 : 1;
      const dmg = player.weaponDamage * player.dmgMult * 4.0 * rDmg * rScale;
      for (let i = 0; i < meteors; i++) {
        const offX = i === 0 ? 0 : (Math.random() - 0.5) * 60;
        const offY = i === 0 ? 0 : (Math.random() - 0.5) * 60;
        groundEffects.push({ type: 'meteor', x: target.x + offX, y: target.y + offY, r: 0, maxR: 55, damage: dmg, life: 1.0, maxLife: 1.0, color: '#ff4400', hit: new Set(), exploded: false, target: 'enemy' });
      }
      spawnBurst(player.x, player.y, ['#ff4400', '#ff8800', '#ffdd00'], 8);
      return true;
    },
  },

  // ── ROGUE ────────────────────────────────────────────────────
  shadowStrike: {
    id: 'shadowStrike', tier: 1, name: 'Shadow Strike', tier: 1, letter: 'S', classOf: 'assassin',
    desc: 'Blink behind nearest enemy, 350% dmg + brief iframe',
    maxRank: 5, rankDesc: ['Blink+stab 2.5× dmg', '2.8× leaves shadow', '3.0× ★Notable: shadow copy fights 3s', '3.5×', '4.5× ★Capstone: 2 copies + vanish 1s'],
    cost: 20, cooldown: 4.0, color: '#cc88ff',
    cast: (player) => {
      const target = findNearestEnemy(player.x, player.y, 300);
      if (!target) return false;
      const dx = target.x - player.x, dy = target.y - player.y;
      const d = Math.hypot(dx, dy) || 1;
      spawnBurst(player.x, player.y, ['#cc88ff', '#ffffff'], 8);
      player.x = Math.max(player.r, Math.min(W - player.r, target.x - (dx/d) * 16));
      player.y = Math.max(player.r, Math.min(H - player.r, target.y - (dy/d) * 16));
      player.iframeTimer = Math.max(player.iframeTimer, 0.4);
      const isCrit = true;
      const dmg = player.weaponDamage * player.dmgMult * 3.5;
      const died = target.takeDamage(dmg, { crit: true });
      player.onCrit();
      spawnBurst(player.x, player.y, ['#cc88ff', '#ff88ff', '#ffffff'], 14);
      if (died) handleEnemyDeath(target);
      shake = Math.min(shake + 3, 6);
      return true;
    },
  },
  bladeFlurry: {
    id: 'bladeFlurry', tier: 1, name: 'Blade Flurry', tier: 1, letter: 'F', classOf: 'assassin',
    desc: '5 daggers in a forward arc',
    maxRank: 5, rankDesc: ['6-hit flurry 1.5× each', '7 hits 1.6×', '8 hits ★Notable: applies poison 3s', '9 hits 2.0×', '12 hits ★Capstone: triggers again on dodge'],
    cost: 30, cooldown: 2.5, color: '#dd99ff',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const target = findNearestEnemy(player.x, player.y, 200);
      const baseAngle = target ? Math.atan2(target.y - player.y, target.x - player.x) : 0;
      for (let i = 0; i < 5; i++) {
        const t = (i / 4) * 2 - 1;
        const a = baseAngle + t * 0.55;
        const sp = player.weaponProjSpeed * 1.1;
        let dmg = player.weaponDamage * player.dmgMult * 1.1 * rDmg * rScale;
        const isCrit = Math.random() * 100 < player.critChance;
        if (isCrit) { dmg *= 2; player.onCrit(); }
        projectiles.push(new Projectile(player.x, player.y, Math.cos(a)*sp, Math.sin(a)*sp, dmg, 0.5, isCrit));
      }
      spawnBurst(player.x, player.y, ['#cc88ff', '#ffffff'], 8);
      shake = Math.min(shake + 1.5, 5);
      return true;
    },
  },
  smokeBomb: {
    id: 'smokeBomb', tier: 1, name: 'Smoke Bomb', tier: 2, letter: 'B', classOf: 'assassin',
    desc: 'Slow nearby enemies, gain +40% speed for 4s',
    maxRank: 5, rankDesc: ['AoE slow 1.5× dmg', '1.6× + bigger', '1.8× ★Notable: invulnerable 1s on entry', '2.0×', '2.5× ★Capstone: explodes on exit dealing 3×'],
    cost: 35, cooldown: 8.0, color: '#887799',
    cast: (player) => {
      const radius = 100;
      for (const e of enemies) {
        if (!e.alive) continue;
        const dx = e.x - player.x, dy = e.y - player.y;
        if (dx*dx + dy*dy < radius*radius) { e.slowTimer = 3.5; e.slowFactor = 0.35; }
      }
      player.smokeBombTimer = 4.0;
      spawnBurst(player.x, player.y, ['#887799', '#bbaacc', '#ffffff'], 20);
      shake = Math.min(shake + 2, 5);
      return true;
    },
  },
  backstab: {
    id: 'backstab', tier: 1, name: 'Backstab', tier: 2, letter: 'K', classOf: 'assassin',
    desc: 'Guaranteed crit for 450% dmg on nearest',
    maxRank: 5, rankDesc: ['Rear 3.0× dmg', '3.3× from any angle', '3.6× ★Notable: stuns 1.5s', '4.0× bleeds', '5.0× ★Capstone: guaranteed crit + triggers dodge'],
    cost: 40, cooldown: 5.0, color: '#ff66cc',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const target = findNearestEnemy(player.x, player.y, 220);
      if (!target) return false;
      const dmg = player.weaponDamage * player.dmgMult * 4.5 * rDmg * rScale * 2;
      const died = target.takeDamage(dmg, { crit: true });
      player.onCrit();
      spawnBurst(target.x, target.y, ['#ff66cc', '#ff88ff', '#ffffff'], 16);
      hitPauseTimer = Math.max(hitPauseTimer, 0.07);
      shake = Math.min(shake + 4, 7);
      if (died) handleEnemyDeath(target);
      return true;
    },
  },
  evasion: {
    id: 'evasion', tier: 1, name: 'Evasion', tier: 1, letter: 'E', classOf: 'assassin',
    desc: 'Dash away from nearest threat, 0.5s iframe',
    maxRank: 5, rankDesc: ['Dodge +2 charges', 'Dodge +3 faster', 'Dodge ★Notable: leaves afterimage decoy', 'Afterimage taunts', '★Capstone: counter-attack after each dodge'],
    cost: 15, cooldown: 3.0, color: '#aa66cc',
    cast: (player) => {
      const target = findNearestEnemy(player.x, player.y, 250);
      const dx = target ? player.x - target.x : 1;
      const dy = target ? player.y - target.y : 0;
      const d = Math.hypot(dx, dy) || 1;
      player.x = Math.max(player.r, Math.min(W - player.r, player.x + (dx/d) * 80));
      player.y = Math.max(player.r, Math.min(H - player.r, player.y + (dy/d) * 80));
      player.iframeTimer = Math.max(player.iframeTimer, 0.5);
      spawnBurst(player.x, player.y, ['#cc88ff', '#ffffff'], 10);
      return true;
    },
  },

  // ── ASSASSIN T2 (3rd slot) ───────────────────────────────────
  poisonBlade: {
    id: 'poisonBlade', name: 'Poison Blade', letter: 'X', tier: 2, classOf: 'assassin',
    desc: 'Coat your weapon with venom. Next 8 attacks apply stacking Poison. 5 stacks = burst.',
    maxRank: 5, rankDesc: ['8 poison hits', '10 hits stack faster', '10 hits ★Notable: Poison burst spreads stacks to nearby', '12 hits Poison deals 2× dmg', '★Capstone: 15 hits, burst leaves toxic cloud 4s'],
    cost: 20, cooldown: 9.0, color: '#44cc44',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const charges = [8,10,10,12,15][rank-1];
      player.venomCharges = charges;
      player.venomDmg = player.weaponDamage * player.dmgMult * 0.30 * rDmg * rScale;
      player.venomBurstRadius = rank >= 3 ? 55 : 36;
      player.venomDoubleStack = false;
      player.venomDmgMult = rank >= 4 ? 2.0 : 1.0;
      player.venomCloud = rank >= 5;
      spawnBurst(player.x, player.y, ['#44cc44','#aaffaa','#ffffff'], 10);
      return true;
    },
  },

  // ── ASSASSIN T3 ───────────────────────────────────────────────
  shadowClone: {
    id: 'shadowClone', name: 'Shadow Clone', letter: 'C', tier: 3, classOf: 'assassin',
    desc: 'Summon a shadow clone that mimics your attacks for 6s.',
    maxRank: 5, rankDesc: ['1 clone 6s 60% dmg', '2 clones', '2 clones ★Notable: clones taunt enemies', '3 clones 8s', '★Capstone: 3 clones, clone deaths trigger Shadow Strike'],
    cost: 35, cooldown: 16.0, color: '#882299',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const count = rank >= 4 ? 3 : rank >= 2 ? 2 : 1;
      const dur = rank >= 4 ? 8 : 6;
      if (!player.summons) player.summons = [];
      for (let i = 0; i < count; i++) {
        const ox = (Math.random()-0.5)*40, oy = (Math.random()-0.5)*40;
        player.summons.push({
          type: 'clone', x: player.x+ox, y: player.y+oy,
          hp: 999, maxHp: 999, timer: dur,
          dmg: player.weaponDamage * player.dmgMult * 0.6 * rDmg * rScale,
          speed: player.speed * 0.9, r: 5, color: '#882299',
          attackRate: player.weaponFireRate * 0.9, attackTimer: 0,
          taunt: rank >= 3, deathStrike: rank >= 5, rank
        });
      }
      spawnBurst(player.x, player.y, ['#882299','#cc88ff','#ffffff'], 16);
      return true;
    },
  },
  bladestorm: {
    id: 'bladestorm', name: 'Bladestorm', letter: 'Z', tier: 3, classOf: 'assassin',
    desc: 'Spin through enemies in a path from cursor, dealing 12 rapid hits.',
    maxRank: 5, rankDesc: ['12 hits along path 1.2× each', '16 hits path wider', '16 hits ★Notable: each hit applies Shadow Bleed', '20 hits crits spread poison', '★Capstone: 20 hits, re-cast free if 8+ hit'],
    cost: 30, cooldown: 10.0, color: '#cc66ff',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const hits = rank >= 4 ? 20 : rank >= 2 ? 16 : 12;
      const dmgPer = player.weaponDamage * player.dmgMult * 1.2 * rDmg * rScale;
      const dx = mouseX-player.x, dy = mouseY-player.y, d=Math.hypot(dx,dy)||1;
      const dist = 180;
      const pathW = rank >= 2 ? 30 : 22;
      const tx = Math.max(player.r,Math.min(W-player.r,player.x+(dx/d)*dist));
      const ty = Math.max(player.r,Math.min(H-player.r,player.y+(dy/d)*dist));
      player.iframeTimer = Math.max(player.iframeTimer, 0.35);
      const hitSet = new Set(); let hitCount = 0;
      const steps = Math.ceil(dist/8);
      for (let s=0;s<=steps;s++) {
        const px=player.x+(dx/d)*(dist/steps)*s, py=player.y+(dy/d)*(dist/steps)*s;
        for (const e of enemies) {
          if (!e.alive||hitSet.has(e)) continue;
          if (Math.hypot(e.x-px,e.y-py)<pathW) {
            hitSet.add(e); hitCount++;
            const isCrit=Math.random()*100<player.critChance;
            const dmg=dmgPer*(isCrit?2:1);
            const died=e.takeDamage(dmg,{crit:isCrit});
            if(isCrit)player.onCrit();
            if(rank>=3){e.bleedTimer=(e.bleedTimer||0)+2;e.bleedDmg=dmgPer*0.12;}
            spawnBurst(e.x,e.y,['#cc66ff','#ffffff'],4);
            if(died)handleEnemyDeath(e);
          }
        }
      }
      player.x=tx;player.y=ty;
      spawnBurst(tx,ty,['#cc66ff','#882299','#ffffff'],18);
      shake=Math.min(shake+3,7);
      if(rank>=5&&hitCount>=8)player.abilityCooldowns[player.abilities.findIndex(a=>a&&a.id==='bladestorm')]=0;
      return true;
    },
  },
  deathMark: {
    id: 'deathMark', name: 'Death Mark', letter: 'M', tier: 3, classOf: 'assassin',
    desc: 'Mark the target. Your next 3 hits against it deal 3× damage. Spreads on kill.',
    maxRank: 5, rankDesc: ['3× dmg next 3 hits', '4× dmg', '4× ★Notable: all abilities also deal 4×', '5× dmg, mark 2 targets', '★Capstone: marked target is silenced and cannot dodge'],
    cost: 15, cooldown: 7.0, color: '#ff2266',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const count = rank >= 4 ? 2 : 1;
      const sorted = enemies.filter(e=>e.alive).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y));
      if (!sorted.length) return false;
      if (!player.markedEnemies) player.markedEnemies = new Set();
      player.markedEnemies.clear();
      for (let i=0;i<Math.min(count,sorted.length);i++) {
        const t=sorted[i];
        player.markedEnemies.add(t);
        if (rank>=5) { t.silenced=true; t.dodge=0; }
        spawnBurst(t.x,t.y,['#ff2266','#ff88aa','#ffffff'],12);
        spawnDamageNumber(t.x,t.y-t.r-8,'DEATH MARK',{color:'#ff2266',size:10,vy:-50,life:1.2});
      }
      player.eagleMarkBonus = rank>=4?4.0:rank>=2?3.0:2.0; // reuse eagle mark system
      player.eagleMarkSpread = true;
      player.deathMarkHits = 3;
      player.resource=Math.min(player.maxResource,(player.resource||0)+10);
      return true;
    },
  },

  // ── ASSASSIN T4 (Ultimates) ───────────────────────────────────
  deathBlossom: {
    id: 'deathBlossom', name: 'Death Blossom', letter: 'O', tier: 4, classOf: 'assassin',
    desc: 'Leap to cursor, vanish 0.5s, then explode 20 blades in all directions.',
    maxRank: 5, rankDesc: ['20 blades 1.8× each', '25 blades poison', '25 blades ★Notable: blades pierce', '30 blades crits chain', '★Capstone: 40 blades, all guaranteed crit'],
    cost: 40, cooldown: 30.0, color: '#cc0066',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const blades = rank>=5?40:rank>=4?30:rank>=2?25:20;
      const dmg = player.weaponDamage * player.dmgMult * 1.8 * rDmg * rScale;
      player.x = Math.max(player.r,Math.min(W-player.r,mouseX));
      player.y = Math.max(player.r,Math.min(H-player.r,mouseY));
      player.iframeTimer = Math.max(player.iframeTimer, 0.5);
      spawnBurst(player.x,player.y,['#cc0066','#ff88aa','#ffffff'],20);
      for (let i=0;i<blades;i++) {
        const a=(i/blades)*Math.PI*2;
        const isCrit=rank>=5||Math.random()*100<player.critChance;
        const d=dmg*(isCrit?2:1);
        const proj=new Projectile(player.x,player.y,Math.cos(a)*player.weaponProjSpeed,Math.sin(a)*player.weaponProjSpeed,d,0.6,isCrit);
        proj.r=2; proj.theme='shadow';
        if(rank>=3)proj.piercing=true;
        projectiles.push(proj);
        if(isCrit)player.onCrit();
      }
      shake=Math.min(shake+6,10);hitPauseTimer=Math.max(hitPauseTimer,0.10);
      return true;
    },
  },
  shadowRealm: {
    id: 'shadowRealm', name: 'Shadow Realm', letter: 'R', tier: 4, classOf: 'assassin',
    desc: '10s: enter the Shadow Realm — untargetable, 2× damage, all hits guaranteed crit.',
    maxRank: 5, rankDesc: ['Shadow Realm 8s 2×', '10s +50% speed', '10s ★Notable: cloak persists 2s after realm ends', '12s kills reduce CD', '★Capstone: 12s, exit triggers Death Blossom for free'],
    cost: 50, cooldown: 45.0, color: '#330066',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const dur = rank>=4?12:rank>=2?10:8;
      player.shadowRealmTimer = dur;
      player.shadowRealmDmgMult = 2.0;
      player.shadowRealmSpeedBonus = rank>=2?0.50:0;
      player.shadowRealmCloakOnExit = rank>=3?2.0:0;
      player.shadowRealmKillCDReduce = rank>=4;
      player.shadowRealmExitBlossom = rank>=5;
      player.iframeTimer = Math.max(player.iframeTimer, dur);
      spawnBurst(player.x,player.y,['#330066','#882299','#cc88ff','#ffffff'],28);
      spawnDamageNumber(player.x,player.y-28,'SHADOW REALM',{color:'#cc88ff',size:14,vy:-60,life:2.0});
      return true;
    },
  },
  assassinate: {
    id: 'assassinate', name: 'Assassinate', letter: 'A', tier: 4, classOf: 'assassin',
    desc: 'Instant blink + strike for massive damage. If target dies, CD resets to 5s.',
    maxRank: 5, rankDesc: ['8× instant crit', '10× target below 50% = execute', '10× ★Notable: vanish 1.5s after kill', '12× chain to 2nd nearest', '★Capstone: 15× dmg, hits reset all non-ult CDs on kill'],
    cost: 45, cooldown: 25.0, color: '#880033',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const mult = rank>=5?15:rank>=4?12:rank>=2?10:8;
      const target = findNearestEnemy(player.x,player.y,999);
      if (!target) return false;
      const dx=target.x-player.x,dy=target.y-player.y,d=Math.hypot(dx,dy)||1;
      player.x=Math.max(player.r,Math.min(W-player.r,target.x-(dx/d)*12));
      player.y=Math.max(player.r,Math.min(H-player.r,target.y-(dy/d)*12));
      player.iframeTimer=Math.max(player.iframeTimer,0.3);
      let dmg=player.weaponDamage*player.dmgMult*mult*rDmg*rScale*2;
      const execute=rank>=2&&target.hp<target.maxHp*0.5;
      if(execute)dmg=target.hp+1;
      const died=target.takeDamage(dmg,{crit:true});
      player.onCrit();
      spawnBurst(target.x,target.y,['#880033','#ff2266','#ff88aa','#ffffff'],24);
      hitPauseTimer=Math.max(hitPauseTimer,0.12);shake=Math.min(shake+7,12);
      if(died){
        handleEnemyDeath(target);
        // Short CD reset
        const si=player.abilities.findIndex(a=>a&&a.id==='assassinate');
        if(si>=0)player.abilityCooldowns[si]=5;
        if(rank>=3)player.iframeTimer=Math.max(player.iframeTimer,1.5);
        if(rank>=5){for(let i=0;i<player.abilityCooldowns.length;i++){const ab=player.abilities[i];if(ab&&ab.def&&ab.def.tier<4)player.abilityCooldowns[i]=0;}}
        // Chain to 2nd target
        if(rank>=4){
          const t2=enemies.filter(e=>e.alive&&e!==target).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y))[0];
          if(t2){const d2=player.weaponDamage*player.dmgMult*mult*0.6*rDmg*rScale*2;const d3=t2.takeDamage(d2,{crit:true});player.onCrit();spawnBurst(t2.x,t2.y,['#880033','#ff2266'],14);if(d3)handleEnemyDeath(t2);}
        }
      }
      return true;
    },
  },

  // ── SORCERER T1 (3rd slot) ────────────────────────────────────
  arcaneJolt: {
    id: 'arcaneJolt', name: 'Arcane Jolt', letter: 'J', tier: 1, classOf: 'sorcerer',
    desc: 'Instant hitscan bolt to nearest enemy. Applies Shocked — amplifies next hit by 30%.',
    maxRank: 5, rankDesc: ['Hitscan 1.5× Shocked', '1.8× Shocked +50%', '2.0× ★Notable: Shocked spreads to 2 nearby', '2.5× Shocked stacks 2×', '★Capstone: 3.0×, Shocked is permanent until consumed'],
    cost: 0, cooldown: 1.2, color: '#aaccff',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const mult = rank>=5?3.0:rank>=4?2.5:rank>=3?2.0:rank>=2?1.8:1.5;
      const shockedAmp = rank>=2?0.50:0.30;
      const target = findNearestEnemy(player.x,player.y,player.weaponRange*1.8);
      if (!target) return false;
      const isCrit = Math.random()*100<player.critChance;
      let dmg = player.weaponDamage*player.dmgMult*mult*rDmg*rScale;
      if(target.shocked)dmg*=(1+shockedAmp);
      if(isCrit){dmg*=2;player.onCrit();}
      const died = target.takeDamage(dmg,{crit:isCrit});
      target.shocked = rank>=5 ? true : false; // rank 5: permanent until consumed
      if(!died)target.shocked = true; // apply shocked
      const spreadTargets = rank>=3?2:0;
      let spread=0;
      for(const e of enemies){
        if(spread>=spreadTargets||!e.alive||e===target)continue;
        if(Math.hypot(e.x-target.x,e.y-target.y)<70){e.shocked=true;spread++;}
      }
      spawnBurst(target.x,target.y,['#aaccff','#5599ff','#ffffff'],8);
      spawnDamageNumber(target.x,target.y-target.r,dmg,{color:isCrit?'#5599ff':'#aaccff',crit:isCrit});
      if(died)handleEnemyDeath(target);
      return true;
    },
  },

  // ── SORCERER T2 (3rd slot) ────────────────────────────────────
  infernoStream: {
    id: 'infernoStream', name: 'Inferno Stream', letter: 'I', tier: 2, classOf: 'sorcerer',
    desc: 'Channeled cone of fire for 2s. Superheats after 1.5s: cone widens, +50% dmg.',
    maxRank: 5, rankDesc: ['Cone 2s Ignite', '2.5s +dmg', '2.5s ★Notable: Steam Burst on Chilled targets', 'Cone 3s chain explosion', '★Capstone: 3s Superheat at 1s, leaves inferno trail'],
    cost: 40, cooldown: 12.0, color: '#ff6622',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const dur = rank>=4?3:rank>=2?2.5:2;
      player.infernoStreamTimer = dur;
      player.infernoStreamDmg = player.weaponDamage*player.dmgMult*0.9*rDmg*rScale;
      player.infernoStreamWidth = 40;
      player.infernoStreamSuperheatAt = rank>=5?1.0:1.5;
      player.infernoStreamSteam = rank>=3;
      player.infernoStreamChain = rank>=4;
      player.infernoStreamTrail = rank>=5;
      player.infernoStreamHitTimer = 0;
      spawnBurst(player.x,player.y,['#ff6622','#ffaa44','#ffdd88','#ffffff'],18);
      return true;
    },
  },

  // ── SORCERER T3 ───────────────────────────────────────────────
  blizzard: {
    id: 'blizzard', name: 'Blizzard', letter: 'Z', tier: 3, classOf: 'sorcerer',
    desc: 'Sustained frost storm over cursor for 5s. Slows all inside, deals periodic damage.',
    maxRank: 5, rankDesc: ['Blizzard 5s slow 0.4', '6s freeze on 5 hits', '6s ★Notable: Chilled enemies explode when killed', '7s ice spikes burst', '★Capstone: 8s, storm collapses into Frost Nova at end'],
    cost: 40, cooldown: 15.0, color: '#5599ff',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const dur = rank>=5?8:rank>=4?7:rank>=3?6:rank>=2?6:5;
      const dmg = player.weaponDamage*player.dmgMult*0.5*rDmg*rScale;
      groundEffects.push({
        type:'blizzard', x:mouseX, y:mouseY, r:80, life:dur, maxLife:dur,
        dmgPerSec:dmg*2, color:'#5599ff', hit:new Set(), hitTimer:0,
        freeze:rank>=2, chiledExplode:rank>=3, spikes:rank>=4, novaOnEnd:rank>=5,
        player, rScale, dmg
      });
      spawnBurst(mouseX,mouseY,['#5599ff','#aaccff','#ffffff'],16);
      return true;
    },
  },
  arcaneSurge: {
    id: 'arcaneSurge', name: 'Arcane Surge', letter: 'U', tier: 3, classOf: 'sorcerer',
    desc: '8s: arcane energy surges — all Mana costs 0, spells +40% dmg, auto-fire arcane bolts.',
    maxRank: 5, rankDesc: ['Surge 6s free casts +40%', '8s +50%', '8s ★Notable: surging bolts chain', '10s bolts Pierce', '★Capstone: 10s, Surge detonates for massive AoE on end'],
    cost: 50, cooldown: 22.0, color: '#dd66ff',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const dur = rank>=4?10:rank>=2?8:6;
      player.arcaneSurgeTimer = dur;
      player.arcaneSurgeDmgBonus = rank>=2?0.50:0.40;
      player.arcaneSurgeBoltTimer = 0;
      player.arcaneSurgeBoltDmg = player.weaponDamage*player.dmgMult*0.8*rDmg*rScale;
      player.arcaneSurgeChain = rank>=3;
      player.arcaneSurgePierce = rank>=4;
      player.arcaneSurgeDetonate = rank>=5;
      spawnBurst(player.x,player.y,['#dd66ff','#aa44ff','#ffffff'],22);
      spawnDamageNumber(player.x,player.y-26,'ARCANE SURGE!',{color:'#dd66ff',size:13,vy:-55,life:1.8});
      return true;
    },
  },

  // ── SORCERER T4 (Ultimates) ───────────────────────────────────
  timeFreeze: {
    id: 'timeFreeze', name: 'Time Freeze', letter: 'Z', tier: 4, classOf: 'sorcerer',
    desc: 'Freeze ALL enemies in place for 4s. You attack 2× faster during freeze.',
    maxRank: 5, rankDesc: ['Freeze 3s 2× aspd', '4s', '4s ★Notable: frozen enemies shatter on death (AoE)', '5s also silences', '★Capstone: 6s, you phase (invulnerable) during freeze'],
    cost: 60, cooldown: 35.0, color: '#aaccff',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const dur = rank>=5?6:rank>=4?5:rank>=2?4:3;
      for (const e of enemies) {
        if (!e.alive) continue;
        e.stunTimer = Math.max(e.stunTimer||0, dur);
        if(rank>=3)e.frozen=true;
        if(rank>=4)e.silenced=true;
      }
      player.timeFreezeTimer = dur;
      player.timeFreezeAspd = 2.0;
      if(rank>=5)player.iframeTimer=Math.max(player.iframeTimer,dur);
      spawnBurst(player.x,player.y,['#aaccff','#5599ff','#eef8ff','#ffffff'],32);
      spawnDamageNumber(player.x,player.y-28,'TIME FREEZE!',{color:'#aaccff',size:15,vy:-60,life:2.0});
      shake=Math.min(shake+4,8);
      return true;
    },
  },
  meteorShower: {
    id: 'meteorShower', name: 'Meteor Shower', letter: 'E', tier: 4, classOf: 'sorcerer',
    desc: '5s rain of meteors across the entire screen. Each impact leaves a fire puddle.',
    maxRank: 5, rankDesc: ['Shower 5s 1 meteor/s', '2 meteors/s', '2/s ★Notable: meteors chain 2 nearby on impact', '3/s bigger impact', '★Capstone: 4/s, final meteor is 5× mega-meteor'],
    cost: 60, cooldown: 45.0, color: '#ff4400',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const dur = 5.0;
      const rate = rank>=5?4:rank>=4?3:rank>=2?2:1;
      player.meteorShowerTimer = dur;
      player.meteorShowerRate = rate;
      player.meteorShowerDmg = player.weaponDamage*player.dmgMult*2.5*rDmg*rScale;
      player.meteorShowerMeteorTimer = 0;
      player.meteorShowerChain = rank>=3;
      player.meteorShowerBigger = rank>=4;
      player.meteorShowerMegaFinal = rank>=5;
      player.meteorShowerCount = 0;
      player.meteorShowerTotal = Math.round(rate*dur);
      spawnBurst(player.x,player.y-20,['#ff4400','#ffaa00','#ffdd44','#ffffff'],28);
      spawnDamageNumber(player.x,player.y-28,'METEOR SHOWER!',{color:'#ff4400',size:15,vy:-60,life:2.0});
      return true;
    },
  },
  singularity: {
    id: 'singularity', name: 'Singularity', letter: 'Y', tier: 4, classOf: 'sorcerer',
    desc: 'Create an arcane black hole at cursor. Pulls all enemies for 6s then detonates.',
    maxRank: 5, rankDesc: ['Black hole 4s + detonate 3×', '6s pull stronger', '6s ★Notable: pull applies Shocked', '7s detonate 5× + shockwave', '★Capstone: 8s, triggers Time Freeze on detonation'],
    cost: 60, cooldown: 45.0, color: '#440066',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const dur = rank>=5?8:rank>=4?7:rank>=2?6:4;
      const detMult = rank>=4?5:3;
      player.singularityTimer = dur;
      player.singularityX = mouseX; player.singularityY = mouseY;
      player.singularityDmg = player.weaponDamage*player.dmgMult*detMult*rDmg*rScale;
      player.singularityPullForce = rank>=2?120:80;
      player.singularityShocked = rank>=3;
      player.singularityTimeFreeze = rank>=5;
      player.singularityHitTimer = 0;
      spawnBurst(mouseX,mouseY,['#440066','#882299','#cc88ff','#ffffff'],20);
      spawnDamageNumber(mouseX,mouseY-16,'SINGULARITY',{color:'#882299',size:13,vy:-55,life:1.5});
      return true;
    },
  },

  // ── MONK ─────────────────────────────────────────────────────
  fistsOfThunder: {
    id: 'fistsOfThunder', tier: 1, name: 'Fists of Thunder', tier: 1, letter: 'F', classOf: 'templar',
    desc: '5 rapid strikes on nearest for 120% dmg each',
    maxRank: 5, rankDesc: ['5-hit lightning 1.2×', '6-hit 1.4×', '7-hit ★Notable: knockback + stun last hit', '8-hit 1.8×', '10-hit ★Capstone: lightning chain on final blow'],
    cost: 25, cooldown: 2.0, color: '#ffaa44',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const target = findNearestEnemy(player.x, player.y, 140);
      if (!target) return false;
      let died = false;
      for (let i = 0; i < 5; i++) {
        const isCrit = Math.random() * 100 < player.critChance;
        let dmg = player.weaponDamage * player.dmgMult * 1.2 * rDmg * rScale;
        if (isCrit) { dmg *= 2; player.onCrit(); }
        if (!died && target.alive) { died = target.takeDamage(dmg, { crit: isCrit }); }
        spawnBurst(target.x + (Math.random()-0.5)*10, target.y + (Math.random()-0.5)*10, ['#ffaa44','#ffffff'], 3);
      }
      if (died) handleEnemyDeath(target);
      shake = Math.min(shake + 2, 5);
      hitPauseTimer = Math.max(hitPauseTimer, 0.05);
      return true;
    },
  },
  innerSanctuary: {
    id: 'innerSanctuary', tier: 1, name: 'Inner Sanctuary', tier: 1, letter: 'I', classOf: 'templar',
    desc: 'Heal 25% max HP',
    maxRank: 5, rankDesc: ['Shield zone 3s 2.5× dmg', '3.5s bigger', '4s ★Notable: regen 8 hp/s inside', '4.5s regen+speed', '5s ★Capstone: reflects projectiles 50%'],
    cost: 40, cooldown: 8.0, color: '#ffe0a0',
    cast: (player) => {
      const heal = Math.round(player.maxHp * 0.25);
      player.hp = Math.min(player.maxHp, player.hp + heal);
      spawnBurst(player.x, player.y, ['#ffe0a0', '#ffdd44', '#ffffff'], 18);
      return true;
    },
  },
  cycloneStrike: {
    id: 'cycloneStrike', tier: 1, name: 'Cyclone Strike', tier: 2, letter: 'C', classOf: 'templar',
    desc: 'Pull enemies in 120px toward you, then deal AoE',
    maxRank: 5, rankDesc: ['Pull+AoE 2.2×', '2.4× wider pull', '2.6× ★Notable: pulls 2× harder', '3.0× stun center', '3.5× ★Capstone: leaves tornado 3s'],
    cost: 35, cooldown: 4.0, color: '#ffcc66',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const radius = 120;
      const dmg = player.weaponDamage * player.dmgMult * 2.0 * rDmg * rScale;
      for (const e of enemies) {
        if (!e.alive) continue;
        const dx = player.x - e.x, dy = player.y - e.y;
        const d = Math.hypot(dx, dy);
        if (d < radius) {
          e.x += (dx/d) * Math.min(d * 0.6, 40);
          e.y += (dy/d) * Math.min(d * 0.6, 40);
          const isCrit = Math.random() * 100 < player.critChance;
          const died = e.takeDamage(isCrit ? dmg*2 : dmg, { crit: isCrit });
          if (isCrit) player.onCrit();
          if (died) handleEnemyDeath(e);
        }
      }
      groundEffects.push({ type: 'shockwave', x: player.x, y: player.y, r: 10, maxR: radius, damage: 0, life: 0.4, maxLife: 0.4, color: '#ffaa44', hit: new Set(), target: 'none' });
      spawnBurst(player.x, player.y, ['#ffaa44', '#ffdd44', '#ffffff'], 18);
      shake = Math.min(shake + 3, 6);
      return true;
    },
  },
  sevenSidedStrike: {
    id: 'sevenSidedStrike', tier: 1, name: 'Seven-Sided Strike', tier: 3, letter: 'V', classOf: 'templar',
    desc: '7 hits distributed among nearby enemies',
    maxRank: 5, rankDesc: ['7 strikes 1.8× each', '7 hits 2.0×', '9 hits ★Notable: each hit stuns 0.3s', '11 hits 2.5×', '14 hits ★Capstone: last hit AoE explosion'],
    cost: 50, cooldown: 5.0, color: '#ff8822',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const nearby = enemies.filter(e => e.alive && Math.hypot(e.x-player.x, e.y-player.y) < 130);
      if (!nearby.length) return false;
      const dmg = player.weaponDamage * player.dmgMult * 1.8 * rDmg * rScale;
      for (let i = 0; i < 7; i++) {
        const e = nearby[Math.floor(Math.random() * nearby.length)];
        if (!e.alive) continue;
        const isCrit = Math.random() * 100 < player.critChance;
        const died = e.takeDamage(isCrit ? dmg*2 : dmg, { crit: isCrit });
        if (isCrit) player.onCrit();
        spawnBurst(e.x, e.y, ['#ffaa44', '#ff8822'], 4);
        if (died) { handleEnemyDeath(e); }
      }
      shake = Math.min(shake + 3, 6);
      hitPauseTimer = Math.max(hitPauseTimer, 0.06);
      return true;
    },
  },
  mantraOfHealing: {
    id: 'mantraOfHealing', tier: 1, name: 'Mantra of Healing', letter: 'M', classOf: 'templar',
    desc: '+4 HP/s regen for 8s',
    maxRank: 5, rankDesc: ['Heal 20% HP', '25% HP + regen 3s', '30% ★Notable: HoT 8 hp/s for 6s', '35% + stronger HoT', '50% ★Capstone: full heal + invuln 1.5s'],
    cost: 30, cooldown: 12.0, color: '#ffeeaa',
    cast: (player) => {
      player.mantraTimer = 8.0;
      spawnBurst(player.x, player.y, ['#ffeeaa', '#ffdd44', '#ffffff'], 14);
      return true;
    },
  },

  // ── PALADIN ──────────────────────────────────────────────────
  holyNova: {
    id: 'holyNova', tier: 1, name: 'Holy Nova', letter: 'N', classOf: 'crusader',
    desc: 'AoE blast: damage enemies, heal 4 HP each hit',
    maxRank: 5, rankDesc: ['AoE holy 2.0× heal 5%', '2.2× heal 7%', '2.5× ★Notable: blinds enemies 1.5s', '3.0× heal 10%', '4.0× ★Capstone: leaves holy ground 4s'],
    cost: 40, cooldown: 5.0, color: '#ffe866',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const radius = 90;
      const dmg = player.weaponDamage * player.dmgMult * 2.0 * rDmg * rScale;
      let healed = 0;
      for (const e of enemies) {
        if (!e.alive) continue;
        const dx = e.x - player.x, dy = e.y - player.y;
        if (dx*dx + dy*dy < radius*radius) {
          const isCrit = Math.random() * 100 < player.critChance;
          const died = e.takeDamage(isCrit ? dmg*2 : dmg, { crit: isCrit });
          if (isCrit) player.onCrit();
          healed++;
          if (died) handleEnemyDeath(e);
        }
      }
      player.hp = Math.min(player.maxHp, player.hp + healed * 4);
      groundEffects.push({ type: 'shockwave', x: player.x, y: player.y, r: 10, maxR: radius, damage: 0, life: 0.45, maxLife: 0.45, color: '#ffe866', hit: new Set(), target: 'none' });
      spawnBurst(player.x, player.y, ['#ffe866', '#ffffff', '#ffcc44'], 20);
      shake = Math.min(shake + 2, 5);
      return true;
    },
  },
  consecration: {
    id: 'consecration', tier: 1, name: 'Consecration', letter: 'C', classOf: 'crusader',
    desc: 'Holy ground burns enemies for 5s',
    maxRank: 5, rankDesc: ['Holy ground 5s slow', '6s + dmg', '7s ★Notable: slows 50% + ignites', '8s heal on ground', '10s ★Capstone: doubles holy ground + heals nearby'],
    cost: 50, cooldown: 8.0, color: '#ffdd44',
    cast: (player, slot) => {
      const dmg = Math.round(player.weaponDamage * player.dmgMult * 0.4);
      groundEffects.push({ type: 'holy_zone', x: player.x, y: player.y, r: 55, life: 5.0, maxLife: 5.0, damage: dmg, cooldowns: new Map() });
      spawnBurst(player.x, player.y, ['#ffe866', '#ffdd44', '#ffffff'], 14);
      return true;
    },
  },
  divineShield: {
    id: 'divineShield', tier: 2, name: 'Divine Shield', letter: 'D', classOf: 'crusader',
    desc: '2s full invincibility + knockback pulse',
    maxRank: 5, rankDesc: ['Invuln 2.5s', '3s + counter', '3.5s ★Notable: reflects 100% dmg taken', '4s + AoE on end', '5s ★Capstone: AoE holy explosion on exit'],
    cost: 60, cooldown: 15.0, color: '#ffffff',
    cast: (player) => {
      player.iframeTimer = Math.max(player.iframeTimer, 2.0);
      const radius = 80;
      for (const e of enemies) {
        if (!e.alive) continue;
        const dx = e.x - player.x, dy = e.y - player.y;
        const d = Math.hypot(dx, dy);
        if (d < radius) {
          e.x += (dx/d || 1) * (radius - d) * 1.2;
          e.y += (dy/d || 0) * (radius - d) * 1.2;
        }
      }
      groundEffects.push({ type: 'shockwave', x: player.x, y: player.y, r: 10, maxR: radius, damage: 0, life: 0.5, maxLife: 0.5, color: '#ffe866', hit: new Set(), target: 'none' });
      spawnBurst(player.x, player.y, ['#ffffff', '#ffe866', '#ffcc44'], 24);
      shake = Math.min(shake + 3, 6);
      return true;
    },
  },
  hammerOfJustice: {
    id: 'hammerOfJustice', tier: 2, name: 'Hammer of Justice', letter: 'H', classOf: 'crusader',
    desc: 'Heavy projectile slows on impact (220% dmg)',
    maxRank: 5, rankDesc: ['Slow hammer 2.5×', '2.8× faster', '3.0× ★Notable: pierces + stuns 1s', '3.5× splits', '4.5× ★Capstone: 3 hammers + chain stun'],
    cost: 30, cooldown: 3.0, color: '#ffcc44',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const target = findNearestEnemy(player.x, player.y, player.weaponRange * 1.5);
      if (!target) return false;
      const dx = target.x - player.x, dy = target.y - player.y;
      const d = Math.hypot(dx, dy) || 1;
      const sp = player.weaponProjSpeed * 0.55;
      let dmg = player.weaponDamage * player.dmgMult * 2.2 * rDmg * rScale;
      const isCrit = Math.random() * 100 < player.critChance;
      if (isCrit) { dmg *= 2; player.onCrit(); }
      const proj = new Projectile(player.x, player.y, (dx/d)*sp, (dy/d)*sp, dmg, d/sp + 0.1, isCrit);
      proj.r = 6; proj.theme = 'light';
      proj.onHit = (e) => { e.slowTimer = 2.5; e.slowFactor = 0.3; };
      projectiles.push(proj);
      spawnBurst(player.x, player.y, ['#ffe866', '#ffcc44'], 8);
      return true;
    },
  },
  layOnHands: {
    id: 'layOnHands', tier: 3, name: 'Lay on Hands', letter: 'L', classOf: 'crusader',
    desc: 'Restore 70% max HP',
    maxRank: 5, rankDesc: ['Full heal', '+ cleanse debuffs', '★Notable: invuln 1.5s after cast', '+ AoE heal nearby', '★Capstone: heal + burst of holy energy 5×'],
    cost: 80, cooldown: 20.0, color: '#fffacc',
    cast: (player) => {
      const heal = Math.round(player.maxHp * 0.70);
      player.hp = Math.min(player.maxHp, player.hp + heal);
      spawnBurst(player.x, player.y, ['#ffffff', '#ffe866', '#fffacc'], 24);
      return true;
    },
  },

  // ── TEMPLAR T2 ───────────────────────────────────────────────
  tempestRush: {
    id: 'tempestRush', name: 'Tempest Rush', letter: 'T', tier: 2, classOf: 'templar',
    desc: 'Rush through enemies in a line, dealing Chi damage. Each hit restores Chi.',
    maxRank: 5, rankDesc: ['Rush 1.8× per hit', '2.0× wider path', '2.2× ★Notable: leave tornado 2s at end', '2.5× double-rush', '★Capstone: 3.0×, tornado seeks enemies 4s'],
    cost: 20, cooldown: 6.0, color: '#ffcc44',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const dmg = player.weaponDamage*player.dmgMult*1.8*rDmg*rScale;
      const pathW = rank>=2?30:22; const dist=220;
      const dx=mouseX-player.x,dy=mouseY-player.y,d=Math.hypot(dx,dy)||1;
      const tx=Math.max(player.r,Math.min(W-player.r,player.x+(dx/d)*dist));
      const ty=Math.max(player.r,Math.min(H-player.r,player.y+(dy/d)*dist));
      player.iframeTimer=Math.max(player.iframeTimer,0.3);
      const steps=Math.ceil(dist/10); const hitSet=new Set();
      for(let s=0;s<=steps;s++){
        const px=player.x+(dx/d)*(dist/steps)*s,py=player.y+(dy/d)*(dist/steps)*s;
        for(const e of enemies){
          if(!e.alive||hitSet.has(e))continue;
          if(Math.hypot(e.x-px,e.y-py)<pathW){
            hitSet.add(e);
            const isCrit=Math.random()*100<player.critChance;
            const died=e.takeDamage(isCrit?dmg*2:dmg,{crit:isCrit});
            if(isCrit)player.onCrit();
            player.resource=Math.min(player.maxResource,(player.resource||0)+6);
            spawnBurst(e.x,e.y,['#ffcc44','#ffffff'],4);
            if(died)handleEnemyDeath(e);
          }
        }
      }
      player.x=tx;player.y=ty;
      if(rank>=3)groundEffects.push({type:'tornado',x:tx,y:ty,r:30,life:rank>=5?4:2,maxLife:2,dmgPerSec:dmg*2,color:'#ffcc44',vx:0,vy:0,seek:rank>=5,spiritPerHit:0,explodeOnEnd:false,player,rScale,hit:new Set()});
      if(rank>=4){
        // Double rush back
        const rx=player.x-(dx/d)*dist*0.5,ry=player.y-(dy/d)*dist*0.5;
        player.x=Math.max(player.r,Math.min(W-player.r,rx));
        player.y=Math.max(player.r,Math.min(H-player.r,ry));
      }
      spawnBurst(tx,ty,['#ffcc44','#ffaa44','#ffffff'],14);
      return true;
    },
  },
  cripplingWave: {
    id: 'cripplingWave', name: 'Crippling Wave', letter: 'W', tier: 2, classOf: 'templar',
    desc: 'Three rapid Chi waves hit all nearby enemies. Final wave cripples movement.',
    maxRank: 5, rankDesc: ['3 waves 1.3× each', '1.5× wider', '1.6× ★Notable: 3rd wave silences 1.5s', '4 waves bigger', '★Capstone: 4 waves, 4th detonates all Chi stacks'],
    cost: 25, cooldown: 5.0, color: '#ffaa44',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const waves = rank>=4?4:3; const radius = rank>=2?100:80;
      const dmg = player.weaponDamage*player.dmgMult*1.3*rDmg*rScale;
      for(let w=0;w<waves;w++){
        const waveDmg=dmg*(1+w*0.1);
        const isFinal=(w===waves-1);
        for(const e of enemies){
          if(!e.alive)continue;
          if(Math.hypot(e.x-player.x,e.y-player.y)<radius*(1+w*0.1)){
            const isCrit=Math.random()*100<player.critChance;
            const died=e.takeDamage(isCrit?waveDmg*2:waveDmg,{crit:isCrit});
            if(isCrit)player.onCrit();
            if(isFinal){e.slowTimer=Math.max(e.slowTimer||0,2.5);e.slowFactor=0.4;}
            if(isFinal&&rank>=3)e.silenced=true;
            if(died)handleEnemyDeath(e);
          }
        }
      }
      groundEffects.push({type:'shockwave',x:player.x,y:player.y,r:10,maxR:radius,damage:0,life:0.5,maxLife:0.5,color:'#ffaa44',hit:new Set(),target:'none'});
      player.resource=Math.min(player.maxResource,(player.resource||0)+12);
      spawnBurst(player.x,player.y,['#ffaa44','#ffcc66','#ffffff'],16);
      shake=Math.min(shake+2,5);
      return true;
    },
  },

  // ── TEMPLAR T3 ───────────────────────────────────────────────
  epiphany: {
    id: 'epiphany', name: 'Epiphany', letter: 'P', tier: 3, classOf: 'templar',
    desc: '8s Enlightened state: Chi costs 0, +40% move speed, pull enemies to you.',
    maxRank: 5, rankDesc: ['Epiphany 6s free casts', '8s +40% speed', '8s ★Notable: all abilities trigger Cyclone Strike', '10s enemies drawn in', '★Capstone: 10s, on exit deal 5× AoE holy damage'],
    cost: 40, cooldown: 20.0, color: '#ffeecc',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const dur = rank>=4?10:rank>=2?8:6;
      player.epiphanyTimer = dur;
      player.epiphanySpeedBonus = rank>=2?0.40:0.20;
      player.epiphanyFreeCasts = true;
      player.epiphanyPull = rank>=4;
      player.epiphanyExitAoE = rank>=5;
      player.epiphanyCyclone = rank>=3;
      spawnBurst(player.x,player.y,['#ffeecc','#ffdd44','#ffffff'],22);
      spawnDamageNumber(player.x,player.y-26,'EPIPHANY!',{color:'#ffeecc',size:13,vy:-55,life:1.8});
      return true;
    },
  },
  innerFire: {
    id: 'innerFire', name: 'Inner Fire', letter: 'Y', tier: 3, classOf: 'templar',
    desc: 'Ignite your Chi: 8s of fire-damage aura and +30% dmg on every hit.',
    maxRank: 5, rankDesc: ['Aura 8s 1.5× fire', '10s wider', '10s ★Notable: crits Explode enemies on kill', '12s fire trail on move', '★Capstone: 12s, aura detonates for 6× on end'],
    cost: 35, cooldown: 16.0, color: '#ff8822',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const dur = rank>=4?12:rank>=2?10:8;
      player.innerFireTimer = dur;
      player.innerFireDmg = player.weaponDamage*player.dmgMult*0.6*rDmg*rScale;
      player.innerFireRadius = rank>=2?65:50;
      player.innerFireExplodeKill = rank>=3;
      player.innerFireTrail = rank>=4;
      player.innerFireDetonate = rank>=5;
      player.innerFireHitTimer = 0;
      spawnBurst(player.x,player.y,['#ff8822','#ffcc44','#ffffff'],20);
      spawnDamageNumber(player.x,player.y-24,'INNER FIRE!',{color:'#ff8822',size:12,vy:-50,life:1.5});
      return true;
    },
  },

  // ── TEMPLAR T4 (Ultimates) ────────────────────────────────────
  transcendence: {
    id: 'transcendence', name: 'Transcendence', letter: 'N', tier: 4, classOf: 'templar',
    desc: '10s: become pure energy — untargetable, each step deals Chi AoE, infinite Chi.',
    maxRank: 5, rankDesc: ['Transcend 8s path AoE', '10s +AoE size', '10s ★Notable: kills restore HP equal to dmg dealt', '12s immunity lingers 2s', '★Capstone: 12s, detonates all enemies as you re-materialize'],
    cost: 60, cooldown: 45.0, color: '#ffeecc',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const dur = rank>=4?12:rank>=2?10:8;
      player.transcendenceTimer = dur;
      player.transcendenceDmg = player.weaponDamage*player.dmgMult*0.8*rDmg*rScale;
      player.transcendenceRadius = rank>=2?55:40;
      player.transcendenceHealKill = rank>=3;
      player.transcendenceLingerIframe = rank>=4?2.0:0;
      player.transcendenceDetonate = rank>=5;
      player.iframeTimer = Math.max(player.iframeTimer, dur);
      player.transcendenceStepTimer = 0;
      spawnBurst(player.x,player.y,['#ffeecc','#ffdd44','#ffaa44','#ffffff'],28);
      spawnDamageNumber(player.x,player.y-28,'TRANSCENDENCE!',{color:'#ffeecc',size:14,vy:-60,life:2.0});
      return true;
    },
  },
  serenity: {
    id: 'serenity', name: 'Serenity', letter: 'S', tier: 4, classOf: 'templar',
    desc: 'Instant full heal + remove all debuffs + invuln 3s. Every enemy within range frozen.',
    maxRank: 5, rankDesc: ['Full heal + invuln 2s', '3s + freeze all', '3s ★Notable: heal overflows as shield', '4s + freeze 4s', '★Capstone: 4s + AoE holy burst 5× dmg + resurrect if at 0HP'],
    cost: 60, cooldown: 40.0, color: '#ffffff',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const dur = rank>=4?4:rank>=2?3:2;
      player.hp = player.maxHp;
      player.iframeTimer = Math.max(player.iframeTimer, dur);
      if(rank>=3)player.chiShield = player.maxHp*0.3;
      const freezeDur = rank>=4?4:2;
      if(rank>=2){for(const e of enemies){if(!e.alive)continue;e.stunTimer=Math.max(e.stunTimer||0,freezeDur);}}
      if(rank>=5){
        const dmg=player.weaponDamage*player.dmgMult*5*rDmg*rScale;
        for(const e of enemies){if(!e.alive)continue;if(Math.hypot(e.x-player.x,e.y-player.y)<120){const died=e.takeDamage(dmg,{crit:true});player.onCrit();if(died)handleEnemyDeath(e);}}
      }
      spawnBurst(player.x,player.y,['#ffffff','#ffe866','#ffeecc'],30);
      spawnDamageNumber(player.x,player.y-28,'SERENITY',{color:'#ffffff',size:14,vy:-60,life:2.0});
      shake=Math.min(shake+4,8);
      return true;
    },
  },
  divinePalm: {
    id: 'divinePalm', name: 'Divine Palm', letter: 'L', tier: 4, classOf: 'templar',
    desc: 'Channel Chi into your palm for 0.5s then release: 12× single-target guaranteed crit.',
    maxRank: 5, rankDesc: ['12× single-target crit', '15× + stun 3s', '15× ★Notable: if kills: explode for 8× AoE', '18× + chain to 3 nearest', '★Capstone: 20×, any nearby enemy dies triggers another Palm'],
    cost: 50, cooldown: 20.0, color: '#ffcc66',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const mult = rank>=5?20:rank>=4?18:rank>=2?15:12;
      const target = findNearestEnemy(player.x,player.y,160);
      if (!target) return false;
      const dmg = player.weaponDamage*player.dmgMult*mult*rDmg*rScale*2;
      const died = target.takeDamage(dmg,{crit:true});
      player.onCrit();
      spawnBurst(target.x,target.y,['#ffcc66','#ffeecc','#ffffff'],24);
      hitPauseTimer=Math.max(hitPauseTimer,0.12);shake=Math.min(shake+6,10);
      if(rank>=2)target.stunTimer=Math.max(target.stunTimer||0,3);
      if(died){
        handleEnemyDeath(target);
        if(rank>=3){const aoe=player.weaponDamage*player.dmgMult*8*rDmg*rScale;for(const e of enemies){if(!e.alive)continue;if(Math.hypot(e.x-target.x,e.y-target.y)<80){const d2=e.takeDamage(aoe,{crit:true});player.onCrit();spawnBurst(e.x,e.y,['#ffcc66','#ffffff'],8);if(d2)handleEnemyDeath(e);}}}
        if(rank>=4){
          const chain=enemies.filter(e=>e.alive).sort((a,b)=>Math.hypot(a.x-target.x,a.y-target.y)-Math.hypot(b.x-target.x,b.y-target.y)).slice(0,3);
          for(const c of chain){const cd=player.weaponDamage*player.dmgMult*mult*0.5*rDmg*rScale*2;const d3=c.takeDamage(cd,{crit:true});player.onCrit();spawnBurst(c.x,c.y,['#ffcc66','#ffffff'],10);if(d3)handleEnemyDeath(c);}
        }
      }
      return true;
    },
  },

  // ── CRUSADER T2 (3rd slot) ────────────────────────────────────
  holyBeam: {
    id: 'holyBeam', name: 'Holy Beam', letter: 'B', tier: 2, classOf: 'crusader',
    desc: 'Fire a piercing beam of holy light. Heals 2% max HP per enemy hit.',
    maxRank: 5, rankDesc: ['Pierce beam 2× heal 2%', '2.5× heal 3%', '2.5× ★Notable: beam splits into 2 at 150px', '3.0× heal 5%', '★Capstone: 3.5×, beam bounces off walls once'],
    cost: 30, cooldown: 5.0, color: '#ffe866',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const mult = rank>=5?3.5:rank>=4?3.0:rank>=2?2.5:2.0;
      const healPct = rank>=4?0.05:rank>=3?0.03:0.02;
      const target = findNearestEnemy(player.x,player.y,player.weaponRange*1.8)||{x:mouseX,y:mouseY};
      const dx=target.x-player.x,dy=target.y-player.y,d=Math.hypot(dx,dy)||1;
      const dmg=player.weaponDamage*player.dmgMult*mult*rDmg*rScale;
      let healed=0;
      for(const e of enemies){
        if(!e.alive)continue;
        const ex=e.x-player.x,ey=e.y-player.y;
        const along=ex*(dx/d)+ey*(dy/d);
        const perp=Math.abs(-ex*(dy/d)+ey*(dx/d));
        if(along>0&&perp<14+e.r){
          const isCrit=Math.random()*100<player.critChance;
          const died=e.takeDamage(isCrit?dmg*2:dmg,{crit:isCrit});
          if(isCrit)player.onCrit();
          healed++;
          spawnBurst(e.x,e.y,['#ffe866','#ffffff'],6);
          if(died)handleEnemyDeath(e);
        }
      }
      player.hp=Math.min(player.maxHp,player.hp+player.maxHp*healPct*healed);
      spawnBurst(player.x,player.y,['#ffe866','#ffdd44','#ffffff'],10);
      return true;
    },
  },

  // ── CRUSADER T3 ───────────────────────────────────────────────
  avengerShield: {
    id: 'avengerShield', name: "Avenger's Shield", letter: 'G', tier: 3, classOf: 'crusader',
    desc: 'Throw a holy shield that bounces between 5 enemies, stunning each.',
    maxRank: 5, rankDesc: ['Bounce 3 targets 2.5× stun 1s', '5 targets 3×', '5 targets ★Notable: leaves holy field on last bounce', '7 targets 3.5×', '★Capstone: 7 targets 4×, shield returns to player for one final strike'],
    cost: 30, cooldown: 8.0, color: '#ffe866',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const bounces = rank>=4?7:rank>=2?5:3;
      const mult = rank>=5?4.0:rank>=4?3.5:rank>=2?3.0:2.5;
      const stunDur = 1.0;
      const dmg=player.weaponDamage*player.dmgMult*mult*rDmg*rScale;
      const hit=new Set(); let last=null;
      for(let b=0;b<bounces;b++){
        const pool=enemies.filter(e=>e.alive&&!hit.has(e));
        if(!pool.length)break;
        const t=pool.sort((a,b2)=>Math.hypot(a.x-(last?last.x:player.x),a.y-(last?last.y:player.y))-Math.hypot(b2.x-(last?last.x:player.x),b2.y-(last?last.y:player.y)))[0];
        hit.add(t); last=t;
        const isCrit=Math.random()*100<player.critChance;
        const bd=dmg*(isCrit?2:1)*Math.pow(0.85,b);
        const died=t.takeDamage(bd,{crit:isCrit});
        if(isCrit)player.onCrit();
        t.stunTimer=Math.max(t.stunTimer||0,stunDur);
        spawnBurst(t.x,t.y,['#ffe866','#ffffff'],10);
        spawnDamageNumber(t.x,t.y-t.r,bd,{color:isCrit?'#ffcc00':'#ffe866',crit:isCrit});
        if(died)handleEnemyDeath(t);
      }
      if(rank>=3&&last)groundEffects.push({type:'holy_zone',x:last.x,y:last.y,r:55,life:4.0,maxLife:4.0,damage:Math.round(player.weaponDamage*player.dmgMult*0.4),cooldowns:new Map()});
      spawnBurst(player.x,player.y,['#ffe866','#ffffff'],10);
      return true;
    },
  },
  blessingOfMight: {
    id: 'blessingOfMight', name: 'Blessing of Might', letter: 'M', tier: 3, classOf: 'crusader',
    desc: '10s: +50% damage, +25% attack speed. Every kill grants a burst of holy light.',
    maxRank: 5, rankDesc: ['Blessing 8s +50% dmg', '10s +30% aspd', '10s ★Notable: kill bursts deal holy AoE', '12s +40% aspd', '★Capstone: 12s, also shields you for 30% max HP'],
    cost: 40, cooldown: 18.0, color: '#ffcc44',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const dur = rank>=4?12:rank>=2?10:8;
      player.blessingTimer = dur;
      player.blessingDmgBonus = 0.50;
      player.blessingAspdBonus = rank>=4?0.40:rank>=2?0.30:0.25;
      player.blessingKillBurst = rank>=3;
      if(rank>=5)player.chiShield=(player.chiShield||0)+player.maxHp*0.30;
      spawnBurst(player.x,player.y,['#ffcc44','#ffeecc','#ffffff'],20);
      spawnDamageNumber(player.x,player.y-24,'BLESSED!',{color:'#ffcc44',size:12,vy:-50,life:1.5});
      return true;
    },
  },

  // ── CRUSADER T4 (Ultimates) ───────────────────────────────────
  wrathOfHeaven: {
    id: 'wrathOfHeaven', name: 'Wrath of Heaven', letter: 'E', tier: 4, classOf: 'crusader',
    desc: 'Call down a column of holy lightning on ALL enemies simultaneously.',
    maxRank: 5, rankDesc: ['All enemies 3× holy', '3.5×', '3.5× ★Notable: each strike Blinds 2s', '4× chain to 2 nearby', '★Capstone: 5× dmg, each killed enemy rains 3 bolts'],
    cost: 60, cooldown: 40.0, color: '#ffee66',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const mult=rank>=5?5:rank>=4?4:rank>=2?3.5:3;
      const dmg=player.weaponDamage*player.dmgMult*mult*rDmg*rScale;
      for(const e of [...enemies]){
        if(!e.alive)continue;
        const isCrit=Math.random()*100<player.critChance;
        const d=dmg*(isCrit?2:1);
        const died=e.takeDamage(d,{crit:isCrit});
        if(isCrit)player.onCrit();
        spawnBurst(e.x,e.y,['#ffee66','#ffdd44','#ffffff'],12);
        spawnDamageNumber(e.x,e.y-e.r-10,d,{color:'#ffee66',crit:isCrit});
        if(rank>=4){const near=enemies.filter(n=>n.alive&&n!==e&&Math.hypot(n.x-e.x,n.y-e.y)<60).slice(0,2);for(const n of near){const nd=n.takeDamage(d*0.5);spawnBurst(n.x,n.y,['#ffee66','#ffffff'],6);if(nd)handleEnemyDeath(n);}}
        if(died)handleEnemyDeath(e);
      }
      shake=Math.min(shake+8,14);hitPauseTimer=Math.max(hitPauseTimer,0.14);
      spawnDamageNumber(player.x,player.y-30,'WRATH OF HEAVEN!',{color:'#ffee66',size:15,vy:-65,life:2.0});
      return true;
    },
  },
  divineIntervention: {
    id: 'divineIntervention', name: 'Divine Intervention', letter: 'V', tier: 4, classOf: 'crusader',
    desc: 'Full heal, invuln 4s, massive holy AoE. Enemies hit are Judged (take 2× for 8s).',
    maxRank: 5, rankDesc: ['Heal+invuln 3s AoE 3×', '4s 4× AoE', '4s ★Notable: Judged enemies explode on death', '5s AoE 5×', '★Capstone: 5s + resets all non-ult cooldowns'],
    cost: 60, cooldown: 45.0, color: '#ffffff',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const dur = rank>=4?5:rank>=2?4:3;
      const mult = rank>=4?5:rank>=2?4:3;
      player.hp = player.maxHp;
      player.iframeTimer=Math.max(player.iframeTimer,dur);
      const radius=120; const dmg=player.weaponDamage*player.dmgMult*mult*rDmg*rScale;
      for(const e of enemies){
        if(!e.alive)continue;
        if(Math.hypot(e.x-player.x,e.y-player.y)<radius){
          const isCrit=Math.random()*100<player.critChance;
          const died=e.takeDamage(isCrit?dmg*2:dmg,{crit:isCrit});
          if(isCrit)player.onCrit();
          e.judged=8.0; e.judgedMult=2.0;
          spawnBurst(e.x,e.y,['#ffffff','#ffe866','#ffcc44'],10);
          if(died)handleEnemyDeath(e);
        }
      }
      if(rank>=5){for(let i=0;i<player.abilityCooldowns.length;i++){const ab=player.abilities[i];if(ab&&ab.def&&ab.def.tier<4)player.abilityCooldowns[i]=0;}}
      groundEffects.push({type:'shockwave',x:player.x,y:player.y,r:10,maxR:radius,damage:0,life:0.5,maxLife:0.5,color:'#ffe866',hit:new Set(),target:'none'});
      spawnBurst(player.x,player.y,['#ffffff','#ffe866','#ffcc44','#ffeecc'],36);
      spawnDamageNumber(player.x,player.y-30,'DIVINE INTERVENTION!',{color:'#ffffff',size:13,vy:-65,life:2.0});
      shake=Math.min(shake+6,12);
      return true;
    },
  },
  crusadersEdge: {
    id: 'crusadersEdge', name: "Crusader's Edge", letter: 'K', tier: 4, classOf: 'crusader',
    desc: '12s: every attack cleaves in a holy arc, all hits generate Wrath. At max Wrath: Righteous Fury.',
    maxRank: 5, rankDesc: ['Edge 10s holy cleave', '12s Wrath 3× faster', '12s ★Notable: Righteous Fury also heals 20% HP', '14s cleave pierces', '★Capstone: 14s, Righteous Fury triggers every 10s automatically'],
    cost: 60, cooldown: 45.0, color: '#ffcc44',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const dur = rank>=4?14:rank>=2?12:10;
      player.crusaderEdgeTimer = dur;
      player.crusaderEdgeDmgBonus = 0.40;
      player.crusaderEdgeHealFury = rank>=3;
      player.crusaderEdgePierce = rank>=4;
      player.crusaderEdgeAutoFury = rank>=5;
      player.crusaderFuryFill = rank>=2?3:1; // multiplier for wrath gain speed
      spawnBurst(player.x,player.y,['#ffcc44','#ffe866','#ffffff'],24);
      spawnDamageNumber(player.x,player.y-28,"CRUSADER'S EDGE!",{color:'#ffcc44',size:14,vy:-60,life:2.0});
      return true;
    },
  },

  // ── WITCH DOCTOR ─────────────────────────────────────────────
  plagueFrogs: {
    id: 'plagueFrogs', tier: 1, name: 'Plague of Frogs', letter: 'T', classOf: 'shaman',
    desc: '8 piercing toad projectiles in a ring',
    maxRank: 5, rankDesc: ['3 frogs bounce 1.5×', '4 frogs 1.6×', '5 frogs ★Notable: frogs leave poison pool', '6 chain frogs', '8 frogs ★Capstone: frogs spawn on kill chains'],
    cost: 25, cooldown: 3.0, color: '#55dd66',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const count = 8;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        const sp = player.weaponProjSpeed * 0.75;
        let dmg = player.weaponDamage * player.dmgMult * 1.2 * rDmg * rScale;
        const isCrit = Math.random() * 100 < player.critChance;
        if (isCrit) { dmg *= 2; player.onCrit(); }
        const proj = new Projectile(player.x, player.y, Math.cos(a)*sp, Math.sin(a)*sp, dmg, 1.2, isCrit);
        proj.piercing = true; proj.r = 3; proj.theme = 'arcane';
        projectiles.push(proj);
      }
      spawnBurst(player.x, player.y, ['#55dd66', '#88ff88', '#ffffff'], 12);
      shake = Math.min(shake + 2, 5);
      return true;
    },
  },
  soulHarvest: {
    id: 'soulHarvest', tier: 1, name: 'Soul Harvest', letter: 'H', classOf: 'shaman',
    desc: 'AoE damage, heal 4 HP per enemy hit',
    maxRank: 5, rankDesc: ['Drain souls 2.0×', '2.2× more', '2.5× ★Notable: 5% lifesteal per hit', '3.0× bigger', '4.0× ★Capstone: stacking buff 5 charges'],
    cost: 35, cooldown: 5.0, color: '#22aa44',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const radius = 100;
      const dmg = player.weaponDamage * player.dmgMult * 1.8 * rDmg * rScale;
      let hits = 0;
      for (const e of enemies) {
        if (!e.alive) continue;
        const dx = e.x - player.x, dy = e.y - player.y;
        if (dx*dx + dy*dy < radius*radius) {
          const isCrit = Math.random() * 100 < player.critChance;
          const died = e.takeDamage(isCrit ? dmg*2 : dmg, { crit: isCrit });
          if (isCrit) player.onCrit();
          hits++;
          if (died) handleEnemyDeath(e);
        }
      }
      player.hp = Math.min(player.maxHp, player.hp + hits * 4);
      groundEffects.push({ type: 'shockwave', x: player.x, y: player.y, r: 10, maxR: radius, damage: 0, life: 0.4, maxLife: 0.4, color: '#55dd66', hit: new Set(), target: 'none' });
      spawnBurst(player.x, player.y, ['#55dd66', '#88ff88', '#ffffff'], 16);
      shake = Math.min(shake + 2, 5);
      return true;
    },
  },
  bigBadVoodoo: {
    id: 'bigBadVoodoo', tier: 2, name: 'Big Bad Voodoo', letter: 'V', classOf: 'shaman',
    desc: '+35% dmg & +15% speed for 8s',
    maxRank: 5, rankDesc: ['+30% all stats 20s', '35% 25s', '40% 30s ★Notable: 45s duration', '50% 40s', '70% 60s ★Capstone: doubles effect of all buffs'],
    cost: 60, cooldown: 15.0, color: '#aaff44',
    cast: (player) => {
      player.bigBadVoodooTimer = 8.0;
      spawnBurst(player.x, player.y, ['#55dd66', '#aaff44', '#ffff44', '#ffffff'], 20);
      return true;
    },
  },
  corpseSpiders: {
    id: 'corpseSpiders', tier: 2, name: 'Corpse Spiders', letter: 'S', classOf: 'shaman',
    desc: 'Explosive projectile splits into 3 fast piercers',
    maxRank: 5, rankDesc: ['3 spiders 1.2×', '4 spiders', '5 spiders ★Notable: webs slow 50% 2s', '6 venomous', '8 spiders ★Capstone: explode on death AoE'],
    cost: 30, cooldown: 3.5, color: '#885522',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const target = findNearestEnemy(player.x, player.y, 260);
      if (!target) return false;
      const dx = target.x - player.x, dy = target.y - player.y;
      const d = Math.hypot(dx, dy) || 1;
      let dmg = player.weaponDamage * player.dmgMult * 1.5 * rDmg * rScale;
      const isCrit = Math.random() * 100 < player.critChance;
      if (isCrit) { dmg *= 2; player.onCrit(); }
      const proj = new Projectile(player.x, player.y, (dx/d)*player.weaponProjSpeed*0.8, (dy/d)*player.weaponProjSpeed*0.8, dmg, d/(player.weaponProjSpeed*0.8)+0.1, isCrit);
      proj.r = 5; proj.theme = 'arcane';
      proj.explosive = true;
      proj.explosionRadius = 30;
      proj.explosionDamage = dmg * 0.5;
      // Spawn 3 piercers from impact point (handled via explosive callback — use groundEffect proxy)
      proj.onExplode = (px2, py2) => {
        for (let i = 0; i < 3; i++) {
          const a = (i / 3) * Math.PI * 2 + Math.random() * 0.4;
          const sp2 = player.weaponProjSpeed * 1.2;
          const p2 = new Projectile(px2, py2, Math.cos(a)*sp2, Math.sin(a)*sp2, dmg*0.5, 0.6, false);
          p2.piercing = true; p2.r = 2; p2.theme = 'arcane';
          projectiles.push(p2);
        }
      };
      projectiles.push(proj);
      spawnBurst(player.x, player.y, ['#885522', '#55dd66'], 8);
      return true;
    },
  },
  locustSwarm: {
    id: 'locustSwarm', tier: 3, name: 'Locust Swarm', letter: 'L', classOf: 'shaman',
    desc: 'Slow + damage all enemies in 130px',
    maxRank: 5, rankDesc: ['Swarm 1.5× DoT', '1.7× spreads', '2.0× ★Notable: spreads on kill', '2.4× 2 swarms', '3.0× ★Capstone: 3 swarms + double spread'],
    cost: 40, cooldown: 6.0, color: '#66aa22',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const radius = 130;
      const dmg = player.weaponDamage * player.dmgMult * 1.5 * rDmg * rScale;
      for (const e of enemies) {
        if (!e.alive) continue;
        const dx = e.x - player.x, dy = e.y - player.y;
        if (dx*dx + dy*dy < radius*radius) {
          const isCrit = Math.random() * 100 < player.critChance;
          const died = e.takeDamage(isCrit ? dmg*2 : dmg, { crit: isCrit });
          if (isCrit) player.onCrit();
          e.slowTimer = 3.0; e.slowFactor = 0.45;
          if (died) handleEnemyDeath(e);
        }
      }
      spawnBurst(player.x, player.y, ['#66aa22', '#88ff44', '#55dd66'], 22);
      shake = Math.min(shake + 2, 5);
      return true;
    },
  },

  // ── NECROMANCER ──────────────────────────────────────────────
  boneSpear: {
    id: 'boneSpear', tier: 1, name: 'Bone Spear', letter: 'B', classOf: 'necromancer',
    desc: 'Fast piercing bone lance (280% dmg)',
    maxRank: 5, rankDesc: ['Bone spear 2.0×', '2.3× faster', '2.6× ★Notable: piercing spear', '3.0× bigger', '4.0× ★Capstone: shatters into 5 bone shards'],
    cost: 30, cooldown: 2.0, color: '#ccbbee',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const target = findNearestEnemy(player.x, player.y, player.weaponRange * 2);
      if (!target) return false;
      const dx = target.x - player.x, dy = target.y - player.y;
      const d = Math.hypot(dx, dy) || 1;
      const sp = player.weaponProjSpeed * 1.6;
      let dmg = player.weaponDamage * player.dmgMult * 2.8 * rDmg * rScale;
      const isCrit = Math.random() * 100 < player.critChance;
      if (isCrit) { dmg *= 2; player.onCrit(); }
      const proj = new Projectile(player.x, player.y, (dx/d)*sp, (dy/d)*sp, dmg, 1.0, isCrit);
      proj.piercing = true; proj.r = 4; proj.theme = 'arcane';
      projectiles.push(proj);
      spawnBurst(player.x, player.y, ['#9988cc', '#ccbbee', '#ffffff'], 8);
      return true;
    },
  },
  deathNova: {
    id: 'deathNova', tier: 1, name: 'Death Nova', letter: 'N', classOf: 'necromancer',
    desc: 'Bone explosion AoE around player (200% dmg)',
    maxRank: 5, rankDesc: ['Death ring 2.5×', '2.8× wider', '3.0× ★Notable: bone zone persists 3s', '3.5×', '4.5× ★Capstone: 2× radius + slows 70%'],
    cost: 40, cooldown: 4.0, color: '#7766aa',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const radius = 85;
      const dmg = player.weaponDamage * player.dmgMult * 2.0 * rDmg * rScale;
      for (const e of enemies) {
        if (!e.alive) continue;
        const dx = e.x - player.x, dy = e.y - player.y;
        if (dx*dx + dy*dy < radius*radius) {
          const isCrit = Math.random() * 100 < player.critChance;
          const died = e.takeDamage(isCrit ? dmg*2 : dmg, { crit: isCrit });
          if (isCrit) player.onCrit();
          if (died) handleEnemyDeath(e);
        }
      }
      groundEffects.push({ type: 'shockwave', x: player.x, y: player.y, r: 10, maxR: radius, damage: 0, life: 0.45, maxLife: 0.45, color: '#9988cc', hit: new Set(), target: 'none' });
      spawnBurst(player.x, player.y, ['#9988cc', '#ccbbee', '#ffffff'], 18);
      shake = Math.min(shake + 4, 7);
      return true;
    },
  },
  boneArmor: {
    id: 'boneArmor', tier: 1, name: 'Bone Armor', letter: 'R', classOf: 'necromancer',
    desc: 'Absorb the next 3 hits',
    maxRank: 5, rankDesc: ['5 bone stacks absorb', '6 stacks + thorns', '7 stacks ★Notable: thorns reflect 30% dmg', '8 stacks spike AoE', '10 stacks ★Capstone: spikes detonate on 0'],
    cost: 35, cooldown: 10.0, color: '#d0c8ee',
    cast: (player) => {
      player.boneArmorCharges = 3;
      spawnBurst(player.x, player.y, ['#d0c8ee', '#9988cc', '#ffffff'], 14);
      return true;
    },
  },
  bloodNova: {
    id: 'bloodNova', tier: 2, name: 'Blood Nova', letter: 'V', classOf: 'necromancer',
    desc: 'Sacrifice 15% max HP for massive AoE',
    maxRank: 5, rankDesc: ['Blood ring 2.0×', '2.3× bigger', '2.6× ★Notable: 8% lifesteal per hit', '3.0×', '4.0× ★Capstone: leaves blood puddle 4s'],
    cost: 0, cooldown: 6.0, color: '#cc2244',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const sacrifice = Math.round(player.maxHp * 0.15);
      if (player.hp <= sacrifice) return false; // refuse if fatal
      player.hp -= sacrifice;
      const radius = 110;
      const dmg = player.weaponDamage * player.dmgMult * 3.5 * rDmg * rScale + sacrifice * 0.5;
      for (const e of enemies) {
        if (!e.alive) continue;
        const dx = e.x - player.x, dy = e.y - player.y;
        if (dx*dx + dy*dy < radius*radius) {
          const isCrit = Math.random() * 100 < player.critChance;
          const died = e.takeDamage(isCrit ? dmg*2 : dmg, { crit: isCrit });
          if (isCrit) player.onCrit();
          if (died) handleEnemyDeath(e);
        }
      }
      groundEffects.push({ type: 'shockwave', x: player.x, y: player.y, r: 10, maxR: radius, damage: 0, life: 0.5, maxLife: 0.5, color: '#cc2244', hit: new Set(), target: 'none' });
      spawnBurst(player.x, player.y, ['#cc2244', '#ff4466', '#ffffff'], 24);
      shake = Math.min(shake + 6, 10);
      hitPauseTimer = Math.max(hitPauseTimer, 0.08);
      return true;
    },
  },
  corpseLance: {
    id: 'corpseLance', tier: 3, name: 'Corpse Lance', letter: 'L', classOf: 'necromancer',
    desc: 'Fire bone lances at 3 nearest enemies',
    maxRank: 5, rankDesc: ['3.0× piercing', '3.3×', '3.6× ★Notable: splits into 2 on pierce', '4.0× homing', '5.0× ★Capstone: 3 simultaneous lances'],
    cost: 45, cooldown: 3.0, color: '#aa99dd',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const sorted = enemies.filter(e => e.alive).sort((a,b) => Math.hypot(a.x-player.x,a.y-player.y) - Math.hypot(b.x-player.x,b.y-player.y));
      const targets = sorted.slice(0, 3);
      if (!targets.length) return false;
      for (const t of targets) {
        const dx = t.x - player.x, dy = t.y - player.y;
        const d = Math.hypot(dx, dy) || 1;
        const sp = player.weaponProjSpeed * 1.4;
        let dmg = player.weaponDamage * player.dmgMult * 2.0 * rDmg * rScale;
        const isCrit = Math.random() * 100 < player.critChance;
        if (isCrit) { dmg *= 2; player.onCrit(); }
        const proj = new Projectile(player.x, player.y, (dx/d)*sp, (dy/d)*sp, dmg, d/sp+0.1, isCrit);
        proj.r = 3; proj.theme = 'arcane';
        projectiles.push(proj);
      }
      spawnBurst(player.x, player.y, ['#9988cc', '#ffffff'], 10);
      return true;
    },
  },
  // ── SHAMAN T1 (new ability: hexBolt) ────────────────────────
  hexBolt: {
    id: 'hexBolt', name: 'Hex Bolt', letter: 'X', tier: 1, classOf: 'shaman',
    desc: 'Fast hex projectile. Curses the target: takes +35% damage for 5s.',
    maxRank: 5, rankDesc: ['Hex bolt 1.8×, Curse 5s', '2.0× Curse 7s', '2.2× ★Notable: Curse spreads to 1 nearby on kill', '2.5× Curse 10s double', '★Capstone: 3.0×, Curse chains to all enemies in 80px'],
    cost: 20, cooldown: 1.5, color: '#55dd66',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const mult = rank>=5?3.0:rank>=4?2.5:rank>=3?2.2:rank>=2?2.0:1.8;
      const curseDur = rank>=4?10:rank>=2?7:5;
      const target = findNearestEnemy(player.x, player.y, player.weaponRange * 1.5);
      if (!target) return false;
      const dx = target.x - player.x, dy = target.y - player.y;
      const d = Math.hypot(dx, dy) || 1;
      const sp = player.weaponProjSpeed * 1.4;
      const dmg = player.weaponDamage * player.dmgMult * mult * rDmg * rScale;
      const isCrit = Math.random() * 100 < player.critChance;
      const proj = new Projectile(player.x, player.y, (dx/d)*sp, (dy/d)*sp, isCrit?dmg*2:dmg, d/sp+0.1, isCrit);
      if (isCrit) player.onCrit();
      proj.r = 4; proj.theme = 'arcane';
      proj.onHit = (e) => {
        e.cursed = curseDur; e.cursedMult = rank>=4?1.50:1.35;
        if (rank>=3) {
          const spread = enemies.filter(n=>n.alive&&n!==e&&Math.hypot(n.x-e.x,n.y-e.y)<80);
          if (spread.length) { spread[0].cursed=curseDur*0.5; spread[0].cursedMult=1.35; }
        }
        if (rank>=5) {
          for (const n of enemies) { if(n.alive&&n!==e&&Math.hypot(n.x-e.x,n.y-e.y)<80){ n.cursed=curseDur; n.cursedMult=1.35; } }
        }
        spawnBurst(e.x, e.y, ['#55dd66', '#88ff88', '#aaff44'], 8);
      };
      projectiles.push(proj);
      spawnBurst(player.x, player.y, ['#55dd66', '#88ff88'], 6);
      return true;
    },
  },
  spiritTotem: {
    id: 'spiritTotem', name: 'Spirit Totem', letter: 'T', tier: 1, classOf: 'shaman',
    desc: 'Plant a spirit totem that fires at the nearest enemy for 10s.',
    maxRank: 5, rankDesc: ['Totem 10s 1×/s', '12s 1.3×/s faster', '12s ★Notable: totem fires hexed shots (Curse)', '15s 1.6×/s 2 targets', '★Capstone: 15s, totem explodes AoE on expire'],
    cost: 30, cooldown: 12.0, color: '#aaff44',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const dur = rank>=4?15:rank>=2?12:10;
      const fireRate = rank>=4?1.6:rank>=2?1.3:1.0;
      player.spiritTotemTimer = dur;
      player.spiritTotemDmg = player.weaponDamage * player.dmgMult * 1.2 * rDmg * rScale;
      player.spiritTotemX = player.x; player.spiritTotemY = player.y;
      player.spiritTotemFireRate = fireRate;
      player.spiritTotemHitTimer = 0;
      player.spiritTotemHex = rank>=3;
      player.spiritTotemExplode = rank>=5;
      player.spiritTotemTargets = rank>=4?2:1;
      spawnBurst(player.x, player.y, ['#aaff44', '#55dd66', '#ffffff'], 16);
      spawnDamageNumber(player.x, player.y-22, 'TOTEM!', {color:'#aaff44', size:11, vy:-45, life:1.2});
      return true;
    },
  },

  // ── SHAMAN T2 (new ability: venomCloud) ──────────────────────
  venomCloud: {
    id: 'venomCloud', name: 'Venom Cloud', letter: 'C', tier: 2, classOf: 'shaman',
    desc: 'Drop a poisonous cloud at cursor. Enemies inside take DoT and are slowed.',
    maxRank: 5, rankDesc: ['Cloud 5s slow 40% DoT', '6s wider', '6s ★Notable: cloud spawns 2 toxic frogs on expire', '8s double DoT', '★Capstone: 8s, cloud hexes all enemies inside on spawn'],
    cost: 35, cooldown: 8.0, color: '#44cc22',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const dur = rank>=4?8:rank>=2?6:5;
      const dmgPerSec = player.weaponDamage * player.dmgMult * 0.8 * rDmg * rScale * (rank>=4?2:1);
      const r = rank>=2?70:55;
      const tx = (typeof mouseX !== 'undefined' ? mouseX : player.x);
      const ty = (typeof mouseY !== 'undefined' ? mouseY : player.y);
      groundEffects.push({type:'burn', x:tx, y:ty, r, life:dur, maxLife:dur, dmgPerSec, color:'#44cc22', hit:new Set(), slow:0.40});
      if (rank>=3) {
        // flag to spawn frogs on expire — store in groundEffect directly
        groundEffects[groundEffects.length-1].onExpire = () => {
          for (let i=0;i<2;i++){const a=i*Math.PI;const sp=player.weaponProjSpeed*0.7;const p2=new Projectile(tx,ty,Math.cos(a)*sp,Math.sin(a)*sp,dmgPerSec*2,1.0,false);p2.piercing=true;p2.r=3;p2.theme='arcane';projectiles.push(p2);}
        };
      }
      if (rank>=5) {
        for (const e of enemies) { if(e.alive&&Math.hypot(e.x-tx,e.y-ty)<r){e.cursed=(e.cursed||0)+4;e.cursedMult=1.35;} }
      }
      spawnBurst(tx, ty, ['#44cc22', '#88ff44', '#55dd66'], 16);
      return true;
    },
  },

  // ── SHAMAN T3 (2 new abilities) ──────────────────────────────
  stormCall: {
    id: 'stormCall', name: 'Storm Call', letter: 'O', tier: 3, classOf: 'shaman',
    desc: 'Call lightning that chains between 4 enemies. Stuns and generates Mojo.',
    maxRank: 5, rankDesc: ['Chain 4 targets 2.5× stun 0.5s', '5 targets 2.8×', '5 targets ★Notable: Cursed enemies hit for 2× chain dmg', '7 targets 3.5×', '★Capstone: 7 targets 4×, each strike drops a thunder zone 3s'],
    cost: 40, cooldown: 7.0, color: '#88ddff',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const bounces = rank>=4?7:rank>=2?5:4;
      const mult = rank>=5?4.0:rank>=4?3.5:rank>=2?2.8:2.5;
      const dmg = player.weaponDamage * player.dmgMult * mult * rDmg * rScale;
      const hit = new Set(); let last = null;
      for (let b = 0; b < bounces; b++) {
        const pool = enemies.filter(e=>e.alive&&!hit.has(e));
        if (!pool.length) break;
        const t = pool.sort((a,b2)=>Math.hypot(a.x-(last?last.x:player.x),a.y-(last?last.y:player.y))-Math.hypot(b2.x-(last?last.x:player.x),b2.y-(last?last.y:player.y)))[0];
        hit.add(t); last = t;
        const isCrit = Math.random()*100<player.effectiveCritChance();
        let fd = dmg*(isCrit?2:1);
        if (rank>=3 && (t.cursed||0)>0) fd *= 2;
        const died = t.takeDamage(fd,{crit:isCrit,color:'#88ddff'});
        if (isCrit) player.onCrit();
        t.stunTimer = Math.max(t.stunTimer||0, 0.5);
        t.shocked = true;
        spawnBurst(t.x, t.y, ['#88ddff','#44aaff','#ffffff'], 10);
        spawnDamageNumber(t.x, t.y-t.r, fd, {color:'#88ddff', crit:isCrit});
        if (rank>=5) groundEffects.push({type:'holy_zone',x:t.x,y:t.y,r:35,life:3.0,maxLife:3.0,damage:Math.round(dmg*0.3),cooldowns:new Map()});
        if (died) handleEnemyDeath(t);
      }
      player.resource = Math.min(player.maxResource, player.resource + 20);
      shake = Math.min(shake+4,8);
      spawnDamageNumber(player.x, player.y-28, 'STORM CALL!', {color:'#88ddff',size:13,vy:-55,life:1.5});
      return true;
    },
  },
  spiritWalk: {
    id: 'spiritWalk', name: 'Spirit Walk', letter: 'W', tier: 3, classOf: 'shaman',
    desc: '3s: phase through enemies, +60% speed, rapid Mojo regen. Exit = AoE spirit burst.',
    maxRank: 5, rankDesc: ['Spirit walk 2s +50% spd', '3s +60% spd', '3s ★Notable: Mojo fills completely on exit', '4s +80% spd spirit trail', '★Capstone: 4s, on exit summon 3 spirit warriors 8s'],
    cost: 50, cooldown: 18.0, color: '#99eeff',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const dur = rank>=4?4:rank>=2?3:2;
      player.spiritWalkTimer = dur;
      player.spiritWalkSpeedBonus = rank>=4?0.80:rank>=2?0.60:0.50;
      player.iframeTimer = Math.max(player.iframeTimer, dur);
      player.spiritWalkFillMana = rank>=3;
      player.spiritWalkTrail = rank>=4;
      player.spiritWalkSummon = rank>=5;
      spawnBurst(player.x, player.y, ['#99eeff','#55ddcc','#ffffff'], 20);
      spawnDamageNumber(player.x, player.y-26, 'SPIRIT WALK!', {color:'#99eeff',size:13,vy:-52,life:1.4});
      return true;
    },
  },

  // ── SHAMAN T4 (Ultimates) ─────────────────────────────────────
  massHex: {
    id: 'massHex', name: 'Mass Hex', letter: 'M', tier: 4, classOf: 'shaman',
    desc: 'Hex ALL enemies simultaneously. All take +60% damage for 8s.',
    maxRank: 5, rankDesc: ['All enemies Cursed 5s +50%', '7s +60%', '7s ★Notable: Cursed enemies stunned 1.5s on cast', '8s +75%', '★Capstone: 10s +100%, Hex also halves all enemies speed'],
    cost: 70, cooldown: 35.0, color: '#55dd66',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const dur = rank>=4?8:rank>=2?7:5;
      const mult = rank>=5?2.0:rank>=4?1.75:rank>=2?1.60:1.50;
      for (const e of enemies) {
        if (!e.alive) continue;
        e.cursed = dur; e.cursedMult = mult;
        if (rank>=3) e.stunTimer = Math.max(e.stunTimer||0, 1.5);
        if (rank>=5) { e.slowTimer = Math.max(e.slowTimer||0, dur); e.slowFactor = 0.50; }
        spawnBurst(e.x, e.y, ['#55dd66','#aaff44'], 6);
      }
      spawnBurst(player.x, player.y, ['#55dd66','#aaff44','#ffffff'], 32);
      spawnDamageNumber(player.x, player.y-32, 'MASS HEX!', {color:'#55dd66',size:15,vy:-65,life:2.0});
      shake = Math.min(shake+6,12);
      hitPauseTimer = Math.max(hitPauseTimer, 0.12);
      return true;
    },
  },
  spiritStorm: {
    id: 'spiritStorm', name: 'Spirit Storm', letter: 'R', tier: 4, classOf: 'shaman',
    desc: '8s channeled storm: random lightning strikes across entire arena every 0.3s.',
    maxRank: 5, rankDesc: ['Storm 6s bolt every 0.4s 3×', '7s 0.35s', '7s ★Notable: bolts seek Cursed enemies', '8s 0.3s 4×', '★Capstone: 10s, bolts detonate Cursed enemies for 10× on hit'],
    cost: 70, cooldown: 45.0, color: '#cceeff',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const dur = rank>=5?10:rank>=4?8:rank>=2?7:6;
      player.spiritStormTimer = dur;
      player.spiritStormDmg = player.weaponDamage * player.dmgMult * 3.0 * rDmg * rScale;
      player.spiritStormInterval = rank>=4?0.30:rank>=2?0.35:0.40;
      player.spiritStormBoltTimer = 0;
      player.spiritStormSeek = rank>=3;
      player.spiritStormDetonate = rank>=5;
      spawnBurst(player.x, player.y, ['#cceeff','#88ddff','#ffffff'], 28);
      spawnDamageNumber(player.x, player.y-30, 'SPIRIT STORM!', {color:'#cceeff',size:14,vy:-62,life:1.8});
      shake = Math.min(shake+5,10);
      return true;
    },
  },
  ancestralFury: {
    id: 'ancestralFury', name: 'Ancestral Fury', letter: 'A', tier: 4, classOf: 'shaman',
    desc: 'Summon 3 ancestor spirits that each unleash a massive soul blast, then fight for 12s.',
    maxRank: 5, rankDesc: ['3 spirits 3× blast', '4× blast spirits 10s', '4× ★Notable: spirits inherit Curse', '5× spirits 14s', '★Capstone: 5 spirits 6× blast 15s, spirits explode on death'],
    cost: 80, cooldown: 50.0, color: '#aaff88',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const count = rank>=5?5:3;
      const blastMult = rank>=5?6:rank>=4?5:rank>=2?4:3;
      const summonDur = rank>=4?14:rank>=2?10:8;
      const blastDmg = player.weaponDamage * player.dmgMult * blastMult * rDmg * rScale;
      // Immediate blast: each spirit fires a radial burst
      for (let s = 0; s < count; s++) {
        const bCount = 10;
        for (let i = 0; i < bCount; i++) {
          const a = (i/bCount)*Math.PI*2 + (s/count)*Math.PI*2;
          const sp = player.weaponProjSpeed;
          const proj = new Projectile(player.x, player.y, Math.cos(a)*sp, Math.sin(a)*sp, blastDmg, 0.8, false);
          proj.theme = 'arcane'; proj.r = 3; proj.piercing = true;
          if (rank>=3) proj.onHit = (e) => { e.cursed=(e.cursed||0)+3; e.cursedMult=1.35; };
          projectiles.push(proj);
        }
        spawnBurst(player.x, player.y, ['#aaff88','#55dd66','#ffffff'], 8);
      }
      // Summon spirit minions (reuse summons array)
      if (!player.summons) player.summons = [];
      for (let s = 0; s < count; s++) {
        const angle = (s/count)*Math.PI*2;
        player.summons.push({
          type:'spirit', x:player.x+Math.cos(angle)*30, y:player.y+Math.sin(angle)*30,
          hp:999, maxHp:999, alive:true, life:summonDur,
          dmg:player.weaponDamage*player.dmgMult*1.5*rDmg*rScale,
          fireTimer:0, fireRate:1.5, r:7, theme:'spirit',
          explodeOnDeath: rank>=5,
        });
      }
      spawnBurst(player.x, player.y, ['#aaff88','#55dd66','#ccff88','#ffffff'], 36);
      spawnDamageNumber(player.x, player.y-32, 'ANCESTRAL FURY!', {color:'#aaff88',size:15,vy:-65,life:2.0});
      shake = Math.min(shake+8,14);
      hitPauseTimer = Math.max(hitPauseTimer, 0.14);
      return true;
    },
  },

  // ── NECROMANCER T2 (2 new abilities) ─────────────────────────
  corpseExplosion: {
    id: 'corpseExplosion', name: 'Corpse Explosion', letter: 'E', tier: 2, classOf: 'necromancer',
    desc: 'Detonate a corpse (or enemy below 20% HP) for massive AoE bone shrapnel.',
    maxRank: 5, rankDesc: ['Detonate 1 target 3×', '3.5× bigger', '3.5× ★Notable: shrapnel pierce 3 targets each', '4.5× 2 targets', '★Capstone: 5× detonate all low-HP enemies simultaneously'],
    cost: 35, cooldown: 5.0, color: '#9988cc',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const mult = rank>=5?5:rank>=4?4.5:rank>=2?3.5:3;
      const aoeR = rank>=2?80:60;
      const targets = rank>=4?2:1;
      // Find low-HP enemies (under 20%) or just nearest
      const lowHp = enemies.filter(e=>e.alive&&e.hp<=e.maxHp*0.20);
      const pool = lowHp.length ? lowHp : enemies.filter(e=>e.alive);
      if (!pool.length) return false;
      const sorted = pool.sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y));
      const explodeList = rank>=5 ? (lowHp.length?lowHp:sorted.slice(0,1)) : sorted.slice(0,targets);
      for (const t of explodeList) {
        const dmg = player.weaponDamage * player.dmgMult * mult * rDmg * rScale;
        const died = t.takeDamage(dmg*3, {crit:true, color:'#9988cc'});
        player.onCrit();
        // Shrapnel burst
        const shards = 8;
        for (let i=0;i<shards;i++){
          const a=(i/shards)*Math.PI*2;const sp=player.weaponProjSpeed*1.1;
          const proj=new Projectile(t.x,t.y,Math.cos(a)*sp,Math.sin(a)*sp,dmg,0.7,false);
          proj.r=3;proj.theme='arcane';proj.piercing=(rank>=3);
          projectiles.push(proj);
        }
        spawnBurst(t.x,t.y,['#9988cc','#ccbbee','#ffffff'],20);
        spawnDamageNumber(t.x,t.y-t.r,'CORPSE!',{color:'#9988cc',size:12,vy:-50,life:1.3});
        shake=Math.min(shake+5,9);
        if(died)handleEnemyDeath(t);
        // AoE neighbors
        for(const n of enemies){if(!n.alive||n===t)continue;if(Math.hypot(n.x-t.x,n.y-t.y)<aoeR){const nd=n.takeDamage(dmg,{crit:false,color:'#9988cc'});spawnBurst(n.x,n.y,['#9988cc','#ffffff'],8);if(nd)handleEnemyDeath(n);}}
      }
      return true;
    },
  },
  skeletonWarrior: {
    id: 'skeletonWarrior', name: 'Skeleton Warrior', letter: 'K', tier: 2, classOf: 'necromancer',
    desc: 'Raise 2 skeleton warriors that attack nearby enemies for 15s.',
    maxRank: 5, rankDesc: ['2 skeletons 15s', '3 skeletons 18s', '3 skeletons ★Notable: skeletons explode on death AoE', '4 skeletons 20s', '★Capstone: 5 skeletons 25s, skeletons copy player crits'],
    cost: 40, cooldown: 20.0, color: '#ccbbee',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const count = rank>=5?5:rank>=4?4:rank>=2?3:2;
      const dur = rank>=4?20:rank>=2?18:15;
      if (!player.summons) player.summons = [];
      for (let s = 0; s < count; s++) {
        const angle = (s/count)*Math.PI*2;
        player.summons.push({
          type:'skeleton', x:player.x+Math.cos(angle)*35, y:player.y+Math.sin(angle)*35,
          hp:player.maxHp*0.3, maxHp:player.maxHp*0.3, alive:true, life:dur,
          dmg:player.weaponDamage*player.dmgMult*0.9*rDmg*rScale,
          fireTimer:0, fireRate:1.1, r:6, theme:'arcane',
          explodeOnDeath:rank>=3,
          copyPlayerCrit:rank>=5,
        });
      }
      spawnBurst(player.x, player.y, ['#ccbbee','#9988cc','#ffffff'], 18);
      spawnDamageNumber(player.x, player.y-24, 'RISE!', {color:'#ccbbee',size:12,vy:-48,life:1.3});
      return true;
    },
  },

  // ── NECROMANCER T3 (2 new abilities) ─────────────────────────
  deathCoil: {
    id: 'deathCoil', name: 'Death Coil', letter: 'D', tier: 3, classOf: 'necromancer',
    desc: 'Seeking bone coil: homes on nearest enemy, bounces to 3 more. Heals on kill.',
    maxRank: 5, rankDesc: ['Coil 3 bounces 2.5×', '4 bounces 2.8×', '4 bounces ★Notable: each bounce applies Bone Crack (×1.3 dmg taken)', '5 bounces 3.5×', '★Capstone: 6 bounces 4×, kill heals 8% max HP'],
    cost: 40, cooldown: 6.0, color: '#aa88dd',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const bounces = rank>=5?6:rank>=4?5:rank>=2?4:3;
      const mult = rank>=5?4.0:rank>=4?3.5:rank>=2?2.8:2.5;
      const dmg = player.weaponDamage * player.dmgMult * mult * rDmg * rScale;
      const boneCrack = rank>=3;
      const healOnKill = rank>=5;
      const hit = new Set(); let last = null;
      for (let b=0;b<bounces;b++){
        const pool=enemies.filter(e=>e.alive&&!hit.has(e));
        if(!pool.length)break;
        const t=pool.sort((a,bx)=>Math.hypot(a.x-(last?last.x:player.x),a.y-(last?last.y:player.y))-Math.hypot(bx.x-(last?last.x:player.x),bx.y-(last?last.y:player.y)))[0];
        hit.add(t); last=t;
        const isCrit=Math.random()*100<player.effectiveCritChance();
        const fd=dmg*(isCrit?2:1)*Math.pow(0.9,b);
        if(boneCrack){t.boneCrack=(t.boneCrack||0)+1;t.boneCrackMult=1+t.boneCrack*0.15;}
        const died=t.takeDamage(fd*(t.boneCrackMult||1),{crit:isCrit,color:'#aa88dd'});
        if(isCrit)player.onCrit();
        spawnBurst(t.x,t.y,['#aa88dd','#ccbbee','#ffffff'],10);
        spawnDamageNumber(t.x,t.y-t.r,fd,{color:'#aa88dd',crit:isCrit});
        if(died){if(healOnKill)player.hp=Math.min(player.maxHp,player.hp+Math.ceil(player.maxHp*0.08));handleEnemyDeath(t);}
      }
      spawnBurst(player.x,player.y,['#aa88dd','#9988cc'],8);
      return true;
    },
  },
  lichForm: {
    id: 'lichForm', name: 'Lich Form', letter: 'F', tier: 3, classOf: 'necromancer',
    desc: '12s: become undying. +60% dmg, bone armor infinite, abilities cost no resource.',
    maxRank: 5, rankDesc: ['Lich 8s +50% dmg, bone armor', '10s +60% dmg', '10s ★Notable: Necrotic Power fills on kill', '12s +75% dmg', '★Capstone: 15s, on Lich expire: rise to 30% HP if at 0 (once per wave)'],
    cost: 60, cooldown: 40.0, color: '#7755aa',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const dur = rank>=4?12:rank>=2?10:8;
      player.lichFormTimer = dur;
      player.lichFormDmgBonus = rank>=4?0.75:rank>=2?0.60:0.50;
      player.lichFormFreeCasts = true;
      player.lichFormBoneArmor = true;
      player.lichFormKillFill = rank>=3;
      player.lichFormRevive = rank>=5;
      player.boneArmorCharges = 999; // effectively infinite
      spawnBurst(player.x, player.y, ['#7755aa','#9988cc','#ccbbee','#ffffff'], 28);
      spawnDamageNumber(player.x, player.y-30, 'LICH FORM!', {color:'#7755aa',size:14,vy:-60,life:1.8});
      shake = Math.min(shake+6,12);
      return true;
    },
  },

  // ── NECROMANCER T4 (Ultimates) ────────────────────────────────
  boneStorm: {
    id: 'boneStorm', name: 'Bone Storm', letter: 'O', tier: 4, classOf: 'necromancer',
    desc: '10s cyclone of bone shards orbiting you, shredding everything nearby.',
    maxRank: 5, rankDesc: ['Bone storm 8s orbit 2×', '10s faster orbit', '10s ★Notable: orbit fires outward shards every 1s', '12s 2.5×', '★Capstone: 12s, storm expands to entire arena on last 2s'],
    cost: 70, cooldown: 45.0, color: '#ccbbee',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const dur = rank>=4?12:rank>=2?10:8;
      player.boneStormTimer = dur;
      player.boneStormDmg = player.weaponDamage * player.dmgMult * 2.0 * rDmg * rScale;
      player.boneStormRadius = 75;
      player.boneStormAngle = 0;
      player.boneStormHitTimer = 0;
      player.boneStormShardTimer = 0;
      player.boneStormShards = rank>=3;
      player.boneStormExpand = rank>=5;
      spawnBurst(player.x, player.y, ['#ccbbee','#9988cc','#ffffff'], 24);
      spawnDamageNumber(player.x, player.y-30, 'BONE STORM!', {color:'#ccbbee',size:14,vy:-62,life:1.8});
      shake = Math.min(shake+7,13);
      return true;
    },
  },
  bloodRitual: {
    id: 'bloodRitual', name: 'Blood Ritual', letter: 'U', tier: 4, classOf: 'necromancer',
    desc: 'Sacrifice 40% max HP: massive AoE 8×, spawn 5 skeletons, all crits for 8s.',
    maxRank: 5, rankDesc: ['Ritual 5× AoE sacrifice 40%', '6× AoE 3 skeletons', '6× ★Notable: sacrificed HP becomes shield on skeletons', '8× 5 skeletons 8s crits', '★Capstone: 10× if below 30% HP triple damage'],
    cost: 0, cooldown: 50.0, color: '#cc2244',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const sacrifice = Math.round(player.maxHp * 0.40);
      if (player.hp <= sacrifice + 5) return false;
      player.hp -= sacrifice;
      const mult = rank>=5?10:rank>=4?8:rank>=2?6:5;
      let d = player.weaponDamage * player.dmgMult * mult * rDmg * rScale + sacrifice * 0.8;
      if (rank>=5 && player.hp < player.maxHp*0.30) d *= 3;
      const radius = 140;
      for (const e of enemies) {
        if(!e.alive)continue;
        if(Math.hypot(e.x-player.x,e.y-player.y)<radius){
          const died=e.takeDamage(d,{crit:true,color:'#cc2244'});
          player.onCrit();
          spawnBurst(e.x,e.y,['#cc2244','#ff4466','#ffffff'],12);
          if(died)handleEnemyDeath(e);
        }
      }
      // Guaranteed crits for 8s (rank 4)
      if (rank>=4) { player.bloodRitualCritTimer = 8.0; }
      // Summon skeletons
      const skelCount = rank>=4?5:rank>=2?3:2;
      if (!player.summons) player.summons = [];
      for (let s=0;s<skelCount;s++){
        const angle=(s/skelCount)*Math.PI*2;
        player.summons.push({type:'skeleton',x:player.x+Math.cos(angle)*30,y:player.y+Math.sin(angle)*30,hp:player.maxHp*0.4,maxHp:player.maxHp*0.4,alive:true,life:15,dmg:player.weaponDamage*player.dmgMult*1.2*rDmg*rScale,fireTimer:0,fireRate:1.0,r:7,theme:'arcane',explodeOnDeath:true});
      }
      groundEffects.push({type:'shockwave',x:player.x,y:player.y,r:10,maxR:radius,damage:0,life:0.5,maxLife:0.5,color:'#cc2244',hit:new Set(),target:'none'});
      spawnBurst(player.x,player.y,['#cc2244','#ff4466','#9988cc','#ffffff'],40);
      spawnDamageNumber(player.x,player.y-34,'BLOOD RITUAL!',{color:'#cc2244',size:16,vy:-68,life:2.0});
      shake=Math.min(shake+10,16);hitPauseTimer=Math.max(hitPauseTimer,0.15);
      return true;
    },
  },
  necroticApocalypse: {
    id: 'necroticApocalypse', name: 'Necrotic Apocalypse', letter: 'P', tier: 4, classOf: 'necromancer',
    desc: 'Curse all enemies to die within 8s. Any survivors at 0.1s take 15× damage.',
    maxRank: 5, rankDesc: ['All cursed die in 8s or 10×', '6s or 12×', '6s ★Notable: death raises a skeleton warrior', '4s or 15×', '★Capstone: 3s or 20×, each death triggers corpse explosion'],
    cost: 90, cooldown: 60.0, color: '#440066',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const dur = rank>=4?4:rank>=2?6:8;
      const finMult = rank>=5?20:rank>=4?15:rank>=2?12:10;
      player.necroApocTimer = dur;
      player.necroApocMult = finMult * rDmg * rScale;
      player.necroApocRaiseSkeleton = rank>=3;
      player.necroApocCorpseExplode = rank>=5;
      // Mark all enemies
      for (const e of enemies) {
        if (!e.alive) continue;
        e.necroApocMark = dur;
        spawnBurst(e.x, e.y, ['#440066','#9944cc','#ffffff'], 8);
      }
      spawnBurst(player.x,player.y,['#440066','#9944cc','#ccbbee','#ffffff'],40);
      spawnDamageNumber(player.x,player.y-34,'NECROTIC APOCALYPSE!',{color:'#440066',size:14,vy:-70,life:2.2});
      shake=Math.min(shake+10,16);hitPauseTimer=Math.max(hitPauseTimer,0.15);
      return true;
    },
  },

  // ── BERSERKER T1 ─────────────────────────────────────────────
  bloodRend: {
    id: 'bloodRend', name: 'Blood Rend', letter: 'R', tier: 1, classOf: 'berserker',
    desc: '3-hit savage slash combo. Applies Bleed. Generates Fury.',
    maxRank: 5, rankDesc: ['3-hit combo, Bleed 3s', '4-hit, Bleed 4s', '5-hit ★Notable: Bleed stacks spread on kill', '5-hit 2× dmg on Bleeding targets', '★Capstone: 6-hit, each crit resets combo cooldown'],
    cost: 0, cooldown: 1.2, color: '#cc4040',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const hits = rank >= 5 ? 6 : rank >= 3 ? 5 : rank >= 2 ? 4 : 3;
      const target = findNearestEnemy(player.x, player.y, 80);
      if (!target) return false;
      let died = false;
      for (let i = 0; i < hits; i++) {
        if (!target.alive) break;
        const isCrit = Math.random() * 100 < player.critChance;
        let dmg = player.weaponDamage * player.dmgMult * 0.9 * rDmg * rScale;
        if (rank >= 4 && target.bleedTimer > 0) dmg *= 2;
        if (isCrit) { dmg *= 2; player.onCrit(); }
        died = target.takeDamage(dmg, { crit: isCrit });
        spawnBurst(target.x+(Math.random()-0.5)*8, target.y+(Math.random()-0.5)*8, ['#cc4040','#ff8888','#ffffff'], 3);
        if (died) { handleEnemyDeath(target); break; }
      }
      target.bleedTimer = (target.bleedTimer || 0) + (rank >= 2 ? 4 : 3);
      target.bleedDmg = (player.weaponDamage * player.dmgMult * 0.2 * rScale);
      player.resource = Math.min(player.maxResource, (player.resource || 0) + 12);
      shake = Math.min(shake + 2, 5);
      return true;
    },
  },
  recklessSwing: {
    id: 'recklessSwing', name: 'Reckless Swing', letter: 'S', tier: 1, classOf: 'berserker',
    desc: 'Massive single strike. Costs 8% HP. Massive Fury gain.',
    maxRank: 5, rankDesc: ['3.0× dmg, costs 8% HP', '3.5× costs 6% HP', '4.0× ★Notable: if this kills, heal 15% HP', '4.5× costs 4% HP', '★Capstone: 5.5× dmg, costs 2% HP, guaranteed Overpower'],
    cost: 0, cooldown: 2.5, color: '#ff4444',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const target = findNearestEnemy(player.x, player.y, 90);
      if (!target) return false;
      const hpCost = [0.08,0.08,0.06,0.06,0.04,0.02][Math.min(rank,5)];
      const mult = rank >= 5 ? 5.5 : rank >= 4 ? 4.5 : rank >= 3 ? 4.0 : rank >= 2 ? 3.5 : 3.0;
      player.hp = Math.max(1, player.hp - player.maxHp * hpCost);
      if (rank >= 5) player.overpowerReady = true;
      const isCrit = Math.random() * 100 < player.critChance;
      let dmg = player.weaponDamage * player.dmgMult * mult * rDmg * rScale;
      if (isCrit) { dmg *= 2; player.onCrit(); }
      const died = target.takeDamage(dmg, { crit: isCrit });
      if (died) {
        handleEnemyDeath(target);
        if (rank >= 3) player.hp = Math.min(player.maxHp, player.hp + player.maxHp * 0.15);
      }
      player.resource = Math.min(player.maxResource, (player.resource || 0) + 20);
      spawnBurst(target.x, target.y, ['#ff4444','#ffaa00','#ffffff'], 20);
      shake = Math.min(shake + 5, 8); hitPauseTimer = Math.max(hitPauseTimer, 0.08);
      return true;
    },
  },
  battleShout: {
    id: 'battleShout', name: 'Battle Shout', letter: 'B', tier: 1, classOf: 'berserker',
    desc: '+25% damage for 5s. Instantly grants Fury.',
    maxRank: 5, rankDesc: ['+25% dmg 5s', '+30% dmg 6s', '+35% dmg ★Notable: also +20% attack speed', '+40% dmg 8s', '★Capstone: also heals 20% max HP on cast + Overpower ready'],
    cost: 0, cooldown: 10.0, color: '#ffaa00',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const dmgBonus = [0.25, 0.30, 0.35, 0.40, 0.40][rank-1];
      const dur = rank >= 4 ? 8 : rank >= 2 ? 6 : 5;
      player.shoutTimer = dur;
      player.shoutDmgBonus = dmgBonus;
      if (rank >= 3) player.shoutSpeedBonus = 0.20;
      if (rank >= 5) {
        player.hp = Math.min(player.maxHp, player.hp + player.maxHp * 0.20);
        player.overpowerReady = true;
      }
      player.resource = Math.min(player.maxResource, (player.resource || 0) + 25);
      spawnBurst(player.x, player.y, ['#ffaa00','#ffdd44','#ffffff'], 18);
      return true;
    },
  },

  // ── BERSERKER T2 ─────────────────────────────────────────────
  berserkerLeap: {
    id: 'berserkerLeap', name: 'Leap', letter: 'L', tier: 2, classOf: 'berserker',
    desc: 'Leap to cursor. AoE on landing. Fury per enemy hit.',
    maxRank: 5, rankDesc: ['1.8× AoE on land', '2.2× wider radius', '2.6× ★Notable: brief stun on landing', '3.0× knocks back', '★Capstone: leaves lava zone 3s on landing'],
    cost: 0, cooldown: 5.0, color: '#ff6600',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const tx = Math.max(player.r, Math.min(W-player.r, mouseX));
      const ty = Math.max(player.r, Math.min(H-player.r, mouseY));
      player.x = tx; player.y = ty;
      player.iframeTimer = Math.max(player.iframeTimer, 0.15);
      const radius = rank >= 2 ? 70 : 55;
      const dmg = player.weaponDamage * player.dmgMult * (rank >= 4 ? 3.0 : rank >= 3 ? 2.6 : rank >= 2 ? 2.2 : 1.8) * rDmg * rScale;
      let furyGain = 0;
      for (const e of enemies) {
        if (!e.alive) continue;
        const d = Math.hypot(e.x-tx, e.y-ty);
        if (d < radius) {
          const isCrit = Math.random() * 100 < player.critChance;
          const died = e.takeDamage(isCrit ? dmg*2 : dmg, { crit: isCrit });
          if (isCrit) player.onCrit();
          if (rank >= 3) e.stunTimer = Math.max(e.stunTimer||0, 0.8);
          if (rank >= 4) { e.x += (e.x-tx)/(d||1)*30; e.y += (e.y-ty)/(d||1)*30; }
          furyGain += 8;
          if (died) handleEnemyDeath(e);
        }
      }
      player.resource = Math.min(player.maxResource, (player.resource||0) + Math.min(furyGain, 40));
      if (rank >= 5) groundEffects.push({ type:'burn', x:tx, y:ty, r:radius*0.8, life:3.0, maxLife:3.0, dmgPerSec: player.weaponDamage*player.dmgMult*0.5, color:'#ff4400', hit:new Set() });
      groundEffects.push({ type:'shockwave', x:tx, y:ty, r:10, maxR:radius, damage:0, life:0.35, maxLife:0.35, color:'#ff6600', hit:new Set(), target:'none' });
      spawnBurst(tx, ty, ['#ff6600','#ffaa44','#ffffff'], 22);
      shake = Math.min(shake+4, 8); hitPauseTimer = Math.max(hitPauseTimer, 0.07);
      return true;
    },
  },
  berserkerRage: {
    id: 'berserkerRage', name: 'Berserker Rage', letter: 'G', tier: 2, classOf: 'berserker',
    desc: 'Enter frenzy: +50% attack speed, +20% speed for 4s. Fury cannot decay.',
    maxRank: 5, rankDesc: ['Frenzy 4s +50% aspd', '5s +55% aspd', '6s ★Notable: also +30% damage', '7s Fury regen 2×', '★Capstone: 8s, Overpower triggers every 3rd hit'],
    cost: 25, cooldown: 14.0, color: '#ff2222',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const dur = [4,5,6,7,8][rank-1];
      const speedBonus = 0.50 + rank * 0.01;
      player.rageTimer = dur;
      player.rageMoveBonus = 0.20;
      player.rageSpeedBonus = speedBonus;
      if (rank >= 3) player.rageDmgBonus = 0.30;
      if (rank >= 5) player.rageOverpowerEvery3 = true;
      spawnBurst(player.x, player.y, ['#ff2222','#ff6666','#ffaa44','#ffffff'], 24);
      return true;
    },
  },
  warchiefCall: {
    id: 'warchiefCall', name: "Warchief's Brand", letter: 'W', tier: 2, classOf: 'berserker',
    desc: 'Call 3 spectral warriors that strike enemies then explode.',
    maxRank: 5, rankDesc: ['3 warriors 1.5× each', '3 warriors 2.0×', '4 warriors ★Notable: each brands enemies (+15% dmg taken)', '5 warriors 2.5×', '★Capstone: warriors explode in chain reaction AoE on death'],
    cost: 30, cooldown: 12.0, color: '#cc8800',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const count = rank >= 4 ? 5 : rank >= 3 ? 4 : 3;
      const dmgMult = rank >= 4 ? 2.5 : rank >= 2 ? 2.0 : 1.5;
      const nearby = enemies.filter(e => e.alive).slice(0, count * 2);
      if (!nearby.length) return false;
      for (let i = 0; i < count; i++) {
        const e = nearby[i % nearby.length];
        if (!e || !e.alive) continue;
        const dmg = player.weaponDamage * player.dmgMult * dmgMult * rDmg * rScale;
        const isCrit = Math.random() * 100 < player.critChance;
        if (isCrit) player.onCrit();
        if (rank >= 3) e.brandTimer = Math.max(e.brandTimer||0, 4.0);
        const died = e.takeDamage(isCrit ? dmg*2 : dmg, { crit: isCrit });
        spawnBurst(e.x, e.y, ['#cc8800','#ffdd44','#ffffff'], 10);
        if (died) {
          if (rank >= 5) {
            for (const n of enemies) {
              if (n.alive && Math.hypot(n.x-e.x,n.y-e.y) < 60) {
                n.takeDamage(dmg*0.6, {}); 
              }
            }
          }
          handleEnemyDeath(e);
        }
      }
      player.resource = Math.min(player.maxResource, (player.resource||0)+15);
      shake = Math.min(shake+3,6);
      return true;
    },
  },

  // ── BERSERKER T3 ─────────────────────────────────────────────
  berserkerWhirlwind: {
    id: 'berserkerWhirlwind', name: 'Whirlwind', letter: 'V', tier: 3, classOf: 'berserker',
    desc: 'Spin and deal AoE for 2.5s. Fury regenerates during spin.',
    maxRank: 5, rankDesc: ['Spin 2.5s 1.4× per tick', '3.0s 1.6×', '3.5s ★Notable: pulls enemies in during spin', '4.0s 2.0×', '★Capstone: 4.5s, each kill during spin extends duration 0.3s'],
    cost: 35, cooldown: 9.0, color: '#ff8822',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const dur = [2.5,3.0,3.5,4.0,4.5][rank-1];
      const dmgMult = rank >= 4 ? 2.0 : rank >= 2 ? 1.6 : 1.4;
      player.whirlwindTimer = dur;
      player.whirlwindDmg = player.weaponDamage * player.dmgMult * dmgMult * rDmg * rScale;
      player.whirlwindRadius = 65;
      player.whirlwindPull = rank >= 3;
      player.whirlwindExtend = rank >= 5;
      spawnBurst(player.x, player.y, ['#ff8822','#ffcc66','#ffffff'], 16);
      return true;
    },
  },
  earthshatter: {
    id: 'earthshatter', name: 'Earthshatter', letter: 'E', tier: 3, classOf: 'berserker',
    desc: 'Slam ground for massive AoE. Scales with current Fury.',
    maxRank: 5, rankDesc: ['2.5× + Fury bonus', '3.0× bigger AoE', '3.5× ★Notable: leaves rubble zone 2s', '4.0× stuns all hit', '★Capstone: consumes all Fury for +(Fury/10)× bonus damage'],
    cost: 0, cooldown: 8.0, color: '#aa6633',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const fury = player.resource || 0;
      const baseMult = rank >= 4 ? 4.0 : rank >= 3 ? 3.5 : rank >= 2 ? 3.0 : 2.5;
      const furyBonus = rank >= 5 ? fury/10 : fury/20;
      const dmg = player.weaponDamage * player.dmgMult * (baseMult + furyBonus) * rDmg * rScale;
      const radius = rank >= 2 ? 90 : 70;
      if (rank >= 5) player.resource = 0;
      for (const e of enemies) {
        if (!e.alive) continue;
        if (Math.hypot(e.x-player.x, e.y-player.y) < radius) {
          const isCrit = Math.random() * 100 < player.critChance;
          const died = e.takeDamage(isCrit ? dmg*2 : dmg, { crit: isCrit });
          if (isCrit) player.onCrit();
          if (rank >= 4) e.stunTimer = Math.max(e.stunTimer||0, 1.2);
          if (died) handleEnemyDeath(e);
        }
      }
      if (rank >= 3) groundEffects.push({ type:'slow', x:player.x, y:player.y, r:radius, life:2.0, maxLife:2.0, color:'#aa6633', slowAmt:0.5, hit:new Set() });
      groundEffects.push({ type:'shockwave', x:player.x, y:player.y, r:10, maxR:radius, damage:0, life:0.4, maxLife:0.4, color:'#aa6633', hit:new Set(), target:'none' });
      spawnBurst(player.x, player.y, ['#aa6633','#cc8844','#ffffff'], 26);
      shake = Math.min(shake+6,10); hitPauseTimer = Math.max(hitPauseTimer,0.10);
      return true;
    },
  },
  titansFall: {
    id: 'titansFall', name: "Titan's Fall", letter: 'T', tier: 3, classOf: 'berserker',
    desc: 'Massive leap crash. Invincible in air. Huge AoE on landing.',
    maxRank: 5, rankDesc: ['4.0× massive AoE', '4.5× wider', '5.0× ★Notable: launches enemies into air', '6.0× shockwave bounces off walls', '★Capstone: 7× dmg + leaves magma zone 4s'],
    cost: 40, cooldown: 14.0, color: '#ff4400',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const tx = Math.max(player.r, Math.min(W-player.r, mouseX));
      const ty = Math.max(player.r, Math.min(H-player.r, mouseY));
      player.x = tx; player.y = ty;
      player.iframeTimer = Math.max(player.iframeTimer, 0.5);
      const mult = rank >= 5 ? 7.0 : rank >= 4 ? 6.0 : rank >= 3 ? 5.0 : rank >= 2 ? 4.5 : 4.0;
      const radius = rank >= 2 ? 100 : 80;
      const dmg = player.weaponDamage * player.dmgMult * mult * rDmg * rScale;
      for (const e of enemies) {
        if (!e.alive) continue;
        if (Math.hypot(e.x-tx, e.y-ty) < radius) {
          const isCrit = Math.random() * 100 < player.critChance;
          const died = e.takeDamage(isCrit ? dmg*2 : dmg, { crit: isCrit });
          if (isCrit) player.onCrit();
          if (rank >= 3) { const ang = Math.atan2(e.y-ty,e.x-tx); e.x += Math.cos(ang)*50; e.y += Math.sin(ang)*50; }
          if (died) handleEnemyDeath(e);
        }
      }
      if (rank >= 5) groundEffects.push({ type:'burn', x:tx, y:ty, r:radius*0.7, life:4.0, maxLife:4.0, dmgPerSec:player.weaponDamage*player.dmgMult*0.8, color:'#ff4400', hit:new Set() });
      groundEffects.push({ type:'shockwave', x:tx, y:ty, r:10, maxR:radius, damage:0, life:0.4, maxLife:0.4, color:'#ff4400', hit:new Set(), target:'none' });
      spawnBurst(tx, ty, ['#ff4400','#ff8844','#ffcc00','#ffffff'], 32);
      shake = Math.min(shake+8,12); hitPauseTimer = Math.max(hitPauseTimer,0.12);
      return true;
    },
  },

  // ── BERSERKER T4 (Ultimates) ──────────────────────────────────
  bloodTide: {
    id: 'bloodTide', name: 'Blood Tide', letter: 'D', tier: 4, classOf: 'berserker',
    desc: '10s: kills restore HP, Fury 3× faster, Overpower every 3rd hit.',
    maxRank: 5, rankDesc: ['Blood Tide 10s', '12s +60% dmg', '12s ★Notable: lifesteal 20% per hit', '14s Fury fills instantly', '★Capstone: 14s + immune to death once (1HP survive)'],
    cost: 50, cooldown: 40.0, color: '#cc0033',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const dur = rank >= 4 ? 14 : rank >= 2 ? 12 : 10;
      player.bloodTideTimer = dur;
      player.bloodTideDmgBonus = rank >= 2 ? 0.60 : 0.50;
      player.bloodTideLifesteal = rank >= 3 ? 0.20 : 0.10;
      player.bloodTideOverpowerRate = 3;
      if (rank >= 4) player.resource = player.maxResource;
      if (rank >= 5) player.deathShield = true;
      spawnBurst(player.x, player.y, ['#cc0033','#ff4466','#ff8888','#ffffff'], 30);
      return true;
    },
  },
  primalRoar: {
    id: 'primalRoar', name: 'Primal Roar', letter: 'P', tier: 4, classOf: 'berserker',
    desc: 'Fear all enemies 3s, then charge through dealing damage. Fury fills to 100.',
    maxRank: 5, rankDesc: ['Fear 3s + charge 3.0×', 'Fear 4s + 3.5×', 'Fear 4s ★Notable: charge stuns all hit 1.5s', 'Fear 5s + 4.5×', '★Capstone: Fear + charge + Titan\'s Fall at charge end'],
    cost: 40, cooldown: 35.0, color: '#ff8800',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const fearDur = rank >= 4 ? 5 : rank >= 2 ? 4 : 3;
      const mult = rank >= 4 ? 4.5 : rank >= 3 ? 4.0 : rank >= 2 ? 3.5 : 3.0;
      // Fear all enemies
      for (const e of enemies) {
        if (e.alive) { e.fearTimer = fearDur; e.fearSource = {x:player.x, y:player.y}; }
      }
      player.resource = player.maxResource; // Fury to 100
      // Charge damage to all enemies in a line toward cursor
      const dx = mouseX-player.x, dy = mouseY-player.y;
      const dist = Math.hypot(dx,dy)||1;
      const dmg = player.weaponDamage * player.dmgMult * mult * rDmg * rScale;
      player.x = Math.max(player.r, Math.min(W-player.r, player.x + dx*0.8));
      player.y = Math.max(player.r, Math.min(H-player.r, player.y + dy*0.8));
      player.iframeTimer = Math.max(player.iframeTimer, 0.3);
      for (const e of enemies) {
        if (!e.alive) continue;
        const ex = e.x-player.x, ey = e.y-player.y;
        if (Math.hypot(ex,ey) < 60) {
          const isCrit = Math.random() * 100 < player.critChance;
          const died = e.takeDamage(isCrit ? dmg*2 : dmg, { crit: isCrit });
          if (isCrit) player.onCrit();
          if (rank >= 3) e.stunTimer = Math.max(e.stunTimer||0, 1.5);
          if (died) handleEnemyDeath(e);
        }
      }
      spawnBurst(player.x, player.y, ['#ff8800','#ffcc44','#ffffff'], 28);
      shake = Math.min(shake+5,9);
      return true;
    },
  },
  berserkerArmyUlt: {
    id: 'berserkerArmyUlt', name: 'Blood Oath', letter: 'O', tier: 4, classOf: 'berserker',
    desc: '10s frenzy: +80% dmg, immune to stun/slow, kills explode for AoE.',
    maxRank: 5, rankDesc: ['Blood Oath 10s +80%', '12s +90%', '12s ★Notable: kill explosions chain', '14s +100%, immune damage 0.5s on kill', '★Capstone: 14s + all attacks guaranteed Overpower'],
    cost: 50, cooldown: 45.0, color: '#ff0000',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const dur = rank >= 3 ? 12 : rank >= 4 ? 14 : 10;
      player.bloodOathTimer = dur;
      player.bloodOathDmgBonus = rank >= 4 ? 1.0 : rank >= 2 ? 0.9 : 0.8;
      player.bloodOathKillExplode = true;
      player.bloodOathChain = rank >= 3;
      player.bloodOathGuaranteedOP = rank >= 5;
      spawnBurst(player.x, player.y, ['#ff0000','#ff4444','#ffaaaa','#ffffff'], 36);
      return true;
    },
  },

  // ── RANGER T1 ────────────────────────────────────────────────
  huntersArrow: {
    id: 'huntersArrow', name: "Hunter's Arrow", letter: 'H', tier: 1, classOf: 'ranger',
    desc: 'Fire a precise arrow. Crits grant Focus. Guarantees crit on Focus cap.',
    maxRank: 5, rankDesc: ['1.8× precise shot', '2.0× +crit chance', '2.2× ★Notable: crit applies Mark (enemy takes +20% dmg 4s)', '2.6×, Mark spreads on kill', '★Capstone: 3.0×, at max Focus always crits + pierces'],
    cost: 0, cooldown: 0.8, color: '#7ad96b',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const mult = rank >= 5 ? 3.0 : rank >= 4 ? 2.6 : rank >= 3 ? 2.2 : rank >= 2 ? 2.0 : 1.8;
      const target = findNearestEnemy(player.x, player.y, player.weaponRange);
      if (!target) return false;
      const atMax = player.resource >= player.maxResource;
      let isCrit = Math.random() * 100 < (player.critChance + (rank >= 2 ? 5 : 0));
      if (rank >= 5 && atMax) isCrit = true;
      let dmg = player.weaponDamage * player.dmgMult * mult * rDmg * rScale;
      if (isCrit) { dmg *= 2; player.onCrit(); }
      const died = target.takeDamage(dmg, { crit: isCrit });
      if (rank >= 3 && isCrit) {
        target.markTimer = 4.0; target.markDmgBonus = 0.20;
        if (rank >= 4 && died) {
          for (const n of enemies) { if (n.alive && Math.hypot(n.x-target.x,n.y-target.y)<80) { n.markTimer=3.0; n.markDmgBonus=0.20; } }
        }
      }
      const dx = target.x-player.x, dy = target.y-player.y, d=Math.hypot(dx,dy)||1;
      const proj = new Projectile(player.x,player.y,(dx/d)*player.weaponProjSpeed,
        (dy/d)*player.weaponProjSpeed, 0, d/player.weaponProjSpeed+0.1, isCrit);
      proj.r=2; proj.theme='arrow'; proj.preHit=true; proj.dmg=dmg;
      projectiles.push(proj);
      if (died) handleEnemyDeath(target);
      return true;
    },
  },
  focusShot: {
    id: 'focusShot', name: 'Focus Shot', letter: 'F', tier: 1, classOf: 'ranger',
    desc: 'Consumes all Focus for a massive single shot.',
    maxRank: 5, rankDesc: ['Focus×0.08 bonus dmg', '×0.10 bonus', '×0.12 ★Notable: pierces all enemies in line', '×0.14 leaves burning arrow in ground', '★Capstone: ×0.16, splits into 3 at max range'],
    cost: 0, cooldown: 3.0, color: '#aaff55',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const focus = player.resource || 0;
      const focusMult = [0.08,0.10,0.12,0.14,0.16][rank-1];
      const baseMult = 2.5 + focus * focusMult;
      player.resource = 0;
      const target = findNearestEnemy(player.x, player.y, player.weaponRange*1.5);
      if (!target) return false;
      const dx = target.x-player.x, dy = target.y-player.y, d=Math.hypot(dx,dy)||1;
      const isCrit = Math.random()*100 < player.critChance;
      let dmg = player.weaponDamage * player.dmgMult * baseMult * rDmg * rScale;
      if (isCrit) { dmg*=2; player.onCrit(); }
      const sp = player.weaponProjSpeed * 1.6;
      const proj = new Projectile(player.x,player.y,(dx/d)*sp,(dy/d)*sp,dmg,280/sp+0.1,isCrit);
      proj.r=4; proj.theme='arrow'; proj.pierce=(rank>=3);
      projectiles.push(proj);
      spawnBurst(player.x, player.y, ['#aaff55','#ffff88','#ffffff'], 10);
      return true;
    },
  },

  // ── RANGER T2 ────────────────────────────────────────────────
  trapNet: {
    id: 'trapNet', name: 'Snare Trap', letter: 'N', tier: 2, classOf: 'ranger',
    desc: 'Place a trap that roots the first enemy to step on it.',
    maxRank: 5, rankDesc: ['Root 2.5s single target', '3s + bleed on snap', '3s ★Notable: trap also silences (no specials)', '4s, 2 traps active', '★Capstone: 3 traps, root spreads to nearby enemies'],
    cost: 15, cooldown: 6.0, color: '#88cc44',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const maxTraps = rank >= 4 ? 2 : rank >= 5 ? 3 : 1;
      const tx = mouseX, ty = mouseY;
      if (!player.traps) player.traps = [];
      if (player.traps.length >= maxTraps) player.traps.shift();
      player.traps.push({ x:tx, y:ty, rank, rScale, rDmg, active:true,
        rootDur: rank>=4 ? 4.0 : rank>=2 ? 3.0 : 2.5,
        bleed: rank>=2, silence: rank>=3, spreadRoot: rank>=5 });
      groundEffects.push({ type:'marker', x:tx, y:ty, r:12, life:15.0, maxLife:15.0, color:'#88cc44', hit:new Set(), target:'none' });
      return true;
    },
  },
  volleyShot: {
    id: 'volleyShot', name: 'Arrow Volley', tier: 2, letter: 'V', classOf: 'ranger',
    desc: 'Fire 5 arrows in a spread at nearest enemies.',
    maxRank: 5, rankDesc: ['5 arrows spread', '7 arrows wider', '9 arrows ★Notable: arrows pierce 1 enemy each', '11 arrows, crits chain', '★Capstone: 15 arrows, fills Focus on full volley hit'],
    cost: 20, cooldown: 4.0, color: '#55dd88',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const count = [5,7,9,11,15][rank-1];
      const spread = 0.5;
      const target = findNearestEnemy(player.x, player.y, player.weaponRange*1.3);
      const baseAngle = target ? Math.atan2(target.y-player.y, target.x-player.x) : 0;
      let dmg = player.weaponDamage * player.dmgMult * 0.9 * rDmg * rScale;
      for (let i = 0; i < count; i++) {
        const ang = baseAngle + (i/(count-1)-0.5)*spread*2;
        const isCrit = Math.random()*100 < player.critChance;
        const pd = isCrit ? dmg*2 : dmg;
        if (isCrit) player.onCrit();
        const proj = new Projectile(player.x,player.y,Math.cos(ang)*player.weaponProjSpeed,
          Math.sin(ang)*player.weaponProjSpeed, pd, 0.5, isCrit);
        proj.r=2; proj.theme='arrow'; proj.pierce=(rank>=3?1:0);
        projectiles.push(proj);
      }
      if (rank>=5) player.resource = Math.min(player.maxResource, (player.resource||0)+30);
      return true;
    },
  },

  // ── RANGER T3 ────────────────────────────────────────────────
  stormOfArrows: {
    id: 'stormOfArrows', name: 'Storm of Arrows', letter: 'A', tier: 3, classOf: 'ranger',
    desc: 'Rain arrows over target area for 3s.',
    maxRank: 5, rankDesc: ['Rain 3s 20 arrows', '4s 28 arrows', '4s ★Notable: arrows seek enemies in zone', '5s 40 arrows, crits Bleed', '★Capstone: 5s 50 arrows, generates Focus per arrow hit'],
    cost: 40, cooldown: 12.0, color: '#44bb44',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const dur = rank >= 4 ? 5 : rank >= 2 ? 4 : 3;
      const arrowCount = [20,28,28,40,50][rank-1];
      const tx = mouseX, ty = mouseY;
      player.arrowRain = { x:tx, y:ty, r:80, timer:dur, maxTimer:dur,
        arrows:arrowCount, interval:dur/arrowCount,
        nextArrow:0, dmg: player.weaponDamage*player.dmgMult*0.8*rDmg*rScale,
        seek: rank>=3, bleed: rank>=4, focusPerHit: rank>=5, player };
      return true;
    },
  },
  eagleEyeShot: {
    id: 'eagleEyeShot', name: 'Eagle Eye', tier: 3, letter: 'Y', classOf: 'ranger',
    desc: 'Boost: next 5 shots guaranteed crit and +50% dmg for 6s.',
    maxRank: 5, rankDesc: ['5 shots guaran. crit 6s', '7 shots 8s', '8 shots ★Notable: crits also silence target 1s', '10 shots +80% dmg', '★Capstone: 10 shots +100% dmg, crits pierce'],
    cost: 30, cooldown: 10.0, color: '#ffee44',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const shots = [5,7,8,10,10][rank-1];
      const dur = rank >= 2 ? 8 : 6;
      const dmgBonus = rank >= 4 ? (rank>=5?1.0:0.8) : 0.5;
      player.eagleEyeShots = shots;
      player.eagleEyeTimer = dur;
      player.eagleEyeDmgBonus = dmgBonus;
      player.eagleEyeSilence = rank >= 3;
      player.eagleEyePierce = rank >= 5;
      spawnBurst(player.x, player.y, ['#ffee44','#ffffff'], 12);
      return true;
    },
  },

  // ── RANGER T4 (Ultimates) ─────────────────────────────────────
  huntersMark: {
    id: 'huntersMark', name: "Hunter's Mark", tier: 4, letter: 'M', classOf: 'ranger',
    desc: 'Mark all enemies. Marked take +40% dmg for 12s. Kills grant Focus.',
    maxRank: 5, rankDesc: ['All enemies marked 12s', '14s +50% dmg', '14s ★Notable: kills refresh Mark on nearby', '16s crits explode Marked', '★Capstone: 16s, you gain +100% crit chance while any enemy is Marked'],
    cost: 50, cooldown: 35.0, color: '#33ff77',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const dur = rank >= 3 ? 14 : rank >= 4 ? 16 : 12;
      const bonus = rank >= 2 ? 0.50 : 0.40;
      for (const e of enemies) { if (e.alive) { e.markTimer=dur; e.markDmgBonus=bonus; } }
      player.huntersMarkActive = true;
      player.huntersMarkCritBonus = rank >= 5 ? 100 : 0;
      player.huntersMarkExplode = rank >= 4;
      spawnBurst(player.x, player.y, ['#33ff77','#aaffcc','#ffffff'], 24);
      return true;
    },
  },
  markedForDeath: {
    id: 'markedForDeath', name: 'Marked for Death', tier: 4, letter: 'K', classOf: 'ranger',
    desc: '10s: +60% dmg, attack speed +30%, kills chain arrows to nearby.',
    maxRank: 5, rankDesc: ['Death Mark 10s', '12s +70% dmg', '12s ★Notable: chain arrows pierce', '14s +80% dmg speed +50%', '★Capstone: 14s, guaranteed Overpower on every 5th shot'],
    cost: 50, cooldown: 40.0, color: '#00cc44',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const dur = rank >= 3 ? 12 : rank >= 4 ? 14 : 10;
      player.deathMarkTimer = dur;
      player.deathMarkDmg = rank >= 4 ? 0.80 : rank >= 2 ? 0.70 : 0.60;
      player.deathMarkChain = true;
      player.deathMarkPierce = rank >= 3;
      player.deathMarkSpeed = rank >= 4 ? 0.50 : 0.30;
      player.deathMarkOverpower = rank >= 5;
      spawnBurst(player.x, player.y, ['#00cc44','#88ffaa','#ffffff'], 20);
      return true;
    },
  },
  trueshot: {
    id: 'trueshot', name: 'Trueshot', tier: 4, letter: 'U', classOf: 'ranger',
    desc: 'Channel 1s, release one perfect arrow that traverses the screen dealing 10× damage.',
    maxRank: 5, rankDesc: ['10× screen-wide pierce', '12× splits on each hit', '12× ★Notable: split arrows also seek', '15× splits into 5 each', '★Capstone: 15×, if kills all targets in path, resets to 0 cooldown'],
    cost: 60, cooldown: 45.0, color: '#ffff00',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const mult = rank >= 4 ? 15 : rank >= 2 ? 12 : 10;
      const dmg = player.weaponDamage * player.dmgMult * mult * rDmg * rScale;
      const target = findNearestEnemy(player.x, player.y, 9999);
      if (!target) return false;
      const dx = target.x-player.x, dy = target.y-player.y, d=Math.hypot(dx,dy)||1;
      const isCrit = true; player.onCrit();
      const proj = new Projectile(player.x,player.y,(dx/d)*player.weaponProjSpeed*1.8,
        (dy/d)*player.weaponProjSpeed*1.8, dmg, 2.0, isCrit);
      proj.r=5; proj.theme='arrow'; proj.pierce=true; proj.trueshot=true;
      proj.splitOnHit = rank >= 2; proj.splitCount = rank >= 4 ? 5 : 3;
      projectiles.push(proj);
      spawnBurst(player.x, player.y, ['#ffff00','#ffffff'], 16);
      return true;
    },
  },

  // ── DRUID stubs ───────────────────────────────────────────────
  shred: {
    id: 'shred', name: 'Shred', letter: 'S', tier: 1, classOf: 'druid',
    desc: 'Savage claw combo. Free in Panther form. Applies Bleed.',
    maxRank: 5, rankDesc: ['3-hit claw combo', '4-hit Bleed 3s', '5-hit ★Notable: Feral Frenzy on 4th combo', '5-hit 2× on Bleeding', '★Capstone: 6-hit, Frenzy spawns 2 claw echoes'],
    cost: 0, cooldown: 1.0, color: '#66cc88',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const hits = rank >= 5 ? 6 : rank >= 3 ? 5 : rank >= 2 ? 4 : 3;
      const target = findNearestEnemy(player.x, player.y, 85);
      if (!target) return false;
      let died = false;
      for (let i = 0; i < hits; i++) {
        if (!target.alive) break;
        const isCrit = Math.random()*100 < player.critChance;
        let dmg = player.weaponDamage * player.dmgMult * 0.85 * rDmg * rScale;
        if (rank>=4 && target.bleedTimer>0) dmg *= 2;
        if (isCrit) { dmg*=2; player.onCrit(); }
        died = target.takeDamage(dmg, { crit:isCrit });
        spawnBurst(target.x+(Math.random()-0.5)*8, target.y+(Math.random()-0.5)*8, ['#66cc88','#aaffcc','#ffffff'], 3);
        if (died) { handleEnemyDeath(target); break; }
      }
      if (rank>=2) { target.bleedTimer=(target.bleedTimer||0)+3; target.bleedDmg=player.weaponDamage*player.dmgMult*0.15*rScale; }
      player.resource = Math.min(player.maxResource,(player.resource||0)+6);
      shake = Math.min(shake+1,4);
      return true;
    },
  },
  stormStrike: {
    id: 'stormStrike', name: 'Storm Strike', letter: 'T', tier: 1, classOf: 'druid',
    desc: 'Nature energy chains as lightning to 3 enemies.',
    maxRank: 5, rankDesc: ['Nature chain 3 targets', '4 targets', '5 targets ★Notable: leaves Static Field on primary', '6 targets +Spirit', '★Capstone: chains bounce until no new targets found'],
    cost: 0, cooldown: 1.4, color: '#88ddff',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const chains = rank >= 4 ? 6 : rank >= 3 ? 5 : rank >= 2 ? 4 : 3;
      const nearby = enemies.filter(e=>e.alive).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y)).slice(0,chains);
      if (!nearby.length) return false;
      const dmg = player.weaponDamage * player.dmgMult * 1.4 * rDmg * rScale;
      for (let i=0; i<nearby.length; i++) {
        const e = nearby[i];
        const chainDmg = dmg * Math.pow(0.7, i);
        const isCrit = Math.random()*100 < player.critChance;
        const died = e.takeDamage(isCrit?chainDmg*2:chainDmg, {crit:isCrit});
        if (isCrit) player.onCrit();
        spawnBurst(e.x,e.y,['#88ddff','#aaeeff','#ffffff'],5);
        if (died) handleEnemyDeath(e);
      }
      player.resource = Math.min(player.maxResource,(player.resource||0)+8);
      return true;
    },
  },
  tornado: {
    id: 'tornado', name: 'Tornado', letter: 'O', tier: 3, classOf: 'druid',
    desc: 'Summon a tornado that drifts across the screen dealing Nature damage.',
    maxRank: 5, rankDesc: ['Tornado 4s drift', '5s bigger', '5s ★Notable: generates Spirit per enemy hit', '6s seeks enemies', '★Capstone: 6s, collapses for Nature AoE explosion'],
    cost: 30, cooldown: 12.0, color: '#66cc88',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const dur = rank >= 4 ? 6 : rank >= 2 ? 5 : 4;
      const dmg = player.weaponDamage * player.dmgMult * 0.6 * rDmg * rScale;
      const vx = (Math.random()-0.5)*60, vy = (Math.random()-0.5)*60;
      groundEffects.push({ type:'tornado', x:mouseX, y:mouseY, r:35, life:dur, maxLife:dur,
        dmgPerSec:dmg*3, color:'#66cc88', vx, vy, hit:new Set(),
        seek:rank>=4, spiritPerHit:rank>=3?3:0, explodeOnEnd:rank>=5,
        player, rScale });
      return true;
    },
  },
  summonWolves: {
    id: 'summonWolves', name: 'Summon Wolf Pack', letter: 'K', tier: 2, classOf: 'druid',
    desc: 'Summon 3 spectral wolves that attack enemies for 12s.',
    maxRank: 5, rankDesc: ['3 wolves 12s', '3 wolves 14s +25% dmg', '4 wolves ★Notable: Alpha wolf amplifies pack', '5 wolves 14s', '★Capstone: wolves howl on death, summoning ghost wolves'],
    cost: 25, cooldown: 16.0, color: '#66cc88',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const count = rank >= 4 ? 5 : rank >= 3 ? 4 : 3;
      const dur = rank >= 2 ? 14 : 12;
      if (!player.summons) player.summons = [];
      for (let i=0; i<count; i++) {
        player.summons.push({ type:'wolf', x:player.x+(Math.random()-0.5)*40, y:player.y+(Math.random()-0.5)*40,
          hp:30+rank*10, maxHp:30+rank*10, timer:dur, dmg:player.weaponDamage*player.dmgMult*0.5*rDmg*rScale,
          speed:110, r:6, color:'#aaffcc', attackRate:1.2, attackTimer:0, rank });
      }
      spawnBurst(player.x,player.y,['#66cc88','#aaffcc','#ffffff'],14);
      return true;
    },
  },
  cataclysm: {
    id: 'cataclysm', name: 'Cataclysm', letter: 'C', tier: 4, classOf: 'druid',
    desc: '6s nature storm: lightning strikes + tornadoes + vine eruptions.',
    maxRank: 5, rankDesc: ['Nature storm 6s', '7s denser strikes', '7s ★Notable: lightning chains', '8s vine eruptions root', '★Capstone: 8s, storm detonates for massive AoE at end'],
    cost: 50, cooldown: 40.0, color: '#66cc88',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const dur = rank >= 4 ? 8 : rank >= 2 ? 7 : 6;
      player.cataclysmTimer = dur;
      player.cataclysmDmg = player.weaponDamage * player.dmgMult * 0.5 * rDmg * rScale;
      player.cataclysmStrikeInterval = rank >= 2 ? 0.3 : 0.4;
      player.cataclysmNextStrike = 0;
      player.cataclysmChain = rank >= 3;
      player.cataclysmRoot = rank >= 4;
      player.cataclysmExplode = rank >= 5;
      spawnBurst(player.x,player.y,['#66cc88','#88ddff','#ffee44','#ffffff'],28);
      return true;
    },
  },

  // ── AMAZONIAN stubs ───────────────────────────────────────────
  javelinVolley: {
    id: 'javelinVolley', name: 'Javelin Volley', letter: 'J', tier: 1, classOf: 'amazonian',
    desc: 'Throw 3 javelins in a spread. Crits grant Spirit Charge.',
    maxRank: 5, rankDesc: ['3 javelins spread', '5 javelins', '5 javelins ★Notable: Marked Volley every 5th cast', '7 javelins crits chain', '★Capstone: Marked Volley doubles spirit gain'],
    cost: 0, cooldown: 0.9, color: '#ddaa33',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const count = rank >= 4 ? 7 : rank >= 2 ? 5 : 3;
      const target = findNearestEnemy(player.x,player.y,player.weaponRange);
      const baseAngle = target ? Math.atan2(target.y-player.y,target.x-player.x) : 0;
      const spread = 0.35;
      for (let i=0;i<count;i++) {
        const ang = baseAngle + (count>1?(i/(count-1)-0.5)*spread*2:0);
        const isCrit = Math.random()*100 < player.critChance;
        let dmg = player.weaponDamage * player.dmgMult * 1.0 * rDmg * rScale;
        if (isCrit) { dmg*=2; player.onCrit(); player.resource=Math.min(player.maxResource,(player.resource||0)+8); }
        const proj = new Projectile(player.x,player.y,Math.cos(ang)*player.weaponProjSpeed,
          Math.sin(ang)*player.weaponProjSpeed,dmg,0.55,isCrit);
        proj.r=2.5; proj.theme='arrow';
        projectiles.push(proj);
      }
      return true;
    },
  },
  spiritDash: {
    id: 'spiritDash', name: 'Spirit Dash', letter: 'D', tier: 1, classOf: 'amazonian',
    desc: 'Dash leaving a spirit trail. Generates Spirit Charge.',
    maxRank: 5, rankDesc: ['Dash + trail 1.5s', 'Trail 2× dmg on 2nd dash', '3rd dash burst ★Notable', 'Trail applies bond effect', '★Capstone: trail echoes linger +1.5s after dash'],
    cost: 0, cooldown: 2.0, color: '#ddaa33',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const dx = mouseX-player.x, dy = mouseY-player.y, d=Math.hypot(dx,dy)||1;
      const dist = 75;
      const nx = Math.max(player.r,Math.min(W-player.r, player.x+(dx/d)*dist));
      const ny = Math.max(player.r,Math.min(H-player.r, player.y+(dy/d)*dist));
      player.iframeTimer = Math.max(player.iframeTimer, 0.2);
      player.x = nx; player.y = ny;
      player.resource = Math.min(player.maxResource, (player.resource||0)+15);
      groundEffects.push({ type:'trail', x:nx, y:ny, r:20, life:1.5+(rank>=5?1.5:0), maxLife:1.5, color:'#ddaa33',
        dmgPerSec:player.weaponDamage*player.dmgMult*0.4*rDmg*rScale, hit:new Set() });
      spawnBurst(nx,ny,['#ddaa33','#ffcc66','#ffffff'],8);
      return true;
    },
  },
  thunderJavelin: {
    id: 'thunderJavelin', name: 'Thunder Javelin', letter: 'T', tier: 3, classOf: 'amazonian',
    desc: 'Electrified javelin that chains lightning to all nearby enemies.',
    maxRank: 5, rankDesc: ['4-chain lightning', '5-chain', '6-chain ★Notable: secondary auto-throw after 1.5s', '8-chain crits add chains', '★Capstone: all chains crit if initial crits'],
    cost: 25, cooldown: 8.0, color: '#88ccff',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const chains = rank >= 4 ? 8 : rank >= 3 ? 6 : rank >= 2 ? 5 : 4;
      const target = findNearestEnemy(player.x,player.y,player.weaponRange*1.3);
      if (!target) return false;
      const isCrit = Math.random()*100 < player.critChance;
      const baseDmg = player.weaponDamage * player.dmgMult * 2.2 * rDmg * rScale;
      if (isCrit) player.onCrit();
      const mainDmg = isCrit ? baseDmg*2 : baseDmg;
      const died = target.takeDamage(mainDmg, {crit:isCrit});
      spawnBurst(target.x,target.y,['#88ccff','#ffffff'],12);
      player.resource = Math.min(player.maxResource,(player.resource||0)+5);
      // Chain lightning to nearby
      const chainAllCrit = (rank>=5 && isCrit);
      const nearby = enemies.filter(e=>e.alive&&e!==target).sort((a,b)=>Math.hypot(a.x-target.x,a.y-target.y)-Math.hypot(b.x-target.x,b.y-target.y)).slice(0,chains);
      for (const n of nearby) {
        const cc = chainAllCrit || Math.random()*100 < player.critChance;
        const cd = baseDmg * 0.6 * (cc?2:1);
        const nd = n.takeDamage(cd,{crit:cc});
        if (cc) player.onCrit();
        spawnBurst(n.x,n.y,['#88ccff','#aaddff'],5);
        player.resource = Math.min(player.maxResource,(player.resource||0)+5);
        if (nd) handleEnemyDeath(n);
      }
      if (died) handleEnemyDeath(target);
      return true;
    },
  },
  strafe: {
    id: 'strafe', name: 'Strafe', letter: 'R', tier: 3, classOf: 'amazonian',
    desc: '1.8s Strafe stance: auto-fires 12 javelins rapidly.',
    maxRank: 5, rankDesc: ['12 javelins 1.8s', '16 javelins', '20 javelins ★Notable: javelins home', '22 javelins crits pierce', '★Capstone: Parting Shot guaranteed crit on exit'],
    cost: 30, cooldown: 9.0, color: '#ffaa44',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const count = [12,16,20,22,22][rank-1];
      const dur = 1.8;
      player.strafeTimer = dur;
      player.strafeCount = count;
      player.strafeDmg = player.weaponDamage * player.dmgMult * 0.85 * rDmg * rScale;
      player.strafeInterval = dur / count;
      player.strafeNext = 0;
      player.strafeHome = rank >= 3;
      player.strafePierceCrit = rank >= 4;
      player.strafePartingShot = rank >= 5;
      return true;
    },
  },
  stormOfSpears: {
    id: 'stormOfSpears', name: 'Storm of Spears', letter: 'M', tier: 4, classOf: 'amazonian',
    desc: 'Rain 40 javelins over entire screen for 4s. Impaled enemies take 200% bonus damage.',
    maxRank: 5, rankDesc: ['40 spears 4s', '50 spears', '50 spears ★Notable: first 5 are Apex (guaranteed crit)', '55 spears Impaled stun', '★Capstone: Impaled enemies erupt, dealing AoE on death'],
    cost: 50, cooldown: 40.0, color: '#ddaa33',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const count = rank >= 3 ? 55 : rank >= 2 ? 50 : 40;
      const dur = 4.0;
      player.spearStormTimer = dur;
      player.spearStormCount = count;
      player.spearStormDmg = player.weaponDamage * player.dmgMult * 0.7 * rDmg * rScale;
      player.spearStormInterval = dur / count;
      player.spearStormNext = 0;
      player.spearStormApex = rank >= 3 ? 5 : 0;
      player.spearStormStun = rank >= 4;
      player.spearStormErupt = rank >= 5;
      player.spearStormHits = {};
      spawnBurst(player.x,player.y-20,['#ddaa33','#ffcc66','#ffffff'],20);
      return true;
    },
  },

  // ── DRUID T1 ─────────────────────────────────────────────────
  wildShift: {
    id: 'wildShift', name: 'Wild Shift', letter: 'F', tier: 1, classOf: 'druid',
    desc: 'Cycle Wild Shape: Human → Dragon → Panther → Human. Dragon: fire on hit. Panther: speed + bleed crits.',
    maxRank: 5, rankDesc: ['Shift forms, 15 Spirit cost', 'Spirit cost -5', 'Spirit cost -5 ★Notable: Shift restores 10% HP', 'Form bonuses +20%', '★Capstone: free shifts, forms last until re-cast'],
    cost: 15, cooldown: 0.5, color: '#cc8844',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const cost = Math.max(0, 15 - (rank - 1) * 5);
      if (rank < 5 && (player.resource || 0) < cost && (player.class.wildShape || 'human') !== 'human') return false;
      const cur = player.class.wildShape || 'human';
      let next = cur === 'human' ? 'dragon' : cur === 'dragon' ? 'panther' : 'human';
      if (next !== 'human') player.resource = Math.max(0, (player.resource || 0) - cost);
      player.class = Object.assign({}, player.class, { wildShape: next });
      if (rank >= 3) player.hp = Math.min(player.maxHp, player.hp + player.maxHp * 0.10);
      const colors = { human: ['#66cc88','#aaffcc','#ffffff'], dragon: ['#ff6622','#ffaa44','#ffee88'], panther: ['#882288','#cc66cc','#ffffff'] };
      spawnBurst(player.x, player.y, colors[next], 16);
      spawnDamageNumber(player.x, player.y - 24, next.toUpperCase() + ' FORM', { color: colors[next][0], size: 13, vy: -55, life: 1.5 });
      return true;
    },
  },

  // ── DRUID T2 ─────────────────────────────────────────────────
  thornWall: {
    id: 'thornWall', name: 'Thorn Wall', letter: 'H', tier: 2, classOf: 'druid',
    desc: 'Summon a wall of thorns at cursor. Damages and slows all enemies that touch it.',
    maxRank: 5, rankDesc: ['Thorn wall 6s', '8s +bleed on hit', '8s ★Notable: wall pulses 1× per sec in AoE', '10s wall fires thorn bolts', '★Capstone: wall shatters on end, dealing 4× damage AoE'],
    cost: 20, cooldown: 12.0, color: '#448833',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const dur = rank >= 4 ? 10 : rank >= 2 ? 8 : 6;
      const dmg = player.weaponDamage * player.dmgMult * 0.5 * rDmg * rScale;
      groundEffects.push({
        type: 'thornwall', x: mouseX, y: mouseY, r: 50, life: dur, maxLife: dur,
        dmgPerSec: dmg * 2, color: '#448833', hit: new Set(),
        bleed: rank >= 2, pulse: rank >= 3, pulseTimer: 0,
        shatter: rank >= 5, player, rScale,
        bleedDmg: player.weaponDamage * player.dmgMult * 0.12 * rScale
      });
      spawnBurst(mouseX, mouseY, ['#448833','#66cc44','#aaffaa'], 14);
      return true;
    },
  },
  entangle: {
    id: 'entangle', name: 'Entangle', letter: 'N', tier: 2, classOf: 'druid',
    desc: 'Vines erupt around player, rooting nearby enemies. Deals Nature damage.',
    maxRank: 5, rankDesc: ['Root 2s r=70', 'Root 3s bigger', '3s ★Notable: rooted enemies take +30% damage', 'Root 4s', '★Capstone: root + Nature explosion at rank end'],
    cost: 20, cooldown: 9.0, color: '#66cc44',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const rootDur = rank >= 4 ? 4 : rank >= 2 ? 3 : 2;
      const radius = rank >= 2 ? 90 : 70;
      const dmg = player.weaponDamage * player.dmgMult * 1.2 * rDmg * rScale;
      let count = 0;
      for (const e of enemies) {
        if (!e.alive) continue;
        if (Math.hypot(e.x - player.x, e.y - player.y) < radius) {
          const isCrit = Math.random() * 100 < player.critChance;
          const died = e.takeDamage(isCrit ? dmg * 2 : dmg, { crit: isCrit });
          if (isCrit) player.onCrit();
          e.stunTimer = Math.max(e.stunTimer || 0, rootDur);
          if (rank >= 3) e.entangled = true;
          spawnBurst(e.x, e.y, ['#66cc44','#aaffaa'], 4);
          if (died) handleEnemyDeath(e);
          else count++;
        }
      }
      if (rank >= 5 && count === 0) {
        // Detonate even with no roots for the AoE
        for (const e of enemies) {
          if (!e.alive) continue;
          if (Math.hypot(e.x - player.x, e.y - player.y) < radius * 1.4) {
            const died = e.takeDamage(dmg * 2);
            if (died) handleEnemyDeath(e);
          }
        }
      }
      player.resource = Math.min(player.maxResource, (player.resource || 0) + 10);
      groundEffects.push({ type: 'shockwave', x: player.x, y: player.y, r: 10, maxR: radius, damage: 0, life: 0.4, maxLife: 0.4, color: '#66cc44', hit: new Set(), target: 'none' });
      spawnBurst(player.x, player.y, ['#66cc44','#448833','#aaffaa','#ffffff'], 20);
      return true;
    },
  },

  // ── DRUID T3 ─────────────────────────────────────────────────
  earthShock: {
    id: 'earthShock', name: 'Earth Shock', letter: 'Q', tier: 3, classOf: 'druid',
    desc: 'Slam fist down, sending an earthquake line toward cursor.',
    maxRank: 5, rankDesc: ['Quake line 2× dmg', '3× wider', '3.5× ★Notable: launches enemies struck', '4× leaves rubble zone', '★Capstone: 5× + aftershock strikes 1.5s later'],
    cost: 30, cooldown: 10.0, color: '#aa8833',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const mult = rank >= 5 ? 5 : rank >= 4 ? 4 : rank >= 3 ? 3.5 : rank >= 2 ? 3 : 2;
      const dmg = player.weaponDamage * player.dmgMult * mult * rDmg * rScale;
      // Line from player to cursor
      const dx = mouseX - player.x, dy = mouseY - player.y;
      const len = Math.hypot(dx, dy) || 1;
      const steps = Math.ceil(len / 12);
      const hitSet = new Set();
      for (let s = 0; s <= steps; s++) {
        const px = player.x + (dx / len) * s * 12;
        const py = player.y + (dy / len) * s * 12;
        for (const e of enemies) {
          if (!e.alive || hitSet.has(e)) continue;
          if (Math.hypot(e.x - px, e.y - py) < (rank >= 2 ? 28 : 20)) {
            hitSet.add(e);
            const isCrit = Math.random() * 100 < player.critChance;
            const died = e.takeDamage(isCrit ? dmg * 2 : dmg, { crit: isCrit });
            if (isCrit) player.onCrit();
            if (rank >= 3) { const ang = Math.atan2(e.y - player.y, e.x - player.x); e.x += Math.cos(ang)*40; e.y += Math.sin(ang)*40; }
            if (died) handleEnemyDeath(e);
          }
        }
      }
      if (rank >= 4) groundEffects.push({ type: 'slow', x: mouseX, y: mouseY, r: 55, life: 3.0, maxLife: 3.0, color: '#aa8833', slowAmt: 0.5, hit: new Set() });
      groundEffects.push({ type: 'shockwave', x: player.x, y: player.y, r: 10, maxR: len, damage: 0, life: 0.5, maxLife: 0.5, color: '#aa8833', hit: new Set(), target: 'none' });
      spawnBurst(player.x, player.y, ['#aa8833','#cc9944','#ffffff'], 16);
      shake = Math.min(shake + 5, 9); hitPauseTimer = Math.max(hitPauseTimer, 0.08);
      player.resource = Math.min(player.maxResource, (player.resource || 0) + 12);
      return true;
    },
  },
  solarBeam: {
    id: 'solarBeam', name: 'Solar Beam', letter: 'L', tier: 3, classOf: 'druid',
    desc: 'Channel a concentrated sunbeam for 2s, Burning all enemies in the line.',
    maxRank: 5, rankDesc: ['Beam 2s Burn', '2.5s wider', '2.5s ★Notable: Superheats at 1.5s (+100% dmg, 2× wide)', '3s beam scorches ground', '★Capstone: beam splits at end into 3 rays'],
    cost: 30, cooldown: 11.0, color: '#ffee44',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const dur = rank >= 4 ? 3 : rank >= 2 ? 2.5 : 2;
      player.solarBeamTimer = dur;
      player.solarBeamDmg = player.weaponDamage * player.dmgMult * 0.8 * rDmg * rScale;
      player.solarBeamWidth = rank >= 2 ? 18 : 14;
      player.solarBeamSuperheat = rank >= 3;
      player.solarBeamScorch = rank >= 4;
      player.solarBeamSplit = rank >= 5;
      player.solarBeamHitTimer = 0;
      spawnBurst(player.x, player.y, ['#ffee44','#ffcc22','#ffffff'], 14);
      return true;
    },
  },

  // ── DRUID T4 ─────────────────────────────────────────────────
  primalRage: {
    id: 'primalRage', name: 'Primal Rage', letter: 'P', tier: 4, classOf: 'druid',
    desc: '12s Hybrid Form: Dragon + Panther simultaneously. Fire on every hit, crits Bleed.',
    maxRank: 5, rankDesc: ['Hybrid Form 10s', '12s Fury dmg+30%', '12s ★Notable: kills restore 5% HP', '14s all attacks chain fire', '★Capstone: 14s + immune to death once'],
    cost: 50, cooldown: 45.0, color: '#ff6622',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const dur = rank >= 4 ? 14 : rank >= 2 ? 12 : 10;
      player.primalRageTimer = dur;
      player.primalRageDmgBonus = rank >= 2 ? 0.30 : 0;
      player.primalRageKillHeal = rank >= 3;
      player.primalRageChainFire = rank >= 4;
      if (rank >= 5) player.deathShield = true;
      player.class = Object.assign({}, player.class, { wildShape: 'hybrid' });
      spawnBurst(player.x, player.y, ['#ff6622','#66cc88','#ffaa44','#cc66cc','#ffffff'], 32);
      spawnDamageNumber(player.x, player.y - 28, 'PRIMAL RAGE!', { color: '#ff6622', size: 15, vy: -60, life: 2.0 });
      return true;
    },
  },
  worldTree: {
    id: 'worldTree', name: 'World Tree', letter: 'W', tier: 4, classOf: 'druid',
    desc: 'Summon the World Tree for 8s. It roots all enemies, rains homing acorns, heals you.',
    maxRank: 5, rankDesc: ['World Tree 8s, 3 acorns/s', '10s 4 acorns/s', '10s ★Notable: acorns chain-heal you on hit', '12s root refreshes', '★Capstone: Tree erupts on death, massive AoE + seed summons 3 wolves'],
    cost: 50, cooldown: 40.0, color: '#66cc44',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const dur = rank >= 4 ? 12 : rank >= 2 ? 10 : 8;
      const acornRate = rank >= 2 ? 4 : 3;
      // Root all current enemies
      for (const e of enemies) {
        if (!e.alive) continue;
        e.stunTimer = Math.max(e.stunTimer || 0, 3.0);
      }
      player.worldTreeTimer = dur;
      player.worldTreeAcornDmg = player.weaponDamage * player.dmgMult * 0.9 * rDmg * rScale;
      player.worldTreeAcornRate = acornRate;
      player.worldTreeHealTick = 0;
      player.worldTreeChainHeal = rank >= 3;
      player.worldTreeErupt = rank >= 5;
      player.worldTreeAcornTimer = 0;
      player.worldTreeX = player.x; player.worldTreeY = player.y;
      spawnBurst(player.x, player.y, ['#66cc44','#448833','#aaffaa','#ffffff'], 30);
      spawnDamageNumber(player.x, player.y - 28, 'WORLD TREE!', { color: '#66cc44', size: 15, vy: -60, life: 2.0 });
      return true;
    },
  },

  // ── AMAZONIAN T1 ─────────────────────────────────────────────
  eagleMark: {
    id: 'eagleMark', name: 'Eagle Mark', letter: 'E', tier: 1, classOf: 'amazonian',
    desc: 'Mark nearest enemy. All attacks deal +40% bonus damage to the Marked target.',
    maxRank: 5, rankDesc: ['+40% dmg to marked', '+50%, spread to nearest on kill', '+50% ★Notable: crits on Marked give +15 Spirit Charge', '+60%, mark 2 targets', '★Capstone: marked enemies take 2× crit damage'],
    cost: 0, cooldown: 8.0, color: '#ffcc44',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const count = rank >= 4 ? 2 : 1;
      const sorted = enemies.filter(e => e.alive).sort((a,b) => Math.hypot(a.x-player.x,a.y-player.y) - Math.hypot(b.x-player.x,b.y-player.y));
      if (!sorted.length) return false;
      if (!player.markedEnemies) player.markedEnemies = new Set();
      player.markedEnemies.clear();
      for (let i = 0; i < Math.min(count, sorted.length); i++) {
        player.markedEnemies.add(sorted[i]);
        spawnBurst(sorted[i].x, sorted[i].y, ['#ffcc44','#ffaa22','#ffffff'], 10);
        spawnDamageNumber(sorted[i].x, sorted[i].y - 14, 'MARKED!', { color: '#ffcc44', size: 10, vy: -45, life: 1.0 });
      }
      player.eagleMarkBonus = rank >= 4 ? 0.60 : rank >= 2 ? 0.50 : 0.40;
      player.eagleMarkSpread = rank >= 2;
      player.eagleMarkSpiritCrit = rank >= 3 ? 15 : 0;
      player.eagleMarkDoubleCrit = rank >= 5;
      player.resource = Math.min(player.maxResource, (player.resource || 0) + 10);
      return true;
    },
  },

  // ── AMAZONIAN T2 ─────────────────────────────────────────────
  spiritBond: {
    id: 'spiritBond', name: 'Spirit Bond', letter: 'B', tier: 2, classOf: 'amazonian',
    desc: 'Cycle Spirit Bond: Eagle → Serpent → Wolf → Bear. Costs 20 Spirit Charge. Each bond modifies combat.',
    maxRank: 5, rankDesc: ['Bond cycle, 20 cost', 'Cost -5', '★Notable: Bond switch restores 10 Spirit Charge', 'Bond bonuses +25%', '★Capstone: all bonds active simultaneously for 8s (Apex Union)'],
    cost: 20, cooldown: 1.0, color: '#ddaa33',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const cost = Math.max(5, 20 - (rank - 1) * 5);
      if ((player.resource || 0) < cost) return false;
      player.resource = Math.max(0, (player.resource || 0) - cost);
      const bonds = ['eagle','serpent','wolf','bear'];
      const cur = player.class.spiritBond || 'eagle';
      const next = bonds[(bonds.indexOf(cur) + 1) % bonds.length];
      player.class = Object.assign({}, player.class, { spiritBond: next });
      if (rank >= 3) player.resource = Math.min(player.maxResource, (player.resource || 0) + 10);
      const bondColors = { eagle:['#88aaff','#aaccff','#ffffff'], serpent:['#44cc44','#aaffaa','#ffffff'], wolf:['#cc8833','#ffcc66','#ffffff'], bear:['#884422','#cc9966','#ffffff'] };
      spawnBurst(player.x, player.y, bondColors[next], 14);
      spawnDamageNumber(player.x, player.y - 22, next.toUpperCase() + ' BOND', { color: bondColors[next][0], size: 12, vy: -50, life: 1.2 });
      return true;
    },
  },
  venomTip: {
    id: 'venomTip', name: 'Venom Tip', letter: 'V', tier: 2, classOf: 'amazonian',
    desc: 'Coat javelins with venom. Next 5-15 attacks apply Venom stacks. 5 stacks = Serpent Burst AoE.',
    maxRank: 5, rankDesc: ['5 venom attacks', '8 attacks', '10 attacks ★Notable: Serpent Burst radius +50%', '12 attacks stack 2× faster', '★Capstone: 15 attacks, Serpent Burst chains to 3 nearby enemies'],
    cost: 15, cooldown: 10.0, color: '#44cc44',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const charges = [5,8,10,12,15][rank-1];
      player.venomCharges = charges;
      player.venomDmg = player.weaponDamage * player.dmgMult * 0.25 * rDmg * rScale;
      player.venomBurstRadius = rank >= 3 ? 55 : 36;
      player.venomDoubleStack = rank >= 4;
      player.venomChain = rank >= 5 ? 3 : 0;
      spawnBurst(player.x, player.y, ['#44cc44','#aaffaa','#ffffff'], 10);
      return true;
    },
  },
  packHunt: {
    id: 'packHunt', name: 'Pack Hunt', letter: 'U', tier: 2, classOf: 'amazonian',
    desc: '8s hunt: kills grant +5% attack speed (stacks up to 10×). Spirit Charge on each stack.',
    maxRank: 5, rankDesc: ['Hunt 8s, +5% aspd/kill max 10', '10s stacks +7%', '10s ★Notable: stacks persist until end of wave', '12s +8% and give Spirit Charge', '★Capstone: final stack grants Apex Predator for 3s'],
    cost: 15, cooldown: 12.0, color: '#cc8833',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const dur = rank >= 4 ? 12 : rank >= 2 ? 10 : 8;
      const perKill = rank >= 4 ? 0.08 : rank >= 2 ? 0.07 : 0.05;
      player.packHuntTimer = dur;
      player.packHuntStacks = 0;
      player.packHuntPerKill = perKill;
      player.packHuntMaxStacks = 10;
      player.packHuntPersist = rank >= 3;
      player.packHuntSpiritKill = rank >= 4 ? 5 : 0;
      player.packHuntApexFinal = rank >= 5;
      spawnBurst(player.x, player.y, ['#cc8833','#ffcc66','#ffffff'], 12);
      return true;
    },
  },

  // ── AMAZONIAN T3 ─────────────────────────────────────────────
  galeForce: {
    id: 'galeForce', name: 'Gale Force', letter: 'G', tier: 3, classOf: 'amazonian',
    desc: 'Sprint through enemy ranks. Damages all enemies passed through. Gain Spirit Charge per hit.',
    maxRank: 5, rankDesc: ['Sprint 200px 1.2× per hit', '250px 1.5×', '250px ★Notable: each hit applies Eagle Mark', '280px crits launch enemies', '★Capstone: Gale Force auto-re-casts at end if Spirit Charge >= 50'],
    cost: 25, cooldown: 7.0, color: '#88aaff',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const dist = rank >= 4 ? 280 : rank >= 2 ? 250 : 200;
      const mult = rank >= 3 ? 1.5 : rank >= 2 ? 1.5 : 1.2;
      const dmg = player.weaponDamage * player.dmgMult * mult * rDmg * rScale;
      const dx = mouseX - player.x, dy = mouseY - player.y, d = Math.hypot(dx,dy)||1;
      const tx = Math.max(player.r, Math.min(W-player.r, player.x + (dx/d)*dist));
      const ty = Math.max(player.r, Math.min(H-player.r, player.y + (dy/d)*dist));
      player.iframeTimer = Math.max(player.iframeTimer, 0.25);
      // Step along path and hit enemies
      const steps = Math.ceil(dist / 10);
      const hitSet = new Set();
      for (let s = 0; s <= steps; s++) {
        const px = player.x + (dx/d) * (dist/steps) * s;
        const py = player.y + (dy/d) * (dist/steps) * s;
        for (const e of enemies) {
          if (!e.alive || hitSet.has(e)) continue;
          if (Math.hypot(e.x-px, e.y-py) < 22) {
            hitSet.add(e);
            const isCrit = Math.random()*100 < player.critChance;
            const died = e.takeDamage(isCrit?dmg*2:dmg, {crit:isCrit});
            if (isCrit) player.onCrit();
            player.resource = Math.min(player.maxResource, (player.resource||0)+8);
            if (rank>=3 && player.markedEnemies) { player.markedEnemies.clear(); player.markedEnemies.add(e); }
            if (rank>=4 && isCrit) { const ang=Math.atan2(e.y-py,e.x-px); e.x+=Math.cos(ang)*45; e.y+=Math.sin(ang)*45; }
            spawnBurst(e.x, e.y, ['#88aaff','#ffffff'], 4);
            if (died) handleEnemyDeath(e);
          }
        }
      }
      player.x = tx; player.y = ty;
      spawnBurst(tx, ty, ['#88aaff','#aaccff','#ffffff'], 12);
      if (rank>=5 && (player.resource||0)>=50) {
        // Auto recast — just reposition back and fire again (simplified: grant bonus Spirit Charge)
        player.resource = Math.min(player.maxResource, (player.resource||0)+15);
      }
      return true;
    },
  },

  // ── AMAZONIAN T4 ─────────────────────────────────────────────
  apexPredator: {
    id: 'apexPredator', name: 'Apex Predator', letter: 'A', tier: 4, classOf: 'amazonian',
    desc: 'Consume ALL Spirit Charge. Fire a titanic javelin: (Charge/5)× weapon damage. Pierces all.',
    maxRank: 5, rankDesc: ['(Charge/5)× piercing', '+20% per rank bonus dmg', '★Notable: Apex shot Mark-spreads', 'Double pierce bounces', '★Capstone: Apex detonates at wall for 3× AoE explosion'],
    cost: 0, cooldown: 20.0, color: '#ffaa00',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot); const rScale = getRankScale(slot);
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const charge = player.resource || 0;
      if (charge < 10) return false;
      const mult = (charge / 5) * (1 + (rank-1) * 0.20);
      const dmg = player.weaponDamage * player.dmgMult * mult * rDmg * rScale;
      player.resource = 0;
      const target = findNearestEnemy(player.x, player.y, 999);
      const angle = target ? Math.atan2(target.y-player.y, target.x-player.x) : 0;
      const proj = new Projectile(player.x, player.y,
        Math.cos(angle)*player.weaponProjSpeed*1.5, Math.sin(angle)*player.weaponProjSpeed*1.5,
        dmg, 99, true);
      proj.pierce = 99; proj.theme = 'arrow'; proj.r = 5; proj.color = '#ffaa00';
      proj.apexBounce = rank >= 4; proj.apexExplode = rank >= 5; proj.apexExplodeDmg = dmg * 3;
      if (rank >= 3 && player.markedEnemies) proj.markSpread = player.markedEnemies;
      projectiles.push(proj);
      spawnBurst(player.x, player.y, ['#ffaa00','#ffdd44','#ffffff'], 24);
      spawnDamageNumber(player.x, player.y-28, 'APEX!', { color:'#ffaa00', size:16, vy:-65, life:1.5 });
      return true;
    },
  },
  spiritUnion: {
    id: 'spiritUnion', name: 'Spirit Union', letter: 'U', tier: 4, classOf: 'amazonian',
    desc: '12s: ALL 4 Spirit Bonds active at once. Every attack has all bond effects. Kills restore Spirit Charge.',
    maxRank: 5, rankDesc: ['Union 10s', '12s', '12s ★Notable: Spirit drain stops, kills give +15 Charge', '14s all bonds +30% stronger', '★Capstone: 14s, death during Union instead triggers Apex Predator automatically'],
    cost: 50, cooldown: 45.0, color: '#ddaa33',
    cast: (player, slot) => {
      const rank = getAbilityRank(slot);
      const dur = rank >= 4 ? 14 : rank >= 2 ? 12 : 10;
      player.spiritUnionTimer = dur;
      player.spiritUnionDrainStop = rank >= 3;
      player.spiritUnionKillCharge = rank >= 3 ? 15 : 8;
      player.spiritUnionBonus = rank >= 4 ? 1.30 : 1.0;
      player.spiritUnionDeathApex = rank >= 5;
      player.class = Object.assign({}, player.class, { spiritBond: 'union' });
      spawnBurst(player.x, player.y, ['#88aaff','#44cc44','#cc8833','#884422','#ffffff'], 36);
      spawnDamageNumber(player.x, player.y-30, 'SPIRIT UNION!', { color:'#ddaa33', size:16, vy:-65, life:2.0 });
      return true;
    },
  },

};

// ============================================================
// ABILITY RANK SYSTEM  (D4 ranks 1-5 + PoE2 notable/capstone)
// Rank 3 = Notable: new mechanic unlocked (like a PoE support gem).
// Rank 5 = Capstone: dramatic power spike or second major mechanic.
// ============================================================
function getRankScale(slot) {
  const r = (slot && slot.rank) || 1;
  // Accelerating curve: ×1.0 → ×1.3 → ×1.65 → ×2.05 → ×2.5
  return [1.0, 1.3, 1.65, 2.05, 2.5][Math.max(0, Math.min(4, r - 1))];
}
function getAbilityRank(slot) { return (slot && slot.rank) || 1; }

const ABILITY_LIST = Object.values(ABILITIES);
function classAbilities(classId) {
  return ABILITY_LIST.filter(a => !a.classOf || a.classOf === classId);
}

function castAbility(slotIdx) {
  if (slotIdx < 0 || slotIdx > 5) return;
  const slot = player.abilities[slotIdx];
  if (!slot) return;
  if (player.abilityCooldowns[slotIdx] > 0) return;
  if (player.resource < slot.def.cost) return;
  const ok = slot.def.cast(player, slot);
  if (ok) {
    player.resource -= slot.def.cost;
    player.abilityCooldowns[slotIdx] = slot.def.cooldown;
    if (typeof Sfx !== 'undefined') Sfx.abilityCast();
  }
}

// ============================================================
// TALENT SYSTEM
// ============================================================
function addAbilityToPlayer(p, abilityId) {
  if (!ABILITIES[abilityId]) return;
  for (let i = 0; i < p.abilities.length; i++) {
    if (p.abilities[i] && p.abilities[i].id === abilityId) return; // already has it
  }
  for (let i = 1; i < p.abilities.length; i++) { // slot 0 = signature
    if (!p.abilities[i]) {
      p.abilities[i] = { id: abilityId, def: ABILITIES[abilityId], rarity: RARITY.WHITE, rank: 1 };
      return;
    }
  }
}

// Tree nodes: { id, x, y, type:'minor'|'notable'|'ability'|'keystone',
//   name, desc, connections:[], origin (bool, optional), apply(p) }
// Coordinate space: x=0-560, y=0-170 (offset by treeOX,treeOY when rendering)
// Unlock rule: origin node always available; others require adjacency to a spent node.
const TALENT_TREES = {
  // ── RANGER ───────────────────────────────────────────────────
  ranger: { nodes: [
    { id:'r_ori',  x:20,  y:85,  type:'minor',   origin:true, name:"Fletcher's Stance", desc:'+5% Dmg',                        connections:['r_t0','r_m0','r_b0'], apply:(p)=>{ p.baseDmgMult*=1.05; p.recomputeStats(); } },
    // TOP — Precision & Crits
    { id:'r_t0',   x:90,  y:25,  type:'notable', name:'Keen Eye',          desc:'+5% Crit Chance',                connections:['r_t1','r_m0'],        apply:(p)=>{ p.baseCritChance+=5; p.recomputeStats(); } },
    { id:'r_t1',   x:185, y:15,  type:'minor',   name:'Sharpshooter',      desc:'+10% Dmg, +3% Crit',             connections:['r_t2'],               apply:(p)=>{ p.baseDmgMult*=1.10; p.baseCritChance+=3; p.recomputeStats(); } },
    { id:'r_t2',   x:285, y:20,  type:'ability', name:'Focus Shot',        desc:'Unlock: Focus Shot',             connections:['r_t3','r_m2'],        apply:(p)=>{ addAbilityToPlayer(p,'focusShot'); } },
    { id:'r_t3',   x:385, y:15,  type:'notable', name:'Critical Mass',     desc:'+8% Crit, +20% Crit Dmg',       connections:['r_t4'],               apply:(p)=>{ p.baseCritChance+=8; p.baseCritDmg+=0.20; p.recomputeStats(); } },
    { id:'r_t4',   x:475, y:25,  type:'notable', name:'Deadeye',           desc:'+15% Dmg, +30% Crit Dmg',       connections:['r_cap'],              apply:(p)=>{ p.baseDmgMult*=1.15; p.baseCritDmg+=0.30; p.recomputeStats(); } },
    // MID — Speed & Volleys
    { id:'r_m0',   x:90,  y:85,  type:'notable', name:'Swift Quiver',      desc:'+15% Atk Speed',                 connections:['r_m1','r_b0'],        apply:(p)=>{ p.baseFireRateMult*=1.15; p.recomputeStats(); } },
    { id:'r_m1',   x:185, y:85,  type:'ability', name:"Hunter's Arrow",    desc:"Unlock: Hunter's Arrow",         connections:['r_m2'],               apply:(p)=>{ addAbilityToPlayer(p,'huntersArrow'); } },
    { id:'r_m2',   x:285, y:85,  type:'ability', name:'Volley Shot',       desc:'Unlock: Volley Shot',            connections:['r_m3'],               apply:(p)=>{ addAbilityToPlayer(p,'volleyShot'); } },
    { id:'r_m3',   x:385, y:85,  type:'ability', name:'Storm of Arrows',   desc:'Unlock: Storm of Arrows',        connections:['r_m4'],               apply:(p)=>{ addAbilityToPlayer(p,'stormOfArrows'); } },
    { id:'r_m4',   x:475, y:85,  type:'notable', name:'Rapid Fire',        desc:'+20% Atk Speed, +10% Dmg',      connections:['r_cap'],              apply:(p)=>{ p.baseFireRateMult*=1.20; p.baseDmgMult*=1.10; p.recomputeStats(); } },
    { id:'r_cap',  x:530, y:85,  type:'keystone',name:'One With The Hunt', desc:'+25% Dmg, +50% Crit Dmg, +10% Crit', connections:[],            apply:(p)=>{ p.baseDmgMult*=1.25; p.baseCritDmg+=0.50; p.baseCritChance+=10; p.recomputeStats(); } },
    // BOT — Utility & Survival
    { id:'r_b0',   x:90,  y:145, type:'minor',   name:'Eagle Scout',       desc:'+20 Pickup Range, +5% Dmg',     connections:['r_b1'],               apply:(p)=>{ p.basePickupRange+=20; p.baseDmgMult*=1.05; p.recomputeStats(); } },
    { id:'r_b1',   x:185, y:155, type:'ability', name:'Hawk Eye',          desc:'Unlock: Hawk Eye',               connections:['r_b2'],               apply:(p)=>{ addAbilityToPlayer(p,'hawkEye'); } },
    { id:'r_b2',   x:285, y:150, type:'ability', name:'Trueshot',          desc:'Unlock: Trueshot',               connections:['r_b3','r_m2'],        apply:(p)=>{ addAbilityToPlayer(p,'trueshot'); } },
    { id:'r_b3',   x:385, y:155, type:'notable', name:'Predator',          desc:'+8% Dodge, +6% Crit',            connections:['r_b4'],               apply:(p)=>{ p.baseDodge+=8; p.baseCritChance+=6; p.recomputeStats(); } },
    { id:'r_b4',   x:475, y:145, type:'ability', name:'Marked for Death',  desc:'Unlock: Marked for Death',       connections:['r_cap'],              apply:(p)=>{ addAbilityToPlayer(p,'markedForDeath'); } },
  ]},

  // ── BERSERKER ─────────────────────────────────────────────────
  berserker: { nodes: [
    { id:'b_ori',  x:20,  y:85,  type:'minor',   origin:true, name:'Battle Fury',       desc:'+5% Dmg, +5 Max HP',             connections:['b_t0','b_m0','b_b0'], apply:(p)=>{ p.baseDmgMult*=1.05; p.baseMaxHp+=5; p.recomputeStats(); } },
    // TOP — Rage & Overpower
    { id:'b_t0',   x:90,  y:25,  type:'notable', name:'Blood Thirst',      desc:'+8% Dmg, Heal 2 on Kill',        connections:['b_t1','b_m0'],        apply:(p)=>{ p.baseDmgMult*=1.08; p.lifeOnKill=(p.lifeOnKill||0)+2; p.recomputeStats(); } },
    { id:'b_t1',   x:185, y:15,  type:'minor',   name:'Rampage',           desc:'+12% Dmg, +10% Atk Speed',       connections:['b_t2'],               apply:(p)=>{ p.baseDmgMult*=1.12; p.baseFireRateMult*=1.10; p.recomputeStats(); } },
    { id:'b_t2',   x:285, y:20,  type:'ability', name:'Berserker Rage',    desc:'Unlock: Berserker Rage',         connections:['b_t3','b_m2'],        apply:(p)=>{ addAbilityToPlayer(p,'berserkerRage'); } },
    { id:'b_t3',   x:385, y:15,  type:'ability', name:'Warchief Call',     desc:'Unlock: Warchief Call',          connections:['b_t4'],               apply:(p)=>{ addAbilityToPlayer(p,'warchiefCall'); } },
    { id:'b_t4',   x:475, y:25,  type:'notable', name:'Conqueror',         desc:'+20% Dmg, +15 Max HP',           connections:['b_cap'],              apply:(p)=>{ p.baseDmgMult*=1.20; p.baseMaxHp+=15; p.recomputeStats(); } },
    // MID — Pure Damage
    { id:'b_m0',   x:90,  y:85,  type:'notable', name:'Brutal Strikes',    desc:'+10% Dmg, +10% Crit Dmg',       connections:['b_m1','b_b0'],        apply:(p)=>{ p.baseDmgMult*=1.10; p.baseCritDmg+=0.10; p.recomputeStats(); } },
    { id:'b_m1',   x:185, y:85,  type:'ability', name:'Blood Rend',        desc:'Unlock: Blood Rend',             connections:['b_m2'],               apply:(p)=>{ addAbilityToPlayer(p,'bloodRend'); } },
    { id:'b_m2',   x:285, y:85,  type:'ability', name:'Reckless Swing',    desc:'Unlock: Reckless Swing',         connections:['b_m3'],               apply:(p)=>{ addAbilityToPlayer(p,'recklessSwing'); } },
    { id:'b_m3',   x:385, y:85,  type:'ability', name:'Berserker Whirlwind',desc:'Unlock: Berserker Whirlwind',  connections:['b_m4'],               apply:(p)=>{ addAbilityToPlayer(p,'berserkerWhirlwind'); } },
    { id:'b_m4',   x:475, y:85,  type:'notable', name:'Carnage',           desc:'+18% Dmg, +15% Atk Speed',      connections:['b_cap'],              apply:(p)=>{ p.baseDmgMult*=1.18; p.baseFireRateMult*=1.15; p.recomputeStats(); } },
    { id:'b_cap',  x:530, y:85,  type:'keystone',name:'Warmonger',         desc:'+30% Dmg, +25 HP, Life Steal',   connections:[],                     apply:(p)=>{ p.baseDmgMult*=1.30; p.baseMaxHp+=25; p.lifeStealPct=(p.lifeStealPct||0)+0.03; p.recomputeStats(); } },
    // BOT — Sustain & Leap
    { id:'b_b0',   x:90,  y:145, type:'minor',   name:'Iron Flesh',        desc:'+20 Max HP, +5 Armor',           connections:['b_b1'],               apply:(p)=>{ p.baseMaxHp+=20; p.baseArmor+=5; p.recomputeStats(); } },
    { id:'b_b1',   x:185, y:155, type:'ability', name:'Battle Shout',      desc:'Unlock: Battle Shout',           connections:['b_b2'],               apply:(p)=>{ addAbilityToPlayer(p,'battleShout'); } },
    { id:'b_b2',   x:285, y:150, type:'ability', name:'Berserker Leap',    desc:'Unlock: Berserker Leap',         connections:['b_b3','b_m2'],        apply:(p)=>{ addAbilityToPlayer(p,'berserkerLeap'); } },
    { id:'b_b3',   x:385, y:155, type:'ability', name:'Earthshatter',      desc:'Unlock: Earthshatter',           connections:['b_b4'],               apply:(p)=>{ addAbilityToPlayer(p,'earthshatter'); } },
    { id:'b_b4',   x:475, y:145, type:'notable', name:'Warbringer',        desc:'+12% Dmg, +15 HP, +10 Armor',   connections:['b_cap'],              apply:(p)=>{ p.baseDmgMult*=1.12; p.baseMaxHp+=15; p.baseArmor+=10; p.recomputeStats(); } },
  ]},

  // ── ASSASSIN ──────────────────────────────────────────────────
  assassin: { nodes: [
    { id:'s_ori',  x:20,  y:85,  type:'minor',   origin:true, name:'Shadow Step',       desc:'+5% Dodge, +5% Dmg',             connections:['s_t0','s_m0','s_b0'], apply:(p)=>{ p.baseDodge+=5; p.baseDmgMult*=1.05; p.recomputeStats(); } },
    // TOP — Crit & Poison
    { id:'s_t0',   x:90,  y:25,  type:'notable', name:'Venom Coat',        desc:'+6% Crit, +8% Dmg',              connections:['s_t1','s_m0'],        apply:(p)=>{ p.baseCritChance+=6; p.baseDmgMult*=1.08; p.recomputeStats(); } },
    { id:'s_t1',   x:185, y:15,  type:'ability', name:'Poison Blade',      desc:'Unlock: Poison Blade',            connections:['s_t2'],               apply:(p)=>{ addAbilityToPlayer(p,'poisonBlade'); } },
    { id:'s_t2',   x:285, y:20,  type:'notable', name:'Toxic Expertise',   desc:'+10% Dmg, +8% Crit Dmg',        connections:['s_t3','s_m2'],        apply:(p)=>{ p.baseDmgMult*=1.10; p.baseCritDmg+=0.08; p.recomputeStats(); } },
    { id:'s_t3',   x:385, y:15,  type:'ability', name:'Death Blossom',     desc:'Unlock: Death Blossom',           connections:['s_t4'],               apply:(p)=>{ addAbilityToPlayer(p,'deathBlossom'); } },
    { id:'s_t4',   x:475, y:25,  type:'notable', name:'Lethal Tempo',      desc:'+20% Atk Speed, +8% Crit',       connections:['s_cap'],              apply:(p)=>{ p.baseFireRateMult*=1.20; p.baseCritChance+=8; p.recomputeStats(); } },
    // MID — Energy & Burst
    { id:'s_m0',   x:90,  y:85,  type:'notable', name:'Quick Draw',        desc:'+12% Atk Speed, +5 Energy',      connections:['s_m1','s_b0'],        apply:(p)=>{ p.baseFireRateMult*=1.12; p.baseMaxResource+=5; p.recomputeStats(); } },
    { id:'s_m1',   x:185, y:85,  type:'ability', name:'Smoke Bomb',        desc:'Unlock: Smoke Bomb',              connections:['s_m2'],               apply:(p)=>{ addAbilityToPlayer(p,'smokeBomb'); } },
    { id:'s_m2',   x:285, y:85,  type:'ability', name:'Shadow Clone',      desc:'Unlock: Shadow Clone',            connections:['s_m3'],               apply:(p)=>{ addAbilityToPlayer(p,'shadowClone'); } },
    { id:'s_m3',   x:385, y:85,  type:'ability', name:'Death Mark',        desc:'Unlock: Death Mark',              connections:['s_m4'],               apply:(p)=>{ addAbilityToPlayer(p,'deathMark'); } },
    { id:'s_m4',   x:475, y:85,  type:'notable', name:'Ghost Walk',        desc:'+12% Dodge, +15% Dmg',           connections:['s_cap'],              apply:(p)=>{ p.baseDodge+=12; p.baseDmgMult*=1.15; p.recomputeStats(); } },
    { id:'s_cap',  x:530, y:85,  type:'keystone',name:'Shadow Realm',      desc:'+25% Dmg, +50% Crit Dmg, +15% Dodge', connections:[],            apply:(p)=>{ p.baseDmgMult*=1.25; p.baseCritDmg+=0.50; p.baseDodge+=15; p.recomputeStats(); } },
    // BOT — Blade & Shadow
    { id:'s_b0',   x:90,  y:145, type:'minor',   name:'Blade Mastery',     desc:'+8% Dmg, +5% Crit',              connections:['s_b1'],               apply:(p)=>{ p.baseDmgMult*=1.08; p.baseCritChance+=5; p.recomputeStats(); } },
    { id:'s_b1',   x:185, y:155, type:'ability', name:'Backstab',          desc:'Unlock: Backstab',                connections:['s_b2'],               apply:(p)=>{ addAbilityToPlayer(p,'backstab'); } },
    { id:'s_b2',   x:285, y:150, type:'ability', name:'Shadow Strike',     desc:'Unlock: Shadow Strike',           connections:['s_b3','s_m2'],        apply:(p)=>{ addAbilityToPlayer(p,'shadowStrike'); } },
    { id:'s_b3',   x:385, y:155, type:'ability', name:'Blade Flurry',      desc:'Unlock: Blade Flurry',            connections:['s_b4'],               apply:(p)=>{ addAbilityToPlayer(p,'bladeFlurry'); } },
    { id:'s_b4',   x:475, y:145, type:'ability', name:'Assassinate',       desc:'Unlock: Assassinate',             connections:['s_cap'],              apply:(p)=>{ addAbilityToPlayer(p,'assassinate'); } },
  ]},

  // ── SORCERER ──────────────────────────────────────────────────
  sorcerer: { nodes: [
    { id:'w_ori',  x:20,  y:85,  type:'minor',   origin:true, name:'Arcane Mind',       desc:'+10% Dmg, +20 Max Mana',         connections:['w_t0','w_m0','w_b0'], apply:(p)=>{ p.baseDmgMult*=1.10; p.baseMaxResource+=20; p.recomputeStats(); } },
    // TOP — Fire & Meteor
    { id:'w_t0',   x:90,  y:25,  type:'notable', name:'Pyromaniac',        desc:'+10% Dmg, +5% Crit',              connections:['w_t1','w_m0'],        apply:(p)=>{ p.baseDmgMult*=1.10; p.baseCritChance+=5; p.recomputeStats(); } },
    { id:'w_t1',   x:185, y:15,  type:'ability', name:'Inferno Stream',    desc:'Unlock: Inferno Stream',          connections:['w_t2'],               apply:(p)=>{ addAbilityToPlayer(p,'infernoStream'); } },
    { id:'w_t2',   x:285, y:20,  type:'notable', name:'Combustion',        desc:'+15% Dmg, +10% Fire Rate',        connections:['w_t3','w_m2'],        apply:(p)=>{ p.baseDmgMult*=1.15; p.baseFireRateMult*=1.10; p.recomputeStats(); } },
    { id:'w_t3',   x:385, y:15,  type:'ability', name:'Meteor Shower',     desc:'Unlock: Meteor Shower',           connections:['w_t4'],               apply:(p)=>{ addAbilityToPlayer(p,'meteorShower'); } },
    { id:'w_t4',   x:475, y:25,  type:'notable', name:'Glass Cannon',      desc:'+25% Dmg, -10 Max HP',            connections:['w_cap'],              apply:(p)=>{ p.baseDmgMult*=1.25; p.baseMaxHp=Math.max(10,p.baseMaxHp-10); p.recomputeStats(); } },
    // MID — Lightning & Arcane
    { id:'w_m0',   x:90,  y:85,  type:'notable', name:'Mana Surge',        desc:'+30 Max Mana, +5 Mana/sec',       connections:['w_m1','w_b0'],        apply:(p)=>{ p.baseMaxResource+=30; p.baseResourceRegen+=5; p.recomputeStats(); } },
    { id:'w_m1',   x:185, y:85,  type:'ability', name:'Arcane Jolt',       desc:'Unlock: Arcane Jolt',             connections:['w_m2'],               apply:(p)=>{ addAbilityToPlayer(p,'arcaneJolt'); } },
    { id:'w_m2',   x:285, y:85,  type:'ability', name:'Chain Lightning',   desc:'Unlock: Chain Lightning',         connections:['w_m3'],               apply:(p)=>{ addAbilityToPlayer(p,'chainLightning'); } },
    { id:'w_m3',   x:385, y:85,  type:'ability', name:'Arcane Surge',      desc:'Unlock: Arcane Surge',            connections:['w_m4'],               apply:(p)=>{ addAbilityToPlayer(p,'arcaneSurge'); } },
    { id:'w_m4',   x:475, y:85,  type:'notable', name:'Overload',          desc:'+15% Dmg, +15% Atk Speed',       connections:['w_cap'],              apply:(p)=>{ p.baseDmgMult*=1.15; p.baseFireRateMult*=1.15; p.recomputeStats(); } },
    { id:'w_cap',  x:530, y:85,  type:'keystone',name:'Singularity',       desc:'+30% Dmg, +60 Mana, Time Warp',  connections:[],                     apply:(p)=>{ p.baseDmgMult*=1.30; p.baseMaxResource+=60; addAbilityToPlayer(p,'singularity'); p.recomputeStats(); } },
    // BOT — Ice & Control
    { id:'w_b0',   x:90,  y:145, type:'notable', name:'Frost Bite',        desc:'+8% Crit, Slow on Hit',           connections:['w_b1'],               apply:(p)=>{ p.baseCritChance+=8; p.recomputeStats(); } },
    { id:'w_b1',   x:185, y:155, type:'ability', name:'Frost Nova',        desc:'Unlock: Frost Nova',              connections:['w_b2'],               apply:(p)=>{ addAbilityToPlayer(p,'frostNova'); } },
    { id:'w_b2',   x:285, y:150, type:'ability', name:'Blizzard',          desc:'Unlock: Blizzard',                connections:['w_b3','w_m2'],        apply:(p)=>{ addAbilityToPlayer(p,'blizzard'); } },
    { id:'w_b3',   x:385, y:155, type:'ability', name:'Time Freeze',       desc:'Unlock: Time Freeze',             connections:['w_b4'],               apply:(p)=>{ addAbilityToPlayer(p,'timeFreeze'); } },
    { id:'w_b4',   x:475, y:145, type:'notable', name:'Absolute Zero',     desc:'+20% Dmg vs Frozen, +10% Crit',  connections:['w_cap'],              apply:(p)=>{ p.baseDmgMult*=1.20; p.baseCritChance+=10; p.recomputeStats(); } },
  ]},

  // ── TEMPLAR ───────────────────────────────────────────────────
  templar: { nodes: [
    { id:'t_ori',  x:20,  y:85,  type:'minor',   origin:true, name:'Disciplined Mind',  desc:'+10 Chi, +5% Dmg',               connections:['t_t0','t_m0','t_b0'], apply:(p)=>{ p.baseMaxResource+=10; p.baseDmgMult*=1.05; p.recomputeStats(); } },
    // TOP — Storm & Speed
    { id:'t_t0',   x:90,  y:25,  type:'notable', name:'Storm Fist',        desc:'+10% Dmg, +8% Atk Speed',        connections:['t_t1','t_m0'],        apply:(p)=>{ p.baseDmgMult*=1.10; p.baseFireRateMult*=1.08; p.recomputeStats(); } },
    { id:'t_t1',   x:185, y:15,  type:'ability', name:'Tempest Rush',      desc:'Unlock: Tempest Rush',            connections:['t_t2'],               apply:(p)=>{ addAbilityToPlayer(p,'tempestRush'); } },
    { id:'t_t2',   x:285, y:20,  type:'notable', name:'Wind Walker',       desc:'+20 Speed, +8% Dodge',            connections:['t_t3','t_m2'],        apply:(p)=>{ p.baseSpeed+=20; p.baseDodge+=8; p.recomputeStats(); } },
    { id:'t_t3',   x:385, y:15,  type:'ability', name:'Epiphany',          desc:'Unlock: Epiphany',                connections:['t_t4'],               apply:(p)=>{ addAbilityToPlayer(p,'epiphany'); } },
    { id:'t_t4',   x:475, y:25,  type:'notable', name:'Inner Peace',       desc:'+15% Dmg, +20 Speed',             connections:['t_cap'],              apply:(p)=>{ p.baseDmgMult*=1.15; p.baseSpeed+=20; p.recomputeStats(); } },
    // MID — Chi & Strikes
    { id:'t_m0',   x:90,  y:85,  type:'notable', name:'Chi Focus',         desc:'+20 Max Chi, +5 Chi/sec',         connections:['t_m1','t_b0'],        apply:(p)=>{ p.baseMaxResource+=20; p.baseResourceRegen+=5; p.recomputeStats(); } },
    { id:'t_m1',   x:185, y:85,  type:'ability', name:'Fists of Thunder',  desc:'Unlock: Fists of Thunder',        connections:['t_m2'],               apply:(p)=>{ addAbilityToPlayer(p,'fistsOfThunder'); } },
    { id:'t_m2',   x:285, y:85,  type:'ability', name:'Cyclone Strike',    desc:'Unlock: Cyclone Strike',          connections:['t_m3'],               apply:(p)=>{ addAbilityToPlayer(p,'cycloneStrike'); } },
    { id:'t_m3',   x:385, y:85,  type:'ability', name:'Transcendence',     desc:'Unlock: Transcendence',           connections:['t_m4'],               apply:(p)=>{ addAbilityToPlayer(p,'transcendence'); } },
    { id:'t_m4',   x:475, y:85,  type:'notable', name:'One Punch',         desc:'+20% Dmg, +10% Crit',             connections:['t_cap'],              apply:(p)=>{ p.baseDmgMult*=1.20; p.baseCritChance+=10; p.recomputeStats(); } },
    { id:'t_cap',  x:530, y:85,  type:'keystone',name:'Enlightenment',     desc:'+25% Dmg, +50 Chi, +20% Dodge',  connections:[],                     apply:(p)=>{ p.baseDmgMult*=1.25; p.baseMaxResource+=50; p.baseDodge+=20; p.recomputeStats(); } },
    // BOT — Defense & Healing
    { id:'t_b0',   x:90,  y:145, type:'minor',   name:'Iron Skin',         desc:'+10 Armor, +15 Max HP',           connections:['t_b1'],               apply:(p)=>{ p.baseArmor+=10; p.baseMaxHp+=15; p.recomputeStats(); } },
    { id:'t_b1',   x:185, y:155, type:'ability', name:'Mantra of Healing', desc:'Unlock: Mantra of Healing',       connections:['t_b2'],               apply:(p)=>{ addAbilityToPlayer(p,'mantraOfHealing'); } },
    { id:'t_b2',   x:285, y:150, type:'ability', name:'Serenity',          desc:'Unlock: Serenity',                connections:['t_b3','t_m2'],        apply:(p)=>{ addAbilityToPlayer(p,'serenity'); } },
    { id:'t_b3',   x:385, y:155, type:'ability', name:'Inner Fire',        desc:'Unlock: Inner Fire',              connections:['t_b4'],               apply:(p)=>{ addAbilityToPlayer(p,'innerFire'); } },
    { id:'t_b4',   x:475, y:145, type:'notable', name:'Fortitude',         desc:'+25 HP, +15 Armor, +2 HP/sec',    connections:['t_cap'],              apply:(p)=>{ p.baseMaxHp+=25; p.baseArmor+=15; p.baseLifeRegen=(p.baseLifeRegen||0)+2; p.recomputeStats(); } },
  ]},

  // ── CRUSADER ──────────────────────────────────────────────────
  crusader: { nodes: [
    { id:'cr_ori', x:20,  y:85,  type:'minor',   origin:true, name:'Holy Calling',      desc:'+10 Holy Power, +5% Dmg',        connections:['cr_t0','cr_m0','cr_b0'], apply:(p)=>{ p.baseMaxResource+=10; p.baseDmgMult*=1.05; p.recomputeStats(); } },
    // TOP — Wrath & Smite
    { id:'cr_t0',  x:90,  y:25,  type:'notable', name:'Righteous Fury',    desc:'+10% Dmg, +5% Crit',              connections:['cr_t1','cr_m0'],      apply:(p)=>{ p.baseDmgMult*=1.10; p.baseCritChance+=5; p.recomputeStats(); } },
    { id:'cr_t1',  x:185, y:15,  type:'ability', name:"Avenger's Shield",  desc:"Unlock: Avenger's Shield",        connections:['cr_t2'],              apply:(p)=>{ addAbilityToPlayer(p,'avengerShield'); } },
    { id:'cr_t2',  x:285, y:20,  type:'notable', name:'Divine Wrath',      desc:'+15% Dmg, +10% Crit Dmg',        connections:['cr_t3','cr_m2'],      apply:(p)=>{ p.baseDmgMult*=1.15; p.baseCritDmg+=0.10; p.recomputeStats(); } },
    { id:'cr_t3',  x:385, y:15,  type:'ability', name:'Wrath of Heaven',   desc:'Unlock: Wrath of Heaven',         connections:['cr_t4'],              apply:(p)=>{ addAbilityToPlayer(p,'wrathOfHeaven'); } },
    { id:'cr_t4',  x:475, y:25,  type:'notable', name:'Holy Avenger',      desc:'+20% Dmg, +10% Crit',             connections:['cr_cap'],             apply:(p)=>{ p.baseDmgMult*=1.20; p.baseCritChance+=10; p.recomputeStats(); } },
    // MID — Holy Power & Consecrate
    { id:'cr_m0',  x:90,  y:85,  type:'notable', name:'Piety',             desc:'+20 Max HP, +10 Holy Power',      connections:['cr_m1','cr_b0'],      apply:(p)=>{ p.baseMaxHp+=20; p.baseMaxResource+=10; p.recomputeStats(); } },
    { id:'cr_m1',  x:185, y:85,  type:'ability', name:'Blessing of Might', desc:'Unlock: Blessing of Might',       connections:['cr_m2'],              apply:(p)=>{ addAbilityToPlayer(p,'blessingOfMight'); } },
    { id:'cr_m2',  x:285, y:85,  type:'ability', name:'Consecration',      desc:'Unlock: Consecration',            connections:['cr_m3'],              apply:(p)=>{ addAbilityToPlayer(p,'consecration'); } },
    { id:'cr_m3',  x:385, y:85,  type:'ability', name:"Crusader's Edge",   desc:"Unlock: Crusader's Edge",         connections:['cr_m4'],              apply:(p)=>{ addAbilityToPlayer(p,'crusadersEdge'); } },
    { id:'cr_m4',  x:475, y:85,  type:'notable', name:'Crusade',           desc:'+18% Dmg, +12% Atk Speed',       connections:['cr_cap'],             apply:(p)=>{ p.baseDmgMult*=1.18; p.baseFireRateMult*=1.12; p.recomputeStats(); } },
    { id:'cr_cap', x:530, y:85,  type:'keystone',name:'Eternal Crusade',   desc:'+35% Dmg, +30 HP, Resurrect 1x', connections:[],                     apply:(p)=>{ p.baseDmgMult*=1.35; p.baseMaxHp+=30; p.freeResurrect=(p.freeResurrect||0)+1; p.recomputeStats(); } },
    // BOT — Defense & Holy Light
    { id:'cr_b0',  x:90,  y:145, type:'minor',   name:'Sacred Shield',     desc:'+12 Armor, +5% Dodge',            connections:['cr_b1'],              apply:(p)=>{ p.baseArmor+=12; p.baseDodge+=5; p.recomputeStats(); } },
    { id:'cr_b1',  x:185, y:155, type:'ability', name:'Divine Shield',     desc:'Unlock: Divine Shield',           connections:['cr_b2'],              apply:(p)=>{ addAbilityToPlayer(p,'divineShield'); } },
    { id:'cr_b2',  x:285, y:150, type:'ability', name:'Holy Nova',         desc:'Unlock: Holy Nova',               connections:['cr_b3','cr_m2'],      apply:(p)=>{ addAbilityToPlayer(p,'holyNova'); } },
    { id:'cr_b3',  x:385, y:155, type:'ability', name:'Holy Beam',         desc:'Unlock: Holy Beam',               connections:['cr_b4'],              apply:(p)=>{ addAbilityToPlayer(p,'holyBeam'); } },
    { id:'cr_b4',  x:475, y:145, type:'notable', name:'Bulwark of Light',  desc:'+20 Armor, +20 HP, +3 HP/sec',    connections:['cr_cap'],             apply:(p)=>{ p.baseArmor+=20; p.baseMaxHp+=20; p.baseLifeRegen=(p.baseLifeRegen||0)+3; p.recomputeStats(); } },
  ]},

  // ── DRUID ─────────────────────────────────────────────────────
  druid: { nodes: [
    { id:'d_ori',  x:20,  y:85,  type:'minor',   origin:true, name:"Nature's Touch",   desc:'+5% Dmg, +2 HP/sec',             connections:['d_t0','d_m0','d_b0'], apply:(p)=>{ p.baseDmgMult*=1.05; p.baseLifeRegen=(p.baseLifeRegen||0)+2; p.recomputeStats(); } },
    // TOP — Shapeshifting & Primal
    { id:'d_t0',   x:90,  y:25,  type:'notable', name:'Primal Instinct',   desc:'+10% Dmg, +10 Speed',             connections:['d_t1','d_m0'],        apply:(p)=>{ p.baseDmgMult*=1.10; p.baseSpeed+=10; p.recomputeStats(); } },
    { id:'d_t1',   x:185, y:15,  type:'ability', name:'Wild Shift',        desc:'Unlock: Wild Shift',              connections:['d_t2'],               apply:(p)=>{ addAbilityToPlayer(p,'wildShift'); } },
    { id:'d_t2',   x:285, y:20,  type:'notable', name:'Feral Surge',       desc:'+15% Dmg, +15% Atk Speed',       connections:['d_t3','d_m2'],        apply:(p)=>{ p.baseDmgMult*=1.15; p.baseFireRateMult*=1.15; p.recomputeStats(); } },
    { id:'d_t3',   x:385, y:15,  type:'ability', name:'Primal Rage',       desc:'Unlock: Primal Rage',             connections:['d_t4'],               apply:(p)=>{ addAbilityToPlayer(p,'primalRage'); } },
    { id:'d_t4',   x:475, y:25,  type:'notable', name:"Nature's Wrath",    desc:'+20% Dmg, +10% Crit',             connections:['d_cap'],              apply:(p)=>{ p.baseDmgMult*=1.20; p.baseCritChance+=10; p.recomputeStats(); } },
    // MID — Earth & Thorns
    { id:'d_m0',   x:90,  y:85,  type:'notable', name:'Thorny Hide',       desc:'+8 Armor, Thorns on Hit',         connections:['d_m1','d_b0'],        apply:(p)=>{ p.baseArmor+=8; p.thornsDmg=(p.thornsDmg||0)+3; p.recomputeStats(); } },
    { id:'d_m1',   x:185, y:85,  type:'ability', name:'Thorn Wall',        desc:'Unlock: Thorn Wall',              connections:['d_m2'],               apply:(p)=>{ addAbilityToPlayer(p,'thornWall'); } },
    { id:'d_m2',   x:285, y:85,  type:'ability', name:'Entangle',          desc:'Unlock: Entangle',                connections:['d_m3'],               apply:(p)=>{ addAbilityToPlayer(p,'entangle'); } },
    { id:'d_m3',   x:385, y:85,  type:'ability', name:'Earth Shock',       desc:'Unlock: Earth Shock',             connections:['d_m4'],               apply:(p)=>{ addAbilityToPlayer(p,'earthShock'); } },
    { id:'d_m4',   x:475, y:85,  type:'notable', name:'Rooted in Power',   desc:'+15% Dmg, +5 HP/sec',             connections:['d_cap'],              apply:(p)=>{ p.baseDmgMult*=1.15; p.baseLifeRegen=(p.baseLifeRegen||0)+5; p.recomputeStats(); } },
    { id:'d_cap',  x:530, y:85,  type:'keystone',name:'World Tree',        desc:'+25% Dmg, +40 HP, +10 HP/sec',   connections:[],                     apply:(p)=>{ p.baseDmgMult*=1.25; p.baseMaxHp+=40; p.baseLifeRegen=(p.baseLifeRegen||0)+10; addAbilityToPlayer(p,'worldTree'); p.recomputeStats(); } },
    // BOT — Storm & Solar
    { id:'d_b0',   x:90,  y:145, type:'minor',   name:'Storm Sense',       desc:'+6% Crit, +5% Atk Speed',        connections:['d_b1'],               apply:(p)=>{ p.baseCritChance+=6; p.baseFireRateMult*=1.05; p.recomputeStats(); } },
    { id:'d_b1',   x:185, y:155, type:'ability', name:'Storm Strike',      desc:'Unlock: Storm Strike',            connections:['d_b2'],               apply:(p)=>{ addAbilityToPlayer(p,'stormStrike'); } },
    { id:'d_b2',   x:285, y:150, type:'ability', name:'Solar Beam',        desc:'Unlock: Solar Beam',              connections:['d_b3','d_m2'],        apply:(p)=>{ addAbilityToPlayer(p,'solarBeam'); } },
    { id:'d_b3',   x:385, y:155, type:'ability', name:'Tornado',           desc:'Unlock: Tornado',                 connections:['d_b4'],               apply:(p)=>{ addAbilityToPlayer(p,'tornado'); } },
    { id:'d_b4',   x:475, y:145, type:'ability', name:'Cataclysm',         desc:'Unlock: Cataclysm',               connections:['d_cap'],              apply:(p)=>{ addAbilityToPlayer(p,'cataclysm'); } },
  ]},

  // ── AMAZONIAN ─────────────────────────────────────────────────
  amazonian: { nodes: [
    { id:'am_ori', x:20,  y:85,  type:'minor',   origin:true, name:'War Spirit',        desc:'+5% Dmg, +5 Speed',              connections:['am_t0','am_m0','am_b0'], apply:(p)=>{ p.baseDmgMult*=1.05; p.baseSpeed+=5; p.recomputeStats(); } },
    // TOP — Javelin & Thunder
    { id:'am_t0',  x:90,  y:25,  type:'notable', name:'Javelin Mastery',   desc:'+10% Dmg, +5% Crit',              connections:['am_t1','am_m0'],      apply:(p)=>{ p.baseDmgMult*=1.10; p.baseCritChance+=5; p.recomputeStats(); } },
    { id:'am_t1',  x:185, y:15,  type:'ability', name:'Thunder Javelin',   desc:'Unlock: Thunder Javelin',         connections:['am_t2'],              apply:(p)=>{ addAbilityToPlayer(p,'thunderJavelin'); } },
    { id:'am_t2',  x:285, y:20,  type:'notable', name:'Electric Surge',    desc:'+12% Dmg, +8% Atk Speed',        connections:['am_t3','am_m2'],      apply:(p)=>{ p.baseDmgMult*=1.12; p.baseFireRateMult*=1.08; p.recomputeStats(); } },
    { id:'am_t3',  x:385, y:15,  type:'ability', name:'Storm of Spears',   desc:'Unlock: Storm of Spears',         connections:['am_t4'],              apply:(p)=>{ addAbilityToPlayer(p,'stormOfSpears'); } },
    { id:'am_t4',  x:475, y:25,  type:'notable', name:'Lightning Reflexes',desc:'+15% Atk Speed, +12% Dodge',     connections:['am_cap'],             apply:(p)=>{ p.baseFireRateMult*=1.15; p.baseDodge+=12; p.recomputeStats(); } },
    // MID — Spirit Charge
    { id:'am_m0',  x:90,  y:85,  type:'notable', name:'Battle Cry',        desc:'+15% Dmg, +10 Speed',             connections:['am_m1','am_b0'],      apply:(p)=>{ p.baseDmgMult*=1.15; p.baseSpeed+=10; p.recomputeStats(); } },
    { id:'am_m1',  x:185, y:85,  type:'ability', name:'Eagle Mark',        desc:'Unlock: Eagle Mark',              connections:['am_m2'],              apply:(p)=>{ addAbilityToPlayer(p,'eagleMark'); } },
    { id:'am_m2',  x:285, y:85,  type:'ability', name:'Spirit Dash',       desc:'Unlock: Spirit Dash',             connections:['am_m3'],              apply:(p)=>{ addAbilityToPlayer(p,'spiritDash'); } },
    { id:'am_m3',  x:385, y:85,  type:'ability', name:'Javelin Volley',    desc:'Unlock: Javelin Volley',          connections:['am_m4'],              apply:(p)=>{ addAbilityToPlayer(p,'javelinVolley'); } },
    { id:'am_m4',  x:475, y:85,  type:'notable', name:'Pack Leader',       desc:'+20% Dmg, +15 Speed',             connections:['am_cap'],             apply:(p)=>{ p.baseDmgMult*=1.20; p.baseSpeed+=15; p.recomputeStats(); } },
    { id:'am_cap', x:530, y:85,  type:'keystone',name:'Apex Predator',     desc:'+25% Dmg, +20 Speed, +15% Dodge',connections:[],                     apply:(p)=>{ p.baseDmgMult*=1.25; p.baseSpeed+=20; p.baseDodge+=15; addAbilityToPlayer(p,'apexPredator'); p.recomputeStats(); } },
    // BOT — Venom & Pack
    { id:'am_b0',  x:90,  y:145, type:'ability', name:'Venom Tip',         desc:'Unlock: Venom Tip',               connections:['am_b1'],              apply:(p)=>{ addAbilityToPlayer(p,'venomTip'); } },
    { id:'am_b1',  x:185, y:155, type:'ability', name:'Strafe',            desc:'Unlock: Strafe',                  connections:['am_b2'],              apply:(p)=>{ addAbilityToPlayer(p,'strafe'); } },
    { id:'am_b2',  x:285, y:150, type:'ability', name:'Pack Hunt',         desc:'Unlock: Pack Hunt',               connections:['am_b3','am_m2'],      apply:(p)=>{ addAbilityToPlayer(p,'packHunt'); } },
    { id:'am_b3',  x:385, y:155, type:'ability', name:'Spirit Bond',       desc:'Unlock: Spirit Bond',             connections:['am_b4'],              apply:(p)=>{ addAbilityToPlayer(p,'spiritBond'); } },
    { id:'am_b4',  x:475, y:145, type:'ability', name:'Gale Force',        desc:'Unlock: Gale Force',              connections:['am_cap'],             apply:(p)=>{ addAbilityToPlayer(p,'galeForce'); } },
  ]},

  // ── SHAMAN ────────────────────────────────────────────────────
  shaman: { nodes: [
    { id:'sh_ori', x:20,  y:85,  type:'minor',   origin:true, name:'Spirit Caller',     desc:'+10 Mojo, +5% Dmg',              connections:['sh_t0','sh_m0','sh_b0'], apply:(p)=>{ p.baseMaxResource+=10; p.baseDmgMult*=1.05; p.recomputeStats(); } },
    // TOP — Hexes & Curses
    { id:'sh_t0',  x:90,  y:25,  type:'notable', name:'Hex Master',        desc:'+8% Dmg, Hexed take +15% Dmg',    connections:['sh_t1','sh_m0'],      apply:(p)=>{ p.baseDmgMult*=1.08; p.recomputeStats(); } },
    { id:'sh_t1',  x:185, y:15,  type:'ability', name:'Hex Bolt',          desc:'Unlock: Hex Bolt',                connections:['sh_t2'],              apply:(p)=>{ addAbilityToPlayer(p,'hexBolt'); } },
    { id:'sh_t2',  x:285, y:20,  type:'notable', name:'Mass Affliction',   desc:'+12% Dmg, +6% Crit',              connections:['sh_t3','sh_m2'],      apply:(p)=>{ p.baseDmgMult*=1.12; p.baseCritChance+=6; p.recomputeStats(); } },
    { id:'sh_t3',  x:385, y:15,  type:'ability', name:'Mass Hex',          desc:'Unlock: Mass Hex',                connections:['sh_t4'],              apply:(p)=>{ addAbilityToPlayer(p,'massHex'); } },
    { id:'sh_t4',  x:475, y:25,  type:'notable', name:'Voodoo Master',     desc:'+20% Dmg, Curses stack twice',    connections:['sh_cap'],             apply:(p)=>{ p.baseDmgMult*=1.20; p.recomputeStats(); } },
    // MID — Totems & Spirits
    { id:'sh_m0',  x:90,  y:85,  type:'notable', name:'Ancestral Link',    desc:'+15 Max Mojo, +5 Mojo/sec',       connections:['sh_m1','sh_b0'],      apply:(p)=>{ p.baseMaxResource+=15; p.baseResourceRegen+=5; p.recomputeStats(); } },
    { id:'sh_m1',  x:185, y:85,  type:'ability', name:'Spirit Totem',      desc:'Unlock: Spirit Totem',            connections:['sh_m2'],              apply:(p)=>{ addAbilityToPlayer(p,'spiritTotem'); } },
    { id:'sh_m2',  x:285, y:85,  type:'ability', name:'Soul Harvest',      desc:'Unlock: Soul Harvest',            connections:['sh_m3'],              apply:(p)=>{ addAbilityToPlayer(p,'soulHarvest'); } },
    { id:'sh_m3',  x:385, y:85,  type:'ability', name:'Big Bad Voodoo',    desc:'Unlock: Big Bad Voodoo',          connections:['sh_m4'],              apply:(p)=>{ addAbilityToPlayer(p,'bigBadVoodoo'); } },
    { id:'sh_m4',  x:475, y:85,  type:'notable', name:'Spirit Surge',      desc:'+18% Dmg, +10 Mojo/sec',         connections:['sh_cap'],             apply:(p)=>{ p.baseDmgMult*=1.18; p.baseResourceRegen+=10; p.recomputeStats(); } },
    { id:'sh_cap', x:530, y:85,  type:'keystone',name:'Ancestral Fury',    desc:'+30% Dmg, +60 Mojo, Spirit Storm',connections:[],                    apply:(p)=>{ p.baseDmgMult*=1.30; p.baseMaxResource+=60; addAbilityToPlayer(p,'ancestralFury'); p.recomputeStats(); } },
    // BOT — Storms & Venom
    { id:'sh_b0',  x:90,  y:145, type:'minor',   name:'Storm Totem',       desc:'+6% Crit, +5% Atk Speed',        connections:['sh_b1'],              apply:(p)=>{ p.baseCritChance+=6; p.baseFireRateMult*=1.05; p.recomputeStats(); } },
    { id:'sh_b1',  x:185, y:155, type:'ability', name:'Venom Cloud',       desc:'Unlock: Venom Cloud',             connections:['sh_b2'],              apply:(p)=>{ addAbilityToPlayer(p,'venomCloud'); } },
    { id:'sh_b2',  x:285, y:150, type:'ability', name:'Spirit Walk',       desc:'Unlock: Spirit Walk',             connections:['sh_b3','sh_m2'],      apply:(p)=>{ addAbilityToPlayer(p,'spiritWalk'); } },
    { id:'sh_b3',  x:385, y:155, type:'ability', name:'Storm Call',        desc:'Unlock: Storm Call',              connections:['sh_b4'],              apply:(p)=>{ addAbilityToPlayer(p,'stormCall'); } },
    { id:'sh_b4',  x:475, y:145, type:'ability', name:'Spirit Storm',      desc:'Unlock: Spirit Storm',            connections:['sh_cap'],             apply:(p)=>{ addAbilityToPlayer(p,'spiritStorm'); } },
  ]},

  // ── NECROMANCER ───────────────────────────────────────────────
  necromancer: { nodes: [
    { id:'n_ori',  x:20,  y:85,  type:'minor',   origin:true, name:"Death's Embrace",  desc:'+5% Dmg, +5 Necrotic Power',    connections:['n_t0','n_m0','n_b0'], apply:(p)=>{ p.baseDmgMult*=1.05; p.baseMaxResource+=5; p.recomputeStats(); } },
    // TOP — Bone Magic
    { id:'n_t0',   x:90,  y:25,  type:'notable', name:'Bone Mastery',      desc:'+10% Dmg, +5% Crit',              connections:['n_t1','n_m0'],        apply:(p)=>{ p.baseDmgMult*=1.10; p.baseCritChance+=5; p.recomputeStats(); } },
    { id:'n_t1',   x:185, y:15,  type:'ability', name:'Bone Spear',        desc:'Unlock: Bone Spear',              connections:['n_t2'],               apply:(p)=>{ addAbilityToPlayer(p,'boneSpear'); } },
    { id:'n_t2',   x:285, y:20,  type:'notable', name:'Ossified Curse',    desc:'+12% Dmg, +8% Crit Dmg',         connections:['n_t3','n_m2'],        apply:(p)=>{ p.baseDmgMult*=1.12; p.baseCritDmg+=0.08; p.recomputeStats(); } },
    { id:'n_t3',   x:385, y:15,  type:'ability', name:'Bone Storm',        desc:'Unlock: Bone Storm',              connections:['n_t4'],               apply:(p)=>{ addAbilityToPlayer(p,'boneStorm'); } },
    { id:'n_t4',   x:475, y:25,  type:'notable', name:'Death Knell',       desc:'+20% Dmg, +12% Crit',             connections:['n_cap'],              apply:(p)=>{ p.baseDmgMult*=1.20; p.baseCritChance+=12; p.recomputeStats(); } },
    // MID — Undead Army
    { id:'n_m0',   x:90,  y:85,  type:'notable', name:'Raise Dead',        desc:'+15 Necrotic Power, +5 NP/sec',   connections:['n_m1','n_b0'],        apply:(p)=>{ p.baseMaxResource+=15; p.baseResourceRegen+=5; p.recomputeStats(); } },
    { id:'n_m1',   x:185, y:85,  type:'ability', name:'Skeleton Warrior',  desc:'Unlock: Skeleton Warrior',        connections:['n_m2'],               apply:(p)=>{ addAbilityToPlayer(p,'skeletonWarrior'); } },
    { id:'n_m2',   x:285, y:85,  type:'ability', name:'Death Nova',        desc:'Unlock: Death Nova',              connections:['n_m3'],               apply:(p)=>{ addAbilityToPlayer(p,'deathNova'); } },
    { id:'n_m3',   x:385, y:85,  type:'ability', name:'Lich Form',         desc:'Unlock: Lich Form',               connections:['n_m4'],               apply:(p)=>{ addAbilityToPlayer(p,'lichForm'); } },
    { id:'n_m4',   x:475, y:85,  type:'notable', name:'Undying',           desc:'+20% Dmg, +20 Max HP',            connections:['n_cap'],              apply:(p)=>{ p.baseDmgMult*=1.20; p.baseMaxHp+=20; p.recomputeStats(); } },
    { id:'n_cap',  x:530, y:85,  type:'keystone',name:'Necrotic Apocalypse',desc:'+35% Dmg, Undead Horde + Oblivion', connections:[],                 apply:(p)=>{ p.baseDmgMult*=1.35; addAbilityToPlayer(p,'necroticApocalypse'); p.recomputeStats(); } },
    // BOT — Blood & Corruption
    { id:'n_b0',   x:90,  y:145, type:'minor',   name:'Blood Price',       desc:'+8% Dmg, Life Steal +2%',         connections:['n_b1'],               apply:(p)=>{ p.baseDmgMult*=1.08; p.lifeStealPct=(p.lifeStealPct||0)+0.02; p.recomputeStats(); } },
    { id:'n_b1',   x:185, y:155, type:'ability', name:'Bone Armor',        desc:'Unlock: Bone Armor',              connections:['n_b2'],               apply:(p)=>{ addAbilityToPlayer(p,'boneArmor'); } },
    { id:'n_b2',   x:285, y:150, type:'ability', name:'Corpse Explosion',  desc:'Unlock: Corpse Explosion',        connections:['n_b3','n_m2'],        apply:(p)=>{ addAbilityToPlayer(p,'corpseExplosion'); } },
    { id:'n_b3',   x:385, y:155, type:'ability', name:'Blood Ritual',      desc:'Unlock: Blood Ritual',            connections:['n_b4'],               apply:(p)=>{ addAbilityToPlayer(p,'bloodRitual'); } },
    { id:'n_b4',   x:475, y:145, type:'notable', name:'Death Shroud',      desc:'+15% Dmg, +10 Armor, Life Steal 3%', connections:['n_cap'],          apply:(p)=>{ p.baseDmgMult*=1.15; p.baseArmor+=10; p.lifeStealPct=(p.lifeStealPct||0)+0.03; p.recomputeStats(); } },
  ]},
};


// ============================================================
// LEVEL-UP STAT POOL — 4 tiers (Common / Uncommon / Rare / Legendary)
// ============================================================
const TIER_DEFS = [
  { tier: 1, name: 'Common',    color: '#aaaaaa', weight: 60 },
  { tier: 2, name: 'Uncommon',  color: '#44dd44', weight: 25 },
  { tier: 3, name: 'Rare',      color: '#4499ff', weight: 12 },
  { tier: 4, name: 'Legendary', color: '#ffaa00', weight:  3 },
];

const STAT_POOL = [
  // ── COMMON (small, incremental gains) ────────────────────────
  { id: 'maxhp_1',       tier: 1, name: '+8 Max HP',           desc: 'A little more life',       apply: (p) => { p.baseMaxHp += 8;           p.recomputeStats(); p.hp = Math.min(p.maxHp, p.hp + 8); } },
  { id: 'damage_1',      tier: 1, name: '+5% Damage',          desc: 'Hits hit a bit harder',    apply: (p) => { p.baseDmgMult *= 1.05;       p.recomputeStats(); } },
  { id: 'firerate_1',    tier: 1, name: '+6% Attack Speed',    desc: 'Fire a bit faster',        apply: (p) => { p.baseFireRateMult *= 1.06;  p.recomputeStats(); } },
  { id: 'pickup_1',      tier: 1, name: '+6 Pickup Range',     desc: 'Magnet items further',     apply: (p) => { p.basePickupRange += 6;      p.recomputeStats(); } },
  { id: 'speed_1',       tier: 1, name: '+6 Move Speed',       desc: 'Move a bit faster',        apply: (p) => { p.baseSpeed += 6;            p.recomputeStats(); } },
  { id: 'regen_1',       tier: 1, name: '+0.5 HP/sec',         desc: 'Trickle of healing',       apply: (p) => { p.baseRegen += 0.5;          p.recomputeStats(); } },
  { id: 'focus_1',       tier: 1, name: '+1.5 Focus/sec',      desc: 'Abilities recharge faster',apply: (p) => { p.baseResourceRegen += 1.5;  p.recomputeStats(); } },
  { id: 'crit_1',        tier: 1, name: '+2% Crit Chance',     desc: 'Occasional crits',         apply: (p) => { p.baseCritChance += 2;       p.recomputeStats(); } },
  { id: 'armor_1',       tier: 1, name: '+1 Armor',            desc: 'Shrug off small hits',     apply: (p) => { p.baseArmor += 1;            p.recomputeStats(); } },
  { id: 'dodge_1',       tier: 1, name: '+2% Dodge',           desc: 'Chance to avoid a hit',    apply: (p) => { p.baseDodge += 2;            p.recomputeStats(); } },
  { id: 'critdmg_1',     tier: 1, name: '+12% Crit Damage',    desc: 'Crits hit harder',         apply: (p) => { p.baseCritDmg += 0.12;       p.recomputeStats(); } },
  { id: 'overpower_1',   tier: 1, name: '+1% Overpower',       desc: 'Rare HP-scaled nuke',      apply: (p) => { p.baseOverpowerChance += 1;  p.recomputeStats(); } },

  // ── UNCOMMON (meaningful but not crazy) ──────────────────────
  { id: 'maxhp_2',       tier: 2, name: '+18 Max HP',          desc: 'Solid health boost',       apply: (p) => { p.baseMaxHp += 18;          p.recomputeStats(); p.hp = Math.min(p.maxHp, p.hp + 18); } },
  { id: 'damage_2',      tier: 2, name: '+10% Damage',         desc: 'Noticeably harder hits',   apply: (p) => { p.baseDmgMult *= 1.10;       p.recomputeStats(); } },
  { id: 'firerate_2',    tier: 2, name: '+12% Attack Speed',   desc: 'Much faster fire rate',    apply: (p) => { p.baseFireRateMult *= 1.12;  p.recomputeStats(); } },
  { id: 'pickup_2',      tier: 2, name: '+12 Pickup Range',    desc: 'Big magnet energy',        apply: (p) => { p.basePickupRange += 12;     p.recomputeStats(); } },
  { id: 'speed_2',       tier: 2, name: '+12 Move Speed',      desc: 'Noticeably faster',        apply: (p) => { p.baseSpeed += 12;           p.recomputeStats(); } },
  { id: 'regen_2',       tier: 2, name: '+1 HP/sec',           desc: 'Steady passive healing',   apply: (p) => { p.baseRegen += 1;            p.recomputeStats(); } },
  { id: 'focus_2',       tier: 2, name: '+3 Focus/sec',        desc: 'Abilities up fast',        apply: (p) => { p.baseResourceRegen += 3;    p.recomputeStats(); } },
  { id: 'crit_2',        tier: 2, name: '+4% Crit Chance',     desc: 'Crits all over the place', apply: (p) => { p.baseCritChance += 4;       p.recomputeStats(); } },
  { id: 'armor_2',       tier: 2, name: '+2 Armor',            desc: 'Decent damage reduction',  apply: (p) => { p.baseArmor += 2;            p.recomputeStats(); } },
  { id: 'dodge_2',       tier: 2, name: '+3% Dodge',           desc: 'Noticeable evasion',       apply: (p) => { p.baseDodge += 3;            p.recomputeStats(); } },
  { id: 'critdmg_2',     tier: 2, name: '+25% Crit Damage',    desc: 'Crits really sting',       apply: (p) => { p.baseCritDmg += 0.25;       p.recomputeStats(); } },
  { id: 'overpower_2',   tier: 2, name: '+2% Overpower',       desc: 'HP-scaled hits land harder',apply: (p) => { p.baseOverpowerChance += 2; p.recomputeStats(); } },

  // ── RARE (exciting but balanced) ─────────────────────────────
  { id: 'maxhp_3',       tier: 3, name: '+35 Max HP',          desc: 'Big health pool + heal',   apply: (p) => { p.baseMaxHp += 35;          p.recomputeStats(); p.hp = Math.min(p.maxHp, p.hp + 35); } },
  { id: 'damage_3',      tier: 3, name: '+18% Damage',         desc: 'Heavy hitter',             apply: (p) => { p.baseDmgMult *= 1.18;       p.recomputeStats(); } },
  { id: 'firerate_3',    tier: 3, name: '+20% Attack Speed',   desc: 'Rapid fire',               apply: (p) => { p.baseFireRateMult *= 1.20;  p.recomputeStats(); } },
  { id: 'pickup_3',      tier: 3, name: '+20 Pickup Range',    desc: 'Massive magnet',           apply: (p) => { p.basePickupRange += 20;     p.recomputeStats(); } },
  { id: 'speed_3',       tier: 3, name: '+20 Move Speed',      desc: 'Hard to catch',            apply: (p) => { p.baseSpeed += 20;           p.recomputeStats(); } },
  { id: 'regen_3',       tier: 3, name: '+2 HP/sec',           desc: 'Strong regeneration',      apply: (p) => { p.baseRegen += 2;            p.recomputeStats(); } },
  { id: 'focus_3',       tier: 3, name: '+5 Focus/sec',        desc: 'Abilities on demand',      apply: (p) => { p.baseResourceRegen += 5;    p.recomputeStats(); } },
  { id: 'crit_3',        tier: 3, name: '+7% Crit Chance',     desc: 'Crit machine',             apply: (p) => { p.baseCritChance += 7;       p.recomputeStats(); } },
  { id: 'armor_3',       tier: 3, name: '+4 Armor',            desc: 'Tanky',                    apply: (p) => { p.baseArmor += 4;            p.recomputeStats(); } },
  { id: 'dodge_3',       tier: 3, name: '+5% Dodge',           desc: 'Hard to pin down',         apply: (p) => { p.baseDodge += 5;            p.recomputeStats(); } },
  { id: 'critdmg_3',     tier: 3, name: '+40% Crit Damage',    desc: 'Crits are devastating',    apply: (p) => { p.baseCritDmg += 0.40;       p.recomputeStats(); } },
  { id: 'overpower_3',   tier: 3, name: '+4% Overpower',       desc: 'Your HP is a weapon',      apply: (p) => { p.baseOverpowerChance += 4;  p.recomputeStats(); } },

  // ── LEGENDARY (run-defining, rare) ───────────────────────────
  { id: 'maxhp_4',       tier: 4, name: '+60 Max HP',          desc: 'Massive health + heal',    apply: (p) => { p.baseMaxHp += 60;          p.recomputeStats(); p.hp = Math.min(p.maxHp, p.hp + 60); } },
  { id: 'damage_4',      tier: 4, name: '+30% Damage',         desc: 'Devastating power',        apply: (p) => { p.baseDmgMult *= 1.30;       p.recomputeStats(); } },
  { id: 'firerate_4',    tier: 4, name: '+30% Attack Speed',   desc: 'Machine gun mode',         apply: (p) => { p.baseFireRateMult *= 1.30;  p.recomputeStats(); } },
  { id: 'pickup_4',      tier: 4, name: '+35 Pickup Range',    desc: 'Everything comes to you',  apply: (p) => { p.basePickupRange += 35;     p.recomputeStats(); } },
  { id: 'speed_4',       tier: 4, name: '+35 Move Speed',      desc: 'Untouchable',              apply: (p) => { p.baseSpeed += 35;           p.recomputeStats(); } },
  { id: 'regen_4',       tier: 4, name: '+4 HP/sec',           desc: 'Practically unkillable',   apply: (p) => { p.baseRegen += 4;            p.recomputeStats(); } },
  { id: 'focus_4',       tier: 4, name: '+8 Focus/sec',        desc: 'Infinite abilities',       apply: (p) => { p.baseResourceRegen += 8;    p.recomputeStats(); } },
  { id: 'crit_4',        tier: 4, name: '+10% Crit Chance',    desc: 'All crits, all day',       apply: (p) => { p.baseCritChance += 10;      p.recomputeStats(); } },
  { id: 'armor_4',       tier: 4, name: '+7 Armor',            desc: 'Damage? What damage?',     apply: (p) => { p.baseArmor += 7;            p.recomputeStats(); } },
  { id: 'dodge_4',       tier: 4, name: '+9% Dodge',           desc: 'You are the ghost',        apply: (p) => { p.baseDodge += 9;            p.recomputeStats(); } },
  { id: 'critdmg_4',     tier: 4, name: '+60% Crit Damage',    desc: 'Crits are execution',      apply: (p) => { p.baseCritDmg += 0.60;       p.recomputeStats(); } },
  { id: 'overpower_4',   tier: 4, name: '+6% Overpower',       desc: 'Unstoppable force',        apply: (p) => { p.baseOverpowerChance += 6;  p.recomputeStats(); } },
];

function rollLevelUpChoices() {
  const totalWeight = TIER_DEFS.reduce((s, t) => s + t.weight, 0);
  function pickTier() {
    let r = Math.random() * totalWeight;
    for (const t of TIER_DEFS) { r -= t.weight; if (r <= 0) return t.tier; }
    return 1;
  }
  const chosen = []; const usedBase = new Set();
  for (let attempts = 0; chosen.length < 3 && attempts < 60; attempts++) {
    const tier = pickTier();
    const pool = STAT_POOL.filter(u => u.tier === tier && !usedBase.has(u.id.replace(/_\d$/, '')));
    if (!pool.length) continue;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    usedBase.add(pick.id.replace(/_\d$/, ''));
    chosen.push(pick);
  }
  return chosen;
}

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
  skeleton:   { hp: 8,  speedRange: [42, 62],  dmg: 10, r: 4, name: 'Skeleton' },
  zombie:     { hp: 18, speedRange: [24, 36],  dmg: 16, r: 5, name: 'Zombie' },
  rat:        { hp: 3,  speedRange: [85, 110], dmg: 6,  r: 3, name: 'Crypt Rat' },
  yeti:       { hp: 28, speedRange: [30, 42],  dmg: 22, r: 6, name: 'Yeti' },
  frostWolf:  { hp: 7,  speedRange: [90, 118], dmg: 12, r: 4, name: 'Frost Wolf' },
  imp:        { hp: 5,  speedRange: [65, 85],  dmg: 10, r: 3, name: 'Imp', ranged: true },
  hellhound:  { hp: 16, speedRange: [60, 82],  dmg: 20, r: 4, name: 'Hellhound' },
  shadow:     { hp: 22, speedRange: [44, 60],  dmg: 24, r: 5, name: 'Shadow' },
  voidCaster: { hp: 12, speedRange: [28, 40],  dmg: 15, r: 4, name: 'Void Caster', ranged: true },
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

// ============================================================
// ELITE / CHAMPION MODS
// ============================================================
const ELITE_MODS = [
  { id: 'vampiric',   name: 'Vampiric',   auraColor: '#ff4488', trailColor: '#cc2255' },
  { id: 'enraged',    name: 'Enraged',    auraColor: '#ff7700', trailColor: '#cc4400' },
  { id: 'molten',     name: 'Molten',     auraColor: '#ffaa00', trailColor: '#ff6600' },
  { id: 'arcane',     name: 'Arcane',     auraColor: '#bb88ff', trailColor: '#8844ff' },
  { id: 'plagued',    name: 'Plagued',    auraColor: '#66ff77', trailColor: '#33aa44' },
  { id: 'shielded',   name: 'Shielded',   auraColor: '#88ccff', trailColor: '#4488cc' },
  { id: 'teleporter', tier: 1, name: 'Teleporter', auraColor: '#ff88ff', trailColor: '#aa44aa' },
];

function rollEliteMods(count) {
  const pool = [...ELITE_MODS];
  const result = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool.splice(idx, 1)[0]);
  }
  return result;
}

// Chance for a given wave to spawn an elite (0 before wave 3)
function eliteChance(wave) {
  if (wave < 3) return 0;
  return Math.min(0.35, 0.10 + (wave - 3) * 0.02);
}
