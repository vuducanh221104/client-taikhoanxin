'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames/bind';
import styles from '../Header.module.scss';
import { SearchIcon, ClockIcon, FlameIcon } from '@/components/Icons';

const cx = classNames.bind(styles);

interface SearchBarProps {
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
    trendingSearchTitle: string;
    trendingSearches: string[];
    defaultSearchValue: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
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
    trendingSearchTitle,
    trendingSearches,
    defaultSearchValue,
}) => {
    const popularSearches = trendingSearches?.length ? trendingSearches : [];
    const placeholderText = defaultSearchValue || 'Tìm kiếm...';

    const hasSearchResults = searchResults.length > 0;
    const shouldShowSuggestions =
        isSearchBarFocused &&
        (hasSearchResults ||
            (searchValue.trim() === '' && (recentSearches.length > 0 || popularSearches.length > 0)));

    return (
        <div className={cx('search-section')}>
            <div className={cx('search-input-wrapper')}>
                <input
                    ref={searchBarInputRef}
                    type="text"
                    placeholder={placeholderText}
                    className={cx('search-input')}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsSearchBarFocused(true)}
                    onBlur={(e) => {
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
            {shouldShowSuggestions && (
                <div 
                    ref={searchBarDropdownRef}
                    className={cx('search-bar-dropdown')}
                    onMouseDown={(e) => e.preventDefault()}
                >
                    {hasSearchResults ? (
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
                            
                            {/* Popular Searches */}
                            {popularSearches.length > 0 && (
                                <div className={cx('search-popular-section')}>
                                    <h3 className={cx('search-section-title')}>
                                        <FlameIcon className={cx('search-section-icon')} />
                                        <span>{trendingSearchTitle}</span>
                                    </h3>
                                    <ul className={cx('search-popular-list')}>
                                        {popularSearches
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
                            )}
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
