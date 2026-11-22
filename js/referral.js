/* =====================================================================
   PROMOTER-CODE  –  Info-Fenster „Vorteile & Infos“
   ---------------------------------------------------------------------
   Öffnet sich auf der Website über den Referral-Kasten oben und in der
   Mini-Leiste über den Knopf mit dem Code (eigenes Mini-Fenster ?mini=ref).

   REF_CODE    : dein Promoter-Code
   REF_REWARDS : Belohnungen laut Ingame-Fenster (F9 → Referral)
                 level = ab welchem Level, items = Bilder in assets/referral/
                 (Bilder direkt aus dem Ingame-Fenster, inkl. Mengenangabe)
                 name/nameEn = Name auf Deutsch / Englisch (nameEn vorläufig übersetzt)
   Live-Status und Kanal kommen aus js/streamers.js (Eintrag mit diesem refCode).
   ===================================================================== */

const REF_CODE = "CRITICALZ";
const REF_REWARDS = [
  { level: 30, items: [
    { img: "30-1", name: "Buffi (5 Tage)",          nameEn: "Buffi (5 days)" },
    { img: "30-2", name: "10× Monsterfisch",        nameEn: "10× Monster Fish" },
    { img: "30-3", name: "10× Metinfisch",          nameEn: "10× Metin Fish" },
    { img: "30-4", name: "10× Bossfisch",           nameEn: "10× Boss Fish" },
    { img: "30-5", name: "10× Erfahrungsfisch",     nameEn: "10× Experience Fish" } ] },
  { level: 50, items: [
    { img: "50-1", name: "Anfänger-Rüstungseffekt", nameEn: "Beginner Armour Effect" },
    { img: "50-2", name: "Anfänger-Waffeneffekt",   nameEn: "Beginner Weapon Effect" } ] },
  { level: 75, items: [
    { img: "75-1", name: "25× Elixier des Forschers", nameEn: "25× Researcher's Elixir" },
    { img: "75-2", name: "25× Zeitspirale",           nameEn: "25× Time Spiral" },
    { img: "75-3", name: "1000× Gegenstand verzaubern", nameEn: "1000× Enchant Item" },
    { img: "75-4", name: "Diebeshandschuh (10 Std.)", nameEn: "Thief's Glove (10 h)" },
    { img: "75-5", name: "Erfahrungsring (10 Std.)",  nameEn: "Experience Ring (10 h)" } ] },
  { level: 90, items: [
    { img: "90-1", name: "Anfänger-Löwe (Reittier-Kostüm)",    nameEn: "Beginner Lion (mount costume)" },
    { img: "90-2", name: "Anfänger-Leonidas (Haustier-Kostüm)", nameEn: "Beginner Leonidas (pet costume)" } ] }
];


/* ---------------- ab hier nichts ändern ---------------- */
function refStreamer() {
  return (typeof STREAMERS !== "undefined" && STREAMERS.find(s => s.refCode === REF_CODE)) || null;
}
const riEsc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function refInfoHtml() {
  const st = refStreamer();
  const pf = st && typeof PLATFORMS !== "undefined" ? PLATFORMS[st.platform] : null;
  const rewards = REF_REWARDS.map(r => `
    <div class="ri-tier">
      <span class="ri-lvl"><small>Level</small>${r.level}</span>
      <ul class="ri-items">${r.items.map(i => {
        const n = (typeof LANG !== "undefined" && LANG === "en" ? (i.nameEn || i.name) : i.name) || t("ri.nameTbd");
        return `<li title="${riEsc(n)}"><img src="assets/referral/${i.img}.png" alt="" loading="lazy"><span${i.name ? "" : ' class="is-tbd"'}>${riEsc(n)}</span></li>`;
      }).join("")}</ul>
    </div>`).join("");
  return `
    <div class="ri">
      <div class="ri-code">
        <div>
          <p class="ri-label">${t("ri.codeLabel")}</p>
          <p class="ri-codeval">${riEsc(REF_CODE)}</p>
        </div>
        <button type="button" class="btn-gold ri-copy" data-ri-copy>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>
          <span>${t("ri.copy")}</span>
        </button>
      </div>

      <ol class="ri-steps">
        <li><b>1</b><span>${t("ri.step1")}</span></li>
        <li><b>2</b><span>${t("ri.step2", riEsc(REF_CODE))}</span></li>
        <li><b>3</b><span>${t("ri.step3")}</span></li>
      </ol>

      <p class="ri-sub">${t("ri.rewards")}</p>
      <div class="ri-rewards">${rewards}</div>

      ${st ? `
      <div class="ri-stream${st.live ? " is-live" : ""}">
        ${st.avatar ? `<img class="ri-ava" src="${riEsc(st.avatar)}" alt="" onerror="this.remove()">` : ""}
        <div class="ri-who">
          <p class="ri-name">${riEsc(st.name)}</p>
          <p class="ri-status"><i></i>${st.live ? t("ri.live") : t("ri.offline")}${pf ? ` · ${pf.label}` : ""}</p>
        </div>
        <a class="ri-watch" href="${riEsc(st.url)}" target="_blank" rel="noopener">
          ${st.live ? t("ri.watchLive") : t("ri.toChannel")}
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M11 3h6v6h-2V6.4l-6.3 6.3-1.4-1.4L13.6 5H11V3zM5 5h3v2H5v8h8v-3h2v5H3V5h2z"/></svg>
        </a>
      </div>` : ""}
    </div>`;
}

