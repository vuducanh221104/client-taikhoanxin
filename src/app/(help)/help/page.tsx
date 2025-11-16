import { Metadata } from 'next';
import routes from '@/config/routes';
import styles from './page.module.scss';

export const metadata: Metadata = {
    title: 'Trợ Giúp - Hướng Dẫn Sử Dụng',
    description: 'Hướng dẫn chi tiết cách sử dụng các tính năng trên TAIKHOANXIN.COM',
    openGraph: {
        title: 'Trợ Giúp - Hướng Dẫn Sử Dụng',
        description: 'Hướng dẫn chi tiết cách sử dụng các tính năng trên TAIKHOANXIN.COM',
        type: 'website',
        url: `${routes.domain.name}/help`,
    },
};

export default function HelpPage() {
    return (
        <div className={styles.helpContent}>
            <h1>Hướng dẫn sử dụng tài liệu</h1>
            
            <p>
                Trong tài liệu này chúng tôi sẽ hướng dẫn từ A-Z các bước để bạn có thể mua hàng tại TAIKHOANXIN.COM
                một cách dễ dàng và thuận tiện nhất. Cùng với đó là nắm được các chính sách bảo hành và được hỗ
                trợ nhanh chóng bởi đội ngũ CSKH đáng tự hào của TAIKHOANXIN.COM.
            </p>

            <h2>Cấu trúc các bài viết trong tài liệu</h2>
            
            <p>
                Tài liệu hướng dẫn được chia thành các nhóm thư mục → Các bài viết lớn → Các bài viết nhỏ chi tiết
                các bước.
            </p>

            <div className={styles.imageExample}>
                <img 
                    src="/help/guide/guide-structure.png" 
                    alt="Cấu trúc của tài liệu"
                />
            </div>

            <h2>Cách tìm kiếm thông tin</h2>
            
            <p>
                Các bài viết hướng dẫn trong tài liệu được viết chi tiết cho tất cả các phần trong TAIKHOANXIN.COM. 
                Vì vậy bạn có thể tìm kiếm các thông tin mình cần bằng hộp &quot;Search&quot; trong trang.
            </p>

            <div className={styles.imageExample}>
                <img 
                    src="/help/guide/guide-search.png" 
                    alt="Hộp search tìm kiếm thông tin"
                />
            </div>

            <h2>Zoom ảnh trong bài viết</h2>
            
            <p>
                Bạn có thể click vào hình ảnh để xem hình ảnh to hơn.
            </p>

            <div className={styles.imageExample}>
                <img 
                    src="https://532840585-files.gitbook.io/~/files/v0/b/gitbook-legacy-files/o/assets%2F-M3-IU1k8a0MMGt6Gmx-%2F-M3-mJrlt3N00KUsn7kz%2F-M3-oUFc5OEC5H_FcOG4%2F2020-01-02%2010.54.55.gif?alt=media&token=065c1c9b-da49-4f9d-a3b9-e999f56f32dd" 
                    alt="Zoom ảnh trong bài viết"
                />
            </div>

            <h2>Không tìm thấy thông tin cần thiết?</h2>
            
            <p>
                Nếu không tìm thấy tài liệu cần thiết vui lòng liên hệ với chúng tôi để được hỗ trợ.
            </p>

            <div className={styles.contactLink}>
                <a href="/contact" className={styles.contactButton}>
                    Chat với CSKH TAIKHOANXIN.COM
                </a>
            </div>
        </div>
    );
}
