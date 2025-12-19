import type { Metadata } from 'next';
import ForgotPasswordLayout from '@/layout/forgotPassword';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://cdn.taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: 'Quên mật khẩu | TaiKhoanXin',
    description: 'Nhập email để nhận mã OTP và khôi phục mật khẩu tài khoản TaiKhoanXin của bạn.',
    alternates: {
        canonical: `${siteUrl}/auth/forgot-password`,
    },
    openGraph: {
        title: 'Quên mật khẩu | TaiKhoanXin',
        description: 'Gửi mã OTP đến email để khôi phục mật khẩu tài khoản của bạn.',
        url: `${siteUrl}/auth/forgot-password`,
        siteName: 'TaiKhoanXin',
        locale: 'vi_VN',
        type: 'website',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'TaiKhoanXin - Quên mật khẩu',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Quên mật khẩu | TaiKhoanXin',
        description: 'Gửi mã OTP đến email để khôi phục mật khẩu tài khoản của bạn.',
        images: [ogImage],
    },
};

export default function ForgotPasswordPage() {
    return <ForgotPasswordLayout />;
}
