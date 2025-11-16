import { Metadata } from 'next';
import Link from 'next/link';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'FAQ - Tài khoản Netflix | TAIKHOANXIN.COM',
    description: 'Câu hỏi thường gặp về tài khoản Netflix',
};

export default function NetflixFAQPage() {
    return (
        <div className={styles.helpContent}>
            <h1>Câu hỏi thường gặp - Netflix</h1>
            
            <p>
                Tổng hợp các câu hỏi thường gặp về tài khoản Netflix tại TAIKHOANXIN.COM.
            </p>

            <div className={styles.faqSection}>
                <h2>❓ Tài khoản Netflix có bao nhiêu loại?</h2>
                <div className={styles.faqAnswer}>
                    <p>Netflix có 4 gói chính:</p>
                    <ul>
                        <li><strong>Mobile:</strong> Xem trên điện thoại/tablet, chất lượng SD (480p)</li>
                        <li><strong>Basic:</strong> 1 màn hình, chất lượng HD (720p)</li>
                        <li><strong>Standard:</strong> 2 màn hình cùng lúc, chất lượng Full HD (1080p)</li>
                        <li><strong>Premium:</strong> 4 màn hình cùng lúc, chất lượng 4K Ultra HD</li>
                    </ul>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Tôi có thể xem Netflix trên thiết bị nào?</h2>
                <div className={styles.faqAnswer}>
                    <p>Bạn có thể xem Netflix trên:</p>
                    <ul>
                        <li>Smart TV (Samsung, LG, Sony...)</li>
                        <li>Điện thoại và tablet (iOS, Android)</li>
                        <li>Máy tính (trình duyệt web)</li>
                        <li>Thiết bị streaming (Chromecast, Apple TV, Fire TV...)</li>
                        <li>Máy chơi game (PlayStation, Xbox)</li>
                    </ul>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Tài khoản Netflix có thể chia sẻ được không?</h2>
                <div className={styles.faqAnswer}>
                    <p>
                        Tùy theo gói bạn mua. Gói Standard cho phép 2 người xem cùng lúc, 
                        gói Premium cho phép 4 người. Tuy nhiên, Netflix đang hạn chế chia sẻ 
                        tài khoản ngoài cùng hộ gia đình.
                    </p>
                    <p className={styles.warningText}>
                        ⚠️ Lưu ý: Không nên chia sẻ tài khoản cho quá nhiều người hoặc 
                        sử dụng ở nhiều địa điểm khác nhau để tránh bị khóa.
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Tại sao tôi không đăng nhập được Netflix?</h2>
                <div className={styles.faqAnswer}>
                    <p>Các nguyên nhân thường gặp:</p>
                    <ul>
                        <li>Sai email hoặc mật khẩu</li>
                        <li>Tài khoản đã hết hạn</li>
                        <li>Tài khoản bị khóa do vi phạm</li>
                        <li>Đăng nhập quá nhiều thiết bị</li>
                        <li>Vùng địa lý không được hỗ trợ</li>
                    </ul>
                    <p>
                        <strong>Giải pháp:</strong> Liên hệ ngay với CSKH để được hỗ trợ đổi tài khoản mới.
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Netflix có phụ đề tiếng Việt không?</h2>
                <div className={styles.faqAnswer}>
                    <p>
                        Có! Hầu hết các phim và series phổ biến trên Netflix đều có phụ đề tiếng Việt. 
                        Bạn có thể bật phụ đề bằng cách:
                    </p>
                    <ol>
                        <li>Phát video</li>
                        <li>Nhấn vào biểu tượng hội thoại (💬)</li>
                        <li>Chọn "Tiếng Việt" trong danh sách phụ đề</li>
                    </ol>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Tôi có thể tải phim về xem offline không?</h2>
                <div className={styles.faqAnswer}>
                    <p>
                        Có! Netflix cho phép tải phim/series về xem offline trên app di động. 
                        Tuy nhiên không phải tất cả nội dung đều có thể tải về.
                    </p>
                    <p><strong>Cách tải:</strong></p>
                    <ol>
                        <li>Mở app Netflix trên điện thoại/tablet</li>
                        <li>Tìm phim/series muốn tải</li>
                        <li>Nhấn nút tải xuống (⬇️)</li>
                        <li>Xem trong mục "Downloads"</li>
                    </ol>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Tài khoản Netflix có bị giới hạn vùng không?</h2>
                <div className={styles.faqAnswer}>
                    <p>
                        Có. Nội dung Netflix khác nhau tùy theo từng quốc gia. Tài khoản từ 
                        TAIKHOANXIN.COM thường là tài khoản khu vực Việt Nam hoặc Đông Nam Á.
                    </p>
                    <p className={styles.warningText}>
                        ⚠️ Không nên sử dụng VPN để truy cập nội dung của quốc gia khác 
                        vì có thể bị khóa tài khoản.
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Tôi có thể đổi mật khẩu Netflix không?</h2>
                <div className={styles.faqAnswer}>
                    <p className={styles.warningText}>
                        ⚠️ <strong>KHÔNG NÊN</strong> tự ý đổi mật khẩu tài khoản Netflix đã mua. 
                        Việc này sẽ làm mất bảo hành và có thể gây lỗi tài khoản.
                    </p>
                    <p>
                        Nếu cần đổi mật khẩu vì lý do bảo mật, vui lòng liên hệ CSKH trước.
                    </p>
                </div>
            </div>

            <div className={styles.highlightBox}>
                <h3>💡 Mẹo sử dụng Netflix hiệu quả</h3>
                <ul>
                    <li>Tạo nhiều profile cho từng thành viên trong gia đình</li>
                    <li>Sử dụng tính năng "My List" để lưu phim muốn xem</li>
                    <li>Bật phụ đề để học ngoại ngữ</li>
                    <li>Tải phim trước khi đi du lịch để xem offline</li>
                    <li>Kiểm tra "Top 10" để xem phim hot nhất</li>
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
