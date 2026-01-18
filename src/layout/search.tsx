'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import classNames from 'classnames/bind';
import styles from '@/app/(user)/search/page.module.scss';
import ProductCard from '@/components/ProductCard';
import { FeaturedProduct } from '@/components/FeaturedProducts';
import { useSearchProducts, mapProductToFeaturedProduct, Product, detectProductGenre } from '@/services/productService';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/cartSlice';
import { SearchIcon, SortIcon, FilterIcon, CloseIcon } from '@/components/Icons';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/hooks/useToast';
import { ProductListSkeleton } from '@/components/Skeleton';
import EmptyState from '@/components/EmptyState';
import { FileSearchIcon } from '@/components/Icons';
import categoryStyles from '@/app/(user)/categories/[slug]/page.module.scss';
import { useSWRConfig } from 'swr';

const cx = classNames.bind(styles);
const categoryCx = classNames.bind(categoryStyles);

const ITEMS_PER_PAGE = 10;

const DEFAULT_PRICE_RANGE: [number, number] = [0, 10_000_000];
const PRICE_SLIDER_STEP = 50_000;

const formatCurrency = (value: number) => value.toLocaleString('vi-VN');
const parseCurrency = (value: string): number => {
    const cleaned = value.replace(/[^\d]/g, '');
    return cleaned ? parseInt(cleaned, 10) : 0;
};
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const quickPricePresets: Array<{ label: string; range: [number, number] }> = [
    { label: 'Dưới 100k', range: [0, 100_000] },
    { label: '100k - 500k', range: [100_000, 500_000] },
    { label: '500k - 1tr', range: [500_000, 1_000_000] },
    { label: '1tr - 3tr', range: [1_000_000, 3_000_000] },
    { label: '3tr - 5tr', range: [3_000_000, 5_000_000] },
    { label: 'Trên 5tr', range: [5_000_000, 10_000_000] },
];

const sortOptions = [
    { value: 'default', label: 'Mặc định' },
    { value: 'newest', label: 'Mới nhất' },
    { value: 'price-asc', label: 'Giá: Thấp đến cao' },
    { value: 'price-desc', label: 'Giá: Cao đến thấp' },
    { value: 'name-asc', label: 'Tên: A-Z' },
    { value: 'name-desc', label: 'Tên: Z-A' },
];

type CategoryFilterValue = 'all' | 'featured' | 'work' | 'ai' | 'bestSelling' | 'entertainment' | 'new';
type GenreFilterValue = 'all' | 'account' | 'code' | 'license';

interface SearchDisplayProduct extends FeaturedProduct {
    raw: Product;
    categoryFilter: CategoryFilterValue;
    genreFilter: GenreFilterValue;
}

interface APIError {
    response?: {
        data?: {
            message?: string;
        };
    };
    message?: string;
}

const RECENT_DAYS_THRESHOLD = 30;

const inferCategoryFilter = (product: Product): CategoryFilterValue => {
    const tags = (product.tag || []).map(tag => tag.toLowerCase());
    const name = product.name?.toLowerCase() || '';

    const matchKeywords = (keywords: string[]) =>
        keywords.some(keyword => name.includes(keyword) || tags.some(tag => tag.includes(keyword)));

    const createdWithinDays = (() => {
        if (!product.createdAt) return false;
        const createdDate = new Date(product.createdAt);
        if (Number.isNaN(createdDate.getTime())) return false;
        const diffInDays = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
        return diffInDays <= RECENT_DAYS_THRESHOLD;
    })();

    if (product.badge || product.isPopular || matchKeywords(['nổi bật', 'featured'])) {
        return 'featured';
    }
    if (product.isBestSelling || product.sold >= 100 || matchKeywords(['bán chạy', 'best selling', 'hot'])) {
        return 'bestSelling';
    }
    if (matchKeywords(['ai', 'chatgpt', 'midjourney', 'notion ai'])) {
        return 'ai';
    }
    if (matchKeywords(['netflix', 'spotify', 'disney', 'entertainment', 'game', 'movie'])) {
        return 'entertainment';
    }
    if (matchKeywords(['office', 'work', 'microsoft', 'excel', 'word', 'làm việc'])) {
        return 'work';
    }
    if (createdWithinDays || matchKeywords(['mới', 'new'])) {
        return 'new';
    }
    return 'all';
};

const inferGenreFilter = (productName: string): GenreFilterValue => {
    const detected = detectProductGenre(productName);
    return detected || 'all';
};

