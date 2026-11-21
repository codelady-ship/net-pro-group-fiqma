// Admin panel for the inquiry API (backend/). Talks to NPG_API_URL with a JWT kept in sessionStorage.
// "Demo admin": signs in with the public read-only demo account (the server blocks every write with 403);
// when the API is not configured or does not answer, it runs an in-browser sandbox built from
// DEMO_INQUIRIES (backend/src/demoInquiries.js): changes live in sessionStorage only.
const $ = (s) => document.querySelector(s);
const IS_LOCAL = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
const API = ((IS_LOCAL && new URLSearchParams(location.search).get('api')) || NPG_API_URL).replace(/\/$/, '');
const API_TIMEOUT = 8000;
const DEMO = { email: 'demo@netprogroup.az', password: 'demo1234' };
const STATUS = { new: 'Yeni', in_progress: 'İcrada', closed: 'Bağlı', spam: 'Spam' };
const SANDBOX_KEY = 'npg-admin-sandbox';
const SESSION_KEY = 'npg-admin-session';

const store = {
  get(k) { try { return JSON.parse(sessionStorage.getItem(k)); } catch { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch { /* storage blocked: keep it in memory */ } },
  del(k) { try { sessionStorage.removeItem(k); } catch { /* ignore */ } },
};

/* ---------- toast ---------- */
let toastTimer;
function toast(text, isError) {
  const t = $('#toast');
  t.textContent = text;
  t.classList.toggle('is-error', !!isError);
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 4500);
}

/* ---------- backends: real API and in-browser sandbox (same interface) ---------- */
function apiBackend(token) {
  async function call(path, opts = {}) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), API_TIMEOUT);
    try {
      const res = await fetch(API + '/api' + path, {
        method: opts.method || 'GET',
        headers: { ...(token ? { Authorization: 'Bearer ' + token } : {}), ...(opts.body ? { 'Content-Type': 'application/json' } : {}) },
        body: opts.body ? JSON.stringify(opts.body) : undefined,
        signal: ctrl.signal,
      });
      const data = res.status === 204 ? {} : await res.json().catch(() => ({}));
      if (!res.ok) throw Object.assign(new Error(data.error || 'HTTP ' + res.status), { status: res.status });
      return data;
    } catch (err) {
      if (!err.status) err.offline = true;
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }
  const ref = (r) => '/admin/inquiries/' + encodeURIComponent(r);
  return {
    login: (email, password) => call('/auth/login', { method: 'POST', body: { email, password } }),
    list: ({ q, status, page }) => call('/admin/inquiries?' + new URLSearchParams({ ...(q ? { q } : {}), ...(status ? { status } : {}), page })),
    get: (r) => call(ref(r)),
    update: (r, body) => call(ref(r), { method: 'PATCH', body }),
    remove: (r) => call(ref(r), { method: 'DELETE' }),
    stats: () => call('/admin/stats'),
  };
}

