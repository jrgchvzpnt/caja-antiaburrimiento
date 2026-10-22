// Impide que otra web muestre esta página dentro de un marco (clickjacking).
// GitHub Pages no deja enviar la cabecera X-Frame-Options, así que se hace desde el navegador.
(function () {
  if (window.top === window.self) return;
  try {
    window.top.location.replace(window.self.location.href);
  } catch (e) {
    // Si el marco no deja salir, se oculta la página para que no se pueda usar con engaños.
    document.documentElement.style.display = 'none';
  }
})();
