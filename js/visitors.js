/* =====================================================================
   BESUCHERZÄHLER  –  über GoatCounter (kostenlos, ohne Cookies)
   ---------------------------------------------------------------------
   1. Auf goatcounter.com ein Konto anlegen, Code z. B. "origins2-helper"
   2. In den Einstellungen „Allow adding visitor counts on your website“
      aktivieren
   3. Code hier eintragen. Leer = Zähler ist ausgeblendet.
   ===================================================================== */

const GOATCOUNTER_CODE = "xzcriticalzz";


/* ---- Ab hier nichts ändern ---- */
function initVisitors() {
  const box = document.getElementById("visitor-count");
  if (!GOATCOUNTER_CODE || !/^[a-z0-9-]+$/i.test(GOATCOUNTER_CODE)) return;
  const base = `https://${GOATCOUNTER_CODE}.goatcounter.com`;
  // Besuch zählen (nur auf der echten Seite, nicht lokal)
  if (/^https?:$/.test(location.protocol) && !/^(localhost|127\.)/.test(location.hostname)) {
    const s = document.createElement("script");
    s.async = true; s.src = "https://gc.zgo.at/count.js";
    s.dataset.goatcounter = base + "/count";
    document.head.appendChild(s);
  }
  if (!box) return;
  let total = null;
  const paint = () => {
    if (total == null) return;
    box.querySelector("b").textContent = total.toLocaleString(LANG === "en" ? "en-GB" : "de-DE");
    box.hidden = false;
  };
  fetch(base + "/counter/TOTAL.json")
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(d => { total = parseInt(String(d.count).replace(/\D/g, ""), 10); if (!isNaN(total)) paint(); })
    .catch(() => {});
  window.addEventListener("langchange", paint);
}
