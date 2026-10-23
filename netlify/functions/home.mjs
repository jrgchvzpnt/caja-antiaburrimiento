// Resumen en vivo para la landing y la página de juegos: GET /api/home
// Partidas de hoy y de la semana, descargas, juego del momento, récords recientes,
// reto de hoy (3 primeros) y campeón de los retos de la semana pasada.
import { json, preflight, store, cdn, utcDay, lastDays } from "../lib/common.mjs";
import { dailyFor } from "../lib/games.mjs";
import NAMES from "../lib/names.mjs";

export const config = { path: "/api/home" };

const name = (id) => NAMES[id] || id;

// Semana pasada: de lunes a domingo (UTC).
function lastWeek() {
  const now = new Date(), dow = (now.getUTCDay() + 6) % 7;   // 0 = lunes
  const sunday = new Date(now.getTime() - (dow + 1) * 864e5);
  return lastDays(7, sunday);
}

async function champion(records) {
  const days = lastWeek(), wins = {};
  await Promise.all(days.map(async (d) => {
    const ch = dailyFor(d), top = (await records.get(`day/${d}/${ch.g}/${ch.lv}`, { type: "json" })) || [];
    top.slice(0, 3).forEach((r, i) => {
      const w = (wins[r.n] ||= { n: r.n, wins: 0, podiums: 0 });
      if (i === 0) w.wins++;
      w.podiums++;
    });
  }));
  const best = Object.values(wins).sort((a, b) => b.wins - a.wins || b.podiums - a.podiums)[0];
  return best ? { ...best, from: days[0], to: days[6] } : null;
}

// El reto de hoy usa el día local del visitante (?d=AAAA-MM-DD), igual que la app.
const validDay = (d) => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d) && Math.abs(Date.now() - Date.parse(d + "T12:00:00Z")) < 40 * 3600e3;

export default async (req) => {
  if (req.method === "OPTIONS") return preflight(req);
  const qd = new URL(req.url).searchParams.get("d");
  if (req.method !== "GET") return json(req, { error: "metodo" }, 405);
  const stats = store("stats"), records = store("records");
  const week = lastDays(7), today = utcDay();
  const days = await Promise.all(week.map(async (d) => ({ d, ...((await stats.get(`d/${d}`, { type: "json" })) || {}) })));

  const games = {};
  let weekGames = 0, weekApk = 0, weekVisits = 0;
  for (const day of days) {
    for (const [g, n] of Object.entries(day.games || {})) { games[g] = (games[g] || 0) + n; weekGames += n; }
    weekApk += day.apk || 0;
    weekVisits += (day.visit || 0) + (day.landing || 0);
  }
  const t = days.find((x) => x.d === today) || {};
  const hotId = Object.keys(games).sort((a, b) => games[b] - games[a])[0];

  const feed = ((await records.get("feed", { type: "json" })) || []).slice(0, 6).map((r) => ({ ...r, name: name(r.g) }));
  const dday = validDay(qd) ? qd : today, ch = dailyFor(dday);
  const dtop = ((await records.get(`day/${dday}/${ch.g}/${ch.lv}`, { type: "json" })) || []).slice(0, 3).map(({ n, s }) => ({ n, s }));

  return json(req, {
    today: { games: Object.values(t.games || {}).reduce((a, b) => a + b, 0), visits: (t.visit || 0) + (t.landing || 0) },
    week: { games: weekGames, apk: weekApk, visits: weekVisits },
    hot: hotId ? { id: hotId, name: name(hotId), n: games[hotId] } : null,
    recent: feed,
    daily: { ...ch, name: name(ch.g), top: dtop },
    champ: await champion(records),
  }, 200, cdn(60));
};
