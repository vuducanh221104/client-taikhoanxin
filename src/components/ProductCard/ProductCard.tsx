'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Image } from '@/components/Image';
import classNames from 'classnames/bind';
import styles from './ProductCard.module.scss';
import { CartIcon, HeartIcon, TrashIcon } from '@/components/Icons';
import ProductBadges from './ProductBadges';

const cx = classNames.bind(styles);

export interface ProductCardProps {
    id: string;
    productName: string;
    price: number;
    oldPrice?: number;
    discount?: number;
    rating?: number; // Rating từ 0-5
    reviewCount?: number; // Số lượng đánh giá
    status?: 'in-stock' | 'out-of-stock';
    stock?: 'in-stock' | 'low-stock' | 'out-of-stock'; // New stock status
    href?: string;
    imageSrc?: string;
    imageAlt?: string;
    variant?: 'light' | 'dark';
    isFavorite?: boolean; // External favorite state
    onAddToCart?: () => void;
    onToggleFavorite?: (id: string) => void;
    showRemoveButton?: boolean; // Show remove button in card
    onRemove?: () => void; // Remove handler
    // New badge props
    fastDelivery?: boolean;
    freeShipping?: boolean;
    warranty?: string;
    soldCount?: number;
    isHot?: boolean;
}

const formatPrice = (value: number): string => {
    return value?.toLocaleString('vi-VN');
};

const ProductCard: React.FC<ProductCardProps> = React.memo(({
    id,
    productName,
    price,
    oldPrice,
    discount,
    rating = 5, // Mặc định 5 sao cho dữ liệu mock
    reviewCount = 0,
    status = 'in-stock',
    stock,
    href = '',
    imageSrc,
    imageAlt = 'Product image',
    variant = 'light',
    isFavorite: externalIsFavorite,
    onAddToCart,
    onToggleFavorite,
    showRemoveButton = false,
    onRemove,
    // New badge props
    fastDelivery,
    freeShipping,
    warranty,
    soldCount,
    isHot,
}) => {
    const router = useRouter();
    const [internalIsFavorite, setInternalIsFavorite] = useState(false);
    const isFavorite = externalIsFavorite !== undefined ? externalIsFavorite : internalIsFavorite;

    const calculateDiscount = (): number => {
        if (discount !== undefined) return discount;
        if (oldPrice && oldPrice > price) {
            return Math.round(((oldPrice - price) / oldPrice) * 100);
        }
        return 0;
    };

    const discountPercent = calculateDiscount();

    // Render stars for rating
    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            const starStyle = { '--star-index': i } as React.CSSProperties;
            if (i < fullStars) {
                stars.push(
                    <span
                        key={i}
                        className={cx('star', 'star-filled')}
                        style={starStyle}
                    >
                        ★
                    </span>
                );
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <span
                        key={i}
                        className={cx('star', 'star-half')}
                        style={starStyle}
                    >
                        ★
                    </span>
                );
            } else {
                stars.push(
                    <span
                        key={i}
                        className={cx('star', 'star-empty')}
                        style={starStyle}
                    >
                        ★
                    </span>
                );
            }
        }
        return stars;
    };

    // Comment lại logic add to cart cũ - giờ sẽ redirect vào product details
    // const handleAddToCart = (e: React.MouseEvent) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     if (onAddToCart) {
    //         onAddToCart();
    //     }
    // };

    // Redirect vào product details page khi click add to cart
    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Nếu hết hàng thì không cho thao tác thêm vào giỏ (kể cả redirect)
        if (stockStatus === 'out-of-stock') {
            return;
        }
        if (href && href !== '#') {
            router.push(href);
        }
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (externalIsFavorite === undefined) {
            setInternalIsFavorite(!internalIsFavorite);
        }
        if (onToggleFavorite) {
            onToggleFavorite(id);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onRemove) {
            onRemove();
        }
    };

    // Determine stock status (use new stock prop or fallback to status)
    const stockStatus = stock || (status === 'out-of-stock' ? 'out-of-stock' : 'in-stock');
    const isOutOfStock = stockStatus === 'out-of-stock';

    const CardContent = (
        <div className={cx('product-card', { 'dark-variant': variant === 'dark', 'out-of-stock': isOutOfStock })}>
            {/* Product Badges */}
            <ProductBadges
                stock={stockStatus}
                fastDelivery={fastDelivery}
                freeShipping={freeShipping}
                warranty={warranty}
                soldCount={soldCount}
                isHot={isHot}
                discountPercent={discountPercent > 0 ? discountPercent : undefined}
            />

            {/* Action Buttons */}
            <div className={cx('action-buttons')}>
                <button
                    className={cx('action-button', { disabled: isOutOfStock })}
                    onClick={handleAddToCart}
                    aria-label="Thêm vào giỏ hàng"
                    type="button"
                    disabled={isOutOfStock}
                >
                    <CartIcon className={cx('action-icon')} />
                </button>
                <button
                    className={cx('action-button')}
                    onClick={handleToggleFavorite}
                    aria-label={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                    aria-pressed={isFavorite}
                    type="button"
                >
                    <HeartIcon className={cx('action-icon', { 'is-favorite': isFavorite })} />
                </button>
            </div>

            {/* Product Banner */}
            {imageSrc && (
                <div className={cx('product-banner')}>
                    <Image
                        src={imageSrc}
                        alt={imageAlt}
                        width={640}
                        height={299}
                        className={cx('banner-image')}
                        priority={false}
                        loading="lazy"
                        fetchPriority="low"
                    />
                </div>
            )}

            {/* Product Name */}
            <div className={cx('product-name-wrapper')}>
                <h3 className={cx('product-name')}>{productName}</h3>
            </div>

            {/* Rating Section */}
            <div className={cx('rating-section')}>
                <div className={cx('stars')}>
                    {renderStars()}
                </div>
                {isOutOfStock && (
                    <span className={cx('inline-stock-badge')}>
                        Hết hàng
                    </span>
                )}
            </div>

            {/* Price Section */}
            <div className={cx('price-section')}>
                <div className={cx('price-wrapper')}>
                    <span className={cx('current-price')}>{formatPrice(price)}₫</span>
                    {oldPrice && oldPrice > price && (
                        <span className={cx('old-price')}>{formatPrice(oldPrice)}₫</span>
                    )}
                </div>
            </div>

            {/* Remove Button */}
            {showRemoveButton && onRemove && (
                <button
                    className={cx('remove-button')}
                    onClick={handleRemove}
                    aria-label="Xóa khỏi yêu thích"
                    type="button"
                >
                    <TrashIcon size={18} />
                    <span>Xóa</span>
                </button>
            )}
        </div>
    );

    if (href && href !== '#') {
        return (
            <Link href={href} className={cx('product-card-link')}>
                {CardContent}
            </Link>
        );
    }

    return CardContent;
}, (prevProps, nextProps) => {
    // Custom comparison for memoization
    return (
        prevProps.id === nextProps.id &&
        prevProps.productName === nextProps.productName &&
        prevProps.price === nextProps.price &&
        prevProps.oldPrice === nextProps.oldPrice &&
        prevProps.discount === nextProps.discount &&
        prevProps.rating === nextProps.rating &&
        prevProps.reviewCount === nextProps.reviewCount &&
        prevProps.status === nextProps.status &&
        prevProps.href === nextProps.href &&
        prevProps.imageSrc === nextProps.imageSrc &&
        prevProps.imageAlt === nextProps.imageAlt &&
        prevProps.variant === nextProps.variant &&
        prevProps.isFavorite === nextProps.isFavorite
    );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;