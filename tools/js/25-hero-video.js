// Home hero time-lapse (only rendered when HERO_VIDEO.ready in tools/data.js).
// Muted + playsinline, lazy (sources attached when the hero is on screen), plays once and holds the final frame,
// replay button, pauses while off screen. Under prefers-reduced-motion the video is never loaded: poster only.
const heroFig = $('.hero-video');
if (heroFig) {
  const video = $('.hero-video-clip', heroFig);
  const replay = $('.hero-video-replay', heroFig);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let loaded = false, visible = false;

  const load = () => {
    if (loaded) return;
    loaded = true;
    [['webm', 'video/webm'], ['mp4', 'video/mp4']].forEach(([k, type]) => {
      if (!video.dataset[k]) return;
      const s = document.createElement('source');
      s.src = video.dataset[k]; s.type = type;
      video.appendChild(s);
    });
    video.load();
  };
  const play = () => {
    if (reduce.matches || !visible || video.ended) return;
    load();
    const p = video.play();
    if (p && p.catch) p.catch(() => { replay.hidden = false; }); // autoplay blocked: let the visitor start it
  };

  video.addEventListener('playing', () => { heroFig.classList.add('is-playing'); replay.hidden = true; });
  video.addEventListener('ended', () => { replay.hidden = false; }); // no loop: the last frame stays on screen
  replay.addEventListener('click', () => { video.currentTime = 0; replay.hidden = true; visible = true; load(); video.play().catch(() => { replay.hidden = false; }); });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) play();
      else if (!video.paused) video.pause();
    }, { threshold: 0.25 }).observe(heroFig);
  } else { visible = true; play(); }

  // switching reduced motion on mid-play: stop and fall back to the poster
  reduce.addEventListener('change', () => {
    if (reduce.matches) { video.pause(); heroFig.classList.remove('is-playing'); replay.hidden = true; } else play();
  });
}
