// photos.js (template) — auto-load from GitHub folder /assets/projects
(() => {
  const OWNER  = "obolenskii161-wq";
  const REPO   = "obolenskii-handyman-site";
  const BRANCH = "main";
  const FOLDER = "assets/projects";

  const CACHE_KEY = "obolenskii_photos_cache_v2";
  const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

  function isImage(name) {
    return /\.(jpg|jpeg|png|webp|gif)$/i.test(name || "");
  }

  function loadCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (!obj || !obj.ts || !Array.isArray(obj.all)) return null;
      if (Date.now() - obj.ts > CACHE_TTL_MS) return null;
      return obj.all;
    } catch { return null; }
  }

  function saveCache(all) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), all }));
    } catch {}
  }

  function pickFeatured(list, n = 8) {
    const arr = list.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, Math.min(n, arr.length));
  }

  async function fetchList() {
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FOLDER}?ref=${BRANCH}`;
    const res = await fetch(url, { headers: { "Accept": "application/vnd.github+json" } });
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

    const data = await res.json();
    const all = (Array.isArray(data) ? data : [])
      .filter(x => x && x.type === "file" && isImage(x.name) && x.download_url)
      .map(x => x.download_url)
      .sort((a,b) => a.localeCompare(b));

    return all;
  }

  window.OBOLENSKII_PHOTOS = { featured: [], all: [] };

  window.OBOLENSKII_PHOTOS_READY = (async () => {
    const cached = loadCache();
    if (cached?.length) {
      window.OBOLENSKII_PHOTOS.all = cached;
      window.OBOLENSKII_PHOTOS.featured = pickFeatured(cached, 8);

      // refresh in background
      fetchList().then(all => {
        if (all.length) {
          window.OBOLENSKII_PHOTOS.all = all;
          window.OBOLENSKII_PHOTOS.featured = pickFeatured(all, 8);
          saveCache(all);
        }
      }).catch(()=>{});

      return window.OBOLENSKII_PHOTOS;
    }

    const all = await fetchList();
    window.OBOLENSKII_PHOTOS.all = all;
    window.OBOLENSKII_PHOTOS.featured = pickFeatured(all, 8);
    saveCache(all);
    return window.OBOLENSKII_PHOTOS;
  })();
})();
