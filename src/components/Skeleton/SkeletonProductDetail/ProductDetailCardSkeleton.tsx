'use client';

import React, { useMemo } from 'react';
import classNames from 'classnames/bind';
import styles from './ProductDetailSkeleton.module.scss';

const cx = classNames.bind(styles);

const ProductDetailCardSkeleton: React.FC = () => {
    const stars = useMemo(() => {
        return Array.from({ length: 5 }, (_, i) => (
            <div key={`star-${i}`} className={cx('skeleton-star')} />
        ));
    }, []);

    return (
        <div className={cx('skeleton-product-card')}>
            {/* Image skeleton */}
            <div className={cx('skeleton-image')} aria-hidden="true" />
            
            {/* Content skeleton */}
            <div className={cx('skeleton-content')}>
                {/* Product name */}
                <div className={cx('skeleton-line', 'skeleton-title')} aria-hidden="true" />
                
                {/* Rating */}
                <div className={cx('skeleton-rating')} aria-hidden="true">
                    <div className={cx('skeleton-stars')}>
                        {stars}
                    </div>
                </div>
                
                {/* Price */}
                <div className={cx('skeleton-price')} aria-hidden="true">
                    <div className={cx('skeleton-line', 'skeleton-price-main')} />
                    <div className={cx('skeleton-line', 'skeleton-price-old')} />
                </div>
            </div>
            
        </div>
    );
};

export default React.memo(ProductDetailCardSkeleton);

