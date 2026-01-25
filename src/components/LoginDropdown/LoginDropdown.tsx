'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import classNames from 'classnames/bind';
import styles from './LoginDropdown.module.scss';
import { EyeIcon, EyeOffIcon } from '@/components/Icons';
import { authLogin } from '@/services/authService';
import { loginSuccess, loginFailed } from '@/redux/authSlice';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/Button';
import TurnstileWidget from '@/components/Turnstile/TurnstileWidget';

const cx = classNames.bind(styles);

interface LoginDropdownProps {
    isOpen?: boolean;
    setIsOpen?: (open: boolean) => void;
    onOverlayChange?: (visible: boolean) => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

const LoginDropdown: React.FC<LoginDropdownProps> = ({ 
    isOpen: controlledIsOpen, 
    setIsOpen: controlledSetIsOpen,
    onOverlayChange,
    onMouseEnter: onMouseEnterProp,
    onMouseLeave: onMouseLeaveProp
}) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { showSuccess, showError } = useToast();
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
    const setIsOpen = controlledSetIsOpen || setInternalIsOpen;
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [fieldErrors, setFieldErrors] = useState({
        username: '',
        password: '',
    });
    const [touched, setTouched] = useState({
        username: false,
        password: false,
    });
    const [turnstileToken, setTurnstileToken] = useState('');
    const [turnstileError, setTurnstileError] = useState('');
    const [turnstileResetKey, setTurnstileResetKey] = useState(() => Date.now().toString());
    const [googleAuthLink, setGoogleAuthLink] = useState<string | null>(null);
    
    const dropdownRef = useRef<HTMLAnchorElement>(null);
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const openTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const buttonRef = useRef<HTMLDivElement>(null);

    // Set mounted state after component mounts (client-side only)
    useEffect(() => {
        setMounted(true);
    }, []);

    // Build Google OAuth redirect URL
    useEffect(() => {
        if (!mounted) return;
        if (typeof window === 'undefined') return;

        try {
            const serverBase = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:4000';
            const normalizedBase = serverBase.endsWith('/') ? serverBase.slice(0, -1) : serverBase;

            const callbackUrl = new URL('/auth/google/callback', window.location.origin);
            const currentTarget = window.location.pathname + window.location.search;
            if (currentTarget) {
                const redirectParam = encodeURIComponent(currentTarget);
                callbackUrl.searchParams.set('redirect', redirectParam);
            }

            const apiUrl = `${normalizedBase}/api/v1/auth/google/redirect?returnUrl=${encodeURIComponent(
                callbackUrl.toString()
            )}`;
            setGoogleAuthLink(apiUrl);
        } catch (error) {
            console.error('Failed to build Google auth link from dropdown', error);
            setGoogleAuthLink(null);
        }
    }, [mounted]);

    // Detect mobile
    useEffect(() => {
        if (!mounted) return;
        
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 999);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [mounted]);

    const handleDropdownMouseEnter = () => {
        if (isMobile) return;
        
        // Call parent handler first
        onMouseEnterProp?.();
        
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
    };

