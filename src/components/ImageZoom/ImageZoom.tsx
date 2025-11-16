'use client';

import { useEffect } from 'react';

export default function ImageZoom() {
    useEffect(() => {
        const handleImageClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            
            // Check if clicked element is an image inside helpContent
            if (target.tagName === 'IMG' && target.closest('.helpContent')) {
                const img = target as HTMLImageElement;
                
                // Create overlay
                const overlay = document.createElement('div');
                overlay.className = 'image-zoom-overlay';
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.9);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: zoom-out;
                    animation: fadeIn 0.3s ease;
                `;
                
                // Create zoomed image
                const zoomedImg = document.createElement('img');
                zoomedImg.src = img.src;
                zoomedImg.alt = img.alt;
                zoomedImg.style.cssText = `
                    max-width: 90%;
                    max-height: 90vh;
                    object-fit: contain;
                    border-radius: 8px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                    animation: zoomIn 0.3s ease;
                `;
                
                // Create close button
                const closeButton = document.createElement('button');
                closeButton.innerHTML = '✕';
                closeButton.style.cssText = `
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    width: 48px;
                    height: 48px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                `;
                
                closeButton.onmouseover = () => {
                    closeButton.style.background = 'rgba(255, 255, 255, 0.2)';
                    closeButton.style.transform = 'rotate(90deg)';
                };
                
                closeButton.onmouseout = () => {
                    closeButton.style.background = 'rgba(255, 255, 255, 0.1)';
                    closeButton.style.transform = 'rotate(0deg)';
                };
                
                // Close on click
                const closeOverlay = () => {
                    overlay.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(() => overlay.remove(), 300);
                };
                
                overlay.onclick = closeOverlay;
                closeButton.onclick = closeOverlay;
                
                // Close on ESC key
                const handleEsc = (e: KeyboardEvent) => {
                    if (e.key === 'Escape') {
                        closeOverlay();
                        document.removeEventListener('keydown', handleEsc);
                    }
                };
                document.addEventListener('keydown', handleEsc);
                
                // Append elements
                overlay.appendChild(zoomedImg);
                overlay.appendChild(closeButton);
                document.body.appendChild(overlay);
                
                // Prevent body scroll
                document.body.style.overflow = 'hidden';
                overlay.addEventListener('remove', () => {
                    document.body.style.overflow = '';
                });
            }
        };
        
        document.addEventListener('click', handleImageClick);
        
        return () => {
            document.removeEventListener('click', handleImageClick);
        };
    }, []);
    
    return null;
}
