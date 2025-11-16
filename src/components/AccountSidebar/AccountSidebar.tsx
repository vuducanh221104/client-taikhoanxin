'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classNames from 'classnames/bind';
import styles from './AccountSidebar.module.scss';
import { UserIcon, ShoppingCartIcon, FileTextIcon, LockIcon, MessageCircleIcon } from '@/components/Icons';

const cx = classNames.bind(styles);

interface AccountSidebarProps {
    activeItem?: string;
}

const AccountSidebar: React.FC<AccountSidebarProps> = ({ activeItem = 'account' }) => {
    const pathname = usePathname();

    const menuItems = [
        {
            id: 'account',
            label: 'Tài khoản',
            icon: UserIcon,
            href: '/account/manage',
        },
        {
            id: 'orders',
            label: 'Lịch sử đơn hàng',
            icon: ShoppingCartIcon,
            href: '/account/orders',
        },
        {
            id: 'transactions',
            label: 'Lịch sử giao dịch',
            icon: FileTextIcon,
            href: '/account/transactions',
        },
        {
            id: 'password',
            label: 'Mật khẩu và bảo mật',
            icon: LockIcon,
            href: '/account/password',
        },
        {
            id: 'comments',
            label: 'Bình luận của tôi',
            icon: MessageCircleIcon,
            href: '/account/comments',
        },
    ];

    const isActive = (href: string) => {
        if (href === '/account/manage') {
            return pathname === '/account/manage';
        }
        return pathname?.startsWith(href);
    };

    return (
        <div className={cx('account-sidebar')}>
            <nav className={cx('sidebar-nav')}>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={cx('sidebar-item', { active })}
                        >
                            <div className={cx('sidebar-item-content')}>
                                <div className={cx('sidebar-item-indicator')} />
                                <Icon className={cx('sidebar-item-icon')} size={20} />
                                <span className={cx('sidebar-item-label')}>{item.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default AccountSidebar;

