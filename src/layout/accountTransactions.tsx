'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/redux/store';
import AccountSidebar from '@/components/AccountSidebar/AccountSidebar';
import TransactionHistory from '@/components/TransactionHistory/TransactionHistory';
import classNames from 'classnames/bind';
import styles from '@/app/(user)/account/transactions/page.module.scss';

const cx = classNames.bind(styles);

export default function AccountTransactionsLayout() {
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
                <AccountSidebar activeItem="transactions" />

                {/* Main Content */}
                <div className={cx('account-content')}>
                    <TransactionHistory userId={currentUser._id} />
                </div>
            </div>
        </div>
    );
}

