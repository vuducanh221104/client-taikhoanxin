import type { Metadata } from 'next';
import ContactLayout from '@/layout/contact';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://cdn.taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: 'Liên hệ | TaiKhoanXin',
    description:
        'Liên hệ đội ngũ hỗ trợ TaiKhoanXin để được giải đáp thắc mắc về tài khoản bản quyền, đơn hàng và thanh toán.',
    openGraph: {
        title: 'Liên hệ TaiKhoanXin',
        description:
            'Gửi yêu cầu hỗ trợ, góp ý hoặc hợp tác với TaiKhoanXin qua form liên hệ hoặc thông tin liên lạc hiển thị trên trang.',
        url: `${siteUrl}/contact`,
        siteName: 'TaiKhoanXin',
        type: 'website',
        locale: 'vi_VN',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'TaiKhoanXin - Liên hệ',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Liên hệ | TaiKhoanXin',
        description:
            'Kênh liên hệ chính thức với đội ngũ TaiKhoanXin để được hỗ trợ nhanh chóng.',
        images: [ogImage],
    },
    alternates: {
        canonical: `${siteUrl}/contact`,
    },
};

export default function ContactPage() {
    return <ContactLayout />;
}
