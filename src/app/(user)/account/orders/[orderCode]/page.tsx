'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import AccountSidebar from '@/components/AccountSidebar/AccountSidebar';
import OrderDetail from '@/components/OrderDetail/OrderDetail';
import classNames from 'classnames/bind';
import styles from './page.module.scss';

const cx = classNames.bind(styles);

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderCode = params.orderCode as string;
    const currentUser = useSelector((state: RootState) => state.auth.login.currentUser);

    React.useEffect(() => {
        if (!currentUser) {
            router.push('/auth/login');
        }
    }, [currentUser, router]);

    if (!currentUser) {
        return null;
    }

    return (
        <div className={cx('order-detail-page')}>
            <div className={cx('order-detail-container')}>
                <AccountSidebar activeItem="orders" />
                <div className={cx('order-detail-content')}>
                    <OrderDetail orderCode={orderCode} userId={currentUser._id} />
                </div>
            </div>
        </div>
    );
}
