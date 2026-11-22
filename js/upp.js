/* =====================================================================
   Origins2 Helper – Upp-Kalkulator
   Daten kommen aus js/data.js (UPGRADE_LINES, MATERIALS, WEAPONS)
   Hier muss normalerweise nichts geändert werden.
   ===================================================================== */

const UPP_RUNS = 10000;
const PRICE_KEY = "o2h.marketPrices";
const UPP_STATE_KEY = "o2h.uppState";
/* ---------------- Mini-Fenster: Umschalt-Leiste ----------------
   Alle Mini-Fenster (?mini=upp|skill|fish) bekommen oben eine Leiste, um direkt zu wechseln. */
const MINI_TOOLS = [
  { mode: "upp",   hash: "upp-rechner",  key: "mini.upp" },
  { mode: "skill", hash: "skilltree",    key: "mini.skill" },
  { mode: "fish",  hash: "event-helper", key: "mini.fish" }
];
const MINI_W = 470, MINI_H = 800;   // gleiche Größe für alle, damit das Wechseln passt
const MINI_MODE = new URLSearchParams(location.search).get("mini");
function miniUrl(mode, hash) { return location.pathname + "?mini=" + mode + "&lang=" + (typeof LANG !== "undefined" ? LANG : "de") + "#" + hash; }
function buildMiniNav() {
  if (!MINI_TOOLS.some(x => x.mode === MINI_MODE)) return;
  const nav = document.createElement("nav");
  nav.className = "mini-nav";
  const draw = () => { nav.innerHTML = MINI_TOOLS.map(x =>
    `<a href="${miniUrl(x.mode, x.hash)}"${x.mode === MINI_MODE ? ' class="is-active" aria-current="page"' : ""}>${t(x.key)}</a>`).join(""); };
  draw(); window.addEventListener("langchange", draw);
  document.body.prepend(nav);
  document.documentElement.classList.add("is-mini");
}
buildMiniNav();

/* Kompakte Nur-Rechner-Ansicht für das Mini-Fenster (?mini=upp) */
const UPP_MINI = new URLSearchParams(location.search).get("mini") === "upp";
if (UPP_MINI) document.documentElement.classList.add("is-mini-upp");
const LIST_VIEW_KEY = "o2h.listView";   // "grid" (Kacheln, Standard) oder "table"
const PRICE_EDIT_KEY = "o2h.priceEdit"; // Preisfelder in den Kacheln sichtbar?
const BOUGHT_KEY = "o2h.bought";        // abgehakte (gekaufte) Materialien pro Auswahl: { "reihe|start|ziel": ["mat-01", …] }
let uppJustBought = null; // nur die gerade abgehakte Kachel bekommt den Stift-Strich animiert
function loadBought() { try { return JSON.parse(localStorage.getItem(BOUGHT_KEY) || "{}"); } catch { return {}; } }
function saveBought(b) {
  const keys = Object.keys(b); if (keys.length > 30) keys.slice(0, keys.length - 30).forEach(k => delete b[k]); // nur die letzten 30 Auswahlen merken
  lsSet(BOUGHT_KEY, JSON.stringify(b));
}
function lsGet(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : v; } catch { return d; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); } catch {} }

/* ---------------- Hilfsfunktionen ---------------- */
function itemInfo(id) {
  return (typeof MATERIALS !== "undefined" && MATERIALS[id]) ||
         (typeof WEAPONS !== "undefined" && WEAPONS[id]) ||
         (typeof ARMORS !== "undefined" && ARMORS[id]) || { name: "", icon: "" };
}
function itemName(id) {
  const n = L(itemInfo(id));
  return n || t("upp.unknown", id);
}
function uEsc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* Metin2-Schreibweise: 500k, 1.5kk, 2.3kkk */
function fmtYang(v) {
  v = Math.round(v);
  const units = [[1e9, "kkk"], [1e6, "kk"], [1e3, "k"]];
  for (const [n, u] of units) {
    if (Math.abs(v) >= n) {
      const x = v / n;
      const s = x >= 100 ? Math.round(x).toString() : (Math.round(x * 100) / 100).toString();
      return (LANG === "de" ? s.replace(".", ",") : s) + u;
    }
  }
  return String(v);
}
function fmtNum(v) { return Math.round(v).toLocaleString(LANG === "de" ? "de-DE" : "en-US"); }

/* „1,5kk“, „500k“, „1200000“ → Zahl */
function parseYang(str) {
  if (str == null) return 0;
  let s = String(str).trim().toLowerCase().replace(/\s/g, "").replace(",", ".");
  if (!s) return 0;
  let mul = 1;
  const m = s.match(/(k+)$/);
  if (m) { mul = Math.pow(1000, m[1].length); s = s.slice(0, -m[1].length); }
  else s = s.replace(/\./g, "");
  const n = parseFloat(s);
  return isFinite(n) ? n * mul : 0;
}

