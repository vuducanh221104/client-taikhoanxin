import { Metadata } from 'next';
import Link from 'next/link';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'FAQ - Tài khoản Canva Pro | TAIKHOANXIN.COM',
    description: 'Câu hỏi thường gặp về tài khoản Canva Pro',
};

export default function CanvaFAQPage() {
    return (
        <div className={styles.helpContent}>
            <h1>Câu hỏi thường gặp - Canva Pro</h1>
            
            <p>
                Tổng hợp các câu hỏi thường gặp về tài khoản Canva Pro tại TAIKHOANXIN.COM.
            </p>

            <div className={styles.faqSection}>
                <h2>❓ Canva Pro khác gì Canva Free?</h2>
                <div className={styles.faqAnswer}>
                    <div className={styles.productCategories}>
                        <div className={styles.category}>
                            <h4>🎨 Canva Free</h4>
                            <ul>
                                <li>❌ Giới hạn template và ảnh</li>
                                <li>❌ Không xóa nền tự động</li>
                                <li>❌ Không resize thiết kế</li>
                                <li>❌ Lưu trữ 5GB</li>
                            </ul>
                        </div>

                        <div className={styles.category}>
                            <h4>🎨 Canva Pro ⭐</h4>
                            <ul>
                                <li>✅ 610,000+ template premium</li>
                                <li>✅ Xóa nền 1 click (Magic Eraser)</li>
                                <li>✅ Resize thiết kế tự động</li>
                                <li>✅ Lưu trữ 1TB</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Canva Pro có những tính năng gì?</h2>
                <div className={styles.faqAnswer}>
                    <ul>
                        <li>✅ <strong>610,000+ Template Premium:</strong> Thiết kế chuyên nghiệp</li>
                        <li>✅ <strong>Background Remover:</strong> Xóa nền ảnh tự động</li>
                        <li>✅ <strong>Magic Resize:</strong> Thay đổi kích thước thiết kế tự động</li>
                        <li>✅ <strong>Brand Kit:</strong> Quản lý màu sắc, font chữ thương hiệu</li>
                        <li>✅ <strong>100+ triệu ảnh, video, audio:</strong> Thư viện khổng lồ</li>
                        <li>✅ <strong>Lưu trữ 1TB:</strong> Không lo hết dung lượng</li>
                        <li>✅ <strong>Lên lịch đăng:</strong> Đăng social media tự động</li>
                        <li>✅ <strong>Tải về chất lượng cao:</strong> PNG, PDF, SVG...</li>
                    </ul>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Tôi có thể dùng Canva Pro trên thiết bị nào?</h2>
                <div className={styles.faqAnswer}>
                    <p>Canva Pro hoạt động trên mọi thiết bị:</p>
                    <ul>
                        <li>💻 Máy tính (trình duyệt web)</li>
                        <li>📱 App di động (iOS, Android)</li>
                        <li>🌐 Mọi trình duyệt hiện đại</li>
                    </ul>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Tài khoản Canva Pro có thể chia sẻ không?</h2>
                <div className={styles.faqAnswer}>
                    <p>
                        Canva Pro cho phép mời thành viên vào team (tùy gói). 
                        Tuy nhiên tài khoản từ TAIKHOANXIN.COM nên dùng cá nhân để đảm bảo an toàn.
                    </p>
                    <p className={styles.warningText}>
                        ⚠️ Không nên chia sẻ tài khoản cho quá nhiều người để tránh bị khóa.
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Làm sao để xóa nền ảnh?</h2>
                <div className={styles.faqAnswer}>
                    <p><strong>Cách sử dụng Background Remover:</strong></p>
                    <ol>
                        <li>Upload ảnh vào Canva</li>
                        <li>Chọn ảnh → Nhấn "Edit photo"</li>
                        <li>Chọn "Background Remover" hoặc "BG Remover"</li>
                        <li>Đợi vài giây, nền sẽ tự động bị xóa</li>
                        <li>Tải về ảnh PNG trong suốt</li>
                    </ol>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Tôi có thể đổi mật khẩu Canva không?</h2>
                <div className={styles.faqAnswer}>
                    <p className={styles.warningText}>
                        ⚠️ <strong>KHÔNG NÊN</strong> tự ý đổi mật khẩu tài khoản Canva đã mua. 
                        Việc này sẽ làm mất bảo hành.
                    </p>
                    <p>Nếu cần đổi mật khẩu vì lý do bảo mật, vui lòng liên hệ CSKH trước.</p>
                </div>
            </div>

            <div className={styles.highlightBox}>
                <h3>💡 Mẹo sử dụng Canva Pro hiệu quả</h3>
                <ul>
                    <li>🎨 Khám phá template premium để tiết kiệm thời gian</li>
                    <li>🖼️ Dùng Background Remover để tạo ảnh chuyên nghiệp</li>
                    <li>📐 Dùng Magic Resize để tạo nhiều kích thước từ 1 thiết kế</li>
                    <li>🎨 Tạo Brand Kit để thống nhất màu sắc, font chữ</li>
                    <li>📅 Lên lịch đăng bài lên Facebook, Instagram tự động</li>
                    <li>💾 Tổ chức thiết kế bằng folder để dễ tìm kiếm</li>
                    <li>🔍 Sử dụng thư viện ảnh, video, audio miễn phí</li>
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
