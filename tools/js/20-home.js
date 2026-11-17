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
