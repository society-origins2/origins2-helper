/* =====================================================================
   CHANGELOG & ROADMAP  –  wird auf „Home“ angezeigt
   ---------------------------------------------------------------------
   CHANGELOG: neueste Version oben. Pro Punkt Deutsch + Englisch.
     type: "new" (Neu) | "improved" (Verbessert) | "fixed" (Behoben)
   ROADMAP: status "progress" (In Arbeit) | "planned" (Geplant) | "idea" (Idee)
   ===================================================================== */

const CHANGELOG = [
  {
    version: "0.3",
    date: "2026-11-22",
    title: "Skilltree-Update", titleEn: "Skill tree update",
    items: [
      { type: "improved", de: "Skilltree: Zweige lassen sich jetzt kombinieren – ein Klick im PvP-Zweig wählt PvM und Yohara nicht mehr ab",
                     en: "Skill tree: branches can now be combined – a click in the PvP branch no longer deselects PvM and Yohara" },
      { type: "fixed", de: "Skilltree: Der PvP-Zweig braucht aus dem PvM-Zweig nur Stufe 1 (TP-Spot)",
                     en: "Skill tree: the PvP branch only needs stage 1 (TP spot) from the PvM branch" },
      { type: "new", de: "Boss-Timer als schmales, waagerechtes Mini-Fenster – alle Bosse mit Countdown in einer Leiste über dem Spiel",
                     en: "Boss Timer as a slim horizontal mini window – all bosses with countdown in one bar over the game" },
      { type: "improved", de: "Footer: Urheberrechtshinweis ergänzt",
                     en: "Footer: copyright notice added" },
      { type: "improved", de: "Boss-Timer: Spawnzeiten, Countdowns und Balken stehen in jeder Reihe auf gleicher Höhe",
                     en: "Boss Timer: spawn times, countdowns and bars line up at the same height in every row" },
      { type: "new", de: "Boss-Mini-Fenster wahlweise hochkant oder waagerecht; in den anderen Mini-Fenstern blendet der Uhr-Knopf oben die nächsten Bosse ein",
                     en: "Boss mini window vertical or horizontal; in the other mini windows the clock button shows the next bosses at the top" },
      { type: "new", de: "Boss-Mini-Fenster: Bosse, die dich nicht interessieren, über „Bosse wählen“ ausblenden; Uhr klar als Serverzeit beschriftet",
                     en: "Boss mini window: hide bosses you don't care about via “Choose bosses”; clock clearly labelled as server time" },
      { type: "new", de: "Skilltree: Marktpreise eintragen – mit Materialwert und dem Yang, das noch fehlt",
                     en: "Skill tree: enter market prices – with material value and the Yang still needed" },
      { type: "improved", de: "Preisfelder mit ×-Knopf zum schnellen Löschen; Gekauftes wird jetzt mit rotem Kreuz durchgestrichen",
                     en: "Price fields with an × button to clear quickly; bought items are now crossed out with a red X" },
      { type: "new", de: "Mini-Fenster: oben direkt zwischen Upp-Kalkulator, Skilltree und Fischpuzzle wechseln",
                     en: "Mini window: switch between Upgrade Calculator, skill tree and Fish Puzzle right at the top" },
      { type: "new", de: "Skilltree: Baum ausblenden, sobald dein Ziel steht – die Einkaufsliste nutzt dann die ganze Breite",
                     en: "Skill tree: hide the tree once your goal is set – the shopping list then uses the full width" },
      { type: "improved", de: "Skilltree: Einkaufsliste als Kacheln zum Durchstreichen – und als Mini-Fenster über dem Spiel",
                     en: "Skill tree: shopping list as tiles you can cross off – and as a mini window over the game" },
      { type: "new", de: "Upp-Kalkulator: Gekaufte Materialien wie mit rotem Stift durchstreichen – mit Fortschritt und dem Yang, das noch fehlt",
                     en: "Upgrade Calculator: cross off bought materials like with a red pen – with progress and the Yang still needed" },
      { type: "new", de: "Upp-Kalkulator als Mini-Fenster: Einkaufsliste beim Uppen direkt über dem Spiel",
                     en: "Upgrade Calculator as a mini window: your shopping list right over the game while upgrading" },
      { type: "new", de: "Fischpuzzle als Mini-Fenster: schwebt in Chrome & Edge über dem Spiel – ideal mit nur einem Bildschirm",
                     en: "Fish Puzzle as a mini window: floats over the game in Chrome & Edge – ideal with just one screen" },
      { type: "improved", de: "Upp-Kalkulator: Einkaufsliste als kompakte Kacheln mit der Mindestmenge – kein langes Scrollen mehr; Marktpreise per Knopf, Tabelle weiter umschaltbar",
                     en: "Upgrade Calculator: shopping list as compact tiles showing the minimum amount – no more long scrolling; market prices via a button, table still available" },
      { type: "improved", de: "Upp-Kalkulator: Mit eingetragenen Preisen stehen die teuersten Materialien oben",
                     en: "Upgrade Calculator: with prices entered, the most expensive materials are listed first" },
      { type: "new", de: "Baustellenschild im Kopfbereich – die Seite wächst laufend weiter",
                     en: "Construction sign in the header – the site keeps growing" },
      { type: "new", de: "Skilltree: Schalter „schon freigeschaltet?“ – rechnet den Skilltree-Schlüssel (1kkk Yang + Truhen) mit ein",
                     en: "Skill tree: “already unlocked?” switch – includes the Skill Tree Key (1kkk Yang + chests)" }
    ]
  },
  {
    version: "0.2",
    date: "2026-11-21",
    title: "Event-Helper", titleEn: "Event Helper",
    items: [
      { type: "new", de: "Upp-Kalkulator: neue Reihe 2-Hand-Waffe (PvP, Krieger) – Partisane bis Kyanitklinge",
                     en: "Upgrade Calculator: new line two-handed weapon (PvP, Warrior) – Partisan to Kyanite Blade" },
      { type: "new", de: "Upp-Kalkulator: erste Rüstung – Krieger (PvP), Lv 66 bis Kyanit",
                     en: "Upgrade Calculator: first armour – Warrior (PvP), Lv 66 up to Kyanite" },
      { type: "fixed", de: "Upp-Kalkulator: Kyanitschwert +9 braucht 2 Weiße Drachenschuppen statt 1",
                     en: "Upgrade Calculator: Kyanite Sword +9 needs 2 White Dragon Scales instead of 1" },
      { type: "new", de: "Neuer Reiter „Event-Helper“ mit Fischpuzzle-Helfer: zeigt für jedes Teil den besten Platz, wann du wegwerfen solltest und deine Chance auf die große Truhe",
                     en: "New “Event Helper” tab with a Fish Puzzle helper: shows the best spot for each piece, when to discard and your chance for the big chest" },
      { type: "improved", de: "Kopfbereich nutzt auf großen Bildschirmen die ganze Breite – größeres Logo, größere Charaktere",
                     en: "Header uses the full width on large screens – bigger logo, bigger characters" },
      { type: "new", de: "Besucherzähler im Footer",
                     en: "Visitor counter in the footer" },
      { type: "improved", de: "Skilltree-Kalkulator als Beta markiert – er ist noch nicht ganz fertig",
                     en: "Skill Tree Calculator marked as beta – it is not quite finished yet" },
      { type: "new", de: "Willkommen im Team, Akrios! Unser erster Helper – jetzt auch im Kopfbereich",
                     en: "Welcome to the team, Akrios! Our first helper – now also in the header" },
      { type: "improved", de: "Neue Aufteilung im Kopfbereich: Logo und Infos in der Mitte, Charaktere links und rechts",
                     en: "New header layout: logo and info in the middle, characters on the left and right" },
      { type: "improved", de: "Neuigkeiten sind jetzt pro Tag auf- und zuklappbar",
                     en: "News can now be expanded and collapsed per day" },
      { type: "fixed", de: "Origins2-Logo wird nicht mehr verzerrt",
                     en: "Origins2 logo is no longer distorted" }
    ]
  },
  {
    version: "0.1",
    date: "2026-11-20",
    title: "Erste Vorschau", titleEn: "First preview",
    items: [
      { type: "new", de: "Upp-Kalkulator mit Einkaufsliste, Bild-/Text-Download und Discord-Export – erste Reihe: 1-Hand-Schwert (PvP)",
                     en: "Upgrade Calculator with shopping list, image/text download and Discord export – first line: one-handed sword (PvP)" },
      { type: "new", de: "Boss-Timer für Welt- und Map-Bosse mit Live-Countdown und Ton pro Boss",
                     en: "Boss Timer for world and map bosses with live countdown and sound per boss" },
      { type: "new", de: "Eventkalender mit Monats-/Wochenansicht, Tagesliste und Erinnerungs-Glocke",
                     en: "Event Calendar with month/week view, day list and reminder bell" },
      { type: "new", de: "Deutsch / Englisch umschaltbar und Links zum Teilen",
                     en: "German / English switch and shareable links" },
      { type: "new", de: "„Heute aktiv“ zeigt die laufenden Events direkt im Kopfbereich",
                     en: "“Active today” shows running events right in the header" },
      { type: "improved", de: "Promoter zeigen jetzt ihr Profilbild und beim Drüberfahren ihren Referral-Code",
                     en: "Promoters now show their profile picture and their referral code on hover" },
      { type: "new", de: "Klick auf den Charakter im Kopfbereich öffnet das Discord-Profil des Creators",
                     en: "Clicking the character in the header opens the creator's Discord profile" },
      { type: "new", de: "„Promoter werden“: Bewerbung mit Kanal, Referral-Code und Charakter-Screenshot direkt an unseren Discord",
                     en: "“Become a promoter”: apply with channel, referral code and character screenshot straight to our Discord" },
      { type: "new", de: "Skilltree-Kalkulator: Bonus antippen, Baum füllt sich bis dorthin – mit Einkaufsliste als Bild, Text oder für Discord",
                     en: "Skill Tree Calculator: tap a bonus, the tree fills up to it – with shopping list as image, text or for Discord" },
      { type: "new", de: "Lucid ist als Creator im Kopfbereich und im Team dabei",
                     en: "Lucid joins the header and the team as a creator" },
      { type: "new", de: "Psst … es gibt ein verstecktes Easter Egg 👀",
                     en: "Psst … there is a hidden easter egg 👀" },
      { type: "new", de: "Neuer Reiter „Team“ – alle Mitwirkenden mit Charakter und Rang (Helper-Admin, Creator, Helper), plus Bewerbung als Helfer",
                     en: "New “Team” tab – all contributors with character and rank (Helper Admin, Creator, Helper), plus helper applications" }
    ]
  }
];

