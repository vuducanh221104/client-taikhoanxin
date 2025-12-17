'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import ProductCard from '@/components/ProductCard';
import { WishlistItem } from '@/services/wishlistService';
import { addToCart } from '@/redux/cartSlice';
import { FeaturedProduct } from '@/components/FeaturedProducts';
import { useToast } from '@/hooks/useToast';
import classNames from 'classnames/bind';
import styles from '@/app/(user)/wishlist/page.module.scss';
import { HeartIcon } from '@/components/Icons';
import { EmptyState } from '@/components/EmptyState';
import { useWishlist } from '@/hooks/useWishlist';

const cx = classNames.bind(styles);

const WishlistLayout: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {
        wishlist,
        removeWishlistItem: removeWishlistItemMutation,
        isLoading: isWishlistLoading,
    } = useWishlist();
    const { showSuccess, showError } = useToast();
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [hasFetchedWishlist, setHasFetchedWishlist] = useState(false);

    // Sync local state with wishlist data
    useEffect(() => {
        setWishlistItems(wishlist);
    }, [wishlist]);

    useEffect(() => {
        if (!isWishlistLoading) {
            setHasFetchedWishlist(true);
        }
    }, [isWishlistLoading]);

    const filteredItems = useMemo(() => wishlistItems, [wishlistItems]);

    const handleAddToCart = (item: WishlistItem) => {
        const product: FeaturedProduct = {
            id: item.productId,
            productName: item.productName,
            price: item.price,
            oldPrice: item.oldPrice ?? undefined,
            discount: item.discount ?? undefined,
            rating: item.rating ?? undefined,
            reviewCount: item.reviewCount ?? undefined,
            status: item.status,
            imageSrc: item.imageSrc,
            imageAlt: item.imageAlt,
            href: item.href,
        };

        dispatch(addToCart({
            id: item.productId,
            productName: item.productName,
            price: item.price,
            oldPrice: item.oldPrice ?? undefined,
            imageSrc: item.imageSrc || '',
            imageAlt: item.imageAlt || item.productName,
            href: item.href || `/product/${item.productId}`,
        }));
        showSuccess(`Đã thêm "${item.productName}" vào giỏ hàng`);
    };

    const handleRemoveFromWishlist = async (item: WishlistItem) => {
        if (!item?.productId) return;

        try {
            await removeWishlistItemMutation(item.productId);
            showSuccess(`Đã xóa "${item.productName}" khỏi yêu thích`);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
            showError(errorMessage);
        }
    };

    return (
        <div className={cx('wishlist-page')}>
            <div className={cx('wishlist-container')}>
                {/* Header */}
                <div className={cx('wishlist-header')}>
                    <div className={cx('header-content')}>
                        <h1 className={cx('wishlist-title')}>
                            <HeartIcon size={28} className={cx('title-icon')} />
                            Sản phẩm yêu thích
                        </h1>
                        <p className={cx('wishlist-subtitle')}>
                            Danh sách sản phẩm bạn đã thêm vào yêu thích
                        </p>
                    </div>
                </div>

                {/* Wishlist Content */}
                {filteredItems.length > 0 ? (
                    <div className={cx('wishlist-grid')}>
                        {filteredItems.map((item) => (
                            <div key={item.id} className={cx('wishlist-item-wrapper')}>
                                <ProductCard
                                    id={item.productId}
                                    productName={item.productName}
                                    price={item.price}
                                    oldPrice={item.oldPrice ?? undefined}
                                    discount={item.discount ?? undefined}
                                    rating={item.rating ?? undefined}
                                    reviewCount={item.reviewCount ?? undefined}
                                    status={item.status}
                                    href={item.href}
                                    imageSrc={item.imageSrc}
                                    imageAlt={item.imageAlt}
                                    isFavorite={true}
                                    onAddToCart={() => handleAddToCart(item)}
                                    onToggleFavorite={() => handleRemoveFromWishlist(item)}
                                    showRemoveButton={true}
                                    onRemove={() => handleRemoveFromWishlist(item)}
                                />
                            </div>
                        ))}
                    </div>
                ) : hasFetchedWishlist ? (
                    <div className={cx('empty-state-wrapper')}>
                        <EmptyState
                            type="wishlist"
                            icon={<HeartIcon size={80} />}
                            title="Chưa có sản phẩm yêu thích"
                            description="Hãy thêm các sản phẩm bạn yêu thích vào danh sách này để dễ dàng tìm lại sau."
                            actionLabel="Khám phá sản phẩm"
                            actionHref="/products"
                        />
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default WishlistLayout;

