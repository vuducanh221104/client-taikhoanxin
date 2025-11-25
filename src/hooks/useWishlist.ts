import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
    addWishlistItem as addWishlistItemAPI,
    removeWishlistItem as removeWishlistItemAPI,
    clearWishlist as clearWishlistAPI,
    useWishlistItems,
    WishlistItem,
} from '@/services/wishlistService';

interface ToggleWishlistPayload {
    productId?: string;
    id?: string;
    productName?: string;
    price?: number;
    oldPrice?: number;
    discount?: number;
    rating?: number;
    reviewCount?: number;
    status?: 'in-stock' | 'out-of-stock';
    imageSrc?: string;
    imageAlt?: string;
    href?: string;
}

export const useWishlist = () => {
    const currentUser = useSelector((state: RootState) => state.auth.login.currentUser);
    const isLoggedIn = !!currentUser?._id;
    const { data, error, isLoading, mutate } = useWishlistItems(isLoggedIn);

    const wishlist: WishlistItem[] = isLoggedIn ? data?.data || [] : [];
    const wishlistCount = wishlist.length;

    const isProductInWishlist = (productId: string): boolean => {
        if (!productId) return false;
        return wishlist.some((item) => item.productId === productId);
    };

    const addToWishlist = async (productId: string): Promise<boolean> => {
        if (!isLoggedIn || !productId) {
            return false;
        }

        await addWishlistItemAPI(productId);
        await mutate();
        return true;
    };

    const removeFromWishlist = async (productId: string): Promise<boolean> => {
        if (!isLoggedIn || !productId) {
            return false;
        }

        await removeWishlistItemAPI(productId);
        await mutate();
        return true;
    };

    const toggleWishlist = async (product: ToggleWishlistPayload): Promise<boolean> => {
        if (!isLoggedIn) {
            return false;
        }

        const productId = product.productId || product.id;
        if (!productId) {
            return false;
        }

        const exists = isProductInWishlist(productId);

        if (exists) {
            await removeWishlistItemAPI(productId);
        } else {
            await addWishlistItemAPI(productId);
        }

        await mutate();
        return !exists;
    };

    const clearWishlist = async (): Promise<boolean> => {
        if (!isLoggedIn) {
            return false;
        }

        await clearWishlistAPI();
        await mutate();
        return true;
    };

    return {
        wishlist,
        wishlistCount,
        isProductInWishlist,
        addToWishlist,
        removeWishlistItem: removeFromWishlist,
        clearWishlist,
        toggleWishlist,
        isLoggedIn,
        isLoading,
        error,
        mutate,
    };
};

