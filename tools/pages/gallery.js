const { gallery } = require('../data');
const { banner } = require('../lib/layout');
const { img } = require('../lib/img');
const { icon } = require('../lib/icons');

module.exports = function (page) {
// Order + tile sizes chosen for the source sizes (hero is the largest file; qalereya/5 is portrait).
const extra = { hero: ['hero', 'Ağ işıqlı data mərkəzi dəhlizi', 'big'], it: ['xidmet/it', 'İki mühəndis server otağında işləyir', 'big-lg'], q: ['xidmet/qurasdirma', 'Texnik server şkafında avadanlıq quraşdırır', 'tall-lg'] };
const galAll = [
  extra.hero,
  ...gallery.map(([n, alt]) => ['qalereya/' + n, alt, n === '5' ? 'tall crop' : 'crop']),
  extra.it,
  extra.q,
];
page('qalereya.html', {
  title: 'Qalereya – Net Pro Group',
  desc: 'Data mərkəzi, server otağı, UPS, enerji və soyutma avadanlıqlarına aid illüstrativ şəkillər qalereyası: şəklə toxunun və böyük ölçüdə baxın.',
}, banner('Qalereya', [['index.html', 'Əsas səhifə'], ['', 'Qalereya']]) + `    <section class="section gallery-page">
      <div class="wrap">
        <div class="section-head">
          <p class="eyebrow">Qalereya</p>
          <h2 class="section-title">Data mərkəzi və avadanlıq</h2>
          <p class="lead gal-note">${icon('info', { size: 18 })}<span>Şəkillər illüstrativdir. Böyütmək üçün şəklin üzərinə klikləyin.</span></p>
        </div>
        <ul class="gal-grid">
${galAll.map(([src, alt, size]) => `          <li class="gal-item${size ? size.split(' ').map(s => ' gal-item--' + s).join('') : ''}"><button type="button" class="gal-open" data-full="img/${src}.webp" aria-label="Şəkli böyüt: ${alt}">${img(src + '.webp', { alt, sizes: '(min-width: 1024px) 50vw, 100vw' })}<span class="gal-zoom" aria-hidden="true">${icon('expand', { size: 20 })}</span></button></li>`).join('\n')}
        </ul>
      </div>
      <dialog class="lightbox" id="lightbox" aria-label="Şəkil">
        <figure class="lb-figure">
          <img class="lb-img" src="img/hero.webp" alt="" width="1282" height="625">
          <figcaption class="lb-bar"><span class="lb-caption"></span><span class="lb-count" aria-hidden="true"></span></figcaption>
        </figure>
        <button type="button" class="lb-btn lb-prev" aria-label="Əvvəlki şəkil">${icon('arrow-left')}</button>
        <button type="button" class="lb-btn lb-next" aria-label="Növbəti şəkil">${icon('arrow-right')}</button>
        <button type="button" class="lb-btn lb-close" aria-label="Bağla">${icon('close')}</button>
      </dialog>
    </section>
`);

};
