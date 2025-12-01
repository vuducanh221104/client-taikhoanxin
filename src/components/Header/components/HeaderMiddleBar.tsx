'use client';

import React from 'react';
import Link from 'next/link';
import classNames from 'classnames/bind';
import styles from '../Header.module.scss';
import { EyeIcon, FlameIcon, PercentIcon, ToolIcon } from '@/components/Icons';
import CategoryDropdown from '@/components/CategoryDropdown/CategoryDropdown';

const cx = classNames.bind(styles);

interface HeaderMiddleBarProps {
    setIsHeaderHoverOverlay: (overlay: boolean) => void;
}

const HeaderMiddleBar: React.FC<HeaderMiddleBarProps> = ({ setIsHeaderHoverOverlay }) => {
    return (
        <div className={cx('middle-bar', 'desktop-only')}>
            <div className="container">
                <div className={cx('middle-bar-content')}>
                    {/* Categories Dropdown */}
                    <CategoryDropdown onOverlayChange={setIsHeaderHoverOverlay} />

                    {/* Quick Links */}
                    <Link 
                        href="/products/viewed" 
                        className={cx('quick-link')}
                        aria-label="Sản phẩm bạn vừa xem"
                    >
                        <EyeIcon className={cx('quick-link-icon')} />
                        <span>Sản phẩm bạn vừa xem</span>
                    </Link>
                    <Link 
                        href="/products/best-selling" 
                        className={cx('quick-link')}
                        aria-label="Sản phẩm mua nhiều"
                    >
                        <FlameIcon className={cx('quick-link-icon')} />
                        <span>Sản phẩm mua nhiều</span>
                    </Link>
                    <Link 
                        href="/products/sale" 
                        className={cx('quick-link')}
                        aria-label="Sản phẩm khuyến mại"
                    >
                        <PercentIcon className={cx('quick-link-icon')} />
                        <span>Sản phẩm khuyến mại</span>
                    </Link>
                    <Link 
                        href="/tools" 
                        className={cx('quick-link')}
                        aria-label="Tools"
                    >
                        <ToolIcon className={cx('quick-link-icon')} />
                        <span>Tools</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HeaderMiddleBar;
