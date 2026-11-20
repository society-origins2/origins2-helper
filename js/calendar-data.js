/* =====================================================================
   EVENTKALENDER – Daten
   ---------------------------------------------------------------------
   Alle Zeiten = Serverzeit (siehe SERVER_TIMEZONE in events.js).

   1) EVENT_TYPES   : alle Events mit Name, Icon und Kurzbeschreibung
   2) EVENT_CYCLE   : wiederkehrender 4-Wochen-Rhythmus (28 Tage)
   3) SEASONAL_EVENTS : Sonder-Events mit festem Datum (Weihnachten …)
   4) PERMANENT_EVENTS: Events, die über Monate laufen
   ===================================================================== */

/* ---------- 1) Event-Arten ---------- */
/* nameEn = englischer Name. Bestätigt per Client: Vote Token Event, Energy Fragment Rush,
   Dungeon Cooldown, Strong Monsters Bonus, Outpost Token Limit +5, Extra Leader Dungeon.
   Alle anderen sind Vorschläge. */
const EVENT_TYPES = {
  "abstimmung":         { name: "Abstimmungs-Token-Event",            nameEn: "Vote Token Event" },
  "exp":                { name: "Erfahrungsbonus",                    nameEn: "Experience Bonus" },
  "pet-exp":            { name: "Pet-Erfahrungsbonus",                nameEn: "Pet Experience Bonus" },
  "leg-fieber":         { name: "Legendäres Fieber",                  nameEn: "Legendary Fever" },
  "alchemist":          { name: "Segen des Alchemisten",              nameEn: "Alchemist's Blessing" },
  "elementar-belohnung":{ name: "Elementare Belohnung",               nameEn: "Elemental Reward" },
  "stark-bosse":        { name: "Stark gegen Bosse Bonus",            nameEn: "Strong vs. Bosses Bonus" },
  "boss-cd":            { name: "Boss-Abklingzeit",                   nameEn: "Boss Cooldown" },
  "wachstum":           { name: "Wachstumsunterstützung (Dungeon)",   nameEn: "Growth Support (Dungeon)" },
  "drop-yohara":        { name: "Doppelte Drops für Yohara-Verzauberung", nameEn: "Double Drops for Yohara Enchanting" },
  "metin-queue":        { name: "Doppelter Metin Queue",              nameEn: "Double Metin Queue" },
  "stark-metin":        { name: "Stark gegen Metinsteine Bonus",      nameEn: "Strong vs. Metin Stones Bonus" },
  "bonuscode":          { name: "Bonuscode",                          nameEn: "Bonus Code" },
  "dungeon-skip":       { name: "Dungeon-Überspringevent",            nameEn: "Dungeon Skip Event" },
  "dmg61":              { name: "61 Durchschnittlicher Schaden",      nameEn: "61 Average Damage" },
  "drop-tickets":       { name: "Doppelter Drop Tickets",             nameEn: "Double Drop Tickets" },
  "drop-bosse":         { name: "Doppelter Drop Bosse",               nameEn: "Double Drop Bosses" },
  "drop-metin":         { name: "Doppelter Drop Metinsteine",         nameEn: "Double Drop Metin Stones" },
  "drop-angeln":        { name: "Doppelter Drop Angeln",              nameEn: "Double Drop Fishing" },
  "drop-bergbau":       { name: "Doppelter Drop Bergbau",             nameEn: "Double Drop Mining" },
  "drop-verzaubern":    { name: "Doppelter Drop Item verzaubern",     nameEn: "Double Drop Item Enchanting" },
  "puzzle":             { name: "Puzzle-Minispiel",                   nameEn: "Puzzle Minigame" },
  "happy-hour":         { name: "Happy Hour",                         nameEn: "Happy Hour" },
  "dungeon-cd":         { name: "Dungeon-Abklingzeit",                nameEn: "Dungeon Cooldown" },
  "dungeon-limit":      { name: "Erhöhtes Dungeon-Limit",             nameEn: "Increased Dungeon Limit" },
  "energiefragment":    { name: "Energiefragment-Ansturm",            nameEn: "Energy Fragment Rush" },
  "stark-monster":      { name: "Stark gegen Monster Bonus",          nameEn: "Strong Monsters Bonus" },
  "aussenposten":       { name: "Außenposten-Markenlimit +5",         nameEn: "Outpost Token Limit +5" },
  "extra-boss":         { name: "Zusätzlicher Boss (Dungeon)",        nameEn: "Extra Leader Dungeon" },
  "pvp-1v1":            { name: "PvP-Turnier (1 gegen 1)",            nameEn: "PvP Tournament (1 vs 1)" },
  "pvp-1v1-rasse":      { name: "PvP-Turnier (1 gegen 1 Rasse)",      nameEn: "PvP Tournament (1 vs 1 class)" },
  "pvp-2v2":            { name: "PvP-Turnier (2 gegen 2)",            nameEn: "PvP Tournament (2 vs 2)" },
  "pvp-7v7":            { name: "PvP 7vs7 Event",                     nameEn: "PvP 7vs7 Event" },
  "pvp-5v5":            { name: "PvP 5vs5 Event",                     nameEn: "PvP 5vs5 Event" },
  "pvp-tdm":            { name: "PvP-Team-Deathmatch",                nameEn: "PvP Team Deathmatch" },
  "rueckkehrer":        { name: "Rückkehrergeschenk",                 nameEn: "Returner Gift" },
  "anfaenger":          { name: "Anfänger-Event",                     nameEn: "Beginner Event" }
};
Object.keys(EVENT_TYPES).forEach(id => { EVENT_TYPES[id].icon = `assets/events/${id}.png`; });


