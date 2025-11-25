'use client';
import { useSWRUser } from './swrConfig';
import { post, put } from '@/utils/httpRequest';

// ============================================
// TYPES
// ============================================
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface PopulatedProduct {
    _id: string;
    name: string;
    slug: string;
    image: string[];
    description?: string[];
}

export interface OrderItemOption {
    title: string;
    value: any;
}

export interface OrderItem {
    productId?: PopulatedProduct;
    product_id?: string | PopulatedProduct;
    quantity: number;
    price: number;
    fullName?: string;
    options?: OrderItemOption[];
    keys?: {
        description?: string;
        entries?: string[];
    };
    help?: {
        text?: string;
        href?: string;
    };
    note?: string;
    upgradeAccount?: string; // Deprecated, use options instead
    upgradeEmail?: string; // Deprecated, use options instead
}

export interface OrderUserRef {
    _id: string;
    email?: string;
    fullName?: string;
    phone?: string;
}

export interface Order {
    _id: string;
    orderId: string;
    userId: string | OrderUserRef;
    items: OrderItem[];
    totalPrice: number;
    totalDiscountBefore: number;
    totalDiscount: number;
    discountCode?: string;
    discountUsageApplied?: boolean;
    orderStatus:
        | 'pending_payment'
        | 'paid'
        | 'processing'
        | 'completed'
        | 'cancelled'
        | 'warranty_pending'
        | 'warranty_completed';
    paymentStatus?: 'unpaid' | 'pending' | 'paid' | 'failed' | 'refunded';
    phoneUserOrder: string;
    emailUserOrder?: string;
    emailGiftForFriend?: string;
    userNote?: string;
    adminNote?: string;
    customerFullName?: string;
    expiresAt?: string;
    checkoutToken?: string;
    checkoutTokenExpiresAt?: string;
    vietQR?: {
        image?: string;
        bankCode?: string;
        accountNumber?: string;
        amount?: number;
        description?: string;
    };
    createdAt: string;
    updatedAt: string;
}

export type OrderListResponse = ApiResponse<Order[]>;
export type OrderResponse = ApiResponse<Order>;
export type OrderDetailResponse = ApiResponse<{
    order: Order;
    payment?: Payment | null;
}>;
export interface CheckoutOrderPayload {
    order: Order;
    expiresAt?: string;
    remainingSeconds: number;
    isExpired: boolean;
    paymentWindowMinutes: number;
}
export type CheckoutOrderResponse = ApiResponse<CheckoutOrderPayload>;

export interface Payment {
    _id: string;
    orderId: string;
    amount: number;
    status: string;
    method?: string;
    providerTransactionId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateOrderData {
    items: Array<{
        productId: string;
        quantity: number;
        upgradeAccount?: string;
        upgradeEmail?: string;
    }>;
    discountCode?: string;
    phoneNumber?: string;
    emailGiftForFriend?: string;
    userNote?: string;
    customerFullName?: string;
    phoneUserOrder?: string;
    emailUserOrder?: string;
}

// ============================================
// GET HOOKS (SWR)
// ============================================

/**
 * Get current user orders
 */
export const useMyOrders = (params?: { 
    status?: string; 
    page?: number; 
    limit?: number;
    orderId?: string;
}) => {
    const queryString = params
        ? '?' + new URLSearchParams(params as any).toString()
        : '';
    const key = `/api/v1/orders/my-orders${queryString}`;
    return useSWRUser<OrderListResponse>(key);
};

/**
 * Get order by ID
 */
export const useOrder = (id: string) => {
    const key = id ? `/api/v1/orders/${id}` : null;
    return useSWRUser<OrderDetailResponse>(key);
};

/**
 * Get checkout order info via token (public success page)
 */
export const useCheckoutOrder = (orderId?: string | null, token?: string | null) => {
    if (!orderId || !token) {
        return useSWRUser<CheckoutOrderResponse>(null);
    }
    const query = `/api/v1/orders/checkout/${orderId}?token=${encodeURIComponent(token)}`;
    return useSWRUser<CheckoutOrderResponse>(query);
};

// ============================================
// MUTATIONS (AXIOS)
// ============================================

/**
 * Create new order
 */
export const createOrder = async (data: CreateOrderData): Promise<OrderResponse> => {
    const response = await post<OrderResponse>('/api/v1/orders', data);
    return response.data;
};

/**
 * Cancel order
 */
export const cancelOrder = async (id: string): Promise<OrderResponse> => {
    const response = await put<OrderResponse>(`/api/v1/orders/${id}/cancel`, {});
    return response.data;
};

/**
 * Resend account info
 */
export const resendAccountInfo = async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await post<{ success: boolean; message: string }>(`/api/v1/orders/${id}/resend-account`, {});
    return response.data;
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get status label in Vietnamese
 */
export const getStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
        pending_payment: 'Chờ thanh toán',
        paid: 'Đã thanh toán',
        processing: 'Đang xử lý',
        completed: 'Đã xử lý',
        cancelled: 'Đã hủy',
        warranty_pending: 'Đang bảo hành',
        warranty_completed: 'Đã bảo hành',
        refunded: 'Đã hoàn tiền',
    };
    return statusMap[status] || status;
};

/**
 * Get status color class
 */
export const getStatusColor = (status: string): string => {
    const colorMap: Record<string, string> = {
        pending_payment: 'status-pending',
        paid: 'status-processing',
        processing: 'status-processing',
        completed: 'status-completed',
        warranty_pending: 'status-processing',
        warranty_completed: 'status-completed',
        cancelled: 'status-cancelled',
        refunded: 'status-cancelled',
    };
    return colorMap[status] || 'status-default';
};

/**
 * Filter orders based on criteria
 */
export const filterOrders = (
    orders: Order[],
    filters: {
        status?: string;
        orderCode?: string;
        amountFrom?: number;
        amountTo?: number;
        dateFrom?: string;
        dateTo?: string;
    }
): Order[] => {
    return orders.filter((order) => {
        // Filter by status
        if (filters.status && order.orderStatus !== filters.status) {
            return false;
        }

        // Filter by order code
        if (filters.orderCode) {
            const searchCode = filters.orderCode.toLowerCase();
            const orderCode = order.orderId?.toString().toLowerCase() || '';
            if (!orderCode.includes(searchCode)) {
                return false;
            }
        }

        // Filter by amount range
        if (filters.amountFrom !== undefined && order.totalPrice < filters.amountFrom) {
            return false;
        }
        if (filters.amountTo !== undefined && order.totalPrice > filters.amountTo) {
            return false;
        }

        // Filter by date range
        if (filters.dateFrom) {
            const orderDate = new Date(order.createdAt);
            const fromDate = new Date(filters.dateFrom);
            fromDate.setHours(0, 0, 0, 0);
            if (orderDate < fromDate) {
                return false;
            }
        }
        if (filters.dateTo) {
            const orderDate = new Date(order.createdAt);
            const toDate = new Date(filters.dateTo);
            toDate.setHours(23, 59, 59, 999);
            if (orderDate > toDate) {
                return false;
            }
        }

        return true;
    });
};
