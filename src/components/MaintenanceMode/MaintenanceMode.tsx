import Image from 'next/image';
import { CheckIcon, ClockIcon, SettingsIcon, TelegramIcon, ToolIcon, ZaloIcon } from '@/components/Icons';
import styles from './MaintenanceMode.module.scss';

type MaintenanceModeProps = {
    telegramUrl: string;
    zaloUrl: string;
};

export default function MaintenanceMode({ telegramUrl, zaloUrl }: MaintenanceModeProps) {
    return (
        <main className={styles.maintenance} aria-labelledby="maintenance-title">
            <div className={styles.backgroundGrid} aria-hidden="true" />
            <div className={styles.floatingGearOne} aria-hidden="true">
                <SettingsIcon />
            </div>
            <div className={styles.floatingGearTwo} aria-hidden="true">
                <SettingsIcon />
            </div>

            <section className={styles.panel}>
                <div className={styles.iconStage} aria-hidden="true">
                    <div className={styles.orbit}>
                        <SettingsIcon className={styles.gearPrimary} />
                        <SettingsIcon className={styles.gearSecondary} />
                        <div className={styles.logoWrap}>
                            <Image
                                src="/logo/logo.png"
                                alt=""
                                width={54}
                                height={54}
                                className={styles.logoImage}
                                priority
                            />
                        </div>
                    </div>
                    <div className={styles.toolBadge}>
                        <ToolIcon />
                    </div>
                </div>

                <div className={styles.content}>
                    <p className={styles.eyebrow}>
                        <ClockIcon />
                        Đang nâng cấp hệ thống
                    </p>
                    <h1 id="maintenance-title" className={styles.title}>
                        Bảo trì nâng cấp
                    </h1>
                    <p className={styles.message}>
                        Hệ thống đang được bảo trì để nâng cấp trải nghiệm. Vui lòng liên hệ đội ngũ hỗ trợ nếu bạn cần
                        được xử lý ngay.
                    </p>
                </div>

                <div className={styles.statusList} aria-label="Tiến trình bảo trì">
                    <span>
                        <CheckIcon />
                        Kiểm tra hệ thống
                    </span>
                    <span>
                        <CheckIcon />
                        Nâng cấp dịch vụ
                    </span>
                    <span>
                        <CheckIcon />
                        Sắp hoạt động lại
                    </span>
                </div>

                <div className={styles.actions} aria-label="Kênh liên hệ hỗ trợ">
                    <a
                        className={`${styles.contactButton} ${styles.telegram}`}
                        href={telegramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <TelegramIcon />
                        <span>Telegram liên hệ</span>
                    </a>
                    <a
                        className={`${styles.contactButton} ${styles.zalo}`}
                        href={zaloUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <ZaloIcon />
                        <span>Liên hệ Zalo</span>
                    </a>
                </div>
            </section>

            <p className={styles.copyright}>© Tài Khoản Xin 2026</p>
        </main>
    );
}
