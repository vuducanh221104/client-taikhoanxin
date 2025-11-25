'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames/bind';
import styles from './page.module.scss';
import { authForgotPassword, verifyForgotPasswordOTP, resetPassword } from '@/services/authService';
import { ChevronLeftIcon, EyeIcon, EyeOffIcon } from '@/components/Icons';
import { Button } from '@/components/Button';
import TurnstileWidget from '@/components/Turnstile/TurnstileWidget';
import { useToast } from '@/hooks/useToast';

const cx = classNames.bind(styles);

type Step = 'email' | 'otp' | 'password' | 'success';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { showSuccess, showError } = useToast();
    const [step, setStep] = useState<Step>('email');
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [rateLimitCountdown, setRateLimitCountdown] = useState(0);
    
    // Get last OTP sent time from localStorage
    const getLastOTPSentTime = (): number | null => {
        if (typeof window === 'undefined') return null;
        const stored = localStorage.getItem('forgotPasswordLastSent');
        return stored ? parseInt(stored, 10) : null;
    };

    // Set last OTP sent time to localStorage
    const setLastOTPSentTime = (timestamp: number) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('forgotPasswordLastSent', timestamp.toString());
        }
    };

    // Calculate remaining time for rate limit
    const calculateRemainingTime = (): number => {
        const lastSent = getLastOTPSentTime();
        if (!lastSent) return 0;
        const now = Date.now();
        const elapsed = Math.floor((now - lastSent) / 1000);
        const remaining = 60 - elapsed;
        return remaining > 0 ? remaining : 0;
    };

    // Rate limit countdown effect
    useEffect(() => {
        const remaining = calculateRemainingTime();
        if (remaining > 0) {
            setRateLimitCountdown(remaining);
        } else {
            setRateLimitCountdown(0);
        }
    }, []);

    // Countdown timer for rate limit
    useEffect(() => {
        if (rateLimitCountdown > 0) {
            const timer = setInterval(() => {
                setRateLimitCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        if (typeof window !== 'undefined') {
                            localStorage.removeItem('forgotPasswordLastSent');
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            
            return () => clearInterval(timer);
        }
    }, [rateLimitCountdown]);

    // Initialize rate limit countdown on mount
    useEffect(() => {
        const remaining = calculateRemainingTime();
        if (remaining > 0) {
            setRateLimitCountdown(remaining);
        }
    }, []);
    
    // Countdown effect for success screen
    useEffect(() => {
        if (step === 'success') {
            setCountdown(5);
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        router.push('/auth/login');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            
            return () => clearInterval(timer);
        }
    }, [step, router]);
    
    // Email step
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [touchedEmail, setTouchedEmail] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState('');
    const [turnstileError, setTurnstileError] = useState('');
    const [turnstileResetKey, setTurnstileResetKey] = useState(() => Date.now().toString());
    
    // OTP step
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const [touchedOtp, setTouchedOtp] = useState(false);
    
    // Password step
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [touchedPassword, setTouchedPassword] = useState(false);
    const [touchedConfirmPassword, setTouchedConfirmPassword] = useState(false);
    const [passwordResetKey, setPasswordResetKey] = useState(() => Date.now().toString());

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

    const validateOTP = (value: string): string => {
        if (!value.trim()) {
            return 'Vui lòng nhập mã OTP';
        }
        if (value.trim().length !== 6) {
            return 'Mã OTP phải có 6 chữ số';
        }
        if (!/^\d+$/.test(value.trim())) {
            return 'Mã OTP chỉ được chứa số';
        }
        return '';
    };

    const validatePassword = (value: string): string => {
        if (!value) {
            return 'Vui lòng nhập mật khẩu';
        }
        if (value.length < 6) {
            return 'Mật khẩu phải có ít nhất 6 ký tự';
        }
        return '';
    };

    const validateConfirmPassword = (value: string, password: string): string => {
        if (!value) {
            return 'Vui lòng xác nhận mật khẩu';
        }
        if (value !== password) {
            return 'Mật khẩu xác nhận không khớp';
        }
        return '';
    };

    const resetTurnstile = () => {
        setTurnstileToken('');
        setTurnstileResetKey(Date.now().toString());
    };

    const resetPasswordTurnstile = () => {
        setPasswordResetKey(Date.now().toString());
    };

    // Step 1: Send OTP
    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError('');
        setTurnstileError('');

        // Check rate limit
        if (rateLimitCountdown > 0) {
            showError(`Vui lòng đợi ${rateLimitCountdown} giây trước khi yêu cầu gửi lại mã OTP.`);
            return;
        }

        const emailValidationError = validateEmail(email);
        setEmailError(emailValidationError);
        setTouchedEmail(true);

        if (emailValidationError) {
            return;
        }

        if (!turnstileToken) {
            setTurnstileError('Vui lòng xác minh bạn không phải robot.');
            return;
        }

        setLoading(true);

        try {
            const response = await authForgotPassword({
                email: email.trim(),
                turnstileToken,
            });
            // Lưu thời gian gửi OTP
            setLastOTPSentTime(Date.now());
            setRateLimitCountdown(60);
            showSuccess('Mã OTP đã được gửi đến email của bạn.');
            setStep('otp');
            resetTurnstile();
        } catch (error: any) {
            // Xử lý rate limit error (429)
            if (error?.response?.status === 429) {
                const errorMessage = error?.response?.data?.message || 'Vui lòng đợi 60 giây trước khi yêu cầu gửi lại mã OTP.';
                showError(errorMessage);
                // Set rate limit countdown nếu server trả về 429
                setLastOTPSentTime(Date.now());
                setRateLimitCountdown(60);
            } else {
                const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
                showError(errorMessage);
            }
            resetTurnstile();
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleOTPSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setOtpError('');

        const otpValidationError = validateOTP(otp);
        setOtpError(otpValidationError);
        setTouchedOtp(true);

        if (otpValidationError) {
            return;
        }

        setLoading(true);

        try {
            const response = await verifyForgotPasswordOTP({
                email: email.trim(),
                otp: otp.trim(),
            });
            showSuccess('OTP hợp lệ. Vui lòng nhập mật khẩu mới.');
            setStep('password');
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'OTP không chính xác. Vui lòng thử lại!';
            setOtpError(errorMessage);
            showError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset Password
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setConfirmPasswordError('');

        const passwordValidationError = validatePassword(newPassword);
        const confirmPasswordValidationError = validateConfirmPassword(confirmPassword, newPassword);
        
        setPasswordError(passwordValidationError);
        setConfirmPasswordError(confirmPasswordValidationError);
        setTouchedPassword(true);
        setTouchedConfirmPassword(true);

        if (passwordValidationError || confirmPasswordValidationError) {
            return;
        }

        if (!turnstileToken) {
            setTurnstileError('Vui lòng xác minh bạn không phải robot.');
            return;
        }

        setLoading(true);

        try {
            const response = await resetPassword({
                email: email.trim(),
                otp: otp.trim(),
                newPassword,
                turnstileToken,
            });
            setStep('success');
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
            showError(errorMessage);
            resetPasswordTurnstile();
        } finally {
            setLoading(false);
        }
    };

    const handleBackToEmail = () => {
        setStep('email');
        setOtp('');
        setOtpError('');
        setTouchedOtp(false);
    };

    const handleBackToOTP = () => {
        setStep('otp');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
        setConfirmPasswordError('');
        setTouchedPassword(false);
        setTouchedConfirmPassword(false);
        resetPasswordTurnstile();
    };

    return (
        <div className={cx('auth-page')}>
            {/* Left Side - Form */}
            <div className={cx('auth-form-section')}>
                <div className={cx('form-container')}>
                    {/* Success Screen - Show first when success */}
                    {step === 'success' ? (
                        <div className={cx('success-message')}>
                            <div className={cx('success-icon')}>✓</div>
                            <h2 className={cx('success-title')}>Đặt lại mật khẩu thành công!</h2>
                            <p className={cx('success-text')}>
                                Mật khẩu của bạn đã được đặt lại thành công. Vui lòng đăng nhập lại với mật khẩu mới.
                            </p>
                            <p className={cx('countdown-text')}>
                                Tự động chuyển đến trang đăng nhập sau <strong>{countdown}</strong> giây...
                            </p>
                            <Button
                                type="button"
                                variant="primary"
                                size="large"
                                fullWidth
                                onClick={() => router.push('/auth/login')}
                                className={cx('submit-button')}
                            >
                                Quay về đăng nhập
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* Header with Back Button */}
                            <div className={cx('forgot-password-header')}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (step === 'email') {
                                            router.back();
                                        } else if (step === 'otp') {
                                            handleBackToEmail();
                                        } else {
                                            handleBackToOTP();
                                        }
                                    }}
                                    className={cx('back-button')}
                                    aria-label="Quay lại"
                                >
                                    <ChevronLeftIcon size={24} />
                                </button>
                                <h1 className={cx('forgot-password-title')}>
                                    {step === 'email' && 'Quên mật khẩu'}
                                    {step === 'otp' && 'Nhập mã OTP'}
                                    {step === 'password' && 'Đặt lại mật khẩu'}
                                </h1>
                            </div>

                            {/* Step 1: Email Form */}
                            {step === 'email' && (
                        <form onSubmit={handleEmailSubmit} className={cx('auth-form')} noValidate>
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
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (emailError) setEmailError('');
                                    }}
                                    onBlur={() => {
                                        setTouchedEmail(true);
                                        setEmailError(validateEmail(email));
                                    }}
                                disabled={loading}
                            />
                            {touchedEmail && emailError && (
                                <span className={cx('form-error-hint')}>{emailError}</span>
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

                            {rateLimitCountdown > 0 && (
                                <div className={cx('rate-limit-notice')}>
                                    <p className={cx('rate-limit-text')}>
                                        Vui lòng đợi <strong>{rateLimitCountdown}</strong> giây trước khi yêu cầu gửi lại mã OTP.
                                    </p>
                                </div>
                            )}

                        <Button
                            type="submit"
                            variant="primary"
                            size="large"
                            fullWidth
                            isLoading={loading}
                            loadingText="Đang gửi..."
                            className={cx('submit-button')}
                            disabled={loading || rateLimitCountdown > 0}
                        >
                            {rateLimitCountdown > 0 ? `Gửi lại sau ${rateLimitCountdown}s` : 'Gửi mã OTP'}
                        </Button>
                        </form>
                    )}

                    {/* Step 2: OTP Form */}
                    {step === 'otp' && (
                        <form onSubmit={handleOTPSubmit} className={cx('auth-form')} noValidate>
                            <div className={cx('form-group')}>
                                <label htmlFor="otp" className={cx('form-label')}>
                                    Mã OTP
                                </label>
                                <input
                                    id="otp"
                                    type="text"
                                    maxLength={6}
                                    className={cx('form-input', {
                                        'input-error': touchedOtp && otpError,
                                    })}
                                    placeholder="Nhập mã OTP 6 chữ số"
                                    value={otp}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                        setOtp(value);
                                        if (otpError) setOtpError('');
                                    }}
                                    onBlur={() => {
                                        setTouchedOtp(true);
                                        setOtpError(validateOTP(otp));
                                    }}
                                    disabled={loading}
                                />
                                {touchedOtp && otpError && (
                                    <span className={cx('form-error-hint')}>{otpError}</span>
                                )}
                                <p className={cx('form-hint')}>
                                    Mã OTP đã được gửi đến <strong>{email}</strong>
                                </p>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="large"
                                fullWidth
                                isLoading={loading}
                                loadingText="Đang xác minh..."
                                className={cx('submit-button')}
                                disabled={loading}
                            >
                                Xác minh OTP
                            </Button>
                        </form>
                    )}

                    {/* Step 3: Password Form */}
                    {step === 'password' && (
                        <form onSubmit={handlePasswordSubmit} className={cx('auth-form')} noValidate>
                            <div className={cx('form-group')}>
                                <label htmlFor="newPassword" className={cx('form-label')}>
                                    Mật khẩu mới
                                </label>
                                <div className={cx('password-wrapper')}>
                                    <input
                                        id="newPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        className={cx('form-input', {
                                            'input-error': touchedPassword && passwordError,
                                        })}
                                        placeholder="Nhập mật khẩu mới"
                                        value={newPassword}
                                        onChange={(e) => {
                                            setNewPassword(e.target.value);
                                            if (passwordError) setPasswordError('');
                                            if (touchedConfirmPassword && confirmPassword) {
                                                setConfirmPasswordError(validateConfirmPassword(confirmPassword, e.target.value));
                                            }
                                        }}
                                        onBlur={() => {
                                            setTouchedPassword(true);
                                            setPasswordError(validatePassword(newPassword));
                                        }}
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
                                {touchedPassword && passwordError && (
                                    <span className={cx('form-error-hint')}>{passwordError}</span>
                                )}
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
                                            'input-error': touchedConfirmPassword && confirmPasswordError,
                                        })}
                                        placeholder="Nhập lại mật khẩu"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            if (confirmPasswordError) setConfirmPasswordError('');
                                        }}
                                        onBlur={() => {
                                            setTouchedConfirmPassword(true);
                                            setConfirmPasswordError(validateConfirmPassword(confirmPassword, newPassword));
                                        }}
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
                                {touchedConfirmPassword && confirmPasswordError && (
                                    <span className={cx('form-error-hint')}>{confirmPasswordError}</span>
                                )}
                            </div>

                            <div className={cx('form-group')}>
                                <TurnstileWidget
                                    resetKey={passwordResetKey}
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
                    )}

                            <div className={cx('auth-footer')}>
                                <span>Bạn đã nhớ mật khẩu? </span>
                                <Link href="/auth/login" className={cx('auth-link')}>
                                    Đăng nhập ngay
                                </Link>
                            </div>
                        </>
                    )}
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
