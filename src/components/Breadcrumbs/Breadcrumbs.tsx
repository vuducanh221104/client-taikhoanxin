'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classNames from 'classnames/bind';
import styles from './Breadcrumbs.module.scss';
import { ChevronRightIcon, HomeIcon } from '@/components/Icons';

const cx = classNames.bind(styles);

export interface BreadcrumbItem {
    label: string;
    href: string;
}

export interface BreadcrumbsProps {
    items?: BreadcrumbItem[];
    className?: string;
    showHome?: boolean;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
    items,
    className,
    showHome = true,
}) => {
    const pathname = usePathname();

    // Auto-generate breadcrumbs from pathname if items not provided
    const breadcrumbItems = items || generateBreadcrumbs(pathname);

    if (breadcrumbItems.length === 0) {
        return null;
    }

    return (
        <nav className={cx('breadcrumbs', className)} aria-label="Breadcrumb">
            <ol className={cx('breadcrumbs-list')}>
                {/* Home */}
                {showHome && (
                    <li className={cx('breadcrumb-item')}>
                        <Link href="/" className={cx('breadcrumb-link', 'home')}>
                            <HomeIcon size={16} />
                            <span className={cx('breadcrumb-label')}>Trang chủ</span>
                        </Link>
                        <ChevronRightIcon className={cx('breadcrumb-separator')} size={14} />
                    </li>
                )}

                {/* Items */}
                {breadcrumbItems.map((item, index) => {
                    const isLast = index === breadcrumbItems.length - 1;

                    return (
                        <li key={item.href} className={cx('breadcrumb-item')}>
                            {isLast ? (
                                <span className={cx('breadcrumb-current')} aria-current="page">
                                    {item.label}
                                </span>
                            ) : (
                                <>
                                    <Link href={item.href} className={cx('breadcrumb-link')}>
                                        {item.label}
                                    </Link>
                                    <ChevronRightIcon className={cx('breadcrumb-separator')} size={14} />
                                </>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

// Helper function to generate breadcrumbs from pathname
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Label mapping for common paths
    const labelMap: Record<string, string> = {
        'products': 'Sản phẩm',
        'categories': 'Danh mục',
        'cart': 'Giỏ hàng',
        'wishlist': 'Yêu thích',
        'account': 'Tài khoản',
        'orders': 'Đơn hàng',
        'auth': 'Xác thực',
        'login': 'Đăng nhập',
        'register': 'Đăng ký',
        'about': 'Giới thiệu',
        'contact': 'Liên hệ',
        'payment': 'Thanh toán',
        'best-selling': 'Bán chạy',
        'sale': 'Khuyến mại',
        'viewed': 'Đã xem',
        'settings': 'Cài đặt',
        'password': 'Mật khẩu',
        'manage': 'Quản lý',
    };

    let currentPath = '';
    paths.forEach((path, index) => {
        currentPath += `/${path}`;
        
        // Skip certain paths
        if (path === '(user)' || path === '(admin)') {
            return;
        }

        const label = labelMap[path] || formatLabel(path);
        breadcrumbs.push({
            label,
            href: currentPath,
        });
    });

    return breadcrumbs;
}

// Format label from slug
function formatLabel(slug: string): string {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export default Breadcrumbs;
