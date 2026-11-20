/* =====================================================================
   SPRACHEN  –  alle Texte der Seite auf Deutsch und Englisch
   ---------------------------------------------------------------------
   Neue Texte: gleichen Schlüssel in "de" und "en" eintragen.
   {a}, {b} … sind Platzhalter, die das Programm füllt.
   Item- und Bossnamen stehen NICHT hier, sondern in data.js / events.js
   (Feld nameEn bzw. bossesEn).
   ===================================================================== */

const I18N = {
  de: {
    "meta.description": "Origins2 Helper by Society – Boss-Timer, Upp-Kostenrechner, Eventkalender und Promoter für Origins2.",
    "hero.tagline": "Boss-Timer, Upp-Kostenrechner, Eventkalender und Promoter – alles für deinen Weg auf Origins2 an einem Ort.",
    "ref.label": "Referral-Code",
    "ref.copy": "Code kopieren",
    "ref.register": "Jetzt registrieren",
    "ref.copied": "Referral-Code CRITICALZ kopiert",
    "ref.failed": "Kopieren nicht möglich – Code bitte abtippen: CRITICALZ",
    "lang.label": "Sprache",
    "share.btn": "Teilen",
    "share.site": "Schau dir den Origins2 Helper by Society an – Boss-Timer, Upp-Rechner und mehr.",
    "share.copied": "Link kopiert – einfach weiterschicken",
    "share.failed": "Teilen ging nicht",
    "copy.ok": "Kopiert",
    "copy.btn": "Kopieren",

    "tab.overview": "Übersicht",
    "tab.bosses": "Boss-Timer",
    "tab.upp": "Upp-Rechner",
    "tab.calendar": "Kalender",
    "soon": "Bald",
    "nav.label": "Bereiche",

    "ticker.label": "Nächste Weltbosse",
    "ticker.title": "Weltbosse",
    "ticker.clock": "Aktuelle Serverzeit",

    "promoter.title": "Promoter",
    "promoter.liveOf": "{a} von {b} live",
    "filter.all": "Alle",
    "filter.live": "Live",
    "filter.guild": "Gilde",
    "filter.server": "Server",
    "promoter.empty": "Gerade ist niemand aus dieser Gruppe live.",
    "promoter.guild": "Gilden-Promoter",
    "promoter.server": "Server-Promoter",
    "promoter.default": "Promoter",
    "promoter.open": "Stream öffnen",
    "status.live": "Live",
    "status.offline": "Offline",

    "tools.eyebrow": "Werkzeuge",
    "tools.title": "Mehr im Helper",
    "tools.upp.title": "Upp-Kostenrechner",
    "tools.upp.text": "Start und Ziel wählen – Einkaufsliste mit Material und Yang für Glück, Durchschnitt und Pech.",
    "tools.cal.title": "Eventkalender",
    "tools.cal.text": "Wochen- und Monatsansicht mit Filter und Erinnerungs-Glocke pro Termin.",
    "new": "Neu",

    "guild.alt": "Gilde Society",
    "guild.eyebrow": "Die Gilde dahinter",
    "guild.text": "Wir bauen den Helper für alle Origins2-Spieler – gepflegt von der Gilde Society.",

    "boss.eyebrow": "Live-Countdown",
    "boss.title": "Boss-Timer",
    "boss.note": "Alle Zeiten in Serverzeit · <span class=\"text-parch-300\">Glocke</span> = Ton 5 Min vorher und beim Spawn",
    "boss.world": "Weltbosse",
    "boss.map": "Map-Bosse",
    "boss.next": "Nächster Spawn",
    "boss.then": "Danach: {a}",
    "boss.soon": "Gleich",
    "every.min": "alle {a} Min",
    "every.h": "alle {a}h",
    "every.hm": "alle {a}h {b}",
    "bell.on": "Ton an – 5 Min vorher und beim Spawn",
    "bell.off": "Ton aus – zum Einschalten klicken",
    "bell.aria": "Ton für {a} an/aus",
    "bell.toastOn": "Ton an: {a}",
    "bell.toastOff": "Ton aus: {a}",

    "upp.eyebrow": "Materialrechner",
    "upp.title": "Upp-Kostenrechner",
    "upp.note": "Simulation mit 10.000 Durchläufen · Werte aus dem Ingame-Wiki",
    "upp.line": "Upp-Reihe",
    "upp.from": "Start",
    "upp.to": "Ziel",
    "upp.rule": "<b>Mit Magischem Stein:</b> Bei einem Fail bleibt die Stufe, Material und Yang sind weg. Pity ist eingerechnet.",
    "upp.fromLv": "ab Lv. {a}",
    "upp.chooseHigher": "Wähl ein Ziel, das über deinem Start liegt.",
    "upp.min": "Minimum",
    "upp.minSub": "Jeder Versuch gelingt sofort",
    "upp.avg": "Durchschnitt",
    "upp.avgSub": "Mittelwert aus {a} Simulationen",
    "upp.p90": "Pech-Puffer",
    "upp.p90Sub": "Reicht in 9 von 10 Fällen",
    "upp.yangLabel": "Yang Upp-Kosten",
    "upp.attempts": "Versuche",
    "upp.fails": "Fails",
    "upp.inclMat": "Inkl. Material:",
    "upp.list": "Einkaufsliste",
    "upp.priceHint": "Marktpreis pro Stück eintragen, z.&nbsp;B. <span class=\"text-parch-300\">250k</span> oder <span class=\"text-parch-300\">1,5kk</span> – wird gespeichert.",
    "upp.colMat": "Material",
    "upp.colMin": "Min.",
    "upp.colAvg": "Ø",
    "upp.colP90": "90&nbsp;%",
    "upp.colPrice": "Preis/Stk.",
    "upp.colCost": "Kosten Ø",
    "upp.price": "Preis",
    "upp.priceAria": "Marktpreis {a} pro Stück",
    "upp.noMats": "Für diesen Weg werden keine Materialien gebraucht.",
    "upp.unknown": "Unbekanntes Item ({a})",
    "upp.dl": "Liste herunterladen",
    "upp.dlMin": "Minimum",
    "upp.dlAvg": "Ø Durchschnitt",
    "upp.dlP90": "Mit Puffer",
    "upp.dlPng": "Als Bild",
    "upp.dlTxt": "Als Text",
    "upp.discord": "Discord",
    "upp.discordTitle": "Für Discord kopieren",
    "upp.shareLink": "Link teilen",
    "upp.footnote": "Ø-Mengen aufgerundet. „Mit Puffer“ reicht pro Material in 9 von 10 Fällen.",
    "upp.modeMin": "Minimum",
    "upp.modeAvg": "Durchschnitt",
    "upp.modeP90": "Mit Puffer (90 %)",
    "upp.quantity": "Menge: {a}",
    "upp.withStone": "mit Magischem Stein",
    "upp.listTitle": "Einkaufsliste",
    "upp.yangUpp": "Yang (Upp-Kosten)",
    "upp.savedPng": "Liste als Bild gespeichert",
    "upp.savedTxt": "Liste als Text gespeichert",
    "upp.pngFail": "Bild konnte nicht erstellt werden",
    "upp.discordOk": "Für Discord kopiert – einfach einfügen",
    "upp.discordFail": "Kopieren ging nicht",
    "upp.discordRule": "Mit Magischem Stein (Stufe bleibt bei Fail)",
    "upp.discordYang": "💰 Yang (Upp-Kosten): Min {a} · Ø {b} · 90% {c}",
    "upp.discordList": "**Einkaufsliste** (Minimum · Ø · 90%)",
    "upp.discordTotal": "Gesamt inkl. Material (Ø): {a}",
    "upp.fileName": "Einkaufsliste",
    "upp.to_word": "bis",
    "upp.shareText": "Upp-Kosten {a} – berechnet mit dem Origins2 Helper",

    "cal.eyebrow": "In Arbeit",
    "cal.title": "Eventkalender",
    "cal.text": "Wochen- und Monatsansicht mit Filter für Events, Weltbosse und Society-Termine – plus Erinnerungs-Glocke pro Termin.",

    "footer.tool": "Community-Tool der Gilde Society"
  },

  en: {
    "meta.description": "Origins2 Helper by Society – boss timer, upgrade cost calculator, event calendar and promoters for Origins2.",
    "hero.tagline": "Boss timer, upgrade cost calculator, event calendar and promoters – everything for your journey on Origins2 in one place.",
    "ref.label": "Referral code",
    "ref.copy": "Copy code",
    "ref.register": "Register now",
    "ref.copied": "Referral code CRITICALZ copied",
    "ref.failed": "Copy not possible – please type the code: CRITICALZ",
    "lang.label": "Language",
    "share.btn": "Share",
    "share.site": "Check out the Origins2 Helper by Society – boss timer, upgrade calculator and more.",
    "share.copied": "Link copied – just send it on",
    "share.failed": "Sharing didn't work",
    "copy.ok": "Copied",
    "copy.btn": "Copy",

    "tab.overview": "Overview",
    "tab.bosses": "Boss Timer",
    "tab.upp": "Upgrade Calculator",
    "tab.calendar": "Calendar",
    "soon": "Soon",
    "nav.label": "Sections",

    "ticker.label": "Next world bosses",
    "ticker.title": "World Bosses",
    "ticker.clock": "Current server time",

    "promoter.title": "Promoters",
    "promoter.liveOf": "{a} of {b} live",
    "filter.all": "All",
    "filter.live": "Live",
    "filter.guild": "Guild",
    "filter.server": "Server",
    "promoter.empty": "Nobody from this group is live right now.",
    "promoter.guild": "Guild promoter",
    "promoter.server": "Server promoter",
    "promoter.default": "Promoter",
    "promoter.open": "Open stream",
    "status.live": "Live",
    "status.offline": "Offline",

    "tools.eyebrow": "Tools",
    "tools.title": "More in the Helper",
    "tools.upp.title": "Upgrade Cost Calculator",
    "tools.upp.text": "Pick start and goal – shopping list with materials and Yang for best case, average and bad luck.",
    "tools.cal.title": "Event Calendar",
    "tools.cal.text": "Week and month view with filters and a reminder bell for every date.",
    "new": "New",

    "guild.alt": "Guild Society",
    "guild.eyebrow": "The guild behind it",
    "guild.text": "We build the Helper for every Origins2 player – maintained by the guild Society.",

    "boss.eyebrow": "Live countdown",
    "boss.title": "Boss Timer",
    "boss.note": "All times in server time · <span class=\"text-parch-300\">Bell</span> = sound 5 min before and at spawn",
    "boss.world": "World Bosses",
    "boss.map": "Map Bosses",
    "boss.next": "Next spawn",
    "boss.then": "Then: {a}",
    "boss.soon": "Soon",
    "every.min": "every {a} min",
    "every.h": "every {a}h",
    "every.hm": "every {a}h {b}",
    "bell.on": "Sound on – 5 min before and at spawn",
    "bell.off": "Sound off – click to turn on",
    "bell.aria": "Sound for {a} on/off",
    "bell.toastOn": "Sound on: {a}",
    "bell.toastOff": "Sound off: {a}",

    "upp.eyebrow": "Material calculator",
    "upp.title": "Upgrade Cost Calculator",
    "upp.note": "Simulation with 10,000 runs · values from the in-game wiki",
    "upp.line": "Upgrade line",
    "upp.from": "Start",
    "upp.to": "Goal",
    "upp.rule": "<b>With Magic Stone:</b> on a fail the level stays, materials and Yang are lost. Pity is included.",
    "upp.fromLv": "from Lv. {a}",
    "upp.chooseHigher": "Pick a goal above your start.",
    "upp.min": "Minimum",
    "upp.minSub": "Every attempt succeeds right away",
    "upp.avg": "Average",
    "upp.avgSub": "Mean of {a} simulations",
    "upp.p90": "Bad-luck buffer",
    "upp.p90Sub": "Enough in 9 out of 10 cases",
    "upp.yangLabel": "Yang upgrade cost",
    "upp.attempts": "Attempts",
    "upp.fails": "Fails",
    "upp.inclMat": "Incl. materials:",
    "upp.list": "Shopping list",
    "upp.priceHint": "Enter the market price per piece, e.g. <span class=\"text-parch-300\">250k</span> or <span class=\"text-parch-300\">1.5kk</span> – it will be saved.",
    "upp.colMat": "Material",
    "upp.colMin": "Min.",
    "upp.colAvg": "Avg.",
    "upp.colP90": "90&nbsp;%",
    "upp.colPrice": "Price/pc.",
    "upp.colCost": "Cost avg.",
    "upp.price": "Price",
    "upp.priceAria": "Market price {a} per piece",
    "upp.noMats": "No materials are needed for this path.",
    "upp.unknown": "Unknown item ({a})",
    "upp.dl": "Download list",
    "upp.dlMin": "Minimum",
    "upp.dlAvg": "Average",
    "upp.dlP90": "With buffer",
    "upp.dlPng": "As image",
    "upp.dlTxt": "As text",
    "upp.discord": "Discord",
    "upp.discordTitle": "Copy for Discord",
    "upp.shareLink": "Share link",
    "upp.footnote": "Average amounts rounded up. “With buffer” is enough per material in 9 out of 10 cases.",
    "upp.modeMin": "Minimum",
    "upp.modeAvg": "Average",
    "upp.modeP90": "With buffer (90 %)",
    "upp.quantity": "Amount: {a}",
    "upp.withStone": "with Magic Stone",
    "upp.listTitle": "Shopping list",
    "upp.yangUpp": "Yang (upgrade cost)",
    "upp.savedPng": "List saved as image",
    "upp.savedTxt": "List saved as text",
    "upp.pngFail": "Image could not be created",
    "upp.discordOk": "Copied for Discord – just paste it",
    "upp.discordFail": "Copy didn't work",
    "upp.discordRule": "With Magic Stone (level stays on fail)",
    "upp.discordYang": "💰 Yang (upgrade cost): Min {a} · Avg {b} · 90% {c}",
    "upp.discordList": "**Shopping list** (Minimum · Avg · 90%)",
    "upp.discordTotal": "Total incl. materials (avg): {a}",
    "upp.fileName": "Shopping-list",
    "upp.to_word": "to",
    "upp.shareText": "Upgrade cost {a} – calculated with the Origins2 Helper",

    "cal.eyebrow": "In progress",
    "cal.title": "Event Calendar",
    "cal.text": "Week and month view with filters for events, world bosses and Society dates – plus a reminder bell for every date.",

    "footer.tool": "Community tool of the guild Society"
  }
};

