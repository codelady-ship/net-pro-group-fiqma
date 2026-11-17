// SEO / GEO helpers: extra <head> tags and JSON-LD per page, plus robots.txt / sitemap.xml / llms.txt.
// headExtras(meta) is called at the end of <head> by layout.head(); meta = { title, desc, path, noindex }.
// Structured data uses ONLY facts from tools/data.js (no ratings, prices, geo, sameAs …).
const fs = require('fs');
const path = require('path');
const { SITE, EMAIL, PHONE1, PHONE2, ADDRESS, HOURS, CATS, SERVICES, NAV, FAQ } = require('../data');

const ROOT = path.join(__dirname, '..', '..');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const exists = f => fs.existsSync(path.join(ROOT, f));
const urlOf = file => SITE + (file === 'index.html' ? '' : file);

const ORG_ID = SITE + '#organization';
const SITE_ID = SITE + '#website';
const OG_IMAGE = 'img/og-image.jpg';
const OG_ALT = 'Net Pro Group – İT infrastrukturu və enerji həlləri: server otağında şkaf sırası';

// Pages kept out of search indexes. search.html renders results client-side, so it is noindex,follow.
const ROBOTS = { 'search.html': 'noindex, follow' };
const robotsOf = meta => meta.noindex ? 'noindex' : ROBOTS[meta.path] || '';

// Visible breadcrumb labels (must match the banner() crumbs in tools/pages/*.js)
const navLabel = Object.fromEntries(NAV.map(([h, l]) => [h, l]));
function crumbs(file) {
  const home = [['index.html', 'Əsas səhifə']];
  const cat = CATS.find(c => c.file === file);
  if (cat) return home.concat([['mehsullar-1.html', 'Məhsullar'], [file, cat.name]]);
  const label = file === 'search.html' ? 'Axtarış' : navLabel[file];
  return file === 'index.html' || !label ? null : home.concat([[file, label]]);
}

// "B.e. – Cümə: 09:00 – 18:00" -> Mo-Fr 09:00-18:00
function hours() {
  const m = /^B\.e\. – Cümə: (\d\d:\d\d) – (\d\d:\d\d)$/.exec(HOURS);
  if (!m) throw new Error('seo.js: HOURS format changed, update hours(): ' + HOURS);
  return { opens: m[1], closes: m[2], days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], short: `Mo-Fr ${m[1]}-${m[2]}` };
}

function address() {
  const [street, city, country] = ADDRESS.split(', ');
  return { '@type': 'PostalAddress', streetAddress: street, addressLocality: city, addressCountry: country === 'Azərbaycan' ? 'AZ' : country };
}

function organization(local) {
  const h = hours();
  const org = {
    '@type': local ? ['Organization', 'LocalBusiness'] : 'Organization',
    '@id': ORG_ID,
    name: 'Net Pro Group',
    url: SITE,
    logo: { '@type': 'ImageObject', url: SITE + 'img/logo.png', width: 120, height: 70 },
    image: SITE + OG_IMAGE,
    email: EMAIL,
    telephone: [PHONE1, PHONE2],
    address: address(),
    contactPoint: [PHONE1, PHONE2].map(t => ({
      '@type': 'ContactPoint', contactType: 'customer service', telephone: t, email: EMAIL, availableLanguage: 'az',
      hoursAvailable: { '@type': 'OpeningHoursSpecification', dayOfWeek: h.days, opens: h.opens, closes: h.closes },
    })),
  };
  if (local) {
    org.openingHours = h.short;
    org.openingHoursSpecification = { '@type': 'OpeningHoursSpecification', dayOfWeek: h.days, opens: h.opens, closes: h.closes };
  }
  return org;
}

const website = () => ({
  '@type': 'WebSite', '@id': SITE_ID, url: SITE, name: 'Net Pro Group', inLanguage: 'az',
  publisher: { '@id': ORG_ID },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: SITE + 'search.html?q={search_term_string}' },
    'query-input': 'required name=search_term_string',
  },
});

