// Enlace corto /apk: cuenta la descarga y manda al APK de la última versión en GitHub.
import { count } from "../lib/common.mjs";

export const config = { path: "/apk" };

const APK = "https://github.com/jrgchvzpnt/caja-antiaburrimiento/releases/latest/download/CajaAntiaburrimiento.apk";

export default async () => {
  try { await count("apk"); } catch {}
  return new Response(null, { status: 302, headers: { location: APK, "cache-control": "no-store" } });
};
