'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/redux/store';
import AccountSidebar from '@/components/AccountSidebar/AccountSidebar';
import MyComments from '@/components/MyComments/MyComments';
import classNames from 'classnames/bind';
import styles from './page.module.scss';

const cx = classNames.bind(styles);

export default function AccountCommentsPage() {
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
                <AccountSidebar activeItem="comments" />

                {/* Main Content */}
                <div className={cx('account-content')}>
                    <MyComments userId={currentUser._id} />
                </div>
            </div>
        </div>
    );
}

