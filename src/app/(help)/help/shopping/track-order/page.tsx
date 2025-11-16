import { Metadata } from 'next';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'Hướng Dẫn Theo Dõi Đơn Hàng',
    description: 'Hướng dẫn chi tiết cách theo dõi và kiểm tra trạng thái đơn hàng',
};

export default function TrackOrderPage() {
    return (
        <div className={styles.helpContent}>
            <h1>Hướng dẫn theo dõi đơn hàng</h1>
            
            <p>
                Sau khi đặt hàng thành công, bạn có thể theo dõi trạng thái đơn hàng của mình bất cứ lúc nào 
                để biết tiến độ xử lý và nhận sản phẩm.
            </p>

            <div className={styles.infoBox}>
                <p><strong>💡 Lưu ý:</strong></p>
                <p>
                    Để quản lý và xem tất cả đơn hàng chi tiết, vui lòng xem hướng dẫn tại{' '}
                    <a href="/help/shopping/manage-orders" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
                        Quản lý đơn hàng
                    </a>
                </p>
            </div>

            <h2>Cách theo dõi đơn hàng</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Đăng nhập tài khoản</h3>
                        <p>
                            Truy cập TAIKHOANXIN.COM và đăng nhập vào tài khoản của bạn.
                        </p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Vào mục &quot;Lịch sử đơn hàng&quot;</h3>
                        <p>
                            Nhấp vào avatar/tên tài khoản ở góc trên bên phải, chọn &quot;Lịch sử đơn hàng&quot; 
                            hoặc truy cập trực tiếp tại <a href="/account/orders" style={{ color: 'var(--primary-color)' }}>/account/orders</a>
                        </p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Xem chi tiết đơn hàng</h3>
                        <p>
                            Danh sách tất cả đơn hàng sẽ hiển thị. Nhấp vào đơn hàng bạn muốn xem để 
                            kiểm tra chi tiết và trạng thái.
                        </p>
                    </div>
                </div>
            </div>

            <h2>Các trạng thái đơn hàng</h2>

            <div className={styles.highlightBox}>
                <ul>
                    <li>
                        <strong>⏳ Chờ thanh toán:</strong> Đơn hàng đang chờ bạn thanh toán. 
                        Vui lòng hoàn tất thanh toán để nhận sản phẩm.
                    </li>
                    <li>
                        <strong>🔄 Đang xử lý:</strong> Đơn hàng đang được xử lý bởi hệ thống. 
                        Thường mất từ 1-5 phút.
                    </li>
                    <li>
                        <strong>✅ Hoàn thành:</strong> Đơn hàng đã được xử lý và giao thành công. 
                        Bạn có thể xem thông tin tài khoản trong chi tiết đơn hàng.
                    </li>
                    <li>
                        <strong>❌ Đã hủy:</strong> Đơn hàng đã bị hủy do thanh toán thất bại 
                        hoặc theo yêu cầu của bạn.
                    </li>
                </ul>
            </div>

            <h2>Nhận thông báo đơn hàng</h2>

            <div className={styles.highlightBox}>
                <p>
                    <strong>📧 Thông báo qua Email</strong>
                </p>
                <p>
                    Bạn sẽ nhận được email thông báo tự động khi:
                </p>
                <ul>
                    <li>Đơn hàng được tạo thành công</li>
                    <li>Thanh toán được xác nhận</li>
                    <li>Sản phẩm đã được giao (kèm thông tin tài khoản/key)</li>
                    <li>Đơn hàng có thay đổi trạng thái</li>
                </ul>
            </div>

            <h2>Xem thông tin sản phẩm đã mua</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Truy cập &quot;Lịch sử đơn hàng&quot;</h3>
                        <p>
                            Vào menu tài khoản → Chọn &quot;Lịch sử đơn hàng&quot; → Chọn &quot;Chi tiết đơn hàng&quot; để xem 
                            sản phẩm đã mua.
                        </p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Xem thông tin chi tiết</h3>
                        <p>
                            Mỗi sản phẩm sẽ hiển thị:
                        </p>
                        <ul>
                            <li>Tên tài khoản / Email đăng nhập</li>
                            <li>Mật khẩu (nếu có)</li>
                            <li>Key kích hoạt (nếu có)</li>
                            <li>Hướng dẫn sử dụng</li>
                            <li>Thời hạn bảo hành</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Sao chép thông tin</h3>
                        <p>
                            Nhấp vào icon copy để sao chép nhanh thông tin tài khoản/key. 
                            Lưu ý bảo mật thông tin này.
                        </p>
                    </div>
                </div>
            </div>

            <h2>Kiểm tra lịch sử giao dịch</h2>

            <div className={styles.highlightBox}>
                <p>
                    <strong>💳 Lịch sử thanh toán</strong>
                </p>
                <p>
                    Xem tất cả giao dịch đã thực hiện tại mục &quot;Lịch sử giao dịch&quot;:
                </p>
                <ul>
                    <li>Ngày giờ giao dịch</li>
                    <li>Số tiền thanh toán</li>
                    <li>Phương thức thanh toán</li>
                    <li>Trạng thái giao dịch</li>
                    <li>Mã giao dịch (để đối soát nếu cần)</li>
                </ul>
            </div>

            <h2>Vấn đề với đơn hàng?</h2>

            <div className={styles.troubleshootBox}>
                <h3>Các tình huống thường gặp:</h3>
                
                <div className={styles.troubleshootItem}>
                    <h4>⏰ Đơn hàng chờ xử lý quá lâu</h4>
                    <p>
                        Nếu đơn hàng ở trạng thái &quot;Chờ xử lý&quot; quá 15 phút, 
                        vui lòng liên hệ CSKH để được hỗ trợ kiểm tra.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>📧 Không nhận được email</h4>
                    <p>
                        Kiểm tra thư mục spam/junk. Nếu vẫn không thấy, 
                        vào &quot;Chi tiết đơn hàng&quot; để xem thông tin trực tiếp trên website.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>🔑 Thông tin sản phẩm không đúng</h4>
                    <p>
                        Nếu tài khoản/key không hoạt động, liên hệ ngay với CSKH kèm mã đơn hàng 
                        để được hỗ trợ đổi sản phẩm trong thời gian bảo hành.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>💰 Đã thanh toán nhưng chưa nhận hàng</h4>
                    <p>
                        Kiểm tra email xác nhận thanh toán. Nếu đã thanh toán thành công nhưng 
                        chưa nhận sản phẩm sau 30 phút, liên hệ CSKH ngay.
                    </p>
                </div>
            </div>

            <div className={styles.warningBox}>
                <p>
                    <strong>⚠️ Lưu ý quan trọng</strong>
                </p>
                <ul>
                    <li>Lưu lại thông tin đơn hàng và mã giao dịch để tra cứu khi cần</li>
                    <li>Không chia sẻ thông tin tài khoản/key với người khác</li>
                    <li>Đổi mật khẩu ngay sau khi nhận để bảo mật</li>
                    <li>Liên hệ CSKH ngay nếu phát hiện bất thường</li>
                    <li>Kiểm tra thời hạn bảo hành của sản phẩm</li>
                </ul>
            </div>

            <div className={styles.contactLink}>
                <p style={{ marginBottom: '16px', fontSize: '16px', color: 'var(--text-color)' }}>
                    Cần hỗ trợ về đơn hàng? Chúng tôi sẵn sàng giúp bạn 24/7!
                </p>
                <a href="/contact" className={styles.contactButton}>
                    💬 Chat với CSKH
                </a>
            </div>
        </div>
    );
}
