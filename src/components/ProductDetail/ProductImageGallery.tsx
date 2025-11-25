'use client';

import React, { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames/bind';
import styles from './ProductImageGallery.module.scss';
import ImageGallery from './ImageGallery';
import ImageZoom from './ImageZoom';

const cx = classNames.bind(styles);

interface ProductImageGalleryProps {
    images: string[];
    productName: string;
    features?: Array<{
        title: string;
        description: string;
    }>;
    productKey?: string; // Key to identify product variant for resetting state
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images, productName, features = [], productKey }) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    
    // Reset selectedImage when images change (e.g., variant change)
    useEffect(() => {
        setSelectedImage(0);
    }, [productKey, images?.length]);
    
    // Preload images when they change
    useEffect(() => {
        if (images && images.length > 0) {
            // Preload all images in the background
            images.forEach((imageSrc) => {
                if (imageSrc) {
                    const img = new window.Image();
                    img.src = imageSrc;
                }
            });
        }
    }, [images]);

    const hasMultipleImages = useMemo(() => images && images.length > 1, [images?.length]);
    
    // Ensure selectedImage is valid
    const validSelectedImage = useMemo(() => {
        if (!images || images.length === 0) return 0;
        return Math.min(selectedImage, images.length - 1);
    }, [selectedImage, images?.length]);

    const handleViewMore = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsGalleryOpen(true);
    };

    const handleImageClick = () => {
        if (hasMultipleImages) {
            setIsGalleryOpen(true);
        }
    };

    return (
        <>
            <div className={cx('product-image-gallery')}>
                <div
                    className={cx('main-image-wrapper', { 'clickable': hasMultipleImages })}
                    onClick={handleImageClick}
                >
                    {images && images.length > 0 && images[validSelectedImage] ? (
                        <ImageZoom
                            key={`${productKey}-${validSelectedImage}-${images[validSelectedImage]}`}
                            src={images[validSelectedImage]}
                            alt={`${productName} - Image ${validSelectedImage + 1}`}
                            enableZoom={true}
                            zoomLevel={2.5}
                            className={cx('zoom-wrapper')}
                        />
                    ) : (
                        <div className={cx('image-placeholder')}>
                            <span>No Image</span>
                        </div>
                    )}
                </div>

                {hasMultipleImages && (
                    <div className={cx('view-more-link')}>
                        <button 
                            onClick={handleViewMore}
                            className={cx('view-more-button')}
                            type="button"
                            aria-label="View all images in gallery"
                        >
                            Xem thêm ảnh ({images.length})
                        </button>
                    </div>
                )}
            </div>

            <ImageGallery
                images={images}
                features={features}
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                initialIndex={validSelectedImage}
            />
        </>
    );
};

export default ProductImageGallery;