const ROADMAP = [
  { status: "progress", de: "Skilltree: Item-Namen, Bonus-Werte, Schlüssel & Yang ergänzen", en: "Skill tree: add item names, bonus values, key & Yang" },
  { status: "progress", de: "Guides der Gilde Society",                                  en: "Guides from the guild Society" },
  { status: "progress", de: "Upp-Reihen für alle Klassen, Rüstungen, Schmuck & PvM",     en: "Upgrade lines for all classes, armour, jewellery & PvM" },
  { status: "progress", de: "Englische Item-Namen mit dem Client abgleichen",           en: "Check English item names against the client" },
  { status: "planned",  de: "Event-Helper: Black Jack und Catch the King",             en: "Event Helper: Black Jack and Catch the King" },
  { status: "planned",  de: "Englische Übersetzung der ganzen Seite verbessern",        en: "Improve the English translation of the whole site" },
  { status: "planned",  de: "Weitere Sprachen (z. B. Türkisch, Rumänisch, Polnisch)",   en: "More languages (e.g. Turkish, Romanian, Polish)" },
  { status: "planned",  de: "Bug- & Support-Formular (vor der Beta)",                   en: "Bug & support form (before beta)" },
  { status: "planned",  de: "Discord-Login und Erinnerungen per Discord-DM",            en: "Discord login and reminders via Discord DM" },
  { status: "planned",  de: "Gilden-/Server-Warehouse (Marktplatz für EQ & Upp-Items)", en: "Guild/server warehouse (market for gear & upgrade items)" },
  { status: "idea",     de: "Persönliches Notizfeld",                                    en: "Personal notes" }
];


