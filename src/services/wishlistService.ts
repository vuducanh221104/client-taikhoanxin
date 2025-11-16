import mockWishlistData from '@/data/mockWishlist.json';

export interface WishlistItem {
    id: string;
    userId: string;
    productId: string;
    productName: string;
    price: number;
    oldPrice?: number;
    discount?: number;
    rating?: number;
    reviewCount?: number;
    status?: 'in-stock' | 'out-of-stock';
    imageSrc?: string;
    imageAlt?: string;
    href?: string;
    addedAt: string;
}

/**
 * Get all wishlist items for a user
 * @param userId - User ID
 * @returns Array of wishlist items, sorted by date added (newest first)
 */
export const getWishlistByUserId = (userId: string): WishlistItem[] => {
    // Check localStorage first (client-side only), fallback to mock data
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(`wishlist_${userId}`);
        if (stored) {
            try {
                const wishlist = JSON.parse(stored) as WishlistItem[];
                return wishlist.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
            } catch (error) {
                console.error('Error parsing wishlist from localStorage:', error);
            }
        }
    }
    
    // Initialize with mock data if localStorage is empty or on server-side
    const wishlist = mockWishlistData.wishlist as WishlistItem[];
    const userWishlist = wishlist
        .filter(item => item.userId === userId)
        .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
    
    // Save to localStorage for persistence (client-side only)
    if (typeof window !== 'undefined' && userWishlist.length > 0) {
        const stored = localStorage.getItem(`wishlist_${userId}`);
        if (!stored) {
            localStorage.setItem(`wishlist_${userId}`, JSON.stringify(userWishlist));
        }
    }
    
    return userWishlist;
};

/**
 * Get wishlist item by ID
 * @param itemId - Wishlist item ID
 * @returns Wishlist item or undefined if not found
 */
export const getWishlistItemById = (itemId: string): WishlistItem | undefined => {
    const wishlist = mockWishlistData.wishlist as WishlistItem[];
    return wishlist.find(item => item.id === itemId);
};

/**
 * Check if a product is in user's wishlist
 * @param userId - User ID
 * @param productId - Product ID
 * @returns True if product is in wishlist
 */
export const isProductInWishlist = (userId: string, productId: string): boolean => {
    const wishlist = getWishlistByUserId(userId);
    return wishlist.some(item => item.productId === productId);
};

/**
 * Add product to wishlist
 * @param userId - User ID
 * @param product - Product data
 * @returns The added wishlist item
 */
export const addToWishlist = (userId: string, product: Omit<WishlistItem, 'id' | 'userId' | 'addedAt'>): WishlistItem | null => {
    // In a real app, this would call an API
    // For now, we'll use localStorage to persist across page reloads
    
    if (typeof window !== 'undefined') {
        // Get current wishlist from localStorage or mock data
        const stored = localStorage.getItem(`wishlist_${userId}`);
        const existingWishlist = stored ? JSON.parse(stored) : getWishlistByUserId(userId);
        
        // Check if product already exists in wishlist
        const existingItem = existingWishlist.find((item: WishlistItem) => item.productId === product.productId);
        if (existingItem) {
            return null; // Product already in wishlist
        }
        
        const newItem: WishlistItem = {
            id: `w${Date.now()}`,
            userId,
            addedAt: new Date().toISOString(),
            ...product,
        };
        
        const updatedWishlist = [newItem, ...existingWishlist];
        localStorage.setItem(`wishlist_${userId}`, JSON.stringify(updatedWishlist));
        
        return newItem;
    }
    
    return null;
};

/**
 * Remove product from wishlist
 * @param userId - User ID
 * @param productId - Product ID
 * @returns True if removed successfully
 */
export const removeFromWishlist = (userId: string, productId: string): boolean => {
    // In a real app, this would call an API
    // For now, we'll use localStorage
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(`wishlist_${userId}`);
        const wishlist = stored ? JSON.parse(stored) : getWishlistByUserId(userId);
        const updatedWishlist = wishlist.filter((item: WishlistItem) => item.productId !== productId);
        localStorage.setItem(`wishlist_${userId}`, JSON.stringify(updatedWishlist));
    }
    return true;
};

/**
 * Remove wishlist item by ID
 * @param userId - User ID
 * @param itemId - Wishlist item ID
 * @returns True if removed successfully
 */
export const removeWishlistItemById = (userId: string, itemId: string): boolean => {
    // In a real app, this would call an API
    // For now, we'll use localStorage
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(`wishlist_${userId}`);
        const wishlist = stored ? JSON.parse(stored) : getWishlistByUserId(userId);
        const updatedWishlist = wishlist.filter((item: WishlistItem) => item.id !== itemId);
        localStorage.setItem(`wishlist_${userId}`, JSON.stringify(updatedWishlist));
    }
    return true;
};

