'use client';

import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from '@/app/(tools)/tools/login-code/page.module.scss';
import { KeyIcon, AlertCircleIcon, LoaderIcon } from '@/components/Icons';
import { useToast } from '@/hooks/useToast';

const cx = classNames.bind(styles);

export default function LoginCodeLayout() {
    const [method, setMethod] = useState('email');
    const [email, setEmail] = useState('');
    const [orderId, setOrderId] = useState('');
    const [errors, setErrors] = useState<{ email?: string; orderId?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showSuccess, showError } = useToast();

    const validateForm = () => {
        const newErrors: { email?: string; orderId?: string } = {};

        if (method === 'email') {
            if (!email.trim()) {
                newErrors.email = 'Vui lòng điền vào trường này';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                newErrors.email = 'Email không hợp lệ';
            }
        } else if (method === 'orderid') {
            if (!orderId.trim()) {
                newErrors.orderId = 'Vui lòng điền vào trường này';
            } else if (!/^[0-9]{7}$/.test(orderId)) {
                newErrors.orderId = 'Mã đơn hàng phải có 7 chữ số';
            }
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
            showSuccess('Mã đăng nhập đã được gửi đến email của bạn! Nếu không nhận được, vui lòng kiểm tra thư spam.');
            setEmail('');
            setOrderId('');
            setMethod('email');
        } catch (error) {
            showError('Có lỗi xảy ra. Vui lòng thử lại sau.');
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (errors.email) {
            setErrors({ ...errors, email: undefined });
        }
    };

    const handleOrderIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOrderId(e.target.value);
        if (errors.orderId) {
            setErrors({ ...errors, orderId: undefined });
        }
    };

    const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMethod(e.target.value);
        setErrors({});
        setEmail('');
        setOrderId('');
    };

    return (
        <div className={cx('login-code-page')}>
            <div className={cx('page-container')}>
                <div className={cx('page-header')}>
                    <KeyIcon className={cx('page-icon')} size={48} />
                    <h1 className={cx('page-title')}>Lấy mã đăng nhập</h1>
                </div>

                <div className={cx('form-card')}>
                    <div className={cx('form-header')}>
                        <h2 className={cx('form-title')}>Thông tin tài khoản</h2>
                        <p className={cx('form-description')}>
                            Chọn phương thức và nhập thông tin để lấy mã đăng nhập
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className={cx('form')} noValidate>
                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>Chọn phương thức lấy mã</label>
                            <select
                                className={cx('form-select')}
                                value={method}
                                onChange={handleMethodChange}
                            >
                                <option value="email">Lấy mã theo email mua hàng</option>
                                <option value="orderid">Lấy mã theo OrderID</option>
                            </select>
                        </div>

                        {method === 'email' ? (
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')}>Email tài khoản</label>
                                <input
                                    type="email"
                                    className={cx('form-input', { 'has-error': errors.email })}
                                    placeholder="Điền email mua hàng taikhoanxin.com"
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
                        ) : (
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')}>Mã đơn hàng (OrderID)</label>
                                <input
                                    type="text"
                                    className={cx('form-input', { 'has-error': errors.orderId })}
                                    placeholder="Nhập mã đơn hàng (7 chữ số)"
                                    value={orderId}
                                    onChange={handleOrderIdChange}
                                    maxLength={7}
                                />
                                {errors.orderId && (
                                    <div className={cx('form-error')}>
                                        <AlertCircleIcon className={cx('error-icon')} size={16} />
                                        <span>{errors.orderId}</span>
                                    </div>
                                )}
                            </div>
                        )}

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
                                'Lấy mã đăng nhập'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}


