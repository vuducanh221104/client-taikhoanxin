import type { Metadata } from 'next';
import AccountLayout from '@/layout/account';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://cdn.taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: 'Tài khoản của tôi | TaiKhoanXin',
    description: 'Xem tổng quan tài khoản, thông tin cá nhân và trạng thái thành viên của bạn trên TaiKhoanXin.',
    alternates: {
        canonical: `${siteUrl}/account`,
    },
    openGraph: {
        title: 'Tài khoản của tôi | TaiKhoanXin',
        description: 'Quản lý tài khoản và thông tin cá nhân của bạn.',
        url: `${siteUrl}/account`,
        siteName: 'TaiKhoanXin',
        locale: 'vi_VN',
        type: 'website',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'TaiKhoanXin - Tài khoản',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Tài khoản của tôi | TaiKhoanXin',
        description: 'Quản lý tài khoản và thông tin cá nhân của bạn.',
        images: [ogImage],
    },
};

export default function AccountPage() {
    return <AccountLayout />;
}
