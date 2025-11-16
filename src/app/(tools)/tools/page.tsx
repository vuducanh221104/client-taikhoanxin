'use client';

import React from 'react';
import Link from 'next/link';
import classNames from 'classnames/bind';
import styles from './page.module.scss';
import {
    KeyIcon,
    PlayIcon,
    PaperPlaneIcon,
    FileTextIcon,
} from '@/components/Icons';
import { routes } from '@/config';

const cx = classNames.bind(styles);

const tools = [
    {
        id: 'login-code',
        href: routes.tools.loginCode,
        icon: KeyIcon,
        title: 'Lấy mã đăng nhập',
        description: 'Công cụ tạo và lấy mã đăng nhập cho khách hàng',
    },
    {
        id: 'youtube-tv',
        href: routes.tools.youtubeTV,
        icon: PlayIcon,
        title: 'Kích hoạt Youtube TV',
        description: 'Hỗ trợ kích hoạt dịch vụ Youtube TV cho khách hàng',
    },
    {
        id: 'warranty',
        href: routes.tools.warranty,
        icon: PaperPlaneIcon,
        title: 'Gửi thông tin Bảo hành',
        description: 'Gửi thông tin bảo hành sản phẩm cho khách hàng',
    },
    {
        id: 'order-info',
        href: routes.tools.orderInfo,
        icon: FileTextIcon,
        title: 'Bổ sung thông tin đơn hàng',
        description: 'Bổ sung thông tin cho đơn hàng của bạn',
    },
];

export default function ToolsHomePage() {
    return (
        <div className={cx('tools-home')}>
            <div className={cx('tools-container')}>
                {/* Header */}
                <div className={cx('home-header')}>
                    <h1 className={cx('home-title')}>Xin chào!</h1>
                    <p className={cx('home-subtitle')}>Chọn công cụ bạn muốn sử dụng.</p>
                </div>

                {/* Tools Grid */}
                <div className={cx('tools-grid')}>
                    {tools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <Link key={tool.id} href={tool.href} className={cx('tool-card')}>
                                <div className={cx('tool-card-content')}>
                                    <div className={cx('tool-icon-wrapper')}>
                                        <Icon className={cx('tool-icon')} size={24} />
                                    </div>
                                    <div className={cx('tool-text-content')}>
                                        <h3 className={cx('tool-title')}>{tool.title}</h3>
                                        <p className={cx('tool-description')}>{tool.description}</p>
                                    </div>
                                </div>
                                <button className={cx('tool-button')} type="button">
                                    Sử dụng công cụ
                                </button>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

