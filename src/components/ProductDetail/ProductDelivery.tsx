'use client';

import React from 'react';
import classNames from 'classnames/bind';
import styles from './ProductDelivery.module.scss';

const cx = classNames.bind(styles);

interface ProductDeliveryProps {
    steps: string[];
}

const ProductDelivery: React.FC<ProductDeliveryProps> = ({ steps }) => {
    return (
        <div className={cx('product-delivery')}>
            <h3 className={cx('delivery-title')}>Quy trình nhận hàng</h3>
            <ol className={cx('delivery-steps')}>
                {steps.map((step, index) => {
                    if (index === steps.length - 1) {
                        return (
                            <li key={index} className={cx('delivery-step')}>
                                <a href="#" className={cx('delivery-link')}>
                                    {step}
                                </a>
                            </li>
                        );
                    }
                    return (
                        <li key={index} className={cx('delivery-step')}>
                            {step}
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};

export default ProductDelivery;

