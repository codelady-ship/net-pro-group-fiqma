/* Site search (search-index.json: t = title, u = url, d = description) */
const results = $('#search-results');
if (results) {
  const input = $('#q');
  const count = $('#search-count');
  const q = new URLSearchParams(location.search).get('q') || '';
  input.value = q;
  // Azerbaijani-friendly matching: case-insensitive, accents dropped, ə→e, ı→i
  const norm = s => s.toLocaleLowerCase('az').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ə/g, 'e').replace(/ı/g, 'i');
  const kind = u => u.startsWith('mehsullar') ? 'Məhsullar' : u.startsWith('xidmetler') ? 'Xidmətlər' : 'Səhifə';
  fetch('search-index.json')
    .then(r => r.json())
    .then(index => {
      const run = term => {
        results.innerHTML = '';
        const t = norm(term.trim());
        if (!t) { count.textContent = 'Axtarış sözünü yazın.'; return; }
        const hits = index.filter(x => norm(x.t + ' ' + x.d).includes(t));
        count.textContent = hits.length ? `${hits.length} nəticə tapıldı.` : 'Heç nə tapılmadı. Başqa söz yoxlayın.';
        hits.forEach(h => {
          const li = document.createElement('li');
          li.className = 'result';
          const tag = document.createElement('span');
          tag.className = 'chip result-kind';
          tag.textContent = kind(h.u);
          const h3 = document.createElement('h2');
          h3.className = 'result-title';
          const a = document.createElement('a');
          a.href = h.u; a.textContent = h.t;
          h3.appendChild(a);
          li.append(tag, h3);
          if (h.d && h.d !== 'Səhifə') {
            const p = document.createElement('p'); p.textContent = h.d;
            li.appendChild(p);
          }
          results.appendChild(li);
        });
      };
      run(q);
      input.addEventListener('input', () => run(input.value));
    })
    .catch(() => { count.textContent = 'Axtarış indeksi yüklənmədi.'; });
}
