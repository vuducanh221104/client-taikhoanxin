import { NextResponse } from 'next/server';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const now = new Date();

// Static pages (App Router routes thực tế, không bao gồm product và category)
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

/**
 * Generate static pages sitemap XML
 */
export async function GET() {
    const urls = staticRoutes
        .map((path) => {
            const url = `${siteUrl}${path === '/' ? '' : path}`;
            return `  <url>
    <loc>${url}</loc>
    <lastmod>${now.toISOString()}</lastmod>
    <changefreq>${path === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${path === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
        })
        .join('\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    return new NextResponse(sitemap, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}

