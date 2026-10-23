// Récord mundial (10 mejores por juego y nivel) y tabla del reto del día.
//   GET  /api/scores?g=snake&lv=1[&d=2026-10-22]
//   POST /api/scores {g, lv, n, s[, d]}
import { json, preflight, fromSite, store, ipKey } from "../lib/common.mjs";
import { RANKED, MAX, DEFAULT_MAX, dailyFor } from "../lib/games.mjs";

export const config = { path: "/api/scores" };

const BAD = /(put[oa]|pendej|verga|ching|mierd|cabr[oó]n|culer|joto|maric|nazi|hitler|fuck|shit|bitch)/i;

function cleanName(n) {
  if (typeof n !== "string") return null;
  n = n.normalize("NFC").replace(/[^\p{L}\p{N} ._-]/gu, "").replace(/\s+/g, " ").trim().slice(0, 14);
  return n.length >= 2 && !BAD.test(n) ? n : null;
}

// La fecha la manda el teléfono (su día local); se acepta si está a menos de 40 h de ahora.
const validDay = (d) => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d) && Math.abs(Date.now() - Date.parse(d + "T12:00:00Z")) < 40 * 3600e3;

const pub = (top) => top.map(({ n, s }) => ({ n, s }));

export default async (req, context) => {
  if (req.method === "OPTIONS") return preflight(req);
  const records = store("records");

  if (req.method === "GET") {
    const q = new URL(req.url).searchParams;
    const g = q.get("g"), lv = Number(q.get("lv")), d = q.get("d");
    if (!RANKED.has(g) || ![0, 1, 2].includes(lv)) return json(req, { error: "juego" }, 400);
    if (d && !validDay(d)) return json(req, { error: "dia" }, 400);
    const top = (await records.get(d ? `day/${d}/${g}/${lv}` : `top/${g}/${lv}`, { type: "json" })) || [];
    return json(req, { top: pub(top) });
  }

  if (req.method !== "POST") return json(req, { error: "metodo" }, 405);
  if (!fromSite(req)) return json(req, { error: "origen" }, 403);
  let b;
  try { b = await req.json(); } catch { return json(req, { error: "json" }, 400); }
  const { g, lv, s, d } = b || {};
  const n = cleanName(b && b.n);
  if (!RANKED.has(g) || ![0, 1, 2].includes(lv) || !n || !Number.isInteger(s) || s < 1 || s > (MAX[g] ?? DEFAULT_MAX))
    return json(req, { error: "datos" }, 400);
  let key = `top/${g}/${lv}`;
  if (d !== undefined) {
    const ch = validDay(d) && dailyFor(d);
    if (!ch || ch.g !== g || ch.lv !== lv) return json(req, { error: "reto" }, 400);
    key = `day/${d}/${g}/${lv}`;
  }

  // Como mucho un envío cada 3 segundos a la misma tabla desde la misma conexión.
  const limits = store("limits"), ik = await ipKey(context.ip, key);
  const last = await limits.get(ik, { type: "json" });
  if (last && Date.now() - last.t < 3000) return json(req, { error: "espera" }, 429);
  await limits.setJSON(ik, { t: Date.now() });

  const top = (await records.get(key, { type: "json" })) || [];
  const mine = top.findIndex((r) => r.n === n);
  if (mine >= 0) {
    if (top[mine].s >= s) return json(req, { top: pub(top), rank: 0 });
    top.splice(mine, 1);
  }
  top.push({ n, s, t: Date.now() });
  top.sort((a, b2) => b2.s - a.s || a.t - b2.t);
  const out = top.slice(0, 10);
  await records.setJSON(key, out);
  return json(req, { top: pub(out), rank: out.findIndex((r) => r.n === n) + 1 });
};
