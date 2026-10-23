// Hace que los juegos se puedan instalar como app y funcionen sin internet después de la primera visita.
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
}