function loadPrices() { try { return JSON.parse(localStorage.getItem(PRICE_KEY) || "{}"); } catch { return {}; } }
function savePrices(p) { try { localStorage.setItem(PRICE_KEY, JSON.stringify(p)); } catch {} }
/* Preisfeld mit ×-Knopf zum Löschen – benutzt von Upp-Kalkulator und Skilltree */
function priceField(id, prices) {
  const p = prices[id] || 0;
  return `<span class="price-wrap"><input type="text" inputmode="decimal" value="${p ? uEsc(fmtYang(p)) : ""}" placeholder="${uEsc(t("upp.price"))}" data-price="${uEsc(id)}" aria-label="${uEsc(t("upp.priceAria", itemName(id)))}">${
    p ? `<button type="button" class="price-clear" data-clear="${uEsc(id)}" aria-label="${uEsc(t("upp.priceClear"))}" title="${uEsc(t("upp.priceClear"))}"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="m6 6 8 8M14 6l-8 8"/></svg></button>` : ""}</span>`;
}
/* Preisfelder in einem Bereich verdrahten; danach rerender() (+ den jeweils anderen Rechner auffrischen) */
function wirePriceFields(root, rerender) {
  const after = () => { rerender(); refreshOtherCalc(rerender); };
  root.querySelectorAll("[data-price]").forEach(inp => inp.addEventListener("change", () => {
    const pr = loadPrices(), v = parseYang(inp.value);
    if (v > 0) pr[inp.dataset.price] = v; else delete pr[inp.dataset.price];
    savePrices(pr); after();
  }));
  root.querySelectorAll("[data-clear]").forEach(btn => btn.addEventListener("click", e => {
    e.stopPropagation();
    const pr = loadPrices(); delete pr[btn.dataset.clear]; savePrices(pr); after();
    const f = root.querySelector(`[data-price="${CSS.escape(btn.dataset.clear)}"]`); if (f) f.focus({ preventScroll: true });
  }));
}
function refreshOtherCalc(from) {
  if (from !== renderResult && document.getElementById("upp-result") && uppLast) renderResult();
  if (typeof stRenderResult === "function" && from !== stRenderResult) stRenderResult();
}

/* ---------------- Simulation ---------------- */
/* Position = Stufe * 10 + Level (+0 … +9) */
function simulateOnce(line, from, to, downgrade, rnd) {
  const mats = {}; let yang = 0, attempts = 0, fails = 0;
  const failCount = {};
  let cur = from;
  const add = m => { for (const id in m) mats[id] = (mats[id] || 0) + m[id]; };
  let guard = 0;
  while (cur < to && guard++ < 100000) {
    const s = Math.floor(cur / 10), lvl = cur % 10;
    if (lvl === 9) {
      const c = line.stages[s + 1].craft || { yang: 0, mats: {} };
      yang += c.yang || 0; add(c.mats || {});
      cur = (s + 1) * 10;
      continue;
    }
    const up = line.stages[s].ups[lvl];
    yang += up.yang; add(up.mats); attempts++;
    const key = cur;
    const pityHit = up.pity != null && (failCount[key] || 0) >= up.pity;
    if (pityHit || rnd() * 100 < up.chance) {
      failCount[key] = 0; cur++;
    } else {
      fails++;
      failCount[key] = (failCount[key] || 0) + 1;
      if (downgrade && lvl > 0) cur--;
    }
  }
  return { mats, yang, attempts, fails };
}

function minimumCost(line, from, to) {
  return simulateOnce(line, from, to, false, () => 0); // jeder Versuch gelingt
}

function percentile(sorted, p) {
  if (!sorted.length) return 0;
  const i = Math.min(sorted.length - 1, Math.ceil(p * sorted.length) - 1);
  return sorted[Math.max(0, i)];
}

function runSimulation(line, from, to, downgrade) {
  const matIds = new Set();
  const runs = [];
  for (let i = 0; i < UPP_RUNS; i++) {
    const r = simulateOnce(line, from, to, downgrade, Math.random);
    Object.keys(r.mats).forEach(id => matIds.add(id));
    runs.push(r);
  }
  const min = minimumCost(line, from, to);
  Object.keys(min.mats).forEach(id => matIds.add(id));
  const ids = [...matIds];
  const avg = { mats: {}, yang: 0, attempts: 0, fails: 0 };
  const p90 = { mats: {}, yang: 0, attempts: 0, fails: 0 };
  const col = key => runs.map(r => r[key]).sort((a, b) => a - b);
  for (const key of ["yang", "attempts", "fails"]) {
    const arr = col(key);
    avg[key] = arr.reduce((a, b) => a + b, 0) / arr.length;
    p90[key] = percentile(arr, 0.9);
  }
  for (const id of ids) {
    const arr = runs.map(r => r.mats[id] || 0).sort((a, b) => a - b);
    avg.mats[id] = arr.reduce((a, b) => a + b, 0) / arr.length;
    p90.mats[id] = percentile(arr, 0.9);
  }
  return { ids, min, avg, p90 };
}

/* Reihenfolge der Materialien: wie sie im Weg zuerst vorkommen */
function orderedMatIds(line, from, to, ids) {
  const order = [];
  for (let cur = from; cur < to; cur++) {
    const s = Math.floor(cur / 10), lvl = cur % 10;
    const m = lvl === 9 ? (line.stages[s + 1].craft || {}).mats || {} : line.stages[s].ups[lvl].mats;
    Object.keys(m).forEach(id => { if (!order.includes(id)) order.push(id); });
  }
  ids.forEach(id => { if (!order.includes(id)) order.push(id); });
  return order;
}

/* ---------------- Oberfläche ---------------- */
let uppLast = null;

function uppState() {
  try { return JSON.parse(localStorage.getItem(UPP_STATE_KEY) || "{}"); } catch { return {}; }
}
function saveUppState(s) { try { localStorage.setItem(UPP_STATE_KEY, JSON.stringify(s)); } catch {} }

function posLabel(line, pos) {
  const s = line.stages[Math.floor(pos / 10)];
  return `${itemName(s.item)} +${pos % 10}`;
}

function fillPosSelect(sel, line, minPos, maxPos, value) {
  const groups = line.stages.map((s, si) => {
    const opts = [];
    for (let l = 0; l <= 9; l++) {
      const p = si * 10 + l;
      if (p < minPos || p > maxPos) continue;
      opts.push(`<option value="${p}"${p === value ? " selected" : ""}>${uEsc(itemName(s.item))} +${l}</option>`);
    }
    return opts.length ? `<optgroup label="${uEsc(itemName(s.item))} · ${uEsc(t("upp.fromLv", s.minLevel))}">${opts.join("")}</optgroup>` : "";
  });
  sel.innerHTML = groups.join("");
}

