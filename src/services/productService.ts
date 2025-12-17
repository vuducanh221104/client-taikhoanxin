'use client';

import React from 'react';
import type { SWRConfiguration } from 'swr';
import { useSWRUser } from './swrConfig';
import mockProductsData from '@/data/mockProducts.json';
import { FeaturedProduct } from '@/components/FeaturedProducts';

// ============================================
// TYPES
// ============================================
export interface Product {
    _id: string;
    name: string;
    slug: string;
    categoryId: string[];
    price: Array<{
        priceOriginal: number;
        currency: string;
        discount?: {
            priceDiscount: number;
            quantity: number;
            quantityLimit: number;
            quantitySold: number;
            startDate: string;
            endDate: string;
        };
    }>;
    image: string[];
    tag: string[];
    shortDescription: string;
    description: {
        title: string;
        note: string;
        description: string;
        info: string;
        platform: string;
        policy: string;
        other: string;
        tutorial: string;
    };
    isActive: boolean;
    badge: boolean;
    isPopular: boolean;
    isBestSelling?: boolean;
    isAvailable: boolean;
    stock: number;
    sold: number;
    rating: number;
    totalReviews: number;
    min: number;
    max: number;
    variant?: {
        title: string;
        list: Array<{
            _id?: string;
            slug: string;
            text: string;
            productId?: string;
        }>;
    } | Array<{
        title: string;
        list: Array<{
            _id?: string;
            slug: string;
            text: string;
            productId?: string;
        }>;
    }>; // Support both single object and array
    options?: Array<{
        _id?: string;
        type: 'text' | 'textarea' | 'email' | 'number' | 'tel' | 'url' | 'date' | 'select' | 'checkbox' | 'radio';
        title: string;
        constraints?: {
            required?: boolean;
            minLength?: number;
            maxLength?: number;
            pattern?: string;
            min?: number;
            max?: number;
        };
    }>;
    relatedProduct?: string[]; // Array of product IDs
    relatedSettings?: {
        mode?: 'auto' | 'manual' | 'mixed';
        maxItems?: number;
    };
    createdAt: string;
    updatedAt: string;
}

export interface ProductListResponse {
    success: boolean;
    data: Product[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface ProductDetailResponse {
    product: Product;
    reviews: any[];
    // relatedProducts removed - client will fetch separately via /products/by-ids
}

export interface ProductResponse {
    success: boolean;
    data: ProductDetailResponse;
}

// ============================================
// GET HOOKS (SWR)
// ============================================

/**
 * Get all products with filters
 * @param params - Query parameters
 * @returns SWR hook for products list
 */
export const useProducts = (params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    categorySlug?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    isActive?: boolean;
    isAvailable?: boolean;
    isPopular?: boolean;
    includeSubcategories?: boolean;
    sortBy?: string; // Field to sort by: "sold", "price", "createdAt", "rating"
    sortOrder?: string; // Sort order: "asc" or "desc"
}, config?: SWRConfiguration<ProductListResponse>) => {
    const queryParams: any = {};
    if (params?.page) queryParams.page = params.page.toString();
    if (params?.limit) queryParams.limit = params.limit.toString();
    if (params?.categoryId) queryParams.categoryId = params.categoryId;
    if (params?.categorySlug) queryParams.categorySlug = params.categorySlug;
    if (params?.minPrice !== undefined) queryParams.minPrice = params.minPrice.toString();
    if (params?.maxPrice !== undefined) queryParams.maxPrice = params.maxPrice.toString();
    if (params?.search) queryParams.search = params.search;
    if (params?.isActive !== undefined) queryParams.isActive = params.isActive.toString();
    if (params?.isAvailable !== undefined) queryParams.isAvailable = params.isAvailable.toString();
    if (params?.isPopular !== undefined) queryParams.isPopular = params.isPopular.toString();
    if (params?.includeSubcategories !== undefined) {
        queryParams.includeSubcategories = params.includeSubcategories.toString();
    }
    if (params?.sortBy) queryParams.sortBy = params.sortBy;
    if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;
    
    const queryString = Object.keys(queryParams).length > 0
        ? '?' + new URLSearchParams(queryParams).toString()
        : '';
    const key = `/api/v1/products${queryString}`;
    return useSWRUser<ProductListResponse>(key, config);
};

/**
 * Get product by slug
 * @param slug - Product slug
 * @returns SWR hook for single product
 */
export const useProduct = (slug: string, config?: SWRConfiguration<ProductResponse>) => {
    const key = slug ? `/api/v1/products/${slug}` : null;
    return useSWRUser<ProductResponse>(key, config);
};

/**
 * Get popular products
 * @param limit - Number of products to return (default: 10)
 * @returns SWR hook for popular products
 */
export const usePopularProducts = (limit: number = 10) => {
    const key = `/api/v1/products/popular?limit=${limit}`;
    return useSWRUser<ProductListResponse>(key);
};

/**
 * Get featured products for homepage
 * @param params - Query parameters: categorySlug or categoryId, and limit
 * @returns SWR hook for featured products
 */
export const useFeaturedProducts = (params?: {
    categorySlug?: string;
    categoryId?: string;
    limit?: number;
}) => {
    let key: string | null = null;

    if (params?.categorySlug || params?.categoryId) {
        const queryParams = new URLSearchParams();
        if (params.categorySlug) queryParams.append('categorySlug', params.categorySlug);
        if (params.categoryId) queryParams.append('categoryId', params.categoryId);
        if (params.limit) queryParams.append('limit', params.limit.toString());
        key = `/api/v1/products/featured-product?${queryParams.toString()}`;
    }

    return useSWRUser<ProductListResponse>(key);
};

/**
 * Get best selling products
 * @param params - Query parameters: page and limit
 * @returns SWR hook for best selling products
 */
export const useBestSellingProducts = (params?: {
    page?: number;
    limit?: number;
}) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const key = queryParams.toString() 
        ? `/api/v1/products/best-selling?${queryParams.toString()}`
        : '/api/v1/products/best-selling';
    return useSWRUser<ProductListResponse>(key);
};

