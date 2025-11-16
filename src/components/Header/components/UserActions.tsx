'use client';

import React from 'react';
import Link from 'next/link';
import classNames from 'classnames/bind';
import styles from '../Header.module.scss';
import { UserIcon, HeartIcon, SearchIcon, CloseIcon, CartIcon } from '@/components/Icons';
import LoginDropdown from '@/components/LoginDropdown/LoginDropdown';
import UserDropdown from '@/components/UserDropdown/UserDropdown';
import CartDropdown from '@/components/CartDropdown/CartDropdown';

const cx = classNames.bind(styles);

interface UserActionsProps {
    mounted: boolean;
    currentUser: any;
    isDesktop: boolean;
    isLoginDropdownOpen: boolean;
    setIsLoginDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsHeaderHoverOverlay: (overlay: boolean) => void;
    loginDropdownTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
    loginDropdownCloseTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
    wishlistQuantity: number;
    isSearchOpen: boolean;
    toggleSearch: () => void;
    searchToggleRef: React.RefObject<HTMLButtonElement>;
    cartQuantity: number;
    isCartDropdownOpen: boolean;
    setIsCartDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
    cartDropdownTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
    cartDropdownCloseTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
}

const UserActions: React.FC<UserActionsProps> = ({
    mounted,
    currentUser,
    isDesktop,
    isLoginDropdownOpen,
    setIsLoginDropdownOpen,
    setIsHeaderHoverOverlay,
    loginDropdownTimeoutRef,
    loginDropdownCloseTimeoutRef,
    wishlistQuantity,
    isSearchOpen,
    toggleSearch,
    searchToggleRef,
    cartQuantity,
    isCartDropdownOpen,
    setIsCartDropdownOpen,
    cartDropdownTimeoutRef,
    cartDropdownCloseTimeoutRef,
}) => {
    const handleLoginMouseEnter = () => {
        if (mounted && isDesktop) {
            if (loginDropdownCloseTimeoutRef.current) {
                clearTimeout(loginDropdownCloseTimeoutRef.current);
                loginDropdownCloseTimeoutRef.current = null;
            }
            if (loginDropdownTimeoutRef.current) {
                clearTimeout(loginDropdownTimeoutRef.current);
            }
            loginDropdownTimeoutRef.current = setTimeout(() => {
                setIsLoginDropdownOpen(true);
            }, 120);
        }
    };

    const handleLoginMouseLeave = () => {
        if (mounted && isDesktop) {
            if (loginDropdownTimeoutRef.current) {
                clearTimeout(loginDropdownTimeoutRef.current);
                loginDropdownTimeoutRef.current = null;
            }
            loginDropdownCloseTimeoutRef.current = setTimeout(() => {
                setIsLoginDropdownOpen(false);
            }, 200);
        }
    };

    const handleLoginDropdownMouseEnter = () => {
        if (loginDropdownCloseTimeoutRef.current) {
            clearTimeout(loginDropdownCloseTimeoutRef.current);
            loginDropdownCloseTimeoutRef.current = null;
        }
        if (!isLoginDropdownOpen) {
            if (loginDropdownTimeoutRef.current) {
                clearTimeout(loginDropdownTimeoutRef.current);
            }
            setIsLoginDropdownOpen(true);
        }
    };

    const handleLoginDropdownMouseLeave = () => {
        if (loginDropdownCloseTimeoutRef.current) {
            clearTimeout(loginDropdownCloseTimeoutRef.current);
        }
        loginDropdownCloseTimeoutRef.current = setTimeout(() => {
            setIsLoginDropdownOpen(false);
        }, 200);
    };

    const handleCartMouseEnter = () => {
        if (mounted && isDesktop) {
            if (cartDropdownCloseTimeoutRef.current) {
                clearTimeout(cartDropdownCloseTimeoutRef.current);
                cartDropdownCloseTimeoutRef.current = null;
            }
            if (cartDropdownTimeoutRef.current) {
                clearTimeout(cartDropdownTimeoutRef.current);
            }
            cartDropdownTimeoutRef.current = setTimeout(() => {
                setIsCartDropdownOpen(true);
            }, 120);
        }
    };

    const handleCartMouseLeave = () => {
        if (mounted && isDesktop) {
            if (cartDropdownTimeoutRef.current) {
                clearTimeout(cartDropdownTimeoutRef.current);
                cartDropdownTimeoutRef.current = null;
            }
            cartDropdownCloseTimeoutRef.current = setTimeout(() => {
                setIsCartDropdownOpen(false);
            }, 200);
        }
    };

    const handleCartDropdownMouseEnter = () => {
        if (cartDropdownCloseTimeoutRef.current) {
            clearTimeout(cartDropdownCloseTimeoutRef.current);
            cartDropdownCloseTimeoutRef.current = null;
        }
        if (!isCartDropdownOpen) {
            if (cartDropdownTimeoutRef.current) {
                clearTimeout(cartDropdownTimeoutRef.current);
            }
            setIsCartDropdownOpen(true);
        }
    };

    const handleCartDropdownMouseLeave = () => {
        if (cartDropdownCloseTimeoutRef.current) {
            clearTimeout(cartDropdownCloseTimeoutRef.current);
        }
        cartDropdownCloseTimeoutRef.current = setTimeout(() => {
            setIsCartDropdownOpen(false);
        }, 200);
    };

    return (
        <div className={cx('actions-section')}>
            {/* User Auth */}
            <div suppressHydrationWarning>
                {currentUser ? (
                    <div 
                        className={cx('action-item-wrapper', 'desktop-only')}
                        onMouseEnter={handleLoginMouseEnter}
                        onMouseLeave={handleLoginMouseLeave}
                    >
                        <div className={cx('action-item', 'user-pill-button')}>
                            <UserIcon className={cx('user-icon')} />
                            <span className={cx('action-text')}>
                                Hello, {currentUser.user_name || currentUser.email.split('@')[0]}
                            </span>
                        </div>
                        <UserDropdown 
                            isOpen={isLoginDropdownOpen}
                            setIsOpen={setIsLoginDropdownOpen}
                            onOverlayChange={setIsHeaderHoverOverlay}
                            onMouseEnter={handleLoginDropdownMouseEnter}
                            onMouseLeave={handleLoginDropdownMouseLeave}
                        />
                    </div>
                ) : (
                    <div 
                        className={cx('action-item-wrapper', 'desktop-only')}
                        onMouseEnter={handleLoginMouseEnter}
                        onMouseLeave={handleLoginMouseLeave}
                    >
                        <Link href="/auth/login" className={cx('action-item')}>
                            <div className={cx('action-icon-wrapper')}>
                                <UserIcon />
                            </div>
                            <span className={cx('action-text')}>Đăng nhập / Đăng ký</span>
                        </Link>
                        <LoginDropdown 
                            isOpen={isLoginDropdownOpen}
                            setIsOpen={setIsLoginDropdownOpen}
                            onOverlayChange={setIsHeaderHoverOverlay}
                            onMouseEnter={handleLoginDropdownMouseEnter}
                            onMouseLeave={handleLoginDropdownMouseLeave}
                        />
                    </div>
                )}
            </div>

            {/* Wishlist */}
            <Link href="/wishlist" className={cx('action-item', 'wishlist-item')}>
                <div className={cx('action-icon-wrapper')}>
                    <HeartIcon />
                    {mounted && wishlistQuantity > 0 && <span className={cx('cart-badge')}>{wishlistQuantity}</span>}
                </div>
                <span className={cx('action-text', 'desktop-only')}>Yêu thích</span>
            </Link>

            {/* Search Icon - Toggle Search */}
            <button 
                className={cx('search-toggle-button')}
                onClick={toggleSearch}
                aria-label="Search"
                aria-expanded={isSearchOpen}
                aria-controls="search-dropdown"
                ref={searchToggleRef}
            >
                {isSearchOpen ? <CloseIcon /> : <SearchIcon />}
            </button>

            {/* Cart */}
            <div 
                className={cx('action-item-wrapper')}
                data-cart-button="true"
                onMouseEnter={handleCartMouseEnter}
                onMouseLeave={handleCartMouseLeave}
                onClick={(e) => {
                    if (mounted && !isDesktop) {
                        e.preventDefault();
                        e.stopPropagation();
                        setTimeout(() => {
                            setIsCartDropdownOpen((prev: boolean) => !prev);
                        }, 0);
                    }
                }}
            >
                <Link 
                    href="/cart" 
                    className={cx('action-item')}
                    onClick={(e) => {
                        if (mounted && !isDesktop) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }}
                >
                    <div className={cx('action-icon-wrapper')}>
                        <CartIcon />
                        {mounted && cartQuantity > 0 && <span className={cx('cart-badge')}>{cartQuantity}</span>}
                    </div>
                    <span className={cx('action-text', 'desktop-only')}>Giỏ hàng</span>
                </Link>
                <CartDropdown 
                    isOpen={isCartDropdownOpen}
                    setIsOpen={setIsCartDropdownOpen}
                    onOverlayChange={setIsHeaderHoverOverlay}
                    onMouseEnter={handleCartDropdownMouseEnter}
                    onMouseLeave={handleCartDropdownMouseLeave}
                />
            </div>
        </div>
    );
};

export default UserActions;
