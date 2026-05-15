// =============================================================================
// SLAYERS — src/entities.js
// Entity classes (Player, Enemy, bosses, projectiles, gems, drops, particles)
// plus their tightly-coupled death/explosion/spawnBurst helpers.
// Load order: data.js -> entities.js -> inline index.html script
// =============================================================================

// ============================================================
// ENTITY: Projectile (player)
// ============================================================
const PROJ_THEMES = {
  fire:   { outer: '#ff5520', inner: '#ffdd00' },
  frost:  { outer: '#aaccff', inner: '#ffffff' },
  arcane: { outer: '#aa66ff', inner: '#dd99ff' },
  light:  { outer: '#ffff80', inner: '#ffffff' },
};
class Projectile {
  constructor(x, y, vx, vy, damage, life, isCrit) {
    this.x = x; this.y = y; this.vx = vx; this.vy = vy;
    this.r = isCrit ? 3 : 2;
    this.damage = damage; this.life = life;
    this.dead = false; this.isCrit = !!isCrit;
    this.piercing = false; this.hitSet = null;
    this.theme = null;
    this.explosive = false; this.explosionRadius = 0; this.explosionDamage = 0;
  }
  update(dt) {
    this.x += this.vx * dt; this.y += this.vy * dt;
    this.life -= dt;
    if (this.life <= 0 || this.x < -20 || this.x > W + 20 || this.y < -20 || this.y > H + 20) this.dead = true;
  }
  draw(ctx) {
    if (this.theme && PROJ_THEMES[this.theme]) {
      const t = PROJ_THEMES[this.theme];
      const r = this.r || 4;
      ctx.fillStyle = t.outer;
      ctx.fillRect(Math.floor(this.x - r), Math.floor(this.y - r), r * 2, r * 2);
      ctx.fillStyle = t.inner;
      ctx.fillRect(Math.floor(this.x - r/2), Math.floor(this.y - r/2), Math.max(1, r), Math.max(1, r));
      return;
    }
    if (this.piercing) {
      ctx.fillStyle = '#5599ff'; ctx.fillRect(Math.floor(this.x - 3), Math.floor(this.y - 3), 7, 7);
      ctx.fillStyle = '#aaccff'; ctx.fillRect(Math.floor(this.x - 1), Math.floor(this.y - 1), 3, 3);
    } else if (this.isCrit) {
      ctx.fillStyle = '#ff8800'; ctx.fillRect(Math.floor(this.x - 2), Math.floor(this.y - 2), 5, 5);
      ctx.fillStyle = '#ffe080'; ctx.fillRect(Math.floor(this.x - 1), Math.floor(this.y - 1), 3, 3);
    } else {
      ctx.fillStyle = '#fff7a0'; ctx.fillRect(Math.floor(this.x - 1), Math.floor(this.y - 1), 3, 3);
      ctx.fillStyle = '#ffe040'; ctx.fillRect(Math.floor(this.x), Math.floor(this.y), 1, 1);
    }
  }
}

// ============================================================
// ENTITY: BoneProjectile (enemy projectile, themed)
// ============================================================
const ENEMY_SHOT_THEMES = {
  bone: { outer: '#d8d8c0', inner: '#a0a090', spark: '#e8e8d0' },
  ice:  { outer: '#aaccff', inner: '#5599ff', spark: '#ddeeff' },
  fire: { outer: '#ff8800', inner: '#ffdd00', spark: '#ffaa44' },
  void: { outer: '#aa66ff', inner: '#5533aa', spark: '#dd99ff' },
};
class BoneProjectile {
  constructor(x, y, vx, vy, damage, theme) {
    this.x = x; this.y = y; this.vx = vx; this.vy = vy;
    this.r = 3; this.damage = damage;
    this.life = 3.5; this.dead = false; this.rot = 0;
    this.theme = theme || 'bone';
  }
  update(dt) {
    this.x += this.vx * dt; this.y += this.vy * dt;
    this.life -= dt; this.rot += dt * 9;
    if (this.life <= 0 || this.x < -20 || this.x > W + 20 || this.y < -20 || this.y > H + 20) this.dead = true;
  }
  draw(ctx) {
    const t = ENEMY_SHOT_THEMES[this.theme] || ENEMY_SHOT_THEMES.bone;
    const px = Math.floor(this.x), py = Math.floor(this.y);
    const flicker = Math.floor(this.rot) % 2;
    ctx.fillStyle = flicker ? t.spark : t.outer; ctx.fillRect(px - 2, py - 2, 4, 4);
    ctx.fillStyle = t.inner; ctx.fillRect(px - 1, py - 1, 2, 2);
    ctx.fillStyle = t.spark;
    ctx.fillRect(px - 3, py, 1, 1); ctx.fillRect(px + 2, py, 1, 1);
  }
}

// ============================================================
// ENTITY: Particle
// ============================================================
class Particle {
  constructor(x, y, vx, vy, color, life, size) {
    this.x = x; this.y = y; this.vx = vx; this.vy = vy;
    this.color = color; this.life = life; this.maxLife = life;
    this.size = size || 2;
  }
  update(dt) {
    this.x += this.vx * dt; this.y += this.vy * dt;
    this.vx *= 0.90; this.vy *= 0.90;
    this.life -= dt;
  }
  draw(ctx) {
    const a = Math.max(0, this.life / this.maxLife);
    ctx.globalAlpha = a; ctx.fillStyle = this.color;
    ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.size, this.size);
    ctx.globalAlpha = 1;
  }
  get dead() { return this.life <= 0; }
}
function spawnBurst(x, y, palette, count) {
  palette = palette || ['#f0f0e0', '#e8e8d8', '#b0b0a0', '#ffffff'];
  count = count || 8;
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = 40 + Math.random() * 70;
    const c = palette[Math.floor(Math.random() * palette.length)];
    particles.push(new Particle(x, y, Math.cos(a) * s, Math.sin(a) * s, c, 0.35 + Math.random() * 0.25));
  }
}

// ============================================================
// ENTITY: XP Gem
// ============================================================
class XPGem {
  constructor(x, y, value) {
    this.x = x; this.y = y;
    this.vx = (Math.random() - 0.5) * 40;
    this.vy = (Math.random() - 0.5) * 40 - 20;
    this.r = 3; this.value = value;
    this.dead = false; this.magnetized = false;
    this.bobPhase = Math.random() * Math.PI * 2;
  }
  update(dt, player) {
    this.bobPhase += dt * 5;
    if (!this.magnetized) {
      this.vx *= 0.92; this.vy *= 0.92;
      this.x += this.vx * dt; this.y += this.vy * dt;
    }
    const dx = player.x - this.x, dy = player.y - this.y;
    const d = Math.hypot(dx, dy);
    if (!this.magnetized && d < player.pickupRange) this.magnetized = true;
    if (this.magnetized) {
      const sp = 200 + (1 - Math.min(d / 100, 1)) * 250;
      if (d > 0.01) { this.x += (dx / d) * sp * dt; this.y += (dy / d) * sp * dt; }
      if (d < player.r + this.r) {
        player.addXp(this.value); this.dead = true;
        if (typeof Sfx !== 'undefined') Sfx.pickupXp();
      }
    }
  }
  draw(ctx) {
    const px = Math.floor(this.x), py = Math.floor(this.y + Math.sin(this.bobPhase) * 0.8);
    ctx.fillStyle = '#9b59ff'; ctx.fillRect(px - 1, py - 2, 3, 4);
    ctx.fillStyle = '#c89aff';
    ctx.fillRect(px, py - 1, 1, 1); ctx.fillRect(px - 1, py - 2, 1, 1);
  }
}

