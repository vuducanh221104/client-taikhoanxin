import { Metadata } from 'next';
import Link from 'next/link';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'FAQ - Bảo hành & Hỗ trợ | TAIKHOANXIN.COM',
    description: 'Câu hỏi thường gặp về bảo hành và hỗ trợ khách hàng',
};

export default function SupportFAQPage() {
    return (
        <div className={styles.helpContent}>
            <h1>Câu hỏi thường gặp - Bảo hành & Hỗ trợ</h1>
            
            <p>
                Tổng hợp các câu hỏi về chính sách bảo hành và dịch vụ hỗ trợ khách hàng.
            </p>

            <div className={styles.faqSection}>
                <h2>❓ Sản phẩm được bảo hành trong bao lâu?</h2>
                <div className={styles.faqAnswer}>
                    <p>
                        Thời gian bảo hành tương ứng với thời hạn gói cước bạn mua:
                    </p>
                    <ul>
                        <li>📅 Gói 1 tháng → Bảo hành 30 ngày</li>
                        <li>📅 Gói 3 tháng → Bảo hành 90 ngày</li>
                        <li>📅 Gói 6 tháng → Bảo hành 180 ngày</li>
                        <li>📅 Gói 1 năm → Bảo hành 365 ngày</li>
                    </ul>
                    <p>
                        <Link href="/help/policies/warranty" className={styles.inlineLink}>
                            → Xem chi tiết chính sách bảo hành
                        </Link>
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Những trường hợp nào được bảo hành?</h2>
                <div className={styles.faqAnswer}>
                    <p><strong>✅ Được bảo hành khi:</strong></p>
                    <ul>
                        <li>Tài khoản không đăng nhập được do lỗi từ nhà cung cấp</li>
                        <li>Tài khoản bị khóa không do lỗi người dùng</li>
                        <li>Sản phẩm hết hạn sớm hơn cam kết</li>
                        <li>Sản phẩm không đúng mô tả</li>
                        <li>Lỗi kỹ thuật từ hệ thống</li>
                    </ul>
                    <p><strong>❌ KHÔNG được bảo hành khi:</strong></p>
                    <ul>
                        <li>Tự ý đổi mật khẩu tài khoản</li>
                        <li>Chia sẻ tài khoản cho quá nhiều người</li>
                        <li>Vi phạm điều khoản nhà cung cấp</li>
                        <li>Sử dụng VPN không được phép</li>
                        <li>Hết thời gian bảo hành</li>
                    </ul>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Làm sao để yêu cầu bảo hành?</h2>
                <div className={styles.faqAnswer}>
                    <p><strong>Quy trình bảo hành đơn giản:</strong></p>
                    <ol>
                        <li><strong>Liên hệ CSKH</strong> qua Live Chat, Email hoặc Hotline</li>
                        <li><strong>Cung cấp thông tin:</strong>
                            <ul>
                                <li>Mã đơn hàng</li>
                                <li>Email đăng ký</li>
                                <li>Mô tả chi tiết lỗi</li>
                                <li>Ảnh chụp màn hình (nếu có)</li>
                            </ul>
                        </li>
                        <li><strong>Chờ kiểm tra:</strong> 1-2 giờ</li>
                        <li><strong>Nhận giải pháp:</strong> Đổi tài khoản mới hoặc hoàn tiền</li>
                    </ol>
                    <p className={styles.highlightText}>
                        ⏱️ Thời gian xử lý: 1-24 giờ tùy mức độ phức tạp
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Tôi có thể liên hệ CSKH qua kênh nào?</h2>
                <div className={styles.faqAnswer}>
                    <p>Chúng tôi hỗ trợ 24/7 qua nhiều kênh:</p>
                    <ul>
                        <li>💬 <strong>Live Chat:</strong> Trên website (góc phải màn hình)</li>
                        <li>📧 <strong>Email:</strong> support@taikhoanxin.com</li>
                        <li>📞 <strong>Hotline:</strong> 0377775528</li>
                        <li>💙 <strong>Facebook:</strong> m.me/taikhoanxincom</li>
                        <li>📱 <strong>Zalo:</strong> 0xxx xxx xxx</li>
                    </ul>
                    <p className={styles.highlightText}>
                        💡 Live Chat là kênh nhanh nhất, phản hồi trong 1-5 phút
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ CSKH làm việc vào thời gian nào?</h2>
                <div className={styles.faqAnswer}>
                    <p>
                        <strong>Chúng tôi hỗ trợ 24/7!</strong>
                    </p>
                    <ul>
                        <li>🤖 <strong>Chatbot tự động:</strong> 24/7 (trả lời ngay lập tức)</li>
                        <li>👨‍💼 <strong>CSKH trực tiếp:</strong> 8:00 - 22:00 hàng ngày</li>
                        <li>📧 <strong>Email:</strong> Phản hồi trong 2-6 giờ</li>
                        <li>🌙 <strong>Ngoài giờ:</strong> Để lại tin nhắn, sẽ phản hồi sớm nhất</li>
                    </ul>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Tôi có được hoàn tiền không?</h2>
                <div className={styles.faqAnswer}>
                    <p>Có, trong các trường hợp sau:</p>
                    <ul>
                        <li>💯 <strong>Hoàn 100%:</strong> Lỗi trong 24 giờ đầu và không thể khắc phục</li>
                        <li>📊 <strong>Hoàn theo tỷ lệ:</strong> Hoàn tiền phần thời gian chưa sử dụng</li>
                        <li>⏱️ <strong>Thời gian xử lý:</strong> 1-3 ngày làm việc</li>
                        <li>💳 <strong>Hình thức:</strong> Hoàn về tài khoản ví hoặc chuyển khoản</li>
                    </ul>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Tôi muốn đổi sang sản phẩm khác được không?</h2>
                <div className={styles.faqAnswer}>
                    <p>
                        Có! Bạn có thể đổi sang sản phẩm khác có giá trị tương đương hoặc 
                        bù thêm tiền nếu sản phẩm mới đắt hơn.
                    </p>
                    <p><strong>Điều kiện:</strong></p>
                    <ul>
                        <li>Trong thời gian bảo hành</li>
                        <li>Sản phẩm cũ chưa sử dụng quá 7 ngày</li>
                        <li>Có lý do chính đáng</li>
                    </ul>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Làm sao để theo dõi tiến độ xử lý bảo hành?</h2>
                <div className={styles.faqAnswer}>
                    <p>Bạn có thể theo dõi qua:</p>
                    <ul>
                        <li>📧 Email thông báo tự động</li>
                        <li>💬 Tin nhắn trên Live Chat</li>
                        <li>📱 SMS cập nhật trạng thái</li>
                        <li>🔍 Tra cứu trên website (mục "Đơn hàng của tôi")</li>
                    </ul>
                </div>
            </div>

            <div className={styles.highlightBox}>
                <h3>💡 Mẹo để được hỗ trợ nhanh chóng</h3>
                <ul>
                    <li>Chuẩn bị sẵn mã đơn hàng và email đăng ký</li>
                    <li>Chụp ảnh màn hình lỗi rõ ràng</li>
                    <li>Mô tả vấn đề chi tiết, đầy đủ</li>
                    <li>Liên hệ ngay khi phát hiện lỗi, đừng chờ lâu</li>
                    <li>Sử dụng Live Chat để được hỗ trợ nhanh nhất</li>
                    <li>Kiểm tra email thường xuyên để nhận phản hồi</li>
                </ul>
            </div>

            <div className={styles.warningBox}>
                <h3>⚠️ Lưu ý quan trọng</h3>
                <ul>
                    <li>Không tự ý sửa chữa hoặc thay đổi thông tin tài khoản</li>
                    <li>Lưu giữ email xác nhận đơn hàng để làm bằng chứng</li>
                    <li>Liên hệ CSKH trước khi thực hiện bất kỳ thao tác nào</li>
                    <li>Cung cấp thông tin chính xác để được hỗ trợ tốt nhất</li>
                </ul>
            </div>

            <div className={styles.contactLink}>
                <p style={{ marginBottom: '16px' }}>
                    Cần hỗ trợ ngay? Chúng tôi luôn sẵn sàng!
                </p>
                <Link href="/contact" className={styles.contactButton}>
                    💬 Chat với CSKH
                </Link>
            </div>
        </div>
    );
}
