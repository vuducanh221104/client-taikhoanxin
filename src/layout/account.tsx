'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function AccountLayout() {
    const router = useRouter();
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
        <div style={{ padding: '20px', minHeight: '100vh' }}>
            <h1>Tài khoản của tôi</h1>
            <p>Xin chào, {currentUser.user_name || currentUser.email}</p>
            <p>Trang tài khoản đang được phát triển...</p>
        </div>
    );
}

