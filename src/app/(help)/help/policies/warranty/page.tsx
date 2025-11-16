import { Metadata } from 'next';
import Link from 'next/link';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'Chính Sách Bảo Hành',
    description: 'Chính sách bảo hành sản phẩm tại TAIKHOANXIN.COM',
};

export default function WarrantyPolicyPage() {
    return (
        <div className={styles.helpContent}>
            <h1>Chính sách bảo hành</h1>
            
            <p>
                TAIKHOANXIN.COM cam kết cung cấp tài khoản dịch vụ streaming chính hãng với chất lượng cao nhất. 
                Chúng tôi hiểu rằng việc sử dụng các dịch vụ như Netflix, Spotify, YouTube Premium là nhu cầu thiết yếu 
                trong cuộc sống giải trí hiện đại, vì vậy chúng tôi luôn đảm bảo sản phẩm hoạt động ổn định và 
                hỗ trợ khách hàng tận tình trong suốt thời gian sử dụng.
            </p>

            <div className={styles.highlightBox}>
                <p><strong>🎯 Cam kết của chúng tôi</strong></p>
                <ul>
                    <li><strong>Tài khoản chính hãng:</strong> 100% tài khoản từ nguồn uy tín, đảm bảo hoạt động</li>
                    <li><strong>Hỗ trợ 24/7:</strong> Đội ngũ CSKH luôn sẵn sàng hỗ trợ mọi lúc</li>
                    <li><strong>Bảo hành rõ ràng:</strong> Chính sách bảo hành minh bạch, dễ hiểu</li>
                    <li><strong>Xử lý nhanh chóng:</strong> Giải quyết yêu cầu bảo hành trong 1-24 giờ</li>
                </ul>
            </div>

            <h2>Nguyên tắc bảo hành chung</h2>

            <div className={styles.highlightBox}>
                <p><strong>⏰ Thời gian bảo hành</strong></p>
                <p>
                    Thời gian bảo hành tương ứng với thời hạn gói cước của sản phẩm khách hàng mua.
                </p>
                <ul>
                    <li><strong>Gói 1 tháng:</strong> Bảo hành 1 tháng (30 ngày)</li>
                    <li><strong>Gói 3 tháng:</strong> Bảo hành 3 tháng (90 ngày)</li>
                    <li><strong>Gói 6 tháng:</strong> Bảo hành 6 tháng (180 ngày)</li>
                    <li><strong>Gói 1 năm:</strong> Bảo hành 12 tháng (365 ngày)</li>
                </ul>
            </div>

            <h2>Điều kiện được bảo hành</h2>

            <div className={styles.productCategories}>
                <div className={styles.category}>
                    <h4>✅ Lỗi từ nhà cung cấp</h4>
                    <p>
                        Tài khoản không đăng nhập được, bị khóa, 
                        hoặc mất quyền truy cập do lỗi từ nhà cung cấp.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>✅ Lỗi kỹ thuật</h4>
                    <p>
                        Sản phẩm không kích hoạt được, 
                        key/code không hợp lệ do lỗi hệ thống.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>✅ Sản phẩm không đúng mô tả</h4>
                    <p>
                        Sản phẩm nhận được không đúng với 
                        thông tin mô tả khi đặt hàng.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>✅ Hết hạn sớm</h4>
                    <p>
                        Sản phẩm hết hạn trước thời gian 
                        cam kết do lỗi từ shop.
                    </p>
                </div>
            </div>

            <h2>Không được bảo hành</h2>

            <div className={styles.warningBox}>
                <p><strong>❌ Các trường hợp sau KHÔNG được bảo hành</strong></p>
                <ul>
                    <li>Tự ý thay đổi mật khẩu, thông tin tài khoản</li>
                    <li>Chia sẻ tài khoản cho người khác sử dụng</li>
                    <li>Vi phạm điều khoản sử dụng của nhà cung cấp (Netflix, Spotify, YouTube...)</li>
                    <li>Sử dụng VPN không được phép hoặc vùng địa lý không hợp lệ</li>
                    <li>Đăng nhập quá số thiết bị cho phép</li>
                    <li>Hết thời gian bảo hành</li>
                    <li>Sản phẩm đã hết hạn tự nhiên theo chu kỳ</li>
                    <li>Không cung cấp được thông tin đơn hàng hoặc email đăng ký</li>
                </ul>
            </div>

            <h2>Quy trình bảo hành</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Liên hệ yêu cầu bảo hành</h3>
                        <ul>
                            <li>Live chat trên website</li>
                            <li>Email: support@taikhoanxin.com</li>
                            <li>Hotline: 1900 xxxx</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Cung cấp thông tin</h3>
                        <ul>
                            <li>Mã đơn hàng</li>
                            <li>Email đăng ký</li>
                            <li>Mô tả chi tiết lỗi</li>
                            <li>Ảnh chụp màn hình (nếu có)</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Kiểm tra và xác minh</h3>
                        <ul>
                            <li>Kiểm tra thông tin đơn hàng</li>
                            <li>Xác minh lỗi sản phẩm</li>
                            <li>Kiểm tra thời gian bảo hành</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>4</div>
                    <div className={styles.stepContent}>
                        <h3>Xử lý bảo hành</h3>
                        <ul>
                            <li>Khắc phục lỗi (nếu có thể)</li>
                            <li>Đổi sản phẩm mới cùng loại</li>
                            <li>Hoàn tiền (nếu không khắc phục được)</li>
                            <li>Thời gian xử lý: 1-24 giờ</li>
                        </ul>
                    </div>
                </div>
            </div>

            <h2>Chính sách bảo hành theo sản phẩm</h2>

            <div className={styles.productCategories}>
                <div className={styles.category}>
                    <h4>🎬 Netflix</h4>
                    <p>
                        Bảo hành toàn bộ thời gian gói. Đổi tài khoản mới nếu bị lỗi đăng nhập, 
                        mất quyền truy cập hoặc hết hạn sớm.
                    </p>
                    <Link href="/help/policies/warranty/netflix" className={styles.linkButton}>
                        Xem chi tiết →
                    </Link>
                </div>

                <div className={styles.category}>
                    <h4>🎵 Spotify</h4>
                    <p>
                        Bảo hành Premium không bị gián đoạn. Hỗ trợ đổi tài khoản nếu bị hạ cấp 
                        về Free hoặc không sử dụng được.
                    </p>
                    <Link href="/help/policies/warranty/spotify" className={styles.linkButton}>
                        Xem chi tiết →
                    </Link>
                </div>

                <div className={styles.category}>
                    <h4>📺 YouTube Premium</h4>
                    <p>
                        Bảo hành tính năng Premium (xem không quảng cáo, tải video). 
                        Đổi mới nếu mất quyền Premium.
                    </p>
                    <Link href="/help/policies/warranty/youtube" className={styles.linkButton}>
                        Xem chi tiết →
                    </Link>
                </div>

                <div className={styles.category}>
                    <h4>🤖 ChatGPT Plus</h4>
                    <p>
                        Bảo hành quyền truy cập GPT-4 và các tính năng Plus. 
                        Đổi tài khoản mới nếu bị khóa hoặc hạ cấp.
                    </p>
                    <Link href="/help/policies/warranty/chatgpt" className={styles.linkButton}>
                        Xem chi tiết →
                    </Link>
                </div>

                <div className={styles.category}>
                    <h4>🎨 Canva Pro</h4>
                    <p>
                        Bảo hành tính năng Pro (templates, elements premium, AI). 
                        Đổi mới nếu mất quyền Pro.
                    </p>
                    <Link href="/help/policies/warranty/canva" className={styles.linkButton}>
                        Xem chi tiết →
                    </Link>
                </div>

                <div className={styles.category}>
                    <h4>🎬 CapCut Pro</h4>
                    <p>
                        Bảo hành tính năng Pro (xuất 4K, không watermark, AI). 
                        Đổi tài khoản nếu mất quyền Pro.
                    </p>
                    <Link href="/help/policies/warranty/capcut" className={styles.linkButton}>
                        Xem chi tiết →
                    </Link>
                </div>
            </div>

            <h2>Thời gian xử lý bảo hành</h2>

            <div className={styles.highlightBox}>
                <ul>
                    <li><strong>Lỗi đăng nhập:</strong> Xử lý trong 1-2 giờ</li>
                    <li><strong>Tài khoản bị khóa:</strong> Xử lý trong 2-6 giờ</li>
                    <li><strong>Hết hạn sớm:</strong> Xử lý trong 6-12 giờ</li>
                    <li><strong>Các trường hợp khác:</strong> Xử lý trong 12-24 giờ</li>
                </ul>
                <p style={{ marginTop: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    * Thời gian xử lý có thể nhanh hơn tùy vào tình trạng thực tế
                </p>
            </div>

            <h2>Chính sách hoàn tiền</h2>

            <div className={styles.highlightBox}>
                <p><strong>💰 Hoàn tiền khi không thể khắc phục lỗi</strong></p>
                <ul>
                    <li><strong>Hoàn 100%:</strong> Nếu sản phẩm lỗi trong 24 giờ đầu và không thể thay thế</li>
                    <li><strong>Hoàn theo tỷ lệ:</strong> Hoàn tiền phần thời gian chưa sử dụng nếu lỗi sau 24 giờ</li>
                    <li><strong>Thời gian xử lý:</strong> 1-3 ngày làm việc</li>
                    <li><strong>Hình thức:</strong> Hoàn về tài khoản ví hoặc chuyển khoản ngân hàng</li>
                </ul>
            </div>

            <h2>Lưu ý quan trọng</h2>

            <div className={styles.warningBox}>
                <p><strong>⚠️ Để được bảo hành nhanh chóng</strong></p>
                <ul>
                    <li>Lưu giữ email xác nhận đơn hàng và thông tin tài khoản đã mua</li>
                    <li>Không thay đổi mật khẩu hoặc thông tin tài khoản khi chưa liên hệ CSKH</li>
                    <li>Liên hệ ngay khi phát hiện lỗi, không chờ đến gần hết hạn bảo hành</li>
                    <li>Cung cấp đầy đủ thông tin: mã đơn hàng, email, mô tả lỗi, ảnh chụp màn hình</li>
                    <li>Tuân thủ điều khoản sử dụng của nhà cung cấp (Netflix, Spotify, YouTube...)</li>
                </ul>
            </div>

            <div className={styles.contactLink}>
                <p style={{ marginBottom: '16px', fontSize: '16px', color: 'var(--text-color)' }}>
                    Cần hỗ trợ bảo hành? Liên hệ ngay với chúng tôi!
                </p>
                <a href="/contact" className={styles.contactButton}>
                    💬 Chat với CSKH
                </a>
            </div>
        </div>
    );
}
