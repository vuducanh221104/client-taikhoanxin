import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartProduct {
    id: string;
    productName: string;
    price: number;
    oldPrice?: number;
    imageSrc?: string;
    imageAlt?: string;
    href?: string;
    quantity: number;
}

export interface CartState {
    products: CartProduct[];
    totalPrice: number;
    totalQuantity: number;
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
        removeFromCart: (state, action: PayloadAction<string>) => {
            const productId = action.payload;
            const product = state.products.find((p) => p.id === productId);

            if (product) {
                state.totalQuantity -= product.quantity;
                state.totalPrice -= product.price * product.quantity;
                state.products = state.products.filter((p) => p.id !== productId);
            }
        },
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
        clearCart: (state) => {
            state.products = [];
            state.totalPrice = 0;
            state.totalQuantity = 0;
            state.couponCode = undefined;
            state.couponDiscount = 0;
        },
        applyCoupon: (state, action: PayloadAction<{ code: string; discount: number }>) => {
            state.couponCode = action.payload.code;
            state.couponDiscount = action.payload.discount;
        },
        removeCoupon: (state) => {
            state.couponCode = undefined;
            state.couponDiscount = 0;
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, applyCoupon, removeCoupon } = cartSlice.actions;
export default cartSlice.reducer;

