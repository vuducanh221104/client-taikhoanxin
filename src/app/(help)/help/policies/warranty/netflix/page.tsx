import { Metadata } from 'next';
import Image from 'next/image';
import styles from '../../../page.module.scss';

export const metadata: Metadata = {
    title: 'Chính Sách Bảo Hành Netflix',
    description: 'Chính sách bảo hành tài khoản Netflix tại TAIKHOANXIN.COM',
};

export default function NetflixWarrantyPage() {
    return (
        <div className={styles.helpContent}>
            <h1>Chính sách bảo hành Netflix</h1>

            <div style={{ margin: '32px 0', textAlign: 'center' }}>
                <Image
                    src="/help/warranty/netflix-banner.png"
                    alt="Chính sách bảo hành Netflix"
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
                    <strong>Ví Dụ:</strong> Sản phẩm <em>Tài khoản Netflix Premium for 1 User (1 Tháng)</em> sẽ có thời gian bảo hành là 1 tháng (30 ngày)
                </p>
            </div>

            <h2>Chính sách bảo hành</h2>

            <div className={styles.highlightBox}>
                <p><strong>✅ Điều kiện bảo hành</strong></p>
                <ul>
                    <li>Tài khoản phát sinh lỗi trong quá trình sử dụng sẽ được khắc phục sự cố trong 24h</li>
                    <li>Khách hàng được cung cấp tài khoản thay thế sử dụng tạm thời trong thời gian chờ fix lỗi</li>
                </ul>
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
                    Sản phẩm <strong>Tài khoản Netflix Premium for 1 User (1 Tháng)</strong> giá tại thời điểm khách hàng mua là 99.000 đ. 
                    Sử dụng được 12 ngày thì phát sinh lỗi. Như vậy số tiền được hoàn lại sẽ là:
                </p>
                <div style={{ 
                    background: 'var(--background-tertiary)', 
                    padding: '16px', 
                    borderRadius: '4px',
                    margin: '16px 0',
                    fontFamily: 'monospace',
                    fontSize: '14px'
                }}>
                    99.000 * (30 - 12)/30 = 59.400 làm tròn thành 60.000
                </div>
                <p>
                    Như vậy trong trường hợp này khách hàng sẽ được hoàn lại 60.000đ về tài khoản ngân hàng
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

            <h2>Lưu ý quan trọng</h2>

            <div className={styles.warningBox}>
                <p><strong>⚠️ Điều khoản sử dụng</strong></p>
                <ul>
                    <li>Không tự ý thay đổi mật khẩu tài khoản</li>
                    <li>Không chia sẻ tài khoản cho người khác</li>
                    <li>Sử dụng đúng gói đã mua (số màn hình, chất lượng)</li>
                    <li>Báo lỗi ngay khi phát hiện sự cố</li>
                    <li>Không vi phạm điều khoản sử dụng của Netflix</li>
                </ul>
            </div>

            <div className={styles.contactLink}>
                <p style={{ marginBottom: '16px', fontSize: '16px', color: 'var(--text-color)' }}>
                    Cần hỗ trợ bảo hành Netflix? Liên hệ ngay với chúng tôi!
                </p>
                <a href="/contact" className={styles.contactButton}>
                    💬 Chat với CSKH
                </a>
            </div>
        </div>
    );
}
