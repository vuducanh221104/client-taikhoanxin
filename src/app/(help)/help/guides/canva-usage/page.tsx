import React from 'react';
import { Metadata } from 'next';
import styles from '../../page.module.scss';
import LastUpdated from '@/components/LastUpdated';

export const metadata: Metadata = {
    title: 'Cách sử dụng Canva Pro - Hướng dẫn chi tiết | TAIKHOANXIN.COM',
    description: 'Hướng dẫn chi tiết cách sử dụng Canva Pro, thiết kế đồ họa chuyên nghiệp, sử dụng templates và AI.',
};

export default function CanvaUsagePage() {
    return (
        <div className={styles.helpContent}>
            <div className={styles.helpArticle}>
                <h1>Cách sử dụng Canva Pro</h1>
                
                <LastUpdated date="2024-01-15" />

                <div className={styles.articleContent}>
                    <section id="gioi-thieu">
                        <h2>Giới thiệu về Canva Pro</h2>
                        <p>
                            Canva Pro là phiên bản cao cấp của Canva, cung cấp hàng triệu templates, 
                            hình ảnh premium, công cụ AI và nhiều tính năng thiết kế chuyên nghiệp.
                        </p>
                    </section>

                    <section id="dang-nhap">
                        <h2>Đăng nhập tài khoản</h2>
                        <ol>
                            <li>Truy cập <strong>canva.com</strong></li>
                            <li>Nhấn <strong>Log in</strong> ở góc trên bên phải</li>
                            <li>Nhập email và mật khẩu đã được cung cấp</li>
                            <li>Kiểm tra biểu tượng <strong>Pro</strong> bên cạnh tên tài khoản</li>
                        </ol>
                        
                        <div className={styles.warningBox}>
                            <strong>⚠️ Lưu ý:</strong>
                            <ul>
                                <li>Không thay đổi email hoặc mật khẩu tài khoản</li>
                                <li>Không thêm phương thức thanh toán</li>
                                <li>Không mời thành viên khác vào team</li>
                            </ul>
                        </div>
                    </section>

                    <section id="tao-thiet-ke">
                        <h2>Tạo thiết kế mới</h2>
                        <p>Canva Pro cung cấp nhiều cách để bắt đầu thiết kế:</p>
                        
                        <h3>Từ Template</h3>
                        <ol>
                            <li>Nhấn <strong>Create a design</strong> trên trang chủ</li>
                            <li>Chọn loại thiết kế (Instagram Post, Logo, Presentation...)</li>
                            <li>Duyệt qua hàng nghìn templates Pro</li>
                            <li>Nhấn vào template để sử dụng</li>
                            <li>Tùy chỉnh theo ý bạn</li>
                        </ol>

                        <h3>Từ kích thước tùy chỉnh</h3>
                        <ol>
                            <li>Nhấn <strong>Custom size</strong></li>
                            <li>Nhập chiều rộng và chiều cao (px, cm, in...)</li>
                            <li>Nhấn <strong>Create new design</strong></li>
                            <li>Bắt đầu thiết kế từ trang trắng</li>
                        </ol>
                    </section>

                    <section id="su-dung-elements">
                        <h2>Sử dụng Elements Pro</h2>
                        <p>Canva Pro cung cấp hàng triệu elements miễn phí:</p>
                        
                        <h3>Hình ảnh và Video</h3>
                        <ul>
                            <li>Nhấn <strong>Elements</strong> trên thanh bên trái</li>
                            <li>Tìm kiếm hình ảnh hoặc video</li>
                            <li>Lọc theo <strong>Pro</strong> để xem nội dung premium</li>
                            <li>Kéo thả vào thiết kế</li>
                        </ul>

                        <h3>Graphics và Icons</h3>
                        <ul>
                            <li>Chọn tab <strong>Graphics</strong> hoặc <strong>Stickers</strong></li>
                            <li>Tìm kiếm theo từ khóa</li>
                            <li>Thay đổi màu sắc của graphics vector</li>
                            <li>Resize và xoay tự do</li>
                        </ul>

                        <div className={styles.infoBox}>
                            <strong>💡 Mẹo:</strong> Sử dụng từ khóa tiếng Anh để tìm kiếm nhiều kết quả hơn.
                        </div>
                    </section>

                    <section id="background-remover">
                        <h2>Xóa phông nền (Background Remover)</h2>
                        <p>Tính năng độc quyền của Canva Pro:</p>
                        <ol>
                            <li>Upload hoặc chọn hình ảnh trong thiết kế</li>
                            <li>Nhấn vào hình ảnh để chọn</li>
                            <li>Nhấn <strong>Edit photo</strong> trên thanh công cụ</li>
                            <li>Chọn <strong>Background Remover</strong></li>
                            <li>Đợi vài giây để AI xử lý</li>
                            <li>Chỉnh sửa thêm nếu cần</li>
                        </ol>

                        <div className={styles.infoBox}>
                            <strong>💡 Mẹo:</strong> Hoạt động tốt nhất với ảnh có nền đơn giản và đối tượng rõ ràng.
                        </div>
                    </section>

                    <section id="magic-resize">
                        <h2>Magic Resize</h2>
                        <p>Thay đổi kích thước thiết kế tự động:</p>
                        <ol>
                            <li>Mở thiết kế cần resize</li>
                            <li>Nhấn <strong>Resize</strong> trên thanh công cụ trên</li>
                            <li>Chọn kích thước mới (Instagram Story, Facebook Post...)</li>
                            <li>Hoặc nhập kích thước tùy chỉnh</li>
                            <li>Nhấn <strong>Copy & resize</strong></li>
                            <li>Canva tự động điều chỉnh layout</li>
                        </ol>

                        <p><strong>Ví dụ:</strong> Chuyển Instagram Post (1080x1080) thành Instagram Story (1080x1920) chỉ trong 1 click.</p>
                    </section>

                    <section id="brand-kit">
                        <h2>Brand Kit</h2>
                        <p>Lưu trữ màu sắc, font chữ và logo thương hiệu:</p>
                        <ol>
                            <li>Nhấn vào <strong>Brand Kit</strong> trong menu bên trái</li>
                            <li>Thêm logo của bạn</li>
                            <li>Thêm màu sắc thương hiệu (hex code)</li>
                            <li>Chọn font chữ chính</li>
                            <li>Sử dụng trong mọi thiết kế</li>
                        </ol>

                        <div className={styles.infoBox}>
                            <strong>💡 Lợi ích:</strong> Giữ nhất quán thương hiệu trong tất cả thiết kế.
                        </div>
                    </section>

                    <section id="magic-write">
                        <h2>Magic Write (AI Text Generator)</h2>
                        <p>Tạo nội dung văn bản bằng AI:</p>
                        <ol>
                            <li>Thêm text box vào thiết kế</li>
                            <li>Nhấn vào biểu tượng <strong>Magic Write</strong></li>
                            <li>Mô tả nội dung bạn cần (tiếng Việt hoặc tiếng Anh)</li>
                            <li>Ví dụ: "Viết caption Instagram về du lịch Đà Lạt"</li>
                            <li>Nhấn <strong>Generate</strong></li>
                            <li>Chọn và chỉnh sửa nội dung phù hợp</li>
                        </ol>
                    </section>

                    <section id="xuat-file">
                        <h2>Xuất file thiết kế</h2>
                        <p>Canva Pro hỗ trợ nhiều định dạng xuất:</p>
                        <ol>
                            <li>Nhấn <strong>Share</strong> ở góc trên bên phải</li>
                            <li>Chọn <strong>Download</strong></li>
                            <li>Chọn định dạng file:</li>
                        </ol>

                        <ul>
                            <li><strong>PNG:</strong> Chất lượng cao, nền trong suốt</li>
                            <li><strong>JPG:</strong> Dung lượng nhỏ, phù hợp web</li>
                            <li><strong>PDF:</strong> In ấn chuyên nghiệp</li>
                            <li><strong>SVG:</strong> Vector, scale không giới hạn (Pro)</li>
                            <li><strong>MP4:</strong> Video hoặc GIF động</li>
                        </ul>

                        <div className={styles.infoBox}>
                            <strong>💡 Mẹo:</strong> Chọn "Transparent background" khi xuất PNG để có nền trong suốt.
                        </div>
                    </section>

                    <section id="lam-viec-nhom">
                        <h2>Làm việc nhóm</h2>
                        <p>Chia sẻ và cộng tác thiết kế:</p>
                        <ol>
                            <li>Nhấn <strong>Share</strong></li>
                            <li>Chọn <strong>Share link</strong></li>
                            <li>Chọn quyền: <strong>Can view</strong> hoặc <strong>Can edit</strong></li>
                            <li>Copy link và gửi cho đồng nghiệp</li>
                            <li>Nhiều người có thể chỉnh sửa cùng lúc</li>
                        </ol>

                        <div className={styles.warningBox}>
                            <strong>⚠️ Lưu ý:</strong> Không chia sẻ link với quá nhiều người để tránh vi phạm điều khoản.
                        </div>
                    </section>

                    <section id="thu-vien-mau">
                        <h2>Thư viện mẫu phổ biến</h2>
                        <p>Một số loại thiết kế phổ biến trên Canva Pro:</p>
                        <ul>
                            <li><strong>Social Media:</strong> Instagram, Facebook, TikTok posts</li>
                            <li><strong>Marketing:</strong> Flyer, Poster, Brochure</li>
                            <li><strong>Business:</strong> Presentation, Resume, Business Card</li>
                            <li><strong>Video:</strong> YouTube Thumbnail, Video Intro</li>
                            <li><strong>Print:</strong> T-shirt, Mug, Invitation</li>
                        </ul>
                    </section>

                    <section id="luu-y">
                        <h2>Lưu ý quan trọng</h2>
                        <div className={styles.warningBox}>
                            <ul>
                                <li>Không sử dụng cho mục đích thương mại lớn</li>
                                <li>Không tải xuống quá nhiều file trong thời gian ngắn</li>
                                <li>Lưu thiết kế thường xuyên (Canva tự động lưu)</li>
                                <li>Kiểm tra bản quyền khi sử dụng hình ảnh cho mục đích thương mại</li>
                            </ul>
                        </div>
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
