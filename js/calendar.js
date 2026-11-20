/* =====================================================================
   Origins2 Helper – Eventkalender (Monat / Woche / Tag)
   Daten: js/calendar-data.js · Weltbosse: js/events.js
   Hier muss normalerweise nichts geändert werden.
   ===================================================================== */

const CAL_DAY = 86400000, CAL_MIN = 60000;
const CAL_REMIND_KEY = "o2h.calReminders";
const CAL_VIEW_KEY = "o2h.calView";

/* ---------- Zeit (Serverzeit als „naive“ Millisekunden) ---------- */
const _calClock = new Intl.DateTimeFormat("en-GB", {
  timeZone: (typeof SERVER_TIMEZONE !== "undefined" ? SERVER_TIMEZONE : "Europe/Berlin"),
  year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
});
function calNow() {
  const p = Object.fromEntries(_calClock.formatToParts(new Date()).map(x => [x.type, x.value]));
  return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
}
function calParse(str) {               // "2026-11-27 20:00" oder "2026-11-27"
  const [d, tm = "00:00"] = String(str).trim().split(/\s+/);
  const [y, m, dd] = d.split("-").map(Number);
  const [h, mi] = tm.split(":").map(Number);
  return Date.UTC(y, m - 1, dd, h || 0, mi || 0);
}
function dayStart(ms) { return Math.floor(ms / CAL_DAY) * CAL_DAY; }
function hm(ms) { const d = new Date(ms); return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`; }
function ddmm(ms) { const d = new Date(ms); return `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}`; }
function calLocale() { return LANG === "de" ? "de-DE" : "en-GB"; }
function fmtDate(ms, opts) { return new Intl.DateTimeFormat(calLocale(), { timeZone: "UTC", ...opts }).format(new Date(ms)); }
function cEsc(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

function fmtSpan(ms) {
  const m = Math.max(0, Math.round(ms / CAL_MIN)), d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), mi = m % 60;
  if (LANG === "de") return d > 0 ? `${d}T ${h}Std` : h > 0 ? `${h}Std ${mi}Min` : `${mi}Min`;
  return d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${mi}m` : `${mi}m`;
}

/* ---------- Termine erzeugen ---------- */
function cycleOccurrences(from, to) {
  const A = calParse(CYCLE_START), C = 28 * CAL_DAY, out = [];
  const k0 = Math.floor((from - A) / C) - 1, k1 = Math.floor((to - A) / C) + 1;
  for (let k = k0; k <= k1; k++) {
    for (const [type, sd, st, ed, et] of EVENT_CYCLE) {
      const base = A + k * C;
      let start, end, hour = false;
      if (st === "1h") { start = base + sd * CAL_DAY; end = start + CAL_DAY - CAL_MIN; hour = true; }
      else {
        const [sh, sm] = st.split(":").map(Number), [eh, em] = et.split(":").map(Number);
        start = base + sd * CAL_DAY + (sh * 60 + sm) * CAL_MIN;
        end = base + ed * CAL_DAY + (eh * 60 + em) * CAL_MIN;
      }
      if (end >= from && start <= to) {
        const info = EVENT_TYPES[type] || { name: type, icon: "" };
        out.push({ kind: "event", type, key: `${type}@${start}`, name: L(info), icon: info.icon, start, end, hour });
      }
    }
  }
  return out;
}

function listOccurrences(list, kind, from, to) {
  return (list || []).map(e => {
    const s = calParse(e.from), en = calParse(e.to);
    const info = e.type && EVENT_TYPES[e.type] ? EVENT_TYPES[e.type] : e;
    return { kind, type: e.type || e.id, key: `${e.id || e.type}@${s}`, name: L(info), icon: info.icon || "", note: L(e, "note"), start: s, end: en, hour: false };
  }).filter(o => o.end >= from && o.start <= to);
}

const CAL_ORDER = { season: 0, event: 1 };
function occurrences(from, to) {
  const all = cycleOccurrences(from, to).concat(listOccurrences(SEASONAL_EVENTS, "season", from, to));
  return all.sort((a, b) => (CAL_ORDER[a.kind] - CAL_ORDER[b.kind]) || (a.hour - b.hour) || (a.start - b.start) || a.name.localeCompare(b.name));
}

