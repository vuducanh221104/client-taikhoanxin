'use client';

import { useRef, useCallback } from 'react';

/**
 * Debounce a callback function
 * @param callback The function to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced callback function
 */
export const useDebounceCallback = <T extends (...args: any[]) => any>(
    callback: T,
    delay: number = 500
): T => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const debouncedCallback = useCallback(
        (...args: Parameters<T>) => {
            // Clear previous timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Set new timeout
            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    ) as T;

    return debouncedCallback;
};

