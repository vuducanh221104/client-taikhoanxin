'use client';

import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useWishlist } from '@/hooks/useWishlist';
import { HeaderTopBar, HeaderMiddleBar, MobileSearchDropdown } from './components';
import MobileMenu from './components/MobileMenu';
import { useHeaderScroll, useHeaderSearch, useHeaderMobile } from './hooks';

const cx = classNames.bind(styles);

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
    const [mounted, setMounted] = useState(false);
    const headerRef = useRef<HTMLDivElement | null>(null);
    const [headerHeight, setHeaderHeight] = useState(0);
    
    // Dropdown overlay states
    const [isHeaderHoverOverlay, setIsHeaderHoverOverlay] = useState(false);
    const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
    const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
    const loginDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const cartDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const loginDropdownCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const cartDropdownCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Redux state
    const cart = useSelector((state: RootState) => state.cart);
    const cartQuantity = cart.totalQuantity;
    const currentUser = useSelector((state: RootState) => state.auth.login.currentUser);
    const { wishlistCount } = useWishlist();
    const wishlistQuantity = wishlistCount;

    // Custom hooks
    const { scrollY, isScrolled, topBarBackgroundOpacity } = useHeaderScroll(mounted);
    const {
        isMobileMenuOpen,
        isMobile,
        isDesktop,
        mobileMenuToggleRef,
        mobileMenuSidebarRef,
        toggleMobileMenu,
        closeMobileMenu,
    } = useHeaderMobile(mounted);
    const {
        searchValue,
        setSearchValue,
        isSearchOpen,
        isSearchBarFocused,
        setIsSearchBarFocused,
        searchResults,
        recentSearches,
        setRecentSearches,
        searchToggleRef,
        searchDropdownRef,
        searchBarInputRef,
        searchBarDropdownRef,
        toggleSearch,
        closeSearch,
        clearSearch,
        handleSearch,
        handleKeyDown,
    } = useHeaderSearch(mounted, isMobile);

    // Set mounted state after component mounts (client-side only)
    useEffect(() => {
        setMounted(true);
    }, []);

    // Update overlay when dropdowns open/close
    useEffect(() => {
        if (isDesktop) {
            setIsHeaderHoverOverlay(isLoginDropdownOpen || isCartDropdownOpen);
        } else {
            setIsHeaderHoverOverlay(false);
        }
    }, [isLoginDropdownOpen, isCartDropdownOpen, isDesktop]);

    // Measure header height for overlay top offset
    useEffect(() => {
        if (!mounted) return;
        
        const measure = () => {
            const el = headerRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            setHeaderHeight(rect.height);
        };
        measure();
        window.addEventListener('resize', measure);
        window.addEventListener('scroll', measure, { passive: true });
        return () => {
            window.removeEventListener('resize', measure);
            window.removeEventListener('scroll', measure as any);
        };
    }, [mounted]);

    // Cleanup timeouts
    useEffect(() => {
        return () => {
            if (loginDropdownTimeoutRef.current) {
                clearTimeout(loginDropdownTimeoutRef.current);
            }
            if (cartDropdownTimeoutRef.current) {
                clearTimeout(cartDropdownTimeoutRef.current);
            }
            if (loginDropdownCloseTimeoutRef.current) {
                clearTimeout(loginDropdownCloseTimeoutRef.current);
            }
            if (cartDropdownCloseTimeoutRef.current) {
                clearTimeout(cartDropdownCloseTimeoutRef.current);
            }
        };
    }, []);

    return (
        <>
            <div 
                className={cx('header-wrapper', { scrolled: isScrolled })}
                ref={headerRef}
            >
                {/* Top Bar - Logo, Search, User Actions */}
                <HeaderTopBar
                    topBarBackgroundOpacity={topBarBackgroundOpacity}
                    isMobileMenuOpen={isMobileMenuOpen}
                    toggleMobileMenu={toggleMobileMenu}
                    closeMobileMenu={closeMobileMenu}
                    mobileMenuToggleRef={mobileMenuToggleRef}
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

                {/* Middle Bar - Categories & Quick Links */}
                <HeaderMiddleBar setIsHeaderHoverOverlay={setIsHeaderHoverOverlay} />

                {/* Mobile Search Dropdown */}
                <MobileSearchDropdown
                    isSearchOpen={isSearchOpen}
                    isMobile={isMobile}
                    closeSearch={closeSearch}
                    clearSearch={clearSearch}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    handleSearch={handleSearch}
                    handleKeyDown={handleKeyDown}
                    searchResults={searchResults}
                    recentSearches={recentSearches}
                    setRecentSearches={setRecentSearches}
                    searchDropdownRef={searchDropdownRef}
                />

                {/* Header Hover Overlay */}
                {isHeaderHoverOverlay && (
                    <div 
                        className={cx('header-hover-overlay')}
                        style={{ top: `${headerHeight}px` }}
                    />
                )}
            </div>

            {/* Mobile Menu Sidebar */}
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={closeMobileMenu}
                mobileMenuSidebarRef={mobileMenuSidebarRef}
            />
        </>
    );
};

export default Header;
