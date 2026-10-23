// Juegos con récord mundial y reto del día. Las mismas listas están en la app (módulo Online de index.html).

// Juegos donde más puntos es mejor.
export const RANKED = new Set(["bird", "brick", "catchf", "garden", "juggle", "pong", "rhythm", "slice", "target", "blocks", "cell", "dodge", "duels", "frog", "invaders", "lsnake", "miner", "plat", "race", "towers", "capitals", "riddles", "seq", "tf",
  "stack", "simon", "mole", "snake", "g2048", "odd", "math", "stroop", "tapfast", "numem", "anagram", "bj", "mime", "drawq", "dice5", "drums", "xylo", "guitar", "synth"]);

// Topes para descartar puntajes imposibles (los que no están usan DEFAULT_MAX).
export const MAX = { g2048: 4000000, tapfast: 600, simon: 300, numem: 60, odd: 400, capitals: 50, riddles: 50, seq: 50, tf: 50 };
export const DEFAULT_MAX = 1000000;

const DAILY = ["bird", "brick", "catchf", "juggle", "pong", "slice", "target", "rhythm", "blocks", "dodge", "frog", "invaders", "lsnake", "plat", "race", "cell", "capitals", "riddles", "seq", "tf"];

// Mismo cálculo que en la app: el juego y el nivel del reto salen de la fecha.
export function dailyFor(d) {
  let h = 2166136261;
  for (const c of d) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
  return { g: DAILY[h % DAILY.length], lv: (h >>> 8) % 3 };
}
