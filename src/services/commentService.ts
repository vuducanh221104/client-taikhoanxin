'use client';
import { useSWRUser } from './swrConfig';
import { post } from '@/utils/httpRequest';

export interface CommentReply {
    _id: string;
    userId: {
        _id: string;
        fullName?: string;
        avatar?: string;
    };
    comment: string;
    role: 'user' | 'support' | 'manager' | 'admin';
    responseType: 'public' | 'internal';
    visibility: 'visible' | 'hidden';
    createdAt: string;
    updatedAt: string;
}

export interface Comment {
    _id: string;
    userId: {
        _id: string;
        fullName?: string;
        avatar?: string;
    };
    productId: string;
    orderId?: string | null;
    orderItemId?: string | null;
    comment: string;
    status: 'pending_review' | 'approved' | 'rejected' | 'hidden';
    replies?: CommentReply[];
    createdAt: string;
    updatedAt: string;
}

export interface CommentPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface CommentListResponse {
    success: boolean;
    data: {
        comments: Comment[];
        pagination: CommentPagination;
    };
}

export interface CommentResponse {
    success: boolean;
    data: Comment;
}

export interface CreateCommentPayload {
    productId: string;
    comment: string;
    orderId?: string;
}

export const useProductComments = (productId: string, params?: { page?: number; limit?: number }) => {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    const key = productId ? `/api/v1/comments/product/${productId}${queryString}` : null;
    return useSWRUser<CommentListResponse>(key);
};

export const useMyComments = (params?: { page?: number; limit?: number }) => {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    const key = `/api/v1/comments/my-comments${queryString}`;
    return useSWRUser<CommentListResponse>(key);
};

export const createComment = async (data: CreateCommentPayload): Promise<CommentResponse> => {
    const response = await post<CommentResponse>('/api/v1/comments', data);
    return response.data;
};

export const replyComment = async (commentId: string, comment: string): Promise<CommentResponse> => {
    const response = await post<CommentResponse>(`/api/v1/comments/${commentId}/reply`, { comment });
    return response.data;
};

export interface CommentDisplay {
    id: string;
    userId: string;
    username: string;
    avatar: string;
    timestamp: string;
    text: string;
    isCustomerService?: boolean;
    isVerified?: boolean;
    hasPurchased?: boolean;
    parentId?: string | null;
    replies?: CommentDisplay[];
}

/**
 * Get all comments for a product
 * @param productId - Product ID (optional, for future use)
 * @returns Array of comments
 */
export const getComments = (productId?: string): CommentDisplay[] => {
    // In the future, this can fetch from API based on productId
    // For now, return empty array
    return [];
};

/**
 * Get comments by product ID
 * @param productId - Product ID
 * @returns Array of comments for the product
 */
export const getCommentsByProductId = (productId: string): CommentDisplay[] => {
    // In the future, filter by productId from API
    // For now, return empty array
    return [];
};

/**
 * Add a new comment
 * @param comment - New comment data
 * @returns The created comment
 */
export const addComment = async (comment: Omit<CommentDisplay, 'id' | 'timestamp'>): Promise<CommentDisplay> => {
    // In the future, this will call API to create comment
    // For now, return mock created comment
    const newComment: CommentDisplay = {
        ...comment,
        id: `new-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        replies: comment.replies || [],
    };
    return newComment;
};

/**
 * Add a reply to a comment
 * @param parentId - Parent comment ID
 * @param reply - Reply data
 * @returns The created reply
 */
export const addReply = async (
    parentId: string,
    reply: Omit<CommentDisplay, 'id' | 'timestamp' | 'parentId'>
): Promise<CommentDisplay> => {
    // In the future, this will call API to create reply
    // For now, return mock created reply
    const newReply: CommentDisplay = {
        ...reply,
        id: `reply-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        parentId,
        replies: [],
    };
    return newReply;
};

