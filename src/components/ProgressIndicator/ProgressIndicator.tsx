'use client';

import React from 'react';
import classNames from 'classnames/bind';
import styles from './ProgressIndicator.module.scss';
import { CheckCircleIcon } from '@/components/Icons';

const cx = classNames.bind(styles);

export interface Step {
    id: string;
    label: string;
    description?: string;
}

interface ProgressIndicatorProps {
    steps: Step[];
    currentStep: number;
    className?: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
    steps,
    currentStep,
    className,
}) => {
    return (
        <div className={cx('progress-indicator', className)}>
            <div className={cx('progress-steps')}>
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;
                    const isPending = index > currentStep;

                    return (
                        <React.Fragment key={step.id}>
                            <div
                                className={cx('step', {
                                    'step-completed': isCompleted,
                                    'step-current': isCurrent,
                                    'step-pending': isPending,
                                })}
                            >
                                <div className={cx('step-circle')}>
                                    {isCompleted ? (
                                        <CheckCircleIcon size={18} className={cx('step-check-icon')} />
                                    ) : (
                                        <span className={cx('step-number')}>{index + 1}</span>
                                    )}
                                </div>
                                <div className={cx('step-label-wrapper')}>
                                    <span className={cx('step-label')}>{step.label}</span>
                                    {step.description && (
                                        <span className={cx('step-description')}>{step.description}</span>
                                    )}
                                </div>
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={cx('step-connector', {
                                        'connector-completed': isCompleted,
                                        'connector-pending': !isCompleted && !isCurrent,
                                    })}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default ProgressIndicator;

