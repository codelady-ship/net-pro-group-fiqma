// Contact / inquiry form markup. main.js (tools/js/40-forms.js) relies on: form.contact-form, fields ad/email/telefon/mesaj,
// .field-error[data-for=<name>] slots, .form-status, .form-note, .form-topic, button[type=submit], action="mailto:...".
// The honeypot field `website` is added by 40-forms.js (hidden from people and assistive technology).
const { EMAIL } = require('../data');
const { icon } = require('./icons');

function field(id, { name, label, type = 'text', req = false, hint = '', attrs = '', textarea = false }) {
  const fid = `${id}-${name}`;
  const desc = [hint && `${fid}-hint`, `${fid}-err`].filter(Boolean).join(' ');
  const control = textarea
    ? `<textarea id="${fid}" name="${name}" rows="6"${req ? ' required' : ''} ${attrs} aria-describedby="${desc}"></textarea>`
    : `<input id="${fid}" type="${type}" name="${name}"${req ? ' required' : ''} ${attrs} aria-describedby="${desc}">`;
  return `<div class="field field--${name}">
                <label for="${fid}">${label}${req ? ' <span class="req" aria-hidden="true">*</span>' : ' <span class="opt">(istəyə bağlı)</span>'}</label>
                ${control}
                ${hint ? `<p class="field-hint" id="${fid}-hint">${hint}</p>` : ''}
                <p class="field-error" id="${fid}-err" data-for="${name}"></p>
              </div>`;
}

function contactForm(id, compact) {
  return `<form class="contact-form${compact ? ' compact' : ''}" id="${id}" action="mailto:${EMAIL}" method="post" enctype="text/plain" novalidate>
            <p class="form-topic" hidden></p>
            <div class="fields">
              ${field(id, { name: 'ad', label: 'Adınız və soyadınız', req: true, attrs: 'autocomplete="name" minlength="2" maxlength="80"' })}
              ${field(id, { name: 'email', label: 'E-poçt ünvanınız', type: 'email', req: true, hint: 'Cavabı bu ünvana göndərəcəyik.', attrs: 'autocomplete="email" maxlength="120" inputmode="email"' })}
              ${field(id, { name: 'telefon', label: 'Telefon nömrəniz', type: 'tel', hint: 'Məs.: +994 50 000 00 00', attrs: 'autocomplete="tel" maxlength="30" pattern="[0-9 +\\(\\)\\-]{7,}"' })}
              ${field(id, { name: 'mesaj', label: 'Mesajınız', req: true, textarea: true, hint: 'Ən azı 10 simvol. Məhsulun və ya xidmətin adını qeyd etsəniz, daha tez cavab verərik.', attrs: 'minlength="10" maxlength="3000"' })}
            </div>
            <p class="form-legend"><span class="req" aria-hidden="true">*</span> ilə qeyd olunan sahələr mütləqdir.</p>
            <div class="form-foot">
              <button type="submit" class="btn btn--primary form-submit"><span class="btn-label">Mesaj göndər</span>${icon('send', { size: 20 })}</button>
              <p class="form-note">${icon('info', { size: 18 })}<span>Göndər düyməsi e-poçt proqramınızı hazır mesajla açır.</span></p>
            </div>
            <div class="form-status" role="status" aria-live="polite"></div>
          </form>`;
}

module.exports = { contactForm };
