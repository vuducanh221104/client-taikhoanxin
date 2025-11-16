'use client';

import React from 'react';
import classNames from 'classnames/bind';
import styles from './ToastContainer.module.scss';
import Toast, { ToastType } from './Toast';

const cx = classNames.bind(styles);

export interface ToastItem {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContainerProps {
    toasts: ToastItem[];
    onClose: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
    if (toasts.length === 0) {
        return null;
    }

    return (
        <div className={cx('toast-container')}>
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    id={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={onClose}
                />
            ))}
        </div>
    );
};

export default ToastContainer;

