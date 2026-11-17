const fs = require('fs');
const path = require('path');
const { HERO_VIDEO, EMAIL, PHONE1, PHONE1_TEL, PHONE2, PHONE2_TEL, HOURS, CATS, SERVICES, slides, gallery, partners, brands } = require('../data');
const { CAT_ICONS } = require('../lib/layout');
const { contactForm } = require('../lib/form');
const { img } = require('../lib/img');
const { icon } = require('../lib/icons');

const NPG = '<span translate="no">Net Pro Group</span>';
const SVC_ICONS = { qurasdirma: 'tools', tehlukesizlik: 'shield', helpdesk: 'headset', it: 'cpu', temir: 'wrench', yenilenme: 'refresh', nezaret: 'activity' };
const SLIDE_ICONS = ['tools', 'bolt', 'monitor'];
const firstSentence = s => s.split(/(?<=\.)\s/)[0];
const pName = p => p[0].toUpperCase() + p.slice(1);
// UPS / DC etc. are tech names: keep them untranslated
const tech = s => s.replace(/\b(UPS|DC|AC|PDU|SNMP|VPN)\b/g, '<span translate="no">$1</span>');

// Hero video (behind HERO_VIDEO.ready in tools/data.js). Sources are attached by tools/js/25-hero-video.js only when
// the hero is on screen and reduced motion is off; otherwise only the poster image (= the clip's final frame) shows.
function heroVideo() {
  if (!HERO_VIDEO.ready) return '';
  const V = HERO_VIDEO;
  for (const f of [V.mp4, V.poster, V.webm].filter(Boolean)) {
    if (!fs.existsSync(path.join(__dirname, '..', '..', f))) throw new Error('HERO_VIDEO.ready is true but ' + f + ' is missing');
  }
  const sources = [V.webm && `data-webm="${V.webm}"`, `data-mp4="${V.mp4}"`].filter(Boolean).join(' ');
  return `
        <figure class="hero-video" style="--hv-ratio: ${V.width} / ${V.height}">
          <div class="hero-video-frame">
            <img class="hero-video-poster" src="${V.poster}" alt="${V.label}" width="${V.width}" height="${V.height}" fetchpriority="high">
            <video class="hero-video-clip" muted playsinline preload="none" poster="${V.poster}" width="${V.width}" height="${V.height}" ${sources} aria-hidden="true" tabindex="-1"></video>
            <button type="button" class="hero-video-replay" hidden>${icon('refresh', { size: 18 })} <span>Yenidən oynat</span></button>
          </div>
          <figcaption class="hero-video-caption">${icon('info', { size: 14 })} ${V.caption}</figcaption>
        </figure>`;
}

