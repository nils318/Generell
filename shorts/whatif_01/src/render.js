// Frame renderer: node render.js <timeline.json> <outDir> [--frames a-b | --at t1,t2,...] [--workers N]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const args = process.argv.slice(2);
const [tlPath, outDir] = args;
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const ROOT = path.join(__dirname, 'render');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.ttf': 'font/ttf' };

(async () => {
  const tl = JSON.parse(fs.readFileSync(tlPath, 'utf8'));
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ args: ['--disable-gpu-vsync'] });
  const nW = +opt('--workers', 4);
  const pages = [];
  for (let i = 0; i < nW; i++) {
    const p = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
    p.on('pageerror', e => console.log('pageerror:', e.message));
    p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.log('console:', m.text()); });
    await p.route('http://quix.local/**', r => {
      const f = path.join(ROOT, new URL(r.request().url()).pathname);
      r.fulfill({ body: fs.readFileSync(f), contentType: MIME[path.extname(f)] || 'application/octet-stream' });
    });
    await p.goto('http://quix.local/index.html');
    const info = await p.evaluate(tl => window.init(tl), tl);
    if (i === 0) {
      fs.writeFileSync(path.join(outDir, '..', 'sfx.json'), JSON.stringify(info.sfx, null, 1));
      fs.writeFileSync(path.join(outDir, '..', 'shots.json'), JSON.stringify(info.T, null, 1));
      pages.info = info;
    }
    pages.push(p);
  }
  let list;
  if (opt('--at')) list = opt('--at').split(',').map(s => Math.round(parseFloat(s) * tl.fps));
  else { const [a, b] = (opt('--frames', `0-${pages.info.frames - 1}`)).split('-').map(Number); list = []; for (let f = a; f <= b; f++) list.push(f); }
  const t0 = Date.now(); let done = 0;
  await Promise.all(pages.map(async (p, w) => {
    for (let k = w; k < list.length; k += nW) {
      const f = list[k];
      const data = await p.evaluate(f => { window.renderFrame(f); return window.grab(); }, f);
      fs.writeFileSync(path.join(outDir, String(opt('--at') ? k : f).padStart(5, '0') + '.png'), Buffer.from(data.split(',')[1], 'base64'));
      if (++done % 100 === 0) console.log(`${done}/${list.length}  ${((Date.now() - t0) / done).toFixed(0)} ms/frame`);
    }
  }));
  console.log(`rendered ${list.length} frames in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  await browser.close();
})();
