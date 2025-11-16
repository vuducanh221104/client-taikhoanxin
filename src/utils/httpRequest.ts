import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { KeyedMutator } from 'swr';
import { jwtDecode } from 'jwt-decode';
import { store } from '@/redux/store';
import { loginSuccess, logOutSuccess, updateAccessToken } from '@/redux/authSlice';

interface UserState {
    accessToken?: string;
    user_name?: string;
    email?: string;
    [key: string]: any;
}

export interface APIResponseSWR<T> {
    data: T;
    error?: string | any;
    isLoading: boolean;
    mutate: KeyedMutator<any>;
}

axios.defaults.withCredentials = true;

const httpRequest = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000',
});

httpRequest.interceptors.request.use(
    async (config: any) => {
        const state = store.getState();
        const currentUser = state.auth.login.currentUser as UserState | null;

        if (currentUser?.accessToken) {
            try {
                const decodedToken: any = jwtDecode(currentUser.accessToken);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp < currentTime) {
                    // Token expired - handle refresh if needed
                    console.log('Token expired');
                }

                config.headers['Authorization'] = `Bearer ${currentUser.accessToken}`;
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

httpRequest.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized
            if (typeof window !== 'undefined') {
                store.dispatch(logOutSuccess());
                window.location.href = '/auth/login';
            }
        }
        return Promise.reject(error);
    },
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

export const deleted = async <T>(path: string, options: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> => {
    const res = await httpRequest.delete<T>(path, options);
    return res;
};

// SWR
export const fetcher = <T>(url: string) => httpRequest.get<T>(url).then((response) => response.data);

export default httpRequest;

