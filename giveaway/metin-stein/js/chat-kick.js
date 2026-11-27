/* Kick-Chat lesen (inoffizielle Pusher-Schnittstelle, ohne Anmeldung).
   Kann sich jederzeit ändern – dann hilft der manuelle Treffer (Taste H). */
(function (root) {
  const SUPPORTER = ['subscriber', 'founder', 'vip', 'moderator', 'og'];
  const MODS = ['broadcaster', 'moderator'];

  function parseKickEvent(raw) {
    let outer;
    try { outer = JSON.parse(raw); } catch (e) { return null; }
    if (!outer || outer.event !== 'App\\Events\\ChatMessageEvent') return null;
    let d = outer.data;
    if (typeof d === 'string') { try { d = JSON.parse(d); } catch (e) { return null; } }
    if (!d || !d.sender) return null;
    const badges = ((d.sender.identity && d.sender.identity.badges) || []).map(b => b.type);
    return {
      platform: 'kick',
      id: String(d.sender.id || d.sender.username),
      name: d.sender.username || d.sender.slug || 'Kick-User',
      text: d.content || '',
      supporter: badges.some(b => SUPPORTER.indexOf(b) !== -1),
      mod: badges.some(b => MODS.indexOf(b) !== -1)
    };
  }

  async function lookupChatroomId(slug) {
    const urls = [
      'https://kick.com/api/v2/channels/' + slug,
      'https://kick.com/api/v1/channels/' + slug
    ];
    for (const u of urls) {
      try {
        const r = await fetch(u, { headers: { accept: 'application/json' } });
        if (!r.ok) continue;
        const j = await r.json();
        if (j && j.chatroom && j.chatroom.id) return String(j.chatroom.id);
      } catch (e) { /* CORS / Cloudflare – erwartbar */ }
    }
    return '';
  }

  function connectKick(cfg, onMessage, onStatus) {
    const slug = String(cfg.kickChannel || '').trim().toLowerCase();
    if (!slug && !cfg.kickChatroomId) return { close() {} };
    let ws, closed = false, retry = 0, roomId = String(cfg.kickChatroomId || '');
    const keys = [cfg.kickPusherKey].concat(cfg.kickPusherKeysFallback || []).filter(Boolean);
    let keyIdx = 0;

    async function open() {
      onStatus('kick', 'connecting');
      if (!roomId) roomId = await lookupChatroomId(slug);
      if (!roomId) { onStatus('kick', 'noid'); return; }
      const url = 'wss://ws-' + cfg.kickPusherCluster + '.pusher.com/app/' + keys[keyIdx % keys.length] +
        '?protocol=7&client=js&version=8.4.0&flash=false';
      ws = new WebSocket(url);
      ws.onmessage = ev => {
        let m; try { m = JSON.parse(ev.data); } catch (e) { return; }
        if (m.event === 'pusher:connection_established') {
          ws.send(JSON.stringify({ event: 'pusher:subscribe', data: { auth: '', channel: 'chatrooms.' + roomId + '.v2' } }));
        } else if (m.event === 'pusher_internal:subscription_succeeded') {
          retry = 0; onStatus('kick', 'ok');
        } else if (m.event === 'pusher:error') {
          // z. B. 4001: Schluessel/Cluster passt nicht -> naechsten Schluessel probieren
          keyIdx++; onStatus('kick', 'error');
        } else if (m.event === 'pusher:ping') {
          ws.send(JSON.stringify({ event: 'pusher:pong', data: {} }));
        } else {
          const msg = parseKickEvent(ev.data);
          if (msg) onMessage(msg);
        }
      };
      ws.onclose = () => {
        if (closed) return;
        onStatus('kick', 'error');
        setTimeout(open, Math.min(30000, 2000 * (++retry)));
      };
      ws.onerror = () => { try { ws.close(); } catch (e) {} };
    }
    open();
    return { close() { closed = true; try { ws.close(); } catch (e) {} } };
  }

  const api = { connectKick, parseKickEvent };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ChatKick = api;
})(typeof window !== 'undefined' ? window : globalThis);
