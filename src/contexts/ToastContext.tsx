'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ToastType } from '@/components/Toast/Toast';

export interface ToastItem {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
    onClick?: () => void;
}

interface ToastContextType {
    toasts: ToastItem[];
    showToast: (message: string, type: ToastType, duration?: number, onClick?: () => void) => void;
    showSuccess: (message: string, duration?: number, onClick?: () => void) => void;
    showError: (message: string, duration?: number, onClick?: () => void) => void;
    showWarning: (message: string, duration?: number, onClick?: () => void) => void;
    showInfo: (message: string, duration?: number, onClick?: () => void) => void;
    removeToast: (id: string) => void;
    clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToastContext = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToastContext must be used within ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const showToast = useCallback((message: string, type: ToastType, duration: number = 3000, onClick?: () => void) => {
        const id = `toast-${Date.now()}-${Math.random()}`;
        const newToast: ToastItem = {
            id,
            message,
            type,
            duration,
            onClick,
        };

        setToasts((prev) => [...prev, newToast]);
    }, []);

    const showSuccess = useCallback((message: string, duration: number = 3000, onClick?: () => void) => {
        showToast(message, 'success', duration, onClick);
    }, [showToast]);

    const showError = useCallback((message: string, duration: number = 4000, onClick?: () => void) => {
        showToast(message, 'error', duration, onClick);
    }, [showToast]);

    const showWarning = useCallback((message: string, duration: number = 3000, onClick?: () => void) => {
        showToast(message, 'warning', duration, onClick);
    }, [showToast]);

    const showInfo = useCallback((message: string, duration: number = 3000, onClick?: () => void) => {
        showToast(message, 'info', duration, onClick);
    }, [showToast]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const clearToasts = useCallback(() => {
        setToasts([]);
    }, []);

    const value: ToastContextType = {
        toasts,
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        removeToast,
        clearToasts,
    };

    return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

