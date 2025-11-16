import { Metadata } from 'next';
import Link from 'next/link';
import styles from '../../../page.module.scss';

export const metadata: Metadata = {
    title: 'Chính sách bảo hành Canva Pro | TAIKHOANXIN.COM',
    description: 'Chính sách bảo hành tài khoản Canva Pro',
};

export default function CanvaWarrantyPage() {
    return (
        <div className={styles.helpContent}>
            <h1>Chính sách bảo hành - Canva Pro</h1>
            
            <p>
                Chính sách bảo hành chi tiết cho tài khoản Canva Pro tại TAIKHOANXIN.COM.
            </p>

            <h2>⏰ Thời gian bảo hành</h2>

            <div className={styles.highlightBox}>
                <p>Bảo hành toàn bộ thời gian gói cước:</p>
                <ul>
                    <li><strong>Gói 1 tháng:</strong> Bảo hành 30 ngày</li>
                    <li><strong>Gói 3 tháng:</strong> Bảo hành 90 ngày</li>
                    <li><strong>Gói 6 tháng:</strong> Bảo hành 180 ngày</li>
                    <li><strong>Gói 1 năm:</strong> Bảo hành 365 ngày</li>
                </ul>
            </div>

            <h2>✅ Được bảo hành</h2>

            <div className={styles.productCategories}>
                <div className={styles.category}>
                    <h4>🔑 Không đăng nhập được</h4>
                    <p>Tài khoản bị khóa, sai mật khẩu do lỗi từ Canva</p>
                </div>

                <div className={styles.category}>
                    <h4>⬇️ Hạ về Free</h4>
                    <p>Tài khoản bị hạ cấp về Free không do lỗi người dùng</p>
                </div>

                <div className={styles.category}>
                    <h4>🚫 Mất tính năng Pro</h4>
                    <p>Không dùng được Background Remover, Magic Resize...</p>
                </div>

                <div className={styles.category}>
                    <h4>⏰ Hết hạn sớm</h4>
                    <p>Tài khoản hết hạn trước thời gian cam kết</p>
                </div>
            </div>

            <h2>❌ Không được bảo hành</h2>

            <div className={styles.warningBox}>
                <ul>
                    <li>Tự ý đổi mật khẩu, email tài khoản</li>
                    <li>Chia sẻ tài khoản cho quá nhiều người</li>
                    <li>Vi phạm điều khoản Canva</li>
                    <li>Sử dụng cho mục đích thương mại không được phép</li>
                    <li>Hết thời gian bảo hành</li>
                </ul>
            </div>

            <h2>⏱️ Thời gian xử lý</h2>

            <div className={styles.highlightBox}>
                <ul>
                    <li><strong>Lỗi đăng nhập:</strong> 1-2 giờ</li>
                    <li><strong>Tài khoản bị khóa:</strong> 2-6 giờ</li>
                    <li><strong>Hết hạn sớm:</strong> 6-12 giờ</li>
                    <li><strong>Các trường hợp khác:</strong> 12-24 giờ</li>
                </ul>
            </div>

            <div className={styles.contactLink}>
                <p style={{ marginBottom: '16px' }}>
                    Cần hỗ trợ bảo hành? Liên hệ ngay!
                </p>
                <Link href="/contact" className={styles.contactButton}>
                    💬 Chat với CSKH
                </Link>
            </div>
        </div>
    );
}
