'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import classNames from 'classnames/bind';
import styles from './page.module.scss';
import { requestOrderLookupOtp, verifyOrderLookupOtp } from '@/services/orderService';
import { useCheckoutOrder } from '@/services/orderService';
import OrderDetail from '@/components/OrderDetail/OrderDetail';
import { AlertCircleIcon, LoaderIcon, PackageIcon, ShieldCheckIcon } from '@/components/Icons';

const cx = classNames.bind(styles);

const GUEST_ACCESS_KEY = 'guestCheckoutAccess';

const saveGuestAccess = (orderCode: string, email: string) => {
    if (typeof window === 'undefined') return;
    try {
        const raw = window.localStorage.getItem(GUEST_ACCESS_KEY);
        const data: Record<string, { email: string; ts: number }> = raw ? JSON.parse(raw) : {};
        data[orderCode] = { email: email.trim().toLowerCase(), ts: Date.now() };
        const trimmedEntries = Object.entries(data)
            .sort((a, b) => b[1].ts - a[1].ts)
            .slice(0, 20);
        const normalized: Record<string, { email: string; ts: number }> = {};
        trimmedEntries.forEach(([code, value]) => {
            normalized[code] = value;
        });
        window.localStorage.setItem(GUEST_ACCESS_KEY, JSON.stringify(normalized));
    } catch (error) {
        console.warn('Failed to persist guest lookup access', error);
    }
};

const getGuestAccess = (orderCode: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
        const raw = window.localStorage.getItem(GUEST_ACCESS_KEY);
        if (!raw) return null;
        const data: Record<string, { email: string; ts: number }> = JSON.parse(raw);
        return data[orderCode]?.email || null;
    } catch (error) {
        console.warn('Failed to read guest lookup access', error);
        return null;
    }
};

interface LookupPageProps {
    initialOrderCode?: string | null;
    initialEmail?: string | null;
    initialToken?: string | null;
}

type Step = 'form' | 'otp' | 'result';

