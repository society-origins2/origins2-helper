/* =====================================================================
   MINISPIELE  –  Fischpuzzle: Regeln + Löser (läuft auch im Hintergrund-Worker)
   ---------------------------------------------------------------------
   Brett 6×4 (24 Felder). Jede geöffnete Truhe = 1 Versuch (auch Wegwerfen).
   Teile können nicht gedreht werden. Luxus-Truhe = immer 2×3-Teil.
   FISH_TIERS: Truhen-Grenzen – für Origins2 noch zu prüfen!
   ===================================================================== */

const FISH_TIERS = [
  { key: "L", max: 10 },   // bis 10 Versuche  → Goldene Fischtruhe (L)
  { key: "M", max: 24 },   // 11–24 Versuche   → (M)
  { key: "S", max: 999 }   // ab 25            → (S)
];

/* Formen als [Zeile, Spalte] relativ zur ersten Zelle (aus dem Spiel) */
const FISH_SHAPES = {
  1: [[0, 0], [1, 0], [2, 0]],              // senkrechter 3er
  2: [[0, 0]],                              // Einzelfeld
  3: [[0, 0], [1, 0], [1, 1]],              // L
  4: [[0, 0], [0, 1], [1, 1]],              // umgedrehtes L
  5: [[0, 0], [0, 1], [1, 0], [1, 1]],      // 2×2
  6: [[0, 0], [0, 1], [1, 1], [1, 2]],      // Z
  7: [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2]]  // Luxus 2×3
};
const FISH_NORMAL = [1, 2, 3, 4, 5, 6];
const FISH_COLORS = { 1: "#5fb3e6", 2: "#e6c35f", 3: "#e68a5f", 4: "#c07be6", 5: "#6fd08c", 6: "#e6677a", 7: "#f1cf87" };


/* =====================================================================
   Ab hier: Löser + Oberfläche
   ===================================================================== */
const FW = 6, FH = 4, FULL = (1 << 24) - 1;
const popcount = m => { let c = 0; while (m) { m &= m - 1; c++; } return c; };

