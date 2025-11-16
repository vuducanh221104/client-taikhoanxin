import { Metadata } from 'next';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'Lịch Sử Đơn Hàng',
    description: 'Hướng dẫn xem và quản lý lịch sử đơn hàng tại TAIKHOANXIN.COM',
};

export default function OrderHistoryPage() {
    return (
        <div className={styles.helpContent}>
            <h1>Lịch sử đơn hàng</h1>
            
            <p>
                Hướng dẫn xem và quản lý lịch sử đơn hàng, theo dõi trạng thái và tải lại sản phẩm đã mua.
            </p>

            <h2>Xem lịch sử đơn hàng</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Đăng nhập</h3>
                        <p>Đăng nhập vào tài khoản của bạn</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Vào Đơn hàng</h3>
                        <p>Click avatar → "Đơn hàng của tôi"</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Xem danh sách</h3>
                        <p>Xem tất cả đơn hàng đã mua với trạng thái chi tiết</p>
                    </div>
                </div>
            </div>

            <h2>Trạng thái đơn hàng</h2>

            <div className={styles.productCategories}>
                <div className={styles.category}>
                    <h4>⏳ Chờ xử lý</h4>
                    <p>Đơn hàng đang chờ xác nhận thanh toán</p>
                </div>

                <div className={styles.category}>
                    <h4>✅ Hoàn thành</h4>
                    <p>Đơn hàng đã giao thành công</p>
                </div>

                <div className={styles.category}>
                    <h4>❌ Đã hủy</h4>
                    <p>Đơn hàng đã bị hủy</p>
                </div>

                <div className={styles.category}>
                    <h4>🔄 Hoàn tiền</h4>
                    <p>Đơn hàng đang được hoàn tiền</p>
                </div>
            </div>

            <h2>Chức năng quản lý</h2>

            <div className={styles.highlightBox}>
                <p><strong>🎯 Bạn có thể</strong></p>
                <ul>
                    <li>Xem chi tiết đơn hàng</li>
                    <li>Tải lại sản phẩm đã mua</li>
                    <li>In hóa đơn</li>
                    <li>Yêu cầu hỗ trợ</li>
                    <li>Đánh giá sản phẩm</li>
                    <li>Mua lại sản phẩm</li>
                </ul>
            </div>

            <h2>Lọc và tìm kiếm</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>🔍</div>
                    <div className={styles.stepContent}>
                        <h3>Tìm kiếm</h3>
                        <p>Tìm đơn hàng theo mã đơn, tên sản phẩm</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>📅</div>
                    <div className={styles.stepContent}>
                        <h3>Lọc theo ngày</h3>
                        <p>Chọn khoảng thời gian để xem đơn hàng</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>📊</div>
                    <div className={styles.stepContent}>
                        <h3>Lọc theo trạng thái</h3>
                        <p>Xem đơn hàng theo trạng thái cụ thể</p>
                    </div>
                </div>
            </div>

            <h2>Tải lại sản phẩm</h2>

            <div className={styles.troubleshootBox}>
                <h3>Cách tải lại sản phẩm đã mua:</h3>
                
                <div className={styles.troubleshootItem}>
                    <h4>1️⃣ Vào chi tiết đơn hàng</h4>
                    <p>Click vào đơn hàng cần tải lại sản phẩm</p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>2️⃣ Click "Tải lại"</h4>
                    <p>Nhấn nút "Tải lại" bên cạnh sản phẩm</p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>3️⃣ Nhận sản phẩm</h4>
                    <p>Sản phẩm sẽ được gửi lại qua email hoặc hiển thị trên trang</p>
                </div>
            </div>

            <div className={styles.warningBox}>
                <p><strong>⚠️ Lưu ý</strong></p>
                <ul>
                    <li>Chỉ tải lại được sản phẩm đã hoàn thành</li>
                    <li>Một số sản phẩm có giới hạn số lần tải</li>
                    <li>Sản phẩm hết hạn không thể tải lại</li>
                </ul>
            </div>

            <div className={styles.contactLink}>
                <p style={{ marginBottom: '16px', fontSize: '16px', color: 'var(--text-color)' }}>
                    Cần hỗ trợ về đơn hàng? Liên hệ với chúng tôi!
                </p>
                <a href="/contact" className={styles.contactButton}>
                    💬 Chat với CSKH
                </a>
            </div>
        </div>
    );
}
