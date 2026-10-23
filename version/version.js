// La app Android abre esta página con ?v=<su versión> (botón «Buscar versión nueva» en Ajustes)
// y aquí se compara con la última publicada en ../version.json.
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var mine = (new URLSearchParams(location.search).get('v') || '').replace(/[^0-9.]/g, '');
  var newer = function (a, b) {   // ¿a es más nueva que b?
    a = a.split('.').map(Number); b = b.split('.').map(Number);
    for (var i = 0; i < Math.max(a.length, b.length); i++) { if ((a[i] || 0) !== (b[i] || 0)) return (a[i] || 0) > (b[i] || 0); }
    return false;
  };
  var esc = function (t) { var d = document.createElement('span'); d.textContent = t; return d.innerHTML; };
  // En GitHub Pages el enlace corto /apk no existe: se baja directo de GitHub.
  if (!/\.netlify\.app$/.test(location.hostname)) $('get').href = 'https://github.com/jrgchvzpnt/caja-antiaburrimiento/releases/latest/download/CajaAntiaburrimiento.apk';

  fetch('../version.json', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (v) {
    $('notes').hidden = false;
    $('notes').innerHTML = '<b>Novedades de la versión ' + esc(v.version) + '</b><ul>' + v.notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>';
    if (!mine) {
      $('title').textContent = 'La última versión es la ' + v.version;
      $('msg').textContent = 'Descárgala e instálala encima de la que tienes: no pierdes tus récords.';
      $('get').hidden = false; $('get').textContent = 'Descargar la app';
    } else if (newer(v.version, mine)) {
      $('icon').textContent = '🎁';
      $('title').textContent = '¡Hay versión nueva!';
      $('msg').textContent = 'Tienes la ' + mine + ' y ya salió la ' + v.version + '. Descárgala e instálala encima: tus récords se quedan.';
      $('get').hidden = false;
    } else {
      $('icon').textContent = '✅';
      $('title').textContent = 'Ya tienes la última versión';
      $('msg').textContent = 'Tu app (' + mine + ') está al día. Vuelve a mirar de vez en cuando.';
    }
  }).catch(function () {
    $('title').textContent = 'No se pudo comprobar';
    $('msg').textContent = 'Revisa tu conexión e inténtalo otra vez.';
  });
})();