/* ---------- Erinnerungen ---------- */
function remSet() { try { return new Set(JSON.parse(localStorage.getItem(CAL_REMIND_KEY) || "[]")); } catch { return new Set(); } }
function remSave(s) { try { localStorage.setItem(CAL_REMIND_KEY, JSON.stringify([...s])); } catch {} }

/* ---------- Zustand ---------- */
let calView = (() => { try { return localStorage.getItem(CAL_VIEW_KEY) || "month"; } catch { return "month"; } })();
let calCursor = dayStart(calNow());   // angezeigter Monat/Woche
let calSelected = dayStart(calNow()); // gewählter Tag

function monthStart(ms) { const d = new Date(ms); return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1); }
function weekStart(ms) { const d = new Date(ms); const wd = (d.getUTCDay() + 6) % 7; return dayStart(ms) - wd * CAL_DAY; }

/* ---------- Darstellung ---------- */
function statusOf(o, now) {
  if (o.kind === "boss") {
    if (now >= o.start + 10 * CAL_MIN) return { cls: "ended", text: t("cal.spawned") };
    if (now >= o.start) return { cls: "active", text: t("cal.spawnNow") };
    return { cls: "soon", text: t("cal.in", fmtSpan(o.start - now)) };
  }
  if (now > o.end) return { cls: "ended", text: t("cal.ended") };
  if (now >= o.start) return { cls: "active", text: t("cal.active"), sub: o.hour ? "" : t("cal.left", fmtSpan(o.end - now)) };
  return { cls: "soon", text: t("cal.upcoming"), sub: t("cal.in", fmtSpan(o.start - now)) };
}

function timeText(o) {
  if (o.kind === "boss") return hm(o.start);
  if (o.hour) return t("cal.duration1h");
  const sameDay = dayStart(o.start) === dayStart(o.end);
  if (sameDay) return `${hm(o.start)} – ${hm(o.end)}`;
  return `${ddmm(o.start)} ${hm(o.start)} – ${ddmm(o.end)} ${hm(o.end)}`;
}

function iconHtml(o, cls = "") {
  if (o.icon) return `<span class="ev-ico ${cls} kind-${o.kind}"><img src="${cEsc(o.icon)}" alt="" loading="lazy"></span>`;
  const letter = (o.name || "?").trim().charAt(0).toUpperCase();
  return `<span class="ev-ico ${cls} kind-${o.kind} is-letter">${cEsc(letter)}</span>`;
}

function renderMonth(el, now) {
  const ms = monthStart(calCursor);
  const first = weekStart(ms);
  const nextMonth = Date.UTC(new Date(ms).getUTCFullYear(), new Date(ms).getUTCMonth() + 1, 1);
  const last = weekStart(nextMonth - CAL_DAY) + 6 * CAL_DAY;
  const occ = occurrences(first, last + CAL_DAY - 1);
  const today = dayStart(now);
  let html = `<div class="cal-grid cal-month">` + weekdayHead();
  for (let d = first; d <= last; d += CAL_DAY) {
    const dayOcc = occ.filter(o => o.start < d + CAL_DAY && o.end >= d);
    const inMonth = new Date(d).getUTCMonth() === new Date(ms).getUTCMonth();
    const shown = dayOcc.slice(0, 4), more = dayOcc.length - shown.length;
    html += `<button type="button" class="cal-cell${inMonth ? "" : " is-out"}${d === today ? " is-today" : ""}${d === calSelected ? " is-sel" : ""}${d < today ? " is-past" : ""}" data-day="${d}">
      <span class="cal-num tabular-nums">${new Date(d).getUTCDate()}</span>
      <span class="cal-icons">${shown.map(o => iconHtml(o, "sm")).join("")}${more > 0 ? `<span class="cal-more tabular-nums">+${more}</span>` : ""}</span>
      ${dayOcc.length ? `<span class="cal-count tabular-nums">${dayOcc.length}</span>` : ""}
    </button>`;
  }
  el.innerHTML = html + `</div>`;
}

function weekdayHead() {
  const mon = Date.UTC(2026, 10, 2);
  let h = "";
  for (let i = 0; i < 7; i++) h += `<span class="cal-wd">${fmtDate(mon + i * CAL_DAY, { weekday: "short" })}</span>`;
  return h;
}