// ============================================================
// ENTITY: ItemDrop
// ============================================================
class ItemDrop {
  constructor(x, y, item) {
    this.x = x; this.y = y;
    this.vx = (Math.random() - 0.5) * 30;
    this.vy = (Math.random() - 0.5) * 30 - 25;
    this.r = 5; this.item = item;
    this.dead = false; this.settled = false;
    this.bobPhase = Math.random() * Math.PI * 2;
    this.glowPhase = Math.random() * Math.PI * 2;
  }
  update(dt, player) {
    this.bobPhase += dt * 3; this.glowPhase += dt * 4;
    if (!this.settled) {
      this.vx *= 0.85; this.vy *= 0.85;
      this.x += this.vx * dt; this.y += this.vy * dt;
      if (Math.abs(this.vx) + Math.abs(this.vy) < 5) this.settled = true;
    }
    const dx = player.x - this.x, dy = player.y - this.y;
    const rr = player.r + this.r;
    if (dx * dx + dy * dy < rr * rr) {
      if (player.inventory.length < player.INVENTORY_CAP) {
        player.inventory.push(this.item);
        this.dead = true;
        spawnBurst(this.x, this.y, [this.item.rarity.color, '#ffffff'], 8);
        lootFlashTimer = 2.0;
        lastLootName = itemDisplayName(this.item);
        if (typeof Sfx !== 'undefined') Sfx.pickupItem();
      }
    }
  }
  draw(ctx) {
    const px = Math.floor(this.x), py = Math.floor(this.y + Math.sin(this.bobPhase) * 1.5);
    const glow = 0.4 + 0.2 * Math.sin(this.glowPhase);
    ctx.globalAlpha = glow;
    ctx.fillStyle = this.item.rarity.color; ctx.fillRect(px - 6, py - 6, 12, 12);
    ctx.globalAlpha = 1;
    ctx.fillStyle = this.item.rarity.color; ctx.fillRect(px - 4, py - 4, 8, 8);
    ctx.fillStyle = '#1a1a22'; ctx.fillRect(px - 3, py - 3, 6, 6);
    ctx.fillStyle = this.item.rarity.color;
    ctx.font = 'bold 7px monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(this.item.base.letter, px, py + 1);
    ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
  }
}

