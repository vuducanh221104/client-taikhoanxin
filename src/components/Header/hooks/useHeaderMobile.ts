import { useState, useEffect, useRef } from 'react';

export const useHeaderMobile = (mounted: boolean) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const mobileMenuToggleRef = useRef<HTMLButtonElement | null>(null);
    const mobileMenuSidebarRef = useRef<HTMLDivElement | null>(null);

    // Detect desktop and mobile
    useEffect(() => {
        if (!mounted) return;
        
        const checkDesktop = () => {
            const width = window.innerWidth;
            setIsDesktop(width > 999);
            setIsMobile(width <= 999);
        };
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, [mounted]);

    // Disable body scroll when mobile menu is open
    useEffect(() => {
        if (!mounted) return;
        
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen, mounted]);

    // A11y: trap focus & close with Esc when mobile menu open
    useEffect(() => {
        if (!mounted || !isMobileMenuOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                mobileMenuToggleRef.current?.focus();
                return;
            }
            if (e.key === 'Tab') {
                const container = mobileMenuSidebarRef.current;
                if (!container) return;
                const focusable = container.querySelectorAll<HTMLElement>('a[href], button, [tabindex]:not([tabindex="-1"])');
                if (!focusable.length) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                const active = document.activeElement as HTMLElement;
                if (e.shiftKey) {
                    if (active === first) {
                        e.preventDefault();
                        last.focus();
                    }
                } else {
                    if (active === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isMobileMenuOpen, mounted]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return {
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isMobile,
        isDesktop,
        mobileMenuToggleRef,
        mobileMenuSidebarRef,
        toggleMobileMenu,
        closeMobileMenu,
    };
};
