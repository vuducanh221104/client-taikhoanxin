'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import classNames from 'classnames/bind';
import styles from './page.module.scss';
import ProductCard from '@/components/ProductCard';
import { FeaturedProduct } from '@/components/FeaturedProducts';
import { detectProductGenre, mapProductToFeaturedProduct } from '@/services/productService';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/redux/cartSlice';
import FilterBar, { FilterValues, FilterOption } from '@/components/FilterBar';
import { useViewedProducts } from '@/services/userService';
import { ProductListSkeleton } from '@/components/Skeleton';
import type { RootState } from '@/redux/store';

const cx = classNames.bind(styles);

const INITIAL_DISPLAY_LIMIT = 8;
const LOAD_MORE_INCREMENT = 8;

const categories = [
    { value: 'all', label: 'Tất cả' },
    { value: 'featured', label: 'Sản phẩm nổi bật' },
    { value: 'work', label: 'Làm việc' },
    { value: 'ai', label: 'Tài khoản AI' },
    { value: 'bestSelling', label: 'Bán chạy nhất' },
    { value: 'entertainment', label: 'Giải trí' },
    { value: 'new', label: 'Sản phẩm mới' },
];

const genres = [
    { value: 'all', label: 'Tất cả' },
    { value: 'account', label: 'Tài khoản' },
    { value: 'code', label: 'Code kích hoạt' },
    { value: 'license', label: 'License' },
];

const statusOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'in-stock', label: 'Còn hàng' },
    { value: 'out-of-stock', label: 'Hết hàng' },
];

const quickPriceFilters = [
    { label: 'Dưới 100k', from: 0, to: 100000 },
    { label: '100k - 500k', from: 100000, to: 500000 },
    { label: '500k - 1 triệu', from: 500000, to: 1000000 },
    { label: '1 triệu - 5 triệu', from: 1000000, to: 5000000 },
    { label: 'Trên 5 triệu', from: 5000000, to: Infinity },
];

const sortOptions: FilterOption[] = [
    { value: 'default', label: 'Mặc định' },
    { value: 'price-asc', label: 'Giá tăng dần' },
    { value: 'price-desc', label: 'Giá giảm dần' },
    { value: 'name-asc', label: 'Tên A-Z' },
    { value: 'name-desc', label: 'Tên Z-A' },
];

