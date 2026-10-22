# Seguridad

## Versiones con soporte

Solo la última versión publicada en [Releases](https://github.com/jrgchvzpnt/caja-antiaburrimiento/releases/latest) recibe correcciones.

## Cómo avisar de un problema de seguridad

Si encuentras un fallo de seguridad en la web o en la app Android, **no abras un issue público**.

Usa el aviso privado de GitHub: pestaña **Security** → **Report a vulnerability**
(https://github.com/jrgchvzpnt/caja-antiaburrimiento/security/advisories/new).

Incluye, si puedes:

- qué versión usas (web, o la versión del APK),
- los pasos para reproducirlo,
- qué impacto crees que tiene.

Responderemos en cuanto sea posible y te avisaremos cuando esté corregido.

## Comprobar el APK

Descarga el APK solo desde la página de [Releases](https://github.com/jrgchvzpnt/caja-antiaburrimiento/releases) de este repositorio o desde el botón de la web oficial (https://jrgchvzpnt.github.io/caja-antiaburrimiento/). No instales copias que te lleguen por otros medios.

## Medidas de seguridad de la web

- **HTTPS obligatorio** y HSTS (los pone GitHub Pages).
- **Política de seguridad de contenido (CSP)** en cada página: solo se ejecuta el código del propio sitio. Los scripts en línea se autorizan por su huella SHA-256, así que un script inyectado no se ejecutaría. No se conecta a ningún servidor externo.
- **Sin terceros:** las fuentes se sirven desde este repositorio (`fonts/`, con su licencia OFL). La web no usa analítica, cookies ni formularios.
- **Sin referencia:** `no-referrer`, los sitios enlazados no saben desde qué página llegas.
- **Anti-marcos:** `js/guard.js` impide que otra web muestre esta página dentro de un marco para engañarte.
- **APK verificable:** la huella SHA-256 de cada versión está en la web y en las notas de la versión.
- **App sin internet:** la app Android no pide permiso de internet. Solo pide vibración.
