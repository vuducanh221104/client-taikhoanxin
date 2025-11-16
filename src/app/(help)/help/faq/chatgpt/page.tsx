import { Metadata } from 'next';
import Link from 'next/link';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'FAQ - Tài khoản ChatGPT | TAIKHOANXIN.COM',
    description: 'Câu hỏi thường gặp về tài khoản ChatGPT Plus',
};

export default function ChatGPTFAQPage() {
    return (
        <div className={styles.helpContent}>
            <h1>Câu hỏi thường gặp - ChatGPT</h1>
            
            <p>
                Tổng hợp các câu hỏi thường gặp về tài khoản ChatGPT Plus tại TAIKHOANXIN.COM.
            </p>

            <div className={styles.faqSection}>
                <h2>❓ ChatGPT Plus khác gì ChatGPT Free?</h2>
                <div className={styles.faqAnswer}>
                    <div className={styles.productCategories}>
                        <div className={styles.category}>
                            <h4>🤖 ChatGPT Free</h4>
                            <ul>
                                <li>❌ Chỉ dùng GPT-4o mini (giới hạn)</li>
                                <li>❌ Giới hạn số message mỗi ngày</li>
                                <li>❌ Chậm khi đông người dùng</li>
                                <li>❌ Không có DALL-E, Canvas, Voice</li>
                                <li>❌ Không có GPT-5, o1</li>
                            </ul>
                        </div>

                        <div className={styles.category}>
                            <h4>🤖 ChatGPT Plus ⭐</h4>
                            <ul>
                                <li>✅ Dùng GPT-5 Chat, ChatGPT-4o không giới hạn</li>
                                <li>✅ Truy cập GPT-5.1, GPT-5 Pro, GPT-5 mini</li>
                                <li>✅ Truy cập ưu tiên, nhanh hơn</li>
                                <li>✅ DALL-E 3, Canvas, Voice Mode</li>
                                <li>✅ Advanced Data Analysis, GPTs</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ ChatGPT Plus có những tính năng gì?</h2>
                <div className={styles.faqAnswer}>
                    <p><strong>🤖 Models AI:</strong></p>
                    <ul>
                        <li>✅ <strong>GPT-5 Chat:</strong> Model mới nhất cho chat thông minh</li>
                        <li>✅ <strong>ChatGPT-4o:</strong> Cân bằng tốc độ và chất lượng</li>
                        <li>✅ <strong>GPT-5.1:</strong> Tốt nhất cho coding và agentic tasks</li>
                        <li>✅ <strong>GPT-5 Pro:</strong> Thông minh và chính xác hơn</li>
                        <li>✅ <strong>GPT-5 mini:</strong> Nhanh và tiết kiệm</li>
                    </ul>
                    
                    <p style={{ marginTop: '16px' }}><strong>🎨 Tính năng khác:</strong></p>
                    <ul>
                        <li>✅ <strong>DALL-E 3:</strong> Tạo hình ảnh chất lượng cao</li>
                        <li>✅ <strong>Canvas:</strong> Viết và chỉnh sửa văn bản, code trực quan</li>
                        <li>✅ <strong>Advanced Data Analysis:</strong> Phân tích dữ liệu, chạy code</li>
                        <li>✅ <strong>Web Browsing:</strong> Tìm kiếm thông tin mới nhất</li>
                        <li>✅ <strong>Vision:</strong> Phân tích và hiểu hình ảnh</li>
                        <li>✅ <strong>Voice Mode:</strong> Trò chuyện bằng giọng nói</li>
                        <li>✅ <strong>GPTs:</strong> Sử dụng GPT tùy chỉnh từ cộng đồng</li>
                    </ul>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Tôi có thể dùng ChatGPT Plus trên thiết bị nào?</h2>
                <div className={styles.faqAnswer}>
                    <p>ChatGPT Plus hoạt động trên mọi thiết bị:</p>
                    <ul>
                        <li>💻 Máy tính (trình duyệt web)</li>
                        <li>📱 Điện thoại (iOS, Android app)</li>
                        <li>🌐 Mọi trình duyệt (Chrome, Safari, Firefox...)</li>
                    </ul>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Tài khoản ChatGPT Plus có thể chia sẻ không?</h2>
                <div className={styles.faqAnswer}>
                    <p className={styles.warningText}>
                        ⚠️ <strong>KHÔNG NÊN</strong> chia sẻ tài khoản ChatGPT Plus. 
                        OpenAI có thể phát hiện và khóa tài khoản nếu đăng nhập từ nhiều IP khác nhau.
                    </p>
                    <p>Mỗi tài khoản nên dùng cho 1 người để đảm bảo an toàn.</p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Tại sao tôi không thấy GPT-5 hoặc các models mới?</h2>
                <div className={styles.faqAnswer}>
                    <p>Các nguyên nhân có thể:</p>
                    <ul>
                        <li>Tài khoản chưa có Plus (kiểm tra góc trên bên trái có chữ "Plus")</li>
                        <li>Đang chọn model khác (nhấn vào tên model để chuyển đổi)</li>
                        <li>Tài khoản Plus đã hết hạn</li>
                        <li>Lỗi tạm thời, thử đăng xuất/nhập lại hoặc xóa cache</li>
                        <li>Trình duyệt cũ, thử cập nhật hoặc đổi trình duyệt</li>
                    </ul>
                    <p className={styles.highlightText}>
                        💡 Mẹo: GPT-5 Chat là model mặc định mới nhất. GPT-5.1 tốt cho coding. ChatGPT-4o nhanh và không giới hạn.
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ ChatGPT có hỗ trợ tiếng Việt không?</h2>
                <div className={styles.faqAnswer}>
                    <p>
                        Có! ChatGPT hiểu và trả lời tiếng Việt rất tốt. 
                        Bạn có thể hỏi bằng tiếng Việt và nhận câu trả lời bằng tiếng Việt.
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Tôi có thể đổi mật khẩu ChatGPT không?</h2>
                <div className={styles.faqAnswer}>
                    <p className={styles.warningText}>
                        ⚠️ <strong>KHÔNG NÊN</strong> tự ý đổi mật khẩu tài khoản ChatGPT đã mua. 
                        Việc này sẽ làm mất bảo hành.
                    </p>
                    <p>Nếu cần đổi mật khẩu vì lý do bảo mật, vui lòng liên hệ CSKH trước.</p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h2>❓ Canvas là gì?</h2>
                <div className={styles.faqAnswer}>
                    <p>
                        Canvas là tính năng mới cho phép bạn viết và chỉnh sửa văn bản hoặc code 
                        trong một giao diện trực quan, dễ dàng hơn.
                    </p>
                    <p><strong>Cách sử dụng:</strong></p>
                    <ul>
                        <li>Yêu cầu ChatGPT viết văn bản hoặc code</li>
                        <li>Canvas sẽ tự động mở ở bên phải</li>
                        <li>Bạn có thể chỉnh sửa trực tiếp hoặc yêu cầu ChatGPT sửa</li>
                        <li>Hỗ trợ nhiều ngôn ngữ lập trình và định dạng văn bản</li>
                    </ul>
                </div>
            </div>

            <div className={styles.highlightBox}>
                <h3>💡 Mẹo sử dụng ChatGPT Plus hiệu quả</h3>
                <ul>
                    <li>🎯 Hỏi câu hỏi cụ thể, rõ ràng để có câu trả lời tốt nhất</li>
                    <li>🤖 Dùng <strong>GPT-5 Chat</strong> cho trò chuyện tự nhiên, sáng tạo nội dung</li>
                    <li>💻 Dùng <strong>GPT-5.1</strong> cho coding, agentic tasks với configurable reasoning</li>
                    <li>⚡ Dùng <strong>ChatGPT-4o</strong> cho tác vụ cần tốc độ nhanh (không giới hạn)</li>
                    <li>🎯 Dùng <strong>GPT-5 Pro</strong> cho câu trả lời thông minh và chính xác hơn</li>
                    <li>⚡ Dùng <strong>GPT-5 mini</strong> cho tác vụ đơn giản, tiết kiệm quota</li>
                    <li>📝 Sử dụng <strong>Canvas</strong> để viết và chỉnh sửa văn bản, code trực quan</li>
                    <li>🖼️ Dùng <strong>DALL-E 3</strong> để tạo hình ảnh sáng tạo chất lượng cao</li>
                    <li>📊 Upload file để phân tích dữ liệu (Excel, CSV, PDF...)</li>
                    <li>🔍 Bật Web Browsing để tìm thông tin mới nhất trên internet</li>
                    <li>🎙️ Dùng Voice Mode để trò chuyện bằng giọng nói tự nhiên</li>
                    <li>🤝 Khám phá GPT Store để tìm GPT chuyên dụng cho nhu cầu của bạn</li>
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
