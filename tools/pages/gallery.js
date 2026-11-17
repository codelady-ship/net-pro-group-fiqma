const { HOURS, FAQ, SITE, EMAIL, PHONE1, PHONE1_TEL, PHONE2, PHONE2_TEL, ADDRESS, CATS, SERVICES, NAV, slides, prodSlides, gallery, partners, brands } = require('../data');
const { esc, banner } = require('../lib/layout');
const { contactForm } = require('../lib/form');
const { img } = require('../lib/img');
const { icon } = require('../lib/icons');

module.exports = function (page) {
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

};
