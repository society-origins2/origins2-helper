/* =====================================================================
   CHAT-WISSENSBASIS  –  hier stehen die Antworten, die der Chat kennt
   ---------------------------------------------------------------------
   Jeder Eintrag = eine Antwort. Felder:
     id        : kurzer, eindeutiger Name
     title     : Überschrift (Deutsch)        titleEn : Englisch
     text      : Antworttext (Deutsch)        textEn  : Englisch
     kw        : Stichwörter, nach denen gesucht wird (deutsch UND englisch,
                 ruhig mehrere Schreibweisen). Je besser die Stichwörter,
                 desto treffsicherer der Chat.
     source    : Quelle, die unter der Antwort steht (Deutsch)  sourceEn : Englisch
     link      : (optional) Reiter der Seite, z. B. "#upp-rechner"
     isTest    : true = nur Platzhalter, KEINE echten Spielwerte.
                 Der Chat weist dann auf den Testeintrag hin.

   WICHTIG: Spielwerte (Kosten, Chancen, Drops …) nur eintragen, wenn sie aus
   dem Wiki/Client stammen – nie schätzen. Testeinträge vor dem Livegang
   löschen (siehe Abschnitt „KI-Chat“ in der CLAUDE.md).
   ===================================================================== */

const CHAT_KB = [
  /* ---------- Wegweiser durch die Seite (stimmt immer) ---------- */
  {
    id: "site-overview",
    title: "Was kann diese Seite?", titleEn: "What can this site do?",
    text: "Der Origins2 Helper bündelt Werkzeuge für Origins2: Boss-Timer, Upp-Kalkulator, Skilltree-Kalkulator (Beta), Eventkalender und den Event-Helper mit dem Fischpuzzle. Oben in der Leiste wechselst du zwischen den Reitern. Dazu gibt es einen Team-Reiter, den Bug-/Ideen-Knopf und den DE/EN-Umschalter.",
    textEn: "The Origins2 Helper bundles tools for Origins2: boss timer, upgrade calculator, skill tree calculator (beta), event calendar and the Event Helper with the fish puzzle. Use the tabs at the top to switch between them. There is also a Team tab, the bug/idea button and the DE/EN switch.",
    kw: ["seite", "website", "site", "helper", "uebersicht", "overview", "funktionen", "features", "tools", "werkzeuge"],
    source: "Seite · Übersicht", sourceEn: "Site · Overview", link: "#uebersicht"
  },
  {
    id: "upp-calculator",
    title: "Upp-Kalkulator", titleEn: "Upgrade calculator",
    text: "Im Upp-Kalkulator wählst du Kategorie (PvP/PvM), Ausrüstung, Klasse und die Upp-Reihe sowie Start und Ziel. Du bekommst die Kosten in Yang und Materialien als Minimum, Durchschnitt und mit Pech-Puffer (90 %), gerechnet mit den Wiki-Chancen. Mit eigenen Marktpreisen siehst du die Gesamtkosten, die Einkaufsliste kannst du für Discord kopieren oder als Bild/TXT herunterladen.",
    textEn: "In the upgrade calculator you pick category (PvP/PvM), equipment, class and the upgrade chain plus start and target. You get the cost in yang and materials as minimum, average and with a bad-luck buffer (90%), calculated with the wiki chances. With your own market prices you see the total cost, and you can copy the shopping list for Discord or download it as an image/TXT.",
    kw: ["upp", "upps", "upgrade", "kalkulator", "rechner", "calculator", "kosten", "cost", "costs", "berechnen", "berechne", "rechnen", "yang", "material", "materialien", "einkaufsliste", "shopping", "preise", "markt", "pity", "enigma", "waffe", "ruestung", "weapon", "armor"],
    source: "Seite · Upp-Kalkulator", sourceEn: "Site · Upgrade calculator", link: "#upp-rechner"
  },
  {
    id: "boss-timer",
    title: "Boss-Timer", titleEn: "Boss timer",
    text: "Der Boss-Timer zeigt, wann Weltbosse und Map-Bosse erscheinen. Oben bleibt eine Leiste mit den Weltboss-Gruppen sichtbar, im Reiter „Boss-Timer“ findest du alle Bosse. Über die Glocke schaltest du pro Boss-Gruppe einen Erinnerungs-Ton ein.",
    textEn: "The boss timer shows when world bosses and map bosses appear. A bar with the world boss groups stays visible at the top, and the “Boss timer” tab lists all bosses. The bell switches on a reminder sound for each boss group.",
    kw: ["boss", "bosse", "bosses", "weltboss", "mapboss", "spawn", "spawnen", "spawnt", "timer", "wann", "erscheint", "erscheinen", "respawn", "glocke", "erinnerung", "reminder", "sound", "ton"],
    source: "Seite · Boss-Timer", sourceEn: "Site · Boss timer", link: "#bosse"
  },
  {
    id: "calendar",
    title: "Eventkalender", titleEn: "Event calendar",
    text: "Der Kalender zeigt die Events in Tages-, Wochen- und Monatsansicht. Bei Events, die noch nicht begonnen haben, erscheint eine kleine Glocke: Damit bekommst du zum Start einen Ton, solange die Seite offen ist. Bei Bossen übernimmt das der Boss-Timer.",
    textEn: "The calendar shows events in day, week and month view. Events that have not started yet show a small bell: it plays a sound when they begin, as long as the page is open. For bosses, the boss timer does that job.",
    kw: ["kalender", "calendar", "event", "events", "termin", "termine", "woche", "monat", "heute", "today", "week", "month", "erinnerung", "reminder", "naechste", "naechstes", "ansteht", "laeuft", "upcoming"],
    source: "Seite · Kalender", sourceEn: "Site · Calendar", link: "#kalender"
  },
  {
    id: "skilltree",
    title: "Skilltree-Kalkulator (Beta)", titleEn: "Skill tree calculator (beta)",
    text: "Der Skilltree-Kalkulator hat drei Zweige: PvM, PvP und Yohara. Du wählst pro Zweig deine Zielstufe und siehst, welche Materialien und wie viel Yang du brauchst. Die Seite ist noch als Beta markiert, weil einige Werte, Voraussetzungen und Namen noch fehlen oder nicht geprüft sind.",
    textEn: "The skill tree calculator has three branches: PvM, PvP and Yohara. Pick a target stage for each branch and see which materials and how much yang you need. It is still marked as beta because some values, requirements and names are missing or not yet checked.",
    kw: ["skilltree", "skill", "skills", "baum", "tree", "pvm", "pvp", "yohara", "zweig", "branch", "schluessel", "key", "bonus", "boni", "beta"],
    source: "Seite · Skilltree", sourceEn: "Site · Skill tree", link: "#skilltree"
  },
  {
    id: "event-helper",
    title: "Event-Helper: Fischpuzzle", titleEn: "Event Helper: fish puzzle",
    text: "Im Event-Helper löst du das Fischpuzzle (Brett 6×4). Der Löser berechnet den besten nächsten Zug. Die Truhen-Grenzen stammen aus Metin2 und sind für Origins2 noch nicht geprüft.",
    textEn: "In the Event Helper you solve the fish puzzle (6×4 board). The solver calculates the best next move. The chest limits come from Metin2 and have not yet been checked for Origins2.",
    kw: ["fisch", "fischpuzzle", "puzzle", "fish", "minispiel", "minigame", "truhe", "chest", "loeser", "solver"],
    source: "Seite · Event-Helper", sourceEn: "Site · Event Helper", link: "#event-helper"
  },
  {
    id: "mini-window",
    title: "Mini-Fenster", titleEn: "Mini window",
    text: "Auf dem PC kannst du Upp-Kalkulator, Skilltree, Fischpuzzle, Boss-Timer und diesen Chat in ein kleines schwebendes Fenster auslagern, das über dem Spiel bleibt. Dafür gibt es neben dem Titel einen Mini-Fenster-Knopf und oben im Kopfbereich den Knopf „Mini-Leiste“. In der Mini-Leiste sitzen die Werkzeuge auf einer Walze: mit den Pfeilen, dem Mausrad oder per Wischen drehen, dann auf „Öffnen“ klicken.",
    textEn: "On a PC you can pop the upgrade calculator, skill tree, fish puzzle, boss timer and this chat out into a small floating window that stays over the game. Use the mini window button next to the title, or the “Mini bar” button in the header. In the mini bar the tools sit on a drum: turn it with the arrows, the mouse wheel or by swiping, then click “Open”.",
    kw: ["mini", "mini-fenster", "minifenster", "fenster", "window", "schwebend", "floating", "neben dem spiel", "mini-leiste", "walze", "drehen", "dock", "popup", "pip"],
    source: "Seite · Mini-Fenster", sourceEn: "Site · Mini window"
  },
  {
    id: "referral",
    title: "Promoter-Code CRITICALZ", titleEn: "Promoter code CRITICALZ",
    text: "Der Promoter-Code der Seite lautet CRITICALZ. Im Kasten oben kannst du ihn mit einem Klick kopieren, über „Vorteile & Infos“ siehst du die Belohnungen für die Level 30, 50, 75 und 90.",
    textEn: "The site's promoter code is CRITICALZ. Copy it with one click in the box at the top; “Rewards & info” shows the rewards for levels 30, 50, 75 and 90.",
    kw: ["promoter", "code", "referral", "criticalz", "belohnung", "belohnungen", "reward", "rewards", "registrieren", "register", "anmelden"],
    source: "Seite · Promoter-Code", sourceEn: "Site · Promoter code", link: "#uebersicht"
  },
  {
    id: "feedback-help",
    title: "Fehler melden, Ideen und Helfer werden", titleEn: "Report bugs, ideas and become a helper",
    text: "Einen Fehler gefunden oder eine Idee? Über den Knopf „Bug / Idee melden“ schickst du uns eine Nachricht, gern mit Screenshot. Wer mithelfen möchte, findet im Team-Reiter die Helfer-Bewerbung und den Übersetzer für Item-Namen.",
    textEn: "Found a bug or have an idea? Use the “Report a bug / idea” button to send us a message, ideally with a screenshot. If you want to help out, the Team tab has the helper application and the translator for item names.",
    kw: ["bug", "fehler", "melden", "idee", "ideen", "vorschlag", "feedback", "helfer", "helfen", "mithelfen", "bewerben", "bewerbung", "team", "uebersetzen", "uebersetzer", "translate", "translator", "report", "suggest", "help out", "become a helper"],
    source: "Seite · Mitmachen", sourceEn: "Site · Get involved", link: "#team"
  },
  {
    id: "chat-about",
    title: "Dieser Chat", titleEn: "This chat",
    text: "Ich durchsuche die Wissensbasis dieser Seite und zeige dir die passende Antwort samt Link zum richtigen Werkzeug. Was noch nicht in der Wissensbasis steht, weiß ich auch nicht – dann sage ich das lieber, statt zu raten. Echte Spielwerte wie Petskill-Kosten kommen dazu, sobald die Wiki-Daten da sind.",
    textEn: "I search this site's knowledge base and show you the matching answer with a link to the right tool. Whatever is not in the knowledge base yet, I don't know either – I'd rather say so than guess. Real game values such as pet skill costs will follow as soon as the wiki data is here.",
    kw: ["chat", "chatbot", "bot", "ki", "ai", "frag", "fragen", "antwort", "antworten", "wissensbasis", "knowledge", "assistent", "assistant"],
    source: "Seite · Chat", sourceEn: "Site · Chat"
  },
  {
    id: "about-us",
    title: "Wer steckt dahinter und was kostet es?", titleEn: "Who is behind this and what does it cost?",
    text: "Gebaut wird der Helper ehrenamtlich von der Gilde Society auf Origins2. Er ist kostenlos, werbefrei und hat keine Konten und keine Bezahlfunktionen. Es ist ein Fan-Projekt und nicht die offizielle Seite des Servers. Was gespeichert wird und was nicht, steht in der Datenschutzerklärung unten im Footer.",
    textEn: "The helper is built voluntarily by the guild Society on Origins2. It is free, ad-free and has no accounts and no paid features. It is a fan project, not the server's official site. What is stored and what is not is explained in the privacy policy linked in the footer.",
    kw: ["wer", "who", "dahinter", "hinter", "steckt", "betreibt", "macht", "gilde", "guild", "society", "kostenlos", "gratis", "free", "kosten", "preis", "werbung", "ads", "offiziell", "official", "datenschutz", "privacy", "daten", "cookies", "konto", "account"],
    source: "Seite · Über uns", sourceEn: "Site · About us", link: "datenschutz/"
  },
  {
    id: "xmas-mode",
    title: "Weihnachtsmodus", titleEn: "Christmas mode",
    text: "Von Anfang Dezember bis Mitte Januar schaltet sich der Weihnachtsmodus automatisch ein: Schneefall, Mistelzweige und ein geschmückter Baum. Mit dem kleinen Schieberegler oben in der Kopfleiste kannst du ihn jederzeit an- und ausschalten.",
    textEn: "From early December to mid-January Christmas mode switches on automatically: snowfall, mistletoe and a decorated tree. Use the small slider in the header to turn it on or off whenever you like.",
    kw: ["weihnachten", "weihnachtsmodus", "christmas", "schnee", "schneefall", "snow", "winter", "deko", "dekoration", "baum", "tree", "schieberegler", "slider"],
    source: "Seite · Weihnachtsmodus", sourceEn: "Site · Christmas mode"
  },
  {
    id: "language-share",
    title: "Sprache umstellen und Seite teilen", titleEn: "Change language and share the site",
    text: "Mit dem DE/EN-Umschalter oben wechselst du die Sprache der Seite. Über „Teilen“ schickst du den Link weiter, im Upp-Kalkulator gibt es zusätzlich „Link teilen“ mit deiner aktuellen Auswahl.",
    textEn: "Use the DE/EN switch at the top to change the language. “Share” passes the link on, and the upgrade calculator also has “Share link” with your current selection.",
    kw: ["sprache", "language", "deutsch", "englisch", "english", "german", "umschalter", "teilen", "share", "link", "weitergeben"],
    source: "Seite · Sprache & Teilen", sourceEn: "Site · Language & sharing"
  },

  /* ---------- TESTEINTRÄGE (keine echten Spielwerte!) ---------- */
  {
    id: "test-petskill",
    isTest: true,
    title: "Petskill freischalten (TESTEINTRAG)", titleEn: "Unlock a pet skill (TEST ENTRY)",
    text: "TESTEINTRAG ohne echte Werte. Hier steht später, was das Freischalten eines Petskills kostet: [KOSTEN AUS DEN WIKI-DATEN]. Voraussetzungen: [VORAUSSETZUNGEN AUS DEN WIKI-DATEN].",
    textEn: "TEST ENTRY without real values. Later this will say what unlocking a pet skill costs: [COST FROM WIKI DATA]. Requirements: [REQUIREMENTS FROM WIKI DATA].",
    kw: ["petskill", "pet skill", "pet", "skill freischalten", "freischalten", "unlock", "haustier"],
    source: "Test · Wiki", sourceEn: "Test · Wiki"
  },
  {
    id: "test-beginner",
    isTest: true,
    title: "Was tun als Einsteiger? (TESTEINTRAG)", titleEn: "What to do as a beginner? (TEST ENTRY)",
    text: "TESTEINTRAG ohne echte Werte. Hier stehen später die ersten Schritte für neue Spieler: [EINSTEIGER-TIPPS AUS DEN WIKI-DATEN].",
    textEn: "TEST ENTRY without real values. Later this lists the first steps for new players: [BEGINNER TIPS FROM WIKI DATA].",
    kw: ["einsteiger", "anfaenger", "neu", "neuling", "beginner", "newbie", "new player", "erste schritte", "first steps", "tipps", "tips", "levelup", "leveln"],
    source: "Test · Wiki", sourceEn: "Test · Wiki"
  }
];

