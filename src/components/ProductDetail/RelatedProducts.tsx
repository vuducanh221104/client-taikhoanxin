'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './RelatedProducts.module.scss';
import ProductCard from '@/components/ProductCard/ProductCard';
import ProductSectionLayout from '@/components/ProductSectionLayout/ProductSectionLayout';
import { useProductsByIds, useRelatedProducts, mapProductToFeaturedProduct } from '@/services/productService';
import { ProductListSkeleton } from '@/components/Skeleton';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/Icons';

const cx = classNames.bind(styles);

interface RelatedProductsProps {
    product?: {
        _id: string;
        relatedProduct?: string[] | Array<{ _id?: string; $oid?: string }>; // Support both string[] and object[] formats
        categoryId?: Array<{ _id: string; slug?: string; name?: string } | string>;
        slug?: string;
    };
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ product }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);

    /**
     * PRIORITY LOGIC:
     * 1. If product has relatedProduct field in database → Call POST /api/v1/products/by-ids
     * 2. If no relatedProduct → Call GET /api/v1/products/:slug/related?limit=8 (advanced related)
     */
    
    // Detect mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 999);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Normalize relatedProduct to string array (handle both string[] and object[] formats from database)
    const relatedProductIds = useMemo(() => {
        if (!product?.relatedProduct || product.relatedProduct.length === 0) {
            return [];
        }
        
        // Convert to string array (handle both string[] and object[] formats)
        return product.relatedProduct.map((item: string | { _id?: string; $oid?: string }) => {
            if (typeof item === 'string') {
                return item;
            } else if (item?._id) {
                return item._id;
            } else if (item?.$oid) {
                return item.$oid;
            }
            return String(item);
        }).filter((id: string) => id && id.trim() !== '');
    }, [product?.relatedProduct]);
    
    // Check if product has relatedProduct field with values (PRIORITY)
    const hasRelatedProductIds = relatedProductIds.length > 0;
    

    // Fetch products by IDs if relatedProduct exists (PRIORITY: relatedProduct from database)
    const productsByIdsQuery = useProductsByIds(
        hasRelatedProductIds ? relatedProductIds : undefined
    );

    // Fetch related products by slug (advanced behavior) if no relatedProduct
    const relatedProductsQuery = useRelatedProducts(
        !hasRelatedProductIds ? product?.slug : undefined,
        !hasRelatedProductIds ? { limit: 8 } : undefined
    );

    // Select the appropriate query result
    const productsQuery = hasRelatedProductIds ? productsByIdsQuery : relatedProductsQuery;

    // Map products to FeaturedProduct format
    const relatedProducts = useMemo(() => {
        if (!productsQuery?.data?.data) return [];
        return productsQuery.data.data
            .filter((p) => p._id !== product?._id) // Exclude current product
            .map(mapProductToFeaturedProduct)
            .slice(0, 8); // Limit to 8 products
    }, [productsQuery?.data, product?._id]);

    // Calculate items per view and slide step
    const itemsPerView = isMobile ? 2 : 4;
    const slideStep = itemsPerView;

    // Group products into slides (must be before early returns)
    const slides = useMemo(() => {
        const result = [];
        for (let i = 0; i < relatedProducts.length; i += slideStep) {
            result.push(relatedProducts.slice(i, i + slideStep));
        }
        return result;
    }, [relatedProducts, slideStep]);

    const maxIndex = Math.max(0, slides.length - 1);

    // Reset index when products change or screen size changes
    useEffect(() => {
        setCurrentIndex(0);
    }, [relatedProducts.length, isMobile]);

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    };

    const canGoPrev = currentIndex > 0;
    const canGoNext = currentIndex < maxIndex;

    // Don't render if no product data
    if (!product) {
        return null;
    }

    // Loading state
    if (productsQuery?.isLoading) {
        return (
            <ProductSectionLayout title="Sản phẩm liên quan">
                <ProductListSkeleton count={4} />
            </ProductSectionLayout>
        );
    }

    // Error or empty state
    if (productsQuery?.error || relatedProducts.length === 0) {
        return null; // Don't show section if no products
    }

    return (
        <ProductSectionLayout title="Sản phẩm liên quan">
            <div className={cx('related-slider-wrapper')}>
                <div 
                    ref={sliderRef}
                    className={cx('related-slider')}
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                >
                    {slides.map((slideProducts, slideIndex) => (
                        <div key={slideIndex} className={cx('slider-slide')}>
                            {slideProducts.map((product) => (
                                <div key={product.id} className={cx('slider-item')}>
                                    <ProductCard
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
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                
                {/* Navigation Buttons */}
                {slides.length > 1 && (
                    <div className={cx('slider-navigation')}>
                        <button
                            className={cx('nav-button', 'nav-prev', { disabled: !canGoPrev })}
                            onClick={handlePrev}
                            disabled={!canGoPrev}
                            aria-label="Sản phẩm trước"
                        >
                            <ChevronLeftIcon size={20} />
                        </button>
                        <button
                            className={cx('nav-button', 'nav-next', { disabled: !canGoNext })}
                            onClick={handleNext}
                            disabled={!canGoNext}
                            aria-label="Sản phẩm tiếp theo"
                        >
                            <ChevronRightIcon size={20} />
                        </button>
                    </div>
                )}
            </div>
        </ProductSectionLayout>
    );
};

export default RelatedProducts;
