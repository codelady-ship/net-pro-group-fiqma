const { CATS, SERVICES, NAV } = require('../data');
const { banner } = require('../lib/layout');
const { icon } = require('../lib/icons');

module.exports = function (page) {
// index fields: t = title, u = url, d = description (read by tools/js/50-search.js)
const index = [
  ...NAV.map(([h, l]) => ({ t: l, u: h, d: 'Səhifə' })),
  ...CATS.map(c => ({ t: c.name, u: c.file, d: c.intro })),
  ...CATS.flatMap(c => c.items.map(([, n, d]) => ({ t: n, u: c.file, d }))),
  ...SERVICES.map(([id, t, d]) => ({ t, u: 'xidmetler.html#' + id, d })),
];
page.writeFile('search-index.json', JSON.stringify(index, null, 1));
const tips = ['UPS', 'PDU', 'monitorinq', 'helpdesk', 'təmir'];
page('search.html', {
  title: 'Axtarış – Net Pro Group',
  desc: 'Net Pro Group saytında məhsul, xidmət və səhifələr üzrə axtarış.',
}, banner('Axtarış', [['index.html', 'Əsas səhifə'], ['', 'Axtarış']]) + `    <section class="section search-page">
      <div class="wrap search-wrap">
        <form class="search-form" role="search" action="search.html" method="get">
          <label for="q" class="search-label">Məhsul, xidmət və ya səhifə axtarın</label>
          <div class="search-box">
            ${icon('search', { size: 22, cls: 'search-icon' })}
            <input id="q" name="q" type="search" placeholder="Məs.: UPS, helpdesk, monitorinq" autocomplete="off" enterkeyhint="search">
            <button type="submit" class="btn btn--primary">Axtar</button>
          </div>
          <p class="search-tips"><span>Tez axtarış:</span> ${tips.map(t => `<a class="chip" href="search.html?q=${encodeURIComponent(t)}"${/^[A-Z]+$/.test(t) ? ' translate="no"' : ''}>${t}</a>`).join(' ')}</p>
        </form>
        <p class="search-count" id="search-count" role="status" aria-live="polite"></p>
        <ul class="search-results" id="search-results"></ul>
      </div>
    </section>
`, 'search.html');

};
