const { HOURS, FAQ, SITE, EMAIL, PHONE1, PHONE1_TEL, PHONE2, PHONE2_TEL, ADDRESS, CATS, SERVICES, NAV, slides, prodSlides, gallery, partners, brands } = require('../data');
const { esc, banner } = require('../lib/layout');
const { contactForm } = require('../lib/form');
const { img } = require('../lib/img');
const { icon } = require('../lib/icons');

module.exports = function (page) {
const index = [
  ...NAV.map(([h, l]) => ({ t: l, u: h, d: 'Səhifə' })),
  ...CATS.map(c => ({ t: c.name, u: c.file, d: c.intro })),
  ...CATS.flatMap(c => c.items.map(([, n, d]) => ({ t: n, u: c.file, d }))),
  ...SERVICES.map(([id, t, d]) => ({ t, u: 'xidmetler.html#' + id, d })),
];
page.writeFile('search-index.json', JSON.stringify(index, null, 1));
page('search.html', {
  title: 'Axtarış – Net Pro Group',
  desc: 'Net Pro Group saytında məhsul, xidmət və səhifələr üzrə axtarış.',
}, banner('Axtarış', [['index.html', 'Əsas səhifə'], ['', 'Axtarış']]) + `    <section class="search-page">
      <div class="wrap narrow">
        <form class="search-form" role="search" action="search.html" method="get">
          <label for="q" class="visually-hidden">Axtarış sözü</label>
          <input id="q" name="q" type="search" placeholder="Məs.: UPS, helpdesk, monitorinq" autocomplete="off">
          <button type="submit" class="btn btn-solid">Axtar</button>
        </form>
        <p class="search-count" id="search-count" role="status" aria-live="polite"></p>
        <ul class="search-results" id="search-results"></ul>
      </div>
    </section>
`, 'search.html');

};
