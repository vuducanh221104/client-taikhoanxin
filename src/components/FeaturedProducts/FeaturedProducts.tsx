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
    const { showSuccess, showInfo } = useToast();

    // Default products if none provided
    const defaultProducts: FeaturedProduct[] = [
        {
            id: '1',
            productName: 'ElevenLabs Creator',
            price: 290000,
            oldPrice: 1500000,
            discount: 81,
            status: 'in-stock',
            href: '/products/elevenlabs-creator',
            imageSrc: '/products/product-1.png',
            imageAlt: 'ElevenLabs Creator',
        },
        {
            id: '2',
            productName: 'Duolingo Super',
            price: 290000,
            oldPrice: 1850000,
            discount: 84,
            status: 'in-stock',
            href: '/products/duolingo-super',
            imageSrc: '/products/product-2.png',
            imageAlt: 'Duolingo Super',
        },
        {
            id: '3',
            productName: 'Kaspersky Premium',
            price: 199000,
            oldPrice: 636000,
            discount: 69,
            status: 'in-stock',
            href: '/products/kaspersky-premium',
            imageSrc: '/products/product-3.png',
            imageAlt: 'Kaspersky Premium',
        },
        {
            id: '4',
            productName: 'Higgsfield Pro',
            price: 399000,
            oldPrice: 770000,
            discount: 48,
            status: 'out-of-stock',
            href: '/products/higgsfield-pro',
            imageSrc: '/products/product-1.png',
            imageAlt: 'Higgsfield Pro',
        },
        {
            id: '5',
            productName: 'Google AI Ultra',
            price: 199000,
            oldPrice: 6500000,
            discount: 97,
            status: 'in-stock',
            href: '/products/google-ai-ultra',
            imageSrc: '/products/product-2.png',
            imageAlt: 'Google AI Ultra',
        },
        {
            id: '6',
            productName: 'Wondershare Filmora 14',
            price: 199000,
            oldPrice: 900000,
            discount: 78,
            status: 'in-stock',
            href: '/products/wondershare-filmora-14',
            imageSrc: '/products/product-3.png',
            imageAlt: 'Wondershare Filmora 14',
        },
        {
            id: '7',
            productName: 'Spotify Premium',
            price: 399000,
            oldPrice: 708000,
            discount: 44,
            status: 'in-stock',
            href: '/products/spotify-premium',
            imageSrc: '/products/product-1.png',
            imageAlt: 'Spotify Premium',
        },
        {
            id: '8',
            productName: 'Canva Pro',
            price: 295000,
            oldPrice: 1500000,
            discount: 80,
            status: 'in-stock',
            href: '/products/canva-pro',
            imageSrc: '/products/product-2.png',
            imageAlt: 'Canva Pro',
        },
    ];

    const displayProducts = useMemo(() => {
        return products.length > 0 ? products : defaultProducts;
    }, [products]);

    const handleToggleFavorite = useCallback((productId: string) => {
        const product = displayProducts.find(p => p.id === productId);
        if (!product) return;

        if (!isLoggedIn) {
            showInfo('Vui lòng đăng nhập để thêm vào yêu thích');
            router.push('/auth/login');
            return;
        }

        const wasInWishlist = isProductInWishlist(product.id);
        toggleWishlist({
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

        if (wasInWishlist) {
            showSuccess(`Đã xóa "${product.productName}" khỏi yêu thích`);
        } else {
            showSuccess(`Đã thêm "${product.productName}" vào yêu thích`);
        }
    }, [displayProducts, isLoggedIn, isProductInWishlist, toggleWishlist, showInfo, showSuccess, router]);

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
                        displayProducts.map((product) => (
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
                            icon={<PackageIcon size={80} />}
                            title="Không tìm thấy sản phẩm"
                            description={emptyMessage}
                            action={{
                                label: discoverButtonText || 'Khám phá sản phẩm',
                                href: discoverButtonHref || '/products',
                            }}
                            size="medium"
                        />
                    )}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
