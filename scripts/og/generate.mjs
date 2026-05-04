import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatePath = path.resolve(__dirname, 'template.html');
const publicDir = path.resolve(__dirname, '../../public');

const langs = [
  { code: 'pt', out: 'og-image-pt.png' },
  { code: 'en', out: 'og-image-en.png' },
];

const browser = await chromium.launch();
try {
  for (const { code, out } of langs) {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    const url = `file://${templatePath}?lang=${code}`;
    await page.goto(url, { waitUntil: 'networkidle' });
    // Give web fonts a tick to settle
    await page.waitForTimeout(500);
    const outPath = path.join(publicDir, out);
    await page.screenshot({ path: outPath, fullPage: false, type: 'png' });
    console.log(`✓ ${out}`);
    await page.close();
  }
} finally {
  await browser.close();
}
