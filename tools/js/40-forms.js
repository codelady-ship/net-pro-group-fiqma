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
  trap.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;padding:0;border:0;opacity:0';
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
