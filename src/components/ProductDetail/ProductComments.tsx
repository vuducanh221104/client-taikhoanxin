'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';
import styles from './ProductComments.module.scss';
import {
    SendIcon,
    CheckCircleIcon,
    DiamondIcon,
    MessageCircleIcon,
    StarIcon,
    ShieldCheckIcon,
    ClockIcon,
} from '@/components/Icons';
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
                    avatar: '/avatar/user-icon.png',
                    isVerified: false,
                    isCustomerService: false,
                };
            }

            if (typeof input === 'string') {
                return {
                    username: 'Khách hàng',
                    avatar: '/avatar/user-icon.png',
                    isVerified: false,
                    isCustomerService: false,
                };
            }

            return {
                username: input.fullName || 'Khách hàng',
                avatar: input.avatar || '/avatar/user-icon.png',
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
                        avatar: replyUser.avatar || (reply.role === 'admin' ? '/avatar/cskh-icon.png' : '/avatar/user-icon.png'),
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
        <article key={commentItem.id} className={cx('comment-row', { 'is-reply': isReply })}>
            <div className={cx('timeline-marker')}>
                <span className={cx('timeline-dot', { 'is-reply': isReply })} />
                {!isReply && <span className={cx('timeline-line')} />}
            </div>
            <div className={cx('comment-card')}>
                <div className={cx('comment-avatar')}>
                    <Image
                        src={
                            commentItem.avatar ||
                            (commentItem.isCustomerService ? '/avatar/cskh-icon.png' : '/avatar/user-icon.png')
                        }
                        alt={commentItem.username}
                        width={48}
                        height={48}
                        className={cx('avatar-image')}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = commentItem.isCustomerService
                                ? '/avatar/cskh-icon.png'
                                : '/avatar/user-icon.png';
                        }}
                    />
                </div>

                <div className={cx('comment-content')}>
                    <div className={cx('comment-header')}>
                        <div className={cx('comment-user-info')}>
                            <span className={cx('comment-username')}>{commentItem.username}</span>
                            {commentItem.isCustomerService && (
                                <svg 
                                    className={cx('verified-badge')} 
                                    width="16" 
                                    height="16" 
                                    viewBox="0 0 512 512" 
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path 
                                        d="M512 256c0-37.7-23.7-69.9-57.1-82.4 14.7-32.4 8.8-71.9-17.9-98.6-26.7-26.7-66.2-32.6-98.6-17.9C325.9 23.7 293.7 0 256 0s-69.9 23.7-82.4 57.1c-32.4-14.7-72-8.8-98.6 17.9-26.7 26.7-32.6 66.2-17.9 98.6C23.7 186.1 0 218.3 0 256s23.7 69.9 57.1 82.4c-14.7 32.4-8.8 72 17.9 98.6 26.6 26.6 66.1 32.7 98.6 17.9 12.5 33.3 44.7 57.1 82.4 57.1s69.9-23.7 82.4-57.1c32.6 14.8 72 8.7 98.6-17.9 26.7-26.7 32.6-66.2 17.9-98.6 33.4-12.5 57.1-44.7 57.1-82.4zm-144.8-44.25L236.16 341.74c-4.31 4.28-11.28 4.25-15.55-.06l-75.72-76.33c-4.28-4.31-4.25-11.28.06-15.56l26.03-25.82c4.31-4.28 11.28-4.25 15.56.06l42.15 42.49 97.2-96.42c4.31-4.28 11.28-4.25 15.55.06l25.82 26.03c4.28 4.32 4.26 11.29-.06 15.56z" 
                                        fill="#1DA1F2"
                                    />
                                </svg>
                            )}
                            {commentItem.isVerified && !commentItem.isCustomerService && <CheckCircleIcon size={16} className={cx('verified-icon')} />}
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

                    <div className={cx('comment-footer')}>
                        <button className={cx('reply-button')} type="button" onClick={() => handleReplyClick(commentItem)}>
                            <MessageCircleIcon size={14} />
                            <span>Trả lời</span>
                        </button>
                    </div>

                    {commentItem.replies && commentItem.replies.length > 0 && (
                        <div className={cx('comment-replies')}>{commentItem.replies.map((reply) => renderComment(reply, true))}</div>
                    )}

                    {commentItem.isRoot && replyTarget?.rootId === commentItem.id && (
                        <div className={cx('inline-reply-form')}>
                            <div className={cx('inline-reply-wrapper')}>
                                <div className={cx('inline-reply-avatar')}>
                                    <Image
                                        src={
                                            (currentUser as any)?.avatar ||
                                            (currentUser as any)?.avatarUrl ||
                                            '/avatar/user-icon.png'
                                        }
                                        alt={(currentUser as any)?.fullName || (currentUser as any)?.full_name || 'User'}
                                        width={40}
                                        height={40}
                                        className={cx('avatar-image')}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/avatar/user-icon.png';
                                        }}
                                    />
                                </div>
                                <textarea
                                    className={cx('inline-reply-input')}
                                    rows={3}
                                    value={replyDraft}
                                    onChange={(e) => setReplyDraft(e.target.value)}
                                    placeholder="Nhập phản hồi của bạn..."
                                    disabled={submitting}
                                />
                            </div>
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
        </article>
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
        <section className={cx('product-comments')}>
            {/* Form bình luận ở đầu */}
            <div className={cx('composer-section')}>
                <div className={cx('composer-card')}>
                    <div className={cx('composer-top')}>
                        <div className={cx('composer-header')}>
                            <h3>Chia sẻ trải nghiệm của bạn</h3>
                            <p>Bình luận & Đánh giá của bạn giúp chúng tôi cải thiện dịch vụ mỗi ngày.</p>
                        </div>
                        <div className={cx('hero-metrics-wrapper')}>
                            <div className={cx('hero-metrics')}>
                                <div className={cx('metric-card', 'metric-rating')}>
                                    <div className={cx('metric-icon')}>
                                        <StarIcon size={18} />
                                    </div>
                                    <div className={cx('metric-content')}>
                                        <span className={cx('metric-label')}>Điểm đánh giá</span>
                                        <strong className={cx('metric-value')}>
                                            {averageRating ? averageRating.toFixed(1) : '5.0'}
                                        </strong>
                                        <p>{totalReviews} lượt đánh giá</p>
                                    </div>
                                </div>
                                <div className={cx('metric-card', 'metric-verified')}>
                                    <div className={cx('metric-icon')}>
                                        <ShieldCheckIcon size={18} />
                                    </div>
                                    <div className={cx('metric-content')}>
                                        <span className={cx('metric-label')}>Khách mua xác nhận</span>
                                        <strong className={cx('metric-value')}>{verifiedPurchaseCount}</strong>
                                        <p>Đánh giá đã mua hàng</p>
                                    </div>
                                </div>
                                <div className={cx('metric-card', 'metric-response')}>
                                    <div className={cx('metric-icon')}>
                                        <ClockIcon size={18} />
                                    </div>
                                    <div className={cx('metric-content')}>
                                        <span className={cx('metric-label')}>Phản hồi hỗ trợ</span>
                                        <strong className={cx('metric-value')}>~5 phút</strong>
                                        <p>Trung bình phản hồi</p>
                                    </div>
                                </div>
                            </div>
                            <p className={cx('composer-info')}>{commentsInfo}</p>
                        </div>
                    </div>
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
                                    <span className={cx('rating-label')}>Đánh giá của bạn</span>
                                    <div className={cx('rating-options')}>
                                        {ratingOptions.map((value) => (
                                            <button
                                                key={value}
                                                type="button"
                                                className={cx('rating-option', { 'is-active': selectedRating === value })}
                                                onClick={() => setSelectedRating(value)}
                                            >
                                                <StarIcon size={14} />
                                                <span>{value} sao</span>
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

                                <button
                                    type="submit"
                                    className={cx('comments-submit')}
                                    disabled={submitting || !canInteract}
                                >
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
            </div>

            {/* Phần Bình luận */}
            <div className={cx('comments-section')}>
                <div className={cx('section-header')}>
                    <h3 className={cx('section-title')}>Bình luận</h3>
                    <p className={cx('section-info')}>Thảo luận và trao đổi về sản phẩm</p>
                </div>
                <div className={cx('thread-panel')}>
                    <div className={cx('thread-timeline')}>{renderCommentsList()}</div>
                </div>
            </div>
        </section>
    );
};

export default ProductComments;
