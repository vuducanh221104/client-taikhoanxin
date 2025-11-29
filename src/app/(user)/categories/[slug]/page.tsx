'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import classNames from 'classnames/bind';
import styles from './page.module.scss';
import ProductCard from '@/components/ProductCard/ProductCard';
import { SortIcon } from '@/components/Icons';
import EmptyState from '@/components/EmptyState/EmptyState';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import { useCategory } from '@/services/categoryService';
import { useProducts, mapProductToFeaturedProduct } from '@/services/productService';
import type { FeaturedProduct } from '@/components/FeaturedProducts';

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
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export default function CategoryDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const categoryFallbackName = categoryNames[slug] || 'Danh mục';

    const [sortBy, setSortBy] = useState('default');
    const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);
    const [pendingPriceRange, setPendingPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);
    const [currentPage, setCurrentPage] = useState(1);
    const [loadedProducts, setLoadedProducts] = useState<FeaturedProduct[]>([]);
    const itemsPerPage = 30;
    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortDropdownRef = useRef<HTMLDivElement | null>(null);

    const { data: categoryData } = useCategory(slug);

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
                return { sortField: 'createdAt', sortOrder: 'desc' };
        }
    }, [sortBy]);

    const { data: productsData, error: productsError, isLoading: isProductsLoading } = useProducts({
        page: currentPage,
        limit: itemsPerPage,
        categorySlug: slug,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        sortBy: sortConfig.sortField,
        sortOrder: sortConfig.sortOrder,
    });

    const products = React.useMemo<FeaturedProduct[]>(() => {
        if (!productsData?.data) return [];
        return productsData.data.map((product) => mapProductToFeaturedProduct(product));
    }, [productsData?.data]);

    useEffect(() => {
        setCurrentPage(1);
        setLoadedProducts([]);
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
        setLoadedProducts([]);
    };

    const handlePriceInputChange = (index: 0 | 1, rawValue: number) => {
        const nextValue = clamp(rawValue, DEFAULT_PRICE_RANGE[0], DEFAULT_PRICE_RANGE[1]);
        setPendingPriceRange((prev) => {
            if (index === 0) {
                return [Math.min(nextValue, prev[1]), prev[1]];
            }
            return [prev[0], Math.max(nextValue, prev[0])];
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

    const handleApplyFilters = () => {
        setPriceRange(pendingPriceRange);
        setCurrentPage(1);
        setLoadedProducts([]);
    };

    const clearFilters = () => {
        setPendingPriceRange(DEFAULT_PRICE_RANGE);
        setPriceRange(DEFAULT_PRICE_RANGE);
        handleSortChange('default');
        setLoadedProducts([]);
    };

    const categoryName = categoryData?.data?.category?.name || categoryFallbackName;
    const totalPages = productsData?.pagination?.totalPages ?? 0;
    const productCount = productsData?.pagination?.total ?? loadedProducts.length;
    const responsePage = productsData?.pagination?.page ?? currentPage;
    const hasMoreProducts = currentPage < totalPages;
    const isLoadMoreLoading = isProductsLoading && currentPage > 1;
    const currentProducts = loadedProducts;

    useEffect(() => {
        if (!productsData?.data) {
            if (!isProductsLoading && responsePage === 1) {
                setLoadedProducts([]);
            }
            return;
        }

        if (responsePage === 1) {
            setLoadedProducts(products);
        } else if (products.length > 0) {
            setLoadedProducts((prev) => {
                const existingIds = new Set(prev.map((product) => product.id));
                const newItems = products.filter((product) => !existingIds.has(product.id));
                return [...prev, ...newItems];
            });
        }
    }, [products, productsData?.data, responsePage, isProductsLoading]);

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
                    <aside className={cx('filters-sidebar')}>
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
                                    <label>Tối thiểu</label>
                                    <input
                                        type="number"
                                        min={DEFAULT_PRICE_RANGE[0]}
                                        max={DEFAULT_PRICE_RANGE[1]}
                                        value={pendingPriceRange[0]}
                                        onChange={(e) => handlePriceInputChange(0, Number(e.target.value) || 0)}
                                        className={cx('price-input')}
                                        placeholder="0"
                                    />
                                </div>
                                <div className={cx('price-input-group')}>
                                    <label>Tối đa</label>
                                    <input
                                        type="number"
                                        min={DEFAULT_PRICE_RANGE[0]}
                                        max={DEFAULT_PRICE_RANGE[1]}
                                        value={pendingPriceRange[1]}
                                        onChange={(e) => handlePriceInputChange(1, Number(e.target.value) || 0)}
                                        className={cx('price-input')}
                                        placeholder="10.000.000"
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
                                        onClick={() => setPendingPriceRange(preset.range)}
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
                        {currentProducts.length > 0 ? (
                            <>
                                <div className={cx('products-grid')}>
                                    {currentProducts.map((product) => (
                                        <ProductCard key={product.id} {...product} />
                                    ))}
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
                                            {isLoadMoreLoading ? 'Đang tải...' : 'Xem thêm sản phẩm'}
                                        </button>
                                        <p className={cx('load-more-hint')}>
                                            Đang hiển thị {currentProducts.length} / {productCount} sản phẩm
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <EmptyState
                                type="products"
                                title="Không có sản phẩm"
                                description={emptyDescription}
                                actionLabel="Xem tất cả danh mục"
                                actionHref="/categories"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