const PAGE_TYPE = { 'haqqimizda.html': 'AboutPage', 'elaqe.html': 'ContactPage', 'search.html': 'SearchResultsPage', 'qalereya.html': 'CollectionPage' };

function graph(meta) {
  const file = meta.path, url = urlOf(file);
  const g = [organization(file === 'elaqe.html'), website()];
  if (meta.noindex) return g;                        // 404: organization + website only
  const type = PAGE_TYPE[file] || (CATS.some(c => c.file === file) ? 'CollectionPage' : 'WebPage');
  const wp = {
    '@type': type, '@id': url + '#webpage', url, name: meta.title, description: meta.desc, inLanguage: 'az',
    isPartOf: { '@id': SITE_ID }, about: { '@id': ORG_ID },
  };
  if (file === 'index.html') wp.primaryImageOfPage = { '@type': 'ImageObject', url: SITE + 'img/hero.webp' };
  g.push(wp);

  const bc = crumbs(file);
  if (bc) {
    wp.breadcrumb = { '@id': url + '#breadcrumb' };
    g.push({
      '@type': 'BreadcrumbList', '@id': url + '#breadcrumb',
      itemListElement: bc.map(([h, name], i) => ({ '@type': 'ListItem', position: i + 1, name, item: urlOf(h) })),
    });
  }

  const cat = CATS.find(c => c.file === file);
  if (cat) {
    const brandOf = n => /Liebert/.test(n) ? 'Liebert' : /Vertiv/.test(n) ? 'Vertiv' : null;
    wp.mainEntity = { '@id': url + '#products' };
    g.push({
      '@type': 'ItemList', '@id': url + '#products', name: cat.name, numberOfItems: cat.items.length,
      itemListElement: cat.items.map(([slug, name, desc], i) => {
        const p = { '@type': 'Product', name, description: desc, image: SITE + `img/mehsul/${slug}.webp`, category: cat.name };
        const b = brandOf(name);
        if (b) p.brand = { '@type': 'Brand', name: b };
        return { '@type': 'ListItem', position: i + 1, item: p };
      }),
    });
  }

  if (file === 'xidmetler.html') {
    wp.mainEntity = { '@id': url + '#services' };
    g.push({
      '@type': 'ItemList', '@id': url + '#services', name: 'Xidmətlər və həllər', numberOfItems: SERVICES.length,
      itemListElement: SERVICES.map(([id, name, desc], i) => ({
        '@type': 'ListItem', position: i + 1,
        item: { '@type': 'Service', name, description: desc, url: url + '#' + id, provider: { '@id': ORG_ID }, image: exists(`img/xidmet/${id}.webp`) ? SITE + `img/xidmet/${id}.webp` : undefined },
      })),
    });
  }

  if (file === 'elaqe.html') {
    g.push({
      '@type': 'FAQPage', '@id': url + '#faq', inLanguage: 'az', isPartOf: { '@id': url + '#webpage' },
      mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    });
  }
  return g;
}

