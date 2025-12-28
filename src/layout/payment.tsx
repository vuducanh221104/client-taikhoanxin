'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames/bind';
import styles from '@/app/(user)/payment/page.module.scss';
import { OnlineBankingQrIcon } from '@/components/Icons';

const cx = classNames.bind(styles);

interface PaymentMethod {
    id: string;
    icon?: React.ReactNode;
    iconImage?: string;
    title: string;
    description: string;
    fee: string;
    iconBg?: string;
}

const paymentMethods: PaymentMethod[] = [
    {
        id: 'qr-bank-transfer',
        icon: <OnlineBankingQrIcon size={56} />,
        title: 'Nạp tự động bằng quét QR - Chuyển khoản ngân hàng',
        description: 'Quét mã QR chuyển khoản online. Phí 0%',
        fee: '0%',
    },
    {
        id: 'vnpay-qr',
        iconImage: '/payment/vnpay.png',
        title: 'Thanh toán VNPAY-QR',
        description: 'Quét mã QR PAY trên ứng dụng Mobile Banking, phí giao dịch 2%',
        fee: '2%',
    },
    {
        id: 'bank-card',
        iconImage: '/payment/atm.png',
        title: 'Nạp số dư tự động bằng thẻ ngân hàng',
        description: 'Phí 0.9% + 900₫',
        fee: '0.9% + 900₫',
    },
    {
        id: 'master-visa-jcb',
        iconImage: '/payment/visa.png',
        title: 'Thanh toán bằng thẻ Master/Visa/JCB',
        description: 'Phí 2.36% + 2.660 ₫',
        fee: '2.36% + 2.660₫',
    },
];

const PaymentLayout: React.FC = () => {
    const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);

    const handleSelectMethod = (methodId: string) => {
        if (selectedMethodId === methodId) {
            setSelectedMethodId(null);
        } else {
            setSelectedMethodId(methodId);
        }
    };

    const selectedMethodIndex = selectedMethodId
        ? paymentMethods.findIndex((method) => method.id === selectedMethodId)
        : -1;

    return (
        <div className={cx('payment-page')}>
            <div className={cx('payment-container')}>
                <div className={cx('payment-header')}>
                    <h1 className={cx('payment-title')}>Các phương thức thanh toán</h1>
                    <p className={cx('payment-subtitle')}>
                        Bạn có thể chọn các phương thức thanh toán khả dụng bên dưới
                    </p>
                </div>

                <div className={cx('payment-methods')}>
                    {paymentMethods.map((method, index) => {
                        const isSelected = selectedMethodId === method.id;
                        const isBlurred =
                            selectedMethodId !== null && index > selectedMethodIndex;

                        return (
                            <React.Fragment key={method.id}>
                                <button
                                    className={cx('payment-method', {
                                        'is-selected': isSelected,
                                        'is-blurred': isBlurred,
                                    })}
                                    onClick={() => handleSelectMethod(method.id)}
                                    type="button"
                                >
                                    <div
                                        className={cx('payment-method-icon', {
                                            'custom-icon': !method.iconBg && !method.iconImage,
                                            'has-image': method.iconImage,
                                        })}
                                        style={
                                            method.iconBg ? { backgroundColor: method.iconBg } : undefined
                                        }
                                    >
                                        {method.iconImage ? (
                                            <Image
                                                src={method.iconImage}
                                                alt={method.title}
                                                width={56}
                                                height={56}
                                                className={cx('payment-method-icon-image')}
                                            />
                                        ) : (
                                            method.icon
                                        )}
                                    </div>
                                    <div className={cx('payment-method-content')}>
                                        <h3 className={cx('payment-method-title')}>{method.title}</h3>
                                        <p className={cx('payment-method-description')}>
                                            {method.description}
                                        </p>
                                    </div>
                                    <div className={cx('payment-method-fee')}>{method.fee}</div>
                                </button>
                                {index < paymentMethods.length - 1 && (
                                    <div
                                        className={cx('payment-method-divider', {
                                            'is-blurred':
                                                isBlurred ||
                                                (selectedMethodId !== null &&
                                                    index === selectedMethodIndex),
                                        })}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PaymentLayout;


