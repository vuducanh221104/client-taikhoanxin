'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import classNames from 'classnames/bind';
import styles from './MobileMenu.module.scss';
import {
    HomeIcon,
    CategoryIcon,
    EyeIcon,
    FlameIcon,
    PercentIcon,
    UserIcon,
    HeartIcon,
    HistoryIcon,
    LogOutIcon,
    CloseIcon,
    WindowsIcon,
    OfficeIcon,
    BrainIcon,
    ImageIcon,
    CloudIcon,
    PlayIcon,
    BriefcaseIcon,
    GraduationIcon,
} from '@/components/Icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { logoutUser } from '@/redux/authActions';
import { useCategories, Category } from '@/services/categoryService';

const cx = classNames.bind(styles);

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    mobileMenuSidebarRef: React.RefObject<HTMLDivElement>;
}

// Mapping category slug với icon component (giống CategoryDropdown)
const categoryIconMap: Record<string, React.ReactNode> = {
    'windows': <WindowsIcon />,
    'office': <OfficeIcon />,
    'hoc-tap': <GraduationIcon />,
    'tai-khoan-ai': <BrainIcon />,
    'edit-anh-video': <ImageIcon />,
    'luu-tru': <CloudIcon />,
    'lam-viec': <BriefcaseIcon />,
    'giai-tri': <PlayIcon />,
};

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, mobileMenuSidebarRef }) => {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const currentUser = useSelector((state: RootState) => state.auth.login.currentUser);

    // Fetch categories from API (only active, non-hidden categories)
    const { data: categoriesData, error: categoriesError, isLoading: categoriesLoading } = useCategories({ 
        isActive: true, 
        includeHidden: false 
    });

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
        { href: '/categories/san-pham-ban-chay', label: 'Bán chạy', icon: <FlameIcon /> },
        { href: '/categories/san-pham-dang-giam-gia', label: 'Khuyến mại', icon: <PercentIcon /> },
        { href: '/tools', label: 'Tools', icon: <CategoryIcon /> },
        { href: '/orders/lookup', label: 'Tra cứu đơn hàng', icon: <HistoryIcon /> },
    ];

    // Map API categories to display format, sorted by sortOrder
    const categories = useMemo(() => {
        if (!categoriesData?.data || categoriesData.data.length === 0) {
            return [];
        }

        return categoriesData.data
            .filter((cat: Category) => cat.isActive) // Chỉ lấy categories active
            .sort((a: Category, b: Category) => (a.sortOrder || 0) - (b.sortOrder || 0)) // Sort theo sortOrder
            .map((cat: Category) => {
                // Nếu có image từ API thì dùng image, không thì dùng icon từ categoryIconMap
                const hasImage = cat.image && cat.image.trim() !== '';
                const defaultIcon = categoryIconMap[cat.slug] || 
                                  categoryIconMap[cat.name.toLowerCase()] || 
                                  <CategoryIcon />;

                return {
                    id: cat._id,
                    label: cat.name,
                    image: hasImage ? cat.image : undefined,
                    icon: hasImage ? undefined : defaultIcon,
                    href: `/categories/${cat.slug}`,
                };
            });
    }, [categoriesData]);

    const userMenuItems = currentUser ? [
        { href: '/account/manage', label: 'Tài khoản', icon: <UserIcon /> },
        { href: '/wishlist', label: 'Yêu thích', icon: <HeartIcon /> },
        { href: '/account/orders', label: 'Đơn hàng', icon: <HistoryIcon /> },
    ] : [
        { href: '/auth/login', label: 'Đăng nhập / Đăng ký', icon: <UserIcon /> },
    ];

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
                        {categoriesLoading ? (
                            <div className={cx('menu-item', 'category-item', 'loading')}>
                                <span className={cx('menu-label')}>Đang tải...</span>
                            </div>
                        ) : categoriesError ? (
                            <div className={cx('menu-item', 'category-item', 'error')}>
                                <span className={cx('menu-label')}>Không thể tải danh mục</span>
                            </div>
                        ) : categories.length === 0 ? (
                            <div className={cx('menu-item', 'category-item', 'empty')}>
                                <span className={cx('menu-label')}>Chưa có danh mục</span>
                            </div>
                        ) : (
                            categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={category.href}
                                    className={cx('menu-item', 'category-item', {
                                        active: pathname.startsWith(category.href),
                                    })}
                                    onClick={onClose}
                                >
                                    <span className={cx('menu-icon')}>
                                        {category.image ? (
                                            <Image
                                                src={category.image}
                                                alt={category.label}
                                                width={24}
                                                height={24}
                                                className={cx('category-image')}
                                            />
                                        ) : (
                                            category.icon
                                        )}
                                    </span>
                                    <span className={cx('menu-label')}>{category.label}</span>
                                </Link>
                            ))
                        )}
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
