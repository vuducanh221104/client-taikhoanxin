'use client';
import { useSWRUser } from './swrConfig';
import { put, del } from '@/utils/httpRequest';

// ============================================
// TYPES
// ============================================
export interface Notification {
    _id: string;
    type: string;
    userId: string;
    sendTo: string;
    relatedOrderId?: string;
    relatedWarrantyId?: string;
    relatedAccountId?: string;
    deliveryType: string;
    templateKey: string;
    language: string;
    notificationDetails: {
        productName?: string;
        orderId?: string;
        subject?: string;
        body?: string;
        emailAdded?: string;
        expiredAt?: string;
        account?: {
            usernameOrEmail: string;
            password: string;
            other: string;
        };
        note?: string;
        orther?: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface NotificationListResponse {
    success: boolean;
    data: Notification[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface NotificationResponse {
    success: boolean;
    data: Notification;
}

// ============================================
// GET HOOKS (SWR)
// ============================================

/**
 * Get current user notifications
 */
export const useMyNotifications = (params?: { 
    type?: string; 
    page?: number; 
    limit?: number;
    unreadOnly?: boolean;
}) => {
    const queryString = params
        ? '?' + new URLSearchParams(params as any).toString()
        : '';
    const key = `/api/v1/notifications/my-notifications${queryString}`;
    return useSWRUser<NotificationListResponse>(key);
};

// ============================================
// MUTATIONS (AXIOS)
// ============================================

/**
 * Mark notification as read
 */
export const markAsRead = async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await put<{ success: boolean; message: string }>(`/api/v1/notifications/${id}/read`, {});
    return response.data;
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (): Promise<{ success: boolean; message: string }> => {
    const response = await put<{ success: boolean; message: string }>('/api/v1/notifications/read-all', {});
    return response.data;
};

/**
 * Delete notification
 */
export const deleteNotification = async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await del<{ success: boolean; message: string }>(`/api/v1/notifications/${id}`);
    return response.data;
};

