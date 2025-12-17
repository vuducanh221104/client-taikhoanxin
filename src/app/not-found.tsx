import type { Metadata } from 'next';
import EmptyState from '@/components/EmptyState/EmptyState';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: '404 - Không tìm thấy trang',
    description:
        'Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại URL hoặc quay về trang chủ.',
    openGraph: {
        title: '404 - Không tìm thấy trang',
        description:
            'Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại URL hoặc quay về trang chủ.',
        url: siteUrl,
        siteName: 'TaiKhoanXin',
        locale: 'vi_VN',
        type: 'website',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'TaiKhoanXin - 404',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: '404 - Không tìm thấy trang',
        description:
            'Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại URL hoặc quay về trang chủ.',
        images: [ogImage],
    },
};

export default function NotFound() {
    return (
        <EmptyState
            type="not-found"
            title="404 - Không tìm thấy trang"
            description="Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại URL hoặc quay về trang chủ."
            actionLabel="Về trang chủ"
            actionHref="/"
            secondaryActionLabel="Liên hệ hỗ trợ"
            secondaryActionHref="/contact"
        />
    );
}
