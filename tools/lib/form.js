// Contact / inquiry form markup. main.js (tools/js) relies on: form.contact-form, fields ad/email/telefon/mesaj,
// .form-status, .form-note, button[type=submit], action="mailto:...".
const { EMAIL } = require('../data');

function contactForm(id, compact) {
  return `<form class="contact-form${compact ? ' compact' : ''}" id="${id}" action="mailto:${EMAIL}" method="post" enctype="text/plain" novalidate>
            <div class="fields">
              <label><span class="visually-hidden">Adınız və soyadınız</span><input type="text" name="ad" placeholder="Adınız və soyadınız" autocomplete="name" required></label>
              <label><span class="visually-hidden">E-poçt ünvanınız</span><input type="email" name="email" placeholder="E-poçt ünvanınız" autocomplete="email" required></label>
              <label><span class="visually-hidden">Telefon nömrəniz</span><input type="tel" name="telefon" placeholder="Telefon nömrəniz" autocomplete="tel" pattern="[0-9 +()-]{7,}"></label>
            </div>
            <label class="msg"><span class="visually-hidden">Mesajınız</span><textarea name="mesaj" rows="7" placeholder="Mesajınız" required minlength="10"></textarea></label>
            <div class="form-foot">
              <button type="submit" class="btn btn-solid">Mesaj göndər</button>
              <p class="form-note">Göndər düyməsi e-poçt proqramınızı hazır mesajla açır.</p>
              <p class="form-status" role="status" aria-live="polite"></p>
            </div>
          </form>`;
}

module.exports = { contactForm };
