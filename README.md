# Caja Antiaburrimiento

Landing page y versión web de **Caja Antiaburrimiento**, una app para Android con 13 juguetes animados para cuando estás aburrido: pop-it, pintar con fuegos artificiales, atrapa pompas, retos reales, la bola que decide, Simón dice, parejas, reflejos, piano de colores, golpea al topo, serpiente, tres en raya y salva los globos.

- Sitio: https://jrgchvzpnt.github.io/caja-antiaburrimiento/
- Jugar en el navegador: https://jrgchvzpnt.github.io/caja-antiaburrimiento/jugar/
- Descargar el APK: [última versión](https://github.com/jrgchvzpnt/caja-antiaburrimiento/releases/latest)

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Landing page |
| `jugar/index.html` | Los 13 juegos (se genera con `sync-web.sh` desde el proyecto principal) |
| `404.html` | Página de "no encontrada" |
| `favicon.*`, `icon-*.png`, `apple-touch-icon.png` | Iconos del navegador, móvil y app web |
| `site.webmanifest` | Permite "Añadir a pantalla de inicio" y abrir los juegos como app |
| `og-image.png` | Imagen que aparece al compartir el enlace en WhatsApp, redes, etc. |

GitHub Pages sirve los archivos directamente desde la rama `main`; no hay paso de compilación.
