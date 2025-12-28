import { NextResponse } from 'next/server';

interface CategoryItem {
    slug?: string;
    updatedAt?: string;
    createdAt?: string;
}

interface CategoryListResponse {
    success?: boolean;
    data?: CategoryItem[];
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
    let categoryUrls: { loc: string; lastmod: string; changefreq: string; priority: number }[] = [];

    try {
        const res = await fetch(`${apiBase}/api/v1/categories`, {
            next: { revalidate: 1800 },
        });

        if (res.ok) {
            const json = (await res.json()) as CategoryListResponse;
            const categories = json.data || [];

            categoryUrls = categories
                .filter((cat) => typeof cat.slug === 'string' && cat.slug.length > 0)
                .map((cat) => {
                    const lastModified = cat.updatedAt
                        ? new Date(cat.updatedAt)
                        : cat.createdAt
                        ? new Date(cat.createdAt)
                        : now;

                    return {
                        loc: `${siteUrl}/categories/${cat.slug}`,
                        lastmod: formatDate(lastModified),
                        changefreq: 'daily',
                        priority: 0.7,
                    };
                });
        }
    } catch (error) {
        console.warn('Failed to fetch categories for sitemap_category:', error);
    }

    const xml = buildXml(categoryUrls);

    return new NextResponse(xml, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
