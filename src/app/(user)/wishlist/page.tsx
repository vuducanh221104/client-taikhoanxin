'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/redux/store';
import ProductCard from '@/components/ProductCard';
import { getWishlistByUserId, removeWishlistItemById, WishlistItem } from '@/services/wishlistService';
import { addToCart } from '@/redux/cartSlice';
import { removeWishlistItemById as removeWishlistItemByIdAction, initializeWishlist } from '@/redux/wishlistSlice';
import { FeaturedProduct } from '@/components/FeaturedProducts';
import { useToast } from '@/hooks/useToast';
import classNames from 'classnames/bind';
import styles from './page.module.scss';
import { HeartIcon, TrashIcon, CloseIcon, RotateCcwIcon, ChevronDownIcon, FilterIcon, CalendarIcon } from '@/components/Icons';
import { EmptyState } from '@/components/EmptyState';

const cx = classNames.bind(styles);

const statusOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'in-stock', label: 'Còn hàng' },
    { value: 'out-of-stock', label: 'Hết hàng' },
];

const quickPriceFilters = [
    { label: 'Dưới 100k', from: 0, to: 100000 },
    { label: '100k - 500k', from: 100000, to: 500000 },
    { label: '500k - 1 triệu', from: 500000, to: 1000000 },
    { label: '1 triệu - 5 triệu', from: 1000000, to: 5000000 },
    { label: 'Trên 5 triệu', from: 5000000, to: Infinity },
];

const quickDateFilters = [
    { label: 'Hôm nay', days: 0 },
    { label: '7 ngày qua', days: 7 },
    { label: '30 ngày qua', days: 30 },
    { label: 'Tháng này', days: -1 },
    { label: 'Tháng trước', days: -2 },
];

