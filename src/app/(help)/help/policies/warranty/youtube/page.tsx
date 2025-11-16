import { Metadata } from 'next';
import Image from 'next/image';
import styles from '../../../page.module.scss';

export const metadata: Metadata = {
    title: 'Chính Sách Bảo Hành Youtube',
    description: 'Chính sách bảo hành tài khoản Youtube Premium tại TAIKHOANXIN.COM',
};

export default function YoutubeWarrantyPage() {
    return (
        <div className={styles.helpContent}>
            <h1>Chính sách bảo hành Youtube</h1>

            <div style={{ margin: '32px 0', textAlign: 'center' }}>
                <Image
                    src="/help/warranty/youtube-banner.png"
                    alt="Chính sách bảo hành Youtube"
                    width={800}
                    height={400}
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                    priority
                />
            </div>

            <h2>Thời gian bảo hành</h2>

            <div className={styles.highlightBox}>
                <p><strong>⏰ Thời gian bảo hành</strong></p>
                <p>Thời gian bảo hành tương ứng với thời hạn gói cước của sản phẩm khách mua</p>
                <p style={{ marginTop: '12px' }}><strong>Ví dụ:</strong></p>
                <ul>
                    <li>Gia hạn Youtube Premium (6 tháng): 06 tháng</li>
                    <li>Gia hạn Youtube Premium (1 Năm): 12 tháng</li>
                    <li>...</li>
                </ul>
            </div>

            <h2>Chính sách bảo hành</h2>

            <div className={styles.highlightBox}>
                <p><strong>✅ Điều kiện bảo hành</strong></p>
                <p>Sản phẩm phát sinh lỗi trong quá trình sử dụng sẽ được khắc phục sự cố trong 12h</p>
            </div>

            <h2>Chính sách hoàn tiền</h2>

            <div className={styles.highlightBox}>
                <p><strong>💰 Quy định hoàn tiền</strong></p>
                <p>Khách hàng sẽ được hoàn tiền trong trường hợp sự cố không thể khắc phục.</p>
                <p style={{ marginTop: '12px' }}><strong>Số tiền hoàn lại sẽ được tính theo quy tắc</strong></p>
                <ul>
                    <li>Hoàn 100% số tiền (*) nếu khách hàng sử dụng sản phẩm chưa quá
                        <ul style={{ marginTop: '8px' }}>
                            <li><strong>15 ngày</strong> đối với sản phẩm có thời hạn từ 6 tháng.</li>
                            <li><strong>7 ngày</strong> đối với các sản phẩm còn lại.</li>
                        </ul>
                    </li>
                    <li>Hoàn tiền theo thời gian sử dụng nếu khách đã sử dụng quá thời gian nêu trên. (**)</li>
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
                    Sản phẩm <strong>Gia hạn Youtube Premium (1 Năm)</strong> giá tại thời điểm khách hàng mua là 359.000 đ. 
                    Sử dụng được 100 ngày thì phát sinh lỗi. Như vậy số tiền được hoàn lại sẽ là:
                </p>
                <div style={{ 
                    background: 'var(--background-tertiary)', 
                    padding: '16px', 
                    borderRadius: '4px',
                    margin: '16px 0',
                    fontFamily: 'monospace',
                    fontSize: '14px'
                }}>
                    359.000 * (365 - 100)/365 = 260.643 làm tròn thành 261.000
                </div>
                <p>
                    Như vậy trong trường hợp này khách hàng sẽ được hoàn lại 261.000đ về tài khoản ngân hàng.
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
                <p style={{ marginTop: '12px' }}>
                    <strong>(**)</strong> <em>Số tiền sẽ được làm tròn đến hàng nghìn</em>
                </p>
            </div>

            <h2>Tính năng Youtube Premium</h2>

            <div className={styles.highlightBox}>
                <p><strong>🎯 Quyền lợi Premium</strong></p>
                <ul>
                    <li>Xem video không quảng cáo</li>
                    <li>Tải video xem offline</li>
                    <li>Phát video khi tắt màn hình</li>
                    <li>Truy cập Youtube Music Premium</li>
                    <li>Xem Youtube Originals</li>
                </ul>
            </div>

            <h2>Lưu ý quan trọng</h2>

            <div className={styles.warningBox}>
                <p><strong>⚠️ Điều khoản sử dụng</strong></p>
                <ul>
                    <li>Không tự ý thay đổi mật khẩu tài khoản</li>
                    <li>Không chia sẻ tài khoản cho người khác</li>
                    <li>Sử dụng đúng khu vực đã mua</li>
                    <li>Báo lỗi ngay khi phát hiện sự cố</li>
                    <li>Không vi phạm điều khoản sử dụng của Youtube</li>
                    <li>Không upload nội dung vi phạm bản quyền</li>
                </ul>
            </div>

            <div className={styles.contactLink}>
                <p style={{ marginBottom: '16px', fontSize: '16px', color: 'var(--text-color)' }}>
                    Cần hỗ trợ bảo hành Youtube? Liên hệ ngay với chúng tôi!
                </p>
                <a href="/contact" className={styles.contactButton}>
                    💬 Chat với CSKH
                </a>
            </div>
        </div>
    );
}
