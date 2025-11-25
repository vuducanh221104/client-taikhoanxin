'use client';

import React, { useState, useCallback, useEffect } from 'react';
import NextImage from 'next/image';
import classNames from 'classnames/bind';
import styles from './Image.module.scss';
import { Image as ImageIcon } from 'lucide-react';

const cx = classNames.bind(styles);

export interface ImageProps extends Omit<React.ComponentPropsWithoutRef<typeof NextImage>, 'onError' | 'onLoad'> {
    fallbackSrc?: string;
    showPlaceholder?: boolean;
    onError?: () => void;
    onLoad?: () => void;
    lazy?: boolean;
    blurDataURL?: string;
}

const Image: React.FC<ImageProps> = ({
    src,
    alt,
    fallbackSrc,
    showPlaceholder = true,
    onError,
    onLoad,
    className,
    width,
    height,
    lazy = true,
    blurDataURL,
    ...props
}) => {
    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentSrc, setCurrentSrc] = useState(src);
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

    useEffect(() => {
        // Check if image is already loaded (cached)
        if (loadedImages.has(src)) {
            setCurrentSrc(src);
            setImageError(false);
            setIsLoading(false);
            return;
        }
        
        setCurrentSrc(src);
        setImageError(false);
        setIsLoading(true);
    }, [src, loadedImages]);

    const handleError = useCallback(() => {
        if (!imageError && fallbackSrc && currentSrc !== fallbackSrc) {
            // Try fallback
            setCurrentSrc(fallbackSrc);
            setImageError(false);
            setIsLoading(true);
        } else {
            // All options exhausted
            setImageError(true);
            setIsLoading(false);
            onError?.();
        }
    }, [imageError, fallbackSrc, currentSrc, onError]);

    const handleLoad = useCallback(() => {
        setIsLoading(false);
        // Mark this image as loaded for future use
        setLoadedImages((prev) => {
            const newSet = new Set(prev);
            newSet.add(currentSrc);
            return newSet;
        });
        onLoad?.();
    }, [onLoad, currentSrc]);

    // If image failed and no fallback, show placeholder
    if (imageError && showPlaceholder) {
        const iconSize = width && typeof width === 'number' ? Math.min(Math.floor(width / 4), 48) : 48;
        return (
            <div 
                className={cx('image-placeholder', className)} 
                style={{ width, height, minHeight: height || 200 }}
            >
                <ImageIcon size={iconSize} />
                {alt && <span className={cx('image-placeholder-text')}>{alt}</span>}
            </div>
        );
    }

    // Only set wrapper width if explicitly provided
    const wrapperStyle: React.CSSProperties = {};
    if (width) {
        wrapperStyle.width = typeof width === 'number' ? `${width}px` : width;
    }

    return (
        <div className={cx('image-wrapper', className)} style={Object.keys(wrapperStyle).length > 0 ? wrapperStyle : undefined}>
            {isLoading && (
                <div className={cx('image-skeleton')} aria-hidden="true">
                    <div className={cx('image-skeleton-shimmer')} />
                </div>
            )}
            <NextImage
                src={currentSrc}
                alt={alt || ''}
                width={width || 1200}
                height={height || 1200}
                onError={handleError}
                onLoad={handleLoad}
                loading={lazy ? 'lazy' : 'eager'}
                placeholder={blurDataURL ? 'blur' : 'empty'}
                blurDataURL={blurDataURL}
                className={cx('image', { 'image-loading': isLoading, 'image-loaded': !isLoading })}
                style={width && height ? {
                    width: '100%', 
                    height: '100%', 
                    maxWidth: '100%',
                    maxHeight: '100%',
                    display: 'block',
                    margin: 0,
                    padding: 0,
                    objectFit: 'contain',
                    objectPosition: 'center'
                } : {
                    width: '100%', 
                    height: 'auto', 
                    maxWidth: '100%',
                    display: 'block',
                    margin: 0,
                    padding: 0
                }}
                {...props}
            />
        </div>
    );
};

export default Image;

