'use client';
import { useSWRUser } from './swrConfig';
import { post } from '@/utils/httpRequest';

// ============================================
// TYPES
// ============================================
export interface Wallet {
    _id: string;
    userId: string;
    balance: number;
    totalSpent: number;
    totalDeposit: number;
    createdAt: string;
    updatedAt: string;
}

export interface WalletTransaction {
    _id: string;
    walletId: string;
    userId: string;
    type: 'deposit' | 'withdraw' | 'payment' | 'refund' | 'adjustment';
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    description?: string;
    relatedOrderId?: string;
    relatedPaymentId?: string;
    createdAt: string;
}

export interface WalletResponse {
    success: boolean;
    data: Wallet;
}

export interface WalletTransactionsResponse {
    success: boolean;
    data: WalletTransaction[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface DepositData {
    amount: number;
    method: string;
}

export interface WithdrawData {
    amount: number;
    description?: string;
}

// ============================================
// GET HOOKS (SWR)
// ============================================

/**
 * Get current user wallet
 */
export const useMyWallet = () => {
    const key = '/api/v1/wallets/my-wallet';
    return useSWRUser<WalletResponse>(key);
};

/**
 * Get wallet transactions
 */
export const useWalletTransactions = (params?: { 
    type?: string; 
    page?: number; 
    limit?: number;
}) => {
    const queryString = params
        ? '?' + new URLSearchParams(params as any).toString()
        : '';
    const key = `/api/v1/wallets/transactions${queryString}`;
    return useSWRUser<WalletTransactionsResponse>(key);
};

// ============================================
// MUTATIONS (AXIOS)
// ============================================

/**
 * Deposit to wallet
 */
export const depositToWallet = async (data: DepositData): Promise<{ success: boolean; data: any; message: string }> => {
    const response = await post<{ success: boolean; data: any; message: string }>('/api/v1/wallets/deposit', data);
    return response.data;
};

/**
 * Withdraw from wallet
 */
export const withdrawFromWallet = async (data: WithdrawData): Promise<{ success: boolean; data: any; message: string }> => {
    const response = await post<{ success: boolean; data: any; message: string }>('/api/v1/wallets/withdraw', data);
    return response.data;
};

