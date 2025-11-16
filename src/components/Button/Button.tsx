'use client';

import React, { ReactNode } from 'react';
import classNames from 'classnames/bind';
import styles from './Button.module.scss';
import { LoaderIcon } from '@/components/Icons';

const cx = classNames.bind(styles);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'small' | 'medium' | 'large';
    isLoading?: boolean;
    loadingText?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    fullWidth?: boolean;
    children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'medium',
    isLoading = false,
    loadingText,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    className,
    children,
    ...props
}) => {
    const isDisabled = disabled || isLoading;

    return (
        <button
            className={cx(
                'button',
                `button-${variant}`,
                `button-${size}`,
                {
                    'button-loading': isLoading,
                    'button-full-width': fullWidth,
                },
                className
            )}
            disabled={isDisabled}
            aria-busy={isLoading}
            aria-disabled={isDisabled}
            {...props}
        >
            {isLoading && (
                <span className={cx('button-loader')} aria-hidden="true">
                    <LoaderIcon size={size === 'small' ? 14 : size === 'large' ? 20 : 16} />
                </span>
            )}
            {!isLoading && leftIcon && (
                <span className={cx('button-icon', 'button-icon-left')} aria-hidden="true">
                    {leftIcon}
                </span>
            )}
            <span className={cx('button-text')}>
                {isLoading && loadingText ? loadingText : children}
            </span>
            {!isLoading && rightIcon && (
                <span className={cx('button-icon', 'button-icon-right')} aria-hidden="true">
                    {rightIcon}
                </span>
            )}
        </button>
    );
};

export default Button;

