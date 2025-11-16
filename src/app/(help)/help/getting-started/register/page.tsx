import { Metadata } from 'next';
import routes from '@/config/routes';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'Hướng Dẫn Đăng Ký Tài Khoản',
    description: 'Hướng dẫn chi tiết cách đăng ký tài khoản trên TAIKHOANXIN.COM',
};

export default function RegisterGuidePage() {
    return (
        <div className={styles.helpContent}>
            <h1>Hướng dẫn đăng ký tài khoản</h1>
            
            <p>
                Để sử dụng đầy đủ các tính năng trên TAIKHOANXIN.COM, bạn cần tạo một tài khoản. 
                Quá trình đăng ký rất đơn giản và chỉ mất vài phút.
            </p>

            <h2>Các bước đăng ký</h2>
            
            <h3>Bước 1: Truy cập trang đăng ký</h3>
            <p>
                Nhấp vào nút "Đăng ký" ở góc trên bên phải của trang web hoặc truy cập trực tiếp 
                tại <a href={routes.user.register}>{routes.user.register}</a>
            </p>

            <h3>Bước 2: Điền thông tin</h3>
            <p>Bạn cần cung cấp các thông tin sau:</p>
            <ul>
                <li>Họ và tên</li>
                <li>Email (sẽ dùng để đăng nhập)</li>
                <li>Số điện thoại</li>
                <li>Mật khẩu (tối thiểu 8 ký tự)</li>
            </ul>

            <h3>Bước 3: Xác nhận email</h3>
            <p>
                Sau khi đăng ký, hệ thống sẽ gửi một email xác nhận đến địa chỉ email bạn đã đăng ký. 
                Nhấp vào link trong email để kích hoạt tài khoản.
            </p>

            <h3>Bước 4: Hoàn tất</h3>
            <p>
                Sau khi xác nhận email, bạn có thể đăng nhập và bắt đầu mua sắm trên TAIKHOANXIN.COM.
            </p>

            <h2>Lưu ý</h2>
            <ul>
                <li>Mật khẩu nên chứa cả chữ hoa, chữ thường và số để đảm bảo an toàn</li>
                <li>Không chia sẻ thông tin tài khoản với người khác</li>
                <li>Nếu không nhận được email xác nhận, kiểm tra thư mục spam</li>
            </ul>
        </div>
    );
}
