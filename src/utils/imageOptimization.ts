/**
 * Generate a simple blur data URL for image placeholder
 * This creates a tiny 10x10 gray gradient as a blur placeholder
 */
export function generateBlurDataURL(): string {
    const svg = `
        <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:rgb(240,240,240);stop-opacity:1" />
                    <stop offset="100%" style="stop-color:rgb(220,220,220);stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="10" height="10" fill="url(#grad)" />
        </svg>
    `;
    
    const base64 = Buffer.from(svg).toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Generate a colored blur data URL based on a color
 */
export function generateColoredBlurDataURL(color: string = '#f0f0f0'): string {
    const svg = `
        <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg">
            <rect width="10" height="10" fill="${color}" />
        </svg>
    `;
    
    const base64 = Buffer.from(svg).toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Shimmer effect blur data URL
 */
export function generateShimmerBlurDataURL(): string {
    const shimmer = (w: number, h: number) => `
        <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs>
                <linearGradient id="g">
                    <stop stop-color="#f6f7f8" offset="0%" />
                    <stop stop-color="#edeef1" offset="20%" />
                    <stop stop-color="#f6f7f8" offset="40%" />
                    <stop stop-color="#f6f7f8" offset="100%" />
                </linearGradient>
            </defs>
            <rect width="${w}" height="${h}" fill="#f6f7f8" />
            <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
            <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
        </svg>
    `;
    
    const base64 = Buffer.from(shimmer(700, 475)).toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Default blur placeholder for product images
 */
export const DEFAULT_BLUR_DATA_URL = generateBlurDataURL();

/**
 * Shimmer blur placeholder
 */
export const SHIMMER_BLUR_DATA_URL = generateShimmerBlurDataURL();
