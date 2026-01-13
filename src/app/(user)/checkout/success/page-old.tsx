'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames/bind';
import styles from './success.module.scss';
import { useEffect, useState } from 'react';
import bankInfo from '@/data/mockBankInfo.json';
import { CloseIcon } from '@/components/Icons';
import { createPortal } from 'react-dom';

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
                setOrder(JSON.parse(data));
            }
        } catch {
            setOrder(null);
        }
    }, []);

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
        <div className={cx('success-page')}>
            <div className="container">
                {order ? (
                    <>
                        {/* Thank You Message */}
                        <div className={cx('thank-you-box')}>
                            <p className={cx('thank-you-text')}>Cảm ơn bạn. Đơn hàng của bạn đã được nhận.</p>
                        </div>

                        {/* Order Summary - 5 Columns */}
                        <div className={cx('order-summary')}>
                            <div className={cx('summary-item')}>
                                <div className={cx('summary-label')}>MÃ ĐƠN HÀNG:</div>
                                <div className={cx('summary-value')}>{order.code || 'N/A'}</div>
                            </div>
                            <div className={cx('summary-item')}>
                                <div className={cx('summary-label')}>NGÀY:</div>
                                <div className={cx('summary-value')}>{formatDate(order.createdAt)}</div>
                            </div>
                            <div className={cx('summary-item')}>
                                <div className={cx('summary-label')}>EMAIL:</div>
                                <div className={cx('summary-value')}>{order.customer.email}</div>
                            </div>
                            <div className={cx('summary-item')}>
                                <div className={cx('summary-label')}>TỔNG CỘNG:</div>
                                <div className={cx('summary-value', 'price')}>{formatPrice(order.total)} ₫</div>
                            </div>
                            <div className={cx('summary-item')}>
                                <div className={cx('summary-label')}>PHƯƠNG THỨC THANH TOÁN:</div>
                                <div className={cx('summary-value')}>
                                    {order.paymentMethod?.title || 'Chuyển khoản ngân hàng'}
                                </div>
                            </div>
                        </div>

                        {/* Payment Instructions */}
                        {order.paymentMethod?.id === 'qr-bank-transfer' ? (
                            <>
                                <div className={cx('instructions')}>
                                    <p>
                                        Vui lòng thực hiện chuyển khoản vào tài khoản ngân hàng của chúng tôi. Nội dung chuyển
                                        khoản cần ghi rõ <strong>MÃ ĐƠN HÀNG</strong> để xác nhận đơn hàng chính xác. Đơn hàng
                                        sẽ được gửi qua Mail sau khi chúng tôi nhận được thanh toán của bạn.
                                    </p>
                                </div>

                                {/* QR Code Payment Card */}
                                <div className={cx('qr-payment-card')}>
                                    <div className={cx('qr-code-wrapper')}>
                                        <div 
                                            className={cx('qr-code', 'qr-code-clickable')}
                                            onClick={() => setIsQrModalOpen(true)}
                                        >
                                            <Image
                                                src="/payment/my-QR.png"
                                                alt="QR Code thanh toán"
                                                width={300}
                                                height={300}
                                                className={cx('qr-image')}
                                                priority
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Bill Information - Combined */}
                                    <div className={cx('bill-info-section')}>
                                        <h3 className={cx('bill-info-title')}>Thông tin thanh toán</h3>
                                        <div className={cx('bill-info-content')}>
                                            <div className={cx('bill-info-item')}>
                                                <span className={cx('bill-label')}>Số tiền:</span>
                                                <span className={cx('bill-value')}>{formatPrice(order.total)} VND</span>
                                            </div>
                                            <div className={cx('bill-info-item')}>
                                                <span className={cx('bill-label')}>Nội dung CK:</span>
                                                <span className={cx('bill-value')}>CK {order.code}</span>
                                            </div>
                                            <div className={cx('bill-info-item')}>
                                                <span className={cx('bill-label')}>Tên chủ TK:</span>
                                                <span className={cx('bill-value')}>{BANK_INFO.accountHolder}</span>
                                            </div>
                                            <div className={cx('bill-info-item')}>
                                                <span className={cx('bill-label')}>Số TK:</span>
                                                <span className={cx('bill-value')}>{BANK_INFO.accountNumber}</span>
                                            </div>
                                            <div className={cx('bill-info-item')}>
                                                <span className={cx('bill-label')}>Ngân hàng:</span>
                                                <span className={cx('bill-value')}>{BANK_INFO.bankName}</span>
                                            </div>
                                            <div className={cx('bill-info-item')}>
                                                <span className={cx('bill-label')}>Mã ngân hàng:</span>
                                                <span className={cx('bill-value')}>{BANK_INFO.bankCode}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className={cx('instructions')}>
                                <p>
                                    Đơn hàng của bạn đã được xác nhận. Chúng tôi đang xử lý thanh toán qua phương thức{' '}
                                    <strong>{order.paymentMethod?.title || 'đã chọn'}</strong>. Đơn hàng sẽ được gửi qua Mail sau khi
                                    thanh toán được xác nhận.
                                </p>
                            </div>
                        )}

                        {/* Bank Account Information - Only show for QR bank transfer */}
                        {order.paymentMethod?.id === 'qr-bank-transfer' && (
                            <div className={cx('bank-account-section')}>
                                <h3 className={cx('bank-account-title')}>Thông tin chuyển khoản ngân hàng</h3>
                                <div className={cx('bank-account-content')}>
                                    <div className={cx('bank-account-item', 'account-holder')}>
                                        <span className={cx('bank-account-label')}>Tên chủ tài khoản:</span>
                                        <span className={cx('bank-account-value')}>{BANK_INFO.accountHolder}</span>
                                    </div>
                                    <div className={cx('bank-account-row')}>
                                        <div className={cx('bank-account-item')}>
                                            <span className={cx('bank-account-label')}>Ngân hàng:</span>
                                            <span className={cx('bank-account-value')}>{BANK_INFO.bankName}</span>
                                        </div>
                                        <div className={cx('bank-account-item')}>
                                            <span className={cx('bank-account-label')}>Số tài khoản:</span>
                                            <span className={cx('bank-account-value')}>{BANK_INFO.accountNumber}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Order Details & Payment Address - Combined */}
                        <div className={cx('order-details-section')}>
                            <h2 className={cx('section-title')}>Chi tiết đơn hàng</h2>
                            
                            <div className={cx('order-content-wrapper')}>
                                {/* Left: Order Items & Summary */}
                                <div className={cx('order-content-left')}>
                                    <div className={cx('order-items-list')}>
                                        {order.items.map((item: any) => (
                                            <div className={cx('order-item')} key={item.id}>
                                                <div className={cx('item-info')}>
                                                    <div className={cx('item-name')}>{item.productName}</div>
                                                    <div className={cx('item-quantity')}>Số lượng: {item.quantity}</div>
                                                </div>
                                                <div className={cx('item-price')}>
                                                    {formatPrice(item.price * item.quantity)} ₫
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={cx('order-summary-details')}>
                                        <div className={cx('summary-row')}>
                                            <span className={cx('summary-label')}>Tổng số phụ:</span>
                                            <span className={cx('summary-value')}>{formatPrice(order.total)} ₫</span>
                                        </div>
                                        <div className={cx('summary-row', 'total')}>
                                            <span className={cx('summary-label')}>Tổng cộng:</span>
                                            <span className={cx('summary-value')}>{formatPrice(order.total)} ₫</span>
                                        </div>
                                        <div className={cx('summary-row', 'payment-method')}>
                                            <span className={cx('summary-label')}>Phương thức thanh toán:</span>
                                            <span className={cx('summary-value')}>
                                                {order.paymentMethod?.title || 'Chuyển khoản ngân hàng'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Payment Address */}
                                <div className={cx('order-content-right')}>
                                    <h3 className={cx('address-section-title')}>Địa chỉ thanh toán</h3>
                                    <div className={cx('address-details')}>
                                        <div className={cx('address-item')}>
                                            <span className={cx('address-label')}>Họ tên:</span>
                                            <span className={cx('address-value')}>
                                                {order.customer.firstName} {order.customer.lastName}
                                            </span>
                                        </div>
                                        <div className={cx('address-item')}>
                                            <span className={cx('address-label')}>Số điện thoại:</span>
                                            <span className={cx('address-value')}>{order.customer.phone}</span>
                                        </div>
                                        <div className={cx('address-item')}>
                                            <span className={cx('address-label')}>Email:</span>
                                            <span className={cx('address-value')}>{order.customer.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className={cx('actions')}>
                            <Link href="/" className={cx('btn', 'primary')}>
                                Về trang chủ
                            </Link>
                            <Link href="/" className={cx('btn')}>
                                Tiếp tục mua sắm
                            </Link>
                        </div>
                    </>
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
            {mounted && isQrModalOpen && createPortal(
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
                                <span className={cx('qr-modal-value')}>
                                    {order ? formatPrice(order.total) : '0'} VND
                                </span>
                            </div>
                            <div className={cx('qr-modal-info-item')}>
                                <span className={cx('qr-modal-label')}>Nội dung CK:</span>
                                <span className={cx('qr-modal-value')}>
                                    CK {order?.code || ''}
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
                document.body
            )}
        </div>
    );
};

export default CheckoutSuccessPage;
