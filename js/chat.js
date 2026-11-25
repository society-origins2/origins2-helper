/* =====================================================================
   KI-CHAT  –  „Frag xZcRiTiCaLZz“: Fragen zur Seite und zu Origins2
   ---------------------------------------------------------------------
   CHAT_ENABLED : false = der Chat ist für Besucher unsichtbar.
                  Zum Testen: Seite mit  …/index.html?chat=1  öffnen.
                  Erst auf true stellen, wenn echte Daten in js/chat-data.js
                  stehen und keine Testeinträge (isTest) mehr da sind.
   CHAT_API_URL : Adresse deines Cloudflare-Workers (Anleitung: worker/ANLEITUNG.md).
                  Leer lassen = Chat arbeitet nur mit der Textsuche (ohne KI).
   ===================================================================== */

const CHAT_ENABLED = true;
const CHAT_API_URL = "";

const CHAT_COOLDOWN_MS = 3000;      // Pause zwischen zwei Fragen
const CHAT_MAX_PER_HOUR = 30;       // Fragen pro Stunde und Besucher (nur Bremse im Browser)
const CHAT_MAX_LEN = 300;           // längste erlaubte Frage
const CHAT_TIMEOUT_MS = 12000;      // so lange wartet die Seite auf die KI
const CHAT_QUICK = ["chat.q1", "chat.q2", "chat.q3"];   // Schnellfragen (Texte in js/i18n.js)


/* =====================================================================
   Ab hier nichts ändern
   ===================================================================== */
const CHAT_LOG_KEY = "o2h.chatLog";
const CHAT_STOP = new Set(("der die das den dem des ein eine einen und oder ist sind wie was wo wann wer kann koennen ich mich mir man zu zum zur im in auf fur mit von es gibt gibts diese dieser dieses " +
  "hat welche welcher welches the a an and or is are how what where when who which can i me to of for on with do does my this that there").split(" "));

/* ---------- Suche in der Wissensbasis (arbeitet ohne KI) ---------- */
function chatFold(s) {
  return String(s || "").toLowerCase().replace(/ß/g, "ss").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}
function chatTokens(q) {
  return chatFold(q).split(" ").filter(w => w.length >= 3 && !CHAT_STOP.has(w));
}
/* Wort-Treffer: ganzes Wort, bei längeren Wörtern auch Wortanfang bzw. Mehrzahl
   („skills“ trifft „skill“, „skilltree“ trifft „skill“, „petskill“ trifft NICHT „skill“) */
function chatWordHit(w, tok) {
  return w === tok || (tok.length >= 5 && (w.startsWith(tok) || (w.length >= 5 && tok.startsWith(w) && tok.length - w.length <= 3)));
}
function chatScore(e, tokens) {
  const words = s => chatFold(s).split(" ");
  const f = e._f || (e._f = {
    title: words(e.title + " " + (e.titleEn || "")),
    kw: (e.kw || []).map(words),            // jedes Stichwort als Liste seiner Wörter
    text: words(e.text + " " + (e.textEn || ""))
  });
  let s = 0;
  for (const tok of tokens) {
    if (f.kw.some(ws => ws.some(w => chatWordHit(w, tok)))) s += 4;
    else if (f.title.some(w => chatWordHit(w, tok))) s += 3;
    else if (f.text.some(w => chatWordHit(w, tok))) s += 1;
  }
  return s;
}
/* beste Einträge zur Frage (mindestens ein Stichwort- oder Titeltreffer) */
function chatSearch(q, limit = 3) {
  const tokens = chatTokens(q);
  if (!tokens.length || typeof CHAT_KB === "undefined") return [];
  return CHAT_KB
    .map((e, i) => ({ e, i, s: chatScore(e, tokens) }))
    .filter(x => x.s >= 3)
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .slice(0, limit)
    .map(x => x.e);
}

/* ---------- kleine Helfer ---------- */
function chatEl(tag, cls, text) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (text != null) el.textContent = text;
  return el;
}
function chatGet(id) { return document.getElementById(id); }
function chatReadLog() {
  try { const a = JSON.parse(localStorage.getItem(CHAT_LOG_KEY) || "[]"); return Array.isArray(a) ? a.filter(n => typeof n === "number") : []; } catch { return []; }
}
function chatWriteLog(a) { try { localStorage.setItem(CHAT_LOG_KEY, JSON.stringify(a.slice(-100))); } catch {} }
function chatIsEnabled() {
  return CHAT_ENABLED || /[?&]chat=1(&|$)/.test(location.search) || location.hash === "#chat";
}
/* eigenes Mini-Fenster über dem Spiel: …/index.html?mini=chat (Knopf in der Mini-Leiste) */
const CHAT_MINI = /[?&]mini=chat(&|$)/.test(location.search);

