'use client';

import React, { ReactNode } from 'react';
import classNames from 'classnames/bind';
import styles from './ProductSectionLayout.module.scss';

const cx = classNames.bind(styles);

export interface ProductSectionLayoutProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
    className?: string;
}

const ProductSectionLayout: React.FC<ProductSectionLayoutProps> = ({
    title,
    subtitle,
    children,
    className,
}) => {
    return (
        <section className={cx('product-section-layout', className)}>
            <div className={cx('container-wide')}>
                <div className={cx('section-header')}>
                    <h2 className={cx('section-title')}>{title}</h2>
                    {subtitle && <p className={cx('section-subtitle')}>{subtitle}</p>}
                </div>
                <div className={cx('section-content')}>{children}</div>
            </div>
        </section>
    );
};

export default ProductSectionLayout;

