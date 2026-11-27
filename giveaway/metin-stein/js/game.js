/* Spiellogik ohne Darstellung (testbar). */
(function (root) {
  function isCommand(text, cmd) {
    const t = String(text || '').trim().toLowerCase();
    const c = String(cmd || '').toLowerCase();
    return t === c || t.startsWith(c + ' ');
  }

  function createGame(cfg, rnd) {
    rnd = rnd || Math.random;
    const listeners = {};
    const g = {
      hp: 0, maxHp: 0, destroyed: false, winner: null, active: cfg.autoStart !== false,
      cooldowns: new Map(), damageBy: new Map(), hits: 0
    };
    const emit = (ev, data) => (listeners[ev] || []).forEach(fn => fn(data));
    g.on = (ev, fn) => { (listeners[ev] = listeners[ev] || []).push(fn); };

    g.newStone = function (hp) {
      g.maxHp = Math.max(1, Math.floor(hp || cfg.stoneHp));
      g.hp = g.maxHp;
      g.destroyed = false;
      g.winner = null;
      g.hits = 0;
      g.cooldowns.clear();
      g.damageBy.clear();
      emit('spawn', { hp: g.hp, maxHp: g.maxHp });
    };

    g.start = function (hp) { g.active = true; g.newStone(hp); };
    g.stop = function () { g.active = false; g.destroyed = false; emit('stop', {}); };

    g.top = function (n) {
      return [...g.damageBy.values()].sort((a, b) => b.dmg - a.dmg).slice(0, n || 3);
    };

    // user: { name, platform, id?, supporter? }
    g.hit = function (user, opts) {
      opts = opts || {};
      if (!g.active) return { ok: false, reason: 'idle' };
      if (g.destroyed) return { ok: false, reason: 'destroyed' };
      const key = user.platform + ':' + (user.id || String(user.name).toLowerCase());
      const now = opts.now !== undefined ? opts.now : Date.now();
      if (!opts.ignoreCooldown) {
        const last = g.cooldowns.get(key);
        if (last !== undefined && now - last < cfg.cooldownSec * 1000) {
          return { ok: false, reason: 'cooldown', remainingMs: cfg.cooldownSec * 1000 - (now - last) };
        }
      }
      g.cooldowns.set(key, now);
      const chance = user.supporter ? cfg.critChanceSupporter : cfg.critChanceViewer;
      const crit = rnd() < chance;
      const dmg = cfg.damage * (crit ? cfg.critMultiplier : 1);
      g.hp = Math.max(0, g.hp - dmg);
      g.hits++;
      const rec = g.damageBy.get(key) || { name: user.name, platform: user.platform, dmg: 0 };
      rec.dmg += dmg;
      g.damageBy.set(key, rec);
      emit('hit', { user, dmg, crit, hp: g.hp, maxHp: g.maxHp });
      if (g.hp <= 0) {
        g.destroyed = true;
        g.winner = user;
        emit('destroy', { winner: user, top: g.top(3), hits: g.hits });
      }
      return { ok: true, dmg, crit, hp: g.hp };
    };
    return g;
  }

  /* Drop-Plan: N Gutscheine ueber M Minuten, pro Zeitfenster ist genau ein Drop garantiert.
     Im Fenster (Laenge = M / N) kann der Drop bis kurz vor Ende zufaellig fallen (Chance pro Stein);
     ist bis dahin keiner gefallen, droppt der naechste Stein zu 100 %. Verpasste Fenster werden nachgeholt. */
  function createDropPlan(cfg, rnd) {
    rnd = rnd || Math.random;
    const p = { active: false, drops: 0, minutes: 0, startedAt: 0, used: 0, done: [], pending: false };

    p.start = function (drops, minutes, now) {
      now = now !== undefined ? now : Date.now();
      p.active = drops > 0 && minutes > 0;
      p.drops = p.active ? Math.floor(drops) : 0;
      p.minutes = p.active ? minutes : 0;
      p.startedAt = now; p.used = 0; p.pending = false;
      p.done = new Array(p.drops).fill(false);
    };
    p.clear = function () { p.active = false; p.drops = 0; p.minutes = 0; p.used = 0; p.done = []; p.pending = false; };

    p.windowMs = () => (p.minutes * 60000) / p.drops;
    p.thresholdMs = function () {
      const w = p.windowMs(), buf = (cfg.dropGuaranteeBufferMin !== undefined ? cfg.dropGuaranteeBufferMin : 5) * 60000;
      return Math.max(w * 0.5, w - buf);
    };
    p.windowIndex = function (now) { return Math.floor((now - p.startedAt) / p.windowMs()); };

    // Wird bei jedem neuen Stein aufgerufen. true = dieser Stein ist ein Drop-Stein.
    p.onSpawn = function (now) {
      now = now !== undefined ? now : Date.now();
      if (!p.active) return false;
      if (p.pending) return true;
      const idx = Math.min(p.windowIndex(now), p.drops);
      // Nachholen: ein frueheres Fenster ohne Drop
      for (let i = 0; i < Math.min(idx, p.drops); i++) {
        if (!p.done[i]) { p.done[i] = true; p.pending = true; return true; }
      }
      if (idx >= p.drops || p.done[idx]) return false;
      const elapsed = (now - p.startedAt) - idx * p.windowMs();
      const drop = elapsed >= p.thresholdMs() || rnd() < (cfg.dropChance !== undefined ? cfg.dropChance : 0.2);
      if (drop) { p.done[idx] = true; p.pending = true; }
      return drop;
    };

    // Wird bei Zerstoerung aufgerufen. true = der Gewinner bekommt einen Gutschein.
    p.onDestroy = function () {
      if (!p.pending) return false;
      p.pending = false; p.used++;
      return true;
    };

    p.status = function (now) {
      now = now !== undefined ? now : Date.now();
      if (!p.active) return null;
      const idx = p.windowIndex(now);
      const w = p.windowMs();
      return { drops: p.drops, used: p.used, pending: p.pending, window: Math.min(idx + 1, p.drops), over: idx >= p.drops,
               nextWindowInMs: Math.max(0, (Math.min(idx + 1, p.drops)) * w - (now - p.startedAt)) };
    };
    p.save = () => ({ active: p.active, drops: p.drops, minutes: p.minutes, startedAt: p.startedAt, used: p.used, done: p.done, pending: p.pending });
    p.load = function (o) { Object.assign(p, { active: !!o.active, drops: o.drops | 0, minutes: +o.minutes || 0, startedAt: +o.startedAt || 0, used: o.used | 0, done: o.done || [], pending: !!o.pending }); };
    return p;
  }

  const api = { createGame, isCommand, createDropPlan };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MetinGame = api;
})(typeof window !== 'undefined' ? window : globalThis);
