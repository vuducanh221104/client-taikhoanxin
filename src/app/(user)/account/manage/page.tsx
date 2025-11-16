'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/redux/store';
import AccountSidebar from '@/components/AccountSidebar/AccountSidebar';
import AccountOverview from '@/components/AccountOverview/AccountOverview';
import AccountPersonal from '@/components/AccountPersonal/AccountPersonal';
import AccountAddress from '@/components/AccountAddress/AccountAddress';
import classNames from 'classnames/bind';
import styles from './page.module.scss';

const cx = classNames.bind(styles);

export default function AccountManagePage() {
    const router = useRouter();
    const currentUser = useSelector((state: RootState) => state.auth.login.currentUser);

    // Redirect to login if not authenticated
    React.useEffect(() => {
        if (!currentUser) {
            router.push('/auth/login');
        }
    }, [currentUser, router]);

    if (!currentUser) {
        return null;
    }

    return (
        <div className={cx('account-page')}>
            <div className={cx('account-container')}>
                {/* Sidebar */}
                <AccountSidebar activeItem="account" />

                {/* Main Content */}
                <div className={cx('account-content')}>
                    {/* Overview Section */}
                    <AccountOverview user={currentUser} />

                    {/* Personal Section */}
                    <AccountPersonal user={currentUser} />

                    {/* Address & Privacy Section */}
                    <AccountAddress user={currentUser} />
                </div>
            </div>
        </div>
    );
}

