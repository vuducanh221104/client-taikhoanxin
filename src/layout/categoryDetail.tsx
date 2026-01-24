'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import classNames from 'classnames/bind';
import styles from '@/app/(user)/categories/[slug]/page.module.scss';
import ProductCard from '@/components/ProductCard/ProductCard';
import { SortIcon, FilterIcon, CloseIcon, FileSearchIcon } from '@/components/Icons';
import EmptyState from '@/components/EmptyState/EmptyState';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import { ProductListSkeleton } from '@/components/Skeleton';
import { useCategory } from '@/services/categoryService';
import { useProducts, usePopularProducts, useBestSellingProducts, useBadgeProducts, useOnSaleProducts, mapProductToFeaturedProduct } from '@/services/productService';
import type { FeaturedProduct } from '@/components/FeaturedProducts';
import { useSWRConfig } from 'swr';

const cx = classNames.bind(styles);
const categoryNames: Record<string, string> = {
    'work': 'Làm việc',
    'ai-account': 'Sản phẩm AI',
    'entertainment': 'Giải trí',
    'giai-tri': 'Giải trí',
    'windows': 'Windows',
    'office': 'Office',
    'education': 'Giáo dục',
    'design': 'Thiết kế',
    'cloud-storage': 'Cloud Storage',
};

const DEFAULT_PRICE_RANGE: [number, number] = [0, 10_000_000];
const PRICE_SLIDER_STEP = 50_000;
const sortOptions = [
    { value: 'default', label: 'Mặc định' },
    { value: 'newest', label: 'Mới nhất' },
    { value: 'price-asc', label: 'Giá: Thấp đến cao' },
    { value: 'price-desc', label: 'Giá: Cao đến thấp' },
    { value: 'name-asc', label: 'Tên: A-Z' },
    { value: 'name-desc', label: 'Tên: Z-A' },
];
const quickPricePresets: Array<{ label: string; range: [number, number] }> = [
    { label: 'Dưới 100k', range: [0, 100_000] },
    { label: '100k - 500k', range: [100_000, 500_000] },
    { label: '500k - 1tr', range: [500_000, 1_000_000] },
    { label: '1tr - 3tr', range: [1_000_000, 3_000_000] },
    { label: '3tr - 5tr', range: [3_000_000, 5_000_000] },
    { label: 'Trên 5tr', range: [5_000_000, 10_000_000] },
];

type ApiError = {
    response?: {
        data?: {
            message?: string;
        };
    };
    message?: string;
};

const formatCurrency = (value: number) => value.toLocaleString('vi-VN');
const parseCurrency = (value: string): number => {
    // Remove all non-digit characters
    const cleaned = value.replace(/[^\d]/g, '');
    return cleaned ? parseInt(cleaned, 10) : 0;
};
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const getSpecialPathName = (slug: string): string => {
    const nameMap: Record<string, string> = {
        'tat-ca-san-pham': 'Tất cả sản phẩm',
        'san-pham-noi-bat': 'Sản phẩm nổi bật',
        'san-pham-ban-chay': 'Sản phẩm bán chạy',
        'san-pham-co-huy-hieu': 'Sản phẩm có huy hiệu',
        'san-pham-con-hang': 'Sản phẩm còn hàng',
        'san-pham-dang-giam-gia': 'Sản phẩm đang giảm giá',
    };
    return nameMap[slug] || 'Danh mục';
};

