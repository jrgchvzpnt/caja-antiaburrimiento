// Página de estadísticas: lee /api/stats (en GitHub Pages, desde el espejo de Netlify).
(function () {
  var API = /\.netlify\.app$/.test(location.hostname) ? '/api' : 'https://caja-antiaburrimiento.netlify.app/api';
  var $ = function (id) { return document.getElementById(id); };
  var fmt = function (n) { return Number(n || 0).toLocaleString('es-MX'); };
  var esc = function (t) { var d = document.createElement('span'); d.textContent = t; return d.innerHTML; };

  fetch(API + '/stats?days=30', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (data) {
    var days = data.days || [];
    var sum = { visit: 0, landing: 0, apk: 0, games: 0 }, per = {};
    days.forEach(function (d) {
      d.played = 0;
      Object.keys(d.games || {}).forEach(function (g) { per[g] = (per[g] || 0) + d.games[g]; d.played += d.games[g]; });
      sum.visit += d.visit || 0; sum.landing += d.landing || 0; sum.apk += d.apk || 0; sum.games += d.played;
    });
    $('tiles').innerHTML = [
      ['Visitas a la web', sum.landing, 'página de inicio'],
      ['Visitas a los juegos', sum.visit, 'sesiones en el navegador'],
      ['Partidas abiertas', sum.games, 'todos los juegos'],
      ['Descargas del APK', sum.apk, 'clics en descargar']
    ].map(function (t) { return '<div class="tile"><b>' + t[0] + '</b><span>' + fmt(t[1]) + '</span><small>' + t[2] + '</small></div>'; }).join('');

    var max = Math.max.apply(null, days.map(function (d) { return d.played; }).concat([1]));
    $('bars').innerHTML = days.map(function (d) { return '<i style="height:' + Math.round(d.played / max * 100) + '%" title="' + d.d + ': ' + d.played + ' partidas"></i>'; }).join('');
    $('axis').innerHTML = days.length ? '<span>' + days[0].d + '</span><span>' + days[days.length - 1].d + '</span>' : '<span>Todavía no hay datos</span>';

    var top = Object.keys(per).sort(function (a, b) { return per[b] - per[a]; }).slice(0, 12);
    $('top').innerHTML = top.length ? top.map(function (g) { return '<li>' + esc(g) + ' <span>· ' + fmt(per[g]) + '</span></li>'; }).join('') : '<li>Todavía no hay partidas</li>';

    $('tbl').innerHTML = '<tr><th>Día</th><th>Web</th><th>Juegos</th><th>Partidas</th><th>APK</th></tr>' +
      days.slice().reverse().map(function (d) { return '<tr><td>' + d.d + '</td><td>' + fmt(d.landing) + '</td><td>' + fmt(d.visit) + '</td><td>' + fmt(d.played) + '</td><td>' + fmt(d.apk) + '</td></tr>'; }).join('');
  }).catch(function () {
    $('tiles').innerHTML = '<div class="tile"><b>Sin conexión</b><small>No se pudieron leer las estadísticas. Prueba más tarde.</small></div>';
  });
})();
