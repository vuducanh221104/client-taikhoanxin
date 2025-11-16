// Auth Types
export interface CurrentUser {
    _id: string;
    user_name: string;
    email: string;
    full_name: string;
    phone_number: string;
    role: number;
    type: 'WEBSITE' | 'GOOGLE';
    is_verified: boolean;
    accessToken?: string;
    avatar?: string;
}

export interface AuthState {
    auth: {
        login: {
            currentUser: CurrentUser | null;
            isFetching: boolean;
            error: boolean;
        };
    };
}

// Form Values
export interface LoginFormValues {
    usernameOrEmail: string;
    password: string;
}

export interface RegisterFormValues {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

// API Response Types
export interface ApiResponse<T> {
    status: number;
    data: T;
    type?: string;
}

// Error Types
export interface ApiError {
    response?: {
        status: number;
        data?: {
            type?: string;
            message?: string;
        };
    };
}

