import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import {
    addWishlistItem as addWishlistItemAPI,
    removeWishlistItem as removeWishlistItemAPI,
    clearWishlist as clearWishlistAPI,
    useWishlistItems,
    WishlistItem,
} from '@/services/wishlistService';
import {
    addGuestWishlistItem,
    removeGuestWishlistItem,
    clearGuestWishlist,
} from '@/redux/wishlistSlice';

interface ToggleWishlistPayload {
    productId?: string;
    id?: string;
    slug?: string;
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
    const dispatch = useDispatch<AppDispatch>();
    const currentUser = useSelector((state: RootState) => state.auth.login.currentUser);
    const guestWishlist = useSelector((state: RootState) => state.wishlist.items);
    const isLoggedIn = !!currentUser?._id;
    const { data, error, isLoading, mutate } = useWishlistItems(isLoggedIn);

    const wishlist: WishlistItem[] = isLoggedIn ? data?.data || [] : guestWishlist;
    const wishlistCount = wishlist.length;

    const isProductInWishlist = (productId: string): boolean => {
        if (!productId) return false;
        return wishlist.some((item) => item.productId === productId);
    };

    const addToWishlist = async (product: ToggleWishlistPayload): Promise<boolean> => {
        const productId = product.productId || product.id;
        if (!productId) {
            return false;
        }

        if (!isLoggedIn) {
            const guestItem: WishlistItem = {
                id: productId,
                productId,
                slug: product.slug || productId,
                productName: product.productName || 'Sản phẩm',
                price: product.price || 0,
                oldPrice: product.oldPrice,
                discount: product.discount,
                rating: product.rating,
                reviewCount: product.reviewCount,
                status: product.status,
                imageSrc: product.imageSrc,
                imageAlt: product.imageAlt,
                href: product.href || `/product/${product.slug || productId}`,
                addedAt: new Date().toISOString(),
            };
            dispatch(addGuestWishlistItem(guestItem));
            return true;
        }

        await addWishlistItemAPI(productId);
        await mutate();
        return true;
    };

    const removeFromWishlist = async (productId: string): Promise<boolean> => {
        if (!productId) {
            return false;
        }

        if (!isLoggedIn) {
            dispatch(removeGuestWishlistItem(productId));
            return true;
        }

        await removeWishlistItemAPI(productId);
        await mutate();
        return true;
    };

    const toggleWishlist = async (product: ToggleWishlistPayload): Promise<boolean> => {
        const productId = product.productId || product.id;
        if (!productId) {
            return false;
        }

        const exists = isProductInWishlist(productId);

        if (!isLoggedIn) {
            if (exists) {
                dispatch(removeGuestWishlistItem(productId));
            } else {
                await addToWishlist(product);
            }
            return !exists;
        }

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
            dispatch(clearGuestWishlist());
            return true;
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

