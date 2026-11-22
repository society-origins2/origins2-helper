/* =====================================================================
   WEIHNACHTSMODUS  –  Schneefall + festlicher Akzent, per Schalter
   ---------------------------------------------------------------------
   Schalter oben in der Kopfleiste (Schieberegler). Zustand bleibt in
   localStorage o2h.xmas = "on" | "off". Ohne eigene Wahl ist er im
   Zeitraum 1.12.–15.1. automatisch an (wie das Spiel-Design), sonst aus.
   Respektiert „Bewegung reduzieren“ (dann kein Schneefall) und läuft
   nicht im Mini-Fenster.
   ===================================================================== */

const XMAS_KEY = "o2h.xmas";
const XMAS_WINDOW = [[12, 1], [1, 15]];   // 1. Dez bis 15. Jan (beide inkl.)

function xmasInWindow(d = new Date()) {
  const m = d.getMonth() + 1, day = d.getDate();
  const [[sm, sd], [em, ed]] = XMAS_WINDOW;
  const after = m > sm || (m === sm && day >= sd);
  const before = m < em || (m === em && day <= ed);
  return after || before;   // Fenster läuft über den Jahreswechsel
}
function xmasIsMini() {
  return /(^|[?&])mini=/.test(location.search) || /\bis-mini/.test(document.documentElement.className);
}
function xmasReduced() {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

let snow = null;   // { canvas, ctx, flakes, raf, w, h }

function xmasStartSnow() {
  if (snow || xmasReduced() || xmasIsMini()) return;
  const canvas = document.createElement("canvas");
  canvas.className = "xmas-snow";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  snow = { canvas, ctx, flakes: [], raf: 0, w: 0, h: 0 };
  xmasResizeSnow();
  const n = Math.round(Math.min(90, Math.max(32, innerWidth / 16)));
  for (let i = 0; i < n; i++) snow.flakes.push(xmasFlake(true));
  let last = performance.now();
  const tick = (now) => {
    const dt = Math.min(50, now - last); last = now;
    xmasDrawSnow(dt);
    snow.raf = requestAnimationFrame(tick);
  };
  snow.raf = requestAnimationFrame(tick);
  addEventListener("resize", xmasResizeSnow);
}
function xmasFlake(spread) {
  return {
    x: Math.random() * (snow ? snow.w : innerWidth),
    y: spread ? Math.random() * (snow ? snow.h : innerHeight) : -8,
    r: 1 + Math.random() * 2.6,
    sp: 14 + Math.random() * 34,          // Fallgeschwindigkeit px/s
    dr: -10 + Math.random() * 20,          // seitliche Drift px/s
    sw: Math.random() * Math.PI * 2,       // Phase fürs Schaukeln
    o: 0.35 + Math.random() * 0.5
  };
}
function xmasResizeSnow() {
  if (!snow) return;
  const dpr = Math.min(2, devicePixelRatio || 1);
  snow.w = innerWidth; snow.h = innerHeight;
  snow.canvas.width = snow.w * dpr; snow.canvas.height = snow.h * dpr;
  snow.canvas.style.width = snow.w + "px"; snow.canvas.style.height = snow.h + "px";
  snow.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
function xmasDrawSnow(dt) {
  const s = dt / 1000, { ctx, w, h } = snow;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#ffffff";
  for (const f of snow.flakes) {
    f.y += f.sp * s;
    f.sw += s * 1.4;
    f.x += (f.dr + Math.sin(f.sw) * 10) * s;
    if (f.y > h + 8) { Object.assign(f, xmasFlake(false)); f.y = -8; }
    if (f.x < -8) f.x = w + 8; else if (f.x > w + 8) f.x = -8;
    ctx.globalAlpha = f.o;
    ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}
function xmasStopSnow() {
  if (!snow) return;
  cancelAnimationFrame(snow.raf);
  removeEventListener("resize", xmasResizeSnow);
  snow.canvas.remove();
  snow = null;
}

/* Deko (Mistelzweig, Schleifchen, Weihnachtsbaum) – nur im Weihnachtsmodus */
const XMAS_MISTLETOE = `<svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M40 0v14M40 14c-6 2-12 8-15 16M40 14c6 2 12 8 15 16" stroke="#6b7d3a" stroke-width="2" stroke-linecap="round"/>
  <g fill="#4f6b2e" stroke="#3c531f" stroke-width="1">
    <path d="M25 30c-7-1-13 3-16 10 7 2 14-1 18-8z"/><path d="M25 30c-6 3-9 9-9 17 7-2 11-8 12-15z"/>
    <path d="M55 30c7-1 13 3 16 10-7 2-14-1-18-8z"/><path d="M55 30c6 3 9 9 9 17-7-2-11-8-12-15z"/>
    <path d="M33 34c-5 3-8 9-8 16 6-2 10-7 11-13z"/><path d="M47 34c5 3 8 9 8 16-6-2-10-7-11-13z"/>
  </g>
  <g fill="#f3ede1" stroke="#cbb68f" stroke-width="0.6">
    <circle cx="24" cy="44" r="3"/><circle cx="31" cy="48" r="2.6"/><circle cx="56" cy="44" r="3"/><circle cx="49" cy="48" r="2.6"/><circle cx="40" cy="30" r="2.4"/>
  </g></svg>`;
const XMAS_BOW = `<svg viewBox="0 0 60 44" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M30 22c-8-10-26-12-26 0s18 10 26 0z" fill="#b23b36" stroke="#7d1f1b" stroke-width="1.2"/>
  <path d="M30 22c8-10 26-12 26 0s-18 10-26 0z" fill="#c9433d" stroke="#7d1f1b" stroke-width="1.2"/>
  <path d="M30 22c-5 6-7 14-6 22M30 22c5 6 7 14 6 22" stroke="#b23b36" stroke-width="5" stroke-linecap="round"/>
  <circle cx="30" cy="22" r="5.5" fill="#d9a441" stroke="#7d1f1b" stroke-width="1"/></svg>`;
const XMAS_TREE = `<svg viewBox="0 0 90 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M45 6 58 34H32zM38 30h14l12 28H26zM31 54h28l15 34H16z" fill="#2f6b3a" stroke="#1f4a28" stroke-width="2" stroke-linejoin="round"/>
  <rect x="39" y="86" width="12" height="16" rx="2" fill="#6b4a2a"/>
  <path d="M45 2l3 6 6 1-4 5 1 6-6-3-6 3 1-6-4-5 6-1z" fill="#f2c14e" stroke="#c98f24" stroke-width="1"/>
  <g><circle cx="38" cy="30" r="3" fill="#e5484d"/><circle cx="54" cy="46" r="3" fill="#4f9dde"/><circle cx="34" cy="60" r="3" fill="#f2c14e"/><circle cx="56" cy="70" r="3" fill="#e5484d"/><circle cx="45" cy="50" r="3" fill="#f3ede1"/><circle cx="30" cy="78" r="3" fill="#4f9dde"/><circle cx="60" cy="82" r="3" fill="#f2c14e"/></g></svg>`;

function xmasBuildDeco() {
  if (document.querySelector(".xmas-deco") || xmasIsMini()) return;
  const d = document.createElement("div");
  d.className = "xmas-deco"; d.setAttribute("aria-hidden", "true");
  d.innerHTML =
    `<div class="xmas-mistle xmas-mistle-l">${XMAS_MISTLETOE}</div>` +
    `<div class="xmas-mistle xmas-mistle-r">${XMAS_MISTLETOE}</div>` +
    `<div class="xmas-bow">${XMAS_BOW}</div>` +
    `<div class="xmas-tree">${XMAS_TREE}</div>`;
  document.body.appendChild(d);
}
function xmasRemoveDeco() { document.querySelector(".xmas-deco")?.remove(); }

function xmasApply(on) {
  document.documentElement.classList.toggle("xmas", on);
  document.querySelectorAll("[data-xmas-toggle]").forEach(b => b.setAttribute("aria-checked", on ? "true" : "false"));
  if (on) { xmasStartSnow(); xmasBuildDeco(); } else { xmasStopSnow(); xmasRemoveDeco(); }
}
function xmasState() {
  let saved = null;
  try { saved = localStorage.getItem(XMAS_KEY); } catch {}
  if (saved === "on") return true;
  if (saved === "off") return false;
  return xmasInWindow();   // keine eigene Wahl → Saison entscheidet
}
function xmasSet(on) {
  try { localStorage.setItem(XMAS_KEY, on ? "on" : "off"); } catch {}
  xmasApply(on);
}

function initSeason() {
  if (xmasIsMini()) return;   // kein Weihnachtskram im Mini-Fenster
  xmasApply(xmasState());
  document.querySelectorAll("[data-xmas-toggle]").forEach(b => {
    b.addEventListener("click", () => xmasSet(b.getAttribute("aria-checked") !== "true"));
    b.addEventListener("keydown", e => {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); xmasSet(b.getAttribute("aria-checked") !== "true"); }
    });
  });
  // Schneefall anhalten, wenn der Tab im Hintergrund ist (spart Akku)
  document.addEventListener("visibilitychange", () => {
    if (!document.documentElement.classList.contains("xmas")) return;
    if (document.hidden) xmasStopSnow(); else xmasStartSnow();
  });
  // Anderer Tab hat den Schalter umgelegt
  addEventListener("storage", e => { if (e.key === XMAS_KEY) xmasApply(xmasState()); });
}
initSeason();
