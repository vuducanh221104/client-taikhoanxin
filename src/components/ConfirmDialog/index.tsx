import { useContext } from 'react';
import { ConfirmDialogContext } from './ConfirmDialogProvider';

export { ConfirmDialogProvider } from './ConfirmDialogProvider';
export { default as ConfirmDialog } from './ConfirmDialog';

export const useConfirmDialog = () => {
    const context = useContext(ConfirmDialogContext);
    if (!context) {
        throw new Error('useConfirmDialog must be used within ConfirmDialogProvider');
    }
    return {
        showConfirm: context.confirm,
    };
};

// Alias for backward compatibility
export const useConfirm = () => {
    const context = useContext(ConfirmDialogContext);
    if (!context) {
        throw new Error('useConfirm must be used within ConfirmDialogProvider');
    }
    return {
        confirm: context.confirm,
    };
};
