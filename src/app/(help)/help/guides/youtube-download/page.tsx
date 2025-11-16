import { Metadata } from 'next';
import Link from 'next/link';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'Hướng dẫn tải video YouTube Premium | TAIKHOANXIN.COM',
    description: 'Hướng dẫn chi tiết cách tải video về xem offline trên YouTube Premium',
};

export default function YouTubeDownloadGuidePage() {
    return (
        <div className={styles.helpContent}>
            <h1>Cách tải video YouTube Premium</h1>
            
            <p>
                YouTube Premium cho phép bạn tải video về xem offline mà không cần kết nối internet. 
                Đây là tính năng tuyệt vời khi bạn đi du lịch hoặc ở nơi không có mạng.
            </p>

            <h2>📱 Tải video trên điện thoại/tablet</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Mở app YouTube</h3>
                        <p>Đảm bảo bạn đã đăng nhập tài khoản Premium</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Tìm video muốn tải</h3>
                        <p>Tìm kiếm hoặc chọn video từ trang chủ</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Nhấn nút Download</h3>
                        <p>Nhấn biểu tượng mũi tên xuống (⬇️) dưới video</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>4</div>
                    <div className={styles.stepContent}>
                        <h3>Chọn chất lượng</h3>
                        <p>Chọn 720p, 1080p hoặc chất lượng khác</p>
                    </div>
                </div>
            </div>

            <h2>⚙️ Cài đặt tải video</h2>

            <div className={styles.highlightBox}>
                <p><strong>Để thay đổi cài đặt tải về:</strong></p>
                <ol>
                    <li>Vào <strong>Library</strong> → <strong>Downloads</strong></li>
                    <li>Nhấn biểu tượng ⚙️ (Settings)</li>
                    <li>Chọn các tùy chọn:
                        <ul>
                            <li><strong>Download quality:</strong> Chất lượng video</li>
                            <li><strong>Downloads:</strong> Chỉ tải qua WiFi hoặc cả 4G</li>
                            <li><strong>Smart downloads:</strong> Tự động tải video mới</li>
                        </ul>
                    </li>
                </ol>
            </div>

            <h2>📺 Xem video đã tải</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Vào Library</h3>
                        <p>Nhấn vào tab "Library" ở dưới cùng</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Chọn Downloads</h3>
                        <p>Nhấn vào "Downloads" để xem video đã tải</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Phát video</h3>
                        <p>Chọn video và xem offline</p>
                    </div>
                </div>
            </div>

            <h2>💡 Mẹo tải video hiệu quả</h2>

            <div className={styles.productCategories}>
                <div className={styles.category}>
                    <h4>📶 Tải qua WiFi</h4>
                    <p>Tải video khi kết nối WiFi để tiết kiệm 4G</p>
                </div>

                <div className={styles.category}>
                    <h4>💾 Quản lý dung lượng</h4>
                    <p>Xóa video đã xem để giải phóng bộ nhớ</p>
                </div>

                <div className={styles.category}>
                    <h4>🔄 Smart Downloads</h4>
                    <p>Bật để tự động tải video mới từ kênh yêu thích</p>
                </div>

                <div className={styles.category}>
                    <h4>⏰ Video có thời hạn</h4>
                    <p>Video tải về sẽ tự xóa sau 30 ngày nếu không xem</p>
                </div>
            </div>

            <h2>❓ Câu hỏi thường gặp</h2>

            <div className={styles.faqSection}>
                <h3>Tôi có thể tải bao nhiêu video?</h3>
                <div className={styles.faqAnswer}>
                    <p>Không giới hạn số lượng, chỉ giới hạn bởi dung lượng thiết bị của bạn.</p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h3>Tại sao không thấy nút Download?</h3>
                <div className={styles.faqAnswer}>
                    <ul>
                        <li>Bạn chưa có Premium</li>
                        <li>Video không cho phép tải (do chủ kênh)</li>
                        <li>Đang xem trên trình duyệt (phải dùng app)</li>
                    </ul>
                </div>
            </div>

            <div className={styles.warningBox}>
                <h3>⚠️ Lưu ý quan trọng</h3>
                <ul>
                    <li>Video chỉ xem được trong app YouTube</li>
                    <li>Phải online ít nhất 1 lần/30 ngày</li>
                    <li>Video tự xóa sau 30 ngày nếu không xem</li>
                    <li>Khi hết Premium, video offline sẽ bị xóa</li>
                </ul>
            </div>

            <div className={styles.contactLink}>
                <p style={{ marginBottom: '16px' }}>
                    Cần hỗ trợ thêm? Liên hệ với chúng tôi!
                </p>
                <Link href="/contact" className={styles.contactButton}>
                    💬 Chat với CSKH
                </Link>
            </div>
        </div>
    );
}
