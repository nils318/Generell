// Frame renderer: node render.js <episode_dir> [--out dir] [--frames a-b | --at t1,t2,...] [--workers N]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const args = process.argv.slice(2);
const EP = path.resolve(args[0]), B = path.join(EP, 'build');
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const ENGINE = path.join(__dirname, 'web');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.ttf': 'font/ttf' };

(async () => {
  const tl = JSON.parse(fs.readFileSync(path.join(B, 'timeline.json'), 'utf8'));
  const outDir = path.resolve(opt('--out', path.join(B, 'frames')));
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ args: ['--disable-gpu-vsync'] });
  const nW = +opt('--workers', 4);
  const pages = [];
  for (let i = 0; i < nW; i++) {
    const p = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
    p.on('pageerror', e => console.log('pageerror:', e.message));
    p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.log('console:', m.text()); });
    await p.route('http://quix.local/**', r => {
      const u = new URL(r.request().url()).pathname;
      const f = u.startsWith('/ep/') ? path.join(EP, 'web', u.slice(4)) : path.join(ENGINE, u.replace(/^\/(engine\/)?/, ''));
      r.fulfill({ body: fs.readFileSync(f), contentType: MIME[path.extname(f)] || 'application/octet-stream' });
    });
    await p.goto('http://quix.local/index.html');
    const info = await p.evaluate(tl => window.init(tl), tl);
    if (i === 0) {
      fs.writeFileSync(path.join(B, 'sfx.json'), JSON.stringify(info.sfx, null, 1));
      fs.writeFileSync(path.join(B, 'shots.json'), JSON.stringify(info.T, null, 1));
      fs.writeFileSync(path.join(B, 'music.json'), JSON.stringify(info.music, null, 1));
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
