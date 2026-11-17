const { HOURS, FAQ, SITE, EMAIL, PHONE1, PHONE1_TEL, PHONE2, PHONE2_TEL, ADDRESS, CATS, SERVICES, NAV, slides, prodSlides, gallery, partners, brands } = require('../data');
const { esc, banner } = require('../lib/layout');
const { contactForm } = require('../lib/form');
const { img } = require('../lib/img');
const { icon } = require('../lib/icons');

module.exports = function (page) {
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

};
