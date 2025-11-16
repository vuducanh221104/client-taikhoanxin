'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import classNames from 'classnames/bind';
import styles from './TransactionHistory.module.scss';
import { getTransactionsByUserId, filterTransactions, getTransactionTypeLabel, getTransactionTypeColor, Transaction } from '@/services/transactionService';
import { FilterIcon, CalendarIcon, ChevronDownIcon, RotateCcwIcon, CloseIcon, WalletIcon } from '@/components/Icons';
import { EmptyState } from '@/components/EmptyState';

const cx = classNames.bind(styles);

interface TransactionHistoryProps {
    userId: string;
}

const transactionTypes = [
    { value: 'all', label: 'Tất cả' },
    { value: 'deposit', label: 'Nạp tiền' },
    { value: 'payment', label: 'Thanh toán' },
    { value: 'refund', label: 'Hoàn tiền' },
    { value: 'withdrawal', label: 'Rút tiền' },
];

const quickDateFilters = [
    { label: 'Hôm nay', days: 0 },
    { label: '7 ngày qua', days: 7 },
    { label: '30 ngày qua', days: 30 },
    { label: 'Tháng này', days: -1 }, // Special value for current month
    { label: 'Tháng trước', days: -2 }, // Special value for last month
];

const TransactionHistory: React.FC<TransactionHistoryProps> = React.memo(({ userId }) => {
    const allTransactions = getTransactionsByUserId(userId);
    
    const [filters, setFilters] = useState({
        type: 'all' as Transaction['type'] | 'all',
        description: '',
        amountFrom: '',
        amountTo: '',
        dateFrom: '',
        dateTo: '',
    });

    const [appliedFilters, setAppliedFilters] = useState({
        type: 'all' as Transaction['type'] | 'all',
        description: '',
        amountFrom: '',
        amountTo: '',
        dateFrom: '',
        dateTo: '',
    });

    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
    const typeDropdownRef = React.useRef<HTMLDivElement>(null);
    const [amountError, setAmountError] = useState('');

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

    // Validate amount range
    React.useEffect(() => {
        const fromAmount = filters.amountFrom ? parsePriceInput(filters.amountFrom) : null;
        const toAmount = filters.amountTo ? parsePriceInput(filters.amountTo) : null;

        if (fromAmount !== null && toAmount !== null && fromAmount > toAmount) {
            setAmountError('Số tiền từ không được lớn hơn số tiền đến');
        } else {
            setAmountError('');
        }
    }, [filters.amountFrom, filters.amountTo]);

    const handleClearAmount = (field: 'amountFrom' | 'amountTo') => {
        setFilters({ ...filters, [field]: '' });
        setAmountError('');
    };

    const handleQuickAmount = (amount: number) => {
        // Set range: from 0 to selected amount
        setFilters({ 
            ...filters, 
            amountFrom: '0',
            amountTo: amount.toLocaleString('vi-VN')
        });
        setAmountError('');
    };

    const filteredTransactions = useMemo(() => {
        const filterParams = {
            type: appliedFilters.type !== 'all' ? appliedFilters.type : undefined,
            description: appliedFilters.description || undefined,
            amountFrom: appliedFilters.amountFrom ? parsePriceInput(appliedFilters.amountFrom) : undefined,
            amountTo: appliedFilters.amountTo ? parsePriceInput(appliedFilters.amountTo) : undefined,
            dateFrom: appliedFilters.dateFrom || undefined,
            dateTo: appliedFilters.dateTo || undefined,
        };

        return filterTransactions(allTransactions, filterParams);
    }, [allTransactions, appliedFilters]);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        // Don't apply filters if there's an amount error
        if (amountError) {
            return;
        }
        setAppliedFilters({ ...filters });
    };

    const handleReset = () => {
        const resetFilters = {
            type: 'all' as Transaction['type'] | 'all',
            description: '',
            amountFrom: '',
            amountTo: '',
            dateFrom: '',
            dateTo: '',
        };
        setFilters(resetFilters);
        setAppliedFilters(resetFilters);
        setAmountError('');
    };

    const hasActiveFilters = useMemo(() => {
        return (
            appliedFilters.type !== 'all' ||
            appliedFilters.description !== '' ||
            appliedFilters.amountFrom !== '' ||
            appliedFilters.amountTo !== '' ||
            appliedFilters.dateFrom !== '' ||
            appliedFilters.dateTo !== ''
        );
    }, [appliedFilters]);

    const formatPrice = (amount: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDateTime = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className={cx('transaction-history')}>
            {/* Header */}
            <div className={cx('transaction-header')}>
                <h1 className={cx('transaction-title')}>Lịch sử giao dịch</h1>
                <p className={cx('transaction-subtitle')}>
                    Hiển thị tất cả các giao dịch bạn đã thực hiện tại Tài Khoản Xịn
                </p>
            </div>

            {/* Filter Controls */}
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
                                <label className={cx('filter-label')}>Loại giao dịch</label>
                                <div className={cx('dropdown-wrapper', { 'is-open': isTypeDropdownOpen })} ref={typeDropdownRef}>
                                    <button
                                        type="button"
                                        className={cx('dropdown-button')}
                                        onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                                    >
                                        <span>{transactionTypes.find(t => t.value === filters.type)?.label || 'Tất cả'}</span>
                                        <ChevronDownIcon size={16} className={cx('dropdown-icon', { 'is-open': isTypeDropdownOpen })} />
                                    </button>
                                    {isTypeDropdownOpen && (
                                        <div className={cx('dropdown-menu')}>
                                            {transactionTypes.map((type) => (
                                                <button
                                                    key={type.value}
                                                    type="button"
                                                    className={cx('dropdown-item', { 'is-active': filters.type === type.value })}
                                                    onClick={() => {
                                                        setFilters({ ...filters, type: type.value as Transaction['type'] | 'all' });
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
                                <label htmlFor="description" className={cx('filter-label')}>
                                    Mô tả
                                </label>
                                <input
                                    id="description"
                                    type="text"
                                    className={cx('filter-input')}
                                    placeholder="Nhập mô tả giao dịch"
                                    value={filters.description}
                                    onChange={(e) => setFilters({ ...filters, description: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Amount Range */}
                    <div className={cx('filter-row', 'amount-row')}>
                        <div className={cx('filter-section-title')}>
                            <span>Số tiền</span>
                            <div className={cx('quick-amount-buttons')}>
                                <button
                                    type="button"
                                    className={cx('quick-amount-button')}
                                    onClick={() => handleQuickAmount(100000)}
                                >
                                    Dưới 100k
                                </button>
                                <button
                                    type="button"
                                    className={cx('quick-amount-button')}
                                    onClick={() => handleQuickAmount(500000)}
                                >
                                    Dưới 500k
                                </button>
                                <button
                                    type="button"
                                    className={cx('quick-amount-button')}
                                    onClick={() => handleQuickAmount(1000000)}
                                >
                                    Dưới 1M
                                </button>
                                <button
                                    type="button"
                                    className={cx('quick-amount-button')}
                                    onClick={() => handleQuickAmount(5000000)}
                                >
                                    Dưới 5M
                                </button>
                            </div>
                        </div>
                        <div className={cx('amount-inputs-group')}>
                            <div className={cx('filter-group', 'amount-group')}>
                                <label htmlFor="amountFrom" className={cx('filter-label')}>
                                    Từ
                                </label>
                                <div className={cx('amount-input-wrapper')}>
                                    <input
                                        id="amountFrom"
                                        type="text"
                                        className={cx('filter-input', 'amount-input', { 'has-error': amountError })}
                                        placeholder="VD: 1.000.000"
                                        value={filters.amountFrom}
                                        onChange={(e) => {
                                            const formatted = formatPriceInput(e.target.value);
                                            setFilters({ ...filters, amountFrom: formatted });
                                        }}
                                        onBlur={(e) => {
                                            if (e.target.value) {
                                                const formatted = formatPriceInput(e.target.value);
                                                setFilters({ ...filters, amountFrom: formatted });
                                            }
                                        }}
                                    />
                                    {filters.amountFrom && (
                                        <button
                                            type="button"
                                            className={cx('amount-clear-button')}
                                            onClick={() => handleClearAmount('amountFrom')}
                                            aria-label="Xóa"
                                        >
                                            <CloseIcon size={14} />
                                        </button>
                                    )}
                                    <span className={cx('amount-suffix')}>VND</span>
                                </div>
                            </div>

                            <div className={cx('amount-separator')}>-</div>

                            <div className={cx('filter-group', 'amount-group')}>
                                <label htmlFor="amountTo" className={cx('filter-label')}>
                                    Đến
                                </label>
                                <div className={cx('amount-input-wrapper')}>
                                    <input
                                        id="amountTo"
                                        type="text"
                                        className={cx('filter-input', 'amount-input', { 'has-error': amountError })}
                                        placeholder="VD: 10.000.000"
                                        value={filters.amountTo}
                                        onChange={(e) => {
                                            const formatted = formatPriceInput(e.target.value);
                                            setFilters({ ...filters, amountTo: formatted });
                                        }}
                                        onBlur={(e) => {
                                            if (e.target.value) {
                                                const formatted = formatPriceInput(e.target.value);
                                                setFilters({ ...filters, amountTo: formatted });
                                            }
                                        }}
                                    />
                                    {filters.amountTo && (
                                        <button
                                            type="button"
                                            className={cx('amount-clear-button')}
                                            onClick={() => handleClearAmount('amountTo')}
                                            aria-label="Xóa"
                                        >
                                            <CloseIcon size={14} />
                                        </button>
                                    )}
                                    <span className={cx('amount-suffix')}>VND</span>
                                </div>
                            </div>
                        </div>
                        {amountError && (
                            <div className={cx('amount-error-wrapper')}>
                                <span className={cx('amount-error')}>{amountError}</span>
                            </div>
                        )}
                    </div>

                    {/* Row 3: Date Range */}
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

                    {/* Row 4: Filter Button */}
                    <div className={cx('filter-actions-row')}>
                        <button type="submit" className={cx('filter-button')}>
                            <FilterIcon size={18} />
                            Áp dụng bộ lọc
                        </button>
                    </div>
                </form>
            </div>

            {/* Transactions Table */}
            <div className={cx('transactions-table-wrapper')}>
                {filteredTransactions.length === 0 ? (
                    <div className={cx('empty-transactions-wrapper')}>
                        <EmptyState
                            icon={<WalletIcon size={80} />}
                            title="Không tìm thấy giao dịch"
                            description={
                                allTransactions.length === 0
                                    ? 'Bạn chưa có giao dịch nào. Giao dịch sẽ được hiển thị tại đây sau khi bạn thực hiện thanh toán hoặc nạp tiền.'
                                    : 'Không có giao dịch nào phù hợp với bộ lọc của bạn. Thử điều chỉnh bộ lọc để xem thêm kết quả.'
                            }
                            action={
                                allTransactions.length === 0
                                    ? {
                                          label: 'Khám phá sản phẩm',
                                          href: '/products',
                                      }
                                    : {
                                          label: 'Xóa bộ lọc',
                                          onClick: handleReset,
                                          variant: 'secondary',
                                      }
                            }
                            size="medium"
                        />
                    </div>
                ) : (
                    <table className={cx('transactions-table')}>
                        <thead>
                            <tr>
                                <th>Thời gian</th>
                                <th>Mô tả</th>
                                <th>Số tiền</th>
                                <th>Số dư</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td className={cx('transaction-time')}>
                                        {formatDateTime(transaction.transactionDate)}
                                    </td>
                                    <td className={cx('transaction-description')}>
                                        <div className={cx('description-content')}>
                                            <span className={cx('description-text')}>
                                                {transaction.description}
                                            </span>
                                            {transaction.orderCode && (
                                                <Link 
                                                    href={`/account/orders/${transaction.orderCode}`}
                                                    className={cx('order-link')}
                                                >
                                                    {transaction.orderCode}
                                                </Link>
                                            )}
                                        </div>
                                    </td>
                                    <td className={cx('transaction-amount')}>
                                        <span className={cx('amount-value', {
                                            'is-positive': transaction.amount > 0,
                                            'is-negative': transaction.amount < 0,
                                        })}>
                                            {transaction.amount > 0 ? '+' : ''}{formatPrice(transaction.amount)}
                                        </span>
                                    </td>
                                    <td className={cx('transaction-balance')}>
                                        {formatPrice(transaction.balance)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
});

TransactionHistory.displayName = 'TransactionHistory';

export default TransactionHistory;

