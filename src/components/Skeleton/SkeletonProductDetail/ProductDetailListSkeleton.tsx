'use client';

import React, { useMemo } from 'react';
import classNames from 'classnames/bind';
import styles from './ProductDetailSkeleton.module.scss';
import ProductDetailSkeleton from './ProductDetailSkeleton';

const cx = classNames.bind(styles);

interface ProductDetailListSkeletonProps {
    count?: number;
    variant?: 'light' | 'dark';
    columns?: number;
}

const ProductDetailListSkeleton: React.FC<ProductDetailListSkeletonProps> = ({ 
    count = 8, 
    variant = 'light',
    columns 
}) => {
    const skeletonItems = useMemo(() => {
        return Array.from({ length: count }, (_, index) => (
            <ProductDetailSkeleton key={`skeleton-${index}`} variant={variant} />
        ));
    }, [count, variant]);

    const style = useMemo(() => {
        return columns ? { '--columns': columns } as React.CSSProperties : undefined;
    }, [columns]);

    return (
        <div 
            className={cx('skeleton-product-list')}
            style={style}
        >
            {skeletonItems}
        </div>
    );
};

export default React.memo(ProductDetailListSkeleton);

