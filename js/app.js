/* =====================================================================
   Origins2 Helper by Society – App-Grundgerüst
   Bilder-Fallbacks, Banner, Referral-Kopieren, Toast
   ===================================================================== */

/* ---------- Platzhalter, solange die echten Bilder fehlen ---------- */
const FALLBACKS = {
  origins2: `
    <div class="logo-fallback" role="img" aria-label="Origins2">
      <span class="font-display">ORIGINS<b>2</b></span>
    </div>`,
  society: `
    <span class="society-fallback font-display" role="img" aria-label="Society">S</span>`
};

function applyFallback(img) {
  const html = FALLBACKS[img.dataset.fallback];
  if (!html || img.dataset.fallbackDone) return;
  img.dataset.fallbackDone = "1";
  const wrap = document.createElement("div");
  wrap.innerHTML = html.trim();
  img.replaceWith(wrap.firstElementChild);
}

function initImageFallbacks() {
  document.querySelectorAll("img[data-fallback]").forEach(img => {
    if (img.complete && img.naturalWidth === 0) applyFallback(img);
    else img.addEventListener("error", () => applyFallback(img), { once: true });
  });
}

/* ---------- Hero-Banner: nur setzen, wenn die Datei existiert ---------- */
function initBanner() {
  const bg = document.querySelector("[data-banner]");
  if (!bg) return;
  const src = bg.dataset.banner;
  const probe = new Image();
  probe.onload = () => {
    bg.style.backgroundImage = `url("${src}")`;
    bg.classList.add("has-image");
  };
  probe.src = src;
}

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2200);
}

/* ---------- Kopieren (mit Fallback für ältere Browser) ---------- */
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch { ok = false; }
    ta.remove();
    return ok;
  }
}

function initReferral() {
  const btn = document.getElementById("copy-ref");
  if (!btn) return;
  const label = btn.querySelector("[data-label]");
  btn.addEventListener("click", async () => {
    const ok = await copyText(btn.dataset.copy);
    if (ok) {
      btn.classList.add("is-done");
      label.textContent = t("copy.ok");
      toast(t("ref.copied"));
      setTimeout(() => { btn.classList.remove("is-done"); label.textContent = t("copy.btn"); }, 1800);
    } else {
      toast(t("ref.failed"));
    }
  });
}

/* ---------- Reiter: zwischen den Bereichen blättern ---------- */
const VIEWS = ["uebersicht", "upp-rechner", "skilltree", "bosse", "kalender", "event-helper", "guides", "team"];

function showView(name, scroll) {
  if (name === "minispiele") name = "event-helper";
  if (name === "helfer-werden") name = "team";   // Direktlink: Team-Reiter + Bewerbung offen (siehe team.js)
  if (!VIEWS.includes(name)) name = VIEWS[0];
  document.querySelectorAll("[data-view]").forEach(v => { v.hidden = v.dataset.view !== name; });
  document.querySelectorAll("[data-tab]").forEach(t => {
    const active = t.dataset.tab === name;
    t.classList.toggle("is-active", active);
    t.setAttribute("aria-selected", active ? "true" : "false");
    if (active) t.scrollIntoView({ block: "nearest", inline: "nearest" });
  });
  if (scroll) {
    const header = document.querySelector("header.hero");
    const top = header ? header.offsetHeight : 0;
    if (window.scrollY > top || scroll === "force") window.scrollTo({ top, behavior: "smooth" });
  }
}

function initTabs() {
  const current = () => location.hash.replace("#", "");
  window.addEventListener("hashchange", () => showView(current(), "force"));
  showView(current(), current() ? "force" : false);
}

/* ---------- Sprache & Teilen ---------- */
function initLangAndShare() {
  applyI18n();
  document.querySelectorAll("[data-lang]").forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));
  const sb = document.getElementById("share-site");
  if (sb) sb.addEventListener("click", async () => {
    const u = new URL(location.href);
    u.search = ""; if (LANG === "en") u.searchParams.set("lang", "en");
    const url = u.toString();
    try {
      if (navigator.share) { await navigator.share({ title: "Origins2 Helper by Society", text: t("share.site"), url }); return; }
    } catch (e) { if (e && e.name === "AbortError") return; }
    const ok = await copyText(url);
    toast(ok ? t("share.copied") : t("share.failed"));
  });
}

