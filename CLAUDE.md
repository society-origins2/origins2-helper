# Origins2 Helper by Society

Community-Tool der Metin2-Gilde **Society** auf dem Private-Server **Origins2** (origins2.global).
Betreiber: **xZcRiTiCaLZz** (Ingame-Name; früher Handle cRiTiCaLZz), Referral-Code **CRITICALZ**.
Der Nutzer ist kein Programmierer: Erklärungen kurz, auf Deutsch, ohne Fachjargon. Änderungen immer selbst umsetzen und testen.

## Tech-Stack
- **Phase 1 (jetzt):** reines HTML5 + Tailwind CSS v4 + modulares Vanilla JS, kein Framework, kein Bundler. Hosting: GitHub Pages (statisch).
- **Phase 2 (später):** Supabase (PostgreSQL, Auth, Realtime) mit Discord-OAuth2-Login und strengen RLS-Policies, plus Discord-Bot für DM-Erinnerungen.

## Dateien
- `index.html` – Seite (Hero, Tabs, Promoter-Leiste, Vorschau-Kacheln, Footer)
- `css/tailwind.input.css` – Tailwind-Quelle mit Theme-Farben (`@theme`)
- `css/tailwind.css` – **kompiliertes** Tailwind, wird eingecheckt (GitHub Pages hat keinen Build-Schritt)
- `css/theme.css` – eigene Komponenten (Panels, Buttons, Chips, Streamer-Karten, Toast)
- `js/app.js` – Grundgerüst: Bild-Fallbacks, Banner, Referral-Kopieren, Toast
- `js/streamers.js` – oben die Promoter-Konfiguration (`STREAMERS`), darunter die Darstellung
- `js/data.js` – Upp-Daten: `MATERIALS`, `WEAPONS`, `ARMORS` (Kürzel `mat-XX`/`wpn-XX`/`arm-XX` → Name + Icon in `assets/items/`) und `UPGRADE_LINES` (Reihen mit `category` "pvp"/"pvm" – im Spiel getrennte Item-Gruppen, im Wiki Schalter 1|2, im Rechner Filter „Kategorie“; Reihen aus Stufen: `item`, `minLevel`, `craft` = Entwicklung aus Vorgänger +9, `ups` = 9 Schritte +0→+1 … +8→+9 mit `yang`, `chance`, `pity`, `mats` pro Versuch). Werte nur aus Wiki-Screenshots des Nutzers.
- Filter im Rechner: Kategorie (pvp/pvm) → Ausrüstung (`EQUIP_SLOTS`: weapon, armor, helmet sind klassengebunden; shoulder, talisman, necklace, bracelet, shoes, earrings, shield, belt, gloves für alle) → Klasse (`CLASSES`: warrior, ninja, sura, shaman, lycan) → Upp-Reihe. Jede Reihe in `UPGRADE_LINES` braucht `category`, `slot` und bei klassengebundenen Slots `classes: [...]` (bestätigt: 1-Hand-Schwert-Reihe = Krieger, Ninja, Sura; nicht Schamane/Lykaner). Welche Klassen eine Waffe tragen können, beim Nutzer erfragen, nicht raten.
- `js/upp.js` – Upp-Kalkulator: Start/Ziel über die ganze Reihe (Position = Stufe·10 + Level), Society-Regel: immer der beste verfügbare Magische-/Ritualstein (AUSSER Elementarer Ritualstein+) → bei Fail bleibt die Stufe, Material + Yang sind weg; Origins2 veröffentlicht KEINE Stein-Boni auf die Chance → es wird nur mit den Wiki-Chancen gerechnet, kein geschätzter Bonus (Ergebnis ist bewusst eher vorsichtig); Randnotiz im Rechner entfernt; Magische Steine werden NICHT gezählt (Nutzer: Kosten irrelevant; spezielle Steine für bestimmte Stufen kommen später); Pity (früher „Mitleidsbonus“, Nutzer bevorzugt „Pity“) = nach N Fails ist der nächste Versuch sicher, Monte-Carlo 10.000 Läufe → Minimum, Ø, 90 % (pro Material), Marktpreise (`localStorage` `o2h.marketPrices`, Eingabe wie „1,5kk“), „Für Discord kopieren“, Download der Einkaufsliste als PNG (Canvas, 1–2 Spalten mit Icons) oder TXT, Menge wählbar: Minimum / Ø / mit Puffer. Annahme: Entwicklung (craft) gelingt immer. Download-Liste zeigt standardmäßig die Mindestmenge. Mini-Fenster (Knopf neben dem Titel, nur PC): Chrome/Edge → Document-PiP mit iframe auf `?mini=upp#upp-rechner`, sonst Popup derselben URL; `?mini=upp` setzt `html.is-mini-upp` (nur Rechner, Filter einklappbar, Kette/Downloads ausgeblendet); Auswahl & Preise über localStorage geteilt. Einkaufsliste standardmäßig als kompakte Kacheln mit der MINDESTMENGE groß rechts (Nutzerwunsch: nicht zu viel kaufen; Ø/90 % klein darunter, Kosten in Kacheln = Preis × Mindestmenge) (PC bis 4 Spalten einzeilig, Handy 3 Spalten), Umschalter Kacheln/Tabelle (`localStorage o2h.listView`), Preisfelder in Kacheln per Knopf „Marktpreise eintragen“ (`o2h.priceEdit`); mit Preisen sortiert nach Kosten der Mindestmenge; „Gekauft“ per Klick auf Kachel/Zeile = rotes Kreuz aus zwei geraden, leicht unsauberen Linien (SVG-Hintergrund, Nutzerwunsch; nur die neu gestrichene Kachel animiert; Nutzerwunsch statt Haken) (`localStorage o2h.bought`, pro Auswahl `reihe|start|ziel`, max. 30 Auswahlen), Fortschritt + „noch X Yang“ im Kopf, Abgleich mit dem Mini-Fenster über `storage`-Event (nur Anzeige, Downloads behalten Reihenfolge).
- `js/icons-data.js` – automatisch erzeugt: Material-Icons als Base64 (für den Bild-Download der Einkaufsliste per Canvas, damit es auch lokal per file:// funktioniert). Nach neuen Icons in `assets/items/` neu erzeugen.
- `js/changelog.js` – `CHANGELOG` (neueste Version oben, Punkte de/en mit type new/improved/fixed) und `ROADMAP` (status progress/planned/idea), angezeigt auf Home. **Pflicht:** Bei JEDER für Besucher sichtbaren Änderung (auch kleinen Verbesserungen – Nutzer möchte, dass jeder sieht, was umgesetzt wird) selbstständig einen Changelog-Eintrag ergänzen (de + en, type new/improved/fixed). Gleicher Tag → Punkt in die oberste Version; neuer Tag → neue Version oben (0.1 → 0.2 …). Vorher immer das HEUTIGE Datum (Zeitzone Europe/Berlin) mit dem Datum der obersten Version vergleichen! Reine Daten-Nachträge (z. B. neue Upp-Reihen) zusammenfassen statt pro Reihe. Erledigte Roadmap-Punkte aus `ROADMAP` entfernen und als Changelog-Punkt eintragen.
- `js/apply.js` – „Promoter werden“-Formular (Ingame-Name, Discord-Name, Kanal-Link, Referral-Code, Charakter-Screenshot) → Discord-Webhook `APPLY_WEBHOOK` (multipart mit Bild-Anhang), Bot-Falle + 60 s Bremse. Webhook steht öffentlich im Code → bei Spam in Discord neuen Webhook anlegen und ersetzen. Später über Supabase/Bot absichern.
- `js/events.js` – `BOSS_INFO` (nur Porträts `assets/bosses/` als Kartenhintergrund, freigestellt mit Transparenz; Map-Bosse per `img`/`imgH` direkt im Zeitplan). Drops/Fundort/Level/HP bewusst NICHT anzeigen (Nutzerwunsch) und oben `SERVER_TIMEZONE`, `WARN_MINUTES` und `BOSS_SCHEDULES` (feste Spawn-Raster: `every` in Minuten, `start` als HH:MM), darunter Live-Leiste (sticky unter dem Header, nur Weltbosse), Bereich „Boss-Timer“ (#bosse) und Sound-Ping (WebAudio, Schalter im `localStorage`)
- `assets/` – `origins2-logo.png` (Phönix-Logo „Origins2 Rebirth“, transparent, Mitte im Hero), `society-banner.jpg (Original) · society-logo.webp (freigestellt, wird auf Home ohne Rahmen gezeigt)` (Society-Schriftzug vor Runentor, 16:9, eigene Sektion „Die Gilde dahinter“). Optional `hero-bg.jpg` als Hintergrund hinter dem Hero. Originale des Nutzers: `origins2-banner.jpg` (= eigentlich das Logo) und `society-logo.jpg` – nicht löschen.
- Society-Logo **nicht** klein verwenden (zu detailreich, wird matschig); oben links steht „SOCIETY“ als Text. Kein Schriftzug doppelt anzeigen (Logo + gleicher Text darüber).

**Konfigurationsdaten immer getrennt halten** (`js/data.js`, `js/streamers.js`, `js/events.js`), oben in der Datei, deutsch kommentiert, damit der Nutzer sie selbst erweitern kann.

## Präsentation (praesentation/)
- `praesentation/index.html` + `praesentation/img/`: eigenständige Folien-Seite im Website-Look (11 Folien, DE/EN-Umschalter, Pfeiltasten/Wischen, Vollbild), für Server-Team und potenzielle Helfer. Link: https://society-origins2.github.io/origins2-helper/praesentation/ – nicht im Menü verlinkt.
- Discord-Vorschau über og:-Tags + `img/vorschau.jpg` (1200×630).
- Inhalt: rein browserbasiert, keine externe Software, kein Eingriff in den Client, keine Monetarisierung, ehrenamtlich. GitHub/offenen Code NICHT erwähnen (Nutzerwunsch). Promotion Team nicht erwähnen. Klarname in Screenshots immer unkenntlich machen.

## Online stellen (GitHub Pages)
- Repo: `society-origins2/origins2-helper` (Organisation, damit der Klarname des Nutzers nicht im Link steht), Seite: https://society-origins2.github.io/origins2-helper/
- `Hochladen.bat` (Doppelklick) = Patcher: git init beim ersten Mal, Abgleich mit `origin/main` per `reset --soft` (lokaler Ordner ist immer die Wahrheit), commit + push. Autor in der Historie: `society-origins2` (nie den echten Namen setzen).
- Web-Upload im Browser kann max. 100 Dateien pro Vorgang.

## Tailwind neu bauen
Nach jeder Änderung an Klassen in HTML/JS:
```
npx @tailwindcss/cli -i css/tailwind.input.css -o css/tailwind.css --minify
```
(Braucht Node.js. Ohne Node: Tailwind-Standalone-CLI für Windows von GitHub-Releases von tailwindlabs/tailwindcss.)

## Design (wichtig: darf nie billig wirken)
Edles, warmes Dark-RPG-Dashboard, angelehnt an die Stimmung der Origins2-Website (deren Theme-Farbe ist `#120c07`).
- Basis: `ink-950 #110d09`, `ink-900 #17130e`, `ink-800 #1e1912`, `ink-700 #2a231a`
- Text: `parch-100 #f1e9da` … `parch-500 #75695a`
- Akzent Gold: `gold-200 #f3d79a`, `gold-300 #e6bd6c`, `gold-400 #d4a24c`, `gold-500 #b7853a`
- Rahmen: 1px `rgb(212 162 76 / .16)`, stärker `/ .34`; feiner Goldschimmer an Panel-Oberkanten
- Schriften: **Cinzel** (Überschriften, Kapitälchen-Look, weite Laufweite), **Inter** (Text); Zahlen mit `tabular-nums`
- Keine Emojis als Icons, eigene SVG-Icons; nur ein Akzentfarbton; Live = Rot `#e5484d`
- Promoter-Bereich bewusst **dezent** als kompakte Leiste (Nutzerwunsch), nicht als große Kacheln
- Mobile zuerst testen (viele Nutzer am Handy), dann Desktop
- Branding: Origins2-Logo im Hero ist erlaubt; Logo-Größe so lassen (Höhe clamp 190–330px; größer gefiel dem Nutzer nicht). Footer: „Community-Tool der Gilde Society“. Das Promotion Team auf der Seite **nicht** erwähnen (Nutzerwunsch).

## Sprachen (DE/EN)
- `js/i18n.js`: alle Oberflächentexte in `I18N.de` / `I18N.en`, Zugriff mit `t("schlüssel", a, b)`, Namen aus Daten mit `L(obj, "name")` (nimmt `nameEn`, sonst deutsch). Statische Texte im HTML über `data-i18n`, `data-i18n-html`, `data-i18n-attr="attr:schlüssel;…"`.
- Sprache: `?lang=en` > `localStorage o2h.lang` > Browsersprache. Umschalten feuert das Event `langchange`, auf das Promoter, Boss-Timer und Rechner neu zeichnen.
- Neue Texte IMMER in beiden Sprachen anlegen. Englische Item-/Bossnamen (`nameEn`, `bossesEn`, `shortEn`, `titleEn`, `mapsEn`): auf Nutzerwunsch alle vorläufig übersetzt; geprüft per Client sind nur Battle Sword, Rune Sword, Kyanite Sword, Titanium Dioxide. Der Nutzer gleicht die übrigen per Ausfüll-Seite „Englische Namen“ mit dem englischen Client ab – seine Korrekturen haben Vorrang.

## Teilen
- „Teilen“ oben: Web Share API, sonst Link kopieren. Im Rechner „Link teilen“: `?line=…&from=…&to=…&lang=…#upp-rechner` – öffnet den Rechner mit derselben Auswahl (auf GitHub Pages; in der claude.ai-Vorschau werden Query-Parameter nicht durchgereicht).

## Mini-Fenster (alle Rechner)
- `openMiniWindow(mode, hash, title)` in upp.js: Chrome/Edge → Document-PiP mit iframe auf `?mini=<mode>#<hash>`, sonst Popup derselben URL; einheitlich 470×800 (`MINI_W/MINI_H`).
- Chrome erlaubt browserweit nur EIN schwebendes Fenster (ein zweites schließt das erste). Deshalb: Uhr-Knopf in der Umschalt-Leiste blendet oben die nächsten 3 Bosse ein (`setMiniBossBar`, `localStorage o2h.miniBossBar`, eingebettetes `#boss-mini.bm-embedded`). Boss-Fenster selbst: hochkant (300×430) oder waagerecht (1180×84), `o2h.bossOrient`.
- Modi: `upp` (#upp-rechner), `skill` (#skilltree), `fish` (#event-helper), `boss` (#bosse, flache Leiste 1180×84 – Nutzer wollte sie möglichst niedrig; links „Serverzeit“ + Knopf „Bosse wählen“ zum Ausblenden einzelner Bosse, `localStorage o2h.bossHidden`; eigene Größe über 4. Parameter, ohne Umschalt-Leiste; `setupBossMini()` in events.js, Kurznamen `short`/`shortEn` auch bei Map-Bossen).
- Preisfelder überall über `priceField(id, prices)` + `wirePriceFields(root, rerender)` (upp.js) – mit ×-Knopf zum Löschen; Upp-Kalkulator und Skilltree teilen sich die Preise (`o2h.marketPrices`). Oben in jedem Mini-Fenster die Umschalt-Leiste `.mini-nav` (`MINI_TOOLS`), `html.is-mini` blendet die Mini-Fenster-Knöpfe aus. Neues Werkzeug = Eintrag in `MINI_TOOLS` + `?mini=`-Ansicht + Knopf.

## Aufbau der Seite
- Reiter (Übersicht, Boss-Timer, Upp-Kalkulator, Kalender) blättern zwischen Ansichten (`<div class="view" data-view="…">`), Steuerung in `js/app.js` über den URL-Hash (#uebersicht, #bosse, #upp-rechner, #kalender). Neue Ansicht = neuer `data-view`-Block + Eintrag in `VIEWS` + Reiter mit `data-tab`.
- Reiter und Weltboss-Leiste stehen zusammen in `.topbar` und bleiben beim Scrollen oben.
- Ton-Erinnerung ist **pro Boss-Gruppe** einzeln per Glocke schaltbar (Live-Leiste und Karten teilen denselben Zustand, gespeichert in `localStorage` unter `o2h.bossSounds`).

## Item-Icons aus Wiki-Screenshots
Neue Upp-Reihen liefert der Nutzer als Ordner `upp-daten/<Reihe>/` (Wiki-Screenshots, in .gitignore, nicht online). Nur Wiki-Schalter 1 (PvP) eintragen; Schalter 2 ist eine komplett andere Itemgruppe und kommt erst später (vorerst ignorieren). Laut Nutzer sind die Upp-Kosten bei ALLEN PvP-Waffenarten identisch (immer 4 Stufen Lv 65 → 80 → 105 → 120); es unterscheiden sich nur Klassen und Icons. Daher stehen die Kosten einmal in `PVP_WEAPON_COSTS` (js/data.js), jede Waffenart ist eine Zeile `pvpWeaponLine(name, nameEn, classes, [4 Waffen])`. Rüstungen kosten dasselbe, haben aber nur 3 Stufen (Lv 66 → 105 → 120, ohne Lv-80-Stufe; Entwicklung 66→105 = 5kk Seon-Pyeong wie bei Waffen) → `pvpArmorLine(name, nameEn, classes, [3 Rüstungen])`; Krieger-Rüstung drin (dt. Namen arm-06–08 vorläufig übersetzt, Nutzer reicht nach); Abgleich mit einer 2. Klasse (vollständige Daten) noch offen. Für eine neue Waffenart reichen: 4 Waffen-Icons, deutsche + englische Namen, Klassen. Werte in neuen Screenshots trotzdem kurz gegenprüfen und Abweichungen melden. Waffen-Icons aus der linken Spalte der Tabelle ausschneiden (mit Hintergrund). Vor dem Eintragen fehlende Klassen/deutsche Namen erfragen.
Der Nutzer schickt Screenshots aus dem Ingame-Wiki. Icons werden ausgeschnitten, Duplikate erkannt, die Mengen-Zahl unten rechts per Inpainting entfernt und in `assets/items/` abgelegt. Namen sieht man im Wiki nur per Hover – daher füllt der Nutzer eine Icon-Legende aus (Kürzel → Name). Nie Itemnamen raten.

## Fahrplan
1. ✅ Basis & Promoter-Leiste (Live-Status manuell per `live: true/false`, echte API-Abfrage erst in Phase 2 über Supabase Edge Function, da Twitch-Token nicht ins Frontend darf und Kick kein CORS erlaubt)
2. 🟡 **Upp-Kalkulator** (Reihen drin: 1-Hand-PvP-Schwert Schlachtschwert → Tritonschwert → Runenschwert → Kyanitschwert; 2-Hand-PvP (nur Krieger) Partisane → Halbmenschenklinge → Sonnenschwert → Kyanitklinge; Pity-Werte bestätigt per englischem Client) (`js/data.js`, `js/app.js` bzw. eigenes Modul): durchgehende Item-Reihen (z.B. 1-Hand-Schwert +0…+9 → Umwandlung in nächste Waffe +0…+9 … bis +15), beliebige Start-/Zielstufe, Methode „Kein Downgrade / Magischer Stein“ vs. „−1 Stufe bei Fail / Segi“, Monte-Carlo mit 10.000 Durchläufen → Minimum (0 Fails), Durchschnitt, Pech-Puffer (90 %); Material- & Yang-Einkaufsliste mit Marktpreisen im `localStorage`; Button „Für Discord kopieren“, Download der Einkaufsliste als PNG (Canvas, 1–2 Spalten mit Icons) oder TXT, Menge wählbar: Minimum / Ø / mit Puffer. Echte Werte liefert der Nutzer per Wiki-Screenshots – nie Werte erfinden, fehlende Werte nachfragen.
3. ✅ **Boss-Timer** (`js/events.js`): Live-Leiste mit den 3 Weltboss-Gruppen + Bereich mit Welt- und Map-Bossen. Raster laut Nutzer: Low-Level-Mapbosse (Orktal – Grotte der Verbannung 2) alle 15 Min, Beta-Maps alle 30 Min, Elementar-Maps und Yohara-Maps alle 1h30, Eishexe/Wobba/Entai-Herrscher alle 3h, Naga-Serpent/Nethis alle 6h, Elementar-Herrscher alle 6h – alle ab 00:00. Offen: Serverzeit = Europe/Berlin und Yohara-Start 00:00 sind Annahmen, beim Nutzer bestätigen. Server-Events (nicht Bosse) kommen noch dazu.
4. ✅ **Eventkalender** (`js/calendar-data.js` = Event-Arten + fester 28-Tage-Rhythmus ab Mo 2026-11-02 + saisonale Events (händisch) + Dauer-Events; `js/calendar.js` = Monat/Woche/Tag, Erinnerungs-Glocke; Icons `assets/events/`. KEINE Filter, KEINE Weltbosse/Society im Kalender (Nutzerwunsch). Gegenprobe Dezember noch offen, da Dezember-Kalender im Spiel noch nicht online) (Tab, Wochen- & Monatsansicht) auf Basis von `js/events.js`, Filter Alle / Events / Weltbosse / Society-Termine, Erinnerungs-Glocke pro Termin (`localStorage`).
5. **Backend:** Supabase + Discord-OAuth2 + RLS, Discord-DM-Erinnerungen über eigenen Bot, Gilden-/Server-Warehouse (Marktplatz), Live-Chat/Discord-Einbindung.

## Ideen (noch offen)
- Alternative Materialpools für PvP-Items (Nutzer, 22.11.): Item-Reihenfolge, Crafting, Yang/Chance bleiben gleich, nur die Materialien werden ausgetauscht. Plan: Schalter „Materialien: Standard / Alternative“; Details (pro Stufe mischbar? gilt auch fürs Crafting? Screenshots) bespricht der Nutzer noch.
- Persönliches Notizfeld (Phase 1 im `localStorage`, mit Export; später per Discord-Login geräteübergreifend). Wo genau es Sinn macht, ist noch offen – z. B. allgemeiner Notizblock (Knopf unten rechts) und/oder Notizen pro Upp-Reihe / pro Boss.
- Spezielle Steine für bestimmte Upp-Stufen im Rechner ergänzen.
- PvM-Upp-Reihen (Kategorie-Schalter ist schon da).
- Support-/Bugreport-Formular: VOR der Beta-Phase einbauen. Plan: Discord-Webhook in eigenen Kanal (Typ, Beschreibung, optional Screenshot, Discord-Name, Seite/Browser automatisch), clientseitige Bremse gegen Spam. Später (Phase 2) über Supabase + Bot.

## Team & Helfer-Bewerbung (js/team.js, eigener Reiter #team)
- `TEAM_MEMBERS`: jeder Mitwirkende = { name, ranks: ["admin"|"creator"|"helper", …] (erster = Hauptrang), img: "assets/team/<name>.png" (freigestellt, PNG transparent), discordId (optional → Karte verlinkt DM) }. Reihenfolge = Anzeige. Creator steht immer zuerst.
- Ränge (TEAM_RANKS): Helper-Admin = leitet diese Seite (bewusst nicht nur „Admin“, damit niemand an einen Server-Admin denkt), Creator = macht Content, Helper = wirkt mit ohne Content. Neue Helfer bekommen ["helper"].
- Neuer Helfer angenommen → Charakter-Screenshot aus dem Discord-Kanal freistellen, nach assets/team/ legen, Eintrag ergänzen, Changelog-Eintrag.
- `HELPER_WEBHOOK`: zweiter Discord-Webhook (eigener Kanal). Leer = Formular zeigt „gleich startklar“.
- Formular: Charaktername, Discord, Altersgruppe (unter 16 / 16–17 / 18+ – bewusst kein genaues Alter), Gilde, spielt seit, Level, Aufgaben (HELPER_TASKS), Sprachen (HELPER_LANGS), Zeit/Woche, Screenshot (Pflicht, ≤8 MB), Motivation, Einwilligung (Pflicht). Honeypot + 60 s Sperre.
- CSS-Klasse für Auswahl-Chips heißt `.hp-tick` (nicht `.tick` – das ist der Ticker!).

## Easter Egg „Shadow Run“ (js/runner.js)
- Endlos-Runner mit dem Creator-Charakter als Silhouette (Sprite = assets/creator.png, wird im Canvas eingefärbt).
- Öffnen: Footer 5× schnell auf „xZcRiTiCaLZz“ tippen · am PC „society“ tippen · Link …/#runner. Im Changelog nur angedeutet, NICHT verraten.
- Rangliste: Top 10 nur lokal (localStorage o2h.runnerTop). Weltweite Rangliste erst mit Supabase (Phase 2).

## Skilltree-Kalkulator (js/skill-data.js, js/skilltree.js, Reiter #skilltree)
- 3 Zweige: I PvM (orange), II PvP (türkis), III Yohara (lila), je 9 Boni. Reihenfolge 1→9 fest = Reihenfolge der Ingame-Tabelle. x/y = Position im Spielfenster (440×320).
- Jeder Zweig hat ein eigenes Ziel (`stSel = {pvm, pvp, yohara}`), Zweige sind kombinierbar; Klick setzt nur das Ziel dieses Zweigs, erneuter Klick aufs Ziel = eine Stufe zurück. Voraussetzungen (`requires`): Yohara braucht PvM komplett (9), PvP braucht nur PvM Stufe 1 (TP-Spot). Link/localStorage-Format: `skill=pvm-9,pvp-3` (alter Einzelwert `pvp-3` geht weiter).
- Baum ausblendbar (Knopf „Baum ausblenden“ im Ergebnis, schmale Leiste „Baum einblenden“ mit Stufen-Übersicht; `localStorage o2h.skillTreeHidden`; ohne Auswahl immer sichtbar).
- Marktpreise wie im Upp-Kalkulator (Knopf „Marktpreise eintragen“, `o2h.skillPriceEdit`), Materialwert-Chip, „noch X Yang“, mit Preisen nach Kosten sortiert.
- Einkaufsliste als Kacheln (`.mat-grid.st-grid`, Spalten nach Breite) mit Durchstreichen (`localStorage o2h.skillBought`, pro Auswahl + Schlüssel-Schalter). Mini-Fenster (Knopf neben dem Titel): `openMiniWindow("skill", …)` aus upp.js → `?mini=skill#skilltree` setzt `html.is-mini-skill` (nur Baum + Liste). Auswahl/Schlüssel/Striche zwischen Fenstern per `storage`-Event abgeglichen.
- Skilltree-Schlüssel (`SKILL_KEY`): einmalig, ab Lv 120, 1kkk Yang + 20 Cor-Draconis-Truhe, 500 Feuerrune der Aura, je 3 Eisrune-der-Aura-/Energiefragment-/Flammenblatt-Truhe (mat-108–111, dt. Namen vorläufig übersetzt). Schalter „Skilltree schon freigeschaltet?“ (Ja/Nein, `localStorage o2h.skillKey`), bei Nein werden Schlüssel-Items + Yang mitgerechnet. Annahme: Items UND Yang nötig.
- Bonus-Icons: assets/skill/<zweig>-<n>.png, Schlüssel: assets/skill/key.png.
- Neue Items aus den Lieferungs-Tabellen: mat-77 … mat-107 (Icons aus Client-Screenshots, Name noch leer → „Name folgt (#77)“). Namensliste zum Ausfüllen: Artifact „Skilltree-Items benennen“.
- Item-Namen mat-77–107 sind eingetragen (vom User, Tippfehler „Handshuh“ → „Handschuh“ korrigiert).
- OFFEN: Bonus-Namen/-Werte (bonus/bonusEn), Yang pro Stufe (SKILL_YANG), echte dt. Namen der Schlüssel-Truhen.

## Creator im Kopfbereich
- Hero-Aufteilung: links .hero-crew-left (xZcRiTiCaLZz), Mitte Logo+Text (zentriert per layoutHeroCrew() in app.js), rechts .hero-crew-right. Figuren: Akrios (Helper, assets/team/akrios.png, .hc-3, kein Link), Lucid (.hc-2, Kick drtraube), xZcRiTiCaLZz (Discord). Ab 1100px sichtbar; Akrios+Lucid erst ab 1240px. Neue Figuren: nur Größe/Position der Figuren anpassen, Logo und Text nicht verändern; Überlappung bei 1240–1920px prüfen.

## Besucherzähler (js/visitors.js)
- GoatCounter (kostenlos, ohne Cookies). `GOATCOUNTER_CODE` leer = Zähler unsichtbar. In GoatCounter-Einstellungen „Allow adding visitor counts on your website“ aktivieren. Anzeige im Footer (TOTAL.json).
- Skilltree ist als „Beta“ markiert (Tab-Badge + Hinweis), bis alle Werte geprüft sind.

## Event-Helper (Reiter #event-helper, alter Link #minispiele leitet weiter)
- Fischpuzzle: js/fish-solver.js (Regeln, Truhen-Grenzen FISH_TIERS, exakter Löser, läuft auch als Web-Worker) + js/fishpuzzle.js (Oberfläche).
- Brett 6×4, 6 normale Formen (nicht drehbar) + Luxus 2×3, Formen aus dem Server-Code. Truhen-Grenzen (10/24) von Metin2 übernommen – für Origins2 vom User noch zu prüfen.
- Löser: exakte Wahrscheinlichkeit für L (Memo über freie Felder/Versuche/Luxus), Eröffnungstabelle FISH_OPEN offline vorberechnet (Luxus 0–3). Ist L unmöglich → minimiert erwartete Restversuche (fishE, Uint8Array 16 MB, erst bei Bedarf).
- Worker rechnet im Hintergrund die Antworten für alle möglichen nächsten Teile vor (nur wenn der Reiter offen ist). Lokal über file:// läuft es ohne Worker (langsamer).
- Mini-Fenster (Knopf „Mini-Fenster“, nur PC): wie Upp/Skilltree über `openMiniWindow("fish", …)` → Seite `?mini=fish` (fpSetupPopup zeigt nur das Puzzle, `.fp-wrap.is-mini`). Spielstand-Abgleich über `storage`-Event. Elemente in fishpuzzle.js über `fpEl(id)` holen. Echtes Vollbild des Clients verdeckt jedes Fenster.
- Geplant: Black Jack, Catch the King (Platzhalter-Chips im Reiter).
