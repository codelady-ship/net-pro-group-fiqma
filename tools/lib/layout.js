// Shared layout: <head>, header, footer, page banner.
const { HOURS, EMAIL, PHONE1, PHONE1_TEL, PHONE2, PHONE2_TEL, ADDRESS, CATS, NAV } = require('../data');
const seo = require('./seo');
const { icon } = require('./icons');

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// one inline icon per product category (same order as CATS)
const CAT_ICONS = ['battery', 'bolt', 'plug', 'factory', 'switch', 'activity'];

// SEO tags (canonical, robots, Open Graph, Twitter, JSON-LD) come from seo.headExtras(meta) – owned by tools/lib/seo.js.
function head(meta) {
  const { title, desc } = meta;
  return `<!DOCTYPE html>
<html lang="az">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="theme-color" content="#0b1426">
  <link rel="icon" href="favicon.png" type="image/png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="netprogroup.css">
  <script src="main.js" defer></script>
${seo.headExtras(meta)}</head>
<body>
  <a class="skip-link" href="#main">Məzmuna keç</a>
`;
}

function header(active) {
  const links = NAV.map(([href, label, dd]) => {
    const isActive = active === href || (dd && active.startsWith('mehsullar'));
    const cur = isActive ? ' aria-current="page"' : '';
    if (!dd) return `          <li class="menu-item"><a class="menu-link" href="${href}"${cur}>${label}</a></li>`;
    return `          <li class="menu-item has-dropdown">
            <div class="dd-row">
              <a class="menu-link" href="${href}"${cur}>${label}</a>
              <button type="button" class="dd-toggle" aria-expanded="false" aria-controls="dd-products" aria-label="Məhsul kateqoriyalarını göstər">${icon('chevron-down', { size: 18 })}</button>
            </div>
            <div class="dropdown" id="dd-products">
              <p class="dropdown-label">Kateqoriyalar</p>
              <ul class="dropdown-list">
${CATS.map((c, i) => `                <li><a href="${c.file}"${active === c.file ? ' aria-current="page"' : ''}><span class="dd-ico">${icon(CAT_ICONS[i], { size: 20 })}</span><span class="dd-text">${c.name}</span></a></li>`).join('\n')}
              </ul>
            </div>
          </li>`;
  }).join('\n');
  return `  <header class="site-header">
    <div class="wrap header-inner">
      <a href="index.html" class="logo"><img src="img/logo.png" alt="Net Pro Group – əsas səhifə" width="120" height="70"></a>
      <nav class="site-nav" id="site-nav" aria-label="Əsas menyu">
        <ul class="menu">
${links}
        </ul>
        <div class="nav-extra">
          <a class="btn btn--primary" href="elaqe.html#form">Sorğu göndər ${icon('arrow-right', { size: 18 })}</a>
          <a class="nav-contact" href="tel:${PHONE1_TEL}">${icon('phone', { size: 18 })} ${PHONE1}</a>
          <a class="nav-contact" href="mailto:${EMAIL}">${icon('mail', { size: 18 })} ${EMAIL}</a>
        </div>
      </nav>
      <div class="header-actions">
        <a class="header-phone" href="tel:${PHONE1_TEL}">${icon('phone', { size: 18 })}<span>${PHONE1}</span></a>
        <a href="search.html" class="icon-btn search-link" aria-label="Saytda axtarış"${active === 'search.html' ? ' aria-current="page"' : ''}>${icon('search', { size: 22 })}</a>
        <a class="btn btn--primary btn--sm header-cta" href="elaqe.html#form">Sorğu göndər</a>
        <button type="button" class="icon-btn nav-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="Menyunu aç">${icon('menu', { size: 24, cls: 'i-open' })}${icon('close', { size: 24, cls: 'i-close' })}</button>
      </div>
    </div>
  </header>
`;
}

function footer() {
  return `  <footer class="site-footer">
    <div class="wrap footer-grid">
      <div class="f-brand">
        <a href="index.html" class="f-logo"><img src="img/logo-white.png" alt="Net Pro Group – əsas səhifə" width="120" height="70" loading="lazy"></a>
        <p>İT infrastrukturu, şəbəkə və enerji avadanlıqları üzrə xidmətlər.</p>
        <a class="btn btn--light btn--sm" href="elaqe.html#form">Sorğu göndər ${icon('arrow-right', { size: 18 })}</a>
      </div>
      <nav class="f-col" aria-label="Sayt xəritəsi">
        <h2 class="f-title">Sayt xəritəsi</h2>
        <ul class="f-links">
${NAV.map(([h, l]) => `          <li><a href="${h}">${l}</a></li>`).join('\n')}
          <li><a href="search.html">Axtarış</a></li>
        </ul>
      </nav>
      <nav class="f-col" aria-label="Məhsul kateqoriyaları">
        <h2 class="f-title">Məhsullar</h2>
        <ul class="f-links">
${CATS.map(c => `          <li><a href="${c.file}">${c.name}</a></li>`).join('\n')}
        </ul>
      </nav>
      <div class="f-col">
        <h2 class="f-title">Əlaqə</h2>
        <ul class="f-contact">
          <li>${icon('phone', { size: 18 })}<span><a href="tel:${PHONE1_TEL}">${PHONE1}</a><br><a href="tel:${PHONE2_TEL}">${PHONE2}</a></span></li>
          <li>${icon('mail', { size: 18 })}<a href="mailto:${EMAIL}">${EMAIL}</a></li>
          <li>${icon('pin', { size: 18 })}<span>${ADDRESS}</span></li>
          <li>${icon('clock', { size: 18 })}<span>${HOURS}</span></li>
        </ul>
      </div>
    </div>
    <div class="wrap footer-bottom">
      <p>© 2026 <span translate="no">Net Pro Group</span>. Figma dizaynı əsasında hazırlanmış təlim layihəsi: ünvan, telefon və e-poçt nümunədir. Brend loqoları öz sahiblərinə məxsusdur.</p>
    </div>
  </footer>
</body>
</html>
`;
}

function banner(title, crumbs) {
  const c = crumbs.map(([h, l], i) => i === crumbs.length - 1
    ? `<li aria-current="page">${l}</li>` : `<li><a href="${h}">${l}</a></li>`).join('');
  return `  <section class="page-hero">
    <div class="wrap page-hero-inner">
      <nav aria-label="Naviqasiya zənciri"><ol class="crumbs">${c}</ol></nav>
      <h1>${title}</h1>
    </div>
  </section>
`;
}

module.exports = { esc, head, header, footer, banner, CAT_ICONS };
