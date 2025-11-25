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
import { CloseIcon } from '@/components/Icons';
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
    const searchParams = useSearchParams();
    const orderCodeParam = searchParams.get('order');
    const checkoutTokenParam = searchParams.get('token') || searchParams.get('key');
    const {
        data: checkoutData,
        error: checkoutError,
        isLoading: checkoutLoading,
    } = useCheckoutOrder(orderCodeParam, checkoutTokenParam);
    const order = checkoutData?.data?.order;
    const isExpired = checkoutData?.data?.isExpired;
    const remainingSeconds = checkoutData?.data?.remainingSeconds ?? 0;

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        if (!currentUser) {
            const redirectUrl = encodeURIComponent(`/checkout/success?${searchParams.toString()}`);
            router.push(`/auth/login?redirect=${redirectUrl}`);
            return;
        }

        if (!orderCodeParam || !checkoutTokenParam) {
            setValidationError('Thiếu tham số xác thực đơn hàng hoặc tham số không hợp lệ.');
        } else {
            setValidationError(null);
        }
    }, [mounted, orderCodeParam, checkoutTokenParam, currentUser, router, searchParams]);

    // Lắng nghe trạng thái đơn hàng qua SSE và redirect khi thanh toán thành công
    useEffect(() => {
        if (!mounted || !order || isExpired) return;

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

                        // Redirect đến trang chi tiết đơn hàng nếu có mã, ngược lại quay về danh sách
                        const targetPath = targetOrderCode
                            ? `/account/orders/${targetOrderCode}`
                            : '/account/orders';

                        if (typeof window !== 'undefined') {
                            window.location.href = targetPath;
                        } else {
                            router.push(targetPath);
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
    }, [mounted, order, router, isExpired]);

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
                return {
                    id: productId,
                    productName,
                    quantity: item.quantity || 1,
                    price: item.price || 0,
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

    if (!mounted) {
        return null;
    }

    const apiErrorMessage =
        (checkoutError as any)?.response?.data?.message ||
        (checkoutError as any)?.response?.data?.error ||
        undefined;
    const errorMessage = validationError || apiErrorMessage || checkoutError?.message;
    const requiresLogin = !currentUser || (errorMessage && errorMessage.toLowerCase().includes('đăng nhập'));
    const shouldShowError = !!errorMessage || (!checkoutLoading && !displayOrder);

    return (
        <div className={cx('bill-page')}>
            <div className={cx('bill-container')}>
                {checkoutLoading ? (
                    <div className={cx('error-state')}>
                        <p>Đang tải thông tin đơn hàng...</p>
                    </div>
                ) : shouldShowError ? (
                    <div className={cx('error-state')}>
                        <p>{errorMessage || 'Không tìm thấy thông tin đơn hàng. Vui lòng quay lại trang chủ.'}</p>
                        <Link
                            href={requiresLogin ? '/auth/login' : '/'}
                            className={cx('btn', 'primary')}
                        >
                            {requiresLogin ? 'Đăng nhập ngay' : 'Về trang chủ'}
                        </Link>
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

                            {/* QR Code Section */}
                            <div className={cx('bill-qr-section')}>
                                <h3 className={cx('bill-section-title')}>Quét mã QR để thanh toán</h3>
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
                                    </div>
                                    <p className={cx('bill-qr-hint')}>Nhấn vào QR để phóng to</p>
                                </div>
                            </div>

                            {/* Bank Transfer Information */}
                            <div className={cx('bill-bank-info')}>
                                <h3 className={cx('bill-section-title')}>Thông tin chuyển khoản ngân hàng</h3>
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
                                            <div className={cx('bill-item-info')}>
                                                <span className={cx('bill-item-number')}>{index + 1}.</span>
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
                                <Image
                                    src={displayOrder.vietQR?.image || '/payment/my-QR.png'}
                                    alt="QR Code thanh toán - Full Screen"
                                    width={600}
                                    height={600}
                                    className={cx('qr-modal-image')}
                                    priority
                                />
                            </div>
                            <div className={cx('qr-modal-info')}>
                                <div className={cx('qr-modal-info-item')}>
                                    <span className={cx('qr-modal-label')}>Số tiền:</span>
                                    <span className={cx('qr-modal-value')}>{formatPrice(displayOrder.total)} VND</span>
                                </div>
                                <div className={cx('qr-modal-info-item')}>
                                    <span className={cx('qr-modal-label')}>Nội dung CK:</span>
                                    <span className={cx('qr-modal-value')}>CK {displayOrder.code}</span>
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
