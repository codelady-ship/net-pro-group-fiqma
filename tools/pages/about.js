const { HOURS, FAQ, SITE, EMAIL, PHONE1, PHONE1_TEL, PHONE2, PHONE2_TEL, ADDRESS, CATS, SERVICES, NAV, slides, prodSlides, gallery, partners, brands } = require('../data');
const { esc, banner } = require('../lib/layout');
const { contactForm } = require('../lib/form');
const { img } = require('../lib/img');
const { icon } = require('../lib/icons');

module.exports = function (page) {
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

};
