'use client';

import React from 'react';
import ToastContainer from './ToastContainer';
import { useToastContext } from '@/contexts/ToastContext';

const ToastContainerWrapper: React.FC = () => {
    const { toasts, removeToast } = useToastContext();

    return <ToastContainer toasts={toasts} onClose={removeToast} />;
};

export default ToastContainerWrapper;