function renderWeek(el, now) {
  const ws = weekStart(calCursor);
  const occ = occurrences(ws, ws + 7 * CAL_DAY - 1);
  const today = dayStart(now);
  let html = `<div class="cal-week">`;
  for (let i = 0; i < 7; i++) {
    const d = ws + i * CAL_DAY;
    const dayOcc = occ.filter(o => o.start < d + CAL_DAY && o.end >= d);
    html += `<div class="cal-wcol${d === today ? " is-today" : ""}${d === calSelected ? " is-sel" : ""}${d < today ? " is-past" : ""}">
      <button type="button" class="cal-whead" data-day="${d}">
        <span class="cal-wname">${fmtDate(d, { weekday: "short" })}</span>
        <span class="cal-wdate tabular-nums">${fmtDate(d, { day: "numeric", month: "short" })}</span>
      </button>
      <div class="cal-wlist">${dayOcc.length ? dayOcc.map(o => `
        <button type="button" class="cal-wev kind-${o.kind}" data-day="${d}" title="${cEsc(o.name)}">
          ${iconHtml(o, "xs")}<span class="min-w-0"><span class="cal-wev-name">${cEsc(o.name)}</span><span class="cal-wev-time tabular-nums">${cEsc(o.hour ? t("cal.duration1h") : (dayStart(o.start) === d ? hm(o.start) : "…") + (o.kind === "boss" ? "" : " – " + (dayStart(o.end) === d ? hm(o.end) : "…")))}</span></span>
        </button>`).join("") : `<p class="cal-none">–</p>`}</div>
    </div>`;
  }
  el.innerHTML = html + `</div>`;
}

function renderDay(now) {
  const el = document.getElementById("cal-day");
  if (!el) return;
  const d = calSelected;
  const occ = occurrences(d, d + CAL_DAY - 1);
  const rem = remSet();
  const title = fmtDate(d, { weekday: "long", day: "numeric", month: "long" });
  el.innerHTML = `
    <div class="cal-day-head">
      <h3 class="cal-day-title">${cEsc(title)}</h3>
      <span class="cal-day-count tabular-nums">${occ.length}</span>
    </div>
    <ul class="cal-list">${occ.length ? occ.map(o => {
      const st = statusOf(o, now);
      const on = rem.has(o.key);
      const canRemind = o.kind !== "boss" && now < o.start;
      return `<li class="cal-item st-${st.cls} kind-${o.kind}">
        ${iconHtml(o)}
        <div class="cal-item-body">
          <p class="cal-item-name">${cEsc(o.name)}${o.kind === "season" ? ` <span class="cal-tag">${t("cal.season")}</span>` : ""}</p>
          <p class="cal-item-meta"><span class="cal-st">${st.text}</span> <span class="tabular-nums">${cEsc(timeText(o))}</span></p>
          ${o.note ? `<p class="cal-item-note">${cEsc(o.note)}</p>` : ""}
        </div>
        <div class="cal-item-side">
          ${st.sub ? `<span class="cal-item-left tabular-nums">${st.sub}</span>` : ""}
          ${canRemind ? `<button type="button" class="bell bell-sm${on ? " is-on" : ""}" data-rem="${cEsc(o.key)}" aria-pressed="${on}" title="${cEsc(on ? t("cal.remOn") : t("cal.remOff"))}">${typeof BELL_SVG !== "undefined" ? BELL_SVG : "🔔"}</button>` : ""}
        </div>
      </li>`;
    }).join("") : `<li class="cal-empty">${t("cal.nothing")}</li>`}</ul>`;
}

function renderPermanent(now) {
  const el = document.getElementById("cal-perm");
  if (!el) return;
  const items = (PERMANENT_EVENTS || []).map(p => {
    const info = EVENT_TYPES[p.type] || {};
    const s = calParse(p.from), e = calParse(p.to);
    if (now > e) return "";
    return `<span class="perm-chip">${iconHtml({ icon: info.icon, name: L(info), kind: "event" }, "xs")}<span>${cEsc(L(info))}</span><span class="perm-until tabular-nums">${t("cal.until", ddmm(e))}</span></span>`;
  }).join("");
  el.innerHTML = items ? `<span class="field-label">${t("cal.permanent")}</span>${items}` : "";
}

