// Buzón de ideas: el formulario de la landing hace POST /api/idea y vuelve a /gracias/.
// Las ideas quedan en el almacén "ideas" (Netlify → Project → Blobs) o con: netlify blobs:list ideas
import { fromSite, store, ipKey, utcDay } from "../lib/common.mjs";

export const config = { path: "/api/idea" };

const SITE = "https://caja-antiaburrimiento.netlify.app";
const back = (path) => new Response(null, { status: 303, headers: { location: SITE + path, "cache-control": "no-store" } });

export default async (req, context) => {
  if (req.method !== "POST") return back("/#sugerencias");
  if (!fromSite(req)) return new Response("Origen no permitido", { status: 403 });
  let f;
  try { f = await req.formData(); } catch { return back("/#sugerencias"); }
  if ((f.get("sitio-web") || "").toString().trim()) return back("/gracias/");   // trampa para robots: se descarta en silencio
  const idea = (f.get("idea") || "").toString().trim().slice(0, 600);
  const apodo = (f.get("apodo") || "").toString().replace(/\s+/g, " ").trim().slice(0, 30);
  if (idea.length < 5) return back("/#sugerencias");

  // Como mucho una idea cada 30 segundos desde la misma conexión.
  const limits = store("limits"), ik = await ipKey(context.ip, "idea");
  const last = await limits.get(ik, { type: "json" });
  if (last && Date.now() - last.t < 30000) return back("/gracias/");
  await limits.setJSON(ik, { t: Date.now() });

  const now = new Date();
  await store("ideas").setJSON(`${utcDay()}/${now.toISOString().slice(11, 19).replace(/:/g, "")}-${Math.random().toString(36).slice(2, 6)}`, { idea, apodo, fecha: now.toISOString() });
  return back("/gracias/");
};
