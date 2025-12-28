import type { Metadata } from 'next';
import AccountManageLayout from '@/layout/accountManage';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://cdn.taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: 'Quản lý tài khoản | TaiKhoanXin',
    description: 'Xem và cập nhật hồ sơ, thông tin liên hệ, địa chỉ và bảo mật tài khoản tại TaiKhoanXin.',
    alternates: {
        canonical: `${siteUrl}/account/manage`,
    },
    openGraph: {
        title: 'Quản lý tài khoản | TaiKhoanXin',
        description: 'Cập nhật hồ sơ, thông tin liên hệ và bảo mật tài khoản.',
        url: `${siteUrl}/account/manage`,
        siteName: 'TaiKhoanXin',
        locale: 'vi_VN',
        type: 'website',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'TaiKhoanXin - Quản lý tài khoản',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Quản lý tài khoản | TaiKhoanXin',
        description: 'Cập nhật hồ sơ, thông tin liên hệ và bảo mật tài khoản.',
        images: [ogImage],
    },
};

export default function AccountManagePage() {
    return <AccountManageLayout />;
}

