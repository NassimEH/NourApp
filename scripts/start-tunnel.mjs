/**
 * Reliable Expo Go tunnel on Windows corp networks:
 * - cloudflared quick tunnel forced to HTTP/2 (QUIC often blocked)
 * - Expo with EXPO_PACKAGER_PROXY_URL=https://...
 * - Expo Go URL uses exps:// (HTTPS), never exp://...:443
 * - Wait for local Metro first; QR after edge is registered
 * - Retry cloudflared a few times (corp networks often drop first connect)
 */
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import http from 'node:http';

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
const MAX_TUNNEL_ATTEMPTS = 5;

mkdirSync(RUNTIME, { recursive: true });
process.env.METRO_CACHE_DIR = path.join(RUNTIME, 'metro-cache');
mkdirSync(process.env.METRO_CACHE_DIR, { recursive: true });
process.env.TUNNEL_EDGE_IP_VERSION = process.env.TUNNEL_EDGE_IP_VERSION || '4';
process.env.TUNNEL_RETRIES = process.env.TUNNEL_RETRIES || '15';

async function writeQr(url) {
  const QRCode = require('qrcode');
  await QRCode.toFile(QR_PNG, url, { width: 720, margin: 2 });
  try {
    await QRCode.toFile(QR_OUTBOX, url, { width: 720, margin: 2 });
  } catch {
    // optional
  }
  console.log(`\n[start-tunnel] ==============================`);
  console.log(`[start-tunnel] Scanne ce QR / colle dans Expo Go:`);
  console.log(`[start-tunnel] ${url}`);
  console.log(`[start-tunnel] ==============================\n`);
  console.log(await QRCode.toString(url, { type: 'terminal', small: true }));
}

function spawnLogged(command, args, env = {}) {
  const child = spawn(command, args, {
    cwd: ROOT,
    shell: true,
    env: { ...process.env, ...env },
    stdio: ['inherit', 'pipe', 'pipe'],
  });
  child.stdout.on('data', (buf) => process.stdout.write(buf));
  child.stderr.on('data', (buf) => process.stderr.write(buf));
  return child;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function httpGetLocal(pathname) {
  return new Promise((resolve) => {
    const req = http.get(
      { host: '127.0.0.1', port: 8081, path: pathname, timeout: 2000 },
      (res) => {
        res.resume();
        resolve(res.statusCode || 0);
      }
    );
    req.on('error', () => resolve(0));
    req.on('timeout', () => {
      req.destroy();
      resolve(0);
    });
  });
}

async function waitForLocalMetro(attempts = 60) {
  for (let i = 0; i < attempts; i++) {
    const code = await httpGetLocal('/status');
    if (code === 200) return true;
    console.log(`[start-tunnel] Metro local pas prêt (${code || 'down'}), retry ${i + 1}/${attempts}...`);
    await sleep(2000);
  }
  return false;
}

function curlHead(url) {
  const r = spawnSync('curl.exe', ['-sI', '--max-time', '15', url], { encoding: 'utf8' });
  const out = `${r.stdout || ''}\n${r.stderr || ''}`;
  const m = out.match(/HTTP\/\d(?:\.\d)?\s+(\d+)/);
  return m ? Number(m[1]) : 0;
}

async function waitForTunnelHttps(url, attempts = 30) {
  for (let i = 0; i < attempts; i++) {
    const code = curlHead(url);
    if (code > 0 && code < 500) return code;
    console.log(`[start-tunnel] Probe HTTPS tunnel HTTP ${code || 'fail'}, retry ${i + 1}/${attempts}...`);
    await sleep(2000);
  }
  return 0;
}

let tunnel = null;
let host = null;
let started = false;
let buffer = '';
let attempt = 0;

async function bootExpo(tunnelHost) {
  if (started) return;
  started = true;
  const proxy = `https://${tunnelHost}`;
  const expUrl = `exps://${tunnelHost}`;

  console.log(`[start-tunnel] Edge registered. Starting Expo with ${proxy}`);

  const expo = spawnLogged(
    'npx',
    ['expo', 'start', '--lan', '--go', '--port', '8081'],
    {
      METRO_CACHE_DIR: process.env.METRO_CACHE_DIR,
      EXPO_NO_TELEMETRY: '1',
      EXPO_PACKAGER_PROXY_URL: proxy,
    }
  );

  const metroOk = await waitForLocalMetro();
  if (!metroOk) {
    console.error('[start-tunnel] Metro local n’a pas démarré.');
    expo.kill();
    tunnel?.kill();
    process.exit(1);
  }
  console.log('[start-tunnel] Metro local OK.');

  const httpsCode = await waitForTunnelHttps(`${proxy}/status`);
  if (httpsCode) {
    console.log(`[start-tunnel] Tunnel HTTPS OK (HTTP ${httpsCode}).`);
  } else {
    console.log(
      '[start-tunnel] Probe PC→tunnel échouée (proxy corp possible). Edge est registered — on sort le QR quand même.'
    );
  }

  await writeQr(expUrl);

  const shutdown = () => {
    expo.kill();
    tunnel?.kill();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  expo.on('exit', (code) => {
    tunnel?.kill();
    process.exit(code ?? 1);
  });
}

function onTunnelData(buf) {
  const text = buf.toString();
  buffer += text;

  if (!host) {
    const m = buffer.match(/https:\/\/([a-z0-9-]+\.trycloudflare\.com)/i);
    if (m) host = m[1];
  }

  const edgeReady =
    /Registered tunnel connection/i.test(buffer) || /Connection registered/i.test(buffer);

  if (host && edgeReady) {
    bootExpo(host).catch((e) => {
      console.error(e);
      process.exit(1);
    });
  }
}

function startTunnel() {
  attempt += 1;
  host = null;
  buffer = '';
  console.log(`[start-tunnel] cloudflared attempt ${attempt}/${MAX_TUNNEL_ATTEMPTS}...`);

  tunnel = spawnLogged('npx', [
    '--yes',
    'cloudflared',
    'tunnel',
    '--url',
    'http://127.0.0.1:8081',
    '--protocol',
    'http2',
    '--no-autoupdate',
  ]);

  tunnel.stdout.on('data', onTunnelData);
  tunnel.stderr.on('data', onTunnelData);

  tunnel.on('exit', (code) => {
    if (started) return;
    console.error(`[start-tunnel] cloudflared exited before Expo started (code ${code ?? '?'}).`);
    if (attempt < MAX_TUNNEL_ATTEMPTS) {
      console.log('[start-tunnel] Retry in 3s...');
      setTimeout(startTunnel, 3000);
      return;
    }
    process.exit(code ?? 1);
  });
}

startTunnel();
