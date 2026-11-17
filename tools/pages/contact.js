const { HOURS, FAQ, EMAIL, PHONE1, PHONE1_TEL, PHONE2, PHONE2_TEL, ADDRESS } = require('../data');
const { banner } = require('../lib/layout');
const { contactForm } = require('../lib/form');
const { icon } = require('../lib/icons');

module.exports = function (page) {
const info = [
  ['pin', 'Ünvan', `<p>${ADDRESS}</p>`],
  ['phone', 'Telefon', `<p><a href="tel:${PHONE1_TEL}">${PHONE1}</a></p><p><a href="tel:${PHONE2_TEL}">${PHONE2}</a></p>`],
  ['mail', 'E-poçt', `<p><a href="mailto:${EMAIL}">${EMAIL}</a></p>`],
  ['clock', 'İş saatları', `<p>${HOURS}</p>`],
];
page('elaqe.html', {
  title: 'Əlaqə – Net Pro Group',
  desc: 'Net Pro Group ilə əlaqə: sualınızı və ya sifarişinizi formla göndərin və iş saatlarına baxın. Ünvan, telefon və e-poçt nümunə məlumatlardır.',
}, banner('Əlaqə', [['index.html', 'Əsas səhifə'], ['', 'Əlaqə']]) + `    <section class="section contact-page">
      <div class="wrap contact-layout">
        <div class="contact-aside">
          <div class="section-head">
            <p class="eyebrow">Əlaqə məlumatları</p>
            <h2 class="section-title">Bizimlə əlaqə</h2>
            <p class="lead">Zəng edin, yazın və ya formu doldurun.</p>
          </div>
          <ul class="contact-cards">
${info.map(([ic, h, body]) => `            <li class="contact-card"><span class="cc-icon">${icon(ic, { size: 22 })}</span><div><h3>${h}</h3>${body}</div></li>`).join('\n')}
          </ul>
          <p class="contact-sample">${icon('info', { size: 16 })}<span>Ünvan, telefon və e-poçt nümunə məlumatlardır.</span></p>
        </div>
        <div class="contact-box" id="form">
          <h2 class="section-title">Suallarınız var?</h2>
          <p class="lead">Formu doldurun, yaxın zamanda sizinlə əlaqə saxlayacağıq.</p>
          ${contactForm('contact-form', true)}
        </div>
      </div>
    </section>
    <section class="section section--alt faq" aria-labelledby="faq-title">
      <div class="wrap faq-layout">
        <div class="section-head">
          <p class="eyebrow">Sual-cavab</p>
          <h2 class="section-title" id="faq-title">Tez-tez verilən suallar</h2>
        </div>
        <div class="faq-list">
${FAQ.map(([q, a]) => `          <details class="faq-item">
            <summary><span class="faq-q">${q}</span>${icon('chevron-down', { size: 20, cls: 'faq-chev' })}</summary>
            <div class="faq-a"><p>${a}</p></div>
          </details>`).join('\n')}
        </div>
      </div>
    </section>
    <section class="section contact-map" aria-label="Xəritə">
      <div class="wrap">
        <div class="map">
          <iframe title="Bakı şəhərinin xəritəsi (nümunə)" src="https://www.openstreetmap.org/export/embed.html?bbox=49.80%2C40.36%2C49.90%2C40.42&amp;layer=mapnik" loading="lazy"></iframe>
        </div>
      </div>
    </section>
`);

};
