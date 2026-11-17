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

