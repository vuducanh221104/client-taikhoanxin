'use client';

import React from 'react';
import Link from 'next/link';
import classNames from 'classnames/bind';
import styles from './EmptyState.module.scss';
import {
    InboxIcon,
    ShoppingCartIcon,
    HeartIcon,
    SearchIcon,
    PackageIcon,
    AlertCircleIcon,
    FrownIcon,
} from '@/components/Icons';

const cx = classNames.bind(styles);

export type EmptyStateType =
    | 'cart'
    | 'wishlist'
    | 'search'
    | 'products'
    | 'orders'
    | 'error'
    | 'not-found'
    | 'generic';

export interface EmptyStateProps {
    type?: EmptyStateType;
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
    secondaryActionLabel?: string;
    secondaryActionHref?: string;
    onSecondaryAction?: () => void;
    className?: string;
}

const defaultConfigs: Record<EmptyStateType, {
    icon: React.ReactNode;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
}> = {
    cart: {
        icon: <ShoppingCartIcon size={64} />,
        title: 'Giỏ hàng trống',
        description: 'Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá và thêm sản phẩm yêu thích của bạn!',
        actionLabel: 'Khám phá sản phẩm',
        actionHref: '/',
    },
    wishlist: {
        icon: <HeartIcon size={64} />,
        title: 'Danh sách yêu thích trống',
        description: 'Bạn chưa có sản phẩm nào trong danh sách yêu thích. Thêm sản phẩm để dễ dàng theo dõi!',
        actionLabel: 'Khám phá sản phẩm',
        actionHref: '/',
    },
    search: {
        icon: <SearchIcon size={64} />,
        title: 'Không tìm thấy kết quả',
        description: 'Không tìm thấy sản phẩm nào phù hợp với từ khóa của bạn. Hãy thử tìm kiếm với từ khóa khác!',
        actionLabel: 'Xem tất cả sản phẩm',
        actionHref: '/',
    },
    products: {
        icon: <PackageIcon size={64} />,
        title: 'Không có sản phẩm',
        description: 'Hiện tại chưa có sản phẩm nào trong danh mục này. Vui lòng quay lại sau!',
        actionLabel: 'Về trang chủ',
        actionHref: '/',
    },
    orders: {
        icon: <InboxIcon size={64} />,
        title: 'Chưa có đơn hàng',
        description: 'Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!',
        actionLabel: 'Bắt đầu mua sắm',
        actionHref: '/',
    },
    error: {
        icon: <AlertCircleIcon size={64} />,
        title: 'Đã có lỗi xảy ra',
        description: 'Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ với chúng tôi nếu vấn đề vẫn tiếp diễn.',
        actionLabel: 'Thử lại',
    },
    'not-found': {
        icon: <FrownIcon size={64} />,
        title: 'Không tìm thấy trang',
        description: 'Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.',
        actionLabel: 'Về trang chủ',
        actionHref: '/',
    },
    generic: {
        icon: <InboxIcon size={64} />,
        title: 'Không có dữ liệu',
        description: 'Hiện tại không có dữ liệu để hiển thị.',
    },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
    type = 'generic',
    title,
    description,
    icon,
    actionLabel,
    actionHref,
    onAction,
    secondaryActionLabel,
    secondaryActionHref,
    onSecondaryAction,
    className,
}) => {
    const config = defaultConfigs[type];
    
    const finalTitle = title || config.title;
    const finalDescription = description || config.description;
    const finalIcon = icon || config.icon;
    const finalActionLabel = actionLabel || config.actionLabel;
    // If onAction is provided, prioritize it over actionHref from config
    // Only use actionHref from config if onAction is not provided
    const finalActionHref = onAction ? actionHref : (actionHref || config.actionHref);

    const handleAction = () => {
        if (onAction) {
            onAction();
        }
    };

    const handleSecondaryAction = () => {
        if (onSecondaryAction) {
            onSecondaryAction();
        }
    };

    return (
        <div className={cx('empty-state', className)}>
            <div className={cx('empty-state-content')}>
                {/* Icon */}
                <div className={cx('empty-state-icon', `icon-${type}`)}>
                    {finalIcon}
                </div>

                {/* Title */}
                <h2 className={cx('empty-state-title')}>{finalTitle}</h2>

                {/* Description */}
                <p className={cx('empty-state-description')}>{finalDescription}</p>

                {/* Actions */}
                {(finalActionLabel || secondaryActionLabel) && (
                    <div className={cx('empty-state-actions')}>
                        {finalActionLabel && (
                            <>
                                {finalActionHref ? (
                                    <Link
                                        href={finalActionHref}
                                        className={cx('empty-state-button', 'primary')}
                                    >
                                        {finalActionLabel}
                                    </Link>
                                ) : (
                                    <button
                                        type="button"
                                        className={cx('empty-state-button', 'primary')}
                                        onClick={handleAction}
                                    >
                                        {finalActionLabel}
                                    </button>
                                )}
                            </>
                        )}

                        {secondaryActionLabel && (
                            <>
                                {secondaryActionHref ? (
                                    <Link
                                        href={secondaryActionHref}
                                        className={cx('empty-state-button', 'secondary')}
                                    >
                                        {secondaryActionLabel}
                                    </Link>
                                ) : (
                                    <button
                                        type="button"
                                        className={cx('empty-state-button', 'secondary')}
                                        onClick={handleSecondaryAction}
                                    >
                                        {secondaryActionLabel}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmptyState;
