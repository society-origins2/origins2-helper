/* =====================================================================
   MINISPIELE  –  Fischpuzzle-Helfer (Oberfläche)
   Regeln, Truhen-Grenzen und Löser: js/fish-solver.js
   Gerechnet wird in einem Hintergrund-Worker; während man angelt,
   werden die Antworten für alle möglichen nächsten Teile schon vorbereitet.
   ===================================================================== */

/* ---------------- Zustand ---------------- */
let fpRootEl = null;          // #fp-root – kann ins Mini-Fenster umziehen
let fpPip = null;             // offenes schwebendes Mini-Fenster (Document Picture-in-Picture)
const fpMini = new URLSearchParams(location.search).get("mini") === "fish"; // als Popup geöffnet
const fpEl = id => (fpRootEl ? fpRootEl.ownerDocument : document).getElementById(id);
const FP_KEY = "o2h.fishPuzzle";
let fp = { mask: 0, used: 0, lux: 0, pieces: [], hist: [], pick: null, sug: null };
function fpSave() { try { localStorage.setItem(FP_KEY, JSON.stringify({ mask: fp.mask, used: fp.used, lux: fp.lux, pieces: fp.pieces, hist: fp.hist, lastP: fp.lastP, lastT: fp.lastT })); } catch {} }
function fpLoad() { try { const d = JSON.parse(localStorage.getItem(FP_KEY)); if (d && typeof d.mask === "number") Object.assign(fp, d); } catch {} }

/* ---------------- Rechnen (Hintergrund-Worker mit Zwischenspeicher) ---------------- */
let fpWorker = null, fpWorkerOk = null, fpReqId = 0;
const fpPending = new Map(), fpCache = new Map();
function fpKey(kind, st, sh) { return `${kind}|${st.mask}|${st.used}|${st.lux}|${sh || 0}`; }
function fpGetWorker() {
  if (fpWorkerOk === false) return null;
  if (fpWorker) return fpWorker;
  try {
    fpWorker = new Worker("js/fish-solver.js");
    fpWorker.onmessage = e => { const cb = fpPending.get(e.data.id); if (cb) { fpPending.delete(e.data.id); cb(e.data); } };
    fpWorker.onerror = () => { fpWorkerOk = false; fpWorker = null; fpPending.forEach(cb => cb({ ok: false })); fpPending.clear(); };
    fpWorkerOk = true;
  } catch { fpWorkerOk = false; fpWorker = null; }
  return fpWorker;
}
function fpAsk(kind, st, sh) {
  const key = fpKey(kind, st, sh);
  if (fpCache.has(key)) return fpCache.get(key);
  const state = { mask: st.mask, used: st.used, lux: st.lux };
  const prom = new Promise(resolve => {
    const w = fpGetWorker();
    const local = () => setTimeout(() => resolve(kind === "lux" ? fishLuxAdvice(state) : fishDecide(state, sh)), 15);
    if (!w) return local();
    const id = ++fpReqId;
    fpPending.set(id, d => d.ok ? resolve(d.r) : local());
    w.postMessage({ id, kind, state, s: sh });
  });
  fpCache.set(key, prom);
  if (fpCache.size > 400) fpCache.delete(fpCache.keys().next().value);
  return prom;
}
/* Während man angelt: Antworten für alle möglichen nächsten Teile vorbereiten */
function fpPrefetch() {
  if (fp.mask === FULL || !fpGetWorker()) return;
  const st = { mask: fp.mask, used: fp.used, lux: fp.lux };
  if (st.lux > 0) fpAsk("lux", st);
  [5, 6, 3, 4, 1, 2].concat(st.lux > 0 ? [7] : []).forEach(sh => fpAsk("decide", st, sh));
}

function fpTier(used) { return FISH_TIERS.find(t => used <= t.max) || FISH_TIERS[FISH_TIERS.length - 1]; }

