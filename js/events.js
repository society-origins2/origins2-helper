/* =====================================================================
   BOSS- & EVENT-ZEITEN  –  hier pflegst du die Spawn-Zeiten
   ---------------------------------------------------------------------
   Alle Zeiten sind SERVERZEIT (siehe SERVER_TIMEZONE).

   every : Abstand zwischen zwei Spawns in Minuten
           (15 = alle 15 Min, 90 = alle 1h30, 180 = alle 3h, 360 = alle 6h)
   start : erster Spawn des Tages, z.B. "00:00" (volle Stunde)
   short : Kurzname für die Live-Leiste oben (optional)
   …En   : englische Version (bossesEn, shortEn, titleEn, mapsEn) – optional,
           ohne Eintrag wird der deutsche Name angezeigt
   type  : "world" = Weltboss (erscheint oben in der Live-Leiste)
           "map"   = Map-Boss  (erscheint im Bereich „Boss-Timer“)
   ===================================================================== */

const SERVER_TIMEZONE = "Europe/Berlin";

/* Vorwarnung: so viele Minuten vor dem Spawn wird ein Boss hervorgehoben */
const WARN_MINUTES = 5;

const BOSS_SCHEDULES = [
  /* ---------- Weltbosse ---------- */
  {
    id: "wb-3h",
    type: "world",
    bosses: ["Große Eishexe", "König Wobba", "Entai-Herrscher"],
    bossesEn: ["Great Ice Witch", "King Wobba", "Entai Ruler"],
    short: "Eishexe · Wobba · Entai",
    shortEn: "Ice Witch · Wobba · Entai",
    every: 180,
    start: "00:00"
  },
  {
    id: "wb-serpent",
    type: "world",
    bosses: ["Naga-Serpent", "Schlangenkönigin Nethis"],
    bossesEn: ["Naga Serpent", "Serpent Queen Nethis"],
    short: "Naga · Nethis",
    every: 360,
    start: "00:00"
  },
  {
    id: "wb-elementar",
    type: "world",
    bosses: ["Elementar-Herrscher"],
    bossesEn: ["Elemental Ruler"],
    short: "Elementar-Herrscher",
    shortEn: "Elemental Ruler",
    every: 360,
    start: "00:00"
  },

  /* ---------- Map-Bosse ---------- */
  {
    id: "map-low",
    type: "map",
    short: "Low-Level", shortEn: "Low level",   // Kurzname fürs Mini-Fenster
    title: "Low-Level-Mapbosse",
    img: "assets/bosses/map-low.png", imgH: 119,
    titleEn: "Low-level map bosses",
    maps: "Orktal bis Grotte der Verbannung 2",
    mapsEn: "Orc Valley to Grotto of Exile 2",
    every: 15,
    start: "00:00"
  },
  {
    id: "map-beta",
    type: "map",
    short: "Beta-Maps", shortEn: "Beta maps",   // Kurzname fürs Mini-Fenster
    title: "Beta-Map-Bosse",
    img: "assets/bosses/map-beta.png", imgH: 118,
    titleEn: "Beta map bosses",
    maps: "Beta-Maps",
    mapsEn: "Beta maps",
    every: 30,
    start: "00:00"
  },
  {
    id: "map-elementar",
    type: "map",
    short: "Elementar-Maps", shortEn: "Elemental maps",   // Kurzname fürs Mini-Fenster
    title: "Elementar-Map-Bosse",
    img: "assets/bosses/map-elementar.png", imgH: 110,
    titleEn: "Elemental map bosses",
    maps: "Elementar-Maps",
    mapsEn: "Elemental maps",
    every: 90,
    start: "00:00"
  },
  {
    id: "map-yohara",
    type: "map",
    short: "Yohara-Maps", shortEn: "Yohara maps",   // Kurzname fürs Mini-Fenster
    title: "Yohara-Map-Bosse",
    img: "assets/bosses/map-yohara.png", imgH: 83,
    titleEn: "Yohara map bosses",
    maps: "Yohara-Maps",
    mapsEn: "Yohara maps",
    every: 90,
    start: "00:00"
  }
];


