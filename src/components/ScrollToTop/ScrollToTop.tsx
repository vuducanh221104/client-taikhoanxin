'use client';

import React, { useState, useEffect } from 'react';
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

    return (
        <button
            className={cx('scroll-to-top', { visible: isVisible })}
            onClick={scrollToTop}
            aria-label="Lên đầu trang"
        >
            <ChevronUpIcon />
        </button>
    );
};

export default ScrollToTop;