function renderChain(line, from, to) {
  const el = document.getElementById("upp-chain");
  if (!el) return;
  const fs = Math.floor(from / 10), ts = Math.floor(to / 10);
  el.innerHTML = line.stages.map((s, i) => {
    const active = i >= fs && i <= ts;
    const info = itemInfo(s.item);
    return `${i ? `<span class="chain-arrow${i > fs && i <= ts ? " is-on" : ""}" aria-hidden="true">›</span>` : ""}
      <div class="chain-item${active ? " is-on" : ""}">
        <span class="chain-ico"><img src="${uEsc(info.icon)}" alt=""></span>
        <span class="chain-name">${uEsc(itemName(s.item))}</span>
        <span class="chain-lv">${t("upp.fromLv", s.minLevel)}</span>
      </div>`;
  }).join("");
}

function scenarioCard(title, sub, data, matValue, cls) {
  const total = data.yang + matValue;
  return `
    <article class="scen panel ${cls}">
      <p class="scen-title">${title}</p>
      <p class="scen-sub">${sub}</p>
      <p class="scen-yang tabular-nums">${fmtYang(data.yang)} <span>${t("upp.yangLabel")}</span></p>
      <dl class="scen-facts">
        <div><dt>${t("upp.attempts")}</dt><dd class="tabular-nums">${fmtNum(data.attempts)}</dd></div>
        <div><dt>${t("upp.fails")}</dt><dd class="tabular-nums">${fmtNum(data.fails)}</dd></div>
      </dl>
      ${matValue > 0 ? `<p class="scen-total">${t("upp.inclMat")} <b class="tabular-nums">${fmtYang(total)}</b></p>` : ""}
    </article>`;
}

function matValueOf(mats, prices) {
  let v = 0;
  for (const id in mats) v += (prices[id] || 0) * mats[id];
  return v;
}

function currentCat() { return document.querySelector('input[name="upp-cat"]:checked')?.value || "pvp"; }
let uppSlot = "weapon", uppClass = "warrior";
function slotBound(slot) { return !!(EQUIP_SLOTS[slot] && EQUIP_SLOTS[slot].classBound); }
function filterLabel() {
  const parts = [currentCat() === "pvm" ? "PvM" : "PvP", L(EQUIP_SLOTS[uppSlot])];
  if (slotBound(uppSlot)) parts.push(L(CLASSES[uppClass]));
  return parts.join(" · ");
}
function lineMatches(line) {
  if ((line.category || "pvp") !== currentCat()) return false;
  if ((line.slot || "weapon") !== uppSlot) return false;
  if (slotBound(uppSlot)) return !line.classes || line.classes.includes(uppClass);
  return true;
}