export default function CategoryDetailLayout() {
    const params = useParams();
    const slug = params.slug as string;
    const { mutate: globalMutate } = useSWRConfig();
    
    // Check if slug is a special path parameter (san-pham-noi-bat, san-pham-ban-chay, etc.)
    const isSpecialPath = ['tat-ca-san-pham', 'san-pham-noi-bat', 'san-pham-ban-chay', 'san-pham-co-huy-hieu', 'san-pham-con-hang', 'san-pham-dang-giam-gia'].includes(slug);
    const categoryFallbackName = categoryNames[slug] || (isSpecialPath ? getSpecialPathName(slug) : 'Danh mục');

    const [sortBy, setSortBy] = useState('default');
    const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);
    const [pendingPriceRange, setPendingPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);
    const [priceInputValues, setPriceInputValues] = useState<[string, string]>([
        formatCurrency(DEFAULT_PRICE_RANGE[0]),
        formatCurrency(DEFAULT_PRICE_RANGE[1])
    ]);
    const [focusedInput, setFocusedInput] = useState<0 | 1 | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [accumulatedProducts, setAccumulatedProducts] = useState<FeaturedProduct[]>([]);
    const itemsPerPage = 10;
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const sortDropdownRef = useRef<HTMLDivElement | null>(null);
    const prevSlugRef = useRef<string | null>(null);

    // Only fetch category if it's not a special path
    const { data: categoryData } = useCategory(isSpecialPath ? null : slug);

    const sortConfig = React.useMemo(() => {
        switch (sortBy) {
            case 'price-asc':
                return { sortField: 'price.priceOriginal', sortOrder: 'asc' };
            case 'price-desc':
                return { sortField: 'price.priceOriginal', sortOrder: 'desc' };
            case 'name-asc':
                return { sortField: 'name', sortOrder: 'asc' };
            case 'name-desc':
                return { sortField: 'name', sortOrder: 'desc' };
            case 'newest':
                return { sortField: 'createdAt', sortOrder: 'desc' };
            default:
                // Default: không gửi sort params, để backend dùng default sort
                return { sortField: undefined, sortOrder: undefined };
        }
    }, [sortBy]);

    // Use different hooks based on slug type
    const popularProductsQuery = usePopularProducts({
        page: currentPage,
        limit: itemsPerPage,
    });
    const bestSellingProductsQuery = useBestSellingProducts({
        page: currentPage,
        limit: itemsPerPage,
    });
    const badgeProductsQuery = useBadgeProducts({
        page: currentPage,
        limit: itemsPerPage,
    });
    const onSaleProductsQuery = useOnSaleProducts({
        page: currentPage,
        limit: itemsPerPage,
    });
    // Send price filter and sort to backend
    const regularProductsQuery = useProducts({
        page: currentPage,
        limit: itemsPerPage,
        categorySlug: isSpecialPath ? undefined : slug,
        minPrice: priceRange[0] !== DEFAULT_PRICE_RANGE[0] ? priceRange[0] : undefined,
        maxPrice: priceRange[1] !== DEFAULT_PRICE_RANGE[1] ? priceRange[1] : undefined,
        // Chỉ gửi sortBy/sortOrder khi không phải default
        sortBy: sortConfig.sortField,
        sortOrder: sortConfig.sortOrder,
    });

    // Select the appropriate query based on slug
    let productsData, productsError, isProductsLoading;
    if (slug === 'san-pham-noi-bat') {
        productsData = popularProductsQuery.data;
        productsError = popularProductsQuery.error;
        isProductsLoading = popularProductsQuery.isLoading;
    } else if (slug === 'san-pham-ban-chay') {
        productsData = bestSellingProductsQuery.data;
        productsError = bestSellingProductsQuery.error;
        isProductsLoading = bestSellingProductsQuery.isLoading;
    } else if (slug === 'san-pham-co-huy-hieu') {
        productsData = badgeProductsQuery.data;
        productsError = badgeProductsQuery.error;
        isProductsLoading = badgeProductsQuery.isLoading;
    } else if (slug === 'san-pham-dang-giam-gia') {
        productsData = onSaleProductsQuery.data;
        productsError = onSaleProductsQuery.error;
        isProductsLoading = onSaleProductsQuery.isLoading;
    } else {
        productsData = regularProductsQuery.data;
        productsError = regularProductsQuery.error;
        isProductsLoading = regularProductsQuery.isLoading;
    }

    // Map products from current page (already filtered and sorted by server)
    const currentPageProducts = React.useMemo<FeaturedProduct[]>(() => {
        if (!productsData?.data) return [];
        return productsData.data.map((product) => mapProductToFeaturedProduct(product));
    }, [productsData?.data]);

    // Accumulate products from all loaded pages
    useEffect(() => {
        if (currentPage === 1) {
            // First page: replace all
            // Luôn update khi có data từ API (kể cả từ cache)
            // Chỉ skip khi đang loading và chưa có data nào
            if (currentPageProducts.length > 0) {
                // Có data: update ngay
                setAccumulatedProducts(currentPageProducts);
            } else if (!isProductsLoading && productsData !== undefined) {
                // Đã load xong và không có data: set empty array để hiển thị empty state
                setAccumulatedProducts([]);
            }
            // Nếu đang loading và chưa có data, giữ nguyên accumulatedProducts (có thể từ cache)
        } else if (currentPageProducts.length > 0) {
            // Subsequent pages: append new products (avoid duplicates)
            setAccumulatedProducts((prev) => {
                const existingIds = new Set(prev.map((p) => p.id));
                const newProducts = currentPageProducts.filter((p) => !existingIds.has(p.id));
                return [...prev, ...newProducts];
            });
        }
    }, [currentPageProducts, currentPage, isProductsLoading, productsData]);

    // Use accumulated products for display
    const products = accumulatedProducts;

    // Reset state khi slug thay đổi (chuyển sang category khác)
    // Chỉ reset khi slug thực sự thay đổi, không reset khi quay lại cùng slug
    useEffect(() => {
        // Chỉ reset khi slug thực sự thay đổi (không phải khi component remount với cùng slug)
        if (prevSlugRef.current !== null && prevSlugRef.current !== slug) {
            setCurrentPage(1);
            setAccumulatedProducts([]);
        }
        prevSlugRef.current = slug;
    }, [slug]);

    useEffect(() => {
        const maxPage = productsData?.pagination?.totalPages ?? 0;

        if (maxPage > 0 && currentPage > maxPage) {
            setCurrentPage(maxPage);
        } else if (maxPage === 0 && currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [currentPage, productsData?.pagination?.totalPages]);

    const handleSortChange = (value: string) => {
        setSortBy(value);
        setCurrentPage(1);
        setAccumulatedProducts([]);
    };

    // Update input display values when pendingPriceRange changes (from slider)
    useEffect(() => {
        if (focusedInput === null) {
            setPriceInputValues([
                formatCurrency(pendingPriceRange[0]),
                formatCurrency(pendingPriceRange[1])
            ]);
        }
    }, [pendingPriceRange, focusedInput]);

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
        // Show raw number when focused for easier editing
        setPriceInputValues((prev) => {
            const newValues: [string, string] = [...prev];
            newValues[index] = pendingPriceRange[index].toString();
            return newValues;
        });
    };

    const handlePriceInputBlur = (index: 0 | 1) => {
        setFocusedInput(null);
        // Format the value when blur
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
        setAccumulatedProducts([]);
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
        setAccumulatedProducts([]);
        // Force revalidate SWR cache to fetch fresh data with default filters
        setTimeout(() => {
            globalMutate(
                (key) => typeof key === 'string' && key.startsWith('/api/v1/products'),
                undefined,
                { revalidate: true }
            );
        }, 0);
    };

    const categoryName = categoryData?.data?.category?.name || categoryFallbackName;
    const totalPages = productsData?.pagination?.totalPages ?? 0;
    const productCount = productsData?.pagination?.total ?? 0;
    const hasMoreProducts = currentPage < totalPages;
    const isLoadMoreLoading = isProductsLoading && currentPage > 1;

    const handleLoadMore = () => {
        if (!hasMoreProducts || isProductsLoading) return;
        setCurrentPage((prev) => prev + 1);
    };
    const hasActiveFilters =
        sortBy !== 'default' ||
        priceRange[0] !== DEFAULT_PRICE_RANGE[0] ||
        priceRange[1] !== DEFAULT_PRICE_RANGE[1];
    const hasPendingPriceChanges =
        pendingPriceRange[0] !== priceRange[0] || pendingPriceRange[1] !== priceRange[1];

    const productsErrorMessage =
        (productsError as ApiError | undefined)?.response?.data?.message ||
        (productsError as ApiError | undefined)?.message;
    const emptyDescription = isProductsLoading
        ? 'Đang tải sản phẩm...'
        : productsErrorMessage || 'Không tìm thấy sản phẩm nào trong danh mục này.';

    const breadcrumbItems = [
        { label: 'Trang chủ', href: '/' },
        { label: 'Danh mục', href: '/categories' },
        { label: categoryName, href: '' },
    ];

    const sliderStyle = React.useMemo(() => {
        const [minValue, maxValue] = pendingPriceRange;
        const minPercent =
            ((minValue - DEFAULT_PRICE_RANGE[0]) / (DEFAULT_PRICE_RANGE[1] - DEFAULT_PRICE_RANGE[0])) * 100;
        const maxPercent =
            ((maxValue - DEFAULT_PRICE_RANGE[0]) / (DEFAULT_PRICE_RANGE[1] - DEFAULT_PRICE_RANGE[0])) * 100;
        return {
            '--slider-start': `${minPercent}%`,
            '--slider-end': `${maxPercent}%`,
        } as React.CSSProperties;
    }, [pendingPriceRange]);

    const filterBadges = React.useMemo(() => {
        const badges: Array<{ label: string; value: string }> = [];
        if (priceRange[0] !== DEFAULT_PRICE_RANGE[0] || priceRange[1] !== DEFAULT_PRICE_RANGE[1]) {
            badges.push({
                label: 'Khoảng giá',
                value: `${formatCurrency(priceRange[0])}₫ - ${formatCurrency(priceRange[1])}₫`,
            });
        }
        if (sortBy !== 'default') {
            const sortLabel = sortOptions.find((option) => option.value === sortBy)?.label;
            if (sortLabel) {
                badges.push({
                    label: 'Sắp xếp',
                    value: sortLabel,
                });
            }
        }
        return badges;
    }, [priceRange, sortBy]);

    const presetIsActive = (range: [number, number]) =>
        pendingPriceRange[0] === range[0] && pendingPriceRange[1] === range[1];

    const currentSortLabel = React.useMemo(() => {
        return sortOptions.find((option) => option.value === sortBy)?.label ?? 'Mặc định';
    }, [sortBy]);

    const toggleSortDropdown = () => setIsSortOpen((prev) => !prev);

    const handleSelectSort = (value: string) => {
        handleSortChange(value);
        setIsSortOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
                setIsSortOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsSortOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    return (
        <div className={cx('category-detail-page')}>
            <div className={cx('container')}>
                <Breadcrumbs items={breadcrumbItems} />

                <div className={cx('category-header')}>
                    <div className={cx('category-info')}>
                        <h1 className={cx('category-title')}>{categoryName}</h1>
                        <p className={cx('product-count')}>
                            {productCount} sản phẩm
                        </p>
                    </div>

                    <div className={cx('category-controls')}>
                        <button
                            className={cx('mobile-filter-button')}
                            onClick={toggleMobileFilter}
                        >
                            <FilterIcon size={20} />
                            <span>Bộ lọc</span>
                        </button>

                        <div
                            className={cx('sort-dropdown', { 'is-open': isSortOpen })}
                            ref={sortDropdownRef}
                        >
                            <div className={cx('sort-summary')}>
                                <div className={cx('sort-icon')}>
                                    <SortIcon size={18} />
                                </div>
                                <div>
                                    <p className={cx('sort-label')}>Sắp xếp theo</p>
                                    <p className={cx('sort-value')}>{currentSortLabel}</p>
                                </div>
                            </div>
                            <div className={cx('sort-select-wrapper')}>
                                <button
                                    type="button"
                                    className={cx('sort-select-trigger')}
                                    onClick={toggleSortDropdown}
                                    aria-haspopup="listbox"
                                    aria-expanded={isSortOpen}
                                    aria-controls="sort-options"
                                >
                                    {currentSortLabel}
                                </button>
                                <ul
                                    id="sort-options"
                                    className={cx('sort-options')}
                                    role="listbox"
                                    aria-hidden={!isSortOpen}
                                >
                                    {sortOptions.map((option) => (
                                        <li key={option.value}>
                                            <button
                                                type="button"
                                                className={cx('sort-option', {
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
                </div>

                <div className={cx('category-content')}>
                    {/* Filters Sidebar */}
                    <aside className={cx('filters-sidebar', { 'mobile-open': isMobileFilterOpen })}>
                        <div className={cx('mobile-filter-header')}>
                            <h3 className={cx('mobile-filter-title')}>Bộ lọc sản phẩm</h3>
                            <button
                                className={cx('mobile-filter-close')}
                                onClick={toggleMobileFilter}
                            >
                                <CloseIcon size={24} />
                            </button>
                        </div>

                        <div className={cx('filters-header')}>
                            <div>
                                <h2 className={cx('filters-title')}>Bộ lọc thông minh</h2>
                                <p className={cx('filters-subtitle')}>
                                    Tinh chỉnh mức giá và xem kết quả tức thì
                                </p>
                            </div>

                            {hasActiveFilters && (
                                <button className={cx('clear-filters-button')} onClick={clearFilters}>
                                    Xóa tất cả
                                </button>
                            )}
                        </div>

                        {hasActiveFilters && filterBadges.length > 0 && (
                            <div className={cx('active-filters')}>
                                <span className={cx('active-filters-label')}>Đang áp dụng:</span>
                                <div className={cx('filter-badges')}>
                                    {filterBadges.map((badge) => (
                                        <span key={badge.label} className={cx('filter-badge')}>
                                            <strong>{badge.label}:</strong> {badge.value}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Price Range Filter */}
                        <div className={cx('filter-section')}>
                            <h3 className={cx('filter-title')}>Khoảng giá</h3>
                            <div className={cx('price-input-row')}>
                                <div className={cx('price-input-group')}>
                                    <label>TỐI THIỂU</label>
                                    <input
                                        type="text"
                                        value={priceInputValues[0]}
                                        onChange={(e) => handlePriceInputChange(0, e.target.value)}
                                        onFocus={() => handlePriceInputFocus(0)}
                                        onBlur={() => handlePriceInputBlur(0)}
                                        className={cx('price-input')}
                                        placeholder="0"
                                        inputMode="numeric"
                                    />
                                </div>
                                <div className={cx('price-input-group')}>
                                    <label>TỐI ĐA</label>
                                    <input
                                        type="text"
                                        value={priceInputValues[1]}
                                        onChange={(e) => handlePriceInputChange(1, e.target.value)}
                                        onFocus={() => handlePriceInputFocus(1)}
                                        onBlur={() => handlePriceInputBlur(1)}
                                        className={cx('price-input')}
                                        placeholder="10.000.000"
                                        inputMode="numeric"
                                    />
                                </div>
                            </div>

                            <div className={cx('price-range-slider')} style={sliderStyle}>
                                <div className={cx('slider-track')} />
                                <div className={cx('slider-active-track')} />
                                <input
                                    type="range"
                                    min={DEFAULT_PRICE_RANGE[0]}
                                    max={DEFAULT_PRICE_RANGE[1]}
                                    step={PRICE_SLIDER_STEP}
                                    value={pendingPriceRange[0]}
                                    onChange={(e) => handleSliderChange(0, Number(e.target.value))}
                                    className={cx('slider-input')}
                                />
                                <input
                                    type="range"
                                    min={DEFAULT_PRICE_RANGE[0]}
                                    max={DEFAULT_PRICE_RANGE[1]}
                                    step={PRICE_SLIDER_STEP}
                                    value={pendingPriceRange[1]}
                                    onChange={(e) => handleSliderChange(1, Number(e.target.value))}
                                    className={cx('slider-input')}
                                />
                            </div>

                            <div className={cx('price-range-display')}>
                                {formatCurrency(pendingPriceRange[0])}₫ - {formatCurrency(pendingPriceRange[1])}₫
                            </div>
                        </div>

                        {/* Quick Price Filters */}
                        <div className={cx('filter-section')}>
                            <h3 className={cx('filter-title')}>Mức giá</h3>
                            <div className={cx('quick-price-grid')}>
                                {quickPricePresets.map((preset) => (
                                    <button
                                        key={preset.label}
                                        className={cx('quick-price-button', {
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

                        <div className={cx('filters-footer')}>
                            <button
                                className={cx('apply-filters-button')}
                                onClick={handleApplyFilters}
                                disabled={!hasPendingPriceChanges}
                            >
                                Áp dụng bộ lọc
                            </button>
                            <p className={cx('filters-hint')}>
                                {hasPendingPriceChanges
                                    ? 'Bạn có thay đổi chưa được áp dụng.'
                                    : 'Tất cả bộ lọc đã được áp dụng.'}
                            </p>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div className={cx('products-section')}>
                        {productsError ? (
                            <EmptyState
                                icon={<FileSearchIcon size={80} />}
                                title="Không thể tải sản phẩm"
                                description={productsErrorMessage || 'Có lỗi xảy ra khi tải sản phẩm'}
                                actionLabel="Thử lại"
                                onAction={() => window.location.reload()}
                            />
                        ) : isProductsLoading && products.length === 0 ? (
                            <div className={cx('products-grid')}>
                                <ProductListSkeleton count={itemsPerPage} />
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                <div className={cx('products-grid')}>
                                    {products.map((product) => {
                                        // Convert stock number to string literal type
                                        const stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock' | undefined = 
                                            product.stock === undefined || product.stock === null
                                                ? undefined
                                                : product.stock === 0
                                                ? 'out-of-stock'
                                                : product.stock <= 10
                                                ? 'low-stock'
                                                : 'in-stock';
                                        
                                        return (
                                            <ProductCard 
                                                key={product.id} 
                                                {...product} 
                                                stock={stockStatus}
                                            />
                                        );
                                    })}
                                </div>

                                {/* Load More */}
                                {hasMoreProducts && (
                                    <div className={cx('load-more')}>
                                        <button
                                            type="button"
                                            className={cx('load-more-button')}
                                            onClick={handleLoadMore}
                                            disabled={isLoadMoreLoading}
                                        >
                                            <span>
                                                {isLoadMoreLoading 
                                                    ? 'Đang tải...' 
                                                    : `Xem thêm sản phẩm`}
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : !isProductsLoading && productsData ? (
                            <EmptyState
                                type="products"
                                title="Không có sản phẩm"
                                description={emptyDescription}
                                actionLabel="Quay về trang chủ"
                                actionHref="/"
                            />
                        ) : (
                            <div className={cx('products-grid')}>
                                <ProductListSkeleton count={itemsPerPage} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Overlay */}
            {isMobileFilterOpen && (
                <div
                    className={cx('mobile-filter-overlay')}
                    onClick={toggleMobileFilter}
                    aria-hidden="true"
                />
            )}
        </div>
    );
}

