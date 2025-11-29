'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames/bind';
import styles from './page.module.scss';
import { authRegister } from '@/services/authService';
import { EyeIcon, EyeOffIcon, CheckCircleIcon } from '@/components/Icons';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/Button';
import TurnstileWidget from '@/components/Turnstile/TurnstileWidget';

const cx = classNames.bind(styles);

export default function RegisterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showSuccess, showError } = useToast();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [fieldErrors, setFieldErrors] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [touched, setTouched] = useState({
        email: false,
        password: false,
        confirmPassword: false,
    });
    const [turnstileToken, setTurnstileToken] = useState('');
    const [turnstileError, setTurnstileError] = useState('');
    const [turnstileResetKey, setTurnstileResetKey] = useState(() => Date.now().toString());
    const [googleAuthLink, setGoogleAuthLink] = useState<string | null>(null);

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

    const calculatePasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/\d/)) strength++;
        if (password.match(/[^a-zA-Z\d]/)) strength++;
        return strength;
    };

    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'email':
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
            case 'confirmPassword':
                if (!value) {
                    return 'Vui lòng xác nhận mật khẩu';
                }
                if (value !== formData.password) {
                    return 'Mật khẩu xác nhận không khớp';
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
        const updatedFormData = { ...formData, [fieldName]: value };
        setFormData(updatedFormData);
        
        // Clear error when user starts typing
        if (fieldErrors[fieldName]) {
            setFieldErrors((prev) => ({ ...prev, [fieldName]: '' }));
        }
        // Clear general error when user starts typing
        if (error) {
            setError('');
        }
        // Re-validate confirmPassword when it changes and compare with current password
        if (fieldName === 'confirmPassword' && touched.confirmPassword) {
            const confirmError = value !== updatedFormData.password ? 'Mật khẩu xác nhận không khớp' : '';
            setFieldErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
        }
    };

    const handlePasswordChange = (value: string) => {
        const updatedFormData = { ...formData, password: value };
        setFormData(updatedFormData);
        setPasswordStrength(calculatePasswordStrength(value));
        
        // Clear password error when user starts typing
        if (fieldErrors.password) {
            setFieldErrors((prev) => ({ ...prev, password: '' }));
        }
        // Clear general error when user starts typing
        if (error) {
            setError('');
        }
        // Re-validate confirmPassword if it's already filled and touched
        if (touched.confirmPassword && formData.confirmPassword) {
            const confirmError = value !== formData.confirmPassword ? 'Mật khẩu xác nhận không khớp' : '';
            setFieldErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
        }
    };

    const validateForm = (): boolean => {
        const errors = {
            email: validateField('email', formData.email),
            password: validateField('password', formData.password),
            confirmPassword: validateField('confirmPassword', formData.confirmPassword),
        };
        setFieldErrors(errors);
        setTouched({
            email: true,
            password: true,
            confirmPassword: true,
        });
        return !errors.email && !errors.password && !errors.confirmPassword;
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
            const response = await authRegister({
                email: formData.email,
                password: formData.password,
                turnstileToken,
            });
            showSuccess('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
            // Redirect to login with success message
            setTimeout(() => {
                router.push('/auth/login?registered=true');
            }, 1000);
            resetTurnstile();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Đăng ký thất bại. Vui lòng thử lại!';
            setError(errorMessage);
            showError(errorMessage);
            console.error('Registration failed:', error);
            resetTurnstile();
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrengthText = () => {
        switch (passwordStrength) {
            case 0:
            case 1:
                return { text: 'Yếu', color: '#f44336' };
            case 2:
                return { text: 'Trung bình', color: '#ff9800' };
            case 3:
            case 4:
                return { text: 'Mạnh', color: '#4caf50' };
            default:
                return { text: '', color: '#e0e0e0' };
        }
    };

    const strengthInfo = getPasswordStrengthText();

    return (
        <div className={cx('auth-page')}>
            {/* Left Side - Form */}
            <div className={cx('auth-form-section')}>
                <div className={cx('form-container')}>
                    <div className={cx('auth-header')}>
                        <h1 className={cx('auth-title')}>Chào mừng bạn đến với Tài Khoản Xịn</h1>
                        <p className={cx('auth-subtitle')}>
                            Đăng ký để trải nghiệm kho ứng dụng với hơn 10,000+ ứng dụng
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className={cx('auth-form')} noValidate>
                        {error && (
                            <div className={cx('error-message')}>
                                <span className={cx('error-icon')}>⚠️</span>
                                {error}
                            </div>
                        )}

                        <div className={cx('form-group')}>
                            <label htmlFor="email" className={cx('form-label')}>
                                Địa chỉ email
                            </label>
                            <input
                                id="email"
                                type="email"
                                className={cx('form-input', {
                                    'input-error': touched.email && fieldErrors.email,
                                })}
                                placeholder="Nhập địa chỉ email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                onBlur={() => handleBlur('email')}
                                disabled={loading}
                            />
                            {touched.email && fieldErrors.email && (
                                <span className={cx('form-error-hint')}>{fieldErrors.email}</span>
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
                                    onChange={(e) => handlePasswordChange(e.target.value)}
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
                            {touched.password && fieldErrors.password ? (
                                <span className={cx('form-error-hint')}>{fieldErrors.password}</span>
                            ) : formData.password ? (
                                <div className={cx('password-strength')}>
                                    <div className={cx('strength-bar')}>
                                        <div
                                            className={cx('strength-fill')}
                                            style={{
                                                width: `${(passwordStrength / 4) * 100}%`,
                                                backgroundColor: strengthInfo.color,
                                            }}
                                        ></div>
                                    </div>
                                    <span className={cx('strength-text')} style={{ color: strengthInfo.color }}>
                                        {strengthInfo.text}
                                    </span>
                                </div>
                            ) : null}
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="confirmPassword" className={cx('form-label')}>
                                Xác nhận mật khẩu
                            </label>
                            <div className={cx('password-wrapper')}>
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className={cx('form-input', {
                                        'input-error': touched.confirmPassword && fieldErrors.confirmPassword,
                                    })}
                                    placeholder="Nhập lại mật khẩu"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                    onBlur={() => handleBlur('confirmPassword')}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className={cx('password-toggle')}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
                                </button>
                            </div>
                            {touched.confirmPassword && fieldErrors.confirmPassword && (
                                <span className={cx('form-error-hint')}>{fieldErrors.confirmPassword}</span>
                            )}
                        </div>

                        <div className={cx('form-group', 'turnstile-group')}>
                            <div className={cx('turnstile-wrapper', { verified: !!turnstileToken })}>
                                {!turnstileToken ? (
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
                                        className={cx('turnstile-widget')}
                            />
                                ) : (
                                    <div className={cx('turnstile-success')}>
                                        <div className={cx('success-content')}>
                                            <div className={cx('success-icon-wrapper')}>
                                                <CheckCircleIcon size={20} className={cx('success-icon')} />
                                            </div>
                                            <span className={cx('success-text')}>Thành công!</span>
                                        </div>
                                        <div className={cx('cloudflare-branding')}>
                                            <div className={cx('cloudflare-logo')}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                    <path d="M13.55 2.5L15.5 8.5H22L16.5 12L18.45 18L12 14.5L5.55 18L7.5 12L2 8.5H8.5L10.45 2.5L13.55 2.5Z" fill="#F6821F"/>
                                                </svg>
                                            </div>
                                            <div className={cx('cloudflare-links')}>
                                                <a href="https://www.cloudflare.com/privacy/" target="_blank" rel="noopener noreferrer" className={cx('cloudflare-link')}>
                                                    Quyền riêng tư
                                                </a>
                                                <span className={cx('link-separator')}>•</span>
                                                <a href="https://www.cloudflare.com/terms/" target="_blank" rel="noopener noreferrer" className={cx('cloudflare-link')}>
                                                    Điều khoản
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
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
                            Đăng ký
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
                                    showError('Chức năng đăng ký Google chưa khả dụng.');
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
                            Đăng ký bằng Google
                        </a>
                    </div>

                    <div className={cx('auth-footer')}>
                        <span>Bạn đã có tài khoản? </span>
                        <Link href="/auth/login" className={cx('auth-link')}>
                            Đăng nhập ngay
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
                        priority={false}
                        loading="lazy"
                        fetchPriority="low"
                        quality={90}
                    />
                </div>
            </div>
        </div>
    );
}

