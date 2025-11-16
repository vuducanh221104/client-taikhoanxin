import mockTransactionsData from '@/data/mockTransactions.json';

export interface Transaction {
    id: string;
    userId: string;
    transactionDate: string;
    description: string;
    amount: number; // Positive for deposit/refund, negative for payment
    balance: number; // Balance after transaction
    type: 'deposit' | 'payment' | 'refund' | 'withdrawal';
    orderCode?: string;
    paymentMethod?: string;
}

export interface TransactionFilters {
    description?: string;
    type?: Transaction['type'] | 'all';
    amountFrom?: number;
    amountTo?: number;
    dateFrom?: string;
    dateTo?: string;
}

/**
 * Get transactions by user ID
 * @param userId - User ID
 * @returns Array of transactions for the specified user, sorted by date (newest first)
 */
export const getTransactionsByUserId = (userId: string): Transaction[] => {
    const transactions = mockTransactionsData.transactions as Transaction[];
    return transactions
        .filter(transaction => transaction.userId === userId)
        .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
};

/**
 * Get transaction by ID
 * @param transactionId - Transaction ID
 * @returns Transaction or undefined if not found
 */
export const getTransactionById = (transactionId: string): Transaction | undefined => {
    const transactions = mockTransactionsData.transactions as Transaction[];
    return transactions.find(transaction => transaction.id === transactionId);
};

/**
 * Filter transactions by criteria
 * @param transactions - Array of transactions to filter
 * @param filters - Filter criteria
 * @returns Filtered array of transactions
 */
export const filterTransactions = (transactions: Transaction[], filters: TransactionFilters): Transaction[] => {
    let filtered = [...transactions];

    // Filter by type
    if (filters.type && filters.type !== 'all') {
        filtered = filtered.filter(transaction => transaction.type === filters.type);
    }

    // Filter by description
    if (filters.description) {
        const desc = filters.description.toLowerCase().trim();
        filtered = filtered.filter(transaction =>
            transaction.description.toLowerCase().includes(desc)
        );
    }

    // Filter by amount range (use absolute value for comparison)
    if (filters.amountFrom !== undefined) {
        filtered = filtered.filter(transaction => Math.abs(transaction.amount) >= filters.amountFrom!);
    }

    if (filters.amountTo !== undefined) {
        filtered = filtered.filter(transaction => Math.abs(transaction.amount) <= filters.amountTo!);
    }

    // Filter by date range
    if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        filtered = filtered.filter(transaction => {
            const transactionDate = new Date(transaction.transactionDate);
            transactionDate.setHours(0, 0, 0, 0);
            return transactionDate >= fromDate;
        });
    }

    if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        filtered = filtered.filter(transaction => {
            const transactionDate = new Date(transaction.transactionDate);
            transactionDate.setHours(23, 59, 59, 999);
            return transactionDate <= toDate;
        });
    }

    return filtered;
};

/**
 * Get transaction type label in Vietnamese
 * @param type - Transaction type
 * @returns Vietnamese label
 */
export const getTransactionTypeLabel = (type: Transaction['type']): string => {
    switch (type) {
        case 'deposit':
            return 'Nạp tiền';
        case 'payment':
            return 'Thanh toán';
        case 'refund':
            return 'Hoàn tiền';
        case 'withdrawal':
            return 'Rút tiền';
        default:
            return type;
    }
};

/**
 * Get transaction type color class
 * @param type - Transaction type
 * @returns CSS class name for transaction type color
 */
export const getTransactionTypeColor = (type: Transaction['type']): string => {
    switch (type) {
        case 'deposit':
            return 'type-deposit';
        case 'payment':
            return 'type-payment';
        case 'refund':
            return 'type-refund';
        case 'withdrawal':
            return 'type-withdrawal';
        default:
            return '';
    }
};

