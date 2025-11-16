'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames/bind';
import styles from './UserDropdown.module.scss';
import { RootState } from '@/redux/store';
import { logoutUser } from '@/redux/authActions';
import { LockIcon, LogOutIcon, SettingsIcon, HistoryIcon } from '@/components/Icons';
import { useToast } from '@/hooks/useToast';

const cx = classNames.bind(styles);

interface UserDropdownProps {
    isOpen?: boolean;
    setIsOpen?: (open: boolean) => void;
    onOverlayChange?: (visible: boolean) => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ 
    isOpen: controlledIsOpen, 
    setIsOpen: controlledSetIsOpen,
    onOverlayChange,
    onMouseEnter: onMouseEnterProp,
    onMouseLeave: onMouseLeaveProp
}) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const currentUser = useSelector((state: RootState) => state.auth.login.currentUser);
    const { showSuccess, showError } = useToast();
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
    const setIsOpen = controlledSetIsOpen || setInternalIsOpen;
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);
    
    const dropdownRef = useRef<HTMLDivElement>(null);
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const openTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const buttonRef = useRef<HTMLDivElement>(null);

    // Set mounted state after component mounts (client-side only)
    useEffect(() => {
        setMounted(true);
    }, []);

    // Detect mobile
    useEffect(() => {
        if (!mounted) return;
        
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 999);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [mounted]);

    const handleDropdownMouseEnter = () => {
        if (isMobile) return;
        
        // Call parent handler first
        onMouseEnterProp?.();
        
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
    };

    const handleDropdownMouseLeave = () => {
        if (isMobile) return;
        
        // Call parent handler
        onMouseLeaveProp?.();
        
        // Also handle internal close if needed
        if (controlledIsOpen === undefined) {
            closeTimeoutRef.current = setTimeout(() => {
                setIsOpen(false);
                onOverlayChange?.(false);
            }, 200);
        }
    };

    const handleLogout = async () => {
        try {
            showSuccess('Đăng xuất thành công!');
            setIsOpen(false);
            onOverlayChange?.(false);
            await logoutUser(dispatch);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Đăng xuất thất bại. Vui lòng thử lại!';
            showError(errorMessage);
            console.error('Logout failed:', error);
        }
    };


    // Cleanup timeouts
    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
            if (openTimeoutRef.current) {
                clearTimeout(openTimeoutRef.current);
            }
        };
    }, []);

    // Close when clicking outside (mobile)
    useEffect(() => {
        if (!mounted || !isOpen || !isMobile) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                onOverlayChange?.(false);
            }
        };

        const timeout = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 100);

        return () => {
            clearTimeout(timeout);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, isMobile, onOverlayChange, mounted]);

    // A11y: ESC to close
    useEffect(() => {
        if (!mounted || !isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                setIsOpen(false);
                onOverlayChange?.(false);
                buttonRef.current?.focus();
            }
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen, onOverlayChange, mounted]);

    if (!currentUser) {
        return null;
    }

    return (
        <div
            className={cx('user-dropdown-wrapper')}
            ref={dropdownRef}
        >
            {mounted && isOpen && (
                <div
                    className={cx('user-dropdown', {
                        'is-mobile': isMobile,
                    })}
                    role="dialog"
                    aria-modal="true"
                    aria-label="User menu"
                    onClick={(e) => e.stopPropagation()}
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                >
                    {/* User Header */}
                    <div className={cx('user-header')}>
                        <div className={cx('user-avatar')}>
                            <Image
                                src={currentUser.avatar || '/avatar/user-icon.webp'}
                                alt={currentUser.user_name || currentUser.email}
                                width={40}
                                height={40}
                                className={cx('avatar-image')}
                            />
                        </div>
                        <div className={cx('user-email')}>
                            {currentUser.email}
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className={cx('menu-items')}>
                        <Link 
                            href="/account/password" 
                            className={cx('menu-item')}
                            onClick={() => {
                                if (isMobile) {
                                    setIsOpen(false);
                                    onOverlayChange?.(false);
                                }
                            }}
                        >
                            <LockIcon size={18} />
                            <span>Mật khẩu & bảo mật</span>
                        </Link>
                        <Link 
                            href="/account/manage" 
                            className={cx('menu-item')}
                            onClick={() => {
                                if (isMobile) {
                                    setIsOpen(false);
                                    onOverlayChange?.(false);
                                }
                            }}
                        >
                            <SettingsIcon size={18} />
                            <span>Quản lý tài khoản</span>
                        </Link>
                        <Link 
                            href="/account/orders" 
                            className={cx('menu-item')}
                            onClick={() => {
                                if (isMobile) {
                                    setIsOpen(false);
                                    onOverlayChange?.(false);
                                }
                            }}
                        >
                            <HistoryIcon size={18} />
                            <span>Lịch sử đơn hàng</span>
                        </Link>
                        <button
                            type="button"
                            className={cx('menu-item', 'logout-item')}
                            onClick={handleLogout}
                        >
                            <LogOutIcon size={18} />
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;