// JSON for a <script> element: no "</" (closing tag) and no U+2028/2029 surprises
const ld = obj => JSON.stringify(obj).replace(/<\//g, '<\\/').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

function headExtras(meta) {
  const { title, desc, path: file } = meta;
  const url = urlOf(file);
  const robots = robotsOf(meta);
  const img = SITE + OG_IMAGE;
  const lines = [];
  if (robots) lines.push(`<meta name="robots" content="${robots}">`);
  lines.push(`<link rel="canonical" href="${url}">`);
  if (exists('apple-touch-icon.png')) lines.push('<link rel="apple-touch-icon" href="apple-touch-icon.png">');
  if (exists('site.webmanifest')) lines.push('<link rel="manifest" href="site.webmanifest">');
  lines.push(
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="Net Pro Group">',
    '<meta property="og:locale" content="az_AZ">',
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${img}">`,
    '<meta property="og:image:type" content="image/jpeg">',
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    `<meta property="og:image:alt" content="${esc(OG_ALT)}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(desc)}">`,
    `<meta name="twitter:image" content="${img}">`,
    `<meta name="twitter:image:alt" content="${esc(OG_ALT)}">`,
    `<script type="application/ld+json">${ld({ '@context': 'https://schema.org', '@graph': graph(meta) })}</script>`,
  );
  return lines.map(l => '  ' + l + '\n').join('');
}

// LCP preload for the home page: only when index.html really renders the hero as an eager <img> of img/hero.webp.
// The <link> copies that <img>'s src/srcset/sizes verbatim, so the preload always matches what the page requests.
function preloadHero(read, write) {
  let html;
  try { html = read('index.html'); } catch { return; }
  if (html.includes('rel="preload" as="image"')) return;
  const tag = (html.match(/<img\s[^>]*\bsrc="img\/hero\.webp"[^>]*>/) || [])[0];
  if (!tag || /loading="lazy"/.test(tag)) return;
  const at = n => (tag.match(new RegExp('\\s' + n + '="([^"]*)"')) || [])[1];
  const link = `<link rel="preload" as="image" href="img/hero.webp"${at('srcset') ? ` imagesrcset="${at('srcset')}"` : ''}${at('sizes') ? ` imagesizes="${at('sizes')}"` : ''} fetchpriority="high">`;
  write('index.html', html.replace('  <link rel="canonical"', `  ${link}\n  <link rel="canonical"`));
}

// Called once by build-pages.js after all pages are generated. pages = [{ file, meta }]; write(file, text).
function siteFiles(pages, write) {
  const today = new Date().toISOString().slice(0, 10);
  const indexable = pages.filter(p => !robotsOf(p.meta) && p.file !== '404.html');

  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map(p => `  <url><loc>${urlOf(p.file)}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);

  write('robots.txt', `User-agent: *
Allow: /

Sitemap: ${SITE}sitemap.xml
`);

  preloadHero(read => fs.readFileSync(path.join(ROOT, read), 'utf8'), write);

  const desc = Object.fromEntries(pages.map(p => [p.file, p.meta.desc]));
  const line = (file, name) => `- [${name}](${urlOf(file)}): ${desc[file] || ''}`.trim();
  write('llms.txt', `# Net Pro Group

> Net Pro Group – İT infrastrukturu, şəbəkə və enerji avadanlıqları üzrə xidmətlər: server və şəbəkə avadanlığının quraşdırılması, UPS və DC enerji sistemləri, helpdesk və 24/7 monitorinq.

Sayt Azərbaycan dilindədir. Net Pro Group kiçik və orta biznes üçün İT infrastrukturu qurur və ona xidmət göstərir; məhsul kataloqunda fasiləsiz enerji mənbələri (UPS), DC enerji, enerji paylanması, statik ötürmə açarları və monitorinq həlləri var.
English: Net Pro Group is an Azerbaijani-language site about IT infrastructure services and power equipment (UPS, DC power, power distribution, transfer switches, monitoring).

Qeyd: bu sayt Figma dizaynı əsasında hazırlanmış təlim layihəsidir; ünvan, telefon və e-poçt nümunə məlumatlardır (sample contact data on a practice project).

## Səhifələr

${line('index.html', 'Əsas səhifə')}
${line('haqqimizda.html', 'Haqqımızda')}
${line('xidmetler.html', 'Xidmətlər və həllər')}
${line('mehsullar-1.html', 'Məhsullar')}
${line('qalereya.html', 'Qalereya')}
${line('elaqe.html', 'Əlaqə')}

## Məhsul kateqoriyaları

${CATS.map(c => `- [${c.name}](${urlOf(c.file)}): ${c.intro}`).join('\n')}

## Xidmətlər

${SERVICES.map(([id, name, d]) => `- [${name}](${SITE}xidmetler.html#${id}): ${d}`).join('\n')}

## Əlaqə (nümunə məlumat)

- E-poçt: ${EMAIL}
- Telefon: ${PHONE1}, ${PHONE2}
- İş saatları: ${HOURS}
`);
}

module.exports = { headExtras, siteFiles };
