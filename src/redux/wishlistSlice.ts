import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addToWishlist as addToWishlistService, removeFromWishlist as removeFromWishlistService, removeWishlistItemById as removeWishlistItemByIdService, getWishlistByUserId, WishlistItem } from '@/services/wishlistService';

export interface WishlistState {
    items: WishlistItem[];
    userId: string | null;
}

const initialState: WishlistState = {
    items: [],
    userId: null,
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        initializeWishlist: (state, action: PayloadAction<string>) => {
            const userId = action.payload;
            state.userId = userId;
            // Load wishlist from localStorage
            if (typeof window !== 'undefined') {
                state.items = getWishlistByUserId(userId);
            }
        },
        addToWishlist: (state, action: PayloadAction<{ userId: string; product: Omit<WishlistItem, 'id' | 'userId' | 'addedAt'> }>) => {
            const { userId, product } = action.payload;
            
            // Check if product already exists
            const existingItem = state.items.find(item => item.productId === product.productId);
            if (existingItem) {
                return; // Product already in wishlist
            }

            // Add to wishlist service (localStorage)
            const newItem = addToWishlistService(userId, product);
            if (newItem) {
                state.items = [newItem, ...state.items];
            }
        },
        removeFromWishlist: (state, action: PayloadAction<{ userId: string; productId: string }>) => {
            const { userId, productId } = action.payload;
            
            // Remove from wishlist service (localStorage)
            removeFromWishlistService(userId, productId);
            state.items = state.items.filter(item => item.productId !== productId);
        },
        removeWishlistItemById: (state, action: PayloadAction<{ userId: string; itemId: string }>) => {
            const { userId, itemId } = action.payload;
            
            // Remove from wishlist service (localStorage)
            removeWishlistItemByIdService(userId, itemId);
            state.items = state.items.filter(item => item.id !== itemId);
        },
        clearWishlist: (state) => {
            state.items = [];
        },
        refreshWishlist: (state, action: PayloadAction<string>) => {
            const userId = action.payload;
            if (typeof window !== 'undefined') {
                state.items = getWishlistByUserId(userId);
            }
        },
    },
});

export const { 
    initializeWishlist, 
    addToWishlist, 
    removeFromWishlist, 
    removeWishlistItemById, 
    clearWishlist,
    refreshWishlist 
} = wishlistSlice.actions;

export default wishlistSlice.reducer;

