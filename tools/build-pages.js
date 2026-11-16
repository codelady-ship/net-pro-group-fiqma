// Generates the static HTML pages (shared header/footer, AZ copy). Run: node tools/build-pages.js
const fs = require('fs');
const OUT = require('path').join(__dirname, '..') + '/';
const SITE = 'https://codelady-ship.github.io/net-pro-group-fiqma/';
const EMAIL = 'info@netprogroup.example';
const PHONE1 = '+994 12 000 00 00', PHONE1_TEL = '+994120000000';
const PHONE2 = '+994 50 000 00 00', PHONE2_TEL = '+994500000000';
const ADDRESS = 'Nümunə küçəsi 1, Bakı, Azərbaycan';

const CATS = [
  { file: 'mehsullar-1.html', name: 'Fasiləsiz enerji mənbələri (UPS)', short: 'UPS sistemləri',
    intro: 'Server otaqları, ofislər və data mərkəzləri üçün fasiləsiz enerji mənbələri. Elektrik kəsiləndə avadanlıq işləməyə davam edir, gərginlik dalğalanmalarından qorunur və məlumat itkisi yaranmır.',
    items: [
      ['liebert-exm2', 'Liebert® EXM2 UPS', 'Orta ölçülü kritik sistemlər üçün monoblok UPS. Yüksək səmərəlilik, kompakt ölçü və asan texniki xidmət.', 'İki qara şkaf tipli UPS bloku'],
      ['edge-li-ion', 'Vertiv™ Edge Lithium-Ion UPS, 1500–3000 VA', 'Litium-ion batareyalı line-interactive UPS. Server və şəbəkə avadanlığını qısa kəsintilərdə ehtiyat enerji ilə təmin edir.', 'Rack tipli nazik qara UPS'],
      ['liebert-gxt5', 'Liebert® GXT5 UPS, 750 VA – 20 kVA', 'Online ikiqat çevirmə texnologiyası ilə davamlı enerji keyfiyyəti. Rack və ya qüllə şəklində quraşdırılır.', 'Üst-üstə qoyulmuş iki rack tipli UPS'],
      ['trinergy-cube', 'Liebert® Trinergy™ Cube, 150 kW – 3.4 MW', 'Böyük data mərkəzləri üçün modul tipli UPS. Tələbat artdıqca gücü mərhələli şəkildə artırmaq mümkündür.', 'Geniş qara modul tipli UPS sistemi'],
      ['gxt-rt', 'Liebert® GXT RT+ UPS', 'Bir fazalı, 0.9 güc əmsallı UPS. Geniş giriş gərginliyi diapazonunda qoşulmuş cihazları qoruyur.', 'Qüllə və rack tipli iki UPS bloku'],
    ] },
  { file: 'mehsullar-2.html', name: 'DC enerji sistemləri', short: 'DC enerji',
    intro: 'Telekom qovşaqları və data mərkəzləri üçün etibarlı, genişlənə bilən 48 V DC enerji sistemləri. Rektifikator modulları işləyə-işləyə dəyişdirilə bilir.',
    items: [
      ['kabinet', '48 V DC enerji şkafı', 'Rektifikatorlar, batareya qrupları və paylayıcı panel bir şkafda. Telekom və şəbəkə qovşaqları üçün uyğundur.', 'Qara rəngli böyük enerji şkafı'],
      ['gxt-rt', 'Kompakt rack tipli DC modul', '19 düymlük rack-a quraşdırılan kompakt DC enerji modulu. Kiçik server otaqları üçün nəzərdə tutulub.', 'Qüllə və rack tipli enerji blokları'],
    ] },
  { file: 'mehsullar-3.html', name: 'Enerji paylanması', short: 'Paylanma',
    intro: 'Rack və şkaflar daxilində enerjinin təhlükəsiz paylanması üçün PDU-lar və paylayıcı panellər. Hər çıxışın yükünü izləmək mümkündür.',
    items: [
      ['edge-li-ion', 'Ağıllı rack PDU', 'Hər rozetka üzrə enerji sərfiyyatını göstərən və uzaqdan idarə olunan paylayıcı blok.', 'Rack tipli nazik qara cihaz'],
      ['liebert-gxt5', 'Modul tipli paylayıcı panel', 'Server otağı üçün avtomatik açarlı, genişlənə bilən paylayıcı panel.', 'Üst-üstə qoyulmuş iki rack tipli cihaz'],
      ['kabinet', 'Mərtəbə tipli paylayıcı şkaf', 'Data mərkəzində sıralar üzrə enerji paylanması üçün mərkəzi şkaf.', 'Qara rəngli böyük şkaf'],
    ] },
  { file: 'mehsullar-4.html', name: 'Sənaye AC və DC sistemləri', short: 'Sənaye sistemləri',
    intro: 'Neft-qaz, energetika və istehsal obyektləri üçün ağır iş şəraitinə davamlı AC və DC enerji sistemləri.',
    items: [
      ['liebert-exm2', 'Sənaye tipli UPS sistemi', 'Toz, rütubət və yüksək temperaturda işləmək üçün gücləndirilmiş korpuslu UPS.', 'İki qara şkaf tipli enerji bloku'],
    ] },
  { file: 'mehsullar-5.html', name: 'Statik ötürmə açarları', short: 'Ötürmə açarları',
    intro: 'İki müstəqil enerji mənbəyi arasında millisaniyələr ərzində avtomatik keçid. Bir mənbə sıradan çıxsa, yük kəsintisiz digərinə ötürülür.',
    items: [
      ['edge-li-ion', 'Rack tipli statik ötürmə açarı', 'Bir girişli serverləri iki enerji mənbəyinə qoşmaq üçün 1U ölçülü açar.', 'Rack tipli nazik qara cihaz'],
      ['liebert-gxt5', 'Orta güclü ötürmə açarı', 'Server otağının bütöv sırasını qorumaq üçün statik ötürmə açarı.', 'Üst-üstə qoyulmuş iki rack tipli cihaz'],
      ['trinergy-cube', 'Mərkəzi statik ötürmə sistemi', 'Data mərkəzi səviyyəsində yüksək güclü yüklər üçün mərkəzi açar sistemi.', 'Geniş qara modul tipli sistem'],
      ['kabinet', 'Şkaf tipli ötürmə həlli', 'Paylayıcı panel və ötürmə açarı bir şkafda birləşdirilmiş hazır həll.', 'Qara rəngli böyük şkaf'],
    ] },
  { file: 'mehsullar-6.html', name: 'Enerji idarəetməsi və monitorinq', short: 'Monitorinq',
    intro: 'UPS, PDU və iqlim avadanlığının vəziyyətini bir paneldən izləmək üçün kartlar, sensorlar və proqram təminatı. Problem yarananda dərhal bildiriş alırsınız.',
    items: [
      ['gxt-rt', 'Şəbəkə monitorinq kartı', 'UPS-i yerli şəbəkəyə qoşur, veb interfeys və SNMP ilə vəziyyəti göstərir.', 'Qüllə və rack tipli enerji blokları'],
      ['kabinet', 'Temperatur və rütubət sensorları', 'Server şkaflarında iqlim şəraitini izləyir və həddi aşanda xəbərdarlıq edir.', 'Qara rəngli böyük şkaf'],
      ['trinergy-cube', 'Mərkəzi monitorinq proqramı', 'Bütün enerji avadanlığını bir paneldə göstərən, hesabat hazırlayan proqram.', 'Geniş qara modul tipli sistem'],
    ] },
];

