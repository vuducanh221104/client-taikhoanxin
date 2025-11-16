'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './TableOfContents.module.scss';

interface Heading {
    id: string;
    text: string;
    level: number;
}

export default function TableOfContents() {
    const pathname = usePathname();
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        // Reset state khi chuyển trang
        setHeadings([]);
        setActiveId('');

        // Đợi một chút để DOM render xong
        const timer = setTimeout(() => {
            // Lấy tất cả heading h2, h3 trong main content
            const elements = document.querySelectorAll('main h2, main h3');
            const headingData: Heading[] = [];

            elements.forEach((element, index) => {
                const id = element.id || `heading-${index}`;
                if (!element.id) {
                    element.id = id;
                }

                headingData.push({
                    id,
                    text: element.textContent || '',
                    level: element.tagName === 'H2' ? 2 : 3,
                });
            });

            setHeadings(headingData);

            // Theo dõi scroll để highlight heading hiện tại
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setActiveId(entry.target.id);
                        }
                    });
                },
                { rootMargin: '-100px 0px -80% 0px' }
            );

            elements.forEach((element) => observer.observe(element));

            return () => observer.disconnect();
        }, 100);

        return () => {
            clearTimeout(timer);
        };
    }, [pathname]);

    const handleClick = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (headings.length === 0) return null;

    return (
        <aside className={styles.tableOfContents}>
            <div className={styles.tocHeader}>
                <h4>Cấu trúc các bài viết trong tài liệu</h4>
            </div>
            <nav className={styles.tocNav}>
                <ul className={styles.tocList}>
                    {headings.map((heading) => (
                        <li
                            key={heading.id}
                            className={`${styles.tocItem} ${
                                heading.level === 3 ? styles.tocItemSub : ''
                            } ${activeId === heading.id ? styles.active : ''}`}
                        >
                            <a
                                href={`#${heading.id}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleClick(heading.id);
                                }}
                                className={styles.tocLink}
                            >
                                {heading.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
