'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';
import styles from './ProductComments.module.scss';
import {
    SendIcon,
    DiamondIcon,
    MessageCircleIcon,
    StarIcon,
    ShieldCheckIcon,
    ClockIcon,
} from '@/components/Icons';
import { useProductReviews, createReview, replyReview, type Review } from '@/services/reviewService';
import { useProductComments, createComment, replyComment, type Comment as ProductComment } from '@/services/commentService';
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
    rating?: number;
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
    const [activeTab, setActiveTab] = useState<'comments' | 'reviews'>('comments');
    const [replyVisibleCount, setReplyVisibleCount] = useState<Record<string, number>>({});
    const { showSuccess, showError } = useToast();

    // Reset form when switching tabs
    React.useEffect(() => {
        if (activeTab === 'comments') {
            setSelectedRating(0);
        } else {
            setSelectedRating(5);
        }
    }, [activeTab]);

    const currentUser = useSelector((state: RootState) => state.auth.login.currentUser);
    const _isAdmin = Boolean(currentUser && currentUser.role !== undefined && currentUser.role >= 2);
    const canReplyToThread = Boolean(currentUser && currentUser.role !== undefined && currentUser.role >= 2);
    const canInteract = Boolean(currentUser && productId);

    const {
        data: productReviews,
        error,
        isLoading,
        mutate,
    } = useProductReviews(productId || '', { page: 1, limit: 10 });

    const {
        data: productComments,
        error: commentsError,
        isLoading: commentsLoading,
        mutate: mutateComments,
    } = useProductComments(productId || '', { page: 1, limit: 10 });

    // Check if user purchased this product with successful status
    // Fetch user orders to verify purchase (wider limit to reduce miss)
    const ratingSummary = productReviews?.data?.ratingSummary;
    const totalReviews = ratingSummary?.totalReviews ?? 0;
    const averageRating = ratingSummary?.averageRating ?? 0;
    const verifiedPurchaseCount = ratingSummary?.verifiedPurchase ?? 0;

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        if (Number.isNaN(date.getTime())) {
            return timestamp;
        }

        const diffSeconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));

        const thresholds: { limit: number; divisor?: number; unit?: string; text?: string }[] = [
            { limit: 60, text: 'vài giây trước' },
            { limit: 3600, divisor: 60, unit: 'phút' },
            { limit: 86400, divisor: 3600, unit: 'giờ' },
            { limit: 2592000, divisor: 86400, unit: 'ngày' }, // 30 days
            { limit: 31104000, divisor: 2592000, unit: 'tháng' }, // 12 months
        ];

        for (const threshold of thresholds) {
            if (diffSeconds < threshold.limit) {
                if (threshold.text) return threshold.text;
                const value = Math.floor(diffSeconds / (threshold.divisor || 1));
                return `${value} ${threshold.unit} trước`;
            }
        }

        const years = Math.floor(diffSeconds / 31104000);
        return `${years} năm trước`;
    };

        const resolveUser = (input: any, role?: string | number) => {
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

            // Kiểm tra role từ input hoặc parameter
            const userRole = role !== undefined ? role : (input as any).role;
            const isAdmin = userRole !== undefined && (typeof userRole === 'number' ? userRole >= 2 : ['manager', 'admin'].includes(String(userRole)));

            return {
                username: isAdmin ? 'Admin-TaiKhoanXin' : (input.fullName || 'Khách hàng'),
                avatar: input.avatar || '/avatar/user-icon.png',
                isVerified: Boolean((input as any).isVerified),
                isCustomerService: Boolean((input as any).role && (input as any).role >= 2) || isAdmin,
            };
        };

    const mapCommentToDisplay = (cmt: ProductComment): DisplayComment => {
        const userInfo = resolveUser(cmt.userId as any);
        const rawReplies = (cmt as any).replies || [];

        const replies: DisplayComment[] = Array.isArray(rawReplies)
            ? rawReplies.map((reply: any) => {
                  // Lấy role từ reply object (backend trả về role trong reply)
                  const replyRole = reply.role;
                  const replyUser = resolveUser(reply.userId as any, replyRole);
                  return {
                      id: reply._id || reply.id,
                      username: replyUser.username,
                      avatar:
                          replyUser.avatar ||
                          (replyUser.isCustomerService ? '/avatar/cskh-icon.png' : '/avatar/user-icon.png'),
                      timestamp: reply.createdAt || reply.timestamp,
                      text: reply.comment || reply.text,
                      isCustomerService: replyUser.isCustomerService,
                      isVerified: replyUser.isVerified,
                      hasPurchased: false,
                      replies: [],
                      rootId: cmt._id,
                      isRoot: false,
                  };
              })
            : [];

        return {
            id: cmt._id,
            username: userInfo.username,
            avatar: userInfo.avatar,
            timestamp: cmt.createdAt,
            text: cmt.comment,
            rating: 0,
            isVerified: userInfo.isVerified,
            hasPurchased: false,
            isCustomerService: userInfo.isCustomerService,
            replies,
            rootId: cmt._id,
            isRoot: true,
        };
    };

    const mapReviewToComment = (review: Review): DisplayComment => {
        const userInfo = resolveUser(review.userId);

        return {
            id: review._id,
            username: userInfo.username,
            avatar: userInfo.avatar,
            timestamp: review.createdAt,
            text: review.comment,
            rating: review.rating,
            isVerified: userInfo.isVerified,
            hasPurchased: review.verifiedPurchase,
            isCustomerService: userInfo.isCustomerService,
            rootId: review._id,
            isRoot: true,
            replies:
                review.replies?.map((reply) => {
                    // Lấy role từ reply object
                    const replyRole = reply.role;
                    const replyUser = resolveUser(reply.userId, replyRole);
                            return {
                        id: reply._id,
                        username: replyUser.username,
                        avatar: replyUser.avatar || (reply.role === 'admin' || reply.role === 'manager' ? '/avatar/cskh-icon.png' : '/avatar/user-icon.png'),
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

    const reviewsList = useMemo<DisplayComment[]>(() => {
        if (!productReviews?.data?.reviews) return [];
        return productReviews.data.reviews.map(mapReviewToComment);
    }, [productReviews, mapReviewToComment]);

    const commentsList = useMemo<DisplayComment[]>(() => {
        if (!productComments?.data?.comments) return [];
        return productComments.data.comments.map(mapCommentToDisplay);
    }, [productComments, mapCommentToDisplay]);

    // Count comments and reviews separately
    const commentsCount = useMemo(() => {
        return commentsList.length;
    }, [commentsList]);

    const reviewsCount = useMemo(() => {
        return reviewsList.length;
    }, [reviewsList]);

    const handleReplyClick = (review: DisplayComment) => {
        // Tab đánh giá: chỉ cho phép role đủ quyền (CSKH/Admin) trả lời
        if (activeTab === 'reviews') {
            if (!canReplyToThread || !canInteract) {
                return;
            }
        } else {
            // Tab bình luận: chỉ yêu cầu đăng nhập
        if (!canInteract) {
            showError('Vui lòng đăng nhập để trả lời bình luận.');
            return;
        }
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

        // Flow: Bình luận (tab comments)
        if (activeTab === 'comments') {
            setSubmitting(true);
            try {
                const res = await createComment({
                    productId,
                    comment: comment.trim(),
                });
                showSuccess('Đã gửi bình luận.');
                // Optimistic: chèn bình luận mới (pending) để tránh hiển thị mock/placeholder
                const created = res?.data;
                if (created) {
                    const currentUserAny = currentUser as any;
                    const displayUser = currentUserAny
                        ? {
                              _id: currentUserAny._id || currentUserAny.id || '',
                              fullName: currentUserAny.fullName || currentUserAny.full_name || 'Bạn',
                              avatar: currentUserAny.avatar || '/avatar/user-icon.png',
                          }
                        : created.userId;

                    await mutateComments(
                        (prev) => {
                            const prevComments = prev?.data?.comments || [];
                            const newComment: ProductComment = {
                                ...created,
                                userId: displayUser as any,
                            };
                            const nextComments = [newComment, ...prevComments];
                            return {
                                ...(prev || { success: true, data: { comments: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1 } } }),
                                data: {
                                    ...((prev && prev.data) || { pagination: { page: 1, limit: 10, total: 0, totalPages: 1 } }),
                                    comments: nextComments,
                                    pagination: prev?.data?.pagination
                                        ? {
                                              ...prev.data.pagination,
                                              total: (prev.data.pagination.total || 0) + 1,
                                              totalPages: prev.data.pagination.limit
                                                  ? Math.ceil(((prev.data.pagination.total || 0) + 1) / prev.data.pagination.limit)
                                                  : prev.data.pagination.totalPages,
                                          }
                                        : { page: 1, limit: 10, total: nextComments.length, totalPages: 1 },
                                },
                            };
                        },
                        { revalidate: false }
                    );
                } else {
                    await mutateComments(undefined, { revalidate: false });
                }
                resetFormState();
            } catch (err: any) {
                const message = err?.response?.data?.message || 'Không thể gửi bình luận. Vui lòng thử lại.';
                showError(message);
            } finally {
                setSubmitting(false);
            }
            return;
        }

        // Flow: Đánh giá (tab reviews)
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
            showSuccess('Đã gửi đánh giá. Sẽ hiển thị sau khi được duyệt.');
        resetFormState();
        await mutate();
        } catch (err: any) {
            const message = err?.response?.data?.message || 'Không thể gửi đánh giá. Vui lòng thử lại.';
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

        // Tab bình luận: gọi API reply comment để lưu vào database
        if (activeTab === 'comments') {
            try {
                const res = await replyComment(replyTarget.rootId, replyDraft.trim());
                
                // Optimistic update: thêm reply vào comment ngay lập tức, không revalidate
                mutateComments(
                    (prev) => {
                        if (!prev?.data?.comments) return prev;
                        
                        const updatedComments = prev.data.comments.map((item: any) => {
                            if (item._id !== replyTarget.rootId) return item;
                            
                            // Lấy reply mới nhất từ response (đã có đầy đủ thông tin từ server)
                            const allReplies = res?.data?.replies || [];
                            const newReply = allReplies[allReplies.length - 1];
                            
                            if (!newReply) return item;
                            
                            const existingReplies = Array.isArray(item.replies) ? item.replies : [];
                            
                            // Kiểm tra xem reply đã tồn tại chưa (tránh duplicate)
                            const replyExists = existingReplies.some(
                                (r: any) => r._id?.toString() === newReply._id?.toString()
                            );
                            
                            if (replyExists) return item;
                            
                            return {
                                ...item,
                                replies: [...existingReplies, newReply],
                            };
                        });
                        
                        return {
                            ...prev,
                            data: {
                                ...prev.data,
                                comments: updatedComments,
                            },
                        };
                    },
                    { revalidate: false } // Không revalidate để tránh refresh UI
                );
                
                showSuccess('Đã phản hồi bình luận.');
                resetReplyState();
                // Không revalidate - chỉ dùng optimistic update để UI mượt
            } catch (err: any) {
                const message = err?.response?.data?.message || err?.response?.data?.error || 'Không thể gửi phản hồi. Vui lòng thử lại.';
                showError(message);
                // Chỉ revalidate khi có lỗi để revert
                mutateComments(undefined, { revalidate: true });
            } finally {
                setSubmitting(false);
            }
            return;
        }

        // Tab đánh giá: gọi API reply review
        try {
        await replyReview(replyTarget.rootId, replyDraft.trim());
            showSuccess('Đã phản hồi đánh giá.');
            resetReplyState();
            await mutate();
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.response?.data?.error || 'Không thể gửi phản hồi. Vui lòng thử lại.';
            showError(message);
        } finally {
            setSubmitting(false);
        }
    };

    const toggleReplies = (id: string, totalReplies: number, previewCount: number, chunkSize: number) => {
        setReplyVisibleCount((prev) => {
            const currentVisible = prev[id] ?? previewCount;
            const isFullyExpanded = currentVisible >= totalReplies;
            return {
                ...prev,
                [id]: isFullyExpanded ? previewCount : Math.min(totalReplies, currentVisible + chunkSize),
            };
        });
    };

    const renderComment = (commentItem: DisplayComment, isReply: boolean = false) => {
        const PREVIEW_COUNT = 2; // initial replies shown
        const CHUNK_SIZE = 2; // how many to reveal per click
        const hasReplies = commentItem.replies && commentItem.replies.length > 0;
        const totalReplies = commentItem.replies?.length || 0;
        const isRootWithManyReplies = commentItem.isRoot && hasReplies && totalReplies > PREVIEW_COUNT;
        const visibleCount = replyVisibleCount[commentItem.id] ?? PREVIEW_COUNT;
        const clampedVisible = isRootWithManyReplies ? Math.min(visibleCount, totalReplies) : totalReplies;
        const repliesToRender =
            commentItem.isRoot && hasReplies
                ? commentItem.replies.slice(0, clampedVisible)
                : commentItem.replies;
        const remaining = totalReplies - clampedVisible;

        return (
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
                            {commentItem.hasPurchased && (
                                <span className={cx('purchased-badge')}>
                                    <DiamondIcon size={12} />
                                    <span>Đã mua sản phẩm</span>
                                </span>
                            )}
                            {activeTab === 'reviews' && commentItem.rating && commentItem.rating > 0 && (
                                <div className={cx('comment-rating')}>
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <StarIcon
                                            key={index}
                                            size={14}
                                            className={cx('rating-star', {
                                                'is-filled': index < commentItem.rating!,
                                            })}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <span className={cx('comment-timestamp')}>
                            <ClockIcon size={14} />
                            <span>{formatTimestamp(commentItem.timestamp)}</span>
                        </span>
                    </div>

                    <div className={cx('comment-text')}>{commentItem.text}</div>

                    <div className={cx('comment-footer')}>
                        <button
                            className={cx('reply-button', {
                                'is-disabled': activeTab === 'reviews' && !canReplyToThread,
                            })}
                            type="button"
                            onClick={() => handleReplyClick(commentItem)}
                            disabled={activeTab === 'reviews' && !canReplyToThread}
                        >
                            <MessageCircleIcon size={14} />
                            <span>Trả lời</span>
                        </button>
                    </div>

                    {hasReplies && (
                        <div className={cx('comment-replies')}>
                            {repliesToRender?.map((reply) => renderComment(reply, true))}
                            {isRootWithManyReplies && (
                                <button
                                    type="button"
                                    className={cx('replies-toggle')}
                                    onClick={() =>
                                        toggleReplies(commentItem.id, totalReplies, PREVIEW_COUNT, CHUNK_SIZE)
                                    }
                                >
                                    {remaining > 0
                                        ? `Xem thêm ${remaining} phản hồi`
                                        : 'Thu gọn phản hồi'}
                                </button>
                            )}
                        </div>
                    )}

                    {(activeTab !== 'reviews' || canReplyToThread) &&
                        commentItem.isRoot &&
                        replyTarget?.rootId === commentItem.id && (
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
    };

    const renderCommentsList = () => {
        if (!productId) {
            return <p className={cx('comments-empty')}>Không tìm thấy sản phẩm để hiển thị bình luận.</p>;
        }

        const displayList = activeTab === 'reviews' ? reviewsList : commentsList;
        const loading = activeTab === 'reviews' ? isLoading : commentsLoading;
        const fetchError = activeTab === 'reviews' ? error : commentsError;

        if (loading) {
            return <p className={cx('comments-empty')}>Đang tải {activeTab === 'reviews' ? 'đánh giá' : 'bình luận'}...</p>;
        }

        if (fetchError) {
            return <p className={cx('comments-empty')}>Không thể tải {activeTab === 'reviews' ? 'đánh giá' : 'bình luận'}. Vui lòng thử lại sau.</p>;
        }

        if (displayList.length === 0) {
            return <p className={cx('comments-empty')}>Chưa có {activeTab === 'reviews' ? 'đánh giá' : 'bình luận'} nào cho sản phẩm này.</p>;
        }

        return displayList.map((commentItem) => renderComment(commentItem));
    };

    const commentsInfo = ratingSummary
        ? `Đánh giá trung bình ${averageRating.toFixed(1)}/5 từ ${totalReviews} lượt. ${verifiedPurchaseCount} khách hàng đã mua xác nhận.`
        : 'Thời gian phản hồi trung bình: 5 phút!';

    return (
        <section id="reviews" className={cx('product-comments')}>
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
                                        <span className={cx('metric-label')}>Tổng Điểm đánh giá</span>
                                        <strong className={cx('metric-value')}>
                                            {averageRating ? averageRating.toFixed(1) : '5.0'}
                                        </strong>
                                        <p>Có {totalReviews} lượt đánh giá từ người dùng</p>
                                    </div>
                                </div>
                                {/* <div className={cx('metric-card', 'metric-verified')}>
                                    <div className={cx('metric-icon')}>
                                        <ShieldCheckIcon size={18} />
                                    </div>
                                    <div className={cx('metric-content')}>
                                        <span className={cx('metric-label')}>Tổng Số Đánh Giá</span>
                                        <strong className={cx('metric-value')}>{verifiedPurchaseCount}</strong>
                                        <p>Đánh giá của người dùng đã mua hàng</p>
                                    </div>
                                </div> */}
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
                                {/* Chỉ hiển thị rating selector khi ở tab "Đánh giá" */}
                                {activeTab === 'reviews' && (
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
                                )}

                                <textarea
                                    className={cx('comments-input')}
                                    placeholder={
                                        canInteract
                                            ? activeTab === 'reviews'
                                                ? 'Chia sẻ trải nghiệm và đánh giá của bạn về sản phẩm này'
                                                : 'Chia sẻ ý kiến và thảo luận về sản phẩm này'
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
                                            <span>{activeTab === 'reviews' ? 'Gửi đánh giá' : 'Gửi bình luận'}</span>
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
                
                {/* Tabs */}
                <div className={cx('comments-tabs')}>
                    <button
                        type="button"
                        className={cx('tab-button', { 'is-active': activeTab === 'comments' })}
                        onClick={() => setActiveTab('comments')}
                    >
                        <MessageCircleIcon size={18} />
                        <span>Bình luận ({commentsCount})</span>
                    </button>
                    <button
                        type="button"
                        className={cx('tab-button', { 'is-active': activeTab === 'reviews' })}
                        onClick={() => setActiveTab('reviews')}
                    >
                        <StarIcon size={18} />
                        <span>Đánh giá ({reviewsCount})</span>
                    </button>
                </div>

                <div className={cx('thread-panel')}>
                    <div className={cx('thread-timeline')}>{renderCommentsList()}</div>
                </div>
            </div>

        </section>
    );
};

export default ProductComments;
