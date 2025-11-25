'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect if a media query matches
 * @param query - Media query string (e.g., '(max-width: 999px)')
 * @returns boolean - true if media query matches
 */
export const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState<boolean>(false);

    useEffect(() => {
        // Check if window is available (SSR safety)
        if (typeof window === 'undefined') {
            return;
        }

        const mediaQuery = window.matchMedia(query);
        
        // Set initial value
        setMatches(mediaQuery.matches);

        // Create event listener
        const handler = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // Add listener
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handler);
        } else {
            // Fallback for older browsers
            mediaQuery.addListener(handler);
        }

        // Cleanup
        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener('change', handler);
            } else {
                // Fallback for older browsers
                mediaQuery.removeListener(handler);
            }
        };
    }, [query]);

    return matches;
};

