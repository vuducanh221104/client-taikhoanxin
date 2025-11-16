import { Metadata } from 'next';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'Đổi Mật Khẩu',
    description: 'Hướng dẫn đổi mật khẩu tài khoản tại TAIKHOANXIN.COM',
};

export default function ChangePasswordPage() {
    return (
        <div className={styles.helpContent}>
            <h1>Đổi mật khẩu</h1>
            
            <p>
                Hướng dẫn chi tiết cách đổi mật khẩu tài khoản để bảo mật thông tin cá nhân của bạn.
            </p>

            <h2>Cách đổi mật khẩu</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Đăng nhập tài khoản</h3>
                        <p>Đăng nhập vào tài khoản của bạn trên TAIKHOANXIN.COM</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Vào trang Tài khoản</h3>
                        <p>Click vào avatar → Chọn "Tài khoản của tôi"</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Chọn Đổi mật khẩu</h3>
                        <p>Trong menu bên trái, chọn "Đổi mật khẩu"</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>4</div>
                    <div className={styles.stepContent}>
                        <h3>Nhập thông tin</h3>
                        <ul>
                            <li>Mật khẩu hiện tại</li>
                            <li>Mật khẩu mới (ít nhất 8 ký tự)</li>
                            <li>Xác nhận mật khẩu mới</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>5</div>
                    <div className={styles.stepContent}>
                        <h3>Xác nhận</h3>
                        <p>Click "Đổi mật khẩu" để hoàn tất</p>
                    </div>
                </div>
            </div>

            <h2>Yêu cầu mật khẩu mạnh</h2>

            <div className={styles.highlightBox}>
                <p><strong>✅ Mật khẩu nên có</strong></p>
                <ul>
                    <li>Ít nhất 8 ký tự</li>
                    <li>Chữ hoa (A-Z)</li>
                    <li>Chữ thường (a-z)</li>
                    <li>Số (0-9)</li>
                    <li>Ký tự đặc biệt (@, #, $, %, &)</li>
                </ul>
            </div>

            <div className={styles.warningBox}>
                <p><strong>❌ Không nên sử dụng</strong></p>
                <ul>
                    <li>Mật khẩu quá đơn giản (123456, password)</li>
                    <li>Thông tin cá nhân (tên, ngày sinh)</li>
                    <li>Mật khẩu đã dùng ở website khác</li>
                    <li>Chuỗi ký tự liên tiếp (abcdef, 123456)</li>
                </ul>
            </div>

            <h2>Quên mật khẩu</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Click "Quên mật khẩu"</h3>
                        <p>Tại trang đăng nhập, click "Quên mật khẩu?"</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Nhập email</h3>
                        <p>Nhập email đã đăng ký tài khoản</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Kiểm tra email</h3>
                        <p>Mở email và click vào link đặt lại mật khẩu</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>4</div>
                    <div className={styles.stepContent}>
                        <h3>Tạo mật khẩu mới</h3>
                        <p>Nhập mật khẩu mới và xác nhận</p>
                    </div>
                </div>
            </div>

            <h2>Lưu ý bảo mật</h2>

            <div className={styles.troubleshootBox}>
                <h3>Mẹo bảo mật tài khoản:</h3>
                
                <div className={styles.troubleshootItem}>
                    <h4>🔐 Đổi mật khẩu định kỳ</h4>
                    <p>Nên đổi mật khẩu mỗi 3-6 tháng để tăng cường bảo mật.</p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>🚫 Không chia sẻ mật khẩu</h4>
                    <p>Không bao giờ chia sẻ mật khẩu với người khác, kể cả nhân viên hỗ trợ.</p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>📱 Bật xác thực 2 lớp</h4>
                    <p>Kích hoạt 2FA để tăng cường bảo mật tài khoản.</p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>⚠️ Cảnh giác với email lạ</h4>
                    <p>Không click vào link đáng ngờ trong email giả mạo.</p>
                </div>
            </div>

            <div className={styles.contactLink}>
                <p style={{ marginBottom: '16px', fontSize: '16px', color: 'var(--text-color)' }}>
                    Cần hỗ trợ đổi mật khẩu? Liên hệ với chúng tôi!
                </p>
                <a href="/contact" className={styles.contactButton}>
                    💬 Chat với CSKH
                </a>
            </div>
        </div>
    );
}
