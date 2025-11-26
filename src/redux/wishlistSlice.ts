import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { WishlistItem } from '@/services/wishlistService';

interface GuestWishlistState {
    items: WishlistItem[];
    maxItems: number;
}

const initialState: GuestWishlistState = {
    items: [],
    maxItems: 100,
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        addGuestWishlistItem: (state, action: PayloadAction<WishlistItem>) => {
            const item = action.payload;
            if (!item?.productId) {
                return;
            }

            const filtered = state.items.filter((existing) => existing.productId !== item.productId);
            state.items = [item, ...filtered].slice(0, state.maxItems);
        },
        removeGuestWishlistItem: (state, action: PayloadAction<string>) => {
            const productId = action.payload;
            state.items = state.items.filter((item) => item.productId !== productId);
        },
        clearGuestWishlist: (state) => {
            state.items = [];
        },
    },
});

export const {
    addGuestWishlistItem,
    removeGuestWishlistItem,
    clearGuestWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;


