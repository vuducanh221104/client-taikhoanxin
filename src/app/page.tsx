'use client';

import React, { useMemo, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './page.module.scss';
import HeroBanner from '@/components/HeroBanner';
import BannerSlider from '@/components/BannerSlider';
import FeaturedProducts from '@/components/FeaturedProducts';
import FeaturedProductSection from '@/components/FeaturedProductSection/FeaturedProductSection';
import CategoryIcons from '@/components/CategoryIcons';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { addToCart } from '@/redux/cartSlice';
import { FeaturedProduct } from '@/components/FeaturedProducts';
import { useToast } from '@/hooks/useToast';
import { useHomePage, FeaturedProductSection as FeaturedProductSectionType, ProductSection } from '@/services/homePageService';
import { useProducts, usePopularProducts, useFeaturedProducts, useBestSellingProducts, useProductsByIds, mapProductToFeaturedProduct, parseProductQuery } from '@/services/productService';

const cx = classNames.bind(styles);

export default function Home() {
    const dispatch = useDispatch<AppDispatch>();
    const { showSuccess } = useToast();
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

    // Map API data to component format
    const heroBanners = useMemo(() => {
        if (!homePageData?.data) return [];
        
        const bannerData = isMobile 
            ? homePageData.data.bannerSlideMoblie || []
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
        }));
        showSuccess(`Đã thêm "${product.productName}" vào giỏ hàng`);
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
                                    <HeroBanner bannerData={displaySmallBanners[0]} priority={false} />
                                </div>
                            ) : (
                                <div className={cx('banner-small')}>
                                    <div style={{ width: '100%', height: '100%', background: '#f0f0f0' }} />
                                </div>
                            )}
                            {displaySmallBanners[1] ? (
                                <div className={cx('banner-small')}>
                                    <HeroBanner bannerData={displaySmallBanners[1]} priority={false} />
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

            {/* Featured Product Sections from API */}
            {featuredProductSections.map((section) => (
                <FeaturedProductSection
                    key={section._id || `section-${section.numberSort}`}
                    section={section}
                    onAddToCart={handleAddToCart}
                />
            ))}

            {/* Best Selling Products Section from API */}
            {bestSellingSection && (
                <FeaturedProducts
                    title={bestSellingSection.title || "Sản phẩm bán chạy nhất"}
                    subtitle={bestSellingSection.description || "Những sản phẩm được khách hàng yêu thích và tin dùng"}
                    discoverButtonText="Khám phá"
                    discoverButtonHref={bestSellingSection.linkViewAll || "/products/best-selling"}
                    backgroundImage={bestSellingSection.image || "/banners/image.png"}
                    isDarkBackground={true}
                    badge="HOT"
                    products={bestSellingProducts}
                    isLoading={bestSellingIsLoading}
                    onAddToCart={handleAddToCart}
                />
            )}
        </div>
    );
}