const chatState = { open: false, busy: false, last: 0, started: false };

/* ---------- Nachrichten zeichnen ---------- */
function chatAvatar() {
  const a = chatEl("span", "chat-ava chat-ava-sm");
  const img = document.createElement("img");
  img.src = "assets/chat-avatar.png"; img.alt = ""; img.width = 40; img.height = 40;
  a.appendChild(img);
  return a;
}
function chatScroll() {
  const log = chatGet("chat-log"); if (!log) return;
  log.scrollTop = log.scrollHeight;
  // nach dem Neu-Umbrechen (Schriften, Bilder) noch einmal, sonst bleibt die letzte Zeile unter dem Rand
  requestAnimationFrame(() => { log.scrollTop = log.scrollHeight; });
}

function chatAddUser(text) {
  const row = chatEl("div", "chat-row chat-row-user");
  row.appendChild(chatEl("div", "chat-bubble chat-bubble-user", text));
  chatGet("chat-log").appendChild(row);
  chatScroll();
}

/* opts: { text, note, source, link, more: [Einträge], test: true } */
function chatAddBot(opts) {
  const row = chatEl("div", "chat-row chat-row-bot");
  row.appendChild(chatAvatar());
  const b = chatEl("div", "chat-bubble chat-bubble-bot");
  if (opts.note) b.appendChild(chatEl("p", "chat-note-in", opts.note));
  if (opts.text) b.appendChild(chatEl("p", "chat-text", opts.text));
  if (opts.test) b.appendChild(chatEl("p", "chat-test", t("chat.testNote")));
  if (opts.source) b.appendChild(chatEl("p", "chat-src", t("chat.source", opts.source)));
  if (opts.link) {
    const a = chatEl("a", "chat-link", t("chat.goto"));
    a.href = opts.link;
    a.addEventListener("click", () => chatClose(false));
    b.appendChild(a);
  }
  if (opts.more && opts.more.length) {
    b.appendChild(chatEl("p", "chat-also", t("chat.also")));
    const box = chatEl("div", "chat-chips");
    opts.more.forEach(e => {
      const c = chatEl("button", "chat-chip", L(e, "title"));
      c.type = "button";
      c.addEventListener("click", () => { chatAddUser(L(e, "title")); chatShowEntry(e, []); });
      box.appendChild(c);
    });
    b.appendChild(box);
  }
  row.appendChild(b);
  chatGet("chat-log").appendChild(row);
  chatScroll();
  return row;
}

function chatAddChips() {
  const box = chatEl("div", "chat-chips chat-chips-start");
  CHAT_QUICK.forEach(key => {
    const c = chatEl("button", "chat-chip", t(key));
    c.type = "button";
    c.addEventListener("click", () => { box.remove(); chatAsk(t(key)); });
    box.appendChild(c);
  });
  chatGet("chat-log").appendChild(box);
}

function chatTyping(on) {
  const old = chatGet("chat-typing");
  if (old) old.remove();
  if (!on) return;
  const row = chatEl("div", "chat-row chat-row-bot");
  row.id = "chat-typing";
  row.appendChild(chatAvatar());
  const b = chatEl("div", "chat-bubble chat-bubble-bot chat-typing");
  b.setAttribute("aria-label", t("chat.typing"));
  for (let i = 0; i < 3; i++) b.appendChild(chatEl("i"));
  row.appendChild(b);
  chatGet("chat-log").appendChild(row);
  chatScroll();
}

/* ---------- Antworten ---------- */
function chatShowEntry(e, more, note) {
  chatAddBot({ text: L(e, "text"), source: L(e, "source"), link: e.link || "", more, test: !!e.isTest, note });
}

function chatAnswerLocal(hits, note) {
  if (!hits.length) { chatAddBot({ text: t("chat.none") }); return; }
  chatShowEntry(hits[0], hits.slice(1), note);
}

async function chatCallApi(q, hits) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), CHAT_TIMEOUT_MS);
  try {
    const res = await fetch(CHAT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q, lang: LANG,
        ctx: hits.map(e => ({ t: L(e, "title"), x: L(e, "text"), s: L(e, "source") }))
      }),
      signal: ctrl.signal
    });
    if (!res.ok) throw new Error("http " + res.status);
    const data = await res.json();
    if (!data || typeof data.answer !== "string" || !data.answer.trim()) throw new Error("leer");
    return data.answer.trim().slice(0, 2000);
  } finally { clearTimeout(timer); }
}

