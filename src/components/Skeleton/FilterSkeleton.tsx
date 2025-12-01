'use client';

import React from 'react';
import classNames from 'classnames/bind';
import styles from './Skeleton.module.scss';

const cx = classNames.bind(styles);

const FilterSkeleton: React.FC = () => {
    return (
        <div className={cx('skeleton-filter')} aria-label="Đang tải bộ lọc">
            <div className={cx('skeleton-filter-row')} aria-hidden="true">
                <div className={cx('skeleton-line', 'skeleton-filter-dropdown')} />
                <div className={cx('skeleton-line', 'skeleton-filter-dropdown')} />
                <div className={cx('skeleton-line', 'skeleton-filter-input')} />
            </div>
            <div className={cx('skeleton-filter-row')} aria-hidden="true">
                <div className={cx('skeleton-line', 'skeleton-filter-input')} />
                <div className={cx('skeleton-line', 'skeleton-filter-input')} />
                <div className={cx('skeleton-line', 'skeleton-filter-button')} />
            </div>
        </div>
    );
};

export default React.memo(FilterSkeleton);