const OrderLookupPage: React.FC<LookupPageProps> = ({ initialOrderCode, initialEmail, initialToken }) => {
    const router = useRouter();
    const [orderCodeInput, setOrderCodeInput] = React.useState(initialOrderCode || '');
    const [emailInput, setEmailInput] = React.useState(initialEmail || '');
    const [submittedOrderCode, setSubmittedOrderCode] = React.useState<string | null>(initialOrderCode || null);
    const [submittedEmail, setSubmittedEmail] = React.useState<string | null>(initialEmail || null);
    const [otpInput, setOtpInput] = React.useState('');
    const [otpCountdown, setOtpCountdown] = React.useState<number>(0);
    const [requestingOtp, setRequestingOtp] = React.useState(false);
    const [verifyingOtp, setVerifyingOtp] = React.useState(false);
    const [verificationToken, setVerificationToken] = React.useState<string | null>(initialToken || null);
    const [apiError, setApiError] = React.useState<string | null>(null);
    const [otpError, setOtpError] = React.useState<string | null>(null);
    const [mounted, setMounted] = React.useState(false);

    const hasInitialToken = Boolean(initialOrderCode && initialToken);
    const [step, setStep] = React.useState<Step>(hasInitialToken ? 'result' : 'form');

    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        if (!mounted) return;
        if (!orderCodeInput || initialToken) return;
        const storedEmail = getGuestAccess(orderCodeInput);
        if (storedEmail) {
            setEmailInput((prev) => prev || storedEmail);
        }
    }, [orderCodeInput, mounted, initialToken]);

    React.useEffect(() => {
        if (!otpCountdown) return;
        const timer = setInterval(() => {
            setOtpCountdown((value) => (value > 0 ? value - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [otpCountdown]);

    const formatOrderCode = (code: string) => code.trim().toUpperCase();

    const handleRequestOtp = async (event: React.FormEvent) => {
        event.preventDefault();
        setApiError(null);
        const formattedCode = formatOrderCode(orderCodeInput);
        const normalizedEmail = emailInput.trim().toLowerCase();

        if (!formattedCode) {
            setApiError('Vui lòng nhập mã đơn hàng');
            return;
        }
        if (!normalizedEmail) {
            setApiError('Vui lòng nhập email đã dùng để đặt hàng');
            return;
        }

        setRequestingOtp(true);
        try {
            const response = await requestOrderLookupOtp({
                orderCode: formattedCode,
                email: normalizedEmail,
            });
            if (response.success) {
                setSubmittedOrderCode(formattedCode);
                setSubmittedEmail(normalizedEmail);
                setStep('otp');
                setOtpInput('');
                setOtpError(null);
                setOtpCountdown(60);
                saveGuestAccess(formattedCode, normalizedEmail);
            } else {
                setApiError(response.message || 'Không thể gửi OTP. Vui lòng thử lại.');
            }
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || 'Không thể gửi OTP. Vui lòng thử lại.';
            setApiError(message);
        } finally {
            setRequestingOtp(false);
        }
    };

    const handleVerifyOtp = async (event: React.FormEvent) => {
        event.preventDefault();
        setOtpError(null);

        if (!submittedOrderCode || !submittedEmail) {
            setOtpError('Vui lòng yêu cầu mã OTP trước.');
            return;
        }

        if (!otpInput.trim()) {
            setOtpError('Vui lòng nhập mã OTP');
            return;
        }

        setVerifyingOtp(true);
        try {
            const response = await verifyOrderLookupOtp({
                orderCode: submittedOrderCode,
                email: submittedEmail,
                otp: otpInput.trim(),
            });

            if (response.success) {
                setVerificationToken(response.data.token);
                setStep('result');
                setOtpCountdown(0);
                setApiError(null);
                setOtpError(null);
                saveGuestAccess(submittedOrderCode, submittedEmail);
            } else {
                setOtpError(response.message || 'OTP không chính xác');
            }
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || 'OTP không chính xác hoặc đã hết hạn.';
            setOtpError(message);
        } finally {
            setVerifyingOtp(false);
        }
    };

    const canFetchOrder = step === 'result' && submittedOrderCode && verificationToken;

    const {
        data: checkoutData,
        error: checkoutError,
        isLoading: checkoutLoading,
    } = useCheckoutOrder(
        canFetchOrder ? submittedOrderCode : null,
        canFetchOrder ? verificationToken : null,
        submittedEmail || undefined
    );

    React.useEffect(() => {
        if (!checkoutError) return;
        const status = (checkoutError as any)?.response?.status;
        if (status === 403) {
            setOtpError(
                (checkoutError as any)?.response?.data?.message ||
                    'Phiên xác minh đã hết hạn. Vui lòng yêu cầu mã OTP mới.'
            );
            setStep('otp');
            setVerificationToken(null);
        }
    }, [checkoutError]);

    const renderFormStep = () => (
        <div className={cx('card')}>
            <h1>Tra cứu đơn hàng</h1>
            <p>Nhập mã đơn hàng và email đã dùng để mua hàng. Chúng tôi sẽ gửi mã OTP xác minh về email của bạn.</p>
            {apiError && (
                <div className={cx('alert')}>
                    <AlertCircleIcon size={18} />
                    <span>{apiError}</span>
                </div>
            )}
            <form className={cx('form')} onSubmit={handleRequestOtp}>
                <label htmlFor="lookup-order-code">Mã đơn hàng *</label>
                <input
                    id="lookup-order-code"
                    value={orderCodeInput}
                    onChange={(e) => setOrderCodeInput(e.target.value)}
                    placeholder="Ví dụ: ARW10159"
                    autoComplete="off"
                />
                <label htmlFor="lookup-email">Email đã mua hàng *</label>
                <input
                    id="lookup-email"
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="off"
                />
                <button
                    type="submit"
                    className={cx('primary-button')}
                    disabled={requestingOtp}
                >
                    {requestingOtp ? 'Đang gửi...' : 'Gửi mã OTP'}
                </button>
            </form>
        </div>
    );

    const renderOtpStep = () => (
        <div className={cx('card')}>
            <h1>Xác minh OTP</h1>
            <p>
                Mã OTP đã được gửi tới <strong>{submittedEmail}</strong>. Nhập mã gồm 6 chữ số để tiếp tục.
            </p>
            {otpError && (
                <div className={cx('alert')}>
                    <AlertCircleIcon size={18} />
                    <span>{otpError}</span>
                </div>
            )}
            <form className={cx('form')} onSubmit={handleVerifyOtp}>
                <label htmlFor="lookup-otp">Mã OTP *</label>
                <input
                    id="lookup-otp"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Nhập 6 chữ số"
                    maxLength={6}
                    autoComplete="one-time-code"
                />
                <button
                    type="submit"
                    className={cx('primary-button')}
                    disabled={verifyingOtp || otpInput.length !== 6}
                >
                    {verifyingOtp ? 'Đang xác minh...' : 'Xác minh & xem đơn hàng'}
                </button>
            </form>
            <div className={cx('resend-row')}>
                <span>Bạn không nhận được OTP?</span>
                <button
                    type="button"
                    disabled={otpCountdown > 0 || requestingOtp}
                    onClick={handleRequestOtp}
                >
                    {otpCountdown > 0 ? `Gửi lại OTP sau ${otpCountdown}s` : 'Gửi lại OTP'}
                </button>
            </div>
        </div>
    );

    const handleStartNewLookup = React.useCallback(() => {
        setStep('form');
        setVerificationToken(null);
        setSubmittedOrderCode(null);
        setSubmittedEmail(null);
        setOrderCodeInput('');
        setEmailInput('');
        setOtpInput('');
        setOtpCountdown(0);
        setApiError(null);
        setOtpError(null);
        router.push('/orders/lookup');
    }, [router]);

    const renderResultStep = () => (
        <div className={cx('order-wrapper')}>
            {/* <div className={cx('info-banner')}>
                <ShieldCheckIcon size={18} />
                <div>
                    <strong>Đơn hàng #{submittedOrderCode}</strong>
                    <p>Thông tin chỉ hiển thị trong phiên này. Vui lòng lưu lại sau khi xem.</p>
                </div>
            </div> */}
            {checkoutLoading ? (
                <div className={cx('card')}>
                    <LoaderIcon size={36} />
                    <p>Đang tải thông tin đơn hàng...</p>
                </div>
            ) : checkoutError ? (
                <div className={cx('card')}>
                    <AlertCircleIcon size={32} />
                    <p>
                        {checkoutError?.response?.data?.message ||
                            checkoutError?.message ||
                            'Không thể tải đơn hàng. Vui lòng thử lại.'}
                    </p>
                    <button
                        className={cx('primary-button')}
                        onClick={handleStartNewLookup}
                    >
                        Thực hiện tra cứu khác
                    </button>
                </div>
            ) : checkoutData?.data?.order ? (
                <>
                    <OrderDetail
                        orderCode={checkoutData.data.order.orderId}
                        guestOrder={checkoutData.data.order}
                        mode="guest"
                    />
                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <button className={cx('primary-button')} onClick={handleStartNewLookup}>
                            Thực hiện tra cứu khác
                        </button>
                    </div>
                </>
            ) : (
                <div className={cx('card')}>
                    <PackageIcon size={32} />
                    <p>Không tìm thấy thông tin đơn hàng.</p>
                    <button className={cx('primary-button')} onClick={handleStartNewLookup}>
                        Thực hiện tra cứu khác
                    </button>
                </div>
            )}
        </div>
    );

    if (!mounted) {
        return null;
    }

    return (
        <div className={cx('lookup-page')}>
            {step === 'form' && renderFormStep()}
            {step === 'otp' && renderOtpStep()}
            {step === 'result' && renderResultStep()}
        </div>
    );
};

export default OrderLookupPage;

