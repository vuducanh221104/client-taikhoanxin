import { Metadata } from 'next';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'Chính Sách Thanh Toán',
    description: 'Chính sách thanh toán và các phương thức thanh toán tại TAIKHOANXIN.COM',
};

export default function PaymentPolicyPage() {
    return (
        <div className={styles.helpContent}>
            <h1>Chính sách thanh toán</h1>
            
            <p>
                TAIKHOANXIN.COM hỗ trợ nhiều phương thức thanh toán an toàn, nhanh chóng và tiện lợi.
            </p>

            <h2>Phương thức thanh toán</h2>

            <div className={styles.productCategories}>
                <div className={styles.category}>
                    <h4>🏦 Chuyển khoản ngân hàng</h4>
                    <p>
                        Chuyển khoản qua Internet Banking hoặc ATM. 
                        Xử lý trong 5-30 phút.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>📱 Ví điện tử</h4>
                    <p>
                        Momo, ZaloPay, VNPay. 
                        Thanh toán nhanh chóng, nhận hàng ngay.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>💳 Thẻ tín dụng/ghi nợ</h4>
                    <p>
                        Visa, Mastercard, JCB. 
                        Thanh toán quốc tế an toàn.
                    </p>
                </div>
            </div>

            <h2>Quy trình thanh toán</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Chọn sản phẩm</h3>
                        <p>Thêm sản phẩm vào giỏ hàng và tiến hành thanh toán</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Chọn phương thức</h3>
                        <p>Chọn phương thức thanh toán phù hợp</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Thực hiện thanh toán</h3>
                        <p>Làm theo hướng dẫn để hoàn tất thanh toán</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>4</div>
                    <div className={styles.stepContent}>
                        <h3>Nhận sản phẩm</h3>
                        <p>Sản phẩm được giao ngay sau khi thanh toán thành công</p>
                    </div>
                </div>
            </div>

            <h2>Bảo mật thanh toán</h2>

            <div className={styles.highlightBox}>
                <p><strong>🔒 Cam kết bảo mật</strong></p>
                <ul>
                    <li>Mã hóa SSL 256-bit cho mọi giao dịch</li>
                    <li>Tuân thủ chuẩn bảo mật PCI DSS</li>
                    <li>Không lưu trữ thông tin thẻ</li>
                    <li>Xác thực 3D Secure cho thẻ quốc tế</li>
                    <li>Giám sát giao dịch 24/7</li>
                </ul>
            </div>

            <h2>Thời gian xử lý</h2>

            <div className={styles.productCategories}>
                <div className={styles.category}>
                    <h4>⚡ Tức thì</h4>
                    <p>Ví điện tử: Nhận hàng ngay lập tức</p>
                </div>

                <div className={styles.category}>
                    <h4>⏱️ 5-30 phút</h4>
                    <p>Chuyển khoản ngân hàng: Xử lý trong giờ hành chính</p>
                </div>

                <div className={styles.category}>
                    <h4>🕐 1-2 giờ</h4>
                    <p>Chuyển khoản ngoài giờ: Xử lý vào sáng hôm sau</p>
                </div>

                <div className={styles.category}>
                    <h4>📅 1-3 ngày</h4>
                    <p>Thẻ quốc tế: Tùy thuộc vào ngân hàng phát hành</p>
                </div>
            </div>

            <h2>Phí thanh toán</h2>

            <div className={styles.highlightBox}>
                <p><strong>💰 Chính sách phí</strong></p>
                <ul>
                    <li><strong>Miễn phí:</strong> Chuyển khoản, Ví điện tử</li>
                    <li><strong>Phí 2%:</strong> Thẻ tín dụng quốc tế (do ngân hàng thu)</li>
                    <li><strong>Phí 1%:</strong> Thẻ ghi nợ nội địa (tối đa 5,000đ)</li>
                </ul>
            </div>

            <h2>Hóa đơn VAT</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>📄</div>
                    <div className={styles.stepContent}>
                        <h3>Yêu cầu hóa đơn</h3>
                        <p>Tick chọn "Xuất hóa đơn VAT" khi thanh toán</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>📝</div>
                    <div className={styles.stepContent}>
                        <h3>Điền thông tin</h3>
                        <p>Nhập đầy đủ thông tin công ty (tên, MST, địa chỉ)</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>📧</div>
                    <div className={styles.stepContent}>
                        <h3>Nhận hóa đơn</h3>
                        <p>Hóa đơn điện tử gửi qua email trong 1-3 ngày</p>
                    </div>
                </div>
            </div>

            <h2>Xử lý sự cố</h2>

            <div className={styles.troubleshootBox}>
                <h3>Các tình huống thường gặp:</h3>
                
                <div className={styles.troubleshootItem}>
                    <h4>💳 Thanh toán thất bại</h4>
                    <p>
                        <strong>Nguyên nhân:</strong> Số dư không đủ, thẻ hết hạn, lỗi kết nối.<br />
                        <strong>Giải pháp:</strong> Kiểm tra lại thông tin và thử lại hoặc đổi phương thức khác.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>⏳ Đã chuyển khoản nhưng chưa nhận hàng</h4>
                    <p>
                        <strong>Nguyên nhân:</strong> Chưa đối soát được giao dịch.<br />
                        <strong>Giải pháp:</strong> Gửi ảnh chụp biên lai cho CSKH để xử lý nhanh.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>🔄 Thanh toán bị trừ tiền 2 lần</h4>
                    <p>
                        <strong>Nguyên nhân:</strong> Lỗi hệ thống thanh toán.<br />
                        <strong>Giải pháp:</strong> Liên hệ CSKH ngay, tiền thừa sẽ được hoàn trong 1-3 ngày.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>❌ Giao dịch bị từ chối</h4>
                    <p>
                        <strong>Nguyên nhân:</strong> Ngân hàng từ chối, vượt hạn mức.<br />
                        <strong>Giải pháp:</strong> Liên hệ ngân hàng hoặc dùng phương thức khác.
                    </p>
                </div>
            </div>

            <h2>Chính sách hoàn tiền</h2>

            <div className={styles.warningBox}>
                <p><strong>💸 Quy định hoàn tiền</strong></p>
                <ul>
                    <li>Hoàn tiền theo chính sách đổi trả</li>
                    <li>Thời gian hoàn: 1-7 ngày tùy phương thức</li>
                    <li>Hoàn về tài khoản ngân hàng hoặc phương thức thanh toán gốc</li>
                    <li>Phí giao dịch (nếu có) không được hoàn</li>
                </ul>
            </div>

            <h2>Ưu đãi thanh toán</h2>

            <div className={styles.highlightBox}>
                <p><strong>🎁 Khuyến mãi đặc biệt</strong></p>
                <ul>
                    <li>Giảm 2% khi thanh toán qua ví điện tử</li>
                    <li>Hoàn 1% cho đơn hàng trên 500,000đ</li>
                    <li>Tích điểm thưởng mỗi giao dịch</li>
                    <li>Ưu đãi riêng cho khách hàng VIP</li>
                </ul>
            </div>

            <div className={styles.contactLink}>
                <p style={{ marginBottom: '16px', fontSize: '16px', color: 'var(--text-color)' }}>
                    Cần hỗ trợ thanh toán? Liên hệ với chúng tôi!
                </p>
                <a href="/contact" className={styles.contactButton}>
                    💬 Chat với CSKH
                </a>
            </div>
        </div>
    );
}
