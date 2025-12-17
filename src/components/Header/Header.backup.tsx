'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import {
    SearchIcon,
    UserIcon,
    CartIcon,
    HeartIcon,
    EyeIcon,
    FlameIcon,
    PercentIcon,
    BriefcaseIcon,
    CreditCardIcon,
    MenuIcon,
    NewsIcon,
    GiftIcon,
    HandshakeIcon,
    CalculatorIcon,
    WindowsIcon,
    OfficeIcon,
    GraduationIcon,
    BrainIcon,
    ImageIcon,
    CloudIcon,
    PlayIcon,
    CloseIcon,
    ClockIcon,
    ArrowUpRightIcon,
} from '@/components/Icons';
import CategoryDropdown from '@/components/CategoryDropdown/CategoryDropdown';
import CartDropdown from '@/components/CartDropdown/CartDropdown';
import LoginDropdown from '@/components/LoginDropdown/LoginDropdown';
import UserDropdown from '@/components/UserDropdown/UserDropdown';
import { searchProducts } from '@/services/productService';
import { FeaturedProduct } from '@/components/FeaturedProducts';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useWishlist } from '@/hooks/useWishlist';

const cx = classNames.bind(styles);

const Header: React.FC = () => {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState('');
    const [scrollY, setScrollY] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isSearchBarFocused, setIsSearchBarFocused] = useState(false);
    const [searchResults, setSearchResults] = useState<FeaturedProduct[]>([]);
    const [isMobile, setIsMobile] = useState(false);
    const searchToggleRef = useRef<HTMLButtonElement | null>(null);
    const searchDropdownRef = useRef<HTMLDivElement | null>(null);
    const searchBarInputRef = useRef<HTMLInputElement | null>(null);
    const searchBarDropdownRef = useRef<HTMLDivElement | null>(null);
    const mobileMenuToggleRef = useRef<HTMLButtonElement | null>(null);
    const mobileMenuSidebarRef = useRef<HTMLDivElement | null>(null);
    const isSearchOpeningRef = useRef(false);
    const justSearchClosedRef = useRef(false);
    const lastScrollYRef = useRef(0);
    const [recentSearches, setRecentSearches] = useState<string[]>([
        'Windows 11',
        'Office 365',
        'Tài khoản AI',
        'Spotify Premium',
        'Netflix',
    ]);
    const cart = useSelector((state: RootState) => state.cart);
    const cartQuantity = cart.totalQuantity;
    const currentUser = useSelector((state: RootState) => state.auth.login.currentUser);
    const { wishlistCount } = useWishlist();
    const wishlistQuantity = wishlistCount;

    // Header hover overlay state
    const [isHeaderHoverOverlay, setIsHeaderHoverOverlay] = useState(false);
    const headerRef = useRef<HTMLDivElement | null>(null);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [isDesktop, setIsDesktop] = useState(false);
    const [mounted, setMounted] = useState(false);
    
    // Dropdown overlay states
    const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
    const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
    const loginDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const cartDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const loginDropdownCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const cartDropdownCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Set mounted state after component mounts (client-side only)
    useEffect(() => {
        setMounted(true);
    }, []);

    // Detect desktop and mobile
    useEffect(() => {
        if (!mounted) return;
        
        const checkDesktop = () => {
            const width = window.innerWidth;
            setIsDesktop(width > 999);
            setIsMobile(width <= 999);
        };
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, [mounted]);

    // Update overlay when dropdowns open/close
    useEffect(() => {
        if (isDesktop) {
            setIsHeaderHoverOverlay(isLoginDropdownOpen || isCartDropdownOpen);
        } else {
            setIsHeaderHoverOverlay(false);
        }
    }, [isLoginDropdownOpen, isCartDropdownOpen, isDesktop]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
        if (!isSearchOpen && mounted) {
            // Auto focus vào input khi mở
            setTimeout(() => {
                const input = document.querySelector('[data-search-input="true"]') as HTMLInputElement;
                input?.focus();
            }, 100);
        }
    };

    const closeSearch = () => {
        justSearchClosedRef.current = true;
        setIsSearchOpen(false);
        setTimeout(() => {
            justSearchClosedRef.current = false;
        }, 200);
    };

    const clearSearch = () => {
        setSearchValue('');
        if (mounted) {
            const input = document.querySelector('[data-search-input="true"]') as HTMLInputElement;
            input?.focus();
        }
    };

    const handleSearch = (query?: string) => {
        const searchQuery = query || searchValue.trim();
        if (searchQuery) {
            // Redirect to search page
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            closeSearch();
            
            // Save to recent searches
            if (searchQuery && !recentSearches.includes(searchQuery)) {
                const updated = [searchQuery, ...recentSearches].slice(0, 5);
                setRecentSearches(updated);
                localStorage.setItem('recentSearches', JSON.stringify(updated));
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    // Update search results when search value changes
    useEffect(() => {
        if (searchValue.trim()) {
            const results = searchProducts(searchValue, 5);
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [searchValue]);

    useEffect(() => {
        if (!mounted) return;
        
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [mounted]);

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

    // Disable body scroll when mobile menu is open
    useEffect(() => {
        if (!mounted) return;
        
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen, mounted]);

    // A11y: trap focus & close with Esc when mobile menu open
    useEffect(() => {
        if (!mounted || !isMobileMenuOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                mobileMenuToggleRef.current?.focus();
                return;
            }
            if (e.key === 'Tab') {
                const container = mobileMenuSidebarRef.current;
                if (!container) return;
                const focusable = container.querySelectorAll<HTMLElement>('a[href], button, [tabindex]:not([tabindex="-1"])');
                if (!focusable.length) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                const active = document.activeElement as HTMLElement;
                if (e.shiftKey) {
                    if (active === first) {
                        e.preventDefault();
                        last.focus();
                    }
                } else {
                    if (active === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isMobileMenuOpen, mounted]);

    // Track when search dropdown is opening/closing
    useEffect(() => {
        if (isSearchOpen) {
            isSearchOpeningRef.current = true;
            justSearchClosedRef.current = false;
            const timer = setTimeout(() => {
                isSearchOpeningRef.current = false;
            }, 200);
            return () => clearTimeout(timer);
        } else {
            isSearchOpeningRef.current = false;
            if (mounted) {
                justSearchClosedRef.current = true;
                const timer = setTimeout(() => {
                    justSearchClosedRef.current = false;
                }, 300);
                return () => clearTimeout(timer);
            }
        }
    }, [isSearchOpen, mounted]);

    // Close search dropdown when scrolling down on mobile
    useEffect(() => {
        if (!mounted || !isSearchOpen || !isMobile) return;

        let touchStartY = 0;
        let touchStartTime = 0;
        let lastTouchY = 0;
        let isScrolling = false;
        let scrollVelocity = 0;

        const handleTouchStart = (e: TouchEvent) => {
            // Bỏ qua nếu đang mở hoặc vừa đóng
            if (isSearchOpeningRef.current || justSearchClosedRef.current) {
                return;
            }

            const target = e.target as HTMLElement;
            
            // Bỏ qua nếu touch vào close button
            if (target.closest('[data-search-close]')) {
                return;
            }

            // Bỏ qua nếu touch vào input field (để user có thể nhập text mà không trigger scroll)
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.closest('input, textarea')) {
                return;
            }

            touchStartY = e.touches[0].clientY;
            lastTouchY = touchStartY;
            touchStartTime = Date.now();
            isScrolling = false;
            scrollVelocity = 0;
        };

        const handleTouchMove = (e: TouchEvent) => {
            // Bỏ qua nếu đang mở hoặc vừa đóng
            if (isSearchOpeningRef.current || justSearchClosedRef.current || touchStartY === 0) {
                return;
            }

            const target = e.target as HTMLElement;
            
            // Bỏ qua nếu touch vào close button
            if (target.closest('[data-search-close]')) {
                return;
            }

            const currentTouchY = e.touches[0].clientY;
            const deltaY = currentTouchY - touchStartY;
            const deltaTime = Date.now() - touchStartTime;
            const immediateDeltaY = currentTouchY - lastTouchY;

                // Nếu scroll down (deltaY > 0)
            if (deltaY > 0) {
                // Kiểm tra xem có touch trong dropdown không
                if (searchDropdownRef.current && searchDropdownRef.current.contains(target)) {
                    // Kiểm tra xem có phải scrollable content không
                    const scrollableElement = target.closest('.search-results-section, .search-recent-section, .search-suggestions-section');
                    if (scrollableElement) {
                        const element = scrollableElement as HTMLElement;
                        const isScrollable = element.scrollHeight > element.clientHeight;
                        
                        if (isScrollable) {
                            // Cho phép scroll trong scrollable content
                            // Chỉ đóng nếu scroll down quá mạnh (delta > 100px) hoặc scroll đến cuối và tiếp tục scroll
                            const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 10;
                            
                            if (isAtBottom && deltaY > 30) {
                                // Đã scroll đến cuối và tiếp tục scroll down -> đóng
                                isScrolling = true;
                                setIsSearchOpen(false);
                                touchStartY = 0;
                                lastTouchY = 0;
                                return;
                            }
                            
                            if (deltaY > 100) {
                                // Scroll quá mạnh -> đóng
                                isScrolling = true;
                                setIsSearchOpen(false);
                                touchStartY = 0;
                                lastTouchY = 0;
                                return;
                            }
                            
                            // Cho phép scroll trong content
                            lastTouchY = currentTouchY;
                            return;
                        }
                    }
                    
                    // Touch trong dropdown nhưng không phải scrollable content
                    // Đóng khi scroll down với threshold cao hơn (delta > 40px) để tránh đóng khi user đang tương tác
                    if (deltaTime > 0) {
                        scrollVelocity = Math.abs(deltaY / deltaTime);
                    }
                    
                    // Đóng khi scroll down trong dropdown non-scrollable content với threshold cao hơn
                    if (deltaY > 40 && scrollVelocity > 0.2) {
                        isScrolling = true;
                        setIsSearchOpen(false);
                        touchStartY = 0;
                        lastTouchY = 0;
                        return;
                    }
                    
                    // Nếu scroll down nhanh trong dropdown (immediate delta > 15px), đóng
                    if (immediateDeltaY > 15 && deltaY > 25) {
                        isScrolling = true;
                        setIsSearchOpen(false);
                        touchStartY = 0;
                        lastTouchY = 0;
                        return;
                    }
                    
                    // Cập nhật lastTouchY để track tiếp
                    lastTouchY = currentTouchY;
                    return;
                }

                // Tính velocity (pixels per ms)
                if (deltaTime > 0) {
                    scrollVelocity = Math.abs(deltaY / deltaTime);
                }

                // Nếu scroll down trên overlay hoặc ngoài dropdown
                // Đóng với threshold thấp hơn để nhạy hơn
                if (deltaY > 20 && scrollVelocity > 0.1) {
                    isScrolling = true;
                    setIsSearchOpen(false);
                    touchStartY = 0;
                    lastTouchY = 0;
                    return;
                }

                // Nếu scroll down nhanh (immediate delta > 10px và tổng delta > 15px), đóng ngay
                if (immediateDeltaY > 10 && deltaY > 15) {
                    isScrolling = true;
                    setIsSearchOpen(false);
                    touchStartY = 0;
                    lastTouchY = 0;
                    return;
                }
            }

            lastTouchY = currentTouchY;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            // Bỏ qua nếu đã đóng
            if (!isSearchOpen || isScrolling) {
                touchStartY = 0;
                lastTouchY = 0;
                isScrolling = false;
                return;
            }

            if (!isSearchOpeningRef.current && !justSearchClosedRef.current && touchStartY > 0) {
                const target = e.target as HTMLElement;
                const touchEndY = e.changedTouches[0].clientY;
                const deltaY = touchEndY - touchStartY;
                const deltaTime = Date.now() - touchStartTime;

                // Nếu swipe down trên overlay hoặc ngoài dropdown
                if (target.hasAttribute('data-search-overlay') || 
                    (searchDropdownRef.current && 
                     !searchDropdownRef.current.contains(e.changedTouches[0].target as Node))) {
                    // Nếu swipe down với delta > 40px và thời gian < 600ms, đóng dropdown
                    if (deltaY > 40 && deltaTime < 600) {
                        setIsSearchOpen(false);
                    }
                }
            }

            touchStartY = 0;
            lastTouchY = 0;
            isScrolling = false;
            scrollVelocity = 0;
        };

        // Detect wheel events (for devices with mouse/trackpad on mobile)
        const handleWheel = (e: WheelEvent) => {
            // Bỏ qua nếu đang mở hoặc vừa đóng
            if (isSearchOpeningRef.current || justSearchClosedRef.current) {
                return;
            }

            const target = e.target as HTMLElement;
            
            // Nếu wheel trong dropdown content scrollable, không đóng
            if (searchDropdownRef.current && searchDropdownRef.current.contains(target)) {
                const scrollableElement = target.closest('.search-results-section, .search-recent-section, .search-suggestions-section');
                if (scrollableElement) {
                    const element = scrollableElement as HTMLElement;
                    const isScrollable = element.scrollHeight > element.clientHeight;
                    if (isScrollable) {
                        // Cho phép scroll trong dropdown content
                        return;
                    }
                }
            }

            // Nếu wheel down và không phải trong dropdown, đóng
            if (e.deltaY > 0) {
                setIsSearchOpen(false);
            }
        };

        // Add event listeners
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });
        window.addEventListener('wheel', handleWheel, { passive: true });

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('wheel', handleWheel);
        };
    }, [isSearchOpen, isMobile, mounted, searchDropdownRef]);

    // Disable body scroll when search dropdown is open on mobile
    useEffect(() => {
        if (!mounted) return;
        
        if (isSearchOpen && isMobile) {
            document.body.style.overflow = 'hidden';
            lastScrollYRef.current = window.scrollY;
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isSearchOpen, isMobile, mounted]);

    // A11y: Esc to close & trap focus inside search dialog when open
    useEffect(() => {
        if (!mounted || !isSearchOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                setIsSearchOpen(false);
                searchToggleRef.current?.focus();
                return;
            }
            if (e.key === 'Tab') {
                const container = searchDropdownRef.current;
                if (!container) return;
                const focusable = container.querySelectorAll<HTMLElement>('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
                if (!focusable.length) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                const active = document.activeElement as HTMLElement;
                if (e.shiftKey) {
                    if (active === first) {
                        e.preventDefault();
                        last.focus();
                    }
                } else {
                    if (active === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isSearchOpen, mounted]);

    // Tính toán background opacity dựa trên scroll position
    // Từ 0-100px: background opacity từ 1 -> 0.85
    // Từ 100px trở đi: background opacity = 0.85
    // Chỉ tính toán sau khi mounted để tránh hydration mismatch
    const calculateBackgroundOpacity = () => {
        if (!mounted) return 1; // Default to opaque on server
        if (scrollY <= 0) return 1;
        if (scrollY >= 100) return 0.85;
        return 1 - (scrollY / 100) * 0.15;
    };

    const isScrolled = mounted && scrollY > 0;
    const topBarBackgroundOpacity = calculateBackgroundOpacity();

    const headerContent = (
        <div 
            className={cx('header-wrapper', { scrolled: isScrolled })}
            ref={headerRef}
        >
            {/* Top Bar - Logo, Search, User Actions */}
            <div 
                className={cx('top-bar')} 
                style={{ 
                    backgroundColor: `rgba(47, 120, 255, ${topBarBackgroundOpacity})`, // Keep inline for dynamic opacity
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
                        <div className={cx('search-section')}>
                            <div className={cx('search-input-wrapper')}>
                                <input
                                    ref={searchBarInputRef}
                                    type="text"
                                    placeholder="Tìm kiếm..."
                                    className={cx('search-input')}
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => setIsSearchBarFocused(true)}
                                    onBlur={(e) => {
                                        // Delay để cho phép click vào dropdown
                                        setTimeout(() => {
                                            if (!searchBarDropdownRef.current?.contains(e.relatedTarget as Node)) {
                                                setIsSearchBarFocused(false);
                                            }
                                        }, 200);
                                    }}
                                    aria-label="Tìm kiếm sản phẩm"
                                />
                                <button 
                                    className={cx('search-button')}
                                    onClick={() => handleSearch()}
                                >
                                    <SearchIcon />
                                </button>
                            </div>
                            
                            {/* Inline Search Dropdown */}
                            {isSearchBarFocused && (searchResults.length > 0 || (searchValue.trim() === '' && recentSearches.length > 0)) && (
                                <div 
                                    ref={searchBarDropdownRef}
                                    className={cx('search-bar-dropdown')}
                                    onMouseDown={(e) => e.preventDefault()} // Prevent input blur
                                >
                                    {searchResults.length > 0 ? (
                                        <ul className={cx('search-results-list')}>
                                            {searchResults.map((product) => (
                                                <li key={product.id} className={cx('search-result-item')}>
                                                    <Link 
                                                        href={product.href || '#'} 
                                                        className={cx('search-result-link')}
                                                        onClick={() => {
                                                            setIsSearchBarFocused(false);
                                                            setSearchValue('');
                                                        }}
                                                    >
                                                        <div className={cx('search-result-thumbnail')}>
                                                            {product.imageSrc ? (
                                                                <Image
                                                                    src={product.imageSrc}
                                                                    alt={product.imageAlt || product.productName}
                                                                    width={60}
                                                                    height={60}
                                                                    className={cx('search-result-image')}
                                                                />
                                                            ) : (
                                                                <div className={cx('search-result-placeholder')} />
                                                            )}
                                                        </div>
                                                        <div className={cx('search-result-content')}>
                                                            <h4 className={cx('search-result-name')}>
                                                                {product.productName}
                                                            </h4>
                                                            <div className={cx('search-result-prices')}>
                                                                {product.oldPrice && (
                                                                    <span className={cx('search-result-old-price')}>
                                                                        {product.oldPrice.toLocaleString('vi-VN')} ₫
                                                                    </span>
                                                                )}
                                                                <span className={cx('search-result-price')}>
                                                                    {product.price.toLocaleString('vi-VN')} ₫
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className={cx('search-result-status')}>
                                                            <p className={cx('search-result-description')}>
                                                                {product.status === 'in-stock' ? 'Còn hàng' : 'Hết hàng'}
                                                            </p>
                                                        </div>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : searchValue.trim() === '' ? (
                                        <div className={cx('search-suggestions-section')}>
                                            {/* Recent Searches */}
                                            {recentSearches.length > 0 && (
                                                <div className={cx('search-recent-section')}>
                                                    <div className={cx('search-section-header')}>
                                                        <h3 className={cx('search-section-title')}>
                                                            <ClockIcon className={cx('search-section-icon')} />
                                                            <span>Tìm kiếm gần đây</span>
                                                        </h3>
                                                        <button
                                                            className={cx('search-clear-history-button')}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                setRecentSearches([]);
                                                                if (typeof window !== 'undefined') {
                                                                    localStorage.removeItem('recentSearches');
                                                                }
                                                            }}
                                                            type="button"
                                                            aria-label="Xóa lịch sử tìm kiếm"
                                                        >
                                                            Xóa
                                                        </button>
                                                    </div>
                                                    <ul className={cx('search-recent-list')}>
                                                        {(isMobile ? recentSearches.slice(0, 3) : recentSearches).map((query, index) => (
                                                            <li key={index} className={cx('search-recent-item')}>
                                                                <button
                                                                    className={cx('search-recent-text')}
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        setSearchValue(query);
                                                                        handleSearch(query);
                                                                    }}
                                                                    type="button"
                                                                >
                                                                    {query}
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            
                                            {/* Popular Searches - Show when no recent searches or always show below */}
                                            <div className={cx('search-popular-section')}>
                                                <h3 className={cx('search-section-title')}>
                                                    <FlameIcon className={cx('search-section-icon')} />
                                                    <span>Tìm kiếm phổ biến</span>
                                                </h3>
                                                <ul className={cx('search-popular-list')}>
                                                    {[
                                                        'Windows 11',
                                                        'Office 365',
                                                        'Tài khoản AI',
                                                        'Spotify Premium',
                                                        'Netflix',
                                                        'Adobe Creative',
                                                    ]
                                                        .filter(query => !recentSearches.includes(query))
                                                        .map((query, index) => (
                                                            <li key={index} className={cx('search-popular-item')}>
                                                                <button
                                                                    className={cx('search-popular-text')}
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        setSearchValue(query);
                                                                        handleSearch(query);
                                                                    }}
                                                                    type="button"
                                                                >
                                                                    {query}
                                                                </button>
                                                            </li>
                                                        ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </div>

                        {/* User Actions */}
                        <div className={cx('actions-section')}>
                            {/* User Auth */}
                            <div suppressHydrationWarning>
                                {currentUser ? (
                                    // User is logged in - show UserDropdown
                                    <div 
                                        className={cx('action-item-wrapper', 'desktop-only')}
                                        onMouseEnter={() => {
                                        if (mounted && isDesktop) {
                                            // Clear close timeout nếu đang có
                                            if (loginDropdownCloseTimeoutRef.current) {
                                                clearTimeout(loginDropdownCloseTimeoutRef.current);
                                                loginDropdownCloseTimeoutRef.current = null;
                                            }
                                            // Clear open timeout nếu đang có
                                            if (loginDropdownTimeoutRef.current) {
                                                clearTimeout(loginDropdownTimeoutRef.current);
                                            }
                                            // Delay mở dropdown
                                            loginDropdownTimeoutRef.current = setTimeout(() => {
                                                setIsLoginDropdownOpen(true);
                                            }, 120);
                                        }
                                    }}
                                    onMouseLeave={() => {
                                        if (mounted && isDesktop) {
                                            // Clear open timeout
                                            if (loginDropdownTimeoutRef.current) {
                                                clearTimeout(loginDropdownTimeoutRef.current);
                                                loginDropdownTimeoutRef.current = null;
                                            }
                                            // Delay đóng dropdown - chỉ đóng khi thực sự rời khỏi cả wrapper và dropdown
                                            loginDropdownCloseTimeoutRef.current = setTimeout(() => {
                                                setIsLoginDropdownOpen(false);
                                            }, 200);
                                        }
                                    }}
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
                                        onMouseEnter={() => {
                                            // Khi hover vào dropdown, cancel close timeout và đảm bảo dropdown mở
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
                                        }}
                                        onMouseLeave={() => {
                                            // Khi rời khỏi dropdown, đóng sau delay
                                            if (loginDropdownCloseTimeoutRef.current) {
                                                clearTimeout(loginDropdownCloseTimeoutRef.current);
                                            }
                                            loginDropdownCloseTimeoutRef.current = setTimeout(() => {
                                                setIsLoginDropdownOpen(false);
                                            }, 200);
                                        }}
                                    />
                                </div>
                            ) : (
                                // User is not logged in - show LoginDropdown
                                <div 
                                    className={cx('action-item-wrapper', 'desktop-only')}
                                    onMouseEnter={() => {
                                        if (mounted && isDesktop) {
                                            // Clear close timeout nếu đang có
                                            if (loginDropdownCloseTimeoutRef.current) {
                                                clearTimeout(loginDropdownCloseTimeoutRef.current);
                                                loginDropdownCloseTimeoutRef.current = null;
                                            }
                                            // Clear open timeout nếu đang có
                                            if (loginDropdownTimeoutRef.current) {
                                                clearTimeout(loginDropdownTimeoutRef.current);
                                            }
                                            // Delay mở dropdown
                                            loginDropdownTimeoutRef.current = setTimeout(() => {
                                                setIsLoginDropdownOpen(true);
                                            }, 120);
                                        }
                                    }}
                                    onMouseLeave={() => {
                                        if (mounted && isDesktop) {
                                            // Clear open timeout
                                            if (loginDropdownTimeoutRef.current) {
                                                clearTimeout(loginDropdownTimeoutRef.current);
                                                loginDropdownTimeoutRef.current = null;
                                            }
                                            // Delay đóng dropdown - chỉ đóng khi thực sự rời khỏi cả wrapper và dropdown
                                            loginDropdownCloseTimeoutRef.current = setTimeout(() => {
                                                setIsLoginDropdownOpen(false);
                                            }, 200);
                                        }
                                    }}
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
                                        onMouseEnter={() => {
                                            // Khi hover vào dropdown, cancel close timeout và đảm bảo dropdown mở
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
                                        }}
                                        onMouseLeave={() => {
                                            // Khi rời khỏi dropdown, đóng sau delay
                                            if (loginDropdownCloseTimeoutRef.current) {
                                                clearTimeout(loginDropdownCloseTimeoutRef.current);
                                            }
                                            loginDropdownCloseTimeoutRef.current = setTimeout(() => {
                                                setIsLoginDropdownOpen(false);
                                            }, 200);
                                        }}
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
                                onMouseEnter={() => {
                                    if (mounted && isDesktop) {
                                        // Clear close timeout nếu đang có
                                        if (cartDropdownCloseTimeoutRef.current) {
                                            clearTimeout(cartDropdownCloseTimeoutRef.current);
                                            cartDropdownCloseTimeoutRef.current = null;
                                        }
                                        // Clear open timeout nếu đang có
                                        if (cartDropdownTimeoutRef.current) {
                                            clearTimeout(cartDropdownTimeoutRef.current);
                                        }
                                        // Delay mở dropdown
                                        cartDropdownTimeoutRef.current = setTimeout(() => {
                                            setIsCartDropdownOpen(true);
                                        }, 120);
                                    }
                                }}
                                onMouseLeave={() => {
                                    if (mounted && isDesktop) {
                                        // Clear open timeout
                                        if (cartDropdownTimeoutRef.current) {
                                            clearTimeout(cartDropdownTimeoutRef.current);
                                            cartDropdownTimeoutRef.current = null;
                                        }
                                        // Delay đóng dropdown - chỉ đóng khi thực sự rời khỏi cả wrapper và dropdown
                                        cartDropdownCloseTimeoutRef.current = setTimeout(() => {
                                            setIsCartDropdownOpen(false);
                                        }, 200);
                                    }
                                }}
                                onClick={(e) => {
                                    // Trên mobile, mở dropdown khi click vào wrapper
                                    if (mounted && !isDesktop) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        // Sử dụng setTimeout để tránh conflict với click outside handler
                                        setTimeout(() => {
                                            setIsCartDropdownOpen((prev) => !prev);
                                        }, 0);
                                    }
                                }}
                            >
                                <Link 
                                    href="/cart" 
                                    className={cx('action-item')}
                                    onClick={(e) => {
                                        // Trên mobile, mở dropdown thay vì navigate
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
                                    onMouseEnter={() => {
                                        // Khi hover vào dropdown, cancel close timeout và đảm bảo dropdown mở
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
                                    }}
                                    onMouseLeave={() => {
                                        // Khi rời khỏi dropdown, đóng sau delay
                                        if (cartDropdownCloseTimeoutRef.current) {
                                            clearTimeout(cartDropdownCloseTimeoutRef.current);
                                        }
                                        cartDropdownCloseTimeoutRef.current = setTimeout(() => {
                                            setIsCartDropdownOpen(false);
                                        }, 200);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Bar - Categories & Quick Links */}
            <div className={cx('middle-bar', 'desktop-only')}>
                <div className="container">
                    <div className={cx('middle-bar-content')}>
                        {/* Categories Dropdown */}
                        <CategoryDropdown onOverlayChange={setIsHeaderHoverOverlay} />

                        {/* Quick Links */}
                        <Link 
                            href="/viewed" 
                            className={cx('quick-link')}
                            aria-label="Sản phẩm bạn vừa xem"
                        >
                            <EyeIcon className={cx('quick-link-icon')} />
                            <span>Sản phẩm bạn vừa xem</span>
                        </Link>
                        <Link 
                            href="/products/best-selling" 
                            className={cx('quick-link')}
                            aria-label="Sản phẩm mua nhiều"
                        >
                            <FlameIcon className={cx('quick-link-icon')} />
                            <span>Sản phẩm mua nhiều</span>
                        </Link>
                        <Link 
                            href="/products/sale" 
                            className={cx('quick-link')}
                            aria-label="Sản phẩm khuyến mại"
                        >
                            <PercentIcon className={cx('quick-link-icon')} />
                            <span>Sản phẩm khuyến mại</span>
                        </Link>
                        <Link 
                            href="/payment" 
                            className={cx('quick-link')}
                            aria-label="Hình thức thanh toán"
                        >
                            <CreditCardIcon className={cx('quick-link-icon')} />
                            <span>Hình thức thanh toán</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Search Dropdown Overlay */}
            {isSearchOpen && (
                <>
                    <div 
                        className={cx('search-overlay')}
                        onClick={(e) => {
                            e.stopPropagation();
                            closeSearch();
                        }}
                        onTouchEnd={(e) => {
                            e.stopPropagation();
                            closeSearch();
                        }}
                        data-search-overlay
                    />
                    <div 
                        className={cx('search-dropdown', { 'is-mobile': isMobile })}
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        id="search-dropdown"
                        ref={searchDropdownRef}
                    >
                        {/* Search Input */}
                        <div className={cx('search-dropdown-input-wrapper')}>
                            {isMobile && (
                                <button
                                    className={cx('search-close-button')}
                                    onClick={closeSearch}
                                    onTouchEnd={(e) => {
                                        e.stopPropagation();
                                        closeSearch();
                                    }}
                                    aria-label="Đóng tìm kiếm"
                                    type="button"
                                    data-search-close
                                >
                                    <CloseIcon size={22} />
                                </button>
                            )}
                            <SearchIcon className={cx('search-input-icon')} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                className={cx('search-dropdown-input')}
                                data-search-input="true"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                            />
                            {searchValue && (
                                <button 
                                    className={cx('search-clear-button')}
                                    onClick={clearSearch}
                                    aria-label="Clear search"
                                    type="button"
                                >
                                    <CloseIcon />
                                </button>
                            )}
                        </div>

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <div className={cx('search-results-section')}>
                                <ul className={cx('search-results-list')}>
                                    {searchResults.map((product) => (
                                        <li key={product.id} className={cx('search-result-item')}>
                                            <Link 
                                                href={product.href || '#'} 
                                                className={cx('search-result-link')}
                                                onClick={closeSearch}
                                            >
                                                <div className={cx('search-result-thumbnail')}>
                                                    {product.imageSrc ? (
                                                        <Image
                                                            src={product.imageSrc}
                                                            alt={product.imageAlt || product.productName}
                                                            width={60}
                                                            height={60}
                                                            className={cx('search-result-image')}
                                                        />
                                                    ) : (
                                                        <div className={cx('search-result-placeholder')} />
                                                    )}
                                                </div>
                                                <div className={cx('search-result-content')}>
                                                    <h4 className={cx('search-result-name')}>
                                                        {product.productName}
                                                    </h4>
                                                    <p className={cx('search-result-description')}>
                                                        {product.status === 'in-stock' ? 'Còn hàng' : 'Hết hàng'}
                                                    </p>
                                                </div>
                                                <div className={cx('search-result-prices')}>
                                                    {product.oldPrice && (
                                                        <span className={cx('search-result-old-price')}>
                                                            {product.oldPrice.toLocaleString('vi-VN')} ₫
                                                        </span>
                                                    )}
                                                    <span className={cx('search-result-price')}>
                                                        {product.price.toLocaleString('vi-VN')} ₫
                                                    </span>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                <div className={cx('search-view-all')}>
                                    <button
                                        className={cx('search-view-all-button')}
                                        onClick={() => handleSearch()}
                                        type="button"
                                    >
                                        Xem tất cả kết quả cho "{searchValue}"
                                        <ArrowUpRightIcon size={16} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Recent Searches - Only show when no search results */}
                        {searchResults.length === 0 && searchValue.trim() === '' && recentSearches.length > 0 && (
                            <div className={cx('search-recent-section')}>
                                <h3 className={cx('search-recent-title')}>Tìm kiếm gần đây</h3>
                                <ul className={cx('search-recent-list')}>
                                    {(isMobile ? recentSearches.slice(0, 3) : recentSearches).map((query, index) => (
                                        <li key={index} className={cx('search-recent-item')}>
                                            <ClockIcon className={cx('search-recent-icon')} />
                                            <button
                                                className={cx('search-recent-text')}
                                                onClick={() => handleSearch(query)}
                                            >
                                                {query}
                                            </button>
                                            <ArrowUpRightIcon className={cx('search-recent-arrow')} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Mobile Menu Sidebar */}
            <div 
                className={cx('mobile-menu-overlay', { 'is-open': isMobileMenuOpen })}
                onClick={closeMobileMenu}
            />
            <div 
                className={cx('mobile-menu-sidebar', { 'is-open': isMobileMenuOpen })}
                role="dialog"
                aria-modal="true"
                id="mobile-menu-sidebar"
                ref={mobileMenuSidebarRef}
            >
                {/* Close Button */}
                <button className={cx('mobile-menu-close')} onClick={closeMobileMenu}>
                    <span>✕</span> Đóng
                </button>

                {/* Menu Items */}
                <nav className={cx('mobile-menu-nav')}>
                    <Link href="/categories/windows" className={cx('mobile-menu-item')} onClick={closeMobileMenu}>
                        <WindowsIcon className={cx('mobile-menu-icon')} />
                        <span>Windows</span>
                    </Link>
                    <Link href="/categories/office" className={cx('mobile-menu-item')} onClick={closeMobileMenu}>
                        <OfficeIcon className={cx('mobile-menu-icon')} />
                        <span>Office</span>
                    </Link>
                    <Link href="/categories/learning" className={cx('mobile-menu-item')} onClick={closeMobileMenu}>
                        <GraduationIcon className={cx('mobile-menu-icon')} />
                        <span>Học tập</span>
                    </Link>
                    <Link href="/categories/ai-account" className={cx('mobile-menu-item')} onClick={closeMobileMenu}>
                        <BrainIcon className={cx('mobile-menu-icon')} />
                        <span>Tài Khoản AI</span>
                    </Link>
                    <Link href="/categories/photo-video" className={cx('mobile-menu-item')} onClick={closeMobileMenu}>
                        <ImageIcon className={cx('mobile-menu-icon')} />
                        <span>Ảnh & Video</span>
                    </Link>
                    <Link href="/categories/storage" className={cx('mobile-menu-item')} onClick={closeMobileMenu}>
                        <CloudIcon className={cx('mobile-menu-icon')} />
                        <span>Lưu trữ</span>
                    </Link>
                    <Link href="/categories/work" className={cx('mobile-menu-item')} onClick={closeMobileMenu}>
                        <BriefcaseIcon className={cx('mobile-menu-icon')} />
                        <span>Làm việc</span>
                    </Link>
                    <Link href="/categories/entertainment" className={cx('mobile-menu-item')} onClick={closeMobileMenu}>
                        <PlayIcon className={cx('mobile-menu-icon')} />
                        <span>Giải trí</span>
                    </Link>
                </nav>
            </div>
        </div>
    );

    return (
        <>
            {headerContent}
            {mounted && typeof window !== 'undefined' && createPortal(
                <div 
                    className={cx('header-hover-overlay', { 
                        'is-visible': isHeaderHoverOverlay && !isSearchOpen && !isMobileMenuOpen && isDesktop
                    })} 
                    style={{ top: headerHeight }}
                />,
                document.body
            )}
        </>
    );
};

export default Header;

