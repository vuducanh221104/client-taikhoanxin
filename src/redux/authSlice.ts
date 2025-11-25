import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CurrentUser } from '@/types/client';

interface AuthState {
    login: {
        currentUser: CurrentUser | null;
        isFetching: boolean;
        error: boolean;
        isRefreshing: boolean; // Track if currently refreshing token
    };
    logout: {};
    // Temporary storage for discount and referral codes
    discountCode: string | null;
    referralCode: string | null;
}

const initialState: AuthState = {
    login: {
        currentUser: null,
        isFetching: false,
        error: false,
        isRefreshing: false,
    },
    logout: {},
    discountCode: null,
    referralCode: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        changeUser: (state, action: PayloadAction<CurrentUser | null>) => {
            state.login.currentUser = action.payload;
        },
        loginStart: (state) => {
            state.login.isFetching = true;
        },
        loginSuccess: (state, action: PayloadAction<CurrentUser>) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
        },
        loginFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
        logOutStart: (state) => {
            state.login.isFetching = true;
        },
        logOutSuccess: (state) => {
            state.login.isFetching = false;
            state.login.currentUser = null;
            state.login.error = false;
        },
        logOutFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
        updateAccessToken: (state, action: PayloadAction<string>) => {
            if (state.login.currentUser) {
                state.login.currentUser.accessToken = action.payload;
            }
        },
        // Update both accessToken and refreshToken
        updateTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken?: string }>) => {
            if (state.login.currentUser) {
                state.login.currentUser.accessToken = action.payload.accessToken;
                if (action.payload.refreshToken) {
                    state.login.currentUser.refreshToken = action.payload.refreshToken;
                }
            }
        },
        // Set refreshing state
        setRefreshing: (state, action: PayloadAction<boolean>) => {
            state.login.isRefreshing = action.payload;
        },
        // Clear all auth data
        clearAuth: (state) => {
            state.login.currentUser = null;
            state.login.isFetching = false;
            state.login.error = false;
            state.login.isRefreshing = false;
            state.discountCode = null;
            state.referralCode = null;
        },
        // Set discount code
        setDiscountCode: (state, action: PayloadAction<string | null>) => {
            state.discountCode = action.payload;
        },
        // Set referral code
        setReferralCode: (state, action: PayloadAction<string | null>) => {
            state.referralCode = action.payload;
        },
        // Clear discount code
        clearDiscountCode: (state) => {
            state.discountCode = null;
        },
        // Clear referral code
        clearReferralCode: (state) => {
            state.referralCode = null;
        },
    },
});

export const {
    changeUser,
    loginStart,
    loginSuccess,
    loginFailed,
    logOutStart,
    logOutSuccess,
    logOutFailed,
    updateAccessToken,
    updateTokens,
    setRefreshing,
    clearAuth,
    setDiscountCode,
    setReferralCode,
    clearDiscountCode,
    clearReferralCode,
} = authSlice.actions;

export default authSlice.reducer;

