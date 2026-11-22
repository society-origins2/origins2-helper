/* =====================================================================
   Origins2 Helper – Übersetzer-Tool für Helfer (uebersetzen/)
   Liest die Items aus ../js/data.js, Helfer tragen richtige Namen ein
   oder bestätigen sie, am Ende wird eine JSON-Datei heruntergeladen.
   Status der Namen: NAMES_CHECKED_EN / NAMES_PROVISIONAL_DE in data.js
   ===================================================================== */

const TR_KEY = "o2h.translate";       // { who, entries: { id: { de, en, deOk, enOk } } }
const TR_LANG_KEY = "o2h.lang";        // gleiche Sprache wie auf der Website

const TR_TEXT = {
  de: {
    back: "Zur Website", eyebrow: "Für Helfer", title: "Item-Namen übersetzen",
    intro: "Viele Namen im Helper sind nur vorläufig übersetzt. Schau im Spiel nach, wie das Item wirklich heißt, und trag es hier ein – am Ende erzeugst du eine Datei und schickst sie uns.",
    step1: "Item im Spiel suchen (Tooltip beim Drüberfahren) – Sprache im Client passend umstellen.",
    step2: "Richtigen Namen eintragen oder mit „stimmt“ bestätigen. Felder leer lassen, wenn du es nicht weißt.",
    step3: "Deinen Namen eintragen und „Direkt senden“ – fertig. Klappt das nicht: Datei herunterladen und auf Discord an xZcRiTiCaLZz schicken.",
    who: "Dein Name (Ingame oder Discord)", done: "Einträge", reset: "Alles leeren", download: "Datei herunterladen", send: "Direkt senden",
    sendOk: "Gesendet – vielen Dank! Deine Einträge bleiben hier gespeichert, du kannst später weitermachen.",
    sendFail: "Senden hat nicht geklappt – lade die Datei herunter und schick sie auf Discord an xZcRiTiCaLZz.",
    sendOff: "Direkt senden ist gerade nicht möglich – bitte die Datei herunterladen.", wait: "Bitte warte noch {a} Sekunden.",
    showTodo: "Zu erledigen", showAll: "Alle", showMine: "Meine Einträge", search: "Suchen …",
    saved: "Deine Eingaben werden automatisch in diesem Browser gespeichert.",
    g_mat: "Materialien", g_wpn: "Waffen", g_arm: "Rüstungen", g_all: "Alles",
    de: "Deutsch", en: "Englisch", now: "Aktuell",
    st_ok: "geprüft", st_tmp: "vorläufig", st_miss: "fehlt",
    ph_de: "Richtiger deutscher Name", ph_en: "Richtiger englischer Name", fix: "korrigieren",
    okBtn: "stimmt", okTitle: "Der aktuelle Name ist richtig",
    empty: "Hier ist nichts mehr zu tun – danke! Unter „Alle“ kannst du auch geprüfte Namen ansehen.",
    needWho: "Bitte trag zuerst deinen Namen ein, damit wir wissen, von wem die Datei ist.",
    nothing: "Du hast noch nichts eingetragen oder bestätigt.",
    fileOk: "Datei erzeugt: {a} – schick sie jetzt auf Discord an xZcRiTiCaLZz.",
    resetAsk: "Wirklich alle deine Eingaben löschen?", resetDone: "Alle Eingaben gelöscht.",
    noName: "(noch kein Name)"
  },
  en: {
    back: "Back to the website", eyebrow: "For helpers", title: "Translate item names",
    intro: "Many names in the Helper are only provisional translations. Check in the game what the item is really called and enter it here – at the end you create a file and send it to us.",
    step1: "Find the item in the game (tooltip on hover) – switch the client to the matching language.",
    step2: "Enter the correct name or confirm it with “correct”. Leave fields empty if you don't know.",
    step3: "Enter your name and click “Send directly” – done. If that fails: download the file and send it to xZcRiTiCaLZz on Discord.",
    who: "Your name (in-game or Discord)", done: "entries", reset: "Clear all", download: "Download file", send: "Send directly",
    sendOk: "Sent – thank you! Your entries stay saved here so you can continue later.",
    sendFail: "Sending failed – download the file and send it to xZcRiTiCaLZz on Discord.",
    sendOff: "Sending directly isn't possible right now – please download the file.", wait: "Please wait {a} more seconds.",
    showTodo: "To do", showAll: "All", showMine: "My entries", search: "Search …",
    saved: "Your entries are saved automatically in this browser.",
    g_mat: "Materials", g_wpn: "Weapons", g_arm: "Armour", g_all: "Everything",
    de: "German", en: "English", now: "Current",
    st_ok: "checked", st_tmp: "provisional", st_miss: "missing",
    ph_de: "Correct German name", ph_en: "Correct English name", fix: "correct it",
    okBtn: "correct", okTitle: "The current name is correct",
    empty: "Nothing left to do here – thank you! Under “All” you can also see checked names.",
    needWho: "Please enter your name first so we know who the file is from.",
    nothing: "You haven't entered or confirmed anything yet.",
    fileOk: "File created: {a} – now send it to xZcRiTiCaLZz on Discord.",
    resetAsk: "Really delete all your entries?", resetDone: "All entries deleted.",
    noName: "(no name yet)"
  }
};

