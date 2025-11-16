'use client';

import React from 'react';
import classNames from 'classnames/bind';
import styles from './Skeleton.module.scss';
import ProductCardSkeleton from './ProductCardSkeleton';

const cx = classNames.bind(styles);

interface ProductListSkeletonProps {
    count?: number;
    variant?: 'light' | 'dark';
    columns?: number;
}

const ProductListSkeleton: React.FC<ProductListSkeletonProps> = ({ 
    count = 8, 
    variant = 'light',
    columns 
}) => {
    return (
        <div 
            className={cx('skeleton-product-list')}
            style={columns ? { '--columns': columns } as React.CSSProperties : undefined}
        >
            {[...Array(count)].map((_, index) => (
                <ProductCardSkeleton key={index} variant={variant} />
            ))}
        </div>
    );
};

export default ProductListSkeleton;

