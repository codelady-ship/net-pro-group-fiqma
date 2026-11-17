// Generates the static site. Run: node tools/build-pages.js
//   tools/data.js         content (frozen real copy)
//   tools/lib/*.js        layout (head/header/footer), form, img helper, seo
//   tools/pages/*.js      one module per page group; each calls page(file, meta, body, active)
//   tools/css/*.css       concatenated in name order into netprogroup.css
//   tools/js/*.js         concatenated in name order into main.js (inside one IIFE; 00-config.js stays on top)
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, '..') + '/';
const layout = require('./lib/layout');
const seo = require('./lib/seo');

const built = [];
function page(file, meta, body, active) {
  const m = { ...meta, path: file };
  built.push({ file, meta: m });
  fs.writeFileSync(OUT + file, layout.head(m) + layout.header(active || file) + `  <main id="main">\n${body}  </main>\n` + layout.footer());
}
page.writeFile = (file, text) => fs.writeFileSync(OUT + file, text);

for (const name of ['home', 'about', 'catalog', 'services', 'gallery', 'contact', 'search', 'notfound']) {
  require('./pages/' + name)(page);
}

// 404.html is served from any depth, so use absolute asset paths there
let nf = fs.readFileSync(OUT + '404.html', 'utf8');
nf = nf.replace(/(href|src|srcset)="(?!https?:|mailto:|tel:|#|\/)([^"]+)"/g, '$1="/net-pro-group-fiqma/$2"');
fs.writeFileSync(OUT + '404.html', nf);

// CSS and JS bundles (plain concatenation, no dependencies)
const cat = (dir, ext) => fs.readdirSync(path.join(__dirname, dir)).filter(f => f.endsWith(ext)).sort()
  .map(f => `/* ---- ${dir}/${f} ---- */\n` + fs.readFileSync(path.join(__dirname, dir, f), 'utf8').trim() + '\n').join('\n');
const css = cat('css', '.css');
if (css) fs.writeFileSync(OUT + 'netprogroup.css', '/* Net Pro Group – generated from tools/css/*.css by tools/build-pages.js. Do not edit. */\n' + css);
const jsFiles = fs.readdirSync(path.join(__dirname, 'js')).filter(f => f.endsWith('.js')).sort();
if (jsFiles.length) {
  const config = jsFiles.filter(f => f.startsWith('00-')).map(f => fs.readFileSync(path.join(__dirname, 'js', f), 'utf8').trim()).join('\n');
  const rest = jsFiles.filter(f => !f.startsWith('00-')).map(f => `  /* ---- js/${f} ---- */\n` + fs.readFileSync(path.join(__dirname, 'js', f), 'utf8').trim().split('\n').map(l => l ? '  ' + l : l).join('\n')).join('\n\n');
  fs.writeFileSync(OUT + 'main.js', `// Net Pro Group – shared interactions (vanilla JS). Generated from tools/js/*.js by tools/build-pages.js. Do not edit.\n\n${config}\n\n(function () {\n${rest}\n})();\n`);
}

seo.siteFiles(built, (file, text) => fs.writeFileSync(OUT + file, text));
console.log('built', built.length, 'pages');