/* Alle Platzierungen je Form: { mask, at } – at = Feld der ersten Zelle */
const FISH_PL = {};
Object.entries(FISH_SHAPES).forEach(([s, cells]) => {
  const list = [];
  for (let r = 0; r < FH; r++) for (let c = 0; c < FW; c++) {
    let m = 0, ok = true;
    for (const [dr, dc] of cells) {
      const rr = r + dr, cc = c + dc;
      if (rr >= FH || cc >= FW) { ok = false; break; }
      m |= 1 << (rr * FW + cc);
    }
    if (ok) list.push({ mask: m, at: r * FW + c });
  }
  FISH_PL[s] = list;
});
/* Vorberechnet (exakt) für das leere Brett: [Luxus][Versuche übrig] */
const FISH_OPEN = {"0":{"1":{"p":0,"n":0,"u":0,"s":{"1":[-1,0],"2":[-1,0],"3":[-1,0],"4":[-1,0],"5":[-1,0],"6":[-1,0]}},"2":{"p":0,"n":0,"u":0,"s":{"1":[-1,0],"2":[-1,0],"3":[-1,0],"4":[-1,0],"5":[-1,0],"6":[-1,0]}},"3":{"p":0,"n":0,"u":0,"s":{"1":[-1,0],"2":[-1,0],"3":[-1,0],"4":[-1,0],"5":[-1,0],"6":[-1,0]}},"4":{"p":0,"n":0,"u":0,"s":{"1":[-1,0],"2":[-1,0],"3":[-1,0],"4":[-1,0],"5":[-1,0],"6":[-1,0]}},"5":{"p":0,"n":0,"u":0,"s":{"1":[-1,0],"2":[-1,0],"3":[-1,0],"4":[-1,0],"5":[-1,0],"6":[-1,0]}},"6":{"p":0.0,"n":0.0,"u":0,"s":{"1":[-1,0],"2":[-1,0],"3":[-1,0],"4":[-1,0],"5":[0,0.0001],"6":[-1,0]}},"7":{"p":0.0115,"n":0.0115,"u":0,"s":{"1":[5,0.0072],"2":[5,0.0015],"3":[0,0.0142],"4":[16,0.0142],"5":[4,0.0183],"6":[0,0.0136]}},"8":{"p":0.0485,"n":0.0485,"u":0,"s":{"1":[5,0.0408],"2":[5,0.0225],"3":[0,0.0555],"4":[16,0.0555],"5":[4,0.0638],"6":[0,0.0532]}},"9":{"p":0.1114,"n":0.1114,"u":0,"s":{"1":[5,0.1016],"2":[5,0.0722],"3":[0,0.1226],"4":[16,0.1226],"5":[0,0.1334],"6":[0,0.1162]}},"10":{"p":0.1916,"n":0.1916,"u":0,"s":{"1":[5,0.1811],"2":[5,0.1451],"3":[0,0.2061],"4":[16,0.2061],"5":[0,0.2171],"6":[0,0.1942]}}},"1":{"1":{"p":0,"n":0,"u":0,"s":{"1":[-1,0],"2":[-1,0],"3":[-1,0],"4":[-1,0],"5":[-1,0],"6":[-1,0],"7":[-1,0]}},"2":{"p":0,"n":0,"u":0,"s":{"1":[-1,0],"2":[-1,0],"3":[-1,0],"4":[-1,0],"5":[-1,0],"6":[-1,0],"7":[-1,0]}},"3":{"p":0,"n":0,"u":0,"s":{"1":[-1,0],"2":[-1,0],"3":[-1,0],"4":[-1,0],"5":[-1,0],"6":[-1,0],"7":[-1,0]}},"4":{"p":0,"n":0,"u":0,"s":{"1":[-1,0],"2":[-1,0],"3":[-1,0],"4":[-1,0],"5":[-1,0],"6":[-1,0],"7":[-1,0]}},"5":{"p":0,"n":0,"u":0,"s":{"1":[-1,0],"2":[-1,0],"3":[-1,0],"4":[-1,0],"5":[-1,0],"6":[-1,0],"7":[-1,0]}},"6":{"p":0.0155,"n":0.0155,"u":0,"s":{"1":[5,0.0139],"2":[-1,0],"3":[12,0.0131],"4":[4,0.0131],"5":[0,0.031],"6":[0,0.0216],"7":[0,0.0125]}},"7":{"p":0.0704,"n":0.0704,"u":0,"s":{"1":[5,0.0664],"2":[5,0.0294],"3":[12,0.0717],"4":[4,0.0717],"5":[0,0.1016],"6":[0,0.0818],"7":[0,0.0551]}},"8":{"p":0.1554,"n":0.1554,"u":0,"s":{"1":[5,0.1512],"2":[5,0.0988],"3":[12,0.1604],"4":[4,0.1604],"5":[0,0.1946],"6":[0,0.167],"7":[0,0.1246]}},"9":{"p":0.2532,"n":0.2532,"u":0,"s":{"1":[5,0.2495],"2":[5,0.1919],"3":[12,0.2606],"4":[4,0.2606],"5":[0,0.2943],"6":[0,0.2621],"7":[0,0.2102]}},"10":{"p":0.3516,"n":0.3516,"u":0,"s":{"1":[5,0.3488],"2":[5,0.2917],"3":[12,0.3605],"4":[4,0.3605],"5":[0,0.3911],"6":[0,0.357],"7":[0,0.3015]}}},"2":{"1":{"p":0,"n":0,"u":0,"s":{"1":[-1,0],"2":[-1,0],"3":[-1,0],"4":[-1,0],"5":[-1,0],"6":[-1,0],"7":[-1,0]}},"2":{"p":0,"n":0,"u":0,"s":{"1":[-1,0],"2":[-1,0],"3":[-1,0],"4":[-1,0],"5":[-1,0],"6":[-1,0],"7":[-1,0]}},"3":{"p":0,"n":0,"u":0,"s":{"1":[-1,0],"2":[-1,0],"3":[-1,0],"4":[-1,0],"5":[-1,0],"6":[-1,0],"7":[-1,0]}},"4":{"p":0,"n":0,"u":0,"s":{"1":[-1,0],"2":[-1,0],"3":[-1,0],"4":[-1,0],"5":[-1,0],"6":[-1,0],"7":[-1,0]}},"5":{"p":0.0046,"n":0.0046,"u":0,"s":{"1":[-1,0],"2":[-1,0],"3":[-1,0],"4":[-1,0],"5":[0,0.0278],"6":[-1,0],"7":[0,0.0046]}},"6":{"p":0.077,"n":0.077,"u":0,"s":{"1":[5,0.0725],"2":[5,0.0556],"3":[12,0.0617],"4":[4,0.0617],"5":[0,0.1381],"6":[0,0.0725],"7":[0,0.0702]}},"7":{"p":0.181,"n":0.181,"u":0,"s":{"1":[5,0.1786],"2":[5,0.1525],"3":[12,0.1591],"4":[4,0.1591],"5":[0,0.2608],"6":[0,0.1759],"7":[0,0.1663]}},"8":{"p":0.2911,"n":0.2911,"u":0,"s":{"1":[5,0.2896],"2":[5,0.2636],"3":[12,0.2667],"4":[4,0.2667],"5":[0,0.3753],"6":[0,0.2846],"7":[0,0.2703]}},"9":{"p":0.3958,"n":0.3958,"u":0,"s":{"1":[5,0.3934],"2":[5,0.3722],"3":[12,0.3727],"4":[4,0.3727],"5":[0,0.4762],"6":[0,0.3873],"7":[0,0.372]}},"10":{"p":0.4898,"n":0.4898,"u":0,"s":{"1":[5,0.4861],"2":[5,0.47],"3":[12,0.4698],"4":[4,0.4698],"5":[0,0.5628],"6":[0,0.4801],"7":[0,0.4656]}}},"3":{"1":{"p":0,"n":0,"u":0,"s":{"1":[-1,0],"2":[-1,0],"3":[-1,0],"4":[-1,0],"5":[-1,0],"6":[-1,0],"7":[-1,0]}},"2":{"p":0,"n":0,"u":0,"s":{"1":[-1,0],"2":[-1,0],"3":[-1,0],"4":[-1,0],"5":[-1,0],"6":[-1,0],"7":[-1,0]}},"3":{"p":0,"n":0,"u":0,"s":{"1":[-1,0],"2":[-1,0],"3":[-1,0],"4":[-1,0],"5":[-1,0],"6":[-1,0],"7":[-1,0]}},"4":{"p":0,"n":0,"u":0,"s":{"1":[-1,0],"2":[-1,0],"3":[-1,0],"4":[-1,0],"5":[-1,0],"6":[-1,0],"7":[-1,0]}},"5":{"p":0.0602,"n":0.0602,"u":0,"s":{"1":[-1,0],"2":[-1,0],"3":[0,0.1667],"4":[1,0.1667],"5":[0,0.0278],"6":[-1,0],"7":[0,0.0602]}},"6":{"p":0.1815,"n":0.1815,"u":0,"s":{"1":[5,0.0725],"2":[5,0.1389],"3":[0,0.3056],"4":[1,0.3056],"5":[0,0.1659],"6":[0,0.1003],"7":[0,0.1766]}},"7":{"p":0.2999,"n":0.2999,"u":0,"s":{"1":[-1,0.1815],"2":[5,0.2699],"3":[0,0.4213],"4":[1,0.4213],"5":[0,0.2902],"6":[0,0.2152],"7":[0,0.2942]}},"8":{"p":0.4088,"n":0.4088,"u":0,"s":{"1":[-1,0.2999],"2":[5,0.3913],"3":[0,0.5177],"4":[1,0.5177],"5":[0,0.4012],"6":[0,0.3251],"7":[0,0.4028]}},"9":{"p":0.5043,"n":0.5043,"u":0,"s":{"1":[-1,0.4088],"2":[5,0.4962],"3":[0,0.5981],"4":[1,0.5981],"5":[0,0.4987],"6":[0,0.4256],"7":[0,0.4975]}},"10":{"p":0.5864,"n":0.5864,"u":0,"s":{"1":[-1,0.5043],"2":[5,0.5846],"3":[0,0.6651],"4":[1,0.6651],"5":[0,0.584],"6":[0,0.515],"7":[0,0.5787]}}}};

