/* Metin-Stein – Darstellung, Chat-Anbindung, Panel. */
(function () {
  const C = window.CFG;
  const $ = id => document.getElementById(id);

  const T = {
    de: {
      title: 'Metin-Stein',
      hint: 'Schreibe <b>{cmd}</b> in den Chat – wer den letzten Schlag setzt, gewinnt!',
      hp: 'Stein-HP',
      won: 'Stein zerstört',
      wonSub: 'hat den letzten Schlag gesetzt',
      top: 'Meiste Schläge',
      panel: 'Steuerung', hit: 'Manueller Treffer', fresh: 'Neuer Stein', hpLabel: 'HP (neuer Stein)',
      simOn: 'Chat-Simulation: AN', simOff: 'Chat-Simulation: AUS',
      keys: 'Tasten: P Panel · H Treffer · N Neuer Stein · R Regeln · C Zyklus neu · T Simulation',
      crit: 'KRIT!', noid: 'Chatroom-ID fehlt', connecting: 'verbinde …', ok: 'verbunden', error: 'Fehler', off: 'aus',
      idle: 'Das Giveaway startet gleich …', dropWord: 'GEWONNEN', noDrop: 'Kein Gutschein bei diesem Stein',  dropsDone: 'vergeben', ruleDrop: 'Jeder Stein kann einen <b>{label}</b> droppen – in jedem Zeitfenster fällt garantiert einer.', planLbl: 'Drop-Plan', hits: 'Schläge', round: 'Runde', lastChat: 'Letzter Chat', kickId: 'Kick-Chatroom-ID', connect: 'Verbinden', none: '–',
      rulesBtn: 'Regeln anzeigen', rulesTitle: 'Regeln', cycleBtn: 'Zyklus neu starten', endWord: 'Ende', winWord: 'Fenster', stoneWord: 'Stein', normalWord: 'normal', modCmd: 'Mod-Befehl',
      rules: [
        'Schreibe <b>{cmd}</b> – jeder Treffer zieht dem Stein Lebenspunkte ab.',
        'Pro Person ein Treffer alle <b>{cd} Sekunden</b>.',
        'Subs, VIPs und Mods landen öfter <b>kritische Treffer</b> (x{crit} Schaden).',
        'Wer den <b>letzten Schlag</b> setzt, gewinnt.'
      ]
    },
    en: {
      title: 'Metin Stone',
      hint: 'Type <b>{cmd}</b> in chat – land the final hit to win!',
      hp: 'Stone HP',
      won: 'Stone destroyed',
      wonSub: 'landed the final hit',
      top: 'Most hits',
      panel: 'Control', hit: 'Manual hit', fresh: 'New stone', hpLabel: 'HP (new stone)',
      simOn: 'Chat simulation: ON', simOff: 'Chat simulation: OFF',
      keys: 'Keys: P panel · H hit · N new stone · R rules · C restart cycle · T simulation',
      crit: 'CRIT!', noid: 'Chatroom ID missing', connecting: 'connecting …', ok: 'connected', error: 'error', off: 'off',
      idle: 'The giveaway starts soon …', dropWord: 'WON', noDrop: 'No voucher on this stone',  dropsDone: 'awarded', ruleDrop: 'Every stone can drop a <b>{label}</b> – one drop is guaranteed in every time window.', planLbl: 'Drop plan', hits: 'hits', round: 'Round', lastChat: 'Last chat', kickId: 'Kick chatroom ID', connect: 'Connect', none: '–',
      rulesBtn: 'Show rules', rulesTitle: 'Rules', cycleBtn: 'Restart cycle', endWord: 'End', winWord: 'Window', stoneWord: 'Stone', normalWord: 'normal', modCmd: 'Mod command',
      rules: [
        'Type <b>{cmd}</b> – every hit takes HP off the stone.',
        'One hit per person every <b>{cd} seconds</b>.',
        'Subs, VIPs and mods land <b>critical hits</b> more often (x{crit} damage).',
        'Whoever lands the <b>final hit</b> wins.'
      ]
    }
  };
  const L = T[C.lang] || T.de;

  // ---------- Grundaufbau ----------
  if (C.flags.bg) document.body.classList.add('bg');
  document.documentElement.lang = C.lang;
  const img = $('stone-img');
  img.src = window.STONE_DATA || 'img/stone.png';
  document.documentElement.style.setProperty('--stone', 'url(' + (window.STONE_DATA || 'img/stone.png') + ')');
  $('t-title').textContent = L.title;
  const setHint = idle => { $('t-hint').innerHTML = idle ? L.idle : L.hint.replace('{cmd}', C.command); };
  setHint(false);
  $('hp-label').textContent = L.hp;
  $('p-title').textContent = L.panel;
  $('p-hit').textContent = L.hit;
  $('p-new').textContent = L.fresh;
  $('p-rules').textContent = L.rulesBtn;
  $('p-hp-label').textContent = L.hpLabel;
  $('p-hp').value = C.stoneHp;
  $('p-keys').textContent = L.keys;
  $('r-title').textContent = L.rulesTitle;
  if (C.flags.panel) $('panel').classList.remove('hidden');

  const stone = $('stone');
  const game = MetinGame.createGame(C);
  const plan = MetinGame.createDropPlan(C);
  let dropStone = false;
  const savePlan = () => { try { localStorage.setItem('metin_plan', JSON.stringify(plan.save())); } catch (e) {} };
  try {
    const o = JSON.parse(localStorage.getItem('metin_plan') || 'null');
    if (o && o.active && Date.now() - o.startedAt < (o.minutes + 60) * 60000) plan.load(o);
  } catch (e) {}
  if (C.drops > 0 && !plan.active) { plan.start(C.drops, C.streamMinutes); savePlan(); }

  function renderPlan() {
    const st = plan.status();
    const d = $('drops');
    if (!st) { d.classList.add('hidden'); $('p-plan').textContent = L.planLbl + ': –'; return; }
    d.classList.remove('hidden');
    d.textContent = st.used + ' / ' + st.drops + ' × ' + C.dropLabel + ' ' + L.dropsDone;
    const m = Math.floor(st.nextWindowInMs / 60000), s = Math.floor(st.nextWindowInMs / 1000) % 60;
    $('p-plan').textContent = L.planLbl + ': ' + st.used + '/' + st.drops + ' · ' + (st.over ? L.endWord : L.winWord + ' ' + st.window + '/' + st.drops + ' (' + m + ':' + String(s).padStart(2, '0') + ')') +
      ' · ' + L.stoneWord + ': ' + (dropStone ? 'DROP' : L.normalWord);
  }
  setInterval(renderPlan, 1000);

  // ---------- Sound (optional) ----------
  function play(src) {
    if (!src) return;
    try { const a = new Audio(src); a.volume = 0.8; a.play().catch(() => {}); } catch (e) {}
  }

  // ---------- Effekte ----------
  const fx = $('fx'), ctx = fx.getContext('2d');
  let shards = [], chunks = [], raf = 0;
  function resize() { fx.width = innerWidth; fx.height = innerHeight; }
  addEventListener('resize', resize); resize();

  let alphaCtx = null;
  function alphaAt(nx, ny) {
    try {
      if (!alphaCtx) {
        const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
        alphaCtx = c.getContext('2d'); alphaCtx.drawImage(img, 0, 0);
      }
      return alphaCtx.getImageData(Math.min(img.naturalWidth - 1, Math.floor(nx * img.naturalWidth)),
        Math.min(img.naturalHeight - 1, Math.floor(ny * img.naturalHeight)), 1, 1).data[3];
    } catch (e) { return 255; }
  }

  function spawnChunks() {
    const r = img.getBoundingClientRect();
    if (!r.width || !img.naturalWidth) return;
    const cols = 6, rows = 7, cw = r.width / cols, rh = r.height / rows;
    const pts = [];
    for (let y = 0; y <= rows; y++) { pts.push([]); for (let x = 0; x <= cols; x++) {
      const edge = x === 0 || y === 0 || x === cols || y === rows;
      pts[y].push([r.left + x * cw + (edge ? 0 : (Math.random() - .5) * cw * .7), r.top + y * rh + (edge ? 0 : (Math.random() - .5) * rh * .7)]);
    } }
    const cx0 = r.left + r.width / 2, cy0 = r.top + r.height * 0.55;
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const a = pts[y][x], b = pts[y][x + 1], c = pts[y + 1][x + 1], d = pts[y + 1][x];
      const flip = Math.random() < .5;
      (flip ? [[a, b, c], [a, c, d]] : [[a, b, d], [b, c, d]]).forEach(tri => {
        const gx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3, gy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3;
        if (alphaAt((gx - r.left) / r.width, (gy - r.top) / r.height) < 60) return;
        const dx = gx - cx0, dy = gy - cy0, len = Math.hypot(dx, dy) || 1, sp = 1.5 + Math.random() * 4;
        chunks.push({
          gx, gy, rel: tri.map(v => [v[0] - gx, v[1] - gy]), x: gx, y: gy, r,
          vx: dx / len * sp + (Math.random() - .5) * 3, vy: dy / len * sp - 2 - Math.random() * 3,
          rot: 0, vr: (Math.random() - .5) * .35, life: 1
        });
      });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function spawnShards() {
    spawnChunks();
    const r = stone.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height * 0.55;
    const cols = ['#1c2252', '#2c3f8f', '#5a6fc4', '#8fa0e0', '#e7c9d6', '#3a2f6b'];
    for (let i = 0; i < 26; i++) {
      const a = Math.random() * Math.PI * 2, sp = 3 + Math.random() * 11;
      shards.push({
        x: cx + (Math.random() - .5) * r.width * .5, y: cy + (Math.random() - .5) * r.height * .5,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 5, rot: Math.random() * 6, vr: (Math.random() - .5) * .5,
        s: 6 + Math.random() * 20, c: cols[(Math.random() * cols.length) | 0], life: 1
      });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick() {
    ctx.clearRect(0, 0, fx.width, fx.height);
    shards = shards.filter(p => p.life > 0 && p.y < fx.height + 60);
    shards.forEach(p => {
      p.vy += 0.45; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= 0.011;
      ctx.save(); ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.6));
      ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.moveTo(-p.s / 2, p.s / 3); ctx.lineTo(p.s / 2, 0); ctx.lineTo(-p.s / 4, -p.s / 2); ctx.closePath(); ctx.fill();
      ctx.restore();
    });
    chunks = chunks.filter(c => c.life > 0 && c.y < fx.height + 200);
    chunks.forEach(c => {
      c.vy += 0.38; c.x += c.vx; c.y += c.vy; c.rot += c.vr; c.life -= 0.009;
      ctx.save(); ctx.globalAlpha = Math.max(0, Math.min(1, c.life * 1.8));
      ctx.translate(c.x, c.y); ctx.rotate(c.rot);
      ctx.beginPath(); ctx.moveTo(c.rel[0][0], c.rel[0][1]); ctx.lineTo(c.rel[1][0], c.rel[1][1]); ctx.lineTo(c.rel[2][0], c.rel[2][1]); ctx.closePath();
      ctx.clip(); ctx.drawImage(img, c.r.left - c.gx, c.r.top - c.gy, c.r.width, c.r.height);
      ctx.restore();
    });
    raf = (shards.length || chunks.length) ? requestAnimationFrame(tick) : 0;
    if (!raf) ctx.clearRect(0, 0, fx.width, fx.height);
  }

  function restartClass(el, cls, ms) {
    el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), ms);
  }

  function setHp(hp, maxHp) {
    const ratio = maxHp ? hp / maxHp : 0;
    $('hp-fill').style.width = (ratio * 100).toFixed(1) + '%';
    $('hp-fill').classList.toggle('low', ratio <= 0.25);
    $('hp-num').textContent = hp + ' / ' + maxHp;
    stone.dataset.stage = ratio > 0.66 ? 0 : ratio > 0.33 ? 1 : ratio > 0.12 ? 2 : 3;
  }

  function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  // ---------- Spielereignisse ----------
  let round = 0;
  game.on('spawn', d => {
    round++;
    dropStone = plan.onSpawn(Date.now()); savePlan(); renderPlan();
    document.body.classList.remove('idle'); setHint(false);
    $('hp-label').textContent = L.hp + (round > 1 ? ' · ' + L.round + ' ' + round : '');
    stone.classList.remove('destroyed', 'hit', 'crit');
    $('banner').classList.add('hidden');
    $('feed').innerHTML = '';
    setHp(d.hp, d.maxHp);
    restartClass(stone, 'spawn', 800);
  });

  game.on('hit', d => {
    setHp(d.hp, d.maxHp);
    if (d.hp > 0) restartClass(stone, d.crit ? 'crit' : 'hit', d.crit ? 360 : 240);
    play(C.soundHit);

    const f = document.createElement('div');
    f.className = 'float' + (d.crit ? ' crit' : '');
    f.style.setProperty('--dx', (-50 + (Math.random() * 60 - 30)) + '%');
    f.innerHTML = (d.crit ? L.crit + ' ' : '') + '-' + d.dmg + '<small>' + esc(d.user.name) + '</small>';
    $('floats').appendChild(f);
    setTimeout(() => f.remove(), 1400);

    const li = document.createElement('li');
    if (d.crit) li.className = 'crit';
    li.innerHTML = '<span>' + esc(d.user.name) + '<span class="plat">' + esc(d.user.platform) + '</span></span><span>' +
      (d.crit ? L.crit + ' ' : '') + '-' + d.dmg + '</span>';
    const feed = $('feed');
    feed.appendChild(li);
    while (feed.children.length > 5) feed.removeChild(feed.firstChild);
  });

  let nextTimer = 0;
  game.on('destroy', d => {
    const dropped = plan.onDestroy(); dropStone = false; savePlan(); renderPlan();
    play(C.soundDestroy);
    stone.classList.remove('hit', 'crit', 'spawn');
    stone.classList.add('destroyed');
    restartClass($('flash'), 'go', 520);
    spawnShards();
    setTimeout(() => {
      $('b-small').textContent = L.won;
      $('b-name').textContent = d.winner.name;
      $('b-sub').textContent = L.wonSub + ' · ' + d.hits + ' ' + L.hits;
      $('b-top').innerHTML = '<li style="justify-content:center;color:#d4a64a;letter-spacing:.2em;text-transform:uppercase;font-size:.85em"><span>' + L.top + '</span></li>' +
        d.top.map(t => '<li><span>' + esc(t.name) + '</span><span>' + t.dmg + '</span></li>').join('');
      const bd = $('b-drop'); bd.classList.toggle('hidden', !plan.active);
      bd.classList.toggle('none', !dropped);
      bd.textContent = dropped ? '★ ' + L.dropWord + ': ' + C.dropLabel + ' ★' : L.noDrop;
      $('banner').classList.toggle('drop', dropped);
      const b = $('banner'); b.classList.remove('hidden');
      b.style.animation = 'none'; void b.offsetWidth; b.style.animation = '';
    }, 650);
    clearTimeout(nextTimer);
    if (C.autoNewStone) nextTimer = setTimeout(() => game.newStone(currentHp()), (C.winnerShowSec + 0.65) * 1000);
  });

  let defaultHp = 0;
  game.on('stop', () => {
    clearTimeout(nextTimer);
    stone.classList.remove('hit', 'crit', 'spawn', 'destroyed');
    $('banner').classList.add('hidden');
    document.body.classList.add('idle'); setHint(true);
  });

  function currentHp() { if (defaultHp > 0) return defaultHp; const v = parseInt($('p-hp').value, 10); return v > 0 ? v : C.stoneHp; }

  // ---------- Chat ----------
  const status = {};
  function renderStatus() {
    const names = { kick: 'Kick', twitch: 'Twitch' };
    $('p-status').innerHTML = Object.keys(names).map(k => {
      const s = status[k] || 'off';
      return names[k] + ' <span class="chip ' + s + '">' + (L[s] || s) + '</span>';
    }).join(' &nbsp; ');
  }
  function onStatus(p, s) { status[p] = s; renderStatus(); if (console && console.log) console.log('[chat]', p, s); }
  renderStatus();

  // ---------- Regeln ----------
  let rulesTimer = 0, rulesLast = 0;
  function showRules(force) {
    const now = Date.now();
    if (!force && now - rulesLast < C.rulesCooldownSec * 1000) return;
    rulesLast = now;
    const extra = plan.active ? [L.ruleDrop.replace('{label}', esc(C.dropLabel))] : [];
    $('r-list').innerHTML = L.rules.concat(extra).map(t => '<li>' + t.replace('{cmd}', esc(C.command)).replace('{cd}', C.cooldownSec).replace('{crit}', C.critMultiplier) + '</li>').join('');
    const r = $('rules'); r.classList.remove('hidden');
    r.style.animation = 'none'; void r.offsetWidth; r.style.animation = '';
    clearTimeout(rulesTimer);
    rulesTimer = setTimeout(() => r.classList.add('hidden'), C.rulesShowSec * 1000);
  }

  function isOwner(msg) {
    const n = String(msg.name).toLowerCase();
    return (msg.platform === 'kick' && n === String(C.kickChannel).toLowerCase()) ||
           (msg.platform === 'twitch' && n === String(C.twitchChannel).toLowerCase());
  }

  // Zyklus (z. B. 3 Gutscheine in 90 Min.) von vorne starten
  let lastCycle = { drops: C.drops, minutes: C.streamMinutes };
  function restartCycle(drops, mins) {
    const st = plan.active ? { drops: plan.drops, minutes: plan.minutes } : lastCycle;
    const d = drops > 0 ? drops : st.drops, m = mins > 0 ? mins : st.minutes;
    if (!(d > 0 && m > 0)) return false;
    lastCycle = { drops: d, minutes: m };
    plan.start(d, m); savePlan(); renderPlan();
    if (game.active) { clearTimeout(nextTimer); game.newStone(currentHp()); }
    return true;
  }
  $('p-cycle').textContent = L.cycleBtn;
  $('p-cycle').onclick = () => restartCycle();

  function modCommand(msg) {
    const parts = msg.text.trim().toLowerCase().split(/\s+/);
    if (parts[1] === 'cycle' || parts[1] === 'restart') {
      if (!restartCycle(parseInt(parts[2], 10) || 0, parseInt(parts[3], 10) || 0)) return;
      $('p-last').textContent = L.modCmd + ': ' + msg.name + ' · ' + parts.slice(0, 4).join(' ');
      return;
    }
    const sub = parts[1] || '', num = parseInt(parts[2], 10);
    if (sub === 'stop') game.stop();
    else if (sub === 'reset') { if (game.active) { clearTimeout(nextTimer); game.newStone(currentHp()); } else return; }
    else if (sub === 'cleardrops') { plan.clear(); savePlan(); renderPlan(); }
    else if (sub === 'hp' && num > 0) { defaultHp = num; $('p-hp').value = num; }
    else return;
    $('p-last').textContent = L.modCmd + ': ' + msg.name + ' · ' + parts.slice(0, 3).join(' ');
  }

  function spawnCommand(msg) {
    const t = msg.text.toLowerCase();
    const get = re => { const m = t.match(re); return m ? parseInt(m[1], 10) : 0; };
    let n = get(/hp\s*(\d+)/);
    if (!n) { const m = t.replace(C.spawnCommand.toLowerCase(), '').match(/^\s*(\d+)\s*$/); n = m ? parseInt(m[1], 10) : 0; }
    const drops = get(/drops?\s*(\d+)/);
    const mins = get(/(?:time|zeit|min)\s*(\d+)/);
    if (n > 0) { defaultHp = n; $('p-hp').value = n; }
    if (drops > 0) { plan.start(drops, mins > 0 ? mins : C.streamMinutes); lastCycle = { drops, minutes: mins > 0 ? mins : C.streamMinutes }; savePlan(); }
    clearTimeout(nextTimer);
    game.start(currentHp());
    $('p-last').textContent = L.modCmd + ': ' + msg.name + ' · ' + msg.text.trim().slice(0, 30);
  }

  function onChat(msg) {
    $('p-last').textContent = L.lastChat + ': [' + msg.platform + '] ' + msg.name + ': ' + String(msg.text).slice(0, 40);
    if (MetinGame.isCommand(msg.text, C.spawnCommand)) { if (msg.mod || isOwner(msg)) spawnCommand(msg); return; }
    if (MetinGame.isCommand(msg.text, C.giveawayCommand)) { if (msg.mod || isOwner(msg)) modCommand(msg); return; }
    if (MetinGame.isCommand(msg.text, C.rulesCommand)) { showRules(false); return; }
    if (!MetinGame.isCommand(msg.text, C.command)) return;
    game.hit({ name: msg.name, platform: msg.platform, id: msg.id, supporter: msg.supporter });
  }
  if (C.twitchChannel) ChatTwitch.connectTwitch(C.twitchChannel, onChat, onStatus);
  let kickHandle = null;
  function startKick(roomId) {
    if (kickHandle) kickHandle.close();
    const cfg = Object.assign({}, C, roomId ? { kickChatroomId: roomId } : {});
    if (cfg.kickChannel || cfg.kickChatroomId) kickHandle = ChatKick.connectKick(cfg, onChat, onStatus);
  }
  let savedRoom = '';
  try { savedRoom = localStorage.getItem('metin_kick_room') || ''; } catch (e) {}
  if (!C.kickChatroomId && savedRoom) $('p-room').value = savedRoom;
  startKick(C.kickChatroomId || savedRoom);
  $('p-room').placeholder = L.kickId;
  $('p-connect').textContent = L.connect;
  $('p-connect').onclick = () => {
    const v = $('p-room').value.trim();
    try { localStorage.setItem('metin_kick_room', v); } catch (e) {}
    startKick(v);
  };
  $('p-last').textContent = L.lastChat + ': ' + L.none;

  // ---------- Manuell & Simulation ----------
  function manualHit() { game.hit({ name: C.streamerName, platform: 'manual', id: 'manual' }, { ignoreCooldown: true }); }
  function newStone() { clearTimeout(nextTimer); game.start(currentHp()); }

  const FAKE = ['Aria', 'Brogan', 'Cassia', 'DarkMage', 'EisWolf', 'Fenrir', 'Grimmo', 'Hexer', 'IronFist', 'Jade', 'Kaelen', 'Lunaris',
    'Morgaine', 'NightBlade', 'Orkan', 'Pyra', 'Quill', 'Rhogar', 'Sylva', 'Thorn', 'Umbra', 'Valka', 'Wraith', 'Xandor', 'Ylva', 'Zephyr'];
  let sim = 0;
  function toggleSim() {
    if (sim) { clearTimeout(sim); sim = 0; } else {
      const loop = () => {
        const n = FAKE[(Math.random() * FAKE.length) | 0];
        game.hit({ name: n, platform: 'test', id: n, supporter: Math.random() < 0.25 });
        sim = setTimeout(loop, 250 + Math.random() * 900);
      };
      loop();
    }
    $('p-sim').textContent = sim ? L.simOn : L.simOff;
    $('p-sim').classList.toggle('on', !!sim);
  }
  $('p-sim').textContent = L.simOff;
  $('p-hit').onclick = manualHit;
  $('p-new').onclick = newStone;
  $('p-hp').oninput = () => { defaultHp = 0; };
  $('p-rules').onclick = () => showRules(true);
  $('p-sim').onclick = toggleSim;

  addEventListener('keydown', e => {
    if (e.target && e.target.tagName === 'INPUT') return;
    const k = e.key.toLowerCase();
    if (k === 'p') $('panel').classList.toggle('hidden');
    else if (k === 'h') manualHit();
    else if (k === 'n') newStone();
    else if (k === 'r') showRules(true);
    else if (k === 'c') restartCycle();
    else if (k === 't') toggleSim();
  });

  window.__metin = { game, onChat, plan };
  if (C.autoStart) game.start(C.stoneHp); else game.stop();
  if (C.flags.test) toggleSim();
})();
