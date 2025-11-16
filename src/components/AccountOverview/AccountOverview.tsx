'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import classNames from 'classnames/bind';
import styles from './AccountOverview.module.scss';
import { CurrentUser } from '@/types/client';
import { PencilIcon } from '@/components/Icons';

const cx = classNames.bind(styles);

interface AccountOverviewProps {
    user: CurrentUser;
}

const AccountOverview: React.FC<AccountOverviewProps> = ({ user }) => {
    const [avatar, setAvatar] = useState(user.avatar || '/avatar/user-icon.webp');
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            return date.toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
        } catch {
            return dateString;
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Vui lòng chọn ảnh nhỏ hơn 5MB');
                return;
            }

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);

            // TODO: Upload to server
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
                            alt={user.user_name || user.email}
                            width={120}
                            height={120}
                            className={cx('avatar-image')}
                        />
                    </div>
                    <button
                        type="button"
                        className={cx('avatar-edit-button')}
                        onClick={handleAvatarClick}
                    >
                        <PencilIcon size={16} />
                        Sửa ảnh đại diện
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleAvatarChange}
                    />
                    <div className={cx('avatar-guidelines')}>
                        <p>Vui lòng chọn ảnh nhỏ hơn 5MB</p>
                        <p>Chọn hình ảnh phù hợp, không phản cảm</p>
                    </div>
                </div>

                {/* Account Info Grid */}
                <div className={cx('account-info-grid')}>
                    <div className={cx('info-item')}>
                        <span className={cx('info-label')}>Tên đăng nhập</span>
                        <span className={cx('info-value', { 'no-username': !user.user_name })}>
                            {user.user_name || 'Chưa có tên đăng nhập'}
                        </span>
                    </div>
                    <div className={cx('info-item')}>
                        <span className={cx('info-label')}>Email</span>
                        <span className={cx('info-value')}>{user.email}</span>
                    </div>
                    <div className={cx('info-item')}>
                        <span className={cx('info-label')}>Họ và tên</span>
                        <span className={cx('info-value')}>{user.full_name || user.user_name || 'N/A'}</span>
                    </div>
                    <div className={cx('info-item')}>
                        <span className={cx('info-label')}>Nhóm khách hàng</span>
                        <span className={cx('info-value')}>{getCustomerGroup(user.role)}</span>
                    </div>
                    <div className={cx('info-item')}>
                        <span className={cx('info-label')}>Số dư</span>
                        <span className={cx('info-value', 'balance')}>0đ</span>
                    </div>
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