/* ---------- Exakte Chance auf eine Truhe-Grenze (L): P(freie Felder, Versuche übrig, Luxus) ---------- */
let fishMemoP = [];
let fishMemoCount = 0;
function fishP(S, k, lux) {
  if (!S) return 1;
  if (k <= 0) return 0;
  const n = popcount(S), ml = Math.min(lux, k);
  if (n > 6 * ml + 4 * (k - ml)) return 0;
  const idx = k * 4 + lux, M = fishMemoP[idx] || (fishMemoP[idx] = new Map());
  const h = M.get(S); if (h !== undefined) return h;
  const r = fishOpts(S, k, lux).best;
  if (++fishMemoCount > 2500000) { fishMemoP = []; fishMemoCount = 0; }
  (fishMemoP[idx] || (fishMemoP[idx] = new Map())).set(S, r);
  return r;
}
/* Wert „normale Truhe öffnen“ vs. „Luxus-Truhe öffnen“ */
function fishOpts(S, k, lux) {
  const disc = fishP(S, k - 1, lux);
  let tot = 0;
  for (const s of FISH_NORMAL) {
    let b = disc;
    for (const p of FISH_PL[s]) if ((p.mask & S) === p.mask) { const v = fishP(S & ~p.mask, k - 1, lux); if (v > b) b = v; }
    tot += b;
  }
  const normal = tot / 6;
  let luxV = -1;
  if (lux > 0) {
    luxV = fishP(S, k - 1, lux - 1);
    for (const p of FISH_PL[7]) if ((p.mask & S) === p.mask) { const v = fishP(S & ~p.mask, k - 1, lux - 1); if (v > luxV) luxV = v; }
  }
  return { normal, lux: luxV, best: Math.max(normal, luxV) };
}

