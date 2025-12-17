'use client';

import React, { useState } from 'react';
import classNames from 'classnames/bind';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './ProductFAQ.module.scss';
import { StarIcon } from '@/components/Icons';

const cx = classNames.bind(styles);

interface FAQ {
    question: string;
    answer: string;
}

interface ProductFAQProps {
    faqs: FAQ[];
    rating: number;
    reviewCount: number;
    variant?: 'expanded' | 'collapsible'; // 'expanded' = hiển thị tất cả, 'collapsible' = có thể click
}

const ProductFAQ: React.FC<ProductFAQProps> = ({ faqs, rating, reviewCount, variant = 'expanded' }) => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const isExpanded = (index: number) => {
        if (variant === 'expanded') return true;
        return expandedIndex === index;
    };

    return (
        <div className={cx('product-faq')}>
            <h3 className={cx('faq-title')}>Câu hỏi thường gặp</h3>
            <div className={cx('faq-list', { 'expanded-variant': variant === 'expanded' })}>
                {faqs.map((faq, index) => (
                    <div key={index} className={cx('faq-item')}>
                        {variant === 'collapsible' ? (
                            <button
                                className={cx('faq-question', { active: expandedIndex === index })}
                                onClick={() => toggleFAQ(index)}
                                aria-expanded={expandedIndex === index}
                                aria-controls={`faq-answer-${index}`}
                            >
                                <span className={cx('faq-number')}>{index + 1}.</span>
                                <span className={cx('faq-question-text')}>{faq.question}</span>
                                <span className={cx('arrow-icon')}>{expandedIndex === index ? '▲' : '▼'}</span>
                            </button>
                        ) : (
                            <div className={cx('faq-question', 'static')}>
                                <span className={cx('faq-number')}>{index + 1}.</span>
                                <span className={cx('faq-question-text')}>{faq.question}</span>
                            </div>
                        )}
                        {isExpanded(index) && (
                            <div
                                id={`faq-answer-${index}`}
                                className={cx('faq-answer', { 'expanded-variant': variant === 'expanded' })}
                            >
                                <div className={cx('faq-answer-content', 'markdown-body')}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {faq.answer}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className={cx('product-rating')}>
                <span className={cx('rating-label')}>Rating: {rating}</span>
                <StarIcon size={20} className={cx('rating-star')} />
                <span className={cx('rating-count')}>({reviewCount} Votes)</span>
            </div>
        </div>
    );
};

export default ProductFAQ;