/* =====================================================================
   SMALLTALK  –  kurze Antworten ohne KI, direkt aus der Seite
   ---------------------------------------------------------------------
   Greift nur, wenn die Suche oben NICHTS gefunden hat. „Hi, wann spawnen
   die Bosse?" bekommt also weiterhin die echte Antwort.
   words : Auslöser in Kleinbuchstaben, ohne Umlaute (ä→ae, ß→ss).
           Ein Wort = muss als ganzes Wort vorkommen.
           Mehrere Wörter = muss als Satzteil vorkommen.
   reply : Mehrere Varianten, es wird zufällig eine gewählt.
   Reihenfolge zählt: Der erste Treffer gewinnt.
   ===================================================================== */
const CHAT_SMALLTALK = [
  {
    id: "who",
    words: ["wer bist du", "bist du ein bot", "bist du eine ki", "bist du echt", "bist du ein mensch", "who are you", "are you a bot", "are you real", "are you human"],
    reply: ["Ich bin der Helfer-Chat dieser Seite, im Stil von xZcRiTiCaLZz. Ich durchsuche die Wissensbasis hier und sage dir, was ich finde – ein echter Mensch bin ich nicht."],
    replyEn: ["I'm this site's helper chat, in the style of xZcRiTiCaLZz. I search the knowledge base here and tell you what I find – I'm not an actual human."]
  },
  {
    id: "thanks",
    words: ["danke", "dank", "dankeschoen", "merci", "thx", "thanks", "thank you", "ty"],
    reply: ["Gern! 👍", "Immer doch. Noch was?", "Kein Ding – frag ruhig weiter."],
    replyEn: ["Anytime! 👍", "You're welcome. Anything else?", "No problem – keep them coming."]
  },
  {
    id: "bye",
    words: ["tschuess", "tschuss", "ciao", "bye", "cya", "bis dann", "bis spaeter", "gute nacht", "gn8", "see you", "good night"],
    reply: ["Bis dann – viel Erfolg beim Uppen! 🔨", "Mach's gut! 👋"],
    replyEn: ["See you – good luck upgrading! 🔨", "Take care! 👋"]
  },
  {
    id: "howareyou",
    words: ["wie gehts", "wie geht es dir", "wie geht s dir", "alles klar", "alles gut", "was machst du", "how are you", "whats up", "how is it going"],
    reply: ["Alles bestens, ich bin ja nur Text. 😄 Was brauchst du?", "Gut! Und bei dir – schon was geuppt heute?"],
    replyEn: ["All good, I'm just text after all. 😄 What do you need?", "Doing fine! How about you – upgraded anything today?"]
  },
  {
    id: "praise",
    words: ["cool", "geil", "nice", "super", "mega", "stark", "klasse", "top", "awesome", "great", "amazing", "love it"],
    reply: ["Danke! 😄 Sag Bescheid, wenn dir was fehlt.", "Freut mich! Wenn dir ein Fehler auffällt, meld ihn gern über „Bug / Idee melden“."],
    replyEn: ["Thanks! 😄 Let me know if anything's missing.", "Glad you like it! If you spot a mistake, use “Report a bug / idea”."]
  },
  {
    id: "joke",
    words: ["witz", "erzaehl was", "langweilig", "joke", "tell me a joke", "bored"],
    reply: ["Witze sind nicht mein Fachgebiet – aber zu Upp-Kosten und Boss-Zeiten kann ich einiges erzählen. 😄"],
    replyEn: ["Jokes aren't my strong suit – but I can tell you plenty about upgrade costs and boss times. 😄"]
  },
  {
    id: "greet",
    words: ["hallo", "hi", "hey", "huhu", "moin", "servus", "yo", "hello", "guten morgen", "guten tag", "guten abend", "na du"],
    reply: ["Hey! 👋 Was willst du wissen?", "Moin! Frag mich was zu Origins2 oder zu dieser Seite.", "Hi! Leg los – ich such dir die Antwort raus."],
    replyEn: ["Hey! 👋 What do you want to know?", "Hi there! Ask me anything about Origins2 or this site.", "Hello! Fire away – I'll look it up for you."]
  }
];
