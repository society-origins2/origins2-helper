/* =====================================================================
   Origins2 Helper by Society – App-Grundgerüst
   Bilder-Fallbacks, Banner, Referral-Kopieren, Toast
   ===================================================================== */

/* ---------- Platzhalter, solange die echten Bilder fehlen ---------- */
const FALLBACKS = {
  origins2: `
    <div class="logo-fallback" role="img" aria-label="Origins2">
      <span class="font-display">ORIGINS<b>2</b></span>
    </div>`,
  society: `
    <span class="society-fallback font-display" role="img" aria-label="Society">S</span>`
};

function applyFallback(img) {
  const html = FALLBACKS[img.dataset.fallback];
  if (!html || img.dataset.fallbackDone) return;
  img.dataset.fallbackDone = "1";
  const wrap = document.createElement("div");
  wrap.innerHTML = html.trim();
  img.replaceWith(wrap.firstElementChild);
}

function initImageFallbacks() {
  document.querySelectorAll("img[data-fallback]").forEach(img => {
    if (img.complete && img.naturalWidth === 0) applyFallback(img);
    else img.addEventListener("error", () => applyFallback(img), { once: true });
  });
}

/* ---------- Hero-Banner: nur setzen, wenn die Datei existiert ---------- */
function initBanner() {
  const bg = document.querySelector("[data-banner]");
  if (!bg) return;
  const src = bg.dataset.banner;
  const probe = new Image();
  probe.onload = () => {
    bg.style.backgroundImage = `url("${src}")`;
    bg.classList.add("has-image");
  };
  probe.src = src;
}

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2200);
}

/* ---------- Kopieren (mit Fallback für ältere Browser) ---------- */
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch { ok = false; }
    ta.remove();
    return ok;
  }
}

function initReferral() {
  const btn = document.getElementById("copy-ref");
  if (!btn) return;
  const label = btn.querySelector("[data-label]");
  btn.addEventListener("click", async () => {
    const ok = await copyText(btn.dataset.copy);
    if (ok) {
      btn.classList.add("is-done");
      label.textContent = t("copy.ok");
      toast(t("ref.copied"));
      setTimeout(() => { btn.classList.remove("is-done"); label.textContent = t("copy.btn"); }, 1800);
    } else {
      toast(t("ref.failed"));
    }
  });
}

/* ---------- Reiter: zwischen den Bereichen blättern ---------- */
const VIEWS = ["uebersicht", "bosse", "upp-rechner", "kalender"];

function showView(name, scroll) {
  if (!VIEWS.includes(name)) name = VIEWS[0];
  document.querySelectorAll("[data-view]").forEach(v => { v.hidden = v.dataset.view !== name; });
  document.querySelectorAll("[data-tab]").forEach(t => {
    const active = t.dataset.tab === name;
    t.classList.toggle("is-active", active);
    t.setAttribute("aria-selected", active ? "true" : "false");
    if (active) t.scrollIntoView({ block: "nearest", inline: "nearest" });
  });
  if (scroll) {
    const header = document.querySelector("header.hero");
    const top = header ? header.offsetHeight : 0;
    if (window.scrollY > top || scroll === "force") window.scrollTo({ top, behavior: "smooth" });
  }
}

function initTabs() {
  const current = () => location.hash.replace("#", "");
  window.addEventListener("hashchange", () => showView(current(), "force"));
  showView(current(), current() ? "force" : false);
}

/* ---------- Sprache & Teilen ---------- */
function initLangAndShare() {
  applyI18n();
  document.querySelectorAll("[data-lang]").forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));
  const sb = document.getElementById("share-site");
  if (sb) sb.addEventListener("click", async () => {
    const u = new URL(location.href);
    u.search = ""; if (LANG === "en") u.searchParams.set("lang", "en");
    const url = u.toString();
    try {
      if (navigator.share) { await navigator.share({ title: "Origins2 Helper by Society", text: t("share.site"), url }); return; }
    } catch (e) { if (e && e.name === "AbortError") return; }
    const ok = await copyText(url);
    toast(ok ? t("share.copied") : t("share.failed"));
  });
}

/* ---------- Start ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initLangAndShare();
  initImageFallbacks();
  initBanner();
  initReferral();
  initTabs();
  if (typeof initStreamers === "function") initStreamers();
  if (typeof initEvents === "function") initEvents();
  if (typeof initUpp === "function") initUpp();
});