// ============================================================
// ENTITY: Player
// ============================================================
class Player {
  constructor(x, y, classId) {
    this.x = x; this.y = y;
    this.r = 5; this.facing = 1;
    this.class = getClassById(classId || 'archer');
    this.baseMaxHp = this.class.baseMaxHp;
    this.baseDmgMult = 1.0;
    this.baseFireRateMult = 1.0;
    this.basePickupRange = 30;
    this.baseSpeed = this.class.baseSpeed;
    this.baseRegen = 0;
    this.baseArmor = 0;
    this.baseCritChance = this.class.baseCritChance;
    this.baseMaxResource = this.class.baseMaxResource;
    this.baseResourceRegen = this.class.baseResourceRegen;
    this.bonusMaxHp = 0; this.bonusDmgPct = 0; this.bonusFireRatePct = 0;
    this.bonusPickupRange = 0; this.bonusMoveSpeed = 0; this.bonusRegen = 0;
    this.bonusArmor = 0; this.bonusCritChance = 0;
    this.bonusMaxResource = 0; this.bonusResourceRegen = 0;
    this.maxHp = this.baseMaxHp; this.hp = this.maxHp;
    this.dmgMult = 1.0; this.fireRateMult = 1.0;
    this.pickupRange = this.basePickupRange; this.speed = this.baseSpeed;
    this.regen = 0; this.armor = 0; this.critChance = this.baseCritChance;
    this.maxResource = this.baseMaxResource; this.resourceRegen = this.baseResourceRegen;
    this.resource = this.maxResource;
    this.iframeTimer = 0; this.IFRAME = 0.5; this.hitFlash = 0;
    this.hawkEyeTimer = 0;
    this.warCryTimer = 0;
    this.level = 1; this.xp = 0; this.xpToNext = 5;
    this.pendingLevelUps = 0; this.kills = 0;
    this.weaponDamage = this.class.weaponDamage;
    this.weaponFireRate = this.class.weaponFireRate;
    this.weaponRange = this.class.weaponRange;
    this.weaponProjSpeed = this.class.weaponProjSpeed;
    this.fireTimer = 0;
    this.abilities = [null, null, null, null];
    this.abilityCooldowns = [0, 0, 0, 0];
    if (this.class.signature && ABILITIES[this.class.signature]) {
      this.abilities[0] = { id: this.class.signature, def: ABILITIES[this.class.signature], rarity: RARITY.WHITE };
    }
    this.equipped = {
      helm: null, chest: null, gloves: null, boots: null, belt: null,
      amulet: null, ring1: null, ring2: null, weapon: null, offhand: null,
    };
    this.inventory = []; this.INVENTORY_CAP = 24;
    this.gold = 0;
    this.mats = { bone: 0, arcane: 0, essence: 0, fragment: 0 };
  }
  onCrit() {
    if (this.class.critResourceGain) {
      this.resource = Math.min(this.maxResource, this.resource + this.class.critResourceGain);
    }
  }
  effectiveCritChance() { return this.critChance + (this.hawkEyeTimer > 0 ? 30 : 0); }
  effectiveFireRateMult() { return this.fireRateMult * (this.hawkEyeTimer > 0 ? 1.3 : 1.0); }
  recomputeStats() {
    this.bonusMaxHp = 0; this.bonusDmgPct = 0; this.bonusFireRatePct = 0;
    this.bonusPickupRange = 0; this.bonusMoveSpeed = 0; this.bonusRegen = 0;
    this.bonusArmor = 0; this.bonusCritChance = 0;
    this.bonusMaxResource = 0; this.bonusResourceRegen = 0;
    for (const k in this.equipped) {
      const it = this.equipped[k];
      if (!it) continue;
      for (const aff of it.affixes) aff.def.apply(this, aff.value);
    }
    const oldMax = this.maxHp;
    const ratio = oldMax > 0 ? this.hp / oldMax : 1;
    const oldMaxR = this.maxResource;
    const ratioR = oldMaxR > 0 ? this.resource / oldMaxR : 1;
    this.maxHp = this.baseMaxHp + this.bonusMaxHp;
    this.dmgMult = this.baseDmgMult * (1 + this.bonusDmgPct / 100);
    this.fireRateMult = this.baseFireRateMult * (1 + this.bonusFireRatePct / 100);
    this.pickupRange = this.basePickupRange + this.bonusPickupRange;
    this.speed = this.baseSpeed + this.bonusMoveSpeed;
    this.regen = this.baseRegen + this.bonusRegen;
    this.armor = this.baseArmor + this.bonusArmor;
    this.critChance = this.baseCritChance + this.bonusCritChance;
    this.maxResource = this.baseMaxResource + this.bonusMaxResource;
    this.resourceRegen = this.baseResourceRegen + this.bonusResourceRegen;
    if (this.maxHp !== oldMax) this.hp = Math.min(this.maxHp, Math.max(1, ratio * this.maxHp));
    else this.hp = Math.min(this.hp, this.maxHp);
    if (this.maxResource !== oldMaxR) this.resource = Math.min(this.maxResource, ratioR * this.maxResource);
    else this.resource = Math.min(this.resource, this.maxResource);
  }
  update(dt) {
    this.x += Actions.moveX * this.speed * dt;
    this.y += Actions.moveY * this.speed * dt;
    this.x = Math.max(this.r, Math.min(W - this.r, this.x));
    this.y = Math.max(this.r, Math.min(H - this.r, this.y));
    if (Actions.moveX >  0.1) this.facing =  1;
    else if (Actions.moveX < -0.1) this.facing = -1;
    if (this.iframeTimer > 0) this.iframeTimer -= dt;
    if (this.hitFlash > 0) this.hitFlash -= dt;
    if (this.hawkEyeTimer > 0) this.hawkEyeTimer -= dt;
    if (this.warCryTimer > 0) this.warCryTimer -= dt;
    if (this.regen > 0 && this.hp < this.maxHp) this.hp = Math.min(this.maxHp, this.hp + this.regen * dt);
    if (this.resource < this.maxResource) this.resource = Math.min(this.maxResource, this.resource + this.resourceRegen * dt);
    for (let i = 0; i < this.abilityCooldowns.length; i++) {
      if (this.abilityCooldowns[i] > 0) this.abilityCooldowns[i] -= dt;
    }
    if (this.fireTimer > 0) this.fireTimer -= dt;
    if (this.fireTimer <= 0) {
      if (this.class.meleeRange) {
        const range = this.class.meleeRange;
        const buff = this.warCryTimer > 0 ? 1.4 : 1;
        const dmg = this.weaponDamage * this.dmgMult * buff;
        let hitAny = false;
        for (const e of enemies) {
          if (!e.alive) continue;
          const dx = e.x - this.x, dy = e.y - this.y;
          if (dx*dx + dy*dy < range*range) {
            hitAny = true;
            const isCrit = Math.random() * 100 < this.effectiveCritChance();
            const finalDmg = isCrit ? dmg * 2 : dmg;
            const died = e.takeDamage(finalDmg);
            spawnBurst(e.x, e.y, isCrit ? ['#ff8800', '#ffd040', '#ffffff'] : ['#ff6020', '#ffaa40'], isCrit ? 5 : 2);
            if (isCrit) this.onCrit();
            if (this.class.rageOnHit) {
              this.resource = Math.min(this.maxResource, this.resource + this.class.rageOnHit);
            }
            if (died) {
              if (e.isBoss) handleBossDeath(e);
              else handleEnemyDeath(e);
            }
          }
        }
        if (hitAny) {
          spawnBurst(this.x + this.facing * 12, this.y, ['#ff6020', '#ffaa40', '#ffffff'], 4);
          this.fireTimer = 1 / (this.weaponFireRate * this.effectiveFireRateMult());
        } else {
          this.fireTimer = 0.1;
        }
      } else {
        const target = findNearestEnemy(this.x, this.y, this.weaponRange);
        if (target) {
          fireProjectile(this, target);
          this.fireTimer = 1 / (this.weaponFireRate * this.effectiveFireRateMult());
        }
      }
    }
  }
  takeDamage(amount) {
    if (this.iframeTimer > 0) return false;
    const actual = Math.max(1, amount - this.armor);
    this.hp -= actual;
    this.iframeTimer = this.IFRAME; this.hitFlash = 0.25;
    shake = Math.min(shake + 3, 6);
    if (this.class.rageOnTake) {
      this.resource = Math.min(this.maxResource, this.resource + this.class.rageOnTake);
    }
    if (this.hp <= 0) { this.hp = 0; return true; }
    return false;
  }
  addXp(amount) {
    this.xp += amount;
    while (this.xp >= this.xpToNext) {
      this.xp -= this.xpToNext; this.level += 1; this.pendingLevelUps += 1;
      this.xpToNext = 5 + (this.level - 1) * 3;
      levelUpFlashTimer = 1.5;
      if (typeof Sfx !== 'undefined') Sfx.levelUp();
    }
  }
  draw(ctx) {
    const px = Math.floor(this.x), py = Math.floor(this.y);
    const flash = this.hitFlash > 0 && Math.floor(this.hitFlash * 24) % 2 === 0;
    // Buff auras (drawn behind the sprite)
    if (this.hawkEyeTimer > 0) {
      const pulse = 0.4 + 0.3 * Math.sin(performance.now() * 0.012);
      ctx.globalAlpha = pulse * 0.5;
      ctx.fillStyle = '#33cc55';
      ctx.fillRect(px - 8, py - 9, 16, 17);
      ctx.globalAlpha = 1;
    }
    if (this.warCryTimer > 0) {
      const pulse = 0.5 + 0.4 * Math.sin(performance.now() * 0.018);
      ctx.globalAlpha = pulse * 0.55;
      ctx.fillStyle = '#ff4040';
      ctx.fillRect(px - 8, py - 10, 16, 18);
      ctx.globalAlpha = 1;
    }
    // Pick the right class sprite. facing===-1 mirrors horizontally.
    const sprite = (typeof PLAYER_SPRITES !== 'undefined')
      ? PLAYER_SPRITES[this.class.id]
      : null;
    if (sprite && typeof drawSprite === 'function') {
      drawSprite(ctx, sprite, px, py, this.facing === -1, flash, 2);
    } else {
      // Fallback: primitive draw if sprites failed to load
      ctx.fillStyle = flash ? '#ff4444' : this.class.color;
      ctx.fillRect(px - 4, py - 2, 8, 7);
    }
  }
}

// (Earlier `scaledDraw` helper removed — all entities now use drawSprite,
// which handles integer pixel scaling natively.)

