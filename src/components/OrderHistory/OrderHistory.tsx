'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import classNames from 'classnames/bind';
import styles from './OrderHistory.module.scss';
import { useMyOrders, getStatusLabel, getStatusColor, Order, cancelOrder } from '@/services/orderService';
import { FilterIcon, CalendarIcon, ChevronDownIcon, RotateCcwIcon, CloseIcon } from '@/components/Icons';
import { EmptyState } from '@/components/EmptyState';
import { PackageIcon } from '@/components/Icons';
import { useToast } from '@/components/Toast';
import { useConfirm } from '@/components/ConfirmDialog';

const cx = classNames.bind(styles);

interface OrderHistoryProps {
    userId: string;
}

const orderStatuses = [
    { value: 'all', label: 'Tất cả' },
    { value: 'pending_payment', label: 'Chờ thanh toán' },
    { value: 'paid', label: 'Đã thanh toán' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'completed', label: 'Đã xử lý' },
    { value: 'warranty_pending', label: 'Đang bảo hành' },
    { value: 'warranty_completed', label: 'Đã bảo hành' },
    { value: 'cancelled', label: 'Đã hủy' },
];

const quickDateFilters = [
    { label: 'Hôm nay', days: 0 },
    { label: '7 ngày qua', days: 7 },
    { label: '30 ngày qua', days: 30 },
    { label: 'Tháng này', days: -1 },
    { label: 'Tháng trước', days: -2 },
];

