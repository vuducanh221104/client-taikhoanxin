'use client';

import React from 'react';
import classNames from 'classnames/bind';
import styles from './ProductFeatures.module.scss';

const cx = classNames.bind(styles);

interface Feature {
    title: string;
    description: string;
}

interface ProductFeaturesProps {
    features: Feature[];
}

const ProductFeatures: React.FC<ProductFeaturesProps> = ({ features }) => {
    return (
        <div className={cx('product-features')}>
            <h3 className={cx('features-title')}>Tính năng nổi bật</h3>
            <ul className={cx('features-list')}>
                {features.map((feature, index) => (
                    <li key={index} className={cx('feature-item')}>
                        <strong className={cx('feature-title')}>{feature.title}:</strong>{' '}
                        <span className={cx('feature-description')}>{feature.description}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductFeatures;

