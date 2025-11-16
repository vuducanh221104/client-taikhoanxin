'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import classNames from 'classnames/bind';
import styles from './AccountAddress.module.scss';
import { CurrentUser } from '@/types/client';
import { MapPinIcon } from '@/components/Icons';

const cx = classNames.bind(styles);

interface AccountAddressProps {
    user: CurrentUser;
}

const AccountAddress: React.FC<AccountAddressProps> = ({ user }) => {
    const [formData, setFormData] = useState({
        province: '',
        district: '',
        ward: '',
        street: '',
        allowDisplayName: true,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [fieldErrors, setFieldErrors] = useState({
        province: '',
        district: '',
        ward: '',
        street: '',
    });
    const [touched, setTouched] = useState({
        province: false,
        district: false,
        ward: false,
        street: false,
    });

    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'province':
                if (!value || value === '') {
                    return 'Vui lòng chọn tỉnh/thành phố';
                }
                return '';
            case 'district':
                if (!value || value === '') {
                    return 'Vui lòng chọn quận/huyện';
                }
                return '';
            case 'ward':
                if (!value || value === '') {
                    return 'Vui lòng chọn xã/phường';
                }
                return '';
            case 'street':
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
        const error = validateField(fieldName, formData[fieldName]);
        setFieldErrors((prev) => ({ ...prev, [fieldName]: error }));
    };

    const handleChange = (fieldName: keyof typeof formData, value: string | boolean) => {
        if (fieldName === 'allowDisplayName') {
            setFormData((prev) => ({ ...prev, [fieldName]: value as boolean }));
        } else {
            setFormData((prev) => {
                const updated = { ...prev, [fieldName]: value as string };
                // Reset dependent fields when parent changes
                if (fieldName === 'province') {
                    updated.district = '';
                    updated.ward = '';
                    setFieldErrors((prev) => ({ ...prev, district: '', ward: '' }));
                } else if (fieldName === 'district') {
                    updated.ward = '';
                    setFieldErrors((prev) => ({ ...prev, ward: '' }));
                }
                return updated;
            });
            // Clear error when user starts typing/selecting
            if (fieldErrors[fieldName as keyof typeof fieldErrors]) {
                setFieldErrors((prev) => ({ ...prev, [fieldName]: '' }));
            }
        }
        // Clear general error when user starts typing
        if (error) {
            setError('');
        }
    };

    const validateForm = (): boolean => {
        const errors = {
            province: validateField('province', formData.province),
            district: validateField('district', formData.district),
            ward: validateField('ward', formData.ward),
            street: validateField('street', formData.street),
        };
        setFieldErrors(errors);
        setTouched({
            province: true,
            district: true,
            ward: true,
            street: true,
        });
        return !errors.province && !errors.district && !errors.ward && !errors.street;
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
            // TODO: Call API to update address
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSuccess('Cập nhật địa chỉ thành công!');
        } catch (err: any) {
            setError(err?.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    // Mock data for dropdowns - In real app, fetch from API
    const provinces = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ'];
    const districts = ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5'];
    const wards = ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5'];

    return (
        <div className={cx('account-address')}>
            <h2 className={cx('section-title')}>Địa chỉ & Quyền riêng tư</h2>

            <form onSubmit={handleSubmit} className={cx('address-form')} noValidate>
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
                        <label htmlFor="province" className={cx('form-label')}>
                            Tỉnh / Thành phố <span className={cx('required')}>*</span>
                        </label>
                        <select
                            id="province"
                            className={cx('form-select', {
                                'input-error': touched.province && fieldErrors.province,
                            })}
                            value={formData.province}
                            onChange={(e) => handleChange('province', e.target.value)}
                            onBlur={() => handleBlur('province')}
                            disabled={loading}
                        >
                            <option value="">-</option>
                            {provinces.map((province) => (
                                <option key={province} value={province}>
                                    {province}
                                </option>
                            ))}
                        </select>
                        {touched.province && fieldErrors.province && (
                            <span className={cx('form-error-hint')}>{fieldErrors.province}</span>
                        )}
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="district" className={cx('form-label')}>
                            Quận / Huyện <span className={cx('required')}>*</span>
                        </label>
                        <select
                            id="district"
                            className={cx('form-select', {
                                'input-error': touched.district && fieldErrors.district,
                            })}
                            value={formData.district}
                            onChange={(e) => handleChange('district', e.target.value)}
                            onBlur={() => handleBlur('district')}
                            disabled={loading || !formData.province}
                        >
                            <option value="">-</option>
                            {districts.map((district) => (
                                <option key={district} value={district}>
                                    {district}
                                </option>
                            ))}
                        </select>
                        {touched.district && fieldErrors.district && (
                            <span className={cx('form-error-hint')}>{fieldErrors.district}</span>
                        )}
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="ward" className={cx('form-label')}>
                            Xã / Phường <span className={cx('required')}>*</span>
                        </label>
                        <select
                            id="ward"
                            className={cx('form-select', {
                                'input-error': touched.ward && fieldErrors.ward,
                            })}
                            value={formData.ward}
                            onChange={(e) => handleChange('ward', e.target.value)}
                            onBlur={() => handleBlur('ward')}
                            disabled={loading || !formData.district}
                        >
                            <option value="">-</option>
                            {wards.map((ward) => (
                                <option key={ward} value={ward}>
                                    {ward}
                                </option>
                            ))}
                        </select>
                        {touched.ward && fieldErrors.ward && (
                            <span className={cx('form-error-hint')}>{fieldErrors.ward}</span>
                        )}
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="street" className={cx('form-label')}>
                            Số nhà / Đường <span className={cx('required')}>*</span>
                        </label>
                        <input
                            id="street"
                            type="text"
                            className={cx('form-input', {
                                'input-error': touched.street && fieldErrors.street,
                            })}
                            placeholder="Nhập số nhà, tên đường"
                            value={formData.street}
                            onChange={(e) => handleChange('street', e.target.value)}
                            onBlur={() => handleBlur('street')}
                            disabled={loading}
                        />
                        {touched.street && fieldErrors.street && (
                            <span className={cx('form-error-hint')}>{fieldErrors.street}</span>
                        )}
                    </div>
                </div>

                <div className={cx('form-actions')}>
                    <Link href="/account/addresses" className={cx('manage-address-link')}>
                        <MapPinIcon size={16} />
                        Quản lý địa chỉ mua hàng
                    </Link>

                    <label className={cx('checkbox-label')}>
                        <input
                            type="checkbox"
                            checked={formData.allowDisplayName}
                            onChange={(e) => handleChange('allowDisplayName', e.target.checked)}
                            disabled={loading}
                        />
                        <span>Cho phép hiển thị tên của bạn trên các hoạt động</span>
                    </label>
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

export default AccountAddress;