function sandboxBackend() {
  const ago = (d) => new Date(Date.now() - d * 86400000).toISOString();
  const fresh = () => DEMO_INQUIRIES.map(({ daysAgo, notes, ...s }) => ({ ...s, createdAt: ago(daysAgo), notes: notes.map((n) => ({ text: n.text, at: ago(n.daysAgo) })) }));
  let data = store.get(SANDBOX_KEY) || fresh();
  const save = () => store.set(SANDBOX_KEY, data);
  save();
  const find = (r) => {
    const doc = data.find((d) => d.reference === String(r).toUpperCase());
    if (!doc) throw Object.assign(new Error('Sorğu tapılmadı'), { status: 404 });
    return doc;
  };
  const copy = (o) => JSON.parse(JSON.stringify(o));
  return {
    reset() { data = fresh(); save(); },
    async list({ q, status, page }) {
      const rx = q ? new RegExp(q.slice(0, 50).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') : null;
      const items = data
        .filter((d) => (status ? d.status === status : d.status !== 'spam'))
        .filter((d) => !rx || [d.name, d.email, d.topic, d.message].some((v) => rx.test(v)))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return { items: copy(items.slice((page - 1) * 50, page * 50)), total: items.length, page, pages: Math.ceil(items.length / 50) };
    },
    async get(r) { return copy(find(r)); },
    async update(r, body) {
      const doc = find(r);
      if (body.status) doc.status = body.status;
      if (body.note) doc.notes.push({ text: body.note, at: new Date().toISOString() });
      save();
      return copy(doc);
    },
    async remove(r) { find(r); data = data.filter((d) => d.reference !== String(r).toUpperCase()); save(); return {}; },
    async stats() {
      const status = { new: 0, in_progress: 0, closed: 0, spam: 0 };
      const topics = {};
      data.forEach((d) => {
        status[d.status]++;
        if (d.topic && d.status !== 'spam') topics[d.topic] = (topics[d.topic] || 0) + 1;
      });
      const topTopics = Object.entries(topics).map(([topic, count]) => ({ topic, count }))
        .sort((a, b) => b.count - a.count || a.topic.localeCompare(b.topic)).slice(0, 10);
      return { status, topTopics };
    },
  };
}

/* ---------- state ---------- */
let backend = null;
let session = null; // { mode: 'api' | 'sandbox', token?, email, demo }
const view = { q: '', status: '', page: 1, pages: 1, selected: null };

const fmtDate = (s) => { try { return new Date(s).toLocaleDateString('az-AZ', { day: '2-digit', month: '2-digit', year: 'numeric' }); } catch { return ''; } };
const fmtDateTime = (s) => { try { return new Date(s).toLocaleString('az-AZ', { dateStyle: 'short', timeStyle: 'short' }); } catch { return ''; } };
const el = (tag, props = {}, ...kids) => { const e = Object.assign(document.createElement(tag), props); kids.forEach((k) => e.append(k)); return e; };

function start(s) {
  session = s;
  store.set(SESSION_KEY, s);
  backend = s.mode === 'sandbox' ? sandboxBackend() : apiBackend(s.token);
  $('#view-login').hidden = true;
  $('#view-dash').hidden = false;
  $('#adm-user').hidden = false;
  $('#adm-who').textContent = s.email;
  const mode = $('#adm-mode');
  mode.hidden = !s.demo;
  mode.textContent = s.mode === 'sandbox'
    ? 'Demo rejimi — dəyişikliklər saxlanmır (brauzerdə nümunə məlumat, server qoşulmayıb).'
    : 'Demo hesab — yalnız baxış: dəyişiklikləri server bloklayır.';
  $('#reset-sandbox').hidden = s.mode !== 'sandbox';
  refresh();
}

function logout() {
  session = null;
  backend = null;
  store.del(SESSION_KEY);
  $('#view-dash').hidden = true;
  $('#view-login').hidden = false;
  $('#adm-user').hidden = true;
  $('#adm-mode').hidden = true;
  view.selected = null;
  showDetail(null);
}

function handleError(err) {
  if (err.status === 401) { toast('Sessiyanın vaxtı bitdi, yenidən daxil olun.', true); logout(); return; }
  if (err.offline) { toast('Server cavab vermir. Bir az sonra yenidən yoxlayın.', true); return; }
  toast(err.message || 'Xəta baş verdi', true);
}

/* ---------- rendering ---------- */
async function refresh() {
  await Promise.all([loadStats(), loadList()]);
}

async function loadStats() {
  try {
    const { status, topTopics } = await backend.stats();
    $('#stats').replaceChildren(...Object.keys(STATUS).map((k) => el('li', { className: 'adm-stat' }, el('b', { textContent: status[k] ?? 0 }), el('span', { textContent: STATUS[k] }))));
    $('#topics').replaceChildren(...(topTopics.length ? [el('span', { textContent: 'Ən çox soruşulan:' })] : []),
      ...topTopics.slice(0, 5).map((t) => el('span', { className: 'chip', textContent: `${t.topic} · ${t.count}` })));
  } catch (err) { handleError(err); }
}

async function loadList() {
  try {
    const res = await backend.list({ q: view.q, status: view.status, page: view.page });
    view.pages = Math.max(1, res.pages);
    $('#rows').replaceChildren(...res.items.map(rowOf));
    $('#list-empty').hidden = res.items.length > 0;
    $('#page-info').textContent = `${res.page} / ${view.pages} · ${res.total} sorğu`;
    $('#prev').disabled = view.page <= 1;
    $('#next').disabled = view.page >= view.pages;
  } catch (err) { handleError(err); }
}

function rowOf(d) {
  const open = () => select(d.reference);
  const cell = (content, cls) => {
    const b = el('button', { type: 'button', className: cls || '' });
    b.append(content);
    b.addEventListener('click', open);
    return el('td', {}, b);
  };
  const tr = el('tr', {},
    cell(d.reference, 'adm-ref'),
    cell(fmtDate(d.createdAt)),
    cell(d.name),
    cell(d.topic || '—'),
    cell(el('span', { className: 'adm-badge s-' + d.status, textContent: STATUS[d.status] || d.status })));
  tr.dataset.ref = d.reference;
  if (d.reference === view.selected) tr.classList.add('is-active');
  // only the first cell is a tab stop; the others repeat the same action for mouse/touch
  Array.from(tr.querySelectorAll('button')).slice(1).forEach((b) => { b.tabIndex = -1; b.setAttribute('aria-hidden', 'true'); });
  tr.querySelector('button').setAttribute('aria-label', `${d.reference}, ${d.name}, ${STATUS[d.status] || d.status}`);
  return tr;
}

async function select(ref) {
  try {
    const d = await backend.get(ref);
    view.selected = d.reference;
    document.querySelectorAll('#rows tr').forEach((tr) => tr.classList.toggle('is-active', tr.dataset.ref === d.reference));
    showDetail(d);
    if (!matchMedia('(min-width: 1100px)').matches) $('#detail').scrollIntoView({ behavior: 'smooth', block: 'start' });
    $('#detail').focus({ preventScroll: true });
  } catch (err) { handleError(err); }
}

function showDetail(d) {
  const del = $('#d-delete');
  delete del.dataset.armed;
  del.textContent = 'Sil';
  $('#detail-empty').hidden = !!d;
  $('#detail-body').hidden = !d;
  if (!d) return;
  $('#d-title').textContent = `${d.reference} · ${d.name}`;
  const meta = [['E-poçt', d.email], ['Telefon', d.phone || '—'], ['Mövzu', d.topic || '—'], ['Səhifə', d.page || '—'], ['Tarix', fmtDateTime(d.createdAt)]];
  $('#d-meta').replaceChildren(...meta.flatMap(([k, v]) => [el('dt', { textContent: k }), el('dd', { textContent: v })]));
  $('#d-message').textContent = d.message;
  $('#d-status').value = d.status;
  $('#d-note').value = '';
  const notes = (d.notes || []).slice().reverse();
  $('#d-notes').replaceChildren(...(notes.length
    ? notes.map((n) => el('li', {}, el('time', { textContent: fmtDateTime(n.at) }), n.text))
    : [el('li', { className: 'adm-muted', textContent: 'Qeyd yoxdur.' })]));
}

/* ---------- events ---------- */
$('#login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = $('#login-email').value.trim();
  const password = $('#login-pass').value;
  const box = $('#login-error');
  box.textContent = '';
  if (!email || !password) { box.textContent = 'E-poçt və şifrəni yazın.'; return; }
  if (email.toLowerCase() === DEMO.email && password === DEMO.password) return demoLogin();
  if (!API) { box.textContent = 'Server hələ qoşulmayıb. "Demo admin kimi bax" düyməsi ilə nümunə məlumata baxa bilərsiniz.'; return; }
  const btn = $('#login-submit');
  btn.disabled = true;
  try {
    const { token } = await apiBackend().login(email, password);
    start({ mode: 'api', token, email, demo: false });
  } catch (err) {
    box.textContent = err.status === 401 ? 'E-poçt və ya şifrə yanlışdır.'
      : err.offline ? 'Server cavab vermir. "Demo admin kimi bax" ilə brauzer demo rejimini aça bilərsiniz.'
      : err.message;
  } finally { btn.disabled = false; }
});