/* =====================================================================
   BOSS-BILDER  –  Porträt im Hintergrund der Karten
   ---------------------------------------------------------------------
   Weltbosse: Schlüssel = deutscher Bossname wie oben in "bosses".
   Map-Bosse: direkt im Zeitplan oben als img / imgH eintragen.
   img  : Bild in assets/bosses/ (freigestellt, PNG mit Transparenz)
   imgH : Originalhöhe in Pixeln (damit das Bild nicht unscharf vergrößert wird)
   ===================================================================== */

const BOSS_INFO = {
  "Große Eishexe":           { img: "assets/bosses/eishexe.png",   imgH: 86 },
  "Schlangenkönigin Nethis": { img: "assets/bosses/nethis.png",    imgH: 125 },
  "Elementar-Herrscher":     { img: "assets/bosses/elementar.png", imgH: 115 }
};


/* =====================================================================
   Ab hier nichts ändern – Berechnung & Darstellung
   ===================================================================== */

const DAY_SEC = 24 * 60 * 60;

/* Aktuelle Serverzeit als Sekunden seit Mitternacht */
const _serverClock = new Intl.DateTimeFormat("de-DE", {
  timeZone: SERVER_TIMEZONE, hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
});
function serverSecondsNow() {
  const p = Object.fromEntries(_serverClock.formatToParts(new Date()).map(x => [x.type, x.value]));
  return (+p.hour) * 3600 + (+p.minute) * 60 + (+p.second);
}

function parseHHMM(str) {
  const [h, m] = String(str || "00:00").split(":").map(Number);
  return (h * 60 + (m || 0)) * 60;
}

/* Alle Spawn-Zeitpunkte eines Tages (Sekunden seit Mitternacht) */
const _slotCache = {};
function daySlots(schedule) {
  if (_slotCache[schedule.id]) return _slotCache[schedule.id];
  const every = Math.max(1, schedule.every) * 60, start = parseHHMM(schedule.start);
  const slots = [];
  for (let t = start; t < DAY_SEC; t += every) slots.push(t);
  return (_slotCache[schedule.id] = slots);
}

/* Nächster Spawn: { inSec, atSec, every } */
function nextSpawn(schedule, nowSec) {
  const slots = daySlots(schedule);
  const at = slots.find(t => t > nowSec) ?? slots[0] + DAY_SEC;
  return { inSec: at - nowSec, atSec: at % DAY_SEC, every: schedule.every * 60 };
}

function upcomingTimes(schedule, nowSec, count = 3) {
  const out = [];
  let t = nowSec;
  for (let i = 0; i < count; i++) {
    const n = nextSpawn(schedule, t % DAY_SEC);
    out.push(n.atSec);
    t = n.atSec;
  }
  return out;
}

