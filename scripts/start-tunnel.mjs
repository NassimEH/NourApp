/**
 * Official `expo start --tunnel` + Cloudflare HTTP/2 (like other working apps).
 * Writes expo-qr.png for Expo Go: exp://<host>:443
 */
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
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

const child = spawn('npx', ['expo', 'start', '--tunnel', '--port', '8081'], {
  cwd: ROOT,
  shell: true,
  env: {
    ...process.env,
    METRO_CACHE_DIR: process.env.METRO_CACHE_DIR,
    EXPO_NO_TELEMETRY: '1',
  },
  stdio: ['inherit', 'pipe', 'pipe'],
});

let qrDone = false;
function onData(buf) {
  const text = buf.toString();
  process.stdout.write(text);
  if (qrDone) return;
  const m = text.match(/https:\/\/([a-z0-9-]+\.trycloudflare\.com)/i);
  if (m) {
    qrDone = true;
    const exp = `exp://${m[1]}:443`;
    writeQr(exp).catch(console.error);
  }
}

child.stdout.on('data', onData);
child.stderr.on('data', onData);
child.on('exit', (code) => process.exit(code ?? 1));
process.on('SIGINT', () => {
  child.kill();
  process.exit(0);
});
