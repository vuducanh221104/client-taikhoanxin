import { Metadata } from 'next';
import Link from 'next/link';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'Hướng dẫn chia sẻ Netflix Family | TAIKHOANXIN.COM',
    description: 'Hướng dẫn quản lý và chia sẻ tài khoản Netflix Family',
};

export default function NetflixFamilyGuidePage() {
    return (
        <div className={styles.helpContent}>
            <h1>Chia sẻ tài khoản Netflix Family</h1>
            
            <p>
                Netflix cho phép chia sẻ tài khoản với gia đình thông qua các gói Standard và Premium. 
                Hướng dẫn này sẽ giúp bạn quản lý và chia sẻ tài khoản hiệu quả.
            </p>

            <h2>📊 Các gói Netflix và số người dùng</h2>

            <div className={styles.productCategories}>
                <div className={styles.category}>
                    <h4>📱 Mobile</h4>
                    <p><strong>1 màn hình</strong> - Chỉ xem trên điện thoại/tablet</p>
                </div>

                <div className={styles.category}>
                    <h4>📺 Basic</h4>
                    <p><strong>1 màn hình</strong> - Xem trên mọi thiết bị, HD 720p</p>
                </div>

                <div className={styles.category}>
                    <h4>⭐ Standard</h4>
                    <p><strong>2 màn hình</strong> - Xem cùng lúc, Full HD 1080p</p>
                </div>

                <div className={styles.category}>
                    <h4>👑 Premium</h4>
                    <p><strong>4 màn hình</strong> - Xem cùng lúc, 4K Ultra HD</p>
                </div>
            </div>

            <h2>👥 Tạo Profile cho từng thành viên</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Vào Manage Profiles</h3>
                        <p>Nhấn vào biểu tượng profile → "Manage Profiles"</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Thêm Profile mới</h3>
                        <p>Nhấn "Add Profile", đặt tên và chọn avatar</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Cài đặt Profile</h3>
                        <p>Chọn "Kids" nếu là profile cho trẻ em</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>4</div>
                    <div className={styles.stepContent}>
                        <h3>Lưu và sử dụng</h3>
                        <p>Mỗi người chọn profile riêng khi xem</p>
                    </div>
                </div>
            </div>

            <h2>🔒 Bảo mật khi chia sẻ</h2>

            <div className={styles.highlightBox}>
                <h3>Những điều NÊN làm:</h3>
                <ul>
                    <li>✅ Chỉ chia sẻ với người thân tin cậy</li>
                    <li>✅ Tạo profile riêng cho từng người</li>
                    <li>✅ Sử dụng trong cùng hộ gia đình/địa điểm</li>
                    <li>✅ Đặt mã PIN cho profile chính</li>
                    <li>✅ Kiểm tra thiết bị đăng nhập định kỳ</li>
                </ul>

                <h3>Những điều KHÔNG NÊN làm:</h3>
                <ul>
                    <li>❌ Chia sẻ công khai trên mạng xã hội</li>
                    <li>❌ Cho quá nhiều người dùng</li>
                    <li>❌ Sử dụng ở nhiều địa điểm khác xa nhau</li>
                    <li>❌ Để người khác đổi mật khẩu</li>
                </ul>
            </div>

            <h2>⚙️ Quản lý thiết bị đăng nhập</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Vào Account Settings</h3>
                        <p>Truy cập netflix.com/account</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Xem thiết bị</h3>
                        <p>Chọn "Recent device streaming activity"</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Đăng xuất thiết bị lạ</h3>
                        <p>Nhấn "Sign out of all devices" nếu thấy thiết bị lạ</p>
                    </div>
                </div>
            </div>

            <h2>👶 Kiểm soát nội dung cho trẻ em</h2>

            <div className={styles.highlightBox}>
                <p><strong>Cách thiết lập Parental Controls:</strong></p>
                <ol>
                    <li>Vào Account → Profile & Parental Controls</li>
                    <li>Chọn profile trẻ em</li>
                    <li>Đặt mã PIN 4 số</li>
                    <li>Chọn giới hạn độ tuổi (G, PG, PG-13, R...)</li>
                    <li>Lưu cài đặt</li>
                </ol>
            </div>

            <h2>💡 Mẹo chia sẻ hiệu quả</h2>

            <div className={styles.productCategories}>
                <div className={styles.category}>
                    <h4>📝 Quy tắc rõ ràng</h4>
                    <p>Thống nhất quy tắc sử dụng với các thành viên</p>
                </div>

                <div className={styles.category}>
                    <h4>🎯 Profile riêng</h4>
                    <p>Mỗi người dùng profile riêng để có gợi ý phù hợp</p>
                </div>

                <div className={styles.category}>
                    <h4>🔐 Bảo mật</h4>
                    <p>Không chia sẻ mật khẩu công khai</p>
                </div>

                <div className={styles.category}>
                    <h4>📞 Liên hệ kịp thời</h4>
                    <p>Báo CSKH ngay khi có vấn đề</p>
                </div>
            </div>

            <h2>⚠️ Chính sách chia sẻ mới của Netflix</h2>

            <div className={styles.warningBox}>
                <p><strong>Lưu ý quan trọng:</strong></p>
                <p>
                    Netflix đang hạn chế chia sẻ tài khoản ngoài cùng hộ gia đình. 
                    Để tránh bị khóa tài khoản:
                </p>
                <ul>
                    <li>Sử dụng trong cùng địa điểm/WiFi</li>
                    <li>Không chia sẻ cho người ở xa</li>
                    <li>Mỗi thiết bị nên kết nối WiFi nhà ít nhất 1 lần/31 ngày</li>
                    <li>Liên hệ CSKH nếu nhận cảnh báo từ Netflix</li>
                </ul>
            </div>

            <div className={styles.contactLink}>
                <p style={{ marginBottom: '16px' }}>
                    Cần tư vấn về chia sẻ tài khoản? Liên hệ ngay!
                </p>
                <Link href="/contact" className={styles.contactButton}>
                    💬 Chat với CSKH
                </Link>
            </div>
        </div>
    );
}
