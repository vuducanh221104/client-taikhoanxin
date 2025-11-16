import { Metadata } from 'next';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'Chính Sách Bảo Mật',
    description: 'Chính sách bảo mật thông tin khách hàng tại TAIKHOANXIN.COM',
};

export default function PrivacyPolicyPage() {
    return (
        <div className={styles.helpContent}>
            <h1>Chính sách bảo mật</h1>
            
            <p>
                TAIKHOANXIN.COM cam kết bảo vệ thông tin cá nhân của khách hàng. 
                Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn.
            </p>

            <h2>Thông tin chúng tôi thu thập</h2>

            <div className={styles.productCategories}>
                <div className={styles.category}>
                    <h4>👤 Thông tin cá nhân</h4>
                    <ul>
                        <li>Họ tên</li>
                        <li>Email</li>
                        <li>Số điện thoại</li>
                        <li>Địa chỉ</li>
                        <li>Ngày sinh (tùy chọn)</li>
                    </ul>
                </div>

                <div className={styles.category}>
                    <h4>💳 Thông tin thanh toán</h4>
                    <ul>
                        <li>Phương thức thanh toán</li>
                        <li>Lịch sử giao dịch</li>
                        <li>Thông tin hóa đơn</li>
                    </ul>
                </div>

                <div className={styles.category}>
                    <h4>🛒 Thông tin mua sắm</h4>
                    <ul>
                        <li>Lịch sử đơn hàng</li>
                        <li>Sản phẩm yêu thích</li>
                        <li>Giỏ hàng</li>
                        <li>Đánh giá sản phẩm</li>
                    </ul>
                </div>

                <div className={styles.category}>
                    <h4>📊 Dữ liệu kỹ thuật</h4>
                    <ul>
                        <li>Địa chỉ IP</li>
                        <li>Loại trình duyệt</li>
                        <li>Thiết bị sử dụng</li>
                        <li>Cookies</li>
                    </ul>
                </div>
            </div>

            <h2>Mục đích sử dụng thông tin</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Xử lý đơn hàng</h3>
                        <ul>
                            <li>Xác nhận và giao hàng</li>
                            <li>Xử lý thanh toán</li>
                            <li>Gửi thông báo đơn hàng</li>
                            <li>Hỗ trợ khách hàng</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Cải thiện dịch vụ</h3>
                        <ul>
                            <li>Phân tích hành vi người dùng</li>
                            <li>Cá nhân hóa trải nghiệm</li>
                            <li>Đề xuất sản phẩm phù hợp</li>
                            <li>Tối ưu hóa website</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Marketing & Khuyến mãi</h3>
                        <ul>
                            <li>Gửi email khuyến mãi</li>
                            <li>Thông báo sản phẩm mới</li>
                            <li>Chương trình ưu đãi</li>
                            <li>Tin tức và cập nhật</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>4</div>
                    <div className={styles.stepContent}>
                        <h3>Bảo mật & Tuân thủ</h3>
                        <ul>
                            <li>Phát hiện gian lận</li>
                            <li>Ngăn chặn spam</li>
                            <li>Tuân thủ pháp luật</li>
                            <li>Giải quyết tranh chấp</li>
                        </ul>
                    </div>
                </div>
            </div>

            <h2>Cách chúng tôi bảo vệ thông tin</h2>

            <div className={styles.highlightBox}>
                <p>
                    <strong>🔒 Biện pháp bảo mật</strong>
                </p>
                <ul>
                    <li><strong>Mã hóa SSL/TLS:</strong> Tất cả dữ liệu truyền tải được mã hóa</li>
                    <li><strong>Firewall:</strong> Hệ thống tường lửa bảo vệ máy chủ</li>
                    <li><strong>Xác thực 2 lớp:</strong> Bảo vệ tài khoản khách hàng</li>
                    <li><strong>Sao lưu định kỳ:</strong> Dữ liệu được backup thường xuyên</li>
                    <li><strong>Giám sát 24/7:</strong> Phát hiện và ngăn chặn xâm nhập</li>
                    <li><strong>Đào tạo nhân viên:</strong> Nhân viên được đào tạo về bảo mật</li>
                </ul>
            </div>

            <h2>Chia sẻ thông tin với bên thứ ba</h2>

            <div className={styles.troubleshootBox}>
                <h3>Chúng tôi chỉ chia sẻ thông tin khi:</h3>
                
                <div className={styles.troubleshootItem}>
                    <h4>✅ Đối tác thanh toán</h4>
                    <p>
                        Chia sẻ thông tin cần thiết với cổng thanh toán (VNPay, Momo, ZaloPay) 
                        để xử lý giao dịch. Họ tuân thủ chuẩn bảo mật PCI DSS.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>✅ Nhà cung cấp dịch vụ</h4>
                    <p>
                        Chia sẻ với đối tác giao hàng, email marketing, phân tích dữ liệu 
                        để cung cấp dịch vụ tốt hơn. Họ ký hợp đồng bảo mật.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>✅ Yêu cầu pháp lý</h4>
                    <p>
                        Cung cấp thông tin khi có yêu cầu từ cơ quan chức năng theo quy định pháp luật, 
                        lệnh tòa án hoặc quy trình pháp lý.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>❌ KHÔNG bán thông tin</h4>
                    <p>
                        Chúng tôi KHÔNG BAO GIỜ bán, cho thuê hoặc trao đổi thông tin cá nhân 
                        của khách hàng cho bên thứ ba vì mục đích thương mại.
                    </p>
                </div>
            </div>

            <h2>Quyền của khách hàng</h2>

            <div className={styles.productCategories}>
                <div className={styles.category}>
                    <h4>👁️ Quyền truy cập</h4>
                    <p>
                        Bạn có quyền xem và tải xuống 
                        tất cả thông tin cá nhân mà chúng tôi 
                        lưu trữ về bạn.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>✏️ Quyền chỉnh sửa</h4>
                    <p>
                        Bạn có thể cập nhật, sửa đổi 
                        thông tin cá nhân bất cứ lúc nào 
                        trong tài khoản.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>🗑️ Quyền xóa</h4>
                    <p>
                        Bạn có quyền yêu cầu xóa tài khoản 
                        và dữ liệu cá nhân (trừ dữ liệu 
                        pháp lý bắt buộc).
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>🚫 Quyền từ chối</h4>
                    <p>
                        Bạn có thể từ chối nhận email 
                        marketing, thông báo khuyến mãi 
                        bất cứ lúc nào.
                    </p>
                </div>
            </div>

            <h2>Cookies và công nghệ theo dõi</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>🍪</div>
                    <div className={styles.stepContent}>
                        <h3>Cookies cần thiết</h3>
                        <p>
                            Cookies bắt buộc để website hoạt động:
                        </p>
                        <ul>
                            <li>Duy trì phiên đăng nhập</li>
                            <li>Lưu giỏ hàng</li>
                            <li>Cài đặt ngôn ngữ</li>
                            <li>Bảo mật tài khoản</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>📊</div>
                    <div className={styles.stepContent}>
                        <h3>Cookies phân tích</h3>
                        <p>
                            Giúp chúng tôi hiểu cách bạn sử dụng website:
                        </p>
                        <ul>
                            <li>Google Analytics</li>
                            <li>Thống kê lượt truy cập</li>
                            <li>Hành vi người dùng</li>
                            <li>Tối ưu hóa trải nghiệm</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>🎯</div>
                    <div className={styles.stepContent}>
                        <h3>Cookies marketing</h3>
                        <p>
                            Cá nhân hóa quảng cáo và nội dung:
                        </p>
                        <ul>
                            <li>Facebook Pixel</li>
                            <li>Google Ads</li>
                            <li>Remarketing</li>
                            <li>Đề xuất sản phẩm</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className={styles.warningBox}>
                <p>
                    <strong>⚙️ Quản lý Cookies</strong>
                </p>
                <p>
                    Bạn có thể tắt cookies trong cài đặt trình duyệt. Tuy nhiên, 
                    điều này có thể ảnh hưởng đến trải nghiệm sử dụng website.
                </p>
            </div>

            <h2>Bảo mật tài khoản</h2>

            <div className={styles.highlightBox}>
                <p>
                    <strong>🔐 Khuyến nghị bảo mật</strong>
                </p>
                <ul>
                    <li>Sử dụng mật khẩu mạnh (ít nhất 8 ký tự, có chữ hoa, số, ký tự đặc biệt)</li>
                    <li>Không chia sẻ mật khẩu với người khác</li>
                    <li>Bật xác thực 2 lớp (2FA) để tăng cường bảo mật</li>
                    <li>Đăng xuất sau khi sử dụng trên thiết bị chung</li>
                    <li>Cập nhật mật khẩu định kỳ (3-6 tháng/lần)</li>
                    <li>Kiểm tra hoạt động đăng nhập thường xuyên</li>
                    <li>Cảnh giác với email giả mạo (phishing)</li>
                </ul>
            </div>

            <h2>Lưu trữ và xóa dữ liệu</h2>

            <div className={styles.troubleshootBox}>
                <h3>Thời gian lưu trữ:</h3>
                
                <div className={styles.troubleshootItem}>
                    <h4>📅 Dữ liệu tài khoản</h4>
                    <p>
                        Lưu trữ cho đến khi bạn yêu cầu xóa tài khoản. 
                        Sau khi xóa, dữ liệu sẽ bị xóa vĩnh viễn trong 30 ngày.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>🧾 Dữ liệu giao dịch</h4>
                    <p>
                        Lưu trữ tối thiểu 5 năm theo quy định pháp luật về kế toán và thuế. 
                        Không thể xóa trước thời hạn này.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>📧 Dữ liệu marketing</h4>
                    <p>
                        Lưu trữ cho đến khi bạn hủy đăng ký nhận email. 
                        Sau khi hủy, dữ liệu sẽ bị xóa trong 7 ngày.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>🍪 Cookies</h4>
                    <p>
                        Cookies phiên: Xóa khi đóng trình duyệt. 
                        Cookies lâu dài: Hết hạn sau 1-2 năm hoặc khi bạn xóa.
                    </p>
                </div>
            </div>

            <h2>Quyền riêng tư trẻ em</h2>

            <div className={styles.warningBox}>
                <p>
                    <strong>👶 Bảo vệ trẻ em</strong>
                </p>
                <p>
                    Website của chúng tôi không dành cho trẻ em dưới 16 tuổi. 
                    Chúng tôi không cố ý thu thập thông tin cá nhân từ trẻ em. 
                    Nếu bạn là phụ huynh và phát hiện con bạn đã cung cấp thông tin, 
                    vui lòng liên hệ để chúng tôi xóa dữ liệu.
                </p>
            </div>

            <h2>Thay đổi chính sách</h2>

            <div className={styles.highlightBox}>
                <p>
                    <strong>📝 Cập nhật chính sách</strong>
                </p>
                <p>
                    Chúng tôi có thể cập nhật chính sách bảo mật theo thời gian. 
                    Mọi thay đổi quan trọng sẽ được thông báo qua:
                </p>
                <ul>
                    <li>Email đến tất cả khách hàng</li>
                    <li>Thông báo trên website</li>
                    <li>Pop-up khi đăng nhập</li>
                </ul>
                <p style={{ marginTop: '12px' }}>
                    Ngày cập nhật gần nhất: <strong>16/11/2025</strong>
                </p>
            </div>

            <h2>Liên hệ về bảo mật</h2>

            <div className={styles.troubleshootBox}>
                <h3>Nếu bạn có thắc mắc về bảo mật:</h3>
                
                <div className={styles.troubleshootItem}>
                    <h4>📧 Email</h4>
                    <p>
                        <strong>privacy@taikhoanxin.com</strong><br />
                        Gửi câu hỏi về chính sách bảo mật, yêu cầu xóa dữ liệu, 
                        hoặc báo cáo vấn đề bảo mật.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>💬 Live Chat</h4>
                    <p>
                        Chat trực tiếp với bộ phận CSKH để được hỗ trợ ngay lập tức 
                        về các vấn đề liên quan đến bảo mật tài khoản.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>📞 Hotline</h4>
                    <p>
                        <strong>1900 xxxx</strong> (8:00 - 22:00 hàng ngày)<br />
                        Gọi để được tư vấn trực tiếp về bảo mật và quyền riêng tư.
                    </p>
                </div>
            </div>

            <h2>Câu hỏi thường gặp</h2>

            <div className={styles.troubleshootBox}>
                <h3>FAQ về bảo mật:</h3>
                
                <div className={styles.troubleshootItem}>
                    <h4>❓ Thông tin của tôi có an toàn không?</h4>
                    <p>
                        Có. Chúng tôi sử dụng mã hóa SSL, firewall, và các biện pháp bảo mật 
                        tiên tiến để bảo vệ dữ liệu của bạn.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>🗑️ Làm sao để xóa tài khoản?</h4>
                    <p>
                        Vào Cài đặt tài khoản → Bảo mật → Xóa tài khoản. 
                        Hoặc liên hệ CSKH để được hỗ trợ.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>📧 Làm sao để ngừng nhận email marketing?</h4>
                    <p>
                        Click "Hủy đăng ký" ở cuối email, hoặc vào Cài đặt → 
                        Thông báo → Tắt email marketing.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>🔍 Tôi có thể xem dữ liệu của mình không?</h4>
                    <p>
                        Có. Vào Cài đặt → Quyền riêng tư → Tải xuống dữ liệu. 
                        Chúng tôi sẽ gửi file trong 48 giờ.
                    </p>
                </div>
            </div>

            <div className={styles.contactLink}>
                <p style={{ marginBottom: '16px', fontSize: '16px', color: 'var(--text-color)' }}>
                    Có thắc mắc về chính sách bảo mật? Liên hệ với chúng tôi!
                </p>
                <a href="/contact" className={styles.contactButton}>
                    💬 Chat với CSKH
                </a>
            </div>
        </div>
    );
}
