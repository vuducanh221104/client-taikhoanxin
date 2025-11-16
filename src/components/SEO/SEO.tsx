'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';

export interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    type?: 'website' | 'article' | 'product';
    price?: number;
    currency?: string;
    availability?: 'in stock' | 'out of stock';
    noindex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
    title = 'Tài Khoản Xịn - Tài khoản chính hãng giá rẻ',
    description = 'Mua tài khoản Windows, Office, AI, Netflix, Spotify chính hãng giá rẻ. Uy tín, bảo hành, giao hàng nhanh.',
    keywords = 'tài khoản windows, office 365, google ai, netflix, spotify, tài khoản chính hãng',
    image = '/og-image.png',
    type = 'website',
    price,
    currency = 'VND',
    availability,
    noindex = false,
}) => {
    const pathname = usePathname();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
    const currentUrl = `${siteUrl}${pathname}`;

    // Structured data for organization
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Tài Khoản Xịn',
        url: siteUrl,
        logo: `${siteUrl}/logo.png`,
        description: 'Cung cấp tài khoản phần mềm chính hãng giá rẻ',
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+84-xxx-xxx-xxx',
            contactType: 'customer service',
            areaServed: 'VN',
            availableLanguage: 'Vietnamese',
        },
        sameAs: [
            'https://facebook.com/taikhoanxin',
            'https://twitter.com/taikhoanxin',
        ],
    };

    // Structured data for product
    const productSchema = type === 'product' && price ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: title,
        description: description,
        image: `${siteUrl}${image}`,
        offers: {
            '@type': 'Offer',
            price: price,
            priceCurrency: currency,
            availability: availability === 'in stock' 
                ? 'https://schema.org/InStock' 
                : 'https://schema.org/OutOfStock',
            url: currentUrl,
        },
    } : null;

    // Breadcrumb schema
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Trang chủ',
                item: siteUrl,
            },
        ],
    };

    return (
        <Head>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            {noindex && <meta name="robots" content="noindex,nofollow" />}

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={`${siteUrl}${image}`} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:site_name" content="Tài Khoản Xịn" />
            <meta property="og:locale" content="vi_VN" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={`${siteUrl}${image}`} />

            {/* Canonical URL */}
            <link rel="canonical" href={currentUrl} />

            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organizationSchema),
                }}
            />
            {productSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(productSchema),
                    }}
                />
            )}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbSchema),
                }}
            />
        </Head>
    );
};

export default SEO;
