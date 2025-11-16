import { Metadata } from 'next';
import Link from 'next/link';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'FAQ - YouTube Premium | TAIKHOANXIN.COM',
    description: 'Câu hỏi thường gặp về tài khoản YouTube Premium',
};

export default function YouTubeFAQPage() {
    return (
        <div className={styles.helpContent}>
            <h1>Câu hỏi thường gặp - YouTube Premium</h1>
            
            <p>
                Tổng hợp các câu hỏi thường gặp về tài khoản YouTube Premium tại TAIKHOANXIN.COM.
            </p>

            <div className={styles.faqSection}>
                <h2>❓ YouTube Premium có những tính năng gì?</h2>
                <div className={styles.faqAnswer}>
                    <p><strong>YouTube Premium mang đến trải nghiệm vượt trội:</strong></p>
                    <ul>
                        <li>✅ Xem video không quảng cáo</li>
                        <li>✅ Tải video về xem offline</li>
                        <li>✅ Phát video khi tắt màn hình (background play)</li>
                        <li>✅ YouTube Music Premium miễn phí</li>
                        <li>✅ Xem YouTube Originals</li>
                        <li>✅ Chất lượng video cao nhất</li>
                    </ul>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ YouTube Premium khác gì YouTube thường?</h2>
                <div className={styles.faqAnswer}>
                    <div className={styles.productCategories}>
                        <div className={styles.category}>
                            <h4>📺 YouTube Free</h4>
                            <ul>
                                <li>❌ Có nhiều quảng cáo</li>
                                <li>❌ Không tải video được</li>
                                <li>❌ Không phát nền</li>
                                <li>❌ YouTube Music có quảng cáo</li>
                            </ul>
                        </div>

                        <div className={styles.category}>
                            <h4>📺 YouTube Premium ⭐</h4>
                            <ul>
                                <li>✅ Không quảng cáo</li>
                                <li>✅ Tải video không giới hạn</li>
                                <li>✅ Phát khi tắt màn hình</li>
                                <li>✅ YouTube Music Premium miễn phí</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Làm sao để tải video YouTube về xem offline?</h2>
                <div className={styles.faqAnswer}>
                    <p><strong>Cách tải video trên app YouTube:</strong></p>
                    <ol>
                        <li>Mở app YouTube trên điện thoại</li>
                        <li>Tìm video muốn tải</li>
                        <li>Nhấn nút "Download" (⬇️) dưới video</li>
                        <li>Chọn chất lượng video (720p, 1080p...)</li>
                        <li>Đợi tải xong, xem trong mục "Library → Downloads"</li>
                    </ol>
                    <p className={styles.highlightText}>
                        💡 Video tải về sẽ tự động xóa sau 30 ngày nếu không xem
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ YouTube Music Premium là gì?</h2>
                <div className={styles.faqAnswer}>
                    <p>
                        YouTube Music Premium là dịch vụ nghe nhạc đi kèm với YouTube Premium. 
                        Bạn có thể:
                    </p>
                    <ul>
                        <li>Nghe nhạc không quảng cáo</li>
                        <li>Tải nhạc về nghe offline</li>
                        <li>Phát nhạc khi tắt màn hình</li>
                        <li>Chất lượng âm thanh cao</li>
                        <li>Truy cập hàng triệu bài hát</li>
                    </ul>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Tôi có thể xem YouTube Premium trên TV không?</h2>
                <div className={styles.faqAnswer}>
                    <p>
                        Có! Bạn có thể xem YouTube Premium trên Smart TV bằng cách:
                    </p>
                    <ol>
                        <li>Mở app YouTube trên TV</li>
                        <li>Vào Settings → Sign in</li>
                        <li>Đăng nhập bằng tài khoản Premium</li>
                        <li>Thưởng thức video không quảng cáo</li>
                    </ol>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Tại sao tôi vẫn thấy quảng cáo dù đã có Premium?</h2>
                <div className={styles.faqAnswer}>
                    <p>Các nguyên nhân có thể:</p>
                    <ul>
                        <li>Chưa đăng nhập tài khoản Premium</li>
                        <li>Tài khoản Premium đã hết hạn</li>
                        <li>Đang xem video có sponsor tích hợp (không phải quảng cáo YouTube)</li>
                        <li>Lỗi cache trình duyệt</li>
                    </ul>
                    <p>
                        <strong>Giải pháp:</strong> Đăng xuất và đăng nhập lại, hoặc liên hệ CSKH nếu vẫn gặp lỗi.
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ YouTube Premium có thể dùng chung không?</h2>
                <div className={styles.faqAnswer}>
                    <p>
                        Tài khoản YouTube Premium cá nhân chỉ nên dùng cho 1 người. 
                        Nếu muốn chia sẻ, nên mua gói Family (tối đa 6 người).
                    </p>
                    <p className={styles.warningText}>
                        ⚠️ Lưu ý: Không nên đăng nhập quá nhiều thiết bị cùng lúc 
                        để tránh bị khóa tài khoản.
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Phát nền (Background Play) là gì?</h2>
                <div className={styles.faqAnswer}>
                    <p>
                        Background Play cho phép bạn nghe âm thanh video khi:
                    </p>
                    <ul>
                        <li>Tắt màn hình điện thoại</li>
                        <li>Chuyển sang app khác</li>
                        <li>Khóa màn hình</li>
                    </ul>
                    <p>
                        Tính năng này rất hữu ích khi nghe nhạc, podcast, hoặc video giáo dục.
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Tôi có thể đổi mật khẩu YouTube Premium không?</h2>
                <div className={styles.faqAnswer}>
                    <p className={styles.warningText}>
                        ⚠️ <strong>KHÔNG NÊN</strong> tự ý đổi mật khẩu tài khoản YouTube Premium đã mua. 
                        Việc này sẽ làm mất bảo hành.
                    </p>
                    <p>
                        Nếu cần đổi mật khẩu vì lý do bảo mật, vui lòng liên hệ CSKH trước.
                    </p>
                </div>
            </div>

            <div className={styles.highlightBox}>
                <h3>💡 Mẹo sử dụng YouTube Premium hiệu quả</h3>
                <ul>
                    <li>Tải video trước khi đi du lịch để xem offline</li>
                    <li>Sử dụng YouTube Music thay thế Spotify</li>
                    <li>Bật phát nền để nghe podcast khi làm việc</li>
                    <li>Xem YouTube Originals độc quyền</li>
                    <li>Tạo playlist riêng để quản lý video yêu thích</li>
                    <li>Sử dụng tính năng Picture-in-Picture trên Android</li>
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
