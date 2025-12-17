import { NextResponse } from 'next/server';

interface ProductItem {
    slug?: string;
    updatedAt?: string;
    createdAt?: string;
}

interface ProductListResponse {
    success?: boolean;
    data?: ProductItem[];
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const apiBase = process.env.NEXT_PUBLIC_SERVER_URL || siteUrl;

function formatDate(date: Date) {
    return date.toISOString();
}

function buildXml(urls: { loc: string; lastmod: string; changefreq?: string; priority?: number }[]) {
    const entries = urls
        .map((item) => {
            const changefreq = item.changefreq ? `<changefreq>${item.changefreq}</changefreq>` : '';
            const priority = item.priority !== undefined ? `<priority>${item.priority}</priority>` : '';
            return `<url><loc>${item.loc}</loc><lastmod>${item.lastmod}</lastmod>${changefreq}${priority}</url>`;
        })
        .join('');

    return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`;
}

export async function GET() {
    const now = new Date();
    let productUrls: { loc: string; lastmod: string; changefreq: string; priority: number }[] = [];

    try {
        const res = await fetch(`${apiBase}/api/v1/products?limit=200`, {
            next: { revalidate: 3600 },
        });

        if (res.ok) {
            const json = (await res.json()) as ProductListResponse;
            const products = json.data || [];

            productUrls = products
                .filter((product) => typeof product.slug === 'string' && product.slug.length > 0)
                .map((product) => {
                    const lastModified = product.updatedAt
                        ? new Date(product.updatedAt)
                        : product.createdAt
                        ? new Date(product.createdAt)
                        : now;

                    return {
                        loc: `${siteUrl}/product/${product.slug}`,
                        lastmod: formatDate(lastModified),
                        changefreq: 'weekly',
                        priority: 0.6,
                    };
                });
        }
    } catch (error) {
        console.warn('Failed to fetch products for sitemap_product:', error);
    }

    const xml = buildXml(productUrls);

    return new NextResponse(xml, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
