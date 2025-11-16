'use client';

import React, { useState } from 'react';
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
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images, productName, features = [] }) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    const hasMultipleImages = images && images.length > 1;

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
                    {images && images.length > 0 ? (
                        <ImageZoom
                            src={images[selectedImage]}
                            alt={`${productName} - Image ${selectedImage + 1}`}
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
                initialIndex={selectedImage}
            />
        </>
    );
};

export default ProductImageGallery;

