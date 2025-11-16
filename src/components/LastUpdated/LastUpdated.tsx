'use client';

import styles from './LastUpdated.module.scss';

interface LastUpdatedProps {
    date?: string; // Format: 'YYYY-MM-DD'
}

export default function LastUpdated({ date }: LastUpdatedProps) {
    const formatDate = (dateString?: string) => {
        if (!dateString) {
            // Nếu không có date, dùng ngày hiện tại
            return new Date().toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        }

        const d = new Date(dateString);
        return d.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className={styles.lastUpdated}>
            <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round" 
                strokeLinejoin="round"
            >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Cập nhật lần cuối: {formatDate(date)}</span>
        </div>
    );
}
