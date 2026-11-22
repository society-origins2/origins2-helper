/* =====================================================================
   BUGS & VORSCHLÄGE  –  schickt Meldungen in einen Discord-Kanal
   ---------------------------------------------------------------------
   FEEDBACK_WEBHOOK: Webhook-URL des Discord-Kanals für Bugs & Ideen.
   Leer lassen = Formular zeigt „gleich startklar“.
   Bei Spam in Discord einen neuen Webhook anlegen und hier ersetzen.
   ===================================================================== */

const FEEDBACK_WEBHOOK = "https://discord.com/api/webhooks/1574058373563809912/E4iX8fGME4vHqtru46zID-HTABZyZ9qmyM7pt8v9b5qs6dEQzlHJTRS2IpAXWVGHNQNv";
const FEEDBACK_COOLDOWN_SEC = 60;


/* =====================================================================
   Ab hier nichts ändern
   ===================================================================== */
const FEEDBACK_KEY = "o2h.feedbackLast";
/* Bereiche der Seite – Schlüssel = Reiter (data-view) */
const FEEDBACK_AREAS = ["uebersicht", "upp-rechner", "skilltree", "bosse", "kalender", "event-helper", "team", "other"];

function fbEl(id) { return document.getElementById(id); }
function fbVal(id) { const el = fbEl(id); return el ? el.value.trim() : ""; }
function fbType() { return document.querySelector('input[name="fb-type"]:checked')?.value || "bug"; }
function fbCurrentView() {
  const v = document.querySelector(".view:not([hidden])")?.dataset.view;
  return FEEDBACK_AREAS.includes(v) ? v : "other";
}

function fillFeedbackAreas(selected) {
  const sel = fbEl("fb-area"); if (!sel) return;
  const cur = selected || sel.value || "other";
  sel.innerHTML = FEEDBACK_AREAS.map(a => `<option value="${a}"${a === cur ? " selected" : ""}>${t("fb.area." + a)}</option>`).join("");
}

function openFeedback(e) {
  const d = fbEl("feedback-dialog"); if (!d) return;
  const want = e && e.currentTarget && e.currentTarget.dataset ? e.currentTarget.dataset.openFeedback : "";
  if (want === "bug" || want === "idea") { const r = document.querySelector(`input[name="fb-type"][value="${want}"]`); if (r) r.checked = true; }
  fbEl("feedback-form").hidden = false;
  fbEl("feedback-done").hidden = true;
  fbEl("feedback-error").textContent = "";
  fillFeedbackAreas(fbCurrentView());   // Bereich = Reiter, auf dem man gerade ist
  updateFbShot();
  d.hidden = false;
  document.body.classList.add("modal-open");
  setTimeout(() => fbEl("fb-text")?.focus(), 50);
}
function closeFeedback() {
  const d = fbEl("feedback-dialog"); if (!d) return;
  d.hidden = true;
  document.body.classList.remove("modal-open");
}

/* Browser & Gerät kurz beschreiben (hilft beim Nachstellen von Bugs) */
function fbClientInfo() {
  const ua = navigator.userAgent;
  const br = /Edg\//.test(ua) ? "Edge" : /OPR\//.test(ua) ? "Opera" : /Firefox\//.test(ua) ? "Firefox" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "?";
  const os = /Windows/.test(ua) ? "Windows" : /Android/.test(ua) ? "Android" : /iPhone|iPad/.test(ua) ? "iOS" : /Mac OS/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "?";
  const mobile = /Mobi|Android|iPhone/.test(ua) ? " · Handy" : "";
  return `${br} · ${os}${mobile} · ${innerWidth}×${innerHeight}`;
}

