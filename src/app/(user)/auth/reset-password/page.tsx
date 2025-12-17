import type { Metadata } from 'next';
import ResetPasswordLayout from '@/layout/resetPassword';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: 'Đặt lại mật khẩu | TaiKhoanXin',
    description: 'Nhập OTP và mật khẩu mới để hoàn tất quá trình khôi phục tài khoản TaiKhoanXin.',
    alternates: {
        canonical: `${siteUrl}/auth/reset-password`,
    },
    openGraph: {
        title: 'Đặt lại mật khẩu | TaiKhoanXin',
        description: 'Nhập OTP và mật khẩu mới để khôi phục tài khoản của bạn.',
        url: `${siteUrl}/auth/reset-password`,
        siteName: 'TaiKhoanXin',
        locale: 'vi_VN',
        type: 'website',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'TaiKhoanXin - Đặt lại mật khẩu',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Đặt lại mật khẩu | TaiKhoanXin',
        description: 'Nhập OTP và mật khẩu mới để khôi phục tài khoản của bạn.',
        images: [ogImage],
    },
};

export default function ResetPasswordPage() {
    return <ResetPasswordLayout />;
}

