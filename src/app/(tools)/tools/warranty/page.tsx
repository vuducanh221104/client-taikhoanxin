'use client';

import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './page.module.scss';
import { PaperPlaneIcon, PhoneIcon, AlertCircleIcon, LoaderIcon } from '@/components/Icons';
import { useToast } from '@/hooks/useToast';

const cx = classNames.bind(styles);

export default function WarrantyPage() {
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [orderCode, setOrderCode] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState<{ phone?: string; email?: string; orderCode?: string; description?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showSuccess, showError } = useToast();

    const validateForm = () => {
        const newErrors: { phone?: string; email?: string; orderCode?: string; description?: string } = {};

        if (!phone.trim()) {
            newErrors.phone = 'Vui lòng điền vào trường này';
        }

        if (!email.trim()) {
            newErrors.email = 'Vui lòng điền vào trường này';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!orderCode.trim()) {
            newErrors.orderCode = 'Vui lòng điền vào trường này';
        }

        if (!description.trim()) {
            newErrors.description = 'Vui lòng điền vào trường này';
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
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // TODO: Replace with actual API call
            // const response = await fetch('/api/tools/warranty', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ phone, email, orderCode, description }),
            // });
            // const data = await response.json();

            showSuccess('Thông tin bảo hành đã được gửi thành công!');
            
            // Reset form after success
            setPhone('');
            setEmail('');
            setOrderCode('');
            setDescription('');
        } catch (error) {
            showError('Có lỗi xảy ra. Vui lòng thử lại sau.');
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
        if (errors.phone) {
            setErrors({ ...errors, phone: undefined });
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (errors.email) {
            setErrors({ ...errors, email: undefined });
        }
    };

    const handleOrderCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOrderCode(e.target.value);
        if (errors.orderCode) {
            setErrors({ ...errors, orderCode: undefined });
        }
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
        if (errors.description) {
            setErrors({ ...errors, description: undefined });
        }
    };

    return (
        <div className={cx('warranty-page')}>
            <div className={cx('page-container')}>
                {/* Header */}
                <div className={cx('page-header')}>
                    <PaperPlaneIcon className={cx('page-icon')} size={48} />
                    <h1 className={cx('page-title')}>Gửi thông tin Bảo hành</h1>
                </div>

                {/* Form Card */}
                <div className={cx('form-card')}>
                    <form onSubmit={handleSubmit} className={cx('form')} noValidate>
                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>
                                <PhoneIcon className={cx('label-icon')} size={16} />
                                SĐT
                            </label>
                            <input
                                type="tel"
                                className={cx('form-input', { 'has-error': errors.phone })}
                                placeholder="SĐT đăng kí Zalo để gửi thông báo khi hoàn thành"
                                value={phone}
                                onChange={handlePhoneChange}
                            />
                            {errors.phone && (
                                <div className={cx('form-error')}>
                                    <AlertCircleIcon className={cx('error-icon')} size={16} />
                                    <span>{errors.phone}</span>
                                </div>
                            )}
                        </div>

                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>Email</label>
                            <input
                                type="email"
                                className={cx('form-input', { 'has-error': errors.email })}
                                placeholder="Điền Email mua hàng"
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

                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>Đơn hàng</label>
                            <input
                                type="text"
                                className={cx('form-input', { 'has-error': errors.orderCode })}
                                placeholder="Điền mã đơn hàng cần bảo hành"
                                value={orderCode}
                                onChange={handleOrderCodeChange}
                            />
                            {errors.orderCode && (
                                <div className={cx('form-error')}>
                                    <AlertCircleIcon className={cx('error-icon')} size={16} />
                                    <span>{errors.orderCode}</span>
                                </div>
                            )}
                        </div>

                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>Mô tả lỗi sản phẩm</label>
                            <textarea
                                className={cx('form-textarea', { 'has-error': errors.description })}
                                placeholder="Mô tả chi tiết lỗi sản phẩm bạn cần bảo hành"
                                value={description}
                                onChange={handleDescriptionChange}
                                rows={6}
                            />
                            {errors.description && (
                                <div className={cx('form-error')}>
                                    <AlertCircleIcon className={cx('error-icon')} size={16} />
                                    <span>{errors.description}</span>
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
                                'Gửi bảo hành'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

