'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';
import styles from './ProductComments.module.scss';
import { SendIcon, CheckCircleIcon, DiamondIcon, MessageCircleIcon, StarIcon } from '@/components/Icons';
import { useProductReviews, createReview, replyReview, type Review } from '@/services/reviewService';
import { RootState } from '@/redux/store';
import { useToast } from '@/hooks/useToast';

const cx = classNames.bind(styles);

interface ProductCommentsProps {
    productId?: string;
}

interface DisplayComment {
    id: string;
    username: string;
    avatar: string;
    timestamp: string;
    text: string;
    isCustomerService?: boolean;
    isVerified?: boolean;
    hasPurchased?: boolean;
    replies: DisplayComment[];
    rootId: string;
    isRoot: boolean;
}

const ratingOptions = [5, 4, 3, 2, 1];

const ProductComments: React.FC<ProductCommentsProps> = ({ productId }) => {
    const [comment, setComment] = useState('');
    const [selectedRating, setSelectedRating] = useState<number>(5);
    const [replyTarget, setReplyTarget] = useState<{ id: string; username: string; rootId: string } | null>(null);
    const [replyDraft, setReplyDraft] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { showSuccess, showError } = useToast();

    const currentUser = useSelector((state: RootState) => state.auth.login.currentUser);
    const isAdmin = Boolean(currentUser && currentUser.role !== undefined && currentUser.role >= 2);
    const canInteract = Boolean(currentUser && productId);

    const {
        data: productReviews,
        error,
        isLoading,
        mutate,
    } = useProductReviews(productId || '', { page: 1, limit: 10 });

    const ratingSummary = productReviews?.data?.ratingSummary;
    const totalReviews = ratingSummary?.totalReviews ?? 0;
    const averageRating = ratingSummary?.averageRating ?? 0;
    const verifiedPurchaseCount = ratingSummary?.verifiedPurchase ?? 0;

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        if (Number.isNaN(date.getTime())) {
            return timestamp;
        }
        return date.toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const mapReviewToComment = (review: Review): DisplayComment => {
        const resolveUser = (input: any) => {
            if (!input) {
                return {
                    username: 'Khách hàng',
                    avatar: '/avatar/user-icon.webp',
                    isVerified: false,
                    isCustomerService: false,
                };
            }

            if (typeof input === 'string') {
                return {
                    username: 'Khách hàng',
                    avatar: '/avatar/user-icon.webp',
                    isVerified: false,
                    isCustomerService: false,
                };
            }

            return {
                username: input.fullName || 'Khách hàng',
                avatar: input.avatar || '/avatar/user-icon.webp',
                isVerified: Boolean((input as any).isVerified),
                isCustomerService: Boolean((input as any).role && (input as any).role >= 2),
            };
        };

        const userInfo = resolveUser(review.userId);

        return {
            id: review._id,
            username: userInfo.username,
            avatar: userInfo.avatar,
            timestamp: review.createdAt,
            text: review.comment,
            isVerified: userInfo.isVerified,
            hasPurchased: review.verifiedPurchase,
            isCustomerService: userInfo.isCustomerService,
            rootId: review._id,
            isRoot: true,
            replies:
                review.replies?.map((reply) => {
                    const replyUser = resolveUser(reply.userId);
                            return {
                        id: reply._id,
                        username: replyUser.username,
                        avatar: replyUser.avatar || (reply.role === 'admin' ? '/avatar/cskh-icon.png' : '/avatar/user-icon.webp'),
                        timestamp: reply.createdAt,
                        text: reply.comment,
                        isCustomerService: reply.role !== 'user',
                        isVerified: replyUser.isVerified,
                        hasPurchased: false,
                        replies: [],
                        rootId: review._id,
                        isRoot: false,
                    };
                }) || [],
        };
    };

    const comments = useMemo<DisplayComment[]>(() => {
        if (!productReviews?.data?.reviews) {
            return [];
        }
        return productReviews.data.reviews.map(mapReviewToComment);
    }, [productReviews]);

    const handleReplyClick = (review: DisplayComment) => {
        if (!canInteract) {
            showError('Vui lòng đăng nhập để trả lời bình luận.');
            return;
        }
        setReplyTarget({ id: review.id, username: review.username, rootId: review.rootId });
        setReplyDraft(`@${review.username} `);
    };

    const resetReplyState = () => {
        setReplyTarget(null);
        setReplyDraft('');
    };

    const resetFormState = () => {
        setComment('');
        setSelectedRating(5);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (replyTarget) {
            return;
        }
        if (!comment.trim()) {
            showError('Vui lòng nhập nội dung bình luận.');
            return;
        }

        if (!currentUser) {
            showError('Bạn cần đăng nhập để gửi bình luận.');
            return;
        }

        if (!productId) {
            showError('Không xác định được sản phẩm để bình luận.');
            return;
        }

        if (!replyTarget && (!selectedRating || selectedRating < 1)) {
            showError('Vui lòng chọn số sao đánh giá.');
            return;
        }

        setSubmitting(true);
        try {
        await createReview({
            productId,
            comment: comment.trim(),
            rating: selectedRating,
        });
        showSuccess('Đã gửi đánh giá. Bình luận sẽ hiển thị sau khi được duyệt.');
        resetFormState();
        await mutate();
        } catch (err: any) {
            const message = err?.response?.data?.message || 'Không thể gửi bình luận. Vui lòng thử lại.';
            showError(message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleReplySubmit = async () => {
        if (!replyTarget) return;
        if (!replyDraft.trim()) {
            showError('Vui lòng nhập nội dung phản hồi.');
            return;
        }
        setSubmitting(true);
        try {
        await replyReview(replyTarget.rootId, replyDraft.trim());
            showSuccess('Đã phản hồi bình luận.');
            resetReplyState();
            await mutate();
        } catch (err: any) {
            const message = err?.response?.data?.message || 'Không thể gửi phản hồi. Vui lòng thử lại.';
            showError(message);
        } finally {
            setSubmitting(false);
        }
    };

    const renderComment = (commentItem: DisplayComment, isReply: boolean = false) => (
        <div key={commentItem.id} className={cx('comment-item', { 'is-reply': isReply })}>
                <div className={cx('comment-avatar')}>
                    <Image
                    src={
                        commentItem.avatar ||
                        (commentItem.isCustomerService ? '/avatar/cskh-icon.png' : '/avatar/user-icon.webp')
                    }
                    alt={commentItem.username}
                        width={40}
                        height={40}
                        className={cx('avatar-image')}
                        onError={(e) => {
                        (e.target as HTMLImageElement).src = commentItem.isCustomerService
                            ? '/avatar/cskh-icon.png'
                            : '/avatar/user-icon.webp';
                        }}
                    />
                </div>
                <div className={cx('comment-content')}>
                    <div className={cx('comment-header')}>
                        <div className={cx('comment-user-info')}>
                        <span className={cx('comment-username')}>{commentItem.username}</span>
                        {commentItem.isVerified && <CheckCircleIcon size={16} className={cx('verified-icon')} />}
                        {commentItem.hasPurchased && (
                                <span className={cx('purchased-badge')}>
                                    <DiamondIcon size={12} />
                                    <span>Đã mua sản phẩm</span>
                                </span>
                            )}
                        </div>
                    <span className={cx('comment-timestamp')}>{formatTimestamp(commentItem.timestamp)}</span>
                    </div>
                <div className={cx('comment-text')}>{commentItem.text}</div>
                <button className={cx('reply-button')} type="button" onClick={() => handleReplyClick(commentItem)}>
                    <MessageCircleIcon size={14} />
                    <span>Trả lời</span>
                </button>
                {commentItem.replies && commentItem.replies.length > 0 && (
                        <div className={cx('comment-replies')}>
                        {commentItem.replies.map((reply) => renderComment(reply, true))}
                        </div>
                    )}
                {commentItem.isRoot && replyTarget?.rootId === commentItem.id && (
                    <div className={cx('inline-reply-form')}>
                        <textarea
                            className={cx('inline-reply-input')}
                            rows={3}
                            value={replyDraft}
                            onChange={(e) => setReplyDraft(e.target.value)}
                            placeholder="Nhập phản hồi của bạn..."
                            disabled={submitting}
                        />
                        <div className={cx('inline-reply-actions')}>
                            <button
                                type="button"
                                className={cx('inline-reply-cancel')}
                                onClick={resetReplyState}
                                disabled={submitting}
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                className={cx('inline-reply-submit')}
                                onClick={handleReplySubmit}
                                disabled={submitting || !replyDraft.trim()}
                            >
                                {submitting ? 'Đang gửi...' : 'Gửi phản hồi'}
                            </button>
                        </div>
                    </div>
                )}
                </div>
            </div>
        );

    const renderCommentsList = () => {
        if (!productId) {
            return <p className={cx('comments-empty')}>Không tìm thấy sản phẩm để hiển thị bình luận.</p>;
        }

        if (isLoading) {
            return <p className={cx('comments-empty')}>Đang tải bình luận...</p>;
        }

        if (error) {
            return <p className={cx('comments-empty')}>Không thể tải bình luận. Vui lòng thử lại sau.</p>;
        }

        if (comments.length === 0) {
            return <p className={cx('comments-empty')}>Chưa có bình luận nào cho sản phẩm này.</p>;
        }

        return comments.map((commentItem) => renderComment(commentItem));
    };

    const commentsInfo = ratingSummary
        ? `Đánh giá trung bình ${averageRating.toFixed(1)}/5 từ ${totalReviews} lượt. ${verifiedPurchaseCount} khách hàng đã mua xác nhận.`
        : 'Thời gian phản hồi trung bình: 5 phút!';

    return (
        <div className={cx('product-comments')}>
            <h3 className={cx('comments-title')}>Bình luận</h3>
            <p className={cx('comments-info')}>{commentsInfo}</p>

            <div className={cx('comments-list')}>{renderCommentsList()}</div>

            <form className={cx('comments-form')} onSubmit={handleSubmit}>
                {replyTarget ? (
                    <div className={cx('replying-notice')}>
                        <span>Đang trả lời cho: {replyTarget.username}. Khung nhập nằm ngay dưới bình luận đó.</span>
                        <button type="button" onClick={resetReplyState} disabled={submitting}>
                            Hủy trả lời
                        </button>
                    </div>
                ) : (
                    <>
                        <div className={cx('rating-selector')}>
                            <span className={cx('rating-label')}>Đánh giá của bạn:</span>
                            <div className={cx('rating-options')}>
                                {ratingOptions.map((value) => (
                                    <button
                                        key={value}
                                        type="button"
                                        className={cx('rating-option', { 'is-active': selectedRating === value })}
                                        onClick={() => setSelectedRating(value)}
                                    >
                                        <StarIcon size={14} />
                                        <span>{value}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <textarea
                            className={cx('comments-input')}
                            placeholder={
                                canInteract
                                    ? 'Chia sẻ trải nghiệm của bạn về sản phẩm này'
                                    : 'Vui lòng đăng nhập để gửi bình luận'
                            }
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            disabled={!canInteract}
                        />

                        <button type="submit" className={cx('comments-submit')} disabled={submitting || !canInteract}>
                            {submitting ? (
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
                    </>
                )}
            </form>
        </div>
    );
};

export default ProductComments;