/**
 * Get products by IDs (POST request)
 * Note: This uses useState + useEffect because SWR is for GET requests only
 * @param productIds - Array of product IDs
 * @returns Hook with data, error, isLoading
 */
export const useProductsByIds = (productIds?: string[]) => {
    const [data, setData] = React.useState<ProductListResponse | null>(null);
    const [error, setError] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!productIds || productIds.length === 0) {
            setData(null);
            setError(null);
            setIsLoading(false);
            return;
        }

        let cancelled = false;
        setIsLoading(true);
        setError(null);

        // Use dynamic import to avoid circular dependency
        import('@/utils/httpRequest').then(({ post }) => {
            if (cancelled) return;
            
            post<ProductListResponse>('/api/v1/products/by-ids', { ids: productIds })
                .then((response) => {
                    if (!cancelled) {
                        setData(response.data);
                        setIsLoading(false);
                    }
                })
                .catch((err) => {
                    if (!cancelled) {
                        setError(err);
                        setIsLoading(false);
                    }
                });
        });

        return () => {
            cancelled = true;
        };
    }, [productIds]);

    return { data, error, isLoading };
};

/**
 * Get related products by product slug (advanced related: manual + hành vi)
 * @param slug - Product slug
 * @param params - Optional params (limit)
 * @returns SWR hook for related products
 */
export const useRelatedProducts = (slug?: string, params?: { limit?: number }) => {
    let key: string | null = null;

    if (slug) {
        const queryParams = new URLSearchParams();
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
        key = `/api/v1/products/${slug}/related${queryString}`;
    }

    return useSWRUser<ProductListResponse>(key);
};

/**
 * Search products
 * @param query - Search query string
 * @param params - Additional query parameters
 * @returns SWR hook for search results
 */
export const useSearchProducts = (query: string, params?: { page?: number; limit?: number }) => {
    const normalizedQuery = query?.trim();

    let key: string | null = null;
    if (normalizedQuery) {
        const searchParams = new URLSearchParams();
        searchParams.append('q', normalizedQuery);
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        key = `/api/v1/products/search?${searchParams.toString()}`;
    }

    return useSWRUser<ProductListResponse>(key);
};

// ============================================
// MUTATIONS (AXIOS)
// ============================================

/**
 * Note: Product mutations (create, update, delete, togglePopular, updateAvailability)
 * are Admin-only and should be in admin services (separate project)
 * 
 * For user-facing features, only GET operations are available:
 * - useProducts() - Get all products with filters
 * - useProduct(slug) - Get product by slug
 * - usePopularProducts(limit) - Get popular products
 * - useSearchProducts(query) - Search products
 */

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Map Product from API to FeaturedProduct format
 * Handles price as array format from featured-product endpoint
 */
