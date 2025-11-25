'use client';
import { post, del } from '@/utils/httpRequest';

// ============================================
// TYPES
// ============================================
export interface ValidateReferralCodeResponse {
  success: boolean;
  data: {
    isValid: boolean;
    referrerName?: string;
  };
  message: string;
}

export interface ApplyReferralCodeResponse {
  success: boolean;
  data: any; // Cart data
  message: string;
}

// ============================================
// MUTATIONS (AXIOS)
// ============================================

/**
 * Validate referral code
 */
export const validateReferralCode = async (code: string) => {
  const response = await post<ValidateReferralCodeResponse>(
    '/api/v1/referral-codes/validate',
    { code: code.toUpperCase() }
  );
  return response.data;
};

/**
 * Apply referral code to cart
 */
export const applyReferralCode = async (code: string) => {
  const response = await post<ApplyReferralCodeResponse>(
    '/api/v1/referral-codes/apply',
    { code: code.toUpperCase() }
  );
  return response.data;
};

/**
 * Remove referral code from cart
 */
export const removeReferralCode = async () => {
  const response = await del<ApplyReferralCodeResponse>(
    '/api/v1/referral-codes/remove'
  );
  return response.data;
};

