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

    // Chuẩn bị params cho các hook sản phẩm (gọi hook không điều kiện để tuân thủ rules-of-hooks)
    const popularLimit = queryResult.params?.limit || 12;

    const bestSellingParams = {
        sortBy: 'sold' as const,
        sortOrder: (queryResult.params?.sortOrder || 'desc') as string,
        isActive: true,
        limit: queryResult.params?.limit || 12,
    };

    const featuredParams =
        queryResult.params?.categorySlug || queryResult.params?.categoryId
            ? {
                  categorySlug: queryResult.params?.categorySlug,
                  categoryId: queryResult.params?.categoryId,
                  limit: queryResult.params?.limit || 8,
              }
            : undefined;

    const defaultParams = {
        isActive: true,
        limit: queryResult.params?.limit || 12,
    };

    const popularProductsQuery = usePopularProducts(popularLimit);
    const bestSellingProductsQuery = useProducts(bestSellingParams);
    const featuredProductsQuery = useFeaturedProducts(featuredParams);
    const defaultProductsQuery = useProducts(defaultParams);

    // Map products to FeaturedProduct format
    const products = useMemo(() => {
        if (hasProvidedProducts) {
            return section.products!.map(mapProductToFeaturedProduct);
        }

        if (productsByIdsQuery?.data?.data && productsByIdsQuery.data.data.length > 0) {
            return productsByIdsQuery.data.data.map(mapProductToFeaturedProduct);
        }

        let activeProductsQuery: any = null;

        if (queryResult.usePopular) {
            activeProductsQuery = popularProductsQuery;
        } else if (queryResult.useBestSelling) {
            activeProductsQuery = bestSellingProductsQuery;
        } else if (queryResult.params?.categorySlug || queryResult.params?.categoryId) {
            activeProductsQuery = featuredProductsQuery;
        } else {
            activeProductsQuery = defaultProductsQuery;
        }

        if (!activeProductsQuery?.data?.data) return [];
        return activeProductsQuery.data.data.map(mapProductToFeaturedProduct);
    }, [
        hasProvidedProducts,
        section.products,
        productsByIdsQuery?.data,
        queryResult.usePopular,
        queryResult.useBestSelling,
        queryResult.params?.categorySlug,
        queryResult.params?.categoryId,
        popularProductsQuery?.data,
        bestSellingProductsQuery?.data,
        featuredProductsQuery?.data,
        defaultProductsQuery?.data,
    ]);

    let isLoading = false;
    if (!hasProvidedProducts) {
        if (productsByIdsQuery?.isLoading) {
            isLoading = true;
        } else if (queryResult.usePopular) {
            isLoading = !!popularProductsQuery?.isLoading;
        } else if (queryResult.useBestSelling) {
            isLoading = !!bestSellingProductsQuery?.isLoading;
        } else if (queryResult.params?.categorySlug || queryResult.params?.categoryId) {
            isLoading = !!featuredProductsQuery?.isLoading;
        } else {
            isLoading = !!defaultProductsQuery?.isLoading;
        }
    }

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