    const handleDropdownMouseLeave = () => {
        if (isMobile) return;
        
        // Call parent handler
        onMouseLeaveProp?.();
        
        // Also handle internal close if needed
        if (controlledIsOpen === undefined) {
            closeTimeoutRef.current = setTimeout(() => {
                setIsOpen(false);
                onOverlayChange?.(false);
            }, 200);
        }
    };

    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'username':
                if (!value.trim()) {
                    return 'Vui lòng nhập địa chỉ email';
                }
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
            username: validateField('username', formData.username),
            password: validateField('password', formData.password),
        };
        setFieldErrors(errors);
        setTouched({
            username: true,
            password: true,
        });
        return !errors.username && !errors.password;
    };

    const resetTurnstile = () => {
        setTurnstileToken('');
        setTurnstileResetKey(Date.now().toString());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('LoginDropdown: Form submit triggered', { username: formData.username, hasPassword: !!formData.password, hasTurnstileToken: !!turnstileToken });
        
        setError('');
        setTurnstileError('');

        // Validate form
        if (!validateForm()) {
            console.log('LoginDropdown: Form validation failed');
            return;
        }

        if (!turnstileToken) {
            console.log('LoginDropdown: Turnstile token missing');
            setTurnstileError('Vui lòng xác minh bạn không phải robot.');
            return;
        }

        setLoading(true);
        console.log('LoginDropdown: Calling authLogin API...');

        try {
            const response = await authLogin({
                usernameOrEmail: formData.username,
                password: formData.password,
                turnstileToken,
            });
            console.log('LoginDropdown: API response received', { success: response.success });
            
            // Check if login was successful
            if (response.success && response.data) {
                // Transform API response to CurrentUser format
                const userData = response.data.user;
                // Support both fullName (backend camelCase) and full_name (frontend snake_case)
                const userFullName = (userData.fullName || userData.full_name || '').trim();
                const currentUser = {
                    _id: userData._id,
                    email: userData.email,
                    full_name: userFullName,
                    fullName: userFullName, // Also keep camelCase for compatibility
                    user_name: userFullName || userData.email?.split('@')[0],
                    phone_number: userData.phone,
                    role: userData.role,
                    type: (userData.typeLogin === '0' ? 'WEBSITE' : (userData.typeLogin === '1' ? 'GOOGLE' : 'WEBSITE')) as 'WEBSITE' | 'GOOGLE',
                    is_verified: userData.isVerified || false,
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken,
                    avatar: userData.avatar,
                    gender: userData.gender,
                    citizenIdentity: userData.citizenIdentity,
                    address: userData.address,
                };
                
                dispatch(loginSuccess(currentUser));
                showSuccess('Đăng nhập thành công!');
                setIsOpen(false);
                onOverlayChange?.(false);
                router.push('/');
                resetTurnstile();
            } else {
                throw new Error('Đăng nhập thất bại. Vui lòng thử lại!');
            }
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } }; message?: string };
            const errorMessage = error?.response?.data?.message || error?.message || 'Đăng nhập thất bại. Vui lòng thử lại!';
            setError(errorMessage);
            showError(errorMessage);
            dispatch(loginFailed());
            console.error('Login failed:', err);
            resetTurnstile();
        } finally {
            setLoading(false);
        }
    };

    // Cleanup timeouts
    useEffect(() => {
        const closeTimeout = closeTimeoutRef.current;
        const openTimeout = openTimeoutRef.current;
        return () => {
            if (closeTimeout) {
                clearTimeout(closeTimeout);
            }
            if (openTimeout) {
                clearTimeout(openTimeout);
            }
        };
    }, []);

    // Close when clicking outside (mobile)
    useEffect(() => {
        if (!mounted || !isOpen || !isMobile) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                onOverlayChange?.(false);
            }
        };

        const timeout = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 100);

        return () => {
            clearTimeout(timeout);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, isMobile, onOverlayChange, mounted, setIsOpen]);

    // A11y: ESC to close
    useEffect(() => {
        if (!mounted || !isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                setIsOpen(false);
                onOverlayChange?.(false);
                buttonRef.current?.focus();
            }
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen, onOverlayChange, mounted, setIsOpen]);

    return (
        <div 
            className={cx('login-dropdown-wrapper')}
            ref={dropdownRef}
        >
            {mounted && isOpen && (
                <div
                    className={cx('login-dropdown', {
                        'is-mobile': isMobile,
                    })}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Đăng nhập"
                    onClick={(e) => {
                        // Only stop propagation, don't prevent default to allow form submission
                        // Check if click is on form or form elements
                        const target = e.target as HTMLElement;
                        const isFormElement = target.closest('form') || 
                                             target.tagName === 'INPUT' || 
                                             target.tagName === 'BUTTON' || 
                                             target.tagName === 'SELECT' || 
                                             target.tagName === 'TEXTAREA' ||
                                             target.closest('button');
                        
                        if (!isFormElement) {
                            e.stopPropagation();
                        }
                    }}
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                >
                    {/* Header */}
                    <div className={cx('login-header')}>
                        <h2 className={cx('login-title')}>Đăng nhập</h2>
                        <Link 
                            href="/auth/register" 
                            className={cx('login-create-link')}
                            onClick={() => {
                                if (isMobile) {
                                    setIsOpen(false);
                                    onOverlayChange?.(false);
                                }
                            }}
                        >
                            Tạo tài khoản mới
                        </Link>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className={cx('login-form')} noValidate>
                        {error && (
                            <div className={cx('error-message')}>
                                <span className={cx('error-icon')}>⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}
                        
                        {/* Username/Email Input */}
                        <div className={cx('form-group')}>
                            <label htmlFor="username" className={cx('form-label')}>
                                Địa chỉ email
                            </label>
                            <input
                                type="text"
                                id="username"
                                className={cx('form-input', {
                                    'input-error': touched.username && fieldErrors.username,
                                })}
                                placeholder="Nhập địa chỉ email"
                                value={formData.username}
                                onChange={(e) => handleChange('username', e.target.value)}
                                onBlur={() => handleBlur('username')}
                                disabled={loading}
                            />
                            {touched.username && fieldErrors.username && (
                                <span className={cx('form-error-hint')}>{fieldErrors.username}</span>
                            )}
                        </div>

                        {/* Password Input */}
                        <div className={cx('form-group')}>
                            <label htmlFor="password" className={cx('form-label')}>
                                Mật khẩu
                            </label>
                            <div className={cx('password-wrapper')}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
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
                                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
                                </button>
                            </div>
                            {touched.password && fieldErrors.password && (
                                <span className={cx('form-error-hint')}>{fieldErrors.password}</span>
                            )}
                        </div>

                        {/* Options */}
                        <div className={cx('form-options')}>
                            <label className={cx('remember-me')}>
                                <input 
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span>Ghi nhớ đăng nhập</span>
                            </label>
                            <Link 
                                href="/auth/forgot-password" 
                                className={cx('forgot-password')}
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>

                        {/* Turnstile + Login Button */}
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
                            size="medium"
                            fullWidth
                            isLoading={loading}
                            loadingText="Đang xử lý..."
                            className={cx('submit-button')}
                            disabled={loading}
                        >
                            Đăng nhập
                        </Button>
                    </form>

                    {/* Social Login */}
                    <div className={cx('auth-divider')}>
                        <span>Hoặc</span>
                    </div>
                    <div className={cx('social-login')}>
                        <button
                            type="button"
                            className={cx('social-button', 'google-button')}
                            onClick={() => {
                                if (!googleAuthLink) {
                                    showError('Chức năng đăng nhập Google chưa khả dụng.');
                                    return;
                                }
                                window.location.href = googleAuthLink;
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span>Đăng nhập bằng Google</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginDropdown;

