'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import classNames from 'classnames/bind';
import styles from './page.module.scss';
import ProductCard from '@/components/ProductCard';
import { FeaturedProduct } from '@/components/FeaturedProducts';
import { searchProducts, getProductCategory, detectProductGenre } from '@/services/productService';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/cartSlice';
import { PlusIcon, SearchIcon } from '@/components/Icons';
import FilterBar, { FilterValues, SortOption } from '@/components/FilterBar';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/hooks/useToast';
import { ProductListSkeleton } from '@/components/Skeleton';
import EmptyState from '@/components/EmptyState';
import { FileSearchIcon, PackageIcon } from '@/components/Icons';

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

const sortOptions = [
    { value: 'default', label: 'Mặc định' },
    { value: 'price-asc', label: 'Giá tăng dần' },
    { value: 'price-desc', label: 'Giá giảm dần' },
    { value: 'name-asc', label: 'Tên A-Z' },
    { value: 'name-desc', label: 'Tên Z-A' },
];

export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams?.get('q') || '';
    
    const [searchValue, setSearchValue] = useState<string>(query);
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
    const searchInputRef = useRef<HTMLInputElement>(null);
    const { toggleWishlist, isProductInWishlist, isLoggedIn } = useWishlist();
    const { showSuccess, showInfo, showError } = useToast();

    // Update search value when query param changes
    useEffect(() => {
        if (query) {
            setSearchValue(query);
        }
    }, [query]);

    // Reset display limit when filters or query change
    useEffect(() => {
        setDisplayLimit(INITIAL_DISPLAY_LIMIT);
    }, [query, filters]);

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

    // Get products based on search query
    const baseProducts = useMemo(() => {
        if (!query || query.trim().length === 0) {
            return [];
        }
        return searchProducts(query, 1000);
    }, [query]);

    // Filter products
    const filteredProducts = useMemo(() => {
        let filtered = [...baseProducts];

        // Filter by category - Check if product belongs to selected category
        if (filters.category !== 'all') {
            filtered = filtered.filter(product => {
                const productCategory = getProductCategory(product.id);
                return productCategory === filters.category;
            });
        }

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
                // Keep original order (relevance from search)
                break;
        }

        return filtered;
    }, [baseProducts, filters]);

    const handleAddToCart = (product: FeaturedProduct) => {
        dispatch(addToCart({
            id: product.id,
            productName: product.productName,
            price: product.price,
            oldPrice: product.oldPrice,
            imageSrc: product.imageSrc,
            imageAlt: product.imageAlt,
            href: product.href,
        }));
        showSuccess(`Đã thêm "${product.productName}" vào giỏ hàng`);
    };

    const handleToggleFavorite = async (productId: string) => {
        const product = filteredProducts.find(p => p.id === productId);
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
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
            showError(errorMessage);
        }
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

    const hasActiveFilters = filters.category !== 'all' || 
                             filters.genre !== 'all' || 
                             filters.status !== 'all' ||
                             filters.priceFrom !== '' || 
                             filters.priceTo !== '' || 
                             filters.sortBy !== 'default';

    return (
        <div className={cx('search-page')}>
            <div className={cx('search-container')}>
                {/* Header */}
                <div className={cx('search-header')}>
                    <h1 className={cx('search-title')}>
                        {query ? `Kết quả tìm kiếm cho "${query}"` : 'Tìm kiếm sản phẩm'}
                    </h1>
                    {query && baseProducts.length > 0 && (
                        <p className={cx('search-results-count')}>
                            {hasActiveFilters ? (
                                <>
                                    Hiển thị <strong>{filteredProducts.length}</strong> / <strong>{baseProducts.length}</strong> sản phẩm
                                </>
                            ) : (
                                <>
                                    Tìm thấy <strong>{baseProducts.length}</strong> sản phẩm
                                </>
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

                {/* Filter Bar */}
                {query && baseProducts.length > 0 && (
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
                )}

                {/* Products Grid or Empty State */}
                {!query ? (
                    <div className={cx('empty-state')}>
                        <SearchIcon size={64} className={cx('empty-icon')} />
                        <p className={cx('empty-message')}>Nhập từ khóa để tìm kiếm sản phẩm</p>
                    </div>
                ) : baseProducts.length === 0 ? (
                    <EmptyState
                        icon={<FileSearchIcon size={80} />}
                        title={`Không tìm thấy sản phẩm cho "${query}"`}
                        description="Thử tìm kiếm với từ khóa khác hoặc khám phá các sản phẩm phổ biến"
                        actionLabel="Khám phá sản phẩm"
                        actionHref="/products"
                    />
                ) : filteredProducts.length === 0 ? (
                    <EmptyState
                        icon={<PackageIcon size={80} />}
                        title="Không có sản phẩm nào phù hợp"
                        description="Thử điều chỉnh bộ lọc để xem thêm kết quả"
                        actionLabel="Xóa bộ lọc"
                        onAction={() => {
                            setFilters({
                                category: 'all',
                                genre: 'all',
                                status: 'all',
                                priceFrom: '',
                                priceTo: '',
                                sortBy: 'default',
                            });
                        }}
                    />
                ) : (
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
                                    isFavorite={isProductInWishlist(product.id)}
                                    onAddToCart={() => handleAddToCart(product)}
                                    onToggleFavorite={handleToggleFavorite}
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
                                    <PlusIcon size={20} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
