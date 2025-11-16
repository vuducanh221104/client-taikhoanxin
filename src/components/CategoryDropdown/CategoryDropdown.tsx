'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import classNames from 'classnames/bind';
import styles from './CategoryDropdown.module.scss';
import {
    MenuIcon,
    ChevronRightIcon,
    WindowsIcon,
    OfficeIcon,
    GraduationIcon,
    BrainIcon,
    ImageIcon,
    CloudIcon,
    BriefcaseIcon,
    PlayIcon,
    CloseIcon,
} from '@/components/Icons';

const cx = classNames.bind(styles);

interface CategoryItem {
    id: string;
    name: string;
    icon: React.ReactNode;
    href?: string;
    subcategories?: {
        title: string;
        items: {
            name: string;
            href: string;
        }[];
        badge?: string;
    }[];
}

const categories: CategoryItem[] = [
    {
        id: 'windows',
        name: 'Windows',
        icon: <WindowsIcon />,
        subcategories: [
            {
                title: 'WINDOWS 11',
                badge: 'HOT',
                items: [
                    { name: 'Windows 11 Pro', href: '/products/windows-11-pro' },
                    { name: 'Windows 11 Home', href: '/products/windows-11-home' },
                ],
            },
            {
                title: 'WINDOWS 10',
                items: [
                    { name: 'Windows 10 Pro', href: '/products/windows-10-pro' },
                ],
            },
            {
                title: 'WINDOWS 8',
                items: [
                    { name: 'Windows 8.1 Pro', href: '/products/windows-8-1-pro' },
                ],
            },
            {
                title: 'WINDOWS 7',
                items: [
                    { name: 'Windows 7 Pro SP1', href: '/products/windows-7-pro-sp1' },
                ],
            },
        ],
    },
    {
        id: 'office',
        name: 'Office',
        icon: <OfficeIcon />,
        href: '/categories/office',
    },
    {
        id: 'learning',
        name: 'Học tập',
        icon: <GraduationIcon />,
        href: '/categories/learning',
    },
    {
        id: 'ai-account',
        name: 'Tài khoản AI',
        icon: <BrainIcon />,
        href: '/categories/ai-account',
    },
    {
        id: 'photo-video',
        name: 'Ảnh & Video',
        icon: <ImageIcon />,
        href: '/categories/photo-video',
    },
    {
        id: 'storage',
        name: 'Lưu trữ',
        icon: <CloudIcon />,
        href: '/categories/storage',
    },
    {
        id: 'work',
        name: 'Làm việc',
        icon: <BriefcaseIcon />,
        href: '/categories/work',
    },
    {
        id: 'entertainment',
        name: 'Giải trí',
        icon: <PlayIcon />,
        href: '/categories/entertainment',
    },
];

