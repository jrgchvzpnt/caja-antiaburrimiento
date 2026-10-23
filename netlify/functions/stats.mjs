// Estadísticas públicas (solo totales por día): GET /api/stats?days=30
import { json, preflight, store } from "../lib/common.mjs";

export const config = { path: "/api/stats" };

export default async (req) => {
  if (req.method === "OPTIONS") return preflight(req);
  if (req.method !== "GET") return json(req, { error: "metodo" }, 405);
  const days = Math.max(1, Math.min(90, Number(new URL(req.url).searchParams.get("days")) || 30));
  const s = store("stats");
  const { blobs } = await s.list({ prefix: "d/" });
  const keys = blobs.map((b) => b.key).sort().slice(-days);
  const out = await Promise.all(keys.map(async (k) => ({ d: k.slice(2), ...((await s.get(k, { type: "json" })) || {}) })));
  return json(req, { days: out }, 200, { "cache-control": "public, max-age=60" });
};
