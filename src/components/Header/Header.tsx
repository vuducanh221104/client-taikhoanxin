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
import { useCart } from '@/services/cartService';
import Cookies from 'js-cookie';

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
    const reduxCart = useSelector((state: RootState) => state.cart);
    const currentUser = useSelector((state: RootState) => state.auth.login.currentUser);
    const { wishlistCount } = useWishlist();
    const wishlistQuantity = wishlistCount;
    
    // Fetch cart from API if user is logged in
    const { data: cartData } = useCart();
    
    // Use API cart if available, otherwise use Redux cart (for backward compatibility)
    const cart = React.useMemo(() => {
        if (currentUser && cartData?.data) {
            // Map API cart to Redux cart format
            const apiCart = cartData.data;
            const items = apiCart.items || [];
            const mappedProducts = items.map((item: any) => {
                const product = item.productId || item.product_id;
                const productId = product?._id || product?.id || '';
                const productName = product?.name || '';
                let price = 0;
                if (product?.price) {
                    if (Array.isArray(product.price)) {
                        price = product.price[0]?.priceOriginal || product.price[0]?.original || 0;
                    } else if (typeof product.price === 'object') {
                        price = product.price.priceOriginal || product.price.original || 0;
                    }
                }
                const image = product?.image || [];
                const imageSrc = Array.isArray(image) && image.length > 0 ? image[0] : '';
                const slug = product?.slug || '';
                const min = product?.min || 1;
                const max = product?.max || 100;
                const stock = product?.stock || 0;
                
                return {
                    id: productId,
                    productName,
                    price,
                    oldPrice: undefined,
                    imageSrc,
                    imageAlt: productName,
                    href: slug ? `/product/${slug}` : `#`,
                    quantity: item.quantity || 1,
                    min,
                    max,
                    stock,
                };
            });
            
            // Calculate totalQuantity from items if apiCart.quantity is not available or 0
            const calculatedTotalQuantity = mappedProducts.reduce((sum, product) => sum + (product.quantity || 0), 0);
            const totalQuantity = apiCart.quantity && apiCart.quantity > 0 ? apiCart.quantity : calculatedTotalQuantity;
            
            return {
                products: mappedProducts,
                totalPrice: apiCart.totalDiscountBefore || 0,
                totalQuantity: totalQuantity,
                couponCode: apiCart.discountCode || undefined,
                couponDiscount: apiCart.totalDiscount || 0,
            };
        }
        return reduxCart;
    }, [cartData, currentUser, reduxCart]);
    
    const cartQuantity = cart.totalQuantity;

    // Sync cart quantity with cookie for middleware guard
    useEffect(() => {
        if (!mounted) return;
        const quantity = cartQuantity || 0;
        const cookieOptions = {
            path: '/',
            sameSite: 'lax' as const,
            secure: process.env.NODE_ENV === 'production',
        };

        if (quantity > 0) {
            Cookies.set('cartQuantity', String(quantity), cookieOptions);
        } else {
            Cookies.remove('cartQuantity', { path: '/' });
        }
    }, [cartQuantity, mounted]);

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