function fmtClock(sec) {
  const h = Math.floor(sec / 3600) % 24, m = Math.floor(sec / 60) % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
function fmtCountdown(sec) {
  const h = Math.floor(sec / 3600), m = Math.floor(sec / 60) % 60, s = sec % 60;
  const mm = String(m).padStart(2, "0"), ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}
function fmtEvery(min) {
  if (min < 60) return t("every.min", min);
  const h = Math.floor(min / 60), m = min % 60;
  return m ? t("every.hm", h, m) : t("every.h", h);
}
function bossNames(s) { return (LANG === "en" && s.bossesEn) || s.bosses || []; }
function bossLabel(s) { return L(s, "title") || bossNames(s).join(" · "); }
function bossShort(s) { return L(s, "short") || bossLabel(s); }
function bossArtInfo(s) {
  if (s.img) return { img: s.img, imgH: s.imgH };
  return (s.bosses || []).map(b => BOSS_INFO[b]).find(i => i && i.img) || null;
}
function bossArt(s) { const i = bossArtInfo(s); return i ? i.img : ""; }
function esc(str) {
  return String(str ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
/* ---------------- Sound (pro Boss einzeln) ---------------- */
const SOUND_KEY = "o2h.bossSounds";
let audioCtx = null;
function soundIds() {
  try { return new Set(JSON.parse(localStorage.getItem(SOUND_KEY) || "[]")); } catch { return new Set(); }
}
function isSoundOn(id) { return soundIds().has(id); }
function setSoundOn(id, on) {
  const ids = soundIds();
  on ? ids.add(id) : ids.delete(id);
  try { localStorage.setItem(SOUND_KEY, JSON.stringify([...ids])); } catch {}
}

const BELL_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16Z"/><path d="M10 20a2 2 0 0 0 4 0"/><path class="bell-slash" d="M4 4l16 16"/></svg>';
function bellButton(s, small = false) {
  return `<button type="button" class="bell${small ? " bell-sm" : ""}" data-bell="${esc(s.id)}" aria-pressed="false"
    aria-label="${esc(t("bell.aria", bossLabel(s)))}">${BELL_SVG}</button>`;
}
function paintBells() {
  const ids = soundIds();
  document.querySelectorAll("[data-bell]").forEach(b => {
    const on = ids.has(b.dataset.bell);
    b.classList.toggle("is-on", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
    b.title = on ? t("bell.on") : t("bell.off");
  });
}

function ping(strong = false) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const notes = strong ? [880, 1175, 1568] : [988, 1319];
    notes.forEach((f, i) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      const t = audioCtx.currentTime + i * 0.14;
      o.type = "sine"; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
      o.connect(g).connect(audioCtx.destination);
      o.start(t); o.stop(t + 0.5);
    });
  } catch { /* Sound nicht verfügbar */ }
}

/* ---------------- Live-Leiste (Weltbosse) ---------------- */
function renderTicker() {
  const list = document.getElementById("ticker-list");
  if (!list) return;
  const worlds = BOSS_SCHEDULES.filter(s => s.type === "world");
  list.innerHTML = worlds.map(s => `
    <div class="tick" data-id="${esc(s.id)}">
      ${bossArt(s) ? `<span class="tick-ava"><img src="${esc(bossArt(s))}" alt=""></span>` : ""}
      <div class="min-w-0">
        <p class="tick-name" title="${esc(bossLabel(s))}">${esc(bossShort(s))}</p>
        <p class="tick-meta"><span data-at>--:--</span> · ${fmtEvery(s.every)}</p>
      </div>
      <div class="flex flex-none items-center gap-2">
        <p class="tick-count tabular-nums" data-count>--:--</p>
        ${bellButton(s, true)}
      </div>
    </div>`).join("");
}

/* ---------------- Mini-Fenster (waagerecht): alle Bosse in einer Leiste ----------------
   ?mini=boss – wird über openMiniWindow("boss", …) aus upp.js geöffnet */
const BOSS_MINI = new URLSearchParams(location.search).get("mini") === "boss";
const BOSS_ORIENT_KEY = "o2h.bossOrient";  // "h" = waagerecht (Standard), "v" = hochkant
const BOSS_MINI_SIZES = { h: [1180, 84], v: [300, 430] };
const MINI_BOSSBAR_KEY = "o2h.miniBossBar";  // Boss-Liste oben in den anderen Mini-Fenstern
function bossOrient() { try { return localStorage.getItem(BOSS_ORIENT_KEY) === "v" ? "v" : "h"; } catch { return "h"; } }
const BOSS_HIDDEN_KEY = "o2h.bossHidden";   // im Mini-Fenster ausgeblendete Bosse (ids)
let bossPickMode = false;                  // „Bosse wählen“ aktiv?
function bossHidden() { try { return new Set(JSON.parse(localStorage.getItem(BOSS_HIDDEN_KEY) || "[]")); } catch { return new Set(); } }
function renderBossMini() {
  const list = document.getElementById("boss-mini-list");
  if (!list) return;
  const hidden = bossHidden();
  const shown = BOSS_SCHEDULES.filter(s => bossPickMode || !hidden.has(s.id));
  list.classList.toggle("is-picking", bossPickMode);
  list.innerHTML = shown.map(s => `
    <div class="bm-item${s.type === "world" ? " is-world" : ""}${hidden.has(s.id) ? " is-off" : ""}" data-id="${esc(s.id)}"${bossPickMode ? ` data-pick="${esc(s.id)}" role="checkbox" tabindex="0" aria-checked="${!hidden.has(s.id)}"` : ""}>
      ${bossPickMode ? `<span class="bm-eye" aria-hidden="true">${hidden.has(s.id) ? EYE_OFF_SVG : EYE_SVG}</span>` : ""}
      ${bossArt(s) ? `<span class="tick-ava"><img src="${esc(bossArt(s))}" alt=""></span>` : ""}
      <div class="min-w-0">
        <p class="tick-name" title="${esc(bossLabel(s))}">${esc(bossShort(s))}</p>
        <p class="tick-meta"><span data-at>--:--</span> · ${fmtEvery(s.every)}</p>
      </div>
      <p class="tick-count tabular-nums" data-count>--:--</p>
      ${bossPickMode ? "" : bellButton(s, true)}
    </div>`).join("") || `<p class="bm-empty">${t("boss.allHidden")}</p>`;
  const pick = document.getElementById("bm-pick");
  if (pick) {
    const n = hidden.size;
    pick.classList.toggle("is-on", bossPickMode);
    pick.innerHTML = bossPickMode ? t("boss.pickDone") : `${EYE_SVG}<span class="bm-btxt">${t("boss.pick")}</span>${n ? `<em>${t("boss.hiddenN", n)}</em>` : ""}`;
  }
  paintBells(); tick();
}
const EYE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>';
const EYE_OFF_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.6 5.1A10.6 10.6 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-2.6 3.5M6.6 6.6C3.7 8.4 2 12 2 12s3.6 7 10 7a10 10 0 0 0 5.4-1.6"/><path d="m3 3 18 18M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';
function toggleBossHidden(id) {
  const h = bossHidden(); h.has(id) ? h.delete(id) : h.add(id);
  try { localStorage.setItem(BOSS_HIDDEN_KEY, JSON.stringify([...h])); } catch {}
  renderBossMini();
}
const ORIENT_SVG = { h: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="3" width="10" height="18" rx="2"/></svg>',
                     v: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="10" rx="2"/></svg>' };
/* embedded = kompakte Boss-Liste oben in einem anderen Mini-Fenster (Upp, Skilltree, Fischpuzzle) */
function setupBossMini(embedded) {
  if (document.getElementById("boss-mini")) return;
  const box = document.createElement("div");
  box.id = "boss-mini";
  const orient = embedded ? "v" : bossOrient();
  box.className = (orient === "v" ? "bm-vertical" : "") + (embedded ? " bm-embedded" : "");
  box.innerHTML = `<div class="bm-head">
      <span class="bm-label">${t("boss.serverTime")}</span>
      <span class="ticker-clock tabular-nums" id="server-clock">--:--:--</span>
      <div class="bm-btns">
        <button type="button" class="bm-pick" id="bm-pick" title="${esc(t("boss.pick"))}"></button>
        ${embedded ? "" : `<button type="button" class="bm-pick bm-orient" id="bm-orient" title="${esc(t(orient === "v" ? "boss.toH" : "boss.toV"))}">${ORIENT_SVG[orient]}<span class="bm-btxt">${t(orient === "v" ? "boss.toHShort" : "boss.toVShort")}</span></button>`}
      </div>
    </div><div class="bm-list" id="boss-mini-list"></div>`;
  const old = document.getElementById("server-clock"); if (old) old.removeAttribute("id"); // Uhr nur einmal
  if (embedded) {
    const nav = document.querySelector(".mini-nav");
    nav ? nav.after(box) : document.body.prepend(box);
  } else {
    document.documentElement.classList.add("is-mini", "is-mini-boss");
    document.body.prepend(box);
    document.title = t("boss.title") + " · Origins2 Helper";
  }
  box.querySelector("#bm-pick").addEventListener("click", () => { bossPickMode = !bossPickMode; renderBossMini(); });
  const ob = box.querySelector("#bm-orient");
  if (ob) ob.addEventListener("click", () => {
    const next = bossOrient() === "v" ? "h" : "v";
    try { localStorage.setItem(BOSS_ORIENT_KEY, next); } catch {}
    // Fenstergröße mitziehen (klappt im Popup; im schwebenden Fenster je nach Browser)
    const [w, h] = BOSS_MINI_SIZES[next];
    try { (window.parent !== window ? window.parent : window).resizeTo(w, h); } catch {}
    box.remove(); setupBossMini(false); tick();
  });
  box.addEventListener("click", e => { const it = e.target.closest("[data-pick]"); if (it) toggleBossHidden(it.dataset.pick); });
  box.addEventListener("keydown", e => { const it = e.target.closest("[data-pick]"); if (it && (e.key === " " || e.key === "Enter")) { e.preventDefault(); toggleBossHidden(it.dataset.pick); } });
  renderBossMini();
}
/* Boss-Liste in einem anderen Mini-Fenster ein-/ausblenden */
function setMiniBossBar(on) {
  try { localStorage.setItem(MINI_BOSSBAR_KEY, on ? "1" : "0"); } catch {}
  const box = document.getElementById("boss-mini");
  if (on) { setupBossMini(true); tick(); } else if (box) box.remove();
  document.querySelectorAll("[data-bossbar]").forEach(b => b.classList.toggle("is-on", on));
}

/* ---------------- Bereich „Boss-Timer“ ---------------- */
function bossCard(s) {
  const names = s.type === "world"
    ? `<ul class="boss-names">${bossNames(s).map(b => `<li>${esc(b)}</li>`).join("")}</ul>`
    : `<p class="mt-1 text-xs text-parch-400">${esc(L(s, "maps"))}</p>`;
  return `
    <article class="boss-card panel${bossArt(s) ? " has-art" : ""}" data-id="${esc(s.id)}">
      ${bossArt(s) ? `<img class="boss-art" src="${esc(bossArt(s))}" alt="" aria-hidden="true" style="max-height:${Math.round((bossArtInfo(s).imgH || 150) * 2.1)}px">` : ""}
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="boss-kicker">${fmtEvery(s.every)}</p>
          ${s.type === "map" ? `<h3 class="boss-title">${esc(L(s, "title"))}</h3>` : ""}
          ${names}
        </div>
        <div class="flex flex-none items-center gap-2">
          <span class="boss-soon" data-soon>${t("boss.soon")}</span>
          ${bellButton(s)}
        </div>
      </div>
      <div class="mt-4 flex items-end justify-between gap-3">
        <div>
          <p class="boss-label">${t("boss.next")}</p>
          <p class="boss-at tabular-nums" data-at>--:--</p>
        </div>
        <p class="boss-count tabular-nums" data-count>--:--</p>
      </div>
      <div class="boss-bar"><span data-bar></span></div>
      <p class="boss-next tabular-nums" data-next></p>
    </article>`;
}

function renderBossBoard() {
  const w = document.getElementById("boss-world");
  const m = document.getElementById("boss-map");
  if (w) w.innerHTML = BOSS_SCHEDULES.filter(s => s.type === "world").map(bossCard).join("");
  if (m) m.innerHTML = BOSS_SCHEDULES.filter(s => s.type === "map").map(bossCard).join("");
}

/* ---------------- Sekundentakt ---------------- */
const _lastIn = {};
function tick() {
  const now = serverSecondsNow();
  const clock = document.getElementById("server-clock");
  if (clock) clock.textContent = fmtClock(now) + ":" + String(now % 60).padStart(2, "0");

  const ticker = document.getElementById("ticker-list");
  const ids = soundIds();

  BOSS_SCHEDULES.forEach(s => {
    const n = nextSpawn(s, now);
    const soon = n.inSec <= WARN_MINUTES * 60;

    document.querySelectorAll(`[data-id="${s.id}"]`).forEach(el => {
      el.classList.toggle("is-soon", soon);
      const at = el.querySelector("[data-at]"); if (at) at.textContent = fmtClock(n.atSec);
      const c = el.querySelector("[data-count]"); if (c) c.textContent = fmtCountdown(n.inSec);
      const bar = el.querySelector("[data-bar]");
      if (bar) bar.style.width = `${Math.min(100, (1 - n.inSec / n.every) * 100).toFixed(2)}%`;
      const nx = el.querySelector("[data-next]");
      if (nx && (!nx.dataset.for || nx.dataset.for !== String(n.atSec))) {
        nx.dataset.for = String(n.atSec);
        const later = upcomingTimes(s, now, 4).slice(1).map(fmtClock).join(" · ");
        nx.textContent = t("boss.then", later);
      }
    });

    // Sound nur für Weltbosse: 5-Min-Warnung und Spawn
    const prev = _lastIn[s.id];
    if (ids.has(s.id) && prev !== undefined) {
      if (prev > WARN_MINUTES * 60 && n.inSec <= WARN_MINUTES * 60) ping(false);
      if (n.inSec > prev && prev <= 3) ping(true);
    }
    _lastIn[s.id] = n.inSec;
  });

  // Live-Leiste (und Mini-Fenster) nach Restzeit sortieren
  [ticker, document.getElementById("boss-mini-list")].forEach(ticker => {
    if (!ticker) return;
    const items = [...ticker.children];
    items.sort((a, b) =>
      nextSpawn(BOSS_SCHEDULES.find(s => s.id === a.dataset.id), now).inSec -
      nextSpawn(BOSS_SCHEDULES.find(s => s.id === b.dataset.id), now).inSec);
    items.forEach((el, i) => { if (ticker.children[i] !== el) ticker.appendChild(el); });
  });
}

function initBells() {
  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-bell]");
    if (!btn) return;
    const id = btn.dataset.bell;
    const s = BOSS_SCHEDULES.find(x => x.id === id);
    const on = !isSoundOn(id);
    setSoundOn(id, on);
    paintBells();
    if (on) ping(false); // erster Klick schaltet den Ton im Browser frei
    if (typeof toast === "function") toast(on ? t("bell.toastOn", bossShort(s)) : t("bell.toastOff", bossShort(s)));
  });
  paintBells();
}

function initEvents() {
  if (BOSS_MINI) setupBossMini(false);
  else if (typeof MINI_MODE !== "undefined" && MINI_TOOLS.some(x => x.mode === MINI_MODE) && localStorage.getItem(MINI_BOSSBAR_KEY) === "1") setupBossMini(true);
  window.addEventListener("storage", e => { if (e.key === BOSS_HIDDEN_KEY) renderBossMini(); });
  renderTicker();
  renderBossBoard();
  initBells();
  window.addEventListener("langchange", () => { renderTicker(); renderBossBoard(); renderBossMini(); paintBells(); tick(); });
  const pop = document.getElementById("boss-popout");
  if (pop) pop.addEventListener("click", () => openMiniWindow("boss", "bosse", t("boss.title"), BOSS_MINI_SIZES[bossOrient()]));
  // Glocken zwischen Seite und Mini-Fenster abgleichen
  window.addEventListener("storage", e => { if (e.key === SOUND_KEY) paintBells(); });
  tick();
  // genau auf die Sekundengrenze ausrichten
  setTimeout(() => { tick(); setInterval(tick, 1000); }, 1000 - (Date.now() % 1000));
}
