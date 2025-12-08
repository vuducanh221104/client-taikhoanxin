'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';
import { ToastProvider } from '@/components/Toast';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isToolsPage = pathname?.startsWith('/tools') ?? false;
    const isHelpPage = pathname?.startsWith('/help') ?? false;

    // Hide Header and Footer for tools and help pages
    if (isToolsPage || isHelpPage) {
        return <ToastProvider>{children}</ToastProvider>;
    }

    return (
        <ToastProvider>
            <Header />
            <main id="main-content">
                {children}
            </main>
            <Footer />
            <BottomNavigation />
        </ToastProvider>
    );
}

