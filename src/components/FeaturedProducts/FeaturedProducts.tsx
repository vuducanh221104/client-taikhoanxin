'use client';

import React, { useMemo, useCallback } from 'react';
import Link from 'next/link';
import classNames from 'classnames/bind';
import styles from './FeaturedProducts.module.scss';
import ProductCard from '@/components/ProductCard';
import { useWishlist } from '@/hooks/useWishlist';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { ProductListSkeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import { PackageIcon } from '@/components/Icons';

const cx = classNames.bind(styles);

export interface FeaturedProduct {
    id: string;
    productName: string;
    price: number;
    oldPrice?: number;
    discount?: number;
    rating?: number; // Rating từ 0-5
    reviewCount?: number; // Số lượng đánh giá
    status?: 'in-stock' | 'out-of-stock';
    href?: string;
    imageSrc?: string;
    imageAlt?: string;
    tags?: string[];
    categoryIds?: string[];
}

export interface FeaturedProductsProps {
    products?: FeaturedProduct[];
    title?: string;
    subtitle?: string;
    discoverButtonText?: string;
    discoverButtonHref?: string;
    backgroundImage?: string;
    isDarkBackground?: boolean;
    badge?: string; // Badge text (e.g., "HOT", "BEST SELLER", "NEW")
    isLoading?: boolean; // Show skeletons when loading
    skeletonCount?: number; // Number of skeleton cards
    emptyMessage?: string; // Message to show when no products
    onAddToCart?: (product: FeaturedProduct) => void;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
    products = [],
    title = 'Sản phẩm nổi bật',
    subtitle = 'Danh sách những sản phẩm theo xu hướng mà có thể bạn sẽ thích',
    discoverButtonText = 'Khám phá',
    discoverButtonHref = '/products',
    backgroundImage,
    isDarkBackground = false,
    badge,
    isLoading = false,
    skeletonCount = 8,
    emptyMessage = 'Hiện chưa có sản phẩm phù hợp.',
    onAddToCart,
}) => {
    const router = useRouter();
    const { toggleWishlist, isProductInWishlist, isLoggedIn } = useWishlist();
    const { showSuccess, showInfo, showError } = useToast();

    const displayProducts = useMemo(() => {
        return products;
    }, [products]);

    const handleToggleFavorite = useCallback(async (productId: string) => {
        const product = displayProducts.find(p => p.id === productId);
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
    }, [displayProducts, isLoggedIn, toggleWishlist, showInfo, showSuccess, showError, router]);

    const sectionStyle = backgroundImage
        ? {
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }
        : {};

    return (
        <section
            className={cx('featured-products', {
                'dark-background': isDarkBackground,
            })}
            style={sectionStyle}
        >
            <div className="container-wide">
                {/* Header */}
                <div className={cx('header')}>
                    <div className={cx('header-content')}>
                        <div className={cx('title-wrapper')}>
                            <h2 className={cx('title')}>{title}</h2>
                            {badge && (
                                <span className={cx('badge', {
                                    'dark-badge': isDarkBackground,
                                })}>
                                    {badge}
                                </span>
                            )}
                        </div>
                        <p className={cx('subtitle')}>{subtitle}</p>
                    </div>
                    <Link href={discoverButtonHref} className={cx('discover-button')}>
                        {discoverButtonText}
                    </Link>
                </div>

                {/* Products Grid */}
                <div className={cx('products-grid')}>
                    {isLoading ? (
                        <ProductListSkeleton
                            count={skeletonCount}
                            variant={isDarkBackground ? 'dark' : 'light'}
                        />
                    ) : displayProducts.length > 0 ? (
                        displayProducts.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                {...product}
                                variant={isDarkBackground ? 'dark' : 'light'}
                                isFavorite={isProductInWishlist(product.id)}
                                onAddToCart={onAddToCart ? () => onAddToCart(product) : undefined}
                                onToggleFavorite={handleToggleFavorite}
                            />
                        ))
                    ) : (
                        <EmptyState
                            type="products"
                            icon={<PackageIcon size={80} />}
                            title="Không tìm thấy sản phẩm"
                            description={emptyMessage}
                            actionLabel={discoverButtonText || 'Khám phá sản phẩm'}
                            actionHref={discoverButtonHref || '/products'}
                        />
                    )}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
