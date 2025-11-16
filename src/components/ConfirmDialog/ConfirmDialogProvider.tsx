'use client';

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import ConfirmDialog, { DialogVariant } from './ConfirmDialog';

export interface ConfirmOptions {
    title: string;
    message: string;
    variant?: DialogVariant;
    confirmText?: string;
    cancelText?: string;
    icon?: React.ReactNode;
}

export interface ConfirmDialogContextValue {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
}

interface DialogState {
    isOpen: boolean;
    options: ConfirmOptions | null;
    resolver: ((value: boolean) => void) | null;
}

export const ConfirmDialogContext = createContext<ConfirmDialogContextValue | undefined>(undefined);

interface ConfirmDialogProviderProps {
    children: ReactNode;
}

export const ConfirmDialogProvider: React.FC<ConfirmDialogProviderProps> = ({ children }) => {
    const [dialogState, setDialogState] = useState<DialogState>({
        isOpen: false,
        options: null,
        resolver: null,
    });

    const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
        return new Promise<boolean>((resolve) => {
            setDialogState({
                isOpen: true,
                options,
                resolver: resolve,
            });
        });
    }, []);

    const handleConfirm = useCallback(() => {
        if (dialogState.resolver) {
            dialogState.resolver(true);
        }
        setDialogState({
            isOpen: false,
            options: null,
            resolver: null,
        });
    }, [dialogState.resolver]);

    const handleCancel = useCallback(() => {
        if (dialogState.resolver) {
            dialogState.resolver(false);
        }
        setDialogState({
            isOpen: false,
            options: null,
            resolver: null,
        });
    }, [dialogState.resolver]);

    const handleClose = useCallback(() => {
        if (dialogState.resolver) {
            dialogState.resolver(false);
        }
        setDialogState({
            isOpen: false,
            options: null,
            resolver: null,
        });
    }, [dialogState.resolver]);

    const contextValue: ConfirmDialogContextValue = {
        confirm,
    };

    // Apply default values
    const variant = dialogState.options?.variant || 'warning';
    const confirmText = dialogState.options?.confirmText || 'OK';
    const cancelText = dialogState.options?.cancelText || 'Hủy';

    return (
        <ConfirmDialogContext.Provider value={contextValue}>
            {children}
            {dialogState.options && (
                <ConfirmDialog
                    isOpen={dialogState.isOpen}
                    title={dialogState.options.title}
                    message={dialogState.options.message}
                    variant={variant}
                    confirmText={confirmText}
                    cancelText={cancelText}
                    icon={dialogState.options.icon}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    onClose={handleClose}
                />
            )}
        </ConfirmDialogContext.Provider>
    );
};

export default ConfirmDialogProvider;