// ============================================================
// ENTITY: Enemy (skeleton/zombie/rat/yeti/frostWolf/imp/hellhound/shadow/voidCaster)
// ============================================================
class Enemy {
  constructor(x, y, type, hpMult, speedMult, dmgMult) {
    const t = ENEMY_TYPES[type];
    this.type = type;
    this.x = x; this.y = y; this.r = t.r;
    this.maxHp = Math.round(t.hp * hpMult); this.hp = this.maxHp;
    this.contactDmg = Math.round(t.dmg * dmgMult);
    this.speed = (t.speedRange[0] + Math.random() * (t.speedRange[1] - t.speedRange[0])) * speedMult;
    this.alive = true;
    this.bobPhase = Math.random() * Math.PI * 2;
    this.hitFlash = 0; this.isBoss = false;
    this.fireTimer = 1 + Math.random() * 2;
    this.slowTimer = 0;
    this.slowFactor = 1.0;
    // Elite / Champion state
    this.elite = false;
    this.eliteMods = [];
    this.eliteScale = 1;
    this.shield = 0; this.shieldMax = 0; this.shieldFlash = 0;
    this.auraPhase = Math.random() * Math.PI * 2;
    this.eliteTimers = {};
  }

  hasMod(id) { return this.eliteMods.some(m => m.id === id); }

  makeElite(mods) {
    this.elite = true;
    this.eliteMods = mods;
    this.eliteScale = 1.5;
    this.maxHp = Math.round(this.maxHp * 3);
    this.hp = this.maxHp;
    this.speed *= 1.25;
    this.contactDmg = Math.round(this.contactDmg * 1.3);
    this.r = Math.round(this.r * 1.3);
    if (this.hasMod('shielded')) {
      this.shieldMax = Math.round(this.maxHp * 0.5);
      this.shield = this.shieldMax;
    }
    if (this.hasMod('teleporter'))  this.eliteTimers.teleport = 3 + Math.random() * 2;
    if (this.hasMod('arcane'))      this.eliteTimers.arcane   = 2 + Math.random();
    if (this.hasMod('molten'))      this.eliteTimers.trail    = 0.8 + Math.random() * 0.4;
    if (this.hasMod('plagued'))     this.eliteTimers.plague   = 2.5 + Math.random();
  }

  update(dt, target) {
    const dx = target.x - this.x, dy = target.y - this.y;
    const d = Math.hypot(dx, dy);
    if (this.slowTimer > 0) this.slowTimer -= dt;
    const enraged = this.elite && this.hasMod('enraged') && this.hp < this.maxHp * 0.3;
    const effSpeed = (this.slowTimer > 0 ? this.speed * this.slowFactor : this.speed) * (enraged ? 1.8 : 1);
    if (d > 0.01) { this.x += (dx / d) * effSpeed * dt; this.y += (dy / d) * effSpeed * dt; }
    const bobSpeed = (this.type === 'rat' || this.type === 'frostWolf') ? 14
                   : (this.type === 'zombie' || this.type === 'yeti') ? 5
                   : 8;
    this.bobPhase += dt * bobSpeed;
    if (this.hitFlash > 0) this.hitFlash -= dt;
    if (this.shieldFlash > 0) this.shieldFlash -= dt;
    const t = ENEMY_TYPES[this.type];
    if (t.ranged) {
      this.fireTimer -= dt;
      if (this.fireTimer <= 0 && d < 200 && d > 0.01) {
        this.fireTimer = 2.5 + Math.random() * 1.5;
        const sp = this.type === 'imp' ? 110 : 90;
        const theme = this.type === 'imp' ? 'fire' : 'void';
        enemyProjectiles.push(new BoneProjectile(this.x, this.y, (dx/d)*sp, (dy/d)*sp, this.contactDmg, theme));
      }
    }
    // ── Elite mod behaviors ──────────────────────────────────
    if (this.elite) {
      this.auraPhase += dt * 3;

      // Vampiric: slowly regenerate HP (1.5% maxHP/s)
      if (this.hasMod('vampiric')) {
        this.hp = Math.min(this.maxHp, this.hp + this.maxHp * 0.015 * dt);
      }

      // Teleporter: blink near the player every 3-5s
      if (this.hasMod('teleporter')) {
        this.eliteTimers.teleport -= dt;
        if (this.eliteTimers.teleport <= 0) {
          this.eliteTimers.teleport = 3 + Math.random() * 2;
          const ang = Math.random() * Math.PI * 2;
          const dist = 55 + Math.random() * 70;
          this.x = Math.max(20, Math.min(W - 20, target.x + Math.cos(ang) * dist));
          this.y = Math.max(20, Math.min(H - 20, target.y + Math.sin(ang) * dist));
          spawnBurst(this.x, this.y, ['#aa44aa', '#ff88ff', '#ffffff'], 10);
        }
      }

      // Arcane: fire 4 projectiles in cardinal directions every 2.5s
      if (this.hasMod('arcane')) {
        this.eliteTimers.arcane -= dt;
        if (this.eliteTimers.arcane <= 0) {
          this.eliteTimers.arcane = 2.5 + Math.random();
          const sp = 70;
          [[1,0],[-1,0],[0,1],[0,-1]].forEach(([vx,vy]) => {
            enemyProjectiles.push(new BoneProjectile(this.x, this.y, vx*sp, vy*sp, Math.round(this.contactDmg * 0.5), 'void'));
          });
        }
      }

      // Molten: leave fire patches behind every 0.7-1.1s
      if (this.hasMod('molten')) {
        this.eliteTimers.trail -= dt;
        if (this.eliteTimers.trail <= 0) {
          this.eliteTimers.trail = 0.7 + Math.random() * 0.4;
          groundEffects.push({ type: 'fire_patch', x: this.x, y: this.y, r: 14,
            life: 3.0, maxLife: 3.0, damage: Math.round(this.contactDmg * 0.35), cooldowns: new Map() });
        }
      }

      // Plagued: spawn poison cloud every 2.5-3.5s
      if (this.hasMod('plagued')) {
        this.eliteTimers.plague -= dt;
        if (this.eliteTimers.plague <= 0) {
          this.eliteTimers.plague = 2.5 + Math.random();
          groundEffects.push({ type: 'poison_cloud', x: this.x, y: this.y, r: 26,
            life: 4.0, maxLife: 4.0, damage: Math.round(this.contactDmg * 0.28), cooldowns: new Map() });
        }
      }
    }
  }

  takeDamage(amount, opts) {
    // Shielded elites absorb damage to shield first
    if (this.elite && this.shield > 0) {
      const absorbed = Math.min(this.shield, amount);
      this.shield -= absorbed;
      this.shieldFlash = 0.15;
      const overflow = amount - absorbed;
      if (overflow > 0) {
        this.hp -= overflow;
        this.hitFlash = 0.1;
      }
      if (typeof spawnDamageNumber === 'function') {
        spawnDamageNumber(this.x, this.y - this.r, amount, { color: '#88ccff', crit: opts && opts.crit });
      }
      if (this.hp <= 0) { this.alive = false; return true; }
      return false;
    }
    this.hp -= amount; this.hitFlash = 0.1;
    if (typeof spawnDamageNumber === 'function') {
      const o = opts || {};
      spawnDamageNumber(this.x, this.y - this.r, amount, {
        color: o.crit ? '#ffe8a0' : (o.color || '#fff7a0'),
        crit: !!o.crit,
      });
    }
    if (this.hp <= 0) { this.alive = false; return true; }
    return false;
  }

