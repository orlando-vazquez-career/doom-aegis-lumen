// _verify.mjs — verificacion dirigida: setea estado via __DOOM y captura.
//   node tools/_verify.mjs out.png "<js setup>" [postWaitMs]
import { chromium } from 'playwright';
const out = process.argv[2] || '.shots/verify.png';
const setup = process.argv[3] || '';
const postWait = Number(process.argv[4] || 500);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(process.env.VPW || 960), height: Number(process.env.VPH || 600) } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + (e.stack || e.message)));
await page.goto(process.env.URL || 'http://localhost:8123', { waitUntil: 'load' });
await page.waitForTimeout(900);
if (setup) { const r = await page.evaluate(setup); if (r !== undefined) console.log('eval:', JSON.stringify(r)); }
await page.waitForTimeout(postWait);
await page.screenshot({ path: out });
await browser.close();
console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'OK no errors');
console.log('shot -> ' + out);
