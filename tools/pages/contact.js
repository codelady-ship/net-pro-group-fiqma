const { HOURS, FAQ, SITE, EMAIL, PHONE1, PHONE1_TEL, PHONE2, PHONE2_TEL, ADDRESS, CATS, SERVICES, NAV, slides, prodSlides, gallery, partners, brands } = require('../data');
const { esc, banner } = require('../lib/layout');
const { contactForm } = require('../lib/form');
const { img } = require('../lib/img');
const { icon } = require('../lib/icons');

module.exports = function (page) {
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

};
