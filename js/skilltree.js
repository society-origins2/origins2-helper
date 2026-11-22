/* =====================================================================
   Origins2 Helper – Skilltree-Kalkulator
   Daten: js/skill-data.js (SKILL_TREE, SKILL_KEY, SKILL_YANG)
   Jeder Zweig hat sein eigenes Ziel (kombinierbar). Klick auf einen Bonus =
   dieser Zweig füllt sich bis dahin (feste Reihenfolge, inkl. Voraussetzungen
   anderer Zweige) + Einkaufsliste. Schalter: Skilltree-Schlüssel mitrechnen.
   ===================================================================== */

const ST_ORDER = ["pvm", "pvp", "yohara"];
const stItemName = id => L(itemInfo(id)) || t("st.unknown", id.replace("mat-", "#"));
/* Ziel pro Zweig (Anzahl Stufen, 0 = nichts gewählt). Zweige sind unabhängig. */
let stSel = { pvm: 0, pvp: 0, yohara: 0 };
/* Skilltree schon mit dem Schlüssel freigeschaltet? (sonst Schlüssel mitrechnen) */
let stKeyOwned = true;
/* Mini-Fenster (?mini=skill): nur Baum + Einkaufsliste */
const ST_MINI = new URLSearchParams(location.search).get("mini") === "skill";
if (ST_MINI) document.documentElement.classList.add("is-mini-skill");
/* Abgehakte (gekaufte) Items pro Auswahl: { "pvm-9,pvp-3|k": ["mat-01", …] } */
const ST_BOUGHT_KEY = "o2h.skillBought";
let stJustBought = null;
/* Marktpreise: dieselben wie im Upp-Kalkulator (localStorage o2h.marketPrices) */
const ST_PRICE_EDIT_KEY = "o2h.skillPriceEdit";
/* Baum ausgeblendet? (nur die Einkaufsliste in voller Breite) */
const ST_TREE_KEY = "o2h.skillTreeHidden";
let stTreeHidden = false;
function stApplyTree() {
  const wrap = document.querySelector(".st-wrap");
  if (!wrap) return;
  wrap.classList.toggle("tree-hidden", stTreeHidden);
  const bar = document.getElementById("st-treebar");
  if (bar) {
    const need = stNeeded(stSel);
    bar.innerHTML = `<span class="st-treebar-dots">${ST_ORDER.map(b => `<span style="--c:${SKILL_TREE[b].color}"><i></i>${SKILL_TREE[b].roman} ${need[b] || 0}/9</span>`).join("")}</span><b>${t("st.showTree")} ▾</b>`;
  }
}
function stSetTree(hidden) {
  stTreeHidden = hidden;
  try { localStorage.setItem(ST_TREE_KEY, hidden ? "1" : "0"); } catch {}
  stApplyTree(); stRenderResult();
}
const stBoughtKey = () => stSelString() + (stKeyOwned ? "" : "|key");
function stLoadBought() { try { return JSON.parse(localStorage.getItem(ST_BOUGHT_KEY) || "{}"); } catch { return {}; } }
function stSaveBought(b) {
  const keys = Object.keys(b); if (keys.length > 30) keys.slice(0, keys.length - 30).forEach(k => delete b[k]);
  try { localStorage.setItem(ST_BOUGHT_KEY, JSON.stringify(b)); } catch {}
}

const stAny = () => ST_ORDER.some(b => stSel[b] > 0);

function stNodeName(b, i) {
  const n = SKILL_TREE[b].nodes[i];
  const bonus = LANG === "en" ? (n.bonusEn || n.bonus) : n.bonus;
  return bonus || t("st.stage", i + 1);
}

/* Alle Stufen, die für die Auswahl nötig sind (inkl. Voraussetzungen): { pvm: 9, pvp: 5, … } */
function stNeeded(sel) {
  const need = {};
  const add = (b, upto) => {
    if ((need[b] || 0) >= upto) return;
    need[b] = upto;
    const r = SKILL_TREE[b].requires;
    if (r) add(r.branch, r.upto);
  };
  ST_ORDER.forEach(b => { if (sel[b] > 0) add(b, sel[b]); });
  return need;
}

