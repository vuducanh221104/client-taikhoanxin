import type { Metadata } from 'next';
import PrivacyLayout from '@/layout/privacy';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://cdn.taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: 'Chính sách bảo mật | TaiKhoanXin',
    description:
        'Chính sách bảo mật của TaiKhoanXin – giải thích cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu cá nhân của bạn.',
    keywords: [
        'chính sách bảo mật',
        'bảo vệ dữ liệu',
        'quyền riêng tư',
        'privacy policy',
        'bảo mật thông tin',
        'bảo vệ người dùng',
        'tai khoan xin',
    ],
    openGraph: {
        title: 'Chính sách bảo mật | TaiKhoanXin',
        description:
            'Tìm hiểu chi tiết về việc TaiKhoanXin bảo vệ quyền riêng tư và thông tin cá nhân của người dùng.',
        url: `${siteUrl}/privacy`,
        siteName: 'TaiKhoanXin',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'TaiKhoanXin - Chính sách bảo mật',
            },
        ],
        type: 'website',
        locale: 'vi_VN',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Chính sách bảo mật | TaiKhoanXin',
        description:
            'Tài liệu chính thức về bảo mật và quyền riêng tư dữ liệu tại TaiKhoanXin.',
        images: [ogImage],
    },
    alternates: {
        canonical: `${siteUrl}/privacy`,
    },
};

export default function PrivacyPage() {
    return <PrivacyLayout />;
}