let TL = (() => {
  const q = new URLSearchParams(location.search).get("lang");
  if (q === "de" || q === "en") return q;
  try { const s = localStorage.getItem(TR_LANG_KEY); if (s === "de" || s === "en") return s; } catch {}
  return (navigator.language || "de").toLowerCase().startsWith("de") ? "de" : "en";
})();
const tt = (k, a) => (TR_TEXT[TL][k] ?? TR_TEXT.de[k] ?? k).split("{a}").join(a ?? "");
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- Daten ---------- */
const GROUPS = [["mat", typeof MATERIALS !== "undefined" ? MATERIALS : {}], ["wpn", typeof WEAPONS !== "undefined" ? WEAPONS : {}], ["arm", typeof ARMORS !== "undefined" ? ARMORS : {}]];
const ITEMS = GROUPS.flatMap(([g, obj]) => Object.entries(obj).map(([id, it]) => ({ id, g, ...it })));
const CHECKED_EN = new Set(typeof NAMES_CHECKED_EN !== "undefined" ? NAMES_CHECKED_EN : []);
const TMP_DE = new Set(typeof NAMES_PROVISIONAL_DE !== "undefined" ? NAMES_PROVISIONAL_DE : []);
function statusOf(it, lang) {
  if (lang === "de") return !it.name ? "miss" : TMP_DE.has(it.id) ? "tmp" : "ok";
  return !it.nameEn ? "miss" : CHECKED_EN.has(it.id) ? "ok" : "tmp";
}
const needsWork = it => statusOf(it, "de") !== "ok" || statusOf(it, "en") !== "ok";

/* ---------- Speicher ---------- */
function load() { try { return JSON.parse(localStorage.getItem(TR_KEY) || "{}"); } catch { return {}; } }
let state = load(); state.entries = state.entries || {};
function save() { try { localStorage.setItem(TR_KEY, JSON.stringify(state)); } catch {} }
const entryDone = e => e && (e.de || e.en || e.deOk || e.enOk);
const doneCount = () => Object.values(state.entries).filter(entryDone).length;

/* ---------- Anzeige ---------- */
let group = "all", show = "todo", query = "";
const $ = id => document.getElementById(id);

function applyTexts() {
  document.documentElement.lang = TL;
  document.querySelectorAll("[data-t]").forEach(el => { el.textContent = tt(el.dataset.t); });
  document.querySelectorAll("[data-tp]").forEach(el => { el.placeholder = tt(el.dataset.tp); });
  document.querySelectorAll(".lang-switch [data-lang]").forEach(b => b.classList.toggle("is-active", b.dataset.lang === TL));
  document.title = tt("title") + " · Origins2 Helper by Society";
  $("tr-groups").innerHTML = [["all", "g_all"], ["mat", "g_mat"], ["wpn", "g_wpn"], ["arm", "g_arm"]]
    .map(([g, k]) => `<button type="button" class="chip${g === group ? " is-active" : ""}" data-group="${g}">${tt(k)}</button>`).join("");
}

function badge(st) { return `<span class="tr-st tr-st-${st}">${tt("st_" + st)}</span>`; }

