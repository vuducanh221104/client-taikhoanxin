import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchProducts, mapProductToFeaturedProduct } from '@/services/productService';
import { FeaturedProduct } from '@/components/FeaturedProducts';
import { useDebounce } from '@/hooks/useDebounce';

const DEFAULT_RECENT_SEARCHES = [
    'Windows 11',
    'Office 365',
    'Tài khoản AI',
    'Spotify Premium',
    'Netflix',
];

export const useHeaderSearch = (mounted: boolean, isMobile: boolean, defaultTrendingSearches: string[] = []) => {
    const SEARCH_LIMIT = 24;
    const DEBOUNCE_DELAY = 400;
    const router = useRouter();
    const [searchValue, setSearchValue] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isSearchBarFocused, setIsSearchBarFocused] = useState(false);
    const [searchResults, setSearchResults] = useState<FeaturedProduct[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    
    const searchToggleRef = useRef<HTMLButtonElement | null>(null);
    const searchDropdownRef = useRef<HTMLDivElement | null>(null);
    const searchBarInputRef = useRef<HTMLInputElement | null>(null);
    const searchBarDropdownRef = useRef<HTMLDivElement | null>(null);
    const isSearchOpeningRef = useRef(false);
    const justSearchClosedRef = useRef(false);
    const lastScrollYRef = useRef(0);
    const hasInitializedRecentSearches = useRef(false);

    // Load recent searches from localStorage
    useEffect(() => {
        if (typeof window === 'undefined' || hasInitializedRecentSearches.current) {
            return;
        }

        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            try {
                setRecentSearches(JSON.parse(saved));
                hasInitializedRecentSearches.current = true;
                return;
            } catch (e) {
                console.error('Failed to parse recent searches:', e);
            }
        }

        const fallback = defaultTrendingSearches.length > 0
            ? defaultTrendingSearches.slice(0, 5)
            : DEFAULT_RECENT_SEARCHES;

        setRecentSearches(fallback);
        hasInitializedRecentSearches.current = true;
    }, [defaultTrendingSearches]);

    const normalizedSearchValue = searchValue.trim();
    const debouncedSearchValue = useDebounce(normalizedSearchValue, DEBOUNCE_DELAY);
    const {
        data: searchResponse,
    } = useSearchProducts(debouncedSearchValue, { limit: SEARCH_LIMIT });

    // Update search results when search API responds
    useEffect(() => {
        if (!debouncedSearchValue) {
            setSearchResults([]);
            return;
        }

        const products = searchResponse?.data || [];
        if (!products.length) {
            setSearchResults([]);
            return;
        }

        setSearchResults(
            products.slice(0, SEARCH_LIMIT).map((product) => mapProductToFeaturedProduct(product))
        );
    }, [debouncedSearchValue, searchResponse]);

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
        if (!isSearchOpen && mounted) {
            setTimeout(() => {
                const input = document.querySelector('[data-search-input="true"]') as HTMLInputElement;
                input?.focus();
            }, 100);
        }
    };

    const closeSearch = () => {
        justSearchClosedRef.current = true;
        setIsSearchOpen(false);
        setTimeout(() => {
            justSearchClosedRef.current = false;
        }, 200);
    };

    const clearSearch = () => {
        setSearchValue('');
        if (mounted) {
            const input = document.querySelector('[data-search-input="true"]') as HTMLInputElement;
            input?.focus();
        }
    };

    const handleSearch = (query?: string) => {
        const searchQuery = query || searchValue.trim();
        if (searchQuery) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            closeSearch();
            
            // Save to recent searches
            if (searchQuery && !recentSearches.includes(searchQuery)) {
                const updated = [searchQuery, ...recentSearches].slice(0, 5);
                setRecentSearches(updated);
                localStorage.setItem('recentSearches', JSON.stringify(updated));
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    // Track when search dropdown is opening/closing
    useEffect(() => {
        if (isSearchOpen) {
            isSearchOpeningRef.current = true;
            justSearchClosedRef.current = false;
            const timer = setTimeout(() => {
                isSearchOpeningRef.current = false;
            }, 200);
            return () => clearTimeout(timer);
        } else {
            isSearchOpeningRef.current = false;
            if (mounted) {
                justSearchClosedRef.current = true;
                const timer = setTimeout(() => {
                    justSearchClosedRef.current = false;
                }, 300);
                return () => clearTimeout(timer);
            }
        }
    }, [isSearchOpen, mounted]);

    // Disable body scroll when search dropdown is open on mobile
    useEffect(() => {
        if (!mounted) return;
        
        if (isSearchOpen && isMobile) {
            document.body.style.overflow = 'hidden';
            lastScrollYRef.current = window.scrollY;
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isSearchOpen, isMobile, mounted]);

    // A11y: Esc to close & trap focus inside search dialog when open
    useEffect(() => {
        if (!mounted || !isSearchOpen) return;
        const handleKeyDownEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                setIsSearchOpen(false);
                searchToggleRef.current?.focus();
                return;
            }
            if (e.key === 'Tab') {
                const container = searchDropdownRef.current;
                if (!container) return;
                const focusable = container.querySelectorAll<HTMLElement>('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
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
        document.addEventListener('keydown', handleKeyDownEsc);
        return () => document.removeEventListener('keydown', handleKeyDownEsc);
    }, [isSearchOpen, mounted]);

    return {
        searchValue,
        setSearchValue,
        isSearchOpen,
        setIsSearchOpen,
        isSearchBarFocused,
        setIsSearchBarFocused,
        searchResults,
        recentSearches,
        setRecentSearches,
        searchToggleRef,
        searchDropdownRef,
        searchBarInputRef,
        searchBarDropdownRef,
        isSearchOpeningRef,
        justSearchClosedRef,
        toggleSearch,
        closeSearch,
        clearSearch,
        handleSearch,
        handleKeyDown,
    };
};