/* ---------- Glutfunken im Kopfbereich ---------- */
function initEmbers() {
  const c = document.getElementById("hero-embers");
  if (!c || !c.getContext) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const g = c.getContext("2d");
  let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2), parts = [], running = true;
  const resize = () => {
    const r = c.getBoundingClientRect(); W = r.width; H = r.height;
    c.width = W * dpr; c.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const target = Math.round(Math.min(70, W / 22));
    while (parts.length < target) parts.push(spawn(true));
    parts.length = target;
  };
  const spawn = (anywhere) => ({
    x: Math.random() * W,
    y: anywhere ? Math.random() * H : H + 10,
    r: 0.6 + Math.random() * 1.8,
    vy: 0.15 + Math.random() * 0.45,
    vx: (Math.random() - 0.5) * 0.15,
    sw: Math.random() * Math.PI * 2,
    life: 0.5 + Math.random() * 0.5,
    hue: 22 + Math.random() * 20
  });
  const step = () => {
    if (!running) return;
    g.clearRect(0, 0, W, H);
    g.globalCompositeOperation = "lighter";
    for (const p of parts) {
      p.sw += 0.02; p.y -= p.vy; p.x += p.vx + Math.sin(p.sw) * 0.25;
      const fade = Math.max(0, Math.min(1, p.y / H)) * p.life;
      if (p.y < -10) Object.assign(p, spawn(false));
      const grd = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      grd.addColorStop(0, `hsla(${p.hue}, 100%, 70%, ${0.9 * fade})`);
      grd.addColorStop(0.35, `hsla(${p.hue}, 95%, 55%, ${0.35 * fade})`);
      grd.addColorStop(1, "hsla(20, 90%, 40%, 0)");
      g.fillStyle = grd; g.beginPath(); g.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2); g.fill();
    }
    g.globalCompositeOperation = "source-over";
    requestAnimationFrame(step);
  };
  // nur animieren, wenn der Kopfbereich sichtbar ist (spart Akku)
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => { const was = running; running = e.isIntersecting; if (running && !was) requestAnimationFrame(step); }).observe(c);
  }
  window.addEventListener("resize", resize);
  resize(); requestAnimationFrame(step);
}

/* ---------- Start ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initLangAndShare();
  initImageFallbacks();
  initBanner();
  initEmbers();
  initReferral();
  initTabs();
  if (typeof initStreamers === "function") initStreamers();
  if (typeof initEvents === "function") initEvents();
  if (typeof initUpp === "function") initUpp();
  if (typeof initCalendar === "function") initCalendar();
  if (typeof initChangelog === "function") initChangelog();
  if (typeof initApply === "function") initApply();
  if (typeof initFeedback === "function") initFeedback();
  if (typeof initChat === "function") initChat();
  if (typeof initSkilltree === "function") initSkilltree();
  if (typeof initFishPuzzle === "function") initFishPuzzle();
  if (typeof initTeam === "function") initTeam();
  if (typeof initRefInfo === "function") initRefInfo();
  if (typeof initRunner === "function") initRunner();
  layoutHeroCrew();
  window.addEventListener("resize", () => { clearTimeout(window.__hcT); window.__hcT = setTimeout(layoutHeroCrew, 80); });
  document.querySelectorAll(".hero-crew img, .hero-logo").forEach(i => { if (!i.complete) i.addEventListener("load", layoutHeroCrew, { once: true }); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutHeroCrew);
  if (typeof initVisitors === "function") initVisitors();
});

/* Hero: Logo + Text mittig zwischen den Charakter-Gruppen links und rechts */
function layoutHeroCrew() {
  const grid = document.querySelector(".hero-grid"), inner = document.querySelector(".hero-inner");
  const L = document.querySelector(".hero-crew-left"), R = document.querySelector(".hero-crew-right");
  if (!grid || !inner) return;
  grid.style.removeProperty("--crew-l"); grid.style.removeProperty("--crew-r");
  if (window.innerWidth < 1100) return;
  const wl = L && L.offsetParent ? L.getBoundingClientRect().width : 0;
  const wr = R && R.offsetParent ? R.getBoundingClientRect().width : 0;
  const gap = 24, cs = getComputedStyle(inner);
  const avail = inner.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const block = [...grid.children].reduce((a, c) => a + c.getBoundingClientRect().width, 0) + parseFloat(getComputedStyle(grid).columnGap || 0);
  const sym = Math.max(wl, wr) + gap;
  let pl = sym, pr = sym;
  if (avail - 2 * sym < block) { pl = wl ? wl + gap : 0; pr = wr ? wr + gap : 0; }
  grid.style.setProperty("--crew-l", pl + "px");
  grid.style.setProperty("--crew-r", pr + "px");
}
