import { Metadata } from 'next';
import Link from 'next/link';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'Hướng dẫn YouTube Music Premium | TAIKHOANXIN.COM',
    description: 'Hướng dẫn sử dụng YouTube Music Premium',
};

export default function YouTubeMusicGuidePage() {
    return (
        <div className={styles.helpContent}>
            <h1>Sử dụng YouTube Music Premium</h1>
            
            <p>
                YouTube Music Premium đi kèm với YouTube Premium, cho phép bạn nghe nhạc không quảng cáo, 
                tải nhạc offline và phát nhạc khi tắt màn hình.
            </p>

            <h2>🎵 YouTube Music là gì?</h2>

            <div className={styles.highlightBox}>
                <p><strong>YouTube Music Premium bao gồm:</strong></p>
                <ul>
                    <li>✅ Nghe nhạc không quảng cáo</li>
                    <li>✅ Tải nhạc về nghe offline</li>
                    <li>✅ Phát nhạc khi tắt màn hình (background play)</li>
                    <li>✅ Chất lượng âm thanh cao</li>
                    <li>✅ Truy cập hàng triệu bài hát</li>
                    <li>✅ Xem video âm nhạc không quảng cáo</li>
                </ul>
            </div>

            <h2>🚀 Bắt đầu với YouTube Music</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Tải app</h3>
                        <p>Tải "YouTube Music" từ App Store hoặc Google Play</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Đăng nhập</h3>
                        <p>Đăng nhập bằng tài khoản YouTube Premium</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Khám phá nhạc</h3>
                        <p>Duyệt qua các playlist, album, nghệ sĩ</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>4</div>
                    <div className={styles.stepContent}>
                        <h3>Bắt đầu nghe</h3>
                        <p>Nhấn Play và thưởng thức!</p>
                    </div>
                </div>
            </div>

            <h2>🎧 Tính năng chính</h2>

            <div className={styles.productCategories}>
                <div className={styles.category}>
                    <h4>🎵 Nghe nhạc</h4>
                    <p>Nghe audio hoặc xem video âm nhạc</p>
                </div>

                <div className={styles.category}>
                    <h4>📥 Tải offline</h4>
                    <p>Tải nhạc về nghe không cần mạng</p>
                </div>

                <div className={styles.category}>
                    <h4>📱 Phát nền</h4>
                    <p>Nghe nhạc khi tắt màn hình</p>
                </div>

                <div className={styles.category}>
                    <h4>🎼 Playlist</h4>
                    <p>Tạo và quản lý playlist riêng</p>
                </div>
            </div>

            <h2>📥 Tải nhạc về nghe offline</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Chọn bài hát/album</h3>
                        <p>Tìm bài hát hoặc album muốn tải</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Nhấn Download</h3>
                        <p>Nhấn biểu tượng mũi tên xuống (⬇️)</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Xem trong Library</h3>
                        <p>Nhạc đã tải sẽ có trong mục "Downloads"</p>
                    </div>
                </div>
            </div>

            <h2>⚙️ Cài đặt chất lượng âm thanh</h2>

            <div className={styles.highlightBox}>
                <p><strong>Để thay đổi chất lượng:</strong></p>
                <ol>
                    <li>Vào Settings (⚙️)</li>
                    <li>Chọn "Audio quality"</li>
                    <li>Chọn chất lượng:
                        <ul>
                            <li><strong>Low:</strong> Tiết kiệm data</li>
                            <li><strong>Normal:</strong> Cân bằng</li>
                            <li><strong>High:</strong> Chất lượng tốt</li>
                            <li><strong>Always High:</strong> Luôn chất lượng cao</li>
                        </ul>
                    </li>
                </ol>
            </div>

            <h2>🎼 Tạo và quản lý Playlist</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Tạo playlist mới</h3>
                        <p>Vào Library → Nhấn "New playlist"</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Thêm bài hát</h3>
                        <p>Nhấn "⋮" trên bài hát → "Add to playlist"</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Sắp xếp</h3>
                        <p>Kéo thả để sắp xếp thứ tự bài hát</p>
                    </div>
                </div>
            </div>

            <h2>💡 Mẹo sử dụng hiệu quả</h2>

            <div className={styles.highlightBox}>
                <ul>
                    <li>🎯 Sử dụng "Your Mix" để khám phá nhạc mới</li>
                    <li>📻 Nghe "Radio" để phát nhạc tương tự</li>
                    <li>👍 Nhấn "Like" để cải thiện gợi ý</li>
                    <li>📥 Tải playlist trước khi đi du lịch</li>
                    <li>🔄 Bật "Shuffle" để nghe ngẫu nhiên</li>
                    <li>🔁 Bật "Repeat" để lặp lại bài hát</li>
                    <li>⏩ Tua nhanh 10 giây bằng cách nhấn 2 lần</li>
                </ul>
            </div>

            <h2>🆚 YouTube Music vs Spotify</h2>

            <div className={styles.highlightBox}>
                <h3>Ưu điểm YouTube Music:</h3>
                <ul>
                    <li>✅ Đi kèm YouTube Premium</li>
                    <li>✅ Có cả video âm nhạc</li>
                    <li>✅ Nhiều bản cover, remix, live</li>
                    <li>✅ Tích hợp với YouTube</li>
                </ul>

                <h3>Ưu điểm Spotify:</h3>
                <ul>
                    <li>✅ Giao diện thân thiện hơn</li>
                    <li>✅ Nhiều playlist được tuyển chọn</li>
                    <li>✅ Podcast phong phú</li>
                    <li>✅ Tính năng social tốt hơn</li>
                </ul>
            </div>

            <h2>❓ Câu hỏi thường gặp</h2>

            <div className={styles.faqSection}>
                <h3>YouTube Music có miễn phí không?</h3>
                <div className={styles.faqAnswer}>
                    <p>
                        Có phiên bản miễn phí nhưng có quảng cáo và không tải offline. 
                        Premium không quảng cáo và đầy đủ tính năng.
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h3>Có thể chuyển playlist từ Spotify sang không?</h3>
                <div className={styles.faqAnswer}>
                    <p>
                        Có! Sử dụng công cụ như Soundiiz hoặc TuneMyMusic để chuyển playlist.
                    </p>
                </div>
            </div>

            <div className={styles.warningBox}>
                <h3>⚠️ Lưu ý</h3>
                <ul>
                    <li>Cần tài khoản YouTube Premium để dùng Music Premium</li>
                    <li>Nhạc offline phải online ít nhất 1 lần/30 ngày</li>
                    <li>Không đổi mật khẩu tài khoản đã mua</li>
                </ul>
            </div>

            <div className={styles.contactLink}>
                <p style={{ marginBottom: '16px' }}>
                    Cần hỗ trợ? Liên hệ với chúng tôi!
                </p>
                <Link href="/contact" className={styles.contactButton}>
                    💬 Chat với CSKH
                </Link>
            </div>
        </div>
    );
}