function renderResult() {
  const out0 = document.getElementById("upp-result");
  const lineId = document.getElementById("upp-line").value;
  if (!lineId || !UPGRADE_LINES[lineId]) {
    out0.innerHTML = `<p class="upp-empty panel">${t("upp.noLines", filterLabel())}</p>`;
    const ch = document.getElementById("upp-chain"); if (ch) ch.innerHTML = "";
    uppLast = null;
    return;
  }
  const line = UPGRADE_LINES[lineId];
  const from = +document.getElementById("upp-from").value;
  const to = +document.getElementById("upp-to").value;
  const downgrade = false; // Society-Regel: immer Magischer Stein → Stufe bleibt
  const out = document.getElementById("upp-result");
  renderChain(line, from, to);
  saveUppState({ line: lineId, cat: currentCat(), slot: uppSlot, cls: uppClass, from, to, downgrade });

  if (to <= from) {
    out.innerHTML = `<p class="upp-empty">${t("upp.chooseHigher")}</p>`;
    uppLast = null; return;
  }
  const res = runSimulation(line, from, to, downgrade);
  const prices = loadPrices();
  const ids = orderedMatIds(line, from, to, res.ids);
  uppLast = { line, from, to, downgrade, res, ids };

  /* Anzeige-Reihenfolge: sind Preise eingetragen, stehen die teuersten Materialien (Kosten der Mindestmenge) oben */
  const avgQty = id => Math.ceil(res.avg.mats[id] || 0);
  const minQty = id => res.min.mats[id] || 0;   // Kacheln zeigen die Mindestmenge (nicht zu viel kaufen)
  const costOf = id => (prices[id] || 0) * (res.min.mats[id] || 0);
  const anyPrice = ids.some(id => prices[id] > 0);
  const viewIds = anyPrice ? ids.map((id, n) => ({ id, n })).sort((a, b) => (costOf(b.id) - costOf(a.id)) || (a.n - b.n)).map(o => o.id) : ids;
  const view = lsGet(LIST_VIEW_KEY, "grid") === "table" ? "table" : "grid";
  const boughtKey = `${lineId}|${from}|${to}`;
  const bought = new Set((loadBought()[boughtKey] || []).filter(id => ids.includes(id)));
  const nBought = bought.size;
  const openCost = ids.reduce((a, id) => a + (bought.has(id) ? 0 : (prices[id] || 0) * (res.min.mats[id] || 0)), 0);
  const checkMark = `<span class="mg-check" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m4.5 10.5 3.5 3.5 7.5-8"/></svg></span>`;
  const editPrices = lsGet(PRICE_EDIT_KEY, "0") === "1";
  const priceInput = id => priceField(id, prices);

  const rows = viewIds.map(id => {
    const info = itemInfo(id);
    const p = prices[id] || 0;
    return `
      <tr data-mat="${uEsc(id)}" class="${bought.has(id) ? "is-bought" : ""}${id === uppJustBought ? " just-bought" : ""}" data-buy="${uEsc(id)}" title="${uEsc(t("upp.buyToggle"))}">
        <td class="mt-item"><span class="mt-ico">${checkMark}<img src="${uEsc(info.icon)}" alt=""></span><span class="mt-name${info.name ? "" : " is-unknown"}">${uEsc(itemName(id))}</span></td>
        <td class="tabular-nums">${fmtNum(res.min.mats[id] || 0)}</td>
        <td class="tabular-nums is-main">${fmtNum(avgQty(id))}</td>
        <td class="tabular-nums">${fmtNum(res.p90.mats[id] || 0)}</td>
        <td class="mt-price">${priceInput(id)}</td>
        <td class="tabular-nums mt-sum" data-sum>${p ? fmtYang(p * avgQty(id)) : "–"}</td>
      </tr>`;
  }).join("");

  const tiles = viewIds.map(id => {
    const info = itemInfo(id);
    const p = prices[id] || 0;
    return `
      <li class="mg-tile${bought.has(id) ? " is-bought" : ""}${id === uppJustBought ? " just-bought" : ""}" data-mat="${uEsc(id)}" data-buy="${uEsc(id)}" role="checkbox" tabindex="0" aria-checked="${bought.has(id)}" title="${uEsc(t("upp.buyToggle"))}">
        <span class="mt-ico">${checkMark}<img src="${uEsc(info.icon)}" alt=""></span>
        <span class="mg-name${info.name ? "" : " is-unknown"}" title="${uEsc(itemName(id))}">${uEsc(itemName(id))}</span>
        <span class="mg-side tabular-nums">${t("upp.colAvg")} ${fmtNum(avgQty(id))} · ${t("upp.colP90")} ${fmtNum(res.p90.mats[id] || 0)}</span>
        <span class="mg-avg tabular-nums"><small>${t("upp.colMin")}</small>${fmtNum(minQty(id))}×</span>
        ${editPrices ? `<div class="mg-price mt-price">${priceInput(id)}<span class="mg-cost tabular-nums">${p ? "= " + fmtYang(p * minQty(id)) : ""}</span></div>`
          : (p ? `<div class="mg-costline tabular-nums">${fmtYang(p)} / ${t("upp.pcs")} · <b>${fmtYang(p * minQty(id))}</b></div>` : "")}
      </li>`;
  }).join("");

  const listBody = !ids.length ? `<p class="upp-empty">${t("upp.noMats")}</p>`
    : view === "table" ? `
      <div class="mt-scroll">
        <table class="mat-table">
          <thead><tr><th>${t("upp.colMat")}</th><th>${t("upp.colMin")}</th><th class="is-main">${t("upp.colAvg")}</th><th>${t("upp.colP90")}</th><th>${t("upp.colPrice")}</th><th>${t("upp.colCost")}</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`
    : `<ul class="mat-grid${editPrices ? " is-edit" : ""}">${tiles}</ul>`;

  const vMin = matValueOf(res.min.mats, prices), vAvg = matValueOf(res.avg.mats, prices), vP90 = matValueOf(res.p90.mats, prices);

  out.innerHTML = `
    <div class="grid gap-4 md:grid-cols-3">
      ${scenarioCard(t("upp.min"), t("upp.minSub"), res.min, vMin, "")}
      ${scenarioCard(t("upp.avg"), t("upp.avgSub", fmtNum(UPP_RUNS)), res.avg, vAvg, "is-main")}
      ${scenarioCard(t("upp.p90"), t("upp.p90Sub"), res.p90, vP90, "")}
    </div>

    <div class="panel mt-4 overflow-hidden">
      <div class="mt-head">
        <div>
          <h3 class="sub-title">${t("upp.list")} <span class="mt-count">${fmtNum(ids.length)}</span></h3>
          ${ids.length ? `<p class="mt-progress">
            <span class="mt-bar" style="--p:${Math.round(nBought / ids.length * 100)}%"></span>
            <span>${nBought === ids.length ? t("upp.allBought") : t("upp.boughtOf", nBought, ids.length)}${anyPrice && nBought < ids.length ? ` · ${t("upp.openCost", fmtYang(openCost))}` : ""}</span>
            ${nBought ? `<button type="button" class="mt-reset" id="upp-bought-reset">${t("upp.boughtReset")}</button>` : ""}</p>` : ""}
          ${anyPrice ? `<p class="mt-sorted">${t("upp.sortedByCost")}</p>` : ""}
        </div>
        <div class="mt-tools">
          ${view === "grid" ? `<button type="button" class="btn-ghost-sq mt-edit${editPrices ? " is-on" : ""}" id="upp-edit-prices" aria-pressed="${editPrices}">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            ${editPrices ? t("upp.editDone") : `<span class="hide-xs">${t("upp.editPrices")}</span><span class="show-xs">${t("upp.editPricesShort")}</span>`}</button>` : ""}
          <div class="seg seg-sm" role="radiogroup" aria-label="${uEsc(t("upp.view"))}">
            <label><input type="radio" name="list-view" value="grid"${view === "grid" ? " checked" : ""}><span>${t("upp.viewGrid")}</span></label>
            <label><input type="radio" name="list-view" value="table"${view === "table" ? " checked" : ""}><span>${t("upp.viewTable")}</span></label>
          </div>
        </div>
      </div>
      ${view === "table" || editPrices ? `<p class="mt-hint">${t("upp.priceHint")}</p>` : ""}
      ${listBody}
    </div>

    <div class="dl-bar panel mt-4">
      <div class="dl-left">
        <span class="field-label">${t("upp.dl")}</span>
        <div class="seg seg-sm" role="radiogroup" aria-label="${uEsc(t("upp.dl"))}">
          ${[["min",t("upp.dlMin")],["avg",t("upp.dlAvg")],["p90",t("upp.dlP90")]].map(([v,l]) =>
            `<label><input type="radio" name="dl-mode" value="${v}"${dlMode() === v ? " checked" : ""}><span>${l}</span></label>`).join("")}
        </div>
      </div>
      <div class="dl-actions">
        <button type="button" class="btn-gold py-2.5" id="upp-dl-png">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/></svg>
          ${t("upp.dlPng")}
        </button>
        <button type="button" class="btn-ghost-sq" id="upp-dl-txt">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z"/><path d="M14 3v6h6M8 13h8M8 17h5"/></svg>
          ${t("upp.dlTxt")}
        </button>
        <button type="button" class="btn-ghost-sq" id="upp-share">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>
          ${t("upp.shareLink")}
        </button>
        <button type="button" class="btn-ghost-sq" id="upp-copy" title="${uEsc(t("upp.discordTitle"))}">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.3 4.4A19.6 19.6 0 0 0 15.4 3l-.6 1.3a18 18 0 0 0-5.6 0L8.6 3a19.5 19.5 0 0 0-4.9 1.4C.6 9 0 13.6.3 18.1A19.8 19.8 0 0 0 6.3 21l1.3-2a12.6 12.6 0 0 1-2-1l.5-.4a14 14 0 0 0 11.8 0l.5.4c-.6.4-1.3.7-2 1l1.3 2a19.7 19.7 0 0 0 6-3c.4-5.2-.7-9.8-3.4-13.6ZM8.7 15.3c-1.2 0-2.1-1-2.1-2.3s.9-2.3 2.1-2.3 2.2 1 2.1 2.3c0 1.3-.9 2.3-2.1 2.3Zm6.6 0c-1.2 0-2.1-1-2.1-2.3s.9-2.3 2.1-2.3 2.2 1 2.1 2.3c0 1.3-.9 2.3-2.1 2.3Z"/></svg>
          ${t("upp.discord")}
        </button>
      </div>
    </div>
    <p class="mt-2 text-xs text-parch-500">${t("upp.footnote")}</p>`;

  wirePriceFields(out, renderResult);
  // Abhaken: Klick auf Kachel/Zeile (nicht auf ein Preisfeld) = gekauft / nicht gekauft
  const toggleBought = id => {
    const all = loadBought(), set = new Set(all[boughtKey] || []);
    set.has(id) ? set.delete(id) : set.add(id);
    uppJustBought = set.has(id) ? id : null;
    delete all[boughtKey]; if (set.size) all[boughtKey] = [...set];
    saveBought(all); renderResult(); uppJustBought = null;
  };
  out.querySelectorAll("[data-buy]").forEach(el => {
    el.addEventListener("click", e => { if (e.target.closest("input, button, a")) return; toggleBought(el.dataset.buy); });
    el.addEventListener("keydown", e => { if ((e.key === " " || e.key === "Enter") && e.target === el) { e.preventDefault(); toggleBought(el.dataset.buy); } });
  });
  const resetB = document.getElementById("upp-bought-reset");
  if (resetB) resetB.addEventListener("click", () => { const all = loadBought(); delete all[boughtKey]; saveBought(all); renderResult(); });
  out.querySelectorAll('input[name="list-view"]').forEach(r => r.addEventListener("change", () => { lsSet(LIST_VIEW_KEY, r.value); renderResult(); }));
  const editBtn = document.getElementById("upp-edit-prices");
  if (editBtn) editBtn.addEventListener("click", () => {
    const on = lsGet(PRICE_EDIT_KEY, "0") !== "1";
    lsSet(PRICE_EDIT_KEY, on ? "1" : "0");
    renderResult();
    if (on) { const f = out.querySelector(".mat-grid [data-price]"); if (f) f.focus({ preventScroll: true }); }
  });
  document.getElementById("upp-copy").addEventListener("click", copyDiscord);
  document.getElementById("upp-dl-png").addEventListener("click", downloadPng);
  document.getElementById("upp-dl-txt").addEventListener("click", downloadTxt);
  document.getElementById("upp-share").addEventListener("click", shareUpp);
  out.querySelectorAll('input[name="dl-mode"]').forEach(r => r.addEventListener("change", () => setDlMode(r.value)));
}

