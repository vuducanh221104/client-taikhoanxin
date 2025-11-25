'use client';
import { useSWRUser } from './swrConfig';
import { post } from '@/utils/httpRequest';

// ============================================
// TYPES
// ============================================
export interface GenerateQRCodeData {
    amount: number;
    description: string;
    bankId?: string;
    accountNo?: string;
    accountName?: string;
    templateId?: string;
}

export interface QRCodeResponse {
    success: boolean;
    data: {
        qrCode: string; // Base64 image hoặc URL
        qrDataURL?: string;
        transactionId?: string;
    };
    message?: string;
}

export interface VietQRConfig {
    success: boolean;
    data: {
        defaultBankId?: string;
        defaultAccountNo?: string;
        defaultAccountName?: string;
        defaultTemplateId?: string;
        supportedBanks?: Array<{
            id: string;
            name: string;
        }>;
    };
}

// ============================================
// GET HOOKS (SWR)
// ============================================

/**
 * Get default VietQR configuration
 */
export const useVietQRConfig = () => {
    const key = '/api/v1/vietqr/config';
    return useSWRUser<VietQRConfig>(key);
};

// ============================================
// MUTATIONS (AXIOS)
// ============================================

/**
 * Generate VietQR code
 */
export const generateQRCode = async (data: GenerateQRCodeData): Promise<QRCodeResponse> => {
    const response = await post<QRCodeResponse>('/api/v1/vietqr/generate', data);
    return response.data;
};

