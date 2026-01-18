'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import classNames from 'classnames/bind';
import styles from './FilterBar.module.scss';
import { ChevronDownIcon, ChevronUpIcon, FilterIcon, RotateCcwIcon } from '@/components/Icons';

const cx = classNames.bind(styles);

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

export interface FilterOption {
    value: string;
    label: string;
}

export interface QuickPriceFilter {
    label: string;
    from: number;
    to: number;
}

export interface FilterValues {
    category: string;
    genre: string;
    status: string;
    priceFrom: string;
    priceTo: string;
    sortBy: SortOption;
}

export interface FilterBarProps {
    categories: FilterOption[];
    genres: FilterOption[];
    statusOptions: FilterOption[];
    sortOptions: FilterOption[];
    quickPriceFilters: QuickPriceFilter[];
    defaultCategory?: string;
    layout?: 'flex' | 'grid';
    onFilterChange: (filters: FilterValues) => void;
    applyOnButtonClick?: boolean; // Nếu true, chỉ apply filter khi bấm nút "Lọc"
}

const FilterBar: React.FC<FilterBarProps> = React.memo(({
    categories,
    genres,
    statusOptions,
    sortOptions,
    quickPriceFilters,
    defaultCategory = 'all',
    layout = 'flex',
    onFilterChange,
    applyOnButtonClick = false,
}) => {
    const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory);
    const [selectedGenre, setSelectedGenre] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [priceFrom, setPriceFrom] = useState<string>('');
    const [priceTo, setPriceTo] = useState<string>('');
    const [sortBy, setSortBy] = useState<SortOption>('default');
    const [priceError, setPriceError] = useState<string>('');
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isGenreOpen, setIsGenreOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);

    const categoryRef = useRef<HTMLDivElement>(null);
    const genreRef = useRef<HTMLDivElement>(null);
    const statusRef = useRef<HTMLDivElement>(null);
    const sortRef = useRef<HTMLDivElement>(null);
    const prevDefaultCategoryRef = useRef<string>(defaultCategory);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setIsCategoryOpen(false);
            }
            if (genreRef.current && !genreRef.current.contains(event.target as Node)) {
                setIsGenreOpen(false);
            }
            if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
                setIsStatusOpen(false);
            }
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setIsSortOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Sync category when defaultCategory prop changes (only when prop actually changes from parent)
    // This should NOT interfere with user's manual category selection
    useEffect(() => {
        // Only update if defaultCategory prop actually changed from parent
        // This prevents resetting user's selection when they manually choose a category
        if (prevDefaultCategoryRef.current !== defaultCategory) {
            prevDefaultCategoryRef.current = defaultCategory;
            setSelectedCategory(defaultCategory);
        }
    }, [defaultCategory]);

    // Validate price range
    useEffect(() => {
        const fromPrice = priceFrom ? parseInt(priceFrom.replace(/[^\d]/g, '')) : null;
        const toPrice = priceTo ? parseInt(priceTo.replace(/[^\d]/g, '')) : null;

        if (fromPrice !== null && toPrice !== null && fromPrice > toPrice) {
            setPriceError('Giá từ không được lớn hơn giá đến');
        } else {
            setPriceError('');
        }
    }, [priceFrom, priceTo]);

    // Use ref to store the latest onFilterChange callback to avoid dependency issues
    const onFilterChangeRef = useRef(onFilterChange);
    const isInitialMount = useRef(true);
    const prevFiltersRef = useRef<string>('');
    
    useEffect(() => {
        onFilterChangeRef.current = onFilterChange;
    }, [onFilterChange]);

    // Apply filters function
    const applyFilters = useCallback(() => {
        const filterValues = {
            category: selectedCategory,
            genre: selectedGenre,
            status: selectedStatus,
            priceFrom,
            priceTo,
            sortBy,
        };
        onFilterChangeRef.current(filterValues);
    }, [selectedCategory, selectedGenre, selectedStatus, priceFrom, priceTo, sortBy]);

    // Notify parent of filter changes - only when filters actually change
    // Nếu applyOnButtonClick = true, chỉ apply khi bấm nút "Lọc"
    useEffect(() => {
        // Nếu applyOnButtonClick = true, không auto-trigger filter
        if (applyOnButtonClick) {
            // Chỉ apply filter lần đầu khi mount
            if (isInitialMount.current) {
                isInitialMount.current = false;
                requestAnimationFrame(() => {
                    applyFilters();
                });
            }
            return;
        }

        // Logic cũ: auto-trigger khi filter thay đổi
        const filterValues = {
            category: selectedCategory,
            genre: selectedGenre,
            status: selectedStatus,
            priceFrom,
            priceTo,
            sortBy,
        };

        // Create a stable string representation of filters for comparison
        const filtersKey = JSON.stringify(filterValues);
        
        // Skip if filters haven't actually changed (prevents infinite loops)
        if (prevFiltersRef.current === filtersKey) {
            return;
        }
        
        // Update the previous filters reference
        prevFiltersRef.current = filtersKey;

        // On initial mount, defer the call to break synchronous update cycle
        if (isInitialMount.current) {
            isInitialMount.current = false;
            // Use requestAnimationFrame to defer the call after the initial render
            // This prevents the callback from triggering during the initial render cycle
            requestAnimationFrame(() => {
                onFilterChangeRef.current(filterValues);
            });
            return;
        }

        // For subsequent changes (user interactions), call immediately
        onFilterChangeRef.current(filterValues);
    }, [selectedCategory, selectedGenre, selectedStatus, priceFrom, priceTo, sortBy, applyOnButtonClick, applyFilters]);

    const handleResetFilters = useCallback(() => {
        setSelectedCategory(defaultCategory);
        setSelectedGenre('all');
        setSelectedStatus('all');
        setPriceFrom('');
        setPriceTo('');
        setSortBy('default');
        setPriceError('');
    }, [defaultCategory]);

    const handleQuickPriceFilter = useCallback((from: number, to: number) => {
        setPriceFrom(from === 0 ? '' : from.toLocaleString('vi-VN'));
        setPriceTo(to === Infinity ? '' : to.toLocaleString('vi-VN'));
        setPriceError('');
    }, []);

    const formatPriceInput = (value: string): string => {
        const digits = value.replace(/[^\d]/g, '');
        if (digits === '') return '';
        return parseInt(digits).toLocaleString('vi-VN');
    };

    const handlePriceFromChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPriceInput(e.target.value);
        setPriceFrom(formatted);
        if (priceError) {
            setPriceError('');
        }
    }, [priceError]);

    const handlePriceToChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPriceInput(e.target.value);
        setPriceTo(formatted);
        if (priceError) {
            setPriceError('');
        }
    }, [priceError]);

    const hasActiveFilters = useMemo(() => {
        return selectedCategory !== defaultCategory || 
               selectedGenre !== 'all' || 
               selectedStatus !== 'all' ||
               priceFrom !== '' || 
               priceTo !== '' || 
               sortBy !== 'default';
    }, [selectedCategory, defaultCategory, selectedGenre, selectedStatus, priceFrom, priceTo, sortBy]);

    const toggleFilterExpanded = useCallback(() => {
        setIsFilterExpanded(prev => !prev);
    }, []);

    return (
        <div className={cx('filter-bar', { 'is-expanded': isFilterExpanded })}>
            {/* Mobile Toggle Button */}
            <button 
                className={cx('filter-toggle-btn')}
                onClick={toggleFilterExpanded}
                type="button"
                aria-expanded={isFilterExpanded}
                aria-controls="filter-content"
                aria-label={isFilterExpanded ? 'Thu gọn bộ lọc' : 'Mở rộng bộ lọc'}
            >
                <FilterIcon size={18} aria-hidden="true" />
                <span>Bộ lọc</span>
                {hasActiveFilters && <span className={cx('filter-badge')} aria-label="Có bộ lọc đang áp dụng" />}
                {isFilterExpanded ? (
                    <ChevronUpIcon size={18} className={cx('toggle-icon')} aria-hidden="true" />
                ) : (
                    <ChevronDownIcon size={18} className={cx('toggle-icon')} aria-hidden="true" />
                )}
            </button>

            {/* Filter Content */}
            <div 
                id="filter-content"
                className={cx('filter-content', { 'is-expanded': isFilterExpanded })}
            >
                {/* Reset Filters Link - Above filter row */}
                {hasActiveFilters && (
                    <div className={cx('reset-filters-wrapper')}>
                        <button 
                            className={cx('reset-filters')} 
                            onClick={handleResetFilters} 
                            type="button"
                            aria-label="Khôi phục bộ lọc về mặc định"
                        >
                            <RotateCcwIcon size={16} />
                            <span>Khôi phục bộ lọc</span>
                        </button>
                    </div>
                )}

                <div className={cx('filter-row', { 'is-grid': layout === 'grid' })}>
                {/* Category Dropdown */}
                <div className={cx('filter-item', { 'is-open': isCategoryOpen })} ref={categoryRef}>
                    <label className={cx('filter-label')}>Danh mục</label>
                    <div className={cx('dropdown-wrapper')}>
                        <button
                            className={cx('dropdown-button')}
                            onClick={() => {
                                setIsCategoryOpen(!isCategoryOpen);
                                setIsGenreOpen(false);
                                setIsStatusOpen(false);
                                setIsSortOpen(false);
                            }}
                            type="button"
                            aria-label="Chọn danh mục sản phẩm"
                            aria-expanded={isCategoryOpen}
                            aria-haspopup="listbox"
                        >
                            <span>{categories.find(c => c.value === selectedCategory)?.label || 'Tất cả'}</span>
                            <ChevronDownIcon size={16} className={cx('dropdown-icon', { 'is-open': isCategoryOpen })} aria-hidden="true" />
                        </button>
                        {isCategoryOpen && (
                            <div className={cx('dropdown-menu')} role="listbox" aria-label="Danh mục sản phẩm">
                                {categories.map((category) => (
                                    <button
                                        key={category.value}
                                        className={cx('dropdown-item', { 'is-active': selectedCategory === category.value })}
                                        onClick={() => {
                                            setSelectedCategory(category.value);
                                            setIsCategoryOpen(false);
                                        }}
                                        type="button"
                                        role="option"
                                        aria-selected={selectedCategory === category.value}
                                    >
                                        {category.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Genre Dropdown - Chỉ hiển thị nếu có genres */}
                {genres && genres.length > 0 && (
                <div className={cx('filter-item', { 'is-open': isGenreOpen })} ref={genreRef}>
                    <label className={cx('filter-label')}>Thể loại</label>
                    <div className={cx('dropdown-wrapper')}>
                        <button
                            className={cx('dropdown-button')}
                            onClick={() => {
                                setIsGenreOpen(!isGenreOpen);
                                setIsCategoryOpen(false);
                                setIsStatusOpen(false);
                                setIsSortOpen(false);
                            }}
                            type="button"
                            aria-label="Chọn thể loại sản phẩm"
                            aria-expanded={isGenreOpen}
                            aria-haspopup="listbox"
                        >
                            <span>{genres.find(g => g.value === selectedGenre)?.label || 'Tất cả'}</span>
                            <ChevronDownIcon size={16} className={cx('dropdown-icon', { 'is-open': isGenreOpen })} aria-hidden="true" />
                        </button>
                        {isGenreOpen && (
                            <div className={cx('dropdown-menu')} role="listbox" aria-label="Thể loại sản phẩm">
                                {genres.map((genre) => (
                                    <button
                                        key={genre.value}
                                        className={cx('dropdown-item', { 'is-active': selectedGenre === genre.value })}
                                        onClick={() => {
                                            setSelectedGenre(genre.value);
                                            setIsGenreOpen(false);
                                        }}
                                        type="button"
                                        role="option"
                                        aria-selected={selectedGenre === genre.value}
                                    >
                                        {genre.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                )}

                {/* Status Dropdown */}
                <div className={cx('filter-item', { 'is-open': isStatusOpen })} ref={statusRef}>
                    <label className={cx('filter-label')}>Trạng thái</label>
                    <div className={cx('dropdown-wrapper')}>
                        <button
                            className={cx('dropdown-button')}
                            onClick={() => {
                                setIsStatusOpen(!isStatusOpen);
                                setIsCategoryOpen(false);
                                setIsGenreOpen(false);
                                setIsSortOpen(false);
                            }}
                            type="button"
                            aria-label="Chọn trạng thái sản phẩm"
                            aria-expanded={isStatusOpen}
                            aria-haspopup="listbox"
                        >
                            <span>{statusOptions.find(s => s.value === selectedStatus)?.label || 'Tất cả'}</span>
                            <ChevronDownIcon size={16} className={cx('dropdown-icon', { 'is-open': isStatusOpen })} aria-hidden="true" />
                        </button>
                        {isStatusOpen && (
                            <div className={cx('dropdown-menu')} role="listbox" aria-label="Trạng thái sản phẩm">
                                {statusOptions.map((status) => (
                                    <button
                                        key={status.value}
                                        className={cx('dropdown-item', { 'is-active': selectedStatus === status.value })}
                                        onClick={() => {
                                            setSelectedStatus(status.value);
                                            setIsStatusOpen(false);
                                        }}
                                        type="button"
                                        role="option"
                                        aria-selected={selectedStatus === status.value}
                                    >
                                        {status.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Price Range */}
                <div className={cx('filter-item', 'price-range')}>
                    <label className={cx('filter-label')}>Mức giá</label>
                    <div className={cx('price-inputs')}>
                        <input
                            type="text"
                            className={cx('price-input', { 'has-error': priceError })}
                            placeholder="Từ"
                            value={priceFrom}
                            onChange={handlePriceFromChange}
                            aria-label="Giá từ (VNĐ)"
                            aria-invalid={!!priceError}
                            aria-describedby={priceError ? 'price-error-message' : undefined}
                        />
                        <span className={cx('price-separator')} aria-hidden="true">-</span>
                        <input
                            type="text"
                            className={cx('price-input', { 'has-error': priceError })}
                            placeholder="Đến"
                            value={priceTo}
                            onChange={handlePriceToChange}
                            aria-label="Giá đến (VNĐ)"
                            aria-invalid={!!priceError}
                            aria-describedby={priceError ? 'price-error-message' : undefined}
                        />
                    </div>
                    {priceError && (
                        <span id="price-error-message" className={cx('price-error')} role="alert">
                            {priceError}
                        </span>
                    )}
                    {/* Quick Price Filters */}
                    <div className={cx('quick-price-filters')}>
                        {quickPriceFilters.map((filter, index) => {
                            const fromPrice = priceFrom ? parseInt(priceFrom.replace(/[^\d]/g, '')) : null;
                            const toPrice = priceTo ? parseInt(priceTo.replace(/[^\d]/g, '')) : null;
                            const isActive = 
                                (filter.from === 0 ? !fromPrice : fromPrice === filter.from) &&
                                (filter.to === Infinity ? !toPrice : toPrice === filter.to);
                            
                            return (
                                <button
                                    key={index}
                                    className={cx('quick-price-button', { 'is-active': isActive })}
                                    onClick={() => handleQuickPriceFilter(filter.from, filter.to)}
                                    type="button"
                                    aria-label={`Lọc giá ${filter.label}`}
                                    aria-pressed={isActive}
                                >
                                    <span>{filter.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Sort Dropdown */}
                <div className={cx('filter-item', 'sort-item', { 'is-open': isSortOpen })} ref={sortRef}>
                    <label className={cx('filter-label')}>Sắp xếp</label>
                    <div className={cx('dropdown-wrapper')}>
                        <button
                            className={cx('dropdown-button')}
                            onClick={() => {
                                setIsSortOpen(!isSortOpen);
                                setIsCategoryOpen(false);
                                setIsGenreOpen(false);
                                setIsStatusOpen(false);
                            }}
                            type="button"
                            aria-label="Sắp xếp sản phẩm"
                            aria-expanded={isSortOpen}
                            aria-haspopup="listbox"
                        >
                            <span>{sortOptions.find(s => s.value === sortBy)?.label || 'Mặc định'}</span>
                            <ChevronDownIcon size={16} className={cx('dropdown-icon', { 'is-open': isSortOpen })} aria-hidden="true" />
                        </button>
                        {isSortOpen && (
                            <div className={cx('dropdown-menu')} role="listbox" aria-label="Tùy chọn sắp xếp">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        className={cx('dropdown-item', { 'is-active': sortBy === option.value })}
                                        onClick={() => {
                                            setSortBy(option.value as SortOption);
                                            setIsSortOpen(false);
                                        }}
                                        type="button"
                                        role="option"
                                        aria-selected={sortBy === option.value}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Filter Button */}
                <div className={cx('filter-item', 'filter-button-wrapper')}>
                    <button 
                        className={cx('filter-button')} 
                        type="button"
                        onClick={applyFilters}
                        aria-label="Áp dụng bộ lọc"
                    >
                        <FilterIcon size={18} aria-hidden="true" />
                        <span>Lọc</span>
                    </button>
                </div>
                </div>
            </div>
        </div>
    );
});

FilterBar.displayName = 'FilterBar';

export default FilterBar;

