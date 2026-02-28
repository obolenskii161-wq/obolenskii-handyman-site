// gallery.js
document.addEventListener('DOMContentLoaded', async () => {
    const photos = await fetchProjectPhotos();
    
    if (photos.length > 0) {
        initHeroCarousel(photos);
    }
});

function initHeroCarousel(photoPaths) {
    const container = document.getElementById('hero-carousel');
    if (!container) return;

    // Берем первые 5-7 фото для карусели
    const carouselPhotos = photoPaths.slice(0, 7);
    
    carouselPhotos.forEach((path, index) => {
        const img = document.createElement('img');
        img.src = path;
        img.className = 'carousel-img' + (index === 0 ? ' active' : '');
        container.appendChild(img);
    });

    let currentIndex = 0;
    const images = container.getElementsByClassName('carousel-img');

    setInterval(() => {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('active');
    }, 5000); // Смена каждые 5 секунд
}
