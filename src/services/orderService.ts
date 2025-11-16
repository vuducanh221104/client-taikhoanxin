import mockOrdersData from '@/data/mockOrders.json';

export interface OrderProduct {
    id: string;
    productName: string;
    image?: string;
    imageSrc?: string;
    quantity: number;
    price: number;
    accountUsername?: string;
    accountPassword?: string;
    accountInfo?: {
        username: string;
        password: string;
        loginUrl?: string;
    };
    accounts?: Array<{
        username: string;
        password: string;
        loginUrl?: string;
    }>;
}

export interface Order {
    id: string;
    userId: string;
    orderCode: string;
    orderDate: string;
    customerEmail: string;
    products: OrderProduct[];
    totalAmount: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    paymentMethod: string;
}

export interface OrderFilters {
    orderCode?: string;
    status?: Order['status'] | 'all';
    amountFrom?: number;
    amountTo?: number;
    dateFrom?: string;
    dateTo?: string;
}

/**
 * Get orders by user ID
 * @param userId - User ID
 * @returns Array of orders for the specified user
 */
export const getOrdersByUserId = (userId: string): Order[] => {
    const orders = mockOrdersData.orders as Order[];
    return orders.filter(order => order.userId === userId);
};

/**
 * Get order by order code
 * @param orderCode - Order code
 * @param userId - User ID (optional, for security check)
 * @returns Order or undefined if not found
 */
export const getOrderByCode = (orderCode: string, userId?: string): Order | undefined => {
    const orders = mockOrdersData.orders as Order[];
    const order = orders.find(order => order.orderCode === orderCode);
    
    // If userId is provided, verify it matches
    if (order && userId && order.userId !== userId) {
        return undefined;
    }
    
    return order;
};

/**
 * Filter orders by criteria
 * @param orders - Array of orders to filter
 * @param filters - Filter criteria
 * @returns Filtered array of orders
 */
export const filterOrders = (orders: Order[], filters: OrderFilters): Order[] => {
    let filtered = [...orders];

    // Filter by status
    if (filters.status && filters.status !== 'all') {
        filtered = filtered.filter(order => order.status === filters.status);
    }

    // Filter by order code
    if (filters.orderCode) {
        const code = filters.orderCode.toLowerCase().trim();
        filtered = filtered.filter(order => 
            order.orderCode.toLowerCase().includes(code)
        );
    }

    // Filter by amount range
    if (filters.amountFrom !== undefined) {
        filtered = filtered.filter(order => order.totalAmount >= filters.amountFrom!);
    }

    if (filters.amountTo !== undefined) {
        filtered = filtered.filter(order => order.totalAmount <= filters.amountTo!);
    }

    // Filter by date range
    if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        filtered = filtered.filter(order => {
            const orderDate = new Date(order.orderDate);
            orderDate.setHours(0, 0, 0, 0);
            return orderDate >= fromDate;
        });
    }

    if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        filtered = filtered.filter(order => {
            const orderDate = new Date(order.orderDate);
            orderDate.setHours(23, 59, 59, 999);
            return orderDate <= toDate;
        });
    }

    return filtered;
};

/**
 * Get status label in Vietnamese
 * @param status - Order status
 * @returns Vietnamese label
 */
export const getStatusLabel = (status: Order['status']): string => {
    switch (status) {
        case 'pending':
            return 'Chờ xử lý';
        case 'processing':
            return 'Đang xử lý';
        case 'completed':
            return 'Hoàn thành';
        case 'cancelled':
            return 'Đã hủy';
        default:
            return status;
    }
};

/**
 * Get status color class
 * @param status - Order status
 * @returns CSS class name for status color
 */
export const getStatusColor = (status: Order['status']): string => {
    switch (status) {
        case 'pending':
            return 'status-pending';
        case 'processing':
            return 'status-processing';
        case 'completed':
            return 'status-completed';
        case 'cancelled':
            return 'status-cancelled';
        default:
            return '';
    }
};

