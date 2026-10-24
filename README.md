# Caja Antiaburrimiento

Landing page y versión web de **Caja Antiaburrimiento**, una app para Android (teléfono y tablet) con 75 juegos animados para cuando estás aburrido. Cada uno muestra su objetivo y cómo se juega, y tiene tres niveles (Novato, Medio y Experto). Hay instrumentos musicales (piano, teclado, batería, xilófono, guitarra y sintetizador, con 16 canciones), una Arena contra rivales de la caja (célula glotona, serpiente de luz, torres, cartas, dados, minero estelar, dibujos y mini duelos), juegos retro de neón, de reflejos, de mente, de saber, para reír en grupo y para relajarse.

- Sitio: https://jrgchvzpnt.github.io/caja-antiaburrimiento/
- Jugar en el navegador: https://jrgchvzpnt.github.io/caja-antiaburrimiento/jugar/
- Descargar el APK: [última versión](https://github.com/jrgchvzpnt/caja-antiaburrimiento/releases/latest)

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Landing page |
| `jugar/index.html` | Los 75 juegos (se genera con `sync-web.sh` desde el proyecto principal) |
| `404.html` | Página de "no encontrada" |
| `favicon.*`, `icon-*.png`, `apple-touch-icon.png` | Iconos del navegador, móvil y app web |
| `site.webmanifest` | Permite "Añadir a pantalla de inicio" y abrir los juegos como app |
| `og-image.png` | Imagen que aparece al compartir el enlace en WhatsApp, redes, etc. |
| `fonts/` | Fuentes Bagel Fat One y Nunito servidas desde aquí (licencia OFL) |
| `js/guard.js` | Evita que otra web meta estas páginas en un marco |
| `SECURITY.md` | Cómo avisar de un fallo y medidas de seguridad |

GitHub Pages sirve los archivos directamente desde la rama `main`. Las páginas se generan con `tools/build_site.py` del proyecto principal, que añade la política de seguridad (CSP) con la huella de los scripts.
