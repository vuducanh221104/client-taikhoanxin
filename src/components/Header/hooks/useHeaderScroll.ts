import { useState, useEffect } from 'react';

export const useHeaderScroll = (mounted: boolean) => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        if (!mounted) return;
        
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [mounted]);

    const calculateBackgroundOpacity = () => {
        if (!mounted) return 1;
        if (scrollY <= 0) return 1;
        if (scrollY >= 100) return 0.85;
        return 1 - (scrollY / 100) * 0.15;
    };

    const isScrolled = mounted && scrollY > 0;
    const topBarBackgroundOpacity = calculateBackgroundOpacity();

    return { scrollY, isScrolled, topBarBackgroundOpacity };
};
