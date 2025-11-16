import { Metadata } from 'next';
import styles from '../../page.module.scss';

export const metadata: Metadata = {
    title: 'Hướng Dẫn Tìm Kiếm Sản Phẩm',
    description: 'Hướng dẫn chi tiết cách tìm kiếm và lọc sản phẩm trên TAIKHOANXIN.COM',
};

export default function SearchGuidePage() {
    return (
        <div className={styles.helpContent}>
            <h1>Hướng dẫn tìm kiếm sản phẩm</h1>
            
            <p>
                TAIKHOANXIN.COM cung cấp nhiều cách để bạn tìm kiếm và khám phá sản phẩm phù hợp với nhu cầu của mình.
            </p>

            <h2>Tìm kiếm nhanh</h2>

            <div className={styles.stepContainer}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Sử dụng thanh tìm kiếm</h3>
                        <p>
                            Nhập từ khóa vào ô tìm kiếm ở đầu trang. Bạn có thể tìm theo:
                        </p>
                        <ul>
                            <li>Tên sản phẩm (VD: &quot;Netflix&quot;, &quot;Office 365&quot;)</li>
                            <li>Loại sản phẩm (VD: &quot;Game&quot;, &quot;Phần mềm&quot;)</li>
                            <li>Thương hiệu (VD: &quot;Microsoft&quot;, &quot;Adobe&quot;)</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Xem gợi ý tìm kiếm</h3>
                        <p>
                            Khi bạn gõ, hệ thống sẽ hiển thị các gợi ý sản phẩm phù hợp. 
                            Nhấp vào gợi ý để xem chi tiết sản phẩm ngay.
                        </p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Nhấn Enter hoặc nút tìm kiếm</h3>
                        <p>
                            Nhấn Enter hoặc click vào icon tìm kiếm để xem tất cả kết quả liên quan.
                        </p>
                    </div>
                </div>
            </div>

            <h2>Duyệt theo danh mục</h2>
            
            <p>
                Nếu bạn chưa biết chính xác sản phẩm cần tìm, hãy duyệt theo danh mục:
            </p>

            <div className={styles.highlightBox}>
                <p>
                    <strong>📂 Các danh mục chính</strong>
                </p>
                <ul>
                    <li><strong>Game bản quyền:</strong> Steam, Epic Games, Xbox, PlayStation</li>
                    <li><strong>Phần mềm văn phòng:</strong> Microsoft Office, Adobe Creative Cloud</li>
                    <li><strong>Giải trí:</strong> Netflix, Spotify, YouTube Premium</li>
                    <li><strong>Học tập:</strong> Duolingo, Coursera, Grammarly</li>
                    <li><strong>Thẻ nạp:</strong> Steam Wallet, iTunes, Google Play</li>
                </ul>
            </div>

            <h2>Lọc và sắp xếp kết quả</h2>

            <div className={styles.productCategories}>
                <div className={styles.category}>
                    <h4>💰 Lọc theo giá</h4>
                    <p>
                        Chọn khoảng giá phù hợp với ngân sách của bạn. 
                        Kéo thanh trượt hoặc nhập giá tối thiểu/tối đa.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>⭐ Lọc theo đánh giá</h4>
                    <p>
                        Chọn sản phẩm có đánh giá từ 4 sao trở lên để đảm bảo chất lượng.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>🏷️ Lọc theo thương hiệu</h4>
                    <p>
                        Chọn thương hiệu yêu thích như Microsoft, Adobe, Netflix, v.v.
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>🔄 Sắp xếp kết quả</h4>
                    <p>
                        Sắp xếp theo: Mới nhất, Giá thấp đến cao, Giá cao đến thấp, Bán chạy nhất.
                    </p>
                </div>
            </div>

            <h2>Mẹo tìm kiếm hiệu quả</h2>

            <div className={styles.highlightBox}>
                <p>
                    <strong>💡 Gợi ý từ chuyên gia</strong>
                </p>
                <ul>
                    <li>Sử dụng từ khóa ngắn gọn và chính xác</li>
                    <li>Thử các từ đồng nghĩa nếu không tìm thấy kết quả</li>
                    <li>Kiểm tra chính tả để tránh lỗi tìm kiếm</li>
                    <li>Sử dụng bộ lọc để thu hẹp kết quả</li>
                    <li>Lưu sản phẩm yêu thích để xem sau</li>
                </ul>
            </div>

            <h2>Tìm kiếm nâng cao</h2>

            <div className={styles.warningBox}>
                <p>
                    <strong>🔍 Tìm kiếm theo nhiều tiêu chí</strong>
                </p>
                <p>
                    Kết hợp nhiều bộ lọc cùng lúc để tìm chính xác sản phẩm bạn cần:
                </p>
                <ul>
                    <li>Chọn danh mục → Lọc giá → Lọc thương hiệu → Sắp xếp</li>
                    <li>Ví dụ: Game → 100k-500k → Steam → Giá thấp đến cao</li>
                </ul>
            </div>

            <h2>Không tìm thấy sản phẩm?</h2>
            
            <div className={styles.troubleshootBox}>
                <h3>Các giải pháp:</h3>
                
                <div className={styles.troubleshootItem}>
                    <h4>🔄 Thử từ khóa khác</h4>
                    <p>
                        Sử dụng tên khác của sản phẩm hoặc tên tiếng Anh/tiếng Việt.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>📧 Yêu cầu sản phẩm</h4>
                    <p>
                        Liên hệ với chúng tôi để yêu cầu thêm sản phẩm bạn cần. 
                        Chúng tôi sẽ cố gắng bổ sung trong thời gian sớm nhất.
                    </p>
                </div>

                <div className={styles.troubleshootItem}>
                    <h4>💬 Hỏi tư vấn viên</h4>
                    <p>
                        Chat với CSKH để được tư vấn sản phẩm phù hợp với nhu cầu của bạn.
                    </p>
                </div>
            </div>

            <div className={styles.contactLink}>
                <p style={{ marginBottom: '16px', fontSize: '16px', color: 'var(--text-color)' }}>
                    Cần hỗ trợ tìm kiếm sản phẩm?
                </p>
                <a href="/contact" className={styles.contactButton}>
                    💬 Chat với CSKH
                </a>
            </div>
        </div>
    );
}
