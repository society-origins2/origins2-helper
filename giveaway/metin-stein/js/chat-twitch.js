/* Twitch-Chat lesen (anonym, ohne Anmeldung). */
(function (root) {
  const SUPPORTER = ['subscriber', 'founder', 'vip', 'moderator'];
  const MODS = ['broadcaster', 'moderator'];

  function parseTwitchLine(line) {
    if (!line || line.indexOf(' PRIVMSG #') === -1) return null;
    let tags = {};
    let rest = line;
    if (line[0] === '@') {
      const sp = line.indexOf(' ');
      line.slice(1, sp).split(';').forEach(kv => {
        const i = kv.indexOf('=');
        tags[kv.slice(0, i)] = kv.slice(i + 1);
      });
      rest = line.slice(sp + 1);
    }
    const m = rest.match(/^:([^!]+)![^ ]+ PRIVMSG #[^ ]+ :(.*)$/);
    if (!m) return null;
    const badges = (tags['badges'] || '').split(',').map(b => b.split('/')[0]).filter(Boolean);
    return {
      platform: 'twitch',
      id: tags['user-id'] || m[1],
      name: tags['display-name'] || m[1],
      text: m[2],
      supporter: badges.some(b => SUPPORTER.indexOf(b) !== -1),
      mod: badges.some(b => MODS.indexOf(b) !== -1)
    };
  }

  function connectTwitch(channel, onMessage, onStatus) {
    channel = String(channel || '').trim().replace(/^#/, '').toLowerCase();
    if (!channel) return { close() {} };
    let ws, closed = false, retry = 0;

    function open() {
      onStatus('twitch', 'connecting');
      ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
      ws.onopen = () => {
        ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
        ws.send('PASS SCHMOOPIIE');
        ws.send('NICK justinfan' + Math.floor(10000 + Math.random() * 89999));
        ws.send('JOIN #' + channel);
      };
      ws.onmessage = ev => {
        String(ev.data).split('\r\n').forEach(line => {
          if (!line) return;
          if (line.indexOf('PING') === 0) { ws.send('PONG :tmi.twitch.tv'); return; }
          if (line.indexOf(' 366 ') !== -1 || line.indexOf(' JOIN #') !== -1) { retry = 0; onStatus('twitch', 'ok'); }
          const msg = parseTwitchLine(line);
          if (msg) onMessage(msg);
        });
      };
      ws.onclose = () => {
        if (closed) return;
        onStatus('twitch', 'error');
        setTimeout(open, Math.min(30000, 2000 * (++retry)));
      };
      ws.onerror = () => { try { ws.close(); } catch (e) {} };
    }
    open();
    return { close() { closed = true; try { ws.close(); } catch (e) {} } };
  }

  const api = { connectTwitch, parseTwitchLine };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ChatTwitch = api;
})(typeof window !== 'undefined' ? window : globalThis);
