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

function xmasApply(on) {
  document.documentElement.classList.toggle("xmas", on);
  document.querySelectorAll("[data-xmas-toggle]").forEach(b => b.setAttribute("aria-checked", on ? "true" : "false"));
  if (on) xmasStartSnow(); else xmasStopSnow();
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