const SERVICES = [
  ['qurasdirma', 'Avadanlıqların quraşdırılması və konfiqurasiyası', 'Server, şəbəkə və enerji avadanlığını layihəyə uyğun quraşdırır, sazlayır və sənədləşdiririk.', 'Texnik server şkafında avadanlıq quraşdırır'],
  ['tehlukesizlik', 'Təhlükəsizlik xidmətləri', 'Firewall, VPN və giriş nəzarəti qururuq, şəbəkəni müntəzəm yoxlayır və zəiflikləri aradan qaldırırıq.', 'Mütəxəssislər monitorlarda kodu nəzərdən keçirir'],
  ['helpdesk', 'Helpdesk xidmətləri', 'İş saatlarında telefon və e-poçt vasitəsilə istifadəçilərə texniki dəstək göstəririk.', 'Qulaqlıqlı dəstək mütəxəssisi kompüter arxasında'],
  ['it', 'İT xidmətləri', 'Ofis şəbəkəsi, serverlər, e-poçt və ehtiyat nüsxələmə sistemlərinin tam idarə olunması.', 'İki mühəndis server otağında kabelləri yoxlayır'],
  ['temir', 'Ofis avadanlıqlarının təmiri və texniki xidməti', 'Kompüter, printer və şəbəkə avadanlığının diaqnostikası, təmiri və profilaktik baxışı.', 'Noutbukun içərisində təmir işləri'],
  ['yenilenme', 'Avadanlıqların vaxtında yenilənməsi', 'Köhnəlmiş avadanlığı planlı şəkildə dəyişir, məlumatları itkisiz yeni sistemə köçürürük.', 'Komanda noutbuklar arxasında planlama aparır'],
  ['nezaret', 'Daimi nəzarət', 'Serverlər, UPS və şəbəkə 24/7 monitorinq olunur; problem yaranan kimi bildiriş alır və reaksiya veririk.', 'Operator monitorinq ekranı qarşısında'],
];

