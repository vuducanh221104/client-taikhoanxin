import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'Quản lý đơn hàng | TAIKHOANXIN.COM',
    description: 'Hướng dẫn quản lý và theo dõi đơn hàng tại TAIKHOANXIN.COM',
};

export default function ManageOrdersPage() {
    return (
        <div className={styles.helpContent}>
            <h1>Quản lý đơn hàng</h1>

            <h2>Truy cập lịch sử đơn hàng</h2>
            <p>
                Truy cập lịch sử đơn hàng tại{' '}
                <Link href="/account/orders" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
                    ĐÂY
                </Link>
            </p>
            <p>
                Tại đây bạn sẽ xem được tất cả các đơn hàng bạn đã mua trên TAIKHOANXIN.COM
            </p>

            <div style={{ margin: '32px 0', textAlign: 'center' }}>
                <Image
                    src="/help/orders/order-list.png"
                    alt="Danh sách đơn hàng"
                    width={800}
                    height={500}
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                />
            </div>

            <h2>1. Bộ lọc tìm kiếm</h2>
            <p>
                Giúp bạn tìm kiếm các đơn hàng theo những điều kiện khác nhau như:
            </p>
            <ul>
                <li><strong>Mã đơn hàng:</strong> Tìm kiếm theo mã đơn hàng cụ thể</li>
                <li><strong>Ngày mua:</strong> Lọc theo khoảng thời gian (ngày tạo từ - ngày tạo đến)</li>
                <li><strong>Giá trị đơn hàng:</strong> Lọc theo khoảng giá (số tiền từ - số tiền đến)</li>
                <li><strong>Trạng thái:</strong> Lọc theo trạng thái đơn hàng (Hoàn thành, Chờ thanh toán...)</li>
            </ul>

            <h2>2. Tổng tiền đã thanh toán</h2>
            <p>
                Con số này thể hiện tổng giá trị các đơn hàng.
            </p>
            <p>
                Mặc định khi truy cập trang này, nó sẽ là tổng tiền mà bạn đã giao dịch trên TAIKHOANXIN.COM.
            </p>
            <p>
                Ngoài ra khi bạn sử dụng chức năng tìm kiếm, nó sẽ là tổng của những đơn hàng nằm trong kết quả tìm kiếm.
            </p>

            <div className={styles.infoBox}>
                <p><strong>💡 Ví dụ:</strong></p>
                <p>
                    Bạn muốn biết tháng 03/2024 bạn đã phát sinh bao nhiêu tiền trên Shop. 
                    Chỉ cần tìm kiếm đơn hàng với điều kiện:
                </p>
                <ul>
                    <li><strong>Ngày tạo từ:</strong> 2024-03-01</li>
                    <li><strong>Ngày tạo đến:</strong> 2024-03-31</li>
                </ul>
                <p>
                    Sau đó bấm <strong>Tìm kiếm</strong>, khi có kết quả, Tổng tiền hiện ra chính là 
                    tổng tiền phát sinh trong tháng 03/2024.
                </p>
            </div>

            <h2>3. Danh sách các đơn hàng</h2>
            <p>
                Đây là danh sách chi tiết các đơn hàng của bạn.
            </p>
            <p>
                Nhìn qua đây, các bạn có thể thấy được các thông tin cơ bản của đơn hàng như:
            </p>
            <ul>
                <li><strong>Mã đơn hàng:</strong> Mã định danh duy nhất của đơn hàng</li>
                <li><strong>Ngày mua:</strong> Thời gian tạo đơn hàng</li>
                <li><strong>Sản phẩm:</strong> Tên sản phẩm đã mua</li>
                <li><strong>Giá trị:</strong> Tổng giá trị đơn hàng</li>
                <li><strong>Trạng thái:</strong> Tình trạng hiện tại của đơn hàng</li>
            </ul>

            <h2>4. Chi tiết đơn hàng</h2>
            <p>
                Để biết thêm các thông tin chi tiết của đơn hàng, bạn hãy click vào nút <strong>"Xem chi tiết"</strong> 
                hoặc click vào dòng đơn hàng.
            </p>

            <div style={{ margin: '32px 0', textAlign: 'center' }}>
                <Image
                    src="/help/orders/order-detail.png"
                    alt="Chi tiết đơn hàng"
                    width={800}
                    height={600}
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                />
            </div>

            <p>
                Tại trang chi tiết đơn hàng, bạn có thể xem:
            </p>

            <div className={styles.productCategories}>
                <div className={styles.category}>
                    <h4>📋 Thông tin đơn hàng</h4>
                    <ul>
                        <li>Mã đơn hàng</li>
                        <li>Ngày tạo</li>
                        <li>Trạng thái</li>
                        <li>Phương thức thanh toán</li>
                    </ul>
                </div>

                <div className={styles.category}>
                    <h4>🎮 Thông tin sản phẩm</h4>
                    <ul>
                        <li>Tên sản phẩm</li>
                        <li>Số lượng</li>
                        <li>Đơn giá</li>
                        <li>Thành tiền</li>
                    </ul>
                </div>

                <div className={styles.category}>
                    <h4>🔑 Thông tin tài khoản</h4>
                    <ul>
                        <li>Email/Username</li>
                        <li>Mật khẩu</li>
                        <li>Hướng dẫn sử dụng</li>
                        <li>Thời hạn sử dụng</li>
                    </ul>
                </div>

                <div className={styles.category}>
                    <h4>💰 Biên lai chi tiết</h4>
                    <ul>
                        <li>Tổng tiền hàng</li>
                        <li>Giảm giá (nếu có)</li>
                        <li>Phí dịch vụ (nếu có)</li>
                        <li>Tổng thanh toán</li>
                    </ul>
                </div>
            </div>

            <h2>Các trạng thái đơn hàng</h2>

            <div className={styles.highlightBox}>
                <ul>
                    <li>
                        <strong>✅ Hoàn thành:</strong> Đơn hàng đã được xử lý và giao thành công. 
                        Bạn có thể xem thông tin tài khoản trong chi tiết đơn hàng.
                    </li>
                    <li>
                        <strong>⏳ Chờ thanh toán:</strong> Đơn hàng đang chờ bạn thanh toán. 
                        Vui lòng hoàn tất thanh toán để nhận sản phẩm.
                    </li>
                    <li>
                        <strong>🔄 Đang xử lý:</strong> Đơn hàng đang được xử lý bởi hệ thống. 
                        Thường mất từ 1-5 phút.
                    </li>
                    <li>
                        <strong>❌ Đã hủy:</strong> Đơn hàng đã bị hủy do thanh toán thất bại 
                        hoặc theo yêu cầu của bạn.
                    </li>
                </ul>
            </div>

            <h2>Xuất biên lai</h2>
            <p>
                Bạn có thể xuất biên lai điện tử cho đơn hàng của mình:
            </p>
            <ol>
                <li>Vào chi tiết đơn hàng</li>
                <li>Nhấn nút <strong>"Xuất biên lai"</strong></li>
                <li>Chọn định dạng: PDF hoặc In trực tiếp</li>
                <li>Lưu hoặc in biên lai</li>
            </ol>

            <h2>Yêu cầu hỗ trợ</h2>
            <p>
                Nếu có vấn đề với đơn hàng, bạn có thể:
            </p>
            <ul>
                <li>Nhấn nút <strong>"Yêu cầu hỗ trợ"</strong> trong chi tiết đơn hàng</li>
                <li>Liên hệ CSKH qua Zalo hoặc Live Chat</li>
                <li>Gửi email kèm mã đơn hàng</li>
            </ul>

            <div className={styles.warningBox}>
                <p><strong>⚠️ Lưu ý quan trọng:</strong></p>
                <ul>
                    <li>Lưu giữ thông tin đơn hàng và biên lai để dễ tra cứu</li>
                    <li>Kiểm tra thông tin tài khoản ngay sau khi nhận hàng</li>
                    <li>Báo lỗi ngay nếu tài khoản không hoạt động</li>
                    <li>Không chia sẻ thông tin đơn hàng cho người khác</li>
                </ul>
            </div>

            <div className={styles.contactLink}>
                <p style={{ marginBottom: '16px' }}>
                    Cần hỗ trợ về đơn hàng? Liên hệ với chúng tôi!
                </p>
                <Link href="/contact" className={styles.contactButton}>
                    💬 Chat với CSKH
                </Link>
            </div>
        </div>
    );
}
