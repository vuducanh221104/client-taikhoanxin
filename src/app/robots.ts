import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/admin/',
                    '/dashboard/',
                    '/_next/',
                    '/private/',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: ['/api/', '/admin/', '/dashboard/'],
            },
        ],
        sitemap: [
            `${siteUrl}/sitemap.xml`,
            `${siteUrl}/sitemap_product.xml`,
            `${siteUrl}/sitemap_category.xml`,
        ],
        host: siteUrl,
    };
}
