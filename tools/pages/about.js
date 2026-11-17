const { banner } = require('../lib/layout');
const { img } = require('../lib/img');
const { icon } = require('../lib/icons');

const NPG = '<span translate="no">Net Pro Group</span>';
const STEPS = [
  'Əvvəlcə obyekti yerində yoxlayır, sonra təklif hazırlayırıq.',
  'Avadanlığı yükə və gələcək genişlənməyə uyğun seçirik.',
  'Quraşdırmadan sonra sınaq aparır və sənədləri təhvil veririk.',
  'Texniki xidmət və monitorinqi müqavilə əsasında davam etdiririk.',
];

module.exports = function (page) {
page('haqqimizda.html', {
  title: 'Haqqımızda – Net Pro Group',
  desc: 'Net Pro Group haqqında: İT infrastrukturu, şəbəkə və enerji avadanlıqları üzrə xidmət göstərən komanda, iş prinsiplərimiz və yanaşmamız.',
}, banner('Haqqımızda', [['index.html', 'Əsas səhifə'], ['', 'Haqqımızda']]) + `    <section class="section about-section">
      <div class="wrap about-row">
        <div class="about-media">
          ${img('haqqimizda-ofis.webp', { alt: 'Şüşə fasadlı ofis binası' })}
        </div>
        <div class="about-copy">
          <p class="eyebrow">Şirkət</p>
          <h2 class="section-title">“<span translate="no">Net Pro Group MMC</span>” şirkəti haqqında</h2>
          <p class="lead">${NPG} İT infrastrukturu, şəbəkə və enerji avadanlıqları üzrə xidmət göstərən komandadır. Biz müştərinin ehtiyacını öyrənir, uyğun avadanlığı seçir, quraşdırır və sonra da sistemin sabit işləməsinə nəzarət edirik.</p>
          <p>Layihələrimizdə server otaqları, ofis şəbəkələri, fasiləsiz enerji mənbələri (<span translate="no">UPS</span>), <span translate="no">DC</span> enerji sistemləri və monitorinq həlləri var. Hər işi sənədləşdiririk ki, sistem sizin üçün şəffaf və idarə olunan olsun.</p>
        </div>
      </div>
    </section>

    <section class="section section--alt about-section">
      <div class="wrap about-row about-row--reverse">
        <div class="about-media">
          ${img('haqqimizda-komanda.webp', { alt: 'Komanda üzvləri noutbuklar arxasında iclas keçirir' })}
        </div>
        <div class="about-copy">
          <p class="eyebrow">Yanaşma</p>
          <h2 class="section-title">Necə işləyirik</h2>
          <ol class="about-steps">
${STEPS.map(s => `            <li><span class="step-ico">${icon('check', { size: 18 })}</span><span>${s}</span></li>`).join('\n')}
          </ol>
        </div>
      </div>
    </section>

    <section class="section about-cta-section">
      <div class="wrap">
        <div class="cta-band on-dark">
          <div>
            <h2 class="section-title">Bizimlə əlaqə</h2>
            <p class="lead">Suallarınız var? Formu doldurun, yaxın zamanda sizinlə əlaqə saxlayacağıq.</p>
          </div>
          <div class="btn-row">
            <a href="elaqe.html" class="btn btn--primary">Bizimlə əlaqə ${icon('arrow-right')}</a>
            <a href="xidmetler.html" class="btn btn--ghost">Xidmətlər</a>
          </div>
        </div>
      </div>
    </section>
`);

};
