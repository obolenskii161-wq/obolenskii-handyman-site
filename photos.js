// photos.js
const REPO_OWNER = 'obolenskii161-wq';
const REPO_NAME = 'obolenskii-handyman-site';
const FOLDER_PATH = 'assets/projects';

async function fetchProjectPhotos() {
    try {
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FOLDER_PATH}`);
        const data = await response.json();
        
        // Фильтруем только файлы изображений
        return data
            .filter(file => file.name.match(/\.(jpe?g|png|webp)$/i))
            .map(file => file.path);
    } catch (error) {
        console.error("Error fetching photos from GitHub:", error);
        return [];
    }
}
