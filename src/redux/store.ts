import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import viewedProductsReducer from './viewedProductsSlice';
import wishlistReducer from './wishlistSlice';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage,
    version: 1,
    whitelist: ['auth', 'cart', 'viewedProducts', 'wishlist'], // Persist auth + guest carts/wishlists
};

const rootReducer = combineReducers({
    auth: authReducer,
    cart: cartReducer,
    viewedProducts: viewedProductsReducer,
    wishlist: wishlistReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

