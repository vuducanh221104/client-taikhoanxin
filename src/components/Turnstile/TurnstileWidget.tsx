'use client';

import React from 'react';
import Turnstile from 'react-turnstile';

interface TurnstileWidgetProps {
    onSuccess: (token: string) => void;
    onError?: (message?: string) => void;
    onExpire?: () => void;
    resetKey?: string | number;
    className?: string;
    size?: 'normal' | 'compact' | 'invisible';
    theme?: 'light' | 'dark' | 'auto';
}

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({
    onSuccess,
    onError,
    onExpire,
    resetKey,
    className,
    size = 'invisible',
    theme = 'auto',
}) => {
    if (!siteKey) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('Turnstile site key is missing. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY in your environment.');
        }
        return null;
    }

    return (
        <div className={className}>
            <Turnstile
                key={resetKey}
                sitekey={siteKey}
                theme={theme}
                size={size}
                onVerify={(token: string) => {
                    onSuccess(token);
                }}
                onError={() => {
                    onError?.('Không thể xác minh. Vui lòng thử lại.');
                }}
                onExpire={() => {
                    onExpire?.();
                }}
            />
        </div>
    );
};

export default TurnstileWidget;

