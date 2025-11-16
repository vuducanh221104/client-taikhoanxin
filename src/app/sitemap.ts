import { MetadataRoute } from 'next';
import { getAllProducts } from '@/services/productService';

export default function sitemap(): MetadataRoute.Sitemap {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
    
    // Static pages
    const staticPages = [
        '',
        '/products',
        '/cart',
        '/wishlist',
        '/auth/login',
        '/auth/register',
        '/about',
        '/contact',
    ].map((route) => ({
        url: `${siteUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Category pages
    const categories = [
        'work',
        'ai-account',
        'entertainment',
        'windows',
        'office',
        'education',
        'design',
        'cloud-storage',
    ].map((slug) => ({
        url: `${siteUrl}/categories/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
    }));

    // Product pages
    const products = getAllProducts();
    const productPages = products.map((product) => ({
        url: `${siteUrl}/products/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [...staticPages, ...categories, ...productPages];
}
