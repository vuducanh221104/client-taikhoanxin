'use client';

import React from 'react';
import classNames from 'classnames/bind';
import styles from './page.module.scss';
import HeroBanner from '@/components/HeroBanner';
import BannerSlider from '@/components/BannerSlider';
import FeaturedProducts from '@/components/FeaturedProducts';
import CategoryIcons from '@/components/CategoryIcons';
import { getProductsByCategory } from '@/services/productService';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { addToCart } from '@/redux/cartSlice';
import { FeaturedProduct } from '@/components/FeaturedProducts';
import { useToast } from '@/hooks/useToast';

const cx = classNames.bind(styles);

const heroBanners = [
    {
        id: '1',
        image: '/banners/1.png',
        href: '',
        title: 'Sản phẩm bán chạy nhất',
    },
    {
        id: '2',
        image: '/banners/3.png',
        href: '',
        title: 'CapCut Pro',
    },
    {
        id: '3',
        image: '/banners/4.png',
        href: '',
        title: 'English Learning',
    },
    {
        id: '4',
        image: '/banners/5.png',
        href: '',
        title: 'Adobe Creative Cloud 2',
    },
    {
        id: '5',
        image: '/banners/6.png',
        href: '',
        title: 'Netflix',
    }
];

const smallBanners = [
    {
        id: '2',
        image: '/banners/3.png',
        href: '',
    },
    {
        id: '3',
        image: '/banners/4.png',
        href: '',
    },
];

export default function Home() {
    const dispatch = useDispatch<AppDispatch>();
    const { showSuccess } = useToast();

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

    return (
        <div className={cx('home-container')}>
            {/* Hero Banners Section */}
            <div className={cx('hero-banners-section')}>
                <div className="container-wide">
                    <div className={cx('hero-banners-grid')}>
                        {/* Large Left Banner - Slider */}
                        <div className={cx('banner-large')}>
                            <BannerSlider 
                                banners={heroBanners} 
                                autoSlide={true}
                                slideInterval={5000}
                            />
                        </div>

                        {/* Right Side - Two Small Banners (CSS hides on small screens) */}
                        <div className={cx('banners-small-wrapper')}>
                            <div className={cx('banner-small')}>
                                <HeroBanner bannerData={smallBanners[0]} priority={false} />
                            </div>
                            <div className={cx('banner-small')}>
                                <HeroBanner bannerData={smallBanners[1]} priority={false} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Icons Section */}
            <CategoryIcons />

            {/* Featured Products Section */}
            <FeaturedProducts 
                products={getProductsByCategory('featured')} 
                onAddToCart={handleAddToCart}
            />

            {/* Work Products Section */}
            <FeaturedProducts
                title="Làm việc"
                subtitle="Các công cụ hỗ trợ công việc hiệu quả nhất"
                discoverButtonText="Khám phá"
                discoverButtonHref="/categories/work"
                products={getProductsByCategory('work')}
                onAddToCart={handleAddToCart}
            />

            {/* AI Products Section */}
            <FeaturedProducts
                title="Sản phẩm AI"
                subtitle="Các công cụ AI hàng đầu cho công việc và sáng tạo"
                discoverButtonText="Khám phá"
                discoverButtonHref="/categories/ai-account"
                products={getProductsByCategory('ai')}
                onAddToCart={handleAddToCart}
            />

            {/* Best Selling Products Section with Banner Background */}
            <FeaturedProducts
                title="Sản phẩm bán chạy nhất"
                subtitle="Những sản phẩm được khách hàng yêu thích và tin dùng"
                discoverButtonText="Khám phá"
                discoverButtonHref="/products/best-selling"
                backgroundImage="/banners/image.png"
                isDarkBackground={true}
                badge="HOT"
                products={getProductsByCategory('bestSelling')}
                onAddToCart={handleAddToCart}
            />

            {/* Entertainment Section */}
            <FeaturedProducts
                title="Giải trí"
                subtitle="Các dịch vụ giải trí và streaming phổ biến nhất"
                discoverButtonText="Khám phá"
                discoverButtonHref="/categories/entertainment"
                products={getProductsByCategory('entertainment')}
                onAddToCart={handleAddToCart}
            />

            {/* New Products Section */}
            <FeaturedProducts
                title="Sản phẩm mới"
                subtitle="Những sản phẩm mới nhất được cập nhật"
                discoverButtonText="Khám phá"
                discoverButtonHref="/products/new"
                products={getProductsByCategory('new')}
                onAddToCart={handleAddToCart}
            />
        </div>
    );
}
