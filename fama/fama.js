// Salón de la fama: lee /api/fame (en GitHub Pages, desde el espejo de Netlify).
(function () {
  var API = /\.netlify\.app$/.test(location.hostname) ? '/api' : 'https://caja-antiaburrimiento.netlify.app/api';
  var LV = ['Novato', 'Medio', 'Experto'], games = [], filter = 'todos';
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (t) { var d = document.createElement('span'); d.textContent = t; return d.innerHTML; };
  var fmt = function (n) { return Number(n || 0).toLocaleString('es-MX'); };

  function render() {
    var shown = games.filter(function (g) { var has = g.lv.some(Boolean); return filter === 'todos' || (filter === 'con' ? has : !has); });
    $('list').innerHTML = shown.length ? shown.map(function (g) {
      return '<article class="game"><h2>' + esc(g.name) + ' <a href="../jugar/?j=' + encodeURIComponent(g.id) + '">Jugar</a></h2><ol>' +
        g.lv.map(function (r, i) {
          return r ? '<li><i class="l' + i + '">' + LV[i] + '</i><span>' + esc(r.n) + '</span><b>' + fmt(r.s) + '</b></li>'
            : '<li class="empty"><i class="l' + i + '">' + LV[i] + '</i><span>Libre: ¡pon el primero!</span><b></b></li>';
        }).join('') + '</ol></article>';
    }).join('') : '<p>No hay juegos en esta lista.</p>';
  }

  $('filters').addEventListener('click', function (e) {
    var b = e.target.closest('[data-f]'); if (!b) return;
    filter = b.dataset.f;
    [].forEach.call($('filters').children, function (x) { x.setAttribute('aria-pressed', x === b); });
    render();
  });

  fetch(API + '/fame', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (d) {
    games = d.games || [];
    var spots = 0, people = {};
    games.forEach(function (g) { g.lv.forEach(function (r) { if (r) { spots++; people[r.n] = (people[r.n] || 0) + 1; } }); });
    var king = Object.keys(people).sort(function (a, b) { return people[b] - people[a]; })[0];
    $('podium').innerHTML = '<div><b>Récords puestos</b><span>' + spots + '</span></div><div><b>Por conquistar</b><span>' + (games.length * 3 - spots) + '</span></div>' +
      '<div><b>Rey de la caja</b><span>' + (king ? esc(king) : '—') + '</span></div>';
    render();
  }).catch(function () { $('list').innerHTML = '<p>No se pudo conectar con los récords. Prueba más tarde.</p>'; });
})();
