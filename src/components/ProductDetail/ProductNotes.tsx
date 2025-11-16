'use client';

import React from 'react';
import classNames from 'classnames/bind';
import styles from './ProductNotes.module.scss';

const cx = classNames.bind(styles);

interface ProductNotesProps {
    notes: string[];
}

const ProductNotes: React.FC<ProductNotesProps> = ({ notes }) => {
    return (
        <div className={cx('product-notes')}>
            <h3 className={cx('notes-title')}>Lưu ý:</h3>
            <ul className={cx('notes-list')}>
                {notes.map((note, index) => (
                    <li key={index} className={cx('notes-item')}>
                        {note.split('[').map((part, i) => {
                            if (part.includes(']')) {
                                const [linkText, rest] = part.split(']');
                                return (
                                    <React.Fragment key={i}>
                                        <a href="#" className={cx('notes-link')}>
                                            [{linkText}]
                                        </a>
                                        {rest}
                                    </React.Fragment>
                                );
                            }
                            return <span key={i}>{part}</span>;
                        })}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductNotes;

