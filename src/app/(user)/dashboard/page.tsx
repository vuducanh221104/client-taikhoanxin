'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { logoutUser } from '@/redux/authActions';
import { useToast } from '@/hooks/useToast';

export default function DashboardPage() {
    const dispatch = useDispatch();
    const currentUser = useSelector((state: RootState) => state.auth.login.currentUser);
    const { showSuccess, showError } = useToast();

    const handleLogout = async () => {
        try {
            showSuccess('Đăng xuất thành công!');
            await logoutUser(dispatch);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Đăng xuất thất bại. Vui lòng thử lại!';
            showError(errorMessage);
            console.error('Logout failed:', error);
        }
    };

    return (
        <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Dashboard</h1>
            {currentUser ? (
                <div>
                    <p>Welcome, {currentUser.user_name || currentUser.email}!</p>
                    <div style={{ marginTop: '20px' }}>
                        <p>Email: {currentUser.email}</p>
                        <p>Full Name: {currentUser.full_name || 'N/A'}</p>
                        <p>Role: {currentUser.role}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{ marginTop: '20px', padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <p>Not logged in</p>
            )}
        </div>
    );
}

