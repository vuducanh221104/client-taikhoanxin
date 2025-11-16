import { Metadata } from 'next';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'Hướng Dẫn Thanh Toán',
    description: 'Hướng dẫn chi tiết các bước thanh toán và phương thức thanh toán',
};

export default function CheckoutGuidePage() {
    return (
        <div className={styles.helpContent}>
            <h1>Hướng dẫn thanh toán</h1>
            
            <p>
                TAIKHOANXIN.COM hỗ trợ nhiều phương thức thanh toán an toàn và tiện lợi. 
                Quy trình thanh toán được tự động hóa hoàn toàn, giúp bạn nhận sản phẩm ngay lập tức.
            </p>

            <h2>Quy trình thanh toán</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Kiểm tra giỏ hàng</h3>
                        <p>
                            Xem lại các sản phẩm trong giỏ hàng, số lượng và tổng tiền. 
                            Bạn có thể áp dụng mã giảm giá nếu có.
                        </p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Nhấn &quot;Thanh toán&quot;</h3>
                        <p>
                            Click vào nút &quot;Thanh toán&quot; để chuyển sang trang thanh toán. 
                            Đảm bảo bạn đã đăng nhập tài khoản.
                        </p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Chọn phương thức thanh toán</h3>
                        <p>
                            Chọn một trong các phương thức thanh toán phù hợp với bạn. 
                            Mỗi phương thức có hướng dẫn chi tiết.
                        </p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>4</div>
                    <div className={styles.stepContent}>
                        <h3>Hoàn tất thanh toán</h3>
                        <p>
                            Làm theo hướng dẫn của cổng thanh toán. Sau khi thanh toán thành công, 
                            bạn sẽ nhận sản phẩm ngay lập tức qua email.
                        </p>
                    </div>
                </div>
            </div>

            <h2>Các phương thức thanh toán</h2>

            <div className={styles.productCategories}>
                <div className={styles.category}>
                    <h4>💳 Thẻ ATM/Visa/Master</h4>
                    <p>
                        Thanh toán qua cổng VNPay, Momo. Hỗ trợ tất cả thẻ ngân hàng nội địa 
                        và thẻ quốc tế.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>📱 Ví điện tử</h4>
                    <p>
                        Momo, ZaloPay, VNPay. Thanh toán nhanh chóng chỉ với vài thao tác 
                        trên điện thoại.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>🏦 Chuyển khoản ngân hàng</h4>
                    <p>
                        Chuyển khoản trực tiếp qua Internet Banking hoặc tại quầy. 
                        Xử lý tự động sau 1-5 phút.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>📞 Thẻ cào điện thoại</h4>
                    <p>
                        Viettel, Mobifone, Vinaphone. Phù hợp khi bạn không có tài khoản ngân hàng.
                    </p>
                </div>
            </div>

            <h2>Hướng dẫn thanh toán qua VNPay/Momo</h2>

            <div className={styles.highlightBox}>
                <p>
                    <strong>💰 Thanh toán qua ví điện tử</strong>
                </p>
                <ol>
                    <li>Chọn phương thức &quot;VNPay&quot; hoặc &quot;Momo&quot;</li>
                    <li>Nhấn &quot;Thanh toán&quot; để chuyển sang cổng thanh toán</li>
                    <li>Quét mã QR bằng app Momo/Banking hoặc nhập thông tin thẻ</li>
                    <li>Xác nhận thanh toán trên app</li>
                    <li>Chờ 1-5 giây để hệ thống xử lý</li>
                    <li>Nhận sản phẩm qua email ngay lập tức</li>
                </ol>
            </div>

            <h2>Hướng dẫn chuyển khoản ngân hàng</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Lấy thông tin chuyển khoản</h3>
                        <p>
                            Sau khi chọn phương thức &quot;Chuyển khoản&quot;, hệ thống sẽ hiển thị:
                        </p>
                        <ul>
                            <li>Số tài khoản ngân hàng</li>
                            <li>Tên người nhận</li>
                            <li>Ngân hàng</li>
                            <li>Số tiền cần chuyển</li>
                            <li>Nội dung chuyển khoản (MÃ ĐƠN HÀNG)</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Thực hiện chuyển khoản</h3>
                        <p>
                            Mở app ngân hàng hoặc Internet Banking, điền thông tin và chuyển khoản. 
                            <strong> Lưu ý: Nhập đúng nội dung chuyển khoản để hệ thống tự động xử lý.</strong>
                        </p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Chờ xử lý tự động</h3>
                        <p>
                            Sau khi chuyển khoản thành công, hệ thống sẽ tự động xác nhận trong 1-5 phút. 
                            Bạn sẽ nhận email thông báo và sản phẩm.
                        </p>
                    </div>
                </div>
            </div>

            <h2>Áp dụng mã giảm giá</h2>

            <div className={styles.highlightBox}>
                <p>
                    <strong>🎁 Sử dụng mã khuyến mãi</strong>
                </p>
                <ol>
                    <li>Tại trang giỏ hàng, tìm ô &quot;Mã giảm giá&quot;</li>
                    <li>Nhập mã khuyến mãi của bạn</li>
                    <li>Nhấn &quot;Áp dụng&quot;</li>
                    <li>Giá sẽ được cập nhật tự động</li>
                    <li>Tiếp tục thanh toán với giá đã giảm</li>
                </ol>
                <p style={{ marginTop: '12px', fontSize: '14px' }}>
                    <strong>Lưu ý:</strong> Mỗi đơn hàng chỉ áp dụng được 1 mã giảm giá. 
                    Một số mã có điều kiện áp dụng (giá trị đơn hàng tối thiểu, sản phẩm cụ thể).
                </p>
            </div>

            <h2>Bảo mật thanh toán</h2>

            <div className={styles.warningBox}>
                <p>
                    <strong>🔒 Cam kết bảo mật</strong>
                </p>
                <ul>
                    <li>Tất cả giao dịch được mã hóa SSL 256-bit</li>
                    <li>Không lưu trữ thông tin thẻ của khách hàng</li>
                    <li>Thanh toán qua cổng thanh toán uy tín (VNPay, Momo)</li>
                    <li>Tuân thủ chuẩn bảo mật PCI DSS</li>
                    <li>Xác thực 2 lớp (3D Secure) cho thẻ quốc tế</li>
                </ul>
            </div>

            <h2>Vấn đề khi thanh toán?</h2>

            <div className={styles.troubleshootBox}>
                <h3>Các vấn đề thường gặp:</h3>
                
                <div className={styles.troubleshootItem}>
                    <h4>❌ Thanh toán thất bại</h4>
                    <p>
                        Kiểm tra số dư tài khoản, hạn mức giao dịch, thông tin thẻ. 
                        Thử lại hoặc chọn phương thức thanh toán khác.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>⏰ Đã chuyển khoản nhưng chưa nhận hàng</h4>
                    <p>
                        Kiểm tra nội dung chuyển khoản có đúng mã đơn hàng không. 
                        Nếu đúng, chờ thêm 5-10 phút. Vẫn chưa nhận thì liên hệ CSKH.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>💳 Thẻ bị trừ tiền nhưng đơn hàng thất bại</h4>
                    <p>
                        Đây là giao dịch tạm giữ của ngân hàng. Tiền sẽ được hoàn lại trong 1-3 ngày làm việc. 
                        Liên hệ CSKH nếu cần hỗ trợ.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>🎫 Mã giảm giá không áp dụng được</h4>
                    <p>
                        Kiểm tra điều kiện áp dụng: thời hạn, giá trị đơn hàng tối thiểu, 
                        sản phẩm áp dụng. Mỗi mã chỉ dùng được 1 lần.
                    </p>
                </div>
            </div>

            <h2>Chính sách hoàn tiền</h2>

            <div className={styles.highlightBox}>
                <p>
                    <strong>💸 Hoàn tiền khi nào?</strong>
                </p>
                <ul>
                    <li>Thanh toán thất bại: Hoàn ngay lập tức (nếu đã trừ tiền)</li>
                    <li>Hủy đơn hàng trước khi xử lý: Hoàn trong 1-3 ngày</li>
                    <li>Sản phẩm lỗi: Hoàn hoặc đổi sản phẩm mới trong thời gian bảo hành</li>
                    <li>Giao dịch trùng lặp: Hoàn tiền giao dịch thừa trong 3-5 ngày</li>
                </ul>
            </div>

            <div className={styles.contactLink}>
                <p style={{ marginBottom: '16px', fontSize: '16px', color: 'var(--text-color)' }}>
                    Cần hỗ trợ thanh toán? Chúng tôi sẵn sàng giúp bạn!
                </p>
                <a href="/contact" className={styles.contactButton}>
                    💬 Chat với CSKH
                </a>
            </div>
        </div>
    );
}