function wireRefInfo(root) {
  const btn = root.querySelector("[data-ri-copy]");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    const ok = typeof copyText === "function" ? await copyText(REF_CODE) : false;
    const lab = btn.querySelector("span");
    btn.classList.toggle("is-done", ok);
    lab.textContent = ok ? t("ri.copied") : t("ri.copy");
    if (typeof toast === "function" && !document.documentElement.classList.contains("is-mini")) toast(ok ? t("ref.copied") : t("ref.failed"));
    clearTimeout(btn._t); btn._t = setTimeout(() => { btn.classList.remove("is-done"); lab.textContent = t("ri.copy"); }, 1600);
  });
}

/* ---------- Website: Dialog ---------- */
function renderRefDialog() {
  const body = document.getElementById("ref-dialog-body");
  if (!body) return;
  body.innerHTML = refInfoHtml(); wireRefInfo(body);
}
function openRefDialog() {
  const d = document.getElementById("ref-dialog"); if (!d) return;
  renderRefDialog();
  d.hidden = false; document.body.classList.add("modal-open");
}
function closeRefDialog() {
  const d = document.getElementById("ref-dialog"); if (!d) return;
  d.hidden = true; document.body.classList.remove("modal-open");
}

/* ---------- Mini-Fenster (?mini=ref) ---------- */
function buildRefMini() {
  document.documentElement.classList.add("is-mini", "is-mini-ref");
  const box = document.createElement("div");
  box.id = "ref-mini";
  const draw = () => {
    box.innerHTML = `
      <div class="rm-bar">
        <p class="rm-title">${t("ri.title")}</p>
        <button type="button" class="mini-boss-btn" data-collapse title="${riEsc(t("dock.collapse"))}" aria-label="${riEsc(t("dock.collapse"))}">${typeof COLLAPSE_SVG !== "undefined" ? COLLAPSE_SVG : "▴"}</button>
      </div>
      <div class="rm-body">${refInfoHtml()}</div>`;
    wireRefInfo(box);
  };
  draw(); window.addEventListener("langchange", draw);
  box.addEventListener("click", e => { if (e.target.closest("[data-collapse]") && typeof miniGo === "function") miniGo("dock"); });
  document.body.prepend(box);
  document.title = t("ri.title") + " · Origins2 Helper";
}

function initRefInfo() {
  if (typeof MINI_MODE !== "undefined" && MINI_MODE === "ref") return buildRefMini();
  const d = document.getElementById("ref-dialog");
  document.addEventListener("click", e => { if (e.target.closest("[data-open-ref]")) openRefDialog(); });
  if (!d) return;
  d.addEventListener("click", e => { if (e.target === d || e.target.closest("[data-close-ref]")) closeRefDialog(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !d.hidden) closeRefDialog(); });
  window.addEventListener("langchange", () => { if (!d.hidden) renderRefDialog(); });
}
