/* Gallery lightbox */
const lb = $('#lightbox');
if (lb && typeof lb.showModal === 'function') {
  const img = $('img', lb);
  $$('.gal-open').forEach(b => b.addEventListener('click', () => {
    img.src = b.dataset.full;
    img.alt = $('img', b).alt;
    lb.showModal();
  }));
  $('.lb-close', lb).addEventListener('click', () => lb.close());
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
}