function discordText() {
  if (!uppLast) return "";
  const { line, from, to, downgrade, res, ids } = uppLast;
  const prices = loadPrices();
  const L = [];
  L.push(`**${lineName(line)}: ${posLabel(line, from)} → ${posLabel(line, to)}**`);
  L.push(t("upp.discordRule"));
  L.push("");
  L.push(t("upp.discordYang", fmtYang(res.min.yang), fmtYang(res.avg.yang), fmtYang(res.p90.yang)));
  L.push("");
  L.push(t("upp.discordList"));
  ids.forEach(id => {
    const m = res.min.mats[id] || 0, a = Math.ceil(res.avg.mats[id] || 0), p = res.p90.mats[id] || 0;
    const pr = prices[id] ? ` · à ${fmtYang(prices[id])}` : "";
    L.push(`• ${itemName(id)}: **${fmtNum(m)}** · ${fmtNum(a)} · ${fmtNum(p)}${pr}`);
  });
  const vAvg = matValueOf(res.avg.mats, prices);
  if (vAvg > 0) { L.push(""); L.push(t("upp.discordTotal", fmtYang(res.avg.yang + vAvg))); }
  L.push("");
  L.push("_Origins2 Helper by Society_");
  return L.join("\n");
}

async function copyDiscord(e) {
  const text = discordText();
  const ok = typeof copyText === "function" ? await copyText(text) : false;
  if (typeof toast === "function") toast(ok ? t("upp.discordOk") : t("upp.discordFail"));
  const b = e.currentTarget;
  if (ok) { b.classList.add("is-done"); setTimeout(() => b.classList.remove("is-done"), 1600); }
}

