'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getAdjacentPages } from '@/data/helpNavigation';
import styles from './HelpNavigation.module.scss';

export default function HelpNavigation() {
    const pathname = usePathname();
    const { prev, next } = getAdjacentPages(pathname);

    if (!prev && !next) {
        return null;
    }

    return (
        <nav className={styles.helpNavigation}>
            <div className={styles.navContainer}>
                {prev ? (
                    <Link href={prev.href} className={`${styles.navButton} ${styles.prevButton}`}>
                        <span className={styles.navLabel}>← Trước</span>
                        <span className={styles.navTitle}>{prev.title}</span>
                    </Link>
                ) : (
                    <div />
                )}

                {next ? (
                    <Link href={next.href} className={`${styles.navButton} ${styles.nextButton}`}>
                        <span className={styles.navLabel}>Tiếp →</span>
                        <span className={styles.navTitle}>{next.title}</span>
                    </Link>
                ) : (
                    <div />
                )}
            </div>
        </nav>
    );
}
