/* (also: catalogue chip row, at the end) Gallery lightbox: native <dialog> (Escape closes, focus is trapped by the browser),
   previous / next buttons + arrow keys, caption from the image alt, focus returns to the opener. */
const lb = $('#lightbox');
if (lb && typeof lb.showModal === 'function') {
  const lbImg = $('.lb-img', lb) || $('img', lb);
  const lbCap = $('.lb-caption', lb);
  const lbCount = $('.lb-count', lb);
  const openers = $$('.gal-open');
  let cur = 0;
  let opener = null;
  const show = i => {
    cur = (i + openers.length) % openers.length;
    const b = openers[cur];
    const alt = $('img', b).alt;
    lbImg.src = b.dataset.full;
    lbImg.alt = alt;
    if (lbCap) lbCap.textContent = alt;
    if (lbCount) lbCount.textContent = `${cur + 1} / ${openers.length}`;
  };
  openers.forEach((b, i) => b.addEventListener('click', () => {
    opener = b;
    show(i);
    lb.showModal();
    const close = $('.lb-close', lb);
    if (close) close.focus();
  }));
  const prev = $('.lb-prev', lb), next = $('.lb-next', lb);
  if (prev) prev.addEventListener('click', () => show(cur - 1));
  if (next) next.addEventListener('click', () => show(cur + 1));
  if (openers.length < 2) [prev, next].forEach(b => { if (b) b.hidden = true; });
  $('.lb-close', lb).addEventListener('click', () => lb.close());
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(cur - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); show(cur + 1); }
  });
  lb.addEventListener('close', () => {
    // the browser usually restores focus itself; make sure the opener (the image the visitor chose last) gets it
    const target = openers[cur] || opener;
    if (target) target.focus();
  });
}

/* Catalogue: on small screens the category chip row scrolls sideways – bring the current category into view */
const catCur = $('.cat-nav-list [aria-current="page"]');
if (catCur) {
  const row = catCur.closest('.cat-nav-list');
  if (row.scrollWidth > row.clientWidth) row.scrollLeft = catCur.parentElement.offsetLeft - row.offsetLeft - 4;
}