function langCell(it, lang) {
  const e = state.entries[it.id] || {};
  const cur = lang === "de" ? it.name : it.nameEn;
  const st = statusOf(it, lang), ok = e[lang + "Ok"], val = e[lang] || "";
  const folded = st === "ok" && !val && !ok;   // geprüft: Eingabe erst auf Wunsch
  return `<div class="tr-lang${val || ok ? " is-filled" : ""}${folded ? " is-folded" : ""}">
    <div class="tr-cur"><span class="tr-lang-tag">${lang.toUpperCase()}</span>
      <span class="tr-cur-name${cur ? "" : " is-empty"}">${cur ? esc(cur) : "—"}</span>${badge(st)}
      ${folded ? `<button type="button" class="tr-fix" data-fix>${tt("fix")}</button>` : ""}</div>
    <div class="tr-edit">
      <input class="field-input text" data-id="${it.id}" data-lang="${lang}" value="${esc(val)}" maxlength="80" placeholder="${esc(tt("ph_" + lang))}" autocomplete="off" spellcheck="false">
      ${cur ? `<button type="button" class="tr-ok${ok ? " is-on" : ""}" data-ok="${it.id}" data-lang="${lang}" title="${esc(tt("okTitle"))}" aria-pressed="${!!ok}">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4.5 10.5 3.5 3.5 7.5-8"/></svg>${tt("okBtn")}</button>` : ""}
    </div>
  </div>`;
}

function render() {
  const q = query.trim().toLowerCase();
  const list = ITEMS.filter(it =>
    (group === "all" || it.g === group) &&
    (show === "all" || (show === "todo" && needsWork(it)) || (show === "mine" && entryDone(state.entries[it.id]))) &&
    (!q || [it.id, it.name, it.nameEn].some(s => (s || "").toLowerCase().includes(q))));
  $("tr-list").innerHTML = list.length ? list.map(it => `
    <article class="tr-row panel${entryDone(state.entries[it.id]) ? " is-done" : ""}" data-row="${it.id}">
      <div class="tr-item">
        <span class="tr-ico tr-ico-${it.g}"><img src="../${esc(it.icon)}" alt="" loading="lazy"></span>
        <span class="tr-id">${it.id}</span>
      </div>
      ${langCell(it, "de")}
      ${langCell(it, "en")}
    </article>`).join("") : `<p class="tr-empty panel">${tt("empty")}</p>`;
  $("tr-count").textContent = doneCount();
}

function setEntry(id, patch) {
  const e = { ...(state.entries[id] || {}), ...patch };
  for (const k of Object.keys(e)) if (!e[k]) delete e[k];
  if (Object.keys(e).length) state.entries[id] = e; else delete state.entries[id];
  save();
  const row = document.querySelector(`[data-row="${CSS.escape(id)}"]`);
  if (row) {
    row.classList.toggle("is-done", !!entryDone(state.entries[id]));
    ["de", "en"].forEach(l => {
      const cell = row.querySelector(`input[data-lang="${l}"]`)?.closest(".tr-lang");
      if (cell) cell.classList.toggle("is-filled", !!(state.entries[id]?.[l] || state.entries[id]?.[l + "Ok"]));
    });
  }
  $("tr-count").textContent = doneCount();
}

function msg(text, bad) { const m = $("tr-msg"); m.textContent = text; m.classList.toggle("is-bad", !!bad); }

/* ---------- Datei erzeugen / senden ---------- */
const TR_SEND_KEY = "o2h.translateSent", TR_COOLDOWN_SEC = 60;
function buildFile() {
  const who = $("tr-who").value.trim();
  if (!who) { msg(tt("needWho"), true); $("tr-who").focus(); return null; }
  const items = ITEMS.filter(it => entryDone(state.entries[it.id])).map(it => {
    const e = state.entries[it.id], out = { id: it.id };
    ["de", "en"].forEach(l => {
      const old = l === "de" ? it.name : it.nameEn;
      if (e[l]) out[l] = { alt: old || "", neu: e[l] };
      else if (e[l + "Ok"]) out[l] = { alt: old || "", bestaetigt: true };
    });
    return out;
  });
  if (!items.length) { msg(tt("nothing"), true); return null; }
  const day = new Date().toISOString().slice(0, 10);
  const data = {
    tool: "Origins2 Helper – Item-Namen", version: 1,
    von: who, datum: new Date().toISOString(), spracheSeite: TL, anzahl: items.length, items
  };
  const safe = who.replace(/[^\wäöüÄÖÜß-]+/g, "_").slice(0, 30) || "helfer";
  const name = `item-namen_${safe}_${day}.json`;
  return { who, name, data, blob: new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }) };
}
function download() {
  const f = buildFile(); if (!f) return;
  const { name } = f;
  const url = URL.createObjectURL(f.blob);
  const a = document.createElement("a"); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  msg(tt("fileOk", name));
}
/* Direkt in den Discord-Kanal für Bugs & Ideen schicken (Webhook aus ../js/feedback.js) */
async function sendDirect() {
  const hook = typeof FEEDBACK_WEBHOOK !== "undefined" ? FEEDBACK_WEBHOOK : "";
  if (!hook) { msg(tt("sendOff"), true); return; }
  let last = 0; try { last = +localStorage.getItem(TR_SEND_KEY) || 0; } catch {}
  const wait = Math.ceil((last + TR_COOLDOWN_SEC * 1000 - Date.now()) / 1000);
  if (wait > 0) { msg(tt("wait", wait), true); return; }
  const f = buildFile(); if (!f) return;
  const its = f.data.items, cnt = (l, k) => its.filter(x => x[l] && x[l][k]).length;
  const cut = (x, n) => (x.length > n ? x.slice(0, n - 1) + "…" : x);
  const preview = its.filter(x => (x.de && x.de.neu) || (x.en && x.en.neu)).slice(0, 12).map(x =>
    ["de", "en"].filter(l => x[l] && x[l].neu).map(l => `\`${x.id}\` ${l.toUpperCase()}: ${x[l].alt || "–"} → **${x[l].neu}**`).join("\n")).join("\n");
  const payload = {
    username: "Origins2 Helper", allowed_mentions: { parse: [] },
    embeds: [{
      title: "🌐 Item-Namen-Übersetzung", color: 0x4f9dde,
      description: cut(preview || "Nur Bestätigungen (siehe Datei).", 3800),
      fields: [
        { name: "Von", value: cut(f.who, 100), inline: true },
        { name: "Einträge", value: String(its.length), inline: true },
        { name: "Neu DE / EN", value: `${cnt("de", "neu")} / ${cnt("en", "neu")}`, inline: true },
        { name: "Bestätigt DE / EN", value: `${cnt("de", "bestaetigt")} / ${cnt("en", "bestaetigt")}`, inline: true }
      ],
      footer: { text: "Datei im Anhang – zum Übernehmen an Claude geben" },
      timestamp: new Date().toISOString()
    }]
  };
  const body = new FormData();
  body.append("payload_json", JSON.stringify(payload));
  body.append("files[0]", f.blob, f.name);
  const btn = $("tr-send"); btn.disabled = true; btn.classList.add("is-busy");
  try {
    const res = await fetch(hook, { method: "POST", body });
    if (!res.ok) throw new Error(res.status);
    try { localStorage.setItem(TR_SEND_KEY, String(Date.now())); } catch {}
    msg(tt("sendOk"));
  } catch { msg(tt("sendFail"), true); }
  finally { btn.disabled = false; btn.classList.remove("is-busy"); }
}

