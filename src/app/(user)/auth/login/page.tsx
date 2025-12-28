import type { Metadata } from 'next';
import LoginLayout from '@/layout/login';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://cdn.taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: 'Đăng nhập | TaiKhoanXin',
    description: 'Đăng nhập để tiếp tục mua tài khoản Netflix, Spotify, Office, Windows và nhiều dịch vụ khác tại TaiKhoanXin.',
    alternates: {
        canonical: `${siteUrl}/auth/login`,
    },
    openGraph: {
        title: 'Đăng nhập | TaiKhoanXin',
        description: 'Đăng nhập để tiếp tục mua tài khoản bản quyền.',
        url: `${siteUrl}/auth/login`,
        siteName: 'TaiKhoanXin',
        locale: 'vi_VN',
        type: 'website',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'TaiKhoanXin - Đăng nhập',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Đăng nhập | TaiKhoanXin',
        description: 'Đăng nhập để tiếp tục mua tài khoản bản quyền.',
        images: [ogImage],
    },
};

export default function LoginPage() {
    return <LoginLayout />;
}

