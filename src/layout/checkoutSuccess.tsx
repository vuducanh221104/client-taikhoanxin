'use client';

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import classNames from 'classnames/bind';
import styles from '@/app/(user)/checkout/success/bill.module.scss';
import bankInfo from '@/data/mockBankInfo.json';
import { CloseIcon, LockIcon, AlertCircleIcon } from '@/components/Icons';
import { createPortal } from 'react-dom';
import { useCheckoutOrder, autoCreateLookupToken } from '@/services/orderService';

const cx = classNames.bind(styles);
const BANK_INFO = bankInfo;

const CheckoutSuccessLayout: React.FC = () => {
    const router = useRouter();
    const currentUser = useSelector((state: RootState) => state.auth.login.currentUser);
    const [mounted, setMounted] = useState(false);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [emailInput, setEmailInput] = useState('');
    const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
    const [verificationError, setVerificationError] = useState<string | null>(null);
    const [checkedStoredEmail, setCheckedStoredEmail] = useState(false);
    const [hasRedirectedToDetails, setHasRedirectedToDetails] = useState(false);
    const [loginRedirectUrl, setLoginRedirectUrl] = useState('/auth/login');
    const [isOriginalSession, setIsOriginalSession] = useState(false);
    const [sseError, setSseError] = useState(false); // Track SSE error state
    const [sseKey, setSseKey] = useState(0); // Force SSE re-connect when changed
    const searchParams = useSearchParams();
    const orderCodeParam = searchParams.get('order');
    const checkoutTokenParam = searchParams.get('token') || searchParams.get('key');
    
    // Ref để lưu checkout order key để có thể mutate
    const checkoutOrderKeyRef = useRef<string | null>(null);

    // Nếu có token và orderCode → cho phép fetch (backend sẽ check token)
    // Guest không cần email nếu token hợp lệ - backend đã xử lý check token
    const shouldFetchCheckout = Boolean(
        orderCodeParam && checkoutTokenParam
    );

    const checkoutSWRConfig = useMemo(
        () => ({
            shouldRetryOnError: false,
            errorRetryCount: 0,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }),
        [],
    );

    const {
        data: checkoutData,
        error: checkoutError,
        isLoading: checkoutLoading,
        mutate: mutateCheckoutOrder,
    } = useCheckoutOrder(
        shouldFetchCheckout ? orderCodeParam : null,
        shouldFetchCheckout ? checkoutTokenParam : null,
        submittedEmail || null,
        checkoutSWRConfig,
    );

    // Store checkout order key for mutation
    useEffect(() => {
        if (shouldFetchCheckout && orderCodeParam && checkoutTokenParam) {
            const params = new URLSearchParams({
                token: checkoutTokenParam,
            });
            if (submittedEmail) {
                params.append('email', submittedEmail);
            }
            checkoutOrderKeyRef.current = `/api/v1/orders/checkout/${orderCodeParam}?${params.toString()}`;
        }
    }, [shouldFetchCheckout, orderCodeParam, checkoutTokenParam, submittedEmail]);

    // Re-fetch checkout order when user submits verification email (applies to both guest and logged-in)
    useEffect(() => {
        if (!shouldFetchCheckout || !submittedEmail) return;
        mutateCheckoutOrder(undefined, { revalidate: true });
    }, [shouldFetchCheckout, submittedEmail, mutateCheckoutOrder]);

    const order = checkoutData?.data?.order;
    const isExpired = checkoutData?.data?.isExpired;
    const remainingSeconds = checkoutData?.data?.remainingSeconds ?? 0;

    const getStoredGuestEmail = useCallback((orderCode: string) => {
        if (typeof window === 'undefined') return null;
        try {
            const raw = window.localStorage.getItem('guestCheckoutAccess');
            if (!raw) return null;
            const data: Record<string, { email: string; ts: number }> = JSON.parse(raw);
            const entry = data[orderCode];
            return entry?.email || null;
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn('Failed to read guest checkout access', err);
            }
            return null;
        }
    }, []);

    const storeGuestEmail = useCallback((orderCode: string, email: string) => {
        if (typeof window === 'undefined') return;
        try {
            const key = 'guestCheckoutAccess';
            const raw = window.localStorage.getItem(key);
            const data: Record<string, { email: string; ts: number }> = raw ? JSON.parse(raw) : {};
            data[orderCode] = { email: email.trim().toLowerCase(), ts: Date.now() };
            const sortedEntries = Object.entries(data)
                .sort((a, b) => b[1].ts - a[1].ts)
                .slice(0, 20);
            const trimmedData: Record<string, { email: string; ts: number }> = {};
            sortedEntries.forEach(([code, value]) => {
                trimmedData[code] = value;
            });
            window.localStorage.setItem(key, JSON.stringify(trimmedData));
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn('Failed to store guest checkout access', err);
            }
        }
    }, []);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        const next = `${window.location.pathname}${window.location.search}`;
        setLoginRedirectUrl(`/auth/login?redirect=${encodeURIComponent(next)}`);
    }, []);

    useEffect(() => {
        if (!currentUser && orderCodeParam && typeof window !== 'undefined') {
            const storedEmail = getStoredGuestEmail(orderCodeParam);
            if (storedEmail) {
                setEmailInput(storedEmail);

                const sessionKey = `order_created_${orderCodeParam}`;
                const wasJustCreated = window.sessionStorage.getItem(sessionKey);

                // Guest quay lại: tự động dùng email từ localStorage, không cần form verification
                // Chỉ cần set submittedEmail để có thể fetch order
                if (wasJustCreated) {
                    setSubmittedEmail(storedEmail);
                    setIsOriginalSession(true);
                } else {
                    // Guest quay lại sau khi đã checkout - tự động set email để fetch
                    setSubmittedEmail(storedEmail);
                }
            }
        }
        setCheckedStoredEmail(true);
    }, [currentUser, orderCodeParam, getStoredGuestEmail]);

    useEffect(() => {
        if (!mounted) return;

        if (!orderCodeParam || !checkoutTokenParam) {
            setValidationError('Thiếu tham số xác thực đơn hàng hoặc tham số không hợp lệ.');
        } else {
            setValidationError(null);
        }
    }, [mounted, orderCodeParam, checkoutTokenParam]);

    // Helper function to redirect to order detail/lookup page
    const redirectToOrderDetail = useCallback(
        (targetOrderCode: string | number) => {
            if (hasRedirectedToDetails) return;
            setHasRedirectedToDetails(true);

            if (currentUser) {
                const targetPath = targetOrderCode
                    ? `/account/orders/${targetOrderCode}`
                    : '/account/orders';

                if (typeof window !== 'undefined') {
                    window.location.href = targetPath;
                } else {
                    router.push(targetPath);
                }
            } else if (targetOrderCode && checkoutTokenParam && submittedEmail) {
                // Tự động tạo lookupToken từ checkoutToken khi thanh toán thành công
                autoCreateLookupToken({
                    orderCode: targetOrderCode.toString(),
                    checkoutToken: checkoutTokenParam,
                    email: submittedEmail,
                })
                    .then((lookupResponse) => {
                        if (lookupResponse.success && lookupResponse.data.token) {
                            // Redirect với lookupToken mới
                            const params = new URLSearchParams({
                                token: lookupResponse.data.token,
                                email: submittedEmail,
                            });
                            router.push(`/orders/lookup/${targetOrderCode}?${params.toString()}`);
                        } else {
                            // Fallback: redirect với checkoutToken (sẽ cần tra cứu lại)
                            const params = new URLSearchParams({
                                token: checkoutTokenParam,
                                email: submittedEmail,
                            });
                            router.push(`/orders/lookup/${targetOrderCode}?${params.toString()}`);
                        }
                    })
                    .catch((error) => {
                        // Nếu auto-verify thất bại, fallback về checkoutToken
                        console.error('Failed to auto-create lookup token:', error);
                        const params = new URLSearchParams({
                            token: checkoutTokenParam,
                            email: submittedEmail,
                        });
                        router.push(`/orders/lookup/${targetOrderCode}?${params.toString()}`);
                    });
            }
        },
        [
            currentUser,
            checkoutTokenParam,
            submittedEmail,
            router,
            hasRedirectedToDetails,
        ],
    );

    // Function to check payment status and redirect if paid
    const checkPaymentStatusAndRedirect = useCallback(() => {
        if (
            !mounted ||
            !order ||
            isExpired ||
            (!currentUser && !submittedEmail) ||
            hasRedirectedToDetails
        ) {
            return;
        }

        const businessOrderId = (order as any).orderId;
        const paymentStatus = (order as any).paymentStatus;

        // If payment is already paid, redirect immediately
        if (paymentStatus === 'paid' || paymentStatus === 'refunded') {
            redirectToOrderDetail(businessOrderId);
            return true; // Return true if redirected
        }
        return false; // Return false if not redirected
    }, [
        mounted,
        order,
        isExpired,
        currentUser,
        submittedEmail,
        hasRedirectedToDetails,
        redirectToOrderDetail,
    ]);

    // Check payment status immediately when order is loaded (for when user returns after payment)
    useEffect(() => {
        checkPaymentStatusAndRedirect();
    }, [
        mounted,
        order,
        isExpired,
        currentUser,
        submittedEmail,
        hasRedirectedToDetails,
        redirectToOrderDetail,
        checkPaymentStatusAndRedirect,
    ]);

    // Handle BFCache (Back/Forward Cache) - Safari restore page from cache
    useEffect(() => {
        if (!mounted || hasRedirectedToDetails || !shouldFetchCheckout) {
            return;
        }

        const handlePageShow = (event: PageTransitionEvent) => {
            // When page is restored from BFCache (event.persisted = true)
            if (event.persisted) {
                // eslint-disable-next-line no-console
                console.log('[Checkout Success] Page restored from BFCache, re-checking payment status');
                
                // Force re-fetch order data to check payment status
                if (checkoutOrderKeyRef.current) {
                    mutateCheckoutOrder(undefined, { revalidate: true });
                }
                
                // Reset SSE error state and force SSE re-connection
                setSseError(false);
                setSseKey((prev) => prev + 1); // Force SSE useEffect to re-run
                
                // Check payment status after a delay to allow data to fetch
                setTimeout(() => {
                    checkPaymentStatusAndRedirect();
                }, 500);
            }
        };

        window.addEventListener('pageshow', handlePageShow);

        return () => {
            window.removeEventListener('pageshow', handlePageShow);
        };
    }, [
        mounted,
        hasRedirectedToDetails,
        shouldFetchCheckout,
        mutateCheckoutOrder,
        checkPaymentStatusAndRedirect,
    ]);

    // Handle visibility change (when user returns to tab after payment on mobile)
    useEffect(() => {
        if (!mounted || hasRedirectedToDetails || !shouldFetchCheckout) {
            return;
        }

        const handleVisibilityChange = () => {
            // When tab becomes visible again (user returns from banking app)
            if (document.visibilityState === 'visible') {
                // Force re-fetch order data to check payment status
                if (checkoutOrderKeyRef.current) {
                    mutateCheckoutOrder(undefined, { revalidate: true });
                }
                
                // Also check current order status immediately
                setTimeout(() => {
                    checkPaymentStatusAndRedirect();
                }, 500); // Small delay to allow data to fetch
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [
        mounted,
        hasRedirectedToDetails,
        shouldFetchCheckout,
        mutateCheckoutOrder,
        checkPaymentStatusAndRedirect,
    ]);

    // Polling fallback: Check payment status periodically (every 5 seconds)
    // CHỈ BẬT KHI SSE LỖI - không chạy song song với SSE
    useEffect(() => {
        // Chỉ start polling nếu SSE đã lỗi
        if (!sseError) {
            return;
        }

        if (
            !mounted ||
            !order ||
            isExpired ||
            (!currentUser && !submittedEmail) ||
            hasRedirectedToDetails
        ) {
            return;
        }

        const paymentStatus = (order as any).paymentStatus;
        
        // Only start polling if payment is not yet paid
        if (paymentStatus === 'paid' || paymentStatus === 'refunded') {
            return;
        }

        // eslint-disable-next-line no-console
        console.log('[Checkout Success] Starting polling fallback (SSE error detected)');

        const pollInterval = setInterval(() => {
            // Re-fetch order data to check payment status
            if (checkoutOrderKeyRef.current) {
                mutateCheckoutOrder(undefined, { revalidate: true });
            }
            
            // Check payment status after a short delay
            setTimeout(() => {
                const wasRedirected = checkPaymentStatusAndRedirect();
                if (wasRedirected) {
                    clearInterval(pollInterval);
                }
            }, 500);
        }, 5000); // Poll every 5 seconds

        return () => {
            clearInterval(pollInterval);
        };
    }, [
        sseError, // Chỉ chạy khi SSE error
        mounted,
        order,
        isExpired,
        currentUser,
        submittedEmail,
        hasRedirectedToDetails,
        mutateCheckoutOrder,
        checkPaymentStatusAndRedirect,
    ]);

    // SSE connection for real-time payment status updates
    useEffect(() => {
        if (
            !mounted ||
            !order ||
            isExpired ||
            (!currentUser && !submittedEmail) ||
            hasRedirectedToDetails
        ) {
            return;
        }

        const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:4000';
        const orderInternalId = (order as any)._id;
        const businessOrderId = (order as any).orderId;

        if (!backendUrl || !orderInternalId) {
            return;
        }

        const streamUrl = `${backendUrl}/api/v1/orders/${orderInternalId}/status-stream`;

        let eventSource: EventSource | null = null;

        try {
            eventSource = new EventSource(streamUrl);

            // Reset SSE error state when connection opens successfully
            setSseError(false);

            eventSource.addEventListener('status', (event: MessageEvent) => {
                try {
                    const data = JSON.parse(event.data) as {
                        orderId?: string | number;
                        orderStatus?: string;
                        paymentStatus?: string;
                    };

                    if (data.paymentStatus === 'paid' || data.paymentStatus === 'refunded') {
                        const targetOrderCode = data.orderId || businessOrderId;

                        if (eventSource) {
                            eventSource.close();
                        }

                        redirectToOrderDetail(targetOrderCode);
                    }
                } catch (err) {
                    console.error('Failed to parse SSE status event:', err);
                }
            });

            eventSource.addEventListener('end', (event: MessageEvent) => {
                try {
                    const data = JSON.parse(event.data) as {
                        reason?: string;
                        status?: {
                            paymentStatus?: string;
                            orderId?: string | number;
                        };
                    };

                    if (data.status?.paymentStatus === 'paid' || data.status?.paymentStatus === 'refunded') {
                        const targetOrderCode = data.status.orderId || businessOrderId;
                        redirectToOrderDetail(targetOrderCode);
                    }

                    if (eventSource) {
                        eventSource.close();
                    }
                } catch (err) {
                    console.error('Failed to parse SSE end event:', err);
                }
            });

            eventSource.addEventListener('error', () => {
                // SSE connection error - enable polling as fallback
                // eslint-disable-next-line no-console
                console.warn('[Checkout Success] SSE connection error, enabling polling fallback');
                setSseError(true);
                
                if (eventSource) {
                    eventSource.close();
                }
            });

            // Set timeout to detect if SSE doesn't connect within 10 seconds
            const errorTimeout = setTimeout(() => {
                if (eventSource && eventSource.readyState === EventSource.CONNECTING) {
                    // eslint-disable-next-line no-console
                    console.warn('[Checkout Success] SSE connection timeout, enabling polling fallback');
                    setSseError(true);
                    if (eventSource) {
                        eventSource.close();
                    }
                }
            }, 10000);

            // Clear timeout when connection is established
            eventSource.addEventListener('open', () => {
                clearTimeout(errorTimeout);
            });
        } catch (err) {
            console.error('Failed to open SSE connection:', err);
            setSseError(true);
        }

        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [
        mounted,
        order,
        isExpired,
        currentUser,
        checkoutTokenParam,
        submittedEmail,
        hasRedirectedToDetails,
        redirectToOrderDetail,
        sseKey, // Re-connect SSE when sseKey changes (BFCache restore)
    ]);

    useEffect(() => {
        if (isQrModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isQrModalOpen]);

    const displayOrder = useMemo(() => {
        if (!order) return null;
        const items =
            (order as any).items?.map((item: any, index: number) => {
                const populatedProduct = item.productId || item.product_id;
                const productId =
                    (typeof populatedProduct === 'object' && populatedProduct?._id) ||
                    (typeof item.product_id === 'string' ? item.product_id : undefined) ||
                    `${index}`;
                const productName =
                    item.fullName ||
                    (typeof populatedProduct === 'object' &&
                        (populatedProduct?.name || populatedProduct?.fullName)) ||
                    'Sản phẩm';
                const productImage =
                    (typeof populatedProduct === 'object' &&
                        (populatedProduct?.image?.[0] ||
                            populatedProduct?.thumbnail ||
                            populatedProduct?.images?.[0])) ||
                    (Array.isArray(item.image) ? item.image[0] : item.image) ||
                    item.productImage ||
                    item.productThumbnail;

                return {
                    id: productId,
                    productName,
                    quantity: item.quantity || 1,
                    price: item.price || 0,
                    image: productImage || '/products/product-2.png',
                };
            }) || [];

        return {
            code: (order as any).orderId,
            createdAt: (order as any).createdAt,
            customerName: (order as any).customerFullName || 'Quý khách',
            customerPhone: (order as any).phoneUserOrder,
            customerEmail: (order as any).emailUserOrder,
            customerNote: (order as any).userNote,
            items,
            subtotal: (order as any).totalDiscountBefore,
            coupon:
                (order as any).discountCode && (order as any).totalDiscount > 0
                    ? {
                          code: (order as any).discountCode,
                          discount: (order as any).totalDiscount,
                      }
                    : null,
            total: (order as any).totalPrice,
            paymentMethodLabel: 'Chuyển khoản ngân hàng',
            vietQR: (order as any).vietQR,
        };
    }, [order]);

    useEffect(() => {
        // Xử lý lỗi 403 - yêu cầu email verification
        // Set verificationError cho cả guest và user đã login (khi user không phải owner)
        if (checkoutError) {
            const status = (checkoutError as any)?.response?.status;
            const errorCode = (checkoutError as any)?.response?.data?.code;
            
            // Nếu là lỗi yêu cầu email verification (403)
            if (status === 403) {
                // Nếu đã submit email nhưng sai → hiển thị "Sai email"
                if (submittedEmail && (errorCode === 'ORDER_EMAIL_VERIFICATION_REQUIRED' || !errorCode)) {
                    setVerificationError('Không tìm thấy đơn hàng với email này. Vui lòng kiểm tra lại và thử lại.');                    ;
                    return;
                }
                
                // Chưa submit email hoặc lỗi khác → hiển thị message từ backend
                const message =
                    (checkoutError as any)?.response?.data?.message ||
                    'Chúng tôi không thể xác minh địa chỉ email bạn đã cung cấp. Vui lòng thử lại.';
                setVerificationError(message);
                return;
            }
        }

        // Clear error khi có order thành công
        if (displayOrder) {
            setVerificationError(null);
        }
    }, [checkoutError, currentUser, displayOrder, submittedEmail]);

    useEffect(() => {
        if (!currentUser && displayOrder && submittedEmail && orderCodeParam) {
            storeGuestEmail(orderCodeParam, submittedEmail);
        }
    }, [currentUser, displayOrder, submittedEmail, orderCodeParam, storeGuestEmail]);

    const formatPrice = (value?: number) => (value ?? 0).toLocaleString('vi-VN');
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    const formatDateTime = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} - ${hours}:${minutes}`;
    };

    const validateEmailFormat = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleVerifyEmail = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmed = emailInput.trim();
        if (!trimmed) {
            setVerificationError('Vui lòng nhập địa chỉ email');
            return;
        }
        if (!validateEmailFormat(trimmed)) {
            setVerificationError('Địa chỉ email không hợp lệ');
            return;
        }
        setVerificationError(null);
        const normalized = trimmed.toLowerCase();
        setSubmittedEmail(normalized);
        if (orderCodeParam) {
            storeGuestEmail(orderCodeParam, normalized);
        }
    };

    if (!mounted) {
        return null;
    }

    const apiErrorMessage =
        (checkoutError as any)?.response?.data?.message ||
        (checkoutError as any)?.response?.data?.error ||
        undefined;
    // Set verificationErrorMessage khi có lỗi 403 yêu cầu email verification
    // Áp dụng cho cả guest và user đã login (khi user không phải owner)
    // Hiển thị trong form verification thay vì error state chung
    const verificationErrorMessage =
        (checkoutError as any)?.response?.status === 403 &&
        ((checkoutError as any)?.response?.data?.code === 'ORDER_EMAIL_VERIFICATION_REQUIRED' || !submittedEmail)
            ? apiErrorMessage
            : null;
    const errorMessage =
        validationError ||
        (verificationErrorMessage ? null : apiErrorMessage) ||
        (verificationErrorMessage ? null : checkoutError?.message);
    const requiresLogin = Boolean(errorMessage && errorMessage.toLowerCase().includes('đăng nhập'));
    // Hiển thị form verification khi:
    // 1. Guest và backend yêu cầu email (token không hợp lệ hoặc đã hết hạn)
    // 2. User đã login nhưng không phải owner và backend yêu cầu email verification
    const hasVerificationError = Boolean(verificationError || (checkoutError && (checkoutError as any)?.response?.status === 403));
    const showVerificationForm =
        checkedStoredEmail &&
        (!displayOrder || hasVerificationError) &&
        !validationError &&
        hasVerificationError;
    const shouldShowExpiredState =
        !checkoutLoading && Boolean(isExpired) && !showVerificationForm;
    const shouldShowError =
        !showVerificationForm &&
        !shouldShowExpiredState &&
        (!!errorMessage || (!checkoutLoading && !displayOrder));
    const expiredOrderCode = displayOrder?.code || orderCodeParam || '';

    return (
        <div className={cx('bill-page')}>
            <div className={cx('bill-container')}>
                {showVerificationForm && (
                    <div className={cx('verification-state')}>
                        {(verificationError || (checkoutError && (checkoutError as any)?.response?.status === 403)) && (
                            <div className={cx('verification-banner')}>
                                {verificationError || 
                                    ((checkoutError as any)?.response?.data?.message || 
                                    'Chúng tôi không thể xác minh địa chỉ email bạn đã cung cấp. Vui lòng thử lại.')}
                            </div>
                        )}
                        <p className={cx('verification-message')}>
                            Để xem đơn hàng này, bạn phải xác minh địa chỉ email được
                            liên kết với đơn hàng.
                        </p>
                        <form className={cx('verification-form')} onSubmit={handleVerifyEmail}>
                            <label htmlFor="verification-email">Địa chỉ email *</label>
                            <input
                                id="verification-email"
                                type="email"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                placeholder="you@example.com"
                                required
                            />
                            <button
                                type="submit"
                                className={cx('btn', 'primary')}
                                disabled={!emailInput.trim()}
                            >
                                Xác minh
                            </button>
                        </form>
                    </div>
                )}

                {checkoutLoading ? (
                    <div className={cx('error-state')}>
                        <div className={cx('loading-card')}>
                            <div className={cx('loading-spinner')}>
                                <div className={cx('spinner-circle')}></div>
                            </div>
                            <h2 className={cx('loading-title')}>Đang tải thông tin đơn hàng</h2>
                            <p className={cx('loading-text')}>
                                Vui lòng không thoát trang trong lúc này. Hệ thống đang kiểm tra trạng thái thanh toán của bạn.
                            </p>
                        </div>
                    </div>
                ) : shouldShowExpiredState ? (
                    <div className={cx('error-state')}>
                        <div className={cx('expired-card')}>
                            <span className={cx('expired-pill')}>
                                <AlertCircleIcon size={16} />
                                Phiên thanh toán đã hết hạn
                            </span>
                            <h2 className={cx('expired-title')}>
                                Phiên thanh toán của bạn đã hết hạn
                            </h2>
                            <p className={cx('expired-text')}>
                                {expiredOrderCode
                                    ? `Đơn hàng #${expiredOrderCode} đã vượt quá thời gian giữ chỗ nên hệ thống đã hủy phiên thanh toán.`
                                    : 'Phiên thanh toán này đã kết thúc do quá thời gian cho phép. Bạn có thể tạo lại đơn hàng để tiếp tục mua sản phẩm.'}
                                <br />
                                Vui lòng đặt lại đơn hàng để tiếp tục.
                            </p>
                            <div className={cx('expired-actions')}>
                                <Link href="/" className={cx('btn', 'primary')}>
                                    Đặt lại đơn hàng
                                </Link>
                                <Link href="/" className={cx('btn', 'ghost')}>
                                    Về trang chủ
                                </Link>
                            </div>
                            <p className={cx('expired-helper')}>
                                Cần hỗ trợ?{' '}
                                <Link href="https://zalo.me/0377775528">Liên hệ Zalo</Link>
                            </p>
                        </div>
                    </div>
                ) : shouldShowError ? (
                    <div className={cx('error-state')}>
                        <div className={cx('access-card')}>
                            <div className={cx('access-icon')}>
                                <LockIcon size={28} />
                            </div>
                            <h2 className={cx('access-title')}>Không thể truy cập đơn hàng</h2>
                            <p className={cx('access-text')}>
                                {errorMessage ||
                                    (requiresLogin
                                        ? 'Bạn cần đăng nhập bằng đúng tài khoản đã tạo đơn để tiếp tục xem chi tiết.'
                                        : 'Đơn hàng này không tồn tại hoặc bạn không có quyền truy cập.')}
                            </p>
                            <div className={cx('access-actions')}>
                                <Link
                                    href={requiresLogin ? loginRedirectUrl : '/account/orders'}
                                    className={cx('btn', 'primary')}
                                >
                                    {requiresLogin
                                        ? 'Đăng nhập đúng tài khoản'
                                        : 'Quay lại lịch sử đơn'}
                                </Link>
                                <Link href="/account/orders" className={cx('btn', 'ghost')}>
                                    Xem đơn hàng của tôi
                                </Link>
                            </div>
                            <p className={cx('access-helper')}>
                                Cần trợ giúp?{' '}
                                <Link href="/help/faq/support">
                                    Liên hệ CSKH
                                </Link>
                            </p>
                        </div>
                    </div>
                ) : displayOrder ? (
                    <div className={cx('bill-card')}>
                        <div className={cx('bill-content')}>
                            <h2 className={cx('bill-thank-you')}>Cảm ơn bạn đã đặt hàng</h2>
                            <p className={cx('bill-greeting')}>
                                Xin chào {displayOrder.customerName || 'Quý khách'},
                            </p>
                            <p className={cx('bill-message')}>
                                Chúng tôi đã nhận được đơn hàng của bạn và đang chờ xác nhận thanh toán.
                                Đơn hàng sẽ tự động hủy sau{' '}
                                {checkoutData?.data?.paymentWindowMinutes || 15} phút nếu chưa nhận
                                được chuyển khoản.
                            </p>
                            {isExpired && (
                                <div className={cx('bill-note-critical')}>
                                    Đơn hàng này đã quá hạn thanh toán. Vui lòng tạo đơn mới để tiếp tục.
                                </div>
                            )}

                            <div className={cx('bill-two-columns')}>
                                <div className={cx('bill-left-column')}>
                                    <div className={cx('bill-qr-section')}>
                                        <h3 className={cx('bill-section-title')}>
                                            QUÉT MÃ QR ĐỂ THANH TOÁN
                                        </h3>
                                        <div className={cx('bill-qr-wrapper')}>
                                            <div
                                                className={cx('bill-qr-code')}
                                                onClick={() => setIsQrModalOpen(true)}
                                                role="button"
                                                tabIndex={0}
                                            >
                                                <Image
                                                    src={
                                                        (displayOrder as any).vietQR?.image ||
                                                        '/payment/my-QR.png'
                                                    }
                                                    alt="QR Code thanh toán"
                                                    width={250}
                                                    height={250}
                                                    className={cx('bill-qr-image')}
                                                    priority
                                                />
                                                <div className={cx('bill-qr-scan-line')}></div>
                                            </div>
                                            <p className={cx('bill-qr-hint')}>
                                                Nhấn vào QR để phóng to
                                            </p>
                                        </div>
                                    </div>

                                    <div className={cx('bill-bank-info')}>
                                        <h3 className={cx('bill-section-title')}>
                                            THÔNG TIN CHUYỂN KHOẢN NGÂN HÀNG
                                        </h3>
                                        <ul className={cx('bill-bank-list')}>
                                            <li>
                                                <strong>Chủ tài khoản:</strong> {BANK_INFO.accountHolder}
                                            </li>
                                            <li>
                                                <strong>Ngân hàng:</strong> {BANK_INFO.bankName} (
                                                {BANK_INFO.bankCode})
                                            </li>
                                            <li>
                                                <strong>Số tài khoản:</strong> {BANK_INFO.accountNumber}
                                            </li>
                                            <li>
                                                <strong>Nội dung:</strong> {displayOrder.code}
                                            </li>
                                        </ul>
                                        <p className={cx('bill-note')}>
                                            <strong>Lưu ý:</strong> Khi chuyển khoản, vui lòng ghi rõ{' '}
                                            <strong>
                                                MÃ ĐƠN HÀNG (#{displayOrder.code})
                                            </strong>{' '}
                                            trong phần nội dung chuyển khoản để chúng tôi có thể xác nhận
                                            thanh toán chính xác.
                                        </p>
                                        <div className={cx('bill-note-critical')}>
                                            Thanh toán xong vui lòng{' '}
                                            <strong>không tắt trình duyệt</strong> cho tới khi đơn hàng được
                                            xác nhận.
                                        </div>
                                        <p className={cx('bill-note-small')}>
                                            Sau khi thanh toán được xác nhận, đơn hàng sẽ được gửi qua email
                                            cho bạn trong thời gian sớm nhất.
                                        </p>
                                    </div>
                                </div>

                                <div className={cx('bill-right-column')}>
                                    <div className={cx('bill-order-summary')}>
                                        <h3 className={cx('bill-section-title')}>Tóm tắt đơn hàng</h3>
                                        <div className={cx('bill-order-meta')}>
                                            <p>
                                                Đơn hàng <strong>#{displayOrder.code}</strong> (
                                                {formatDateTime(displayOrder.createdAt)})
                                            </p>
                                            {!isExpired && remainingSeconds > 0 && (
                                                <span className={cx('bill-note-small')}>
                                                    Còn khoảng {Math.ceil(remainingSeconds / 60)} phút để
                                                    hoàn tất thanh toán
                                                </span>
                                            )}
                                        </div>

                                        <div className={cx('bill-items')}>
                                            {displayOrder.items.map((item: any, index: number) => (
                                                <div
                                                    className={cx('bill-item')}
                                                    key={item.id || index}
                                                >
                                                    <div className={cx('bill-item-media')}>
                                                        <Image
                                                            src={item.image || '/images/placeholder.png'}
                                                            alt={item.productName}
                                                            width={72}
                                                            height={72}
                                                            className={cx('bill-item-image')}
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                    <div className={cx('bill-item-info')}>
                                                        <span className={cx('bill-item-name')}>
                                                            {item.productName}
                                                        </span>
                                                        <span className={cx('bill-item-qty')}>
                                                            x{item.quantity}
                                                        </span>
                                                    </div>
                                                    <div className={cx('bill-item-price')}>
                                                        {formatPrice(item.price * item.quantity)}₫
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className={cx('bill-totals')}>
                                            <div className={cx('bill-total-row')}>
                                                <span>Tạm tính:</span>
                                                <span>
                                                    {formatPrice(
                                                        displayOrder.subtotal || displayOrder.total,
                                                    )}
                                                    ₫
                                                </span>
                                            </div>

                                            {displayOrder.coupon &&
                                                (displayOrder.coupon as any).discount > 0 && (
                                                    <div
                                                        className={cx(
                                                            'bill-total-row',
                                                            'bill-discount-row',
                                                        )}
                                                    >
                                                        <span>
                                                            Mã giảm giá
                                                            <span
                                                                className={cx('bill-coupon-badge')}
                                                            >
                                                                {(displayOrder.coupon as any).code}
                                                            </span>
                                                        </span>
                                                        <span
                                                            className={cx('bill-discount-amount')}
                                                        >
                                                            -
                                                            {formatPrice(
                                                                (displayOrder.coupon as any).discount,
                                                            )}
                                                            ₫
                                                        </span>
                                                    </div>
                                                )}

                                            <div
                                                className={cx(
                                                    'bill-total-row',
                                                    'bill-total-final',
                                                )}
                                            >
                                                <span>Tổng cộng:</span>
                                                <span>{formatPrice(displayOrder.total)}₫</span>
                                            </div>
                                            <div
                                                className={cx(
                                                    'bill-total-row',
                                                    'bill-payment-method',
                                                )}
                                            >
                                                <span>Phương thức thanh toán:</span>
                                                <span>{displayOrder.paymentMethodLabel}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={cx('bill-customer-info')}>
                                        <h3 className={cx('bill-section-title')}>
                                            Thông tin thanh toán
                                        </h3>
                                        <div className={cx('bill-customer-details')}>
                                            <p>{displayOrder.customerName}</p>
                                            <p>Việt Nam</p>
                                            <p>{displayOrder.customerPhone}</p>
                                            <p>{displayOrder.customerEmail}</p>
                                        </div>
                                    </div>

                                    <div className={cx('bill-footer')}>
                                        <p>
                                            Cảm ơn bạn một lần nữa! Nếu cần hỗ trợ về đơn hàng, vui lòng liên
                                            hệ với chúng tôi qua{' '}
                                            <a
                                                href="https://zalo.me/0377775528"
                                                className={cx('bill-email-link')}
                                            >
                                                Zalo
                                            </a>
                                            .
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={cx('bill-actions')}>
                            {!currentUser ? (
                                <>
                                    <Link href="/" className={cx('btn', 'primary')}>
                                        Quay lại trang chủ
                                    </Link>
                                    {orderCodeParam && checkoutTokenParam && submittedEmail ? (
                                        <Link
                                            href={`/orders/lookup/${orderCodeParam}?token=${checkoutTokenParam}&email=${encodeURIComponent(submittedEmail)}`}
                                            className={cx('btn')}
                                        >
                                            Tra cứu đơn hàng
                                        </Link>
                                    ) : (
                                        <Link href="/orders/lookup" className={cx('btn')}>
                                            Tra cứu đơn hàng
                                        </Link>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Link href="/" className={cx('btn', 'primary')}>
                                        Về trang chủ
                                    </Link>
                                    <Link href="/" className={cx('btn')}>
                                        Tiếp tục mua sắm
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                ) : null}
            </div>

            {mounted &&
                isQrModalOpen &&
                displayOrder &&
                createPortal(
                    <div
                        className={cx('qr-modal-overlay')}
                        onClick={() => setIsQrModalOpen(false)}
                    >
                        <div
                            className={cx('qr-modal-content')}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className={cx('qr-modal-close')}
                                onClick={() => setIsQrModalOpen(false)}
                                aria-label="Đóng"
                            >
                                <CloseIcon size={24} />
                            </button>
                            <div className={cx('qr-modal-image-wrapper')}>
                                <div className={cx('qr-modal-image-container')}>
                                    <Image
                                        src={
                                            (displayOrder as any).vietQR?.image ||
                                            '/payment/my-QR.png'
                                        }
                                        alt="QR Code thanh toán - Full Screen"
                                        width={600}
                                        height={600}
                                        className={cx('qr-modal-image')}
                                        priority
                                    />
                                    <div className={cx('qr-modal-scan-line')}></div>
                                </div>
                            </div>
                            <div className={cx('qr-modal-info')}>
                                <div className={cx('qr-modal-info-item')}>
                                    <span className={cx('qr-modal-label')}>Số tiền:</span>
                                    <span className={cx('qr-modal-value')}>
                                        {formatPrice(displayOrder.total)} VND
                                    </span>
                                </div>
                                <div className={cx('qr-modal-info-item')}>
                                    <span className={cx('qr-modal-label')}>Nội dung CK:</span>
                                    <span className={cx('qr-modal-value')}>
                                        {displayOrder.code}
                                    </span>
                                </div>
                                <div className={cx('qr-modal-info-item')}>
                                    <span className={cx('qr-modal-label')}>Tên chủ TK:</span>
                                    <span className={cx('qr-modal-value')}>
                                        {BANK_INFO.accountHolder}
                                    </span>
                                </div>
                                <div className={cx('qr-modal-info-item')}>
                                    <span className={cx('qr-modal-label')}>Số TK:</span>
                                    <span className={cx('qr-modal-value')}>
                                        {BANK_INFO.accountNumber}
                                    </span>
                                </div>
                                <div className={cx('qr-modal-info-item')}>
                                    <span className={cx('qr-modal-label')}>Ngân hàng:</span>
                                    <span className={cx('qr-modal-value')}>
                                        {BANK_INFO.bankName}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body,
                )}
        </div>
    );
};

export default CheckoutSuccessLayout;


