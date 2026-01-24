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
    stock?: number;
    min?: number;
    max?: number;
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
         * Xóa mã giảm giá khi thêm sản phẩm mới vào cart
         * Validates max quantity constraint before adding
         */
        addToCart: (state, action: PayloadAction<Omit<CartProduct, 'quantity'>>) => {
            const product = action.payload;
            const existingProduct = state.products.find((p) => p.id === product.id);
            const min = product.min ?? 1;
            const max = product.max ?? 100;

            if (existingProduct) {
                // If product already exists, add 1 (not min, to avoid adding too many at once)
                // Check if adding 1 would exceed max quantity
                if (existingProduct.quantity + 1 > max) {
                    // Adding 1 would exceed max, don't add more
                    return;
                }
                existingProduct.quantity += 1;
                // Update max/min/stock if provided (in case product data was updated)
                if (product.max !== undefined) existingProduct.max = product.max;
                if (product.min !== undefined) existingProduct.min = product.min;
                if (product.stock !== undefined) existingProduct.stock = product.stock;
                
                // Update totals: add 1 item
                state.totalQuantity += 1;
                state.totalPrice += product.price;
                
                // Xóa mã giảm giá khi tăng số lượng sản phẩm đã có trong cart
                if (state.couponCode) {
                    state.couponCode = undefined;
                    state.couponDiscount = 0;
                }
            } else {
                // Thêm sản phẩm mới vào cart - xóa mã giảm giá
                // Use min quantity (or 1 if min not set) when adding new product
                state.couponCode = undefined;
                state.couponDiscount = 0;
                
                state.products.push({
                    ...product,
                    quantity: min,
                });
                
                // Update totals: add min quantity items
                state.totalQuantity += min;
                state.totalPrice += product.price * min;
            }
        },
        /**
         * Remove product from cart (only for non-logged-in users)
         * When user is logged in, use API removeFromCart instead
         * Xóa mã giảm giá khi xóa sản phẩm khỏi cart
         */
        removeFromCart: (state, action: PayloadAction<string>) => {
            const productId = action.payload;
            const product = state.products.find((p) => p.id === productId);

            if (product) {
                state.totalQuantity -= product.quantity;
                state.totalPrice -= product.price * product.quantity;
                state.products = state.products.filter((p) => p.id !== productId);
                
                // Xóa mã giảm giá khi xóa sản phẩm
                if (state.couponCode) {
                    state.couponCode = undefined;
                    state.couponDiscount = 0;
                }
            }
        },
        /**
         * Update product quantity (only for non-logged-in users)
         * When user is logged in, use API updateCartItem instead
         * Validates min/max quantity constraints
         * Xóa mã giảm giá khi tăng/giảm số lượng sản phẩm
         */
        updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
            const { id, quantity } = action.payload;
            const product = state.products.find((p) => p.id === id);

            if (product && quantity > 0) {
                const min = product.min ?? 1;
                const max = product.max ?? 100;
                
                // Clamp quantity to min/max bounds (<= max means valid, > max means clamp to max)
                const clampedQuantity = Math.min(Math.max(quantity, min), max);
                
                const oldQuantity = product.quantity;
                product.quantity = clampedQuantity;
                state.totalQuantity += clampedQuantity - oldQuantity;
                state.totalPrice += product.price * (clampedQuantity - oldQuantity);
                
                // Xóa mã giảm giá khi thay đổi số lượng sản phẩm
                if (state.couponCode) {
                    state.couponCode = undefined;
                    state.couponDiscount = 0;
                }
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
        /**
         * Update product price and recalculate totals
         * Used when validating guest cart and prices have changed
         */
        updateProductPrice: (state, action: PayloadAction<{ id: string; price: number; stock?: number }>) => {
            const { id, price, stock } = action.payload;
            const product = state.products.find((p) => p.id === id);

            if (product) {
                const oldPrice = product.price;
                product.price = price;
                if (stock !== undefined) {
                    product.stock = stock;
                }
                
                // Recalculate totalPrice based on price difference
                const priceDifference = price - oldPrice;
                state.totalPrice += priceDifference * product.quantity;
            }
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, applyCoupon, removeCoupon, updateProductPrice } = cartSlice.actions;
export default cartSlice.reducer;

