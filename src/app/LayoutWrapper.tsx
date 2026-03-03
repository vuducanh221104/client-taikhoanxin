'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ToastProvider } from '@/components/Toast';
import PopupHome from '@/components/PopupHome/PopupHome';

// Lazy load Header, Footer, and BottomNavigation for better performance
const Header = dynamic(() => import('@/components/Header'), {
    ssr: true, // Keep SSR for SEO
    loading: () => <div style={{ height: '80px' }} aria-label="Loading header" />,
});

const Footer = dynamic(() => import('@/components/Footer'), {
    ssr: true, // Keep SSR for SEO
    loading: () => <div style={{ height: '200px' }} aria-label="Loading footer" />,
});

const BottomNavigation = dynamic(() => import('@/components/BottomNavigation'), {
    ssr: false, // No need for SSR on mobile nav
});

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isToolsPage = pathname?.startsWith('/tools') ?? false;
    const isHelpPage = pathname?.startsWith('/help') ?? false;
    const isHomePage = pathname === '/' || pathname === '/home';

    // Hide Header and Footer for tools and help pages
    if (isToolsPage || isHelpPage) {
        return (
            <ToastProvider>
                {children}
            </ToastProvider>
        );
    }

    return (
        <ToastProvider>
            <Header />
            <main id="main-content" role="main" aria-label="Main content">
                {children}
            </main>
            <Footer />
            <BottomNavigation />
            {isHomePage && <PopupHome />}
        </ToastProvider>
    );
}

