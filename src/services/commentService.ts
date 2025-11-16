import mockCommentsData from '@/data/mockComments.json';

export interface Comment {
    id: string;
    userId: string;
    username: string;
    avatar: string;
    timestamp: string;
    text: string;
    isCustomerService?: boolean;
    isVerified?: boolean;
    hasPurchased?: boolean;
    parentId?: string | null;
    replies?: Comment[];
}

/**
 * Get all comments for a product
 * @param productId - Product ID (optional, for future use)
 * @returns Array of comments
 */
export const getComments = (productId?: string): Comment[] => {
    // In the future, this can fetch from API based on productId
    // For now, return mock data
    return mockCommentsData.comments as Comment[];
};

/**
 * Get comments by product ID
 * @param productId - Product ID
 * @returns Array of comments for the product
 */
export const getCommentsByProductId = (productId: string): Comment[] => {
    // In the future, filter by productId from API
    // For now, return all mock comments
    return mockCommentsData.comments as Comment[];
};

/**
 * Add a new comment
 * @param comment - New comment data
 * @returns The created comment
 */
export const addComment = async (comment: Omit<Comment, 'id' | 'timestamp'>): Promise<Comment> => {
    // In the future, this will call API to create comment
    // For now, return mock created comment
    const newComment: Comment = {
        ...comment,
        id: `new-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        replies: comment.replies || [],
    };
    return newComment;
};

/**
 * Add a reply to a comment
 * @param parentId - Parent comment ID
 * @param reply - Reply data
 * @returns The created reply
 */
export const addReply = async (
    parentId: string,
    reply: Omit<Comment, 'id' | 'timestamp' | 'parentId'>
): Promise<Comment> => {
    // In the future, this will call API to create reply
    // For now, return mock created reply
    const newReply: Comment = {
        ...reply,
        id: `reply-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        parentId,
        replies: [],
    };
    return newReply;
};

