# Caja Antiaburrimiento

Landing page y versión web de **Caja Antiaburrimiento**, una app para Android con 21 juguetes animados para cuando estás aburrido. Cada uno muestra su objetivo y cómo se juega, y tiene tres niveles (Novato, Medio y Experto): pop-it, pintar con fuegos, torre de bloques, reto real, la bola que decide, Simón dice, parejas, reflejos de rayo, piano de colores, golpea al topo, serpiente, tres en raya, salva los globos, vuelo del pájaro, rompe ladrillos, 2048, ojo de lince, cálculo veloz, piedra papel o tijera, colores locos y esquiva meteoritos.

- Sitio: https://jrgchvzpnt.github.io/caja-antiaburrimiento/
- Jugar en el navegador: https://jrgchvzpnt.github.io/caja-antiaburrimiento/jugar/
- Descargar el APK: [última versión](https://github.com/jrgchvzpnt/caja-antiaburrimiento/releases/latest)

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Landing page |
| `jugar/index.html` | Los 21 juegos (se genera con `sync-web.sh` desde el proyecto principal) |
| `404.html` | Página de "no encontrada" |
| `favicon.*`, `icon-*.png`, `apple-touch-icon.png` | Iconos del navegador, móvil y app web |
| `site.webmanifest` | Permite "Añadir a pantalla de inicio" y abrir los juegos como app |
| `og-image.png` | Imagen que aparece al compartir el enlace en WhatsApp, redes, etc. |

GitHub Pages sirve los archivos directamente desde la rama `main`; no hay paso de compilación.