interface CategoryDropdownProps {
    onOverlayChange?: (visible: boolean) => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ onOverlayChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const openTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const hoverSwitchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const buttonRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 999);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleButtonClick = () => {
        if (isMobile) {
            // Trên mobile, toggle menu khi click button
            setIsOpen(!isOpen);
            if (!isOpen) {
                setActiveCategory(null);
            }
        }
    };

    const handleButtonKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(true);
            setActiveCategory(null);
            requestAnimationFrame(() => {
                const first = sidebarRef.current?.querySelector<HTMLElement>('a.sidebar-item');
                first?.focus();
            });
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setIsOpen(true);
            requestAnimationFrame(() => {
                const first = sidebarRef.current?.querySelector<HTMLElement>('a.sidebar-item');
                first?.focus();
            });
        }
    };

    const handleWrapperMouseEnter = () => {
        // Chỉ hoạt động trên desktop
        if (isMobile) return;
        
        // Clear timeout nếu có
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        if (openTimeoutRef.current) {
            clearTimeout(openTimeoutRef.current);
            openTimeoutRef.current = null;
        }
        // Delay mở 120ms để tránh lóe khi rê ngang qua
        openTimeoutRef.current = setTimeout(() => {
            setIsOpen(true);
            onOverlayChange?.(true);
        }, 120);
    };

    const handleWrapperMouseLeave = () => {
        // Chỉ hoạt động trên desktop
        if (isMobile) return;
        
        // Delay đóng dropdown để người dùng có thời gian di chuyển chuột
        if (openTimeoutRef.current) {
            clearTimeout(openTimeoutRef.current);
            openTimeoutRef.current = null;
        }
        closeTimeoutRef.current = setTimeout(() => {
            setIsOpen(false);
            setActiveCategory(null);
            onOverlayChange?.(false);
        }, 200); // 200ms delay mượt hơn
    };

    // Backdrop overlay đã được loại bỏ theo yêu cầu

    const handleCategoryClick = (category: CategoryItem, e: React.MouseEvent) => {
        if (isMobile) {
            // Trên mobile, toggle submenu khi click category
            e.preventDefault();
            if (category.subcategories && category.subcategories.length > 0) {
                setActiveCategory(activeCategory === category.id ? null : category.id);
            } else {
                // Nếu không có submenu, đóng menu và navigate
                setIsOpen(false);
                setActiveCategory(null);
            }
        } else {
            // Trên desktop, ngăn navigation nếu có subcategories
            if (category.subcategories) {
                e.preventDefault();
            }
        }
    };

    const handleCategoryHover = (categoryId: string) => {
        // Chỉ hoạt động trên desktop
        if (isMobile) return;
        
        const category = categories.find((cat) => cat.id === categoryId);
        // Chỉ set active nếu category có subcategories
        if (hoverSwitchTimeoutRef.current) {
            clearTimeout(hoverSwitchTimeoutRef.current);
            hoverSwitchTimeoutRef.current = null;
        }
        hoverSwitchTimeoutRef.current = setTimeout(() => {
            if (category?.subcategories && category.subcategories.length > 0) {
                setActiveCategory(categoryId);
            } else {
                // Nếu category không có subcategories, clear active để ẩn submenu
                setActiveCategory(null);
            }
        }, 100); // 100ms tránh nháy khi rê nhanh
    };

    // Cleanup timeout khi component unmount
    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
            if (openTimeoutRef.current) {
                clearTimeout(openTimeoutRef.current);
            }
            if (hoverSwitchTimeoutRef.current) {
                clearTimeout(hoverSwitchTimeoutRef.current);
            }
        };
    }, []);

    // Notify header overlay when hovering the categories button (desktop only)
    const handleCategoriesButtonEnter = () => {
        if (isMobile) return;
        onOverlayChange?.(true);
    };

    const handleCategoriesButtonLeave = () => {
        if (isMobile) return;
        // Không tắt ngay nếu còn nằm trong wrapper; việc rời wrapper sẽ xử lý.
        // Tuy nhiên, nếu dropdown chưa mở, cho tắt ngay để tránh overlay tồn tại.
        if (!isOpen) onOverlayChange?.(false);
    };

    // Đóng menu khi click outside (mobile)
    useEffect(() => {
        if (!isOpen || !isMobile) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setActiveCategory(null);
            }
        };

        // Thêm listener sau một chút để tránh trigger ngay khi mở
        const timeout = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 100);

        return () => {
            clearTimeout(timeout);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Ngăn scroll body khi menu mở (mobile)
    useEffect(() => {
        if (isMobile && isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen, isMobile]);

    // A11y: ESC to close & Arrow navigation in sidebar
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                setIsOpen(false);
                setActiveCategory(null);
                buttonRef.current?.focus();
            }
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                const items = Array.from(
                    sidebarRef.current?.querySelectorAll<HTMLAnchorElement>('a.sidebar-item') || []
                );
                if (!items.length) return;
                const active = document.activeElement as HTMLElement;
                const idx = items.findIndex((el) => el === active);
                if (idx !== -1) {
                    e.preventDefault();
                    const nextIdx = e.key === 'ArrowDown' ? (idx + 1) % items.length : (idx - 1 + items.length) % items.length;
                    items[nextIdx].focus();
                }
            }
            if (e.key === 'ArrowRight') {
                const focused = document.activeElement as HTMLElement;
                const id = focused?.getAttribute('data-category-id');
                if (id) setActiveCategory(id);
            }
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen]);

    const activeCategoryData = categories.find((cat) => cat.id === activeCategory);

    return (
        <>
            {/* Backdrop overlay removed */}

            <div
                className={cx('category-dropdown-wrapper')}
                ref={dropdownRef}
                onMouseEnter={handleWrapperMouseEnter}
                onMouseLeave={handleWrapperMouseLeave}
            >
                <div 
                    className={cx('categories-button', {
                        'is-hidden': isMobile && isOpen, // Ẩn button khi menu mở trên mobile
                    })}
                    onClick={handleButtonClick}
                    onMouseEnter={handleCategoriesButtonEnter}
                    onMouseLeave={handleCategoriesButtonLeave}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isOpen}
                    aria-controls="category-dropdown"
                    onKeyDown={handleButtonKeyDown}
                    ref={buttonRef}
                >
                    <MenuIcon className={cx('menu-icon')} />
                    <span>Danh mục sản phẩm</span>
                </div>

                {/* Bridge element để lấp đầy khoảng trống */}
                {isOpen && !isMobile && <div className={cx('dropdown-bridge')} />}

                {isOpen && (
                <div
                    className={cx('dropdown-container', {
                        'has-submenu': activeCategoryData?.subcategories,
                        'is-mobile': isMobile,
                    })}
                    id="category-dropdown"
                >
                    {/* Mobile Close Button */}
                    {isMobile && (
                        <button
                            className={cx('mobile-close-button')}
                            onClick={() => {
                                setIsOpen(false);
                                setActiveCategory(null);
                            }}
                            aria-label="Đóng menu"
                        >
                            <CloseIcon />
                        </button>
                    )}
                    
                    <div className={cx('sidebar')} ref={sidebarRef}>
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={category.href || '#'}
                                className={cx('sidebar-item', {
                                    active: activeCategory === category.id,
                                })}
                                onMouseEnter={() => handleCategoryHover(category.id)}
                                onClick={(e) => handleCategoryClick(category, e)}
                                data-category-id={category.id}
                            >
                                <div className={cx('sidebar-item-icon')}>{category.icon}</div>
                                <span className={cx('sidebar-item-text')}>{category.name}</span>
                                {category.subcategories && (
                                    <ChevronRightIcon className={cx('sidebar-item-arrow')} />
                                )}
                            </Link>
                        ))}
                    </div>

                    {activeCategoryData?.subcategories && (
                        <div className={cx('dropdown-menu')} key={activeCategory}>
                            {activeCategoryData.subcategories.map((subcategory, index) => (
                                <div key={index} className={cx('dropdown-section')}>
                                    <div className={cx('dropdown-section-header')}>
                                        <h3 className={cx('dropdown-section-title')}>
                                            {subcategory.title}
                                        </h3>
                                        {subcategory.badge && (
                                            <span className={cx('dropdown-badge')}>
                                                {subcategory.badge}
                                            </span>
                                        )}
                                    </div>
                                    <ul className={cx('dropdown-items')}>
                                        {subcategory.items.map((item, itemIndex) => (
                                            <li key={itemIndex} className={cx('dropdown-item')}>
                                                <Link 
                                                    href={item.href} 
                                                    className={cx('dropdown-link')}
                                                    onClick={() => {
                                                        // Đóng menu khi click item (mobile)
                                                        if (isMobile) {
                                                            setIsOpen(false);
                                                            setActiveCategory(null);
                                                        }
                                                    }}
                                                >
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            </div>
        </>
    );
};

export default CategoryDropdown;
