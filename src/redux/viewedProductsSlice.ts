import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@/services/productService';

interface ViewedProductsState {
    products: Product[];
    maxItems: number;
}

const initialState: ViewedProductsState = {
    products: [],
    maxItems: 50,
};

const viewedProductsSlice = createSlice({
    name: 'viewedProducts',
    initialState,
    reducers: {
        addGuestViewedProduct: (state, action: PayloadAction<Product>) => {
            const product = action.payload;
            if (!product?._id) {
                return;
            }

            const filtered = state.products.filter((item) => item._id !== product._id);
            state.products = [product, ...filtered].slice(0, state.maxItems);
        },
        clearGuestViewedProducts: (state) => {
            state.products = [];
        },
    },
});

export const { addGuestViewedProduct, clearGuestViewedProducts } = viewedProductsSlice.actions;
export default viewedProductsSlice.reducer;


