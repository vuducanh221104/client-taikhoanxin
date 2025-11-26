'use client';

import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import { X } from 'lucide-react';
import styles from './PurchaseToastListener.module.scss';
import { usePublicFeed } from '@/services/publicFeedService';

const cx = classNames.bind(styles);

const PurchaseToastListener: React.FC = () => {
    const { data } = usePublicFeed(10);
    const items = data?.data || [];
    const [visibleItem, setVisibleItem] = useState<{
        _id: string;
        displayName: string;
        productName: string;
        productImage?: string;
        subtitle: string;
    } | null>(null);
    const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
    const nextTimerRef = useRef<NodeJS.Timeout | null>(null);
    const indexRef = useRef<number>(0);

    useEffect(() => {
        if (!items.length) {
            setVisibleItem(null);
            return;
        }

        const buildSubtitle = (name: string) => {
            const variants = [
                `${name} vừa thêm vào giỏ hàng`,
                `${name} đã thêm vào giỏ hàng`,
                `${name} vừa mua hàng`,
                `${name} đã mua hàng thành công`,
            ];
            const randomIndex = Math.floor(Math.random() * variants.length);
            return variants[randomIndex];
        };

        const showAtIndex = (index: number) => {
            if (!items.length) return;

            // Cập nhật index hiện tại
            indexRef.current = index % items.length;
            const current = items[indexRef.current];
            setVisibleItem({
                _id: current._id,
                displayName: current.displayName,
                productName: current.productName,
                productImage: current.productImage,
                subtitle: buildSubtitle(current.displayName),
            });

            // Ẩn sau 5 giây
            if (hideTimerRef.current) {
                clearTimeout(hideTimerRef.current);
            }
            hideTimerRef.current = setTimeout(() => {
                setVisibleItem(null);
            }, 5000);

            // Random delay cho lần hiển thị tiếp theo: 1–5 phút
            const minDelay = 60_000; // 1 phút
            const maxDelay = 300_000; // 5 phút
            const randomDelay =
                Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

            if (nextTimerRef.current) {
                clearTimeout(nextTimerRef.current);
            }
            nextTimerRef.current = setTimeout(() => {
                showAtIndex(indexRef.current + 1);
            }, randomDelay);
        };

        // Bắt đầu từ item đầu tiên
        showAtIndex(0);

        return () => {
            if (hideTimerRef.current) {
                clearTimeout(hideTimerRef.current);
            }
            if (nextTimerRef.current) {
                clearTimeout(nextTimerRef.current);
            }
        };
    }, [items]);

    if (!visibleItem) return null;

    return (
        <div className={cx('purchase-toast-wrapper')}>
            <div className={cx('purchase-toast')}>
                {visibleItem.productImage && (
                    <div className={cx('purchase-toast-image')}>
                        <img src={visibleItem.productImage} alt={visibleItem.productName} />
                    </div>
                )}
                <div className={cx('purchase-toast-content')}>
                    <div className={cx('purchase-toast-subtitle')}>
                        {visibleItem.subtitle}
                    </div>
                    <div className={cx('purchase-toast-title')}>
                        {visibleItem.productName}
                    </div>
                </div>
                <button
                    className={cx('purchase-toast-close')}
                    type="button"
                    aria-label="Đóng thông báo"
                    onClick={() => setVisibleItem(null)}
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};

export default PurchaseToastListener;


