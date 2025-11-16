'use client';

import React, { useState, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './ImageZoom.module.scss';
import { Image } from '@/components/Image';

const cx = classNames.bind(styles);

interface ImageZoomProps {
    src: string;
    alt: string;
    zoomLevel?: number;
    enableZoom?: boolean;
    className?: string;
}

const ImageZoom: React.FC<ImageZoomProps> = ({
    src,
    alt,
    zoomLevel = 2,
    enableZoom = true,
    className,
}) => {
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!enableZoom || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setZoomPosition({ x, y });
    };

    const handleMouseEnter = () => {
        if (enableZoom) {
            setIsZoomed(true);
        }
    };

    const handleMouseLeave = () => {
        setIsZoomed(false);
    };

    const handleClick = () => {
        if (enableZoom) {
            setIsZoomed(!isZoomed);
        }
    };

    return (
        <div
            ref={containerRef}
            className={cx('image-zoom-container', className, { 'zoomed': isZoomed })}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            <div 
                className={cx('image-wrapper')}
                style={
                    isZoomed
                        ? {
                              transform: `scale(${zoomLevel})`,
                              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                          }
                        : {}
                }
            >
                <Image
                    src={src}
                    alt={alt}
                    className={cx('zoom-image')}
                />
            </div>
            {enableZoom && (
                <div className={cx('zoom-indicator')}>
                    <span>🔍 Click để phóng to</span>
                </div>
            )}
        </div>
    );
};

export default ImageZoom;

