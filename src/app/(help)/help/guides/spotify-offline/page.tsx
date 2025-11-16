import { Metadata } from 'next';
import Link from 'next/link';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'Hướng dẫn tải nhạc Offline trên Spotify | TAIKHOANXIN.COM',
    description: 'Hướng dẫn chi tiết cách tải nhạc về nghe offline trên Spotify Premium',
};

export default function SpotifyOfflineGuidePage() {
    return (
        <div className={styles.helpContent}>
            <h1>Cách tải nhạc Offline trên Spotify</h1>
            
            <p>
                Spotify Premium cho phép bạn tải nhạc về nghe offline mà không cần kết nối internet. 
                Đây là tính năng tuyệt vời khi bạn đi du lịch, ở nơi không có mạng, hoặc muốn tiết kiệm 4G.
            </p>

            <h2>📱 Tải nhạc trên điện thoại/tablet</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Mở app Spotify</h3>
                        <p>Đảm bảo bạn đã đăng nhập tài khoản Premium</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Chọn playlist hoặc album</h3>
                        <p>Tìm playlist/album bạn muốn tải về</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Bật nút Download</h3>
                        <p>Nhấn vào biểu tượng mũi tên xuống (⬇️) ở đầu playlist</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>4</div>
                    <div className={styles.stepContent}>
                        <h3>Đợi tải xong</h3>
                        <p>Mũi tên sẽ chuyển sang màu xanh khi tải xong</p>
                    </div>
                </div>
            </div>

            <h2>💻 Tải nhạc trên máy tính</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Mở Spotify Desktop App</h3>
                        <p>Lưu ý: Không thể tải trên trình duyệt web</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Vào playlist muốn tải</h3>
                        <p>Chọn playlist hoặc album từ thư viện</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Bật Download</h3>
                        <p>Click vào nút Download ở đầu playlist</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>4</div>
                    <div className={styles.stepContent}>
                        <h3>Kiểm tra tiến độ</h3>
                        <p>Xem tiến độ tải ở góc dưới bên trái</p>
                    </div>
                </div>
            </div>

            <h2>⚙️ Cài đặt chất lượng tải về</h2>

            <div className={styles.highlightBox}>
                <p><strong>Để thay đổi chất lượng nhạc tải về:</strong></p>
                <ol>
                    <li>Vào <strong>Settings</strong> (⚙️)</li>
                    <li>Chọn <strong>Audio Quality</strong></li>
                    <li>Trong mục <strong>Download</strong>, chọn:
                        <ul>
                            <li><strong>Low (24kbps):</strong> Tiết kiệm dung lượng</li>
                            <li><strong>Normal (96kbps):</strong> Cân bằng</li>
                            <li><strong>High (160kbps):</strong> Chất lượng tốt</li>
                            <li><strong>Very High (320kbps):</strong> Chất lượng cao nhất</li>
                        </ul>
                    </li>
                </ol>
            </div>

            <h2>🎵 Bật chế độ Offline</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Vào Settings</h3>
                        <p>Nhấn vào biểu tượng ⚙️</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Bật Offline Mode</h3>
                        <p>Kéo thanh "Offline" sang ON</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Nghe nhạc đã tải</h3>
                        <p>Chỉ hiển thị nhạc đã tải về</p>
                    </div>
                </div>
            </div>

            <h2>💡 Mẹo sử dụng hiệu quả</h2>

            <div className={styles.productCategories}>
                <div className={styles.category}>
                    <h4>📶 Tải khi có WiFi</h4>
                    <p>
                        Tải nhạc khi kết nối WiFi để tiết kiệm 4G. 
                        Có thể bật "Download using cellular" nếu cần.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>💾 Quản lý dung lượng</h4>
                    <p>
                        Kiểm tra dung lượng đã tải trong Settings → Storage. 
                        Xóa nhạc không nghe để giải phóng bộ nhớ.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>🔄 Tự động tải</h4>
                    <p>
                        Bật "Auto-download" để tự động tải nhạc mới 
                        trong playlist yêu thích.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>⏰ Nhạc tải về có hạn</h4>
                    <p>
                        Phải online ít nhất 1 lần/30 ngày để giữ nhạc offline. 
                        Nếu không, nhạc sẽ bị xóa.
                    </p>
                </div>
            </div>

            <h2>❓ Câu hỏi thường gặp</h2>

            <div className={styles.faqSection}>
                <h3>Tôi có thể tải bao nhiêu bài?</h3>
                <div className={styles.faqAnswer}>
                    <p>
                        Spotify Premium cho phép tải tối đa <strong>10,000 bài</strong> trên 
                        mỗi thiết bị, tối đa <strong>5 thiết bị</strong>.
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h3>Tại sao không thấy nút Download?</h3>
                <div className={styles.faqAnswer}>
                    <p>Các nguyên nhân có thể:</p>
                    <ul>
                        <li>Bạn chưa có Premium</li>
                        <li>Đang dùng trình duyệt web (phải dùng app)</li>
                        <li>Podcast không hỗ trợ tải về</li>
                        <li>Lỗi app, thử đăng xuất/nhập lại</li>
                    </ul>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h3>Nhạc tải về lưu ở đâu?</h3>
                <div className={styles.faqAnswer}>
                    <p>
                        Nhạc được mã hóa và lưu trong app Spotify, không thể truy cập 
                        từ File Manager. Chỉ nghe được trong app Spotify.
                    </p>
                </div>
            </div>

            <div className={styles.warningBox}>
                <h3>⚠️ Lưu ý quan trọng</h3>
                <ul>
                    <li>Phải có kết nối internet để tải nhạc lần đầu</li>
                    <li>Nhạc offline chỉ nghe được trong app Spotify</li>
                    <li>Phải online ít nhất 1 lần/30 ngày</li>
                    <li>Không thể chuyển nhạc đã tải sang thiết bị khác</li>
                    <li>Khi hết Premium, nhạc offline sẽ bị xóa</li>
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
