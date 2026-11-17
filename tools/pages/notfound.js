const { img } = require('../lib/img');
const { icon } = require('../lib/icons');

module.exports = function (page) {
const notFound = (file) => page(file, {
  title: 'Səhifə tapılmadı – Net Pro Group', desc: 'Axtardığınız səhifə tapılmadı.', noindex: true,
}, `    <section class="not-found">
      <div class="wrap nf-grid">
        <div class="nf-copy">
          <p class="nf-code" aria-hidden="true">404</p>
          <p class="eyebrow">Xəta 404</p>
          <h1>Axtardığınız səhifə tapılmadı!</h1>
          <p class="lead">Səhifə köçürülmüş və ya silinmiş ola bilər.</p>
          <div class="btn-row">
            <a href="index.html" class="btn btn--primary">${icon('home')} Əsas səhifəyə qayıt</a>
            <a href="search.html" class="btn btn--ghost">${icon('search')} Saytda axtar</a>
          </div>
        </div>
        <div class="nf-media">
          ${img('xeta-404.webp', { alt: 'Xəbərdarlıq lenti ilə əhatə olunmuş server şkafları', eager: true })}
        </div>
      </div>
    </section>
`, 'none');
notFound('404.html');
};