/* ---------------- Oberfläche ---------------- */
function fpShapeSvg(s, size = 9) {
  const cells = FISH_SHAPES[s];
  const w = Math.max(...cells.map(c => c[1])) + 1, h = Math.max(...cells.map(c => c[0])) + 1;
  const g = 1.5;
  return `<svg viewBox="0 0 ${w * (size + g)} ${h * (size + g)}" width="${w * (size + g)}" height="${h * (size + g)}" aria-hidden="true">${
    cells.map(([r, c]) => `<rect x="${c * (size + g)}" y="${r * (size + g)}" width="${size}" height="${size}" rx="1.5" fill="${FISH_COLORS[s]}"/>`).join("")}</svg>`;
}

function fpRender() {
  const board = fpEl("fp-board");
  if (!board) return;
  const owner = new Array(24).fill(0);
  fp.pieces.forEach(pc => { for (let i = 0; i < 24; i++) if (pc.mask >> i & 1) owner[i] = pc.s; });
  const ghost = fp.sug && !fp.sug.best.discard ? fp.sug.best.mask : 0;
  board.innerHTML = Array.from({ length: 24 }, (_, i) => {
    const s = owner[i], g = ghost >> i & 1;
    return `<button type="button" class="fp-cell${s ? " is-filled" : ""}${g ? " is-ghost" : ""}" data-i="${i}" style="${s ? `--c:${FISH_COLORS[s]}` : g ? `--c:${FISH_COLORS[fp.pick]}` : ""}" aria-label="${t("fp.cell", Math.floor(i / FW) + 1, i % FW + 1)}"></button>`;
  }).join("");

  // Status
  const free = popcount(FULL & ~fp.mask), done = fp.mask === FULL;
  const tier = fpTier(fp.used);
  fpEl("fp-used").textContent = fp.used;
  fpEl("fp-free").textContent = free;
  fpEl("fp-tier").textContent = done ? fpTier(fp.used).key : (fp.used + Math.ceil(free / 6) <= FISH_TIERS[0].max ? "L" : tier.key === "L" ? "M" : tier.key);
  fpEl("fp-tier").dataset.tier = fpEl("fp-tier").textContent;
  fpEl("fp-lux").textContent = fp.lux;

  // Teile-Auswahl
  const pieces = fpEl("fp-pieces");
  pieces.innerHTML = FISH_NORMAL.concat(fp.lux > 0 ? [7] : []).map(s =>
    `<button type="button" class="fp-piece${fp.pick === s ? " is-active" : ""}${s === 7 ? " is-lux" : ""}" data-s="${s}" ${done ? "disabled" : ""} aria-label="${t("fp.piece", s === 7 ? t("fp.luxPiece") : s)}">${fpShapeSvg(s)}${s === 7 ? `<span>${t("fp.lux")}</span>` : ""}</button>`).join("");

  // Hinweis / Vorschlag
  const out = fpEl("fp-advice");
  if (done) {
    const tk = fpTier(fp.used).key;
    out.innerHTML = `<div class="fp-done"><p class="font-display text-lg text-parch-100">${t("fp.doneTitle")}</p><p class="mt-1 text-sm text-parch-300">${t("fp.doneText", fp.used, tk)}</p></div>`;
  } else if (fp.busy) {
    out.innerHTML = `<p class="fp-think"><span class="fp-spin"></span>${t("fp.thinking")}</p>`;
  } else if (fp.sug) {
    const b = fp.sug.best;
    const chance = fp.sug.p != null ? t("fp.chance", fp.sug.target, Math.round(fp.sug.p * 100)) : t("fp.expect", fp.sug.e != null ? Math.round(fp.sug.e) : "?");
    out.innerHTML = `
      <p class="fp-advice-title">${b.discard ? t("fp.sugDiscard") : t("fp.sugPlace")}</p>
      <p class="fp-advice-sub">${chance}</p>
      <div class="fp-advice-btns">
        ${b.discard ? `<button type="button" class="btn-gold" data-fp="discard">${t("fp.didDiscard")}</button>` :
          `<button type="button" class="btn-gold" data-fp="place">${t("fp.didPlace")}</button>
           <button type="button" class="btn-ghost-sq" data-fp="discard">${t("fp.discardAnyway")}</button>`}
        <button type="button" class="btn-ghost-sq" data-fp="cancel">${t("fp.otherPiece")}</button>
      </div>
      <p class="fp-advice-hint">${t("fp.manualHint")}</p>`;
  } else {
    let tip = "";
    const adv = fp.lux > 0 ? fp.adv : null;
    if (adv) tip = `<p class="fp-tip">✦ ${adv.useLux ? t("fp.luxNow") : t("fp.luxLater")}</p>`;
    const pl = fp.lastP != null ? `<p class="fp-advice-sub">${t("fp.chance", fp.lastT || "L", Math.round(fp.lastP * 100))}</p>` : "";
    out.innerHTML = `<p class="fp-advice-title">${fp.used ? t("fp.next") : t("fp.start")}</p><p class="fp-advice-sub">${t("fp.pickHint")}</p>${pl}${tip}`;
  }
  fpEl("fp-undo").disabled = !fp.hist.length;
}

