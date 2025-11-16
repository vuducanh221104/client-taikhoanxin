import { Metadata } from 'next';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'Hướng Dẫn Quản Lý Tài Khoản',
    description: 'Hướng dẫn chi tiết cách quản lý thông tin tài khoản cá nhân',
};

export default function ManageAccountPage() {
    return (
        <div className={styles.helpContent}>
            <h1>Quản lý tài khoản</h1>
            
            <p>
                Trang quản lý tài khoản cho phép bạn cập nhật thông tin cá nhân, xem lịch sử đơn hàng, 
                và quản lý các thiết lập liên quan đến tài khoản của bạn.
            </p>

            <h2>Truy cập trang quản lý tài khoản</h2>
            <ol>
                <li>Đăng nhập vào tài khoản của bạn</li>
                <li>Nhấp vào tên tài khoản ở góc trên bên phải</li>
                <li>Chọn "Tài khoản của tôi" từ menu dropdown</li>
            </ol>

            <h2>Cập nhật thông tin cá nhân</h2>
            
            <h3>Thông tin cơ bản</h3>
            <p>Bạn có thể cập nhật các thông tin sau:</p>
            <ul>
                <li>Họ và tên</li>
                <li>Số điện thoại</li>
                <li>Ngày sinh</li>
                <li>Giới tính</li>
            </ul>

            <h3>Địa chỉ giao hàng</h3>
            <p>
                Trong phần "Địa chỉ", bạn có thể:
            </p>
            <ul>
                <li>Thêm địa chỉ giao hàng mới</li>
                <li>Chỉnh sửa địa chỉ hiện có</li>
                <li>Xóa địa chỉ không còn sử dụng</li>
                <li>Đặt địa chỉ mặc định</li>
            </ul>

            <h2>Bảo mật tài khoản</h2>
            
            <h3>Đổi mật khẩu</h3>
            <ol>
                <li>Vào phần "Bảo mật"</li>
                <li>Nhập mật khẩu hiện tại</li>
                <li>Nhập mật khẩu mới (tối thiểu 8 ký tự)</li>
                <li>Xác nhận mật khẩu mới</li>
                <li>Nhấp "Cập nhật"</li>
            </ol>

            <h3>Xác thực hai yếu tố (2FA)</h3>
            <p>
                Để tăng cường bảo mật, bạn nên bật xác thực hai yếu tố. Điều này yêu cầu 
                một mã xác nhận từ điện thoại mỗi khi đăng nhập.
            </p>

            <h2>Lịch sử hoạt động</h2>
            <p>
                Xem lại các hoạt động gần đây trên tài khoản của bạn:
            </p>
            <ul>
                <li>Lịch sử đăng nhập</li>
                <li>Lịch sử đơn hàng</li>
                <li>Lịch sử giao dịch</li>
            </ul>

            <h2>Xóa tài khoản</h2>
            <p>
                Nếu bạn muốn xóa tài khoản, vui lòng liên hệ với bộ phận hỗ trợ khách hàng. 
                Lưu ý rằng việc xóa tài khoản là vĩnh viễn và không thể hoàn tác.
            </p>
        </div>
    );
}
