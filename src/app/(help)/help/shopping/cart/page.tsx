import { Metadata } from 'next';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'Hướng Dẫn Sử Dụng Giỏ Hàng',
    description: 'Hướng dẫn chi tiết cách thêm và quản lý sản phẩm trong giỏ hàng',
};

export default function CartGuidePage() {
    return (
        <div className={styles.helpContent}>
            <h1>Hướng dẫn sử dụng giỏ hàng</h1>
            
            <p>
                Giỏ hàng là nơi bạn lưu trữ các sản phẩm muốn mua trước khi thanh toán. 
                Bạn có thể thêm, xóa hoặc cập nhật số lượng sản phẩm bất cứ lúc nào.
            </p>

            <h2>Thêm sản phẩm vào giỏ hàng</h2>
            
            <h3>Cách 1: Từ trang chi tiết sản phẩm</h3>
            <ol>
                <li>Truy cập trang chi tiết sản phẩm bạn muốn mua</li>
                <li>Chọn số lượng (nếu có)</li>
                <li>Nhấp vào nút "Thêm vào giỏ hàng"</li>
            </ol>

            <h3>Cách 2: Mua nhanh từ danh sách sản phẩm</h3>
            <ol>
                <li>Di chuột qua sản phẩm trong danh sách</li>
                <li>Nhấp vào biểu tượng giỏ hàng xuất hiện</li>
                <li>Sản phẩm sẽ được thêm vào giỏ với số lượng mặc định là 1</li>
            </ol>

            <h2>Quản lý giỏ hàng</h2>
            
            <h3>Xem giỏ hàng</h3>
            <p>
                Nhấp vào biểu tượng giỏ hàng ở góc trên bên phải để xem nhanh các sản phẩm đã thêm. 
                Hoặc truy cập trang giỏ hàng đầy đủ để quản lý chi tiết.
            </p>

            <h3>Cập nhật số lượng</h3>
            <p>
                Trong trang giỏ hàng, bạn có thể tăng/giảm số lượng sản phẩm bằng cách:
            </p>
            <ul>
                <li>Nhấp vào nút +/- bên cạnh số lượng</li>
                <li>Hoặc nhập trực tiếp số lượng mong muốn</li>
            </ul>

            <h3>Xóa sản phẩm</h3>
            <p>
                Nhấp vào biểu tượng thùng rác bên cạnh sản phẩm để xóa khỏi giỏ hàng.
            </p>

            <h2>Áp dụng mã giảm giá</h2>
            <ol>
                <li>Trong trang giỏ hàng, tìm ô "Mã giảm giá"</li>
                <li>Nhập mã giảm giá của bạn</li>
                <li>Nhấp "Áp dụng"</li>
                <li>Giá sẽ được cập nhật tự động</li>
            </ol>

            <h2>Tiến hành thanh toán</h2>
            <p>
                Sau khi đã kiểm tra kỹ các sản phẩm trong giỏ, nhấp vào nút "Thanh toán" 
                để chuyển sang bước nhập thông tin giao hàng và thanh toán.
            </p>
        </div>
    );
}
