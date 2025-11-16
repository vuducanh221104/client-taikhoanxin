'use client';

import React from 'react';
import classNames from 'classnames/bind';
import styles from './Skeleton.module.scss';

const cx = classNames.bind(styles);

interface ProductCardSkeletonProps {
    variant?: 'light' | 'dark';
}

const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ variant = 'light' }) => {
    return (
        <div className={cx('skeleton-product-card', { 'dark-variant': variant === 'dark' })}>
            {/* Image skeleton */}
            <div className={cx('skeleton-image')} />
            
            {/* Content skeleton */}
            <div className={cx('skeleton-content')}>
                {/* Product name */}
                <div className={cx('skeleton-line', 'skeleton-title')} />
                
                {/* Rating */}
                <div className={cx('skeleton-rating')}>
                    <div className={cx('skeleton-stars')}>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={cx('skeleton-star')} />
                        ))}
                    </div>
                </div>
                
                {/* Price */}
                <div className={cx('skeleton-price')}>
                    <div className={cx('skeleton-line', 'skeleton-price-main')} />
                    <div className={cx('skeleton-line', 'skeleton-price-old')} />
                </div>
            </div>
            
            {/* Action buttons skeleton */}
            <div className={cx('skeleton-actions')}>
                <div className={cx('skeleton-button')} />
                <div className={cx('skeleton-button')} />
            </div>
        </div>
    );
};

export default ProductCardSkeleton;

