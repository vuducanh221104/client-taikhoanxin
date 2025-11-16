import React from 'react';
import { Metadata } from 'next';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'Cách sử dụng ChatGPT Plus - Hướng dẫn chi tiết | TAIKHOANXIN.COM',
    description: 'Hướng dẫn chi tiết cách sử dụng ChatGPT Plus với GPT-5, GPT-4o, tạo hình ảnh với DALL-E 3 và các tính năng nâng cao.',
};

export default function ChatGPTUsagePage() {
    return (
        <div className={styles.helpContent}>
            <div className={styles.helpArticle}>
                <h1>Cách sử dụng ChatGPT Plus</h1>

                <div className={styles.articleContent}>
                    <section id="gioi-thieu">
                        <h2>Giới thiệu về ChatGPT Plus</h2>
                        <p>
                            ChatGPT Plus là phiên bản cao cấp của ChatGPT, cung cấp quyền truy cập vào các models mới nhất 
                            như <strong>GPT-5 Chat</strong>, <strong>ChatGPT-4o</strong>, và nhiều tính năng nâng cao khác.
                        </p>
                        
                        <div className={styles.highlightBox}>
                            <p><strong>🎯 Models có sẵn trong ChatGPT Plus:</strong></p>
                            <ul>
                                <li><strong>GPT-5 Chat:</strong> Model mới nhất cho chat thông minh</li>
                                <li><strong>ChatGPT-4o:</strong> Model cân bằng giữa tốc độ và chất lượng</li>
                                <li><strong>GPT-5.1:</strong> Tốt nhất cho coding và agentic tasks</li>
                                <li><strong>GPT-5 Pro:</strong> Phiên bản thông minh và chính xác hơn</li>
                                <li><strong>GPT-5 mini:</strong> Nhanh và tiết kiệm cho các tác vụ đơn giản</li>
                            </ul>
                        </div>
                    </section>

                    <section id="dang-nhap">
                        <h2>Đăng nhập tài khoản</h2>
                        <ol>
                            <li>Truy cập <strong>chat.openai.com</strong></li>
                            <li>Nhập email và mật khẩu đã được cung cấp</li>
                            <li>Xác nhận đăng nhập qua email nếu được yêu cầu</li>
                            <li>Kiểm tra trạng thái Plus ở góc trên bên trái</li>
                        </ol>
                        
                        <div className={styles.warningBox}>
                            <strong>⚠️ Lưu ý:</strong>
                            <ul>
                                <li>Không thay đổi mật khẩu tài khoản</li>
                                <li>Không thêm phương thức thanh toán</li>
                                <li>Không chia sẻ thông tin đăng nhập với người khác</li>
                            </ul>
                        </div>
                    </section>

                    <section id="chon-model">
                        <h2>Chọn Model phù hợp</h2>
                        <p>ChatGPT Plus cung cấp nhiều models cho các mục đích khác nhau:</p>

                        <h3>GPT-5 Chat (Mặc định)</h3>
                        <p>Model chính được sử dụng trong ChatGPT, phù hợp cho hầu hết các tác vụ:</p>
                        <ul>
                            <li>Trò chuyện thông minh và tự nhiên</li>
                            <li>Trả lời câu hỏi phức tạp</li>
                            <li>Viết và chỉnh sửa nội dung</li>
                            <li>Hiểu tiếng Việt xuất sắc</li>
                        </ul>

                        <h3>ChatGPT-4o</h3>
                        <p>Model cân bằng tốc độ và chất lượng:</p>
                        <ul>
                            <li>Phản hồi nhanh hơn GPT-5</li>
                            <li>Phù hợp cho các câu hỏi đơn giản</li>
                            <li>Tiết kiệm quota khi không cần GPT-5</li>
                        </ul>

                        <h3>GPT-5.1 (Frontier Model)</h3>
                        <p>Tốt nhất cho coding và agentic tasks:</p>
                        <ul>
                            <li>Viết code chất lượng cao</li>
                            <li>Debug và tối ưu code</li>
                            <li>Suy luận logic phức tạp</li>
                            <li>Configurable reasoning effort</li>
                        </ul>

                        <div className={styles.infoBox}>
                            <strong>💡 Cách chọn model:</strong>
                            <p>Nhấn vào tên model ở đầu trang để chuyển đổi giữa các models khác nhau.</p>
                        </div>
                    </section>

                    <section id="tao-hinh-anh">
                        <h2>Tạo hình ảnh với DALL-E 3</h2>
                        <p>ChatGPT Plus tích hợp DALL-E 3 để tạo hình ảnh chất lượng cao:</p>
                        <ol>
                            <li>Trong bất kỳ cuộc trò chuyện nào, mô tả hình ảnh bạn muốn</li>
                            <li>Ví dụ: "Tạo hình ảnh một con mèo đang chơi guitar trên mặt trăng"</li>
                            <li>ChatGPT sẽ tự động sử dụng DALL-E 3 để tạo hình</li>
                            <li>Đợi vài giây để hình ảnh được tạo</li>
                            <li>Tải xuống hoặc yêu cầu chỉnh sửa</li>
                        </ol>

                        <div className={styles.infoBox}>
                            <strong>💡 Lưu ý:</strong>
                            <ul>
                                <li>DALL-E 3 tạo hình ảnh chất lượng cao và chi tiết</li>
                                <li>Hiểu prompt tiếng Việt và tiếng Anh rất tốt</li>
                                <li>Có thể tạo text trong hình ảnh chính xác</li>
                                <li>Mỗi lần tạo 1-2 hình ảnh</li>
                            </ul>
                        </div>
                    </section>

                    <section id="phan-tich-file">
                        <h2>Phân tích file và dữ liệu</h2>
                        <p>ChatGPT Plus có khả năng đọc và phân tích nhiều loại file:</p>
                        <ul>
                            <li><strong>PDF:</strong> Đọc và tóm tắt tài liệu, trích xuất thông tin</li>
                            <li><strong>Excel/CSV:</strong> Phân tích dữ liệu, tạo biểu đồ, tính toán</li>
                            <li><strong>Hình ảnh:</strong> Nhận diện và mô tả chi tiết, OCR text</li>
                            <li><strong>Code:</strong> Review, debug và tối ưu code</li>
                            <li><strong>Word/Text:</strong> Đọc và chỉnh sửa văn bản</li>
                        </ul>

                        <p>Cách upload file:</p>
                        <ol>
                            <li>Nhấn vào biểu tượng clip 📎 bên cạnh ô nhập tin nhắn</li>
                            <li>Chọn file từ máy tính</li>
                            <li>Đợi file upload xong</li>
                            <li>Đặt câu hỏi về file đó</li>
                        </ol>
                    </section>

                    <section id="custom-instructions">
                        <h2>Tùy chỉnh hướng dẫn (Custom Instructions)</h2>
                        <p>Thiết lập cách ChatGPT phản hồi theo ý bạn:</p>
                        <ol>
                            <li>Nhấn vào avatar ở góc trên bên phải</li>
                            <li>Chọn <strong>Custom instructions</strong></li>
                            <li>Điền thông tin về bạn và cách bạn muốn ChatGPT trả lời</li>
                            <li>Lưu lại</li>
                        </ol>

                        <div className={styles.infoBox}>
                            <strong>Ví dụ Custom Instructions:</strong>
                            <p><em>"Tôi là lập trình viên Python. Hãy trả lời ngắn gọn, có code example, 
                            và giải thích bằng tiếng Việt."</em></p>
                        </div>
                    </section>

                    <section id="gpts">
                        <h2>Sử dụng GPTs (Custom ChatGPT)</h2>
                        <p>ChatGPT Plus cho phép sử dụng và tạo GPTs tùy chỉnh:</p>
                        <ol>
                            <li>Nhấn vào <strong>Explore GPTs</strong> trên sidebar</li>
                            <li>Duyệt qua hàng nghìn GPTs được tạo sẵn</li>
                            <li>Chọn GPT phù hợp với nhu cầu (viết code, thiết kế, học tập...)</li>
                            <li>Bắt đầu chat với GPT đó</li>
                        </ol>

                        <p><strong>Một số GPTs phổ biến:</strong></p>
                        <ul>
                            <li><strong>Code Copilot:</strong> Hỗ trợ lập trình chuyên sâu</li>
                            <li><strong>Data Analyst:</strong> Phân tích dữ liệu và tạo báo cáo</li>
                            <li><strong>Creative Writing Coach:</strong> Hỗ trợ viết sáng tạo</li>
                            <li><strong>Math Solver:</strong> Giải toán và giải thích chi tiết</li>
                        </ul>

                        <div className={styles.infoBox}>
                            <strong>💡 Mẹo:</strong> Bạn cũng có thể tạo GPT riêng cho mình với hướng dẫn và kiến thức tùy chỉnh.
                        </div>
                    </section>

                    <section id="luu-y">
                        <h2>Lưu ý quan trọng</h2>
                        <div className={styles.warningBox}>
                            <ul>
                                <li>Không chia sẻ thông tin cá nhân nhạy cảm với ChatGPT</li>
                                <li>Kiểm tra lại thông tin quan trọng từ ChatGPT</li>
                                <li>Các models có giới hạn tin nhắn khác nhau</li>
                                <li>ChatGPT-4o thường không giới hạn cho người dùng Plus</li>
                                <li>Lịch sử chat được lưu trữ, có thể xóa trong Settings</li>
                                <li>Không sử dụng cho mục đích vi phạm pháp luật</li>
                            </ul>
                        </div>
                    </section>

                    <section id="xu-ly-loi">
                        <h2>Xử lý lỗi thường gặp</h2>
                        
                        <h3>Lỗi "ChatGPT is at capacity"</h3>
                        <p>Giải pháp: Đợi vài phút và thử lại, hoặc làm mới trang.</p>

                        <h3>Lỗi "Something went wrong"</h3>
                        <p>Giải pháp:</p>
                        <ul>
                            <li>Xóa cache và cookies trình duyệt</li>
                            <li>Thử trình duyệt khác</li>
                            <li>Kiểm tra kết nối internet</li>
                        </ul>

                        <h3>Hết quota model</h3>
                        <p>Giải pháp: Chuyển sang model khác (ChatGPT-4o thường không giới hạn) hoặc đợi quota reset.</p>
                    </section>

                    <section id="ho-tro">
                        <h2>Hỗ trợ</h2>
                        <p>
                            Nếu gặp vấn đề không thể tự giải quyết, vui lòng liên hệ bộ phận hỗ trợ 
                            của chúng tôi qua Zalo hoặc email được cung cấp khi mua hàng.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