export default function WishlistPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const currentUser = useSelector((state: RootState) => state.auth.login.currentUser);
    const wishlist = useSelector((state: RootState) => state.wishlist);
    const { showSuccess } = useToast();
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [filters, setFilters] = useState({
        searchQuery: '',
        status: 'all' as 'all' | 'in-stock' | 'out-of-stock',
        priceFrom: '',
        priceTo: '',
        dateFrom: '',
        dateTo: '',
    });
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const statusDropdownRef = useRef<HTMLDivElement>(null);
    const [priceError, setPriceError] = useState('');

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!currentUser) {
            router.push('/auth/login');
            return;
        }

        // Initialize Redux wishlist if needed
        if (!wishlist.userId || wishlist.userId !== currentUser._id) {
            dispatch(initializeWishlist(currentUser._id));
        }
    }, [currentUser, router, wishlist.userId, dispatch]);

    // Sync local state with Redux store whenever Redux state changes
    useEffect(() => {
        if (currentUser && wishlist.userId === currentUser._id) {
            setWishlistItems(wishlist.items);
        }
    }, [wishlist.items, wishlist.userId, currentUser]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
                setIsStatusDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Helper function to format date to YYYY-MM-DD
    const formatDateForInput = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Helper function to get date range for quick filters
    const getQuickDateRange = (days: number): { from: string; to: string } => {
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        if (days === -1) {
            // Current month
            const from = new Date(today.getFullYear(), today.getMonth(), 1);
            return { from: formatDateForInput(from), to: formatDateForInput(today) };
        } else if (days === -2) {
            // Last month
            const from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const to = new Date(today.getFullYear(), today.getMonth(), 0);
            return { from: formatDateForInput(from), to: formatDateForInput(to) };
        } else {
            // Days ago
            const from = new Date(today);
            from.setDate(today.getDate() - days);
            from.setHours(0, 0, 0, 0);
            return { from: formatDateForInput(from), to: formatDateForInput(today) };
        }
    };

    const handleQuickDateFilter = (days: number) => {
        const { from, to } = getQuickDateRange(days);
        setFilters({ ...filters, dateFrom: from, dateTo: to });
    };

    // Format price input (remove non-numeric, add thousand separator)
    const formatPriceInput = (value: string): string => {
        const digits = value.replace(/[^\d]/g, '');
        if (digits === '') return '';
        const num = parseInt(digits);
        if (isNaN(num) || num < 0) return '';
        return num.toLocaleString('vi-VN');
    };

    // Parse formatted price to number
    const parsePriceInput = (value: string): number => {
        return parseInt(value.replace(/[^\d]/g, '')) || 0;
    };

    // Validate price range
    useEffect(() => {
        const fromPrice = filters.priceFrom ? parsePriceInput(filters.priceFrom) : null;
        const toPrice = filters.priceTo ? parsePriceInput(filters.priceTo) : null;

        if (fromPrice !== null && toPrice !== null && fromPrice > toPrice) {
            setPriceError('Giá từ không được lớn hơn giá đến');
        } else {
            setPriceError('');
        }
    }, [filters.priceFrom, filters.priceTo]);

    const handleClearPrice = (field: 'priceFrom' | 'priceTo') => {
        setFilters({ ...filters, [field]: '' });
        setPriceError('');
    };

    const handleQuickPrice = (from: number, to: number) => {
        setFilters({
            ...filters,
            priceFrom: from === 0 ? '' : formatPriceInput(from.toString()),
            priceTo: to === Infinity ? '' : formatPriceInput(to.toString()),
        });
        setPriceError('');
    };

    const handleResetFilters = () => {
        setFilters({
            searchQuery: '',
            status: 'all',
            priceFrom: '',
            priceTo: '',
            dateFrom: '',
            dateTo: '',
        });
        setPriceError('');
    };

    // Check if filters are active
    const hasActiveFilters = filters.searchQuery !== '' ||
        filters.status !== 'all' ||
        filters.priceFrom !== '' ||
        filters.priceTo !== '' ||
        filters.dateFrom !== '' ||
        filters.dateTo !== '';

    // Filter wishlist items
    const filteredItems = useMemo(() => {
        let filtered = [...wishlistItems];

        // Filter by search query
        if (filters.searchQuery.trim()) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                item.productName.toLowerCase().includes(query)
            );
        }

        // Filter by status
        if (filters.status !== 'all') {
            filtered = filtered.filter(item => item.status === filters.status);
        }

        // Filter by price range
        const fromPrice = filters.priceFrom ? parsePriceInput(filters.priceFrom) : null;
        const toPrice = filters.priceTo ? parsePriceInput(filters.priceTo) : null;

        if (fromPrice !== null) {
            filtered = filtered.filter(item => item.price >= fromPrice);
        }
        if (toPrice !== null) {
            filtered = filtered.filter(item => item.price <= toPrice);
        }

        // Filter by date range
        if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom);
            fromDate.setHours(0, 0, 0, 0);
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.addedAt);
                itemDate.setHours(0, 0, 0, 0);
                return itemDate >= fromDate;
            });
        }
        if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            toDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.addedAt);
                return itemDate <= toDate;
            });
        }

        return filtered;
    }, [wishlistItems, filters]);

    const handleAddToCart = (item: WishlistItem) => {
        const product: FeaturedProduct = {
            id: item.productId,
            productName: item.productName,
            price: item.price,
            oldPrice: item.oldPrice,
            discount: item.discount,
            rating: item.rating,
            reviewCount: item.reviewCount,
            status: item.status,
            imageSrc: item.imageSrc,
            imageAlt: item.imageAlt,
            href: item.href,
        };

        dispatch(addToCart({
            id: item.productId,
            productName: item.productName,
            price: item.price,
            oldPrice: item.oldPrice,
            imageSrc: item.imageSrc || '',
            imageAlt: item.imageAlt || item.productName,
            href: item.href || `/products/${item.productId}`,
        }));
        showSuccess(`Đã thêm "${item.productName}" vào giỏ hàng`);
    };

    const handleRemoveFromWishlist = (itemId: string) => {
        if (!currentUser) return;

        const item = wishlistItems.find(i => i.id === itemId);
        const productName = item?.productName || 'Sản phẩm';

        // Remove from service (localStorage) and update Redux store
        const removed = removeWishlistItemById(currentUser._id, itemId);
        if (removed) {
            // Update Redux store - this will trigger useEffect to sync local state
            dispatch(removeWishlistItemByIdAction({
                userId: currentUser._id,
                itemId: itemId,
            }));
            showSuccess(`Đã xóa "${productName}" khỏi yêu thích`);
        }
    };

    if (!currentUser) {
        return null;
    }

    return (
        <div className={cx('wishlist-page')}>
            <div className={cx('wishlist-container')}>
                {/* Header */}
                <div className={cx('wishlist-header')}>
                    <div className={cx('header-content')}>
                        <h1 className={cx('wishlist-title')}>
                            <HeartIcon size={28} className={cx('title-icon')} />
                            Sản phẩm yêu thích
                        </h1>
                        <p className={cx('wishlist-subtitle')}>
                            Danh sách sản phẩm bạn đã thêm vào yêu thích
                        </p>
                    </div>
                </div>

                {/* Filters */}
                {wishlistItems.length > 0 && (
                    <div className={cx('filter-section')}>
                        {hasActiveFilters && (
                            <div className={cx('reset-filters-wrapper')}>
                                <button
                                    className={cx('reset-filters-button')}
                                    onClick={handleResetFilters}
                                    type="button"
                                >
                                    <RotateCcwIcon size={16} />
                                    <span>Khôi phục bộ lọc</span>
                                </button>
                            </div>
                        )}

                        <div className={cx('filter-form')}>
                            {/* Basic Filters Row */}
                            <div className={cx('filter-row', 'basic-filters-row')}>
                                <div className={cx('filter-section-title')}>
                                    <FilterIcon size={20} />
                                    <span>Bộ lọc cơ bản</span>
                                </div>
                                
                                <div className={cx('basic-filters-group')}>
                                    {/* Status Dropdown */}
                                    <div className={cx('dropdown-wrapper')} ref={statusDropdownRef}>
                                        <button
                                            type="button"
                                            className={cx('dropdown-button')}
                                            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                                        >
                                            <span>
                                                {statusOptions.find(opt => opt.value === filters.status)?.label || 'Tất cả'}
                                            </span>
                                            <ChevronDownIcon 
                                                size={16} 
                                                className={cx('dropdown-icon', { 'is-open': isStatusDropdownOpen })}
                                            />
                                        </button>
                                        {isStatusDropdownOpen && (
                                            <div className={cx('dropdown-menu')}>
                                                {statusOptions.map((option) => (
                                                    <button
                                                        key={option.value}
                                                        type="button"
                                                        className={cx('dropdown-item', {
                                                            'is-selected': filters.status === option.value,
                                                        })}
                                                        onClick={() => {
                                                            setFilters({ ...filters, status: option.value as 'all' | 'in-stock' | 'out-of-stock' });
                                                            setIsStatusDropdownOpen(false);
                                                        }}
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Search Input */}
                                    <div className={cx('search-input-wrapper')}>
                                        <input
                                            type="text"
                                            className={cx('search-input')}
                                            placeholder="Tìm kiếm sản phẩm..."
                                            value={filters.searchQuery}
                                            onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                                        />
                                        {filters.searchQuery && (
                                            <button
                                                type="button"
                                                className={cx('clear-search-button')}
                                                onClick={() => setFilters({ ...filters, searchQuery: '' })}
                                                aria-label="Xóa tìm kiếm"
                                            >
                                                <CloseIcon size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Price Range Row */}
                            <div className={cx('filter-row', 'price-row')}>
                                <div className={cx('filter-section-title')}>
                                    <span>Khoảng giá</span>
                                </div>
                                
                                <div className={cx('price-inputs-group')}>
                                    <div className={cx('price-input-wrapper')}>
                                        <input
                                            type="text"
                                            className={cx('price-input', { 'has-error': priceError })}
                                            placeholder="Từ"
                                            value={filters.priceFrom}
                                            onChange={(e) => {
                                                const formatted = formatPriceInput(e.target.value);
                                                setFilters({ ...filters, priceFrom: formatted });
                                            }}
                                        />
                                        {filters.priceFrom && (
                                            <button
                                                type="button"
                                                className={cx('price-clear-button')}
                                                onClick={() => handleClearPrice('priceFrom')}
                                                aria-label="Xóa giá từ"
                                            >
                                                <CloseIcon size={14} />
                                            </button>
                                        )}
                                        <span className={cx('price-suffix')}>₫</span>
                                    </div>
                                    
                                    <span className={cx('price-separator')}>-</span>
                                    
                                    <div className={cx('price-input-wrapper')}>
                                        <input
                                            type="text"
                                            className={cx('price-input', { 'has-error': priceError })}
                                            placeholder="Đến"
                                            value={filters.priceTo}
                                            onChange={(e) => {
                                                const formatted = formatPriceInput(e.target.value);
                                                setFilters({ ...filters, priceTo: formatted });
                                            }}
                                        />
                                        {filters.priceTo && (
                                            <button
                                                type="button"
                                                className={cx('price-clear-button')}
                                                onClick={() => handleClearPrice('priceTo')}
                                                aria-label="Xóa giá đến"
                                            >
                                                <CloseIcon size={14} />
                                            </button>
                                        )}
                                        <span className={cx('price-suffix')}>₫</span>
                                    </div>
                                </div>

                                {priceError && (
                                    <div className={cx('price-error-wrapper')}>
                                        <span className={cx('price-error')}>{priceError}</span>
                                    </div>
                                )}

                                <div className={cx('quick-price-buttons')}>
                                    {quickPriceFilters.map((filter) => (
                                        <button
                                            key={filter.label}
                                            type="button"
                                            className={cx('quick-price-button')}
                                            onClick={() => handleQuickPrice(filter.from, filter.to)}
                                        >
                                            {filter.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Date Range Row */}
                            <div className={cx('filter-row', 'date-row')}>
                                <div className={cx('filter-section-title')}>
                                    <CalendarIcon size={20} />
                                    <span>Ngày thêm vào</span>
                                </div>
                                
                                <div className={cx('date-inputs-group')}>
                                    <div className={cx('date-input-wrapper')}>
                                        <input
                                            type="date"
                                            className={cx('date-input')}
                                            value={filters.dateFrom}
                                            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                                        />
                                        {filters.dateFrom && (
                                            <button
                                                type="button"
                                                className={cx('date-clear-button')}
                                                onClick={() => setFilters({ ...filters, dateFrom: '' })}
                                                aria-label="Xóa ngày từ"
                                            >
                                                <CloseIcon size={14} />
                                            </button>
                                        )}
                                    </div>
                                    
                                    <span className={cx('date-separator')}>-</span>
                                    
                                    <div className={cx('date-input-wrapper')}>
                                        <input
                                            type="date"
                                            className={cx('date-input')}
                                            value={filters.dateTo}
                                            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                                        />
                                        {filters.dateTo && (
                                            <button
                                                type="button"
                                                className={cx('date-clear-button')}
                                                onClick={() => setFilters({ ...filters, dateTo: '' })}
                                                aria-label="Xóa ngày đến"
                                            >
                                                <CloseIcon size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className={cx('quick-date-buttons')}>
                                    {quickDateFilters.map((filter) => (
                                        <button
                                            key={filter.label}
                                            type="button"
                                            className={cx('quick-date-button')}
                                            onClick={() => handleQuickDateFilter(filter.days)}
                                        >
                                            {filter.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Wishlist Content */}
                {filteredItems.length > 0 ? (
                    <div className={cx('wishlist-grid')}>
                        {filteredItems.map((item) => (
                            <div key={item.id} className={cx('wishlist-item-wrapper')}>
                                <ProductCard
                                    id={item.productId}
                                    productName={item.productName}
                                    price={item.price}
                                    oldPrice={item.oldPrice}
                                    discount={item.discount}
                                    rating={item.rating}
                                    reviewCount={item.reviewCount}
                                    status={item.status}
                                    href={item.href}
                                    imageSrc={item.imageSrc}
                                    imageAlt={item.imageAlt}
                                    isFavorite={true}
                                    onAddToCart={() => handleAddToCart(item)}
                                    onToggleFavorite={() => handleRemoveFromWishlist(item.id)}
                                />
                                <button
                                    className={cx('remove-button')}
                                    onClick={() => handleRemoveFromWishlist(item.id)}
                                    aria-label="Xóa khỏi yêu thích"
                                    type="button"
                                >
                                    <TrashIcon size={18} />
                                    <span>Xóa</span>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={cx('empty-state-wrapper')}>
                        <EmptyState
                            icon={<HeartIcon size={80} />}
                            title={wishlistItems.length === 0 ? 'Chưa có sản phẩm yêu thích' : 'Không tìm thấy sản phẩm'}
                            description={
                                wishlistItems.length === 0
                                    ? 'Hãy thêm các sản phẩm bạn yêu thích vào danh sách này để dễ dàng tìm lại sau.'
                                    : 'Thử thay đổi bộ lọc để tìm sản phẩm khác.'
                            }
                            action={
                                wishlistItems.length === 0
                                    ? {
                                          label: 'Khám phá sản phẩm',
                                          href: '/products',
                                      }
                                    : {
                                          label: 'Xóa bộ lọc',
                                          onClick: handleResetFilters,
                                          variant: 'secondary',
                                      }
                            }
                            size="medium"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

