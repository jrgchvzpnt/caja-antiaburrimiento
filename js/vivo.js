// Landing: sección «En vivo» (partidas, juego del momento, récords recientes, reto de hoy,
// campeón de la semana) e «Ideas más pedidas» con votos. Los datos vienen del espejo de Netlify.
(function () {
  var API = location.protocol !== 'https:' ? null
    : /\.netlify\.app$/.test(location.hostname) ? '/api'
    : location.hostname === 'jrgchvzpnt.github.io' ? 'https://caja-antiaburrimiento.netlify.app/api' : null;
  if (!API) return;
  var LV = ['Novato', 'Medio', 'Experto'];
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var esc = function (t) { var d = document.createElement('span'); d.textContent = t; return d.innerHTML; };
  var fmt = function (n) { return Number(n || 0).toLocaleString('es-MX'); };
  var get = function (path) { return fetch(API + path, { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }); };
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function countUp(el) {
    var to = +el.dataset.to, t0 = performance.now();
    if (still || to < 2) { el.textContent = fmt(to); return; }
    (function step(t) { var k = Math.min(1, (t - t0) / 1100); el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(step); })(t0);
  }
  function ago(t) {
    var m = Math.round((Date.now() - t) / 60000);
    return m < 1 ? 'hace un momento' : m < 60 ? 'hace ' + m + ' min' : m < 1440 ? 'hace ' + Math.round(m / 60) + ' h' : 'hace ' + Math.round(m / 1440) + ' d';
  }

  var now = new Date(), day = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
  get('/home?d=' + day).then(function (h) {
    if (!h) return;
    var sec = $('#vivo');
    // Los contadores solo salen cuando ya hay movimiento, para que no se vean en cero.
    if (h.week.games >= 10) {
      $('[data-stats]', sec).innerHTML = [
        [h.today.games, 'partidas hoy'], [h.week.games, 'partidas esta semana'], [h.week.apk, 'descargas esta semana']
      ].map(function (x) { return '<div><b data-to="' + x[0] + '">0</b><span>' + x[1] + '</span></div>'; }).join('');
    }
    if (h.hot && h.hot.n >= 3) {
      var hot = $('[data-hot]', sec); hot.hidden = false;
      hot.innerHTML = '<b class="vk">🔥 Juego del momento</b><h3>' + esc(h.hot.name) + '</h3><p>' + fmt(h.hot.n) + ' partidas esta semana.</p><a class="btn primary" href="jugar/?j=' + encodeURIComponent(h.hot.id) + '">Jugar ahora</a>';
    }
    var d = h.daily, dc = $('[data-daily]', sec);
    dc.innerHTML = '<b class="vk">📅 Reto de hoy</b><h3>' + esc(d.name) + ' · ' + LV[d.lv] + '</h3>' +
      (d.top.length ? '<ol class="vtop">' + d.top.map(function (r) { return '<li><span>' + esc(r.n) + '</span><b>' + fmt(r.s) + '</b></li>'; }).join('') + '</ol>'
        : '<p>Nadie lo ha jugado todavía. ¡Sé el primero de la tabla!</p>') +
      '<a class="btn ghost" href="jugar/?reto=1">Entrar al reto</a>';
    if (h.recent.length) {
      var rc = $('[data-recent]', sec); rc.hidden = false;
      rc.innerHTML = '<b class="vk">🌎 Récords recientes</b><ul class="vfeed">' + h.recent.slice(0, 4).map(function (r) {
        return '<li><b>' + esc(r.n) + '</b> hizo <b>' + fmt(r.s) + '</b> en ' + esc(r.name) + ' <span>(' + LV[r.lv] + ' · ' + ago(r.t) + ')</span></li>';
      }).join('') + '</ul>';
    }
    if (h.champ) {
      var c = $('[data-champ]', sec); c.hidden = false;
      c.innerHTML = '🏆 Campeón de la semana pasada: <b>' + esc(h.champ.n) + '</b>, con ' + h.champ.wins + (h.champ.wins === 1 ? ' reto ganado' : ' retos ganados') + ' y ' + h.champ.podiums + ' podios.';
    }
    sec.hidden = false;
    sec.querySelectorAll('[data-to]').forEach(countUp);
  });

  // Ideas más pedidas
  var box = $('[data-board]');
  function voted() { try { return JSON.parse(localStorage.getItem('caja-votos') || '{}'); } catch (e) { return {}; } }
  function board(ideas) {
    if (!ideas || !ideas.length) return;
    var v = voted(), today = new Date().toDateString();
    box.hidden = false;
    $('ol', box).innerHTML = ideas.slice(0, 8).map(function (i) {
      var done = v[i.id] === today;
      return '<li><span>' + esc(i.text) + '</span><button type="button" data-vote="' + esc(i.id) + '"' + (done ? ' disabled' : '') + ' aria-label="Votar por esta idea">' + (done ? '✔' : '♥') + ' ' + fmt(i.votes) + '</button></li>';
    }).join('');
  }
  get('/board').then(function (r) { board(r && r.ideas); });
  box.addEventListener('click', function (e) {
    var b = e.target.closest('[data-vote]'); if (!b) return;
    b.disabled = true;
    fetch(API + '/board', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: b.dataset.vote }) })
      .then(function (r) { return r.json(); }).then(function (r) {
        var v = voted(); v[b.dataset.vote] = new Date().toDateString();
        try { localStorage.setItem('caja-votos', JSON.stringify(v)); } catch (e2) {}
        board(r.ideas);
      }).catch(function () { b.disabled = false; });
  });
})();
