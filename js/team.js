/* =====================================================================
   TEAM  –  alle, die am Origins2 Helper mitwirken
   ---------------------------------------------------------------------
   TEAM_MEMBERS: Name, Aufgabe (de/en), Charakterbild in assets/team/
                 (freigestellt, PNG mit Transparenz), optional discordId
   HELPER_WEBHOOK: Webhook-URL des Kanals für Helfer-Bewerbungen
   ===================================================================== */

const HELPER_WEBHOOK = "";

/* Ränge: admin = leitet die Seite · creator = macht Content (Stream/Video)
   helper = wirkt mit (Daten, Übersetzen, Testen …), macht aber keinen Content
   Ein Mitglied kann mehrere Ränge haben – der erste ist der Hauptrang. */
const TEAM_RANKS = {
  admin:   { de: "Helper-Admin", en: "Helper Admin" },
  creator: { de: "Creator", en: "Creator" },
  helper:  { de: "Helper",  en: "Helper" }
};

const TEAM_MEMBERS = [
  { name: "xZcRiTiCaLZz", ranks: ["admin", "creator"],
    img: "assets/creator.png", discordId: "432306996344258560" },
  { name: "Lucid", ranks: ["creator"],
    img: "assets/team/lucid.png", link: "https://kick.com/drtraube" }
];

/* Auswahl im Formular */
const HELPER_TASKS = {
  data:      { de: "Screenshots & Daten sammeln", en: "Collect screenshots & data" },
  translate: { de: "Übersetzen",                  en: "Translating" },
  guides:    { de: "Guides schreiben",            en: "Writing guides" },
  testing:   { de: "Testen & Fehler melden",      en: "Testing & bug reports" },
  design:    { de: "Design",                      en: "Design" },
  promo:     { de: "Promotion",                   en: "Promotion" },
  code:      { de: "Programmieren",               en: "Programming" }
};
const HELPER_LANGS = ["Deutsch", "English", "Türkçe", "Română", "Polski", "Español", "Italiano", "Português", "Magyar", "Čeština"];


/* =====================================================================
   Ab hier nichts ändern
   ===================================================================== */
