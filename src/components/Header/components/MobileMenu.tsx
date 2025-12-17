'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classNames from 'classnames/bind';
import styles from './MobileMenu.module.scss';
import {
    HomeIcon,
    CategoryIcon,
    EyeIcon,
    FlameIcon,
    PercentIcon,
    CreditCardIcon,
    UserIcon,
    HeartIcon,
    HistoryIcon,
    LogOutIcon,
    CloseIcon,
    ChevronDownIcon,
    WindowsIcon,
    OfficeIcon,
    BrainIcon,
    ImageIcon,
    CloudIcon,
    PlayIcon,
} from '@/components/Icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { logoutUser } from '@/redux/authActions';

const cx = classNames.bind(styles);

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    mobileMenuSidebarRef: React.RefObject<HTMLDivElement>;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, mobileMenuSidebarRef }) => {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const currentUser = useSelector((state: RootState) => state.auth.login.currentUser);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    // Prevent body scroll when menu is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const menuItems = [
        { href: '/', label: 'Trang chủ', icon: <HomeIcon /> },
        { href: '/viewed', label: 'Đã xem', icon: <EyeIcon /> },
        { href: '/products/best-selling', label: 'Bán chạy', icon: <FlameIcon /> },
        { href: '/products/sale', label: 'Khuyến mại', icon: <PercentIcon /> },
        { href: '/tools', label: 'Tools', icon: <CategoryIcon /> },
        { href: '/orders/lookup', label: 'Tra cứu đơn hàng', icon: <HistoryIcon /> },
    ];

    // Categories - simplified without subcategories
    const categories = [
        {
            id: 'windows',
            label: 'Windows & Office',
            icon: <WindowsIcon />,
            href: '/categories/windows',
        },
        {
            id: 'ai',
            label: 'AI & Productivity',
            icon: <BrainIcon />,
            href: '/categories/ai',
        },
        {
            id: 'design',
            label: 'Design & Creative',
            icon: <ImageIcon />,
            href: '/categories/design',
        },
        {
            id: 'cloud',
            label: 'Cloud & Storage',
            icon: <CloudIcon />,
            href: '/categories/storage',
        },
        {
            id: 'entertainment',
            label: 'Entertainment',
            icon: <PlayIcon />,
            href: '/categories/entertainment',
        },
    ];

    const userMenuItems = currentUser ? [
        { href: '/account/manage', label: 'Tài khoản', icon: <UserIcon /> },
        { href: '/wishlist', label: 'Yêu thích', icon: <HeartIcon /> },
        { href: '/account/orders', label: 'Đơn hàng', icon: <HistoryIcon /> },
    ] : [
        { href: '/auth/login', label: 'Đăng nhập / Đăng ký', icon: <UserIcon /> },
    ];

    const toggleCategory = (categoryId: string) => {
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className={cx('mobile-menu-overlay')}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={cx('mobile-menu-sidebar')}
                ref={mobileMenuSidebarRef}
            >
                {/* Header */}
                <div className={cx('mobile-menu-header')}>
                    <h2 className={cx('mobile-menu-title')}>Menu</h2>
                    <button
                        className={cx('mobile-menu-close')}
                        onClick={onClose}
                        aria-label="Đóng menu"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* User Info */}
                {currentUser && (
                    <div className={cx('mobile-menu-user')}>
                        <div className={cx('user-avatar')}>
                            {currentUser.user_name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className={cx('user-info')}>
                            <p className={cx('user-name')}>
                                {currentUser.user_name || currentUser.email.split('@')[0]}
                            </p>
                            <p className={cx('user-email')}>{currentUser.email}</p>
                        </div>
                    </div>
                )}

                {/* Main Menu */}
                <nav className={cx('mobile-menu-nav')}>
                    {/* Tài khoản - Đưa lên đầu và làm nổi bật */}
                    <div className={cx('menu-section', 'account-section')}>
                        <h3 className={cx('menu-section-title', 'account-title')}>Tài khoản</h3>
                        {userMenuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cx('menu-item', 'account-item', { active: pathname === item.href })}
                                onClick={onClose}
                            >
                                <span className={cx('menu-icon')}>{item.icon}</span>
                                <span className={cx('menu-label')}>{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    <div className={cx('menu-section')}>
                        <h3 className={cx('menu-section-title')}>Khám phá</h3>
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cx('menu-item', { active: pathname === item.href })}
                                onClick={onClose}
                            >
                                <span className={cx('menu-icon')}>{item.icon}</span>
                                <span className={cx('menu-label')}>{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Categories - Simple links without subcategories */}
                    <div className={cx('menu-section')}>
                        <h3 className={cx('menu-section-title')}>Danh mục</h3>
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={category.href}
                                className={cx('menu-item', 'category-item', {
                                    active: pathname.startsWith(category.href),
                                })}
                                onClick={onClose}
                            >
                                <span className={cx('menu-icon')}>{category.icon}</span>
                                <span className={cx('menu-label')}>{category.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Nút đăng xuất - Đặt xuống dưới cùng */}
                    {currentUser && (
                        <div className={cx('menu-section', 'logout-section')}>
                            <button
                                className={cx('menu-item', 'logout-button')}
                                onClick={() => {
                                    logoutUser(dispatch);
                                    onClose();
                                }}
                            >
                                <span className={cx('menu-icon')}><LogOutIcon /></span>
                                <span className={cx('menu-label')}>Đăng xuất</span>
                            </button>
                        </div>
                    )}
                </nav>
            </div>
        </>
    );
};

export default MobileMenu;