export default function ViewedProductsPage() {
    const [filters, setFilters] = useState<FilterValues>({
        category: 'all',
        genre: 'all',
        status: 'all',
        priceFrom: '',
        priceTo: '',
        sortBy: 'default',
    });
    const [displayLimit, setDisplayLimit] = useState<number>(INITIAL_DISPLAY_LIMIT);

    const dispatch = useDispatch();
    const currentUser = useSelector((state: RootState) => state.auth.login?.currentUser);
    const guestViewedProducts = useSelector((state: RootState) => state.viewedProducts.products);
    const isLoggedIn = Boolean(currentUser?.accessToken);

    const { data, error, isLoading, mutate } = useViewedProducts(
        { limit: 50 },
        { enabled: isLoggedIn }
    );

    const viewedProducts = isLoggedIn ? data?.data ?? [] : guestViewedProducts;

    useEffect(() => {
        if (isLoggedIn) {
            mutate(undefined, { revalidate: true });
        }
    }, [mutate, isLoggedIn]);

    // Map API products to FeaturedProduct format
    const mappedProducts = useMemo(() => {
        return viewedProducts.map((product) => mapProductToFeaturedProduct(product));
    }, [viewedProducts]);

    // Reset display limit when filters or data change
    useEffect(() => {
        setDisplayLimit(INITIAL_DISPLAY_LIMIT);
    }, [filters, mappedProducts.length]);

    // Get base products (recently viewed) - category filter is not used for viewed products
    const baseProducts = useMemo(() => {
        return mappedProducts;
    }, [mappedProducts]);

    // Filter products
    const filteredProducts = useMemo(() => {
        let filtered = [...baseProducts];

        // Filter by genre - Detect genre from product name
        if (filters.genre !== 'all') {
            filtered = filtered.filter(product => {
                const productGenre = detectProductGenre(product.productName);
                return productGenre === filters.genre;
            });
        }

        // Filter by status
        if (filters.status !== 'all') {
            filtered = filtered.filter(product => product.status === filters.status);
        }

        // Filter by price range
        const fromPrice = filters.priceFrom ? parseInt(filters.priceFrom.replace(/[^\d]/g, '')) : null;
        const toPrice = filters.priceTo ? parseInt(filters.priceTo.replace(/[^\d]/g, '')) : null;

        if (fromPrice !== null && !isNaN(fromPrice)) {
            filtered = filtered.filter(product => product.price >= fromPrice);
        }
        if (toPrice !== null && !isNaN(toPrice)) {
            filtered = filtered.filter(product => product.price <= toPrice);
        }

        // Sort products
        switch (filters.sortBy) {
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                filtered.sort((a, b) => a.productName.localeCompare(b.productName, 'vi'));
                break;
            case 'name-desc':
                filtered.sort((a, b) => b.productName.localeCompare(a.productName, 'vi'));
                break;
            default:
                // Keep original order (most recently viewed first)
                break;
        }

        return filtered;
    }, [baseProducts, filters.genre, filters.status, filters.priceFrom, filters.priceTo, filters.sortBy]);

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
    };

    const handleLoadMore = () => {
        setDisplayLimit(prev => prev + LOAD_MORE_INCREMENT);
    };

    const handleFilterChange = useCallback((newFilters: FilterValues) => {
        setFilters(prevFilters => {
            // Only update if filters actually changed to prevent unnecessary re-renders
            const hasChanged =
                prevFilters.category !== newFilters.category ||
                prevFilters.genre !== newFilters.genre ||
                prevFilters.status !== newFilters.status ||
                prevFilters.priceFrom !== newFilters.priceFrom ||
                prevFilters.priceTo !== newFilters.priceTo ||
                prevFilters.sortBy !== newFilters.sortBy;

            return hasChanged ? newFilters : prevFilters;
        });
    }, []);

    // Get products to display (limited)
    const displayedProducts = useMemo(() => {
        return filteredProducts.slice(0, displayLimit);
    }, [filteredProducts, displayLimit]);

    const hasMoreProducts = filteredProducts.length > displayLimit;
    const hasError = isLoggedIn ? Boolean(error) : false;
    const effectiveIsLoading = isLoggedIn ? isLoading : false;
    const showEmptyState = !effectiveIsLoading && !hasError && filteredProducts.length === 0;

    return (
        <div className={cx('products-page')}>
            <div className={cx('products-container')}>
                {/* Header */}
                <div className={cx('products-header')}>
                    <h1 className={cx('products-title')}>Sản phẩm bạn vừa xem</h1>
                </div>

                {/* Filter Bar */}
                <FilterBar
                    categories={categories}
                    genres={genres}
                    statusOptions={statusOptions}
                    sortOptions={sortOptions}
                    quickPriceFilters={quickPriceFilters}
                    defaultCategory="all"
                    layout="flex"
                    onFilterChange={handleFilterChange}
                />

                {/* Products Grid */}
                {effectiveIsLoading ? (
                    <div className={cx('products-grid')}>
                        <ProductListSkeleton count={Math.min(displayLimit, LOAD_MORE_INCREMENT)} />
                    </div>
                ) : hasError ? (
                    <div className={cx('empty-state')}>
                        <p className={cx('empty-message')}>Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.</p>
                    </div>
                ) : displayedProducts.length > 0 ? (
                    <>
                        <div className={cx('products-grid')}>
                            {displayedProducts.map((product) => (
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
                                    onAddToCart={() => handleAddToCart(product)}
                                />
                            ))}
                        </div>

                        {/* Load More Button */}
                        {hasMoreProducts && (
                            <div className={cx('load-more-section')}>
                                <button
                                    className={cx('load-more-button')}
                                    onClick={handleLoadMore}
                                    type="button"
                                >
                                    <span>Xem thêm {Math.min(LOAD_MORE_INCREMENT, filteredProducts.length - displayLimit)} sản phẩm</span>
                                </button>
                            </div>
                        )}
                    </>
                ) : showEmptyState ? (
                    <div className={cx('empty-state')}>
                        <p className={cx('empty-message')}>Không tìm thấy sản phẩm nào</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

