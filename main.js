// Net Pro Group – shared interactions (vanilla JS). Generated from tools/js/*.js by tools/build-pages.js. Do not edit.

// URL of the deployed inquiry API (backend/ on Render), without a trailing slash, e.g.
// 'https://net-pro-group-api.onrender.com'. Empty = contact forms open the mail app (mailto).
// For local testing a page also accepts ?api=<url>, but ONLY when it runs on localhost:
// on the live site a crafted link must not be able to send visitors' messages elsewhere.
const NPG_API_URL = '';

(function () {
  /* ---- js/10-core.js ---- */
  // Helpers, API client, header navigation
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

  /* Header: mobile menu panel + products dropdown (click / keyboard; hover handled in CSS on desktop) */
  const toggle = $('.nav-toggle');
  const nav = $('#site-nav');
  const desktopMq = window.matchMedia('(min-width: 1100px)');

  function setMenu(open, returnFocus) {
    if (!toggle || !nav) return;
    nav.classList.toggle('open', open);
    document.documentElement.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menyunu bağla' : 'Menyunu aç');
    // the panel covers the page: keep Tab inside header + panel while it is open
    $$('main, footer.site-footer').forEach(el => { el.inert = open; });
    if (open) { const first = $('.menu-link', nav); if (first) first.focus(); }
    if (!open && returnFocus) toggle.focus();
  }

  function setDropdown(li, open, returnFocus) {
    const btn = $('.dd-toggle', li);
    li.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    if (!open && returnFocus) btn.focus();
  }

  if (toggle && nav) {
    toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
    // leaving the mobile layout closes the panel so the page is never left scroll-locked
    desktopMq.addEventListener('change', () => setMenu(false));
  }

  $$('.has-dropdown').forEach(li => {
    const btn = $('.dd-toggle', li);
    btn.addEventListener('click', () => setDropdown(li, !li.classList.contains('open')));
    // desktop: moving focus out of the panel closes it
    li.addEventListener('focusout', e => {
      if (desktopMq.matches && li.classList.contains('open') && e.relatedTarget && !li.contains(e.relatedTarget)) setDropdown(li, false);
    });
  });

  document.addEventListener('click', e => {
    $$('.has-dropdown.open').forEach(li => { if (desktopMq.matches && !li.contains(e.target)) setDropdown(li, false); });
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (nav && nav.classList.contains('open')) { $$('.has-dropdown.open').forEach(li => setDropdown(li, false)); setMenu(false, true); return; }
    const openDd = $('.has-dropdown.open');
    if (openDd) setDropdown(openDd, false, openDd.contains(document.activeElement));
  });

  /* ---- js/20-home.js ---- */
  // Home page: gallery strip (scroll-snap row with prev/next buttons)
  const track = $('#gal-track');
  if (track) {
    const btns = $$('[data-gal]');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      btns.forEach(b => { b.disabled = Number(b.dataset.gal) < 0 ? track.scrollLeft <= 2 : track.scrollLeft >= max; });
    };
    btns.forEach(b => b.addEventListener('click', () => {
      track.scrollBy({ left: Number(b.dataset.gal) * track.clientWidth * 0.8, behavior: reduce.matches ? 'auto' : 'smooth' });
    }));
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---- js/25-hero-video.js ---- */
  // Home hero time-lapse (only rendered when HERO_VIDEO.ready in tools/data.js).
  // Muted + playsinline, lazy (sources attached when the hero is on screen), plays once and holds the final frame,
  // replay button, pauses while off screen. Under prefers-reduced-motion the video is never loaded: poster only.
  const heroFig = $('.hero-video');
  if (heroFig) {
    const video = $('.hero-video-clip', heroFig);
    const replay = $('.hero-video-replay', heroFig);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let loaded = false, visible = false;

    const load = () => {
      if (loaded) return;
      loaded = true;
      [['webm', 'video/webm'], ['mp4', 'video/mp4']].forEach(([k, type]) => {
        if (!video.dataset[k]) return;
        const s = document.createElement('source');
        s.src = video.dataset[k]; s.type = type;
        video.appendChild(s);
      });
      video.load();
    };
    const play = () => {
      if (reduce.matches || !visible || video.ended) return;
      load();
      const p = video.play();
      if (p && p.catch) p.catch(() => { replay.hidden = false; }); // autoplay blocked: let the visitor start it
    };

    video.addEventListener('playing', () => { heroFig.classList.add('is-playing'); replay.hidden = true; });
    video.addEventListener('ended', () => { replay.hidden = false; }); // no loop: the last frame stays on screen
    replay.addEventListener('click', () => { video.currentTime = 0; replay.hidden = true; visible = true; load(); video.play().catch(() => { replay.hidden = false; }); });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        if (visible) play();
        else if (!video.paused) video.pause();
      }, { threshold: 0.25 }).observe(heroFig);
    } else { visible = true; play(); }

    // switching reduced motion on mid-play: stop and fall back to the poster
    reduce.addEventListener('change', () => {
      if (reduce.matches) { video.pause(); heroFig.classList.remove('is-playing'); replay.hidden = true; } else play();
    });
  }

  /* ---- js/30-lightbox.js ---- */
  /* (also: catalogue chip row, at the end) Gallery lightbox: native <dialog> (Escape closes, focus is trapped by the browser),
     previous / next buttons + arrow keys, caption from the image alt, focus returns to the opener. */
  const lb = $('#lightbox');
  if (lb && typeof lb.showModal === 'function') {
    const lbImg = $('.lb-img', lb) || $('img', lb);
    const lbCap = $('.lb-caption', lb);
    const lbCount = $('.lb-count', lb);
    const openers = $$('.gal-open');
    let cur = 0;
    let opener = null;
    const show = i => {
      cur = (i + openers.length) % openers.length;
      const b = openers[cur];
      const alt = $('img', b).alt;
      lbImg.src = b.dataset.full;
      lbImg.alt = alt;
      if (lbCap) lbCap.textContent = alt;
      if (lbCount) lbCount.textContent = `${cur + 1} / ${openers.length}`;
    };
    openers.forEach((b, i) => b.addEventListener('click', () => {
      opener = b;
      show(i);
      lb.showModal();
      const close = $('.lb-close', lb);
      if (close) close.focus();
    }));
    const prev = $('.lb-prev', lb), next = $('.lb-next', lb);
    if (prev) prev.addEventListener('click', () => show(cur - 1));
    if (next) next.addEventListener('click', () => show(cur + 1));
    if (openers.length < 2) [prev, next].forEach(b => { if (b) b.hidden = true; });
    $('.lb-close', lb).addEventListener('click', () => lb.close());
    lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(cur - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); show(cur + 1); }
    });
    lb.addEventListener('close', () => {
      // the browser usually restores focus itself; make sure the opener (the image the visitor chose last) gets it
      const target = openers[cur] || opener;
      if (target) target.focus();
    });
  }

  /* Catalogue: on small screens the category chip row scrolls sideways – bring the current category into view */
  const catCur = $('.cat-nav-list [aria-current="page"]');
  if (catCur) {
    const row = catCur.closest('.cat-nav-list');
    if (row.scrollWidth > row.clientWidth) row.scrollLeft = catCur.parentElement.offsetLeft - row.offsetLeft - 4;
  }

  /* ---- js/40-forms.js ---- */
  /* Contact forms: validate, then send to the API (saved as an inquiry).
     Without the API (not set, asleep or unreachable) the mail app opens with a prepared message. */
  const forms = $$('.contact-form');
  const NOTE_API_UP = 'Mesajınız birbaşa bizə göndərilir, cavabı e-poçtla alacaqsınız.';
  // Resolves true when the API and its database answer within the timeout.
  const apiReady = API && forms.length
    ? api('/api/health')
        .then(h => {
          const up = h.ok === true && h.db === 'up';
          if (up) $$('.form-note').forEach(n => { ($('span', n) || n).textContent = NOTE_API_UP; n.classList.add('is-live'); });
          return up;
        })
        .catch(() => false)
    : Promise.resolve(false);
  const FIELD_MAP = { name: 'ad', email: 'email', phone: 'telefon', message: 'mesaj' };
  const PHONE_RE = /^[0-9 +()-]{7,}$/;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Client-side checks (same rules as the API). Returns an error message or ''.
  function fieldError(f) {
    const v = f.value.trim();
    switch (f.name) {
      case 'ad': return v.length < 2 ? 'Adınızı və soyadınızı yazın.' : '';
      case 'email': return !v ? 'E-poçt ünvanınızı yazın.' : (!EMAIL_RE.test(v) || !f.checkValidity()) ? 'E-poçt ünvanını düzgün yazın (məs.: ad@sirket.az).' : '';
      case 'telefon': return v && !PHONE_RE.test(v) ? 'Telefon nömrəsini düzgün yazın: yalnız rəqəmlər, boşluq, +, ( ) və -.' : '';
      case 'mesaj': return !v ? 'Mesajınızı yazın.' : v.length < 10 ? 'Mesaj ən azı 10 simvol olmalıdır.' : '';
      default: return '';
    }
  }

  forms.forEach(form => {
    const status = $('.form-status', form);
    const btn = $('button[type="submit"]', form);
    const label = $('.btn-label', btn) || btn;
    const idleLabel = label.textContent;
    const fields = [form.ad, form.email, form.telefon, form.mesaj];
    const params = new URLSearchParams(location.search);
    const topic = (params.get('movzu') || '').trim().slice(0, 120);
    if (topic) {
      form.mesaj.value = `Salam! "${topic}" haqqında məlumat almaq istəyirəm.`;
      const t = $('.form-topic', form);
      if (t) { t.textContent = 'Mövzu: ' + topic; t.hidden = false; }
    }

    // Honeypot for spam bots: hidden from people and screen readers.
    const trap = document.createElement('input');
    trap.type = 'text';
    trap.name = 'website';
    trap.tabIndex = -1;
    trap.autocomplete = 'off';
    trap.setAttribute('aria-hidden', 'true');
    trap.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0';
    form.appendChild(trap);

    const setError = (f, msg) => {
      const slot = $(`.field-error[data-for="${f.name}"]`, form);
      if (slot) slot.textContent = msg ? msg : '';
      f.classList.toggle('invalid', !!msg);
      if (msg) f.setAttribute('aria-invalid', 'true'); else f.removeAttribute('aria-invalid');
    };
    const setStatus = (kind, html) => {
      status.className = 'form-status' + (kind ? ' ' + kind : '');
      status.innerHTML = html;
    };
    const text = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const busy = on => {
      btn.disabled = on;
      form.setAttribute('aria-busy', String(on));
      btn.classList.toggle('is-loading', on);
      label.textContent = on ? 'Göndərilir…' : idleLabel;
    };

    // Re-check a field once the visitor fixes it (only after it was flagged).
    fields.forEach(f => f.addEventListener('input', () => { if (f.classList.contains('invalid')) setError(f, fieldError(f)); }));

    const sendToApi = async () => {
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
        fields.forEach(f => setError(f, ''));
        setStatus('ok', `<p class="fs-title">Təşəkkür edirik! Mesajınız qəbul edildi.</p>
          <p>Sorğu nömrəsi: <strong class="fs-ref" translate="no">${reference}</strong></p>
          <p class="fs-small">Bu nömrəni saxlayın – cavabı e-poçtla alacaqsınız.</p>`);
        return true;
      } catch (err) {
        if (err.offline) return false; // fall back to the mail app
        const details = (err.data && err.data.details) || [];
        let first = null;
        details.forEach(d => {
          const f = form[FIELD_MAP[d.field]];
          if (f) { setError(f, d.message); first = first || f; }
        });
        setStatus('error', details.length
          ? `<p class="fs-title">Mesaj göndərilmədi.</p><p>${details.map(d => text(d.message)).join(' ')}</p>`
          : '<p class="fs-title">Mesaj göndərilmədi.</p><p>Bir az sonra yenidən cəhd edin.</p>');
        if (first) first.focus();
        return true;
      }
    };

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (btn.disabled) return;
      let firstBad = null;
      fields.forEach(f => {
        const msg = fieldError(f);
        setError(f, msg);
        if (msg && !firstBad) firstBad = f;
      });
      if (firstBad) {
        setStatus('error', '<p>Zəhmət olmasa, qeyd olunan sahələri düzgün doldurun.</p>');
        firstBad.focus();
        return;
      }
      busy(true);
      setStatus('', '<p>Göndərilir…</p>');
      let handled = false;
      try {
        handled = (await apiReady) && (await sendToApi());
      } finally {
        busy(false);
      }
      if (handled) return;
      const to = form.getAttribute('action').replace('mailto:', '');
      const subject = `Saytdan sorğu – ${form.ad.value.trim()}`;
      const body = `Ad, soyad: ${form.ad.value.trim()}\nE-poçt: ${form.email.value.trim()}\nTelefon: ${form.telefon.value.trim() || '-'}\n\n${form.mesaj.value.trim()}`;
      window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus('ok', '<p>E-poçt proqramınız açılır. Mesajı oradan göndərin.</p>');
    });
  });

  /* ---- js/50-search.js ---- */
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
})();
