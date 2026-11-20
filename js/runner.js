/* =====================================================================
   EASTER EGG  –  „Shadow Run“: Endlos-Runner mit dem Creator-Charakter
   ---------------------------------------------------------------------
   Öffnen: im Footer 5× schnell auf „xZcRiTiCaLZz“ tippen,
           am PC „society“ tippen, oder Link …/#runner
   Rangliste: Top 10 auf diesem Gerät (localStorage).
              Weltweite Rangliste kommt mit Supabase (Phase 2).
   ===================================================================== */

const RUNNER_SPRITE = "assets/creator.png";
const RUNNER_KEY = "o2h.runnerTop";
const RUNNER_NAME_KEY = "o2h.runnerName";

const Runner = (() => {
  const W = 760, H = 300, GROUND = 252;
  let cv, ctx, raf = 0, last = 0, state = "idle"; // idle | run | over
  let sprite = null, glow = null;
  let p, obs, parts, embers, speed, dist, spawnIn, clock, shake, holdJump, newRankIdx;
  const mtnFar = [], mtnNear = [];

  /* ---------- Sprite: Silhouette mit warmem Rand ---------- */
  function makeSprites(img) {
    const h = 92, w = Math.round(img.width * h / img.height);
    const sil = document.createElement("canvas"); sil.width = w; sil.height = h;
    const s = sil.getContext("2d");
    s.drawImage(img, 0, 0, w, h);
    s.globalCompositeOperation = "source-in";
    const g = s.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#2a1a10"); g.addColorStop(1, "#0b0705");
    s.fillStyle = g; s.fillRect(0, 0, w, h);
    const gl = document.createElement("canvas"); gl.width = w + 24; gl.height = h + 24;
    const q = gl.getContext("2d");
    q.drawImage(img, 12, 12, w, h);
    q.globalCompositeOperation = "source-in"; q.fillStyle = "#ff8a3a"; q.fillRect(0, 0, gl.width, gl.height);
    const out = document.createElement("canvas"); out.width = gl.width; out.height = gl.height;
    const o = out.getContext("2d"); o.filter = "blur(4px)"; o.drawImage(gl, 0, 0);
    sprite = sil; glow = out;
  }

  /* ---------- Hintergrund-Berge (einmal erzeugen) ---------- */
  function ridge(arr, n, base, amp) {
    arr.length = 0; let y = base;
    for (let i = 0; i <= n; i++) { y = Math.max(base - amp, Math.min(base + amp * 0.3, y + (Math.random() - 0.5) * amp * 0.9)); arr.push(y); }
  }
  function drawRidge(arr, off, step, color) {
    ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0, H);
    const span = (arr.length - 1) * step, o = off % span;
    for (let k = 0; k < 2; k++) arr.forEach((y, i) => ctx.lineTo(i * step - o + k * span, y));
    ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
  }

  function reset() {
    p = { x: 90, y: GROUND, vy: 0, onGround: true, squash: 0 };
    obs = []; parts = []; speed = 330; dist = 0; spawnIn = 0.9; clock = 0; shake = 0; newRankIdx = -1;
    if (!embers) embers = Array.from({ length: 26 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.6 + 0.4, v: Math.random() * 18 + 8 }));
  }

  /* ---------- Hindernisse: Metinsteine & Feuerkugeln ---------- */
  function spawn() {
    const score = Math.floor(dist / 10);
    if (score > 250 && Math.random() < 0.28) {
      const high = Math.random() < 0.5;
      obs.push({ kind: "orb", x: W + 30, y: high ? GROUND - 112 : GROUND - 50, w: 22, h: 22, ph: Math.random() * 6 });
    } else {
      const n = score > 400 && Math.random() < 0.35 ? 2 : 1;
      for (let i = 0; i < n; i++) {
        const h = 30 + Math.random() * 26, w = 22 + Math.random() * 10;
        obs.push({ kind: "stone", x: W + 20 + i * (w + 4), y: GROUND - h, w, h, seed: Math.random() });
      }
    }
    const gap = Math.max(0.62, 1.35 - speed / 900) + Math.random() * 0.75;
    spawnIn = gap;
  }

  function jump() {
    if (state === "idle" || state === "over") { if (state === "over" && clock < 0.5) return; start(); return; }
    if (p.onGround) { p.vy = -610; p.onGround = false; p.squash = -0.18; dust(6); }
  }
  function dust(n) {
    for (let i = 0; i < n; i++) parts.push({ x: p.x + 4, y: GROUND - 2, vx: -Math.random() * 90 - 20, vy: -Math.random() * 60, life: 0.5, max: 0.5, c: "rgba(212,162,76," });
  }

  function start() { reset(); state = "run"; hideOver(); }

  function update(dt) {
    clock += dt;
    embers.forEach(e => { e.y -= e.v * dt; e.x -= (state === "run" ? speed * 0.05 : 4) * dt; if (e.y < -4) { e.y = H + 4; e.x = Math.random() * W; } if (e.x < -4) e.x = W + 4; });
    if (state !== "run") return;
    speed = Math.min(820, speed + 9 * dt);
    dist += speed * dt;
    // Sprung (länger halten = höher)
    const grav = p.vy < 0 && holdJump ? 1500 : 2500;
    p.vy += grav * dt; p.y += p.vy * dt;
    if (p.y >= GROUND) { if (!p.onGround) { p.squash = 0.22; dust(8); } p.y = GROUND; p.vy = 0; p.onGround = true; }
    p.squash *= Math.pow(0.0005, dt);
    if (p.onGround && Math.random() < dt * 14) dust(1);
    // Hindernisse
    spawnIn -= dt; if (spawnIn <= 0) spawn();
    obs.forEach(o => { o.x -= speed * dt * (o.kind === "orb" ? 1.12 : 1); });
    obs = obs.filter(o => o.x + o.w > -40);
    parts.forEach(q => { q.x += q.vx * dt; q.y += q.vy * dt; q.vy += 200 * dt; q.life -= dt; }); parts = parts.filter(q => q.life > 0);
    // Kollision (Hitbox etwas kleiner als das Bild)
    const hb = { x: p.x - 14, y: p.y - 78, w: 28, h: 74 };
    for (const o of obs) {
      const ox = o.x + 4, ow = o.w - 8, oy = o.y + 4, oh = o.h - 6;
      if (hb.x < ox + ow && hb.x + hb.w > ox && hb.y < oy + oh && hb.y + hb.h > oy) { die(); break; }
    }
  }

  function die() {
    state = "over"; clock = 0; shake = 0.35;
    for (let i = 0; i < 26; i++) parts.push({ x: p.x, y: p.y - 34, vx: (Math.random() - 0.5) * 320, vy: (Math.random() - 0.8) * 300, life: 0.9, max: 0.9, c: "rgba(255,138,58," });
    showOver(Math.floor(dist / 10));
  }

  /* ---------- Zeichnen ---------- */
  function drawStone(o) {
    const { x, y, w, h } = o;
    ctx.save();
    ctx.shadowColor = "rgba(255,110,40,.55)"; ctx.shadowBlur = 12;
    ctx.fillStyle = "#140d09";
    ctx.beginPath();
    ctx.moveTo(x, y + h); ctx.lineTo(x + w * 0.08, y + h * 0.35); ctx.lineTo(x + w * (0.4 + o.seed * 0.2), y);
    ctx.lineTo(x + w * 0.92, y + h * 0.3); ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255,140,60,.55)"; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(x + w * 0.45, y + h * 0.25); ctx.lineTo(x + w * 0.38, y + h * 0.55); ctx.lineTo(x + w * 0.55, y + h * 0.78); ctx.stroke();
    ctx.restore();
  }
  function drawOrb(o) {
    const cx = o.x + o.w / 2, cy = o.y + o.h / 2 + Math.sin(clock * 6 + o.ph) * 3;
    const g = ctx.createRadialGradient(cx, cy, 1, cx, cy, 16);
    g.addColorStop(0, "rgba(255,230,170,1)"); g.addColorStop(0.35, "rgba(255,140,50,.95)"); g.addColorStop(1, "rgba(255,90,20,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, 16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(255,120,40,.25)"; ctx.beginPath(); ctx.ellipse(cx + 16, cy, 14, 5, 0, 0, Math.PI * 2); ctx.fill();
  }
  function drawPlayer() {
    if (!sprite) return;
    const bob = state === "run" && p.onGround ? Math.abs(Math.sin(clock * 16)) * 3 : 0;
    const tilt = state === "run" ? (p.onGround ? Math.sin(clock * 16) * 0.03 : Math.max(-0.2, Math.min(0.2, p.vy / 2600))) : 0;
    const sx = 1 + p.squash * 0.6, sy = 1 - p.squash;
    ctx.save();
    ctx.translate(p.x, p.y - bob); ctx.rotate(tilt); ctx.scale(sx, sy);
    ctx.globalAlpha = 0.9 + Math.sin(clock * 3) * 0.1;
    ctx.drawImage(glow, -glow.width / 2, -glow.height + 12);
    ctx.globalAlpha = 1;
    ctx.drawImage(sprite, -sprite.width / 2, -sprite.height);
    ctx.restore();
    // Schatten am Boden
    const k = Math.max(0.35, 1 - (GROUND - p.y) / 160);
    ctx.fillStyle = `rgba(0,0,0,${0.45 * k})`; ctx.beginPath(); ctx.ellipse(p.x, GROUND + 2, 20 * k, 4 * k, 0, 0, Math.PI * 2); ctx.fill();
  }

  function draw() {
    ctx.save();
    if (shake > 0) ctx.translate((Math.random() - 0.5) * 8 * shake, (Math.random() - 0.5) * 8 * shake);
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#1a0f08"); sky.addColorStop(0.6, "#3a1c0c"); sky.addColorStop(1, "#120c07");
    ctx.fillStyle = sky; ctx.fillRect(-10, -10, W + 20, H + 20);
    const sun = ctx.createRadialGradient(W * 0.72, GROUND - 40, 10, W * 0.72, GROUND - 40, 260);
    sun.addColorStop(0, "rgba(255,140,50,.35)"); sun.addColorStop(1, "rgba(255,140,50,0)");
    ctx.fillStyle = sun; ctx.fillRect(0, 0, W, H);
    drawRidge(mtnFar, dist * 0.12, 38, "#24140b");
    drawRidge(mtnNear, dist * 0.3, 52, "#170d07");
    // Boden
    ctx.fillStyle = "#0d0805"; ctx.fillRect(-10, GROUND, W + 20, H - GROUND + 10);
    ctx.fillStyle = "rgba(212,162,76,.55)"; ctx.fillRect(-10, GROUND, W + 20, 1);
    ctx.fillStyle = "rgba(212,162,76,.18)";
    for (let i = 0; i < 14; i++) { const x = ((i * 67 - dist) % (W + 60) + W + 60) % (W + 60) - 30; ctx.fillRect(x, GROUND + 9 + (i % 3) * 9, 14 + (i % 4) * 6, 1); }
    // Glut
    embers.forEach(e => { ctx.fillStyle = `rgba(255,${150 + (e.r * 40 | 0)},70,${0.35 + e.r * 0.25})`; ctx.fillRect(e.x, e.y, e.r, e.r); });
    obs.forEach(o => o.kind === "stone" ? drawStone(o) : drawOrb(o));
    if (state !== "over") drawPlayer();
    parts.forEach(q => { ctx.fillStyle = q.c + (q.life / q.max).toFixed(2) + ")"; ctx.fillRect(q.x, q.y, 2.2, 2.2); });
    ctx.restore();
    // HUD
    ctx.font = "600 15px Inter, system-ui, sans-serif"; ctx.textAlign = "right"; ctx.fillStyle = "#f1cf87";
    ctx.fillText(String(Math.floor(dist / 10)).padStart(5, "0"), W - 16, 28);
    const best = top()[0]; if (best) { ctx.fillStyle = "rgba(241,207,135,.5)"; ctx.fillText("HI " + String(best.s).padStart(5, "0"), W - 86, 28); }
    if (state === "idle") {
      ctx.textAlign = "center"; ctx.fillStyle = "#f1cf87"; ctx.font = "700 22px Cinzel, Georgia, serif";
      ctx.fillText("SHADOW RUN", W / 2, 96);
      ctx.font = "500 13px Inter, system-ui, sans-serif"; ctx.fillStyle = "rgba(240,225,200,.75)";
      ctx.fillText(clock % 1.2 < 0.8 ? window.t("game.start") : "", W / 2, 122);
    }
  }

  function loop(now) {
    const dt = Math.min(0.033, (now - last) / 1000 || 0); last = now;
    if (shake > 0) shake = Math.max(0, shake - dt);
    if (state === "over") { parts.forEach(q => { q.x += q.vx * dt; q.y += q.vy * dt; q.vy += 400 * dt; q.life -= dt; }); parts = parts.filter(q => q.life > 0); }
    update(dt); draw();
    raf = requestAnimationFrame(loop);
  }

  /* ---------- Rangliste (Gerät) ---------- */
  function top() { try { return JSON.parse(localStorage.getItem(RUNNER_KEY)) || []; } catch { return []; } }
  function saveTop(list) { try { localStorage.setItem(RUNNER_KEY, JSON.stringify(list.slice(0, 10))); } catch {} }
  function qualifies(s) { const l = top(); return s > 0 && (l.length < 10 || s > l[l.length - 1].s); }
  function e(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  function renderRank() {
    const el = document.getElementById("rn-rank"); if (!el) return;
    const l = top();
    el.innerHTML = l.length ? l.map((r, i) =>
      `<li class="${i === newRankIdx ? "is-new" : ""}"><span class="rn-pos">${i + 1}</span><span class="rn-n">${e(r.n)}</span><span class="rn-s">${r.s}</span></li>`).join("")
      : `<li class="rn-empty">${e(window.t("game.empty"))}</li>`;
  }
  function showOver(score) {
    const box = document.getElementById("rn-over"); box.hidden = false;
    document.getElementById("rn-score").textContent = score;
    const form = document.getElementById("rn-form");
    form.hidden = !qualifies(score); form.dataset.score = score;
    if (!form.hidden) { const inp = document.getElementById("rn-name"); try { inp.value = localStorage.getItem(RUNNER_NAME_KEY) || ""; } catch {} setTimeout(() => inp.focus(), 60); }
    renderRank();
  }
  function hideOver() { const b = document.getElementById("rn-over"); if (b) b.hidden = true; }
  function submitName(ev) {
    ev.preventDefault();
    const form = ev.currentTarget, s = +form.dataset.score;
    const n = document.getElementById("rn-name").value.trim().slice(0, 16) || "???";
    try { localStorage.setItem(RUNNER_NAME_KEY, n); } catch {}
    const l = top(); l.push({ n, s, d: Date.now() }); l.sort((a, b) => b.s - a.s);
    newRankIdx = l.findIndex(r => r.s === s && r.n === n);
    saveTop(l); form.hidden = true; renderRank();
  }

  /* ---------- Öffnen / Schließen ---------- */
  function open() {
    const d = document.getElementById("runner-dialog"); if (!d || !d.hidden) return;
    d.hidden = false; document.body.classList.add("modal-open");
    if (!cv) {
      cv = document.getElementById("runner-canvas"); ctx = cv.getContext("2d");
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = W * dpr; cv.height = H * dpr; ctx.scale(dpr, dpr);
      ridge(mtnFar, 30, GROUND - 70, 40); ridge(mtnNear, 22, GROUND - 28, 26);
      const img = new Image(); img.onload = () => makeSprites(img); img.src = RUNNER_SPRITE;
    }
    reset(); state = "idle"; hideOver(); renderRank();
    last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
  }
  function close() {
    const d = document.getElementById("runner-dialog"); if (!d || d.hidden) return;
    d.hidden = true; document.body.classList.remove("modal-open"); cancelAnimationFrame(raf);
    if (location.hash === "#runner") history.replaceState(null, "", location.pathname + location.search);
  }
  function isOpen() { const d = document.getElementById("runner-dialog"); return d && !d.hidden; }

  function init() {
    const d = document.getElementById("runner-dialog"); if (!d) return;
    // Steuerung
    const down = ev => { if (ev.target.closest("#rn-form, .modal-x, button")) return; ev.preventDefault(); holdJump = true; jump(); };
    document.getElementById("runner-stage").addEventListener("pointerdown", down);
    window.addEventListener("pointerup", () => { holdJump = false; });
    document.addEventListener("keydown", ev => {
      if (!isOpen()) return;
      if (ev.key === "Escape") { close(); return; }
      if (ev.target.matches("input")) return;
      if (ev.code === "Space" || ev.key === "ArrowUp" || ev.key === "w") { ev.preventDefault(); if (!ev.repeat) { holdJump = true; jump(); } }
    });
    document.addEventListener("keyup", ev => { if (ev.code === "Space" || ev.key === "ArrowUp" || ev.key === "w") holdJump = false; });
    d.addEventListener("click", ev => { if (ev.target === d || ev.target.closest("[data-close-runner]")) close(); });
    document.getElementById("rn-form").addEventListener("submit", submitName);
    document.getElementById("rn-again").addEventListener("click", () => start());
    document.addEventListener("visibilitychange", () => { if (document.hidden && state === "run") { holdJump = false; } });
    // Geheime Auslöser
    let taps = 0, tapT = 0;
    document.querySelectorAll("[data-runner-egg]").forEach(el => el.addEventListener("click", () => {
      const now = Date.now(); taps = now - tapT < 600 ? taps + 1 : 1; tapT = now;
      if (taps >= 5) { taps = 0; open(); }
    }));
    let typed = "";
    document.addEventListener("keydown", ev => {
      if (isOpen() || ev.target.matches("input, textarea, select") || ev.key.length !== 1) return;
      typed = (typed + ev.key.toLowerCase()).slice(-7);
      if (typed === "society") { typed = ""; open(); }
    });
    const byHash = () => { if (location.hash === "#runner") open(); };
    window.addEventListener("hashchange", byHash); byHash();
    window.addEventListener("langchange", () => { if (isOpen()) renderRank(); });
  }

  return { init, open, close };
})();

function initRunner() { Runner.init(); }
