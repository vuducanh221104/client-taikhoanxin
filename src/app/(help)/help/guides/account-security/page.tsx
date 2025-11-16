import { Metadata } from 'next';
import Link from 'next/link';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'Hướng dẫn bảo mật tài khoản | TAIKHOANXIN.COM',
    description: 'Hướng dẫn bảo vệ và bảo mật tài khoản streaming',
};

export default function AccountSecurityGuidePage() {
    return (
        <div className={styles.helpContent}>
            <h1>Hướng dẫn bảo mật tài khoản</h1>
            
            <p>
                Bảo mật tài khoản streaming là rất quan trọng để tránh bị mất quyền truy cập, 
                bị hack hoặc vi phạm điều khoản. Hãy làm theo hướng dẫn dưới đây để bảo vệ tài khoản của bạn.
            </p>

            <h2>🔒 Nguyên tắc bảo mật cơ bản</h2>

            <div className={styles.productCategories}>
                <div className={styles.category}>
                    <h4>1. Không đổi mật khẩu</h4>
                    <p>
                        <strong>KHÔNG</strong> tự ý đổi mật khẩu tài khoản đã mua. 
                        Việc này sẽ làm mất bảo hành và có thể gây lỗi tài khoản.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>2. Không chia sẻ tùy tiện</h4>
                    <p>
                        Chỉ chia sẻ tài khoản với người thân tin cậy. 
                        Càng nhiều người dùng, càng dễ bị phát hiện và khóa.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>3. Giới hạn thiết bị</h4>
                    <p>
                        Chỉ đăng nhập đúng số thiết bị cho phép. 
                        Đăng xuất thiết bị không dùng nữa.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>4. Không dùng VPN</h4>
                    <p>
                        Tránh sử dụng VPN để truy cập nội dung vùng khác. 
                        Điều này vi phạm điều khoản và dễ bị khóa.
                    </p>
                </div>
            </div>

            <h2>🛡️ Bảo vệ tài khoản Netflix</h2>

            <div className={styles.highlightBox}>
                <h3>Những điều NÊN làm:</h3>
                <ul>
                    <li>✅ Tạo profile riêng cho từng người</li>
                    <li>✅ Sử dụng trong cùng hộ gia đình/địa điểm</li>
                    <li>✅ Đăng xuất khi không dùng nữa</li>
                    <li>✅ Kiểm tra "Recent device streaming activity"</li>
                    <li>✅ Liên hệ CSKH khi có vấn đề</li>
                </ul>

                <h3>Những điều KHÔNG NÊN làm:</h3>
                <ul>
                    <li>❌ Đổi email hoặc mật khẩu</li>
                    <li>❌ Chia sẻ công khai trên mạng xã hội</li>
                    <li>❌ Đăng nhập từ quá nhiều địa điểm khác nhau</li>
                    <li>❌ Sử dụng VPN để xem nội dung vùng khác</li>
                    <li>❌ Thêm phương thức thanh toán mới</li>
                </ul>
            </div>

            <h2>🎵 Bảo vệ tài khoản Spotify</h2>

            <div className={styles.highlightBox}>
                <h3>Những điều NÊN làm:</h3>
                <ul>
                    <li>✅ Chỉ đăng nhập tối đa 5 thiết bị</li>
                    <li>✅ Đăng xuất thiết bị cũ không dùng</li>
                    <li>✅ Online ít nhất 1 lần/30 ngày</li>
                    <li>✅ Sử dụng trong cùng quốc gia</li>
                    <li>✅ Kiểm tra "Devices" trong Settings</li>
                </ul>

                <h3>Những điều KHÔNG NÊN làm:</h3>
                <ul>
                    <li>❌ Đổi email, mật khẩu, số điện thoại</li>
                    <li>❌ Kết nối với Facebook cá nhân</li>
                    <li>❌ Đăng nhập quá nhiều thiết bị cùng lúc</li>
                    <li>❌ Chia sẻ cho người ở quốc gia khác</li>
                    <li>❌ Thay đổi thông tin thanh toán</li>
                </ul>
            </div>

            <h2>📺 Bảo vệ tài khoản YouTube Premium</h2>

            <div className={styles.highlightBox}>
                <h3>Những điều NÊN làm:</h3>
                <ul>
                    <li>✅ Sử dụng trên thiết bị cá nhân</li>
                    <li>✅ Đăng xuất khi dùng máy công cộng</li>
                    <li>✅ Kiểm tra "Manage your Google Account"</li>
                    <li>✅ Xóa lịch sử xem định kỳ</li>
                </ul>

                <h3>Những điều KHÔNG NÊN làm:</h3>
                <ul>
                    <li>❌ Đổi mật khẩu Google</li>
                    <li>❌ Thêm số điện thoại khôi phục</li>
                    <li>❌ Kết nối với dịch vụ bên thứ 3</li>
                    <li>❌ Thay đổi thông tin cá nhân</li>
                </ul>
            </div>

            <h2>🚨 Dấu hiệu tài khoản có vấn đề</h2>

            <div className={styles.warningBox}>
                <p><strong>Liên hệ CSKH ngay nếu gặp các dấu hiệu sau:</strong></p>
                <ul>
                    <li>🔴 Không đăng nhập được đột ngột</li>
                    <li>🔴 Mật khẩu bị thay đổi</li>
                    <li>🔴 Thấy thiết bị lạ đang đăng nhập</li>
                    <li>🔴 Nhận email cảnh báo từ nhà cung cấp</li>
                    <li>🔴 Tài khoản bị hạ cấp về Free</li>
                    <li>🔴 Lịch sử xem có nội dung lạ</li>
                    <li>🔴 Nhận thông báo vi phạm điều khoản</li>
                </ul>
            </div>

            <h2>📋 Checklist bảo mật hàng tháng</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>✓</div>
                    <div className={styles.stepContent}>
                        <h3>Kiểm tra thiết bị đăng nhập</h3>
                        <p>Xem danh sách thiết bị, đăng xuất thiết bị lạ</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>✓</div>
                    <div className={styles.stepContent}>
                        <h3>Kiểm tra thời hạn</h3>
                        <p>Xem tài khoản còn bao lâu hết hạn</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>✓</div>
                    <div className={styles.stepContent}>
                        <h3>Kiểm tra tính năng Premium</h3>
                        <p>Đảm bảo vẫn có đầy đủ tính năng</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>✓</div>
                    <div className={styles.stepContent}>
                        <h3>Lưu thông tin đơn hàng</h3>
                        <p>Giữ email xác nhận để bảo hành</p>
                    </div>
                </div>
            </div>

            <h2>💡 Mẹo bảo mật nâng cao</h2>

            <div className={styles.productCategories}>
                <div className={styles.category}>
                    <h4>📱 Quản lý thiết bị</h4>
                    <ul>
                        <li>Đặt tên thiết bị dễ nhận biết</li>
                        <li>Đăng xuất thiết bị cũ/mất</li>
                        <li>Không lưu mật khẩu trên máy công cộng</li>
                    </ul>
                </div>

                <div className={styles.category}>
                    <h4>🌐 Sử dụng an toàn</h4>
                    <ul>
                        <li>Chỉ đăng nhập trên app chính thức</li>
                        <li>Không nhập mật khẩu trên web lạ</li>
                        <li>Tránh WiFi công cộng không bảo mật</li>
                    </ul>
                </div>

                <div className={styles.category}>
                    <h4>👥 Chia sẻ thông minh</h4>
                    <ul>
                        <li>Chỉ chia sẻ với người tin cậy</li>
                        <li>Tạo profile riêng cho từng người</li>
                        <li>Thống nhất quy tắc sử dụng</li>
                    </ul>
                </div>

                <div className={styles.category}>
                    <h4>📞 Liên hệ kịp thời</h4>
                    <ul>
                        <li>Báo CSKH ngay khi có vấn đề</li>
                        <li>Không tự ý xử lý khi không chắc</li>
                        <li>Cung cấp đầy đủ thông tin</li>
                    </ul>
                </div>
            </div>

            <div className={styles.highlightBox}>
                <h3>🎯 Tóm tắt: 5 điều TUYỆT ĐỐI KHÔNG làm</h3>
                <ol>
                    <li><strong>KHÔNG</strong> đổi mật khẩu tài khoản</li>
                    <li><strong>KHÔNG</strong> thay đổi thông tin cá nhân</li>
                    <li><strong>KHÔNG</strong> chia sẻ công khai trên mạng</li>
                    <li><strong>KHÔNG</strong> sử dụng VPN trái phép</li>
                    <li><strong>KHÔNG</strong> đăng nhập quá nhiều thiết bị</li>
                </ol>
            </div>

            <div className={styles.contactLink}>
                <p style={{ marginBottom: '16px' }}>
                    Cần tư vấn về bảo mật? Liên hệ ngay!
                </p>
                <Link href="/contact" className={styles.contactButton}>
                    💬 Chat với CSKH
                </Link>
            </div>
        </div>
    );
}
