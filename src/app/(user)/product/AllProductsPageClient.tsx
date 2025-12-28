'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import classNames from 'classnames/bind';
import styles from './page.module.scss';
import ProductCard from '@/components/ProductCard';
import { FeaturedProduct } from '@/components/FeaturedProducts';
import { getAllProducts, getProductsByCategory, detectProductGenre, ProductCategory } from '@/services/productService';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/cartSlice';
import { PlusIcon } from '@/components/Icons';
import FilterBar, { FilterValues } from '@/components/FilterBar';
import { useWishlist } from '@/hooks/useWishlist';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { EmptyState } from '@/components/EmptyState';
import { PackageIcon } from '@/components/Icons';

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

export default function AllProductsPageClient() {
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
    const router = useRouter();
    const { toggleWishlist, isProductInWishlist, isLoggedIn } = useWishlist();
    const { showSuccess, showInfo, showError } = useToast();

    useEffect(() => {
        setDisplayLimit(INITIAL_DISPLAY_LIMIT);
    }, [filters]);

    const baseProducts = useMemo(() => {
        if (filters.category === 'all') {
            return getAllProducts();
        } else {
            return getProductsByCategory(filters.category as ProductCategory);
        }
    }, [filters.category]);

    const filteredProducts = useMemo(() => {
        let filtered = [...baseProducts];

        if (filters.genre !== 'all') {
            filtered = filtered.filter(product => {
                const productGenre = detectProductGenre(product.productName);
                return productGenre === filters.genre;
            });
        }

        if (filters.status !== 'all') {
            filtered = filtered.filter(product => product.status === filters.status);
        }

        const fromPrice = filters.priceFrom ? parseInt(filters.priceFrom.replace(/[^\d]/g, '')) : null;
        const toPrice = filters.priceTo ? parseInt(filters.priceTo.replace(/[^\d]/g, '')) : null;

        if (fromPrice !== null && !isNaN(fromPrice)) {
            filtered = filtered.filter(product => product.price >= fromPrice);
        }
        if (toPrice !== null && !isNaN(toPrice)) {
            filtered = filtered.filter(product => product.price <= toPrice);
        }

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

    const displayedProducts = useMemo(() => {
        return filteredProducts.slice(0, displayLimit);
    }, [filteredProducts, displayLimit]);

    const hasMoreProducts = filteredProducts.length > displayLimit;

    return (
        <div className={cx('products-page')}>
            <div className={cx('products-container')}>
                <div className={cx('products-header')}>
                    <h1 className={cx('products-title')}>Tất cả sản phẩm</h1>
                </div>

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

                {displayedProducts.length > 0 ? (
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
                ) : (
                    <EmptyState
                        icon={<PackageIcon size={80} />}
                        title="Không tìm thấy sản phẩm"
                        description="Thử điều chỉnh bộ lọc để xem thêm kết quả hoặc khám phá các sản phẩm khác"
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
                )}
            </div>
        </div>
    );
}


