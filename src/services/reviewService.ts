'use client';
import { useSWRUser } from './swrConfig';
import { post, del } from '@/utils/httpRequest';

// ============================================
// TYPES
// ============================================
export interface Review {
    _id: string;
    userId: {
        _id: string;
        fullName: string;
        avatar?: string;
        membershipTier?: number;
        isVerified?: boolean;
        role?: number;
    };
    productId: {
        _id: string;
        name: string;
        slug: string;
    };
    orderId?: string;
    rating: number;
    comment: string;
    verifiedPurchase?: boolean;
    verifiedAt?: string;
    replies?: Array<{
        _id: string;
        userId:
            | string
            | {
                  _id: string;
                  fullName: string;
                  avatar?: string;
                  role?: number;
              };
        comment: string;
        role: string;
        createdAt: string;
        updatedAt?: string;
    }>;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    updatedAt: string;
}

export interface ReviewPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ReviewCollection {
    reviews: Review[];
    pagination: ReviewPagination;
}

export interface RatingStats {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
}

export interface RatingSummary {
    averageRating: number;
    totalReviews: number;
    verifiedPurchase: number;
}

export interface ProductReviewData extends ReviewCollection {
    ratingStats: RatingStats;
    ratingSummary: RatingSummary;
}

export interface ReviewListResponse {
    success: boolean;
    data: ReviewCollection;
}

export interface ProductReviewResponse {
    success: boolean;
    data: ProductReviewData;
}

export interface ReviewResponse {
    success: boolean;
    data: Review;
}

export interface CreateReviewData {
    productId: string;
    orderId?: string;
    rating: number;
    comment: string;
}

// ============================================
// GET HOOKS (SWR)
// ============================================

/**
 * Get product reviews
 */
export const useProductReviews = (productId: string, params?: { page?: number; limit?: number; rating?: number }) => {
    const queryString = params
        ? '?' + new URLSearchParams(params as any).toString()
        : '';
    const key = productId ? `/api/v1/reviews/product/${productId}${queryString}` : null;
    return useSWRUser<ProductReviewResponse>(key);
};

/**
 * Get current user reviews
 */
export const useMyReviews = (params?: { page?: number; limit?: number }) => {
    const queryString = params
        ? '?' + new URLSearchParams(params as any).toString()
        : '';
    const key = `/api/v1/reviews/my-reviews${queryString}`;
    return useSWRUser<ReviewListResponse>(key);
};

/**
 * Get review by ID
 */
export const useReview = (id: string) => {
    const key = id ? `/api/v1/reviews/${id}` : null;
    return useSWRUser<ReviewResponse>(key);
};

// ============================================
// MUTATIONS (AXIOS)
// ============================================

/**
 * Create review (with image upload)
 */
export const createReview = async (data: CreateReviewData): Promise<ReviewResponse> => {
    const response = await post<ReviewResponse>('/api/v1/reviews', data);
    return response.data;
};

/**
 * Reply to a review (admin only)
 */
export const replyReview = async (reviewId: string, comment: string): Promise<ReviewResponse> => {
    const response = await post<ReviewResponse>(`/api/v1/reviews/${reviewId}/reply`, { comment });
    return response.data;
};

/**
 * Delete review
 */
export const deleteReview = async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await del<{ success: boolean; message: string }>(`/api/v1/reviews/${id}`);
    return response.data;
};

