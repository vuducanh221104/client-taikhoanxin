import { MetadataRoute } from 'next';

type SitemapEntry = MetadataRoute.Sitemap[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
    const now = new Date();

    // Static pages (App Router routes thực tế, không bao gồm product)
    const staticRoutes = [
        '/', // Home
        '/product',
        '/categories',
        '/search',
        '/cart',
        '/wishlist',
        '/viewed',
        '/about',
        '/contact',
        '/payment',
        '/privacy',
        '/terms',
        '/orders/lookup',
        '/account',
        '/account/orders',
        '/account/transactions',
        '/account/addresses',
        '/account/comments',
        '/account/manage',
        '/account/password',
        '/auth/login',
        '/auth/register',
        '/auth/forgot-password',
        '/auth/reset-password',
        '/auth/google/callback',
        '/checkout',
        '/checkout/success',
    ];

    const staticPages: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
        url: `${siteUrl}${path === '/' ? '' : path}`,
        lastModified: now,
        changeFrequency: path === '/' ? 'daily' : 'weekly',
        priority: path === '/' ? 1 : 0.8,
    }));
    // Lưu ý:
    // - Category sitemap đã tách riêng ở /sitemap_category.xml
    // - Product sitemap đã tách riêng ở /sitemap_product.xml

    return [...staticPages];
}
