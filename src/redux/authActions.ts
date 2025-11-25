import { Dispatch } from '@reduxjs/toolkit';
import { logOutStart, logOutSuccess, logOutFailed } from './authSlice';
import { authLogout } from '@/services/authService';

/**
 * Logout user action
 */
export const logoutUser = async (dispatch: Dispatch) => {
    dispatch(logOutStart());
    try {
        await authLogout();
        dispatch(logOutSuccess());
        
        // Clear localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
        }
        
        // Redirect to home page
        if (typeof window !== 'undefined') {
            window.location.href = '/';
        }
    } catch (error) {
        dispatch(logOutFailed());
        console.error('Logout failed:', error);
    }
};
