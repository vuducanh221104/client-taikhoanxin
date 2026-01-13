'use client';
import { useSWRUser } from './swrConfig';
import { post } from '@/utils/httpRequest';

// ============================================
// TYPES
// ============================================
export interface DiscountCode {
    _id: string;
    code: string;
    title: string;
    description: string;
    type: 'percentage' | 'fixed';
    discount: {
        type: string;
        value: number;
        maxDiscountValue?: number;
    };
    condition: {
        productId?: string[];
        categoryId?: string[];
        userId?: string[];
        userTier?: number[];
        minOrderValue?: number;
        maxOrderValue?: number;
        firstTimeUserOnly?: boolean;
    };
    usage: {
        usageLimit: number;
        usedCount: number;
    };
    isActive: boolean;
    validFrom: string;
    validUntil: string;
    createdAt: string;
    updatedAt: string;
}

export interface DiscountCodeListResponse {
    success: boolean;
    data: DiscountCode[];
}

export interface DiscountCodeResponse {
    success: boolean;
    data: DiscountCode;
}

export interface ValidateDiscountCodeData {
    code: string;
    orderValue?: number;
    productIds?: string[];
}

export interface ValidateDiscountCodeResponse {
    success: boolean;
    message?: string;
    data: {
        discountAmount: number;
        code: string;
    };
}

// ============================================
// GET HOOKS (SWR)
// ============================================

/**
 * Get public available discount codes
 */
export const usePublicDiscountCodes = () => {
    const key = '/api/v1/discount-codes/public';
    return useSWRUser<DiscountCodeListResponse>(key);
};

// ============================================
// MUTATIONS (AXIOS)
// ============================================

/**
 * Validate discount code
 */
export const validateDiscountCode = async (data: ValidateDiscountCodeData): Promise<ValidateDiscountCodeResponse> => {
    const response = await post<ValidateDiscountCodeResponse>('/api/v1/discount-codes/validate', data);
    return response.data;
};

