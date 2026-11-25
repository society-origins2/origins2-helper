/* =====================================================================
   CHANGELOG & ROADMAP  –  wird auf „Home“ angezeigt
   ---------------------------------------------------------------------
   CHANGELOG: neueste Version oben. Pro Punkt Deutsch + Englisch.
     type: "new" (Neu) | "improved" (Verbessert) | "fixed" (Behoben)
   ROADMAP: status "progress" (In Arbeit) | "planned" (Geplant) | "idea" (Idee)
   ===================================================================== */

const CHANGELOG = [
  {
    version: "0.4",
    date: "2026-11-25",
    title: "Frag xZcRiTiCaLZz", titleEn: "Ask xZcRiTiCaLZz",
    items: [
      { type: "new", de: "Neuer Chat unten links: Frag einfach, was du wissen willst – der Helfer durchsucht die Wissensbasis der Seite und zeigt dir die Antwort samt Link zum passenden Werkzeug",
                     en: "New chat at the bottom left: just ask what you want to know – the helper searches this site's knowledge base and shows you the answer with a link to the right tool" },
      { type: "new", de: "Chat auch als Mini-Fenster über dem Spiel: Knopf „Chat“ in der Mini-Leiste, Wechsel zwischen Upp-Kalkulator, Skilltree, Fischpuzzle und Chat ohne zurück in den Browser",
                     en: "Chat also as a mini window over the game: a “Chat” button in the mini bar, switching between Upgrade Calculator, skill tree, fish puzzle and chat without going back to the browser" },
      { type: "new", de: "Start: Der Chat kennt bisher die Seite selbst (Werkzeuge, Boss-Timer, Kalender, Promoter-Code). Echte Spielwerte wie Petskill-Kosten kommen dazu, sobald die Wiki-Daten da sind – solche Antworten sind bis dahin klar als Testeintrag gekennzeichnet",
                     en: "Start: for now the chat knows the site itself (tools, boss timer, calendar, promoter code). Real game values such as pet skill costs will follow as soon as the wiki data is here – until then such answers are clearly marked as test entries" },
      { type: "improved", de: "„Bug / Idee melden“ bleibt unten rechts, der Chat sitzt unten links – die beiden Knöpfe überlappen sich nicht mehr",
                     en: "“Report bug / idea” stays at the bottom right, the chat sits at the bottom left – the two buttons no longer overlap" },
      { type: "improved", de: "Mini-Leiste neu gestaltet: Die Werkzeuge sitzen auf einer Walze, die du mit den Pfeilen, dem Mausrad oder per Wischen nach links und rechts drehst – der Knopf „Öffnen“ klappt das Werkzeug auf, das vorne steht. Nur der Promoter-Code bleibt fest daneben stehen",
                     en: "Mini bar redesigned: the tools sit on a drum that you turn left and right with the arrows, the mouse wheel or by swiping – the “Open” button opens whichever tool is at the front. Only the promoter code stays fixed next to it" }
    ]
  },
  {
    version: "0.3",
    date: "2026-11-22",
    title: "Skilltree-Update", titleEn: "Skill tree update",
    items: [
      { type: "new", de: "Weihnachtsmodus: Schneefall, Mistelzweige, Schleife und ein geschmückter Weihnachtsbaum, oben per Schieberegler an- und ausschaltbar – von Anfang Dezember bis Mitte Januar automatisch an",
                     en: "Christmas mode: snowfall, mistletoe, a bow and a decorated Christmas tree, switched on and off with a slider at the top – on automatically from early December to mid-January" },
      { type: "improved", de: "Item-Namen mit dem Spiel abgeglichen (Deutsch & Englisch) – echte Namen übernommen, u. a. die beiden Enigma-Materialien (Kyanit-Seelenstein, Kyanit-Tomus). Danke an Akrios!",
                     en: "Item names checked against the game (German & English) – real names applied, including the two Enigma materials (Kyanite Soul Stone, Kyanite Tome). Thanks to Akrios!" },
      { type: "improved", de: "Upp-Kalkulator: Item-Bilder in der Reihe größer und gleichmäßiger dargestellt (Waffen wirkten vorher zu klein)",
                     en: "Upgrade Calculator: item images in the chain shown larger and more consistent (weapons looked too small before)" },
      { type: "new", de: "Übersetzer für Helfer (Deutsch, Englisch, Rumänisch, Türkisch): Item-Namen im Spiel nachschauen, eintragen oder bestätigen und mit einem Klick direkt an uns senden (oder als Datei herunterladen) – vorläufige und fehlende Namen sind markiert (Team-Reiter oder „Hilf mit!“)",
                     en: "Translator for helpers (German, English, Romanian, Turkish): look up item names in the game, enter or confirm them and send them to us with one click (or download them as a file) – provisional and missing names are marked (Team tab or “Help out!”)" },
      { type: "improved", de: "Auf breiten Bildschirmen steht rechts eine feste Karte „Hilf mit!“ zum Bug-Melden und Ideen-Vorschlagen – sie überdeckt nie den Kopfbereich, mit Abkürzung zu „Helfer werden“ (auch nach dem Absenden einer Meldung); Promoter-Filter „Server“ entfernt",
                     en: "On wide screens a fixed “Help out!” card on the right lets you report bugs and suggest ideas – it never covers the header, with a shortcut to “Become a helper” (also after sending a report); promoter filter “Server” removed" },
      { type: "improved", de: "Origins2-Logo oben führt jetzt zur Origins2-Webseite, „Jetzt registrieren“ springt direkt zum Registrierungsformular",
                     en: "The Origins2 logo at the top now leads to the Origins2 website, “Register now” jumps straight to the sign-up form" },
      { type: "new", de: "Bug melden oder Idee vorschlagen: gut sichtbarer Knopf unten rechts, oben in der Kopfleiste und im Footer – mit Bereich, Beschreibung und optionalem Screenshot (auch per Strg+V), landet direkt bei uns auf Discord",
                     en: "Report a bug or suggest an idea: clearly visible button at the bottom right, in the top bar and in the footer – with area, description and optional screenshot (also via Ctrl+V), goes straight to our Discord" },
      { type: "fixed", de: "Goldene Knöpfe (z. B. „Absenden“, „Als Bild“) sind jetzt so hoch wie die Knöpfe daneben",
                     en: "Gold buttons (e.g. “Send”, “As image”) are now as tall as the buttons next to them" },
      { type: "improved", de: "Promoter-Code: Belohnungs-Bilder in Graustufen statt mit grünem/gelbem Hintergrund",
                     en: "Promoter code: reward images in greyscale instead of with a green/yellow background" },
      { type: "new", de: "Upp-Kalkulator: alle PvP-Waffen und -Rüstungen für jede Klasse – Dolch, Bogen, Glocke, Fächer, Kralle, Sura-Klinge sowie Rüstungen für Ninja, Sura, Schamane und Lykaner",
                     en: "Upgrade Calculator: all PvP weapons and armour for every class – dagger, bow, bell, fan, claw, Sura blade plus armour for Ninja, Sura, Shaman and Lycan" },
      { type: "new", de: "Upp-Kalkulator: Enigma-Material aus dem Enigma-Dungeon pro Stufe wählbar (Standard oder Enigma) – auch im Mini-Fenster, im geteilten Link und in der Einkaufsliste",
                     en: "Upgrade Calculator: choose Enigma Dungeon materials per stage (standard or Enigma) – also in the mini window, the shared link and the shopping list" },
      { type: "improved", de: "Skilltree: Zweige lassen sich jetzt kombinieren – ein Klick im PvP-Zweig wählt PvM und Yohara nicht mehr ab",
                     en: "Skill tree: branches can now be combined – a click in the PvP branch no longer deselects PvM and Yohara" },
      { type: "fixed", de: "Skilltree: Der PvP-Zweig braucht aus dem PvM-Zweig nur Stufe 1 (TP-Spot)",
                     en: "Skill tree: the PvP branch only needs stage 1 (TP spot) from the PvM branch" },
      { type: "new", de: "Boss-Timer als schmales, waagerechtes Mini-Fenster – alle Bosse mit Countdown in einer Leiste über dem Spiel",
                     en: "Boss Timer as a slim horizontal mini window – all bosses with countdown in one bar over the game" },
      { type: "new", de: "Promoter-Code CRITICALZ erklärt: Vorteile ab Level 30, 50, 75 und 90, Eingabe mit F9, Live-Status und Link zum Stream – auf der Seite und in der Mini-Leiste",
                     en: "Promoter code CRITICALZ explained: rewards at level 30, 50, 75 and 90, entry with F9, live status and stream link – on the site and in the mini bar" },
      { type: "new", de: "Mini-Leiste: ganz kleines schwebendes Fenster, über das du Upp-Kalkulator, Skilltree, Fischpuzzle und Boss-Timer auf- und wieder zuklappst – ohne zurück in den Browser",
                     en: "Mini bar: a tiny floating window to open and collapse the Upgrade Calculator, skill tree, fish puzzle and boss timer – without going back to the browser" },
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
  { status: "progress", de: "Upp-Reihen für Helme, Schmuck & PvM",                        en: "Upgrade lines for helmets, jewellery & PvM" },
  { status: "progress", de: "Englische Item-Namen mit dem Client abgleichen",           en: "Check English item names against the client" },
  { status: "progress", de: "Chat: echte Spieldaten aus dem Wiki einpflegen (z. B. Petskills, Einsteiger-Fragen)", en: "Chat: add real game data from the wiki (e.g. pet skills, beginner questions)" },
  { status: "planned",  de: "Chat: KI-Antworten statt reiner Stichwortsuche",            en: "Chat: AI answers instead of plain keyword search" },
  { status: "planned",  de: "Event-Helper: Black Jack und Catch the King",             en: "Event Helper: Black Jack and Catch the King" },
  { status: "planned",  de: "Englische Übersetzung der ganzen Seite verbessern",        en: "Improve the English translation of the whole site" },
  { status: "planned",  de: "Weitere Sprachen (z. B. Türkisch, Rumänisch, Polnisch)",   en: "More languages (e.g. Turkish, Romanian, Polish)" },
  { status: "planned",  de: "Discord-Login (optional) und Erinnerungen per Discord-DM", en: "Discord login (optional) and reminders via Discord DM" },
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
