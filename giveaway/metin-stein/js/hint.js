/* Dezenter Hinweis auf den Origins2 Helper (OBS-Overlay).
   Erscheint nach einer Weile kurz in einer Ecke, blendet aus, kommt später wieder.
   URL-Optionen: pos=br|bl|tr|tl  delay=15  every=300  show=9  lang=de|en  test=1
                 lines=Eins|Zwei|Drei  tag=Text  url=adresse.de  bg=1               */
(function () {
  const q = new URLSearchParams(location.search);
  const num = (k, d) => (q.has(k) && !isNaN(+q.get(k)) ? +q.get(k) : d);
  const lang = q.get('lang') === 'de' ? 'de' : 'en';
  const test = q.get('test') === '1';

  const TXT = {
    de: { tag: 'Bald verfügbar', lines: ['Upp-Kostenrechner', 'Event-Kalender', 'Boss- & Event-Timer'] },
    en: { tag: 'Coming soon', lines: ['Upgrade cost calculator', 'Event calendar', 'Boss & event timer'] }
  }[lang];

  const tag = q.get('tag') || TXT.tag;
  const lines = q.get('lines') ? q.get('lines').split('|').filter(Boolean) : TXT.lines;
  const url = (q.get('url') || '').replace(/^https?:\/\//, '');
  const pos = ['br', 'bl', 'tr', 'tl'].indexOf(q.get('pos')) !== -1 ? q.get('pos') : 'br';
  const delay = num('delay', test ? 1 : 15) * 1000;
  const every = num('every', test ? 12 : 300) * 1000;
  const show = num('show', 9) * 1000;

  if (q.get('bg') === '1' || test) document.body.classList.add('bg');
  const el = document.getElementById('hint');
  el.classList.add('pos-' + pos);
  document.getElementById('by').textContent = 'by Society';

  let i = 0;
  function run() {
    const feat = lines[i++ % lines.length];
    document.getElementById('line').innerHTML = '<b>' + tag + '</b> · ' + feat.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])) +
      (url ? '<div style="margin-top:4px;font-size:11px;color:#9a9484;letter-spacing:.06em">' + url.replace(/[&<>]/g, '') + '</div>' : '');
    el.classList.remove('hidden');
    void el.offsetWidth;
    el.classList.add('show');
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.classList.add('hidden'), 900);
    }, show);
  }
  setTimeout(function loop() { run(); setTimeout(loop, every); }, delay);
})();
