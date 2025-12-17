import type { Metadata } from 'next';
import ToolsHomeLayout from '@/layout/tools';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: 'Công cụ hỗ trợ | TaiKhoanXin',
    description: 'Tập hợp các công cụ hỗ trợ khách hàng: lấy mã đăng nhập, kích hoạt Youtube TV, gửi bảo hành, bổ sung thông tin đơn hàng.',
    alternates: {
        canonical: `${siteUrl}/tools`,
    },
    openGraph: {
        title: 'Công cụ hỗ trợ | TaiKhoanXin',
        description: 'Chọn công cụ hỗ trợ phù hợp để xử lý nhanh các yêu cầu với TaiKhoanXin.',
        url: `${siteUrl}/tools`,
        siteName: 'TaiKhoanXin',
        locale: 'vi_VN',
        type: 'website',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'TaiKhoanXin - Công cụ hỗ trợ',
    },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Công cụ hỗ trợ | TaiKhoanXin',
        description: 'Chọn công cụ hỗ trợ phù hợp để xử lý nhanh các yêu cầu với TaiKhoanXin.',
        images: [ogImage],
    },
};

export default function ToolsHomePage() {
    return <ToolsHomeLayout />;
}

