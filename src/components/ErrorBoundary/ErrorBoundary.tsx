'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import EmptyState from '@/components/EmptyState/EmptyState';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
        });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <EmptyState
                    type="error"
                    title="Đã có lỗi xảy ra"
                    description={
                        process.env.NODE_ENV === 'development' && this.state.error
                            ? this.state.error.message
                            : 'Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại sau.'
                    }
                    actionLabel="Thử lại"
                    onAction={this.handleReset}
                    secondaryActionLabel="Về trang chủ"
                    secondaryActionHref="/"
                />
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
