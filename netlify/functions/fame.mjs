// Salón de la fama: el primer puesto de cada juego y nivel. GET /api/fame
import { json, preflight, store, cdn } from "../lib/common.mjs";
import { RANKED } from "../lib/games.mjs";
import NAMES from "../lib/names.mjs";

export const config = { path: "/api/fame" };

export default async (req) => {
  if (req.method === "OPTIONS") return preflight(req);
  if (req.method !== "GET") return json(req, { error: "metodo" }, 405);
  const records = store("records");
  const { blobs } = await records.list({ prefix: "top/" });
  const best = {};
  await Promise.all(blobs.map(async ({ key }) => {
    const [, g, lv] = key.split("/"), top = (await records.get(key, { type: "json" })) || [];
    if (RANKED.has(g) && top[0]) (best[g] ||= [null, null, null])[+lv] = { n: top[0].n, s: top[0].s };
  }));
  const games = [...RANKED].map((id) => ({ id, name: NAMES[id] || id, lv: best[id] || [null, null, null] }))
    .sort((a, b) => b.lv.filter(Boolean).length - a.lv.filter(Boolean).length || a.name.localeCompare(b.name, "es"));
  return json(req, { games }, 200, cdn(120));
};
