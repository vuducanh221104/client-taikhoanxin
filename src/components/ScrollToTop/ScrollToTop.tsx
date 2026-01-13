'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import classNames from 'classnames/bind';
import styles from './ScrollToTop.module.scss';
import { ChevronUpIcon } from '@/components/Icons';

const cx = classNames.bind(styles);

const ScrollToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            // Show button when page is scrolled down 300px
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleZaloClick = () => {
        // Mở Zalo chat hoặc link Zalo
        window.open('https://zalo.me/0377775528', '_blank');
    };

    return (
        <div className={cx('floating-buttons')}>
            {/* Scroll to Top Button */}
            <button
                className={cx('scroll-to-top', { visible: isVisible })}
                onClick={scrollToTop}
                aria-label="Lên đầu trang"
            >
                <ChevronUpIcon />
            </button>

            {/* Zalo Chat Button */}
            <button
                className={cx('zalo-chat-button')}
                onClick={handleZaloClick}
                aria-label="Tư vấn ngay qua Zalo"
            >
                <Image
                    src="/payment/zalo.png"
                    alt="Zalo"
                    width={80}
                    height={80}
                    className={cx('zalo-icon')}
                />
                <span>Tư vấn ngay</span>
            </button>
        </div>
    );
};

export default ScrollToTop;
