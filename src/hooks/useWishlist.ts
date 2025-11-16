import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { initializeWishlist, addToWishlist, removeFromWishlist, refreshWishlist } from '@/redux/wishlistSlice';
import { useEffect } from 'react';

export const useWishlist = () => {
    const dispatch = useDispatch<AppDispatch>();
    const wishlist = useSelector((state: RootState) => state.wishlist);
    const currentUser = useSelector((state: RootState) => state.auth.login.currentUser);

    // Initialize wishlist when user logs in
    useEffect(() => {
        if (currentUser?._id && !wishlist.userId) {
            dispatch(initializeWishlist(currentUser._id));
        }
    }, [currentUser?._id, wishlist.userId, dispatch]);

    const handleAddToWishlist = (product: {
        productId: string;
        productName: string;
        price: number;
        oldPrice?: number;
        discount?: number;
        rating?: number;
        reviewCount?: number;
        status?: 'in-stock' | 'out-of-stock';
        imageSrc?: string;
        imageAlt?: string;
        href?: string;
    }) => {
        if (!currentUser?._id) {
            // Redirect to login if not logged in
            return false;
        }

        dispatch(addToWishlist({
            userId: currentUser._id,
            product,
        }));
        return true;
    };

    const handleRemoveFromWishlist = (productId: string) => {
        if (!currentUser?._id) {
            return false;
        }

        dispatch(removeFromWishlist({
            userId: currentUser._id,
            productId,
        }));
        return true;
    };

    const toggleWishlist = (product: {
        productId: string;
        productName: string;
        price: number;
        oldPrice?: number;
        discount?: number;
        rating?: number;
        reviewCount?: number;
        status?: 'in-stock' | 'out-of-stock';
        imageSrc?: string;
        imageAlt?: string;
        href?: string;
    }) => {
        const isInWishlist = wishlist.items.some(item => item.productId === product.productId);
        
        if (isInWishlist) {
            handleRemoveFromWishlist(product.productId);
            return false;
        } else {
            handleAddToWishlist(product);
            return true;
        }
    };

    const isProductInWishlist = (productId: string): boolean => {
        return wishlist.items.some(item => item.productId === productId);
    };

    return {
        wishlist: wishlist.items,
        wishlistCount: wishlist.items.length,
        isProductInWishlist,
        handleAddToWishlist,
        handleRemoveFromWishlist,
        toggleWishlist,
        isLoggedIn: !!currentUser?._id,
    };
};

