'use client';
import { useSWRUser } from './swrConfig';
import { post } from '@/utils/httpRequest';

// ============================================
// TYPES
// ============================================
export interface Warranty {
    _id: string;
    userId: string;
    orderId: string;
    accountId: string;
    reason: string;
    status: 'pending' | 'processing' | 'resolved' | 'rejected';
    adminNote?: string;
    resolution?: string;
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string;
}

export interface WarrantyListResponse {
    success: boolean;
    data: Warranty[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface WarrantyResponse {
    success: boolean;
    data: Warranty;
}

export interface CreateWarrantyData {
    orderId: string;
    accountId: string;
    reason: string;
}

// ============================================
// GET HOOKS (SWR)
// ============================================

/**
 * Get current user warranties
 */
export const useMyWarranties = (params?: { 
    status?: string; 
    page?: number; 
    limit?: number;
}) => {
    const queryString = params
        ? '?' + new URLSearchParams(params as any).toString()
        : '';
    const key = `/api/v1/warranties/my-warranties${queryString}`;
    return useSWRUser<WarrantyListResponse>(key);
};

/**
 * Get warranty by ID
 */
export const useWarranty = (id: string) => {
    const key = id ? `/api/v1/warranties/${id}` : null;
    return useSWRUser<WarrantyResponse>(key);
};

// ============================================
// MUTATIONS (AXIOS)
// ============================================

/**
 * Create warranty request
 */
export const createWarranty = async (data: CreateWarrantyData): Promise<WarrantyResponse> => {
    const response = await post<WarrantyResponse>('/api/v1/warranties', data);
    return response.data;
};

