import { useSWRUser } from './swrConfig';
import { post, del } from '@/utils/httpRequest';

export interface WishlistItem {
    id: string;
    productId: string;
    slug: string;
    productName: string;
    price: number;
    oldPrice?: number | null;
    discount?: number | null;
    rating?: number;
    reviewCount?: number;
    status?: 'in-stock' | 'out-of-stock';
    imageSrc?: string;
    imageAlt?: string;
    href?: string;
    addedAt: string;
}

export interface WishlistResponse {
    success: boolean;
    message: string;
    data: WishlistItem[];
}

export const useWishlistItems = (shouldFetch: boolean) => {
    const key = shouldFetch ? '/api/v1/users/wishlist' : null;
    return useSWRUser<WishlistResponse>(key);
};

export const addWishlistItem = async (productId: string) => {
    const response = await post<WishlistResponse>('/api/v1/users/wishlist', { productId });
    return response.data;
};

export const removeWishlistItem = async (productId: string) => {
    const response = await del<WishlistResponse>(`/api/v1/users/wishlist/${productId}`);
    return response.data;
};

export const clearWishlist = async () => {
    const response = await del<WishlistResponse>('/api/v1/users/wishlist');
    return response.data;
};

