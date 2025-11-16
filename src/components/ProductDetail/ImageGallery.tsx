'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import classNames from 'classnames/bind';
import styles from './ImageGallery.module.scss';
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from '@/components/Icons';
import ImageZoom from './ImageZoom';

const cx = classNames.bind(styles);

interface ImageGalleryProps {
    images: string[];
    features?: Array<{
        title: string;
        description: string;
    }>;
    isOpen: boolean;
    onClose: () => void;
    initialIndex?: number;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
    images,
    features = [],
    isOpen,
    onClose,
    initialIndex = 0,
}) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handlePrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }, [images.length]);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, [images.length]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowLeft') {
                handlePrevious();
            } else if (e.key === 'ArrowRight') {
                handleNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, handlePrevious, handleNext]);

    const handleDotClick = (index: number) => {
        setCurrentIndex(index);
    };

    if (!isOpen) return null;

    return (
        <div className={cx('image-gallery-overlay')} onClick={onClose}>
            <div className={cx('image-gallery-container')} onClick={(e) => e.stopPropagation()}>
                <button className={cx('gallery-close-button')} onClick={onClose} aria-label="Close gallery">
                    <XIcon size={24} />
                </button>

                <div className={cx('gallery-slide')}>
                    <div className={cx('slide-content')}>
                        <div className={cx('slide-image-wrapper')}>
                            {images && images[currentIndex] ? (
                                <ImageZoom
                                    src={images[currentIndex]}
                                    alt={`Gallery image ${currentIndex + 1}`}
                                    enableZoom={true}
                                    zoomLevel={3}
                                    className={cx('gallery-zoom')}
                                />
                            ) : (
                                <div className={cx('image-placeholder')}>
                                    <span>No Image</span>
                                </div>
                            )}
                        </div>

                        {/* Features Section */}
                        {features.length > 0 && (
                            <div className={cx('slide-features')}>
                                <div className={cx('features-badge')}>
                                    <StarIcon className={cx('star-icon')} />
                                    <span>TÍNH NĂNG</span>
                                </div>
                                <ul className={cx('features-list')}>
                                    {features.map((feature, index) => (
                                        <li key={index} className={cx('feature-item')}>
                                            <CheckIcon className={cx('check-icon')} />
                                            <span>{feature.title}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                className={cx('gallery-nav-button', 'nav-prev')}
                                onClick={handlePrevious}
                                aria-label="Previous image"
                            >
                                <ChevronLeftIcon size={24} />
                            </button>
                            <button
                                className={cx('gallery-nav-button', 'nav-next')}
                                onClick={handleNext}
                                aria-label="Next image"
                            >
                                <ChevronRightIcon size={24} />
                            </button>
                        </>
                    )}
                </div>

                {/* Pagination Dots */}
                {images.length > 1 && (
                    <div className={cx('gallery-pagination')}>
                        {images.map((_, index) => (
                            <button
                                key={index}
                                className={cx('pagination-dot', { active: index === currentIndex })}
                                onClick={() => handleDotClick(index)}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Star Icon Component
const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className}>
        <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill="currentColor"
        />
    </svg>
);

// Check Icon Component
const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className}>
        <path
            d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
            fill="currentColor"
        />
    </svg>
);

export default ImageGallery;

