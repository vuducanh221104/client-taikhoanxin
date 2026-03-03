'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames/bind';
import styles from '@/app/(user)/auth/login/page.module.scss';
import { authLogin, transformUserData, type AuthResponse } from '@/services/authService';
import { loginSuccess, loginFailed } from '@/redux/authSlice';
import { EyeIcon, EyeOffIcon } from '@/components/Icons';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/Button';
import TurnstileWidget from '@/components/Turnstile/TurnstileWidget';
import { RootState } from '@/redux/store';
import { clearCart as clearGuestCart } from '@/redux/cartSlice';
import { importGuestCart } from '@/services/cartService';
import { useSWRConfig } from 'swr';

const cx = classNames.bind(styles);

const extractSlugFromHref = (href?: string | null): string | undefined => {
    if (!href || typeof href !== 'string') return undefined;
    const trimmed = href.trim();
    if (!trimmed) return undefined;
    try {
        // Support absolute or relative URLs
        const url = trimmed.startsWith('http') ? new URL(trimmed) : new URL(trimmed, 'http://dummy');
        const segments = url.pathname.split('/').filter(Boolean);
        if (segments.length === 0) return undefined;
        const lastSegment = segments[segments.length - 1];
        return lastSegment || undefined;
    } catch {
        const match = trimmed.match(/\/product\/([^/?#]+)/i);
        if (match && match[1]) {
            return match[1];
        }
        return undefined;
    }
};

export default function LoginLayout() {
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const reduxGuestCart = useSelector((state: RootState) => state.cart);
    // Check both Redux cart and sessionStorage for guest cart
    const guestCart = React.useMemo(() => {
        if (reduxGuestCart.products.length > 0) {
            return reduxGuestCart;
        }
        // Try to get cart from sessionStorage if Redux is empty
        if (typeof window !== 'undefined') {
            const sessionCart = sessionStorage.getItem('guestCart');
            if (sessionCart) {
                try {
                    return JSON.parse(sessionCart);
                } catch (e) {
                    console.error('Error parsing guestCart from sessionStorage:', e);
                }
            }
        }
        return reduxGuestCart;
    }, [reduxGuestCart]) as typeof reduxGuestCart;
    const { mutate: globalMutate } = useSWRConfig();
    const { showSuccess, showError } = useToast();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        usernameOrEmail: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState({
        usernameOrEmail: '',
        password: '',
    });
    const [touched, setTouched] = useState({
        usernameOrEmail: false,
        password: false,
    });
    const [turnstileToken, setTurnstileToken] = useState('');
    const [turnstileError, setTurnstileError] = useState('');
    const [turnstileResetKey, setTurnstileResetKey] = useState(() => Date.now().toString());
    const [googleAuthLink, setGoogleAuthLink] = useState<string | null>(null);

    useEffect(() => {
        // Check if user just registered
        if (searchParams.get('registered') === 'true') {
            setSuccessMessage('Đăng ký thành công! Vui lòng đăng nhập.');
            // Clear the query param after showing message
            router.replace('/auth/login', { scroll: false });
        }
    }, [searchParams, router]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const redirectParam = searchParams.get('redirect');
        const callbackUrl = new URL('/auth/google/callback', window.location.origin);
        if (redirectParam) {
            callbackUrl.searchParams.set('redirect', redirectParam);
        }

        const serverBase = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:4000';
        const normalizedBase = serverBase.endsWith('/') ? serverBase.slice(0, -1) : serverBase;
        const apiUrl = `${normalizedBase}/api/v1/auth/google/redirect?returnUrl=${encodeURIComponent(callbackUrl.toString())}`;
        setGoogleAuthLink(apiUrl);
    }, [searchParams]);

    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'usernameOrEmail':
                if (!value.trim()) {
                    return 'Vui lòng nhập địa chỉ email';
                }
                // Basic email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value.trim())) {
                    return 'Vui lòng nhập địa chỉ email hợp lệ';
                }
                return '';
            case 'password':
                if (!value) {
                    return 'Vui lòng nhập mật khẩu';
                }
                if (value.length < 6) {
                    return 'Mật khẩu phải có ít nhất 6 ký tự';
                }
                return '';
            default:
                return '';
        }
    };

    const handleAuthSuccess = useCallback(
        async (response: AuthResponse) => {
            if (!response.success || !response.data) {
                throw new Error(response.message || 'Đăng nhập thất bại');
            }

            // Transform user data to ensure fullName is mapped to full_name
            const transformedUser = transformUserData(response.data.user);
            
            dispatch(
                loginSuccess({
                    ...transformedUser,
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken,
                })
            );

            if (guestCart.products.length > 0) {
                try {
                    await importGuestCart(
                        {
                            items: guestCart.products.map((item) => ({
                                productId: item.id,
                                slug: item.slug || extractSlugFromHref(item.href),
                                quantity: item.quantity,
                                options: item.options && item.options.length > 0 ? item.options : undefined,
                            })),
                        },
                        response.data.accessToken
                    );
                    dispatch(clearGuestCart());
                    // Clear sessionStorage cart after successful import
                    if (typeof window !== 'undefined') {
                        sessionStorage.removeItem('guestCart');
                    }
                    await globalMutate('/api/v1/cart');
                } catch (cartError) {
                    console.error('Failed to import guest cart:', cartError);
                    showError('Không thể đồng bộ giỏ hàng của bạn. Vui lòng thử lại sau khi đăng nhập.');
                }
            }

            showSuccess('Đăng nhập thành công!');
            const redirectUrl = searchParams.get('redirect');
            if (redirectUrl) {
                router.push(decodeURIComponent(redirectUrl));
            } else {
                router.push('/');
            }
        },
        [dispatch, guestCart.products, globalMutate, router, searchParams, showError, showSuccess]
    );

    const handleBlur = (fieldName: keyof typeof formData) => {
        setTouched((prev) => ({ ...prev, [fieldName]: true }));
        const error = validateField(fieldName, formData[fieldName]);
        setFieldErrors((prev) => ({ ...prev, [fieldName]: error }));
    };

    const handleChange = (fieldName: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [fieldName]: value }));
        // Clear error when user starts typing
        if (fieldErrors[fieldName]) {
            setFieldErrors((prev) => ({ ...prev, [fieldName]: '' }));
        }
        // Clear general error when user starts typing
        if (error) {
            setError('');
        }
    };

    const validateForm = (): boolean => {
        const errors = {
            usernameOrEmail: validateField('usernameOrEmail', formData.usernameOrEmail),
            password: validateField('password', formData.password),
        };
        setFieldErrors(errors);
        setTouched({
            usernameOrEmail: true,
            password: true,
        });
        return !errors.usernameOrEmail && !errors.password;
    };

    const resetTurnstile = () => {
        setTurnstileToken('');
        setTurnstileResetKey(Date.now().toString());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setTurnstileError('');

        // Validate form
        if (!validateForm()) {
            return;
        }

        if (!turnstileToken) {
            setTurnstileError('Vui lòng xác minh bạn không phải robot.');
            return;
        }

        setLoading(true);

        try {
            const response = await authLogin({
                usernameOrEmail: formData.usernameOrEmail,
                password: formData.password,
                turnstileToken,
            });
            await handleAuthSuccess(response);
        } catch (error) {
            const anyError = error as { response?: { data?: { message?: string } }; message?: string };
            const errorMessage =
                anyError?.response?.data?.message || anyError?.message || 'Đăng nhập thất bại. Vui lòng thử lại!';
            setError(errorMessage);
            showError(errorMessage);
            dispatch(loginFailed());
            console.error('Login failed:', error);
            resetTurnstile();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cx('auth-page')}>
            {/* Left Side - Form */}
            <div className={cx('auth-form-section')}>
                <div className={cx('form-container')}>
                    <div className={cx('auth-header')}>
                        <h1 className={cx('auth-title')}>Chào mừng bạn đến với Tài Khoản Xịn</h1>
                        <p className={cx('auth-subtitle')}>
                            Đăng nhập để trải nghiệm kho tài khoản với hơn 10,000+ tài khoản
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className={cx('auth-form')} noValidate>
                        {successMessage && (
                            <div className={cx('success-message')}>
                                <span className={cx('success-icon')}>✓</span>
                                <span>{successMessage}</span>
                            </div>
                        )}
                        {error && (
                            <div className={cx('error-message')}>
                                <span className={cx('error-icon')}>⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className={cx('form-group')}>
                            <label htmlFor="usernameOrEmail" className={cx('form-label')}>
                                Địa chỉ email
                            </label>
                            <input
                                id="usernameOrEmail"
                                type="text"
                                className={cx('form-input', {
                                    'input-error': touched.usernameOrEmail && fieldErrors.usernameOrEmail,
                                })}
                                placeholder="Nhập địa chỉ email"
                                value={formData.usernameOrEmail}
                                onChange={(e) => handleChange('usernameOrEmail', e.target.value)}
                                onBlur={() => handleBlur('usernameOrEmail')}
                                disabled={loading}
                            />
                            {touched.usernameOrEmail && fieldErrors.usernameOrEmail && (
                                <span className={cx('form-error-hint')}>{fieldErrors.usernameOrEmail}</span>
                            )}
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="password" className={cx('form-label')}>
                                Mật khẩu
                            </label>
                            <div className={cx('password-wrapper')}>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    className={cx('form-input', {
                                        'input-error': touched.password && fieldErrors.password,
                                    })}
                                    placeholder="Nhập mật khẩu"
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    onBlur={() => handleBlur('password')}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className={cx('password-toggle')}
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
                                </button>
                            </div>
                            {touched.password && fieldErrors.password && (
                                <span className={cx('form-error-hint')}>{fieldErrors.password}</span>
                            )}
                        </div>

                        <div className={cx('form-options')}>
                            <label className={cx('remember-me')}>
                                <input type="checkbox" />
                                <span>Ghi nhớ đăng nhập</span>
                            </label>
                            <Link href="/auth/forgot-password" className={cx('forgot-password')}>
                                Quên mật khẩu?
                            </Link>
                        </div>

                        <div className={cx('form-group', 'turnstile-group')}>
                            <TurnstileWidget
                                resetKey={turnstileResetKey}
                                onSuccess={(token) => {
                                    setTurnstileToken(token);
                                    setTurnstileError('');
                                }}
                                onExpire={() => {
                                    setTurnstileToken('');
                                    setTurnstileError('Phiên xác minh đã hết hạn. Vui lòng thử lại.');
                                }}
                                onError={(message) => {
                                    setTurnstileToken('');
                                    setTurnstileError(message || 'Không thể xác minh. Vui lòng thử lại.');
                                }}
                            />
                            {turnstileError && <span className={cx('form-error-hint')}>{turnstileError}</span>}
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="large"
                            fullWidth
                            isLoading={loading}
                            loadingText="Đang xử lý..."
                            className={cx('submit-button')}
                            disabled={loading}
                        >
                            Đăng nhập
                        </Button>
                    </form>

                    <div className={cx('auth-divider')}>
                        <span>Hoặc</span>
                    </div>

                    {/* Social Login */}
                    <div className={cx('social-login')}>
                        <a
                            href={googleAuthLink || '#'}
                            className={cx('social-button', 'google-button')}
                            onClick={(e) => {
                                if (!googleAuthLink) {
                                    e.preventDefault();
                                    showError('Chức năng đăng nhập Google chưa khả dụng.');
                                }
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            <span>Tiếp tục sử dụng dịch vụ bằng Google</span>
                        </a>
                    </div>

                    <div className={cx('auth-footer')}>
                        <span>Bạn chưa có tài khoản? </span>
                        <Link href="/auth/register" className={cx('auth-link')}>
                            Đăng ký ngay
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Banner */}
            <div className={cx('auth-banner-section')}>
                <div className={cx('banner-container')}>
                    <Image
                        src="/banners/login-banner.png"
                        alt="Tài Khoản Xịn Banner"
                        fill
                        className={cx('banner-image')}
                        priority
                        quality={90}
                    />
                </div>
            </div>
        </div>
    );
}

