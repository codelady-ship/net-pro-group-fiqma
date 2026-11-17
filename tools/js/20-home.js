// Home page: sliders and gallery strip
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

