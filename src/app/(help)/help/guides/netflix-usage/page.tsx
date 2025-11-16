import { Metadata } from 'next';
import Link from 'next/link';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'Hướng dẫn sử dụng Netflix | TAIKHOANXIN.COM',
    description: 'Hướng dẫn chi tiết cách sử dụng Netflix từ cơ bản đến nâng cao',
};

export default function NetflixUsageGuidePage() {
    return (
        <div className={styles.helpContent}>
            <h1>Cách sử dụng Netflix</h1>
            
            <p>
                Netflix là nền tảng xem phim và series trực tuyến hàng đầu thế giới. 
                Hướng dẫn này sẽ giúp bạn sử dụng Netflix hiệu quả nhất.
            </p>

            <h2>🚀 Bắt đầu với Netflix</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Đăng nhập tài khoản</h3>
                        <p>Truy cập netflix.com hoặc mở app, đăng nhập bằng email và mật khẩu đã mua</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Tạo Profile</h3>
                        <p>Tạo profile riêng cho từng thành viên để có gợi ý phim phù hợp</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Khám phá nội dung</h3>
                        <p>Duyệt qua các thể loại, xem Top 10, hoặc tìm kiếm phim yêu thích</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>4</div>
                    <div className={styles.stepContent}>
                        <h3>Bắt đầu xem</h3>
                        <p>Nhấn Play và thưởng thức!</p>
                    </div>
                </div>
            </div>

            <h2>👤 Quản lý Profile</h2>

            <div className={styles.highlightBox}>
                <h3>Tạo Profile mới:</h3>
                <ol>
                    <li>Nhấn vào biểu tượng profile (góc trên bên phải)</li>
                    <li>Chọn "Manage Profiles"</li>
                    <li>Nhấn "Add Profile"</li>
                    <li>Đặt tên và chọn avatar</li>
                    <li>Chọn "Kids" nếu là profile cho trẻ em</li>
                    <li>Nhấn "Save"</li>
                </ol>
                <p className={styles.highlightText}>
                    💡 Mỗi tài khoản có thể tạo tối đa 5 profiles
                </p>
            </div>

            <h2>🔍 Tìm kiếm và khám phá phim</h2>

            <div className={styles.productCategories}>
                <div className={styles.category}>
                    <h4>🔎 Tìm kiếm</h4>
                    <p>
                        Nhấn biểu tượng kính lúp, gõ tên phim, diễn viên, 
                        đạo diễn hoặc thể loại để tìm kiếm.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>📊 Top 10</h4>
                    <p>
                        Xem danh sách 10 phim/series hot nhất tại Việt Nam 
                        được cập nhật hàng ngày.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>🎬 Thể loại</h4>
                    <p>
                        Duyệt theo thể loại: Hành động, Hài, Kinh dị, 
                        Tình cảm, Tài liệu...
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>✨ Gợi ý cho bạn</h4>
                    <p>
                        Netflix sẽ gợi ý phim dựa trên lịch sử xem 
                        và sở thích của bạn.
                    </p>
                </div>
            </div>

            <h2>▶️ Xem phim và điều khiển</h2>

            <div className={styles.highlightBox}>
                <h3>Các phím tắt hữu ích:</h3>
                <ul>
                    <li><strong>Space:</strong> Phát/Tạm dừng</li>
                    <li><strong>F:</strong> Toàn màn hình</li>
                    <li><strong>Esc:</strong> Thoát toàn màn hình</li>
                    <li><strong>←/→:</strong> Tua lùi/tua tới 10 giây</li>
                    <li><strong>↑/↓:</strong> Tăng/giảm âm lượng</li>
                    <li><strong>M:</strong> Tắt/bật tiếng</li>
                    <li><strong>S:</strong> Bỏ qua intro</li>
                </ul>
            </div>

            <h2>⚙️ Cài đặt phụ đề và âm thanh</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Trong khi xem phim</h3>
                        <p>Nhấn vào biểu tượng hội thoại (💬) ở góc dưới bên phải</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Chọn phụ đề</h3>
                        <p>Chọn "Tiếng Việt" hoặc ngôn ngữ khác trong danh sách</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Chọn âm thanh</h3>
                        <p>Chọn ngôn ngữ lồng tiếng hoặc âm thanh gốc</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>4</div>
                    <div className={styles.stepContent}>
                        <h3>Tùy chỉnh phụ đề</h3>
                        <p>Vào Settings để thay đổi font, kích thước, màu sắc phụ đề</p>
                    </div>
                </div>
            </div>

            <h2>📱 Tải phim về xem offline</h2>

            <div className={styles.highlightBox}>
                <p><strong>Cách tải phim trên app di động:</strong></p>
                <ol>
                    <li>Mở app Netflix trên điện thoại/tablet</li>
                    <li>Tìm phim/series muốn tải</li>
                    <li>Nhấn biểu tượng tải xuống (⬇️)</li>
                    <li>Chọn chất lượng: Standard hoặc High</li>
                    <li>Đợi tải xong, xem trong mục "Downloads"</li>
                </ol>
                <p className={styles.warningText}>
                    ⚠️ Lưu ý: Không phải tất cả phim đều có thể tải về
                </p>
            </div>

            <h2>📺 Xem Netflix trên TV</h2>

            <div className={styles.productCategories}>
                <div className={styles.category}>
                    <h4>Smart TV</h4>
                    <p>
                        Tải app Netflix từ App Store của TV, 
                        đăng nhập và xem ngay.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>Chromecast</h4>
                    <p>
                        Mở Netflix trên điện thoại, nhấn biểu tượng Cast, 
                        chọn TV để chiếu.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>HDMI</h4>
                    <p>
                        Kết nối laptop với TV qua cáp HDMI, 
                        mở Netflix trên trình duyệt.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>Game Console</h4>
                    <p>
                        Tải app Netflix trên PlayStation hoặc Xbox, 
                        đăng nhập và xem.
                    </p>
                </div>
            </div>

            <h2>⭐ Tính năng nâng cao</h2>

            <div className={styles.faqSection}>
                <h3>My List (Danh sách của tôi)</h3>
                <div className={styles.faqAnswer}>
                    <p>
                        Nhấn dấu "+" trên phim để thêm vào My List. 
                        Đây là nơi lưu trữ phim bạn muốn xem sau.
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h3>Đánh giá phim</h3>
                <div className={styles.faqAnswer}>
                    <p>
                        Nhấn "Thumbs Up" (👍) hoặc "Thumbs Down" (👎) 
                        để Netflix gợi ý phim phù hợp hơn.
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h3>Xem lại từ đầu</h3>
                <div className={styles.faqAnswer}>
                    <p>
                        Vào "Account" → "Viewing Activity" → 
                        Nhấn biểu tượng ⭕ để xóa lịch sử xem và xem lại từ đầu.
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h3>Parental Controls (Kiểm soát nội dung)</h3>
                <div className={styles.faqAnswer}>
                    <p>
                        Vào "Account" → "Profile & Parental Controls" 
                        để đặt mã PIN và giới hạn độ tuổi cho profile trẻ em.
                    </p>
                </div>
            </div>

            <h2>💡 Mẹo sử dụng Netflix hiệu quả</h2>

            <div className={styles.highlightBox}>
                <ul>
                    <li>🎯 Tạo profile riêng cho từng người để có gợi ý chính xác</li>
                    <li>📝 Thêm phim vào My List để không quên xem</li>
                    <li>⏩ Nhấn "Skip Intro" để bỏ qua phần mở đầu</li>
                    <li>🔄 Bật "Autoplay next episode" để xem liên tục</li>
                    <li>📊 Xem "Top 10" để biết phim hot nhất</li>
                    <li>🌐 Đổi ngôn ngữ giao diện trong Settings</li>
                    <li>📱 Tải phim trước khi đi du lịch</li>
                    <li>👥 Sử dụng profile "Kids" cho trẻ em</li>
                    <li>🔍 Tìm kiếm theo mã thể loại (VD: 1365 = Action)</li>
                    <li>⚙️ Điều chỉnh chất lượng video trong Settings</li>
                </ul>
            </div>

            <h2>❓ Xử lý sự cố thường gặp</h2>

            <div className={styles.troubleshootBox}>
                <div className={styles.troubleshootItem}>
                    <h4>🐌 Video bị giật, lag</h4>
                    <p>
                        <strong>Giải pháp:</strong> Giảm chất lượng video xuống, 
                        kiểm tra tốc độ mạng, tắt các app khác đang chạy.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>🚫 Không có phụ đề tiếng Việt</h4>
                    <p>
                        <strong>Giải pháp:</strong> Một số phim mới chưa có phụ đề Việt. 
                        Đợi vài ngày hoặc xem phụ đề tiếng Anh.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>❌ Lỗi "Cannot play title"</h4>
                    <p>
                        <strong>Giải pháp:</strong> Đăng xuất và đăng nhập lại, 
                        xóa cache trình duyệt, hoặc cập nhật app.
                    </p>
                </div>
            </div>

            <div className={styles.warningBox}>
                <h3>⚠️ Lưu ý quan trọng</h3>
                <ul>
                    <li>Không đổi mật khẩu hoặc thông tin tài khoản</li>
                    <li>Không chia sẻ tài khoản công khai trên mạng</li>
                    <li>Không sử dụng VPN để xem nội dung vùng khác</li>
                    <li>Đăng xuất khi sử dụng máy công cộng</li>
                    <li>Kiểm tra thiết bị đăng nhập định kỳ</li>
                </ul>
            </div>

            <div className={styles.contactLink}>
                <p style={{ marginBottom: '16px' }}>
                    Cần hỗ trợ thêm? Liên hệ với chúng tôi!
                </p>
                <Link href="/contact" className={styles.contactButton}>
                    💬 Chat với CSKH
                </Link>
            </div>
        </div>
    );
}
