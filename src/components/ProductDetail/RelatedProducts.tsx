'use client';

import React, { useMemo } from 'react';
import classNames from 'classnames/bind';
import styles from './RelatedProducts.module.scss';
import ProductCard from '@/components/ProductCard/ProductCard';
import ProductSectionLayout from '@/components/ProductSectionLayout/ProductSectionLayout';
import { useProductsByIds, useRelatedProducts, mapProductToFeaturedProduct } from '@/services/productService';
import { ProductListSkeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import { PackageIcon } from '@/components/Icons';

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
    /**
     * PRIORITY LOGIC:
     * 1. If product has relatedProduct field in database → Call POST /api/v1/products/by-ids
     * 2. If no relatedProduct → Call GET /api/v1/products/:slug/related?limit=8 (advanced related)
     */
    
    // Normalize relatedProduct to string array (handle both string[] and object[] formats from database)
    const relatedProductIds = useMemo(() => {
        if (!product?.relatedProduct || product.relatedProduct.length === 0) {
            return [];
        }
        
        // Convert to string array (handle both string[] and object[] formats)
        return product.relatedProduct.map((item: any) => {
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
    
    // Get category slug or ID for fallback
    const categorySlug = useMemo(() => {
        if (!product?.categoryId || product.categoryId.length === 0) return undefined;
        const firstCategory = product.categoryId[0];
        return typeof firstCategory === 'object' && firstCategory?.slug 
            ? firstCategory.slug 
            : undefined;
    }, [product?.categoryId]);
    
    const categoryId = useMemo(() => {
        if (!product?.categoryId || product.categoryId.length === 0) return undefined;
        const firstCategory = product.categoryId[0];
        return typeof firstCategory === 'object' && firstCategory?._id 
            ? firstCategory._id 
            : typeof firstCategory === 'string' 
                ? firstCategory 
                : undefined;
    }, [product?.categoryId]);

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
