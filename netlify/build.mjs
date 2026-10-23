// Construye el espejo de Netlify en _site/ a partir de los mismos archivos que publica GitHub Pages.
// - En GitHub la web vive en /caja-antiaburrimiento/; aquí vive en la raíz.
// - La CSP de cada página (que en GitHub solo puede ir en <meta>) se manda también como cabecera,
//   junto con frame-ancestors y el resto de cabeceras de seguridad.
import { cpSync, rmSync, mkdirSync, readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const OUT = "_site";
const SKIP = new Set([OUT, "netlify", "node_modules", "netlify.toml", "package.json", "package-lock.json", ".git", ".gitignore", ".gitattributes", ".netlify"]);

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT);
for (const f of readdirSync(".")) if (!SKIP.has(f)) cpSync(f, join(OUT, f), { recursive: true });

const p404 = join(OUT, "404.html");
writeFileSync(p404, readFileSync(p404, "utf8").replaceAll("/caja-antiaburrimiento/", "/"));

const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));

let headers = `/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()
  Strict-Transport-Security: max-age=31536000
  Cross-Origin-Opener-Policy: same-origin
/jugar/sw.js
  Cache-Control: no-cache
  Service-Worker-Allowed: /jugar/
`;
for (const file of walk(OUT).filter((f) => f.endsWith(".html"))) {
  const m = readFileSync(file, "utf8").match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)">/);
  if (!m) continue;
  const rel = "/" + relative(OUT, file).split(sep).join("/");
  const routes = rel.endsWith("/index.html") ? [rel.slice(0, -"index.html".length), rel] : [rel];
  for (const r of routes) headers += `${r}\n  Content-Security-Policy: ${m[1]}; frame-ancestors 'none'\n`;
}
writeFileSync(join(OUT, "_headers"), headers);

writeFileSync(join(OUT, "_redirects"), `# Enlaces viejos con la carpeta de GitHub Pages
/caja-antiaburrimiento/*  /:splat  301!
# Enlaces cortos para compartir
/j/:juego  /jugar/?j=:juego  302
/reto      /jugar/?reto=1    302
/stats     /estadisticas/    302
`);
console.log("espejo listo en", OUT);
