'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import classNames from 'classnames/bind';
import styles from './HeroBanner.module.scss';

const cx = classNames.bind(styles);

interface HeroBannerProps {
    bannerData: {
        id: string;
        image: string;
        title?: string;
        subtitle?: string;
        price?: string;
        label?: string;
        href: string;
    };
    priority?: boolean;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ bannerData, priority = false }) => {
    return (
        <Link href={bannerData.href} className={cx('hero-banner-wrapper')}>
            <div className={cx('hero-banner')}>
                <Image 
                    src={bannerData.image} 
                    alt={bannerData.title || 'Banner'} 
                    width={1345}
                    height={915}
                    className={cx('banner-image')}
                    sizes="(max-width: 999px) 100vw, 32vw"
                    priority={priority}
                    loading={priority ? 'eager' : 'lazy'}
                    fetchPriority={priority ? 'high' : 'low'}
                />
            </div>
        </Link>
    );
};

export default HeroBanner;