/* ---------- Start ---------- */
function init() {
  applyTexts();
  $("tr-who").value = state.who || "";
  render();
  $("tr-who").addEventListener("input", e => { state.who = e.target.value.trim(); save(); msg(""); });
  $("tr-list").addEventListener("input", e => {
    const inp = e.target.closest("input[data-id]"); if (!inp) return;
    setEntry(inp.dataset.id, { [inp.dataset.lang]: inp.value.trim() });
  });
  $("tr-list").addEventListener("click", e => {
    const fx = e.target.closest("[data-fix]");
    if (fx) { const c = fx.closest(".tr-lang"); c.classList.remove("is-folded"); fx.remove(); c.querySelector("input")?.focus(); return; }
    const b = e.target.closest("[data-ok]"); if (!b) return;
    const id = b.dataset.ok, l = b.dataset.lang, on = !(state.entries[id] || {})[l + "Ok"];
    setEntry(id, { [l + "Ok"]: on, ...(on ? { [l]: "" } : {}) });   // „stimmt“ ersetzt eine Eingabe
    b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", on);
    if (on) { const inp = b.parentElement.querySelector("input"); if (inp) inp.value = ""; }
  });
  $("tr-groups").addEventListener("click", e => { const b = e.target.closest("[data-group]"); if (!b) return; group = b.dataset.group; applyTexts(); render(); });
  document.querySelectorAll('input[name="tr-show"]').forEach(r => r.addEventListener("change", () => { show = r.value; render(); }));
  $("tr-search").addEventListener("input", e => { query = e.target.value; render(); });
  $("tr-download").addEventListener("click", download);
  $("tr-send").addEventListener("click", sendDirect);
  $("tr-reset").addEventListener("click", () => {
    if (!doneCount() || !confirm(tt("resetAsk"))) return;
    state.entries = {}; save(); render(); msg(tt("resetDone"));
  });
  document.querySelectorAll(".lang-switch [data-lang]").forEach(b => b.addEventListener("click", () => {
    TL = b.dataset.lang; try { localStorage.setItem(TR_LANG_KEY, TL); } catch {}
    applyTexts(); render();
  }));
}
init();
