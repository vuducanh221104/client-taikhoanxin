import { Metadata } from 'next';
import Link from 'next/link';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'FAQ - Thanh toán & Bảo mật | TAIKHOANXIN.COM',
    description: 'Câu hỏi thường gặp về thanh toán và bảo mật',
};

export default function PaymentFAQPage() {
    return (
        <div className={styles.helpContent}>
            <h1>Câu hỏi thường gặp - Thanh toán & Bảo mật</h1>
            
            <p>
                Tổng hợp các câu hỏi về phương thức thanh toán và bảo mật tại TAIKHOANXIN.COM.
            </p>

            <div className={styles.faqSection}>
                <h2>❓ TAIKHOANXIN.COM hỗ trợ những phương thức thanh toán nào?</h2>
                <div className={styles.faqAnswer}>
                    <p>Chúng tôi chấp nhận nhiều hình thức thanh toán:</p>
                    <ul>
                        <li>💳 <strong>Thẻ ATM nội địa</strong> (Vietcombank, Techcombank, VietinBank...)</li>
                        <li>💳 <strong>Thẻ tín dụng/ghi nợ</strong> (Visa, Mastercard)</li>
                        <li>📱 <strong>Ví điện tử</strong> (MoMo, ZaloPay, VNPay)</li>
                        <li>🏦 <strong>Chuyển khoản ngân hàng</strong></li>
                        <li>🏪 <strong>Thanh toán tại cửa hàng tiện lợi</strong></li>
                    </ul>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Thanh toán có an toàn không?</h2>
                <div className={styles.faqAnswer}>
                    <p>
                        <strong>Hoàn toàn an toàn!</strong> TAIKHOANXIN.COM sử dụng:
                    </p>
                    <ul>
                        <li>🔒 Mã hóa SSL 256-bit</li>
                        <li>🛡️ Cổng thanh toán uy tín (VNPay, OnePay...)</li>
                        <li>✅ Không lưu trữ thông tin thẻ</li>
                        <li>🔐 Xác thực 2 lớp (3D Secure)</li>
                    </ul>
                    <p className={styles.highlightText}>
                        💡 Chúng tôi KHÔNG BAO GIỜ yêu cầu mã OTP qua điện thoại hoặc email
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Tôi có nhận được hóa đơn không?</h2>
                <div className={styles.faqAnswer}>
                    <p>
                        Có! Sau khi thanh toán thành công, bạn sẽ nhận:
                    </p>
                    <ul>
                        <li>📧 Email xác nhận đơn hàng</li>
                        <li>🧾 Hóa đơn điện tử (nếu yêu cầu)</li>
                        <li>📱 Thông tin tài khoản đã mua</li>
                    </ul>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Tôi thanh toán rồi nhưng chưa nhận được tài khoản?</h2>
                <div className={styles.faqAnswer}>
                    <p>Đừng lo lắng! Hãy làm theo các bước sau:</p>
                    <ol>
                        <li>Kiểm tra email (kể cả thư mục Spam)</li>
                        <li>Kiểm tra mục "Đơn hàng của tôi" trên website</li>
                        <li>Đợi 5-10 phút (đôi khi hệ thống xử lý chậm)</li>
                        <li>Liên hệ CSKH với mã giao dịch</li>
                    </ol>
                    <p className={styles.highlightText}>
                        ⏱️ Thời gian xử lý: 1-5 phút (tự động) hoặc tối đa 30 phút (thủ công)
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Tôi có thể hủy đơn hàng và hoàn tiền không?</h2>
                <div className={styles.faqAnswer}>
                    <p>
                        Có, trong một số trường hợp:
                    </p>
                    <ul>
                        <li>✅ Chưa nhận được tài khoản sau 24 giờ</li>
                        <li>✅ Tài khoản lỗi không sử dụng được</li>
                        <li>✅ Sản phẩm không đúng mô tả</li>
                        <li>❌ Đã sử dụng tài khoản thành công</li>
                    </ul>
                    <p>
                        <Link href="/help/policies/return" className={styles.inlineLink}>
                            → Xem chi tiết chính sách đổi trả
                        </Link>
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Mã giảm giá/Coupon sử dụng như thế nào?</h2>
                <div className={styles.faqAnswer}>
                    <p><strong>Cách áp dụng mã giảm giá:</strong></p>
                    <ol>
                        <li>Thêm sản phẩm vào giỏ hàng</li>
                        <li>Vào trang thanh toán</li>
                        <li>Nhập mã giảm giá vào ô "Mã khuyến mãi"</li>
                        <li>Nhấn "Áp dụng"</li>
                        <li>Giá sẽ tự động giảm</li>
                    </ol>
                    <p className={styles.warningText}>
                        ⚠️ Lưu ý: Mỗi đơn hàng chỉ áp dụng được 1 mã giảm giá
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Thông tin cá nhân của tôi có được bảo mật không?</h2>
                <div className={styles.faqAnswer}>
                    <p>
                        <strong>Cam kết bảo mật tuyệt đối!</strong>
                    </p>
                    <ul>
                        <li>🔒 Mã hóa toàn bộ dữ liệu</li>
                        <li>🚫 Không chia sẻ thông tin cho bên thứ 3</li>
                        <li>✅ Tuân thủ luật bảo vệ dữ liệu cá nhân</li>
                        <li>🛡️ Hệ thống bảo mật đa lớp</li>
                    </ul>
                    <p>
                        <Link href="/help/policies/privacy" className={styles.inlineLink}>
                            → Xem chính sách bảo mật
                        </Link>
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Tôi bị lừa đảo giả mạo TAIKHOANXIN.COM, phải làm sao?</h2>
                <div className={styles.faqAnswer}>
                    <p className={styles.warningText}>
                        ⚠️ <strong>Cảnh báo:</strong> Chỉ giao dịch trên website chính thức!
                    </p>
                    <p>Nếu gặp trường hợp lừa đảo:</p>
                    <ol>
                        <li>Báo ngay cho CSKH chính thức</li>
                        <li>Không chuyển tiền cho bất kỳ tài khoản nào khác</li>
                        <li>Báo cơ quan công an nếu đã chuyển tiền</li>
                        <li>Cung cấp bằng chứng để chúng tôi xử lý</li>
                    </ol>
                    <div className={styles.highlightBox}>
                        <p><strong>✅ Kênh chính thức của TAIKHOANXIN.COM:</strong></p>
                        <ul>
                            <li>Website: www.taikhoanxin.com</li>
                            <li>Email: support@taikhoanxin.com</li>
                            <li>Hotline: 1900 xxxx</li>
                            <li>Facebook: /taikhoanxin.official</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className={styles.warningBox}>
                <h3>🚨 Lưu ý quan trọng về bảo mật</h3>
                <ul>
                    <li>Không chia sẻ mật khẩu tài khoản cho bất kỳ ai</li>
                    <li>Không cung cấp mã OTP qua điện thoại</li>
                    <li>Kiểm tra kỹ địa chỉ website trước khi thanh toán</li>
                    <li>Chỉ thanh toán qua cổng thanh toán chính thức</li>
                    <li>Đổi mật khẩu định kỳ</li>
                </ul>
            </div>

            <div className={styles.contactLink}>
                <p style={{ marginBottom: '16px' }}>
                    Cần hỗ trợ về thanh toán? Liên hệ ngay!
                </p>
                <Link href="/contact" className={styles.contactButton}>
                    💬 Chat với CSKH
                </Link>
            </div>
        </div>
    );
}
