import { useContext } from 'react';
import { ConfirmDialogContext, ConfirmDialogContextValue } from './ConfirmDialogProvider';

export const useConfirm = (): ConfirmDialogContextValue => {
    const context = useContext(ConfirmDialogContext);
    
    if (context === undefined) {
        throw new Error('useConfirm must be used within a ConfirmDialogProvider');
    }
    
    return context;
};

export default useConfirm;
