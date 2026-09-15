/**
 * cloudflared quick tunnel (HTTP/2) + Expo LAN packager proxy.
 * Writes expo-qr.png for Expo Go: exps://<host>
 *
 * Note: on corporate networks that block Cloudflare edge / QUIC,
 * tunnel may fail with 530/1033 — use LAN or a phone hotspot instead.
 */
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';

const require = createRequire(import.meta.url);
const ROOT = process.cwd();
const RUNTIME = path.join(process.env.LOCALAPPDATA || tmpdir(), 'louma-expo-tunnel');
const QR_PNG = path.join(ROOT, 'expo-qr.png');
const QR_OUTBOX = path.join(
  process.env.USERPROFILE || '',
  'OneDrive - Siemens AG',
  'Bureau',
  'NourApp',
  'NourApp',
  'expo-qr.png'
);

mkdirSync(RUNTIME, { recursive: true });
process.env.METRO_CACHE_DIR = path.join(RUNTIME, 'metro-cache');
mkdirSync(process.env.METRO_CACHE_DIR, { recursive: true });

async function writeQr(url) {
  const QRCode = require('qrcode');
  await QRCode.toFile(QR_PNG, url, { width: 560, margin: 2 });
  try {
    await QRCode.toFile(QR_OUTBOX, url, { width: 560, margin: 2 });
  } catch {
    // optional
  }
  console.log(`\n[start-tunnel] ==============================`);
  console.log(`[start-tunnel] Scanne ce QR / colle dans Expo Go:`);
  console.log(`[start-tunnel] ${url}`);
  console.log(`[start-tunnel] ==============================\n`);
  console.log(await QRCode.toString(url, { type: 'terminal', small: true }));
}

function spawnLogged(command, args, opts = {}) {
  const child = spawn(command, args, {
    cwd: ROOT,
    shell: true,
    env: { ...process.env, ...(opts.env || {}) },
    stdio: ['inherit', 'pipe', 'pipe'],
  });
  child.stdout.on('data', (buf) => process.stdout.write(buf));
  child.stderr.on('data', (buf) => process.stderr.write(buf));
  return child;
}

/** Force HTTP/2 — QUIC/UDP 7844 is often blocked on corp Wi‑Fi. */
const tunnel = spawnLogged('npx', [
  '--yes',
  'cloudflared',
  'tunnel',
  '--url',
  'http://localhost:8081',
  '--protocol',
  'http2',
  '--no-autoupdate',
]);

let expoStarted = false;
function onTunnelData(buf) {
  const text = buf.toString();
  if (expoStarted) return;
  const m = text.match(/https:\/\/([a-z0-9-]+\.trycloudflare\.com)/i);
  if (!m) return;
  expoStarted = true;
  const host = m[1];
  const proxy = `https://${host}`;
  const exp = `exps://${host}`;

  const expo = spawnLogged(
    'npx',
    ['expo', 'start', '--lan', '--go', '--port', '8081'],
    {
      env: {
        METRO_CACHE_DIR: process.env.METRO_CACHE_DIR,
        EXPO_NO_TELEMETRY: '1',
        EXPO_PACKAGER_PROXY_URL: proxy,
      },
    }
  );

  writeQr(exp).catch(console.error);

  const shutdown = () => {
    expo.kill();
    tunnel.kill();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  expo.on('exit', (code) => {
    tunnel.kill();
    process.exit(code ?? 1);
  });
}

tunnel.stdout.on('data', onTunnelData);
tunnel.stderr.on('data', onTunnelData);
tunnel.on('exit', (code) => {
  if (!expoStarted) process.exit(code ?? 1);
});
