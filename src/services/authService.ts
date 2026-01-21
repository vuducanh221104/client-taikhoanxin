'use client';
import { post } from '@/utils/httpRequest';

// ============================================
// TYPES
// ============================================
export interface RegisterData {
    email: string;
    password: string;
    fullName?: string;
    phone?: string;
    turnstileToken?: string;
}

export interface LoginData {
    email: string;
    password: string;
    turnstileToken?: string;
}

export interface VerifyEmailData {
    email: string;
    otp: string;
}

export interface ForgotPasswordData {
    email: string;
    turnstileToken?: string;
}

export interface ResetPasswordData {
    email: string;
    otp: string;
    newPassword: string;
    turnstileToken?: string;
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}

export interface GoogleLoginData {
    idToken: string;
}

export interface RefreshTokenData {
    refreshToken: string;
}

export interface AuthResponse {
    success: boolean;
    data: {
        user: any;
        accessToken: string;
        refreshToken?: string;
    };
    message?: string;
}

/**
 * Transform user data from backend format to frontend format
 * Maps fullName (camelCase) to full_name (snake_case) for consistency
 */
export const transformUserData = (user: any): any => {
    if (!user) return user;

    // Prefer backend provided name fields, otherwise derive from email
    const derivedName =
        user.user_name ||
        user.fullName ||
        user.full_name ||
        user.name ||
        (user.email ? user.email.split('@')[0] : '');
    const normalizedFullName = user.fullName || user.full_name || derivedName || '';

    return {
        ...user,
        // Normalize username for UI display across components
        user_name: derivedName,
        // Map fullName (backend) to full_name (frontend)
        full_name: normalizedFullName,
        // Keep fullName for backward compatibility
        fullName: normalizedFullName,
    };
};

// ============================================
// AUTHENTICATION SERVICES
// ============================================

/**
 * Register new user
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await post<AuthResponse>('/api/v1/auth/register', data);
    return response.data;
};

/**
 * Login user
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
    const response = await post<AuthResponse>('/api/v1/auth/login', data);
    return response.data;
};

/**
 * Login with Google ID token
 */
export const loginWithGoogle = async (data: GoogleLoginData): Promise<AuthResponse> => {
    const response = await post<AuthResponse>('/api/v1/auth/google', data);
    return response.data;
};

/**
 * Exchange Google OAuth token (redirect flow)
 */
export const exchangeGoogleAuth = async (token: string): Promise<AuthResponse> => {
    const response = await post<AuthResponse>('/api/v1/auth/google/exchange', { token });
    return response.data;
};

/**
 * Verify email with OTP
 */
export const verifyEmail = async (data: VerifyEmailData): Promise<{ success: boolean; message: string }> => {
    const response = await post<{ success: boolean; message: string }>('/api/v1/auth/verify-email', data);
    return response.data;
};

/**
 * Resend OTP
 */
export const resendOTP = async (email: string): Promise<{ success: boolean; message: string }> => {
    const response = await post<{ success: boolean; message: string }>('/api/v1/auth/resend-otp', { email });
    return response.data;
};

/**
 * Forgot password - Send OTP
 */
export const forgotPassword = async (data: ForgotPasswordData): Promise<{ success: boolean; message: string }> => {
    const response = await post<{ success: boolean; message: string }>('/api/v1/auth/forgot-password', data);
    return response.data;
};

/**
 * Reset password with OTP
 */
export const resetPassword = async (data: ResetPasswordData): Promise<{ success: boolean; message: string }> => {
    const response = await post<{ success: boolean; message: string }>('/api/v1/auth/reset-password', data);
    return response.data;
};

/**
 * Change password (authenticated)
 */
export const changePassword = async (data: ChangePasswordData): Promise<{ success: boolean; message: string }> => {
    const response = await post<{ success: boolean; message: string }>('/api/v1/auth/change-password', data);
    return response.data;
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (refreshToken: string): Promise<{ 
    success: boolean; 
    data: { 
        accessToken: string;
        refreshToken?: string;
    } 
}> => {
    const response = await post<{ 
        success: boolean; 
        data: { 
            accessToken: string;
            refreshToken?: string;
        } 
    }>('/api/v1/auth/refresh-token', { refreshToken });
    return response.data;
};

/**
 * Refresh access token (alias for backward compatibility)
 */
export const refreshToken = async (data: RefreshTokenData): Promise<{ success: boolean; data: { accessToken: string } }> => {
    const response = await post<{ success: boolean; data: { accessToken: string } }>('/api/v1/auth/refresh-token', data);
    return response.data;
};

/**
 * Logout user
 */
export const logout = async (): Promise<{ success: boolean; message: string }> => {
    const response = await post<{ success: boolean; message: string }>('/api/v1/auth/logout', {});
    return response.data;
};

// ============================================
// ALIAS EXPORTS FOR BACKWARD COMPATIBILITY
// ============================================

/**
 * Login user (alias for backward compatibility)
 * Supports both email and usernameOrEmail format
 */
export const authLogin = async (data: { usernameOrEmail?: string; email?: string; password: string; turnstileToken?: string }): Promise<AuthResponse> => {
    // Convert usernameOrEmail to email if needed
    const loginData: LoginData = {
        email: data.email || data.usernameOrEmail || '',
        password: data.password,
        turnstileToken: data.turnstileToken,
    };
    return login(loginData);
};

/**
 * Register user (alias for backward compatibility)
 */
export const authRegister = async (data: (RegisterData & { username?: string }) | { email: string; password: string; fullName?: string; phone?: string; turnstileToken?: string }): Promise<AuthResponse> => {
    // Remove username if present (backend only uses email)
    const registerData: RegisterData = {
        email: data.email,
        password: data.password,
        fullName: data.fullName || '',
        phone: data.phone,
        turnstileToken: data.turnstileToken,
    };
    return register(registerData);
};

/**
 * Logout user (alias for backward compatibility)
 */
export const authLogout = async (): Promise<{ success: boolean; message: string }> => {
    return logout();
};

/**
 * Logout and clear all auth data
 */
export const logoutAndClear = async (): Promise<void> => {
    // Dynamic import to avoid circular dependency
    const { store } = await import('@/redux/store');
    const { clearAuth } = await import('@/redux/authSlice');
    
    try {
        // Try to call logout API if we have refresh token
        const state = store.getState();
        const refreshToken = state.auth.login.currentUser?.refreshToken;
        
        if (refreshToken) {
            try {
                await logout();
            } catch (error) {
                // Ignore logout API errors, continue with clearing local state
                console.warn('Logout API call failed, clearing local state:', error);
            }
        }
    } catch (error) {
        // Ignore errors, continue with clearing
        console.warn('Error during logout:', error);
    } finally {
        // Always clear Redux state
        store.dispatch(clearAuth());
        
        // Redirect to login
        if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
        }
    }
};

/**
 * Verify OTP for forgot password
 */
export const verifyForgotPasswordOTP = async (data: { email: string; otp: string }): Promise<{ success: boolean; message: string }> => {
    const response = await post<{ success: boolean; message: string }>('/api/v1/auth/verify-forgot-password-otp', data);
    return response.data;
};

/**
 * Forgot password (alias for backward compatibility)
 */
export const authForgotPassword = async (data: { email: string; turnstileToken?: string } | string): Promise<{ success: boolean; message: string }> => {
    if (typeof data === 'string') {
        return forgotPassword({ email: data });
    }
    return forgotPassword({ email: data.email, turnstileToken: data.turnstileToken });
};

