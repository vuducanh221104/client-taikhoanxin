'use client';

import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from '@/app/(tools)/tools/youtube-tv/page.module.scss';
import { PlayIcon, YoutubeIcon, AlertCircleIcon, LoaderIcon } from '@/components/Icons';
import { useToast } from '@/hooks/useToast';

const cx = classNames.bind(styles);

export default function ToolsYoutubeTVLayout() {
    const [orderCode, setOrderCode] = useState('');
    const [email, setEmail] = useState('');
    const [tvCode, setTvCode] = useState('');
    const [errors, setErrors] = useState<{ orderCode?: string; email?: string; tvCode?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showSuccess, showError } = useToast();

    const validateForm = () => {
        const newErrors: { orderCode?: string; email?: string; tvCode?: string } = {};

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

        if (!tvCode.trim()) {
            newErrors.tvCode = 'Vui lòng điền vào trường này';
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
            showSuccess('Youtube TV đã được kích hoạt thành công!');
            setOrderCode('');
            setEmail('');
            setTvCode('');
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

    const handleTvCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTvCode(e.target.value);
        if (errors.tvCode) {
            setErrors({ ...errors, tvCode: undefined });
        }
    };

    return (
        <div className={cx('youtube-tv-page')}>
            <div className={cx('page-container')}>
                <div className={cx('page-header')}>
                    <YoutubeIcon className={cx('page-icon')} size={48} />
                    <h1 className={cx('page-title')}>Kích hoạt Youtube TV</h1>
                </div>

                <div className={cx('steps-section')}>
                    <div className={cx('step-card')}>
                        <h2 className={cx('step-title')}>Bước 1: Lấy thông tin đơn hàng</h2>
                        <p className={cx('step-description')}>
                            Truy cập{' '}
                            <a
                                href="https://taikhoanxin.com/account/orders"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cx('step-link')}
                            >
                                https://taikhoanxin.com/account/orders
                            </a>{' '}
                            và copy thông tin đơn hàng và email.
                        </p>
                    </div>

                    <div className={cx('step-card')}>
                        <h2 className={cx('step-title')}>Bước 2: Lấy mã trên TV</h2>
                        <p className={cx('step-description')}>
                            Mở ứng dụng Youtube trên TV và làm theo hướng dẫn để lấy mã kích hoạt.
                        </p>
                    </div>
                </div>

                <div className={cx('form-card')}>
                    <h2 className={cx('form-title')}>Nhập thông tin kích hoạt</h2>
                    <form onSubmit={handleSubmit} className={cx('form')} noValidate>
                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>Mã đơn hàng</label>
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
                                placeholder="Nhập email đã dùng mua hàng"
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
                            <label className={cx('form-label')}>Mã kích hoạt TV</label>
                            <input
                                type="text"
                                className={cx('form-input', { 'has-error': errors.tvCode })}
                                placeholder="Nhập mã kích hoạt hiển thị trên TV"
                                value={tvCode}
                                onChange={handleTvCodeChange}
                            />
                            {errors.tvCode && (
                                <div className={cx('form-error')}>
                                    <AlertCircleIcon className={cx('error-icon')} size={16} />
                                    <span>{errors.tvCode}</span>
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
                                'Kích hoạt Youtube TV'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}


