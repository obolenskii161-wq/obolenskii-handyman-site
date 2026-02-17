// Auto-load images from GitHub repo folder assets/projects (no manual list)
(() => {
  const OWNER = "obolenskii161-wq";
  const REPO = "obolenskii-handyman-site";
  const BRANCH = "main";
  const FOLDER = "assets/projects";

  function isImage(name) {
    return /\.(jpg|jpeg|png|webp|gif)$/i.test(name || "");
  }

  function toSitePath(name) {
    return `/${FOLDER}/${encodeURIComponent(name)}`.replace(/%2F/g, "/");
  }

  function pickFeatured(list, n = 8) {
    const arr = list.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, Math.min(n, arr.length));
  }

  window.OBOLENSKII_PHOTOS = { featured: [], all: [] };
  window.OBOLENSKII_PHOTOS_READY = (async () => {
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FOLDER}?ref=${BRANCH}`;
    const res = await fetch(url, { headers: { "Accept": "application/vnd.github+json" } });
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

    const data = await res.json();
    const names = (Array.isArray(data) ? data : [])
      .map(x => x && x.name)
      .filter(isImage)
      .sort((a,b) => a.localeCompare(b));

    const all = names.map(toSitePath);
    window.OBOLENSKII_PHOTOS.all = all;
    window.OBOLENSKII_PHOTOS.featured = pickFeatured(all, 8);
    return window.OBOLENSKII_PHOTOS;
  })();
})();