/* ---------- 2) 4-Wochen-Rhythmus ----------
   CYCLE_START = Montag, an dem Tag 0 beginnt.
   Eintrag: [Event, Starttag, Startzeit, Endtag, Endzeit]
            Tage 0–27 (0 = Mo Woche 1, 7 = Mo Woche 2, …)
   Für Events mit „Dauer: 1Std“ ohne feste Uhrzeit: Zeit = "1h"
   ------------------------------------------------------------ */
const CYCLE_START = "2026-11-02";

const EVENT_CYCLE = [
  /* ===== Woche 1 ===== */
  ["abstimmung",       0, "00:01",  6, "23:59"],
  ["exp",              0, "00:01",  0, "23:59"],
  ["pet-exp",          0, "00:01",  0, "23:59"],
  ["leg-fieber",       0, "1h"],
  // (Di 03.11. liefen zusätzlich 5 Events ab 09:30 – Ausgleich nach Wartung, nicht regelmäßig)
  ["bonuscode",        1, "10:00",  3, "23:00"],
  ["energiefragment",  1, "1h"],
  ["dungeon-cd",       2, "00:01",  2, "23:59"],
  ["stark-monster",    2, "00:01",  2, "23:59"],
  ["aussenposten",     3, "00:01",  3, "23:59"],
  ["extra-boss",       3, "1h"],
  ["metin-queue",      4, "00:01",  6, "23:59"],
  ["stark-metin",      4, "00:01",  6, "23:59"],
  ["happy-hour",       4, "12:23",  6, "23:59"],
  ["drop-verzaubern",  4, "1h"],
  ["dungeon-skip",     5, "00:01",  6, "23:59"],
  ["drop-angeln",      5, "1h"],
  ["drop-bergbau",     5, "1h"],
  ["pvp-1v1",          5, "20:00",  5, "22:00"],
  ["dmg61",            6, "00:01",  6, "23:59"],
  ["drop-metin",       6, "1h"],
  ["pvp-7v7",          6, "20:00",  6, "22:00"],

  /* ===== Woche 2 ===== */
  ["exp",              7, "00:01",  7, "23:59"],
  ["pet-exp",          7, "00:01",  7, "23:59"],
  ["alchemist",        7, "1h"],
  ["elementar-belohnung", 8, "1h"],
  ["stark-bosse",      9, "00:01",  9, "23:59"],
  ["boss-cd",          9, "00:01",  9, "23:59"],
  ["wachstum",        10, "1h"],
  ["drop-yohara",     10, "1h"],
  ["metin-queue",     11, "00:01", 13, "23:59"],
  ["stark-metin",     11, "00:01", 13, "23:59"],
  ["bonuscode",       11, "17:00", 13, "23:59"],
  ["drop-tickets",    11, "1h"],
  ["dungeon-skip",    12, "00:01", 13, "23:59"],
  ["puzzle",          12, "1h"],
  ["pvp-1v1-rasse",   12, "20:00", 12, "22:00"],
  ["dmg61",           13, "00:01", 13, "23:59"],
  ["drop-bosse",      13, "1h"],
  ["pvp-tdm",         13, "20:00", 13, "22:00"],

  /* ===== Woche 3 ===== */
  ["abstimmung",      14, "00:01", 20, "23:59"],
  ["exp",             14, "00:01", 14, "23:59"],
  ["pet-exp",         14, "00:01", 14, "23:59"],
  ["leg-fieber",      14, "1h"],
  ["energiefragment", 15, "1h"],
  ["dungeon-cd",      16, "00:01", 16, "23:59"],
  ["stark-monster",   16, "00:01", 16, "23:59"],
  ["aussenposten",    17, "00:01", 17, "23:59"],
  ["extra-boss",      17, "1h"],
  ["metin-queue",     18, "00:01", 20, "23:59"],
  ["stark-metin",     18, "00:01", 20, "23:59"],
  ["dungeon-skip",    19, "00:01", 20, "23:59"],
  ["drop-bergbau",    19, "1h"],
  ["drop-angeln",     19, "1h"],
  ["pvp-2v2",         19, "20:00", 19, "22:00"],
  ["dmg61",           20, "00:01", 20, "23:59"],
  ["drop-metin",      20, "1h"],
  ["pvp-5v5",         20, "20:00", 20, "22:00"],

  /* ===== Woche 4 ===== */
  ["exp",             21, "00:01", 21, "23:59"],
  ["pet-exp",         21, "00:01", 21, "23:59"],
  ["alchemist",       21, "1h"],
  ["elementar-belohnung", 22, "1h"],
  ["stark-bosse",     23, "00:01", 23, "23:59"],
  ["boss-cd",         23, "00:01", 23, "23:59"],
  ["wachstum",        24, "1h"],
  ["drop-yohara",     24, "1h"],
  ["metin-queue",     25, "00:01", 27, "23:59"],
  ["stark-metin",     25, "00:01", 27, "23:59"],
  ["bonuscode",       25, "17:00", 27, "23:59"],
  ["drop-tickets",    25, "1h"],
  ["dungeon-skip",    26, "00:01", 27, "23:59"],
  ["puzzle",          26, "1h"],
  ["pvp-2v2",         26, "20:00", 26, "22:00"],
  ["dmg61",           27, "00:01", 27, "23:59"],
  ["drop-bosse",      27, "1h"]
];


/* ---------- 3) Saisonale Events (manuell) ----------
   { id, name, nameEn, icon (optional), from: "JJJJ-MM-TT HH:MM", to: "JJJJ-MM-TT HH:MM" }
   Beispiel:
   { id: "xmas-2026", name: "Weihnachts-Event", nameEn: "Christmas Event",
     from: "2026-12-20 00:01", to: "2027-01-03 23:59" },
*/
const SEASONAL_EVENTS = [
];


/* ---------- 4) Permanente Events ---------- */
const PERMANENT_EVENTS = [
  { type: "rueckkehrer", from: "2026-10-01 00:01", to: "2026-12-31 23:59" },
  { type: "anfaenger",   from: "2026-10-01 00:01", to: "2026-12-31 23:59" }
];
