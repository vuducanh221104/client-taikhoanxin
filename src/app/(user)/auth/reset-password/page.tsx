'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames/bind';
import styles from '../forgot-password/page.module.scss';
import { resetPassword } from '@/services/authService';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/Button';
import { EyeIcon, EyeOffIcon, ChevronLeftIcon } from '@/components/Icons';
import TurnstileWidget from '@/components/Turnstile/TurnstileWidget';

const cx = classNames.bind(styles);

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showSuccess, showError } = useToast();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState('');
    const [turnstileError, setTurnstileError] = useState('');
    const [turnstileResetKey, setTurnstileResetKey] = useState(() => Date.now().toString());

    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [fieldErrors, setFieldErrors] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [touched, setTouched] = useState({
        email: false,
        otp: false,
        newPassword: false,
        confirmPassword: false,
    });

    useEffect(() => {
        const email = searchParams.get('email');
        if (email) {
            setFormData((prev) => ({ ...prev, email }));
        }
    }, [searchParams]);

    const validateField = (name: keyof typeof formData, value: string): string => {
        switch (name) {
            case 'email':
                if (!value.trim()) return 'Vui lòng nhập địa chỉ email';
                // basic email regex
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
                    return 'Địa chỉ email không hợp lệ';
                }
                return '';
            case 'otp':
                if (!value.trim()) return 'Vui lòng nhập mã OTP';
                if (!/^\d{6}$/.test(value.trim())) {
                    return 'OTP phải gồm 6 chữ số';
                }
                return '';
            case 'newPassword':
                if (!value) return 'Vui lòng nhập mật khẩu mới';
                if (value.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
                return '';
            case 'confirmPassword':
                if (!value) return 'Vui lòng xác nhận mật khẩu mới';
                if (value !== formData.newPassword) return 'Mật khẩu xác nhận không khớp';
                return '';
            default:
                return '';
        }
    };

    const handleBlur = (fieldName: keyof typeof formData) => {
        setTouched((prev) => ({ ...prev, [fieldName]: true }));
        const errorMsg = validateField(fieldName, formData[fieldName]);
        setFieldErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
    };

    const handleChange = (fieldName: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [fieldName]: value }));
        if (fieldErrors[fieldName]) {
            setFieldErrors((prev) => ({ ...prev, [fieldName]: '' }));
        }
        if (error) {
            setError('');
        }
        if (fieldName === 'newPassword' && touched.confirmPassword && formData.confirmPassword) {
            const confirmError = value !== formData.confirmPassword ? 'Mật khẩu xác nhận không khớp' : '';
            setFieldErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
        }
    };

    const validateForm = () => {
        const errors = {
            email: validateField('email', formData.email),
            otp: validateField('otp', formData.otp),
            newPassword: validateField('newPassword', formData.newPassword),
            confirmPassword: validateField('confirmPassword', formData.confirmPassword),
        };
        setFieldErrors(errors);
        setTouched({
            email: true,
            otp: true,
            newPassword: true,
            confirmPassword: true,
        });
        return !errors.email && !errors.otp && !errors.newPassword && !errors.confirmPassword;
    };

    const resetTurnstile = () => {
        setTurnstileToken('');
        setTurnstileResetKey(Date.now().toString());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setTurnstileError('');

        if (!validateForm()) {
            return;
        }

        if (!turnstileToken) {
            setTurnstileError('Vui lòng xác minh bạn không phải robot.');
            return;
        }

        setLoading(true);

        try {
            const response = await resetPassword({
                email: formData.email.trim(),
                otp: formData.otp.trim(),
                newPassword: formData.newPassword,
                turnstileToken,
            });

            showSuccess(response.message || 'Đặt lại mật khẩu thành công!');
            setSuccess(true);
            setTimeout(() => router.push('/auth/login'), 1500);
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại!';
            setError(message);
            showError(message);
        } finally {
            setLoading(false);
            resetTurnstile();
        }
    };

    if (success) {
        return (
            <div className={cx('auth-page')}>
                <div className={cx('auth-form-section')}>
                    <div className={cx('form-container')}>
                        <div className={cx('success-message')}>
                            <div className={cx('success-icon')}>✓</div>
                            <h2 className={cx('success-title')}>Đặt lại mật khẩu thành công!</h2>
                            <p className={cx('success-text')}>
                                Bạn có thể đăng nhập bằng mật khẩu mới. Nếu không được chuyển hướng tự động, bấm nút bên dưới.
                            </p>
                            <Link href="/auth/login" className={cx('back-to-login-button')}>
                                Quay về đăng nhập
                            </Link>
                        </div>
                    </div>
                </div>
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

    return (
        <div className={cx('auth-page')}>
            <div className={cx('auth-form-section')}>
                <div className={cx('form-container')}>
                    <div className={cx('forgot-password-header')}>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className={cx('back-button')}
                            aria-label="Quay lại"
                        >
                            <ChevronLeftIcon size={24} />
                        </button>
                        <h1 className={cx('forgot-password-title')}>Đặt lại mật khẩu</h1>
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
                            <label htmlFor="otp" className={cx('form-label')}>
                                Mã OTP
                            </label>
                            <input
                                id="otp"
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                className={cx('form-input', {
                                    'input-error': touched.otp && fieldErrors.otp,
                                })}
                                placeholder="Nhập mã OTP gồm 6 chữ số"
                                value={formData.otp}
                                onChange={(e) => handleChange('otp', e.target.value.replace(/\D/g, ''))}
                                onBlur={() => handleBlur('otp')}
                                disabled={loading}
                            />
                            {touched.otp && fieldErrors.otp && (
                                <span className={cx('form-error-hint')}>{fieldErrors.otp}</span>
                            )}
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="newPassword" className={cx('form-label')}>
                                Mật khẩu mới
                            </label>
                            <div className={cx('password-wrapper')}>
                                <input
                                    id="newPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    className={cx('form-input', {
                                        'input-error': touched.newPassword && fieldErrors.newPassword,
                                    })}
                                    placeholder="Nhập mật khẩu mới"
                                    value={formData.newPassword}
                                    onChange={(e) => handleChange('newPassword', e.target.value)}
                                    onBlur={() => handleBlur('newPassword')}
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
                            {touched.newPassword && fieldErrors.newPassword && (
                                <span className={cx('form-error-hint')}>{fieldErrors.newPassword}</span>
                            )}
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="confirmPassword" className={cx('form-label')}>
                                Xác nhận mật khẩu mới
                            </label>
                            <div className={cx('password-wrapper')}>
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className={cx('form-input', {
                                        'input-error': touched.confirmPassword && fieldErrors.confirmPassword,
                                    })}
                                    placeholder="Nhập lại mật khẩu mới"
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

                        <div className={cx('form-group')}>
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
                            Đặt lại mật khẩu
                        </Button>
                    </form>

                </div>
            </div>

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

