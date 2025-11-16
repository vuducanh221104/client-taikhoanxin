'use client';

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import Toast, { ToastVariant } from './Toast';
import classNames from 'classnames/bind';
import styles from './ToastProvider.module.scss';

const cx = classNames.bind(styles);

interface ToastItem {
    id: string;
    message: string;
    variant: ToastVariant;
    duration: number;
}

interface ToastContextType {
    showToast: (message: string, variant?: ToastVariant, duration?: number) => void;
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const showToast = useCallback((message: string, variant: ToastVariant = 'info', duration: number = 5000) => {
        const id = `toast-${Date.now()}-${Math.random()}`;
        const newToast: ToastItem = { id, message, variant, duration };
        
        setToasts((prev) => [...prev, newToast]);
    }, []);

    const success = useCallback((message: string, duration: number = 5000) => {
        showToast(message, 'success', duration);
    }, [showToast]);

    const error = useCallback((message: string, duration: number = 5000) => {
        showToast(message, 'error', duration);
    }, [showToast]);

    const warning = useCallback((message: string, duration: number = 5000) => {
        showToast(message, 'warning', duration);
    }, [showToast]);

    const info = useCallback((message: string, duration: number = 5000) => {
        showToast(message, 'info', duration);
    }, [showToast]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
            {children}
            <div className={cx('toast-container')}>
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        id={toast.id}
                        message={toast.message}
                        variant={toast.variant}
                        duration={toast.duration}
                        onClose={removeToast}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};
