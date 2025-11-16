import mockUserCommentsData from '@/data/mockUserComments.json';

export interface UserComment {
    id: string;
    userId: string;
    productId: string;
    productName: string;
    timestamp: string;
    content: string;
    type: 'comment' | 'reply';
    parentId?: string | null;
}

export interface UserCommentFilters {
    content?: string;
    type?: UserComment['type'] | 'all';
    dateFrom?: string;
    dateTo?: string;
}

/**
 * Get all comments by user ID
 * @param userId - User ID
 * @returns Array of user comments, sorted by date (newest first)
 */
export const getUserComments = (userId: string): UserComment[] => {
    const comments = mockUserCommentsData.userComments as UserComment[];
    return comments
        .filter(comment => comment.userId === userId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

/**
 * Get comment by ID
 * @param commentId - Comment ID
 * @returns Comment or undefined if not found
 */
export const getUserCommentById = (commentId: string): UserComment | undefined => {
    const comments = mockUserCommentsData.userComments as UserComment[];
    return comments.find(comment => comment.id === commentId);
};

/**
 * Filter user comments by criteria
 * @param comments - Array of comments to filter
 * @param filters - Filter criteria
 * @returns Filtered array of comments
 */
export const filterUserComments = (
    comments: UserComment[],
    filters: UserCommentFilters
): UserComment[] => {
    let filtered = [...comments];

    // Filter by type
    if (filters.type && filters.type !== 'all') {
        filtered = filtered.filter(comment => comment.type === filters.type);
    }

    // Filter by content (case-insensitive search)
    if (filters.content && filters.content.trim() !== '') {
        const searchTerm = filters.content.toLowerCase().trim();
        filtered = filtered.filter(comment =>
            comment.content.toLowerCase().includes(searchTerm)
        );
    }

    // Filter by date range (yyyy-mm-dd format)
    if (filters.dateFrom) {
        const dateFrom = new Date(filters.dateFrom);
        dateFrom.setHours(0, 0, 0, 0);
        filtered = filtered.filter(comment => {
            const commentDate = new Date(comment.timestamp);
            commentDate.setHours(0, 0, 0, 0);
            return commentDate >= dateFrom;
        });
    }

    if (filters.dateTo) {
        const dateTo = new Date(filters.dateTo);
        dateTo.setHours(23, 59, 59, 999);
        filtered = filtered.filter(comment => {
            const commentDate = new Date(comment.timestamp);
            commentDate.setHours(23, 59, 59, 999);
            return commentDate <= dateTo;
        });
    }

    return filtered;
};

/**
 * Format date string to Vietnamese locale
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatCommentDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

