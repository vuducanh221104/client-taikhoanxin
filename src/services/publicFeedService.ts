'use client';

import { useSWRUser } from './swrConfig';

export interface PublicFeedItem {
    _id: string;
    displayName: string;
    productName: string;
    productImage?: string;
    isReal: boolean;
    createdAt: string;
}

export interface PublicFeedResponse {
    success: boolean;
    data: PublicFeedItem[];
}

/**
 * Lấy danh sách public feed (tối đa limit items)
 * Dùng SWR để cache, không SSE.
 */
export const usePublicFeed = (limit: number = 10) => {
    const key = `/api/v1/public-feed?limit=${limit}`;
    return useSWRUser<PublicFeedResponse>(key);
};

