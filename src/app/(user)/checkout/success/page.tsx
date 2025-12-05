'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import classNames from 'classnames/bind';
import styles from './bill.module.scss';
import { useEffect, useState } from 'react';
import bankInfo from '@/data/mockBankInfo.json';
import { CloseIcon, LockIcon, AlertCircleIcon } from '@/components/Icons';
import { createPortal } from 'react-dom';
import { useCheckoutOrder } from '@/services/orderService';

const cx = classNames.bind(styles);

const BANK_INFO = bankInfo;

const CheckoutSuccessPage: React.FC = () => {
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
    // Track if this is the same browser session that created the order
    const [isOriginalSession, setIsOriginalSession] = useState(false);
    const searchParams = useSearchParams();
    const orderCodeParam = searchParams.get('order');
    const checkoutTokenParam = searchParams.get('token') || searchParams.get('key');
    
    // For logged-in users: always fetch
    // For guest users: only fetch if submittedEmail is set AND it's either original session or user clicked verify
    const shouldFetchCheckout = Boolean(
        orderCodeParam && 
        checkoutTokenParam && 
        (currentUser || (submittedEmail && (isOriginalSession || submittedEmail)))
    );
    
    const {
        data: checkoutData,
        error: checkoutError,
        isLoading: checkoutLoading,
    } = useCheckoutOrder(
        shouldFetchCheckout ? orderCodeParam : null,
        shouldFetchCheckout ? checkoutTokenParam : null,
        !currentUser ? submittedEmail : null
    );
    const order = checkoutData?.data?.order;
    const isExpired = checkoutData?.data?.isExpired;
    const remainingSeconds = checkoutData?.data?.remainingSeconds ?? 0;

    const getStoredGuestEmail = React.useCallback((orderCode: string) => {
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

    const storeGuestEmail = React.useCallback((orderCode: string, email: string) => {
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

    // Check for stored email - only auto-fill, don't auto-submit for new sessions
    useEffect(() => {
        if (!currentUser && orderCodeParam && typeof window !== 'undefined') {
            const storedEmail = getStoredGuestEmail(orderCodeParam);
            if (storedEmail) {
                // Auto-fill the email input
                setEmailInput(storedEmail);
                
                // Check if this is the original session (order was created in this browser recently)
                // We use sessionStorage to track if the order was just created
                const sessionKey = `order_created_${orderCodeParam}`;
                const wasJustCreated = window.sessionStorage.getItem(sessionKey);
                
                if (wasJustCreated) {
                    // This is the original session - auto-verify
                    setSubmittedEmail(storedEmail);
                    setIsOriginalSession(true);
                }
                // If not original session, just show the form with pre-filled email
                // User needs to click "Xác minh" to verify
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

    // Lắng nghe trạng thái đơn hàng qua SSE và redirect khi thanh toán thành công
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

        // Dùng cùng base URL với httpRequest.ts để tránh lệch port
        const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:4000';
        const orderInternalId = order._id;
        const businessOrderId = order.orderId;

        if (!backendUrl || !orderInternalId) {
            return;
        }

        const streamUrl = `${backendUrl}/api/v1/orders/${orderInternalId}/status-stream`;

        let eventSource: EventSource | null = null;

        try {
            eventSource = new EventSource(streamUrl);

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
                        } else if (
                            targetOrderCode &&
                            checkoutTokenParam &&
                            submittedEmail
                        ) {
                            const params = new URLSearchParams({
                                token: checkoutTokenParam,
                                email: submittedEmail,
                            });
                            router.push(`/orders/lookup/${targetOrderCode}?${params.toString()}`);
                        }
                    }
                } catch (err) {
                    console.error('Failed to parse SSE status event:', err);
                }
            });

            eventSource.addEventListener('error', () => {
                if (eventSource) {
                    eventSource.close();
                }
            });
        } catch (err) {
            console.error('Failed to open SSE connection:', err);
        }

        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [
        mounted,
        order,
        router,
        isExpired,
        currentUser,
        checkoutTokenParam,
        submittedEmail,
        hasRedirectedToDetails,
    ]);

    // Disable body scroll when QR modal is open
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

    const displayOrder = React.useMemo(() => {
        if (!order) return null;
        const items =
            order.items?.map((item: any, index: number) => {
                const populatedProduct = item.productId || item.product_id;
                const productId =
                    (typeof populatedProduct === 'object' && populatedProduct?._id) ||
                    (typeof item.product_id === 'string' ? item.product_id : undefined) ||
                    `${index}`;
                const productName =
                    item.fullName ||
                    (typeof populatedProduct === 'object' && (populatedProduct?.name || populatedProduct?.fullName)) ||
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
            code: order.orderId,
            createdAt: order.createdAt,
            customerName: order.customerFullName || 'Quý khách',
            customerPhone: order.phoneUserOrder,
            customerEmail: order.emailUserOrder,
            customerNote: order.userNote,
            items,
            subtotal: order.totalDiscountBefore,
            coupon:
                order.discountCode && order.totalDiscount > 0
                    ? {
                          code: order.discountCode,
                          discount: order.totalDiscount,
                      }
                    : null,
            total: order.totalPrice,
            paymentMethodLabel: 'Chuyển khoản ngân hàng (VietQR)',
            vietQR: order.vietQR,
        };
    }, [order]);

    const formatPrice = (value?: number) => (value ?? 0).toLocaleString('vi-VN');
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

useEffect(() => {
    if (!currentUser && checkoutError) {
        const status = (checkoutError as any)?.response?.status;
        if (status === 403) {
            const message =
                (checkoutError as any)?.response?.data?.message ||
                'Địa chỉ email không trùng khớp với đơn hàng.';
            setVerificationError(message);
            return;
        }
    }

    if (displayOrder) {
        setVerificationError(null);
    }
}, [checkoutError, currentUser, displayOrder]);

useEffect(() => {
    if (!currentUser && displayOrder && submittedEmail && orderCodeParam) {
        storeGuestEmail(orderCodeParam, submittedEmail);
    }
}, [currentUser, displayOrder, submittedEmail, orderCodeParam, storeGuestEmail]);

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
    const verificationErrorMessage =
        !currentUser && (checkoutError as any)?.response?.status === 403
            ? apiErrorMessage
            : null;
    const errorMessage =
        validationError ||
        (verificationErrorMessage ? null : apiErrorMessage) ||
        (verificationErrorMessage ? null : checkoutError?.message);
    const requiresLogin = Boolean(errorMessage && errorMessage.toLowerCase().includes('đăng nhập'));
    const showVerificationForm =
        !currentUser &&
        checkedStoredEmail &&
        (!displayOrder || Boolean(verificationError)) &&
        !validationError;
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
                        {verificationError && (
                            <div className={cx('verification-banner')}>
                                {verificationError}
                            </div>
                        )}
                        <p className={cx('verification-message')}>
                            Để xem đơn hàng này, bạn phải đăng nhập hoặc xác minh địa chỉ email được liên kết với đơn hàng.
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
                        <p>Đang tải thông tin đơn hàng...</p>
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
                                <Link href="/products" className={cx('btn', 'primary')}>
                                    Đặt lại đơn hàng
                                </Link>
                                <Link href="/" className={cx('btn', 'ghost')}>
                                    Về trang chủ
                                </Link>
                            </div>
                            <p className={cx('expired-helper')}>
                                Cần hỗ trợ?{' '}
                                <Link href="/help/faq/support">Liên hệ đội ngũ CSKH</Link>
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
                                    {requiresLogin ? 'Đăng nhập đúng tài khoản' : 'Quay lại lịch sử đơn'}
                                </Link>
                                <Link
                                    href="/account/orders"
                                    className={cx('btn', 'ghost')}
                                >
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
                        {/* Thank You Message */}
                        <div className={cx('bill-content')}>
                            <h2 className={cx('bill-thank-you')}>Cảm ơn bạn đã đặt hàng</h2>
                            <p className={cx('bill-greeting')}>
                                Xin chào {displayOrder.customerName || 'Quý khách'},
                            </p>
                            <p className={cx('bill-message')}>
                                Chúng tôi đã nhận được đơn hàng của bạn và đang chờ xác nhận thanh toán. Đơn hàng sẽ tự động hủy sau{' '}
                                {checkoutData?.data?.paymentWindowMinutes || 60} phút nếu chưa nhận được chuyển khoản.
                            </p>
                            {isExpired && (
                                <div className={cx('bill-note-critical')}>
                                    Đơn hàng này đã quá hạn thanh toán. Vui lòng tạo đơn mới để tiếp tục.
                                </div>
                            )}

                            {/* Two Column Layout */}
                            <div className={cx('bill-two-columns')}>
                                {/* Left Column */}
                                <div className={cx('bill-left-column')}>
                                    {/* QR Code Section */}
                                    <div className={cx('bill-qr-section')}>
                                        <h3 className={cx('bill-section-title')}>QUÉT MÃ QR ĐỂ THANH TOÁN</h3>
                                        <div className={cx('bill-qr-wrapper')}>
                                            <div
                                                className={cx('bill-qr-code')}
                                                onClick={() => setIsQrModalOpen(true)}
                                                role="button"
                                                tabIndex={0}
                                            >
                                                <Image
                                                    src={displayOrder.vietQR?.image || '/payment/my-QR.png'}
                                                    alt="QR Code thanh toán"
                                                    width={250}
                                                    height={250}
                                                    className={cx('bill-qr-image')}
                                                    priority
                                                />
                                                <div className={cx('bill-qr-scan-line')}></div>
                                            </div>
                                            <p className={cx('bill-qr-hint')}>Nhấn vào QR để phóng to</p>
                                        </div>
                                    </div>

                                    {/* Bank Transfer Information */}
                                    <div className={cx('bill-bank-info')}>
                                        <h3 className={cx('bill-section-title')}>THÔNG TIN CHUYỂN KHOẢN NGÂN HÀNG</h3>
                                        <ul className={cx('bill-bank-list')}>
                                            <li>
                                                <strong>Chủ tài khoản:</strong> {BANK_INFO.accountHolder}
                                            </li>
                                            <li>
                                                <strong>Ngân hàng:</strong> {BANK_INFO.bankName} ({BANK_INFO.bankCode})
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
                                            <strong>MÃ ĐƠN HÀNG (#{displayOrder.code})</strong> trong phần nội dung chuyển khoản để chúng tôi
                                            có thể xác nhận thanh toán chính xác.
                                        </p>
                                        <div className={cx('bill-note-critical')}>
                                            Thanh toán xong vui lòng <strong>không tắt trình duyệt</strong> cho tới khi đơn hàng được xác nhận.
                                        </div>
                                        <p className={cx('bill-note-small')}>
                                            Sau khi thanh toán được xác nhận, đơn hàng sẽ được gửi qua email cho bạn trong thời gian sớm
                                            nhất.
                                        </p>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className={cx('bill-right-column')}>
                                    {/* Order Summary */}
                                    <div className={cx('bill-order-summary')}>
                                        <h3 className={cx('bill-section-title')}>Tóm tắt đơn hàng</h3>
                                        <div className={cx('bill-order-meta')}>
                                            <p>
                                                Đơn hàng <strong>#{displayOrder.code}</strong> ({formatDate(displayOrder.createdAt)})
                                            </p>
                                            {!isExpired && remainingSeconds > 0 && (
                                                <span className={cx('bill-note-small')}>
                                                    Còn khoảng {Math.ceil(remainingSeconds / 60)} phút để hoàn tất thanh toán
                                                </span>
                                            )}
                                        </div>

                                        {/* Order Items */}
                                        <div className={cx('bill-items')}>
                                            {displayOrder.items.map((item: any, index: number) => (
                                                <div className={cx('bill-item')} key={item.id || index}>
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
                                                        <span className={cx('bill-item-name')}>{item.productName}</span>
                                                        <span className={cx('bill-item-qty')}>x{item.quantity}</span>
                                                    </div>
                                                    <div className={cx('bill-item-price')}>
                                                        {formatPrice(item.price * item.quantity)}₫
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Totals */}
                                        <div className={cx('bill-totals')}>
                                            <div className={cx('bill-total-row')}>
                                                <span>Tạm tính:</span>
                                                <span>{formatPrice(displayOrder.subtotal || displayOrder.total)}₫</span>
                                            </div>
                                            
                                            {/* Coupon Discount */}
                                            {displayOrder.coupon && displayOrder.coupon.discount > 0 && (
                                                <div className={cx('bill-total-row', 'bill-discount-row')}>
                                                    <span>
                                                        Mã giảm giá
                                                        <span className={cx('bill-coupon-badge')}>{displayOrder.coupon.code}</span>
                                                    </span>
                                                    <span className={cx('bill-discount-amount')}>
                                                        -{formatPrice(displayOrder.coupon.discount)}₫
                                                    </span>
                                                </div>
                                            )}
                                            
                                            <div className={cx('bill-total-row', 'bill-total-final')}>
                                                <span>Tổng cộng:</span>
                                                <span>{formatPrice(displayOrder.total)}₫</span>
                                            </div>
                                            <div className={cx('bill-total-row', 'bill-payment-method')}>
                                                <span>Phương thức thanh toán:</span>
                                                <span>{displayOrder.paymentMethodLabel}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Customer Information */}
                                    <div className={cx('bill-customer-info')}>
                                        <h3 className={cx('bill-section-title')}>Thông tin thanh toán</h3>
                                        <div className={cx('bill-customer-details')}>
                                            <p>{displayOrder.customerName}</p>
                                            <p>Việt Nam</p>
                                            <p>{displayOrder.customerPhone}</p>
                                            <p>{displayOrder.customerEmail}</p>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className={cx('bill-footer')}>
                                        <p>
                                            Cảm ơn bạn một lần nữa! Nếu cần hỗ trợ về đơn hàng, vui lòng liên hệ với chúng tôi qua
                                            email{' '}
                                            <a href="mailto:support@taikhoanxin.com" className={cx('bill-email-link')}>
                                                support@taikhoanxin.com
                                            </a>
                                            .
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className={cx('bill-actions')}>
                            <Link href="/" className={cx('btn', 'primary')}>
                                Về trang chủ
                            </Link>
                            <Link href="/products" className={cx('btn')}>
                                Tiếp tục mua sắm
                            </Link>
                        </div>
                    </div>
                ) : null}
            </div>

            {/* QR Code Full Screen Modal */}
            {mounted &&
                isQrModalOpen &&
                displayOrder &&
                createPortal(
                    <div className={cx('qr-modal-overlay')} onClick={() => setIsQrModalOpen(false)}>
                        <div className={cx('qr-modal-content')} onClick={(e) => e.stopPropagation()}>
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
                                        src={displayOrder.vietQR?.image || '/payment/my-QR.png'}
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
                                    <span className={cx('qr-modal-value')}>{formatPrice(displayOrder.total)} VND</span>
                                </div>
                                <div className={cx('qr-modal-info-item')}>
                                    <span className={cx('qr-modal-label')}>Nội dung CK:</span>
                                    <span className={cx('qr-modal-value')}>{displayOrder.code}</span>
                                </div>
                                <div className={cx('qr-modal-info-item')}>
                                    <span className={cx('qr-modal-label')}>Tên chủ TK:</span>
                                    <span className={cx('qr-modal-value')}>{BANK_INFO.accountHolder}</span>
                                </div>
                                <div className={cx('qr-modal-info-item')}>
                                    <span className={cx('qr-modal-label')}>Số TK:</span>
                                    <span className={cx('qr-modal-value')}>{BANK_INFO.accountNumber}</span>
                                </div>
                                <div className={cx('qr-modal-info-item')}>
                                    <span className={cx('qr-modal-label')}>Ngân hàng:</span>
                                    <span className={cx('qr-modal-value')}>{BANK_INFO.bankName}</span>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
};

export default CheckoutSuccessPage;
