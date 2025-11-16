'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon, MenuIcon, CopyIcon, ChevronDownIcon } from '@/components/Icons';
import styles from './HelpHeader.module.scss';

interface SearchResult {
    title: string;
    href: string;
    category: string;
    description?: string;
}

const helpPages: SearchResult[] = [
    { title: 'Giới thiệu', href: '/help/getting-started/intro', category: 'Bắt đầu' },
    { title: 'Đăng ký tài khoản', href: '/help/getting-started/register', category: 'Bắt đầu' },
    { title: 'Đăng nhập', href: '/help/getting-started/login', category: 'Bắt đầu' },
    { title: 'Tìm kiếm sản phẩm', href: '/help/shopping/search', category: 'Mua hàng' },
    { title: 'Thêm vào giỏ hàng', href: '/help/shopping/cart', category: 'Mua hàng' },
    { title: 'Thanh toán', href: '/help/shopping/checkout', category: 'Mua hàng' },
    { title: 'Theo dõi đơn hàng', href: '/help/shopping/track-order', category: 'Mua hàng' },
    { title: 'Quản lý tài khoản', href: '/help/account/manage', category: 'Tài khoản' },
    { title: 'Đổi mật khẩu', href: '/help/account/change-password', category: 'Tài khoản' },
    { title: 'Lịch sử đơn hàng', href: '/help/account/order-history', category: 'Tài khoản' },
    { title: 'Thông tin bảo hành chung', href: '/help/warranty/general', category: 'Bảo hành' },
    { title: 'Chính sách bảo hành Netflix', href: '/help/policies/warranty/netflix', category: 'Chính sách' },
    { title: 'Chính sách bảo hành Spotify', href: '/help/policies/warranty/spotify', category: 'Chính sách' },
    { title: 'Chính sách bảo hành Youtube', href: '/help/policies/warranty/youtube', category: 'Chính sách' },
    { title: 'Chính sách đổi trả', href: '/help/policies/return', category: 'Chính sách' },
    { title: 'Chính sách thanh toán', href: '/help/policies/payment', category: 'Chính sách' },
    { title: 'Chính sách bảo mật', href: '/help/policies/privacy', category: 'Chính sách' },
    { title: 'Điều khoản sử dụng', href: '/help/policies/terms', category: 'Chính sách' },
];