export const mapProductToFeaturedProduct = (product: Product): FeaturedProduct => {
    // Handle price as array (from featured-product endpoint) or object (from other endpoints)
    let priceItem: { priceOriginal: number; currency: string; discount?: any } | null = null;
    
    if (Array.isArray(product.price) && product.price.length > 0) {
        // Price is array (from featured-product endpoint)
        priceItem = product.price[0];
    } else if (product.price && typeof product.price === 'object' && 'priceOriginal' in product.price) {
        // Price is object (from other endpoints)
        priceItem = product.price as any;
    }

    const priceOriginal = priceItem?.priceOriginal || 0;
    const discount = priceItem?.discount;
    
    // Calculate discount price
    let finalPrice = priceOriginal;
    let oldPrice: number | undefined = undefined;
    let discountPercent: number | undefined = undefined;
    
    if (discount) {
        if (discount.priceDiscount) {
            // Use priceDiscount if available
            finalPrice = priceOriginal - discount.priceDiscount;
            oldPrice = priceOriginal;
            discountPercent = Math.round((discount.priceDiscount / priceOriginal) * 100);
        } else if (discount.quantity) {
            // Fallback to percentage discount
            finalPrice = Math.round(priceOriginal * (1 - discount.quantity / 100));
            oldPrice = priceOriginal;
            discountPercent = discount.quantity;
        }
    }

    const isAvailable =
        product.isAvailable !== undefined
            ? product.isAvailable
            : product.isActive !== false && (product.stock || 0) > 0;

    return {
        id: product._id,
        productName: product.name,
        price: finalPrice,
        oldPrice: oldPrice,
        discount: discountPercent,
        rating: product.rating || 0,
        reviewCount: product.totalReviews || 0,
        status: isAvailable ? 'in-stock' : 'out-of-stock',
        href: `/product/${product.slug}`,
        imageSrc: product.image?.[0] || '',
        imageAlt: product.name,
    };
};

/**
 * Parse query string from featuredProduct.query to fetch products
 * Query format: 
 * - ?categorySlug=lam-viec&limit=8
 * - ?categoryId=...&limit=8
 * - best-selling?page=1&limit=8
 * Returns parsed params for appropriate hook
 */
export const parseProductQuery = (query: string): { 
    params?: { 
        categorySlug?: string; 
        categoryId?: string; 
        limit?: number;
        page?: number;
        sortBy?: string;
        sortOrder?: string;
        [key: string]: any;
    }; 
    usePopular?: boolean; 
    useBestSelling?: boolean;
} => {
    if (!query || query.trim() === '') {
        return {};
    }

    // Remove leading ? if present
    let cleanQuery = query.startsWith('?') ? query.slice(1) : query;
    
    // Check if query starts with "best-selling"
    if (cleanQuery.startsWith('best-selling')) {
        // Remove "best-selling" prefix and leading ? or &
        cleanQuery = cleanQuery.replace(/^best-selling[?&]?/, '');
        const searchParams = new URLSearchParams(cleanQuery);
        const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 8;
        return { useBestSelling: true, params: { page, limit } };
    }
    
    // Check if it's a slug (no = sign)
    if (!cleanQuery.includes('=')) {
        // It's a slug, fetch by category slug with default limit
        return { params: { categorySlug: cleanQuery, limit: 8 } };
    }

    // Parse query string
    const params: any = {};
    const searchParams = new URLSearchParams(cleanQuery);
    
    // Check for isPopular first
    if (searchParams.get('isPopular') === 'true') {
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 12;
        return { usePopular: true, params: { limit } };
    }

    // Check for best selling (sortBy=sold)
    if (searchParams.get('sortBy') === 'sold') {
        const sortOrder = searchParams.get('sortOrder') || 'desc';
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 12;
        return { useBestSelling: true, params: { sortBy: 'sold', sortOrder, limit } };
    }

    // Extract categorySlug, categoryId, and limit
    const categorySlug = searchParams.get('categorySlug');
    const categoryId = searchParams.get('categoryId');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 8;

    if (categorySlug) {
        return { params: { categorySlug, limit } };
    } else if (categoryId) {
        return { params: { categoryId, limit } };
    }

    // Fallback: return all params
    const allParams: any = { limit };
    Array.from(searchParams.entries()).forEach(([key, value]) => {
        if (key === 'categoryId') {
            allParams.categoryId = value;
        } else if (key === 'categorySlug') {
            allParams.categorySlug = value;
        } else if (key !== 'limit' && key !== 'isPopular') {
            allParams[key] = value;
        }
    });

    return { params: allParams };
};

