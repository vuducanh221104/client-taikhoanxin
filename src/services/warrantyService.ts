'use client';
import { useSWRUser } from './swrConfig';
import { post, put, del } from '@/utils/httpRequest';

// ============================================
// TYPES
// ============================================
export interface Warranty {
    _id: string;
    userId: string | { _id: string; fullName: string; email: string; phone?: string };
    orderId: string | { _id: string; orderId: string; totalPrice: number; orderStatus: string; createdAt: string };
    accountId: string | { _id: string; email: string; username: string; status: string };
    reason: string;
    description?: string;
    attachments?: string[];
    status: 'pending' | 'processing' | 'resolved' | 'rejected' | 'closed';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    adminNote?: string;
    resolution?: string;
    resolvedAt?: string;
    resolvedBy?: string | { _id: string; fullName: string; email: string };
    assignedTo?: string | { _id: string; fullName: string; email: string };
    assignedAt?: string;
    slaDeadline?: string;
    slaStatus?: 'on_time' | 'at_risk' | 'overdue';
    firstResponseAt?: string;
    responseTime?: number;
    resolutionTime?: number;
    tags?: string[];
    category?: 'account_issue' | 'payment' | 'refund' | 'other';
    source?: 'web' | 'email' | 'phone' | 'chat';
    createBy?: string;
    updateBy?: string;
    deletedBy?: string;
    isDeleted?: boolean;
    deletedAt?: string;
    createdAt: string;
    updatedAt: string;
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
    description?: string;
    attachments?: string[];
    category?: 'account_issue' | 'payment' | 'refund' | 'other';
    tags?: string[];
    source?: 'web' | 'email' | 'phone' | 'chat';
}

export interface UpdateWarrantyData {
    reason?: string;
    description?: string;
    attachments?: string[];
    tags?: string[];
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

/**
 * Update warranty (User - only when pending)
 */
export const updateWarranty = async (id: string, data: UpdateWarrantyData): Promise<WarrantyResponse> => {
    const response = await put<WarrantyResponse>(`/api/v1/warranties/${id}`, data);
    return response.data;
};

/**
 * Cancel warranty (User - only when pending)
 */
export const cancelWarranty = async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await del<{ success: boolean; message: string }>(`/api/v1/warranties/${id}`);
    return response.data;
};