const getErrorMessage = (error: unknown): string => {
    if (!error) {
        return 'Có lỗi xảy ra. Vui lòng thử lại.';
    }
    if (typeof error === 'string') {
        return error;
    }
    const apiError = error as APIError;
    return apiError.response?.data?.message || apiError.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
};

const SearchLayout: React.FC = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams?.get('q') || '';
    const { mutate: globalMutate } = useSWRConfig();
    
    const [searchValue, setSearchValue] = useState<string>(query);
    const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);
    const [pendingPriceRange, setPendingPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);
    const [priceInputValues, setPriceInputValues] = useState<[string, string]>([
        formatCurrency(DEFAULT_PRICE_RANGE[0]),
        formatCurrency(DEFAULT_PRICE_RANGE[1])
    ]);
    const [focusedInput, setFocusedInput] = useState<0 | 1 | null>(null);
    const [sortBy, setSortBy] = useState('default');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [accumulatedProducts, setAccumulatedProducts] = useState<SearchDisplayProduct[]>([]);
    const sortDropdownRef = useRef<HTMLDivElement | null>(null);
    
    // Map sortBy to backend sortBy and sortOrder
    const sortConfig = useMemo(() => {
        switch (sortBy) {
            case 'newest':
                return { sortBy: 'createdAt', sortOrder: 'desc' as const };
            case 'price-asc':
                return { sortBy: 'price.priceOriginal', sortOrder: 'asc' as const };
            case 'price-desc':
                return { sortBy: 'price.priceOriginal', sortOrder: 'desc' as const };
            case 'name-asc':
                return { sortBy: 'name', sortOrder: 'asc' as const };
            case 'name-desc':
                return { sortBy: 'name', sortOrder: 'desc' as const };
            default:
                // Default: không gửi sort params, để backend dùng default sort
                return { sortBy: undefined, sortOrder: undefined };
        }
    }, [sortBy]);

    const { data: searchResponse, error: searchError, isLoading: isSearching } = useSearchProducts(query, {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        minPrice: priceRange[0] !== DEFAULT_PRICE_RANGE[0] ? priceRange[0] : undefined,
        maxPrice: priceRange[1] !== DEFAULT_PRICE_RANGE[1] ? priceRange[1] : undefined,
        sortBy: sortConfig.sortBy,
        sortOrder: sortConfig.sortOrder,
    });

    const dispatch = useDispatch();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const { toggleWishlist, isProductInWishlist, isLoggedIn } = useWishlist();
    const { showSuccess, showInfo, showError } = useToast();

    // Update search value when query param changes
    useEffect(() => {
        setSearchValue(query);
    }, [query]);

    // Update input display values when pendingPriceRange changes (from slider)
    useEffect(() => {
        if (focusedInput === null) {
            setPriceInputValues([
                formatCurrency(pendingPriceRange[0]),
                formatCurrency(pendingPriceRange[1])
            ]);
        }
    }, [pendingPriceRange, focusedInput]);

    // Reset page and accumulated products when filters or query change
    useEffect(() => {
        setCurrentPage(1);
        setAccumulatedProducts([]);
    }, [query, priceRange, sortBy]);

    // Handle search
    const handleSearch = () => {
        if (searchValue.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    const handlePriceInputChange = (index: 0 | 1, value: string) => {
        // Parse the input value (remove all non-digit characters)
        const parsedValue = parseCurrency(value);
        
        // Clamp the value to valid range
        const clampedValue = clamp(parsedValue, DEFAULT_PRICE_RANGE[0], DEFAULT_PRICE_RANGE[1]);
        
        // Format the value with thousand separators
        const formattedValue = formatCurrency(clampedValue);
        
        // Update display value with formatted number
        setPriceInputValues((prev) => {
            const newValues: [string, string] = [...prev];
            newValues[index] = formattedValue;
            return newValues;
        });

        // Update actual range
        setPendingPriceRange((prev) => {
            if (index === 0) {
                return [Math.min(clampedValue, prev[1]), prev[1]];
            }
            return [prev[0], Math.max(clampedValue, prev[0])];
        });
    };

    const handlePriceInputFocus = (index: 0 | 1) => {
        setFocusedInput(index);
        setPriceInputValues((prev) => {
            const newValues: [string, string] = [...prev];
            newValues[index] = pendingPriceRange[index].toString();
            return newValues;
        });
    };

    const handlePriceInputBlur = (index: 0 | 1) => {
        setFocusedInput(null);
        setPriceInputValues((prev) => {
            const newValues: [string, string] = [...prev];
            newValues[index] = formatCurrency(pendingPriceRange[index]);
            return newValues;
        });
    };

    const handleSliderChange = (index: 0 | 1, targetValue: number) => {
        const safeValue = clamp(targetValue, DEFAULT_PRICE_RANGE[0], DEFAULT_PRICE_RANGE[1]);
        setPendingPriceRange((prev) => {
            if (index === 0) {
                const maxAllowed = Math.max(DEFAULT_PRICE_RANGE[0], prev[1] - PRICE_SLIDER_STEP);
                return [Math.min(safeValue, maxAllowed), prev[1]];
            }
            const minAllowed = Math.min(DEFAULT_PRICE_RANGE[1], prev[0] + PRICE_SLIDER_STEP);
            return [prev[0], Math.max(safeValue, minAllowed)];
        });
    };

    const toggleMobileFilter = () => setIsMobileFilterOpen((prev) => !prev);

    const handleApplyFilters = () => {
        setPriceRange(pendingPriceRange);
        setCurrentPage(1);
        setIsMobileFilterOpen(false); // Close mobile filter on apply
    };

    const clearFilters = () => {
        // Reset all filter states to default
        setPendingPriceRange(DEFAULT_PRICE_RANGE);
        setPriceRange(DEFAULT_PRICE_RANGE);
        setPriceInputValues([
            formatCurrency(DEFAULT_PRICE_RANGE[0]),
            formatCurrency(DEFAULT_PRICE_RANGE[1])
        ]);
        setSortBy('default');
        setCurrentPage(1);
        // Force revalidate SWR cache to ensure fresh data is displayed
        setTimeout(() => {
            globalMutate(
                (key) => typeof key === 'string' && key.startsWith('/api/v1/products/search'),
                undefined,
                { revalidate: true }
            );
        }, 0);
    };

    // Get products based on search query from API (already filtered and sorted by server)
    const currentPageProducts = useMemo<SearchDisplayProduct[]>(() => {
        if (!query || query.trim().length === 0) {
            return [];
        }

        // Ensure data is an array (handle both old and new API response formats)
        const apiProducts = Array.isArray(searchResponse?.data) 
            ? searchResponse.data 
            : [];
        return apiProducts.map((product) => {
            const mapped = mapProductToFeaturedProduct(product);
            return {
                ...mapped,
                raw: product,
                categoryFilter: inferCategoryFilter(product),
                genreFilter: inferGenreFilter(mapped.productName),
            };
        });
    }, [query, searchResponse?.data]);

    // Accumulate products from all loaded pages
    useEffect(() => {
        if (!query || query.trim().length === 0) {
            setAccumulatedProducts([]);
            return;
        }

        if (currentPage === 1) {
            // First page: replace all
            setAccumulatedProducts(currentPageProducts);
        } else if (currentPageProducts.length > 0) {
            // Subsequent pages: append new products (avoid duplicates)
            setAccumulatedProducts((prev) => {
                const existingIds = new Set(prev.map((p) => p.id));
                const newProducts = currentPageProducts.filter((p) => !existingIds.has(p.id));
                return [...prev, ...newProducts];
            });
        }
    }, [currentPageProducts, currentPage, query]);

    // Use accumulated products for display
    const products = accumulatedProducts;

    const handleAddToCart = (product: FeaturedProduct) => {
        dispatch(addToCart({
            id: product.id,
            productName: product.productName,
            price: product.price,
            oldPrice: product.oldPrice,
            imageSrc: product.imageSrc,
            imageAlt: product.imageAlt,
            href: product.href,
            stock: product.stock,
            min: product.min,
            max: product.max,
        }));
        showSuccess(`Đã thêm "${product.productName}" vào giỏ hàng`);
    };

    const handleToggleFavorite = async (productId: string) => {
        const product = products.find((p: SearchDisplayProduct) => p.id === productId);
        if (!product) return;

        if (!isLoggedIn) {
            showInfo('Vui lòng đăng nhập để thêm vào yêu thích');
            router.push('/auth/login');
            return;
        }

        try {
            const added = await toggleWishlist({
                productId: product.id,
                productName: product.productName,
                price: product.price,
                oldPrice: product.oldPrice,
                discount: product.discount,
                rating: product.rating,
                reviewCount: product.reviewCount,
                status: product.status,
                imageSrc: product.imageSrc,
                imageAlt: product.imageAlt,
                href: product.href,
            });

            if (added) {
                showSuccess(`Đã thêm "${product.productName}" vào yêu thích`);
            } else {
                showSuccess(`Đã xóa "${product.productName}" khỏi yêu thích`);
            }
        } catch (error) {
            showError(getErrorMessage(error));
        }
    };

    const handleLoadMore = () => {
        if (!isSearching && searchResponse?.pagination && currentPage < searchResponse.pagination.totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handleSelectSort = (value: string) => {
        setSortBy(value);
        setIsSortOpen(false);
        setCurrentPage(1);
    };

    const toggleSortDropdown = () => {
        setIsSortOpen(prev => !prev);
    };

    // Close sort dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
                setIsSortOpen(false);
            }
        };

        if (isSortOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSortOpen]);

    const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Mặc định';

    const presetIsActive = (range: [number, number]) => {
        return pendingPriceRange[0] === range[0] && pendingPriceRange[1] === range[1];
    };

    const hasActiveFilters = priceRange[0] !== DEFAULT_PRICE_RANGE[0] || 
                             priceRange[1] !== DEFAULT_PRICE_RANGE[1] ||
                             sortBy !== 'default';

    // Calculate slider style
    const sliderStyle = useMemo(() => {
        const [minValue, maxValue] = pendingPriceRange;
        const minPercent = ((minValue - DEFAULT_PRICE_RANGE[0]) / (DEFAULT_PRICE_RANGE[1] - DEFAULT_PRICE_RANGE[0])) * 100;
        const maxPercent = ((maxValue - DEFAULT_PRICE_RANGE[0]) / (DEFAULT_PRICE_RANGE[1] - DEFAULT_PRICE_RANGE[0])) * 100;
        return {
            '--min-percent': `${minPercent}%`,
            '--max-percent': `${maxPercent}%`,
        } as React.CSSProperties;
    }, [pendingPriceRange]);

    const trimmedQuery = query.trim();
    const shouldPromptForQuery = trimmedQuery.length === 0;
    const isInitialLoading = isSearching && !shouldPromptForQuery && products.length === 0;
    const searchErrorMessage = getErrorMessage(searchError);
    const shouldShowNoResults = !isSearching && !shouldPromptForQuery && products.length === 0 && !searchError;
    
    // Empty state description - same format as category page
    const emptyDescription = isSearching
        ? 'Đang tải sản phẩm...'
        : searchErrorMessage || 'Không tìm thấy sản phẩm nào.';


    return (
        <div className={cx('search-page')}>
            <div className={cx('search-container')}>
                {/* Header */}
                <div className={cx('search-header')}>
                    <h1 className={cx('search-title')}>
                        {query ? `Kết quả tìm kiếm cho "${query}"` : 'Tìm kiếm sản phẩm'}
                    </h1>
                    {query && searchResponse?.data && (
                        <p className={cx('search-results-count')}>
                            Tìm thấy <strong>{searchResponse.pagination?.total || searchResponse.data.length}</strong> sản phẩm
                            {searchResponse.pagination && (
                                <> (Trang {searchResponse.pagination.page}/{searchResponse.pagination.totalPages})</>
                            )}
                        </p>
                    )}
                </div>

                {/* Search Bar */}
                <div className={cx('search-bar-section')}>
                    <div className={cx('search-bar-wrapper')}>
                        <SearchIcon className={cx('search-bar-icon')} />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            className={cx('search-bar-input')}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            aria-label="Tìm kiếm sản phẩm"
                        />
                        <button
                            className={cx('search-bar-button')}
                            onClick={handleSearch}
                            type="button"
                        >
                            Tìm kiếm
                        </button>
                    </div>
                </div>

                {/* Main Content with Filters */}
                {query && (
                    <div className={cx('search-content-wrapper')}>
                        {/* Filters Sidebar */}
                        <aside className={categoryCx('filters-sidebar', { 'mobile-open': isMobileFilterOpen })}>
                            <div className={categoryCx('mobile-filter-header')}>
                                <h3 className={categoryCx('mobile-filter-title')}>Bộ lọc sản phẩm</h3>
                                <button
                                    className={categoryCx('mobile-filter-close')}
                                    onClick={toggleMobileFilter}
                                    type="button"
                                >
                                    <CloseIcon size={24} />
                                </button>
                            </div>

                            <div className={categoryCx('filters-header')}>
                                <div>
                                    <h2 className={categoryCx('filters-title')}>Bộ lọc thông minh</h2>
                                    <p className={categoryCx('filters-subtitle')}>
                                        Tinh chỉnh mức giá và xem kết quả tức thì
                                    </p>
                                </div>

                                {hasActiveFilters && (
                                    <button className={categoryCx('clear-filters-button')} onClick={clearFilters}>
                                        Xóa tất cả
                                    </button>
                                )}
                            </div>

                            {/* Price Range Filter */}
                            <div className={categoryCx('filter-section')}>
                                <h3 className={categoryCx('filter-title')}>Khoảng giá</h3>
                                <div className={categoryCx('price-input-row')}>
                                    <div className={categoryCx('price-input-group')}>
                                        <label>TỐI THIỂU</label>
                                        <input
                                            type="text"
                                            value={priceInputValues[0]}
                                            onChange={(e) => handlePriceInputChange(0, e.target.value)}
                                            onFocus={() => handlePriceInputFocus(0)}
                                            onBlur={() => handlePriceInputBlur(0)}
                                            className={categoryCx('price-input')}
                                            placeholder="0"
                                            inputMode="numeric"
                                        />
                                    </div>
                                    <div className={categoryCx('price-input-group')}>
                                        <label>TỐI ĐA</label>
                                        <input
                                            type="text"
                                            value={priceInputValues[1]}
                                            onChange={(e) => handlePriceInputChange(1, e.target.value)}
                                            onFocus={() => handlePriceInputFocus(1)}
                                            onBlur={() => handlePriceInputBlur(1)}
                                            className={categoryCx('price-input')}
                                            placeholder="10.000.000"
                                            inputMode="numeric"
                                        />
                                    </div>
                                </div>

                                <div className={categoryCx('price-range-slider')} style={sliderStyle}>
                                    <div className={categoryCx('slider-track')} />
                                    <div className={categoryCx('slider-active-track')} />
                                    <input
                                        type="range"
                                        min={DEFAULT_PRICE_RANGE[0]}
                                        max={DEFAULT_PRICE_RANGE[1]}
                                        step={PRICE_SLIDER_STEP}
                                        value={pendingPriceRange[0]}
                                        onChange={(e) => handleSliderChange(0, Number(e.target.value))}
                                        className={categoryCx('slider-input')}
                                    />
                                    <input
                                        type="range"
                                        min={DEFAULT_PRICE_RANGE[0]}
                                        max={DEFAULT_PRICE_RANGE[1]}
                                        step={PRICE_SLIDER_STEP}
                                        value={pendingPriceRange[1]}
                                        onChange={(e) => handleSliderChange(1, Number(e.target.value))}
                                        className={categoryCx('slider-input')}
                                    />
                                </div>

                                <div className={categoryCx('price-range-display')}>
                                    {formatCurrency(pendingPriceRange[0])}₫ - {formatCurrency(pendingPriceRange[1])}₫
                                </div>
                            </div>

                            {/* Quick Price Filters */}
                            <div className={categoryCx('filter-section')}>
                                <h3 className={categoryCx('filter-title')}>Mức giá</h3>
                                <div className={categoryCx('quick-price-grid')}>
                                    {quickPricePresets.map((preset) => (
                                        <button
                                            key={preset.label}
                                            className={categoryCx('quick-price-button', {
                                                'is-active': presetIsActive(preset.range),
                                            })}
                                            onClick={() => {
                                                setPendingPriceRange(preset.range);
                                                setPriceInputValues([
                                                    formatCurrency(preset.range[0]),
                                                    formatCurrency(preset.range[1])
                                                ]);
                                            }}
                                            type="button"
                                        >
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={categoryCx('filters-footer')}>
                                <button
                                    className={categoryCx('apply-filters-button')}
                                    onClick={handleApplyFilters}
                                    type="button"
                                >
                                    Áp dụng bộ lọc
                                </button>
                            </div>
                        </aside>

                        {/* Products Content */}
                        <div className={cx('search-products-content')}>
                            {/* Sort Dropdown */}
                            <div className={categoryCx('category-controls')}>
                                <button
                                    className={categoryCx('mobile-filter-button')}
                                    onClick={toggleMobileFilter}
                                    type="button"
                                >
                                    <FilterIcon size={20} />
                                    <span>Bộ lọc</span>
                                </button>

                                <div
                                    className={categoryCx('sort-dropdown', { 'is-open': isSortOpen })}
                                    ref={sortDropdownRef}
                                >
                                    <div className={categoryCx('sort-summary')}>
                                        <div className={categoryCx('sort-icon')}>
                                            <SortIcon size={18} />
                                        </div>
                                        <div>
                                            <p className={categoryCx('sort-label')}>Sắp xếp theo</p>
                                            <p className={categoryCx('sort-value')}>{currentSortLabel}</p>
                                        </div>
                                    </div>
                                    <div className={categoryCx('sort-select-wrapper')}>
                                        <button
                                            type="button"
                                            className={categoryCx('sort-select-trigger')}
                                            onClick={toggleSortDropdown}
                                            aria-haspopup="listbox"
                                            aria-expanded={isSortOpen}
                                            aria-controls="sort-options"
                                        >
                                            {currentSortLabel}
                                        </button>
                                        <ul
                                            id="sort-options"
                                            className={categoryCx('sort-options')}
                                            role="listbox"
                                            aria-hidden={!isSortOpen}
                                        >
                                            {sortOptions.map((option) => (
                                                <li key={option.value}>
                                                    <button
                                                        type="button"
                                                        className={categoryCx('sort-option', {
                                                            'is-active': option.value === sortBy,
                                                        })}
                                                        role="option"
                                                        aria-selected={option.value === sortBy}
                                                        onClick={() => handleSelectSort(option.value)}
                                                    >
                                                        {option.label}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Products Grid */}
                            {searchError ? (
                                <EmptyState
                                    icon={<FileSearchIcon size={80} />}
                                    title="Không thể tải kết quả tìm kiếm"
                                    description={searchErrorMessage}
                                    actionLabel="Thử lại"
                                    onAction={() => router.refresh()}
                                />
                            ) : isSearching ? (
                                <div className={cx('products-grid')}>
                                    <ProductListSkeleton count={ITEMS_PER_PAGE} />
                                </div>
                            ) : products.length > 0 ? (
                                <div className={cx('products-grid')}>
                                    {products.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            id={product.id}
                                            productName={product.productName}
                                            price={product.price}
                                            oldPrice={product.oldPrice}
                                            discount={product.discount}
                                            rating={product.rating}
                                            reviewCount={product.reviewCount}
                                            status={product.status}
                                            href={product.href}
                                            imageSrc={product.imageSrc}
                                            imageAlt={product.imageAlt}
                                            isFavorite={isProductInWishlist(product.id)}
                                            onAddToCart={() => handleAddToCart(product)}
                                            onToggleFavorite={handleToggleFavorite}
                                        />
                                    ))}
                                </div>
                            ) : searchResponse ? (
                                <EmptyState
                                    type="products"
                                    title="Không có sản phẩm"
                                    description="Thử điều chỉnh bộ lọc để xem thêm kết quả"
                                    actionLabel="Xóa bộ lọc"
                                    onAction={clearFilters}
                                />
                            ) : null}

                            {/* Load More / Pagination */}
                            {searchResponse?.pagination && searchResponse.pagination.totalPages > currentPage && (
                                <div className={cx('load-more-section')}>
                                    <button
                                        className={cx('load-more-button')}
                                        onClick={handleLoadMore}
                                        disabled={isSearching}
                                        type="button"
                                    >
                                        <span>
                                            {isSearching 
                                                ? 'Đang tải...' 
                                                : `Xem thêm sản phẩm`}
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Empty State - Only show when no query */}
                {shouldPromptForQuery ? (
                    <div className={cx('empty-state')}>
                        <SearchIcon size={64} className={cx('empty-icon')} />
                        <p className={cx('empty-message')}>Nhập từ khóa để tìm kiếm sản phẩm</p>
                    </div>
                ) : searchError && !query ? (
                    <EmptyState
                        icon={<FileSearchIcon size={80} />}
                        title="Không thể tải kết quả tìm kiếm"
                        description={searchErrorMessage}
                        actionLabel="Thử lại"
                        onAction={() => router.refresh()}
                    />
                ) : null}

                {/* Mobile Filter Overlay */}
                {isMobileFilterOpen && (
                    <div
                        className={categoryCx('mobile-filter-overlay')}
                        onClick={toggleMobileFilter}
                        aria-hidden="true"
                    />
                )}
            </div>
        </div>
    );
};

export default SearchLayout;
