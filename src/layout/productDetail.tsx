'use client';

import React from 'react';
import ProductDetail from '@/components/ProductDetail/ProductDetail';

interface ProductDetailProps {
    slug: string;
}

export default function ProductDetailLayout({ slug }: ProductDetailProps) {
    return <ProductDetail slug={slug} />;
}

