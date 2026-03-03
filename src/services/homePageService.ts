'use client';
import { useSWRUser } from './swrConfig';
import { Product } from './productService';

// ============================================
// TYPES
// ============================================
export interface BannerItem {
    _id?: string;
    numberSort: number;
    href: string;
    image: string;
}

export interface CategorySection {
    href: string;
    image: string;
}

export interface NewsSection {
    href: string;
    image: string;
}

export interface PopupSection {
    text: string;
    href: string;
    image: string;
}

export interface TopupSection {
    title: string;
    content: string;
    isEnabled: boolean;
}

export interface MenuItem {
    _id?: string;
    href: string;
    image: string;
    text: string;
    sortOrder: number;
}

export interface TrendingSearchSection {
    title: string;
    defaultValue: string;
    items: string[];
}

export interface FeaturedProductSection {
    _id?: string;
    numberSort: number;
    title: string;
    query?: string; // Query string for fetching products (optional if productIds is provided)
    productIds?: string[]; // Array of product IDs to display specific products (takes priority over query)
    products?: Product[]; // Populated products when productIds is provided (from backend)
    linkViewAll: string;
    description: string;
}

export interface ProductSection {
    title: string;
    description: string;
    image: string;
    linkViewAll: string;
    query?: string; // Query string for fetching products, e.g., ?categorySlug=lam-viec&limit=8
    productIds?: string[]; // Array of product IDs to display specific products (takes priority over query)
    products?: Product[]; // Populated products when productIds is provided (from backend)
}

export interface HomePage {
    _id: string;
    banner: BannerItem[]; // 2 ảnh nhỏ (desktop)
    bannerSlide: BannerItem[]; // Ảnh to slider (desktop)
    bannerMoblie: BannerItem[]; // 2 ảnh nhỏ (mobile)
    bannerSlideMoblie: BannerItem[]; // Ảnh to slider (mobile)
    category: CategorySection;
    news: NewsSection;
    popup: PopupSection;
    topup: TopupSection; // Thông báo từ admin
    menu: MenuItem[];
    trendingSearch: TrendingSearchSection;
    featuredProduct: FeaturedProductSection[];
    productBestSelling: ProductSection;
    other: ProductSection;
    paymentpromo?: string; // Ưu đãi thanh toán hiển thị trên tất cả sản phẩm
    createdAt: string;
    updatedAt: string;
}

export interface HomePageResponse {
    success: boolean;
    data: HomePage;
}

// ============================================
// GET HOOKS (SWR)
// ============================================

/**
 * Get homepage data
 */
export const useHomePage = () => {
    const key = '/api/v1/homepage';
    return useSWRUser<HomePageResponse>(key);
};

