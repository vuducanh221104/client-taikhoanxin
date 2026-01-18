import '@/styles/globals.scss';
import '@/styles/accessibility.scss';

import dynamic from 'next/dynamic';
import ProviderRedux from '@/redux/ProviderRedux';
import { ToastProvider } from '@/contexts/ToastContext';
import { harmonyOS } from '@/assets/FontNext';
import { Metadata, Viewport } from 'next/types';
import Script from 'next/script';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import LayoutWrapper from './LayoutWrapper';
import { ConfirmDialogProvider } from '@/components/ConfirmDialog';

// Lazy load non-critical components for better performance
const ScrollToTop = dynamic(() => import('@/components/ScrollToTop'), { ssr: false });
const ToastContainerWrapper = dynamic(() => import('@/components/Toast/ToastContainerWrapper'), { ssr: false });
const PurchaseToastListener = dynamic(() => import('@/components/PublicFeed/PurchaseToastListener'), { ssr: false });

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: '#2f78ff',
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const defaultOgImage = 'https://cdn.taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: 'Tài Khoản Xịn - Nền Tảng Tài Khoản Số 1 Việt Nam',
    description: 'Khám phá thế giới tài khoản chất lượng cao. Tài Khoản Xịn - Đối tác tin cậy của bạn.',
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/logo/logo.png', type: 'image/png', sizes: '192x192' },
            { url: '/logo/logo.png', type: 'image/png', sizes: '512x512' },
        ],
        apple: [
            { url: '/logo/logo.png', sizes: '180x180', type: 'image/png' },
        ],
        shortcut: '/favicon.ico',
    },
    metadataBase: new URL(siteUrl),
    openGraph: {
        title: 'Tài Khoản Xịn - Nền Tảng Tài Khoản Số 1 Việt Nam',
        description: 'Khám phá thế giới tài khoản chất lượng cao. Tài Khoản Xịn - Đối tác tin cậy của bạn.',
        url: siteUrl,
        siteName: 'TaiKhoanXin',
        type: 'website',
        locale: 'vi_VN',
        images: [
            {
                url: defaultOgImage,
                width: 1200,
                height: 630,
                alt: 'Tài Khoản Xịn',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Tài Khoản Xịn - Nền Tảng Tài Khoản Số 1 Việt Nam',
        description: 'Khám phá thế giới tài khoản chất lượng cao. Tài Khoản Xịn - Đối tác tin cậy của bạn.',
        images: [defaultOgImage],
    },
};

const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TaiKhoanXin',
    url: siteUrl,
    logo: `${siteUrl}/logo/logo.png`,
};

const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TaiKhoanXin',
    url: siteUrl,
    potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="vi" suppressHydrationWarning={true}>
            <head>
                {/* Preconnect to external domains for faster loading */}
                <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://res.cloudinary.com" />
                <link rel="preconnect" href="https://cdn.taikhoanxin.com" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://cdn.taikhoanxin.com" />
                <link rel="preconnect" href="https://api.vietqr.io" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://api.vietqr.io" />
                
                {/* Preload critical resources */}
                <link rel="preload" href="/favicon.ico" as="image" />
                
                {/* Structured Data for SEO */}
                <Script
                    id="ld-organization"
                    type="application/ld+json"
                    strategy="beforeInteractive"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
                />
                <Script
                    id="ld-website"
                    type="application/ld+json"
                    strategy="beforeInteractive"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
                />
            </head>
            <body className={harmonyOS.variable}>
                {/* Skip to main content link for accessibility */}
                <a href="#main-content" className="skip-to-content">
                    Bỏ qua đến nội dung chính
                </a>
                <ProviderRedux>
                    <ErrorBoundary>
                        <ToastProvider>
                            <ConfirmDialogProvider>
                                <LayoutWrapper>
                                    {children}
                                </LayoutWrapper>
                                <ScrollToTop />
                                {/* Global toast container */}
                                <ToastContainerWrapper />
                                {/* SSE-based purchase notifications */}
                                <PurchaseToastListener />
                            </ConfirmDialogProvider>
                        </ToastProvider>
                    </ErrorBoundary>
                </ProviderRedux>
            </body>
        </html>
    );
}

