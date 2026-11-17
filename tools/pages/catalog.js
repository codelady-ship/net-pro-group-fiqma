const { HOURS, FAQ, SITE, EMAIL, PHONE1, PHONE1_TEL, PHONE2, PHONE2_TEL, ADDRESS, CATS, SERVICES, NAV, slides, prodSlides, gallery, partners, brands } = require('../data');
const { esc, banner } = require('../lib/layout');
const { contactForm } = require('../lib/form');
const { img } = require('../lib/img');
const { icon } = require('../lib/icons');

module.exports = function (page) {
CATS.forEach((cat, idx) => {
  const prev = CATS[idx - 1], next = CATS[idx + 1];
  page(cat.file, {
    title: `${cat.name} – Məhsullar – Net Pro Group`,
    desc: cat.intro.slice(0, 155),
  }, banner(cat.name, [['index.html', 'Əsas səhifə'], ['mehsullar-1.html', 'Məhsullar'], ['', cat.name]]) + `    <section class="catalog">
      <div class="wrap catalog-grid">
        <aside class="cat-menu" aria-label="Məhsul kateqoriyaları">
          <h2>Kateqoriyalar</h2>
          <ul>
${CATS.map(c => `            <li><a href="${c.file}"${c === cat ? ' aria-current="page"' : ''}>${c.name}</a></li>`).join('\n')}
          </ul>
        </aside>
        <div class="cat-content">
          <p class="cat-intro">${cat.intro}</p>
          <ul class="product-list">
${cat.items.map(([img, name, desc, alt]) => `            <li class="product">
              <img src="img/mehsul/${img}.webp" alt="${alt}" width="190" height="152" loading="lazy">
              <div class="p-body">
                <h3>${name}</h3>
                <p>${desc}</p>
              </div>
              <a class="p-doc" href="elaqe.html?movzu=${encodeURIComponent(name + ' – broşür')}#form">
                <img src="img/ikon/pdf.png" alt="" width="24" height="24"> Broşür sorğusu
              </a>
            </li>`).join('\n')}
          </ul>
          <nav class="pager" aria-label="Kateqoriyalar arasında keçid">
            ${prev ? `<a href="${prev.file}" class="pg-arrow" aria-label="Əvvəlki kateqoriya: ${prev.name}">‹</a>` : '<span class="pg-arrow disabled" aria-hidden="true">‹</span>'}
${CATS.map((c, i) => `            <a href="${c.file}"${c === cat ? ' aria-current="page"' : ''} aria-label="${i + 1}. ${c.name}">${i + 1}</a>`).join('\n')}
            ${next ? `<a href="${next.file}" class="pg-arrow" aria-label="Növbəti kateqoriya: ${next.name}">›</a>` : '<span class="pg-arrow disabled" aria-hidden="true">›</span>'}
          </nav>
        </div>
      </div>
    </section>
`, cat.file);
});

};
