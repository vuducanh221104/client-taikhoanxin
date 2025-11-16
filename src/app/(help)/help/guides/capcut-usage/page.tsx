import React from 'react';
import { Metadata } from 'next';
import styles from '../../page.module.scss';
import LastUpdated from '@/components/LastUpdated';

export const metadata: Metadata = {
    title: 'Cách sử dụng CapCut Pro - Hướng dẫn chi tiết | TAIKHOANXIN.COM',
    description: 'Hướng dẫn chi tiết cách sử dụng CapCut Pro, chỉnh sửa video chuyên nghiệp, hiệu ứng AI và xuất video chất lượng cao.',
};

export default function CapCutUsagePage() {
    return (
        <div className={styles.helpContent}>
            <div className={styles.helpArticle}>
                <h1>Cách sử dụng CapCut Pro</h1>
                
                <LastUpdated date="2024-01-15" />

                <div className={styles.articleContent}>
                    <section id="gioi-thieu">
                        <h2>Giới thiệu về CapCut Pro</h2>
                        <p>
                            CapCut Pro là phiên bản cao cấp của CapCut, cung cấp công cụ chỉnh sửa video 
                            chuyên nghiệp với AI, hiệu ứng premium và xuất video không watermark.
                        </p>
                    </section>

                    <section id="dang-nhap">
                        <h2>Đăng nhập tài khoản</h2>
                        <ol>
                            <li>Tải ứng dụng CapCut từ App Store hoặc Google Play</li>
                            <li>Mở ứng dụng và nhấn <strong>Profile</strong> ở góc dưới bên phải</li>
                            <li>Nhấn <strong>Log in</strong></li>
                            <li>Chọn phương thức đăng nhập (Email/TikTok/Google)</li>
                            <li>Nhập thông tin đăng nhập đã được cung cấp</li>
                            <li>Kiểm tra biểu tượng <strong>Pro</strong> trên profile</li>
                        </ol>
                        
                        <div className={styles.warningBox}>
                            <strong>⚠️ Lưu ý:</strong>
                            <ul>
                                <li>Không thay đổi email hoặc mật khẩu</li>
                                <li>Không liên kết thêm tài khoản mạng xã hội khác</li>
                                <li>Sử dụng trên tối đa 2 thiết bị</li>
                            </ul>
                        </div>
                    </section>

                    <section id="tao-project">
                        <h2>Tạo project mới</h2>
                        <ol>
                            <li>Mở CapCut và nhấn <strong>New project</strong></li>
                            <li>Chọn video/ảnh từ thư viện điện thoại</li>
                            <li>Nhấn <strong>Add</strong> để thêm vào timeline</li>
                            <li>Bắt đầu chỉnh sửa</li>
                        </ol>
                    </section>

                    <section id="chinh-sua-co-ban">
                        <h2>Chỉnh sửa cơ bản</h2>
                        
                        <h3>Cắt và chia video</h3>
                        <ul>
                            <li>Nhấn vào clip trên timeline</li>
                            <li>Kéo đầu/cuối clip để trim</li>
                            <li>Nhấn <strong>Split</strong> để chia clip tại vị trí hiện tại</li>
                            <li>Nhấn <strong>Delete</strong> để xóa phần không cần</li>
                        </ul>

                        <h3>Thêm nhạc nền</h3>
                        <ol>
                            <li>Nhấn <strong>Audio</strong> ở thanh công cụ dưới</li>
                            <li>Chọn <strong>Sounds</strong> để duyệt thư viện</li>
                            <li>Hoặc chọn <strong>Import</strong> để thêm nhạc từ máy</li>
                            <li>Điều chỉnh âm lượng và fade in/out</li>
                        </ol>
                    </section>

                    <section id="hieu-ung-pro">
                        <h2>Hiệu ứng Pro</h2>
                        
                        <h3>Auto Captions (Phụ đề tự động)</h3>
                        <ol>
                            <li>Nhấn <strong>Text</strong> → <strong>Auto captions</strong></li>
                            <li>Chọn ngôn ngữ (Tiếng Việt có hỗ trợ)</li>
                            <li>Nhấn <strong>Generate</strong></li>
                            <li>Chỉnh sửa phụ đề nếu cần</li>
                            <li>Thay đổi font, màu sắc, animation</li>
                        </ol>

                        <div className={styles.infoBox}>
                            <strong>💡 Mẹo:</strong> Auto captions hoạt động tốt nhất với giọng nói rõ ràng và ít tiếng ồn.
                        </div>

                        <h3>Background Removal (Xóa phông)</h3>
                        <ol>
                            <li>Chọn clip video cần xóa phông</li>
                            <li>Nhấn <strong>Cutout</strong></li>
                            <li>Chọn <strong>Auto removal</strong></li>
                            <li>Đợi AI xử lý</li>
                            <li>Thêm background mới nếu muốn</li>
                        </ol>
                    </section>

                    <section id="hieu-ung-chuyen-tiep">
                        <h2>Hiệu ứng chuyển tiếp</h2>
                        <p>Thêm transitions giữa các clip:</p>
                        <ol>
                            <li>Nhấn vào khoảng trống giữa 2 clip</li>
                            <li>Chọn <strong>Transition</strong></li>
                            <li>Duyệt qua hàng trăm hiệu ứng Pro</li>
                            <li>Nhấn vào transition để áp dụng</li>
                            <li>Điều chỉnh thời lượng (0.5s - 2s)</li>
                        </ol>
                    </section>

                    <section id="xuat-video">
                        <h2>Xuất video</h2>
                        <p>CapCut Pro cho phép xuất video chất lượng cao:</p>
                        <ol>
                            <li>Nhấn <strong>Export</strong> ở góc trên bên phải</li>
                            <li>Chọn độ phân giải:</li>
                        </ol>

                        <ul>
                            <li><strong>720p:</strong> Phù hợp cho mạng xã hội</li>
                            <li><strong>1080p:</strong> Full HD, chất lượng tốt</li>
                            <li><strong>4K:</strong> Chất lượng cao nhất (Pro)</li>
                        </ul>

                        <ol start={3}>
                            <li>Chọn frame rate (30fps hoặc 60fps)</li>
                            <li>Bật <strong>Smart HDR</strong> nếu muốn (Pro)</li>
                            <li>Nhấn <strong>Export</strong> và đợi xử lý</li>
                        </ol>

                        <div className={styles.infoBox}>
                            <strong>💡 Lợi ích Pro:</strong>
                            <ul>
                                <li>Không có watermark</li>
                                <li>Xuất 4K và 60fps</li>
                                <li>Không giới hạn thời lượng</li>
                            </ul>
                        </div>
                    </section>

                    <section id="luu-y">
                        <h2>Lưu ý quan trọng</h2>
                        <div className={styles.warningBox}>
                            <ul>
                                <li>Lưu project thường xuyên (CapCut tự động lưu)</li>
                                <li>Không xuất quá nhiều video 4K trong ngày</li>
                                <li>Kiểm tra bản quyền nhạc khi đăng lên mạng xã hội</li>
                                <li>Sao lưu video gốc trước khi chỉnh sửa</li>
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
