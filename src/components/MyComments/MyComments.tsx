'use client';

import React, { useState, useMemo } from 'react';
import classNames from 'classnames/bind';
import styles from './MyComments.module.scss';
import { 
    getUserComments, 
    filterUserComments, 
    formatCommentDateTime,
    UserComment 
} from '@/services/userCommentService';
import { FilterIcon, CalendarIcon, ChevronDownIcon, RotateCcwIcon } from '@/components/Icons';

const cx = classNames.bind(styles);

interface MyCommentsProps {
    userId: string;
}

const commentTypes = [
    { value: 'all', label: 'Tất cả' },
    { value: 'comment', label: 'Bình luận' },
    { value: 'reply', label: 'Trả lời' },
];

const quickDateFilters = [
    { label: 'Hôm nay', days: 0 },
    { label: '7 ngày qua', days: 7 },
    { label: '30 ngày qua', days: 30 },
    { label: 'Tháng này', days: -1 },
    { label: 'Tháng trước', days: -2 },
];

const MyComments: React.FC<MyCommentsProps> = React.memo(({ userId }) => {
    const allComments = getUserComments(userId);
    
    const [filters, setFilters] = useState({
        type: 'all' as UserComment['type'] | 'all',
        content: '',
        dateFrom: '',
        dateTo: '',
    });

    const [appliedFilters, setAppliedFilters] = useState({
        type: 'all' as UserComment['type'] | 'all',
        content: '',
        dateFrom: '',
        dateTo: '',
    });

    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
    const typeDropdownRef = React.useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
                setIsTypeDropdownOpen(false);
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

    const filteredComments = useMemo(() => {
        const filterParams = {
            type: appliedFilters.type !== 'all' ? appliedFilters.type : undefined,
            content: appliedFilters.content || undefined,
            dateFrom: appliedFilters.dateFrom || undefined,
            dateTo: appliedFilters.dateTo || undefined,
        };

        return filterUserComments(allComments, filterParams);
    }, [allComments, appliedFilters]);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        setAppliedFilters({ ...filters });
    };

    const handleReset = () => {
        const resetFilters = {
            type: 'all' as UserComment['type'] | 'all',
            content: '',
            dateFrom: '',
            dateTo: '',
        };
        setFilters(resetFilters);
        setAppliedFilters(resetFilters);
    };

    const hasActiveFilters = useMemo(() => {
        return (
            appliedFilters.type !== 'all' ||
            appliedFilters.content !== '' ||
            appliedFilters.dateFrom !== '' ||
            appliedFilters.dateTo !== ''
        );
    }, [appliedFilters]);

    return (
        <div className={cx('my-comments')}>
            {/* Header */}
            <div className={cx('comments-header')}>
                <h1 className={cx('comments-title')}>Bình luận của tôi</h1>
                <p className={cx('comments-subtitle')}>
                    Bình luận và trả lời mà bạn đã viết trên Tài Khoản Xịn
                </p>
            </div>

            {/* Filter Section */}
            <div className={cx('filter-section')}>
                {hasActiveFilters && (
                    <div className={cx('reset-filters-wrapper')}>
                        <button className={cx('reset-filters-button')} onClick={handleReset} type="button">
                            <RotateCcwIcon size={16} />
                            <span>Khôi phục bộ lọc</span>
                        </button>
                    </div>
                )}

                <form onSubmit={handleFilter} className={cx('filter-form')}>
                    {/* Row 1: Basic Filters */}
                    <div className={cx('filter-row', 'basic-filters-row')}>
                        <div className={cx('basic-filters-group')}>
                            <div className={cx('filter-group')}>
                                <label className={cx('filter-label')}>Loại</label>
                                <div className={cx('dropdown-wrapper', { 'is-open': isTypeDropdownOpen })} ref={typeDropdownRef}>
                                    <button
                                        type="button"
                                        className={cx('dropdown-button')}
                                        onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                                    >
                                        <span>{commentTypes.find(t => t.value === filters.type)?.label || 'Tất cả'}</span>
                                        <ChevronDownIcon size={16} className={cx('dropdown-icon', { 'is-open': isTypeDropdownOpen })} />
                                    </button>
                                    {isTypeDropdownOpen && (
                                        <div className={cx('dropdown-menu')}>
                                            {commentTypes.map((type) => (
                                                <button
                                                    key={type.value}
                                                    type="button"
                                                    className={cx('dropdown-item', { 'is-active': filters.type === type.value })}
                                                    onClick={() => {
                                                        setFilters({ ...filters, type: type.value as UserComment['type'] | 'all' });
                                                        setIsTypeDropdownOpen(false);
                                                    }}
                                                >
                                                    {type.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={cx('filter-group')}>
                                <label htmlFor="content" className={cx('filter-label')}>
                                    Nội dung
                                </label>
                                <input
                                    id="content"
                                    type="text"
                                    className={cx('filter-input')}
                                    placeholder="Tìm kiếm trong bình luận..."
                                    value={filters.content}
                                    onChange={(e) => setFilters({ ...filters, content: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Date Range */}
                    <div className={cx('filter-row', 'date-row')}>
                        <div className={cx('filter-section-title')}>
                            <span>Thời gian</span>
                            <div className={cx('quick-filters-buttons')}>
                                {quickDateFilters.map((filter, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className={cx('quick-filter-button')}
                                        onClick={() => handleQuickDateFilter(filter.days)}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className={cx('date-inputs-group')}>
                            <div className={cx('filter-group')}>
                                <label htmlFor="dateFrom" className={cx('filter-label')}>
                                    Từ ngày
                                </label>
                                <div className={cx('date-input-wrapper')}>
                                    <input
                                        id="dateFrom"
                                        type="date"
                                        className={cx('filter-input', 'date-input')}
                                        value={filters.dateFrom}
                                        onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                                    />
                                    <CalendarIcon className={cx('date-icon')} size={18} />
                                </div>
                            </div>

                            <div className={cx('date-separator')}>-</div>

                            <div className={cx('filter-group')}>
                                <label htmlFor="dateTo" className={cx('filter-label')}>
                                    Đến ngày
                                </label>
                                <div className={cx('date-input-wrapper')}>
                                    <input
                                        id="dateTo"
                                        type="date"
                                        className={cx('filter-input', 'date-input')}
                                        value={filters.dateTo}
                                        onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                                    />
                                    <CalendarIcon className={cx('date-icon')} size={18} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Row 3: Filter Button */}
                    <div className={cx('filter-actions-row')}>
                        <button type="submit" className={cx('filter-button')}>
                            <FilterIcon size={18} />
                            Áp dụng bộ lọc
                        </button>
                    </div>
                </form>
            </div>

            {/* Comments Table - Desktop */}
            <div className={cx('comments-table-wrapper')}>
                {filteredComments.length > 0 ? (
                    <>
                        <table className={cx('comments-table')}>
                            <thead>
                                <tr>
                                    <th className={cx('col-time')}>Thời gian</th>
                                    <th className={cx('col-content')}>Nội dung</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredComments.map((comment) => (
                                    <tr key={comment.id}>
                                        <td className={cx('col-time')}>
                                            <div className={cx('time-cell')}>
                                                {formatCommentDateTime(comment.timestamp)}
                                            </div>
                                        </td>
                                        <td className={cx('col-content')}>
                                            <div className={cx('content-cell')}>
                                                <div className={cx('comment-content')}>
                                                    {comment.content}
                                                </div>
                                                {comment.productName && (
                                                    <div className={cx('comment-product')}>
                                                        Sản phẩm: {comment.productName}
                                                    </div>
                                                )}
                                                {comment.type === 'reply' && (
                                                    <span className={cx('comment-type-badge', 'reply-badge')}>
                                                        Trả lời
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Mobile Card View */}
                        <div className={cx('comments-list-mobile')}>
                            {filteredComments.map((comment) => (
                                <div key={comment.id} className={cx('comment-card-mobile')}>
                                    <div className={cx('comment-card-header')}>
                                        <div className={cx('comment-card-time')}>
                                            {formatCommentDateTime(comment.timestamp)}
                                        </div>
                                        {comment.type === 'reply' && (
                                            <span className={cx('comment-type-badge', 'reply-badge')}>
                                                Trả lời
                                            </span>
                                        )}
                                    </div>
                                    <div className={cx('comment-card-content')}>
                                        {comment.content}
                                    </div>
                                    {comment.productName && (
                                        <div className={cx('comment-card-product')}>
                                            Sản phẩm: {comment.productName}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className={cx('empty-state')}>
                        <p className={cx('empty-text')}>
                            {appliedFilters.content || appliedFilters.dateFrom || appliedFilters.dateTo
                                ? 'Không tìm thấy bình luận nào phù hợp với bộ lọc của bạn.'
                                : 'Bạn chưa có bình luận nào.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
});

MyComments.displayName = 'MyComments';

export default MyComments;

