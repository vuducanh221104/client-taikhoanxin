'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import classNames from 'classnames/bind';
import styles from './ErrorState.module.scss';
import { AlertCircleIcon, RotateCcwIcon, HomeIcon } from '@/components/Icons';

const cx = classNames.bind(styles);

interface ErrorStateProps {
    error?: Error | null;
    title?: string;
    description?: string;
    onReset?: () => void;
    showReset?: boolean;
    showHome?: boolean;
}

const ErrorState: React.FC<ErrorStateProps> = ({
    error,
    title = 'Đã xảy ra lỗi',
    description,
    onReset,
    showReset = true,
    showHome = true,
}) => {
    const router = useRouter();

    const handleReset = () => {
        if (onReset) {
            onReset();
        } else {
            window.location.reload();
        }
    };

    const handleGoHome = () => {
        router.push('/');
    };

    const errorDescription = description || 
        error?.message || 
        'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.';

    return (
        <div className={cx('error-state')}>
            <div className={cx('error-content')}>
                <div className={cx('error-icon-wrapper')}>
                    <AlertCircleIcon size={64} className={cx('error-icon')} />
                </div>
                <h1 className={cx('error-title')}>{title}</h1>
                <p className={cx('error-description')}>{errorDescription}</p>
                
                {error && process.env.NODE_ENV === 'development' && (
                    <details className={cx('error-details')}>
                        <summary className={cx('error-details-summary')}>Chi tiết lỗi (Development)</summary>
                        <pre className={cx('error-stack')}>
                            {error.stack}
                        </pre>
                    </details>
                )}

                <div className={cx('error-actions')}>
                    {showReset && (
                        <button
                            type="button"
                            className={cx('error-button', 'error-button-primary')}
                            onClick={handleReset}
                        >
                            <RotateCcwIcon size={18} />
                            <span>Thử lại</span>
                        </button>
                    )}
                    {showHome && (
                        <button
                            type="button"
                            className={cx('error-button', 'error-button-secondary')}
                            onClick={handleGoHome}
                        >
                            <HomeIcon size={18} />
                            <span>Về trang chủ</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ErrorState;

