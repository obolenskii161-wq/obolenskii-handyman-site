/* gallery.js */
(() => {
  const state = {
    inited: false,
    batch: 18,
    cursor: 0,
    order: [],
    io: null
  };

  function $(id){ return document.getElementById(id); }

  function shuffle(arr){
    const a = arr.slice();
    for (let i=a.length-1; i>0; i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function buildObserver(){
    if (state.io) return;
    state.io = new IntersectionObserver((entries) => {
      for (const e of entries){
        if (e.isIntersecting){
          e.target.classList.add('in');
          state.io.unobserve(e.target);
        }
      }
    }, { root: null, threshold: 0.08 });
  }

  function createItem(src){
    const wrap = document.createElement('div');
    wrap.className = 'gItem';
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.alt = 'Project photo';
    img.src = src;
    wrap.appendChild(img);
    return wrap;
  }

  function updateCounter(){
    const total = state.order.length;
    const loaded = Math.min(state.cursor, total);
    const counter = $('gCounter');
    if (counter) counter.textContent = `Loaded ${loaded} / ${total}`;
    const btn = $('gLoadBtn');
    if (btn) btn.disabled = loaded >= total;
  }

  function loadMore(){
    const grid = $('galleryGrid');
    if (!grid) return;

    const total = state.order.length;
    if (!total){ updateCounter(); return; }

    buildObserver();

    const end = Math.min(state.cursor + state.batch, total);
    for (let i = state.cursor; i < end; i++){
      const item = createItem(state.order[i]);
      grid.appendChild(item);
      state.io.observe(item);
    }
    state.cursor = end;
    updateCounter();
  }

  function ensureInit(){
    if (state.inited) return;

    const photos = window.OBOLENSKII_PHOTOS?.all || [];
    const featured = window.OBOLENSKII_PHOTOS?.featured || [];

    // Prefer full list; fall back to featured
    const base = photos.length ? photos : featured;
    state.order = shuffle(base);

    // Wire button + infinite scroll
    const btn = $('gLoadBtn');
    if (btn) btn.addEventListener('click', loadMore);

    window.addEventListener('scroll', () => {
      const overlay = document.getElementById('galleryOverlay');
      if (!overlay || !overlay.classList.contains('active')) return;

      const btn2 = $('gLoadBtn');
      if (!btn2 || btn2.disabled) return;

      const doc = overlay;
      // use viewport of window; load when near bottom
      const nearBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 800);
      if (nearBottom) loadMore();
    }, { passive: true });

    // First load
    loadMore();
    state.inited = true;
  }

  // expose
  window.OBOLENSKII_GALLERY = { ensureInit };
})();
