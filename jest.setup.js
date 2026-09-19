/**
 * Node < 22 n’expose pas WebSocket natif ; supabase-js / realtime-js en ont besoin
 * dès createClient(). On polyfill uniquement sous Jest.
 */
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const WS = require("ws");
  if (typeof globalThis.WebSocket === "undefined") {
    globalThis.WebSocket = WS;
  }
} catch {
  // ws optionnel hors CI / si non installé
}
