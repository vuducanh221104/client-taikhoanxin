import { Metadata } from 'next';
import Link from 'next/link';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'Hướng dẫn chuyển playlist Spotify | TAIKHOANXIN.COM',
    description: 'Hướng dẫn chuyển danh sách nhạc giữa các tài khoản Spotify',
};

export default function SpotifyPlaylistGuidePage() {
    return (
        <div className={styles.helpContent}>
            <h1>Chuyển danh sách nhạc Spotify</h1>
            
            <p>
                Khi chuyển sang tài khoản Spotify mới, bạn có thể chuyển toàn bộ playlist, 
                bài hát yêu thích và album đã lưu sang tài khoản mới một cách dễ dàng.
            </p>

            <h2>🔄 Phương pháp 1: Sử dụng Soundiiz</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Truy cập Soundiiz</h3>
                        <p>Vào website soundiiz.com và đăng ký tài khoản miễn phí</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Kết nối tài khoản cũ</h3>
                        <p>Nhấn "Connect" → Chọn Spotify → Đăng nhập tài khoản cũ</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Chọn playlist</h3>
                        <p>Chọn playlist muốn chuyển hoặc "Transfer all"</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>4</div>
                    <div className={styles.stepContent}>
                        <h3>Kết nối tài khoản mới</h3>
                        <p>Chọn đích đến là Spotify, đăng nhập tài khoản mới</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>5</div>
                    <div className={styles.stepContent}>
                        <h3>Bắt đầu chuyển</h3>
                        <p>Nhấn "Confirm" và đợi quá trình hoàn tất</p>
                    </div>
                </div>
            </div>

            <h2>🎵 Phương pháp 2: Sử dụng TuneMyMusic</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Truy cập TuneMyMusic</h3>
                        <p>Vào tunemymusic.com</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Chọn nguồn</h3>
                        <p>Chọn Spotify làm nguồn, đăng nhập tài khoản cũ</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Chọn đích</h3>
                        <p>Chọn Spotify làm đích, đăng nhập tài khoản mới</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>4</div>
                    <div className={styles.stepContent}>
                        <h3>Chuyển nhạc</h3>
                        <p>Nhấn "Start moving my music"</p>
                    </div>
                </div>
            </div>

            <h2>📋 So sánh các công cụ</h2>

            <div className={styles.highlightBox}>
                <h3>🎯 Soundiiz</h3>
                <ul>
                    <li>✅ Miễn phí chuyển 1 playlist/lần</li>
                    <li>✅ Hỗ trợ nhiều nền tảng</li>
                    <li>✅ Giao diện dễ sử dụng</li>
                    <li>💰 Trả phí để chuyển nhiều playlist cùng lúc</li>
                </ul>

                <h3>🎵 TuneMyMusic</h3>
                <ul>
                    <li>✅ Miễn phí chuyển tối đa 500 bài/lần</li>
                    <li>✅ Không cần đăng ký</li>
                    <li>✅ Nhanh chóng</li>
                    <li>💰 Trả phí để không giới hạn</li>
                </ul>
            </div>

            <h2>💡 Mẹo chuyển playlist hiệu quả</h2>

            <div className={styles.productCategories}>
                <div className={styles.category}>
                    <h4>📝 Kiểm tra trước</h4>
                    <p>Xem lại danh sách playlist trước khi chuyển</p>
                </div>

                <div className={styles.category}>
                    <h4>🔄 Chuyển từng phần</h4>
                    <p>Nếu có nhiều playlist, chuyển từng phần để dễ kiểm soát</p>
                </div>

                <div className={styles.category}>
                    <h4>✅ Kiểm tra sau</h4>
                    <p>Kiểm tra lại playlist sau khi chuyển xong</p>
                </div>

                <div className={styles.category}>
                    <h4>💾 Sao lưu</h4>
                    <p>Giữ tài khoản cũ một thời gian để đề phòng</p>
                </div>
            </div>

            <h2>❓ Câu hỏi thường gặp</h2>

            <div className={styles.faqSection}>
                <h3>Có mất bài hát nào không?</h3>
                <div className={styles.faqAnswer}>
                    <p>
                        Hầu hết bài hát sẽ được chuyển thành công. Một số bài có thể không tìm thấy 
                        nếu không có trên Spotify hoặc bị gỡ bỏ.
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h3>Mất bao lâu để chuyển?</h3>
                <div className={styles.faqAnswer}>
                    <p>
                        Tùy số lượng bài hát. Thường mất 1-5 phút cho 100 bài hát.
                    </p>
                </div>
            </div>

            <div className={styles.faqSection}>
                <h3>Có an toàn không?</h3>
                <div className={styles.faqAnswer}>
                    <p>
                        Có! Các công cụ này chỉ đọc danh sách nhạc, không lưu mật khẩu. 
                        Bạn có thể thu hồi quyền truy cập sau khi chuyển xong.
                    </p>
                </div>
            </div>

            <h2>🔐 Bảo mật khi chuyển playlist</h2>

            <div className={styles.warningBox}>
                <h3>⚠️ Lưu ý quan trọng:</h3>
                <ul>
                    <li>Chỉ sử dụng công cụ uy tín (Soundiiz, TuneMyMusic)</li>
                    <li>Không cung cấp mật khẩu cho bất kỳ website nào</li>
                    <li>Thu hồi quyền truy cập sau khi chuyển xong</li>
                    <li>Kiểm tra kỹ playlist sau khi chuyển</li>
                </ul>
            </div>

            <div className={styles.highlightBox}>
                <h3>🎯 Cách thu hồi quyền truy cập:</h3>
                <ol>
                    <li>Vào spotify.com/account</li>
                    <li>Chọn "Apps"</li>
                    <li>Nhấn "Remove Access" cho Soundiiz/TuneMyMusic</li>
                </ol>
            </div>

            <div className={styles.contactLink}>
                <p style={{ marginBottom: '16px' }}>
                    Cần hỗ trợ chuyển playlist? Liên hệ với chúng tôi!
                </p>
                <Link href="/contact" className={styles.contactButton}>
                    💬 Chat với CSKH
                </Link>
            </div>
        </div>
    );
}
