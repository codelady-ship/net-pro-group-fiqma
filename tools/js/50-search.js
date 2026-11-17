/* Site search */
const results = $('#search-results');
if (results) {
  const input = $('#q');
  const count = $('#search-count');
  const q = new URLSearchParams(location.search).get('q') || '';
  input.value = q;
  const norm = s => s.toLocaleLowerCase('az').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ə/g, 'e').replace(/ı/g, 'i');
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
          const a = document.createElement('a');
          a.href = h.u; a.textContent = h.t;
          const p = document.createElement('p'); p.textContent = h.d;
          li.append(a, p);
          results.appendChild(li);
        });
      };
      run(q);
      input.addEventListener('input', () => run(input.value));
    })
    .catch(() => { count.textContent = 'Axtarış indeksi yüklənmədi.'; });
}