function lineName(line) { return L(line); }

/* ---------------- Link teilen ---------------- */
function shareUrl(params) {
  const u = new URL(location.href);
  u.search = "";
  Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
  return u.toString();
}
async function shareLinkOrCopy(url, text) {
  try {
    if (navigator.share) { await navigator.share({ title: "Origins2 Helper by Society", text, url }); return; }
  } catch (e) { if (e && e.name === "AbortError") return; }
  const ok = typeof copyText === "function" ? await copyText(url) : false;
  if (typeof toast === "function") toast(ok ? t("share.copied") : t("share.failed"));
}
function shareUpp() {
  if (!uppLast) return;
  const { from, to } = uppLast;
  const url = shareUrl({ line: document.getElementById("upp-line").value, from, to, lang: LANG }).replace(/#.*$/, "") + "#upp-rechner";
  shareLinkOrCopy(url, t("upp.shareText", `${posLabel(uppLast.line, from)} → ${posLabel(uppLast.line, to)}`));
}

/* ---------------- Liste herunterladen ---------------- */
const DL_KEY = "o2h.dlMode2"; // Standard: Mindestmenge
const dlLabel = m => t({ min: "upp.modeMin", avg: "upp.modeAvg", p90: "upp.modeP90" }[m]);
function dlMode() { try { return localStorage.getItem(DL_KEY) || "min"; } catch { return "min"; } }
function setDlMode(v) { try { localStorage.setItem(DL_KEY, v); } catch {} }

function listData() {
  const { line, from, to, downgrade, res, ids } = uppLast;
  const mode = dlMode();
  const src = res[mode];
  const items = ids
    .map(id => ({ id, name: itemName(id), qty: mode === "avg" ? Math.ceil(src.mats[id] || 0) : (src.mats[id] || 0) }))
    .filter(x => x.qty > 0);
  return {
    title: `${posLabel(line, from)} → ${posLabel(line, to)}`,
    line: lineName(line), mode, downgrade, items, yang: src.yang
  };
}

function fileBase(d) {
  return (t("upp.fileName") + " " + d.title).replace(/[→+]/g, m => m === "→" ? t("upp.to_word") : "plus")
    .replace(/[^\wäöüÄÖÜß -]/g, "").replace(/\s+/g, "-");
}

function triggerDownload(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.rel = "noopener";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function downloadTxt() {
  if (!uppLast) return;
  const d = listData();
  const w = Math.max(...d.items.map(i => i.name.length), 10);
  const L = [
    `${t("upp.listTitle").toUpperCase()} – ${d.line}`,
    d.title,
    `${t("upp.quantity", dlLabel(d.mode))} · ${t("upp.withStone")}`,
    "".padEnd(w + 12, "-"),
    ...d.items.map(i => `${i.name.padEnd(w)}  ${fmtNum(i.qty).padStart(8)}x`),
    "".padEnd(w + 12, "-"),
    `${t("upp.yangUpp")}: ${fmtYang(d.yang)}`,
    "",
    "Origins2 Helper by Society"
  ];
  triggerDownload(new Blob(["\ufeff" + L.join("\r\n")], { type: "text/plain;charset=utf-8" }), fileBase(d) + ".txt");
  if (typeof toast === "function") toast(t("upp.savedTxt"));
}

function loadImg(src) {
  return new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });
}

