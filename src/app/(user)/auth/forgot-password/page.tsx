'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import classNames from 'classnames/bind';
import styles from './page.module.scss';
import { authForgotPassword, verifyForgotPasswordOTP, resetPassword } from '@/services/authService';
import { ChevronLeftIcon, EyeIcon, EyeOffIcon } from '@/components/Icons';
import { Button } from '@/components/Button';
import TurnstileWidget from '@/components/Turnstile/TurnstileWidget';
import { useToast } from '@/hooks/useToast';

const cx = classNames.bind(styles);

type Step = 'email' | 'otp' | 'password' | 'success';
interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
        status?: number;
    };
    message?: string;
}
const journeySteps: Array<{ key: Step; label: string; hint: string }> = [
    { key: 'email', label: 'Nhập email', hint: 'Gửi mã OTP vào hộp thư của bạn' },
    { key: 'otp', label: 'Xác minh OTP', hint: 'Nhập mã gồm 6 chữ số để xác nhận' },
    { key: 'password', label: 'Đặt lại mật khẩu', hint: 'Tạo mật khẩu mới an toàn hơn' },
];

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
    const calculateRemainingTime = useCallback((): number => {
        const lastSent = getLastOTPSentTime();
        if (!lastSent) return 0;
        const now = Date.now();
        const elapsed = Math.floor((now - lastSent) / 1000);
        const remaining = 60 - elapsed;
        return remaining > 0 ? remaining : 0;
    }, []);

    // Rate limit countdown effect
    useEffect(() => {
        const remaining = calculateRemainingTime();
        if (remaining > 0) {
            setRateLimitCountdown(remaining);
        } else {
            setRateLimitCountdown(0);
        }
    }, [calculateRemainingTime]);

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
    }, [calculateRemainingTime]);
    
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
            await authForgotPassword({
                email: email.trim(),
                turnstileToken,
            });
            // Lưu thời gian gửi OTP
            setLastOTPSentTime(Date.now());
            setRateLimitCountdown(60);
            showSuccess('Mã OTP đã được gửi đến email của bạn.');
            setStep('otp');
            resetTurnstile();
        } catch (error) {
            const apiError = error as ApiError;
            // Xử lý rate limit error (429)
            if (apiError?.response?.status === 429) {
                const errorMessage =
                    apiError?.response?.data?.message || 'Vui lòng đợi 60 giây trước khi yêu cầu gửi lại mã OTP.';
                showError(errorMessage);
                // Set rate limit countdown nếu server trả về 429
                setLastOTPSentTime(Date.now());
                setRateLimitCountdown(60);
            } else {
                const errorMessage =
                    apiError?.response?.data?.message || apiError?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
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
            await verifyForgotPasswordOTP({
                email: email.trim(),
                otp: otp.trim(),
            });
            showSuccess('OTP hợp lệ. Vui lòng nhập mật khẩu mới.');
            setStep('password');
        } catch (error) {
            const apiError = error as ApiError;
            const errorMessage =
                apiError?.response?.data?.message || apiError?.message || 'OTP không chính xác. Vui lòng thử lại!';
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
            await resetPassword({
                email: email.trim(),
                otp: otp.trim(),
                newPassword,
                turnstileToken,
            });
            setStep('success');
        } catch (error) {
            const apiError = error as ApiError;
            const errorMessage =
                apiError?.response?.data?.message || apiError?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
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

    const totalSteps = journeySteps.length;
    const activeStepIndex = Math.max(journeySteps.findIndex((item) => item.key === step), 0);
    const currentStage =
        step === 'success'
            ? { label: 'Hoàn tất', hint: 'Bạn có thể đăng nhập bằng mật khẩu mới.' }
            : journeySteps[activeStepIndex] || journeySteps[0];
    const progressPercent = step === 'success' ? 100 : ((activeStepIndex + 1) / totalSteps) * 100;

    const handleNavigateBack = () => {
        if (step === 'email') {
            router.back();
        } else if (step === 'otp') {
            handleBackToEmail();
        } else if (step === 'password') {
            handleBackToOTP();
        }
    };

    return (
        <div className={cx('auth-page')}>
            <div className={cx('forgot-shell')}>
                <section className={cx('insight-panel')}>
                    <div className={cx('brand-pill')}>Tài Khoản Xịn</div>
                    <h2 className={cx('insight-title')}>Khôi phục tài khoản an toàn trong vài bước</h2>
                    <p className={cx('insight-text')}>
                        Chúng tôi sử dụng xác thực hai lớp và Turnstile của Cloudflare để bảo vệ tài khoản của bạn trong toàn
                        bộ quá trình đặt lại mật khẩu.
                    </p>
                    <ul className={cx('insight-steps')}>
                        {journeySteps.map((item, index) => (
                            <li key={item.key} className={cx('insight-step')}>
                                <span className={cx('step-index')}>{`0${index + 1}`}</span>
                                <div>
                                    <p className={cx('step-label')}>{item.label}</p>
                                    <span className={cx('step-hint')}>{item.hint}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className={cx('support-card')}>
                        <div>
                            <p className={cx('support-title')}>Cần trợ giúp ngay?</p>
                            <span className={cx('support-text')}>Đội ngũ CSKH phản hồi trong 5 phút.</span>
                        </div>
                        <Link href="mailto:support@taikhoanxin.vn" className={cx('support-link')}>
                            support@taikhoanxin.vn
                        </Link>
                    </div>
                    <div className={cx('security-badge')}>
                        <span className={cx('badge-dot')} />
                        Mã hóa SSL & Cloudflare Turnstile
                    </div>
                </section>

                <section className={cx('form-panel')}>
                    <div className={cx('form-header')}>
                        <button type="button" className={cx('back-button')} onClick={handleNavigateBack} aria-label="Quay lại">
                            <ChevronLeftIcon size={20} />
                        </button>
                        <div>
                            <span className={cx('step-eyebrow')}>
                                {step === 'success' ? 'Hoàn tất' : `Bước ${activeStepIndex + 1}/${totalSteps}`}
                            </span>
                            <h1 className={cx('step-title')}>
                                {step === 'success' ? 'Đặt lại mật khẩu thành công' : currentStage.label}
                            </h1>
                            <p className={cx('step-description')}>
                                {step === 'success'
                                    ? 'Bạn sẽ được chuyển đến trang đăng nhập trong giây lát.'
                                    : currentStage.hint}
                            </p>
                        </div>
                    </div>

                    {step !== 'success' && (
                        <div className={cx('progress-track')}>
                            <div className={cx('progress-bar')} style={{ '--progress': `${progressPercent}%` } as React.CSSProperties} />
                            <div className={cx('progress-dots')}>
                                {journeySteps.map((item, index) => (
                                    <span
                                        key={item.key}
                                        className={cx('progress-dot', {
                                            'is-active': index <= activeStepIndex,
                                        })}
                                    >
                                        {index + 1}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className={cx('form-body')}>
                        {step === 'success' ? (
                            <div className={cx('success-card')}>
                                <div className={cx('success-icon')}>✓</div>
                                <h2>Hoàn tất!</h2>
                                <p>Mật khẩu mới đã được cập nhật. Hãy đăng nhập và tiếp tục mua sắm nhé.</p>
                                <p className={cx('countdown-text')}>
                                    Tự động chuyển sau <strong>{countdown}</strong> giây...
                                </p>
                                <Button
                                    type="button"
                                    variant="primary"
                                    size="large"
                                    fullWidth
                                    className={cx('submit-button')}
                                    onClick={() => router.push('/auth/login')}
                                >
                                    Quay lại đăng nhập
                                </Button>
                            </div>
                        ) : (
                            <>
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
                                                placeholder="Nhập email bạn đã đăng ký"
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
                                                <p>Vui lòng đợi {rateLimitCountdown}s trước khi yêu cầu mã mới.</p>
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
                                                className={cx('form-input', 'otp-input', {
                                                    'input-error': touchedOtp && otpError,
                                                })}
                                                placeholder="••••••"
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
                                                Mã đã gửi đến <strong>{email}</strong>. Kiểm tra cả thư rác nếu chưa thấy nhé!
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
                                                    placeholder="Tối thiểu 6 ký tự"
                                                    value={newPassword}
                                                    onChange={(e) => {
                                                        setNewPassword(e.target.value);
                                                        if (passwordError) setPasswordError('');
                                                        if (touchedConfirmPassword && confirmPassword) {
                                                            setConfirmPasswordError(
                                                                validateConfirmPassword(confirmPassword, e.target.value),
                                                            );
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
                                                        setConfirmPasswordError(
                                                            validateConfirmPassword(confirmPassword, newPassword),
                                                        );
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
                                    <span>Bạn đã nhớ mật khẩu?</span>
                                    <Link href="/auth/login" className={cx('auth-link')}>
                                        Đăng nhập ngay
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
