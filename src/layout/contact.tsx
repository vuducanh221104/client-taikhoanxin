'use client';

import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from '@/app/(user)/contact/page.module.scss';
import { MailIcon, PhoneIcon, MapPinIcon, ClockIcon, SendIcon } from '@/components/Icons';

const cx = classNames.bind(styles);

const ContactLayout: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [touched, setTouched] = useState({
        name: false,
        email: false,
        subject: false,
        message: false,
    });

    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'name':
                if (!value.trim()) {
                    return 'Vui lòng điền vào trường này';
                }
                return '';
            case 'email':
                if (!value.trim()) {
                    return 'Vui lòng điền vào trường này';
                }
                // eslint-disable-next-line no-case-declarations
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value.trim())) {
                    return 'Vui lòng nhập địa chỉ email hợp lệ';
                }
                return '';
            case 'subject':
                if (!value.trim()) {
                    return 'Vui lòng điền vào trường này';
                }
                return '';
            case 'message':
                if (!value.trim()) {
                    return 'Vui lòng điền vào trường này';
                }
                return '';
            default:
                return '';
        }
    };

    const handleBlur = (fieldName: keyof typeof formData) => {
        setTouched((prev) => ({ ...prev, [fieldName]: true }));
        const errorText = validateField(fieldName, formData[fieldName]);
        setFieldErrors((prev) => ({ ...prev, [fieldName]: errorText }));
    };

    const handleChange = (fieldName: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [fieldName]: value }));
        if (fieldErrors[fieldName as keyof typeof fieldErrors]) {
            setFieldErrors((prev) => ({ ...prev, [fieldName]: '' }));
        }
        if (error) {
            setError('');
        }
    };

    const validateForm = (): boolean => {
        const errors = {
            name: validateField('name', formData.name),
            email: validateField('email', formData.email),
            subject: validateField('subject', formData.subject),
            message: validateField('message', formData.message),
        };
        setFieldErrors(errors);
        setTouched({
            name: true,
            email: true,
            subject: true,
            message: true,
        });
        return !errors.name && !errors.email && !errors.subject && !errors.message;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // TODO: Call API to send contact form
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setSuccess(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            });
            setFieldErrors({
                name: '',
                email: '',
                subject: '',
                message: '',
            });
            setTouched({
                name: false,
                email: false,
                subject: false,
                message: false,
            });
        } catch (err: any) {
            setError(err?.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cx('contact-page')}>
            <div className={cx('contact-container')}>
                <div className={cx('hero-section')}>
                    <h1 className={cx('hero-title')}>Liên Hệ Với Chúng Tôi</h1>
                    <p className={cx('hero-subtitle')}>
                        Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi ngay
                        hôm nay!
                    </p>
                </div>

                <div className={cx('contact-content')}>
                    <div className={cx('contact-info-section')}>
                        <h2 className={cx('section-title')}>Thông Tin Liên Hệ</h2>
                        <div className={cx('contact-info-list')}>
                            <div className={cx('contact-info-item')}>
                                <div className={cx('info-icon')}>
                                    <MailIcon size={24} />
                                </div>
                                <div className={cx('info-content')}>
                                    <h3 className={cx('info-title')}>Email</h3>
                                    <a
                                        href="mailto:contact@taikhoanxin.com"
                                        className={cx('info-link')}
                                    >
                                        support@taikhoanxin.com
                                    </a>
                                </div>
                            </div>

                            <div className={cx('contact-info-item')}>
                                <div className={cx('info-icon')}>
                                    <PhoneIcon size={24} />
                                </div>
                                <div className={cx('info-content')}>
                                    <h3 className={cx('info-title')}>Điện Thoại</h3>
                                    <a href="tel:+84901234567" className={cx('info-link')}>
                                        0377775528
                                    </a>
                                </div>
                            </div>

                            <div className={cx('contact-info-item')}>
                                <div className={cx('info-icon')}>
                                    <MapPinIcon size={24} />
                                </div>
                                <div className={cx('info-content')}>
                                    <h3 className={cx('info-title')}>Địa Chỉ</h3>
                                    <p className={cx('info-text')}>
                                        Thảo Điền, Quận 2, TP.HCM
                                    </p>
                                </div>
                            </div>

                            <div className={cx('contact-info-item')}>
                                <div className={cx('info-icon')}>
                                    <ClockIcon size={24} />
                                </div>
                                <div className={cx('info-content')}>
                                    <h3 className={cx('info-title')}>Giờ Làm Việc</h3>
                                    <p className={cx('info-text')}>
                                        Thứ 2 - Chủ nhật: 8:00 - 24:00
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className={cx('support-note')}>
                            <p>
                                <strong>Lưu ý:</strong> Chúng tôi hỗ trợ khách hàng 24/7 qua email và
                                các kênh mạng xã hội. Vui lòng gửi thông tin chi tiết để chúng tôi có
                                thể hỗ trợ bạn tốt nhất.
                            </p>
                        </div>
                    </div>

                    <div className={cx('contact-form-section')}>
                        <h2 className={cx('section-title')}>Gửi Tin Nhắn</h2>
                        <form onSubmit={handleSubmit} className={cx('contact-form')} noValidate>
                            {error && (
                                <div className={cx('form-error')}>
                                    <span className={cx('error-icon')}>⚠️</span>
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className={cx('form-success')}>
                                    <span className={cx('success-icon')}>✓</span>
                                    Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.
                                </div>
                            )}

                            <div className={cx('form-row')}>
                                <div className={cx('form-group')}>
                                    <label htmlFor="name" className={cx('form-label')}>
                                        Họ và tên <span className={cx('required')}>*</span>
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        className={cx('form-input', {
                                            'input-error': touched.name && fieldErrors.name,
                                        })}
                                        placeholder="Nhập họ và tên"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        onBlur={() => handleBlur('name')}
                                        disabled={loading}
                                    />
                                    {touched.name && fieldErrors.name && (
                                        <span className={cx('form-error-hint')}>
                                            {fieldErrors.name}
                                        </span>
                                    )}
                                </div>

                                <div className={cx('form-group')}>
                                    <label htmlFor="email" className={cx('form-label')}>
                                        Email <span className={cx('required')}>*</span>
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        className={cx('form-input', {
                                            'input-error': touched.email && fieldErrors.email,
                                        })}
                                        placeholder="Nhập email"
                                        value={formData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        onBlur={() => handleBlur('email')}
                                        disabled={loading}
                                    />
                                    {touched.email && fieldErrors.email && (
                                        <span className={cx('form-error-hint')}>
                                            {fieldErrors.email}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className={cx('form-row')}>
                                <div className={cx('form-group')}>
                                    <label htmlFor="phone" className={cx('form-label')}>
                                        Số điện thoại
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        className={cx('form-input')}
                                        placeholder="Nhập số điện thoại"
                                        value={formData.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        disabled={loading}
                                    />
                                </div>

                                <div className={cx('form-group')}>
                                    <label htmlFor="subject" className={cx('form-label')}>
                                        Chủ đề <span className={cx('required')}>*</span>
                                    </label>
                                    <input
                                        id="subject"
                                        type="text"
                                        className={cx('form-input', {
                                            'input-error': touched.subject && fieldErrors.subject,
                                        })}
                                        placeholder="Nhập chủ đề"
                                        value={formData.subject}
                                        onChange={(e) => handleChange('subject', e.target.value)}
                                        onBlur={() => handleBlur('subject')}
                                        disabled={loading}
                                    />
                                    {touched.subject && fieldErrors.subject && (
                                        <span className={cx('form-error-hint')}>
                                            {fieldErrors.subject}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className={cx('form-group')}>
                                <label htmlFor="message" className={cx('form-label')}>
                                    Nội dung tin nhắn <span className={cx('required')}>*</span>
                                </label>
                                <textarea
                                    id="message"
                                    className={cx('form-textarea', {
                                        'input-error': touched.message && fieldErrors.message,
                                    })}
                                    placeholder="Nhập nội dung tin nhắn..."
                                    rows={6}
                                    value={formData.message}
                                    onChange={(e) => handleChange('message', e.target.value)}
                                    onBlur={() => handleBlur('message')}
                                    disabled={loading}
                                ></textarea>
                                {touched.message && fieldErrors.message && (
                                    <span className={cx('form-error-hint')}>
                                        {fieldErrors.message}
                                    </span>
                                )}
                            </div>

                            <button type="submit" className={cx('submit-button')} disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className={cx('loading-spinner')}></span>
                                        Đang gửi...
                                    </>
                                ) : (
                                    <a href="https://zalo.me/0377775528" target="_blank" rel="noopener noreferrer">
                                        <SendIcon size={18} />
                                        Gửi Tin Nhắn
                                    </a>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactLayout;


