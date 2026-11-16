// Net Pro Group – shared interactions (vanilla JS)
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* Mobile menu */
  const toggle = $('.nav-toggle');
  const nav = $('#site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Menyunu bağla' : 'Menyunu aç');
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* Products dropdown (click / keyboard; hover handled in CSS) */
  $$('.dd-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const li = btn.closest('.has-dropdown');
      const open = li.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', e => {
    $$('.has-dropdown.open').forEach(li => {
      if (!li.contains(e.target)) {
        li.classList.remove('open');
        $('.dd-toggle', li).setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* Generic one-at-a-time slider */
  function slider(items, onChange) {
    let i = 0;
    return dir => {
      items[i].hidden = true; items[i].classList.remove('active');
      i = (i + dir + items.length) % items.length;
      items[i].hidden = false; items[i].classList.add('active');
      if (onChange) onChange(i);
    };
  }

  const heroSlides = $$('.hero-slide');
  if (heroSlides.length) {
    const counter = $('.hero .counter');
    const go = slider(heroSlides, i => { counter.innerHTML = `<b>0${i + 1}/</b> 0${heroSlides.length}`; });
    $$('[data-hero]').forEach(b => b.addEventListener('click', () => go(Number(b.dataset.hero))));
  }

  const prodSlides = $$('.prod-slide');
  if (prodSlides.length) {
    const go = slider(prodSlides);
    $$('[data-prod]').forEach(b => b.addEventListener('click', () => go(Number(b.dataset.prod))));
  }

  /* Home gallery scroll */
  const track = $('#gal-track');
  if (track) {
    $$('[data-gal]').forEach(b => b.addEventListener('click', () => {
      track.scrollBy({ left: Number(b.dataset.gal) * track.clientWidth * 0.8, behavior: 'smooth' });
    }));
  }

  /* Gallery lightbox */
  const lb = $('#lightbox');
  if (lb && typeof lb.showModal === 'function') {
    const img = $('img', lb);
    $$('.gal-open').forEach(b => b.addEventListener('click', () => {
      img.src = b.dataset.full;
      img.alt = $('img', b).alt;
      lb.showModal();
    }));
    $('.lb-close', lb).addEventListener('click', () => lb.close());
    lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  }

  /* Contact forms: validate, then open the mail app with a prepared message */
  $$('.contact-form').forEach(form => {
    const status = $('.form-status', form);
    const params = new URLSearchParams(location.search);
    const topic = params.get('movzu');
    if (topic) form.mesaj.value = `Salam! "${topic}" haqqında məlumat almaq istəyirəm.`;

    form.addEventListener('submit', e => {
      e.preventDefault();
      const fields = [form.ad, form.email, form.telefon, form.mesaj];
      fields.forEach(f => f.classList.remove('invalid'));
      const bad = fields.filter(f => !f.checkValidity());
      if (bad.length) {
        bad.forEach(f => f.classList.add('invalid'));
        status.textContent = 'Zəhmət olmasa, qırmızı ilə qeyd olunan sahələri düzgün doldurun.';
        status.className = 'form-status error';
        bad[0].focus();
        return;
      }
      const to = form.getAttribute('action').replace('mailto:', '');
      const subject = `Saytdan sorğu – ${form.ad.value.trim()}`;
      const body = `Ad, soyad: ${form.ad.value.trim()}\nE-poçt: ${form.email.value.trim()}\nTelefon: ${form.telefon.value.trim() || '-'}\n\n${form.mesaj.value.trim()}`;
      window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = 'E-poçt proqramınız açılır. Mesajı oradan göndərin.';
      status.className = 'form-status ok';
    });
  });

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
})();
