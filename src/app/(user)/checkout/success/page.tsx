'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames/bind';
import styles from './bill.module.scss';
import { useEffect, useState } from 'react';
import bankInfo from '@/data/mockBankInfo.json';
import { CloseIcon } from '@/components/Icons';
import { createPortal } from 'react-dom';
import { sendOrderConfirmationEmail } from '@/services/emailService';

const cx = classNames.bind(styles);

const BANK_INFO = bankInfo;

const CheckoutSuccessPage: React.FC = () => {
    const [order, setOrder] = useState<any | null>(null);
    const [mounted, setMounted] = useState(false);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        try {
            const data = typeof window !== 'undefined' ? localStorage.getItem('lastOrder') : null;
            if (data) {
                const orderData = JSON.parse(data);
                setOrder(orderData);
                
                // Send confirmation email
                sendOrderEmail(orderData);
            }
        } catch {
            setOrder(null);
        }
    }, []);

    const sendOrderEmail = async (orderData: any) => {
        try {
            // Prepare email data
            const emailData = {
                orderCode: orderData.code,
                orderDate: orderData.createdAt,
                customerEmail: orderData.customer.email,
                products: orderData.items.map((item: any) => ({
                    id: item.id,
                    productName: item.productName,
                    quantity: item.quantity,
                    price: item.price,
                })),
                totalAmount: orderData.total,
                paymentMethod: orderData.paymentMethod?.title || 'Chuyển khoản ngân hàng',
            };

            // Send email (this will be handled by backend in production)
            const success = await sendOrderConfirmationEmail(emailData);
            
            if (success) {
                console.log('✅ Email xác nhận đơn hàng đã được gửi');
            }
        } catch (error) {
            console.error('❌ Lỗi khi gửi email:', error);
        }
    };

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

    const formatPrice = (value: number) => value?.toLocaleString('vi-VN');
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

    return (
        <div className={cx('bill-page')}>
            <div className={cx('bill-container')}>
                {order ? (
                    <div className={cx('bill-card')}>
                        {/* Thank You Message */}
                        <div className={cx('bill-content')}>
                            <h2 className={cx('bill-thank-you')}>Cảm ơn bạn đã đặt hàng</h2>
                            <p className={cx('bill-greeting')}>
                                Xin chào {order.customer.firstName} {order.customer.lastName},
                            </p>
                            <p className={cx('bill-message')}>
                                Chúng tôi đã nhận được đơn hàng của bạn và đơn hàng đang được xác nhận. Đến khi đơn hàng được
                                xác nhận thành toán sẽ được xác nhận thành công.
                            </p>

                            {/* QR Code Section - Only show for QR bank transfer */}
                            {order.paymentMethod?.id === 'qr-bank-transfer' && (
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
                                                src="/payment/my-QR.png"
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
                            )}

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
                                        <strong>Nội dung:</strong> {order.code}
                                    </li>
                                </ul>
                                <p className={cx('bill-note')}>
                                    <strong>Lưu ý:</strong> Khi chuyển khoản, vui lòng ghi rõ{' '}
                                    <strong>MÃ ĐƠN HÀNG (#{order.code})</strong> trong phần nội dung chuyển khoản để chúng tôi
                                    có thể xác nhận thanh toán chính xác.
                                </p>
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
                                        Đơn hàng <strong>#{order.code}</strong> ({formatDate(order.createdAt)})
                                    </p>
                                </div>

                                {/* Order Items */}
                                <div className={cx('bill-items')}>
                                    {order.items.map((item: any, index: number) => (
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
                                        <span>{formatPrice(order.subtotal || order.total)}₫</span>
                                    </div>
                                    
                                    {/* Coupon Discount */}
                                    {order.coupon && order.coupon.discount > 0 && (
                                        <div className={cx('bill-total-row', 'bill-discount-row')}>
                                            <span>
                                                Mã giảm giá
                                                <span className={cx('bill-coupon-badge')}>{order.coupon.code}</span>
                                            </span>
                                            <span className={cx('bill-discount-amount')}>
                                                -{formatPrice(order.coupon.discount)}₫
                                            </span>
                                        </div>
                                    )}
                                    
                                    <div className={cx('bill-total-row', 'bill-total-final')}>
                                        <span>Tổng cộng:</span>
                                        <span>{formatPrice(order.total)}₫</span>
                                    </div>
                                    <div className={cx('bill-total-row', 'bill-payment-method')}>
                                        <span>Phương thức thanh toán:</span>
                                        <span>{order.paymentMethod?.title || 'Chuyển khoản ngân hàng'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Information */}
                            <div className={cx('bill-customer-info')}>
                                <h3 className={cx('bill-section-title')}>Địa chỉ thanh toán</h3>
                                <div className={cx('bill-customer-details')}>
                                    <p>
                                        {order.customer.firstName} {order.customer.lastName}
                                    </p>
                                    <p>Việt Nam</p>
                                    <p>{order.customer.phone}</p>
                                    <p>{order.customer.email}</p>
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
                ) : (
                    <div className={cx('error-state')}>
                        <p>Không tìm thấy thông tin đơn hàng. Vui lòng quay lại trang chủ.</p>
                        <Link href="/" className={cx('btn', 'primary')}>
                            Về trang chủ
                        </Link>
                    </div>
                )}
            </div>

            {/* QR Code Full Screen Modal */}
            {mounted &&
                isQrModalOpen &&
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
                                    src="/payment/my-QR.png"
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
                                    <span className={cx('qr-modal-value')}>{order ? formatPrice(order.total) : '0'} VND</span>
                                </div>
                                <div className={cx('qr-modal-info-item')}>
                                    <span className={cx('qr-modal-label')}>Nội dung CK:</span>
                                    <span className={cx('qr-modal-value')}>CK {order?.code || ''}</span>
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
