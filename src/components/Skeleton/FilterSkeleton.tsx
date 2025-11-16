'use client';

import React from 'react';
import classNames from 'classnames/bind';
import styles from './Skeleton.module.scss';

const cx = classNames.bind(styles);

const FilterSkeleton: React.FC = () => {
    return (
        <div className={cx('skeleton-filter')}>
            <div className={cx('skeleton-filter-row')}>
                <div className={cx('skeleton-line', 'skeleton-filter-dropdown')} />
                <div className={cx('skeleton-line', 'skeleton-filter-dropdown')} />
                <div className={cx('skeleton-line', 'skeleton-filter-input')} />
            </div>
            <div className={cx('skeleton-filter-row')}>
                <div className={cx('skeleton-line', 'skeleton-filter-input')} />
                <div className={cx('skeleton-line', 'skeleton-filter-input')} />
                <div className={cx('skeleton-line', 'skeleton-filter-button')} />
            </div>
        </div>
    );
};

export default FilterSkeleton;