  draw(ctx) {
    const px = Math.floor(this.x), py = Math.floor(this.y + Math.sin(this.bobPhase) * 0.5);
    const f = this.hitFlash > 0;
    const sc = this.eliteScale; // 1 for normal, 1.5 for elites

    // ── Elite aura (drawn behind sprite) ────────────────────
    if (this.elite) {
      const primaryMod = this.eliteMods[0];
      const auraColor = primaryMod ? primaryMod.auraColor : '#ffffff';
      const pulse = 0.28 + 0.18 * Math.sin(this.auraPhase);
      ctx.globalAlpha = pulse;
      ctx.fillStyle = auraColor;
      const ar = Math.round(this.r * sc) + 5;
      ctx.fillRect(px - ar, py - ar, ar * 2, ar * 2);
      ctx.globalAlpha = 1;
      // Enraged: extra red halo when below 30%
      if (this.hasMod('enraged') && this.hp < this.maxHp * 0.3) {
        const rage = 0.4 + 0.3 * Math.sin(this.auraPhase * 2.5);
        ctx.globalAlpha = rage;
        ctx.fillStyle = '#ff2200';
        ctx.fillRect(px - ar - 3, py - ar - 3, (ar + 3) * 2, (ar + 3) * 2);
        ctx.globalAlpha = 1;
      }
    }

    // ── Sprite ───────────────────────────────────────────────
    const sprite = (typeof ENEMY_SPRITES !== 'undefined') ? ENEMY_SPRITES[this.type] : null;
    if (sprite && typeof drawSprite === 'function') {
      if (this.type === 'shadow') {
        ctx.globalAlpha = 0.7 + 0.3 * Math.sin(performance.now() * 0.01 + this.bobPhase);
      }
      drawSprite(ctx, sprite, px, py, false, f, 2 * sc);
      ctx.globalAlpha = 1;
      if (this.type === 'voidCaster') {
        const orbY = py + Math.sin(performance.now() * 0.005) * 2;
        ctx.fillStyle = '#aa66ff';
        ctx.fillRect(px + 10, Math.floor(orbY) - 2, 4, 4);
        ctx.fillStyle = '#ff60ff';
        ctx.fillRect(px + 11, Math.floor(orbY) - 1, 2, 2);
      }
    } else {
      ctx.fillStyle = f ? '#ffffff' : '#aa3030';
      const fr = Math.round(this.r * sc);
      ctx.fillRect(px - fr, py - fr, fr * 2, fr * 2);
    }

    // ── Shield bubble (drawn over sprite) ───────────────────
    if (this.elite && this.shieldMax > 0 && this.shield > 0) {
      const sf = this.shieldFlash > 0;
      ctx.globalAlpha = sf ? 0.9 : (0.45 + 0.2 * Math.sin(this.auraPhase * 2));
      ctx.strokeStyle = sf ? '#ffffff' : '#88ccff';
      ctx.lineWidth = sf ? 2 : 1;
      const sr = Math.round(this.r * sc) + 5;
      ctx.beginPath(); ctx.arc(px, py, sr, 0, Math.PI * 2); ctx.stroke();
      ctx.lineWidth = 1; ctx.globalAlpha = 1;
    }

    // ── Elite HP bar + name label ────────────────────────────
    if (this.elite) {
      const barW = 32, barH = 3;
      const bx = px - barW / 2, by = py - Math.round(this.r * sc) - 15;
      // Background
      ctx.fillStyle = '#1a0000';
      ctx.fillRect(bx - 1, by - 1, barW + 2, barH + 2);
      // HP fill
      const hpRatio = Math.max(0, this.hp / this.maxHp);
      ctx.fillStyle = hpRatio > 0.5 ? '#cc3333' : (hpRatio > 0.25 ? '#ff8800' : '#ff2200');
      ctx.fillRect(bx, by, Math.floor(barW * hpRatio), barH);
      // Shield bar underneath (if shielded mod)
      if (this.shieldMax > 0) {
        const shRatio = Math.max(0, this.shield / this.shieldMax);
        ctx.fillStyle = '#1a2a3a';
        ctx.fillRect(bx - 1, by + barH + 1, barW + 2, 3);
        ctx.fillStyle = '#88ccff';
        ctx.fillRect(bx, by + barH + 2, Math.floor(barW * shRatio), 1);
      }
      // Name label
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = 'bold 7px monospace';
      ctx.fillStyle = '#ffdd88';
      ctx.fillText(ENEMY_TYPES[this.type].name, px, by - 5);
      // Mod names (smaller, coloured)
      if (this.eliteMods.length > 0) {
        ctx.font = '6px monospace';
        ctx.fillStyle = this.eliteMods[0].auraColor;
        ctx.fillText(this.eliteMods.map(m => m.name).join(' / '), px, by - 12);
      }
      ctx.restore();
    }
  }
}