async function downloadPng() {
  if (!uppLast) return;
  const d = listData();
  try { await document.fonts.ready; } catch {}
  const S = 2;                                  // Retina-Schärfe
  const cols = d.items.length > 8 ? 2 : 1;
  const W = cols === 2 ? 640 : 380, PAD = 22, ROW = 40, HEAD = 92, FOOT = 58;
  const rows = Math.ceil(d.items.length / cols);
  const H = HEAD + rows * ROW + FOOT + 10;
  const c = document.createElement("canvas");
  c.width = W * S; c.height = H * S;
  const g = c.getContext("2d"); g.scale(S, S);

  // Hintergrund
  const bg = g.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#1e1912"); bg.addColorStop(1, "#110d09");
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  g.strokeStyle = "rgba(212,162,76,0.45)"; g.lineWidth = 1; g.strokeRect(0.5, 0.5, W - 1, H - 1);
  const shine = g.createLinearGradient(W * 0.15, 0, W * 0.85, 0);
  shine.addColorStop(0, "rgba(230,189,108,0)"); shine.addColorStop(0.5, "rgba(230,189,108,0.8)"); shine.addColorStop(1, "rgba(230,189,108,0)");
  g.fillStyle = shine; g.fillRect(W * 0.15, 0, W * 0.7, 1);

  // Kopf
  g.textBaseline = "alphabetic";
  g.fillStyle = "#d4a24c"; g.font = "600 10px Inter, Arial, sans-serif";
  g.fillText((t("upp.listTitle") + " · " + d.line).toUpperCase().split("").join(String.fromCharCode(8202)), PAD, 28);
  g.fillStyle = "#f1e9da"; g.font = "600 18px Cinzel, Georgia, serif";
  g.fillText(d.title, PAD, 54, W - PAD * 2);
  g.fillStyle = "#9b8e78"; g.font = "400 11.5px Inter, Arial, sans-serif";
  g.fillText(`${t("upp.quantity", dlLabel(d.mode))} · ${t("upp.withStone")}`, PAD, 74);
  g.fillStyle = "rgba(212,162,76,0.18)"; g.fillRect(PAD, HEAD - 6, W - PAD * 2, 1);

  // Zeilen
  const colW = (W - PAD * 2 - (cols - 1) * 18) / cols;
  const icons = await Promise.all(d.items.map(i => loadImg((typeof ITEM_ICON_DATA !== "undefined" && ITEM_ICON_DATA[i.id]) || itemInfo(i.id).icon)));
  d.items.forEach((it, idx) => {
    const col = cols === 2 ? Math.floor(idx / rows) : 0, row = cols === 2 ? idx % rows : idx;
    const x = PAD + col * (colW + 18), y = HEAD + row * ROW;
    g.fillStyle = "#0c0907"; g.fillRect(x, y + 3, 32, 32);
    if (icons[idx]) { try { g.drawImage(icons[idx], x, y + 3, 32, 32); } catch {} }
    g.strokeStyle = "rgba(212,162,76,0.25)"; g.strokeRect(x + 0.5, y + 3.5, 31, 31);
    const qty = fmtNum(it.qty) + "×";
    g.font = "600 14px Inter, Arial, sans-serif";
    const qw = g.measureText(qty).width;
    g.fillStyle = "#f3d79a"; g.textAlign = "right"; g.fillText(qty, x + colW, y + 24); g.textAlign = "left";
    g.fillStyle = "#f1e9da"; g.font = "500 13px Inter, Arial, sans-serif";
    let name = it.name; const maxW = colW - 44 - qw - 10;
    while (g.measureText(name).width > maxW && name.length > 3) name = name.slice(0, -2);
    if (name !== it.name) name = name.trimEnd() + "…";
    g.fillText(name, x + 42, y + 24);
    if (row < rows - 1) { g.fillStyle = "rgba(212,162,76,0.07)"; g.fillRect(x, y + ROW - 1, colW, 1); }
  });

  // Fuß
  const fy = H - FOOT + 6;
  g.fillStyle = "rgba(212,162,76,0.18)"; g.fillRect(PAD, fy, W - PAD * 2, 1);
  g.fillStyle = "#9b8e78"; g.font = "400 11px Inter, Arial, sans-serif"; g.fillText(t("upp.yangUpp"), PAD, fy + 22);
  g.fillStyle = "#f3d79a"; g.font = "600 15px Inter, Arial, sans-serif"; g.fillText(fmtYang(d.yang), PAD, fy + 40);
  g.textAlign = "right"; g.fillStyle = "#c4b69e"; g.font = "600 11px Cinzel, Georgia, serif";
  g.fillText("ORIGINS2 HELPER", W - PAD, fy + 26);
  g.fillStyle = "#d4a24c"; g.font = "500 10.5px Inter, Arial, sans-serif"; g.fillText("by Society", W - PAD, fy + 40);
  g.textAlign = "left";

  c.toBlob(b => {
    if (!b) { if (typeof toast === "function") toast(t("upp.pngFail")); return; }
    triggerDownload(b, fileBase(d) + ".png");
    if (typeof toast === "function") toast(t("upp.savedPng"));
  }, "image/png");
}

