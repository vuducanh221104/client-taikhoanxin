'use client';
import { useSWRUser } from './swrConfig';

// ============================================
// TYPES
// ============================================
export interface ServiceAccount {
    _id: string;
    productId: string[];
    variant: string[];
    service: string[];
    cost: number;
    username: string;
    email: string;
    password: string;
    status: 'active' | 'inactive' | 'locked' | 'expired';
    planType: number;
    isVisible: string;
    maxSlot: number;
    usedSlot: number;
    assignedOrderId: string[];
    assignedUserId: string[];
    purchaseDate: string;
    expiredAt: string;
    warrantyUntil: string;
    lockedReason?: string;
    note?: string;
    autoRenew: boolean;
    isWorking: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ServiceAccountListResponse {
    success: boolean;
    data: ServiceAccount[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface ServiceAccountResponse {
    success: boolean;
    data: ServiceAccount;
}

// ============================================
// GET HOOKS (SWR)
// ============================================

/**
 * Get current user assigned service accounts
 */
export const useMyAccounts = (params?: { 
    status?: string; 
    page?: number; 
    limit?: number;
}) => {
    const queryString = params
        ? '?' + new URLSearchParams(params as any).toString()
        : '';
    const key = `/api/v1/service-accounts/my-accounts${queryString}`;
    return useSWRUser<ServiceAccountListResponse>(key);
};