function fpPick(s) {
  if (fp.mask === FULL) return;
  const st = { mask: fp.mask, used: fp.used, lux: fp.lux };
  fp.pick = s; fp.sug = null; fp.busy = true; fpRender();
  const token = fpKey("decide", st, s);
  fpAsk("decide", st, s).then(r => {
    if (fp.pick !== s || fpKey("decide", fp, s) !== token) return;
    fp.sug = r; fp.busy = false; fpRender();
  });
}
function fpAfterChange() {
  fp.adv = null;
  fpRender();
  if (fp.lux > 0 && fp.mask !== FULL) {
    const st = { mask: fp.mask, used: fp.used, lux: fp.lux }, key = fpKey("lux", st);
    fpAsk("lux", st).then(r => { if (fpKey("lux", fp) === key) { fp.adv = r; if (!fp.pick) fpRender(); } });
  }
  if (fpVisible()) setTimeout(fpPrefetch, 30);
}
function fpVisible() { if (fpPip || fpMini) return true; const v = document.querySelector('[data-view="event-helper"]'); return v && !v.hidden; }

function fpApply(mask) {
  const s = fp.pick;
  fp.hist.push({ mask: fp.mask, used: fp.used, lux: fp.lux, pieces: fp.pieces.slice(), lastP: fp.lastP, lastT: fp.lastT });
  if (fp.hist.length > 60) fp.hist.shift();
  const followed = fp.sug && fp.sug.best.mask === mask;
  fp.lastP = followed ? fp.sug.p : null; fp.lastT = fp.sug ? fp.sug.target : null;
  fp.used++;
  if (s === 7) fp.lux = Math.max(0, fp.lux - 1);
  if (mask) { fp.mask |= mask; fp.pieces.push({ s, mask }); }
  fp.pick = null; fp.sug = null;
  fpSave(); fpAfterChange();
}

function fpManual(i) {
  if (!fp.pick || fp.busy) return;
  // Tippen = Teil so legen, dass seine erste Zelle hier liegt; sonst eine passende Lage, die das Feld abdeckt
  let p = FISH_PL[fp.pick].find(q => q.at === i && !(q.mask & fp.mask));
  if (!p) p = FISH_PL[fp.pick].find(q => (q.mask >> i & 1) && !(q.mask & fp.mask));
  if (!p) { if (typeof toast === "function") toast(t("fp.noFit")); return; }
  fpApply(p.mask);
}

