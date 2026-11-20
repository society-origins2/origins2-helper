/* =====================================================================
   PROMOTER-BEWERBUNG  –  schickt Bewerbungen in einen Discord-Kanal
   ---------------------------------------------------------------------
   APPLY_WEBHOOK: Webhook-URL des privaten Discord-Kanals.
   Bei Spam in Discord einen neuen Webhook anlegen und hier ersetzen.
   ===================================================================== */

const APPLY_WEBHOOK = "https://discord.com/api/webhooks/1573426103224373309/Kjkjfpw7V811Uc_yF_nmyqn09HdVWRyI3ZSMRVII45S2zQJnIWPV8jcVfFklgTzPHWDi";
const APPLY_COOLDOWN_SEC = 60;


/* =====================================================================
   Ab hier nichts ändern
   ===================================================================== */
const APPLY_KEY = "o2h.applyLast";

function applyField(id) { const el = document.getElementById(id); return el ? el.value.trim() : ""; }

function openApply() {
  const d = document.getElementById("apply-dialog");
  if (!d) return;
  document.getElementById("apply-form").hidden = false;
  document.getElementById("apply-done").hidden = true;
  document.getElementById("apply-error").textContent = "";
  d.hidden = false;
  document.body.classList.add("modal-open");
  setTimeout(() => document.getElementById("ap-ingame")?.focus(), 50);
}
function closeApply() {
  const d = document.getElementById("apply-dialog");
  if (!d) return;
  d.hidden = true;
  document.body.classList.remove("modal-open");
}

async function submitApply(e) {
  e.preventDefault();
  const err = document.getElementById("apply-error");
  const btn = document.getElementById("apply-submit");
  err.textContent = "";

  // Bot-Falle: unsichtbares Feld muss leer bleiben
  if (applyField("ap-website")) { showApplyDone(); return; }

  // Bremse
  let last = 0; try { last = +localStorage.getItem(APPLY_KEY) || 0; } catch {}
  const wait = Math.ceil((last + APPLY_COOLDOWN_SEC * 1000 - Date.now()) / 1000);
  if (wait > 0) { err.textContent = t("apply.wait", wait); return; }

  const v = {
    ingame: applyField("ap-ingame"), discord: applyField("ap-discord"),
    url: applyField("ap-url"), code: applyField("ap-code").toUpperCase()
  };
  const fileEl = document.getElementById("ap-shot");
  const file = fileEl && fileEl.files && fileEl.files[0];
  if (!v.ingame || !v.discord || !v.url || !v.code || !file) { err.textContent = t("apply.required"); return; }
  if (!/^https?:\/\//i.test(v.url)) { err.textContent = t("apply.badUrl"); return; }
  if (!/^image\//.test(file.type)) { err.textContent = t("apply.badFile"); return; }
  if (file.size > 8 * 1024 * 1024) { err.textContent = t("apply.tooBig"); return; }

  const host = (() => { try { return new URL(v.url).hostname.replace(/^www\./, ""); } catch { return ""; } })();
  const platform = /kick\.com/.test(host) ? "Kick" : /twitch\.tv/.test(host) ? "Twitch" : /youtu/.test(host) ? "YouTube" : (host || "–");
  const cut = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s) || "–";
  const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "") || "png";
  const fname = `charakter.${ext}`;
  const payload = {
    username: "Origins2 Helper",
    allowed_mentions: { parse: [] },
    embeds: [{
      title: "📝 Neue Promoter-Bewerbung",
      color: 0xd4a24c,
      fields: [
        { name: "Ingame-Name", value: cut(v.ingame, 100), inline: true },
        { name: "Discord", value: cut(v.discord, 100), inline: true },
        { name: "Referral-Code", value: cut(v.code, 30), inline: true },
        { name: `Kanal (${platform})`, value: cut(v.url, 300), inline: false }
      ],
      image: { url: `attachment://${fname}` },
      footer: { text: `Seite: ${LANG.toUpperCase()}` },
      timestamp: new Date().toISOString()
    }]
  };
  const body = new FormData();
  body.append("payload_json", JSON.stringify(payload));
  body.append("files[0]", file, fname);

  btn.disabled = true; btn.classList.add("is-busy");
  try {
    const res = await fetch(APPLY_WEBHOOK, { method: "POST", body });
    if (!res.ok) throw new Error(res.status);
    try { localStorage.setItem(APPLY_KEY, String(Date.now())); } catch {}
    document.getElementById("apply-form").reset();
    updateShotPreview();
    showApplyDone();
  } catch {
    err.textContent = t("apply.failed");
  } finally {
    btn.disabled = false; btn.classList.remove("is-busy");
  }
}

function updateShotPreview() {
  const inp = document.getElementById("ap-shot"), box = document.getElementById("ap-shot-preview");
  if (!inp || !box) return;
  const f = inp.files && inp.files[0];
  if (box.dataset.url) { URL.revokeObjectURL(box.dataset.url); delete box.dataset.url; }
  if (f && /^image\//.test(f.type)) {
    const u = URL.createObjectURL(f); box.dataset.url = u;
    box.innerHTML = `<img src="${u}" alt=""><span>${f.name.replace(/[<>&"]/g, "")}</span>`;
    box.classList.add("has-file");
  } else { box.innerHTML = `<span>${t("apply.shotHint")}</span>`; box.classList.remove("has-file"); }
}

function showApplyDone() {
  document.getElementById("apply-form").hidden = true;
  document.getElementById("apply-done").hidden = false;
}

function initApply() {
  const d = document.getElementById("apply-dialog");
  if (!d) return;
  document.querySelectorAll("[data-open-apply]").forEach(b => b.addEventListener("click", openApply));
  d.addEventListener("click", e => { if (e.target === d || e.target.closest("[data-close-apply]")) closeApply(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !d.hidden) closeApply(); });
  document.getElementById("apply-form").addEventListener("submit", submitApply);
  document.getElementById("ap-shot").addEventListener("change", updateShotPreview);
  // Bild per Drag & Drop
  const drop = document.getElementById("ap-shot-preview");
  ["dragover", "dragenter"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add("is-drag"); }));
  ["dragleave", "drop"].forEach(ev => drop.addEventListener(ev, () => drop.classList.remove("is-drag")));
  drop.addEventListener("drop", e => {
    e.preventDefault();
    const f = e.dataTransfer.files && e.dataTransfer.files[0]; if (!f) return;
    const dt = new DataTransfer(); dt.items.add(f); document.getElementById("ap-shot").files = dt.files; updateShotPreview();
  });
  window.addEventListener("langchange", updateShotPreview);
  updateShotPreview();
}
