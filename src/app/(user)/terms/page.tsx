import type { Metadata } from 'next';
import TermsLayout from '@/layout/terms';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: 'Điều khoản sử dụng | TaiKhoanXin',
    description:
        'Điều khoản sử dụng dịch vụ tại TaiKhoanXin – các quy định khi mua và sử dụng tài khoản bản quyền trên hệ thống.',
    keywords: [
        'điều khoản sử dụng',
        'terms of service',
        'quy định sử dụng',
        'điều kiện sử dụng',
        'terms and conditions',
        'quy tắc dịch vụ',
        'tai khoan xin',
    ],
    openGraph: {
        title: 'Điều khoản sử dụng | TaiKhoanXin',
        description:
            'Đọc kỹ điều khoản và điều kiện sử dụng dịch vụ Tài Khoản Xịn trước khi mua và sử dụng tài khoản.',
        url: `${siteUrl}/terms`,
        siteName: 'TaiKhoanXin',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'TaiKhoanXin - Điều khoản sử dụng',
            },
        ],
        type: 'website',
        locale: 'vi_VN',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Điều khoản sử dụng | TaiKhoanXin',
        description:
            'Tài liệu điều khoản sử dụng chính thức cho người dùng hệ thống TaiKhoanXin.',
        images: [ogImage],
    },
    alternates: {
        canonical: `${siteUrl}/terms`,
    },
};

export default function TermsPage() {
    return <TermsLayout />;
}
