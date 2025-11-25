'use client';
import { useSWRUser } from './swrConfig';
import { post } from '@/utils/httpRequest';

// ============================================
// TYPES
// ============================================
export interface Payment {
    _id: string;
    orderId: string;
    userId: string;
    method: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    providerTransactionId?: string;
    paidAt?: string;
    refundedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface PaymentListResponse {
    success: boolean;
    data: Payment[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface PaymentResponse {
    success: boolean;
    data: Payment;
}

export interface CreatePaymentData {
    orderId: string;
    method: string;
    amount: number;
}

// ============================================
// GET HOOKS (SWR)
// ============================================

/**
 * Get current user payments
 */
export const useMyPayments = (params?: { 
    status?: string; 
    page?: number; 
    limit?: number;
}) => {
    const queryString = params
        ? '?' + new URLSearchParams(params as any).toString()
        : '';
    const key = `/api/v1/payments/my-payments${queryString}`;
    return useSWRUser<PaymentListResponse>(key);
};

/**
 * Get payment by ID
 */
export const usePayment = (id: string) => {
    const key = id ? `/api/v1/payments/${id}` : null;
    return useSWRUser<PaymentResponse>(key);
};

// ============================================
// MUTATIONS (AXIOS)
// ============================================

/**
 * Create payment
 */
export const createPayment = async (data: CreatePaymentData): Promise<PaymentResponse> => {
    const response = await post<PaymentResponse>('/api/v1/payments', data);
    return response.data;
};

