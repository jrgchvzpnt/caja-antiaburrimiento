// Utilidades compartidas por las funciones de Netlify (récords, contador y estadísticas).
import { getStore } from "@netlify/blobs";

const SITE = "https://caja-antiaburrimiento.netlify.app";
const GITHUB = "https://jrgchvzpnt.github.io";

// Solo la propia web, sus vistas previas y la copia de GitHub Pages pueden llamar a la API.
export function allowed(origin) {
  return origin === SITE || origin === GITHUB || /^https:\/\/[a-z0-9-]+--caja-antiaburrimiento\.netlify\.app$/.test(origin || "");
}

export function cors(req) {
  const o = req.headers.get("origin");
  if (!allowed(o)) return {};
  return {
    "access-control-allow-origin": o,
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
    vary: "Origin",
  };
}

export function json(req, data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...cors(req), ...extra },
  });
}

export const preflight = (req) => new Response(null, { status: 204, headers: cors(req) });

// Un POST de otra web (o sin cabecera Origin, como un script) se rechaza.
export const fromSite = (req) => allowed(req.headers.get("origin"));

export const store = (name) => getStore({ name, consistency: "strong" });

export const utcDay = () => new Date().toISOString().slice(0, 10);

// La IP nunca se guarda: solo una huella que cambia cada día, para limitar envíos seguidos.
export async function ipKey(ip, kind) {
  const data = new TextEncoder().encode(`${utcDay()}|${kind}|${ip || "?"}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return `${utcDay()}/${[...new Uint8Array(hash)].slice(0, 12).map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}

// Suma uno a un contador del día (visitas, descargas del APK o partidas de un juego).
export async function count(event, id) {
  const s = store("stats");
  const key = `d/${utcDay()}`;
  const day = (await s.get(key, { type: "json" })) || { visit: 0, landing: 0, apk: 0, games: {} };
  if (event === "game") day.games[id] = (day.games[id] || 0) + 1;
  else day[event] = (day[event] || 0) + 1;
  await s.setJSON(key, day);
}
