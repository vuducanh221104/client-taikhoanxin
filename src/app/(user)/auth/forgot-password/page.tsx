'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames/bind';
import styles from './page.module.scss';
import { authForgotPassword } from '@/services/authServices';
import { ChevronLeftIcon } from '@/components/Icons';
import { Button } from '@/components/Button';

const cx = classNames.bind(styles);

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [touchedEmail, setTouchedEmail] = useState(false);

    const validateEmail = (value: string): string => {
        if (!value.trim()) {
            return 'Vui lòng nhập địa chỉ email';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
            return 'Vui lòng nhập địa chỉ email hợp lệ';
        }
        return '';
    };

    const handleBlur = () => {
        setTouchedEmail(true);
        const error = validateEmail(email);
        setEmailError(error);
    };

    const handleChange = (value: string) => {
        setEmail(value);
        // Clear error when user starts typing
        if (emailError) {
            setEmailError('');
        }
        // Clear general error when user starts typing
        if (error) {
            setError('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate email
        const emailValidationError = validateEmail(email);
        setEmailError(emailValidationError);
        setTouchedEmail(true);

        if (emailValidationError) {
            return;
        }

        setLoading(true);

        try {
            const response = await authForgotPassword(email);
            // Show success message from response
            setSuccess(true);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
            setError(errorMessage);
            console.error('Forgot password failed:', error);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className={cx('auth-page')}>
                <div className={cx('auth-form-section')}>
                    <div className={cx('form-container')}>
                        <div className={cx('success-message')}>
                            <div className={cx('success-icon')}>✓</div>
                            <h2 className={cx('success-title')}>Email đã được gửi!</h2>
                            <p className={cx('success-text')}>
                                Chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư đến hoặc mục Spam.
                            </p>
                            <Link href="/auth/login" className={cx('back-to-login-button')}>
                                Quay về đăng nhập
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

    return (
        <div className={cx('auth-page')}>
            {/* Left Side - Form */}
            <div className={cx('auth-form-section')}>
                <div className={cx('form-container')}>
                    {/* Header with Back Button */}
                    <div className={cx('forgot-password-header')}>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className={cx('back-button')}
                            aria-label="Quay lại"
                        >
                            <ChevronLeftIcon size={24} />
                        </button>
                        <h1 className={cx('forgot-password-title')}>Quên mật khẩu</h1>
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
                                    'input-error': touchedEmail && emailError,
                                })}
                                placeholder="Nhập địa chỉ email"
                                value={email}
                                onChange={(e) => handleChange(e.target.value)}
                                onBlur={handleBlur}
                                disabled={loading}
                            />
                            {touchedEmail && emailError && (
                                <span className={cx('form-error-hint')}>{emailError}</span>
                            )}
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="large"
                            fullWidth
                            isLoading={loading}
                            loadingText="Đang gửi..."
                            className={cx('submit-button')}
                        >
                            Gửi email
                        </Button>
                    </form>
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

