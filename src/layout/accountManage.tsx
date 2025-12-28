'use client';

import React from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/redux/store';
import { useProfile } from '@/services/userService';
import AccountSidebar from '@/components/AccountSidebar/AccountSidebar';
import AccountOverview from '@/components/AccountOverview/AccountOverview';
import AccountPersonal from '@/components/AccountPersonal/AccountPersonal';
import AccountAddress from '@/components/AccountAddress/AccountAddress';
import classNames from 'classnames/bind';
import styles from '@/app/(user)/account/manage/page.module.scss';
import { CurrentUser } from '@/types/client';
import { HeartIcon } from '@/components/Icons';
import { changeUser } from '@/redux/authSlice';

const cx = classNames.bind(styles);

export default function AccountManageLayout() {
    const router = useRouter();
    const currentUser = useSelector((state: RootState) => state.auth.login.currentUser);
    const dispatch = useDispatch();
    
    // Fetch user profile from API (latest data from DB)
    const { data: profileData, error: profileError, isLoading: profileLoading, mutate: mutateProfile } = useProfile();

    // Redirect to login if not authenticated
    React.useEffect(() => {
        if (!currentUser) {
            router.push('/auth/login');
        }
    }, [currentUser, router]);

    // Map API profile data to CurrentUser format
    const userProfile: CurrentUser | null = React.useMemo(() => {
        if (profileData?.data && currentUser) {
            return {
                _id: profileData.data._id,
                email: profileData.data.email,
                full_name: profileData.data.fullName || '',
                phone_number: profileData.data.phone || '',
                user_name: currentUser.user_name || '',
                role: profileData.data.role,
                type: currentUser.type || 'WEBSITE',
                is_verified: profileData.data.isVerified,
                avatar: profileData.data.avatar,
                gender: profileData.data.gender,
                citizenIdentity: profileData.data.citizenIdentity,
                address: profileData.data.address
                    ? {
                          province: profileData.data.address.province || { value: '', text: '' },
                          district: profileData.data.address.district || { value: '', text: '' },
                          ward: profileData.data.address.ward || { value: '', text: '' },
                          street: profileData.data.address.street || '',
                      }
                    : undefined,
                accessToken: currentUser.accessToken,
                refreshToken: currentUser.refreshToken,
            };
        }
        return currentUser;
    }, [profileData?.data, currentUser]);

    React.useEffect(() => {
        if (userProfile && currentUser) {
            const fieldsToCompare: (keyof CurrentUser)[] = ['avatar', 'full_name', 'phone_number', 'gender', 'address'];
            const hasChanges = fieldsToCompare.some((field) => {
                const currentValue = currentUser[field];
                const newValue = userProfile[field];
                return JSON.stringify(currentValue) !== JSON.stringify(newValue);
            });

            if (hasChanges) {
                dispatch(changeUser({
                    ...currentUser,
                    ...userProfile,
                } as CurrentUser));
            }
        }
    }, [userProfile, currentUser, dispatch]);

    // Nếu chưa đăng nhập, không render nội dung tài khoản
    if (!currentUser) {
        return null;
    }

    // Show loading state while fetching profile
    if (profileLoading) {
        return (
            <div className={cx('account-page')}>
                <div className={cx('account-container')}>
                    <AccountSidebar activeItem="account" />
                    <div className={cx('account-content')}>
                        <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải thông tin...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={cx('account-page')}>
            <div className={cx('account-container')}>
                {/* Sidebar */}
                <AccountSidebar activeItem="account" />

                {/* Main Content */}
                <div className={cx('account-content')}>
                    {/* Overview Section */}
                    <AccountOverview
                        user={userProfile || currentUser}
                        onProfileReload={async () => {
                            await mutateProfile();
                        }}
                    />

                    {/* Quick Tabs */}
                    <div className={cx('account-tabs')}>
                        <Link href="/wishlist" className={cx('account-tab')}>
                            <HeartIcon size={18} />
                            <span>Sản phẩm yêu thích</span>
                        </Link>
                    </div>

                    {/* Personal Section */}
                    <AccountPersonal user={userProfile || currentUser} />

                    {/* Address & Privacy Section */}
                    <AccountAddress user={userProfile || currentUser} />
                </div>
            </div>
        </div>
    );
}