/* =====================================================================
   Ab hier nichts ändern – Darstellung
   ===================================================================== */
function clEsc(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

function renderChangelog() {
  const cl = document.getElementById("changelog-list"), rm = document.getElementById("roadmap-list");
  if (!cl || !rm) return;
  const fmt = d => new Intl.DateTimeFormat(LANG === "de" ? "de-DE" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(d + "T00:00:00Z"));
  // Auf-/zugeklappt merken (neueste Version ist standardmäßig offen)
  const openSet = clOpenState();
  cl.innerHTML = CHANGELOG.map((v, i) => {
    const open = openSet ? openSet.includes(v.version) : i === 0;
    return `
    <li class="cl-ver${i === 0 ? " is-latest" : ""}">
      <details class="cl-details" data-ver="${clEsc(v.version)}"${open ? " open" : ""}>
        <summary class="cl-head">
          <span class="cl-tag">v${clEsc(v.version)}</span>
          <span class="cl-title">${clEsc(LANG === "en" && v.titleEn ? v.titleEn : v.title)}</span>
          <span class="cl-count">${v.items.length}</span>
          <span class="cl-date">${clEsc(fmt(v.date))}</span>
          <svg class="cl-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
        </summary>
        <ul class="cl-items">${v.items.map(it => `
          <li><span class="cl-type t-${it.type}">${t("cl." + it.type)}</span><span>${clEsc(LANG === "en" ? it.en : it.de)}</span></li>`).join("")}
        </ul>
      </details>
    </li>`;
  }).join("");
  const order = { progress: 0, planned: 1, idea: 2 };
  rm.innerHTML = ROADMAP.slice().sort((a, b) => order[a.status] - order[b.status]).map(r => `
    <li class="rm-item s-${r.status}"><span class="rm-dot" aria-hidden="true"></span>
      <span class="rm-text">${clEsc(LANG === "en" ? r.en : r.de)}</span>
      <span class="rm-status">${t("rm." + r.status)}</span></li>`).join("");
}

const CL_OPEN_KEY = "o2h.clOpen";
function clOpenState() {
  try { const v = JSON.parse(localStorage.getItem(CL_OPEN_KEY)); return v && v.latest === CHANGELOG[0].version ? v.open : null; } catch { return null; }
}
function initChangelog() {
  renderChangelog();
  document.getElementById("changelog-list")?.addEventListener("toggle", () => {
    const open = [...document.querySelectorAll("#changelog-list details[open]")].map(d => d.dataset.ver);
    try { localStorage.setItem(CL_OPEN_KEY, JSON.stringify({ latest: CHANGELOG[0].version, open })); } catch {}
  }, true);
  window.addEventListener("langchange", renderChangelog);
}
