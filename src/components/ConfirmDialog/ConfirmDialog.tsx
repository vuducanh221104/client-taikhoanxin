'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames/bind';
import styles from './ConfirmDialog.module.scss';
import { AlertCircleIcon, InfoIcon, CheckCircleIcon, XCircleIcon } from '@/components/Icons';

const cx = classNames.bind(styles);

export type DialogVariant = 'danger' | 'warning' | 'info' | 'success';

export interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    variant: DialogVariant;
    confirmText: string;
    cancelText: string;
    icon?: React.ReactNode;
    onConfirm: () => void;
    onCancel: () => void;
    onClose: () => void;
}

interface VariantConfig {
    color: string;
    lightColor: string;
    darkColor: string;
    icon: React.ReactNode;
    iconBg: string;
}

const variantConfig: Record<DialogVariant, VariantConfig> = {
    danger: {
        color: '#ff4757',
        lightColor: '#ff6b7a',
        darkColor: '#ff3838',
        icon: <XCircleIcon size={48} />,
        iconBg: 'linear-gradient(135deg, rgba(255, 71, 87, 0.1) 0%, rgba(255, 56, 56, 0.1) 100%)',
    },
    warning: {
        color: '#fb923c',
        lightColor: '#fb923c',
        darkColor: '#f97316',
        icon: <AlertCircleIcon size={48} />,
        iconBg: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%)',
    },
    info: {
        color: '#60a5fa',
        lightColor: '#60a5fa',
        darkColor: '#3b82f6',
        icon: <InfoIcon size={48} />,
        iconBg: 'linear-gradient(135deg, rgba(96, 165, 250, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
    },
    success: {
        color: '#34d399',
        lightColor: '#34d399',
        darkColor: '#22c55e',
        icon: <CheckCircleIcon size={48} />,
        iconBg: 'linear-gradient(135deg, rgba(52, 211, 153, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)',
    },
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    variant,
    confirmText,
    cancelText,
    icon,
    onConfirm,
    onCancel,
    onClose,
}) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    const cancelButtonRef = useRef<HTMLButtonElement>(null);
    const confirmButtonRef = useRef<HTMLButtonElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    const config = variantConfig[variant];
    const displayIcon = icon || config.icon;

    // Handle ESC key
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Body scroll lock
    useEffect(() => {
        if (!isOpen) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen]);

    // Focus management
    useEffect(() => {
        if (!isOpen) return;

        // Save previously focused element
        previousActiveElement.current = document.activeElement as HTMLElement;

        // Focus appropriate button based on variant
        // For danger/warning, focus cancel to prevent accidental confirmation
        // For info/success, focus confirm
        const focusTimeout = setTimeout(() => {
            if (variant === 'danger' || variant === 'warning') {
                cancelButtonRef.current?.focus();
            } else {
                confirmButtonRef.current?.focus();
            }
        }, 100);

        return () => {
            clearTimeout(focusTimeout);
            // Restore focus when dialog closes
            if (previousActiveElement.current) {
                previousActiveElement.current.focus();
            }
        };
    }, [isOpen, variant]);

    // Focus trap
    useEffect(() => {
        if (!isOpen) return;

        const handleTabKey = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
                'button:not([disabled])'
            );

            if (!focusableElements || focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };

        document.addEventListener('keydown', handleTabKey);
        return () => document.removeEventListener('keydown', handleTabKey);
    }, [isOpen]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    const dialogContent = (
        <div className={cx('backdrop')} onClick={handleBackdropClick}>
            <div
                ref={dialogRef}
                className={cx('dialog', `variant-${variant}`)}
                role="dialog"
                aria-modal="true"
                aria-labelledby="dialog-title"
                aria-describedby="dialog-message"
            >
                {/* Icon */}
                <div
                    className={cx('icon-container')}
                    style={{
                        background: config.iconBg,
                        color: config.color,
                    }}
                >
                    {displayIcon}
                </div>

                {/* Title */}
                <h2 id="dialog-title" className={cx('title')}>
                    {title}
                </h2>

                {/* Message */}
                <p id="dialog-message" className={cx('message')}>
                    {message}
                </p>

                {/* Buttons */}
                <div className={cx('button-group')}>
                    <button
                        ref={cancelButtonRef}
                        type="button"
                        className={cx('button', 'button-cancel')}
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                    <button
                        ref={confirmButtonRef}
                        type="button"
                        className={cx('button', 'button-confirm')}
                        style={{
                            background: `linear-gradient(135deg, ${config.color} 0%, ${config.darkColor} 100%)`,
                        }}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );

    // Render via portal
    if (typeof document !== 'undefined') {
        return createPortal(dialogContent, document.body);
    }

    return null;
};

export default ConfirmDialog;
