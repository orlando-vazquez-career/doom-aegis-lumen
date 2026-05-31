// screenshot.mjs — harness Playwright para el Visual Critique Loop de LUMEN.
// Carga el juego, opcionalmente envia inputs, captura PNG y reporta errores de consola.
//   node tools/screenshot.mjs [out.png] [waitMs] [keysCSV]
// keysCSV: secuencia "KeyW:600,Space:1,KeyD:400" (code:duracionMs).
import { chromium } from 'playwright';

const out = process.argv[2] || '.shots/shot.png';
const waitMs = Number(process.argv[3] || 1400);
const keys = (process.argv[4] || '').split(',').filter(Boolean);
const url = process.env.URL || 'http://localhost:8123';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 960, height: 600 }, deviceScaleFactor: 1 });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + (e.stack || e.message)));

await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(700); // dejar correr el loop / generar texturas

// inputs opcionales
for (const k of keys) {
  const [code, ms] = k.split(':');
  await page.keyboard.down(code);
  await page.waitForTimeout(Number(ms) || 200);
  await page.keyboard.up(code);
}
await page.waitForTimeout(waitMs);
await page.screenshot({ path: out });
await browser.close();

console.log(errors.length ? 'CONSOLE ERRORS:\n' + errors.join('\n') : 'OK: no console errors');
console.log('shot -> ' + out);
