import type { Metadata } from 'next';
import CategoryDetailLayout from '@/layout/categoryDetail';
import { SWRConfig } from 'swr';
import Script from 'next/script';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const apiBase = process.env.NEXT_PUBLIC_SERVER_URL || 'https://taikhoanxin.com';
const defaultOgImage = 'https://cdn.taikhoanxin.com/seo/banner-seo.jpeg';

async function fetchCategory(slug: string) {
    try {
        const res = await fetch(`${apiBase}/api/v1/categories/${slug}`, {
            next: { revalidate: 300 },
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data?.data?.category || null;
    } catch {
        return null;
    }
}

async function fetchCategoryResponse(slug: string) {
    try {
        const res = await fetch(`${apiBase}/api/v1/categories/${slug}`, {
            next: { revalidate: 300 },
        });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

const DEFAULT_PRICE_RANGE: [number, number] = [0, 10_000_000];
const DEFAULT_ITEMS_PER_PAGE = 30;

function buildProductsKey(slug: string) {
    const queryParams = new URLSearchParams();
    queryParams.append('page', '1');
    queryParams.append('limit', DEFAULT_ITEMS_PER_PAGE.toString());
    queryParams.append('categorySlug', slug);
    queryParams.append('minPrice', DEFAULT_PRICE_RANGE[0].toString());
    queryParams.append('maxPrice', DEFAULT_PRICE_RANGE[1].toString());
    queryParams.append('sortBy', 'createdAt');
    queryParams.append('sortOrder', 'desc');
    return `/api/v1/products?${queryParams.toString()}`;
}

async function fetchCategoryProducts(slug: string) {
    const productsKey = buildProductsKey(slug);
    try {
        const res = await fetch(`${apiBase}${productsKey}`, {
            next: { revalidate: 300 },
        });
        if (!res.ok) return { productsKey, data: null as any };
        const data = await res.json();
        return { productsKey, data };
    } catch {
        return { productsKey, data: null as any };
    }
}

function buildCategoryJsonLd(raw: any, slug: string) {
    const category = raw?.data?.category || raw?.category || raw;
    if (!category) return null;
    const name = category.name || 'Danh mục';
    const description =
        category.description || `Khám phá sản phẩm trong danh mục ${name} tại TaiKhoanXin.`;
    const url = `${siteUrl}/categories/${slug}`;

    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name,
        description,
        url,
        image: [defaultOgImage],
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Trang chủ',
                    item: siteUrl,
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name,
                    item: url,
                },
            ],
        },
    });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const category = await fetchCategory(params.slug);
    const name = category?.name || 'Danh mục';
    const title = `${name} | TaiKhoanXin`;
    const description =
        category?.description ||
        `Khám phá sản phẩm trong danh mục ${name} tại TaiKhoanXin.`;
    const canonical = `${siteUrl}/categories/${params.slug}`;

    return {
        title,
        description,
        alternates: { canonical },
        openGraph: {
            title,
            description,
            url: canonical,
            siteName: 'TaiKhoanXin',
            locale: 'vi_VN',
            type: 'website',
            images: [
                {
                    url: defaultOgImage,
                    width: 1200,
                    height: 630,
                    alt: name,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [defaultOgImage],
        },
    };
}

export default async function CategoryDetailPage({ params }: { params: { slug: string } }) {
    const categoryResponse = await fetchCategoryResponse(params.slug);
    const { productsKey, data: productsResponse } = await fetchCategoryProducts(params.slug);
    const fallback: Record<string, unknown> = {};
    const categoryJsonLd = buildCategoryJsonLd(categoryResponse, params.slug);

    if (categoryResponse) {
        fallback[`/api/v1/categories/${params.slug}`] = categoryResponse;
    }
    if (productsResponse) {
        fallback[productsKey] = productsResponse;
    }

    return (
        <SWRConfig
            value={{
                fallback,
            }}
        >
            {categoryJsonLd ? (
                <Script
                    id={`ld-category-${params.slug}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: categoryJsonLd }}
                />
            ) : null}
            <CategoryDetailLayout />
        </SWRConfig>
    );
}
