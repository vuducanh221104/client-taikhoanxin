'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import classNames from 'classnames/bind';
import styles from './AccountOverview.module.scss';
import { CurrentUser } from '@/types/client';
import { PencilIcon } from '@/components/Icons';
import { useToast } from '@/hooks/useToast';
import { updateProfile } from '@/services/userService';

const cx = classNames.bind(styles);

interface AccountOverviewProps {
    user: CurrentUser;
    onProfileReload?: () => Promise<any> | void;
}

const AccountOverview: React.FC<AccountOverviewProps> = ({ user, onProfileReload }) => {
    const [avatar, setAvatar] = useState(user.avatar || '/avatar/user-icon.webp');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showSuccess, showError } = useToast();

    useEffect(() => {
        setAvatar(user.avatar || '/avatar/user-icon.webp');
    }, [user.avatar]);

    const formatBalance = (amount: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString?: string): string => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');
            return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        } catch {
            return dateString;
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                showError('Vui lòng chọn ảnh nhỏ hơn 5MB');
                return;
            }

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);

            setIsUploading(true);
            try {
                await updateProfile({ avatar: file });
                showSuccess('Cập nhật ảnh đại diện thành công!');
                await onProfileReload?.();
            } catch (error: any) {
                const errorMessage = error?.response?.data?.message || error?.message || 'Không thể cập nhật ảnh đại diện. Vui lòng thử lại!';
                showError(errorMessage);
                setAvatar(user.avatar || '/avatar/user-icon.webp');
            } finally {
                setIsUploading(false);
            }
        }
    };

    const getCustomerGroup = (role: number): string => {
        switch (role) {
            case 2:
                return 'Admin';
            case 1:
                return 'Manager';
            default:
                return 'Member';
        }
    };

    return (
        <div className={cx('account-overview')}>
            <h2 className={cx('section-title')}>Tổng quan</h2>
            
            <div className={cx('overview-content')}>
                {/* Avatar Section */}
                <div className={cx('avatar-section')}>
                    <div className={cx('avatar-wrapper')}>
                        <Image
                            src={avatar}
                            alt={user.full_name || user.email}
                            width={120}
                            height={120}
                            className={cx('avatar-image')}
                        />
                    </div>
                    <button
                        type="button"
                        className={cx('avatar-edit-button')}
                        onClick={handleAvatarClick}
                        disabled={isUploading}
                        aria-busy={isUploading}
                    >
                        <PencilIcon size={16} />
                        {isUploading ? 'Đang cập nhật...' : 'Sửa ảnh đại diện'}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleAvatarChange}
                        disabled={isUploading}
                    />
                    <div className={cx('avatar-guidelines')}>
                        <p>Vui lòng chọn ảnh nhỏ hơn 5MB</p>
                        <p>Chọn hình ảnh phù hợp, không phản cảm</p>
                    </div>
                </div>

                {/* Account Info Grid */}
                <div className={cx('account-info-grid')}>
                    <div className={cx('info-item')}>
                        <span className={cx('info-label')}>Email</span>
                        <span className={cx('info-value')}>{user.email}</span>
                    </div>
                    <div className={cx('info-item')}>
                        <span className={cx('info-label')}>Họ và tên</span>
                        <span className={cx('info-value')}>{user.full_name || 'N/A'}</span>
                    </div>
                    <div className={cx('info-item')}>
                        <span className={cx('info-label')}>Nhóm khách hàng</span>
                        <span className={cx('info-value')}>{getCustomerGroup(user.role)}</span>
                    </div>
                    {/* Temporarily hidden */}
                    {/* <div className={cx('info-item')}>
                        <span className={cx('info-label')}>Số dư</span>
                        <span className={cx('info-value', 'balance')}>0đ</span>
                    </div> */}
                    <div className={cx('info-item')}>
                        <span className={cx('info-label')}>Đã tích lũy</span>
                        <span className={cx('info-value', 'accumulated')}>0đ</span>
                    </div>
                    <div className={cx('info-item')}>
                        <span className={cx('info-label')}>Ngày tham gia</span>
                        <span className={cx('info-value')}>
                            {formatDate(new Date().toISOString())}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountOverview;

