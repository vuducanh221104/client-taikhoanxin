'use client';

import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './AccountPersonal.module.scss';
import { CurrentUser } from '@/types/client';

const cx = classNames.bind(styles);

interface AccountPersonalProps {
    user: CurrentUser;
}

const AccountPersonal: React.FC<AccountPersonalProps> = ({ user }) => {
    const [formData, setFormData] = useState({
        username: user.user_name || '',
        fullName: user.full_name || '',
        phone: user.phone_number || '',
        idCard: '',
        gender: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [fieldErrors, setFieldErrors] = useState({
        username: '',
        fullName: '',
        phone: '',
    });
    const [touched, setTouched] = useState({
        username: false,
        fullName: false,
        phone: false,
    });

    const needsUsername = !user.user_name;

    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'username':
                if (needsUsername && !value.trim()) {
                    return 'Vui lòng điền vào trường này';
                }
                if (value.trim().length > 0 && value.trim().length < 6) {
                    return 'Tên đăng nhập phải có ít nhất 6 ký tự';
                }
                return '';
            case 'fullName':
                if (!value.trim()) {
                    return 'Vui lòng điền vào trường này';
                }
                return '';
            case 'phone':
                if (!value.trim()) {
                    return 'Vui lòng điền vào trường này';
                }
                const phoneRegex = /^[0-9]{10,11}$/;
                if (!phoneRegex.test(value.replace(/\s+/g, ''))) {
                    return 'Số điện thoại không hợp lệ (10-11 số)';
                }
                return '';
            default:
                return '';
        }
    };

    const handleBlur = (fieldName: keyof typeof formData) => {
        setTouched((prev) => ({ ...prev, [fieldName]: true }));
        const error = validateField(fieldName, formData[fieldName]);
        setFieldErrors((prev) => ({ ...prev, [fieldName]: error }));
    };

    const handleChange = (fieldName: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [fieldName]: value }));
        // Clear error when user starts typing
        if (fieldErrors[fieldName as keyof typeof fieldErrors]) {
            setFieldErrors((prev) => ({ ...prev, [fieldName]: '' }));
        }
        // Clear general error when user starts typing
        if (error) {
            setError('');
        }
    };

    const validateForm = (): boolean => {
        const errors = {
            username: validateField('username', formData.username),
            fullName: validateField('fullName', formData.fullName),
            phone: validateField('phone', formData.phone),
        };
        setFieldErrors(errors);
        setTouched({
            username: true,
            fullName: true,
            phone: true,
        });
        return !errors.username && !errors.fullName && !errors.phone;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate form
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // TODO: Call API to update user info
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSuccess('Cập nhật thông tin thành công!');
        } catch (err: any) {
            setError(err?.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cx('account-personal')}>
            <h2 className={cx('section-title')}>Cá nhân</h2>
            
            {needsUsername && (
                <div className={cx('username-warning')}>
                    Bạn vui lòng cập nhật tên đăng nhập
                </div>
            )}

            <form onSubmit={handleSubmit} className={cx('personal-form')} noValidate>
                {error && (
                    <div className={cx('error-message')}>
                        <span className={cx('error-icon')}>⚠️</span>
                        {error}
                    </div>
                )}

                {success && (
                    <div className={cx('success-message')}>
                        <span className={cx('success-icon')}>✓</span>
                        {success}
                    </div>
                )}

                <div className={cx('form-grid')}>
                    <div className={cx('form-group')}>
                        <label htmlFor="username" className={cx('form-label')}>
                            Tên đăng nhập {needsUsername && <span className={cx('required')}>*</span>}
                        </label>
                        <input
                            id="username"
                            type="text"
                            className={cx('form-input', { 
                                'has-error': touched.username && fieldErrors.username,
                                'input-error': touched.username && fieldErrors.username,
                            })}
                            placeholder="Nhập tên đăng nhập"
                            value={formData.username}
                            onChange={(e) => handleChange('username', e.target.value)}
                            onBlur={() => handleBlur('username')}
                            disabled={loading}
                        />
                        {touched.username && fieldErrors.username && (
                            <span className={cx('form-error-hint')}>{fieldErrors.username}</span>
                        )}
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="fullName" className={cx('form-label')}>
                            Họ và tên <span className={cx('required')}>*</span>
                        </label>
                        <input
                            id="fullName"
                            type="text"
                            className={cx('form-input', { 
                                'has-error': touched.fullName && fieldErrors.fullName,
                                'input-error': touched.fullName && fieldErrors.fullName,
                            })}
                            placeholder="Nhập họ và tên"
                            value={formData.fullName}
                            onChange={(e) => handleChange('fullName', e.target.value)}
                            onBlur={() => handleBlur('fullName')}
                            disabled={loading}
                        />
                        {touched.fullName && fieldErrors.fullName && (
                            <span className={cx('form-error-hint')}>{fieldErrors.fullName}</span>
                        )}
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="phone" className={cx('form-label')}>
                            Số điện thoại <span className={cx('required')}>*</span>
                        </label>
                        <div className={cx('phone-input-wrapper', {
                            'has-error': touched.phone && fieldErrors.phone,
                        })}>
                            <span className={cx('phone-prefix')}>+84</span>
                            <input
                                id="phone"
                                type="tel"
                                className={cx('form-input', 'phone-input', {
                                    'input-error': touched.phone && fieldErrors.phone,
                                })}
                                placeholder="Nhập số điện thoại"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value.replace(/[^0-9]/g, ''))}
                                onBlur={() => handleBlur('phone')}
                                disabled={loading}
                            />
                        </div>
                        {touched.phone && fieldErrors.phone && (
                            <span className={cx('form-error-hint')}>{fieldErrors.phone}</span>
                        )}
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="idCard" className={cx('form-label')}>
                            Chứng minh nhân dân
                        </label>
                        <input
                            id="idCard"
                            type="text"
                            className={cx('form-input')}
                            placeholder="Nhập số CMND/CCCD"
                            value={formData.idCard}
                            onChange={(e) => handleChange('idCard', e.target.value.replace(/[^0-9]/g, ''))}
                            disabled={loading}
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="gender" className={cx('form-label')}>
                            Giới tính
                        </label>
                        <select
                            id="gender"
                            className={cx('form-select')}
                            value={formData.gender}
                            onChange={(e) => handleChange('gender', e.target.value)}
                            disabled={loading}
                        >
                            <option value="">-</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className={cx('save-button')} disabled={loading}>
                    {loading ? (
                        <>
                            <span className={cx('loading-spinner')}></span>
                            Đang lưu...
                        </>
                    ) : (
                        'Lưu thay đổi'
                    )}
                </button>
            </form>
        </div>
    );
};

export default AccountPersonal;

