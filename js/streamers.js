/* =====================================================================
   PROMOTER-LISTE  –  hier trägst du neue Streamer ein
   ---------------------------------------------------------------------
   Einfach einen Block { ... } kopieren, Komma dahinter nicht vergessen.

   name      : Anzeigename
   platform  : "twitch" | "kick" | "youtube"
   url       : Link zum Kanal / Stream
   group     : "guild"  = Gilden-Promoter (Society)
               "server" = Server-Promoter (Origins2)
   live      : true / false   (manuell, bis wir in Phase 2 automatisch prüfen)
   tagline   : kurze Beschreibung (optional), taglineEn = englische Version
   avatar    : Bild im Ordner assets/, z.B. "assets/avatars/name.png" (optional)
   ===================================================================== */

const STREAMERS = [
  {
    name: "Lucid / xTraube",
    platform: "kick",
    url: "https://kick.com/drtraube",
    group: "guild",
    live: false,
    tagline: "Society"
  },
  {
    name: "xZcRiTiCaLZz",
    platform: "kick",
    url: "https://kick.com/xzcriticalzz",
    group: "guild",
    live: false,
    tagline: "Society"
  }
];


/* =====================================================================
   Ab hier nichts ändern – Darstellung der Promoter-Leiste
   ===================================================================== */

const PLATFORMS = {
  twitch: {
    label: "Twitch",
    cls: "pf-twitch",
    icon: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.3 3 3 6.4v13.7h4.6V22h2.6l1.9-1.9h3.7l5.2-5.2V3H4.3Zm15 11-2.9 2.9h-4.6L9.4 19.3v-2.4H5.5V4.7h13.8V14Zm-2.9-6v5h-1.7V8h1.7Zm-4.6 0v5H10.1V8h1.7Z"/></svg>'
  },
  kick: {
    label: "Kick",
    cls: "pf-kick",
    icon: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 3h5v6h2V7h2V5h2V3h5v5h-2v2h-2v4h2v2h2v5h-5v-2h-2v-2h-2v-2H9v6H4V3Z"/></svg>'
  },
  youtube: {
    label: "YouTube",
    cls: "pf-youtube",
    icon: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z"/></svg>'
  }
};

function groupLabel(g) { return g === "guild" || g === "server" ? t("promoter." + g) : t("promoter.default"); }

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, c => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

function initials(name) {
  const clean = String(name).replace(/[^A-Za-z0-9 ]/g, " ").trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return clean.slice(0, 2).toUpperCase() || "?";
}

function streamerCard(s) {
  const pf = PLATFORMS[s.platform] || PLATFORMS.twitch;
  const avatar = s.avatar
    ? `<img src="${escapeHtml(s.avatar)}" alt="" class="avatar-img">`
    : `<span class="avatar-initials">${escapeHtml(initials(s.name))}</span>`;

  const status = s.live
    ? `<span class="status is-live"><span class="dot"></span>${t("status.live")}</span>`
    : `<span class="status">${t("status.offline")}</span>`;

  const sub = L(s, "tagline") || groupLabel(s.group);

  return `
    <a href="${escapeHtml(s.url)}" class="streamer-mini ${s.live ? "is-live" : ""}" target="_blank" rel="noopener"
       title="${escapeHtml(s.name)} – ${t("promoter.open")}">
      <span class="avatar ${s.live ? "is-live" : ""}">${avatar}</span>
      <span class="min-w-0 flex-1">
        <span class="flex items-center gap-2">
          <span class="truncate text-sm font-semibold text-parch-100">${escapeHtml(s.name)}</span>
          <span class="pf-icon ${pf.cls}" aria-label="${pf.label}">${pf.icon}</span>
        </span>
        <span class="mt-0.5 flex items-center gap-2">
          ${status}
          <span class="truncate text-[11px] text-parch-500">${escapeHtml(sub)}</span>
        </span>
      </span>
      <span class="open-icon" aria-hidden="true">
        <svg viewBox="0 0 20 20" fill="currentColor"><path d="M11 3h6v6h-2V6.4l-6.3 6.3-1.4-1.4L13.6 5H11V3zM5 5h3v2H5v8h8v-3h2v5H3V5h2z"/></svg>
      </span>
    </a>`;
}

let streamerFilter = "all";
function renderStreamers(filter = streamerFilter) {
  streamerFilter = filter;
  const list = document.getElementById("promoter-list");
  const empty = document.getElementById("promoter-empty");
  if (!list) return;

  // Live-Streamer immer zuerst
  const sorted = [...STREAMERS].sort((a, b) => Number(b.live) - Number(a.live));
  const shown = sorted.filter(s =>
    filter === "all" ? true :
    filter === "live" ? s.live :
    s.group === filter
  );

  list.innerHTML = shown.map(streamerCard).join("");
  empty.classList.toggle("hidden", shown.length > 0);

  const ll = document.getElementById("live-line");
  if (ll) ll.innerHTML = t("promoter.liveOf",
    `<span class="tabular-nums text-parch-300">${STREAMERS.filter(s => s.live).length}</span>`,
    `<span class="tabular-nums">${STREAMERS.length}</span>`);
}

function initStreamers() {
  renderStreamers("all");
  const bar = document.getElementById("promoter-filter");
  if (!bar) return;
  bar.addEventListener("click", e => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    bar.querySelectorAll(".chip").forEach(c => c.classList.toggle("is-active", c === btn));
    renderStreamers(btn.dataset.filter);
  });
  window.addEventListener("langchange", () => renderStreamers());
}
