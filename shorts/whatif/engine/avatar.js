// node avatar.js <outDir>  -> quix_profile_{purple,teal}.png (2048²) + circle preview
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const out = process.argv[2];
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 2048, height: 2048 } });
  p.on('pageerror', e => console.log('pageerror:', e.message));
  for (const bg of ['purple', 'teal']) {
    await p.goto('file://' + path.join(__dirname, 'web', 'avatar.html') + '?bg=' + bg);
    await p.waitForFunction(() => document.title === 'done');
    await p.screenshot({ path: path.join(out, `quix_profile_${bg}.png`) });
  }
  // preview: circle crops at feed sizes on light + dark UI
  const img = bg => 'file://' + path.join(path.resolve(out), `quix_profile_${bg}.png`);
  await p.setViewportSize({ width: 1600, height: 700 });
  await p.setContent(`<body style="margin:0;font-family:sans-serif">
    <div style="display:flex;height:350px;background:#fff;align-items:center;gap:40px;padding:0 50px">
      ${['purple', 'teal'].map(bg => `<img src="${img(bg)}" style="width:300px;border-radius:50%"><img src="${img(bg)}" style="width:110px;border-radius:50%"><img src="${img(bg)}" style="width:48px;border-radius:50%">`).join('')}
    </div>
    <div style="display:flex;height:350px;background:#121212;align-items:center;gap:40px;padding:0 50px">
      ${['purple', 'teal'].map(bg => `<img src="${img(bg)}" style="width:300px;border-radius:50%"><img src="${img(bg)}" style="width:110px;border-radius:50%"><img src="${img(bg)}" style="width:48px;border-radius:50%">`).join('')}
    </div></body>`);
  await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(out, 'quix_profile_preview.png') });
  await b.close();
})();