module.exports = function (page) {
page('index.html', {
  title: 'Net Pro Group – İT infrastrukturu, şəbəkə və enerji avadanlıqları',
  desc: 'Net Pro Group: server və şəbəkə avadanlığının quraşdırılması, UPS və DC enerji sistemləri, helpdesk və 24/7 monitorinq xidmətləri. Figma dizaynı əsasında təlim layihəsi.',
}, `    <section class="home-hero on-dark${HERO_VIDEO.ready ? ' home-hero--video' : ''}" aria-labelledby="hero-title">
      <div class="home-hero-media" aria-hidden="true">
        ${img('hero.webp', { eager: true, cls: 'home-hero-img', sizes: '100vw' })}
      </div>
      <div class="wrap home-hero-inner">
        <div class="home-hero-copy">
          <p class="eyebrow">${NPG}</p>
          <h1 id="hero-title">İT infrastrukturu və enerji həlləri</h1>
          <p class="lead">İT infrastrukturu, şəbəkə və enerji avadanlıqları üzrə xidmətlər. Biz müştərinin ehtiyacını öyrənir, uyğun avadanlığı seçir, quraşdırır və sonra da sistemin sabit işləməsinə nəzarət edirik.</p>
          <div class="btn-row">
            <a href="mehsullar-1.html" class="btn btn--primary">Məhsullar ${icon('arrow-right')}</a>
            <a href="xidmetler.html" class="btn btn--ghost">Xidmətlər</a>
          </div>
        </div>${heroVideo()}
        <ul class="directions" aria-label="Əsas istiqamətlər">
${slides.map(([t, d, h], i) => `          <li class="direction">
            <span class="direction-ico">${icon(SLIDE_ICONS[i], { size: 22 })}</span>
            <h2 class="direction-title"><a class="stretched" href="${h}">${t}</a></h2>
            <p>${tech(d)}</p>
            <span class="direction-more" aria-hidden="true">Ətraflı ${icon('arrow-right', { size: 16 })}</span>
          </li>`).join('\n')}
        </ul>
        <div class="hero-brands">
          <p class="hero-brands-label" id="brands-label">Brendlər</p>
          <ul aria-labelledby="brands-label">
${brands.map(([f, n]) => `            <li translate="no">${img('brend/' + f + '.png', { alt: n })}</li>`).join('\n')}
          </ul>
        </div>
      </div>
    </section>

    <section class="section home-about">
      <div class="wrap home-about-grid">
        <div class="home-about-media">
          ${img('haqqimizda-ofis.webp', { alt: 'Şüşə fasadlı ofis binası', cls: 'home-about-img' })}
          ${img('haqqimizda-komanda.webp', { alt: 'Komanda üzvləri noutbuklar arxasında iclas keçirir', cls: 'home-about-img2' })}
        </div>
        <div class="home-about-copy">
          <p class="eyebrow">Haqqımızda</p>
          <h2 class="section-title">“${NPG}” şirkəti haqqında</h2>
          <p class="lead">${NPG} kiçik və orta biznes üçün İT infrastrukturu qurur və ona xidmət göstərir. Server otaqlarının layihələndirilməsi, şəbəkə avadanlığının quraşdırılması, <span translate="no">UPS</span> və enerji sistemləri, helpdesk və daimi monitorinq — hamısı bir komandadan.</p>
          <p class="home-about-quote">Məqsədimiz sadədir: avadanlığınız dayanmadan işləsin, siz isə öz işinizlə məşğul olasınız.</p>
          <a href="haqqimizda.html" class="btn btn--ghost">Ətraflı ${icon('arrow-right')}</a>
        </div>
      </div>
    </section>

    <section class="section section--alt" aria-labelledby="products-title">
      <div class="wrap">
        <div class="section-head section-head--row">
          <div>
            <p class="eyebrow">Məhsullar</p>
            <h2 class="section-title" id="products-title">Məhsul kateqoriyaları</h2>
          </div>
          <a href="mehsullar-1.html" class="link-arrow">Bütün məhsullar ${icon('arrow-right')}</a>
        </div>
        <ul class="grid grid--3 cat-grid">
${CATS.map((c, i) => `          <li class="card cat-card">
            <div class="cat-media">${img('mehsul/' + c.items[0][0] + '.webp', { alt: c.items[0][3] })}</div>
            <div class="cat-body">
              <span class="cat-ico">${icon(CAT_ICONS[i], { size: 20 })}</span>
              <h3><a class="stretched" href="${c.file}">${tech(c.name)}</a></h3>
              <p>${tech(firstSentence(c.intro))}</p>
              <span class="cat-more" aria-hidden="true">Ətraflı ${icon('arrow-right', { size: 16 })}</span>
            </div>
          </li>`).join('\n')}
        </ul>
      </div>
    </section>

    <section class="section" aria-labelledby="services-title">
      <div class="wrap">
        <div class="section-head section-head--row">
          <div>
            <p class="eyebrow">Biz nə edirik?</p>
            <h2 class="section-title" id="services-title">Xidmətlər</h2>
          </div>
          <a href="xidmetler.html" class="link-arrow">Bütün xidmətlər ${icon('arrow-right')}</a>
        </div>
        <ul class="grid grid--4 svc-grid">
${SERVICES.map(([id, t, d]) => `          <li class="card svc-card">
            <span class="icon-tile">${icon(SVC_ICONS[id] || 'tools', { size: 26 })}</span>
            <h3><a class="stretched" href="xidmetler.html#${id}">${t}</a></h3>
            <p>${tech(d)}</p>
          </li>`).join('\n')}
          <li class="svc-card svc-card--cta on-dark">
            <h3>Layihəniz üçün uyğun həll lazımdır?</h3>
            <a href="elaqe.html#form" class="btn btn--primary">Sorğu göndər ${icon('arrow-right')}</a>
          </li>
        </ul>
      </div>
    </section>

    <section class="section section--tight section--alt partners" aria-labelledby="partners-title">
      <div class="wrap partners-inner">
        <h2 class="partners-title" id="partners-title">Partnyorlar və müştərilər</h2>
        <!-- several partner PNGs are pale and semi-transparent: this filter re-inks them in one slate tone (alpha x4) -->
        <svg class="visually-hidden" aria-hidden="true" focusable="false"><filter id="logo-ink" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 0.29  0 0 0 0 0.33  0 0 0 0 0.41  0 0 0 4 0"/></filter></svg>
        <ul class="logo-wall">
${partners.map(p => `          <li translate="no">${img('partnyor/' + p + '.png', { alt: pName(p) })}</li>`).join('\n')}
        </ul>
      </div>
    </section>

    <section class="section home-gallery" aria-labelledby="gallery-title">
      <div class="wrap">
        <div class="section-head section-head--row">
          <div>
            <p class="eyebrow">Şəkillər</p>
            <h2 class="section-title" id="gallery-title">Qalereya</h2>
          </div>
          <div class="gal-controls">
            <a href="qalereya.html" class="link-arrow">Bütün qalereya ${icon('arrow-right')}</a>
            <button type="button" class="round-btn" data-gal="-1" aria-label="Qalereyanı sola sürüşdür" aria-controls="gal-track">${icon('arrow-left', { size: 20 })}</button>
            <button type="button" class="round-btn" data-gal="1" aria-label="Qalereyanı sağa sürüşdür" aria-controls="gal-track">${icon('arrow-right', { size: 20 })}</button>
          </div>
        </div>
      </div>
      <ul class="gal-track" id="gal-track" tabindex="0" aria-label="Qalereya şəkilləri">
${gallery.map(([n, alt]) => `        <li><a href="qalereya.html">${img('qalereya/' + n + '.webp', { alt })}</a></li>`).join('\n')}
      </ul>
    </section>

    <section class="section home-contact" id="sorgu" aria-labelledby="contact-title">
      <div class="wrap">
        <div class="contact-panel on-dark">
          <div class="contact-panel-copy">
            <p class="eyebrow">Əlaqə</p>
            <h2 class="section-title" id="contact-title">Suallarınız var?</h2>
            <p class="lead">Formu doldurun, yaxın zamanda sizinlə əlaqə saxlayacağıq.</p>
            <ul class="quick-contact">
              <li><span class="qc-ico">${icon('phone', { size: 20 })}</span><span><span class="qc-label">Telefon</span><a href="tel:${PHONE1_TEL}">${PHONE1}</a><br><a href="tel:${PHONE2_TEL}">${PHONE2}</a></span></li>
              <li><span class="qc-ico">${icon('mail', { size: 20 })}</span><span><span class="qc-label">E-poçt</span><a href="mailto:${EMAIL}">${EMAIL}</a></span></li>
              <li><span class="qc-ico">${icon('clock', { size: 20 })}</span><span><span class="qc-label">İş saatları</span>${HOURS}</span></li>
            </ul>
          </div>
          <div class="contact-panel-form">
            ${contactForm('home-form')}
          </div>
        </div>
      </div>
    </section>
`);

};
