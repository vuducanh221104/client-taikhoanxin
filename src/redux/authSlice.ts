import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CurrentUser } from '@/types/client';

interface AuthState {
    login: {
        currentUser: CurrentUser | null;
        isFetching: boolean;
        error: boolean;
    };
    logout: {};
}

const initialState: AuthState = {
    login: {
        currentUser: null,
        isFetching: false,
        error: false,
    },
    logout: {},
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
} = authSlice.actions;

export default authSlice.reducer;