const OrderHistory: React.FC<OrderHistoryProps> = React.memo(({ userId }) => {
    const router = useRouter();
    const toast = useToast();
    const { confirm } = useConfirm();
    const { data: ordersData, error, isLoading, mutate } = useMyOrders();
    
    // Map API response to component format
    const allOrders = useMemo(() => {
        if (!ordersData?.data) return [];
        return ordersData.data.map((order: Order) => ({
            id: order._id,
            orderCode: order.orderId.toString(),
            orderDate: order.createdAt,
            status: order.orderStatus,
            totalAmount: order.totalPrice,
            products: order.items.map((item) => {
                // Get product ID - support both productId and product_id
                const productId = item.productId?._id || 
                                 (typeof item.product_id === 'object' ? item.product_id?._id : item.product_id) || 
                                 '';
                
                // Get product name - prioritize fullName, then product_id, then productId
                const productName = item.fullName || 
                                   (typeof item.product_id === 'object' ? item.product_id?.name : null) ||
                                   item.productId?.name || 
                                   'Sản phẩm đã xóa';
                
                // Get product image - support both productId and product_id
                const productImage = item.productId?.image?.[0] || 
                                    (typeof item.product_id === 'object' ? item.product_id?.image?.[0] : null) ||
                                    '';
                
                return {
                    id: productId,
                    productName: productName,
                    quantity: item.quantity,
                    price: item.price,
                    image: productImage,
                };
            }),
        }));
    }, [ordersData]);
    
    const [filters, setFilters] = useState({
        status: 'all' as Order['orderStatus'] | 'all',
        orderCode: '',
        amountFrom: '',
        amountTo: '',
        dateFrom: '',
        dateTo: '',
    });

    const [appliedFilters, setAppliedFilters] = useState({
        status: 'all' as Order['orderStatus'] | 'all',
        orderCode: '',
        amountFrom: '',
        amountTo: '',
        dateFrom: '',
        dateTo: '',
    });

    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const statusDropdownRef = React.useRef<HTMLDivElement>(null);
    const [amountError, setAmountError] = useState('');
    const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

    // Close dropdown when clicking outside
    React.useEffect(() => {
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
        setFilters({ 
            ...filters, 
            amountFrom: '0',
            amountTo: amount.toLocaleString('vi-VN')
        });
        setAmountError('');
    };

    const filteredOrders = useMemo(() => {
        return allOrders.filter((order: any) => {
            // Filter by status
            if (appliedFilters.status !== 'all' && order.status !== appliedFilters.status) {
                return false;
            }

            // Filter by order code
            if (appliedFilters.orderCode) {
                const searchCode = appliedFilters.orderCode.toLowerCase();
                const orderCode = order.orderCode?.toLowerCase() || '';
                if (!orderCode.includes(searchCode)) {
                    return false;
                }
            }

            // Filter by amount range
            const amountFrom = appliedFilters.amountFrom ? parsePriceInput(appliedFilters.amountFrom) : null;
            const amountTo = appliedFilters.amountTo ? parsePriceInput(appliedFilters.amountTo) : null;
            
            if (amountFrom !== null && order.totalAmount < amountFrom) {
                return false;
            }
            if (amountTo !== null && order.totalAmount > amountTo) {
                return false;
            }

            // Filter by date range
            if (appliedFilters.dateFrom) {
                const orderDate = new Date(order.orderDate);
                const fromDate = new Date(appliedFilters.dateFrom);
                fromDate.setHours(0, 0, 0, 0);
                if (orderDate < fromDate) {
                    return false;
                }
            }
            if (appliedFilters.dateTo) {
                const orderDate = new Date(order.orderDate);
                const toDate = new Date(appliedFilters.dateTo);
                toDate.setHours(23, 59, 59, 999);
                if (orderDate > toDate) {
                    return false;
                }
            }

            return true;
        });
    }, [allOrders, appliedFilters]);

    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const filterPanelRef = React.useRef<HTMLDivElement | null>(null);

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
            status: 'all' as Order['orderStatus'] | 'all',
            orderCode: '',
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
            appliedFilters.status !== 'all' ||
            appliedFilters.orderCode !== '' ||
            appliedFilters.amountFrom !== '' ||
            appliedFilters.amountTo !== '' ||
            appliedFilters.dateFrom !== '' ||
            appliedFilters.dateTo !== ''
        );
    }, [appliedFilters]);

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (appliedFilters.status !== 'all') count += 1;
        if (appliedFilters.orderCode) count += 1;
        if (appliedFilters.amountFrom) count += 1;
        if (appliedFilters.amountTo) count += 1;
        if (appliedFilters.dateFrom) count += 1;
        if (appliedFilters.dateTo) count += 1;
        return count;
    }, [appliedFilters]);

    const activeFilterBadges = useMemo(() => {
        const badges: string[] = [];
        if (appliedFilters.status !== 'all') {
            const statusLabel = orderStatuses.find(s => s.value === appliedFilters.status)?.label;
            if (statusLabel) badges.push(statusLabel);
        }
        if (appliedFilters.orderCode) badges.push(`Mã: ${appliedFilters.orderCode}`);
        if (appliedFilters.amountFrom || appliedFilters.amountTo) {
            const from = appliedFilters.amountFrom || '0';
            const to = appliedFilters.amountTo || '∞';
            badges.push(`Số tiền: ${from} - ${to}`);
        }
        if (appliedFilters.dateFrom || appliedFilters.dateTo) {
            const from = appliedFilters.dateFrom || 'Ngày đầu';
            const to = appliedFilters.dateTo || 'Hiện tại';
            badges.push(`Thời gian: ${from} → ${to}`);
        }
        return badges;
    }, [appliedFilters]);

    const canCancelOrder = (status: Order['orderStatus']) => {
        return ['pending_payment', 'processing'].includes(status);
    };

    const handleViewDetails = (orderCode: string) => {
        router.push(`/account/orders/${orderCode}`);
    };

    const handleCancelOrder = async (orderId: string, orderCode: string) => {
        if (!orderId) {
            return;
        }

        const isConfirmed = await confirm({
            title: 'Huỷ đơn hàng',
            message: `Bạn có chắc muốn huỷ đơn hàng #${orderCode}? Hành động này không thể hoàn tác.`,
            variant: 'danger',
            confirmText: 'Huỷ đơn',
            cancelText: 'Giữ đơn',
        });

        if (!isConfirmed) {
            return;
        }

        try {
            setCancellingOrderId(orderId);
            await cancelOrder(orderId);
            toast.success('Đã huỷ đơn hàng thành công.');
            await mutate();
        } catch (err: any) {
            const message = err?.response?.data?.message || 'Không thể huỷ đơn hàng. Vui lòng thử lại.';
            toast.error(message);
        } finally {
            setCancellingOrderId(null);
        }
    };

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

    if (isLoading) {
        return (
            <div className={cx('order-history')}>
                <div className={cx('order-header')}>
                    <h1 className={cx('order-title')}>Lịch sử đơn hàng</h1>
                    <p className={cx('order-subtitle')}>
                        Đang tải dữ liệu...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={cx('order-history')}>
                <div className={cx('order-header')}>
                    <h1 className={cx('order-title')}>Lịch sử đơn hàng</h1>
                    <p className={cx('order-subtitle')}>
                        Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={cx('order-history')}>
            {/* Header */}
            <div className={cx('order-header')}>
                <h1 className={cx('order-title')}>Lịch sử đơn hàng</h1>
                <p className={cx('order-subtitle')}>
                    Hiển thị thông tin các sản phẩm bạn đã mua tại Tài Khoản Xịn
                </p>
            </div>

            {/* Filter Controls */}
            <div className={cx('filter-section')}>
                <div className={cx('filter-toggle-bar')}>
                    <div className={cx('filter-summary')}>
                        <span>
                            {hasActiveFilters
                                ? `Đang áp dụng ${activeFilterCount} bộ lọc`
                                : 'Chưa áp dụng bộ lọc nào'}
                        </span>
                        {hasActiveFilters && activeFilterBadges.length > 0 && (
                            <div className={cx('active-filter-badges')}>
                                {activeFilterBadges.map((badge, index) => (
                                    <span key={index} className={cx('filter-chip')}>
                                        {badge}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className={cx('filter-toggle-actions')}>
                        {hasActiveFilters && (
                            <button className={cx('reset-filters-button')} onClick={handleReset} type="button">
                                <RotateCcwIcon size={16} />
                                <span>Khôi phục</span>
                            </button>
                        )}
                        <button
                            type="button"
                            className={cx('filter-toggle-button', { 'is-open': isFilterPanelOpen })}
                            onClick={() => setIsFilterPanelOpen(prev => !prev)}
                        >
                            <FilterIcon size={16} />
                            <span>Bộ lọc</span>
                            {hasActiveFilters && <span className={cx('filter-count')}>{activeFilterCount}</span>}
                            <ChevronDownIcon size={14} className={cx('toggle-icon')} />
                        </button>
                    </div>
                </div>

                <div
                    className={cx('filter-dropdown', { 'is-open': isFilterPanelOpen })}
                    ref={filterPanelRef}
                >
                    {isFilterPanelOpen && (
                        <form onSubmit={handleFilter} className={cx('filter-form')}>
                    {/* Row 1: Basic Filters */}
                    <div className={cx('filter-row', 'basic-filters-row')}>
                        <div className={cx('basic-filters-group')}>
                            <div className={cx('filter-group')}>
                                <label className={cx('filter-label')}>Trạng thái</label>
                                <div className={cx('dropdown-wrapper', { 'is-open': isStatusDropdownOpen })} ref={statusDropdownRef}>
                                    <button
                                        type="button"
                                        className={cx('dropdown-button')}
                                        onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                                    >
                                        <span>{orderStatuses.find(s => s.value === filters.status)?.label || 'Tất cả'}</span>
                                        <ChevronDownIcon size={16} className={cx('dropdown-icon', { 'is-open': isStatusDropdownOpen })} />
                                    </button>
                                    {isStatusDropdownOpen && (
                                        <div className={cx('dropdown-menu')}>
                                            {orderStatuses.map((status) => (
                                                <button
                                                    key={status.value}
                                                    type="button"
                                                    className={cx('dropdown-item', { 'is-active': filters.status === status.value })}
                                                    onClick={() => {
                                                        setFilters({ ...filters, status: status.value as Order['orderStatus'] | 'all' });
                                                        setIsStatusDropdownOpen(false);
                                                    }}
                                                >
                                                    {status.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={cx('filter-group')}>
                                <label htmlFor="orderCode" className={cx('filter-label')}>
                                    Mã đơn hàng
                                </label>
                                <input
                                    id="orderCode"
                                    type="text"
                                    className={cx('filter-input')}
                                    placeholder="Nhập mã đơn hàng"
                                    value={filters.orderCode}
                                    onChange={(e) => setFilters({ ...filters, orderCode: e.target.value })}
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
                        {hasActiveFilters && (
                            <button
                                type="button"
                                className={cx('clear-filter-button')}
                                onClick={handleReset}
                            >
                                Xoá bộ lọc
                            </button>
                        )}
                        <button type="submit" className={cx('filter-button')}>
                            <FilterIcon size={18} />
                            Áp dụng bộ lọc
                        </button>
                    </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Orders Table */}
            <div className={cx('orders-table-wrapper')}>
                {filteredOrders.length === 0 ? (
                    <div className={cx('empty-orders-wrapper')}>
                        <EmptyState
                            icon={<PackageIcon size={80} />}
                            title="Không tìm thấy đơn hàng"
                            description={
                                allOrders.length === 0
                                    ? 'Bạn chưa có đơn hàng nào. Hãy khám phá các sản phẩm và đặt hàng ngay!'
                                    : 'Không có đơn hàng nào phù hợp với bộ lọc của bạn. Thử điều chỉnh bộ lọc để xem thêm kết quả.'
                            }
                            actionLabel={allOrders.length === 0 ? 'Khám phá sản phẩm' : 'Xóa bộ lọc'}
                            actionHref={allOrders.length === 0 ? '/products' : undefined}
                            onAction={allOrders.length === 0 ? undefined : handleReset}
                        />
                    </div>
                ) : (
                    <table className={cx('orders-table')}>
                        <thead>
                            <tr>
                                <th>Thời gian</th>
                                <th>Mã đơn hàng</th>
                                <th>Sản phẩm</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => {
                                const showCancelButton = canCancelOrder(order.status as Order['orderStatus']);
                                const isCancelling = cancellingOrderId === order.id;

                                return (
                                    <tr key={order.id}>
                                        <td className={cx('order-time')}>
                                            {formatDateTime(order.orderDate)}
                                        </td>
                                        <td className={cx('order-code')}>
                                            <Link href={`/account/orders/${order.orderCode}`}>
                                                {order.orderCode}
                                            </Link>
                                        </td>
                                        <td className={cx('order-products')}>
                                            <div className={cx('products-list')}>
                                                {order.products.slice(0, 3).map((product) => (
                                                    <div key={product.id} className={cx('product-item')}>
                                                        <span className={cx('product-name')}>
                                                            {product.productName} x{product.quantity}
                                                        </span>
                                                    </div>
                                                ))}
                                                {order.products.length > 3 && (
                                                    <span className={cx('more-products')}>
                                                        +{order.products.length - 3} sản phẩm khác
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className={cx('order-amount')}>
                                            {formatPrice(order.totalAmount)}
                                        </td>
                                        <td className={cx('order-status')}>
                                            <span className={cx('status-badge', getStatusColor(order.status as string))}>
                                                {getStatusLabel(order.status as string)}
                                            </span>
                                        </td>
                                        <td className={cx('order-actions')}>
                                            <div className={cx('action-buttons')}>
                                                <button
                                                    type="button"
                                                    className={cx('action-button', 'detail-button')}
                                                    onClick={() => handleViewDetails(order.orderCode)}
                                                >
                                                    Chi tiết
                                                </button>
                                                {showCancelButton && (
                                                    <button
                                                        type="button"
                                                        className={cx('action-button', 'cancel-button')}
                                                        onClick={() => handleCancelOrder(order.id, order.orderCode)}
                                                        disabled={isCancelling}
                                                    >
                                                        {isCancelling ? 'Đang huỷ...' : 'Huỷ đơn'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
});

OrderHistory.displayName = 'OrderHistory';

export default OrderHistory;

