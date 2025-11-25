'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { mutate } from 'swr';
import classNames from 'classnames/bind';
import styles from './AccountPersonal.module.scss';
import { CurrentUser } from '@/types/client';
import { updateProfile } from '@/services/userService';
import { changeUser } from '@/redux/authSlice';
import { useToast } from '@/hooks/useToast';

const cx = classNames.bind(styles);

interface AccountPersonalProps {
    user: CurrentUser;
}

const AccountPersonal: React.FC<AccountPersonalProps> = ({ user }) => {
    const dispatch = useDispatch();
    const { showSuccess, showError } = useToast();
    
    // Initialize form data from user prop (from DB)
    const [formData, setFormData] = useState({
        email: user.email || '',
        fullName: user.full_name || '',
        phone: user.phone_number || '',
        idCard: user.citizenIdentity || '',
        gender: user.gender || '',
    });

    // Update form data when user prop changes (when profile is fetched from DB)
    React.useEffect(() => {
        setFormData({
            email: user.email || '',
            fullName: user.full_name || '',
            phone: user.phone_number || '',
            idCard: user.citizenIdentity || '',
            gender: user.gender || '',
        });
    }, [user]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [fieldErrors, setFieldErrors] = useState({
        fullName: '',
        phone: '',
    });
    const [touched, setTouched] = useState({
        fullName: false,
        phone: false,
    });

    const validateField = (name: string, value: string): string => {
        switch (name) {
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
            fullName: validateField('fullName', formData.fullName),
            phone: validateField('phone', formData.phone),
        };
        setFieldErrors(errors);
        setTouched({
            fullName: true,
            phone: true,
        });
        return !errors.fullName && !errors.phone;
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
            // Prepare data for API (map to API format)
            const updateData: {
                fullName?: string;
                phone?: string;
                gender?: string;
                citizenIdentity?: string;
            } = {};

            if (formData.fullName) {
                updateData.fullName = formData.fullName.trim();
            }
            if (formData.phone) {
                updateData.phone = formData.phone.replace(/\s+/g, '');
            }
            if (formData.gender) {
                updateData.gender = formData.gender;
            }
            if (formData.idCard) {
                updateData.citizenIdentity = formData.idCard.replace(/\s+/g, '');
            }

            // Call API to update profile
            const response = await updateProfile(updateData);

            if (response.success && response.data) {
                // Update Redux state with new user data
                const updatedUser: CurrentUser = {
                    ...user,
                    full_name: response.data.fullName || user.full_name || '',
                    phone_number: response.data.phone || user.phone_number || '',
                    gender: response.data.gender || user.gender || '',
                    citizenIdentity: response.data.citizenIdentity || user.citizenIdentity || '',
                    avatar: response.data.avatar || user.avatar,
                };
                dispatch(changeUser(updatedUser));

                // Revalidate SWR cache to get fresh data from DB
                mutate('/api/v1/users/profile');

                setSuccess('Cập nhật thông tin thành công!');
                showSuccess('Cập nhật thông tin thành công!');
            } else {
                throw new Error('Cập nhật thông tin thất bại');
            }
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
            setError(errorMessage);
            showError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cx('account-personal')}>
            <h2 className={cx('section-title')}>Cá nhân</h2>

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
                        <label htmlFor="email" className={cx('form-label')}>
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className={cx('form-input')}
                            value={formData.email}
                            disabled={true}
                            style={{ opacity: 0.6, cursor: 'not-allowed' }}
                        />
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

