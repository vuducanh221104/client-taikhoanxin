'use client';

import React, { useMemo } from 'react';
import FeaturedProducts from '@/components/FeaturedProducts';
import { FeaturedProduct } from '@/components/FeaturedProducts';
import { useProducts, usePopularProducts, useFeaturedProducts, useProductsByIds, mapProductToFeaturedProduct, parseProductQuery } from '@/services/productService';
import { FeaturedProductSection as FeaturedProductSectionType } from '@/services/homePageService';

interface FeaturedProductSectionProps {
    section: FeaturedProductSectionType;
    onAddToCart?: (product: FeaturedProduct) => void;
}

const FeaturedProductSection: React.FC<FeaturedProductSectionProps> = ({ section, onAddToCart }) => {
    const queryResult = parseProductQuery(section.query || '');
    const hasProvidedProducts = Array.isArray(section.products) && section.products.length > 0;
    const hasProductIds = Array.isArray(section.productIds) && section.productIds.length > 0;
    const productsByIdsQuery = useProductsByIds(
        !hasProvidedProducts && hasProductIds
            ? section.productIds
            : undefined
    );

    // Fetch products based on query type
    let productsQuery: any = null;
    
    if (queryResult.usePopular) {
        const limit = queryResult.params?.limit || 12;
        productsQuery = usePopularProducts(limit);
    } else if (queryResult.useBestSelling) {
        productsQuery = useProducts({ 
            sortBy: 'sold', 
            sortOrder: queryResult.params?.sortOrder || 'desc', 
            isActive: true, 
            limit: queryResult.params?.limit || 12 
        });
    } else if (queryResult.params?.categorySlug) {
        // Use new featured-product endpoint with categorySlug and limit from query
        productsQuery = useFeaturedProducts({ 
            categorySlug: queryResult.params.categorySlug, 
            limit: queryResult.params.limit || 8 
        });
    } else if (queryResult.params?.categoryId) {
        // Use new featured-product endpoint with categoryId and limit from query
        productsQuery = useFeaturedProducts({ 
            categoryId: queryResult.params.categoryId, 
            limit: queryResult.params.limit || 8 
        });
    } else {
        // Default: fetch all active products
        productsQuery = useProducts({ 
            isActive: true, 
            limit: queryResult.params?.limit || 12 
        });
    }

    // Map products to FeaturedProduct format
    const products = useMemo(() => {
        if (hasProvidedProducts) {
            return section.products!.map(mapProductToFeaturedProduct);
        }

        if (productsByIdsQuery?.data?.data && productsByIdsQuery.data.data.length > 0) {
            return productsByIdsQuery.data.data.map(mapProductToFeaturedProduct);
        }

        if (!productsQuery?.data?.data) return [];
        return productsQuery.data.data.map(mapProductToFeaturedProduct);
    }, [hasProvidedProducts, section.products, productsByIdsQuery?.data, productsQuery?.data]);

    const isLoading = hasProvidedProducts
        ? false
        : productsByIdsQuery?.isLoading || productsQuery?.isLoading;

    return (
        <FeaturedProducts
            title={section.title || 'Sản phẩm nổi bật'}
            subtitle={section.description || ''}
            discoverButtonText="Khám phá"
            discoverButtonHref={section.linkViewAll || '/products'}
            products={products}
            isLoading={isLoading}
            onAddToCart={onAddToCart}
        />
    );
};

export default FeaturedProductSection;

