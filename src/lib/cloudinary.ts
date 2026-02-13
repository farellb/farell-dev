// Cloudinary utility for client-side uploads or server-side optimization
// Required: npm install next-cloudinary or strictly using their URL API

// For now, simple URL builder helper if we just store URLs
export const getOptimizedImageUrl = (url: string, width = 800) => {
    if (!url.includes('cloudinary.com')) return url;
    // Basic Cloudinary transformation logic - replace /upload/ with /upload/w_{width},q_auto,f_auto/
    return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
};
