import { Metadata } from 'next';
import routes from '@/config/routes';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'Hướng Dẫn Đăng Nhập',
    description: 'Hướng dẫn chi tiết cách đăng nhập vào tài khoản TAIKHOANXIN.COM',
};

export default function LoginGuidePage() {
    return (
        <div className={styles.helpContent}>
            <h1>Hướng dẫn đăng nhập</h1>
            
            <p>
                Đăng nhập vào tài khoản TAIKHOANXIN.COM để truy cập đầy đủ các tính năng và quản lý đơn hàng của bạn.
            </p>

            <h2>Các bước đăng nhập</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Truy cập trang đăng nhập</h3>
                        <p>
                            Nhấp vào nút &quot;Đăng nhập&quot; ở góc trên bên phải của trang web hoặc truy cập trực tiếp 
                            tại <a href={routes.user.login}>{routes.user.login}</a>
                        </p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Nhập thông tin đăng nhập</h3>
                        <p>Điền các thông tin sau:</p>
                        <ul>
                            <li><strong>Email:</strong> Địa chỉ email bạn đã đăng ký</li>
                            <li><strong>Mật khẩu:</strong> Mật khẩu của tài khoản</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Nhấn nút &quot;Đăng nhập&quot;</h3>
                        <p>
                            Sau khi điền đầy đủ thông tin, nhấp vào nút &quot;Đăng nhập&quot; để truy cập vào tài khoản của bạn.
                        </p>
                    </div>
                </div>
            </div>

            <h2>Đăng nhập bằng Google</h2>
            
            <p>
                Bạn cũng có thể đăng nhập nhanh chóng bằng tài khoản Google của mình:
            </p>

            <div className={styles.highlightBox}>
                <p>
                    <strong>Đăng nhập với Google</strong>
                </p>
                <ol>
                    <li>Nhấp vào nút &quot;Đăng nhập với Google&quot;</li>
                    <li>Chọn tài khoản Google bạn muốn sử dụng</li>
                    <li>Cho phép TAIKHOANXIN.COM truy cập thông tin cơ bản</li>
                    <li>Hoàn tất! Bạn đã đăng nhập thành công</li>
                </ol>
            </div>

            <h2>Quên mật khẩu?</h2>
            
            <p>
                Nếu bạn quên mật khẩu, đừng lo lắng! Hãy làm theo các bước sau:
            </p>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Nhấp vào &quot;Quên mật khẩu?&quot;</h3>
                        <p>
                            Ở trang đăng nhập, tìm và nhấp vào link &quot;Quên mật khẩu?&quot; bên dưới form đăng nhập.
                        </p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Nhập email đã đăng ký</h3>
                        <p>
                            Nhập địa chỉ email bạn đã sử dụng để đăng ký tài khoản.
                        </p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Kiểm tra email</h3>
                        <p>
                            Chúng tôi sẽ gửi một link đặt lại mật khẩu đến email của bạn. 
                            Nhấp vào link đó để tạo mật khẩu mới.
                        </p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>4</div>
                    <div className={styles.stepContent}>
                        <h3>Tạo mật khẩu mới</h3>
                        <p>
                            Nhập mật khẩu mới (tối thiểu 8 ký tự) và xác nhận lại. 
                            Sau đó bạn có thể đăng nhập với mật khẩu mới.
                        </p>
                    </div>
                </div>
            </div>

            <h2>Lưu ý quan trọng</h2>

            <div className={styles.warningBox}>
                <p>
                    <strong>⚠️ Bảo mật tài khoản</strong>
                </p>
                <ul>
                    <li>Không chia sẻ mật khẩu với bất kỳ ai</li>
                    <li>Sử dụng mật khẩu mạnh (chữ hoa, chữ thường, số và ký tự đặc biệt)</li>
                    <li>Đăng xuất sau khi sử dụng trên máy tính công cộng</li>
                    <li>Thay đổi mật khẩu định kỳ để tăng cường bảo mật</li>
                </ul>
            </div>

            <h2>Gặp vấn đề khi đăng nhập?</h2>
            
            <div className={styles.troubleshootBox}>
                <h3>Các vấn đề thường gặp:</h3>
                
                <div className={styles.troubleshootItem}>
                    <h4>❌ Email hoặc mật khẩu không đúng</h4>
                    <p>
                        Kiểm tra lại email và mật khẩu. Đảm bảo không có khoảng trắng thừa và Caps Lock đã tắt.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>📧 Không nhận được email đặt lại mật khẩu</h4>
                    <p>
                        Kiểm tra thư mục spam/junk. Nếu vẫn không thấy, liên hệ với bộ phận hỗ trợ.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>🔒 Tài khoản bị khóa</h4>
                    <p>
                        Nếu đăng nhập sai nhiều lần, tài khoản có thể bị khóa tạm thời. 
                        Vui lòng đợi 15 phút hoặc liên hệ hỗ trợ.
                    </p>
                </div>
            </div>

            <div className={styles.contactLink}>
                <p style={{ marginBottom: '16px', fontSize: '16px', color: 'var(--text-color)' }}>
                    Vẫn cần hỗ trợ? Chúng tôi luôn sẵn sàng giúp đỡ!
                </p>
                <a href="/contact" className={styles.contactButton}>
                    💬 Chat với CSKH
                </a>
            </div>
        </div>
    );
}
