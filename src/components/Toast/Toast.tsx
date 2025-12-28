'use client';

import React, { useEffect } from 'react';
import classNames from 'classnames/bind';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import styles from './Toast.module.scss';

const cx = classNames.bind(styles);

// Kiểu toast chính dùng nội bộ
export type ToastType = 'success' | 'error' | 'warning' | 'info';
// Alias để tương thích với export cũ (ToastVariant)
export type ToastVariant = ToastType;

export interface ToastProps {
    id: string;
    message: string;
    variant?: ToastType;
    duration?: number;
    onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
    id,
    message,
    variant = 'info',
    duration = 5000,
    onClose,
}) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose(id);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [id, duration, onClose]);

    const getIcon = () => {
        switch (variant) {
            case 'success':
                return <CheckCircle size={20} />;
            case 'error':
                return <AlertCircle size={20} />;
            case 'warning':
                return <AlertTriangle size={20} />;
            case 'info':
                return <Info size={20} />;
            default:
                return <Info size={20} />;
        }
    };

    return (
        <div className={cx('toast', variant)}>
            <div className={cx('toast-icon')}>{getIcon()}</div>
            <div className={cx('toast-message')}>{message}</div>
            <button
                className={cx('toast-close')}
                onClick={() => onClose(id)}
                aria-label="Close notification"
            >
                <X size={18} />
            </button>
        </div>
    );
};

export default Toast;