// ============================================================
// BOSS: BoneLord (Wave 5)
// ============================================================
class BoneLord {
  constructor(x, y, hpMult, speedMult, dmgMult) {
    this.x = x; this.y = y; this.r = 10;
    this.maxHp = Math.round(280 * hpMult); this.hp = this.maxHp;
    this.contactDmg = Math.round(12 * dmgMult);
    this.speed = 32 * speedMult;
    this.alive = true; this.isBoss = true;
    this.bobPhase = 0; this.hitFlash = 0;
    this.boneThrowTimer = 3.0; this.summonTimer = 8.0;
    this.preferredDistance = 80;
    this.name = 'Bone Lord';
  }
  update(dt, target) {
    const dx = target.x - this.x, dy = target.y - this.y;
    const d = Math.hypot(dx, dy);
    let mv = 0;
    if (d > this.preferredDistance + 20) mv = 1;
    else if (d < this.preferredDistance - 20) mv = -0.5;
    if (d > 0.01 && mv !== 0) {
      this.x += (dx / d) * this.speed * mv * dt;
      this.y += (dy / d) * this.speed * mv * dt;
    }
    this.x = Math.max(this.r, Math.min(W - this.r, this.x));
    this.y = Math.max(this.r, Math.min(H - this.r, this.y));
    this.bobPhase += dt * 4;
    if (this.hitFlash > 0) this.hitFlash -= dt;
    this.boneThrowTimer -= dt;
    if (this.boneThrowTimer <= 0) {
      this.boneThrowTimer = 3.0;
      const a0 = Math.atan2(dy, dx);
      for (const off of [-0.25, 0, 0.25]) {
        const a = a0 + off;
        enemyProjectiles.push(new BoneProjectile(this.x, this.y, Math.cos(a) * 130, Math.sin(a) * 130, this.contactDmg));
      }
      spawnBurst(this.x, this.y, ['#e8e8d0', '#a0a090'], 6);
    }
    this.summonTimer -= dt;
    if (this.summonTimer <= 0) {
      this.summonTimer = 9.0;
      for (let i = 0; i < 3; i++) {
        const ang = (Math.PI * 2) * (i / 3) + Math.random() * 0.5;
        const sx = this.x + Math.cos(ang) * 26;
        const sy = this.y + Math.sin(ang) * 26;
        enemies.push(new Enemy(sx, sy, 'skeleton', 0.8, 1.0, 0.8));
      }
      spawnBurst(this.x, this.y, ['#7755aa', '#aa88cc', '#ddccff'], 16);
    }
  }
  takeDamage(amount, opts) {
    this.hp -= amount; this.hitFlash = 0.12;
    if (typeof spawnDamageNumber === 'function') {
      const o = opts || {};
      spawnDamageNumber(this.x, this.y - this.r, amount, {
        color: o.crit ? '#ffe8a0' : (o.color || '#fff7a0'),
        crit: !!o.crit, size: o.crit ? 12 : 9,
      });
    }
    if (this.hp <= 0) { this.alive = false; return true; }
    return false;
  }
  draw(ctx) {
    const px = Math.floor(this.x), py = Math.floor(this.y + Math.sin(this.bobPhase) * 0.6);
    const f = this.hitFlash > 0;
    const sprite = (typeof BOSS_SPRITES !== 'undefined') ? BOSS_SPRITES.BoneLord : null;
    if (sprite && typeof drawSprite === 'function') {
      drawSprite(ctx, sprite, px, py, false, f, 2);
    } else {
      // Fallback
      ctx.fillStyle = f ? '#ffffff' : '#e8e8d0';
      ctx.fillRect(px - this.r, py - this.r, this.r * 2, this.r * 2);
    }
  }
}

// ============================================================
// BOSS: IceGiant (Wave 10)
// ============================================================
class IceGiant {
  constructor(x, y, hpMult, speedMult, dmgMult) {
    this.x = x; this.y = y; this.r = 14;
    this.maxHp = Math.round(500 * hpMult); this.hp = this.maxHp;
    this.contactDmg = Math.round(14 * dmgMult);
    this.speed = 22 * speedMult;
    this.alive = true; this.isBoss = true;
    this.bobPhase = 0; this.hitFlash = 0;
    this.shardTimer = 4.0; this.slamTimer = 6.0; this.summonTimer = 12.0;
    this.name = 'Ice Giant';
  }
  update(dt, target) {
    const dx = target.x - this.x, dy = target.y - this.y;
    const d = Math.hypot(dx, dy);
    if (d > 60 && d > 0.01) {
      this.x += (dx / d) * this.speed * dt;
      this.y += (dy / d) * this.speed * dt;
    }
    this.x = Math.max(this.r, Math.min(W - this.r, this.x));
    this.y = Math.max(this.r, Math.min(H - this.r, this.y));
    this.bobPhase += dt * 3;
    if (this.hitFlash > 0) this.hitFlash -= dt;
    this.shardTimer -= dt;
    if (this.shardTimer <= 0) {
      this.shardTimer = 4.0;
      const a0 = Math.atan2(dy, dx);
      for (const off of [-0.35, -0.18, 0, 0.18, 0.35]) {
        const a = a0 + off;
        enemyProjectiles.push(new BoneProjectile(this.x, this.y, Math.cos(a) * 120, Math.sin(a) * 120, this.contactDmg, 'ice'));
      }
      spawnBurst(this.x, this.y, ['#aaccff', '#5599ff'], 8);
    }
    this.slamTimer -= dt;
    if (this.slamTimer <= 0) {
      this.slamTimer = 6.5;
      groundEffects.push({ type: 'shockwave', x: this.x, y: this.y, r: 0, maxR: 100, damage: this.contactDmg * 1.5, life: 0.6, maxLife: 0.6, color: '#aaccff', hit: new Set() });
      shake = Math.min(shake + 5, 10);
    }
    if (this.hp < this.maxHp * 0.5) {
      this.summonTimer -= dt;
      if (this.summonTimer <= 0) {
        this.summonTimer = 10.0;
        for (let i = 0; i < 2; i++) {
          const ang = Math.random() * Math.PI * 2;
          const sx = this.x + Math.cos(ang) * 32;
          const sy = this.y + Math.sin(ang) * 32;
          enemies.push(new Enemy(sx, sy, 'frostWolf', 0.9, 1.0, 0.9));
        }
        spawnBurst(this.x, this.y, ['#aaccff', '#5599ff', '#ffffff'], 14);
      }
    }
  }
  takeDamage(amount, opts) { this.hp -= amount; this.hitFlash = 0.12; if (typeof spawnDamageNumber === 'function') { const o = opts || {}; spawnDamageNumber(this.x, this.y - this.r, amount, { color: o.crit ? '#ffe8a0' : (o.color || '#fff7a0'), crit: !!o.crit, size: o.crit ? 12 : 9 }); } if (this.hp <= 0) { this.alive = false; return true; } return false; }
  draw(ctx) {
    const px = Math.floor(this.x), py = Math.floor(this.y + Math.sin(this.bobPhase) * 0.5);
    const f = this.hitFlash > 0;
    const sprite = (typeof BOSS_SPRITES !== 'undefined') ? BOSS_SPRITES.IceGiant : null;
    if (sprite && typeof drawSprite === 'function') {
      drawSprite(ctx, sprite, px, py, false, f, 2);
    } else {
      ctx.fillStyle = f ? '#ffffff' : '#d8e8f5';
      ctx.fillRect(px - this.r, py - this.r, this.r * 2, this.r * 2);
    }
  }
}

