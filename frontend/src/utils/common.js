import { MEDIA_BASE_URL } from '../constants'

export const generateImageUrl = (dbImageUrl) => {
    // 1. Safety check: return empty string or null if no image is provided
    if (!dbImageUrl) return '';

    // 2. If it already starts with http (handles both http:// and https://)
    if (dbImageUrl.startsWith('http')) {
        return dbImageUrl;
    }

    // 3. If MEDIA_BASE_URL is present, append it safely
    if (MEDIA_BASE_URL) {
        // Remove trailing slash from base, and leading slash from the image path
        const baseUrl = MEDIA_BASE_URL.replace(/\/$/, '');
        const path = dbImageUrl.replace(/^\//, '');
        
        return `${baseUrl}/${path}`;
    }

    // 4. Otherwise, prepend '/' at the start (checking first so we don't do '//path')
    return dbImageUrl.startsWith('/') ? dbImageUrl : `/${dbImageUrl}`;
}