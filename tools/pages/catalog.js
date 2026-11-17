const { CATS } = require('../data');
const { banner, CAT_ICONS } = require('../lib/layout');
const { img } = require('../lib/img');
const { icon } = require('../lib/icons');

// Brand / model names and tech acronyms must not be machine-translated.
const BRAND_RE = /((?:Liebert®|Vertiv™)[^,]*)/g;
const TECH_RE = /\b(UPS|PDU|SNMP|VPN|DC|AC|VA|kVA|kW|MW)\b/g;
function noTranslate(text) {
  return text.split(BRAND_RE).map((part, i) => i % 2
    ? `<span translate="no">${part}</span>`
    : part.replace(TECH_RE, '<span translate="no">$1</span>')).join('');
}

module.exports = function (page) {
CATS.forEach((cat, idx) => {
  const prev = CATS[idx - 1], next = CATS[idx + 1];
  const pagerCard = (c, dir) => {
    const label = dir === 'prev' ? 'Əvvəlki kateqoriya' : 'Növbəti kateqoriya';
    const arrow = icon(dir === 'prev' ? 'arrow-left' : 'arrow-right', { size: 20 });
    if (!c) return `<span class="pager-card pager-card--${dir} is-disabled" aria-hidden="true">${arrow}<span class="pc-text"><span class="pc-label">${label}</span><span class="pc-name">${dir === 'prev' ? 'Bu, ilk kateqoriyadır' : 'Bu, sonuncu kateqoriyadır'}</span></span></span>`;
    return `<a href="${c.file}" class="pager-card pager-card--${dir}" aria-label="${label}: ${c.name}">${arrow}<span class="pc-text"><span class="pc-label">${label}</span><span class="pc-name">${noTranslate(c.name)}</span></span></a>`;
  };
  page(cat.file, {
    title: `${cat.name} – Məhsullar – Net Pro Group`,
    desc: cat.metaDesc || cat.intro,
  }, banner(cat.name, [['index.html', 'Əsas səhifə'], ['mehsullar-1.html', 'Məhsullar'], ['', cat.name]]) + `    <section class="section catalog">
      <div class="wrap catalog-layout">
        <nav class="cat-nav" aria-label="Məhsul kateqoriyaları">
          <h2 class="cat-nav-title">Kateqoriyalar</h2>
          <ul class="cat-nav-list">
${CATS.map((c, i) => `            <li><a href="${c.file}"${c === cat ? ' aria-current="page"' : ''}>${icon(CAT_ICONS[i] || 'layers', { size: 20 })}<span class="cn-name">${noTranslate(c.name)}</span><span class="cn-count" aria-label="${c.items.length} məhsul">${c.items.length}</span></a></li>`).join('\n')}
          </ul>
        </nav>
        <div class="cat-content">
          <header class="cat-head">
            <p class="eyebrow">Kateqoriya ${idx + 1} / ${CATS.length}</p>
            <p class="cat-intro">${noTranslate(cat.intro)}</p>
          </header>
          <h2 class="cat-list-title">Məhsullar <span class="chip">${cat.items.length}</span></h2>
          <ul class="product-grid">
${cat.items.map(([file, name, desc, alt]) => `            <li class="product-card">
              <div class="pc-media">${img('mehsul/' + file + '.webp', { alt, sizes: '(min-width: 1280px) 300px, (min-width: 768px) 45vw, 90vw' })}</div>
              <div class="pc-body">
                <h3 class="pc-title">${noTranslate(name)}</h3>
                <p class="pc-desc">${noTranslate(desc)}</p>
              </div>
              <div class="pc-foot">
                <a class="btn btn--ghost btn--sm pc-doc" href="elaqe.html?movzu=${encodeURIComponent(name + ' – broşür')}#form">${icon('file', { size: 18 })}<span>Broşür sorğusu</span></a>
              </div>
            </li>`).join('\n')}
          </ul>
          <nav class="pager" aria-label="Kateqoriyalar arasında keçid">
            ${pagerCard(prev, 'prev')}
            <ol class="pager-steps">
${CATS.map((c, i) => `              <li><a href="${c.file}"${c === cat ? ' aria-current="page"' : ''} aria-label="${i + 1}. ${c.name}">${i + 1}</a></li>`).join('\n')}
            </ol>
            ${pagerCard(next, 'next')}
          </nav>
          <aside class="cat-cta" aria-label="Məsləhət">
            <div>
              <p class="cat-cta-title">Uyğun həlli birlikdə seçək</p>
              <p>Avadanlığın gücünü, ölçüsünü və quraşdırılma yerini yazın – sizə uyğun variantı təklif edək.</p>
            </div>
            <a href="elaqe.html#form" class="btn btn--light">Sorğu göndər ${icon('arrow-right', { size: 20 })}</a>
          </aside>
        </div>
      </div>
    </section>
`, cat.file);
});

};
