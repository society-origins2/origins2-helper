/* =========================================================
   Metin-Stein-Giveaway – Einstellungen
   Alles hier kann auch per URL überschrieben werden, z. B.:
   index.html?kick=xzcriticalzz&twitch=meinkanal&hp=150&cd=30
   ========================================================= */
(function () {
  const C = {
    // --- Kanäle (leer lassen = Plattform aus) ---
    kickChannel: 'xzcriticalzz',
    kickChatroomId: '',          // nur nötig, wenn die automatische Suche scheitert (siehe README)
    twitchChannel: '',

    // --- Spielregeln ---
    command: '!hit',             // Chat-Befehl
    stoneHp: 100,                // Lebenspunkte des Steins
    cooldownSec: 30,             // Wartezeit pro Zuschauer
    damage: 1,                   // Schaden pro Treffer
    critMultiplier: 3,           // Schaden bei kritischem Treffer
    critChanceSupporter: 0.30,   // Crit-Chance für Subs / VIPs / Mods
    critChanceViewer: 0.05,      // Crit-Chance für alle anderen

    // --- Steuerung per Chat (nur Streamer und Mods) ---
    spawnCommand: '!spawn',         // !spawn hp 120  → startet das Giveaway mit 120 HP
    giveawayCommand: '!giveaway',   // !giveaway stop | reset | hp <zahl>
    autoStart: false,               // false = Stein erscheint erst nach !giveaway start

    // --- Gutschein-Drops (Plan: N Gutscheine ueber M Minuten, pro Zeitfenster einer garantiert) ---
    dropLabel: '50-DR-Gutschein',
    dropChance: 0.20,              // Chance pro Stein, solange das Zeitfenster noch nicht vorbei ist
    dropGuaranteeBufferMin: 5,     // so viele Minuten vor Fensterende ist der naechste Stein ein sicherer Drop
    drops: 0,                      // Standard-Anzahl Gutscheine (0 = kein Plan), meist per !spawn gesetzt
    streamMinutes: 90,             // Standard-Streamlaenge, wenn !spawn nur drops angibt

    // --- Regeln-Anzeige (!rules) ---
    rulesCommand: '!rules',
    rulesShowSec: 12,            // so lange bleibt die Regel-Karte sichtbar
    rulesCooldownSec: 45,        // Sperre, damit der Befehl nicht spammt (für alle zusammen)

    // --- Ablauf ---
    winnerShowSec: 12,           // so lange bleibt die Gewinner-Anzeige
    autoNewStone: true,          // nach der Anzeige automatisch neuer Stein
    streamerName: 'Streamer',    // Name beim manuellen Treffer (Taste H)

    // --- Texte ---
    lang: 'de',                  // 'de' oder 'en'

    // --- Sound (später, leer = aus) ---
    soundHit: '',
    soundDestroy: '',

    // --- Kick-Schnittstelle (inoffiziell, bei Bedarf anpassen) ---
    kickPusherKey: '32cbd69e4b950bf97679',
    kickPusherCluster: 'us2'
  };

  const q = new URLSearchParams(location.search);
  const num = (k, f) => { if (q.has(k) && q.get(k) !== '' && !isNaN(+q.get(k))) C[f] = +q.get(k); };
  if (q.has('kick')) C.kickChannel = q.get('kick');
  if (q.has('twitch')) C.twitchChannel = q.get('twitch');
  if (q.has('chatroom')) C.kickChatroomId = q.get('chatroom');
  if (q.has('cmd')) C.command = q.get('cmd');
  if (q.has('lang')) C.lang = q.get('lang');
  if (q.has('name')) C.streamerName = q.get('name');
  num('hp', 'stoneHp'); num('cd', 'cooldownSec'); num('dmg', 'damage');
  num('crit', 'critMultiplier'); num('critsub', 'critChanceSupporter'); num('critviewer', 'critChanceViewer');
  num('show', 'winnerShowSec');
  if (q.get('auto') === '0') C.autoNewStone = false;
  if (q.get('autostart') === '1') C.autoStart = true;
  num('drops', 'drops'); num('time', 'streamMinutes'); num('dropchance', 'dropChance');
  if (q.has('label')) C.dropLabel = q.get('label');
  if (q.has('scmd')) C.spawnCommand = q.get('scmd');
  if (q.has('gcmd')) C.giveawayCommand = q.get('gcmd');

  C.flags = {
    test: q.get('test') === '1',
    panel: q.get('panel') === '1' || q.get('test') === '1',
    bg: q.get('bg') === '1' || q.get('test') === '1'
  };
  if (C.flags.test) C.autoStart = true;
  window.CFG = C;
})();
