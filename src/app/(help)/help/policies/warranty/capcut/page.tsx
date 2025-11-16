import { Metadata } from 'next';
import Image from 'next/image';
import styles from '../../../page.module.scss';

export const metadata: Metadata = {
    title: 'Chính Sách Bảo Hành CapCut Pro',
    description: 'Chính sách bảo hành tài khoản CapCut Pro tại TAIKHOANXIN.COM',
};

export default function CapCutWarrantyPage() {
    return (
        <div className={styles.helpContent}>
            <h1>Chính sách bảo hành CapCut Pro</h1>

            <div style={{ margin: '32px 0', textAlign: 'center' }}>
                <Image
                    src="/help/warranty/capcut-banner.png"
                    alt="Chính sách bảo hành CapCut Pro"
                    width={800}
                    height={400}
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                    priority
                />
            </div>

            <h2>Thời gian bảo hành</h2>

            <div className={styles.highlightBox}>
                <p><strong>⏰ Thời gian bảo hành</strong></p>
                <p>Thời gian bảo hành tương ứng với thời hạn gói cước khách mua.</p>
                <p style={{ marginTop: '12px' }}>
                    <strong>Ví Dụ:</strong> Sản phẩm <em>Tài khoản CapCut Pro (1 Tháng)</em> sẽ có thời gian bảo hành là 1 tháng (30 ngày)
                </p>
            </div>

            <h2>Chính sách bảo hành</h2>

            <div className={styles.highlightBox}>
                <p><strong>✅ Điều kiện bảo hành</strong></p>
                <ul>
                    <li>Tài khoản phát sinh lỗi trong quá trình sử dụng sẽ được khắc phục sự cố trong 24h</li>
                    <li>Khách hàng được cung cấp tài khoản thay thế sử dụng tạm thời trong thời gian chờ fix lỗi</li>
                    <li>Bảo hành tính năng Pro: xuất video 4K, không watermark, hiệu ứng AI</li>
                    <li>Hỗ trợ khi tài khoản bị hạ cấp về Free hoặc mất quyền Pro</li>
                </ul>
            </div>

            <h2>Các trường hợp được bảo hành</h2>

            <div className={styles.productCategories}>
                <div className={styles.category}>
                    <h4>🔐 Lỗi đăng nhập</h4>
                    <p>
                        Không thể đăng nhập vào tài khoản do lỗi mật khẩu, 
                        tài khoản bị khóa hoặc lỗi hệ thống.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>⬇️ Mất quyền Pro</h4>
                    <p>
                        Tài khoản bị hạ cấp về Free, mất tính năng xuất 4K, 
                        xuất video có watermark.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>⏰ Hết hạn sớm</h4>
                    <p>
                        Tài khoản hết hạn Pro trước thời gian cam kết 
                        do lỗi từ nhà cung cấp.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>🚫 Tính năng không hoạt động</h4>
                    <p>
                        Các tính năng Pro như Auto Captions, Background Removal, 
                        hiệu ứng AI không sử dụng được.
                    </p>
                </div>
            </div>

            <h2>Chính sách hoàn tiền</h2>

            <div className={styles.highlightBox}>
                <p><strong>💰 Quy định hoàn tiền</strong></p>
                <ul>
                    <li>Khách hàng sẽ được hoàn tiền trong trường hợp sự cố không thể khắc phục.</li>
                    <li>Số tiền hoàn lại sẽ được tính theo quy tắc:
                        <ul style={{ marginTop: '8px' }}>
                            <li><strong>Sử dụng không quá 5 ngày:</strong> Hoàn 100% số tiền (*)</li>
                            <li><strong>Sử dụng trên 5 ngày:</strong> Hoàn tiền theo số ngày chưa sử dụng (Làm tròn đến hàng nghìn)</li>
                        </ul>
                    </li>
                    <li>Số tiền hoàn lại sẽ được chuyển về tài khoản ngân hàng của khách hàng trong 1-3 ngày làm việc.</li>
                </ul>
            </div>

            <h2>Ví dụ tính hoàn tiền</h2>

            <div style={{ 
                background: 'var(--background-secondary)', 
                padding: '20px', 
                borderRadius: '8px',
                margin: '20px 0',
                border: '1px solid var(--border-color)'
            }}>
                <p><strong>📌 Ví dụ:</strong></p>
                <p style={{ marginTop: '12px' }}>
                    Sản phẩm <strong>Tài khoản CapCut Pro (1 Tháng)</strong> giá tại thời điểm khách hàng mua là 79.000 đ. 
                    Sử dụng được 10 ngày thì phát sinh lỗi. Như vậy số tiền được hoàn lại sẽ là:
                </p>
                <div style={{ 
                    background: 'var(--background-tertiary)', 
                    padding: '16px', 
                    borderRadius: '4px',
                    margin: '16px 0',
                    fontFamily: 'monospace',
                    fontSize: '14px'
                }}>
                    79.000 * (30 - 10)/30 = 52.666 làm tròn thành 53.000
                </div>
                <p>
                    Như vậy trong trường hợp này khách hàng sẽ được hoàn lại 53.000đ về tài khoản ngân hàng
                </p>
            </div>

            <div style={{ 
                background: 'var(--background-secondary)', 
                padding: '20px', 
                borderRadius: '8px',
                margin: '20px 0',
                fontStyle: 'italic',
                color: 'var(--text-secondary)',
                borderLeft: '4px solid var(--primary-color)'
            }}>
                <p>
                    <strong>(*)</strong> <em>Số tiền phát sinh mua hàng tại thời điểm khách mua hàng, sau khi đã trừ mã giảm giá, mã giới thiệu, tiền hoàn khách VIP (nếu có)</em>
                </p>
            </div>

            <h2>Quy trình yêu cầu bảo hành</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Liên hệ CSKH</h3>
                        <p>Liên hệ qua Zalo, email hoặc live chat trên website</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Cung cấp thông tin</h3>
                        <p>Mã đơn hàng, email đăng ký, mô tả lỗi và ảnh chụp màn hình</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Kiểm tra và xác minh</h3>
                        <p>Bộ phận kỹ thuật kiểm tra và xác nhận lỗi</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>4</div>
                    <div className={styles.stepContent}>
                        <h3>Xử lý bảo hành</h3>
                        <p>Khắc phục lỗi hoặc đổi tài khoản mới trong 1-24 giờ</p>
                    </div>
                </div>
            </div>

            <h2>Lưu ý quan trọng</h2>

            <div className={styles.warningBox}>
                <p><strong>⚠️ Điều khoản sử dụng</strong></p>
                <ul>
                    <li>Không tự ý thay đổi mật khẩu hoặc email tài khoản</li>
                    <li>Không chia sẻ tài khoản cho người khác</li>
                    <li>Sử dụng trên tối đa 2 thiết bị cùng lúc</li>
                    <li>Không xuất quá nhiều video 4K trong thời gian ngắn</li>
                    <li>Báo lỗi ngay khi phát hiện sự cố</li>
                    <li>Không vi phạm điều khoản sử dụng của CapCut</li>
                    <li>Không sử dụng cho mục đích thương mại quy mô lớn</li>
                </ul>
            </div>

            <h2>Không được bảo hành</h2>

            <div className={styles.warningBox}>
                <p><strong>❌ Các trường hợp KHÔNG được bảo hành</strong></p>
                <ul>
                    <li>Tự ý thay đổi thông tin tài khoản</li>
                    <li>Chia sẻ tài khoản cho nhiều người sử dụng</li>
                    <li>Đăng nhập quá số thiết bị cho phép</li>
                    <li>Vi phạm chính sách sử dụng của CapCut</li>
                    <li>Sử dụng VPN không được phép</li>
                    <li>Hết thời gian bảo hành</li>
                    <li>Không cung cấp được thông tin đơn hàng</li>
                </ul>
            </div>

            <div className={styles.contactLink}>
                <p style={{ marginBottom: '16px', fontSize: '16px', color: 'var(--text-color)' }}>
                    Cần hỗ trợ bảo hành CapCut Pro? Liên hệ ngay với chúng tôi!
                </p>
                <a href="/contact" className={styles.contactButton}>
                    💬 Chat với CSKH
                </a>
            </div>
        </div>
    );
}