export default function HelpHeader() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [showCopyMenu, setShowCopyMenu] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const mobileInputRef = useRef<HTMLInputElement>(null);
    const copyMenuRef = useRef<HTMLDivElement>(null);
    const searchDropdownRef = useRef<HTMLDivElement>(null);

    // Toggle mobile sidebar
    const toggleMobileSidebar = () => {
        setShowMobileSidebar(!showMobileSidebar);
        // Dispatch custom event for sidebar to listen
        window.dispatchEvent(new CustomEvent('toggleHelpSidebar'));
    };

    // Search functionality
    useEffect(() => {
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const results = helpPages.filter(
                (page) =>
                    page.title.toLowerCase().includes(query) ||
                    page.category.toLowerCase().includes(query)
            );
            setSearchResults(results.slice(0, 8)); // Limit to 8 results
            setSelectedIndex(-1);
        } else {
            setSearchResults([]);
            setSelectedIndex(-1);
        }
    }, [searchQuery]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+K or Cmd+K to focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            inputRef.current?.blur();
            setSearchQuery('');
            setSearchResults([]);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            router.push(searchResults[selectedIndex].href);
            setSearchQuery('');
            setSearchResults([]);
            inputRef.current?.blur();
        }
    };

    const handleCopyPage = () => {
        // Copy page content as markdown
        const content = document.querySelector('main')?.innerText || '';
        navigator.clipboard.writeText(content);
        setShowCopyMenu(false);
    };

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (copyMenuRef.current && !copyMenuRef.current.contains(event.target as Node)) {
                setShowCopyMenu(false);
            }
        };

        if (showCopyMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showCopyMenu]);

    return (
        <header className={styles.helpHeader}>
            <div className={styles.headerContainer}>
                <div className={styles.headerLeft}>
                    <button 
                        className={styles.mobileMenuToggle} 
                        onClick={toggleMobileSidebar}
                        aria-label="Toggle menu"
                    >
                        <MenuIcon />
                    </button>
                    <Link href="/" className={styles.logo}>
                        <img
                            src="/logo/logo-xin.png"
                            alt="TAIKHOANXIN.COM"
                            className={styles.logoImage}
                        />
                    </Link>
                </div>

                <div className={styles.searchSection}>
                    <div className={`${styles.searchWrapper} ${isSearchExpanded ? styles.expanded : ''}`}>
                        <button 
                            className={styles.searchIconButton}
                            onClick={() => {
                                if (window.innerWidth < 1000) {
                                    setShowMobileSearch(true);
                                    setTimeout(() => mobileInputRef.current?.focus(), 100);
                                } else {
                                    setIsSearchExpanded(true);
                                    setTimeout(() => inputRef.current?.focus(), 100);
                                }
                            }}
                            aria-label="Search"
                        >
                            <SearchIcon className={styles.searchIcon} />
                        </button>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => {
                                setIsFocused(true);
                                setIsSearchExpanded(true);
                            }}
                            onBlur={() => {
                                // Delay to allow click on results
                                setTimeout(() => {
                                    setIsFocused(false);
                                    if (!searchQuery) {
                                        setIsSearchExpanded(false);
                                    }
                                }, 200);
                            }}
                            onKeyDown={handleKeyDown}
                            className={styles.searchInput}
                            autoComplete="off"
                        />
                        {searchQuery && (
                            <button
                                className={styles.clearButton}
                                onClick={() => {
                                    setSearchQuery('');
                                    setSearchResults([]);
                                    inputRef.current?.focus();
                                }}
                                aria-label="Clear search"
                                type="button"
                            >
                                ✕
                            </button>
                        )}
                        <kbd className={styles.searchShortcut}>
                            {isFocused ? 'ESC' : 'Ctrl K'}
                        </kbd>

                        {/* Search Results Dropdown */}
                        {isFocused && searchResults.length > 0 && (
                            <div className={styles.searchDropdown} ref={searchDropdownRef}>
                                <div className={styles.searchResultsHeader}>
                                    <span className={styles.resultsCount}>
                                        {searchResults.length} kết quả
                                    </span>
                                </div>
                                <div className={styles.searchResults}>
                                    {searchResults.map((result, index) => (
                                        <Link
                                            key={result.href}
                                            href={result.href}
                                            className={`${styles.searchResultItem} ${
                                                index === selectedIndex ? styles.selected : ''
                                            }`}
                                            onClick={() => {
                                                setSearchQuery('');
                                                setSearchResults([]);
                                            }}
                                        >
                                            <div className={styles.resultContent}>
                                                <span className={styles.resultTitle}>
                                                    {result.title}
                                                </span>
                                                <span className={styles.resultCategory}>
                                                    {result.category}
                                                </span>
                                            </div>
                                            <span className={styles.resultArrow}>→</span>
                                        </Link>
                                    ))}
                                </div>
                                <div className={styles.searchFooter}>
                                    <span className={styles.footerHint}>
                                        <kbd>↑</kbd> <kbd>↓</kbd> để di chuyển
                                        <kbd>Enter</kbd> để chọn
                                        <kbd>ESC</kbd> để đóng
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* No Results */}
                        {isFocused && searchQuery && searchResults.length === 0 && (
                            <div className={styles.searchDropdown}>
                                <div className={styles.noResults}>
                                    <SearchIcon className={styles.noResultsIcon} />
                                    <p className={styles.noResultsText}>
                                        Không tìm thấy kết quả cho "{searchQuery}"
                                    </p>
                                    <p className={styles.noResultsHint}>
                                        Thử tìm kiếm với từ khóa khác
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Search Modal */}
                {showMobileSearch && (
                    <div className={styles.mobileSearchModal}>
                        <div className={styles.mobileSearchHeader}>
                            <button
                                className={styles.mobileSearchBack}
                                onClick={() => {
                                    setShowMobileSearch(false);
                                    setSearchQuery('');
                                    setSearchResults([]);
                                }}
                                aria-label="Close search"
                            >
                                ←
                            </button>
                            <div className={styles.mobileSearchInputWrapper}>
                                <SearchIcon className={styles.mobileSearchIcon} />
                                <input
                                    ref={mobileInputRef}
                                    type="text"
                                    placeholder="Tìm kiếm..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className={styles.mobileSearchInput}
                                    autoComplete="off"
                                />
                                {searchQuery && (
                                    <button
                                        className={styles.mobileSearchClear}
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSearchResults([]);
                                            mobileInputRef.current?.focus();
                                        }}
                                        aria-label="Clear"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className={styles.mobileSearchContent}>
                            {searchQuery && searchResults.length > 0 && (
                                <div className={styles.mobileSearchResults}>
                                    <div className={styles.mobileResultsHeader}>
                                        {searchResults.length} kết quả
                                    </div>
                                    {searchResults.map((result, index) => (
                                        <Link
                                            key={result.href}
                                            href={result.href}
                                            className={styles.mobileResultItem}
                                            onClick={() => {
                                                setShowMobileSearch(false);
                                                setSearchQuery('');
                                                setSearchResults([]);
                                            }}
                                        >
                                            <div className={styles.mobileResultContent}>
                                                <span className={styles.mobileResultTitle}>
                                                    {result.title}
                                                </span>
                                                <span className={styles.mobileResultCategory}>
                                                    {result.category}
                                                </span>
                                            </div>
                                            <span className={styles.mobileResultArrow}>→</span>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {searchQuery && searchResults.length === 0 && (
                                <div className={styles.mobileNoResults}>
                                    <SearchIcon className={styles.mobileNoResultsIcon} />
                                    <p className={styles.mobileNoResultsText}>
                                        Không tìm thấy kết quả cho &quot;{searchQuery}&quot;
                                    </p>
                                    <p className={styles.mobileNoResultsHint}>
                                        Thử tìm kiếm với từ khóa khác
                                    </p>
                                </div>
                            )}

                            {!searchQuery && (
                                <div className={styles.mobileSearchEmpty}>
                                    <SearchIcon className={styles.mobileEmptyIcon} />
                                    <p className={styles.mobileEmptyText}>
                                        Tìm kiếm tài liệu hướng dẫn
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className={styles.headerRight}>
                    <div className={styles.copyWrapper} ref={copyMenuRef}>
                        <button
                            className={styles.copyButton}
                            onClick={() => setShowCopyMenu(!showCopyMenu)}
                        >
                            <CopyIcon className={styles.copyIcon} />
                            <span>Copy</span>
                            <ChevronDownIcon className={styles.chevronIcon} />
                        </button>

                        {showCopyMenu && (
                            <div className={styles.copyDropdown}>
                                <button
                                    className={styles.dropdownItem}
                                    onClick={handleCopyPage}
                                >
                                    <CopyIcon className={styles.dropdownIcon} />
                                    <div className={styles.dropdownContent}>
                                        <span className={styles.dropdownTitle}>Copy page</span>
                                        <span className={styles.dropdownDesc}>
                                            Copy page as Markdown for LLMs
                                        </span>
                                    </div>
                                </button>

                                <button className={styles.dropdownItem}>
                                    <span className={styles.dropdownIcon}>📝</span>
                                    <div className={styles.dropdownContent}>
                                        <span className={styles.dropdownTitle}>View as Markdown</span>
                                        <span className={styles.dropdownDesc}>
                                            View this page as plain text
                                        </span>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>

                    <Link href="/" className={styles.backButton}>
                        Về trang chủ
                    </Link>
                </div>
            </div>
        </header>
    );
}
