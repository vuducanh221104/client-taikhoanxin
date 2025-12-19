import type { Metadata } from 'next';
import AccountPasswordLayout from '@/layout/accountPassword';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://cdn.taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: 'Bảo mật & mật khẩu | TaiKhoanXin',
    description: 'Cập nhật mật khẩu và thiết lập bảo mật tài khoản của bạn trên TaiKhoanXin.',
    alternates: {
        canonical: `${siteUrl}/account/password`,
    },
    openGraph: {
        title: 'Bảo mật & mật khẩu | TaiKhoanXin',
        description: 'Cập nhật mật khẩu và thiết lập bảo mật tài khoản của bạn.',
        url: `${siteUrl}/account/password`,
        siteName: 'TaiKhoanXin',
        locale: 'vi_VN',
        type: 'website',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'TaiKhoanXin - Bảo mật & mật khẩu',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Bảo mật & mật khẩu | TaiKhoanXin',
        description: 'Cập nhật mật khẩu và thiết lập bảo mật tài khoản của bạn.',
        images: [ogImage],
    },
};

export default function AccountPasswordPage() {
    return <AccountPasswordLayout />;
}

