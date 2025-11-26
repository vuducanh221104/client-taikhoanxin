'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames/bind';
import styles from '../Header.module.scss';
import { MenuIcon } from '@/components/Icons';
import SearchBar from './SearchBar';
import UserActions from './UserActions';

const cx = classNames.bind(styles);

interface HeaderTopBarProps {
    topBarBackgroundOpacity: number;
    isMobileMenuOpen: boolean;
    toggleMobileMenu: () => void;
    closeMobileMenu: () => void;
    mobileMenuToggleRef: React.RefObject<HTMLButtonElement>;
    searchValue: string;
    setSearchValue: (value: string) => void;
    handleSearch: (query?: string) => void;
    handleKeyDown: (e: React.KeyboardEvent) => void;
    searchBarInputRef: React.RefObject<HTMLInputElement>;
    isSearchBarFocused: boolean;
    setIsSearchBarFocused: (focused: boolean) => void;
    searchBarDropdownRef: React.RefObject<HTMLDivElement>;
    searchResults: any[];
    recentSearches: string[];
    setRecentSearches: (searches: string[]) => void;
    isMobile: boolean;
    mounted: boolean;
    currentUser: any;
    isDesktop: boolean;
    isLoginDropdownOpen: boolean;
    setIsLoginDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsHeaderHoverOverlay: (overlay: boolean) => void;
    loginDropdownTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
    loginDropdownCloseTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
    wishlistQuantity: number;
    trendingSearchTitle: string;
    trendingSearches: string[];
    defaultSearchValue: string;
    isSearchOpen: boolean;
    toggleSearch: () => void;
    searchToggleRef: React.RefObject<HTMLButtonElement>;
    cartQuantity: number;
    isCartDropdownOpen: boolean;
    setIsCartDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
    cartDropdownTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
    cartDropdownCloseTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
}

const HeaderTopBar: React.FC<HeaderTopBarProps> = ({
    topBarBackgroundOpacity,
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    mobileMenuToggleRef,
    searchValue,
    setSearchValue,
    handleSearch,
    handleKeyDown,
    searchBarInputRef,
    isSearchBarFocused,
    setIsSearchBarFocused,
    searchBarDropdownRef,
    searchResults,
    recentSearches,
    setRecentSearches,
    isMobile,
    mounted,
    currentUser,
    isDesktop,
    isLoginDropdownOpen,
    setIsLoginDropdownOpen,
    setIsHeaderHoverOverlay,
    loginDropdownTimeoutRef,
    loginDropdownCloseTimeoutRef,
    wishlistQuantity,
    trendingSearchTitle,
    trendingSearches,
    defaultSearchValue,
    isSearchOpen,
    toggleSearch,
    searchToggleRef,
    cartQuantity,
    isCartDropdownOpen,
    setIsCartDropdownOpen,
    cartDropdownTimeoutRef,
    cartDropdownCloseTimeoutRef,
}) => {
    return (
        <div 
            className={cx('top-bar')} 
            style={{ 
                backgroundColor: `rgba(47, 120, 255, ${topBarBackgroundOpacity})`,
            }}
        >
            <div className="container">
                <div className={cx('top-bar-content')}>
                    {/* Mobile Menu Toggle Button */}
                    <button 
                        className={cx('mobile-menu-toggle')}
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-menu-sidebar"
                        ref={mobileMenuToggleRef}
                    >
                        <MenuIcon />
                    </button>

                    {/* Logo */}
                    <Link href="/" className={cx('logo-section')} onClick={closeMobileMenu}>
                        <Image 
                            src="/logo/logo-xin.png" 
                            alt="XIN Logo" 
                            width={120} 
                            height={50}
                            priority
                            className={cx('logo-image')}
                        />
                    </Link>

                    {/* Search Bar */}
                    <SearchBar
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                        handleSearch={handleSearch}
                        handleKeyDown={handleKeyDown}
                        searchBarInputRef={searchBarInputRef}
                        isSearchBarFocused={isSearchBarFocused}
                        setIsSearchBarFocused={setIsSearchBarFocused}
                        searchBarDropdownRef={searchBarDropdownRef}
                        searchResults={searchResults}
                        recentSearches={recentSearches}
                        setRecentSearches={setRecentSearches}
                        isMobile={isMobile}
                        trendingSearchTitle={trendingSearchTitle}
                        trendingSearches={trendingSearches}
                        defaultSearchValue={defaultSearchValue}
                    />

                    {/* User Actions */}
                    <UserActions
                        mounted={mounted}
                        currentUser={currentUser}
                        isDesktop={isDesktop}
                        isLoginDropdownOpen={isLoginDropdownOpen}
                        setIsLoginDropdownOpen={setIsLoginDropdownOpen}
                        setIsHeaderHoverOverlay={setIsHeaderHoverOverlay}
                        loginDropdownTimeoutRef={loginDropdownTimeoutRef}
                        loginDropdownCloseTimeoutRef={loginDropdownCloseTimeoutRef}
                        wishlistQuantity={wishlistQuantity}
                        isSearchOpen={isSearchOpen}
                        toggleSearch={toggleSearch}
                        searchToggleRef={searchToggleRef}
                        cartQuantity={cartQuantity}
                        isCartDropdownOpen={isCartDropdownOpen}
                        setIsCartDropdownOpen={setIsCartDropdownOpen}
                        cartDropdownTimeoutRef={cartDropdownTimeoutRef}
                        cartDropdownCloseTimeoutRef={cartDropdownCloseTimeoutRef}
                    />
                </div>
            </div>
        </div>
    );
};

export default HeaderTopBar;