/* ---------- Ab hier L unmöglich: erwartete Restversuche minimieren (für M/S) ---------- */
let fishEM = null; // Uint8Array(1<<24), 0 = unbekannt
const FISH_PLN = FISH_NORMAL.map(s => FISH_PL[s].map(p => p.mask));
function fishE(S) {
  if (!S) return 0;
  if (!fishEM) fishEM = new Uint8Array(1 << 24);
  const c = fishEM[S]; if (c) return (c - 1) / 8;
  const b = [];
  for (const L of FISH_PLN) { let m = Infinity; for (const p of L) if ((p & S) === p) { const v = fishE(S & ~p); if (v < m) m = v; } b.push(m); }
  b.sort((x, y) => x - y);
  let best = Infinity, sum = 0;
  for (let j = 0; j < 6; j++) { if (b[j] === Infinity) break; sum += b[j]; const e = (6 + sum) / (j + 1); if (e < best) best = e; }
  fishEM[S] = Math.min(255, Math.round(best * 8) + 1);
  return best;
}
/* Chance auf ≤ limit Versuche mit dieser Spielweise (Simulation) */
function fishChanceE(S, used, lux, limit, n) {
  let ok = 0;
  for (let i = 0; i < n; i++) {
    let F = S, u = used, l = lux;
    while (F && u < limit) {
      const s = l > 0 ? 7 : FISH_NORMAL[(Math.random() * 6) | 0];
      if (s === 7) l--;
      let best = 0, bv = fishE(F);
      for (const p of FISH_PL[s]) if ((p.mask & F) === p.mask) { const v = fishE(F & ~p.mask); if (v < bv) { bv = v; best = p.mask; } }
      if (s === 7 && !best) { const q = FISH_PL[7].find(p => (p.mask & F) === p.mask); if (q) best = q.mask; }
      F &= ~best; u++;
    }
    if (!F && u <= limit) ok++;
  }
  return ok / n;
}

