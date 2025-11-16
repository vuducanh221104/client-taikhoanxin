'use client';

import React from 'react';
import classNames from 'classnames/bind';
import styles from './ProductCard.module.scss';
import { TruckIcon, ShieldCheckIcon, FlameIcon } from '@/components/Icons';

const cx = classNames.bind(styles);

export interface ProductBadgesProps {
    stock?: 'in-stock' | 'low-stock' | 'out-of-stock';
    fastDelivery?: boolean;
    freeShipping?: boolean;
    warranty?: string; // e.g., "12 tháng", "Trọn đời"
    soldCount?: number; // Số lượng đã bán
    isHot?: boolean; // Sản phẩm hot
}

const ProductBadges: React.FC<ProductBadgesProps> = ({
    stock = 'in-stock',
    fastDelivery,
    freeShipping,
    warranty,
    soldCount,
    isHot,
}) => {
    return (
        <div className={cx('badges-container')}>
            {/* Stock Badge */}
            {stock === 'out-of-stock' && (
                <div className={cx('badge', 'badge-out-of-stock')}>
                    <span>HẾT HÀNG</span>
                </div>
            )}
            {stock === 'low-stock' && (
                <div className={cx('badge', 'badge-low-stock')}>
                    <span>SẮP HẾT</span>
                </div>
            )}

            {/* Hot Badge */}
            {isHot && stock !== 'out-of-stock' && (
                <div className={cx('badge', 'badge-hot')}>
                    <FlameIcon size={14} />
                    <span>HOT</span>
                </div>
            )}

            {/* Delivery Badges */}
            <div className={cx('delivery-badges')}>
                {fastDelivery && (
                    <div className={cx('badge', 'badge-delivery')}>
                        <TruckIcon size={14} />
                        <span>Giao nhanh</span>
                    </div>
                )}
                {freeShipping && (
                    <div className={cx('badge', 'badge-shipping')}>
                        <TruckIcon size={14} />
                        <span>Miễn phí ship</span>
                    </div>
                )}
            </div>

            {/* Warranty Badge */}
            {warranty && (
                <div className={cx('badge', 'badge-warranty')}>
                    <ShieldCheckIcon size={14} />
                    <span>BH {warranty}</span>
                </div>
            )}

            {/* Sold Count */}
            {soldCount && soldCount > 0 && (
                <div className={cx('badge', 'badge-sold')}>
                    <span>Đã bán {soldCount >= 1000 ? `${(soldCount / 1000).toFixed(1)}k` : soldCount}</span>
                </div>
            )}
        </div>
    );
};

export default ProductBadges;
