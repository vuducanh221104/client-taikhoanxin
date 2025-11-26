import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartProduct {
    id: string;
    slug?: string;
    productName: string;
    price: number;
    oldPrice?: number;
    imageSrc?: string;
    imageAlt?: string;
    href?: string;
    quantity: number;
    options?: Array<{ title: string; value: any }>;
}

/**
 * Redux Cart State
 * 
 * NOTE: This Redux cart is ONLY used for NON-LOGGED-IN users.
 * When user is logged in, the app uses API cart (via useCart hook) instead.
 * 
 * The cart object used in components is mapped from API response when logged in,
 * or from Redux state when not logged in (for backward compatibility).
 */
export interface CartState {
    // Only used for non-logged-in users
    products: CartProduct[];
    totalPrice: number;
    totalQuantity: number;
    // Used for both logged-in and non-logged-in users (as fallback)
    couponCode?: string;
    couponDiscount: number;
}

const initialState: CartState = {
    products: [],
    totalPrice: 0,
    totalQuantity: 0,
    couponCode: undefined,
    couponDiscount: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        /**
         * Add product to cart (only for non-logged-in users)
         * When user is logged in, use API addToCart instead
         */
        addToCart: (state, action: PayloadAction<Omit<CartProduct, 'quantity'>>) => {
            const product = action.payload;
            const existingProduct = state.products.find((p) => p.id === product.id);

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                state.products.push({
                    ...product,
                    quantity: 1,
                });
            }

            state.totalQuantity += 1;
            state.totalPrice += product.price;
        },
        /**
         * Remove product from cart (only for non-logged-in users)
         * When user is logged in, use API removeFromCart instead
         */
        removeFromCart: (state, action: PayloadAction<string>) => {
            const productId = action.payload;
            const product = state.products.find((p) => p.id === productId);

            if (product) {
                state.totalQuantity -= product.quantity;
                state.totalPrice -= product.price * product.quantity;
                state.products = state.products.filter((p) => p.id !== productId);
            }
        },
        /**
         * Update product quantity (only for non-logged-in users)
         * When user is logged in, use API updateCartItem instead
         */
        updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
            const { id, quantity } = action.payload;
            const product = state.products.find((p) => p.id === id);

            if (product && quantity > 0) {
                const oldQuantity = product.quantity;
                product.quantity = quantity;
                state.totalQuantity += quantity - oldQuantity;
                state.totalPrice += product.price * (quantity - oldQuantity);
            }
        },
        /**
         * Clear entire cart
         * Used for both logged-in and non-logged-in users
         */
        clearCart: (state) => {
            state.products = [];
            state.totalPrice = 0;
            state.totalQuantity = 0;
            state.couponCode = undefined;
            state.couponDiscount = 0;
        },
        /**
         * Apply coupon code
         * Used as fallback when API cart doesn't have couponCode yet
         * (e.g., immediately after applying discount code, before API revalidation)
         */
        applyCoupon: (state, action: PayloadAction<{ code: string; discount: number }>) => {
            state.couponCode = action.payload.code;
            state.couponDiscount = action.payload.discount;
        },
        /**
         * Remove coupon code
         * Used as fallback when API cart doesn't have couponCode yet
         */
        removeCoupon: (state) => {
            state.couponCode = undefined;
            state.couponDiscount = 0;
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, applyCoupon, removeCoupon } = cartSlice.actions;
export default cartSlice.reducer;