function renderNavLabel() {
  const el = document.getElementById("cal-label");
  if (!el) return;
  if (calView === "month") el.textContent = fmtDate(monthStart(calCursor), { month: "long", year: "numeric" });
  else {
    const ws = weekStart(calCursor), we = ws + 6 * CAL_DAY;
    el.textContent = `${fmtDate(ws, { day: "numeric", month: "short" })} – ${fmtDate(we, { day: "numeric", month: "short", year: "numeric" })}`;
  }
}

function renderCalendar() {
  const now = calNow();
  const main = document.getElementById("cal-main");
  if (!main) return;
  document.querySelectorAll("[data-cal-view]").forEach(b => b.classList.toggle("is-active", b.dataset.calView === calView));
  renderNavLabel();
  if (calView === "month") renderMonth(main, now); else renderWeek(main, now);
  renderDay(now);
  renderPermanent(now);
}

/* ---------- „Heute aktiv“ im Kopfbereich ---------- */
function renderToday() {
  const box = document.getElementById("today-icons"), more = document.getElementById("today-more");
  if (!box) return;
  const now = calNow(), d = dayStart(now);
  const act = occurrences(d, d + CAL_DAY - 1).filter(o => o.start <= now && o.end >= now && !o.hour)
    .concat(occurrences(d, d + CAL_DAY - 1).filter(o => o.hour));
  const seen = new Set(), list = act.filter(o => !seen.has(o.type) && seen.add(o.type));
  box.innerHTML = list.slice(0, 7).map(o => `<span title="${cEsc(o.name)}">${iconHtml(o, "sm")}</span>`).join("");
  more.textContent = list.length ? t("today.count", list.length) : t("today.none");
}

/* ---------- Erinnerungs-Check (jede Sekunde) ---------- */
const _calFired = new Set();
function calTick() {
  const now = calNow();
  const rem = remSet();
  if (rem.size) {
    rem.forEach(key => {
      const at = +key.split("@")[1];
      if (now >= at && now - at < 60 * 1000 && !_calFired.has(key)) {
        _calFired.add(key);
        const type = key.split("@")[0];
        const info = EVENT_TYPES[type] || (SEASONAL_EVENTS || []).find(e => e.id === type) || { name: type };
        if (typeof ping === "function") ping(true);
        if (typeof toast === "function") toast(t("cal.startsNow", L(info)));
      }
    });
  }
  // Tagesliste live halten (Countdowns), nur wenn der Kalender sichtbar ist
  const view = document.querySelector('[data-view="kalender"]');
  if (view && !view.hidden && now % 30000 < 1000) renderDay(now);
}

function initCalendar() {
  if (typeof EVENT_CYCLE === "undefined" || !document.getElementById("cal-main")) return;
  const root = document.querySelector('[data-view="kalender"]');
  root.addEventListener("click", e => {
    const v = e.target.closest("[data-cal-view]");
    if (v) { calView = v.dataset.calView; try { localStorage.setItem(CAL_VIEW_KEY, calView); } catch {} calCursor = calSelected; renderCalendar(); return; }
    const nav = e.target.closest("[data-cal-nav]");
    if (nav) {
      const dir = nav.dataset.calNav;
      if (dir === "today") { calCursor = calSelected = dayStart(calNow()); }
      else if (calView === "month") {
        const d = new Date(monthStart(calCursor));
        calCursor = Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + (dir === "next" ? 1 : -1), 1);
      } else calCursor += (dir === "next" ? 7 : -7) * CAL_DAY;
      renderCalendar(); return;
    }
    const rb = e.target.closest("[data-rem]");
    if (rb) {
      const s = remSet(), k = rb.dataset.rem;
      const on = !s.has(k); on ? s.add(k) : s.delete(k); remSave(s);
      if (on && typeof ping === "function") ping(false);
      if (typeof toast === "function") toast(on ? t("cal.remToastOn") : t("cal.remToastOff"));
      renderDay(calNow()); return;
    }
    const day = e.target.closest("[data-day]");
    if (day) {
      calSelected = +day.dataset.day;
      renderCalendar();
      if (window.innerWidth < 900) document.getElementById("cal-day")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
  window.addEventListener("langchange", () => { renderCalendar(); renderToday(); });
  renderCalendar();
  renderToday();
  setInterval(renderToday, 60000);
  setInterval(calTick, 1000);
}