const stKeyNeeded = () => !stKeyOwned && typeof SKILL_KEY !== "undefined" && SKILL_KEY.mats;

function stTotals(need) {
  const mats = {}, order = [];
  let stages = 0;
  const addMats = m => Object.entries(m).forEach(([id, q]) => {
    if (!(id in mats)) { mats[id] = 0; order.push(id); }
    mats[id] += q;
  });
  if (stKeyNeeded()) addMats(SKILL_KEY.mats);
  ST_ORDER.forEach(b => {
    for (let i = 0; i < (need[b] || 0); i++) { stages++; addMats(SKILL_TREE[b].nodes[i].mats); }
  });
  let yang = null;
  if (Array.isArray(SKILL_YANG)) {
    yang = 0; ST_ORDER.forEach(b => { for (let i = 0; i < (need[b] || 0); i++) yang += (SKILL_YANG[b] || SKILL_YANG)[i] || 0; });
  }
  const keyYang = stKeyNeeded() ? (SKILL_KEY.yang || 0) : 0;
  return { mats, order, stages, yang, keyYang };
}

/* ---------------- Baum zeichnen ---------------- */
function stRenderTree() {
  const svg = document.getElementById("st-svg");
  if (!svg) return;
  const need = stNeeded(stSel);
  let html = `<defs>
      <clipPath id="st-clip" clipPathUnits="objectBoundingBox"><circle cx=".5" cy=".5" r=".5"/></clipPath>
      <filter id="st-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;
  // Kanten
  ST_ORDER.forEach(b => {
    const br = SKILL_TREE[b], n = need[b] || 0;
    br.edges.forEach(([a, c]) => {
      const A = br.nodes[a - 1], C = br.nodes[c - 1], on = a <= n && c <= n;
      html += `<line class="st-edge${on ? " is-on" : ""}" x1="${A.x}" y1="${A.y}" x2="${C.x}" y2="${C.y}" style="--c:${br.color}"${on ? ' filter="url(#st-glow)"' : ""}/>`;
    });
  });
  // Punkte
  ST_ORDER.forEach(b => {
    const br = SKILL_TREE[b], n = need[b] || 0;
    br.nodes.forEach((nd, i) => {
      const on = i < n, cur = stSel[b] === i + 1;
      const label = `${L(br)} · ${stNodeName(b, i)}`;
      html += `<g class="st-node${on ? " is-on" : ""}${cur ? " is-cur" : ""}" style="--c:${br.color}" data-b="${b}" data-i="${i}" tabindex="0" role="button" aria-label="${uEsc(label)}">
        <title>${uEsc(label)}</title>
        ${cur ? `<circle class="st-pulse" cx="${nd.x}" cy="${nd.y}" r="17"/>` : ""}
        <circle class="st-ring" cx="${nd.x}" cy="${nd.y}" r="16"/>
        <image href="${nd.icon}" x="${nd.x - 15}" y="${nd.y - 15}" width="30" height="30" clip-path="url(#st-clip)"/>
        <text class="st-num" x="${nd.x + 12}" y="${nd.y + 15}">${i + 1}</text>
      </g>`;
    });
  });
  svg.innerHTML = html;
  // Zweig-Legende
  document.getElementById("st-legend").innerHTML = ST_ORDER.map(b => {
    const br = SKILL_TREE[b], n = need[b] || 0;
    return `<span class="st-leg" style="--c:${br.color}"><i></i><b>${br.roman}</b> ${uEsc(L(br))} <em>${n}/9</em></span>`;
  }).join("");
}

/* ---------------- Ergebnis ---------------- */
function stSelLine(need) {
  return ST_ORDER.filter(b => need[b]).map(b => {
    const B = SKILL_TREE[b], req = !(stSel[b] > 0);
    return `<span style="--c:${B.color}"><i></i>${uEsc(t("st.branchTo", B.roman + " " + L(B), need[b]))}${req ? ` <em>(${t("st.required")})</em>` : ""}</span>`;
  }).join("");
}

function stRenderResult() {
  const out = document.getElementById("st-result");
  if (!out) return;
  if (!stAny()) {
    out.innerHTML = `<div class="st-empty"><p class="font-display text-parch-100">${t("st.pickTitle")}</p><p class="mt-1 text-sm text-parch-400">${t("st.pickText")}</p></div>`;
    return;
  }
  const need = stNeeded(stSel), tot = stTotals(need);
  const bKey = stBoughtKey();
  const bought = new Set((stLoadBought()[bKey] || []).filter(id => id in tot.mats));
  const nAll = tot.order.length, nBought = bought.size;
  const checkMark = `<span class="mg-check" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m4.5 10.5 3.5 3.5 7.5-8"/></svg></span>`;
  const prices = loadPrices();
  const editPrices = (() => { try { return localStorage.getItem(ST_PRICE_EDIT_KEY) === "1"; } catch { return false; } })();
  const costOf = id => (prices[id] || 0) * tot.mats[id];
  const anyPrice = tot.order.some(id => prices[id] > 0);
  const matValue = tot.order.reduce((a, id) => a + costOf(id), 0);
  const openValue = tot.order.reduce((a, id) => a + (bought.has(id) ? 0 : costOf(id)), 0);
  const viewOrder = anyPrice ? tot.order.map((id, n) => ({ id, n })).sort((a, b) => (costOf(b.id) - costOf(a.id)) || (a.n - b.n)).map(o => o.id) : tot.order;
  const rows = viewOrder.map(id => {
    const info = itemInfo(id), unknown = !L(info), b = bought.has(id), p = prices[id] || 0;
    return `<li class="mg-tile st-tile${b ? " is-bought" : ""}${id === stJustBought ? " just-bought" : ""}" data-buy="${uEsc(id)}" role="checkbox" tabindex="0" aria-checked="${b}" title="${uEsc(t("upp.buyToggle"))}">
      <span class="mt-ico">${checkMark}<img src="${info.icon}" alt="" loading="lazy"></span>
      <span class="mg-name${unknown ? " is-unknown" : ""}" title="${uEsc(stItemName(id))}">${uEsc(stItemName(id))}</span>
      <span class="mg-avg tabular-nums">${fmtNum(tot.mats[id])}×</span>
      ${editPrices ? `<div class="mg-price mt-price">${priceField(id, prices)}<span class="mg-cost tabular-nums">${p ? "= " + fmtYang(costOf(id)) : ""}</span></div>`
        : (p ? `<div class="mg-costline tabular-nums">${fmtYang(p)} / ${t("upp.pcs")} · <b>${fmtYang(costOf(id))}</b></div>` : "")}</li>`;
  }).join("");
  const keyLi = stKeyNeeded() ? `<li><span class="st-dot" style="--c:var(--color-gold-300)"></span><b>${uEsc(L(SKILL_KEY))}</b> ${fmtYang(SKILL_KEY.yang)} Yang <em>${Object.keys(SKILL_KEY.mats).length} ${t("st.items")}</em></li>` : "";
  const stages = keyLi + ST_ORDER.filter(b => need[b]).map(b => {
    const B = SKILL_TREE[b];
    return Array.from({ length: need[b] }, (_, i) => `<li><span class="st-dot" style="--c:${B.color}"></span><b>${B.roman}·${i + 1}</b> ${uEsc(stNodeName(b, i))} <em>${Object.keys(B.nodes[i].mats).length} ${t("st.items")}</em></li>`).join("");
  }).join("");
  out.innerHTML = `
    <div class="st-res-head">
      <div>
        <p class="eyebrow">${t("st.listTitle")}</p>
        <h3 class="font-display text-xl font-semibold text-parch-100">${t("st.selTitle")}</h3>
        <p class="st-sel">${stSelLine(need)}</p>
        <p class="mt-1 text-xs text-parch-400">${t("st.stagesTotal", tot.stages)}</p>
      </div>
      <div class="st-res-btns">
        <button type="button" class="btn-ghost-sq" id="st-tree-toggle">${stTreeHidden ? t("st.showTree") : t("st.hideTree")}</button>
        <button type="button" class="btn-ghost-sq" id="st-reset">${t("st.reset")}</button>
      </div>
    </div>
    <div class="st-keyrow">
      <span><img src="${SKILL_KEY.icon}" alt="">${t("st.keyQ")}</span>
      <div class="seg seg-sm" role="radiogroup" aria-label="${uEsc(t("st.keyQ"))}">
        <label><input type="radio" name="st-key" value="1"${stKeyOwned ? " checked" : ""}><span>${t("st.keyYes")}</span></label>
        <label><input type="radio" name="st-key" value="0"${stKeyOwned ? "" : " checked"}><span>${t("st.keyNo")}</span></label>
      </div>
    </div>
    ${stKeyOwned ? "" : `<p class="st-keyhint">${t("st.keyHint")}</p>`}
    <div class="st-extra">
      <span><img src="${SKILL_KEY.icon}" alt=""> ${t("st.key")} <em>${stKeyOwned ? t("st.keyDone") : t("st.keyNeed", fmtYang(SKILL_KEY.yang))}</em></span>
      <span>${t("st.yangStages")} <em>${tot.yang != null ? fmtYang(tot.yang) : t("st.tbd")}</em></span>
      ${anyPrice ? `<span>${t("st.matValue")} <em>${fmtYang(matValue)}</em></span>` : ""}
    </div>
    ${nAll ? `<div class="st-listhead">
      <p class="mt-progress st-progress">
        <span class="mt-bar" style="--p:${Math.round(nBought / nAll * 100)}%"></span>
        <span>${nBought === nAll ? t("st.allBought") : t("upp.boughtOf", nBought, nAll)}${anyPrice && nBought < nAll ? ` · ${t("upp.openCost", fmtYang(openValue))}` : ""}</span>
        ${nBought ? `<button type="button" class="mt-reset" id="st-bought-reset">${t("upp.boughtReset")}</button>` : ""}</p>
      <button type="button" class="btn-ghost-sq mt-edit${editPrices ? " is-on" : ""}" id="st-edit-prices" aria-pressed="${editPrices}">
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
        ${editPrices ? t("upp.editDone") : `<span class="hide-xs">${t("upp.editPrices")}</span><span class="show-xs">${t("upp.editPricesShort")}</span>`}</button>
    </div>
    ${editPrices ? `<p class="st-pricehint">${t("upp.priceHint")}</p>` : anyPrice ? `<p class="mt-sorted">${t("upp.sortedByCost")}</p>` : ""}` : ""}
    <ul class="mat-grid st-grid${editPrices ? " is-edit" : ""}">${rows}</ul>
    <details class="st-stages"><summary>${t("st.perStage")}</summary><ol>${stages}</ol></details>
    <div class="st-actions">
      <button type="button" class="btn-gold" id="st-dl-png">${t("st.dlPng")}</button>
      <button type="button" class="btn-ghost-sq" id="st-dl-txt">${t("st.dlTxt")}</button>
      <button type="button" class="btn-ghost-sq" id="st-copy">${t("st.copy")}</button>
      <button type="button" class="btn-ghost-sq" id="st-share">${t("st.share")}</button>
    </div>`;
  document.getElementById("st-reset").addEventListener("click", () => stSelect({ pvm: 0, pvp: 0, yohara: 0 }));
  document.getElementById("st-tree-toggle").addEventListener("click", () => stSetTree(!stTreeHidden));
  out.querySelectorAll('input[name="st-key"]').forEach(r => r.addEventListener("change", () => {
    stKeyOwned = r.value === "1";
    try { localStorage.setItem("o2h.skillKey", stKeyOwned ? "1" : "0"); } catch {}
    stRenderResult();
  }));
  const toggleBought = id => {
    const all = stLoadBought(), set = new Set(all[bKey] || []);
    set.has(id) ? set.delete(id) : set.add(id);
    stJustBought = set.has(id) ? id : null;
    delete all[bKey]; if (set.size) all[bKey] = [...set];
    stSaveBought(all); stRenderResult(); stJustBought = null;
  };
  out.querySelectorAll("[data-buy]").forEach(el => {
    el.addEventListener("click", e => { if (e.target.closest("input, button, a")) return; toggleBought(el.dataset.buy); });
    el.addEventListener("keydown", e => { if ((e.key === " " || e.key === "Enter") && e.target === el) { e.preventDefault(); toggleBought(el.dataset.buy); } });
  });
  wirePriceFields(out, stRenderResult);
  document.getElementById("st-edit-prices")?.addEventListener("click", () => {
    let on = false; try { on = localStorage.getItem(ST_PRICE_EDIT_KEY) !== "1"; localStorage.setItem(ST_PRICE_EDIT_KEY, on ? "1" : "0"); } catch {}
    stRenderResult();
    if (on) { const f = out.querySelector(".st-grid [data-price]"); if (f) f.focus({ preventScroll: true }); }
  });
  const rb = document.getElementById("st-bought-reset");
  if (rb) rb.addEventListener("click", () => { const all = stLoadBought(); delete all[bKey]; stSaveBought(all); stRenderResult(); });
  document.getElementById("st-dl-png").addEventListener("click", stDownloadPng);
  document.getElementById("st-dl-txt").addEventListener("click", stDownloadTxt);
  document.getElementById("st-copy").addEventListener("click", stCopy);
  document.getElementById("st-share").addEventListener("click", () => {
    const url = shareUrl({ skill: stSelString(), lang: LANG }).replace(/#.*$/, "") + "#skilltree";
    shareLinkOrCopy(url, t("st.shareText", stListTitle()));
  });
}

/* Auswahl als Text, z. B. "pvm-9,pvp-3" (für Link + localStorage) */
function stSelString() { return ST_ORDER.filter(b => stSel[b] > 0).map(b => `${b}-${stSel[b]}`).join(","); }

function stSelect(sel, scroll) {
  stSel = sel;
  try { localStorage.setItem("o2h.skillSel", stSelString()); } catch {}
  if (!stAny() && stTreeHidden) { stTreeHidden = false; try { localStorage.setItem(ST_TREE_KEY, "0"); } catch {} } // ohne Auswahl immer den Baum zeigen
  stRenderTree(); stRenderResult(); stApplyTree();
  if (scroll && !ST_MINI && stAny() && window.innerWidth < 900) document.getElementById("st-result").scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------------- Export ---------------- */
function stListTitle() { const need = stNeeded(stSel); return ST_ORDER.filter(b => need[b]).map(b => t("st.branchTo", SKILL_TREE[b].roman + " " + L(SKILL_TREE[b]), need[b])).join(" · "); }
function stListItems() {
  const tot = stTotals(stNeeded(stSel));
  return { tot, items: tot.order.map(id => ({ id, name: stItemName(id), qty: tot.mats[id] })) };
}
function stFile(ext) { return t("st.fileName") + "-" + stSelString().replace(/,/g, "_") + "." + ext; }

function stDownloadTxt() {
  if (!stAny()) return;
  const { tot, items } = stListItems();
  const w = Math.max(...items.map(i => i.name.length), 10);
  const Ls = [
    t("st.listTitle").toUpperCase(), stListTitle(), t("st.stagesTotal", tot.stages),
    "".padEnd(w + 12, "-"),
    ...items.map(i => `${i.name.padEnd(w)}  ${fmtNum(i.qty).padStart(8)}x`),
    "".padEnd(w + 12, "-"),
    `${t("st.key")}: ${stKeyOwned ? t("st.keyDone") : t("st.keyNeed", fmtYang(tot.keyYang))}`,
    `${t("st.yangStages")}: ${tot.yang != null ? fmtYang(tot.yang) : t("st.tbd")}`,
    "", "Origins2 Helper by Society"
  ];
  triggerDownload(new Blob(["﻿" + Ls.join("\r\n")], { type: "text/plain;charset=utf-8" }), stFile("txt"));
  if (typeof toast === "function") toast(t("upp.savedTxt"));
}

async function stCopy(e) {
  if (!stAny()) return;
  const { tot, items } = stListItems();
  const Ls = [`**${stListTitle()}**`, t("st.stagesTotal", tot.stages),
    ...(stKeyOwned ? [] : [`${t("st.key")}: ${t("st.keyNeed", fmtYang(tot.keyYang))}`]),
    "", ...items.map(i => `• ${i.name}: **${fmtNum(i.qty)}**`), "", "_Origins2 Helper by Society_"];
  const ok = typeof copyText === "function" ? await copyText(Ls.join("\n")) : false;
  if (typeof toast === "function") toast(ok ? t("upp.discordOk") : t("upp.discordFail"));
}

async function stDownloadPng() {
  if (!stAny()) return;
  const { tot, items } = stListItems();
  const need = stNeeded(stSel), only = ST_ORDER.filter(b => stSel[b] > 0);
  const br = only.length === 1 ? SKILL_TREE[only[0]] : { color: "#d4a24c", roman: "", name: "", nameEn: "" };
  try { await document.fonts.ready; } catch {}
  const S = 2, cols = items.length > 10 ? 2 : 1;
  const W = cols === 2 ? 660 : 390, PAD = 22, ROW = 40, HEAD = 96, FOOT = 58;
  const rows = Math.ceil(items.length / cols), H = HEAD + rows * ROW + FOOT + 10;
  const c = document.createElement("canvas"); c.width = W * S; c.height = H * S;
  const g = c.getContext("2d"); g.scale(S, S);
  const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#1e1912"); bg.addColorStop(1, "#110d09");
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  g.strokeStyle = "rgba(212,162,76,0.45)"; g.lineWidth = 1; g.strokeRect(0.5, 0.5, W - 1, H - 1);
  g.fillStyle = br.color; g.fillRect(0, 0, W, 2);
  g.fillStyle = br.color; g.font = "600 10px Inter, Arial, sans-serif";
  g.fillText((t("st.listTitle") + (br.roman ? " · " + br.roman + " " + L(br) : "")).toUpperCase().split("").join(String.fromCharCode(8202)), PAD, 28);
  g.fillStyle = "#f1e9da"; g.font = "600 18px Cinzel, Georgia, serif";
  g.fillText(stListTitle(), PAD, 54, W - PAD * 2);
  g.fillStyle = "#9b8e78"; g.font = "400 11.5px Inter, Arial, sans-serif";
  g.fillText(t("st.stagesTotal", tot.stages) + (stKeyOwned ? "" : " · " + L(SKILL_KEY) + " 1×"), PAD, 74);
  g.fillStyle = "rgba(212,162,76,0.18)"; g.fillRect(PAD, HEAD - 8, W - PAD * 2, 1);
  const colW = (W - PAD * 2 - (cols - 1) * 18) / cols;
  const icons = await Promise.all(items.map(i => loadImg((typeof ITEM_ICON_DATA !== "undefined" && ITEM_ICON_DATA[i.id]) || itemInfo(i.id).icon)));
  items.forEach((it, idx) => {
    const col = cols === 2 ? Math.floor(idx / rows) : 0, row = cols === 2 ? idx % rows : idx;
    const x = PAD + col * (colW + 18), y = HEAD + row * ROW;
    g.fillStyle = "#0c0907"; g.fillRect(x, y + 3, 32, 32);
    if (icons[idx]) { try { g.drawImage(icons[idx], x, y + 3, 32, 32); } catch {} }
    g.strokeStyle = "rgba(212,162,76,0.25)"; g.strokeRect(x + 0.5, y + 3.5, 31, 31);
    const qty = fmtNum(it.qty) + "×";
    g.font = "600 14px Inter, Arial, sans-serif"; const qw = g.measureText(qty).width;
    g.fillStyle = "#f3d79a"; g.textAlign = "right"; g.fillText(qty, x + colW, y + 24); g.textAlign = "left";
    g.fillStyle = "#f1e9da"; g.font = "500 13px Inter, Arial, sans-serif";
    let name = it.name; const maxW = colW - 44 - qw - 10;
    while (g.measureText(name).width > maxW && name.length > 3) name = name.slice(0, -2);
    if (name !== it.name) name = name.trimEnd() + "…";
    g.fillText(name, x + 42, y + 24);
    if (row < rows - 1) { g.fillStyle = "rgba(212,162,76,0.07)"; g.fillRect(x, y + ROW - 1, colW, 1); }
  });
  const fy = H - FOOT + 6;
  g.fillStyle = "rgba(212,162,76,0.18)"; g.fillRect(PAD, fy, W - PAD * 2, 1);
  g.fillStyle = "#9b8e78"; g.font = "400 11px Inter, Arial, sans-serif"; g.fillText(stKeyOwned ? t("st.yangStages") : t("st.yang") + " (" + L(SKILL_KEY) + ")", PAD, fy + 22);
  g.fillStyle = "#f3d79a"; g.font = "600 15px Inter, Arial, sans-serif"; g.fillText(stKeyOwned ? (tot.yang != null ? fmtYang(tot.yang) : t("st.tbd")) : fmtYang(tot.keyYang + (tot.yang || 0)) + (tot.yang == null ? " + " + t("st.tbd") : ""), PAD, fy + 40);
  g.textAlign = "right"; g.fillStyle = "#c4b69e"; g.font = "600 11px Cinzel, Georgia, serif"; g.fillText("ORIGINS2 HELPER", W - PAD, fy + 26);
  g.fillStyle = "#d4a24c"; g.font = "500 10.5px Inter, Arial, sans-serif"; g.fillText("by Society", W - PAD, fy + 40);
  g.textAlign = "left";
  c.toBlob(b => {
    if (!b) { if (typeof toast === "function") toast(t("upp.pngFail")); return; }
    triggerDownload(b, stFile("png")); if (typeof toast === "function") toast(t("upp.savedPng"));
  }, "image/png");
}

/* ---------------- Start ---------------- */
/* "pvm-9,pvp-3" (alt auch nur "pvp-3") → { pvm: 9, pvp: 3, yohara: 0 } */
function stParse(v) {
  const sel = { pvm: 0, pvp: 0, yohara: 0 };
  let ok = false;
  String(v || "").split(",").forEach(part => {
    const m = /^(pvm|pvp|yohara)-([1-9])$/.exec(part.trim());
    if (m) { sel[m[1]] = +m[2]; ok = true; }
  });
  return ok ? sel : null;
}
function initSkilltree() {
  const svg = document.getElementById("st-svg");
  if (!svg || typeof SKILL_TREE === "undefined") return;
  // Klick setzt das Ziel nur in DIESEM Zweig; erneuter Klick aufs Ziel nimmt eine Stufe zurück
  const pick = g => {
    const b = g.dataset.b, i = +g.dataset.i;
    stSelect({ ...stSel, [b]: stSel[b] === i + 1 ? i : i + 1 }, true);
  };
  svg.addEventListener("click", e => { const g = e.target.closest(".st-node"); if (g) pick(g); });
  svg.addEventListener("keydown", e => { const g = e.target.closest(".st-node"); if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); pick(g); } });
  let start = stParse(new URLSearchParams(location.search).get("skill"));
  if (!start) { try { start = stParse(localStorage.getItem("o2h.skillSel")); } catch {} }
  try { stKeyOwned = localStorage.getItem("o2h.skillKey") !== "0"; } catch {}
  try { stTreeHidden = localStorage.getItem(ST_TREE_KEY) === "1"; } catch {}
  const bar = document.getElementById("st-treebar");
  if (bar) bar.addEventListener("click", () => stSetTree(false));
  stSelect(start || { pvm: 0, pvp: 0, yohara: 0 });
  window.addEventListener("langchange", () => { stRenderTree(); stRenderResult(); stApplyTree(); });
  // Mini-Fenster
  const pop = document.getElementById("st-popout");
  if (pop) pop.addEventListener("click", () => openMiniWindow("skill", "skilltree", t("skill.title")));
  if (ST_MINI) document.title = t("skill.title") + " · Origins2 Helper";
  // Seite und Mini-Fenster abgleichen (Auswahl, Schlüssel, Haken)
  window.addEventListener("storage", e => {
    if (e.key === "o2h.skillSel") { const s = stParse(e.newValue); stSel = s || { pvm: 0, pvp: 0, yohara: 0 }; stRenderTree(); stRenderResult(); }
    else if (e.key === "o2h.skillKey") { stKeyOwned = e.newValue !== "0"; stRenderResult(); }
    else if (e.key === ST_BOUGHT_KEY || e.key === "o2h.marketPrices") stRenderResult();
  });
}
