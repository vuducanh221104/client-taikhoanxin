'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import classNames from 'classnames/bind';
import styles from './ProductComments.module.scss';
import { SendIcon, CheckCircleIcon, DiamondIcon, MessageCircleIcon } from '@/components/Icons';
import { getComments, addComment, addReply, type Comment } from '@/services/commentService';

const cx = classNames.bind(styles);

interface ProductCommentsProps {
    productId?: string;
}

const ProductComments: React.FC<ProductCommentsProps> = ({ productId }) => {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Load comments on mount
        const loadComments = () => {
            const loadedComments = productId ? getComments(productId) : getComments();
            setComments(loadedComments);
        };
        loadComments();
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setLoading(true);
        try {
            if (replyingTo) {
                // Add reply
                const newReply = await addReply(replyingTo, {
                    userId: 'current-user', // In real app, get from auth context
                    username: 'Bạn', // In real app, get from auth context
                    avatar: '/avatar/user-icon.webp',
                    text: comment,
                    isCustomerService: false,
                    isVerified: false,
                    hasPurchased: false,
                });

                // Update comments state with new reply
                const updateCommentsWithReply = (commentsList: Comment[]): Comment[] => {
                    return commentsList.map((c) => {
                        if (c.id === replyingTo) {
                            return {
                                ...c,
                                replies: [...(c.replies || []), newReply],
                            };
                        }
                        if (c.replies && c.replies.length > 0) {
                            return {
                                ...c,
                                replies: updateCommentsWithReply(c.replies),
                            };
                        }
                        return c;
                    });
                };

                setComments(updateCommentsWithReply(comments));
            } else {
                // Add new comment
                const newComment = await addComment({
                    userId: 'current-user', // In real app, get from auth context
                    username: 'Bạn', // In real app, get from auth context
                    avatar: '/avatar/user-icon.webp',
                    text: comment,
                    isCustomerService: false,
                    isVerified: false,
                    hasPurchased: false,
                    parentId: null,
                });

                setComments([newComment, ...comments]);
            }

            setComment('');
            setReplyingTo(null);
        } catch (error) {
            console.error('Error submitting comment:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTimestamp = (timestamp: string) => {
        return timestamp;
    };

    const renderComment = (comment: Comment, isReply: boolean = false) => {
        return (
            <div key={comment.id} className={cx('comment-item', { 'is-reply': isReply })}>
                <div className={cx('comment-avatar')}>
                    <Image
                        src={comment.avatar || (comment.isCustomerService ? '/avatar/cskh-icon.png' : '/avatar/user-icon.webp')}
                        alt={comment.username}
                        width={40}
                        height={40}
                        className={cx('avatar-image')}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = comment.isCustomerService ? '/avatar/cskh-icon.png' : '/avatar/user-icon.webp';
                        }}
                    />
                </div>
                <div className={cx('comment-content')}>
                    <div className={cx('comment-header')}>
                        <div className={cx('comment-user-info')}>
                            <span className={cx('comment-username')}>{comment.username}</span>
                            {comment.isVerified && (
                                <CheckCircleIcon size={16} className={cx('verified-icon')} />
                            )}
                            {comment.hasPurchased && (
                                <span className={cx('purchased-badge')}>
                                    <DiamondIcon size={12} />
                                    <span>Đã mua sản phẩm</span>
                                </span>
                            )}
                        </div>
                        <span className={cx('comment-timestamp')}>{formatTimestamp(comment.timestamp)}</span>
                    </div>
                    <div className={cx('comment-text')}>
                        {comment.text.split('@').map((part, index) => {
                            if (index === 0) return <span key={index}>{part}</span>;
                            const mentionMatch = part.match(/^(\w+[\s\w]*?)(\s|$)/);
                            if (mentionMatch) {
                                const mention = mentionMatch[1];
                                const rest = part.substring(mention.length);
                                return (
                                    <React.Fragment key={index}>
                                        <span className={cx('comment-mention')}>@{mention}</span>
                                        {rest}
                                    </React.Fragment>
                                );
                            }
                            return <span key={index}>{part}</span>;
                        })}
                    </div>
                    {!isReply && (
                        <button
                            className={cx('reply-button')}
                            onClick={() => setReplyingTo(comment.id)}
                        >
                            <MessageCircleIcon size={14} />
                            <span>Trả lời</span>
                        </button>
                    )}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className={cx('comment-replies')}>
                            {comment.replies.map((reply) => renderComment(reply, true))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className={cx('product-comments')}>
            <h3 className={cx('comments-title')}>Bình luận</h3>
            <p className={cx('comments-info')}>Thời gian phản hồi trung bình: 5 phút!</p>

            <div className={cx('comments-list')}>
                {comments.map((comment) => renderComment(comment))}
            </div>

            <form className={cx('comments-form')} onSubmit={handleSubmit}>
                {replyingTo && (
                    <div className={cx('replying-to')}>
                        <span>Đang trả lời cho: {comments.find((c) => c.id === replyingTo)?.username}</span>
                        <button type="button" onClick={() => setReplyingTo(null)}>×</button>
                    </div>
                )}
                <textarea
                    className={cx('comments-input')}
                    placeholder={replyingTo ? 'Nhập nội dung trả lời...' : 'Nhập nội dung bình luận'}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                />
                <button type="submit" className={cx('comments-submit')} disabled={loading}>
                    {loading ? (
                        <>
                            <span className={cx('loading-spinner')}></span>
                            <span>Đang gửi...</span>
                        </>
                    ) : (
                        <>
                            <SendIcon size={18} />
                            <span>Gửi bình luận</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default ProductComments;
