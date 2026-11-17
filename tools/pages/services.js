const { SERVICES } = require('../data');
const { banner } = require('../lib/layout');
const { img } = require('../lib/img');
const { icon } = require('../lib/icons');

const SVC_ICONS = { qurasdirma: 'tools', tehlukesizlik: 'shield', helpdesk: 'headset', it: 'server', temir: 'wrench', yenilenme: 'refresh', nezaret: 'monitor' };
const TECH_RE = /\b(UPS|VPN|Firewall|24\/7)\b/g;
const noTranslate = s => s.replace(TECH_RE, '<span translate="no">$1</span>');

module.exports = function (page) {
page('xidmetler.html', {
  title: 'Xidmətlər və həllər – Net Pro Group',
  desc: 'Avadanlıqların quraşdırılması, təhlükəsizlik, helpdesk, İT xidmətləri, ofis avadanlığının təmiri, avadanlıqların yenilənməsi və 24/7 monitorinq.',
}, banner('Xidmətlər və həllər', [['index.html', 'Əsas səhifə'], ['', 'Xidmətlər və həllər']]) + `    <section class="section services-page">
      <div class="wrap">
        <div class="section-head">
          <p class="eyebrow">Xidmətlər</p>
          <h2 class="section-title">Xidmət və həllərin növləri</h2>
        </div>
        <nav class="svc-index" aria-label="Xidmətlər üzrə keçid">
          <ul>
${SERVICES.map(([id, t]) => `            <li><a class="chip" href="#${id}">${icon(SVC_ICONS[id] || 'layers', { size: 16 })}${noTranslate(t)}</a></li>`).join('\n')}
          </ul>
        </nav>
        <ol class="svc-list">
${SERVICES.map(([id, t, d, alt], i) => `          <li class="svc-item" id="${id}">
            <div class="svc-media">${img('xidmet/' + id + '.webp', { alt, sizes: '(min-width: 1024px) 560px, 92vw' })}</div>
            <div class="svc-body">
              <p class="svc-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</p>
              <span class="svc-icon">${icon(SVC_ICONS[id] || 'layers', { size: 28 })}</span>
              <h3 class="svc-title">${noTranslate(t)}</h3>
              <p class="svc-text">${noTranslate(d)}</p>
              <a class="btn btn--ghost btn--sm" href="elaqe.html?movzu=${encodeURIComponent(t)}#form">Bu xidmət üzrə sorğu ${icon('arrow-right', { size: 18 })}</a>
            </div>
          </li>`).join('\n')}
        </ol>
        <aside class="svc-cta" aria-label="Xidmət sifarişi">
          <div>
            <p class="svc-cta-title">Hansı xidmət lazımdır?</p>
            <p>Tapşırığı qısa yazın – sizinlə əlaqə saxlayıb detalları dəqiqləşdirək.</p>
          </div>
          <a href="elaqe.html#form" class="btn btn--light">Xidmət sifariş et ${icon('arrow-right', { size: 20 })}</a>
        </aside>
      </div>
    </section>
`);

};