/* Beste Entscheidung für ein gezogenes Teil s (7 = Luxus) */
function fishDecide(state, s) {
  const S = FULL & ~state.mask, tierL = FISH_TIERS[0].max, tierM = FISH_TIERS[1].max;
  const kAfter = tierL - state.used - 1, luxAfter = s === 7 ? state.lux - 1 : state.lux;
  const luxC = Math.min(luxAfter, 3);
  const cands = [{ mask: 0, discard: true }];
  FISH_PL[s].forEach(p => { if ((p.mask & S) === p.mask) cands.push({ mask: p.mask, at: p.at }); });
  // 1) Leeres Brett: Tabelle
  if (!state.mask && state.used < tierL && state.lux <= 3 && FISH_OPEN[state.lux] && FISH_OPEN[state.lux][tierL - state.used]) {
    const row = FISH_OPEN[state.lux][tierL - state.used].s[s];
    if (row) {
      const best = row[0] < 0 ? cands[0] : cands.find(c => c.at === row[0]) || cands[0];
      best.p = row[1];
      if (row[1] > 0) return { best, target: "L", p: row[1] };
    }
  }
  // 2) L noch möglich → exakt rechnen
  if (kAfter >= 0) {
    cands.forEach(c => { c.p = fishP(S & ~c.mask, kAfter, luxC); });
    cands.sort((a, b) => b.p - a.p || (a.discard ? 1 : 0) - (b.discard ? 1 : 0));
    if (cands[0].p > 0) return { best: cands[0], target: "L", p: cands[0].p };
  }
  // 3) Sonst: möglichst wenige weitere Versuche (M bzw. S)
  if (popcount(S) <= 20) {
    cands.forEach(c => { c.e = fishE(S & ~c.mask); });
    cands.sort((a, b) => a.e - b.e || (a.discard ? 1 : 0) - (b.discard ? 1 : 0));
    if (s === 7 && cands[0].discard && cands.length > 1) cands.push(cands.shift());
    const best = cands[0];
    const target = state.used + 1 <= tierM ? "M" : "S";
    const p = target === "M" ? fishChanceE(S & ~best.mask, state.used + 1, luxAfter, tierM, 400) : null;
    return { best, target, p, e: best.e };
  }
  // 4) Notlösung bei fast leerem Brett nach vielen Fehlversuchen: größtes Teil oben links
  const best = cands.length > 1 ? cands[1] : cands[0];
  return { best, target: state.used + 1 <= tierM ? "M" : "S", p: null };
}

/* Vor dem Öffnen: lieber Luxus- oder normale Truhe? (nur wenn schnell berechenbar) */
function fishLuxAdvice(state) {
  if (state.lux <= 0 || state.mask === FULL) return null;
  const tierL = FISH_TIERS[0].max, k = tierL - state.used, S = FULL & ~state.mask;
  if (k > 0 && !state.mask && state.lux <= 3 && FISH_OPEN[state.lux][k]) {
    const r = FISH_OPEN[state.lux][k];
    if (r.p > 0) return { useLux: !!r.u, p: r.p };
  }
  if (k > 0 && popcount(S) <= 18) {
    const o = fishOpts(S, k, Math.min(state.lux, 3));
    if (o.best > 0) return { useLux: o.lux > o.normal + 1e-9, p: o.best };
  }
  if (k <= 0 || popcount(S) <= 18) return { useLux: true, p: null }; // L vorbei → Luxus bringt am meisten Felder
  return { useLux: false, p: null };
}


/* Im Worker: Anfragen beantworten */
if (typeof window === "undefined" && typeof self !== "undefined" && typeof importScripts === "function") {
  self.onmessage = e => {
    const { id, kind, state, s } = e.data;
    try {
      const r = kind === "lux" ? fishLuxAdvice(state) : fishDecide(state, s);
      self.postMessage({ id, ok: true, r: r && r.best ? { best: { mask: r.best.mask, discard: !!r.best.discard }, target: r.target, p: r.p, e: r.e } : r });
    } catch (err) { self.postMessage({ id, ok: false, err: String(err) }); }
  };
}
