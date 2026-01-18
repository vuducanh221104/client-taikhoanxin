import { Metadata } from 'next';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'Giới thiệu TAIKHOANXIN.COM',
    description: 'Giới thiệu về TAIKHOANXIN.COM - Nền tảng tài khoản số 1 Việt Nam',
};

export default function IntroPage() {
    return (
        <div className={styles.helpContent}>
            <h1>Giới thiệu TAIKHOANXIN.COM</h1>
            
            <p>
                Chuyên bán các sản phẩm về Tài khoản bản quyền, Phần mềm, Tiện ích uy tín hàng đầu Việt Nam.
            </p>

            <h2>TAIKHOANXIN.COM có mục tiêu đơn giản như sau:</h2>
            
            <ol>
                <li>Tốc độ nhanh</li>
                <li>Bảo hành - Uy tín</li>
                <li>Chất lượng dịch vụ</li>
            </ol>

            <h2>Văn phòng TAIKHOANXIN.COM</h2>
            
            <div className={styles.imageExample}>
                <img 
                    src="/help/office/office-room.png" 
                    alt="Văn phòng TAIKHOANXIN.COM"
                />
            </div>

            <h2>Vì sao các khách hàng thường chọn TAIKHOANXIN.COM?</h2>

            <h3>1. Uy tín 10 năm hoạt động</h3>
            
            <p>
                TAIKHOANXIN.COM là một tên tuổi lâu đời trong tại thị trường Việt Nam, được khẳng định thông qua hơn 1 
                triệu khách hàng.
            </p>

            <div className={styles.highlightBox}>
                <p>
                    <strong>10 Năm liền là Shop phần mềm bản quyền uy tín nhất Việt Nam</strong>
                </p>
                <p>Ủy nhiệm cộng đồng làm chứng.</p>
            </div>

            <div className={styles.highlightBox}>
                <p>
                    <strong>Hơn 1 Triệu Khách hàng tin tưởng và mua hàng</strong>
                </p>
                <p>
                    Đã có hơn 1 Triệu khách hàng tại Việt Nam trong suốt 10 năm hoạt động.
                    Hằng tháng website TAIKHOANXIN.COM chào đón hơn 400,000 lượt truy cập mua hàng.
                </p>
            </div>

            <div className={styles.highlightBox}>
                <p>
                    <strong>Được các KOLs, Streamer hàng đầu Việt Nam lựa chọn và quảng bá</strong>
                </p>
                <p>Mixigaming, Xemesis, Esports, v.v</p>
            </div>

            <h3>2. Sản phẩm đa dạng</h3>
            
            <p>
                Với hàng chục nghìn sản phẩm trên Website TAIKHOANXIN.COM chúng tôi tự tin mang đến cho bạn tất cả 
                những gì bạn cần tìm trong thế giới sản phẩm bản quyền.
            </p>

            <div className={styles.productCategories}>
                <div className={styles.category}>
                    <h4>Các phần mềm tiện ích</h4>
                    <p>Window, Office, Adobe, AutoDesk, Finepix, Canva, ChatGPT, v.v.</p>
                </div>

                <div className={styles.category}>
                    <h4>Các phần mềm giải trí đa dạng</h4>
                    <p>Netflix, Youtube Premium, Spotify, v.v.</p>
                </div>

                <div className={styles.category}>
                    <h4>Các loại thẻ nạp</h4>
                    <p>Steam Wallet, iTunes, PSN, Nintendo, Xbox, v.v.</p>
                </div>

                <div className={styles.category}>
                    <h4>Các phần mềm học tập chất lượng</h4>
                    <p>Duolingo, Coursera, Quillbot, Freepik, Linked In, Lumosity, Grammarly, v.v.</p>
                </div>
            </div>

            <h3>3. Hình thức thanh toán thuận tiện</h3>
            
            <p>
                Đa dạng hình thức thanh toán giúp khách hàng dễ dàng lựa chọn.
            </p>

            <ul>
                <li>Momo</li>
                <li>VNPay</li>
                <li>Chuyển khoản ngân hàng</li>
                <li>ATM</li>
                <li>Thẻ Viettel</li>
                <li>Mopaysy</li>
                <li>Visa, Master</li>
            </ul>

            <div className={styles.highlightBox}>
                <p>
                    <strong>Hệ thống tự động giúp hoàn thành đơn hàng ngay lập tức</strong>
                </p>
                <p>
                    Mọi suy trình thanh toán đều được tự động các giúp khách hàng có thể hoàn thành đơn hàng chỉ trong 1 
                    giây. Ngay áp tức.
                </p>
            </div>

            <h3>4. Chế độ bảo hành và hỗ trợ.</h3>

            <div className={styles.highlightBox}>
                <p>
                    <strong>Cam kết bảo hành</strong>
                </p>
                <p>
                    Thông tin bảo hành sản phẩm đều được ghi chi tiết theo từng sản phẩm.
                    Trong suốt thời gian sử dụng sản phẩm. Bạn sẽ nhận được hỗ trợ tối đa nếu có vấn của lỗi hoàn 
                    toàn nhân phí.
                </p>
            </div>

            <div className={styles.highlightBox}>
                <p>
                    <strong>Hỗ trợ tất cả các ngày trong năm</strong>
                </p>
                <p>
                    Chúng tôi Online liên tục từ <strong>08:30 đến 23:00</strong>, tất cả các ngày trong năm kể cả lễ, Tết.
                    Chúng tôi hỗ trợ nội thời gian phản hồi khách hàng trong bình lệ <strong>1 Phút</strong>.
                </p>
            </div>

            <div className={styles.highlightBox}>
                <p>
                    <strong>Đội ngũ tư vấn nhiều kinh nghiệm</strong>
                </p>
                <p>
                    Đội ngũ tư vấn với nhiều năm kinh nghiệm sẽ giải đáp cho bạn tất cả các thắc mắc trong quá trình mua 
                    hàng và cài đặt sản phẩm.
                    Với những hướng hợp khó xử, Chúng tôi sẽ Teamview trực tiếp để cài đặt giúp bạn.
                </p>
            </div>

            <h3>5. Giá cả và ưu đãi</h3>
            
            <p>
                Chúng tôi đem đến cho khách hàng những sản phẩm với giá cả tốt nhất cùng với đó là những ưu đãi 
                và cùng hấp dẫn.
            </p>

            <div className={styles.highlightBox}>
                <p>
                    <strong>Hệ thống tích điểm thưởng</strong>
                </p>
                <p>
                    - Hệ thống tích điểm tự động<br />
                    - Lũy tiến thành toạn<br />
                    Xem thêm chi tiết tại: Thông tin ưu đãi Vip
                </p>
            </div>

            <h2>Các thông tin liên hệ với TAIKHOANXIN.COM</h2>
            
            <p>
                <strong>Email:</strong> hotro@taikhoanxin.com<br />
                <strong>Tổng đài tư vấn:</strong> 1900 633 305<br />
                <strong>Kênh chat:</strong> <a href="/contact">Chat với CSKH</a><br />
                <strong>Fanpage:</strong> <a href="https://www.facebook.com/taikhoanxincom" target="_blank" rel="noopener noreferrer">Taikhoanxin - Tài khoản bản quyền giá rẻ </a><br />
                <strong>Liên hệ và hỗ trợ bảo hành:</strong> <a href="/contact">tại đây</a>
            </p>
        </div>
    );
}
