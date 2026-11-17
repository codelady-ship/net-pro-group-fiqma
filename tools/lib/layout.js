// Shared layout: <head>, header, footer, page banner.
const { HOURS, FAQ, SITE, EMAIL, PHONE1, PHONE1_TEL, PHONE2, PHONE2_TEL, ADDRESS, CATS, SERVICES, NAV, slides, prodSlides, gallery, partners, brands } = require('../data');
const seo = require('./seo');
const { icon } = require('./icons');
const { img } = require('./img');

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

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
  <meta name="theme-color" content="#435072">
  <link rel="icon" href="favicon.png" type="image/png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
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
    if (!dd) return `        <li><a href="${href}"${cur}>${label}</a></li>`;
    return `        <li class="has-dropdown">
          <a href="${href}"${cur}>${label}</a>
          <button type="button" class="dd-toggle" aria-expanded="false" aria-label="Məhsul kateqoriyalarını göstər"><img src="img/ikon/chevron.png" alt="" width="12" height="12"></button>
          <ul class="dropdown">
${CATS.map(c => `            <li><a href="${c.file}">${c.name}</a></li>`).join('\n')}
          </ul>
        </li>`;
  }).join('\n');
  return `  <div class="topbar">
    <div class="wrap topbar-inner">
      <span class="tb-item"><img src="img/ikon/pin.png" alt="" width="14" height="18"> ${ADDRESS}</span>
      <span class="tb-item"><img src="img/ikon/whatsapp.png" alt="" width="14" height="14"> <a href="tel:${PHONE1_TEL}">${PHONE1}</a> <a href="tel:${PHONE2_TEL}">${PHONE2}</a></span>
      <span class="tb-item"><img src="img/ikon/mail.png" alt="" width="18" height="14"> <a href="mailto:${EMAIL}">${EMAIL}</a></span>
      <span class="tb-item tb-lang" title="Saytın dili: Azərbaycan dili">AZ</span>
    </div>
  </div>
  <header class="site-header">
    <div class="wrap header-inner">
      <a href="index.html" class="logo"><img src="img/logo.png" alt="Net Pro Group – əsas səhifə" width="120" height="70"></a>
      <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="Menyunu aç"><span></span><span></span><span></span></button>
      <nav class="site-nav" id="site-nav" aria-label="Əsas menyu">
        <ul class="menu">
${links}
        </ul>
      </nav>
      <a href="search.html" class="search-link" aria-label="Saytda axtarış"><img src="img/ikon/search.png" alt="" width="24" height="24"></a>
    </div>
  </header>
`;
}

function footer() {
  return `  <footer class="site-footer">
    <div class="wrap footer-grid">
      <div class="f-brand">
        <img src="img/logo-white.png" alt="Net Pro Group" width="120" height="70" loading="lazy">
        <p>İT infrastrukturu, şəbəkə və enerji avadanlıqları üzrə xidmətlər.</p>
      </div>
      <div>
        <h2 class="f-title">Saytın xəritəsi</h2>
        <ul class="f-links">
${NAV.map(([h, l]) => `          <li><a href="${h}">${l}</a></li>`).join('\n')}
          <li><a href="search.html">Axtarış</a></li>
        </ul>
      </div>
      <div>
        <h2 class="f-title">Əlaqə</h2>
        <ul class="f-contact">
          <li><img src="img/ikon/phone.png" alt="" width="16" height="16"> <a href="tel:${PHONE1_TEL}">${PHONE1}</a></li>
          <li><img src="img/ikon/phone.png" alt="" width="16" height="16"> <a href="tel:${PHONE2_TEL}">${PHONE2}</a></li>
          <li><img src="img/ikon/mail.png" alt="" width="16" height="12"> <a href="mailto:${EMAIL}">${EMAIL}</a></li>
        </ul>
      </div>
      <div>
        <h2 class="f-title">Ünvan</h2>
        <p class="f-address"><img src="img/ikon/pin.png" alt="" width="14" height="18"> ${ADDRESS}</p>
        <p class="f-hours">B.e. – Cümə: 09:00 – 18:00</p>
      </div>
    </div>
    <div class="wrap footer-bottom">
      <p>© 2026 Net Pro Group. Figma dizaynı əsasında hazırlanmış təlim layihəsi: ünvan, telefon və e-poçt nümunədir. Brend loqoları öz sahiblərinə məxsusdur.</p>
    </div>
  </footer>
</body>
</html>
`;
}

function banner(title, crumbs) {
  const c = crumbs.map(([h, l], i) => i === crumbs.length - 1
    ? `<li aria-current="page">${l}</li>` : `<li><a href="${h}">${l}</a></li>`).join('');
  return `  <section class="banner">
    <div class="wrap">
      <h1>${title}</h1>
      <nav aria-label="Naviqasiya zənciri"><ol class="crumbs">${c}</ol></nav>
    </div>
  </section>
`;
}

module.exports = { esc, head, header, footer, banner };
