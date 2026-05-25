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
  WHITE:  { id: 'white',  name: 'Common',    color: '#cccccc', affixMin: 0, affixMax: 1, weight: 600, dmgMult: 1.00 },
  BLUE:   { id: 'blue',   name: 'Magic',     color: '#5599ff', affixMin: 2, affixMax: 3, weight: 290, dmgMult: 1.15 },
  YELLOW: { id: 'yellow', name: 'Rare',      color: '#ffcc33', affixMin: 4, affixMax: 4, weight: 100, dmgMult: 1.30 },
  // Legendary: ~0.9% base (feels special). Set: ~0.1% (incredibly rare).
  // Unique: never in this pool — drops via special boss conditions only.
  ORANGE: { id: 'orange', name: 'Legendary', color: '#ff8000', affixMin: 4, affixMax: 4, weight: 9,   dmgMult: 1.50 },
  GREEN:  { id: 'green',  name: 'Set',       color: '#33cc55', affixMin: 4, affixMax: 4, weight: 1,   dmgMult: 1.40 },
};
const RARITY_LIST = [RARITY.WHITE, RARITY.BLUE, RARITY.YELLOW, RARITY.ORANGE, RARITY.GREEN];

const ITEM_BASES = [
  // Armor — maxSockets: chest/offhand get 2, small pieces get 1
  { id: 'cap',    name: 'Leather Cap',    slot: 'helm',    letter: 'H', maxSockets: 1 },
  { id: 'tunic',  name: 'Leather Tunic',  slot: 'chest',   letter: 'C', maxSockets: 2 },
  { id: 'gloves', name: 'Cloth Gloves',   slot: 'gloves',  letter: 'G', maxSockets: 1 },
  { id: 'boots',  name: 'Soft Boots',     slot: 'boots',   letter: 'F', maxSockets: 1 },
  { id: 'belt',   name: 'Worn Belt',      slot: 'belt',    letter: 'L', maxSockets: 1 },
  // Jewelry — amulet gets 1 socket, rings get 0 (too small)
  { id: 'amulet', name: 'Tin Amulet',     slot: 'amulet',  letter: 'A', maxSockets: 1 },
  { id: 'ring',   name: 'Iron Ring',      slot: 'ring',    letter: 'R', maxSockets: 0 },
  // Weapons — 2 sockets each
  { id: 'bow',    name: 'Hunter Bow',     slot: 'weapon',  letter: 'W', kind: 'ranged', maxSockets: 2 },
  { id: 'sword',  name: 'Iron Sword',     slot: 'weapon',  letter: 'W', kind: 'melee',  maxSockets: 2 },
  { id: 'axe',    name: 'Hand Axe',       slot: 'weapon',  letter: 'W', kind: 'melee',  maxSockets: 2 },
  { id: 'dagger', name: 'Sharp Dagger',   slot: 'weapon',  letter: 'W', kind: 'melee',  maxSockets: 2 },
  { id: 'staff',  name: 'Gnarled Staff',  slot: 'weapon',  letter: 'W', kind: 'ranged', maxSockets: 2 },
  { id: 'wand',   name: 'Carved Wand',    slot: 'weapon',  letter: 'W', kind: 'ranged', maxSockets: 2 },
  { id: 'mace',   name: 'Spiked Mace',    slot: 'weapon',  letter: 'W', kind: 'melee',  maxSockets: 2 },
  // Off-hands — shield/offhand get 2, quiver gets 1
  { id: 'quiver', name: 'Tattered Quiver',slot: 'offhand', letter: 'Q', maxSockets: 1 },
  { id: 'shield', name: 'Wooden Shield',  slot: 'offhand', letter: 'O', maxSockets: 2 },
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
  archer:      ['bow','quiver','dagger','ring','amulet'],
  wizard:      ['staff','wand','orb','ring','amulet'],
  warrior:     ['sword','axe','mace','shield','belt'],
  rogue:       ['dagger','bow','ring','amulet','gloves'],
  monk:        ['orb','ring','gloves','amulet','boots'],
  paladin:     ['mace','shield','sword','belt','amulet'],
  witchdoctor: ['staff','wand','orb','ring','amulet'],
  necromancer: ['staff','orb','wand','ring','amulet'],
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
    id: 'ruby', name: 'Ruby', color: '#ff3333',
    bonuses: [ '+3 HP, +1 Armor', '+6 HP, +2 Armor', '+10 HP, +3 Armor', '+16 HP, +5 Armor', '+25 HP, +8 Armor' ],
    apply: (p, q) => { const hp=[3,6,10,16,25][q]; const ar=[1,2,3,5,8][q]; p.bonusMaxHp+=hp; p.bonusArmor+=ar; },
  },
  {
    id: 'sapphire', name: 'Sapphire', color: '#3366ff',
    bonuses: [ '+5 Resource, +1 Regen', '+10 Resource, +1.5 Regen', '+18 Resource, +2 Regen', '+28 Resource, +3 Regen', '+40 Resource, +5 Regen' ],
    apply: (p, q) => { const rs=[5,10,18,28,40][q]; const rr=[1,1.5,2,3,5][q]; p.bonusMaxResource+=rs; p.bonusResourceRegen+=rr; },
  },
  {
    id: 'topaz', name: 'Topaz', color: '#ffcc00',
    bonuses: [ '+3% Dmg, +2% Atk Spd', '+5% Dmg, +4% Atk Spd', '+8% Dmg, +6% Atk Spd', '+13% Dmg, +10% Atk Spd', '+20% Dmg, +15% Atk Spd' ],
    apply: (p, q) => { const dm=[3,5,8,13,20][q]; const fs=[2,4,6,10,15][q]; p.bonusDmgPct+=dm; p.bonusFireRatePct+=fs; },
  },
  {
    id: 'emerald', name: 'Emerald', color: '#22cc55',
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
  ARCHER: {
    id: 'archer', name: 'Archer', color: '#7ad96b',
    desc: 'Fast and crit-heavy. Auto-fires arrows. Crits refund Focus.',
    baseMaxHp: 80, baseSpeed: 105, baseCritChance: 5,
    weaponDamage: 4, weaponFireRate: 2.2, weaponRange: 210, weaponProjSpeed: 290,
    defaultWeapon: 'bow', defaultWeaponKind: 'ranged',
    resourceName: 'FOCUS', resourceColor: '#ffd23f',
    baseMaxResource: 100, baseResourceRegen: 15, critResourceGain: 18,
    signature: 'multishot',
  },
  WIZARD: {
    id: 'wizard', name: 'Wizard', color: '#5599ff',
    desc: 'Glass cannon. Slow heavy spells. Bigger Mana pool, slower regen.',
    baseMaxHp: 60, baseSpeed: 95, baseCritChance: 3,
    weaponDamage: 7, weaponFireRate: 1.4, weaponRange: 240, weaponProjSpeed: 240,
    defaultWeapon: 'staff', defaultWeaponKind: 'ranged',
    resourceName: 'MANA', resourceColor: '#5599ff',
    baseMaxResource: 140, baseResourceRegen: 8, critResourceGain: 0,
    signature: 'fireball',
  },
  WARRIOR: {
    id: 'warrior', name: 'Warrior', color: '#cc4040',
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
  ROGUE: {
    id: 'rogue', name: 'Rogue', color: '#cc88ff',
    desc: 'Fastest attacks, highest crit. ENERGY refills quickly.',
    baseMaxHp: 70, baseSpeed: 125, baseCritChance: 10,
    weaponDamage: 3, weaponFireRate: 3.0, weaponRange: 130, weaponProjSpeed: 340,
    defaultWeapon: 'dagger', defaultWeaponKind: 'ranged',
    resourceName: 'ENERGY', resourceColor: '#cc88ff',
    baseMaxResource: 80, baseResourceRegen: 30, critResourceGain: 0,
    signature: 'shadowStrike',
  },
  MONK: {
    id: 'monk', name: 'Monk', color: '#ffaa44',
    desc: 'Close-range brawler. Chi flows steadily. Heals through combat.',
    baseMaxHp: 90, baseSpeed: 115, baseCritChance: 5,
    weaponDamage: 5, weaponFireRate: 2.2, weaponRange: 110, weaponProjSpeed: 260,
    defaultWeapon: 'dagger', defaultWeaponKind: 'ranged',
    resourceName: 'CHI', resourceColor: '#ffaa44',
    baseMaxResource: 80, baseResourceRegen: 12, critResourceGain: 8,
    signature: 'fistsOfThunder',
  },
  PALADIN: {
    id: 'paladin', name: 'Paladin', color: '#ffe866',
    desc: 'Holy tank. Hits heal. Consecrated ground burns the wicked.',
    baseMaxHp: 110, baseSpeed: 85, baseCritChance: 4,
    weaponDamage: 7, weaponFireRate: 1.5, weaponRange: 170, weaponProjSpeed: 230,
    defaultWeapon: 'mace', defaultWeaponKind: 'ranged',
    resourceName: 'HOLY POWER', resourceColor: '#ffe866',
    baseMaxResource: 100, baseResourceRegen: 7, critResourceGain: 0,
    signature: 'holyNova',
  },
  WITCH_DOCTOR: {
    id: 'witchdoctor', name: 'Witch Doctor', color: '#55dd66',
    desc: 'Long-range hex caster. MOJO fuels devastating curses.',
    baseMaxHp: 75, baseSpeed: 88, baseCritChance: 3,
    weaponDamage: 4, weaponFireRate: 1.2, weaponRange: 260, weaponProjSpeed: 185,
    defaultWeapon: 'staff', defaultWeaponKind: 'ranged',
    resourceName: 'MOJO', resourceColor: '#55dd66',
    baseMaxResource: 120, baseResourceRegen: 8, critResourceGain: 0,
    signature: 'plagueFrogs',
  },
  NECROMANCER: {
    id: 'necromancer', name: 'Necromancer', color: '#9988cc',
    desc: 'Master of death. Bone spells pierce. Blood sacrifices shatter.',
    baseMaxHp: 65, baseSpeed: 88, baseCritChance: 4,
    weaponDamage: 5, weaponFireRate: 1.1, weaponRange: 230, weaponProjSpeed: 200,
    defaultWeapon: 'staff', defaultWeaponKind: 'ranged',
    resourceName: 'ESSENCE', resourceColor: '#9988cc',
    baseMaxResource: 100, baseResourceRegen: 10, critResourceGain: 0,
    signature: 'boneSpear',
  },
};
function getClassById(id) {
  if (id === 'wizard')      return CLASS.WIZARD;
  if (id === 'warrior')     return CLASS.WARRIOR;
  if (id === 'rogue')       return CLASS.ROGUE;
  if (id === 'monk')        return CLASS.MONK;
  if (id === 'paladin')     return CLASS.PALADIN;
  if (id === 'witchdoctor') return CLASS.WITCH_DOCTOR;
  if (id === 'necromancer') return CLASS.NECROMANCER;
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

  // ── ROGUE ────────────────────────────────────────────────────
  shadowStrike: {
    id: 'shadowStrike', name: 'Shadow Strike', letter: 'S', classOf: 'rogue',
    desc: 'Blink behind nearest enemy, 350% dmg + brief iframe',
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
    id: 'bladeFlurry', name: 'Blade Flurry', letter: 'F', classOf: 'rogue',
    desc: '5 daggers in a forward arc',
    cost: 30, cooldown: 2.5, color: '#dd99ff',
    cast: (player, slot) => {
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const target = findNearestEnemy(player.x, player.y, 200);
      const baseAngle = target ? Math.atan2(target.y - player.y, target.x - player.x) : 0;
      for (let i = 0; i < 5; i++) {
        const t = (i / 4) * 2 - 1;
        const a = baseAngle + t * 0.55;
        const sp = player.weaponProjSpeed * 1.1;
        let dmg = player.weaponDamage * player.dmgMult * 1.1 * rDmg;
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
    id: 'smokeBomb', name: 'Smoke Bomb', letter: 'B', classOf: 'rogue',
    desc: 'Slow nearby enemies, gain +40% speed for 4s',
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
    id: 'backstab', name: 'Backstab', letter: 'K', classOf: 'rogue',
    desc: 'Guaranteed crit for 450% dmg on nearest',
    cost: 40, cooldown: 5.0, color: '#ff66cc',
    cast: (player, slot) => {
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const target = findNearestEnemy(player.x, player.y, 220);
      if (!target) return false;
      const dmg = player.weaponDamage * player.dmgMult * 4.5 * rDmg * 2;
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
    id: 'evasion', name: 'Evasion', letter: 'E', classOf: 'rogue',
    desc: 'Dash away from nearest threat, 0.5s iframe',
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

  // ── MONK ─────────────────────────────────────────────────────
  fistsOfThunder: {
    id: 'fistsOfThunder', name: 'Fists of Thunder', letter: 'F', classOf: 'monk',
    desc: '5 rapid strikes on nearest for 120% dmg each',
    cost: 25, cooldown: 2.0, color: '#ffaa44',
    cast: (player, slot) => {
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const target = findNearestEnemy(player.x, player.y, 140);
      if (!target) return false;
      let died = false;
      for (let i = 0; i < 5; i++) {
        const isCrit = Math.random() * 100 < player.critChance;
        let dmg = player.weaponDamage * player.dmgMult * 1.2 * rDmg;
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
    id: 'innerSanctuary', name: 'Inner Sanctuary', letter: 'I', classOf: 'monk',
    desc: 'Heal 25% max HP',
    cost: 40, cooldown: 8.0, color: '#ffe0a0',
    cast: (player) => {
      const heal = Math.round(player.maxHp * 0.25);
      player.hp = Math.min(player.maxHp, player.hp + heal);
      spawnBurst(player.x, player.y, ['#ffe0a0', '#ffdd44', '#ffffff'], 18);
      return true;
    },
  },
  cycloneStrike: {
    id: 'cycloneStrike', name: 'Cyclone Strike', letter: 'C', classOf: 'monk',
    desc: 'Pull enemies in 120px toward you, then deal AoE',
    cost: 35, cooldown: 4.0, color: '#ffcc66',
    cast: (player, slot) => {
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const radius = 120;
      const dmg = player.weaponDamage * player.dmgMult * 2.0 * rDmg;
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
    id: 'sevenSidedStrike', name: 'Seven-Sided Strike', letter: 'V', classOf: 'monk',
    desc: '7 hits distributed among nearby enemies',
    cost: 50, cooldown: 5.0, color: '#ff8822',
    cast: (player, slot) => {
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const nearby = enemies.filter(e => e.alive && Math.hypot(e.x-player.x, e.y-player.y) < 130);
      if (!nearby.length) return false;
      const dmg = player.weaponDamage * player.dmgMult * 1.8 * rDmg;
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
    id: 'mantraOfHealing', name: 'Mantra of Healing', letter: 'M', classOf: 'monk',
    desc: '+4 HP/s regen for 8s',
    cost: 30, cooldown: 12.0, color: '#ffeeaa',
    cast: (player) => {
      player.mantraTimer = 8.0;
      spawnBurst(player.x, player.y, ['#ffeeaa', '#ffdd44', '#ffffff'], 14);
      return true;
    },
  },

  // ── PALADIN ──────────────────────────────────────────────────
  holyNova: {
    id: 'holyNova', name: 'Holy Nova', letter: 'N', classOf: 'paladin',
    desc: 'AoE blast: damage enemies, heal 4 HP each hit',
    cost: 40, cooldown: 5.0, color: '#ffe866',
    cast: (player, slot) => {
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const radius = 90;
      const dmg = player.weaponDamage * player.dmgMult * 2.0 * rDmg;
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
    id: 'consecration', name: 'Consecration', letter: 'C', classOf: 'paladin',
    desc: 'Holy ground burns enemies for 5s',
    cost: 50, cooldown: 8.0, color: '#ffdd44',
    cast: (player, slot) => {
      const dmg = Math.round(player.weaponDamage * player.dmgMult * 0.4);
      groundEffects.push({ type: 'holy_zone', x: player.x, y: player.y, r: 55, life: 5.0, maxLife: 5.0, damage: dmg, cooldowns: new Map() });
      spawnBurst(player.x, player.y, ['#ffe866', '#ffdd44', '#ffffff'], 14);
      return true;
    },
  },
  divineShield: {
    id: 'divineShield', name: 'Divine Shield', letter: 'D', classOf: 'paladin',
    desc: '2s full invincibility + knockback pulse',
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
    id: 'hammerOfJustice', name: 'Hammer of Justice', letter: 'H', classOf: 'paladin',
    desc: 'Heavy projectile slows on impact (220% dmg)',
    cost: 30, cooldown: 3.0, color: '#ffcc44',
    cast: (player, slot) => {
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const target = findNearestEnemy(player.x, player.y, player.weaponRange * 1.5);
      if (!target) return false;
      const dx = target.x - player.x, dy = target.y - player.y;
      const d = Math.hypot(dx, dy) || 1;
      const sp = player.weaponProjSpeed * 0.55;
      let dmg = player.weaponDamage * player.dmgMult * 2.2 * rDmg;
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
    id: 'layOnHands', name: 'Lay on Hands', letter: 'L', classOf: 'paladin',
    desc: 'Restore 70% max HP',
    cost: 80, cooldown: 20.0, color: '#fffacc',
    cast: (player) => {
      const heal = Math.round(player.maxHp * 0.70);
      player.hp = Math.min(player.maxHp, player.hp + heal);
      spawnBurst(player.x, player.y, ['#ffffff', '#ffe866', '#fffacc'], 24);
      return true;
    },
  },

  // ── WITCH DOCTOR ─────────────────────────────────────────────
  plagueFrogs: {
    id: 'plagueFrogs', name: 'Plague of Frogs', letter: 'T', classOf: 'witchdoctor',
    desc: '8 piercing toad projectiles in a ring',
    cost: 25, cooldown: 3.0, color: '#55dd66',
    cast: (player, slot) => {
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const count = 8;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        const sp = player.weaponProjSpeed * 0.75;
        let dmg = player.weaponDamage * player.dmgMult * 1.2 * rDmg;
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
    id: 'soulHarvest', name: 'Soul Harvest', letter: 'H', classOf: 'witchdoctor',
    desc: 'AoE damage, heal 4 HP per enemy hit',
    cost: 35, cooldown: 5.0, color: '#22aa44',
    cast: (player, slot) => {
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const radius = 100;
      const dmg = player.weaponDamage * player.dmgMult * 1.8 * rDmg;
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
    id: 'bigBadVoodoo', name: 'Big Bad Voodoo', letter: 'V', classOf: 'witchdoctor',
    desc: '+35% dmg & +15% speed for 8s',
    cost: 60, cooldown: 15.0, color: '#aaff44',
    cast: (player) => {
      player.bigBadVoodooTimer = 8.0;
      spawnBurst(player.x, player.y, ['#55dd66', '#aaff44', '#ffff44', '#ffffff'], 20);
      return true;
    },
  },
  corpseSpiders: {
    id: 'corpseSpiders', name: 'Corpse Spiders', letter: 'S', classOf: 'witchdoctor',
    desc: 'Explosive projectile splits into 3 fast piercers',
    cost: 30, cooldown: 3.5, color: '#885522',
    cast: (player, slot) => {
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const target = findNearestEnemy(player.x, player.y, 260);
      if (!target) return false;
      const dx = target.x - player.x, dy = target.y - player.y;
      const d = Math.hypot(dx, dy) || 1;
      let dmg = player.weaponDamage * player.dmgMult * 1.5 * rDmg;
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
    id: 'locustSwarm', name: 'Locust Swarm', letter: 'L', classOf: 'witchdoctor',
    desc: 'Slow + damage all enemies in 130px',
    cost: 40, cooldown: 6.0, color: '#66aa22',
    cast: (player, slot) => {
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const radius = 130;
      const dmg = player.weaponDamage * player.dmgMult * 1.5 * rDmg;
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
    id: 'boneSpear', name: 'Bone Spear', letter: 'B', classOf: 'necromancer',
    desc: 'Fast piercing bone lance (280% dmg)',
    cost: 30, cooldown: 2.0, color: '#ccbbee',
    cast: (player, slot) => {
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const target = findNearestEnemy(player.x, player.y, player.weaponRange * 2);
      if (!target) return false;
      const dx = target.x - player.x, dy = target.y - player.y;
      const d = Math.hypot(dx, dy) || 1;
      const sp = player.weaponProjSpeed * 1.6;
      let dmg = player.weaponDamage * player.dmgMult * 2.8 * rDmg;
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
    id: 'deathNova', name: 'Death Nova', letter: 'N', classOf: 'necromancer',
    desc: 'Bone explosion AoE around player (200% dmg)',
    cost: 40, cooldown: 4.0, color: '#7766aa',
    cast: (player, slot) => {
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const radius = 85;
      const dmg = player.weaponDamage * player.dmgMult * 2.0 * rDmg;
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
    id: 'boneArmor', name: 'Bone Armor', letter: 'R', classOf: 'necromancer',
    desc: 'Absorb the next 3 hits',
    cost: 35, cooldown: 10.0, color: '#d0c8ee',
    cast: (player) => {
      player.boneArmorCharges = 3;
      spawnBurst(player.x, player.y, ['#d0c8ee', '#9988cc', '#ffffff'], 14);
      return true;
    },
  },
  bloodNova: {
    id: 'bloodNova', name: 'Blood Nova', letter: 'V', classOf: 'necromancer',
    desc: 'Sacrifice 15% max HP for massive AoE',
    cost: 0, cooldown: 6.0, color: '#cc2244',
    cast: (player, slot) => {
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const sacrifice = Math.round(player.maxHp * 0.15);
      if (player.hp <= sacrifice) return false; // refuse if fatal
      player.hp -= sacrifice;
      const radius = 110;
      const dmg = player.weaponDamage * player.dmgMult * 3.5 * rDmg + sacrifice * 0.5;
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
    id: 'corpseLance', name: 'Corpse Lance', letter: 'L', classOf: 'necromancer',
    desc: 'Fire bone lances at 3 nearest enemies',
    cost: 45, cooldown: 3.0, color: '#aa99dd',
    cast: (player, slot) => {
      const rDmg = slot && slot.rarity ? slot.rarity.dmgMult : 1.0;
      const sorted = enemies.filter(e => e.alive).sort((a,b) => Math.hypot(a.x-player.x,a.y-player.y) - Math.hypot(b.x-player.x,b.y-player.y));
      const targets = sorted.slice(0, 3);
      if (!targets.length) return false;
      for (const t of targets) {
        const dx = t.x - player.x, dy = t.y - player.y;
        const d = Math.hypot(dx, dy) || 1;
        const sp = player.weaponProjSpeed * 1.4;
        let dmg = player.weaponDamage * player.dmgMult * 2.0 * rDmg;
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
};
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
      p.abilities[i] = { id: abilityId, def: ABILITIES[abilityId], rarity: RARITY.WHITE };
      return;
    }
  }
}

// Tree nodes: { id, name, row(1-5), col(1-3), type:'passive'|'ability', abilityId, desc, apply(p) }
// Unlock rule: to spend in row N you need ≥1 spent node in row N-1.
const TALENT_TREES = {
  archer: { nodes: [
    // Row 1 — always available
    { id:'a_keen_eye',       row:1, col:1, type:'passive', name:'Keen Eye',          desc:'+5% Crit Chance',              apply:(p)=>{ p.baseCritChance+=5;          p.recomputeStats(); } },
    { id:'a_swift_quiver',   row:1, col:2, type:'passive', name:'Swift Quiver',      desc:'+15% Attack Speed',            apply:(p)=>{ p.baseFireRateMult*=1.15;     p.recomputeStats(); } },
    { id:'a_eagle_scout',    row:1, col:3, type:'passive', name:'Eagle Scout',       desc:'+20 Pickup Range',             apply:(p)=>{ p.basePickupRange+=20;        p.recomputeStats(); } },
    // Row 2
    { id:'a_rain',           row:2, col:1, type:'ability', abilityId:'rainOfArrows',  name:'Rain of Arrows', desc:'Unlock: Rain of Arrows',  apply:(p)=>{ addAbilityToPlayer(p,'rainOfArrows'); } },
    { id:'a_sharpshooter',   row:2, col:2, type:'passive', name:'Sharpshooter',      desc:'+10% Damage',                  apply:(p)=>{ p.baseDmgMult*=1.10;          p.recomputeStats(); } },
    { id:'a_hawk_eye',       row:2, col:3, type:'ability', abilityId:'hawkEye',       name:'Hawk Eye',       desc:'Unlock: Hawk Eye',        apply:(p)=>{ addAbilityToPlayer(p,'hawkEye'); } },
    // Row 3
    { id:'a_piercing',       row:3, col:1, type:'ability', abilityId:'piercingShot',  name:'Piercing Shot',  desc:'Unlock: Piercing Shot',   apply:(p)=>{ addAbilityToPlayer(p,'piercingShot'); } },
    { id:'a_lethal_focus',   row:3, col:2, type:'passive', name:'Lethal Focus',      desc:'+10% Dmg, +5% Crit',           apply:(p)=>{ p.baseDmgMult*=1.10; p.baseCritChance+=5; p.recomputeStats(); } },
    { id:'a_crit_mastery',   row:3, col:3, type:'passive', name:'Crit Mastery',      desc:'+25% Crit Damage',             apply:(p)=>{ p.baseCritDmg+=0.25;          p.recomputeStats(); } },
    // Row 4
    { id:'a_volley',         row:4, col:1, type:'ability', abilityId:'arrowVolley',   name:'Arrow Volley',   desc:'Unlock: Arrow Volley',    apply:(p)=>{ addAbilityToPlayer(p,'arrowVolley'); } },
    { id:'a_predator',       row:4, col:3, type:'passive', name:'Predator',          desc:'+8% Dodge, +5% Crit',          apply:(p)=>{ p.baseDodge+=8; p.baseCritChance+=5; p.recomputeStats(); } },
    // Row 5 — Capstone
    { id:'a_deadeye',        row:5, col:2, type:'passive', name:'Dead Eye',          desc:'+20% Dmg, +50% Crit Dmg, +5% Crit', apply:(p)=>{ p.baseDmgMult*=1.20; p.baseCritDmg+=0.50; p.baseCritChance+=5; p.recomputeStats(); } },
  ]},

  wizard: { nodes: [
    { id:'w_arcane_mind',    row:1, col:1, type:'passive', name:'Arcane Mind',       desc:'+12% Damage',                  apply:(p)=>{ p.baseDmgMult*=1.12;          p.recomputeStats(); } },
    { id:'w_mana_surge',     row:1, col:2, type:'passive', name:'Mana Surge',        desc:'+40 Max Mana',                 apply:(p)=>{ p.baseMaxResource+=40;        p.recomputeStats(); } },
    { id:'w_glass_cannon',   row:1, col:3, type:'passive', name:'Glass Cannon',      desc:'+20% Dmg, -15 Max HP',         apply:(p)=>{ p.baseDmgMult*=1.20; p.baseMaxHp=Math.max(10,p.baseMaxHp-15); p.recomputeStats(); } },
    { id:'w_frost_nova',     row:2, col:1, type:'ability', abilityId:'frostNova',     name:'Frost Nova',     desc:'Unlock: Frost Nova',      apply:(p)=>{ addAbilityToPlayer(p,'frostNova'); } },
    { id:'w_chain_react',    row:2, col:2, type:'passive', name:'Chain Reaction',    desc:'+15% Damage',                  apply:(p)=>{ p.baseDmgMult*=1.15;          p.recomputeStats(); } },
    { id:'w_arcane_orb',     row:2, col:3, type:'ability', abilityId:'arcaneOrb',     name:'Arcane Orb',     desc:'Unlock: Arcane Orb',      apply:(p)=>{ addAbilityToPlayer(p,'arcaneOrb'); } },
    { id:'w_chain_light',    row:3, col:1, type:'ability', abilityId:'chainLightning',name:'Chain Lightning',desc:'Unlock: Chain Lightning',  apply:(p)=>{ addAbilityToPlayer(p,'chainLightning'); } },
    { id:'w_overload',       row:3, col:2, type:'passive', name:'Overload',          desc:'+10% Dmg, +2 Armor',           apply:(p)=>{ p.baseDmgMult*=1.10; p.baseArmor+=2; p.recomputeStats(); } },
    { id:'w_spell_echo',     row:3, col:3, type:'passive', name:'Spell Echo',        desc:'+15% Attack Speed',            apply:(p)=>{ p.baseFireRateMult*=1.15;     p.recomputeStats(); } },
    { id:'w_mana_shield',    row:4, col:3, type:'passive', name:'Mana Shield',       desc:'+4 Armor, +20 Max Mana',       apply:(p)=>{ p.baseArmor+=4; p.baseMaxResource+=20; p.recomputeStats(); } },
    { id:'w_archmage',       row:5, col:2, type:'passive', name:'Archmage',          desc:'+25% Dmg, +3 Armor, +30 Mana', apply:(p)=>{ p.baseDmgMult*=1.25; p.baseArmor+=3; p.baseMaxResource+=30; p.recomputeStats(); } },
  ]},

  warrior: { nodes: [
    { id:'wa_battle_hard',   row:1, col:1, type:'passive', name:'Battle Hardened',   desc:'+25 Max HP',                   apply:(p)=>{ p.baseMaxHp+=25;              p.recomputeStats(); } },
    { id:'wa_iron_skin',     row:1, col:2, type:'passive', name:'Iron Skin',         desc:'+3 Armor',                     apply:(p)=>{ p.baseArmor+=3;               p.recomputeStats(); } },
    { id:'wa_war_vet',       row:1, col:3, type:'passive', name:'War Veteran',       desc:'+10% Damage',                  apply:(p)=>{ p.baseDmgMult*=1.10;          p.recomputeStats(); } },
    { id:'wa_cleave',        row:2, col:1, type:'ability', abilityId:'cleave',        name:'Cleave',         desc:'Unlock: Cleave',          apply:(p)=>{ addAbilityToPlayer(p,'cleave'); } },
    { id:'wa_blood_rage',    row:2, col:2, type:'passive', name:'Blood Rage',        desc:'+15% Dmg, +25 Max HP',         apply:(p)=>{ p.baseDmgMult*=1.15; p.baseMaxHp+=25; p.recomputeStats(); } },
    { id:'wa_thick_skin',    row:2, col:3, type:'passive', name:'Thick Skin',        desc:'+3 Armor, +1 HP/sec',          apply:(p)=>{ p.baseArmor+=3; p.baseRegen+=1; p.recomputeStats(); } },
    { id:'wa_war_cry',       row:3, col:1, type:'ability', abilityId:'warCry',        name:'War Cry',        desc:'Unlock: War Cry',         apply:(p)=>{ addAbilityToPlayer(p,'warCry'); } },
    { id:'wa_unstoppable',   row:3, col:2, type:'passive', name:'Unstoppable',       desc:'+5 Armor',                     apply:(p)=>{ p.baseArmor+=5;               p.recomputeStats(); } },
    { id:'wa_endurance',     row:3, col:3, type:'passive', name:'Endurance',         desc:'+40 Max HP, +1 HP/sec',        apply:(p)=>{ p.baseMaxHp+=40; p.baseRegen+=1; p.recomputeStats(); } },
    { id:'wa_charge',        row:4, col:1, type:'ability', abilityId:'charge',        name:'Charge',         desc:'Unlock: Charge',          apply:(p)=>{ addAbilityToPlayer(p,'charge'); } },
    { id:'wa_colossus',      row:4, col:3, type:'passive', name:'Colossus',          desc:'+50 Max HP, +2 Armor',         apply:(p)=>{ p.baseMaxHp+=50; p.baseArmor+=2; p.recomputeStats(); } },
    { id:'wa_ground_slam',   row:5, col:2, type:'ability', abilityId:'groundSlam',    name:'Ground Slam',    desc:'Unlock: Ground Slam',     apply:(p)=>{ addAbilityToPlayer(p,'groundSlam'); } },
  ]},

  rogue: { nodes: [
    { id:'r_shadow_step',    row:1, col:1, type:'passive', name:'Shadow Step',       desc:'+15 Move Speed',               apply:(p)=>{ p.baseSpeed+=15;              p.recomputeStats(); } },
    { id:'r_deadly_poison',  row:1, col:2, type:'passive', name:'Deadly Poison',     desc:'+10% Damage',                  apply:(p)=>{ p.baseDmgMult*=1.10;          p.recomputeStats(); } },
    { id:'r_reflexes',       row:1, col:3, type:'passive', name:'Quick Reflexes',    desc:'+4% Dodge',                    apply:(p)=>{ p.baseDodge+=4;               p.recomputeStats(); } },
    { id:'r_blade_flurry',   row:2, col:1, type:'ability', abilityId:'bladeFlurry',   name:'Blade Flurry',   desc:'Unlock: Blade Flurry',    apply:(p)=>{ addAbilityToPlayer(p,'bladeFlurry'); } },
    { id:'r_cut_run',        row:2, col:2, type:'passive', name:'Cut and Run',       desc:'+12% Atk Speed, +10 Speed',   apply:(p)=>{ p.baseFireRateMult*=1.12; p.baseSpeed+=10; p.recomputeStats(); } },
    { id:'r_smoke_bomb',     row:2, col:3, type:'ability', abilityId:'smokeBomb',     name:'Smoke Bomb',     desc:'Unlock: Smoke Bomb',      apply:(p)=>{ addAbilityToPlayer(p,'smokeBomb'); } },
    { id:'r_backstab',       row:3, col:1, type:'ability', abilityId:'backstab',      name:'Backstab',       desc:'Unlock: Backstab',        apply:(p)=>{ addAbilityToPlayer(p,'backstab'); } },
    { id:'r_serrated',       row:3, col:2, type:'passive', name:'Serrated Edge',     desc:'+12% Dmg, +5% Crit',          apply:(p)=>{ p.baseDmgMult*=1.12; p.baseCritChance+=5; p.recomputeStats(); } },
    { id:'r_phantom',        row:3, col:3, type:'passive', name:'Phantom',           desc:'+5% Dodge, +10 Speed',        apply:(p)=>{ p.baseDodge+=5; p.baseSpeed+=10; p.recomputeStats(); } },
    { id:'r_evasion',        row:4, col:1, type:'ability', abilityId:'evasion',       name:'Evasion',        desc:'Unlock: Evasion',         apply:(p)=>{ addAbilityToPlayer(p,'evasion'); } },
    { id:'r_killing_spree',  row:4, col:3, type:'passive', name:'Killing Spree',     desc:'+15% Atk Speed, +8% Crit Dmg',apply:(p)=>{ p.baseFireRateMult*=1.15; p.baseCritDmg+=0.08; p.recomputeStats(); } },
    { id:'r_master_assassin',row:5, col:2, type:'passive', name:'Master Assassin',   desc:'+50% Crit Dmg, +8% Crit, +6% Dodge', apply:(p)=>{ p.baseCritDmg+=0.50; p.baseCritChance+=8; p.baseDodge+=6; p.recomputeStats(); } },
  ]},

  monk: { nodes: [
    { id:'m_inner_peace',    row:1, col:1, type:'passive', name:'Inner Peace',       desc:'+2 HP/sec Regen',              apply:(p)=>{ p.baseRegen+=2;               p.recomputeStats(); } },
    { id:'m_swift_strikes',  row:1, col:2, type:'passive', name:'Swift Strikes',     desc:'+15% Attack Speed',            apply:(p)=>{ p.baseFireRateMult*=1.15;     p.recomputeStats(); } },
    { id:'m_spirit_focus',   row:1, col:3, type:'passive', name:'Spirit Focus',      desc:'+25 Max Chi',                  apply:(p)=>{ p.baseMaxResource+=25;        p.recomputeStats(); } },
    { id:'m_cyclone',        row:2, col:1, type:'ability', abilityId:'cycloneStrike', name:'Cyclone Strike', desc:'Unlock: Cyclone Strike',  apply:(p)=>{ addAbilityToPlayer(p,'cycloneStrike'); } },
    { id:'m_transcendence',  row:2, col:2, type:'passive', name:'Transcendence',     desc:'+2 HP/sec, +10% Dmg',         apply:(p)=>{ p.baseRegen+=2; p.baseDmgMult*=1.10; p.recomputeStats(); } },
    { id:'m_sanctuary',      row:2, col:3, type:'ability', abilityId:'innerSanctuary',name:'Inner Sanctuary',desc:'Unlock: Inner Sanctuary', apply:(p)=>{ addAbilityToPlayer(p,'innerSanctuary'); } },
    { id:'m_mantra',         row:3, col:1, type:'ability', abilityId:'mantraOfHealing',name:'Mantra of Healing',desc:'Unlock: Mantra of Healing',apply:(p)=>{ addAbilityToPlayer(p,'mantraOfHealing'); } },
    { id:'m_lightning_ref',  row:3, col:2, type:'passive', name:'Lightning Reflex',  desc:'+15 Speed, +2 HP/sec',        apply:(p)=>{ p.baseSpeed+=15; p.baseRegen+=2; p.recomputeStats(); } },
    { id:'m_chi_surge',      row:3, col:3, type:'passive', name:'Chi Surge',         desc:'+15% Damage',                  apply:(p)=>{ p.baseDmgMult*=1.15;          p.recomputeStats(); } },
    { id:'m_seven_sided',    row:4, col:1, type:'ability', abilityId:'sevenSidedStrike',name:'Seven-Sided Strike',desc:'Unlock: Seven-Sided Strike',apply:(p)=>{ addAbilityToPlayer(p,'sevenSidedStrike'); } },
    { id:'m_one_with_all',   row:4, col:3, type:'passive', name:'One With Everything',desc:'+3 Armor, +2 HP/sec',        apply:(p)=>{ p.baseArmor+=3; p.baseRegen+=2; p.recomputeStats(); } },
    { id:'m_nirvana',        row:5, col:2, type:'passive', name:'Nirvana',           desc:'+20% Dmg, +3 HP/sec, +10% Atk Speed', apply:(p)=>{ p.baseDmgMult*=1.20; p.baseRegen+=3; p.baseFireRateMult*=1.10; p.recomputeStats(); } },
  ]},

  paladin: { nodes: [
    { id:'p_holy_fervor',    row:1, col:1, type:'passive', name:'Holy Fervor',       desc:'+10% Damage',                  apply:(p)=>{ p.baseDmgMult*=1.10;          p.recomputeStats(); } },
    { id:'p_blessed_armor',  row:1, col:2, type:'passive', name:'Blessed Armor',     desc:'+3 Armor',                     apply:(p)=>{ p.baseArmor+=3;               p.recomputeStats(); } },
    { id:'p_devotion',       row:1, col:3, type:'passive', name:'Devotion',          desc:'+25 Max HP, +1 HP/sec',        apply:(p)=>{ p.baseMaxHp+=25; p.baseRegen+=1; p.recomputeStats(); } },
    { id:'p_consecration',   row:2, col:1, type:'ability', abilityId:'consecration',  name:'Consecration',   desc:'Unlock: Consecration',    apply:(p)=>{ addAbilityToPlayer(p,'consecration'); } },
    { id:'p_divine_grace',   row:2, col:2, type:'passive', name:'Divine Grace',      desc:'+2 HP/sec, +2 Armor',         apply:(p)=>{ p.baseRegen+=2; p.baseArmor+=2; p.recomputeStats(); } },
    { id:'p_divine_shield',  row:2, col:3, type:'ability', abilityId:'divineShield',  name:'Divine Shield',  desc:'Unlock: Divine Shield',   apply:(p)=>{ addAbilityToPlayer(p,'divineShield'); } },
    { id:'p_hammer',         row:3, col:1, type:'ability', abilityId:'hammerOfJustice',name:'Hammer of Justice',desc:'Unlock: Hammer of Justice',apply:(p)=>{ addAbilityToPlayer(p,'hammerOfJustice'); } },
    { id:'p_sacred_ground',  row:3, col:2, type:'passive', name:'Sacred Ground',     desc:'+3 Armor, +1 HP/sec',         apply:(p)=>{ p.baseArmor+=3; p.baseRegen+=1; p.recomputeStats(); } },
    { id:'p_holy_light',     row:3, col:3, type:'passive', name:'Holy Light',        desc:'+2 HP/sec, +15 Max HP',       apply:(p)=>{ p.baseRegen+=2; p.baseMaxHp+=15; p.recomputeStats(); } },
    { id:'p_lay_on_hands',   row:4, col:1, type:'ability', abilityId:'layOnHands',    name:'Lay on Hands',   desc:'Unlock: Lay on Hands',    apply:(p)=>{ addAbilityToPlayer(p,'layOnHands'); } },
    { id:'p_indomitable',    row:4, col:3, type:'passive', name:'Indomitable',       desc:'+40 Max HP, +2 Armor',        apply:(p)=>{ p.baseMaxHp+=40; p.baseArmor+=2; p.recomputeStats(); } },
    { id:'p_avatar',         row:5, col:2, type:'passive', name:'Avatar of Light',   desc:'+20% Dmg, +5 Armor, +3 HP/sec',apply:(p)=>{ p.baseDmgMult*=1.20; p.baseArmor+=5; p.baseRegen+=3; p.recomputeStats(); } },
  ]},

  witchdoctor: { nodes: [
    { id:'wd_dark_pact',     row:1, col:1, type:'passive', name:'Dark Pact',         desc:'+12% Damage',                  apply:(p)=>{ p.baseDmgMult*=1.12;          p.recomputeStats(); } },
    { id:'wd_spirit_walk',   row:1, col:2, type:'passive', name:'Spirit Walk',       desc:'+15 Move Speed',               apply:(p)=>{ p.baseSpeed+=15;              p.recomputeStats(); } },
    { id:'wd_fetish_power',  row:1, col:3, type:'passive', name:'Fetish Power',      desc:'+15% Attack Speed',            apply:(p)=>{ p.baseFireRateMult*=1.15;     p.recomputeStats(); } },
    { id:'wd_soul_harvest',  row:2, col:1, type:'ability', abilityId:'soulHarvest',   name:'Soul Harvest',   desc:'Unlock: Soul Harvest',    apply:(p)=>{ addAbilityToPlayer(p,'soulHarvest'); } },
    { id:'wd_mojo_mastery',  row:2, col:2, type:'passive', name:'Mojo Mastery',      desc:'+6 Resource Regen',            apply:(p)=>{ p.baseResourceRegen+=6;       p.recomputeStats(); } },
    { id:'wd_voodoo',        row:2, col:3, type:'ability', abilityId:'bigBadVoodoo',  name:'Big Bad Voodoo', desc:'Unlock: Big Bad Voodoo',  apply:(p)=>{ addAbilityToPlayer(p,'bigBadVoodoo'); } },
    { id:'wd_locust',        row:3, col:1, type:'ability', abilityId:'locustSwarm',   name:'Locust Swarm',   desc:'Unlock: Locust Swarm',    apply:(p)=>{ addAbilityToPlayer(p,'locustSwarm'); } },
    { id:'wd_hex_master',    row:3, col:2, type:'passive', name:'Hex Master',        desc:'+15% Damage',                  apply:(p)=>{ p.baseDmgMult*=1.15;          p.recomputeStats(); } },
    { id:'wd_plague_bearer', row:3, col:3, type:'passive', name:'Plague Bearer',     desc:'+8% Dmg, +5 Regen',           apply:(p)=>{ p.baseDmgMult*=1.08; p.baseResourceRegen+=5; p.recomputeStats(); } },
    { id:'wd_spiders',       row:4, col:1, type:'ability', abilityId:'corpseSpiders', name:'Corpse Spiders', desc:'Unlock: Corpse Spiders',  apply:(p)=>{ addAbilityToPlayer(p,'corpseSpiders'); } },
    { id:'wd_voodoo_rush',   row:4, col:3, type:'passive', name:'Voodoo Rush',       desc:'+25 Max Mojo, +5 Regen',      apply:(p)=>{ p.baseMaxResource+=25; p.baseResourceRegen+=5; p.recomputeStats(); } },
    { id:'wd_gargantuan',    row:5, col:2, type:'passive', name:'Gargantuan',        desc:'+25% Dmg, +6 Resource Regen', apply:(p)=>{ p.baseDmgMult*=1.25; p.baseResourceRegen+=6; p.recomputeStats(); } },
  ]},

  necromancer: { nodes: [
    { id:'n_bone_mastery',   row:1, col:1, type:'passive', name:'Bone Mastery',      desc:'+12% Damage',                  apply:(p)=>{ p.baseDmgMult*=1.12;          p.recomputeStats(); } },
    { id:'n_death_embrace',  row:1, col:2, type:'passive', name:'Death Embrace',     desc:'+25 Max HP',                   apply:(p)=>{ p.baseMaxHp+=25;              p.recomputeStats(); } },
    { id:'n_corpse_power',   row:1, col:3, type:'passive', name:'Corpse Power',      desc:'+8% Dmg, +4 Essence/sec',     apply:(p)=>{ p.baseDmgMult*=1.08; p.baseResourceRegen+=4; p.recomputeStats(); } },
    { id:'n_bone_armor',     row:2, col:1, type:'ability', abilityId:'boneArmor',     name:'Bone Armor',     desc:'Unlock: Bone Armor',      apply:(p)=>{ addAbilityToPlayer(p,'boneArmor'); } },
    { id:'n_brittle_bones',  row:2, col:2, type:'passive', name:'Brittle Bones',     desc:'+15% Damage',                  apply:(p)=>{ p.baseDmgMult*=1.15;          p.recomputeStats(); } },
    { id:'n_death_nova',     row:2, col:3, type:'ability', abilityId:'deathNova',     name:'Death Nova',     desc:'Unlock: Death Nova',      apply:(p)=>{ addAbilityToPlayer(p,'deathNova'); } },
    { id:'n_blood_nova',     row:3, col:1, type:'ability', abilityId:'bloodNova',     name:'Blood Nova',     desc:'Unlock: Blood Nova',      apply:(p)=>{ addAbilityToPlayer(p,'bloodNova'); } },
    { id:'n_essence_tap',    row:3, col:2, type:'passive', name:'Essence Tap',       desc:'+6 Essence/sec',               apply:(p)=>{ p.baseResourceRegen+=6;       p.recomputeStats(); } },
    { id:'n_necrotic_aura',  row:3, col:3, type:'passive', name:'Necrotic Aura',     desc:'+10% Dmg, +2 Armor',          apply:(p)=>{ p.baseDmgMult*=1.10; p.baseArmor+=2; p.recomputeStats(); } },
    { id:'n_corpse_lance',   row:4, col:1, type:'ability', abilityId:'corpseLance',   name:'Corpse Lance',   desc:'Unlock: Corpse Lance',    apply:(p)=>{ addAbilityToPlayer(p,'corpseLance'); } },
    { id:'n_death_shroud',   row:4, col:3, type:'passive', name:'Death Shroud',      desc:'+4 Armor, +1 HP/sec',         apply:(p)=>{ p.baseArmor+=4; p.baseRegen+=1; p.recomputeStats(); } },
    { id:'n_lich_form',      row:5, col:2, type:'passive', name:'Lich Form',         desc:'+20% Dmg, +5 Essence/sec, +4 Armor', apply:(p)=>{ p.baseDmgMult*=1.20; p.baseResourceRegen+=5; p.baseArmor+=4; p.recomputeStats(); } },
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
  { id: 'teleporter', name: 'Teleporter', auraColor: '#ff88ff', trailColor: '#aa44aa' },
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
