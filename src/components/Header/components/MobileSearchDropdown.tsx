'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames/bind';
import styles from '../Header.module.scss';
import { SearchIcon, CloseIcon, ClockIcon, FlameIcon } from '@/components/Icons';

const cx = classNames.bind(styles);

interface MobileSearchDropdownProps {
    isSearchOpen: boolean;
    isMobile: boolean;
    closeSearch: () => void;
    clearSearch: () => void;
    searchValue: string;
    setSearchValue: (value: string) => void;
    handleSearch: (query?: string) => void;
    handleKeyDown: (e: React.KeyboardEvent) => void;
    searchResults: any[];
    recentSearches: string[];
    setRecentSearches: (searches: string[]) => void;
    searchDropdownRef: React.RefObject<HTMLDivElement>;
}

const MobileSearchDropdown: React.FC<MobileSearchDropdownProps> = ({
    isSearchOpen,
    isMobile,
    closeSearch,
    clearSearch,
    searchValue,
    setSearchValue,
    handleSearch,
    handleKeyDown,
    searchResults,
    recentSearches,
    setRecentSearches,
    searchDropdownRef,
}) => {
    if (!isSearchOpen) return null;

    return (
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
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        className={cx('search-dropdown-input')}
                        data-search-input="true"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        aria-label="Tìm kiếm sản phẩm"
                    />
                    {searchValue && (
                        <button
                            className={cx('search-clear-button')}
                            onClick={clearSearch}
                            aria-label="Xóa tìm kiếm"
                            type="button"
                        >
                            <CloseIcon size={18} />
                        </button>
                    )}
                    <button
                        className={cx('search-submit-button')}
                        onClick={() => handleSearch()}
                        aria-label="Tìm kiếm"
                        type="button"
                    >
                        <SearchIcon size={22} />
                    </button>
                </div>

                {/* Search Results */}
                <div className={cx('search-dropdown-content')}>
                    {searchResults.length > 0 ? (
                        <div className={cx('search-results-section')}>
                            <h3>
                                <SearchIcon />
                                <span>Kết quả tìm kiếm</span>
                            </h3>
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
                                                        width={70}
                                                        height={70}
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
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
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
                                        {recentSearches.slice(0, isMobile ? 4 : 6).map((query, index) => (
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
                            
                            {/* Popular Searches */}
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
                                        .slice(0, isMobile ? 6 : 8)
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
                    ) : (
                        <div className={cx('search-no-results')}>
                            <p>Không tìm thấy kết quả cho "{searchValue}"</p>
                            <p className={cx('search-no-results-hint')}>Thử tìm kiếm với từ khóa khác</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MobileSearchDropdown;
