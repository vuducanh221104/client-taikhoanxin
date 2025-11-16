'use client';
import { authenticateUser, registerUser, getUserByUsernameOrEmail, isUsernameAvailable, isEmailAvailable } from './userService';
import { CurrentUser } from '@/types/client';

// Mock delay to simulate API call
const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Login user
 * @param user - Login credentials
 * @returns CurrentUser with accessToken
 */
export const authLogin = async (user: { usernameOrEmail: string; password: string }): Promise<CurrentUser> => {
    await mockDelay(500); // Simulate API delay

    const authenticatedUser = authenticateUser(user.usernameOrEmail, user.password);

    if (!authenticatedUser) {
        const error: any = new Error('Tên đăng nhập hoặc mật khẩu không đúng');
        error.response = {
            status: 401,
            data: {
                type: 'AUTHENTICATION_ERROR',
                message: 'Tên đăng nhập hoặc mật khẩu không đúng',
            },
        };
        throw error;
    }

    // Convert to CurrentUser format
    const currentUser: CurrentUser = {
        _id: authenticatedUser._id || authenticatedUser.id,
        user_name: authenticatedUser.user_name || authenticatedUser.username,
        email: authenticatedUser.email,
        full_name: authenticatedUser.full_name || '',
        phone_number: authenticatedUser.phone_number || '',
        role: authenticatedUser.role,
        type: authenticatedUser.type,
        is_verified: authenticatedUser.is_verified || false,
        accessToken: authenticatedUser.accessToken,
        avatar: authenticatedUser.avatar,
    };

    return currentUser;
};

/**
 * Logout user
 */
export const authLogout = async (): Promise<void> => {
    await mockDelay(200); // Simulate API delay
    // In real app, this would call API to invalidate token
    // For mock, we just return success
    return;
};

/**
 * Register new user
 * @param user - Registration data
 * @returns Created user data
 */
export const authRegister = async (user: {
    username: string;
    email: string;
    password: string;
}): Promise<{ message: string; user: CurrentUser }> => {
    await mockDelay(500); // Simulate API delay

    // Validate username
    if (!isUsernameAvailable(user.username)) {
        const error: any = new Error('Tên người dùng đã được sử dụng');
        error.response = {
            status: 400,
            data: {
                type: 'USERNAME_EXISTS',
                message: 'Tên người dùng đã được sử dụng',
            },
        };
        throw error;
    }

    // Validate email
    if (!isEmailAvailable(user.email)) {
        const error: any = new Error('Email đã được sử dụng');
        error.response = {
            status: 400,
            data: {
                type: 'EMAIL_EXISTS',
                message: 'Email đã được sử dụng',
            },
        };
        throw error;
    }

    // Register user
    const newUser = registerUser({
        username: user.username,
        email: user.email,
        password: user.password,
    });

    if (!newUser) {
        const error: any = new Error('Đăng ký thất bại. Vui lòng thử lại!');
        error.response = {
            status: 500,
            data: {
                type: 'REGISTRATION_ERROR',
                message: 'Đăng ký thất bại. Vui lòng thử lại!',
            },
        };
        throw error;
    }

    // Convert to CurrentUser format
    const currentUser: CurrentUser = {
        _id: newUser.id,
        user_name: newUser.username,
        email: newUser.email,
        full_name: newUser.full_name || '',
        phone_number: newUser.phone_number || '',
        role: newUser.role,
        type: newUser.type,
        is_verified: newUser.is_verified || false,
        avatar: newUser.avatar,
    };

    return {
        message: 'Đăng ký thành công!',
        user: currentUser,
    };
};

/**
 * Refresh access token
 * @returns New access token
 */
export const authRefreshToken = async (): Promise<{ accessToken: string }> => {
    await mockDelay(300); // Simulate API delay

    // Generate new mock token
    const accessToken = `mock_access_token_refresh_${Date.now()}`;

    return {
        accessToken,
    };
};

/**
 * Request password reset
 * @param usernameOrEmail - Username or email
 * @returns Success message
 */
export const authForgotPassword = async (usernameOrEmail: string): Promise<{ message: string }> => {
    await mockDelay(500); // Simulate API delay

    const user = getUserByUsernameOrEmail(usernameOrEmail);

    if (!user) {
        // Don't reveal if user exists for security
        // Still return success message
        return {
            message: 'Nếu email tồn tại, chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn.',
        };
    }

    // In real app, this would send email with reset link
    // For mock, we just return success
    return {
        message: 'Chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra email.',
    };
};

