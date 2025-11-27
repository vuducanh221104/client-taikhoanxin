/**
 * Performance utilities
 */

import {
    ComponentProps,
    ComponentType,
    createElement,
    lazy,
    ReactNode,
    Suspense,
} from 'react';

/**
 * Lazy load a component with Suspense fallback
 */
export const lazyLoad = <T extends ComponentType<any>>(
    importFunc: () => Promise<{ default: T }>,
    fallback?: ReactNode
) => {
    const LazyComponent = lazy(importFunc);

    return (props: ComponentProps<T>) =>
        createElement(
            Suspense,
            { fallback: fallback ?? createElement('div', null, 'Loading...') },
            createElement(LazyComponent, props)
        );
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            func(...args);
        }, wait);
    };
};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: any[]) => any>(
    func: T,
    limit: number
): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean = false;

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
};

/**
 * Request animation frame throttle
 */
export const rafThrottle = <T extends (...args: any[]) => any>(
    func: T
): ((...args: Parameters<T>) => void) => {
    let rafId: number | null = null;

    return (...args: Parameters<T>) => {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
        }
        rafId = requestAnimationFrame(() => {
            func(...args);
            rafId = null;
        });
    };
};