function initUpp() {
  const pop = document.getElementById("upp-popout");
  if (pop) pop.addEventListener("click", uppOpenMini);
  if (UPP_MINI) {
    document.title = t("upp.title") + " · Origins2 Helper";
    // Filter im Mini-Fenster einklappbar, damit die Einkaufsliste sofort sichtbar ist
    const filters = document.querySelector(".upp-filters");
    if (filters) {
      const tg = document.createElement("button");
      tg.type = "button"; tg.className = "upp-mini-toggle";
      const label = () => { tg.innerHTML = `<span>${t("upp.miniFilters")}</span><svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5.3 7.3 10 12l4.7-4.7 1.4 1.4L10 14.8 3.9 8.7z"/></svg>`; tg.setAttribute("aria-expanded", filters.classList.contains("is-open")); };
      tg.addEventListener("click", () => { filters.classList.toggle("is-open"); label(); });
      window.addEventListener("langchange", label);
      label(); filters.before(tg);
    }
  }
  // Mini-Fenster und Hauptseite teilen Marktpreise & Auswahl → bei Änderung im anderen Fenster neu rechnen
  window.addEventListener("storage", e => { if ((e.key === PRICE_KEY || e.key === BOUGHT_KEY) && document.getElementById("upp-result")) renderResult(); });
  const lineSel = document.getElementById("upp-line");
  if (!lineSel || typeof UPGRADE_LINES === "undefined") return;
  const st = uppState();
  const catOf = id => UPGRADE_LINES[id].category || "pvp";
  let lineIds = [];
  const slotsEl = document.getElementById("upp-slots"), clsEl = document.getElementById("upp-classes");
  const countFor = (slot, cls) => Object.values(UPGRADE_LINES).filter(l =>
    (l.category || "pvp") === currentCat() && (l.slot || "weapon") === slot &&
    (!EQUIP_SLOTS[slot].classBound || !cls || !l.classes || l.classes.includes(cls))).length;
  const paintFilters = () => {
    slotsEl.innerHTML = Object.keys(EQUIP_SLOTS).map(k =>
      `<button type="button" class="chip${k === uppSlot ? " is-active" : ""}${countFor(k) ? "" : " is-empty"}" data-slot="${k}">${uEsc(L(EQUIP_SLOTS[k]))}</button>`).join("");
    const bound = slotBound(uppSlot);
    clsEl.innerHTML = Object.keys(CLASSES).map(k =>
      `<button type="button" class="chip${bound && k === uppClass ? " is-active" : ""}${bound && !countFor(uppSlot, k) ? " is-empty" : ""}" data-cls="${k}"${bound ? "" : " disabled"}>${uEsc(L(CLASSES[k]))}</button>`).join("");
    document.getElementById("upp-class-row").classList.toggle("is-off", !bound);
  };
  const fillLines = () => {
    const cur = lineSel.value;
    paintFilters();
    lineIds = Object.keys(UPGRADE_LINES).filter(id => lineMatches(UPGRADE_LINES[id]));
    lineSel.innerHTML = lineIds.map(id => `<option value="${id}">${uEsc(lineName(UPGRADE_LINES[id]))}</option>`).join("");
    if (cur && lineIds.includes(cur)) lineSel.value = cur;
    const has = lineIds.length > 0;
    [lineSel, document.getElementById("upp-from"), document.getElementById("upp-to")].forEach(el => { el.disabled = !has; });
    if (!has) { document.getElementById("upp-from").innerHTML = ""; document.getElementById("upp-to").innerHTML = ""; }
  };
  // geteilter Link: ?line=…&from=…&to=…
  try {
    const q = new URLSearchParams(location.search);
    if (q.get("line") && UPGRADE_LINES[q.get("line")]) st.line = q.get("line");
    if (q.get("from") != null && q.get("to") != null) { st.from = +q.get("from"); st.to = +q.get("to"); }
  } catch {}
  if (st.line && UPGRADE_LINES[st.line]) {
    const ln = UPGRADE_LINES[st.line];
    uppSlot = ln.slot || "weapon";
    uppClass = (ln.classes && !(st.cls && ln.classes.includes(st.cls))) ? ln.classes[0] : (st.cls || "warrior");
  } else { uppSlot = st.slot || uppSlot; uppClass = st.cls || uppClass; }
  const startCat = (st.line && UPGRADE_LINES[st.line]) ? catOf(st.line) : (st.cat || "pvp");
  const catRadio = document.querySelector(`input[name="upp-cat"][value="${startCat}"]`);
  if (catRadio) catRadio.checked = true;
  fillLines();
  if (st.line && lineIds.includes(st.line)) lineSel.value = st.line;

  const fromSel = document.getElementById("upp-from");
  const toSel = document.getElementById("upp-to");

  const refreshSelects = (keep) => {
    const line = UPGRADE_LINES[lineSel.value];
    if (!line) return;
    const max = line.stages.length * 10 - 1;
    let from = keep && st.from != null ? st.from : +fromSel.value || 0;
    let to = keep && st.to != null ? st.to : +toSel.value || max;
    from = Math.min(Math.max(0, from), max - 1);
    if (to <= from) to = Math.min(max, from + 1);
    fillPosSelect(fromSel, line, 0, max - 1, from);
    fillPosSelect(toSel, line, from + 1, max, Math.min(to, max));
  };
  refreshSelects(true);

  lineSel.addEventListener("change", () => { fromSel.value = 0; toSel.value = 999; refreshSelects(false); renderResult(); });
  fromSel.addEventListener("change", () => { refreshSelects(false); renderResult(); });
  toSel.addEventListener("change", renderResult);
  document.querySelectorAll('input[name="upp-cat"]').forEach(r => r.addEventListener("change", () => {
    fillLines(); refreshSelects(false); renderResult();
  }));
  slotsEl.addEventListener("click", e => {
    const b = e.target.closest("[data-slot]"); if (!b) return;
    uppSlot = b.dataset.slot; fillLines(); refreshSelects(false); renderResult();
  });
  clsEl.addEventListener("click", e => {
    const b = e.target.closest("[data-cls]"); if (!b || b.disabled) return;
    uppClass = b.dataset.cls; fillLines(); refreshSelects(false); renderResult();
  });

  window.addEventListener("langchange", () => {
    fillLines();
    const line = UPGRADE_LINES[lineSel.value];
    if (!line) { renderResult(); return; }
    const f = +fromSel.value, to = +toSel.value, max = line.stages.length * 10 - 1;
    fillPosSelect(fromSel, line, 0, max - 1, f);
    fillPosSelect(toSel, line, f + 1, max, to);
    renderResult();
  });
  renderResult();
}

/* ---------------- Mini-Fenster ----------------
   Chrome/Edge: schwebendes Fenster (Document Picture-in-Picture), das immer über dem Spiel bleibt –
   darin läuft diese Seite in der Nur-Rechner-Ansicht (?mini=upp). Andere Browser: kleines Popup. */
/* Öffnet eine Seite (?mini=…) als Mini-Fenster – auch vom Skilltree benutzt */
async function openMiniWindow(mode, hash, title, size) {
  const url = miniUrl(mode, hash), W = size ? size[0] : MINI_W, H = size ? size[1] : MINI_H;
  if ("documentPictureInPicture" in window) {
    try {
      const pip = await documentPictureInPicture.requestWindow({ width: W, height: H });
      const d = pip.document;
      d.title = "Origins2 Helper";
      d.body.style.cssText = "margin:0;background:#110d09;overflow:hidden";
      const f = d.createElement("iframe");
      f.src = new URL(url, location.href).href;
      f.title = title;
      f.style.cssText = "border:0;display:block;width:100vw;height:100vh";
      d.body.appendChild(f);
      return;
    } catch (err) { /* abgelehnt → Popup */ }
  }
  const w = window.open(url, size ? "o2h-mini-" + mode : "o2h-mini", `popup=yes,width=${W},height=${H}`);
  if (!w && typeof toast === "function") toast(t("fp.popupBlocked"));
}
function uppOpenMini() { return openMiniWindow("upp", "upp-rechner", t("upp.title")); }
