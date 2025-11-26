'use client';
import { useSWRUser } from './swrConfig';
import { put, post, del } from '@/utils/httpRequest';
import type { Product, ProductListResponse } from '@/services/productService';

// ============================================
// TYPES
// ============================================
export interface UserProfile {
    _id: string;
    email: string;
    fullName: string;
    phone?: string;
    gender?: string;
    citizenIdentity?: string;
    avatar?: string;
    address?: {
        district: { value: string; text: string };
        province: { value: string; text: string };
        ward: { value: string; text: string };
        street?: string;
    };
    membershipTier: number;
    role: number;
    status: number;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateProfileData {
    fullName?: string;
    phone?: string;
    gender?: string;
    citizenIdentity?: string;
    address?: {
        district: { value: string; text: string };
        province: { value: string; text: string };
        ward: { value: string; text: string };
        street?: string;
    };
    avatar?: File | string;
}

export interface UserProfileResponse {
    success: boolean;
    data: UserProfile;
}

export type ViewedProductsResponse = ProductListResponse & {
    data: Product[];
};

// ============================================
// GET HOOKS (SWR)
// ============================================

/**
 * Get current user profile
 */
export const useProfile = () => {
    const key = '/api/v1/users/profile';
    return useSWRUser<UserProfileResponse>(key);
};

/**
 * Get viewed products
 */
export const useViewedProducts = (
    params?: { limit?: number; page?: number },
    options?: { enabled?: boolean }
) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const enabled = options?.enabled ?? true;
    const key = enabled ? `/api/v1/users/viewed-products${queryString}` : null;
    return useSWRUser<ViewedProductsResponse>(key);
};

// ============================================
// MUTATIONS (AXIOS)
// ============================================

/**
 * Update user profile
 */
export const updateProfile = async (data: UpdateProfileData): Promise<UserProfileResponse> => {
    const formData = new FormData();
    
    if (data.fullName !== undefined) formData.append('fullName', data.fullName);
    if (data.phone !== undefined) formData.append('phone', data.phone);
    if (data.gender !== undefined) formData.append('gender', data.gender);
    if (data.citizenIdentity !== undefined) formData.append('citizenIdentity', data.citizenIdentity);
    if (data.address) {
        formData.append('address', JSON.stringify(data.address));
    }
    if (data.avatar && data.avatar instanceof File) {
        formData.append('avatar', data.avatar);
    }

    const response = await put<UserProfileResponse>('/api/v1/users/profile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

/**
 * Add product to viewed products
 */
export const addViewedProduct = async (productId: string): Promise<{ success: boolean; message: string }> => {
    const response = await post<{ success: boolean; message: string }>('/api/v1/users/viewed-products', { productId });
    return response.data;
};

/**
 * Remove product from viewed products
 */
export const removeViewedProduct = async (productId: string): Promise<{ success: boolean; message: string }> => {
    const response = await del<{ success: boolean; message: string }>(`/api/v1/users/viewed-products/${productId}`);
    return response.data;
};

/**
 * Clear all viewed products
 */
export const clearViewedProducts = async (): Promise<{ success: boolean; message: string }> => {
    const response = await del<{ success: boolean; message: string }>('/api/v1/users/viewed-products');
    return response.data;
};
