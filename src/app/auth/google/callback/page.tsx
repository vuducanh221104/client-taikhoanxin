import type { Metadata } from 'next';
import GoogleCallbackLayout from '@/layout/googleCallback';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://cdn.taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: 'Xác minh đăng nhập Google | TaiKhoanXin',
    description: 'Đang xác minh đăng nhập Google và chuyển hướng bạn về tài khoản TaiKhoanXin.',
    alternates: {
        canonical: `${siteUrl}/auth/google/callback`,
    },
    openGraph: {
        title: 'Xác minh đăng nhập Google | TaiKhoanXin',
        description: 'Đang xác minh đăng nhập Google và chuyển hướng bạn về tài khoản TaiKhoanXin.',
        url: `${siteUrl}/auth/google/callback`,
        siteName: 'TaiKhoanXin',
        locale: 'vi_VN',
        type: 'website',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'TaiKhoanXin - Xác minh đăng nhập Google',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Xác minh đăng nhập Google | TaiKhoanXin',
        description: 'Đang xác minh đăng nhập Google và chuyển hướng bạn về tài khoản TaiKhoanXin.',
        images: [ogImage],
    },
};

export default function GoogleAuthCallbackPage() {
    return <GoogleCallbackLayout />;
}

