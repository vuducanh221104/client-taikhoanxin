'use client';

import React from 'react';
import classNames from 'classnames/bind';
import styles from './ProductWarranty.module.scss';

const cx = classNames.bind(styles);

interface Warranty {
    period: string;
    method: string[];
}

interface ProductWarrantyProps {
    warranty: Warranty;
}

const ProductWarranty: React.FC<ProductWarrantyProps> = ({ warranty }) => {
    return (
        <div className={cx('product-warranty')}>
            <h3 className={cx('warranty-title')}>Chính sách bảo hành</h3>
            <div className={cx('warranty-section')}>
                <h4 className={cx('warranty-subtitle')}>Thời gian bảo hành</h4>
                <ul className={cx('warranty-list')}>
                    <li>{warranty.period}</li>
                </ul>
            </div>
            <div className={cx('warranty-section')}>
                <h4 className={cx('warranty-subtitle')}>Cách thức bảo hành</h4>
                <ul className={cx('warranty-list')}>
                    {warranty.method.map((method, index) => (
                        <li key={index}>{method}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProductWarranty;

