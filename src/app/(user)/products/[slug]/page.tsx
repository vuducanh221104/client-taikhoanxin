'use client';

import React from 'react';
import ProductDetail from '@/components/ProductDetail/ProductDetail';
import { notFound } from 'next/navigation';

interface ProductDetailPageProps {
    params: {
        slug: string;
    };
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ params }) => {
    const { slug } = params;

    // Extract product ID from slug (assuming slug format: "product-name-id")
    // For now, we'll use the slug directly to find the product
    return <ProductDetail slug={slug} />;
};

export default ProductDetailPage;

