// Net Pro Group – shared interactions (vanilla JS)

// URL of the deployed inquiry API (backend/ on Render), without a trailing slash, e.g.
// 'https://net-pro-group-api.onrender.com'. Empty = contact forms open the mail app (mailto).
// For local testing a page also accepts ?api=<url>, but ONLY when it runs on localhost:
// on the live site a crafted link must not be able to send visitors' messages elsewhere.
const NPG_API_URL = '';

(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const IS_LOCAL = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  const API = ((IS_LOCAL && new URLSearchParams(location.search).get('api')) || NPG_API_URL).replace(/\/$/, '');
  const API_TIMEOUT = 8000;

  // fetch with a timeout; rejects with { offline: true } on network errors / timeouts
  async function api(path, body) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), API_TIMEOUT);
    try {
      const res = await fetch(API + path, {
        method: body ? 'POST' : 'GET',
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
        signal: ctrl.signal,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw Object.assign(new Error(data.error || 'HTTP ' + res.status), { status: res.status, data });
      return data;
    } catch (err) {
      if (!err.status) err.offline = true;
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

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

  /* Contact forms: validate, then send to the API (saved as an inquiry).
     Without the API (not set, asleep or unreachable) the mail app opens with a prepared message. */
  const forms = $$('.contact-form');
  // Resolves true when the API and its database answer within the timeout.
  const apiReady = API && forms.length
    ? api('/api/health')
        .then(h => {
          const up = h.ok === true && h.db === 'up';
          if (up) $$('.form-note').forEach(n => { n.textContent = 'Mesajınız birbaşa bizə göndərilir, cavabı e-poçtla alacaqsınız.'; });
          return up;
        })
        .catch(() => false)
    : Promise.resolve(false);
  const FIELD_MAP = { name: 'ad', email: 'email', phone: 'telefon', message: 'mesaj' };

  forms.forEach(form => {
    const status = $('.form-status', form);
    const params = new URLSearchParams(location.search);
    const topic = params.get('movzu');
    if (topic) form.mesaj.value = `Salam! "${topic}" haqqında məlumat almaq istəyirəm.`;

    // Honeypot for spam bots: hidden from people and screen readers.
    const trap = document.createElement('input');
    trap.type = 'text';
    trap.name = 'website';
    trap.tabIndex = -1;
    trap.autocomplete = 'off';
    trap.setAttribute('aria-hidden', 'true');
    trap.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0';
    form.appendChild(trap);

    const sendToApi = async () => {
      const btn = $('button[type="submit"]', form);
      btn.disabled = true;
      status.textContent = 'Göndərilir…';
      status.className = 'form-status';
      try {
        const data = await api('/api/inquiries', {
          name: form.ad.value.trim(),
          email: form.email.value.trim(),
          phone: form.telefon.value.trim(),
          message: form.mesaj.value.trim(),
          topic: topic || '',
          page: location.pathname.split('/').pop() || 'index.html',
          website: trap.value,
        });
        // Only a real reference from our API counts as success. Anything else is treated
        // like an unreachable API: nothing is reset and the mail-app fallback runs.
        const reference = data && typeof data.reference === 'string' && /^NPG-[0-9A-F]{6}$/.test(data.reference) ? data.reference : null;
        if (!reference) return false;
        form.reset();
        status.textContent = `Təşəkkür edirik! Mesajınız qəbul edildi. Sorğu nömrəsi: ${reference}.`;
        status.className = 'form-status ok';
        return true;
      } catch (err) {
        if (err.offline) return false; // fall back to the mail app
        const details = (err.data && err.data.details) || [];
        details.forEach(d => { const f = form[FIELD_MAP[d.field]]; if (f) f.classList.add('invalid'); });
        status.textContent = details.length ? details.map(d => d.message).join(' ') : 'Mesaj göndərilmədi. Bir az sonra yenidən cəhd edin.';
        status.className = 'form-status error';
        return true;
      } finally {
        btn.disabled = false;
      }
    };

    form.addEventListener('submit', async e => {
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
      if ((await apiReady) && (await sendToApi())) return;
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
