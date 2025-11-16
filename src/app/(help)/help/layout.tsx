import { ReactNode } from 'react';
import HelpHeader from '@/components/HelpHeader/HelpHeader';
import HelpSidebar from '@/components/HelpSidebar/HelpSidebar';
import TableOfContents from '@/components/TableOfContents';
import HelpNavigation from '@/components/HelpNavigation';
import LastUpdated from '@/components/LastUpdated';
import ImageZoom from '@/components/ImageZoom/ImageZoom';
import styles from './help-layout.module.scss';

export default function HelpLayout({ children }: { children: ReactNode }) {
    return (
        <div className={styles.helpWrapper}>
            <HelpHeader />
            <div className={styles.helpContainer}>
                <HelpSidebar />
                <main className={styles.helpMain}>
                    <div className={styles.helpContentWrapper}>
                        {children}
                        <LastUpdated />
                    </div>
                    <HelpNavigation />
                </main>
                <TableOfContents />
            </div>
            <ImageZoom />
        </div>
    );
}
