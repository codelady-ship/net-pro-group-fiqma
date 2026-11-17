// SEO / GEO helpers: extra <head> tags and JSON-LD per page, plus robots.txt / sitemap.xml / llms.txt.
// headExtras(meta) is called at the end of <head> by layout.head(); meta = { title, desc, path, noindex }.
const { SITE } = require('../data');

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function headExtras(meta) {
  const { title, desc, path, noindex } = meta;
  const url = SITE + (path === 'index.html' ? '' : path);
  return `  ${noindex ? '<meta name="robots" content="noindex">\n  ' : ''}<link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Net Pro Group">
  <meta property="og:locale" content="az_AZ">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${SITE}docs/screenshot.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(desc)}">
  <meta name="twitter:image" content="${SITE}docs/screenshot.png">
`;
}

// Called once by build-pages.js after all pages are generated. pages = [{ file, meta }]; write(file, text).
function siteFiles(pages, write) {}

module.exports = { headExtras, siteFiles };
