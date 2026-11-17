const { HOURS, FAQ, SITE, EMAIL, PHONE1, PHONE1_TEL, PHONE2, PHONE2_TEL, ADDRESS, CATS, SERVICES, NAV, slides, prodSlides, gallery, partners, brands } = require('../data');
const { esc, banner } = require('../lib/layout');
const { contactForm } = require('../lib/form');
const { img } = require('../lib/img');
const { icon } = require('../lib/icons');

module.exports = function (page) {
const notFound = (file) => page(file, {
  title: 'Səhifə tapılmadı – Net Pro Group', desc: 'Axtardığınız səhifə tapılmadı.', noindex: true,
}, `    <section class="not-found">
      <div class="wrap nf-grid">
        <div>
          <img src="img/ikon/404.png" alt="404" width="270" height="109">
          <h1>Axtardığınız səhifə tapılmadı!</h1>
          <p>Səhifə köçürülmüş və ya silinmiş ola bilər.</p>
          <p class="nf-actions"><a href="index.html" class="btn btn-solid">Əsas səhifəyə qayıt</a> <a href="search.html" class="btn btn-outline-dark">Saytda axtar</a></p>
        </div>
        <img src="img/xeta-404.webp" alt="Xəbərdarlıq lenti ilə əhatə olunmuş server şkafları" width="648" height="398" loading="lazy">
      </div>
    </section>
`, 'none');
notFound('404.html');
};
