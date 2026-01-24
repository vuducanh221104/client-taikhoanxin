// REMOVED: API endpoint /api/v1/services returns 404
// This file is commented out to prevent API calls to non-existent endpoint

// 'use client';
// import { useSWRUser } from './swrConfig';

// // ============================================
// // TYPES
// // ============================================
// export interface Service {
//     _id: string;
//     name: string;
//     slug: string;
//     description: string;
//     note: string;
//     icon: string;
//     image: string;
//     duration: number;
//     durationType: string;
//     accountType: string;
//     maxSlot: number;
//     tags: string[];
//     isActive: boolean;
//     createdAt: string;
//     updatedAt: string;
// }

// export interface ServiceListResponse {
//     success: boolean;
//     data: Service[];
// }

// export interface ServiceResponse {
//     success: boolean;
//     data: Service;
// }

// // ============================================
// // GET HOOKS (SWR)
// // ============================================

// /**
//  * Get all services
//  */
// export const useServices = (params?: { isActive?: boolean }) => {
//     const queryString = params
//         ? '?' + new URLSearchParams(params as any).toString()
//         : '';
//     const key = `/api/v1/services${queryString}`;
//     return useSWRUser<ServiceListResponse>(key);
// };

// /**
//  * Get service by slug
//  */
// export const useService = (slug: string) => {
//     const key = slug ? `/api/v1/services/${slug}` : null;
//     return useSWRUser<ServiceResponse>(key);
// };

