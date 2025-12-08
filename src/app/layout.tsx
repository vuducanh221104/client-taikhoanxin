import '@/styles/globals.scss';
import '@/styles/accessibility.scss';

import dynamic from 'next/dynamic';
import ProviderRedux from '@/redux/ProviderRedux';
import { ToastProvider } from '@/contexts/ToastContext';
import { harmonyOS } from '@/assets/FontNext';
import { Metadata, Viewport } from 'next/types';
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

export const metadata: Metadata = {
    title: 'Tài Khoản Xịn - Nền Tảng Tài Khoản Số 1 Việt Nam',
    description: 'Khám phá thế giới tài khoản chất lượng cao. Tài Khoản Xịn - Đối tác tin cậy của bạn.',
    icons: {
        icon: '/favicon.ico',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="vi" suppressHydrationWarning={true}>
            <head>
                {/* Preconnect to external domains */}
                <link rel="preconnect" href="https://res.cloudinary.com" />
                <link rel="dns-prefetch" href="https://res.cloudinary.com" />
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

