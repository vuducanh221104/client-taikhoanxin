import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { KeyedMutator } from 'swr';
import { store } from '@/redux/store';
import { 
    logOutSuccess, 
    updateAccessToken, 
    updateTokens,
    setRefreshing,
    clearAuth 
} from '@/redux/authSlice';
import { refreshAccessToken } from '@/services/authService';
import { isTokenExpired } from './tokenUtils';

interface UserState {
    accessToken?: string;
    refreshToken?: string;
    user_name?: string;
    email?: string;
    [key: string]: any;
}

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
}> = [];

// Process queued requests after token refresh
const processQueue = (error: any = null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    
    failedQueue = [];
};

export interface APIResponseSWR<T> {
    data: T;
    error?: string | any;
    isLoading: boolean;
    mutate: KeyedMutator<any>;
}

axios.defaults.withCredentials = true;

const httpRequest = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:4000',
    timeout: 30000,
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================
httpRequest.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const state = store.getState();
        const currentUser = state.auth.login.currentUser as UserState | null;
        const accessToken = currentUser?.accessToken;
        const refreshToken = currentUser?.refreshToken;

        // If no access token, don't add Authorization header
        if (!accessToken) {
            return config;
        }

        // Check if access token is expired or about to expire
        if (isTokenExpired(accessToken, 60)) {
            // Token expired or will expire soon, try to refresh
            if (refreshToken && !isRefreshing) {
                isRefreshing = true;
                store.dispatch(setRefreshing(true));

                try {
                    const response = await refreshAccessToken(refreshToken);
                    
                    if (response.success && response.data.accessToken) {
                        // Update tokens in Redux
                        store.dispatch(updateTokens({
                            accessToken: response.data.accessToken,
                            refreshToken: response.data.refreshToken || refreshToken,
                        }));

                        // Update config with new token
                        config.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
                        
                        // Process queued requests
                        processQueue(null, response.data.accessToken);
                        isRefreshing = false;
                        store.dispatch(setRefreshing(false));
                        
                        return config;
                    } else {
                        // Refresh failed, logout
                        throw new Error('Failed to refresh token');
                    }
                } catch (error) {
                    // Refresh token expired or invalid, logout
                    processQueue(error, null);
                    isRefreshing = false;
                    store.dispatch(setRefreshing(false));
                    
                    // Clear auth and redirect to login
                    store.dispatch(clearAuth());
                    if (typeof window !== 'undefined') {
                        window.location.href = '/auth/login';
                    }
                    
                    return Promise.reject(error);
                }
            } else if (isRefreshing) {
                // Token refresh in progress, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    if (token && config.headers) {
                        config.headers['Authorization'] = `Bearer ${token}`;
                    }
                    return config;
                }).catch((err) => {
                    return Promise.reject(err);
                });
            } else {
                // No refresh token available. Only clear/redirect if user was authenticated.
                if (currentUser) {
                    store.dispatch(clearAuth());
                    if (typeof window !== 'undefined' && window.location.pathname !== '/auth/login') {
                        window.location.href = '/auth/login';
                    }
                }
                return Promise.reject(new Error('No refresh token available'));
            }
        }

        // Token is valid, add to request
        config.headers['Authorization'] = `Bearer ${accessToken}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================
httpRequest.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const state = store.getState();
            const currentUser = state.auth.login.currentUser as UserState | null;
            const refreshToken = currentUser?.refreshToken;

            // If no refresh token, logout immediately
            if (!refreshToken) {
                if (currentUser) {
                    store.dispatch(clearAuth());
                    if (typeof window !== 'undefined' && window.location.pathname !== '/auth/login') {
                        window.location.href = '/auth/login';
                    }
                }
                return Promise.reject(error);
            }

            // If already refreshing, queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token) => {
                            if (token && originalRequest.headers) {
                                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                            }
                            resolve(httpRequest(originalRequest));
                        },
                        reject: (err) => {
                            reject(err);
                        },
                    });
                });
            }

            // Start refresh process
            isRefreshing = true;
            store.dispatch(setRefreshing(true));

            try {
                const response = await refreshAccessToken(refreshToken);

                if (response.success && response.data.accessToken) {
                    // Update tokens in Redux
                    store.dispatch(updateTokens({
                        accessToken: response.data.accessToken,
                        refreshToken: response.data.refreshToken || refreshToken,
                    }));

                    // Update original request header
                    if (originalRequest.headers) {
                        originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
                    }

                    // Process queued requests
                    processQueue(null, response.data.accessToken);
                    isRefreshing = false;
                    store.dispatch(setRefreshing(false));

                    // Retry original request
                    return httpRequest(originalRequest);
                } else {
                    throw new Error('Failed to refresh token');
                }
            } catch (refreshError) {
                // Refresh failed, logout
                processQueue(refreshError, null);
                isRefreshing = false;
                store.dispatch(setRefreshing(false));

                // Clear auth and redirect to login
                store.dispatch(clearAuth());
                if (typeof window !== 'undefined') {
                    window.location.href = '/auth/login';
                }

                return Promise.reject(refreshError);
            }
        }

        // For other errors, just reject
        return Promise.reject(error);
    }
);

export const get = async <T>(path: string, options: AxiosRequestConfig = {}): Promise<T> => {
    const res = await httpRequest.get<T>(path, options);
    return res.data;
};

export const post = async <T>(
    path: string,
    data?: any,
    options: AxiosRequestConfig = {},
): Promise<AxiosResponse<T>> => {
    const res = await httpRequest.post<T>(path, data, options);
    return res;
};

export const patch = async <T>(
    path: string,
    data?: any,
    options: AxiosRequestConfig = {},
): Promise<AxiosResponse<T>> => {
    const res = await httpRequest.patch<T>(path, data, options);
    return res;
};

export const put = async <T>(
    path: string,
    data?: any,
    options: AxiosRequestConfig = {},
): Promise<AxiosResponse<T>> => {
    const res = await httpRequest.put<T>(path, data, options);
    return res;
};

export const del = async <T>(path: string, options: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> => {
    const res = await httpRequest.delete<T>(path, options);
    return res;
};

// Alias for backward compatibility
export const deleted = del;

// SWR
export const fetcher = <T>(url: string) => httpRequest.get<T>(url).then((response) => response.data);

export default httpRequest;

