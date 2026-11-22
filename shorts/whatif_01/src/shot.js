// usage: node shot.js <html> <out.png> [w h]
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [html, out, w = 2400, h = 1500] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: +w, height: +h } });
  p.on('console', m => console.log('console:', m.text()));
  p.on('pageerror', e => console.log('pageerror:', e.message));
  await p.goto('file://' + path.resolve(html));
  await p.waitForFunction(() => document.title === 'done', null, { timeout: 20000 });
  await p.screenshot({ path: out });
  await b.close();
})();
