'use client';

import React from 'react';
import classNames from 'classnames/bind';
import styles from './RelatedProducts.module.scss';
import ProductCard from '@/components/ProductCard/ProductCard';
import ProductSectionLayout from '@/components/ProductSectionLayout/ProductSectionLayout';
import { getProductsByCategory } from '@/services/productService';

const cx = classNames.bind(styles);

const RelatedProducts: React.FC = () => {
    // Get related products (using featured products for now)
    const relatedProducts = getProductsByCategory('featured').slice(0, 8);

    return (
        <ProductSectionLayout title="Sản phẩm liên quan">
            <div className={cx('related-grid')}>
                {relatedProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        productName={product.productName}
                        price={product.price}
                        oldPrice={product.oldPrice}
                        discount={product.discount}
                        rating={product.rating}
                        reviewCount={product.reviewCount}
                        status={product.status}
                        href={product.href}
                        imageSrc={product.imageSrc}
                        imageAlt={product.imageAlt}
                    />
                ))}
            </div>
        </ProductSectionLayout>
    );
};

export default RelatedProducts;

