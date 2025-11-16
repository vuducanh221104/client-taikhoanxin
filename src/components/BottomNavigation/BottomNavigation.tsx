'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classNames from 'classnames/bind';
import styles from './BottomNavigation.module.scss';
import { HomeIcon, CategoryIcon, CartIcon, UserIcon } from '@/components/Icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const cx = classNames.bind(styles);

interface NavItem {
    href: string;
    icon: React.ReactNode;
    label: string;
    badge?: number;
    activePattern?: RegExp;
}

const BottomNavigation: React.FC = () => {
    const pathname = usePathname();
    const cart = useSelector((state: RootState) => state.cart);
    const cartQuantity = cart.totalQuantity;
    const currentUser = useSelector((state: RootState) => state.auth.login.currentUser);

    const navItems: NavItem[] = [
        {
            href: '/',
            icon: <HomeIcon />,
            label: 'Trang chủ',
            activePattern: /^\/$/,
        },
        {
            href: '/categories',
            icon: <CategoryIcon />,
            label: 'Danh mục',
            activePattern: /^\/categories/,
        },
        {
            href: '/cart',
            icon: <CartIcon />,
            label: 'Giỏ hàng',
            badge: cartQuantity,
            activePattern: /^\/cart/,
        },
        {
            href: currentUser ? '/account/manage' : '/auth/login',
            icon: <UserIcon />,
            label: currentUser ? 'Tài khoản' : 'Đăng nhập',
            activePattern: /^\/(account|auth)/,
        },
    ];

    const isActive = (item: NavItem) => {
        if (item.activePattern) {
            return item.activePattern.test(pathname);
        }
        return pathname === item.href;
    };

    return (
        <nav className={cx('bottom-navigation')} role="navigation" aria-label="Mobile navigation">
            <div className={cx('nav-container')}>
                {navItems.map((item) => {
                    const active = isActive(item);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cx('nav-item', { active })}
                            aria-label={item.label}
                            aria-current={active ? 'page' : undefined}
                        >
                            <div className={cx('nav-icon-wrapper')}>
                                <span className={cx('nav-icon')}>{item.icon}</span>
                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className={cx('nav-badge')} aria-label={`${item.badge} items`}>
                                        {item.badge > 99 ? '99+' : item.badge}
                                    </span>
                                )}
                            </div>
                            <span className={cx('nav-label')}>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNavigation;
