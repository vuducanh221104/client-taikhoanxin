'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import classNames from 'classnames/bind';
import styles from './BannerSlider.module.scss';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/Icons';

const cx = classNames.bind(styles);

interface BannerData {
    id: string;
    image: string;
    href: string;
    title?: string;
}

interface BannerSliderProps {
    banners: BannerData[];
    autoSlide?: boolean;
    slideInterval?: number;
}

const BannerSlider: React.FC<BannerSliderProps> = ({ 
    banners, 
    autoSlide = true, 
    slideInterval = 5000 
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [touchStart, setTouchStart] = useState<{x: number; y: number; time: number} | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleNextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    const handlePrevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    const handleDotClick = (index: number) => {
        if (index === currentIndex) return;
        setCurrentIndex(index);
    };

    useEffect(() => {
        // prefers-reduced-motion
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReducedMotion(media.matches);
        update();
        media.addEventListener?.('change', update);
        return () => media.removeEventListener?.('change', update);
    }, []);

    useEffect(() => {
        if (!autoSlide || banners.length <= 1 || isPaused || reducedMotion) return;
        const id = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, slideInterval);
        return () => clearInterval(id);
    }, [autoSlide, slideInterval, banners.length, isPaused, reducedMotion]);

    // Pause when tab is hidden
    useEffect(() => {
        const handleVisibility = () => setIsPaused(document.hidden);
        document.addEventListener('visibilitychange', handleVisibility);
        return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, []);

    if (banners.length === 0) return null;

    // Note: API already returns correct URLs for mobile (bannerSlideMoblie) and desktop (bannerSlide)
    // No need to transform URLs anymore

    return (
        <div
            className={cx('banner-slider')}
            role="region"
            aria-label="Banner carousel"
        >
            {/* Slider Container */}
            <div
                className={cx('slider-container', { 'is-hovered': isHovered })}
                onMouseEnter={() => {
                    setIsPaused(true);
                    setIsHovered(true);
                }}
                onMouseLeave={() => {
                    setIsPaused(false);
                    setIsHovered(false);
                }}
                onFocus={() => {
                    setIsPaused(true);
                    setIsHovered(true);
                }}
                onBlur={() => {
                    setIsPaused(false);
                    setIsHovered(false);
                }}
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'ArrowRight') handleNextSlide();
                    if (e.key === 'ArrowLeft') handlePrevSlide();
                }}
                onTouchStart={(e) => {
                    const t = e.touches[0];
                    setTouchStart({ x: t.clientX, y: t.clientY, time: Date.now() });
                    setIsPaused(true);
                }}
                onTouchMove={(e) => {
                    // prevent vertical scroll only for strong horizontal gesture
                    if (!touchStart) return;
                    const t = e.touches[0];
                    const dx = Math.abs(t.clientX - touchStart.x);
                    const dy = Math.abs(t.clientY - touchStart.y);
                    if (dx > dy && dx > 10) {
                        // hint to browser this is a horizontal gesture
                        // no-op, touch-action: pan-y handles the rest
                    }
                }}
                onTouchEnd={(e) => {
                    if (!touchStart) return setIsPaused(false);
                    const t = e.changedTouches[0];
                    const dx = t.clientX - touchStart.x;
                    const dy = t.clientY - touchStart.y;
                    const dt = Date.now() - touchStart.time;
                    const absX = Math.abs(dx);
                    const absY = Math.abs(dy);
                    const isHorizontal = absX > absY && absX > 40 && dt < 500;
                    if (isHorizontal) {
                        if (dx < 0) handleNextSlide();
                        else handlePrevSlide();
                    }
                    setTouchStart(null);
                    setIsPaused(false);
                }}
            >
                <div 
                    className={cx('slider-wrapper')}
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {banners.map((banner, index) => {
                        const isFirstSlide = index === 0;
                        
                        return (
                            <div key={banner.id} className={cx('slide')}>
                                <Link href={banner.href} className={cx('banner-link')}>
                                    <Image
                                        src={banner.image}
                                        alt={banner.title || `Banner ${index + 1}`}
                                        width={1345}
                                        height={915}
                                        className={cx('slide-image')}
                                        priority={isFirstSlide}
                                        loading={isFirstSlide ? 'eager' : 'lazy'}
                                        fetchPriority={isFirstSlide ? 'high' : 'low'}
                                        sizes="(max-width: 999px) 100vw, 66vw"
                                    />
                                </Link>
                            </div>
                        );
                    })}
                </div>

                {/* Navigation Overlay - Gradient */}
                {banners.length > 1 && (
                    <>
                        <div className={cx('nav-overlay', 'nav-overlay-left')} />
                        <div className={cx('nav-overlay', 'nav-overlay-right')} />
                    </>
                )}

                {/* Navigation Arrows */}
                {banners.length > 1 && (
                    <>
                        <button 
                            className={cx('nav-arrow', 'nav-arrow-prev')}
                            onClick={handlePrevSlide}
                            aria-label="Previous slide"
                            type="button"
                        >
                            <ChevronLeftIcon />
                        </button>
                        <button 
                            className={cx('nav-arrow', 'nav-arrow-next')}
                            onClick={handleNextSlide}
                            aria-label="Next slide"
                            type="button"
                        >
                            <ChevronRightIcon size={24} />
                        </button>
                    </>
                )}
            </div>

            {/* Dots Indicator */}
            {banners.length > 1 && (
                <div className={cx('dots-container')}>
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            className={cx('dot', currentIndex === index && 'active')}
                            onClick={() => handleDotClick(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            aria-current={currentIndex === index ? 'true' : undefined}
                            type="button"
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default BannerSlider;