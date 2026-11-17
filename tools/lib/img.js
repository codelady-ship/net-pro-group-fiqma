// <img> helper: reads the real pixel size from the file so every image gets width/height (no layout shift).
// img('mehsul/kabinet.webp', { alt, cls, eager, sizes }) -> '<img ...>'
// Only images already in img/ may be used (owner rule: no new or stock images).
// Responsive: if smaller derivatives <name>-<w>.webp exist next to the source (made by tools/optimize-images.js),
// a srcset with their real widths (+ the original) is emitted, with the given sizes (default 100vw).
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');

function size(file) {
  const b = fs.readFileSync(path.join(ROOT, file));
  if (b.toString('ascii', 1, 4) === 'PNG') return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = b.toString('ascii', 12, 16);
    if (chunk === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
    if (chunk === 'VP8L') { const n = b.readUInt32LE(21); return { w: (n & 0x3fff) + 1, h: ((n >> 14) & 0x3fff) + 1 }; }
    if (chunk === 'VP8X') return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
  }
  throw new Error('Unknown image format: ' + file);
}

const attr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// srcset string for a source if responsive derivatives exist next to it, else ''
function srcsetFor(file) {
  const dir = path.posix.dirname(file), ext = path.extname(file), base = path.basename(file, ext);
  let names;
  try { names = fs.readdirSync(path.join(ROOT, dir)); } catch { return ''; }
  const { w } = size(file);
  const v = names
    .filter(n => n.startsWith(base + '-') && /^\d+\.webp$/.test(n.slice(base.length + 1)))
    .map(n => ({ f: dir + '/' + n, w: size(dir + '/' + n).w }))
    .filter(x => x.w < w)
    .sort((a, b) => a.w - b.w);
  if (!v.length) return '';
  return v.map(x => `${x.f} ${x.w}w`).concat(`${file} ${w}w`).join(', ');
}

function img(src, { alt = '', cls = '', eager = false, sizes = '', extra = '' } = {}) {
  const file = src.startsWith('img/') ? src : 'img/' + src;
  const { w, h } = size(file);
  const srcset = srcsetFor(file);
  if (srcset && !sizes) sizes = '100vw';
  return `<img src="${file}"${srcset ? ` srcset="${srcset}"` : ''} alt="${attr(alt)}" width="${w}" height="${h}"${cls ? ` class="${cls}"` : ''}${sizes ? ` sizes="${sizes}"` : ''}${eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}${extra ? ' ' + extra : ''}>`;
}

module.exports = { img, size, srcsetFor };
