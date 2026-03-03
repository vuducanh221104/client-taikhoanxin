'use client';

import React from 'react';
import classNames from 'classnames/bind';
import styles from './ProductDetailSkeleton.module.scss';

const cx = classNames.bind(styles);

interface ProductDetailSkeletonProps {
    variant?: 'light' | 'dark';
}

const ProductDetailSkeleton: React.FC<ProductDetailSkeletonProps> = ({ variant = 'light' }) => {
    const smallImages = Array.from({ length: 4 }, (_, i) => i);

    return (
        <div className={cx('skeleton-product-detail', { 'dark-variant': variant === 'dark' })}>
            {/* Left Column - Images */}
            <div className={cx('skeleton-detail-left')}>
                <div className={cx('skeleton-detail-main-image')} aria-hidden="true" />
                {/* <div className={cx('skeleton-detail-small-images')}>
                    {smallImages.map((index) => (
                        <div 
                            key={`small-${index}`} 
                            className={cx('skeleton-detail-small-image')} 
                            aria-hidden="true" 
                        />
                    ))}
                </div> */}
            </div>

            {/* Right Column - Product Info */}
            <div className={cx('skeleton-detail-right')}>
                {/* Breadcrumb */}
                <div className={cx('skeleton-detail-breadcrumb')}>
                    <div className={cx('skeleton-detail-breadcrumb-item', 'short')} />
                </div>

                {/* Product Name */}
                <div className={cx('skeleton-detail-name')} />
                <div className={cx('skeleton-detail-name', 'short')} style={{marginTop: '-15px'}}/>

                {/* Rating Row */}
                {/* <div className={cx('skeleton-detail-rating')}>
                    <div className={cx('skeleton-detail-stars')}>
                        {[...Array(5)].map((_, i) => (
                            <div key={`star-${i}`} className={cx('skeleton-detail-star')} />
                        ))}
                    </div>
                    <div className={cx('skeleton-detail-rating-text')} />
                    <div className={cx('skeleton-detail-rating-text', 'short')} />
                </div> */}



                {/* Short Description */}
                <div className={cx('skeleton-detail-description')}>
                    <div className={cx('skeleton-detail-description-line', 'short1')} />
                    <div className={cx('skeleton-detail-description-line')} />
                    <div className={cx('skeleton-detail-description-line')} />
                </div>

                 {/* Price */}
                    <div className={cx('skeleton-detail-price')}>
                    <div className={cx('skeleton-detail-price-main')} />
                    <div className={cx('skeleton-detail-price-container')}>
                        <div className={cx('skeleton-detail-price-old')} />
                        <div className={cx('skeleton-detail-price-discount')} style={{marginLeft: '10px'}} />
                    </div>
                </div>

                {/* Divider */}
                <div className={cx('skeleton-detail-divider')} />

                {/* Duration Options */}
                <div className={cx('skeleton-detail-option')}>
                    <div className={cx('skeleton-detail-option-label')} />
                    <div className={cx('skeleton-detail-option-buttons')}>
                        {[...Array(3)].map((_, i) => (
                            <div key={`duration-${i}`} className={cx('skeleton-detail-option-button')} />
                        ))}
                    </div>
                </div>

                {/* Account Type Options */}
                <div className={cx('skeleton-detail-option')} >
                    <div className={cx('skeleton-detail-option-label')} />
                    <div className={cx('skeleton-detail-option-buttons')}>
                        <div className={cx('skeleton-detail-option-button', 'wide')} />
                        <div className={cx('skeleton-detail-option-button', 'wide')} />
                    </div>
                </div>


            </div>
        </div>
    );
};

export default React.memo(ProductDetailSkeleton);
