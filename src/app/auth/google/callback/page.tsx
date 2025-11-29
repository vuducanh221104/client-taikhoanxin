'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './page.module.scss';
import { exchangeGoogleAuth, type AuthResponse } from '@/services/authService';
import { loginSuccess, loginFailed } from '@/redux/authSlice';
import { RootState } from '@/redux/store';
import { clearCart as clearGuestCart } from '@/redux/cartSlice';
import { importGuestCart } from '@/services/cartService';
import { useSWRConfig } from 'swr';
import { useToast } from '@/hooks/useToast';
import { LoaderIcon, ShieldCheckIcon, AlertCircleIcon } from '@/components/Icons';

const cx = classNames.bind(styles);

const extractSlugFromHref = (href?: string | null): string | undefined => {
    if (!href || typeof href !== 'string') return undefined;
    const trimmed = href.trim();
    if (!trimmed) return undefined;
    try {
        const url = trimmed.startsWith('http') ? new URL(trimmed) : new URL(trimmed, 'http://dummy');
        const segments = url.pathname.split('/').filter(Boolean);
        if (segments.length === 0) return undefined;
        const lastSegment = segments[segments.length - 1];
        return lastSegment || undefined;
    } catch {
        const match = trimmed.match(/\/product\/([^/?#]+)/i);
        if (match && match[1]) {
            return match[1];
        }
        return undefined;
    }
};

const GoogleAuthCallbackPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const { mutate: globalMutate } = useSWRConfig();
    const guestCart = useSelector((state: RootState) => state.cart);
    const { showError, showSuccess } = useToast();
    const [message, setMessage] = React.useState('Đang xác minh đăng nhập Google...');
    const [isError, setIsError] = React.useState(false);
    const hasExchangedRef = useRef(false);

    const importGuestCartAfterLogin = React.useCallback(
        async (accessToken: string) => {
            if (guestCart.products.length === 0) {
                return;
            }

            await importGuestCart(
                {
                    items: guestCart.products.map((item) => ({
                        productId: item.id,
                        slug: item.slug || extractSlugFromHref(item.href),
                        quantity: item.quantity,
                        options: item.options && item.options.length > 0 ? item.options : undefined,
                    })),
                },
                accessToken
            );
            dispatch(clearGuestCart());
            await globalMutate('/api/v1/cart');
        },
        [dispatch, guestCart.products, globalMutate]
    );

    const handleAuthSuccess = React.useCallback(
        async (response: AuthResponse, redirectTarget?: string | null) => {
            if (!response.success || !response.data) {
                throw new Error(response.message || 'Đăng nhập thất bại');
            }

            dispatch(
                loginSuccess({
                    ...response.data.user,
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken,
                })
            );

            try {
                await importGuestCartAfterLogin(response.data.accessToken);
            } catch (error) {
                console.error('Failed to sync guest cart after Google login', error);
                showError('Không thể đồng bộ giỏ hàng của bạn sau khi đăng nhập Google.');
            }

            showSuccess('Đăng nhập Google thành công!');
            const target = redirectTarget ? decodeURIComponent(redirectTarget) : '/';
            router.replace(target || '/');
        },
        [dispatch, importGuestCartAfterLogin, router, showError, showSuccess]
    );

    React.useEffect(() => {
        const token = searchParams.get('token');
        const redirectTarget = searchParams.get('redirect');

        if (!token) {
            setIsError(true);
            setMessage('Thiếu mã xác thực từ Google. Vui lòng thử lại.');
            return;
        }

        if (hasExchangedRef.current) {
            return;
        }
        hasExchangedRef.current = true;

        const exchangeToken = async () => {
            try {
                const response = await exchangeGoogleAuth(token);
                await handleAuthSuccess(response, redirectTarget);
            } catch (error: any) {
                console.error('Google auth exchange failed', error);
                const errorMessage = error?.response?.data?.message || error?.message || 'Đăng nhập Google thất bại. Vui lòng thử lại!';
                setIsError(true);
                setMessage(errorMessage);
                showError(errorMessage);
                dispatch(loginFailed());
            }
        };

        exchangeToken();
    }, [dispatch, handleAuthSuccess, searchParams, showError]);

    return (
        <div className={cx('page')}>
            <div className={cx('card', { error: isError })}>
                <div className={cx('icon-wrapper')}>
                    {isError ? (
                        <AlertCircleIcon size={48} className={cx('status-icon', 'error-icon')} />
                    ) : (
                        <div className={cx('loading-wrapper')}>
                            <LoaderIcon size={48} className={cx('status-icon', 'spinner')} />
                            <div className={cx('pulse-ring')} />
                        </div>
                    )}
                </div>
                <h2 className={cx('title')}>
                    {isError ? 'Xác minh thất bại' : 'Đang xác minh đăng nhập Google'}
                </h2>
                <p className={cx('status-message', { error: isError })}>{message}</p>
                {isError && (
                    <Link href="/auth/login" className={cx('back-link')}>
                        Quay về trang đăng nhập
                    </Link>
                )}
            </div>
        </div>
    );
};

export default GoogleAuthCallbackPage;

