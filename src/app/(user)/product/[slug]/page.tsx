import type { Metadata } from 'next';
import ProductDetailLayout from '@/layout/productDetail';
import { SWRConfig } from 'swr';
import Script from 'next/script';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const apiBase = process.env.NEXT_PUBLIC_SERVER_URL || 'https://taikhoanxin.com';
const defaultOgImage = 'https://taikhoanxin.com/seo/banner-seo.jpeg';

type ProductApiResponse = {
    product?: Record<string, unknown>;
    [key: string]: unknown;
};

type NormalizedProduct = {
    name: string;
        slug: string;
    image: string;
    shortDescription?: string;
    descriptionText?: string;
    descriptionArray?: Array<{ description?: string }>;
};

function normalizeProduct(raw: ProductApiResponse | null | undefined, slug: string): NormalizedProduct | null {
    if (!raw) return null;
    const product = (raw as ProductApiResponse).product || raw;

    const name =
        (typeof product.name === 'string' && product.name) ||
        (typeof product.productName === 'string' && product.productName) ||
        (typeof product.title === 'string' && product.title) ||
        (typeof product.slug === 'string' && product.slug) ||
        slug;

    const slugValue =
        (typeof product.slug === 'string' && product.slug) || slug;

    let image = defaultOgImage;
    if (Array.isArray(product.image) && typeof product.image[0] === 'string') {
        image = product.image[0];
    }

    const shortDescription = typeof product.shortDescription === 'string' ? product.shortDescription : undefined;
    const descriptionText = typeof product.description === 'string' ? product.description : undefined;
    const descriptionArray = Array.isArray(product.description) ? product.description : undefined;

    return {
        name,
        slug: slugValue,
        image,
        shortDescription,
        descriptionText,
        descriptionArray,
    };
}

async function fetchProduct(slug: string) {
    try {
        const res = await fetch(`${apiBase}/api/v1/products/${slug}`, {
            next: { revalidate: 300 },
        });
        if (!res.ok) return null;
        const data = await res.json();
        return normalizeProduct(data?.data, slug);
    } catch {
        return null;
    }
}

async function fetchProductResponse(slug: string) {
    try {
        const res = await fetch(`${apiBase}/api/v1/products/${slug}`, {
            next: { revalidate: 300 },
        });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

function buildProductJsonLd(raw: any, slug: string) {
    const product = raw?.data?.product || raw?.product || raw;
    if (!product) return null;

    const url = `${siteUrl}/product/${product.slug || slug}`;
    const name = product.name || product.productName || product.title || product.slug || slug;
    const images: string[] = Array.isArray(product.image)
        ? product.image.filter((item: any) => typeof item === 'string')
        : [];
    if (images.length === 0) {
        images.push(defaultOgImage);
    }
    const description =
        product.shortDescription ||
        product.description ||
        (Array.isArray(product.description) ? product.description?.[0]?.description : '') ||
        'Mua tài khoản bản quyền tại TaiKhoanXin.';

    const priceItem = Array.isArray(product.price) ? product.price[0] : product.price;
    const price = priceItem?.priceOriginal ?? priceItem?.original ?? 0;
    const currency = priceItem?.currency || 'VND';
    const availability = (product.isAvailable ?? product.isActive) === false ? 'OutOfStock' : 'InStock';

    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name,
        image: images,
        description,
        sku: product._id || slug,
        brand: {
            '@type': 'Organization',
            name: 'TaiKhoanXin',
        },
        offers: {
            '@type': 'Offer',
            url,
            priceCurrency: currency,
            price: price || 0,
            availability: `https://schema.org/${availability}`,
        },
    });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const product = await fetchProduct(params.slug);

    const fallbackTitle = 'Sản phẩm | TaiKhoanXin';
    const fallbackDescription = 'Mua tài khoản bản quyền uy tín tại TaiKhoanXin.';

    if (!product) {
        return {
            title: fallbackTitle,
            description: fallbackDescription,
            alternates: {
                canonical: `${siteUrl}/product/${params.slug}`,
            },
        };
    }

    const productName = product.name;
    const title = `${productName} | TaiKhoanXin`;
    const description =
        product.shortDescription ||
        product.descriptionText ||
        product.descriptionArray?.[0]?.description ||
        fallbackDescription;
    const image = product.image || defaultOgImage;
    const canonical = `${siteUrl}/product/${product.slug || params.slug}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: canonical,
            siteName: 'TaiKhoanXin',
            images: [
                {
                    url: image.startsWith('http') ? image : `${siteUrl}${image}`,
                    width: 1200,
                    height: 630,
                    alt: productName,
                },
            ],
            type: 'website',
            locale: 'vi_VN',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image.startsWith('http') ? image : `${siteUrl}${image}`],
        },
        alternates: {
            canonical,
        },
    };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
    const productResponse = await fetchProductResponse(params.slug);
    const fallbackKey = `/api/v1/products/${params.slug}`;
    const productJsonLd = buildProductJsonLd(productResponse, params.slug);

    return (
        <SWRConfig
            value={{
                fallback: productResponse ? { [fallbackKey]: productResponse } : {},
            }}
        >
            {productJsonLd ? (
                <Script
                    id={`ld-product-${params.slug}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: productJsonLd }}
                />
            ) : null}
            <ProductDetailLayout slug={params.slug} />
        </SWRConfig>
    );
}