// ============================================================
// BOSS: Pyromancer (Wave 15)
// ============================================================
class Pyromancer {
  constructor(x, y, hpMult, speedMult, dmgMult) {
    this.x = x; this.y = y; this.r = 8;
    this.maxHp = Math.round(420 * hpMult); this.hp = this.maxHp;
    this.contactDmg = Math.round(13 * dmgMult);
    this.speed = 55 * speedMult;
    this.alive = true; this.isBoss = true;
    this.bobPhase = 0; this.hitFlash = 0;
    this.teleportTimer = 5.0; this.meteorTimer = 2.5; this.summonTimer = 10.0;
    this.name = 'Pyromancer';
    this.teleportFlash = 0;
  }
  update(dt, target) {
    const dx = target.x - this.x, dy = target.y - this.y;
    const d = Math.hypot(dx, dy);
    if (d > 100 && d > 0.01) {
      this.x += (dx / d) * this.speed * dt;
      this.y += (dy / d) * this.speed * dt;
    } else if (d < 60 && d > 0.01) {
      this.x -= (dx / d) * this.speed * 0.6 * dt;
      this.y -= (dy / d) * this.speed * 0.6 * dt;
    }
    this.x = Math.max(this.r, Math.min(W - this.r, this.x));
    this.y = Math.max(this.r, Math.min(H - this.r, this.y));
    this.bobPhase += dt * 6;
    if (this.hitFlash > 0) this.hitFlash -= dt;
    if (this.teleportFlash > 0) this.teleportFlash -= dt;
    this.teleportTimer -= dt;
    if (this.teleportTimer <= 0) {
      this.teleportTimer = 5.0;
      spawnBurst(this.x, this.y, ['#ff4400', '#ff8800', '#ffdd00'], 16);
      this.x = 80 + Math.random() * (W - 160);
      this.y = 80 + Math.random() * (H - 160);
      this.teleportFlash = 0.5;
      spawnBurst(this.x, this.y, ['#ff4400', '#ff8800', '#ffdd00'], 16);
    }
    this.meteorTimer -= dt;
    if (this.meteorTimer <= 0) {
      this.meteorTimer = 2.5;
      const mx = target.x + (Math.random() - 0.5) * 20;
      const my = target.y + (Math.random() - 0.5) * 20;
      groundEffects.push({ type: 'meteor', x: mx, y: my, r: 0, maxR: 35, damage: this.contactDmg * 1.6, life: 1.2, maxLife: 1.2, color: '#ff4400', hit: new Set(), exploded: false });
    }
    if (this.hp < this.maxHp * 0.5) {
      this.summonTimer -= dt;
      if (this.summonTimer <= 0) {
        this.summonTimer = 9.0;
        for (let i = 0; i < 3; i++) {
          const ang = Math.random() * Math.PI * 2;
          const sx = this.x + Math.cos(ang) * 24;
          const sy = this.y + Math.sin(ang) * 24;
          enemies.push(new Enemy(sx, sy, 'imp', 0.9, 1.0, 0.9));
        }
        spawnBurst(this.x, this.y, ['#ff4400', '#ff8800', '#ffdd00'], 16);
      }
    }
  }
  takeDamage(amount, opts) { this.hp -= amount; this.hitFlash = 0.12; if (typeof spawnDamageNumber === 'function') { const o = opts || {}; spawnDamageNumber(this.x, this.y - this.r, amount, { color: o.crit ? '#ffe8a0' : (o.color || '#fff7a0'), crit: !!o.crit, size: o.crit ? 12 : 9 }); } if (this.hp <= 0) { this.alive = false; return true; } return false; }
  draw(ctx) {
    const px = Math.floor(this.x), py = Math.floor(this.y + Math.sin(this.bobPhase) * 0.6);
    const f = this.hitFlash > 0;
    if (this.teleportFlash > 0) {
      ctx.globalAlpha = this.teleportFlash * 1.5;
      ctx.fillStyle = "#ff8800";
      ctx.fillRect(px - 22, py - 26, 44, 52);
      ctx.globalAlpha = 1;
    }
    const sprite = (typeof BOSS_SPRITES !== "undefined") ? BOSS_SPRITES.Pyromancer : null;
    if (sprite && typeof drawSprite === "function") {
      drawSprite(ctx, sprite, px, py, false, f, 2);
    } else {
      ctx.fillStyle = f ? "#ffffff" : "#aa1010"; ctx.fillRect(px - 5, py - 1, 10, 8);
      ctx.fillStyle = f ? "#ffffff" : "#cc2020"; ctx.fillRect(px - 5, py - 4, 10, 4);
      ctx.fillStyle = f ? "#ffffff" : "#dd3010"; ctx.fillRect(px - 4, py - 8, 8, 4);
      ctx.fillStyle = "#ffff40";
      ctx.fillRect(px - 2, py - 6, 1, 1); ctx.fillRect(px + 1, py - 6, 1, 1);
      const flamY = py - 12 + Math.sin(performance.now() * 0.008) * 1;
      ctx.fillStyle = "#ff8800"; ctx.fillRect(px - 1, Math.floor(flamY), 2, 3);
      ctx.fillStyle = "#ffdd00"; ctx.fillRect(px, Math.floor(flamY) + 1, 1, 1);
      ctx.fillStyle = "#660000";
      ctx.fillRect(px - 4, py + 7, 3, 3); ctx.fillRect(px + 1, py + 7, 3, 3);
    }
  }
}