// ============================================
// ALIAS FUNCTIONS FOR BACKWARD COMPATIBILITY
// Temporary functions to support mock data until migration to API
// ============================================

export type ProductCategory = 'featured' | 'work' | 'ai' | 'bestSelling' | 'entertainment' | 'new' | 'office' | 'learning' | 'photo-video' | 'storage';

/**
 * Get products by category (Mock data - backward compatibility)
 * @deprecated Use useProducts() hook with categoryId filter instead
 */
export const getProductsByCategory = (category: ProductCategory): FeaturedProduct[] => {
    const data = mockProductsData as Record<string, FeaturedProduct[]>;
    return data[category] || [];
};

/**
 * Get all products from all categories (Mock data - backward compatibility)
 * @deprecated Use useProducts() hook instead
 */
export const getAllProducts = (): FeaturedProduct[] => {
    const categories: ProductCategory[] = ['featured', 'work', 'ai', 'bestSelling', 'entertainment', 'new', 'office', 'learning', 'photo-video', 'storage'];
    return categories.flatMap(category => getProductsByCategory(category));
};

/**
 * Search products by query (Mock data - backward compatibility)
 * @deprecated Use useSearchProducts() hook instead
 */
export const searchProducts = (query: string, limit: number = 5): FeaturedProduct[] => {
    if (!query || query.trim().length === 0) {
        return [];
    }
    
    const allProducts = getAllProducts();
    const lowerQuery = query.toLowerCase().trim();
    
    // Filter products by product name
    let results = allProducts
        .filter(product => 
            product.productName.toLowerCase().includes(lowerQuery)
        );
    
    // Apply limit if specified and > 0
    if (limit > 0) {
        results = results.slice(0, limit);
    }
    
    return results;
};

/**
 * Map category slug to ProductCategory (Mock data - backward compatibility)
 */
export const mapCategorySlugToCategory = (slug: string): ProductCategory | null => {
    const categoryMap: Record<string, ProductCategory> = {
        'office': 'office',
        'learning': 'learning',
        'ai-account': 'ai',
        'photo-video': 'photo-video',
        'storage': 'storage',
        'work': 'work',
        'entertainment': 'entertainment',
    };
    return categoryMap[slug] || null;
};

/**
 * Get a single product by ID across all categories (Mock data - backward compatibility)
 * @deprecated Use useProduct(slug) hook instead
 */
export const getProductById = (id: string): FeaturedProduct | undefined => {
    const allProducts = getAllProducts();
    return allProducts.find(product => product.id === id);
};

/**
 * Get featured products (Mock data - backward compatibility)
 * @deprecated Use usePopularProducts() hook instead
 */
export const getFeaturedProducts = (): FeaturedProduct[] => {
    return getProductsByCategory('featured');
};

/**
 * Get the original category of a product (Mock data - backward compatibility)
 */
export const getProductCategory = (productId: string): ProductCategory | null => {
    const categories: ProductCategory[] = ['featured', 'work', 'ai', 'bestSelling', 'entertainment', 'new', 'office', 'learning', 'photo-video', 'storage'];
    
    for (const category of categories) {
        const products = getProductsByCategory(category);
        if (products.some(p => p.id === productId)) {
            return category;
        }
    }
    
    return null;
};

/**
 * Detect product genre from product name (Mock data - backward compatibility)
 */
export const detectProductGenre = (productName: string): 'account' | 'code' | 'license' | null => {
    const lowerName = productName.toLowerCase();
    
    // Check for account keywords
    if (lowerName.includes('tài khoản') || lowerName.includes('account')) {
        return 'account';
    }
    
    // Check for code keywords
    if (lowerName.includes('code') || lowerName.includes('kích hoạt') || lowerName.includes('activation')) {
        return 'code';
    }
    
    // Check for license keywords
    if (lowerName.includes('license') || lowerName.includes('bản quyền') || lowerName.includes('key')) {
        return 'license';
    }
    
    return null;
};
