// Contador anónimo: POST /api/hit {e: "visit" | "landing" | "apk" | "game", id?}
// No guarda IP, cookies ni nada que identifique a nadie: solo sumas por día.
import { json, preflight, fromSite, count } from "../lib/common.mjs";

export const config = { path: "/api/hit" };

const EVENTS = new Set(["visit", "landing", "apk", "game"]);

export default async (req) => {
  if (req.method === "OPTIONS") return preflight(req);
  if (req.method !== "POST") return json(req, { error: "metodo" }, 405);
  if (!fromSite(req)) return json(req, { error: "origen" }, 403);
  let b;
  try { b = await req.json(); } catch { return json(req, { error: "json" }, 400); }
  const e = b && b.e, id = b && b.id;
  if (!EVENTS.has(e) || (e === "game" && !/^[a-z0-9]{2,12}$/.test(id || ""))) return json(req, { error: "datos" }, 400);
  await count(e, id);
  return json(req, { ok: true });
};
