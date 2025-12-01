'use client';

import React, { useMemo } from 'react';
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
    const skeletonItems = useMemo(() => {
        return Array.from({ length: count }, (_, index) => (
            <ProductCardSkeleton key={`skeleton-${index}`} variant={variant} />
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

export default React.memo(ProductListSkeleton);

