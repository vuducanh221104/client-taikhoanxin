'use client';

import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from '@/components/PopupHome/PopupHome.module.scss';
import { useHomePage } from '@/services/homePageService';
import { useTopupStatus, dismissTopup } from '@/services/userService';
import { useSWRConfig } from 'swr';

const cx = classNames.bind(styles);

export default function TopupPopup() {
    const { data: homePageData, isLoading: isHomePageLoading } = useHomePage();
    const { data: topupStatusData } = useTopupStatus();
    const { mutate } = useSWRConfig();
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isClient, setIsClient] = useState(false);

    const topup = homePageData?.data?.topup;
    const isEnabled = topup?.isEnabled ?? false;
    
    // Check if admin has custom content (not just default values)
    const hasCustomContent = topup?.content && topup?.content.trim() !== '';

    // Check if user has already seen popup in this session
    const hasSeenPopup = typeof window !== 'undefined' 
        ? sessionStorage.getItem('topup_popup_seen') === 'true' 
        : false;

    // Only run on client side
    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;
        
        // Only show popup when data has finished loading
        if (isHomePageLoading) return;
        
        // Check if user has already seen popup
        if (hasSeenPopup) return;
        
        // Show popup only when topup is enabled
        if (isEnabled) {
            setIsVisible(true);
            // Mark as seen in session
            sessionStorage.setItem('topup_popup_seen', 'true');
        }
    }, [isEnabled, isClient, isHomePageLoading, hasSeenPopup]);

    const handleClose = async () => {
        setIsClosing(true);
        
        // Save dismissal status to API for logged in users
        if (topupStatusData) {
            try {
                await dismissTopup();
                mutate('/api/v1/users/topup/status');
            } catch (error) {
                console.error('Error dismissing topup:', error);
            }
        }
        
        // Wait for animation to complete
        setTimeout(() => {
            setIsVisible(false);
            setIsClosing(false);
        }, 300);
    };

    // Don't render if not visible or not client yet
    if (!isVisible || !isClient) {
        return null;
    }

    // If admin has custom content (content is not empty), show it
    // Otherwise show default Zalo notification UI
    if (hasCustomContent) {
        return (
            <div className={cx('topup-backdrop', { closing: isClosing })} onClick={handleClose}>
                <div className={cx('topup-modal')} onClick={(e) => e.stopPropagation()}>
                    <button className={cx('topup-close')} onClick={handleClose} aria-label="Đóng">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    
                    {topup?.title && (
                        <h3 className={cx('topup-title')}>{topup.title}</h3>
                    )}
                    
                    {topup?.content && (
                        <div 
                            className={cx('topup-content')}
                            dangerouslySetInnerHTML={{ __html: topup.content }}
                        />
                    )}
                    
                    <div className={cx('topup-actions')}>
                        <button className={cx('topup-confirm')} onClick={handleClose}>
                            Đã hiểu
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Default UI - Notification Channel
    return (
        <div className={cx('topup-backdrop', { closing: isClosing })} onClick={handleClose}>
            <div className={cx('topup-modal', 'notification-modal')} onClick={(e) => e.stopPropagation()}>
                <button className={cx('topup-close')} onClick={handleClose} aria-label="Đóng">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                
                <div className={cx('notification-header')}>
                    <div className={cx('notification-icon')}>
                        <img 
                            src="https://media.giphy.com/media/btnLQHNxdBTRAdxup9/giphy.gif" 
                            alt="Thông báo" 
                            className={cx('notification-bell-gif')}
                        />
                    </div>
                    <h3 className={cx('notification-title')}>KÊNH THÔNG BÁO VÀ CHECK UY TÍN</h3>
                </div>
                
                <div className={cx('notification-options')}>
                    <a 
                        href="https://zalo.me/g/yourzaloID" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={cx('notification-item')}
                    >
                        <div className={cx('notification-item-icon', 'zalo')}>
                            <img 
                                src="/payment/zalo.png" 
                                alt="Zalo" 
                                className={cx('zalo-icon')}
                            />
                        </div>
                        <span className={cx('notification-item-text')}>Nhóm Zalo (Đã đủ 1000 Member)</span>
                        <span className={cx('notification-item-arrow')}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </span>
                    </a>
                    
                    <a 
                        href="https://zalo.me/g/yourzaloID" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={cx('notification-item')}
                    >
                        <div className={cx('notification-item-icon', 'zalo-group')}>
                            <img 
                                src="/payment/zalo.png" 
                                alt="Zalo" 
                                className={cx('zalo-icon')}
                            />
                        </div>
                        <span className={cx('notification-item-text')}>Nhóm Zalo 2</span>
                        <span className={cx('notification-item-arrow')}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </span>
                    </a>

                    <a 
                        href="https://t.me/yourTelegramID" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={cx('notification-item')}
                    >
                        <div className={cx('notification-item-icon', 'telegram')}>
                            <img 
                                src="/payment/telegram.png" 
                                alt="Telegram" 
                                className={cx('zalo-icon')}
                            />
                        </div>
                        <span className={cx('notification-item-text')}>Nhóm Telegram (6000 Member)</span>
                        <span className={cx('notification-item-arrow')}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </span>
                    </a>
                </div>
                
                <div className={cx('notification-footer')}>
                    <p className={cx('notification-note')}>
                        Theo dõi kênh để nhận thông tin mới nhất về các chương trình khuyến mãi và cập nhật từ hệ thống
                    </p>
                </div>
                
                <div className={cx('topup-actions')}>
                    <button className={cx('topup-confirm')} onClick={handleClose}>
                        Đã hiểu
                    </button>
                </div>
            </div>
        </div>
    );
}
