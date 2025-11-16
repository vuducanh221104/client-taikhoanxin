import { Metadata } from 'next';
import Link from 'next/link';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'FAQ - Tài khoản Spotify | TAIKHOANXIN.COM',
    description: 'Câu hỏi thường gặp về tài khoản Spotify Premium',
};

export default function SpotifyFAQPage() {
    return (
        <div className={styles.helpContent}>
            <h1>Câu hỏi thường gặp - Spotify</h1>
            
            <p>
                Tổng hợp các câu hỏi thường gặp về tài khoản Spotify Premium tại TAIKHOANXIN.COM.
            </p>

            <div className={styles.faqSection}>
                <h2>❓ Spotify Premium khác gì Spotify Free?</h2>
                <div className={styles.faqAnswer}>
                    <p><strong>Spotify Premium có các tính năng vượt trội:</strong></p>
                    <ul>
                        <li>✅ Không quảng cáo</li>
                        <li>✅ Tải nhạc về nghe offline</li>
                        <li>✅ Chất lượng âm thanh cao (320kbps)</li>
                        <li>✅ Bỏ qua bài hát không giới hạn</li>
                        <li>✅ Chọn bài hát bất kỳ để phát</li>
                        <li>✅ Nghe trên mọi thiết bị</li>
                    </ul>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Tôi có thể nghe Spotify trên thiết bị nào?</h2>
                <div className={styles.faqAnswer}>
                    <p>Spotify hỗ trợ đa nền tảng:</p>
                    <ul>
                        <li>📱 Điện thoại (iOS, Android)</li>
                        <li>💻 Máy tính (Windows, Mac, Linux)</li>
                        <li>🌐 Trình duyệt web</li>
                        <li>📺 Smart TV</li>
                        <li>🎮 PlayStation, Xbox</li>
                        <li>🚗 Xe hơi (Android Auto, CarPlay)</li>
                        <li>⌚ Smartwatch</li>
                    </ul>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Tài khoản Spotify Premium có thể dùng chung không?</h2>
                <div className={styles.faqAnswer}>
                    <p>
                        Tài khoản Spotify Premium cá nhân chỉ nên dùng cho 1 người. 
                        Nếu muốn chia sẻ, nên mua gói Family (6 người) hoặc Duo (2 người).
                    </p>
                    <p className={styles.warningText}>
                        ⚠️ Lưu ý: Spotify có thể phát hiện và khóa tài khoản nếu 
                        đăng nhập từ quá nhiều thiết bị hoặc địa điểm khác nhau.
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Làm sao để tải nhạc về nghe offline?</h2>
                <div className={styles.faqAnswer}>
                    <p><strong>Cách tải nhạc offline trên Spotify:</strong></p>
                    <ol>
                        <li>Mở app Spotify trên điện thoại</li>
                        <li>Vào playlist hoặc album muốn tải</li>
                        <li>Bật nút "Download" (⬇️)</li>
                        <li>Đợi tải xong, nhạc sẽ lưu trong thiết bị</li>
                        <li>Bật "Offline mode" để nghe không cần mạng</li>
                    </ol>
                    <p className={styles.highlightText}>
                        💡 Mẹo: Tải nhạc khi kết nối WiFi để tiết kiệm 4G
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Tại sao tài khoản Spotify của tôi bị hạ về Free?</h2>
                <div className={styles.faqAnswer}>
                    <p>Các nguyên nhân phổ biến:</p>
                    <ul>
                        <li>Tài khoản hết hạn Premium</li>
                        <li>Thanh toán không thành công</li>
                        <li>Tài khoản bị khóa do vi phạm</li>
                        <li>Lỗi hệ thống Spotify</li>
                    </ul>
                    <p>
                        <strong>Giải pháp:</strong> Liên hệ CSKH ngay để được kiểm tra và đổi tài khoản mới.
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Spotify có nhạc Việt Nam không?</h2>
                <div className={styles.faqAnswer}>
                    <p>
                        Có! Spotify có rất nhiều nhạc Việt từ các nghệ sĩ nổi tiếng như 
                        Sơn Tùng M-TP, Đen Vâu, Hoàng Thùy Linh, Binz, Amee... 
                        và cả các bài hát bolero, nhạc trẻ, rap Việt.
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Chất lượng âm thanh Spotify Premium là bao nhiêu?</h2>
                <div className={styles.faqAnswer}>
                    <p>Spotify Premium hỗ trợ nhiều mức chất lượng:</p>
                    <ul>
                        <li><strong>Low:</strong> 24kbps (tiết kiệm data)</li>
                        <li><strong>Normal:</strong> 96kbps</li>
                        <li><strong>High:</strong> 160kbps</li>
                        <li><strong>Very High:</strong> 320kbps (chất lượng cao nhất)</li>
                    </ul>
                    <p>
                        Bạn có thể điều chỉnh trong Settings → Audio Quality
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Tôi có thể chuyển playlist từ tài khoản cũ sang mới không?</h2>
                <div className={styles.faqAnswer}>
                    <p>
                        Có! Bạn có thể sử dụng các công cụ như Soundiiz, TuneMyMusic 
                        để chuyển playlist giữa các tài khoản Spotify.
                    </p>
                    <p>
                        <Link href="/help/guides/spotify-playlist" className={styles.inlineLink}>
                            → Xem hướng dẫn chi tiết chuyển playlist
                        </Link>
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Tôi có thể đổi mật khẩu Spotify không?</h2>
                <div className={styles.faqAnswer}>
                    <p className={styles.warningText}>
                        ⚠️ <strong>KHÔNG NÊN</strong> tự ý đổi mật khẩu tài khoản Spotify đã mua. 
                        Việc này sẽ làm mất bảo hành.
                    </p>
                    <p>
                        Nếu cần đổi mật khẩu vì lý do bảo mật, vui lòng liên hệ CSKH trước.
                    </p>
                </div>
            </div>

            <div className={styles.highlightBox}>
                <h3>💡 Mẹo sử dụng Spotify Premium hiệu quả</h3>
                <ul>
                    <li>Tạo playlist riêng cho từng tâm trạng</li>
                    <li>Sử dụng Spotify Connect để chuyển nhạc giữa các thiết bị</li>
                    <li>Khám phá nhạc mới qua "Discover Weekly" và "Release Radar"</li>
                    <li>Tải nhạc offline trước khi đi du lịch</li>
                    <li>Sử dụng Lyrics để xem lời bài hát</li>
                    <li>Bật "Crossfade" để chuyển bài mượt mà hơn</li>
                </ul>
            </div>

            <div className={styles.contactLink}>
                <p style={{ marginBottom: '16px' }}>
                    Vẫn còn thắc mắc? Liên hệ với chúng tôi!
                </p>
                <Link href="/contact" className={styles.contactButton}>
                    💬 Chat với CSKH
                </Link>
            </div>
        </div>
    );
}
