// photos.js - Automatic GitHub Content Loader
const REPO_OWNER = 'obolenskii161-wq';
const REPO_NAME = 'obolenskii-handyman-site';
const FOLDER_PATH = 'assets/projects';

async function fetchProjectPhotos() {
    try {
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FOLDER_PATH}`);
        if (!response.ok) throw new Error('Failed to fetch folder contents');
        const data = await response.json();
        
        // Filter only images
        return data
            .filter(file => file.name.match(/\.(jpe?g|png|webp)$/i))
            .map(file => file.path); // Return relative paths
    } catch (error) {
        console.error("Gallery Error:", error);
        return [];
    }
}
