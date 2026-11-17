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