const NAV = [
  ['index.html', 'Əsas səhifə'],
  ['haqqimizda.html', 'Haqqımızda'],
  ['mehsullar-1.html', 'Məhsullar', true],
  ['xidmetler.html', 'Xidmətlər və həllər'],
  ['qalereya.html', 'Qalereya'],
  ['elaqe.html', 'Əlaqə'],
];

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function head({ title, desc, path, noindex }) {
  const url = SITE + (path === 'index.html' ? '' : path);
  return `<!DOCTYPE html>
<html lang="az">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  ${noindex ? '<meta name="robots" content="noindex">\n  ' : ''}<link rel="canonical" href="${url}">
  <meta name="theme-color" content="#435072">
  <link rel="icon" href="favicon.png" type="image/png">
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
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="netprogroup.css">
  <script src="main.js" defer></script>
</head>
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

function contactForm(id, compact) {
  return `<form class="contact-form${compact ? ' compact' : ''}" id="${id}" action="mailto:${EMAIL}" method="post" enctype="text/plain" novalidate>
            <div class="fields">
              <label><span class="visually-hidden">Adınız və soyadınız</span><input type="text" name="ad" placeholder="Adınız və soyadınız" autocomplete="name" required></label>
              <label><span class="visually-hidden">E-poçt ünvanınız</span><input type="email" name="email" placeholder="E-poçt ünvanınız" autocomplete="email" required></label>
              <label><span class="visually-hidden">Telefon nömrəniz</span><input type="tel" name="telefon" placeholder="Telefon nömrəniz" autocomplete="tel" pattern="[0-9 +()-]{7,}"></label>
            </div>
            <label class="msg"><span class="visually-hidden">Mesajınız</span><textarea name="mesaj" rows="7" placeholder="Mesajınız" required minlength="10"></textarea></label>
            <div class="form-foot">
              <button type="submit" class="btn btn-solid">Mesaj göndər</button>
              <p class="form-note">Göndər düyməsi e-poçt proqramınızı hazır mesajla açır.</p>
              <p class="form-status" role="status" aria-live="polite"></p>
            </div>
          </form>`;
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

function page(file, meta, body, active) {
  fs.writeFileSync(OUT + file, head({ ...meta, path: file }) + header(active || file) + `  <main id="main">\n${body}  </main>\n` + footer());
}

// ---------- index ----------
const slides = [
  ['Avadanlıqların quraşdırılması və konfiqurasiyası', 'Server otağından ofis şəbəkəsinə qədər — layihə, quraşdırma və sazlama.', 'xidmetler.html'],
  ['Fasiləsiz enerji həlləri', 'UPS, DC enerji sistemləri və enerji paylanması ilə işiniz dayanmır.', 'mehsullar-1.html'],
  ['İT infrastrukturuna daimi nəzarət', 'Serverləri, UPS-i və şəbəkəni 24/7 izləyir, problemi erkən tapırıq.', 'xidmetler.html#nezaret'],
];
const prodSlides = [
  ['slide-1', 'Enerji idarəetməsi və monitorinq', 'Bütün enerji avadanlığını bir paneldən izləyin.', 'mehsullar-6.html', 'Operator idarəetmə panelində işləyir'],
  ['slide-2', 'DC enerji sistemləri', 'Telekom və data mərkəzləri üçün etibarlı, genişlənə bilən DC enerji həlləri.', 'mehsullar-2.html', 'Sarı kabel kanalları olan enerji otağı'],
  ['slide-3', 'Enerji paylanması', 'Rack və şkaflar daxilində enerjinin təhlükəsiz paylanması.', 'mehsullar-3.html', 'Server şkafları sırası'],
];
const gallery = [
  ['1', 'Data mərkəzində sıra şəklində yerləşdirilmiş şkaflar, illüstrasiya'],
  ['2', 'Qaldırılmış döşəmə üzərində UPS və batareya şkafları'],
  ['3', 'Bina damında sənaye soyutma qurğusu'],
  ['4', 'Soyutma sistemi olan avadanlıq otağı, illüstrasiya'],
  ['5', 'Hündür qara server şkafı'],
];
const partners = ['vertiv', 'autotrox', 'delta', 'dealom', 'glossel', 'guardan'];
const brands = [['makelsan', 'Makelsan', 189, 26], ['vertiv', 'Vertiv', 153, 38], ['long', 'Long', 155, 38]];

page('index.html', {
  title: 'Net Pro Group – İT infrastrukturu, şəbəkə və enerji avadanlıqları',
  desc: 'Net Pro Group: server və şəbəkə avadanlığının quraşdırılması, UPS və DC enerji sistemləri, helpdesk və 24/7 monitorinq xidmətləri. Figma dizaynı əsasında təlim layihəsi.',
}, `    <section class="hero" aria-roledescription="karusel" aria-label="Əsas istiqamətlər">
      <div class="wrap hero-inner">
        <ul class="hero-brands" aria-label="Brendlər">
${brands.map(([f, n, w, h]) => `          <li><img src="img/brend/${f}.png" alt="${n}" width="${w}" height="${h}"></li>`).join('\n')}
        </ul>
        <h1 class="hero-kicker">İT infrastrukturu və enerji həlləri</h1>
${slides.map(([t, d, h], i) => `        <div class="hero-slide${i === 0 ? ' active' : ''}" data-slide="${i}"${i ? ' hidden' : ''}>
          <p class="hero-title">${t}</p>
          <p class="hero-text">${d}</p>
          <a href="${h}" class="btn btn-outline">Daha ətraflı »</a>
        </div>`).join('\n')}
        <div class="hero-bottom">
          <p class="counter" aria-live="polite"><b>01/</b> 03</p>
          <div class="arrows">
            <button type="button" class="arrow" data-hero="-1" aria-label="Əvvəlki slayd"><img src="img/ikon/arrow-left.png" alt="" width="36" height="36"></button>
            <button type="button" class="arrow" data-hero="1" aria-label="Növbəti slayd"><img src="img/ikon/arrow-right.png" alt="" width="36" height="36"></button>
          </div>
        </div>
      </div>
    </section>

    <section class="about-strip">
      <div class="wrap narrow center">
        <img src="img/logo-white.png" alt="" width="120" height="70" loading="lazy">
        <h2>“Net Pro Group” şirkəti haqqında</h2>
        <p>Net Pro Group kiçik və orta biznes üçün İT infrastrukturu qurur və ona xidmət göstərir. Server otaqlarının layihələndirilməsi, şəbəkə avadanlığının quraşdırılması, UPS və enerji sistemləri, helpdesk və daimi monitorinq — hamısı bir komandadan. Məqsədimiz sadədir: avadanlığınız dayanmadan işləsin, siz isə öz işinizlə məşğul olasınız.</p>
        <a href="haqqimizda.html" class="btn btn-light">Ətraflı »</a>
      </div>
    </section>

    <section class="partners">
      <div class="wrap partners-inner">
        <h2 class="big-title">Partnyorlar və müştərilər</h2>
        <ul class="logo-row">
${partners.map(p => `          <li><img src="img/partnyor/${p}.png" alt="${p[0].toUpperCase() + p.slice(1)}" loading="lazy"></li>`).join('\n')}
        </ul>
      </div>
    </section>

    <section class="products-strip" aria-label="Məhsullar">
      <div class="wrap center">
        <h2>Məhsullar</h2>
        <div class="prod-carousel">
          <button type="button" class="arrow" data-prod="-1" aria-label="Əvvəlki məhsul"><img src="img/ikon/arrow-left.png" alt="" width="36" height="36"></button>
          <div class="prod-stage">
${prodSlides.map(([img, t, d, h, alt], i) => `            <figure class="prod-slide${i === 0 ? ' active' : ''}"${i ? ' hidden' : ''}>
              <a href="${h}"><img src="img/${img}.webp" alt="${alt}" loading="lazy"></a>
              <figcaption><h3><a href="${h}">${t}</a></h3><p>${d}</p></figcaption>
            </figure>`).join('\n')}
          </div>
          <button type="button" class="arrow" data-prod="1" aria-label="Növbəti məhsul"><img src="img/ikon/arrow-right.png" alt="" width="36" height="36"></button>
        </div>
        <a href="mehsullar-1.html" class="btn btn-light">Bütün məhsullar »</a>
      </div>
    </section>

    <section class="services">
      <div class="wrap">
        <p class="eyebrow"><img src="img/ikon/tag.png" alt="" width="10" height="18"> Biz nə edirik?</p>
        <h2 class="section-title">Xidmətlər</h2>
        <ul class="svc-grid">
${SERVICES.slice(0, 6).map(([id, t, d]) => `          <li class="svc-card">
            <span class="svc-icon"><img src="img/ikon/tools.png" alt="" width="40" height="40"></span>
            <h3><a href="xidmetler.html#${id}">${t}</a></h3>
            <p>${d}</p>
          </li>`).join('\n')}
        </ul>
      </div>
    </section>

    <section class="brands-strip">
      <div class="wrap brands-inner">
        <h2 class="big-title light">Brendlər</h2>
        <ul class="logo-row boxed">
${brands.map(([f, n, w, h]) => `          <li><img src="img/brend/${f}.png" alt="${n}" width="${w}" height="${h}" loading="lazy"></li>`).join('\n')}
        </ul>
      </div>
    </section>

    <section class="gallery-home">
      <div class="wrap">
        <div class="row-between">
          <h2 class="section-title">Qalereya</h2>
          <div class="arrows">
            <button type="button" class="arrow dark" data-gal="-1" aria-label="Qalereyanı sola sürüşdür"><img src="img/ikon/arrow-left.png" alt="" width="36" height="36"></button>
            <button type="button" class="arrow dark" data-gal="1" aria-label="Qalereyanı sağa sürüşdür"><img src="img/ikon/arrow-right.png" alt="" width="36" height="36"></button>
          </div>
        </div>
        <ul class="gal-track" id="gal-track">
${gallery.map(([n, alt]) => `          <li><a href="qalereya.html"><img src="img/qalereya/${n}.webp" alt="${alt}" width="320" height="320" loading="lazy"></a></li>`).join('\n')}
        </ul>
      </div>
    </section>

    <section class="contact-section">
      <div class="wrap center">
        <h2 class="section-title">Suallarınız var?</h2>
        <p>Formu doldurun, yaxın zamanda sizinlə əlaqə saxlayacağıq.</p>
        ${contactForm('home-form')}
      </div>
    </section>
`);

// ---------- haqqimizda ----------
page('haqqimizda.html', {
  title: 'Haqqımızda – Net Pro Group',
  desc: 'Net Pro Group haqqında: İT infrastrukturu, şəbəkə və enerji avadanlıqları üzrə xidmət göstərən komanda, iş prinsiplərimiz və yanaşmamız.',
}, banner('Haqqımızda', [['index.html', 'Əsas səhifə'], ['', 'Haqqımızda']]) + `    <section class="about">
      <div class="wrap about-grid">
        <img src="img/haqqimizda-ofis.webp" alt="Şüşə fasadlı ofis binası" width="500" height="465" loading="lazy">
        <div>
          <h2>“Net Pro Group MMC” şirkəti haqqında</h2>
          <p>Net Pro Group İT infrastrukturu, şəbəkə və enerji avadanlıqları üzrə xidmət göstərən komandadır. Biz müştərinin ehtiyacını öyrənir, uyğun avadanlığı seçir, quraşdırır və sonra da sistemin sabit işləməsinə nəzarət edirik.</p>
          <p>Layihələrimizdə server otaqları, ofis şəbəkələri, fasiləsiz enerji mənbələri (UPS), DC enerji sistemləri və monitorinq həlləri var. Hər işi sənədləşdiririk ki, sistem sizin üçün şəffaf və idarə olunan olsun.</p>
        </div>
      </div>
      <div class="wrap about-grid reverse">
        <img src="img/haqqimizda-komanda.webp" alt="Komanda üzvləri noutbuklar arxasında iclas keçirir" width="500" height="465" loading="lazy">
        <div>
          <h2>Necə işləyirik</h2>
          <ul class="checks">
            <li><img src="img/ikon/check.png" alt="" width="20" height="20"> <span>Əvvəlcə obyekti yerində yoxlayır, sonra təklif hazırlayırıq.</span></li>
            <li><img src="img/ikon/check.png" alt="" width="20" height="20"> <span>Avadanlığı yükə və gələcək genişlənməyə uyğun seçirik.</span></li>
            <li><img src="img/ikon/check.png" alt="" width="20" height="20"> <span>Quraşdırmadan sonra sınaq aparır və sənədləri təhvil veririk.</span></li>
            <li><img src="img/ikon/check.png" alt="" width="20" height="20"> <span>Texniki xidmət və monitorinqi müqavilə əsasında davam etdiririk.</span></li>
          </ul>
          <a href="elaqe.html" class="btn btn-solid">Bizimlə əlaqə</a>
        </div>
      </div>
    </section>
`);

// ---------- mehsullar ----------
CATS.forEach((cat, idx) => {
  const prev = CATS[idx - 1], next = CATS[idx + 1];
  page(cat.file, {
    title: `${cat.name} – Məhsullar – Net Pro Group`,
    desc: cat.intro.slice(0, 155),
  }, banner(cat.name, [['index.html', 'Əsas səhifə'], ['mehsullar-1.html', 'Məhsullar'], ['', cat.name]]) + `    <section class="catalog">
      <div class="wrap catalog-grid">
        <aside class="cat-menu" aria-label="Məhsul kateqoriyaları">
          <h2>Kateqoriyalar</h2>
          <ul>
${CATS.map(c => `            <li><a href="${c.file}"${c === cat ? ' aria-current="page"' : ''}>${c.name}</a></li>`).join('\n')}
          </ul>
        </aside>
        <div class="cat-content">
          <p class="cat-intro">${cat.intro}</p>
          <ul class="product-list">
${cat.items.map(([img, name, desc, alt]) => `            <li class="product">
              <img src="img/mehsul/${img}.webp" alt="${alt}" width="190" height="152" loading="lazy">
              <div class="p-body">
                <h3>${name}</h3>
                <p>${desc}</p>
              </div>
              <a class="p-doc" href="elaqe.html?movzu=${encodeURIComponent(name + ' – broşür')}#form">
                <img src="img/ikon/pdf.png" alt="" width="24" height="24"> Broşür sorğusu
              </a>
            </li>`).join('\n')}
          </ul>
          <nav class="pager" aria-label="Kateqoriyalar arasında keçid">
            ${prev ? `<a href="${prev.file}" class="pg-arrow" aria-label="Əvvəlki kateqoriya: ${prev.name}">‹</a>` : '<span class="pg-arrow disabled" aria-hidden="true">‹</span>'}
${CATS.map((c, i) => `            <a href="${c.file}"${c === cat ? ' aria-current="page"' : ''} aria-label="${i + 1}. ${c.name}">${i + 1}</a>`).join('\n')}
            ${next ? `<a href="${next.file}" class="pg-arrow" aria-label="Növbəti kateqoriya: ${next.name}">›</a>` : '<span class="pg-arrow disabled" aria-hidden="true">›</span>'}
          </nav>
        </div>
      </div>
    </section>
`, cat.file);
});

// ---------- xidmetler ----------
page('xidmetler.html', {
  title: 'Xidmətlər və həllər – Net Pro Group',
  desc: 'Avadanlıqların quraşdırılması, təhlükəsizlik, helpdesk, İT xidmətləri, ofis avadanlığının təmiri, avadanlıqların yenilənməsi və 24/7 monitorinq.',
}, banner('Xidmətlər və həllər', [['index.html', 'Əsas səhifə'], ['', 'Xidmətlər və həllər']]) + `    <section class="services services-page">
      <div class="wrap">
        <h2 class="section-title">Xidmət və həllərin növləri</h2>
        <ul class="svc-photo-grid">
${SERVICES.map(([id, t, d, alt]) => `          <li class="svc-photo" id="${id}">
            <img src="img/xidmet/${id}.webp" alt="${alt}" loading="lazy">
            <h3>${t}</h3>
            <p>${d}</p>
          </li>`).join('\n')}
        </ul>
        <p class="center cta-line"><a href="elaqe.html" class="btn btn-solid">Xidmət sifariş et</a></p>
      </div>
    </section>
`);

// ---------- qalereya ----------
const galAll = [
  ...gallery.map(([n, alt]) => [`qalereya/${n}`, alt]),
  ['xidmet/qurasdirma', 'Texnik server şkafında avadanlıq quraşdırır'],
  ['xidmet/it', 'İki mühəndis server otağında işləyir'],
  ['hero', 'Ağ işıqlı data mərkəzi dəhlizi'],
];
page('qalereya.html', {
  title: 'Qalereya – Net Pro Group',
  desc: 'Data mərkəzi, server otağı, enerji və soyutma avadanlıqlarına aid illüstrativ şəkillər qalereyası.',
}, banner('Qalereya', [['index.html', 'Əsas səhifə'], ['', 'Qalereya']]) + `    <section class="gallery-page">
      <div class="wrap">
        <h2 class="section-title center">Data mərkəzi və avadanlıq</h2>
        <p class="center muted">Şəkillər illüstrativdir. Böyütmək üçün şəklin üzərinə klikləyin.</p>
        <ul class="gal-grid">
${galAll.map(([src, alt]) => `          <li><button type="button" class="gal-open" data-full="img/${src}.webp" aria-label="Şəkli böyüt: ${alt}"><img src="img/${src}.webp" alt="${alt}" loading="lazy"></button></li>`).join('\n')}
        </ul>
      </div>
      <dialog class="lightbox" id="lightbox" aria-label="Şəkil">
        <img src="img/hero.webp" alt="">
        <button type="button" class="lb-close" aria-label="Bağla">×</button>
      </dialog>
    </section>
`);

// ---------- elaqe ----------
page('elaqe.html', {
  title: 'Əlaqə – Net Pro Group',
  desc: 'Net Pro Group ilə əlaqə: sualınızı və ya sifarişinizi formla göndərin. Ünvan, telefon və e-poçt nümunə məlumatlardır.',
}, banner('Əlaqə', [['index.html', 'Əsas səhifə'], ['', 'Əlaqə']]) + `    <section class="contact-page">
      <div class="wrap contact-grid">
        <ul class="contact-cards">
          <li><span class="ci"><img src="img/ikon/pin.png" alt="" width="14" height="18"></span><div><h2>Ünvan</h2><p>${ADDRESS}</p></div></li>
          <li><span class="ci"><img src="img/ikon/phone.png" alt="" width="18" height="18"></span><div><h2>Telefon</h2><p><a href="tel:${PHONE1_TEL}">${PHONE1}</a><br><a href="tel:${PHONE2_TEL}">${PHONE2}</a></p></div></li>
          <li><span class="ci"><img src="img/ikon/mail.png" alt="" width="18" height="14"></span><div><h2>E-poçt</h2><p><a href="mailto:${EMAIL}">${EMAIL}</a></p></div></li>
        </ul>
        <div class="contact-box" id="form">
          <h2 class="section-title">Suallarınız var?</h2>
          <p>Formu doldurun, yaxın zamanda sizinlə əlaqə saxlayacağıq.</p>
          ${contactForm('contact-form', true)}
        </div>
      </div>
      <div class="map">
        <iframe title="Bakı şəhərinin xəritəsi (nümunə)" src="https://www.openstreetmap.org/export/embed.html?bbox=49.80%2C40.36%2C49.90%2C40.42&amp;layer=mapnik" loading="lazy"></iframe>
      </div>
    </section>
`);

// ---------- search ----------
const index = [
  ...NAV.map(([h, l]) => ({ t: l, u: h, d: 'Səhifə' })),
  ...CATS.map(c => ({ t: c.name, u: c.file, d: c.intro })),
  ...CATS.flatMap(c => c.items.map(([, n, d]) => ({ t: n, u: c.file, d }))),
  ...SERVICES.map(([id, t, d]) => ({ t, u: 'xidmetler.html#' + id, d })),
];
fs.writeFileSync(OUT + 'search-index.json', JSON.stringify(index, null, 1));
page('search.html', {
  title: 'Axtarış – Net Pro Group',
  desc: 'Net Pro Group saytında məhsul, xidmət və səhifələr üzrə axtarış.',
}, banner('Axtarış', [['index.html', 'Əsas səhifə'], ['', 'Axtarış']]) + `    <section class="search-page">
      <div class="wrap narrow">
        <form class="search-form" role="search" action="search.html" method="get">
          <label for="q" class="visually-hidden">Axtarış sözü</label>
          <input id="q" name="q" type="search" placeholder="Məs.: UPS, helpdesk, monitorinq" autocomplete="off">
          <button type="submit" class="btn btn-solid">Axtar</button>
        </form>
        <p class="search-count" id="search-count" role="status" aria-live="polite"></p>
        <ul class="search-results" id="search-results"></ul>
      </div>
    </section>
`, 'search.html');

// ---------- 404 ----------
const notFound = (file) => page(file, {
  title: 'Səhifə tapılmadı – Net Pro Group', desc: 'Axtardığınız səhifə tapılmadı.', noindex: true,
}, `    <section class="not-found">
      <div class="wrap nf-grid">
        <div>
          <img src="img/ikon/404.png" alt="404" width="270" height="109">
          <h1>Axtardığınız səhifə tapılmadı!</h1>
          <p>Səhifə köçürülmüş və ya silinmiş ola bilər.</p>
          <p class="nf-actions"><a href="index.html" class="btn btn-solid">Əsas səhifəyə qayıt</a> <a href="search.html" class="btn btn-outline-dark">Saytda axtar</a></p>
        </div>
        <img src="img/xeta-404.webp" alt="Xəbərdarlıq lenti ilə əhatə olunmuş server şkafları" width="648" height="398" loading="lazy">
      </div>
    </section>
`, 'none');
notFound('404.html');
// 404.html is served from any depth, so use absolute asset paths there
let nf = fs.readFileSync(OUT + '404.html', 'utf8');
nf = nf.replace(/(href|src)="(?!https?:|mailto:|tel:|#|\/)([^"]+)"/g, '$1="/net-pro-group-fiqma/$2"');
fs.writeFileSync(OUT + '404.html', nf);

console.log('built');
