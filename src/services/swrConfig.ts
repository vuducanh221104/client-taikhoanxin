import useSWR, { SWRConfiguration } from 'swr';
import { fetcher } from '@/utils/httpRequest';

// Global SWR config cho SEO optimization và cache
export const swrConfig: SWRConfiguration = {
    revalidateOnFocus: false, // Don't revalidate on focus to use cache
    revalidateOnReconnect: false, // Don't revalidate on reconnect to use cache
    dedupingInterval: 5000, // Dedupe requests within 5 seconds (longer to reduce API calls)
    focusThrottleInterval: 5000,
    errorRetryCount: 3,
    errorRetryInterval: 5000,
    // SEO: Keep data fresh for better indexing
    refreshInterval: 0, // Disable auto refresh by default
    // Prefetch for better UX
    shouldRetryOnError: true,
    // Cache configuration
    keepPreviousData: true, // Keep previous data while fetching new data
    revalidateIfStale: false, // Don't revalidate if data is stale, use cache
};

// SWR Hook cho User API
export const useSWRUser = <T>(key: string | null, config?: SWRConfiguration) => {
    return useSWR<T>(key, fetcher, {
        ...swrConfig,
        ...config,
    });
};

// SWR với fallback data cho SSR/SSG (SEO)
export const useSWRWithFallback = <T>(
    key: string | null,
    fallbackData?: T,
    config?: SWRConfiguration
) => {
    return useSWR<T>(key, fetcher, {
        ...swrConfig,
        fallbackData,
        ...config,
    });
};