async function chatAsk(raw) {
  const q = String(raw || "").trim().slice(0, CHAT_MAX_LEN);
  if (!q || chatState.busy) return;
  const now = Date.now();
  if (now - chatState.last < CHAT_COOLDOWN_MS) { toast(t("chat.wait")); return; }
  const log = chatReadLog().filter(ts => now - ts < 3600000);
  if (log.length >= CHAT_MAX_PER_HOUR) { chatAddUser(q); chatAddBot({ text: t("chat.limit") }); return; }
  log.push(now); chatWriteLog(log);
  chatState.last = now; chatState.busy = true;
  const send = chatGet("chat-send"); if (send) send.disabled = true;

  chatAddUser(q);
  const hits = chatSearch(q);
  try {
    if (CHAT_API_URL && hits.length) {
      chatTyping(true);
      try {
        const answer = await chatCallApi(q, hits);
        chatTyping(false);
        const first = hits[0];
        chatAddBot({
          text: answer,
          source: hits.slice(0, 2).map(e => L(e, "source")).filter((v, i, a) => v && a.indexOf(v) === i).join(" · "),
          link: first.link || "",
          test: hits.some(e => e.isTest)
        });
      } catch {
        chatTyping(false);
        chatAnswerLocal(hits, t("chat.busy"));      // KI nicht erreichbar/ausgelastet → Textsuche
      }
    } else {
      chatAnswerLocal(hits);
    }
  } finally {
    chatState.busy = false;
    if (send) send.disabled = false;
  }
}

/* ---------- Fenster öffnen/schließen ---------- */
function chatStart() {
  const log = chatGet("chat-log"); if (!log) return;
  log.textContent = "";
  chatAddBot({ text: t("chat.hello") });
  chatAddChips();
  chatState.started = true;
}
function chatSubLabel() {
  const el = chatGet("chat-sub"); if (el) el.textContent = t(CHAT_API_URL ? "chat.subAi" : "chat.subSearch");
  // Mit Worker geht die Frage an einen KI-Dienst – das muss im Fenster stehen (Datenschutz)
  const note = document.querySelector("#chat-win .chat-note");
  if (note) note.textContent = t(CHAT_API_URL ? "chat.noteAi" : "chat.note");
}
function chatOpen() {
  const win = chatGet("chat-win"), fab = chatGet("chat-float"); if (!win) return;
  if (!chatState.started) chatStart();
  chatSubLabel();
  win.hidden = false; if (fab) fab.hidden = true;
  document.body.classList.add("chat-open");
  chatState.open = true;
  setTimeout(() => chatGet("chat-input")?.focus(), 60);
}
function chatClose(refocus = true) {
  // Im eigenen Mini-Fenster gibt es nichts zu schließen: zurück zur Mini-Leiste
  if (CHAT_MINI) { if (typeof miniGo === "function") miniGo("dock"); return; }
  const win = chatGet("chat-win"), fab = chatGet("chat-float"); if (!win) return;
  win.hidden = true; fab.hidden = false;
  document.body.classList.remove("chat-open");
  chatState.open = false;
  if (refocus) fab.focus();
}

function initChat() {
  const fab = chatGet("chat-float"), win = chatGet("chat-win");
  // Chat aus? Dann auch kein leeres Mini-Fenster stehen lassen
  if (!chatIsEnabled()) { if (CHAT_MINI && typeof miniGo === "function") miniGo("dock"); return; }
  if (!fab || !win) return;
  // Mini-Leiste neu zeichnen – der Chat-Knopf erscheint dort erst, wenn der Chat eingeschaltet ist
  if (typeof miniRedraw === "function") miniRedraw();

  chatGet("chat-close").addEventListener("click", () => chatClose(true));
  chatGet("chat-form").addEventListener("submit", e => {
    e.preventDefault();
    const inp = chatGet("chat-input"); const v = inp.value; inp.value = "";
    chatAsk(v);
  });
  window.addEventListener("langchange", () => {
    chatSubLabel();
    if (chatState.started && !chatGet("chat-log").querySelector(".chat-row-user")) chatStart();   // noch kein Gespräch → Begrüßung neu in der Sprache
  });

  // Eigenes Mini-Fenster (?mini=chat): füllt das ganze Fenster, kein schwebender Knopf
  if (CHAT_MINI) {
    document.documentElement.classList.add("is-mini", "is-mini-chat");
    document.title = "xZcRiTiCaLZz · Origins2 Helper";
    chatOpen();
    return;
  }

  fab.hidden = false;
  document.documentElement.classList.add("chat-on");   // rückt den Weihnachtsbaum zur Seite (css/theme.css)
  fab.addEventListener("click", chatOpen);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && chatState.open) chatClose(true); });
  if (location.hash === "#chat") chatOpen();
}

