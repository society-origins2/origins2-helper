/* =====================================================================
   Origins2 Helper – Upp-Kostenrechner
   Daten kommen aus js/data.js (UPGRADE_LINES, MATERIALS, WEAPONS)
   Hier muss normalerweise nichts geändert werden.
   ===================================================================== */

const UPP_RUNS = 10000;
const PRICE_KEY = "o2h.marketPrices";
const UPP_STATE_KEY = "o2h.uppState";

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

function renderResult() {
  const line = UPGRADE_LINES[document.getElementById("upp-line").value];
  const from = +document.getElementById("upp-from").value;
  const to = +document.getElementById("upp-to").value;
  const downgrade = false; // Society-Regel: immer Magischer Stein → Stufe bleibt
  const out = document.getElementById("upp-result");
  renderChain(line, from, to);
  saveUppState({ line: document.getElementById("upp-line").value, from, to, downgrade });

  if (to <= from) {
    out.innerHTML = `<p class="upp-empty">${t("upp.chooseHigher")}</p>`;
    uppLast = null; return;
  }
  const res = runSimulation(line, from, to, downgrade);
  const prices = loadPrices();
  const ids = orderedMatIds(line, from, to, res.ids);
  uppLast = { line, from, to, downgrade, res, ids };

  const rows = ids.map(id => {
    const info = itemInfo(id);
    const p = prices[id] || 0;
    return `
      <tr data-mat="${uEsc(id)}">
        <td class="mt-item"><span class="mt-ico"><img src="${uEsc(info.icon)}" alt=""></span><span class="mt-name${info.name ? "" : " is-unknown"}">${uEsc(itemName(id))}</span></td>
        <td class="tabular-nums">${fmtNum(res.min.mats[id] || 0)}</td>
        <td class="tabular-nums is-main">${fmtNum(Math.ceil(res.avg.mats[id] || 0))}</td>
        <td class="tabular-nums">${fmtNum(res.p90.mats[id] || 0)}</td>
        <td class="mt-price"><input type="text" inputmode="decimal" value="${p ? uEsc(fmtYang(p)) : ""}" placeholder="${uEsc(t("upp.price"))}" data-price="${uEsc(id)}" aria-label="${uEsc(t("upp.priceAria", itemName(id)))}"></td>
        <td class="tabular-nums mt-sum" data-sum>${p ? fmtYang(p * Math.ceil(res.avg.mats[id] || 0)) : "–"}</td>
      </tr>`;
  }).join("");

  const vMin = matValueOf(res.min.mats, prices), vAvg = matValueOf(res.avg.mats, prices), vP90 = matValueOf(res.p90.mats, prices);

  out.innerHTML = `
    <div class="grid gap-4 md:grid-cols-3">
      ${scenarioCard(t("upp.min"), t("upp.minSub"), res.min, vMin, "")}
      ${scenarioCard(t("upp.avg"), t("upp.avgSub", fmtNum(UPP_RUNS)), res.avg, vAvg, "is-main")}
      ${scenarioCard(t("upp.p90"), t("upp.p90Sub"), res.p90, vP90, "")}
    </div>

    <div class="panel mt-4 overflow-hidden">
      <div class="mt-head">
        <h3 class="sub-title">${t("upp.list")}</h3>
        <p class="text-xs text-parch-500">${t("upp.priceHint")}</p>
      </div>
      <div class="mt-scroll">
        <table class="mat-table">
          <thead><tr><th>${t("upp.colMat")}</th><th>${t("upp.colMin")}</th><th class="is-main">${t("upp.colAvg")}</th><th>${t("upp.colP90")}</th><th>${t("upp.colPrice")}</th><th>${t("upp.colCost")}</th></tr></thead>
          <tbody>${rows || `<tr><td colspan="6" class="upp-empty">${t("upp.noMats")}</td></tr>`}</tbody>
        </table>
      </div>
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

  out.querySelectorAll("[data-price]").forEach(inp => {
    inp.addEventListener("change", () => {
      const pr = loadPrices();
      const v = parseYang(inp.value);
      if (v > 0) pr[inp.dataset.price] = v; else delete pr[inp.dataset.price];
      savePrices(pr);
      renderResult();
    });
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
  const lineSel = document.getElementById("upp-line");
  if (!lineSel || typeof UPGRADE_LINES === "undefined") return;
  const st = uppState();
  const lineIds = Object.keys(UPGRADE_LINES);
  const fillLines = () => {
    const cur = lineSel.value;
    lineSel.innerHTML = lineIds.map(id => `<option value="${id}">${uEsc(lineName(UPGRADE_LINES[id]))}</option>`).join("");
    if (cur) lineSel.value = cur;
  };
  fillLines();
  // geteilter Link: ?line=…&from=…&to=…
  try {
    const q = new URLSearchParams(location.search);
    if (q.get("line") && UPGRADE_LINES[q.get("line")]) st.line = q.get("line");
    if (q.get("from") != null && q.get("to") != null) { st.from = +q.get("from"); st.to = +q.get("to"); }
  } catch {}
  if (st.line && UPGRADE_LINES[st.line]) lineSel.value = st.line;

  const fromSel = document.getElementById("upp-from");
  const toSel = document.getElementById("upp-to");

  const refreshSelects = (keep) => {
    const line = UPGRADE_LINES[lineSel.value];
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

  window.addEventListener("langchange", () => {
    fillLines();
    const line = UPGRADE_LINES[lineSel.value];
    const f = +fromSel.value, to = +toSel.value, max = line.stages.length * 10 - 1;
    fillPosSelect(fromSel, line, 0, max - 1, f);
    fillPosSelect(toSel, line, f + 1, max, to);
    renderResult();
  });
  renderResult();
}
