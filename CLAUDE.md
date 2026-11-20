# Origins2 Helper by Society

Community-Tool der Metin2-Gilde **Society** auf dem Private-Server **Origins2** (origins2.global).
Betreiber: **cRiTiCaLZz**, Referral-Code **CRITICALZ**.
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
- `js/data.js` – Upp-Daten: `MATERIALS`, `WEAPONS`, `ARMORS` (Kürzel `mat-XX`/`wpn-XX`/`arm-XX` → Name + Icon in `assets/items/`) und `UPGRADE_LINES` (Reihen aus Stufen: `item`, `minLevel`, `craft` = Entwicklung aus Vorgänger +9, `ups` = 9 Schritte +0→+1 … +8→+9 mit `yang`, `chance`, `pity`, `mats` pro Versuch). Werte nur aus Wiki-Screenshots des Nutzers.
- `js/upp.js` – Upp-Kostenrechner: Start/Ziel über die ganze Reihe (Position = Stufe·10 + Level), Society-Regel: immer mit Magischem Stein → bei Fail bleibt die Stufe, Material + Yang sind weg; Magische Steine werden NICHT gezählt (Nutzer: Kosten irrelevant; spezielle Steine für bestimmte Stufen kommen später); Pity (früher „Mitleidsbonus“, Nutzer bevorzugt „Pity“) = nach N Fails ist der nächste Versuch sicher, Monte-Carlo 10.000 Läufe → Minimum, Ø, 90 % (pro Material), Marktpreise (`localStorage` `o2h.marketPrices`, Eingabe wie „1,5kk“), „Für Discord kopieren“, Download der Einkaufsliste als PNG (Canvas, 1–2 Spalten mit Icons) oder TXT, Menge wählbar: Minimum / Ø / mit Puffer. Annahme: Entwicklung (craft) gelingt immer. Download-Liste zeigt standardmäßig die Mindestmenge.
- `js/icons-data.js` – automatisch erzeugt: Material-Icons als Base64 (für den Bild-Download der Einkaufsliste per Canvas, damit es auch lokal per file:// funktioniert). Nach neuen Icons in `assets/items/` neu erzeugen.
- `js/events.js` – oben `SERVER_TIMEZONE`, `WARN_MINUTES` und `BOSS_SCHEDULES` (feste Spawn-Raster: `every` in Minuten, `start` als HH:MM), darunter Live-Leiste (sticky unter dem Header, nur Weltbosse), Bereich „Boss-Timer“ (#bosse) und Sound-Ping (WebAudio, Schalter im `localStorage`)
- `assets/` – `origins2-logo.png` (Phönix-Logo „Origins2 Rebirth“, transparent, Mitte im Hero), `society-banner.jpg` (Society-Schriftzug vor Runentor, 16:9, eigene Sektion „Die Gilde dahinter“). Optional `hero-bg.jpg` als Hintergrund hinter dem Hero. Originale des Nutzers: `origins2-banner.jpg` (= eigentlich das Logo) und `society-logo.jpg` – nicht löschen.
- Society-Logo **nicht** klein verwenden (zu detailreich, wird matschig); oben links steht „SOCIETY“ als Text. Kein Schriftzug doppelt anzeigen (Logo + gleicher Text darüber).

**Konfigurationsdaten immer getrennt halten** (`js/data.js`, `js/streamers.js`, `js/events.js`), oben in der Datei, deutsch kommentiert, damit der Nutzer sie selbst erweitern kann.

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

## Aufbau der Seite
- Reiter (Übersicht, Boss-Timer, Upp-Rechner, Kalender) blättern zwischen Ansichten (`<div class="view" data-view="…">`), Steuerung in `js/app.js` über den URL-Hash (#uebersicht, #bosse, #upp-rechner, #kalender). Neue Ansicht = neuer `data-view`-Block + Eintrag in `VIEWS` + Reiter mit `data-tab`.
- Reiter und Weltboss-Leiste stehen zusammen in `.topbar` und bleiben beim Scrollen oben.
- Ton-Erinnerung ist **pro Boss-Gruppe** einzeln per Glocke schaltbar (Live-Leiste und Karten teilen denselben Zustand, gespeichert in `localStorage` unter `o2h.bossSounds`).

## Item-Icons aus Wiki-Screenshots
Der Nutzer schickt Screenshots aus dem Ingame-Wiki. Icons werden ausgeschnitten, Duplikate erkannt, die Mengen-Zahl unten rechts per Inpainting entfernt und in `assets/items/` abgelegt. Namen sieht man im Wiki nur per Hover – daher füllt der Nutzer eine Icon-Legende aus (Kürzel → Name). Nie Itemnamen raten.

## Fahrplan
1. ✅ Basis & Promoter-Leiste (Live-Status manuell per `live: true/false`, echte API-Abfrage erst in Phase 2 über Supabase Edge Function, da Twitch-Token nicht ins Frontend darf und Kick kein CORS erlaubt)
2. 🟡 **Upp-Kostenrechner** (erste Reihe 1-Hand-PvP-Schwert: Schlachtschwert → Tritonschwert → Runenschwert → Kyanitschwert ist drin; Pity-Werte bestätigt per englischem Client) (`js/data.js`, `js/app.js` bzw. eigenes Modul): durchgehende Item-Reihen (z.B. 1-Hand-Schwert +0…+9 → Umwandlung in nächste Waffe +0…+9 … bis +15), beliebige Start-/Zielstufe, Methode „Kein Downgrade / Magischer Stein“ vs. „−1 Stufe bei Fail / Segi“, Monte-Carlo mit 10.000 Durchläufen → Minimum (0 Fails), Durchschnitt, Pech-Puffer (90 %); Material- & Yang-Einkaufsliste mit Marktpreisen im `localStorage`; Button „Für Discord kopieren“, Download der Einkaufsliste als PNG (Canvas, 1–2 Spalten mit Icons) oder TXT, Menge wählbar: Minimum / Ø / mit Puffer. Echte Werte liefert der Nutzer per Wiki-Screenshots – nie Werte erfinden, fehlende Werte nachfragen.
3. ✅ **Boss-Timer** (`js/events.js`): Live-Leiste mit den 3 Weltboss-Gruppen + Bereich mit Welt- und Map-Bossen. Raster laut Nutzer: Low-Level-Mapbosse (Orktal – Grotte der Verbannung 2) alle 15 Min, Beta-Maps alle 30 Min, Elementar-Maps und Yohara-Maps alle 1h30, Eishexe/Wobba/Entai-Herrscher alle 3h, Naga-Serpent/Nethis alle 6h, Elementar-Herrscher alle 6h – alle ab 00:00. Offen: Serverzeit = Europe/Berlin und Yohara-Start 00:00 sind Annahmen, beim Nutzer bestätigen. Server-Events (nicht Bosse) kommen noch dazu.
4. **Eventkalender** (Tab, Wochen- & Monatsansicht) auf Basis von `js/events.js`, Filter Alle / Events / Weltbosse / Society-Termine, Erinnerungs-Glocke pro Termin (`localStorage`).
5. **Backend:** Supabase + Discord-OAuth2 + RLS, Discord-DM-Erinnerungen über eigenen Bot, Gilden-/Server-Warehouse (Marktplatz), Live-Chat/Discord-Einbindung.
