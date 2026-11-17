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
