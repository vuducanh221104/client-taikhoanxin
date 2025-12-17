'use client';

import React from 'react';
import Link from 'next/link';
import classNames from 'classnames/bind';
import styles from '@/app/(user)/categories/page.module.scss';
import { 
    BriefcaseIcon, 
    BrainIcon, 
    PlayIcon, 
    WindowsIcon,
    OfficeIcon,
    GraduationIcon,
    ImageIcon,
    CloudIcon 
} from '@/components/Icons';

const cx = classNames.bind(styles);

// Icon mapping for categories
const iconMap: Record<string, React.ReactNode> = {
    BriefcaseIcon: <BriefcaseIcon />,
    BrainIcon: <BrainIcon />,
    PlayIcon: <PlayIcon />,
    WindowsIcon: <WindowsIcon />,
    OfficeIcon: <OfficeIcon />,
    GraduationIcon: <GraduationIcon />,
    ImageIcon: <ImageIcon />,
    CloudIcon: <CloudIcon />,
};

interface Category {
    id: string;
    name: string;
    slug: string;
    icon: React.ReactNode;
    description: string;
    color: string;
}

// Load categories from mock data
import categoriesData from '@/data/mockCategories.json';

const categories: Category[] = categoriesData.categories
    .filter((cat: any) => cat.status === 'active')
    .map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        icon: iconMap[cat.icon] || <BriefcaseIcon />,
        description: cat.description,
        color: cat.color,
    }))
    .sort((a: any, b: any) => a.order - b.order);

export default function CategoriesLayout() {
    return (
        <div className={cx('categories-page')}>
            <div className="container">
                <div className={cx('page-header')}>
                    <h1 className={cx('page-title')}>Danh mục sản phẩm</h1>
                    <p className={cx('page-subtitle')}>
                        Khám phá các danh mục sản phẩm đa dạng của chúng tôi
                    </p>
                </div>

                <div className={cx('categories-grid')}>
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            className={cx('category-card')}
                            style={{ '--category-color': category.color } as React.CSSProperties}
                        >
                            <div className={cx('category-icon')}>
                                {category.icon}
                            </div>
                            <h3 className={cx('category-name')}>{category.name}</h3>
                            <p className={cx('category-description')}>{category.description}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