async function demoLogin() {
  const btn = $('#demo-btn');
  btn.disabled = true;
  try {
    if (API) {
      try {
        const { token } = await apiBackend().login(DEMO.email, DEMO.password);
        return start({ mode: 'api', token, email: DEMO.email, demo: true });
      } catch (err) {
        if (!err.offline && err.status !== 503 && err.status !== 401) throw err;
        // API asleep, unreachable or without the demo account: fall back to the browser sandbox
      }
    }
    start({ mode: 'sandbox', email: DEMO.email, demo: true });
  } catch (err) {
    $('#login-error').textContent = err.message;
  } finally { btn.disabled = false; }
}
$('#demo-btn').addEventListener('click', demoLogin);

$('#adm-logout').addEventListener('click', logout);
$('#reset-sandbox').addEventListener('click', () => {
  if (backend && backend.reset) { backend.reset(); view.selected = null; showDetail(null); refresh(); toast('Demo məlumatı ilkin vəziyyətə qaytarıldı.'); }
});

$('#filters').addEventListener('submit', (e) => {
  e.preventDefault();
  view.q = $('#f-q').value.trim();
  view.status = $('#f-status').value;
  view.page = 1;
  loadList();
});
$('#f-status').addEventListener('change', () => $('#filters').requestSubmit());
$('#prev').addEventListener('click', () => { if (view.page > 1) { view.page--; loadList(); } });
$('#next').addEventListener('click', () => { if (view.page < view.pages) { view.page++; loadList(); } });

$('#status-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!view.selected) return;
  const body = { status: $('#d-status').value };
  const note = $('#d-note').value.trim();
  if (note) body.note = note;
  try {
    const d = await backend.update(view.selected, body);
    showDetail(d);
    toast(session.mode === 'sandbox' ? 'Yadda saxlanıldı (yalnız bu brauzerdə, demo).' : 'Yadda saxlanıldı.');
    refresh();
  } catch (err) { handleError(err); }
});

// Two-step delete instead of confirm(): a sandboxed iframe without allow-modals blocks dialogs.
let armTimer;
$('#d-delete').addEventListener('click', async () => {
  const btn = $('#d-delete');
  if (!view.selected) return;
  if (!btn.dataset.armed) {
    btn.dataset.armed = '1';
    btn.textContent = 'Təsdiqlə: sil';
    clearTimeout(armTimer);
    armTimer = setTimeout(() => { delete btn.dataset.armed; btn.textContent = 'Sil'; }, 4000);
    return;
  }
  clearTimeout(armTimer);
  delete btn.dataset.armed;
  btn.textContent = 'Sil';
  try {
    await backend.remove(view.selected);
    toast('Sorğu silindi.');
    view.selected = null;
    showDetail(null);
    refresh();
  } catch (err) { handleError(err); }
});

/* resume the session after a reload */
const saved = store.get(SESSION_KEY);
if (saved && (saved.mode === 'sandbox' || (saved.mode === 'api' && saved.token && API))) start(saved);
