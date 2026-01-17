'use client';
import type { SWRConfiguration } from 'swr';
import { useSWRUser } from './swrConfig';

// ============================================
// TYPES
// ============================================
export interface Category {
    _id: string;
    name: string;
    slug: string;
    description: string;
    parentId?: string;
    image: string;
    banner: string;
    sortOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryListResponse {
    success: boolean;
    data: Category[];
}

export interface CategoryDetailResponse {
    category: Category;
    subcategories: Category[];
    productsCount: number;
}

export interface CategoryResponse {
    success: boolean;
    data: CategoryDetailResponse;
}

// ============================================
// GET HOOKS (SWR)
// ============================================

/**
 * Get all categories
 */
export const useCategories = (
    params?: { isActive?: boolean; parentId?: string; includeHidden?: boolean },
    config?: SWRConfiguration<CategoryListResponse>
) => {
    const queryParams: Record<string, string> = {};
    
    if (params) {
        if (params.isActive !== undefined) {
            queryParams.isActive = params.isActive.toString();
        }
        if (params.parentId) {
            queryParams.parentId = params.parentId;
        }
        if (params.includeHidden !== undefined) {
            queryParams.includeHidden = params.includeHidden.toString();
        }
    }
    
    const queryString = Object.keys(queryParams).length > 0
        ? '?' + new URLSearchParams(queryParams).toString()
        : '';
    const key = `/api/v1/categories${queryString}`;
    return useSWRUser<CategoryListResponse>(key, config);
};

/**
 * Get category by slug
 */
export const useCategory = (slug: string | null, config?: SWRConfiguration<CategoryResponse>) => {
    const key = slug ? `/api/v1/categories/${slug}` : null;
    return useSWRUser<CategoryResponse>(key, config);
};