/* ---------------- Logik ---------------- */
const LANG_KEY = "o2h.lang";
let LANG = (() => {
  try {
    const q = new URLSearchParams(location.search).get("lang");
    if (q === "de" || q === "en") return q;
    const s = localStorage.getItem(LANG_KEY);
    if (s === "de" || s === "en") return s;
  } catch {}
  return (navigator.language || "de").toLowerCase().startsWith("de") ? "de" : "en";
})();

function t(key, ...vals) {
  let s = (I18N[LANG] && I18N[LANG][key]) ?? I18N.de[key] ?? key;
  const names = ["a", "b", "c", "d"];
  vals.forEach((v, i) => { s = s.split(`{${names[i]}}`).join(v); });
  return s;
}

/* Name in der aktuellen Sprache – fällt auf Deutsch zurück */
function L(obj, field = "name") {
  if (!obj) return "";
  if (LANG === "en" && obj[field + "En"]) return obj[field + "En"];
  return obj[field] || "";
}

function applyI18n(root = document) {
  document.documentElement.lang = LANG;
  root.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  root.querySelectorAll("[data-i18n-html]").forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  root.querySelectorAll("[data-i18n-attr]").forEach(el => {
    el.dataset.i18nAttr.split(";").forEach(pair => {
      const [attr, key] = pair.split(":").map(x => x.trim());
      if (attr && key) el.setAttribute(attr, t(key));
    });
  });
  const md = document.querySelector('meta[name="description"]');
  if (md) md.setAttribute("content", t("meta.description"));
  document.querySelectorAll("[data-lang]").forEach(b => {
    const on = b.dataset.lang === LANG;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  });
}

function setLang(lang) {
  if (lang !== "de" && lang !== "en" || lang === LANG) return;
  LANG = lang;
  try { localStorage.setItem(LANG_KEY, lang); } catch {}
  applyI18n();
  window.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
}
