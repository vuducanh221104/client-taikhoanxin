'use client';

import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from '@/app/(tools)/tools/order-info/page.module.scss';
import { FileTextIcon, AlertCircleIcon, LoaderIcon } from '@/components/Icons';
import { useToast } from '@/hooks/useToast';

const cx = classNames.bind(styles);

export default function ToolsOrderInfoLayout() {
    const [orderCode, setOrderCode] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState<{ orderCode?: string; email?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showSuccess, showError } = useToast();

    const validateForm = () => {
        const newErrors: { orderCode?: string; email?: string } = {};

        if (!orderCode.trim()) {
            newErrors.orderCode = 'Vui lòng điền vào trường này';
        } else if (!/^[0-9]{7}$/.test(orderCode)) {
            newErrors.orderCode = 'Mã đơn hàng phải có 7 chữ số';
        }

        if (!email.trim()) {
            newErrors.email = 'Vui lòng điền vào trường này';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            showSuccess('Thông tin đơn hàng đã được cập nhật thành công!');
            setOrderCode('');
            setEmail('');
        } catch (error) {
            showError('Có lỗi xảy ra. Vui lòng thử lại sau.');
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOrderCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOrderCode(e.target.value);
        if (errors.orderCode) {
            setErrors({ ...errors, orderCode: undefined });
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (errors.email) {
            setErrors({ ...errors, email: undefined });
        }
    };

    return (
        <div className={cx('order-info-page')}>
            <div className={cx('page-container')}>
                <div className={cx('page-header')}>
                    <FileTextIcon className={cx('page-icon')} size={48} />
                    <h1 className={cx('page-title')}>Bổ sung thông tin đơn hàng</h1>
                </div>

                <div className={cx('form-card')}>
                    <form onSubmit={handleSubmit} className={cx('form')} noValidate>
                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>Đơn hàng</label>
                            <input
                                type="text"
                                className={cx('form-input', { 'has-error': errors.orderCode })}
                                placeholder="Nhập mã đơn hàng (7 chữ số)"
                                value={orderCode}
                                onChange={handleOrderCodeChange}
                                maxLength={7}
                            />
                            {errors.orderCode && (
                                <div className={cx('form-error')}>
                                    <AlertCircleIcon className={cx('error-icon')} size={16} />
                                    <span>{errors.orderCode}</span>
                                </div>
                            )}
                        </div>

                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>Email mua hàng</label>
                            <input
                                type="email"
                                className={cx('form-input', { 'has-error': errors.email })}
                                placeholder="Nhập email mua hàng"
                                value={email}
                                onChange={handleEmailChange}
                            />
                            {errors.email && (
                                <div className={cx('form-error')}>
                                    <AlertCircleIcon className={cx('error-icon')} size={16} />
                                    <span>{errors.email}</span>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={cx('form-submit', { 'is-loading': isSubmitting })}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <LoaderIcon className={cx('submit-loader')} size={18} />
                                    <span>Đang xử lý...</span>
                                </>
                            ) : (
                                'Kiểm tra thông tin'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}


