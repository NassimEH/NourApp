/**
 * Capture les aperçus onboarding depuis Expo Web.
 *
 * Prérequis :
 *   npx expo start --web
 * Puis :
 *   node scripts/capture-onboarding-web.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "assets", "images", "onboarding");
const baseUrl = process.env.EXPO_WEB_URL ?? "http://localhost:8081";

const slides = ["slide1", "slide2", "slide3", "slide4"];

async function main() {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    console.error(
      "Playwright manquant. Installez-le : npm i -D playwright && npx playwright install chromium"
    );
    process.exit(1);
  }

  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 420, height: 900 },
  });

  const url = `${baseUrl}/onboarding-capture`;
  console.log(`Ouverture ${url}…`);
  await page.goto(url, { waitUntil: "networkidle", timeout: 120_000 });
  await page.waitForTimeout(2000);

  for (const slide of slides) {
    const selector = `#onboarding-${slide}`;
    const el = page.locator(selector);
    await el.waitFor({ state: "visible", timeout: 30_000 });
    const filePath = path.join(outDir, `${slide}.png`);
    await el.screenshot({ path: filePath });
    console.log(`✓ ${filePath}`);
  }

  await browser.close();
  console.log("\nMettez à jour constants/onboarding-slides.ts avec les require() PNG.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
