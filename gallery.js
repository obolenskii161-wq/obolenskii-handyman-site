// gallery.js - Controls the Hero Crossfade
document.addEventListener('DOMContentLoaded', async () => {
    const photos = await fetchProjectPhotos();
    
    if (photos.length > 0) {
        initHeroCarousel(photos);
    } else {
        // Fallback if no photos found in repo
        const container = document.getElementById('hero-carousel');
        container.innerHTML = `<img src="assets/hero/hero.jpg" class="carousel-img active">`;
    }
});

function initHeroCarousel(photoPaths) {
    const container = document.getElementById('hero-carousel');
    if (!container) return;

    // We use up to 10 photos for the background rotation
    const carouselPhotos = photoPaths.slice(0, 10);
    
    carouselPhotos.forEach((path, index) => {
        const img = document.createElement('img');
        img.src = path;
        img.className = 'carousel-img' + (index === 0 ? ' active' : '');
        container.appendChild(img);
    });

    let currentIndex = 0;
    const images = container.getElementsByClassName('carousel-img');

    if (images.length > 1) {
        setInterval(() => {
            images[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % images.length;
            images[currentIndex].classList.add('active');
        }, 5000); // Crossfade every 5 seconds
    }
}
