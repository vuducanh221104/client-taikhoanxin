import { Metadata } from 'next';
import Link from 'next/link';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'FAQ - Tài khoản CapCut Pro | TAIKHOANXIN.COM',
    description: 'Câu hỏi thường gặp về tài khoản CapCut Pro',
};

export default function CapCutFAQPage() {
    return (
        <div className={styles.helpContent}>
            <h1>Câu hỏi thường gặp - CapCut Pro</h1>
            
            <p>
                Tổng hợp các câu hỏi thường gặp về tài khoản CapCut Pro tại TAIKHOANXIN.COM.
            </p>

            <div className={styles.faqSection}>
                <h2>❓ CapCut Pro khác gì CapCut Free?</h2>
                <div className={styles.faqAnswer}>
                    <div className={styles.productCategories}>
                        <div className={styles.category}>
                            <h4>🎬 CapCut Free</h4>
                            <ul>
                                <li>❌ Có watermark</li>
                                <li>❌ Giới hạn hiệu ứng, template</li>
                                <li>❌ Không xuất 4K</li>
                                <li>❌ Giới hạn AI features</li>
                            </ul>
                        </div>

                        <div className={styles.category}>
                            <h4>🎬 CapCut Pro ⭐</h4>
                            <ul>
                                <li>✅ Không watermark</li>
                                <li>✅ Tất cả hiệu ứng, template premium</li>
                                <li>✅ Xuất 4K, 60fps</li>
                                <li>✅ AI features không giới hạn</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ CapCut Pro có những tính năng gì?</h2>
                <div className={styles.faqAnswer}>
                    <ul>
                        <li>✅ <strong>Không watermark:</strong> Video chuyên nghiệp</li>
                        <li>✅ <strong>Xuất 4K 60fps:</strong> Chất lượng cao nhất</li>
                        <li>✅ <strong>AI Auto Captions:</strong> Tự động tạo phụ đề</li>
                        <li>✅ <strong>AI Voice Changer:</strong> Thay đổi giọng nói</li>
                        <li>✅ <strong>Background Removal:</strong> Xóa nền video</li>
                        <li>✅ <strong>Premium Effects:</strong> Hàng nghìn hiệu ứng</li>
                        <li>✅ <strong>Premium Templates:</strong> Template chuyên nghiệp</li>
                        <li>✅ <strong>Cloud Storage:</strong> Lưu trữ đám mây</li>
                    </ul>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Tôi có thể dùng CapCut Pro trên thiết bị nào?</h2>
                <div className={styles.faqAnswer}>
                    <p>CapCut Pro hoạt động trên nhiều nền tảng:</p>
                    <ul>
                        <li>📱 App di động (iOS, Android)</li>
                        <li>💻 Desktop (Windows, Mac)</li>
                        <li>🌐 Web (trình duyệt)</li>
                    </ul>
                    <p className={styles.highlightText}>
                        💡 Tài khoản Pro sync giữa các thiết bị
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Làm sao để xuất video không watermark?</h2>
                <div className={styles.faqAnswer}>
                    <p><strong>Cách xuất video Pro:</strong></p>
                    <ol>
                        <li>Đăng nhập tài khoản Pro</li>
                        <li>Hoàn thành chỉnh sửa video</li>
                        <li>Nhấn "Export" hoặc "Xuất"</li>
                        <li>Chọn chất lượng (1080p, 4K...)</li>
                        <li>Video sẽ không có watermark CapCut</li>
                    </ol>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ AI Auto Captions hoạt động như thế nào?</h2>
                <div className={styles.faqAnswer}>
                    <p>
                        AI Auto Captions tự động nhận diện giọng nói trong video 
                        và tạo phụ đề chính xác.
                    </p>
                    <p><strong>Cách sử dụng:</strong></p>
                    <ol>
                        <li>Chọn video trong timeline</li>
                        <li>Nhấn "Text" → "Auto Captions"</li>
                        <li>Chọn ngôn ngữ (Tiếng Việt, English...)</li>
                        <li>Đợi AI xử lý (vài giây)</li>
                        <li>Chỉnh sửa phụ đề nếu cần</li>
                    </ol>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Tôi có thể đổi mật khẩu CapCut không?</h2>
                <div className={styles.faqAnswer}>
                    <p className={styles.warningText}>
                        ⚠️ <strong>KHÔNG NÊN</strong> tự ý đổi mật khẩu tài khoản CapCut đã mua. 
                        Việc này sẽ làm mất bảo hành.
                    </p>
                    <p>Nếu cần đổi mật khẩu vì lý do bảo mật, vui lòng liên hệ CSKH trước.</p>
                </div>
            </div>

            <div className={styles.highlightBox}>
                <h3>💡 Mẹo sử dụng CapCut Pro hiệu quả</h3>
                <ul>
                    <li>🎬 Dùng template premium để tạo video nhanh</li>
                    <li>🤖 Dùng AI Auto Captions cho video TikTok, Reels</li>
                    <li>🎨 Khám phá hiệu ứng trending để video viral</li>
                    <li>🎵 Sử dụng thư viện nhạc bản quyền miễn phí</li>
                    <li>📐 Xuất nhiều tỷ lệ: 16:9 (YouTube), 9:16 (TikTok), 1:1 (Instagram)</li>
                    <li>🚀 Dùng AI Voice Changer để tạo giọng độc đáo</li>
                    <li>💾 Lưu project lên cloud để edit trên nhiều thiết bị</li>
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
