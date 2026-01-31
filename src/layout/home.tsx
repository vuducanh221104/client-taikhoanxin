'use client';

import React, { useMemo, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import classNames from 'classnames/bind';
import styles from '@/app/page.module.scss';
// Lazy load heavy components for better performance
const HeroBanner = dynamic(() => import('@/components/HeroBanner'), {
    ssr: true,
});
const BannerSlider = dynamic(() => import('@/components/BannerSlider'), {
    ssr: true,
});
const CategoryIcons = dynamic(() => import('@/components/CategoryIcons'), {
    ssr: true,
    loading: () => <div style={{ height: '150px' }} aria-label="Loading categories" />,
});
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { addToCart } from '@/redux/cartSlice';
import { FeaturedProduct } from '@/components/FeaturedProducts';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';
import { useHomePage, FeaturedProductSection as FeaturedProductSectionType } from '@/services/homePageService';
import { useProducts, usePopularProducts, useFeaturedProducts, useBestSellingProducts, useProductsByIds, mapProductToFeaturedProduct, parseProductQuery } from '@/services/productService';
import { ProductListSkeleton } from '@/components/Skeleton';

// Lazy load heavy components for better performance
const FeaturedProducts = dynamic(() => import('@/components/FeaturedProducts'), {
    loading: () => <ProductListSkeleton count={4} />,
    ssr: true,
});

const FeaturedProductSection = dynamic(
    () => import('@/components/FeaturedProductSection/FeaturedProductSection'),
    {
        loading: () => <ProductListSkeleton count={4} />,
        ssr: true,
    }
);

const cx = classNames.bind(styles);

export default function Home() {
    const dispatch = useDispatch<AppDispatch>();
    const { showSuccess } = useToast();
    const router = useRouter();
    const { data: homePageData, error, isLoading } = useHomePage();
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile screen size
    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 999);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Preload first banner image for faster loading
    useEffect(() => {
        if (typeof window === 'undefined' || !homePageData?.data) return;
        
        const bannerData = isMobile 
            ? homePageData.data.bannerMoblie || []
            : homePageData.data.bannerSlide || [];
        
        const firstBanner = bannerData.sort((a, b) => a.numberSort - b.numberSort)[0];
        if (!firstBanner?.image) return;
        
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = firstBanner.image;
        link.setAttribute('fetchpriority', 'high');
        document.head.appendChild(link);
        
        return () => {
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
        };
    }, [homePageData?.data, isMobile]);

    // Map API data to component format
    const heroBanners = useMemo(() => {
        if (!homePageData?.data) return [];
        
        const bannerData = isMobile 
            ? homePageData.data.bannerMoblie || []
            : homePageData.data.bannerSlide || [];
        
        return bannerData
            .sort((a, b) => a.numberSort - b.numberSort)
            .map((item, index) => ({
                id: item._id || `banner-${index}`,
                image: item.image || '',
                href: item.href || '',
                title: '',
            }));
    }, [homePageData, isMobile]);

    const smallBanners = useMemo(() => {
        if (!homePageData?.data) return [];
        
        const bannerData = isMobile
            ? homePageData.data.bannerMoblie || []
            : homePageData.data.banner || [];
        
        return bannerData
            .sort((a, b) => a.numberSort - b.numberSort)
            .slice(0, 2) // Chỉ lấy 2 ảnh nhỏ
            .map((item, index) => ({
                id: item._id || `small-banner-${index}`,
                image: item.image || '',
                href: item.href || '',
            }));
    }, [homePageData, isMobile]);
 
    // Get featuredProduct sections sorted by numberSort
    const featuredProductSections = useMemo(() => {
        if (!homePageData?.data?.featuredProduct || homePageData.data.featuredProduct.length === 0) {
            return [];
        }

        return homePageData.data.featuredProduct
            .sort((a: FeaturedProductSectionType, b: FeaturedProductSectionType) => (a.numberSort || 0) - (b.numberSort || 0));
    }, [homePageData]);

    // Get productBestSelling section data
    const bestSellingSection = useMemo(() => {
        return homePageData?.data?.productBestSelling;
    }, [homePageData]);

    const bestSellingProvidedProducts = bestSellingSection?.products && bestSellingSection.products.length > 0
        ? bestSellingSection.products
        : null;

    // Parse query from productBestSelling to fetch products
    const bestSellingQueryResult = useMemo(() => {
        if (!bestSellingSection?.query) return null;
        return parseProductQuery(bestSellingSection.query);
    }, [bestSellingSection]);

    // Call all possible hooks (React rules: hooks must be called unconditionally)
    const bestSellingProductsByCategorySlug = useFeaturedProducts(
        bestSellingQueryResult?.params?.categorySlug 
            ? { categorySlug: bestSellingQueryResult.params.categorySlug, limit: bestSellingQueryResult.params.limit || 8 }
            : undefined
    );
    const bestSellingProductsByCategoryId = useFeaturedProducts(
        bestSellingQueryResult?.params?.categoryId && !bestSellingQueryResult.params.categorySlug
            ? { categoryId: bestSellingQueryResult.params.categoryId, limit: bestSellingQueryResult.params.limit || 8 }
            : undefined
    );
    const bestSellingProductsPopular = usePopularProducts(bestSellingQueryResult?.params?.limit || 12);
    const bestSellingProductsFromAPI = useBestSellingProducts(
        bestSellingQueryResult?.useBestSelling && bestSellingQueryResult.params
            ? { page: bestSellingQueryResult.params.page || 1, limit: bestSellingQueryResult.params.limit || 8 }
            : undefined
    );
    const bestSellingProductsDefault = useProducts({ 
        sortBy: 'sold', 
        sortOrder: 'desc', 
        isActive: true, 
        limit: bestSellingQueryResult?.params?.limit || 12 
    });
    const bestSellingProductsByIds = useProductsByIds(
        bestSellingSection?.productIds && bestSellingSection.productIds.length > 0 && !bestSellingProvidedProducts
            ? bestSellingSection.productIds
            : undefined
    );

    // Select the correct query result based on query type
    const bestSellingProductsQuery = useMemo(() => {
        if (!bestSellingQueryResult) {
            return bestSellingProductsDefault;
        }

        if (bestSellingQueryResult.useBestSelling) {
            // Use best-selling API endpoint
            return bestSellingProductsFromAPI;
        } else if (bestSellingQueryResult.usePopular) {
            return bestSellingProductsPopular;
        } else if (bestSellingQueryResult.params?.categorySlug) {
            return bestSellingProductsByCategorySlug;
        } else if (bestSellingQueryResult.params?.categoryId) {
            return bestSellingProductsByCategoryId;
        } else {
            return bestSellingProductsDefault;
        }
    }, [bestSellingQueryResult, bestSellingProductsByCategorySlug, bestSellingProductsByCategoryId, bestSellingProductsPopular, bestSellingProductsFromAPI, bestSellingProductsDefault]);

    // Map best selling products
    const bestSellingProducts = useMemo(() => {
        if (bestSellingProvidedProducts && bestSellingProvidedProducts.length > 0) {
            return bestSellingProvidedProducts.map(mapProductToFeaturedProduct);
        }

        if (bestSellingProductsByIds?.data?.data && bestSellingProductsByIds.data.data.length > 0) {
            return bestSellingProductsByIds.data.data.map(mapProductToFeaturedProduct);
        }

        if (!bestSellingProductsQuery?.data?.data) return [];
        return bestSellingProductsQuery.data.data.map(mapProductToFeaturedProduct);
    }, [bestSellingProvidedProducts, bestSellingProductsByIds?.data, bestSellingProductsQuery?.data]);

    const bestSellingIsLoading = bestSellingProvidedProducts
        ? false
        : bestSellingProductsByIds?.isLoading || bestSellingProductsQuery?.isLoading;

    const handleAddToCart = (product: FeaturedProduct) => {
        dispatch(addToCart({
            id: product.id,
            productName: product.productName,
            price: product.price,
            oldPrice: product.oldPrice,
            imageSrc: product.imageSrc,
            imageAlt: product.imageAlt,
            href: product.href,
            stock: product.stock,
            min: product.min,
            max: product.max,
        }));
        showSuccess(`Đã thêm "${product.productName}" vào giỏ hàng`, 3000, () => {
            router.push('/cart');
        });
    };

    // Loading state - show skeleton or fallback
    if (isLoading) {
        return (
            <div className={cx('home-container')}>
                <div className={cx('hero-banners-section')}>
                    <div className="container-wide">
                        <div className={cx('hero-banners-grid')}>
                            <div className={cx('banner-large')}>
                                <div style={{ width: '100%', height: '100%', background: '#f0f0f0' }} />
                            </div>
                            <div className={cx('banners-small-wrapper')}>
                                <div className={cx('banner-small')}>
                                    <div style={{ width: '100%', height: '100%', background: '#f0f0f0' }} />
                                </div>
                                <div className={cx('banner-small')}>
                                    <div style={{ width: '100%', height: '100%', background: '#f0f0f0' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state - fallback to empty arrays
    const displayHeroBanners = error ? [] : heroBanners;
    const displaySmallBanners = error ? [] : smallBanners;

    return (
        <div className={cx('home-container')}>
            {/* Hero Banners Section */}
            <div className={cx('hero-banners-section')}>
                <div className="container-wide">
                    <div className={cx('hero-banners-grid')}>
                        {/* Large Left Banner - Slider */}
                        <div className={cx('banner-large')}>
                            {displayHeroBanners.length > 0 ? (
                                <BannerSlider 
                                    banners={displayHeroBanners} 
                                    autoSlide={true}
                                    slideInterval={5000}
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span>Chưa có banner</span>
                                </div>
                            )}
                        </div>

                        {/* Right Side - Two Small Banners (CSS hides on small screens) */}
                        <div className={cx('banners-small-wrapper')}>
                            {displaySmallBanners[0] ? (
                                <div className={cx('banner-small')}>
                                    <HeroBanner bannerData={displaySmallBanners[0]} priority={true} />
                                </div>
                            ) : (
                                <div className={cx('banner-small')}>
                                    <div style={{ width: '100%', height: '100%', background: '#f0f0f0' }} />
                                </div>
                            )}
                            {displaySmallBanners[1] ? (
                                <div className={cx('banner-small')}>
                                    <HeroBanner bannerData={displaySmallBanners[1]} priority={true} />
                                </div>
                            ) : (
                                <div className={cx('banner-small')}>
                                    <div style={{ width: '100%', height: '100%', background: '#f0f0f0' }} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Icons Section */}
            <CategoryIcons />

            {/* Featured Product Section đầu tiên (nếu có) - Vị trí 1 */}
            {featuredProductSections.length > 0 && (
                <FeaturedProductSection
                    key={featuredProductSections[0]._id || `section-${featuredProductSections[0].numberSort}`}
                    section={featuredProductSections[0]}
                    onAddToCart={handleAddToCart}
                />
            )}

            {/* Best Selling Products Section - Luôn ở vị trí 2 */}
            {bestSellingSection && (
                <FeaturedProducts
                    title={bestSellingSection.title || "Sản phẩm bán chạy nhất"}
                    subtitle={bestSellingSection.description || "Những sản phẩm được khách hàng yêu thích và tin dùng"}
                    discoverButtonText="Xem tất cả"
                    discoverButtonHref={bestSellingSection.linkViewAll || "/categories/san-pham-ban-chay"}
                    backgroundImage={bestSellingSection.image || "/banners/image.png"}
                    isDarkBackground={true}
                    badge="HOT"
                    products={bestSellingProducts}
                    isLoading={bestSellingIsLoading}
                    onAddToCart={handleAddToCart}
                />
            )}

            {/* Các Featured Product Sections còn lại (từ index 1 trở đi) - Sau Best Selling */}
            {featuredProductSections.slice(1).map((section) => (
                <FeaturedProductSection
                    key={section._id || `section-${section.numberSort}`}
                    section={section}
                    onAddToCart={handleAddToCart}
                />
            ))}
        </div>
    );
}

