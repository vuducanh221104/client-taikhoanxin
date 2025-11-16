'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import classNames from 'classnames/bind';
import styles from './layout.module.scss';
import {
    HomeIcon,
    KeyIcon,
    PlayIcon,
    PaperPlaneIcon,
    FileTextIcon,
    MenuIcon,
    CloseIcon,
} from '@/components/Icons';
import '@/styles/tools-globals.scss';
import { routes } from '@/config';

const cx = classNames.bind(styles);

interface ToolsLayoutProps {
    children: React.ReactNode;
}

const ToolsLayout: React.FC<ToolsLayoutProps> = ({ children }) => {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const menuItems = [
        { id: 'home', href: routes.tools.home, label: 'Trang chủ', icon: HomeIcon },
        { id: 'login-code', href: routes.tools.loginCode, label: 'Lấy mã đăng nhập', icon: KeyIcon },
        { id: 'youtube-tv', href: routes.tools.youtubeTV, label: 'Kích hoạt Youtube TV', icon: PlayIcon },
        { id: 'warranty', href: routes.tools.warranty, label: 'Gửi thông tin bảo hành', icon: PaperPlaneIcon },
        { id: 'order-info', href: routes.tools.orderInfo, label: 'Bổ sung thông tin đơn hàng', icon: FileTextIcon },
    ];

    const isActive = (href: string) => {
        if (href === routes.tools.home) {
            return pathname === routes.tools.home;
        }
        return pathname?.startsWith(href);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    // Close sidebar when route changes (mobile)
    React.useEffect(() => {
        closeSidebar();
    }, [pathname]);

    return (
        <div className={cx('tools-layout')}>
            {/* Header Bar (Mobile) */}
            <header className={cx('tools-header')}>
                <div className={cx('header-content')}>
                    <div className={cx('header-left')}>
                        {/* Mobile Menu Button */}
                        <button
                            className={cx('mobile-menu-button')}
                            onClick={toggleSidebar}
                            aria-label="Toggle menu"
                            type="button"
                        >
                            {isSidebarOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
                        </button>
                        {/* Logo */}
                        <Link href={routes.tools.home} className={cx('header-logo')} onClick={closeSidebar}>
                            <div className={cx('logo-icon')}>
                                <Image
                                    src="/logo/logo-tools.png"
                                    alt="Tài Khoản Xịn"
                                    width={32}
                                    height={32}
                                    className={cx('logo-image')}
                                />
                            </div>
                            <span className={cx('logo-text')}>Tài Khoản Xịn</span>
                        </Link>
                    </div>
                    <div className={cx('header-right')}>
                        <span className={cx('tools-badge')}>Tools</span>
                    </div>
                </div>
            </header>

            {/* Overlay */}
            {isSidebarOpen && (
                <div className={cx('sidebar-overlay')} onClick={closeSidebar} aria-hidden="true" />
            )}

            {/* Sidebar */}
            <aside className={cx('tools-sidebar', { 'is-open': isSidebarOpen })}>
                {/* Logo */}
                <div className={cx('sidebar-logo')}>
                    <Link href={routes.tools.home} onClick={closeSidebar}>
                        <div className={cx('logo-content')}>
                            <div className={cx('logo-icon')}>
                                <Image
                                    src="/logo/logo-tools.png"
                                    alt="Tài Khoản Xịn"
                                    width={32}
                                    height={32}
                                    className={cx('logo-image')}
                                />
                            </div>
                            <span className={cx('logo-text')}>Tài Khoản Xịn</span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className={cx('sidebar-nav')}>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={cx('nav-item', { active })}
                                onClick={closeSidebar}
                            >
                                <Icon className={cx('nav-icon')} size={20} />
                                <span className={cx('nav-label')}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className={cx('sidebar-footer')}>
                    <div className={cx('footer-copyright')}>
                        <p>© 2025 Tài Khoản Xịn</p>
                        <p className={cx('footer-zalo')}>Zalo taikhoanxin.com</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={cx('tools-main')}>
                {children}
            </main>
        </div>
    );
};

export default ToolsLayout;

