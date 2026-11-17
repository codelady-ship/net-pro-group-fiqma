const { HOURS, FAQ, SITE, EMAIL, PHONE1, PHONE1_TEL, PHONE2, PHONE2_TEL, ADDRESS, CATS, SERVICES, NAV, slides, prodSlides, gallery, partners, brands } = require('../data');
const { esc, banner } = require('../lib/layout');
const { contactForm } = require('../lib/form');
const { img } = require('../lib/img');
const { icon } = require('../lib/icons');

module.exports = function (page) {
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

};
