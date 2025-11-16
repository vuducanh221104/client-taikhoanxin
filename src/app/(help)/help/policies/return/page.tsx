import { Metadata } from 'next';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'Chính Sách Đổi Trả',
    description: 'Chính sách đổi trả sản phẩm tại TAIKHOANXIN.COM',
};

export default function ReturnPolicyPage() {
    return (
        <div className={styles.helpContent}>
            <h1>Chính sách đổi trả</h1>
            
            <p>
                TAIKHOANXIN.COM cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng. 
                Do đặc thù sản phẩm là tài khoản dịch vụ streaming (Netflix, Spotify, YouTube Premium), 
                chính sách đổi trả được áp dụng linh hoạt nhằm đảm bảo quyền lợi khách hàng.
            </p>

            <div className={styles.highlightBox}>
                <p><strong>🎯 Cam kết của chúng tôi</strong></p>
                <ul>
                    <li><strong>Đổi tài khoản mới:</strong> Nếu tài khoản lỗi không sử dụng được</li>
                    <li><strong>Hoàn tiền 100%:</strong> Nếu không thể khắc phục trong 24 giờ</li>
                    <li><strong>Hỗ trợ 24/7:</strong> Đội ngũ CSKH luôn sẵn sàng hỗ trợ</li>
                    <li><strong>Xử lý nhanh:</strong> Giải quyết yêu cầu trong 1-24 giờ</li>
                </ul>
            </div>

            <h2>Điều kiện đổi trả</h2>

            <div className={styles.highlightBox}>
                <p><strong>✅ Được chấp nhận đổi trả</strong></p>
                <ul>
                    <li>Sản phẩm lỗi từ nhà cung cấp</li>
                    <li>Sản phẩm không đúng mô tả</li>
                    <li>Mua nhầm sản phẩm (trong 7 ngày, chưa sử dụng)</li>
                    <li>Sản phẩm không kích hoạt được do lỗi hệ thống</li>
                    <li>Nhận sai sản phẩm so với đơn hàng</li>
                </ul>
            </div>

            <div className={styles.warningBox}>
                <p><strong>❌ KHÔNG được đổi trả</strong></p>
                <ul>
                    <li>Sản phẩm đã sử dụng/kích hoạt thành công</li>
                    <li>Quá thời hạn đổi trả (7 ngày)</li>
                    <li>Lỗi do người dùng (đổi mật khẩu, chia sẻ tài khoản)</li>
                    <li>Sản phẩm dịch vụ đã hết hạn tự nhiên</li>
                    <li>Không cung cấp được thông tin đơn hàng</li>
                </ul>
            </div>

            <h2>Thời hạn đổi trả theo sản phẩm</h2>

            <div className={styles.productCategories}>
                <div className={styles.category}>
                    <h4>🎬 Netflix</h4>
                    <p>
                        <strong>Thời hạn: Toàn bộ thời gian gói</strong><br />
                        Đổi tài khoản mới nếu không đăng nhập được hoặc bị lỗi.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>🎵 Spotify Premium</h4>
                    <p>
                        <strong>Thời hạn: Toàn bộ thời gian gói</strong><br />
                        Đổi tài khoản mới nếu bị hạ về Free hoặc không sử dụng được.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>📺 YouTube Premium</h4>
                    <p>
                        <strong>Thời hạn: Toàn bộ thời gian gói</strong><br />
                        Đổi tài khoản mới nếu mất quyền Premium hoặc không truy cập được.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>⏰ Lưu ý chung</h4>
                    <p>
                        Tất cả sản phẩm đều được bảo hành trong suốt thời gian gói cước.
                    </p>
                </div>
            </div>

            <h2>Quy trình đổi trả</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Liên hệ yêu cầu đổi trả</h3>
                        <ul>
                            <li>Mã đơn hàng</li>
                            <li>Email đăng ký</li>
                            <li>Lý do đổi trả</li>
                            <li>Ảnh chụp màn hình lỗi (nếu có)</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Xác minh thông tin</h3>
                        <ul>
                            <li>Tính hợp lệ của yêu cầu</li>
                            <li>Thời hạn đổi trả</li>
                            <li>Trạng thái sản phẩm</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Xử lý đổi trả</h3>
                        <ul>
                            <li>Đổi sản phẩm mới cùng loại</li>
                            <li>Đổi sang sản phẩm khác</li>
                            <li>Hoàn tiền (trừ phí nếu có)</li>
                            <li>Thời gian xử lý: 1-24 giờ</li>
                        </ul>
                    </div>
                </div>
            </div>

            <h2>Chính sách hoàn tiền</h2>

            <div className={styles.productCategories}>
                <div className={styles.category}>
                    <h4>💯 Hoàn 100%</h4>
                    <p>
                        Lỗi trong 24 giờ đầu và không thể khắc phục. 
                        Hoàn tiền đầy đủ không trừ phí.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>📊 Hoàn theo tỷ lệ</h4>
                    <p>
                        Lỗi sau 24 giờ: Hoàn tiền phần thời gian chưa sử dụng.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>🔄 Đổi sản phẩm</h4>
                    <p>
                        Ưu tiên đổi tài khoản mới cùng loại thay vì hoàn tiền.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>⏱️ Thời gian xử lý</h4>
                    <p>
                        Hoàn tiền trong 1-3 ngày làm việc sau khi duyệt yêu cầu.
                    </p>
                </div>
            </div>

            <h2>Hình thức hoàn tiền</h2>

            <h2>Phương thức hoàn tiền</h2>

            <div className={styles.highlightBox}>
                <p><strong>💳 Các hình thức hoàn tiền</strong></p>
                <ul>
                    <li><strong>Chuyển khoản ngân hàng:</strong> 1-3 ngày làm việc (ưu tiên)</li>
                    <li><strong>Ví điện tử (MoMo, ZaloPay):</strong> 1-2 ngày làm việc</li>
                    <li><strong>Thẻ tín dụng/ghi nợ:</strong> 3-7 ngày làm việc (tùy ngân hàng)</li>
                </ul>
                <p style={{ marginTop: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    * Thời gian có thể nhanh hơn tùy vào phương thức thanh toán ban đầu
                </p>
            </div>

            <h2>Lưu ý quan trọng</h2>

            <div className={styles.warningBox}>
                <p><strong>⚠️ Điều khoản quan trọng</strong></p>
                <ul>
                    <li>Phải giữ nguyên thông tin đơn hàng và email xác nhận</li>
                    <li>Không tự ý thay đổi mật khẩu hoặc thông tin tài khoản trước khi liên hệ</li>
                    <li>Cung cấp đầy đủ thông tin: mã đơn hàng, email, mô tả lỗi, ảnh chụp màn hình</li>
                    <li>Ưu tiên đổi tài khoản mới thay vì hoàn tiền để đảm bảo trải nghiệm tốt nhất</li>
                    <li>Quyết định cuối cùng về việc đổi trả thuộc về TAIKHOANXIN.COM</li>
                </ul>
            </div>

            <h2>Các trường hợp đặc biệt</h2>

            <div className={styles.troubleshootBox}>
                <h3>Xử lý các tình huống:</h3>
                
                <div className={styles.troubleshootItem}>
                    <h4>🔄 Muốn đổi sang sản phẩm khác</h4>
                    <p>
                        <strong>Điều kiện:</strong> Trong 24 giờ đầu, chưa sử dụng.<br />
                        <strong>Giải pháp:</strong> Đổi sang sản phẩm cùng giá trị hoặc bù thêm tiền chênh lệch.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>💰 Mua nhầm gói cước</h4>
                    <p>
                        <strong>Điều kiện:</strong> Trong 24 giờ đầu, chưa sử dụng.<br />
                        <strong>Giải pháp:</strong> Đổi sang gói cước phù hợp hoặc hoàn tiền 100%.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>🚫 Tài khoản bị khóa do lỗi người dùng</h4>
                    <p>
                        <strong>Nguyên nhân:</strong> Đổi mật khẩu, chia sẻ quá nhiều người.<br />
                        <strong>Giải pháp:</strong> Không được đổi trả. Vui lòng tuân thủ điều khoản sử dụng.
                    </p>
                </div>
            </div>

            <div className={styles.contactLink}>
                <p style={{ marginBottom: '16px', fontSize: '16px', color: 'var(--text-color)' }}>
                    Cần hỗ trợ đổi trả? Liên hệ ngay với chúng tôi!
                </p>
                <a href="/contact" className={styles.contactButton}>
                    💬 Chat với CSKH
                </a>
            </div>
        </div>
    );
}
