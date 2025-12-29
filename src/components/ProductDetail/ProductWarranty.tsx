'use client';

import React from 'react';
import classNames from 'classnames/bind';
import styles from './ProductWarranty.module.scss';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
                    <li>
                        <ReactMarkdown components={{ p: React.Fragment }} remarkPlugins={[remarkGfm]}>
                            {warranty.period.replace(/^•\s*|^[-*]\s+/, '')}
                        </ReactMarkdown>
                    </li>
                </ul>
            </div>
            <div className={cx('warranty-section')}>
                <h4 className={cx('warranty-subtitle')}>Cách thức bảo hành</h4>
                <ul className={cx('warranty-list')}>
                    {warranty.method.map((method, index) => {
                        // Only strip * or - if followed by space, to avoid breaking **bold** or *italic*
                        const cleanMethod = method.replace(/^•\s*|^[-*]\s+/, '');
                        return (
                            <li key={index}>
                                <ReactMarkdown components={{ p: React.Fragment }} remarkPlugins={[remarkGfm]}>
                                    {cleanMethod}
                                </ReactMarkdown>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default ProductWarranty;

