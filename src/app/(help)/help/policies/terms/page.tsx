import { Metadata } from 'next';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'Điều Khoản Sử Dụng',
    description: 'Điều khoản và điều kiện sử dụng dịch vụ tại TAIKHOANXIN.COM',
};

export default function TermsPage() {
    return (
        <div className={styles.helpContent}>
            <h1>Điều khoản sử dụng</h1>
            
            <p>
                Chào mừng bạn đến với TAIKHOANXIN.COM. Bằng việc sử dụng website và dịch vụ của chúng tôi, 
                bạn đồng ý tuân thủ các điều khoản và điều kiện dưới đây.
            </p>

            <h2>1. Chấp nhận điều khoản</h2>

            <div className={styles.highlightBox}>
                <p>
                    <strong>📜 Cam kết của bạn</strong>
                </p>
                <p>
                    Khi sử dụng TAIKHOANXIN.COM, bạn xác nhận rằng:
                </p>
                <ul>
                    <li>Bạn đã đọc và hiểu các điều khoản này</li>
                    <li>Bạn đồng ý tuân thủ tất cả các quy định</li>
                    <li>Bạn đủ 16 tuổi trở lên hoặc có sự đồng ý của phụ huynh</li>
                    <li>Thông tin bạn cung cấp là chính xác và trung thực</li>
                    <li>Bạn chịu trách nhiệm về mọi hoạt động trên tài khoản của mình</li>
                </ul>
            </div>

            <h2>2. Tài khoản người dùng</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Đăng ký tài khoản</h3>
                        <ul>
                            <li>Cung cấp thông tin chính xác</li>
                            <li>Sử dụng email hợp lệ</li>
                            <li>Tạo mật khẩu mạnh</li>
                            <li>Xác thực tài khoản qua email</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Bảo mật tài khoản</h3>
                        <ul>
                            <li>Giữ bí mật thông tin đăng nhập</li>
                            <li>Không chia sẻ tài khoản</li>
                            <li>Thông báo ngay nếu bị xâm nhập</li>
                            <li>Đăng xuất sau khi sử dụng</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Trách nhiệm người dùng</h3>
                        <ul>
                            <li>Cập nhật thông tin khi thay đổi</li>
                            <li>Chịu trách nhiệm về hoạt động tài khoản</li>
                            <li>Tuân thủ quy định sử dụng</li>
                            <li>Không lạm dụng dịch vụ</li>
                        </ul>
                    </div>
                </div>
            </div>

            <h2>3. Sử dụng dịch vụ</h2>

            <div className={styles.productCategories}>
                <div className={styles.category}>
                    <h4>✅ Được phép</h4>
                    <ul>
                        <li>Mua sản phẩm cho mục đích cá nhân</li>
                        <li>Sử dụng sản phẩm theo đúng mục đích</li>
                        <li>Đánh giá và phản hồi trung thực</li>
                        <li>Liên hệ CSKH khi cần hỗ trợ</li>
                    </ul>
                </div>

                <div className={styles.category}>
                    <h4>❌ Không được phép</h4>
                    <ul>
                        <li>Mua để bán lại (resell)</li>
                        <li>Sử dụng bot, script tự động</li>
                        <li>Gian lận, lừa đảo</li>
                        <li>Spam, quấy rối người khác</li>
                    </ul>
                </div>

                <div className={styles.category}>
                    <h4>⚠️ Hạn chế</h4>
                    <ul>
                        <li>Giới hạn số lượng mua/ngày</li>
                        <li>Không hoàn tiền sau khi sử dụng</li>
                        <li>Tuân thủ điều khoản nhà cung cấp</li>
                        <li>Không chia sẻ tài khoản mua</li>
                    </ul>
                </div>

                <div className={styles.category}>
                    <h4>🚫 Vi phạm nghiêm trọng</h4>
                    <ul>
                        <li>Hack, xâm nhập hệ thống</li>
                        <li>Phát tán virus, malware</li>
                        <li>Giả mạo, lừa đảo</li>
                        <li>Vi phạm pháp luật</li>
                    </ul>
                </div>
            </div>

            <h2>4. Sản phẩm và dịch vụ</h2>

            <div className={styles.troubleshootBox}>
                <h3>Quy định về sản phẩm:</h3>
                
                <div className={styles.troubleshootItem}>
                    <h4>🎮 Sản phẩm số</h4>
                    <p>
                        Tất cả sản phẩm là hàng số (digital goods), không thể hoàn trả sau khi đã sử dụng/kích hoạt. 
                        Vui lòng kiểm tra kỹ trước khi mua.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>📝 Bản quyền</h4>
                    <p>
                        Sản phẩm được bán là bản quyền hợp pháp từ nhà phát hành. 
                        Bạn chỉ được quyền sử dụng cá nhân, không được phân phối lại.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>⏰ Thời hạn sử dụng</h4>
                    <p>
                        Một số sản phẩm có thời hạn sử dụng (subscription). 
                        Sau khi hết hạn, bạn cần gia hạn để tiếp tục sử dụng.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>🔄 Cập nhật sản phẩm</h4>
                    <p>
                        Chúng tôi có quyền thay đổi giá, ngừng cung cấp sản phẩm, 
                        hoặc cập nhật điều khoản mà không cần thông báo trước.
                    </p>
                </div>
            </div>

            <h2>5. Thanh toán và hoàn tiền</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>💳</div>
                    <div className={styles.stepContent}>
                        <h3>Phương thức thanh toán</h3>
                        <ul>
                            <li>Chuyển khoản ngân hàng</li>
                            <li>Ví điện tử (Momo, ZaloPay, VNPay)</li>
                            <li>Thẻ tín dụng/ghi nợ</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>💰</div>
                    <div className={styles.stepContent}>
                        <h3>Chính sách giá</h3>
                        <ul>
                            <li>Giá có thể thay đổi bất cứ lúc nào</li>
                            <li>Giá đã thanh toán không thay đổi</li>
                            <li>Không hoàn chênh lệch nếu giảm giá</li>
                            <li>Thuế VAT đã bao gồm (nếu có)</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>🔄</div>
                    <div className={styles.stepContent}>
                        <h3>Hoàn tiền</h3>
                        <ul>
                            <li>Theo chính sách đổi trả</li>
                            <li>Xử lý trong 1-7 ngày</li>
                            <li>Có thể có phí xử lý</li>
                            <li>Không hoàn tiền sản phẩm đã dùng</li>
                        </ul>
                    </div>
                </div>
            </div>

            <h2>6. Quyền sở hữu trí tuệ</h2>

            <div className={styles.warningBox}>
                <p>
                    <strong>© Bản quyền</strong>
                </p>
                <ul>
                    <li>Tất cả nội dung trên website (logo, hình ảnh, văn bản) thuộc quyền sở hữu của TAIKHOANXIN.COM</li>
                    <li>Không được sao chép, phân phối, hoặc sử dụng cho mục đích thương mại</li>
                    <li>Sản phẩm bán ra thuộc bản quyền của nhà phát hành gốc</li>
                    <li>Vi phạm bản quyền sẽ bị xử lý theo pháp luật</li>
                </ul>
            </div>

            <h2>7. Giới hạn trách nhiệm</h2>

            <div className={styles.troubleshootBox}>
                <h3>Chúng tôi không chịu trách nhiệm cho:</h3>
                
                <div className={styles.troubleshootItem}>
                    <h4>🚫 Lỗi từ bên thứ ba</h4>
                    <p>
                        Lỗi từ nhà cung cấp sản phẩm, cổng thanh toán, hoặc dịch vụ bên ngoài 
                        nằm ngoài tầm kiểm soát của chúng tôi.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>💔 Sử dụng sai mục đích</h4>
                    <p>
                        Thiệt hại phát sinh do bạn sử dụng sản phẩm sai mục đích, 
                        vi phạm điều khoản nhà cung cấp, hoặc pháp luật.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>🔒 Mất mát dữ liệu</h4>
                    <p>
                        Mất mát dữ liệu do bạn không sao lưu, quên mật khẩu, 
                        hoặc chia sẻ tài khoản cho người khác.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>⚡ Gián đoạn dịch vụ</h4>
                    <p>
                        Gián đoạn do bảo trì, nâng cấp hệ thống, sự cố kỹ thuật, 
                        hoặc các yếu tố bất khả kháng.
                    </p>
                </div>
            </div>

            <h2>8. Chấm dứt dịch vụ</h2>

            <div className={styles.warningBox}>
                <p>
                    <strong>⚠️ Chúng tôi có quyền</strong>
                </p>
                <ul>
                    <li>Tạm khóa hoặc xóa tài khoản vi phạm điều khoản</li>
                    <li>Từ chối cung cấp dịch vụ cho bất kỳ ai</li>
                    <li>Hủy đơn hàng đáng ngờ hoặc gian lận</li>
                    <li>Thay đổi, tạm ngừng hoặc chấm dứt dịch vụ bất cứ lúc nào</li>
                    <li>Không hoàn tiền nếu tài khoản bị khóa do vi phạm</li>
                </ul>
            </div>

            <h2>9. Luật áp dụng</h2>

            <div className={styles.highlightBox}>
                <p>
                    <strong>⚖️ Quy định pháp lý</strong>
                </p>
                <p>
                    Điều khoản này được điều chỉnh bởi pháp luật Việt Nam. 
                    Mọi tranh chấp sẽ được giải quyết tại tòa án có thẩm quyền tại Việt Nam.
                </p>
            </div>

            <h2>10. Thay đổi điều khoản</h2>

            <div className={styles.highlightBox}>
                <p>
                    <strong>📝 Cập nhật</strong>
                </p>
                <p>
                    Chúng tôi có quyền thay đổi điều khoản bất cứ lúc nào. 
                    Thay đổi có hiệu lực ngay khi đăng tải trên website. 
                    Việc bạn tiếp tục sử dụng dịch vụ sau khi thay đổi đồng nghĩa với việc chấp nhận điều khoản mới.
                </p>
                <p style={{ marginTop: '12px' }}>
                    Ngày cập nhật: <strong>16/11/2025</strong>
                </p>
            </div>

            <h2>11. Liên hệ</h2>

            <div className={styles.troubleshootBox}>
                <h3>Nếu bạn có câu hỏi về điều khoản:</h3>
                
                <div className={styles.troubleshootItem}>
                    <h4>📧 Email</h4>
                    <p>
                        <strong>support@taikhoanxin.com</strong><br />
                        Gửi câu hỏi về điều khoản sử dụng, quyền và nghĩa vụ của bạn.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>💬 Live Chat</h4>
                    <p>
                        Chat trực tiếp với CSKH để được giải đáp thắc mắc ngay lập tức.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>📞 Hotline</h4>
                    <p>
                        <strong>1900 xxxx</strong> (8:00 - 22:00 hàng ngày)<br />
                        Gọi để được tư vấn chi tiết về điều khoản và chính sách.
                    </p>
                </div>
            </div>

            <div className={styles.contactLink}>
                <p style={{ marginBottom: '16px', fontSize: '16px', color: 'var(--text-color)' }}>
                    Cần hỗ trợ thêm? Chúng tôi luôn sẵn sàng giúp đỡ!
                </p>
                <a href="/contact" className={styles.contactButton}>
                    💬 Chat với CSKH
                </a>
            </div>
        </div>
    );
}
