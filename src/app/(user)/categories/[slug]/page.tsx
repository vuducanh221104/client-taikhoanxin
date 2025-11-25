'use client';

import React, { useState, useEffect } from 'react';
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

export default function CategoryDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const categoryFallbackName = categoryNames[slug] || 'Danh mục';

    const [sortBy, setSortBy] = useState('default');
    const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);
    const [pendingPriceRange, setPendingPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 30;

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
    };

    const handleApplyFilters = () => {
        setPriceRange(pendingPriceRange);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setPendingPriceRange(DEFAULT_PRICE_RANGE);
        setPriceRange(DEFAULT_PRICE_RANGE);
        handleSortChange('default');
    };

    const categoryName = categoryData?.data?.category?.name || categoryFallbackName;
    const currentProducts = products;
    const totalPages = productsData?.pagination?.totalPages ?? 0;
    const productCount = productsData?.pagination?.total ?? currentProducts.length;
    const hasActiveFilters =
        sortBy !== 'default' ||
        priceRange[0] !== DEFAULT_PRICE_RANGE[0] ||
        priceRange[1] !== DEFAULT_PRICE_RANGE[1];
    const hasPendingPriceChanges =
        pendingPriceRange[0] !== priceRange[0] || pendingPriceRange[1] !== priceRange[1];

    const productsErrorMessage =
        (productsError as any)?.response?.data?.message || productsError?.message;
    const emptyDescription = isProductsLoading
        ? 'Đang tải sản phẩm...'
        : productsErrorMessage || 'Không tìm thấy sản phẩm nào trong danh mục này.';

    const breadcrumbItems = [
        { label: 'Trang chủ', href: '/' },
        { label: 'Danh mục', href: '/categories' },
        { label: categoryName, href: '' },
    ];

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
                        <div className={cx('sort-dropdown')}>
                            <SortIcon size={20} />
                            <select
                                value={sortBy}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className={cx('sort-select')}
                            >
                                <option value="default">Mặc định</option>
                                <option value="newest">Mới nhất</option>
                                <option value="price-asc">Giá: Thấp đến cao</option>
                                <option value="price-desc">Giá: Cao đến thấp</option>
                                <option value="name-asc">Tên: A-Z</option>
                                <option value="name-desc">Tên: Z-A</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className={cx('category-content')}>
                    {/* Filters Sidebar */}
                    <aside className={cx('filters-sidebar')}>
                        <div className={cx('filters-header')}>
                            <h2 className={cx('filters-title')}>Bộ lọc</h2>
                            <div className={cx('filters-header-actions')}>
                                <button
                                    className={cx('apply-filters-button')}
                                    onClick={handleApplyFilters}
                                    disabled={!hasPendingPriceChanges}
                                >
                                    Lọc
                                </button>
                                {hasActiveFilters && (
                                    <button
                                        className={cx('clear-filters-button')}
                                        onClick={clearFilters}
                                    >
                                        Xóa tất cả
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Price Range Filter */}
                        <div className={cx('filter-section')}>
                            <h3 className={cx('filter-title')}>Khoảng giá</h3>
                            <input
                                type="number"
                                placeholder="Từ"
                                value={pendingPriceRange[0]}
                                onChange={(e) => {
                                    const value = Number(e.target.value) || 0;
                                    setPendingPriceRange([value, pendingPriceRange[1]]);
                                }}
                                className={cx('price-input')}
                            />
                            <div className={cx('price-range-display')}>
                                {pendingPriceRange[0].toLocaleString('vi-VN')}₫ - {pendingPriceRange[1].toLocaleString('vi-VN')}₫
                            </div>
                        </div>

                        {/* Quick Price Filters */}
                        <div className={cx('filter-section')}>
                            <h3 className={cx('filter-title')}>Mức giá</h3>
                            <div className={cx('quick-price-filters')}>
                                <button
                                    className={cx('quick-price-button')}
                                    onClick={() => setPendingPriceRange([0, 100000])}
                                >
                                    Dưới 100k
                                </button>
                                <button
                                    className={cx('quick-price-button')}
                                    onClick={() => setPendingPriceRange([100000, 500000])}
                                >
                                    100k - 500k
                                </button>
                                <button
                                    className={cx('quick-price-button')}
                                    onClick={() => setPendingPriceRange([500000, 1000000])}
                                >
                                    500k - 1tr
                                </button>
                                <button
                                    className={cx('quick-price-button')}
                                    onClick={() => setPendingPriceRange([1000000, 10000000])}
                                >
                                    Trên 1tr
                                </button>
                            </div>
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

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className={cx('pagination')}>
                                        <button
                                            className={cx('pagination-button')}
                                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            Trước
                                        </button>

                                        <div className={cx('pagination-numbers')}>
                                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                                let page;
                                                if (totalPages <= 5) {
                                                    page = i + 1;
                                                } else if (currentPage <= 3) {
                                                    page = i + 1;
                                                } else if (currentPage >= totalPages - 2) {
                                                    page = totalPages - 4 + i;
                                                } else {
                                                    page = currentPage - 2 + i;
                                                }
                                                return (
                                                    <button
                                                        key={page}
                                                        className={cx('pagination-number', { active: page === currentPage })}
                                                        onClick={() => setCurrentPage(page)}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <button
                                            className={cx('pagination-button')}
                                            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                            disabled={currentPage === totalPages}
                                        >
                                            Sau
                                        </button>
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
