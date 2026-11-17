// DEV-ONLY image derivative script (not part of the build, not run on CI).
// Run manually: node tools/optimize-images.js
// Produces DERIVATIVES of images already in the repo (owner rule: no new images):
//   - responsive widths <name>-<w>.webp next to the source (picked up by tools/lib/img.js as srcset)
//   - img/og-image.jpg  (1200x630 social preview built from img/hero.webp + img/logo.png)
//   - apple-touch-icon.png (180x180, img/logo.png on white)
// There is no sharp/ImageMagick on this machine, so the headless Chromium shipped with Playwright
// does the resizing/encoding (canvas drawImage + toBlob). Paths below are machine-specific dev paths.
const fs = require('fs');
const path = require('path');
const { chromium } = require(process.env.PW_MODULE || 'C:/Users/user/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const EXE = process.env.PW_EXE || 'C:/Users/user/AppData/Local/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-win64/chrome-headless-shell.exe';
const ROOT = path.join(__dirname, '..');
const LOCK = process.env.PW_LOCK || '';   // optional: dir used as a global "one chromium at a time" lock

// Responsive widths to generate (only widths smaller than the source).
const RESPONSIVE = [
  ['img/hero.webp', [480, 768, 1024]],
];
const Q = 0.8; // WebP quality for derivatives

const sleep = ms => new Promise(r => setTimeout(r, ms));
async function lock() {
  if (!LOCK) return;
  for (let i = 0; i < 600; i++) {
    try { fs.mkdirSync(LOCK); return; } catch { try { if (Date.now() - fs.statSync(LOCK).mtimeMs > 300000) fs.rmdirSync(LOCK); } catch {} await sleep(1000); }
  }
  throw new Error('lock timeout');
}
const dataUrl = f => {
  const ext = path.extname(f).slice(1).replace('jpg', 'jpeg');
  return `data:image/${ext};base64,` + fs.readFileSync(path.join(ROOT, f)).toString('base64');
};
const save = (f, b64) => { fs.writeFileSync(path.join(ROOT, f), Buffer.from(b64, 'base64')); return fs.statSync(path.join(ROOT, f)).size; };

(async () => {
  await lock();
  let browser;
  try {
    browser = await chromium.launch({ executablePath: EXE });
    const page = await browser.newPage();
    await page.setContent('<!doctype html><body></body>');
    // Shared in-page helpers
    await page.evaluate(() => {
      window.load = src => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
      window.out = (c, type, q) => new Promise(res => c.toBlob(b => { const r = new FileReader(); r.onload = () => res(r.result.split(',')[1]); r.readAsDataURL(b); }, type, q));
      // high-quality downscale: halve repeatedly, then final step
      window.resize = (im, w, h) => {
        let src = im, sw = im.naturalWidth || im.width, sh = im.naturalHeight || im.height;
        while (sw / 2 >= w) {
          const c = document.createElement('canvas'); c.width = Math.round(sw / 2); c.height = Math.round(sh / 2);
          const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(src, 0, 0, c.width, c.height);
          src = c; sw = c.width; sh = c.height;
        }
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(src, 0, 0, w, h);
        return c;
      };
    });

    const report = [];
    for (const [src, widths] of RESPONSIVE) {
      const orig = fs.statSync(path.join(ROOT, src)).size;
      for (const w of widths) {
        const b64 = await page.evaluate(async ([u, w, q]) => {
          const im = await load(u);
          const h = Math.round(im.naturalHeight * w / im.naturalWidth);
          return out(resize(im, w, h), 'image/webp', q);
        }, [dataUrl(src), w, Q]);
        const dst = src.replace(/\.webp$/, `-${w}.webp`);
        report.push(`${dst}: ${save(dst, b64)} B (source ${src} ${orig} B)`);
      }
    }

    // Open Graph image 1200x630: hero photo (cover) + light panel on the left with the logo and the site's own tagline.
    const og = await page.evaluate(async ([hero, logo]) => {
      const [h, l] = await Promise.all([load(hero), load(logo)]);
      const W = 1200, H = 630, c = document.createElement('canvas'); c.width = W; c.height = H;
      const x = c.getContext('2d'); x.imageSmoothingQuality = 'high';
      const s = Math.max(W / h.naturalWidth, H / h.naturalHeight);
      const dw = h.naturalWidth * s, dh = h.naturalHeight * s;
      x.drawImage(h, W - dw, (H - dh) / 2, dw, dh);           // right-aligned so the server racks stay in frame
      const g = x.createLinearGradient(0, 0, 720, 0);
      g.addColorStop(0, 'rgba(245,247,251,0.97)'); g.addColorStop(0.75, 'rgba(245,247,251,0.9)'); g.addColorStop(1, 'rgba(245,247,251,0)');
      x.fillStyle = g; x.fillRect(0, 0, 720, H);
      x.drawImage(l, 80, 120, 240, 140);                        // logo.png at 2x
      x.fillStyle = '#0b1426'; x.font = '700 50px "Segoe UI", Arial, sans-serif';
      x.fillText('İT infrastrukturu', 80, 350); x.fillText('və enerji həlləri', 80, 412);
      x.fillStyle = '#435072'; x.font = '500 26px "Segoe UI", Arial, sans-serif';
      x.fillText('Server, şəbəkə, UPS və DC enerji sistemləri', 80, 470);
      x.fillStyle = '#0f8fab'; x.fillRect(80, 510, 96, 6);
      return out(c, 'image/jpeg', 0.85);
    }, [dataUrl('img/hero.webp'), dataUrl('img/logo.png')]);
    report.push(`img/og-image.jpg: ${save('img/og-image.jpg', og)} B`);

    // apple-touch-icon 180x180: logo on white, no upscaling beyond 1.25x
    const ati = await page.evaluate(async logo => {
      const l = await load(logo), c = document.createElement('canvas'); c.width = c.height = 180;
      const x = c.getContext('2d'); x.imageSmoothingQuality = 'high';
      x.fillStyle = '#fff'; x.fillRect(0, 0, 180, 180);
      x.drawImage(l, 15, 46, 150, 87.5);
      return out(c, 'image/png');
    }, dataUrl('img/logo.png'));
    report.push(`apple-touch-icon.png: ${save('apple-touch-icon.png', ati)} B`);

    console.log(report.join('\n'));
  } finally {
    if (browser) await browser.close();
    if (LOCK) try { fs.rmdirSync(LOCK); } catch {}
  }
})().catch(e => { console.error(e); process.exit(1); });