function initFishPuzzle() {
  const root = document.getElementById("fp-root");
  if (!root) return;
  fpRootEl = root;
  fpLoad();
  root.addEventListener("click", e => {
    const pc = e.target.closest(".fp-piece"); if (pc) { fpPick(+pc.dataset.s); return; }
    const cell = e.target.closest(".fp-cell"); if (cell) { fpManual(+cell.dataset.i); return; }
    const a = e.target.closest("[data-fp]"); if (!a) return;
    const act = a.dataset.fp;
    if (act === "place" && fp.sug) fpApply(fp.sug.best.mask);
    else if (act === "discard") fpApply(0);
    else if (act === "cancel") { fp.pick = null; fp.sug = null; fpRender(); }
  });
  fpEl("fp-undo").addEventListener("click", () => {
    const h = fp.hist.pop(); if (!h) return;
    Object.assign(fp, h); fp.pick = null; fp.sug = null; fpSave(); fpAfterChange();
  });
  fpEl("fp-reset").addEventListener("click", () => {
    const lux = fp.lux;
    fp = { mask: 0, used: 0, lux, pieces: [], hist: [], pick: null, sug: null, lastP: null }; fpSave(); fpAfterChange();
  });
  fpEl("fp-lux-minus").addEventListener("click", () => { fp.lux = Math.max(0, fp.lux - 1); fp.sug = null; fp.pick = null; fpSave(); fpAfterChange(); });
  fpEl("fp-lux-plus").addEventListener("click", () => { fp.lux = Math.min(3, fp.lux + 1); fp.sug = null; fp.pick = null; fpSave(); fpAfterChange(); });
  // Handy: Vorschlag direkt unter dem Brett zeigen, PC: in der Seitenleiste
  const adv = fpEl("fp-advice"), side = root.querySelector(".fp-side"), board = fpEl("fp-board");
  const mq = window.matchMedia("(min-width: 900px)");
  const place = () => {
    const small = fpPip || fpMini || !mq.matches;
    if (small) board.after(adv); else side.prepend(adv);
    adv.classList.toggle("is-inline", small);
  };
  fpPlace = place;
  (mq.addEventListener ? mq.addEventListener("change", place) : mq.addListener(place)); place();
  window.addEventListener("langchange", fpRender);
  // Mini-Fenster
  const pop = fpEl("fp-popout");
  if (pop) pop.addEventListener("click", fpOpenMini);
  if (fpMini) fpSetupPopup();
  // Popup und Hauptseite teilen sich den Spielstand (localStorage) → gegenseitig aktuell halten
  window.addEventListener("storage", e => {
    if (e.key !== FP_KEY) return;
    fpLoad(); fp.pick = null; fp.sug = null; fp.busy = false; fpAfterChange();
  });
  window.addEventListener("hashchange", () => setTimeout(() => { if (fpVisible()) fpPrefetch(); }, 60));
  fpAfterChange();
}

/* ---------------- Mini-Fenster (für Spieler mit nur einem Bildschirm) ----------------
   openMiniWindow() aus upp.js: Chrome/Edge schwebendes Fenster über dem Spiel, sonst Popup.
   Darin läuft diese Seite mit ?mini=fish – Spielstand wird über localStorage geteilt. */
let fpPlace = () => {};

function fpOpenMini() { return openMiniWindow("fish", "event-helper", t("fp.title")); }

function fpSetupPopup() {
  const root = fpRootEl;
  root.classList.add("is-mini");
  const shell = document.createElement("div"); shell.className = "fp-mini-shell";
  Array.from(document.body.children).forEach(n => { if (n.id !== "toast" && n.id !== "boss-mini" && n.tagName !== "SCRIPT" && !n.classList.contains("mini-nav")) n.style.display = "none"; });
  shell.appendChild(root); document.body.prepend(shell);
  const nav = document.querySelector(".mini-nav"); if (nav) document.body.prepend(nav);
  const bm = document.getElementById("boss-mini"); if (bm && nav) nav.after(bm);
  document.body.classList.add("fp-mini-body");
  document.title = t("fp.title") + " · Origins2 Helper";
  fpPlace();
}
