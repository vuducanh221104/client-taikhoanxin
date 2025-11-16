'use client';

import React from 'react';
import Link from 'next/link';
import classNames from 'classnames/bind';
import styles from './CategoryIcons.module.scss';

const cx = classNames.bind(styles);

export interface CategoryItem {
    id: string;
    name: string;
    href: string;
    icon: React.ReactNode;
    color?: string;
}

interface CategoryIconsProps {
    categories?: CategoryItem[];
    title?: string;
    subtitle?: string;
}

const CategoryIcons: React.FC<CategoryIconsProps> = ({
    categories,
    title,
    subtitle,
}) => {
    const defaultCategories: CategoryItem[] = [
        {
            id: 'windows',
            name: 'Windows',
            href: '/products', // Windows has subcategories, redirect to products page
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M3 3h8v8H3V3z" fill="#0078D4" />
                    <path d="M13 3h8v8h-8V3z" fill="#0078D4" />
                    <path d="M3 13h8v8H3v-8z" fill="#0078D4" />
                    <path d="M13 13h8v8h-8v-8z" fill="#0078D4" />
                </svg>
            ),
            color: '#0078d4',
        },
        {
            id: 'vpn',
            name: 'VPN',
            href: '/categories/storage', // VPN can be categorized under storage/security
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"
                        fill="#3F51B5"
                    />
                    <path
                        d="M12 7.5l-3 3h1.5v2h3v-2H15l-3-3z"
                        fill="#ffffff"
                    />
                </svg>
            ),
            color: '#1e40af',
        },
        {
            id: 'office',
            name: 'Office',
            href: '/categories/office',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M5 3h14v18H5V3zm2 2v14h10V5H7z"
                        fill="#d83b01"
                    />
                    <path
                        d="M8 7h8v2H8V7zm0 3h8v2H8v-2zm0 3h6v2H8v-2z"
                        fill="#d83b01"
                        opacity="0.8"
                    />
                    <path
                        d="M7 4h10v1H7V4z"
                        fill="#d83b01"
                        opacity="0.6"
                    />
                </svg>
            ),
            color: '#d83b01',
        },
        {
            id: 'work',
            name: 'Làm việc',
            href: '/categories/work',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M7 5h10v2H7V5zm-2 2v12h14V7H5zm2 2h10v10H7V9z"
                        fill="#0078d4"
                    />
                    <path
                        d="M9 11h6v2H9v-2zm0 3h4v2H9v-2z"
                        fill="#0078d4"
                        opacity="0.7"
                    />
                    <path
                        d="M10 5h4v1h-4V5z"
                        fill="#0078d4"
                        opacity="0.5"
                    />
                </svg>
            ),
            color: '#0078d4',
        },
        {
            id: 'study',
            name: 'Học tập',
            href: '/categories/learning',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M12 3L2 7v2l10 4 10-4V7l-10-4z"
                        fill="#58cc02"
                    />
                    <path
                        d="M12 13l-10-4v8l10 4 10-4V9l-10 4z"
                        fill="#58cc02"
                        opacity="0.8"
                    />
                    <circle cx="12" cy="9" r="1.5" fill="#ffffff" />
                    <path
                        d="M10 15h4v2h-4v-2z"
                        fill="#ffffff"
                        opacity="0.8"
                    />
                </svg>
            ),
            color: '#58cc02',
        },
        {
            id: 'entertainment',
            name: 'Giải trí',
            href: '/categories/entertainment',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#e50914" />
                    <path
                        d="M10 8v8l6-4-6-4z"
                        fill="#ffffff"
                    />
                </svg>
            ),
            color: '#e50914',
        },
        {
            id: 'security',
            name: 'Bảo Mật',
            href: '/categories/storage', // Security can be categorized under storage
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"
                        fill="#00c853"
                    />
                    <path
                        d="M12 8v4l4 2"
                        stroke="#ffffff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                    />
                    <circle cx="12" cy="12" r="1.5" fill="#ffffff" />
                </svg>
            ),
            color: '#00c853',
        },
        {
            id: 'media',
            name: 'Ảnh & Video',
            href: '/categories/photo-video',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="5" width="18" height="14" rx="2" fill="#ff0080" />
                    <circle cx="8.5" cy="10.5" r="1.5" fill="#ffffff" />
                    <path
                        d="M3 15l5-3 4 3 5-3 4 3v2H3v-2z"
                        fill="#ffffff"
                        opacity="0.8"
                    />
                    <circle cx="17" cy="8" r="1" fill="#ffffff" />
                </svg>
            ),
            color: '#ff0080',
        },
    ];

    const displayCategories = categories || defaultCategories;

    return (
        <section className={cx('category-icons-section')}>
            <div className="container-wide">
                {(title || subtitle) && (
                    <div className={cx('header')}>
                        <div className={cx('header-content')}>
                            {title && <h2 className={cx('title')}>{title}</h2>}
                            {subtitle && <p className={cx('subtitle')}>{subtitle}</p>}
                        </div>
                    </div>
                )}
                <div className={cx('category-icons-container')}>
                    {displayCategories.map((category) => (
                        <Link
                            key={category.id}
                            href={category.href}
                            className={cx('category-item')}
                            style={{ '--category-color': category.color || '#666' } as React.CSSProperties}
                        >
                            <div className={cx('category-icon-wrapper')}>
                                <div className={cx('category-icon')}>
                                    {category.icon}
                                </div>
                            </div>
                            <span className={cx('category-name')}>{category.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryIcons;

