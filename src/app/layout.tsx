import '@/styles/globals.scss';
import '@/styles/accessibility.scss';

import ProviderRedux from '@/redux/ProviderRedux';
import ScrollToTop from '@/components/ScrollToTop';
import { ToastProvider } from '@/contexts/ToastContext';
import { harmonyOS } from '@/assets/FontNext';
import { Metadata, Viewport } from 'next/types';
import ToastContainerWrapper from '@/components/Toast/ToastContainerWrapper';
import PurchaseToastListener from '@/components/PublicFeed/PurchaseToastListener';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import LayoutWrapper from './LayoutWrapper';
import { ConfirmDialogProvider } from '@/components/ConfirmDialog';

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
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

