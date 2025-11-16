'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@/components/Icons';
import styles from './HelpSidebar.module.scss';

interface MenuItem {
    title: string;
    href?: string;
    children?: MenuItem[];
}

const menuItems: MenuItem[] = [
    {
        title: 'HƯỚNG DẪN SỬ DỤNG TÀI LIỆU',
        href: '/help',
    },
    {
        title: 'BẮT ĐẦU',
        children: [
            { title: 'Giới thiệu', href: '/help/getting-started/intro' },
            { title: 'Đăng ký tài khoản', href: '/help/getting-started/register' },
            { title: 'Đăng nhập', href: '/help/getting-started/login' },
        ],
    },
    {
        title: 'HƯỚNG DẪN MUA HÀNG',
        children: [
            { title: 'Tìm kiếm sản phẩm', href: '/help/shopping/search' },
            { title: 'Thêm vào giỏ hàng', href: '/help/shopping/cart' },
            { title: 'Thanh toán', href: '/help/shopping/checkout' },
            { title: 'Quản lý đơn hàng', href: '/help/shopping/manage-orders' },
            { title: 'Theo dõi đơn hàng', href: '/help/shopping/track-order' },
        ],
    },
    {
        title: 'TÀI KHOẢN',
        children: [
            { title: 'Quản lý tài khoản', href: '/help/account/manage' },
            { title: 'Đổi mật khẩu', href: '/help/account/change-password' },
            { title: 'Lịch sử đơn hàng', href: '/help/account/order-history' },
        ],
    },
    {
        title: 'CHÍNH SÁCH',
        children: [
            {
                title: 'Chính sách bảo hành',
                href: '/help/policies/warranty',
                children: [
                    { title: 'Thông tin chung', href: '/help/policies/warranty' },
                    { title: 'Bảo hành Netflix', href: '/help/policies/warranty/netflix' },
                    { title: 'Bảo hành Spotify', href: '/help/policies/warranty/spotify' },
                    { title: 'Bảo hành Youtube', href: '/help/policies/warranty/youtube' },
                    { title: 'Bảo hành ChatGPT', href: '/help/policies/warranty/chatgpt' },
                    { title: 'Bảo hành Canva Pro', href: '/help/policies/warranty/canva' },
                    { title: 'Bảo hành CapCut Pro', href: '/help/policies/warranty/capcut' },
                ],
            },
            { title: 'Chính sách đổi trả', href: '/help/policies/return' },
            { title: 'Chính sách thanh toán', href: '/help/policies/payment' },
        ],
    },
    {
        title: 'CÂU HỎI THƯỜNG GẶP',
        children: [
            { title: 'Tài khoản Netflix', href: '/help/faq/netflix' },
            { title: 'Tài khoản Spotify', href: '/help/faq/spotify' },
            { title: 'Tài khoản YouTube Premium', href: '/help/faq/youtube' },
            { title: 'Tài khoản ChatGPT', href: '/help/faq/chatgpt' },
            { title: 'Tài khoản Canva Pro', href: '/help/faq/canva' },
            { title: 'Tài khoản CapCut Pro', href: '/help/faq/capcut' },
            { title: 'Thanh toán & Bảo mật', href: '/help/faq/payment' },
            { title: 'Bảo hành & Hỗ trợ', href: '/help/faq/support' },
        ],
    },
    {
        title: 'HƯỚNG DẪN KHÁC',
        children: [
            { title: 'Cách sử dụng Netflix', href: '/help/guides/netflix-usage' },
            { title: 'Cách tải nhạc Offline trên Spotify', href: '/help/guides/spotify-offline' },
            { title: 'Cách tải video YouTube Premium', href: '/help/guides/youtube-download' },
            { title: 'Cách sử dụng ChatGPT Plus', href: '/help/guides/chatgpt-usage' },
            { title: 'Cách sử dụng Canva Pro', href: '/help/guides/canva-usage' },
            { title: 'Cách sử dụng CapCut Pro', href: '/help/guides/capcut-usage' },
            { title: 'Chia sẻ tài khoản Netflix Family', href: '/help/guides/netflix-family' },
            { title: 'Chuyển danh sách nhạc Spotify', href: '/help/guides/spotify-playlist' },
            { title: 'Sử dụng YouTube Music Premium', href: '/help/guides/youtube-music' },
            { title: 'Bảo mật tài khoản', href: '/help/guides/account-security' },
        ],
    },
];