async function submitFeedback(e) {
  e.preventDefault();
  const err = fbEl("feedback-error"), btn = fbEl("feedback-submit");
  err.textContent = "";

  if (fbVal("fb-website")) { showFeedbackDone(); return; }          // Bot-Falle
  if (!FEEDBACK_WEBHOOK) { err.textContent = t("fb.notReady"); return; }

  let last = 0; try { last = +localStorage.getItem(FEEDBACK_KEY) || 0; } catch {}
  const wait = Math.ceil((last + FEEDBACK_COOLDOWN_SEC * 1000 - Date.now()) / 1000);
  if (wait > 0) { err.textContent = t("apply.wait", wait); return; }

  const type = fbType(), area = fbVal("fb-area") || "other";
  const text = fbVal("fb-text"), discord = fbVal("fb-discord");
  const file = fbEl("fb-shot")?.files?.[0];
  if (text.length < 10) { err.textContent = t("fb.tooShort"); return; }
  if (file && !/^image\//.test(file.type)) { err.textContent = t("apply.badFile"); return; }
  if (file && file.size > 8 * 1024 * 1024) { err.textContent = t("apply.tooBig"); return; }

  const cut = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s) || "–";
  const isBug = type === "bug";
  const ext = file ? ((file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "") || "png") : "";
  const fname = `screenshot.${ext}`;
  const embed = {
    title: isBug ? "🐞 Bug-Meldung" : "💡 Verbesserungsvorschlag",
    color: isBug ? 0xe5484d : 0xd4a24c,
    description: cut(text, 3500),
    fields: [
      { name: "Bereich", value: I18N.de["fb.area." + area] || area, inline: true },
      { name: "Discord", value: cut(discord, 100), inline: true },
      { name: "Seite", value: cut(location.href.replace(/^https?:\/\//, ""), 300), inline: false },
      { name: "Gerät", value: fbClientInfo() + " · " + LANG.toUpperCase(), inline: false }
    ],
    timestamp: new Date().toISOString()
  };
  if (file) embed.image = { url: `attachment://${fname}` };
  const body = new FormData();
  body.append("payload_json", JSON.stringify({ username: "Origins2 Helper", allowed_mentions: { parse: [] }, embeds: [embed] }));
  if (file) body.append("files[0]", file, fname);

  btn.disabled = true; btn.classList.add("is-busy");
  try {
    const res = await fetch(FEEDBACK_WEBHOOK, { method: "POST", body });
    if (!res.ok) throw new Error(res.status);
    try { localStorage.setItem(FEEDBACK_KEY, String(Date.now())); } catch {}
    fbEl("feedback-form").reset();
    showFeedbackDone();
  } catch {
    err.textContent = t("apply.failed");
  } finally {
    btn.disabled = false; btn.classList.remove("is-busy");
  }
}

function updateFbShot() {
  const inp = fbEl("fb-shot"), box = fbEl("fb-shot-preview");
  if (!inp || !box) return;
  const f = inp.files && inp.files[0];
  if (box.dataset.url) { URL.revokeObjectURL(box.dataset.url); delete box.dataset.url; }
  if (f && /^image\//.test(f.type)) {
    const u = URL.createObjectURL(f); box.dataset.url = u;
    box.innerHTML = `<img src="${u}" alt=""><span>${f.name.replace(/[<>&"]/g, "")}</span>`;
    box.classList.add("has-file");
  } else { box.innerHTML = `<span>${t("fb.shotHint")}</span>`; box.classList.remove("has-file"); }
}

function showFeedbackDone() {
  fbEl("feedback-form").hidden = true;
  fbEl("feedback-done").hidden = false;
  const h = fbEl("feedback-done-title"); if (h) h.textContent = t(fbType() === "bug" ? "fb.thanksBug" : "fb.thanksIdea");
}


/* Karte „Hilf mit!“ (rechter Rand): nie über den Hero oder die Reiterleiste legen.
   Steht mittig im Fenster – aber höchstens so weit oben, dass sie unter Hero + Reiterleiste beginnt. */
function placeFeedbackSide() {
  const card = document.querySelector(".fb-side");
  if (!card || getComputedStyle(card).display === "none") return;
  const hero = document.querySelector("header.hero"), bar = document.querySelector(".topbar");
  const gap = 20;
  const below = Math.max(hero ? hero.getBoundingClientRect().bottom : 0, bar ? bar.getBoundingClientRect().bottom : 0) + gap;
  const centered = (innerHeight - card.offsetHeight) / 2;
  const top = Math.round(Math.max(below, centered));
  card.style.setProperty("--fb-side-top", top + "px");
  card.style.setProperty("--fb-side-shift", "0px");
  // passt sie (noch) nicht ganz ins Fenster → ausblenden, solange zeigt der Knopf unten rechts
  document.documentElement.classList.toggle("fb-side-off", top + card.offsetHeight > innerHeight - 12);
}

function initFeedback() {
  const d = fbEl("feedback-dialog"); if (!d) return;
  document.querySelectorAll("[data-open-feedback]").forEach(b => b.addEventListener("click", openFeedback));
  d.addEventListener("click", e => { if (e.target === d || e.target.closest("[data-close-feedback]")) closeFeedback(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !d.hidden) closeFeedback(); });
  fbEl("feedback-form").addEventListener("submit", submitFeedback);
  fbEl("fb-shot").addEventListener("change", updateFbShot);
  const drop = fbEl("fb-shot-preview");
  ["dragover", "dragenter"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add("is-drag"); }));
  ["dragleave", "drop"].forEach(ev => drop.addEventListener(ev, () => drop.classList.remove("is-drag")));
  drop.addEventListener("drop", e => {
    e.preventDefault();
    const f = e.dataTransfer.files && e.dataTransfer.files[0]; if (!f) return;
    const dt = new DataTransfer(); dt.items.add(f); fbEl("fb-shot").files = dt.files; updateFbShot();
  });
  // Screenshot direkt mit Strg+V einfügen, solange das Formular offen ist
  document.addEventListener("paste", e => {
    if (d.hidden) return;
    const f = [...(e.clipboardData?.files || [])].find(x => /^image\//.test(x.type)); if (!f) return;
    const dt = new DataTransfer(); dt.items.add(f); fbEl("fb-shot").files = dt.files; updateFbShot();
  });
  window.addEventListener("langchange", () => { fillFeedbackAreas(); updateFbShot(); });
  fillFeedbackAreas("other"); updateFbShot();
  placeFeedbackSide();
  addEventListener("scroll", placeFeedbackSide, { passive: true });
  addEventListener("resize", placeFeedbackSide);
  addEventListener("hashchange", () => setTimeout(placeFeedbackSide, 50));
  window.addEventListener("langchange", () => setTimeout(placeFeedbackSide, 50));
  // Link …/#feedback öffnet das Formular direkt
  if (location.hash === "#feedback") openFeedback();
}