const HELPER_KEY = "o2h.helperLast";
function tmEsc(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

function renderTeam() {
  const el = document.getElementById("team-list");
  if (!el) return;
  el.innerHTML = TEAM_MEMBERS.map(m => {
    const inner = `
      <span class="tm-art"><img src="${tmEsc(m.img)}" alt="" loading="lazy"></span>
      <span class="tm-name">${tmEsc(m.name)}</span>
      <span class="tm-ranks">${(m.ranks || ["helper"]).map(r => `<span class="tm-rank tm-rank-${tmEsc(r)}">${tmEsc((TEAM_RANKS[r] || { de: r, en: r })[LANG === "en" ? "en" : "de"])}</span>`).join("")}</span>`;
    const href = m.discordId ? `https://discord.com/users/${m.discordId}` : m.link;
    const tip = m.discordId ? t("creator.discord") : t("creator.kick");
    return href
      ? `<a class="tm-card" href="${tmEsc(href)}" target="_blank" rel="noopener" title="${tmEsc(tip)}">${inner}</a>`
      : `<div class="tm-card">${inner}</div>`;
  }).join("") + `
    <button type="button" class="tm-card tm-join" data-open-helper>
      <span class="tm-art tm-plus" aria-hidden="true">+</span>
      <span class="tm-name">${t("helper.joinTitle")}</span>
      <span class="tm-role">${t("helper.joinText")}</span>
    </button>`;
}

function fillHelperChoices() {
  const tasks = document.getElementById("hp-tasks"), langs = document.getElementById("hp-langs");
  if (!tasks || !langs) return;
  const keepT = [...tasks.querySelectorAll("input:checked")].map(i => i.value);
  const keepL = [...langs.querySelectorAll("input:checked")].map(i => i.value);
  tasks.innerHTML = Object.entries(HELPER_TASKS).map(([k, v]) =>
    `<label class="hp-tick"><input type="checkbox" value="${k}"${keepT.includes(k) ? " checked" : ""}><span>${tmEsc(LANG === "en" ? v.en : v.de)}</span></label>`).join("");
  langs.innerHTML = HELPER_LANGS.map(l =>
    `<label class="hp-tick"><input type="checkbox" value="${tmEsc(l)}"${keepL.includes(l) ? " checked" : ""}><span>${tmEsc(l)}</span></label>`).join("");
}

function openHelper() {
  const d = document.getElementById("helper-dialog"); if (!d) return;
  document.getElementById("helper-form").hidden = false;
  document.getElementById("helper-done").hidden = true;
  document.getElementById("helper-error").textContent = "";
  d.hidden = false; document.body.classList.add("modal-open");
  setTimeout(() => document.getElementById("hp-ingame")?.focus(), 50);
}
function closeHelper() {
  const d = document.getElementById("helper-dialog"); if (!d) return;
  d.hidden = true; document.body.classList.remove("modal-open");
}

function hpVal(id) { const e = document.getElementById(id); return e ? e.value.trim() : ""; }

function updateHelperShot() {
  const inp = document.getElementById("hp-shot"), box = document.getElementById("hp-shot-preview");
  if (!inp || !box) return;
  const f = inp.files && inp.files[0];
  if (box.dataset.url) { URL.revokeObjectURL(box.dataset.url); delete box.dataset.url; }
  if (f && /^image\//.test(f.type)) {
    const u = URL.createObjectURL(f); box.dataset.url = u;
    box.innerHTML = `<img src="${u}" alt=""><span>${tmEsc(f.name)}</span>`; box.classList.add("has-file");
  } else { box.innerHTML = `<span>${t("apply.shotHint")}</span>`; box.classList.remove("has-file"); }
}

async function submitHelper(e) {
  e.preventDefault();
  const err = document.getElementById("helper-error"), btn = document.getElementById("helper-submit");
  err.textContent = "";
  if (hpVal("hp-website")) { document.getElementById("helper-form").hidden = true; document.getElementById("helper-done").hidden = false; return; }
  if (!HELPER_WEBHOOK) { err.textContent = t("helper.notReady"); return; }
  let last = 0; try { last = +localStorage.getItem(HELPER_KEY) || 0; } catch {}
  const wait = Math.ceil((last + 60000 - Date.now()) / 1000);
  if (wait > 0) { err.textContent = t("apply.wait", wait); return; }

  const tasks = [...document.querySelectorAll("#hp-tasks input:checked")].map(i => HELPER_TASKS[i.value].de);
  const langs = [...document.querySelectorAll("#hp-langs input:checked")].map(i => i.value);
  const v = {
    ingame: hpVal("hp-ingame"), discord: hpVal("hp-discord"), age: hpVal("hp-age"),
    since: hpVal("hp-since"), level: hpVal("hp-level"), time: hpVal("hp-time"),
    guild: hpVal("hp-guild"), about: hpVal("hp-about")
  };
  const file = document.getElementById("hp-shot").files[0];
  const consent = document.getElementById("hp-consent").checked;
  if (!v.ingame || !v.discord || !v.age || !v.since || !tasks.length || !langs.length || !file) { err.textContent = t("helper.required"); return; }
  if (!consent) { err.textContent = t("helper.consentMissing"); return; }
  if (!/^image\//.test(file.type)) { err.textContent = t("apply.badFile"); return; }
  if (file.size > 8 * 1024 * 1024) { err.textContent = t("apply.tooBig"); return; }

  const cut = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s) || "–";
  const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "") || "png";
  const fname = `charakter.${ext}`;
  const payload = {
    username: "Origins2 Helper", allowed_mentions: { parse: [] },
    embeds: [{
      title: "🛠️ Neue Helfer-Bewerbung", color: 0x7fb466,
      fields: [
        { name: "Charakter", value: cut(v.ingame, 100), inline: true },
        { name: "Discord", value: cut(v.discord, 100), inline: true },
        { name: "Alter", value: cut(v.age, 20), inline: true },
        { name: "Spielt Origins2 seit", value: cut(v.since, 60), inline: true },
        { name: "Höchstes Level", value: cut(v.level, 20), inline: true },
        { name: "Gilde", value: v.guild === "society" ? "Society" : v.guild === "other" ? "Andere Gilde" : "Keine Gilde", inline: true },
        { name: "Möchte helfen bei", value: cut(tasks.join(", "), 300), inline: false },
        { name: "Sprachen", value: cut(langs.join(", "), 200), inline: true },
        { name: "Zeit pro Woche", value: cut(v.time, 40), inline: true },
        { name: "Über mich / Motivation", value: cut(v.about, 1000), inline: false }
      ],
      image: { url: `attachment://${fname}` },
      footer: { text: `Einwilligung erteilt · Seite: ${LANG.toUpperCase()}` },
      timestamp: new Date().toISOString()
    }]
  };
  const body = new FormData();
  body.append("payload_json", JSON.stringify(payload));
  body.append("files[0]", file, fname);
  btn.disabled = true; btn.classList.add("is-busy");
  try {
    const res = await fetch(HELPER_WEBHOOK, { method: "POST", body });
    if (!res.ok) throw new Error(res.status);
    try { localStorage.setItem(HELPER_KEY, String(Date.now())); } catch {}
    document.getElementById("helper-form").reset(); updateHelperShot();
    document.getElementById("helper-form").hidden = true; document.getElementById("helper-done").hidden = false;
  } catch { err.textContent = t("apply.failed"); }
  finally { btn.disabled = false; btn.classList.remove("is-busy"); }
}

function initTeam() {
  renderTeam(); fillHelperChoices();
  const d = document.getElementById("helper-dialog");
  document.addEventListener("click", e => { if (e.target.closest("[data-open-helper]")) openHelper(); });
  if (d) {
    d.addEventListener("click", e => { if (e.target === d || e.target.closest("[data-close-helper]")) closeHelper(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !d.hidden) closeHelper(); });
    document.getElementById("helper-form").addEventListener("submit", submitHelper);
    document.getElementById("hp-shot").addEventListener("change", updateHelperShot);
    const drop = document.getElementById("hp-shot-preview");
    ["dragover", "dragenter"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add("is-drag"); }));
    ["dragleave", "drop"].forEach(ev => drop.addEventListener(ev, () => drop.classList.remove("is-drag")));
    drop.addEventListener("drop", e => {
      e.preventDefault(); const f = e.dataTransfer.files && e.dataTransfer.files[0]; if (!f) return;
      const dt = new DataTransfer(); dt.items.add(f); document.getElementById("hp-shot").files = dt.files; updateHelperShot();
    });
    updateHelperShot();
  }
  window.addEventListener("langchange", () => { renderTeam(); fillHelperChoices(); updateHelperShot(); });
}