// ============================================================
// BOSS: Slayer-Killer (Wave 20, final)
// ============================================================
class SlayerKiller {
  constructor(x, y, hpMult, speedMult, dmgMult) {
    this.x = x; this.y = y; this.r = 11;
    this.maxHp = Math.round(800 * hpMult); this.hp = this.maxHp;
    this.contactDmg = Math.round(16 * dmgMult);
    this.speed = 40 * speedMult;
    this.alive = true; this.isBoss = true;
    this.bobPhase = 0; this.hitFlash = 0;
    this.boltTimer = 2.0; this.summonTimer = 12.0;
    this.preferredDistance = 110;
    this.name = 'The Slayer-Killer';
    this.phase = 1;
  }
  update(dt, target) {
    const hpRatio = this.hp / this.maxHp;
    const newPhase = hpRatio > 0.66 ? 1 : hpRatio > 0.33 ? 2 : 3;
    if (newPhase !== this.phase) {
      this.phase = newPhase;
      spawnBurst(this.x, this.y, ['#aa66ff', '#dd99ff', '#ffffff'], 20);
      shake = Math.min(shake + 5, 10);
    }
    const dx = target.x - this.x, dy = target.y - this.y;
    const d = Math.hypot(dx, dy);
    let mv = 0;
    if (d > this.preferredDistance + 20) mv = 1;
    else if (d < this.preferredDistance - 20) mv = -0.6;
    if (d > 0.01 && mv !== 0) {
      const sm = this.phase === 3 ? 1.5 : this.phase === 2 ? 1.2 : 1.0;
      this.x += (dx / d) * this.speed * sm * mv * dt;
      this.y += (dy / d) * this.speed * sm * mv * dt;
    }
    this.x = Math.max(this.r, Math.min(W - this.r, this.x));
    this.y = Math.max(this.r, Math.min(H - this.r, this.y));
    this.bobPhase += dt * 5;
    if (this.hitFlash > 0) this.hitFlash -= dt;
    this.boltTimer -= dt;
    const boltCd = this.phase === 3 ? 1.0 : this.phase === 2 ? 1.5 : 2.0;
    if (this.boltTimer <= 0) {
      this.boltTimer = boltCd;
      const a0 = Math.atan2(dy, dx);
      const sc = this.phase === 3 ? 5 : this.phase === 2 ? 4 : 3;
      const hs = 0.3;
      for (let i = 0; i < sc; i++) {
        const t = sc === 1 ? 0 : (i / (sc - 1)) * 2 - 1;
        const a = a0 + t * hs;
        enemyProjectiles.push(new BoneProjectile(this.x, this.y, Math.cos(a) * 140, Math.sin(a) * 140, this.contactDmg, 'void'));
      }
      spawnBurst(this.x, this.y, ['#aa66ff', '#dd99ff'], 6);
    }
    if (this.phase >= 2) {
      this.summonTimer -= dt;
      if (this.summonTimer <= 0) {
        this.summonTimer = this.phase === 3 ? 8.0 : 12.0;
        for (let i = 0; i < 2; i++) {
          const ang = Math.random() * Math.PI * 2;
          const sx = this.x + Math.cos(ang) * 28;
          const sy = this.y + Math.sin(ang) * 28;
          enemies.push(new Enemy(sx, sy, 'shadow', 0.9, 1.0, 0.9));
        }
        spawnBurst(this.x, this.y, ['#5533aa', '#aa66ff', '#ffffff'], 18);
      }
    }
  }
  takeDamage(amount, opts) { this.hp -= amount; this.hitFlash = 0.12; if (typeof spawnDamageNumber === 'function') { const o = opts || {}; spawnDamageNumber(this.x, this.y - this.r, amount, { color: o.crit ? '#ffe8a0' : (o.color || '#fff7a0'), crit: !!o.crit, size: o.crit ? 12 : 9 }); } if (this.hp <= 0) { this.alive = false; return true; } return false; }
  draw(ctx) {
    const px = Math.floor(this.x), py = Math.floor(this.y + Math.sin(this.bobPhase) * 0.6);
    const f = this.hitFlash > 0;
    const phaseColor = this.phase === 3 ? '#ff4080' : this.phase === 2 ? '#aa66ff' : '#5533aa';
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = phaseColor;
    ctx.fillRect(px - 14, py - 14, 28, 28);
    ctx.globalAlpha = 1;
    const sprite = (typeof BOSS_SPRITES !== 'undefined') ? BOSS_SPRITES.SlayerKiller : null;
    if (sprite && typeof drawSprite === 'function') {
      drawSprite(ctx, sprite, px, py, false, f, 2);
    } else {
      ctx.fillStyle = f ? '#ffffff' : '#2a1a5a'; ctx.fillRect(px - 7, py - 2, 14, 10);
      ctx.fillStyle = f ? '#ffffff' : '#3a2a7a'; ctx.fillRect(px - 7, py + 4, 14, 1);
      ctx.fillStyle = '#1a0a3a';
      ctx.fillRect(px - 5, py + 8, 3, 4); ctx.fillRect(px + 2, py + 8, 3, 4);
      ctx.fillStyle = f ? '#ffffff' : '#5533aa'; ctx.fillRect(px - 5, py - 9, 10, 7);
      ctx.fillStyle = '#aa66ff';
      ctx.fillRect(px - 6, py - 11, 2, 3); ctx.fillRect(px + 4, py - 11, 2, 3); ctx.fillRect(px - 1, py - 12, 2, 4);
    }
    // Phase-shifting eyes (always drawn over sprite)
    const eyeC = this.phase === 3 ? '#ff4080' : this.phase === 2 ? '#dd99ff' : '#aa66ff';
    ctx.fillStyle = eyeC;
    ctx.fillRect(px - 3, py - 7, 2, 2); ctx.fillRect(px + 1, py - 7, 2, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(px - 3, py - 7, 1, 1); ctx.fillRect(px + 1, py - 7, 1, 1);
    for (let i = 0; i < this.phase; i++) {
      ctx.fillStyle = eyeC;
      ctx.fillRect(px - 8 + i * 8, py + 14, 2, 2);
    }
  }
}

// ============================================================
// HELPERS: enemy death, boss death, AoE explosion
// ============================================================
function handleEnemyDeath(enemy) {
  player.kills++;
  if (enemy.elite) {
    if (enemy.hasMod('molten')) explodeAt(enemy.x, enemy.y, 48, enemy.contactDmg * 2);
    const primaryColor = enemy.eliteMods[0] ? enemy.eliteMods[0].auraColor : '#ffdd88';
    spawnBurst(enemy.x, enemy.y, [primaryColor, '#ffffff', '#ffdd88', primaryColor], 18);
    xpGems.push(new XPGem(enemy.x, enemy.y, 4));
    player.gold += rngInt(8, 18);
    goldFlashTimer = 0.8;
    let eliteDrop = generateItem();
    for (let t = 0; t < 8 && eliteDrop.rarity.id === 'white'; t++) eliteDrop = generateItem();
    itemDrops.push(new ItemDrop(enemy.x, enemy.y, eliteDrop));
    shake = Math.min(shake + 4, 8);
    Sfx.bossDie();
  } else {
    spawnBurst(enemy.x, enemy.y, ['#f0f0e0', '#e8e8d8', '#b0b0a0', '#ffffff'], 8);
    xpGems.push(new XPGem(enemy.x, enemy.y, 1));
    player.gold += rngInt(1, 3);
    goldFlashTimer = 0.8;
    if (Math.random() < 0.18) itemDrops.push(new ItemDrop(enemy.x, enemy.y, generateItem()));
    shake = Math.min(shake + 1, 3);
    Sfx.enemyDie();
  }
}
function handleBossDeath(enemy) {
  player.kills++;
  spawnBurst(enemy.x, enemy.y, ['#f0f0e0', '#e8e8d8', '#b0b0a0', '#ffffff'], 14);
  xpGems.push(new XPGem(enemy.x, enemy.y, 8));
  const goldAmt = rngInt(40, 80);
  player.gold += goldAmt;
  goldFlashTimer = 0.8;
  let it = generateItem();
  let tries = 0;
  while (it.rarity.id === 'white' && tries < 6) { it = generateItem(); tries++; }
  itemDrops.push(new ItemDrop(enemy.x, enemy.y, it));
  itemDrops.push(new ItemDrop(enemy.x + 12, enemy.y, generateItem()));
  itemDrops.push(new ItemDrop(enemy.x - 12, enemy.y, generateItem()));
  shake = Math.min(shake + 8, 12);
  Sfx.bossDie();
  bossRef = null;
  bossDefeatedBannerTimer = 2.0;
  lastBossName = enemy.name || 'BOSS';
  if (isFinalWave(currentWave)) {
    state = STATE.VICTORY;
    setTimeout(() => Sfx.victory(), 600);
  } else enterAbilityDraft();
}
function explodeAt(x, y, radius, damage) {
  for (const e of enemies) {
    if (!e.alive) continue;
    const dx = e.x - x, dy = e.y - y;
    if (dx*dx + dy*dy < radius*radius) {
      const died = e.takeDamage(damage);
      if (died) handleEnemyDeath(e);
    }
  }
  spawnBurst(x, y, ['#ff5520', '#ffaa00', '#ffdd00', '#ffffff'], 18);
  shake = Math.min(shake + 3, 6);
}
