import { FeaturedProduct } from '@/components/FeaturedProducts';
import mockProductsData from '@/data/mockProducts.json';

export type ProductCategory = 'featured' | 'work' | 'ai' | 'bestSelling' | 'entertainment' | 'new' | 'office' | 'learning' | 'photo-video' | 'storage';

/**
 * Get products by category
 * @param category - Product category
 * @returns Array of products for the specified category
 */
export const getProductsByCategory = (category: ProductCategory): FeaturedProduct[] => {
    return (mockProductsData[category] as FeaturedProduct[]) || [];
};

/**
 * Get all products from all categories
 * @returns Array of all products
 */
export const getAllProducts = (): FeaturedProduct[] => {
    const categories: ProductCategory[] = ['featured', 'work', 'ai', 'bestSelling', 'entertainment', 'new', 'office', 'learning', 'photo-video', 'storage'];
    return categories.flatMap(category => getProductsByCategory(category));
};

/**
 * Map category slug to ProductCategory
 * @param slug - Category slug from URL
 * @returns ProductCategory or null if not found
 */
export const mapCategorySlugToCategory = (slug: string): ProductCategory | null => {
    const categoryMap: Record<string, ProductCategory> = {
        'office': 'office',
        'learning': 'learning',
        'ai-account': 'ai',
        'photo-video': 'photo-video',
        'storage': 'storage',
        'work': 'work',
        'entertainment': 'entertainment',
    };
    return categoryMap[slug] || null;
};

/**
 * Get a single product by ID across all categories
 * @param id - Product ID
 * @returns Product or undefined if not found
 */
export const getProductById = (id: string): FeaturedProduct | undefined => {
    const allProducts = getAllProducts();
    return allProducts.find(product => product.id === id);
};

/**
 * Get featured products (default category)
 * @returns Array of featured products
 */
export const getFeaturedProducts = (): FeaturedProduct[] => {
    return getProductsByCategory('featured');
};

/**
 * Search products by query
 * @param query - Search query string
 * @param limit - Maximum number of results (default: 5, use 0 or very large number for no limit)
 * @returns Array of matching products
 */
export const searchProducts = (query: string, limit: number = 5): FeaturedProduct[] => {
    if (!query || query.trim().length === 0) {
        return [];
    }
    
    const allProducts = getAllProducts();
    const lowerQuery = query.toLowerCase().trim();
    
    // Filter products by product name
    let results = allProducts
        .filter(product => 
            product.productName.toLowerCase().includes(lowerQuery)
        );
    
    // Apply limit if specified and > 0
    if (limit > 0) {
        results = results.slice(0, limit);
    }
    
    return results;
};

/**
 * Get the original category of a product
 * @param productId - Product ID
 * @returns Category name or null if not found
 */
export const getProductCategory = (productId: string): ProductCategory | null => {
    const categories: ProductCategory[] = ['featured', 'work', 'ai', 'bestSelling', 'entertainment', 'new', 'office', 'learning', 'photo-video', 'storage'];
    
    for (const category of categories) {
        const products = getProductsByCategory(category);
        if (products.some(p => p.id === productId)) {
            return category;
        }
    }
    
    return null;
};

/**
 * Detect product genre from product name
 * @param productName - Product name
 * @returns Genre type: 'account', 'code', 'license', or null
 */
export const detectProductGenre = (productName: string): 'account' | 'code' | 'license' | null => {
    const lowerName = productName.toLowerCase();
    
    // Check for account keywords
    if (lowerName.includes('tài khoản') || lowerName.includes('account')) {
        return 'account';
    }
    
    // Check for code keywords
    if (lowerName.includes('code') || lowerName.includes('kích hoạt') || lowerName.includes('activation')) {
        return 'code';
    }
    
    // Check for license keywords
    if (lowerName.includes('license') || lowerName.includes('bản quyền') || lowerName.includes('key')) {
        return 'license';
    }
    
    return null;
};

