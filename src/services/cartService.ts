'use client';
import { useSWRUser } from './swrConfig';
import { post, put, del } from '@/utils/httpRequest';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

// ============================================
// TYPES
// ============================================
export interface CartItem {
    productId: {
        _id: string;
        name: string;
        slug: string;
        image: string[];
        price: {
            priceOriginal: number;
            currency: string;
        };
        isAvailable: boolean;
    };
    quantity: number;
    // Flexible options array - stores all product options (tài khoản, mật khẩu, tên nhóm, etc.)
    // Format: [{title: string, value: any}, {title: string, value: any}, ...]
    options?: Array<{ title: string; value: any }>;
}

export interface Cart {
    _id: string;
    userId: string;
    items: CartItem[];
    discountCode?: string;
    discountAmount?: number;
    discountError?: string;
    referralCode?: string;
    totalDiscountBefore: number;
    totalDiscount: number;
    totalPrice: number;
    quantity: number;
    phoneNumber?: string;
    emailGiftForFriend?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CartResponse {
    success: boolean;
    data: Cart;
    message?: string;
}

export interface AddToCartData {
    productId: string;
    quantity?: number;
    // Flexible options array - stores all product options (tài khoản, mật khẩu, tên nhóm, etc.)
    // Format: [{title: string, value: any}, {title: string, value: any}, ...]
    // Example: [{title: "Tài khoản", value: "username123"}, {title: "Mật khẩu", value: "password456"}]
    options?: Array<{ title: string; value: any }>;
}

export interface ImportGuestCartPayload {
    items: Array<{
        productId: string;
        slug?: string;
        quantity: number;
        options?: Array<{ title: string; value: any }>;
    }>;
}

export interface UpdateCartItemData {
    quantity?: number;
    options?: Array<{ title: string; value: any }>;
}

export interface ApplyDiscountData {
    code: string;
}

// ============================================
// GET HOOKS (SWR)
// ============================================

/**
 * Get user cart
 */
export const useCart = () => {
    const currentUser = useSelector((state: RootState) => state.auth.login.currentUser);
    const key = currentUser?.accessToken ? '/api/v1/cart' : null;
    return useSWRUser<CartResponse>(key);
};

// ============================================
// MUTATIONS (AXIOS)
// ============================================

/**
 * Add item to cart
 */
export const addToCart = async (data: AddToCartData): Promise<CartResponse> => {
    const response = await post<CartResponse>('/api/v1/cart', data);
    return response.data;
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (productId: string, quantity: number): Promise<CartResponse> => {
    const response = await put<CartResponse>(`/api/v1/cart/${productId}`, { quantity });
    return response.data;
};

/**
 * Update cart item options
 */
export const updateCartItemOptions = async (productId: string, options: Array<{ title: string; value: any }>): Promise<CartResponse> => {
    const response = await put<CartResponse>(`/api/v1/cart/${productId}/options`, { options });
    return response.data;
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (productId: string): Promise<CartResponse> => {
    const response = await del<CartResponse>(`/api/v1/cart/${productId}`);
    return response.data;
};

/**
 * Clear cart
 */
export const clearCart = async (): Promise<{ success: boolean; message: string }> => {
    const response = await del<{ success: boolean; message: string }>('/api/v1/cart');
    return response.data;
};

/**
 * Apply discount code to cart
 */
export const applyDiscountCode = async (data: ApplyDiscountData): Promise<CartResponse> => {
    const response = await post<CartResponse>('/api/v1/cart/apply-discount', data);
    return response.data;
};

/**
 * Remove discount code from cart
 */
export const removeDiscountCode = async (): Promise<CartResponse> => {
    const response = await del<CartResponse>('/api/v1/cart/remove-discount');
    return response.data;
};

export const importGuestCart = async (data: ImportGuestCartPayload, accessToken?: string): Promise<CartResponse> => {
    const config = accessToken
        ? { headers: { Authorization: `Bearer ${accessToken}` } }
        : {};
    const response = await post<CartResponse>('/api/v1/cart/import-guest', data, config);
    return response.data;
};

/**
 * Checkout cart - Create order from cart
 */
export const checkout = async (data?: { phoneUserOrder?: string; emailUserOrder?: string; userNote?: string; emailGiftForFriend?: string; customerFullName?: string }): Promise<{ success: boolean; data: any; message: string }> => {
    const response = await post<{ success: boolean; data: any; message: string }>('/api/v1/cart/checkout', data || {});
    return response.data;
};