export default function HelpSidebar() {
    const pathname = usePathname();
    const [expandedSections, setExpandedSections] = useState<string[]>(['BẮT ĐẦU']);
    const [isOpen, setIsOpen] = useState(false);

    const toggleSection = (title: string) => {
        setExpandedSections((prev) =>
            prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
        );
    };

    // Listen for toggle event from header
    React.useEffect(() => {
        const handleToggle = () => setIsOpen((prev) => !prev);
        window.addEventListener('toggleHelpSidebar', handleToggle);
        return () => window.removeEventListener('toggleHelpSidebar', handleToggle);
    }, []);

    // Close sidebar when clicking outside on mobile
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const sidebar = document.querySelector(`.${styles.helpSidebar}`);
            const menuButton = document.querySelector('[aria-label="Toggle menu"]');
            
            if (
                isOpen &&
                sidebar &&
                !sidebar.contains(e.target as Node) &&
                menuButton &&
                !menuButton.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Close sidebar when route changes on mobile
    React.useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && <div className={styles.mobileOverlay} onClick={() => setIsOpen(false)} />}
            
            <aside className={`${styles.helpSidebar} ${isOpen ? styles.open : ''}`}>
                {/* Mobile Header with Logo */}
                <div className={styles.mobileHeader}>
                    <Link href="/" className={styles.mobileLogo}>
                        <img
                            src="/logo/logo-xin.png"
                            alt="TAIKHOANXIN.COM"
                            className={styles.mobileLogoImage}
                        />
                    </Link>
                    <button
                        className={styles.closeButton}
                        onClick={() => setIsOpen(false)}
                        aria-label="Close menu"
                    >
                        ✕
                    </button>
                </div>

                <nav className={styles.sidebarNav}>
                {menuItems.map((section) => (
                    <div key={section.title} className={styles.menuSection}>
                        {section.href ? (
                            // Direct link without children
                            <Link
                                href={section.href}
                                className={`${styles.sectionLink} ${
                                    pathname === section.href ? styles.active : ''
                                }`}
                            >
                                {section.title}
                            </Link>
                        ) : (
                            // Section with children
                            <>
                                <button
                                    className={styles.sectionTitle}
                                    onClick={() => toggleSection(section.title)}
                                >
                                    <span>{section.title}</span>
                                    {expandedSections.includes(section.title) ? (
                                        <ChevronDownIcon />
                                    ) : (
                                        <ChevronRightIcon />
                                    )}
                                </button>

                                {expandedSections.includes(section.title) && section.children && (
                                    <ul className={styles.menuList}>
                                        {section.children.map((item) => (
                                            <li key={item.href || item.title} className={styles.menuItem}>
                                                {item.children ? (
                                                    // Nested submenu
                                                    <>
                                                        <button
                                                            className={`${styles.menuLink} ${styles.hasChildren}`}
                                                            onClick={() => toggleSection(item.title)}
                                                        >
                                                            <span>{item.title}</span>
                                                            {expandedSections.includes(item.title) ? (
                                                                <ChevronDownIcon />
                                                            ) : (
                                                                <ChevronRightIcon />
                                                            )}
                                                        </button>
                                                        {expandedSections.includes(item.title) && (
                                                            <ul className={styles.subMenuList}>
                                                                {item.children.map((subItem) => (
                                                                    <li key={subItem.href} className={styles.subMenuItem}>
                                                                        <Link
                                                                            href={subItem.href || '#'}
                                                                            className={`${styles.subMenuLink} ${
                                                                                pathname === subItem.href ? styles.active : ''
                                                                            }`}
                                                                        >
                                                                            {subItem.title}
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </>
                                                ) : (
                                                    // Regular menu item
                                                    <Link
                                                        href={item.href || '#'}
                                                        className={`${styles.menuLink} ${
                                                            pathname === item.href ? styles.active : ''
                                                        }`}
                                                    >
                                                        {item.title}
                                                    </Link>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </nav>

            {/* Home Button at Bottom */}
            <div className={styles.sidebarFooter}>
                <Link href="/" className={styles.homeButton}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span>Về trang chủ</span>
                </Link>
            </div>
        </aside>
        </>
    );
}
