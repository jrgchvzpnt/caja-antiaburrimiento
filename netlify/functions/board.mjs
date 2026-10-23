// Ideas más pedidas: las que el dueño publica (bash publicar-idea.sh "texto") y la gente vota.
//   GET  /api/board          → ideas ordenadas por votos
//   POST /api/board {id}     → un voto por idea y por día desde la misma conexión
import { json, preflight, fromSite, store, ipKey } from "../lib/common.mjs";

export const config = { path: "/api/board" };

async function list(board) {
  const { blobs } = await board.list({ prefix: "i/" });
  const ideas = await Promise.all(blobs.map(async ({ key }) => ({ id: key.slice(2), ...((await board.get(key, { type: "json" })) || {}) })));
  return ideas.filter((i) => i.text).sort((a, b) => b.votes - a.votes || a.t - b.t).map(({ id, text, votes }) => ({ id, text, votes }));
}

export default async (req, context) => {
  if (req.method === "OPTIONS") return preflight(req);
  const board = store("board");
  if (req.method === "GET") return json(req, { ideas: await list(board) });
  if (req.method !== "POST") return json(req, { error: "metodo" }, 405);
  if (!fromSite(req)) return json(req, { error: "origen" }, 403);
  let b;
  try { b = await req.json(); } catch { return json(req, { error: "json" }, 400); }
  const id = b && b.id;
  if (!/^[a-z0-9-]{1,40}$/.test(id || "")) return json(req, { error: "datos" }, 400);
  const idea = await board.get(`i/${id}`, { type: "json" });
  if (!idea) return json(req, { error: "idea" }, 404);

  const limits = store("limits"), ik = await ipKey(context.ip, "vote/" + id);
  if (await limits.get(ik)) return json(req, { error: "ya", ideas: await list(board) }, 429);
  await limits.set(ik, "1");
  idea.votes = (idea.votes || 0) + 1;
  await board.setJSON(`i/${id}`, idea);
  return json(req, { ideas: await list(board) });
};
