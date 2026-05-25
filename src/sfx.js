// ============================================================
// SFX — WebAudio-based runtime sound synthesis.
//
// All sounds are generated procedurally — no asset files.
// AudioContext is created lazily on the first user gesture
// (browsers suspend AC until then), then reused for the run.
//
// Usage from game code:
//   Sfx.shoot();        Sfx.hit();          Sfx.crit();
//   Sfx.enemyDie();     Sfx.bossDie();      Sfx.bossSpawn();
//   Sfx.pickupXp();     Sfx.pickupGold();   Sfx.pickupItem();
//   Sfx.levelUp();      Sfx.playerHit();    Sfx.playerDie();
//   Sfx.abilityCast();  Sfx.shopBuy();      Sfx.salvage();
//   Sfx.uiClick();      Sfx.waveComplete(); Sfx.victory();
//
// Master controls:
//   Sfx.init();         // call after first user gesture
//   Sfx.toggleMute();   // bound to M key in main loop
//   Sfx.setMaster(v);   // 0..1
// ============================================================

const Sfx = {
  ctx: null,
  master: null,
  sfxBus: null,
  muted: false,
  masterVol: 0.55,
  sfxVol: 0.85,
  // Per-sound rate limit: don't replay the same preset within this many ms.
  // Prevents audio clipping when many projectiles or hits fire simultaneously.
  _lastPlay: {},
  _throttle(key, ms) {
    const now = performance.now();
    if ((this._lastPlay[key] || 0) + ms > now) return true; // too soon
    this._lastPlay[key] = now;
    return false;
  },

  // Lazy-init the AudioContext. Safe to call repeatedly.
  init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      this.ctx = new AC();
    } catch (e) { return; }
    this.master = this.ctx.createGain();
    this.master.gain.value = this.masterVol;
    this.master.connect(this.ctx.destination);
    this.sfxBus = this.ctx.createGain();
    this.sfxBus.gain.value = this.sfxVol;
    this.sfxBus.connect(this.master);
  },

  // Browsers suspend AudioContext until a user gesture.
  // Call this from any input handler to wake it up.
  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  toggleMute() {
    this.muted = !this.muted;
    if (this.master) this.master.gain.value = this.muted ? 0 : this.masterVol;
    return this.muted;
  },

  setMaster(v) {
    this.masterVol = Math.max(0, Math.min(1, v));
    if (this.master && !this.muted) this.master.gain.value = this.masterVol;
  },

  // ============================================================
  // Primitive synth helpers
  // ============================================================

  // Tone with ADSR-ish envelope and optional frequency sweep.
  //   type: oscillator type ('sine'|'square'|'triangle'|'sawtooth')
  //   freq: starting Hz
  //   freqEnd: optional sweep target Hz
  //   dur: total seconds
  //   vol: peak gain 0..1
  //   attack: seconds to ramp up
  //   when: seconds offset from now (for scheduling sequences)
  _tone(opts) {
    if (!this.ctx || this.muted) return;
    const o = opts || {};
    const ctx = this.ctx;
    const start = ctx.currentTime + (o.when || 0);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = o.type || 'square';
    const f0 = o.freq || 440;
    osc.frequency.setValueAtTime(f0, start);
    const dur = o.dur || 0.1;
    if (o.freqEnd !== undefined && o.freqEnd > 0) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, o.freqEnd), start + dur);
    }
    const attack = o.attack !== undefined ? o.attack : 0.005;
    const peak = o.vol !== undefined ? o.vol : 0.25;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), start + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(gain); gain.connect(this.sfxBus);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  },

  // Filtered noise burst — good for hits, explosions, salvage crunches.
  //   filterType: 'lowpass'|'bandpass'|'highpass'
  //   filterFreq: cutoff Hz
  //   filterFreqEnd: optional sweep target
  //   dur, vol, q (resonance)
  _noise(opts) {
    if (!this.ctx || this.muted) return;
    const o = opts || {};
    const ctx = this.ctx;
    const start = ctx.currentTime + (o.when || 0);
    const dur = o.dur || 0.1;
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = o.filterType || 'bandpass';
    filter.frequency.setValueAtTime(o.filterFreq || 1200, start);
    filter.Q.value = o.q !== undefined ? o.q : 1;
    if (o.filterFreqEnd !== undefined) {
      filter.frequency.exponentialRampToValueAtTime(Math.max(40, o.filterFreqEnd), start + dur);
    }
    const gain = ctx.createGain();
    const peak = o.vol !== undefined ? o.vol : 0.3;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), start + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    src.connect(filter); filter.connect(gain); gain.connect(this.sfxBus);
    src.start(start);
    src.stop(start + dur + 0.02);
  },

  // ============================================================
  // Presets — call these from gameplay code
  // ============================================================

  shoot() {
    // Throttle: rapid fire or volleys spawn dozens per frame. One every 35ms is enough.
    if (this._throttle('shoot', 35)) return;
    this._tone({ type: 'square', freq: 880, freqEnd: 360, dur: 0.05, vol: 0.10, attack: 0.002 });
  },

  hit() {
    // Soft thud — keep low-volume since this fires constantly
    if (this._throttle('hit', 30)) return;
    this._noise({ filterType: 'bandpass', filterFreq: 700, filterFreqEnd: 300, dur: 0.05, vol: 0.12, q: 2 });
  },

  crit() {
    if (this._throttle('crit', 60)) return;
    this._tone({ type: 'sawtooth', freq: 240, freqEnd: 70, dur: 0.18, vol: 0.32, attack: 0.003 });
    this._noise({ filterType: 'bandpass', filterFreq: 1800, filterFreqEnd: 600, dur: 0.10, vol: 0.22, q: 1.5 });
  },

  enemyDie() {
    // Cap multi-kill cluster sounds
    if (this._throttle('enemyDie', 50)) return;
    this._noise({ filterType: 'lowpass', filterFreq: 500, filterFreqEnd: 120, dur: 0.20, vol: 0.20 });
    this._tone({ type: 'square', freq: 180, freqEnd: 80, dur: 0.15, vol: 0.10 });
  },

  bossSpawn() {
    this._tone({ type: 'sawtooth', freq: 55, freqEnd: 90, dur: 0.9, vol: 0.45, attack: 0.05 });
    this._tone({ type: 'sawtooth', freq: 110, freqEnd: 80, dur: 0.9, vol: 0.30, attack: 0.05 });
  },

  bossDie() {
    // Big descending boom
    this._noise({ filterType: 'lowpass', filterFreq: 1500, filterFreqEnd: 80, dur: 0.7, vol: 0.40 });
    this._tone({ type: 'sawtooth', freq: 180, freqEnd: 35, dur: 0.7, vol: 0.42 });
    this._tone({ type: 'square', freq: 90, freqEnd: 30, dur: 0.7, vol: 0.30, when: 0.05 });
  },

  pickupXp() {
    if (this._throttle('pickupXp', 40)) return;
    this._tone({ type: 'triangle', freq: 1100, freqEnd: 1700, dur: 0.07, vol: 0.16 });
  },

  pickupGold() {
    if (this._throttle('pickupGold', 40)) return;
    this._tone({ type: 'triangle', freq: 980, dur: 0.05, vol: 0.18 });
    this._tone({ type: 'triangle', freq: 1480, dur: 0.07, vol: 0.18, when: 0.04 });
  },

  pickupItem() {
    // Diablo-ish item drop chime — two-note rising arpeggio
    this._tone({ type: 'triangle', freq: 660, dur: 0.12, vol: 0.22 });
    this._tone({ type: 'triangle', freq: 990, dur: 0.14, vol: 0.22, when: 0.07 });
    this._tone({ type: 'triangle', freq: 1320, dur: 0.16, vol: 0.20, when: 0.14 });
  },

  levelUp() {
    // C-E-G-C major arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((f, i) => this._tone({ type: 'square', freq: f, dur: 0.18, vol: 0.22, when: i * 0.07 }));
  },

  playerHit() {
    this._tone({ type: 'sawtooth', freq: 240, freqEnd: 90, dur: 0.20, vol: 0.40, attack: 0.005 });
    this._noise({ filterType: 'lowpass', filterFreq: 600, dur: 0.15, vol: 0.30 });
  },

  playerDie() {
    // Descending dirge
    [440, 349, 277, 220, 165].forEach((f, i) =>
      this._tone({ type: 'sawtooth', freq: f, dur: 0.30, vol: 0.38, when: i * 0.18 })
    );
  },

  abilityCast() {
    this._tone({ type: 'sine', freq: 220, freqEnd: 880, dur: 0.18, vol: 0.22, attack: 0.01 });
    this._noise({ filterType: 'bandpass', filterFreq: 2000, dur: 0.08, vol: 0.10, q: 3 });
  },

  shopBuy() {
    this._tone({ type: 'triangle', freq: 1200, dur: 0.06, vol: 0.18 });
    this._tone({ type: 'triangle', freq: 1600, dur: 0.06, vol: 0.18, when: 0.05 });
  },

  shopSell() {
    // Salvage / sell — throttled so bulk-salvage plays one crunch, not 20
    if (this._throttle('shopSell', 60)) return;
    this._noise({ filterType: 'highpass', filterFreq: 2500, dur: 0.08, vol: 0.15 });
    this._tone({ type: 'triangle', freq: 600, freqEnd: 300, dur: 0.10, vol: 0.18 });
  },

  uiClick() {
    this._tone({ type: 'square', freq: 720, dur: 0.025, vol: 0.08 });
  },

  uiSelect() {
    this._tone({ type: 'square', freq: 540, dur: 0.04, vol: 0.10 });
    this._tone({ type: 'square', freq: 720, dur: 0.04, vol: 0.10, when: 0.03 });
  },

  waveComplete() {
    [659.25, 783.99, 987.77, 1318.51].forEach((f, i) =>
      this._tone({ type: 'square', freq: f, dur: 0.16, vol: 0.24, when: i * 0.09 })
    );
  },

  victory() {
    // Bigger triumphant flourish
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    notes.forEach((f, i) =>
      this._tone({ type: 'square', freq: f, dur: 0.22, vol: 0.28, when: i * 0.10 })
    );
    notes.forEach((f, i) =>
      this._tone({ type: 'triangle', freq: f * 2, dur: 0.22, vol: 0.16, when: i * 0.10 })
    );
  },

  // Brief affirmative tone for things like ability draft pick, class select.
  uiConfirm() {
    this._tone({ type: 'triangle', freq: 800, dur: 0.06, vol: 0.18 });
    this._tone({ type: 'triangle', freq: 1200, dur: 0.10, vol: 0.18, when: 0.05 });
  },

  // Legendary / Unique drop — dramatic rising shimmer + bass thud
  rareDrop() {
    this._tone({ type: 'sine',     freq: 80,   freqEnd: 40,   dur: 0.35, vol: 0.55, attack: 0.005 });
    this._tone({ type: 'triangle', freq: 440,  freqEnd: 880,  dur: 0.30, vol: 0.28, when: 0.05, attack: 0.02 });
    this._tone({ type: 'triangle', freq: 554,  freqEnd: 1108, dur: 0.28, vol: 0.22, when: 0.08, attack: 0.02 });
    this._tone({ type: 'triangle', freq: 659,  freqEnd: 1318, dur: 0.26, vol: 0.18, when: 0.11, attack: 0.02 });
    this._tone({ type: 'sine',     freq: 2200, freqEnd: 3200, dur: 0.18, vol: 0.12, when: 0.22 });
    this._noise({ filterType: 'bandpass', filterFreq: 3000, dur: 0.10, vol: 0.06, when: 0.22, q: 4 });
  },

  // Set item drop — ethereal harmonic bloom, distinct from legendary
  setDrop() {
    this._tone({ type: 'sine',     freq: 110, freqEnd: 55,  dur: 0.40, vol: 0.40, attack: 0.01 });
    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) =>
      this._tone({ type: 'triangle', freq: f, freqEnd: f * 1.5, dur: 0.22, vol: 0.20, when: 0.04 + i * 0.06, attack: 0.015 })
    );
    this._tone({ type: 'sine', freq: 1800, freqEnd: 2800, dur: 0.22, vol: 0.10, when: 0.28 });
  },
};
