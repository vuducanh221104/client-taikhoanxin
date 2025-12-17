import type { Metadata } from 'next';
import RegisterLayout from '@/layout/register';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: 'Đăng ký tài khoản | TaiKhoanXin',
    description: 'Tạo tài khoản miễn phí để lưu đơn hàng, lịch sử giao dịch và nhận ưu đãi tại TaiKhoanXin.',
    alternates: {
        canonical: `${siteUrl}/auth/register`,
    },
    openGraph: {
        title: 'Đăng ký tài khoản | TaiKhoanXin',
        description: 'Tạo tài khoản miễn phí để lưu đơn hàng, lịch sử giao dịch và nhận ưu đãi.',
        url: `${siteUrl}/auth/register`,
        siteName: 'TaiKhoanXin',
        locale: 'vi_VN',
        type: 'website',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'TaiKhoanXin - Đăng ký',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Đăng ký tài khoản | TaiKhoanXin',
        description: 'Tạo tài khoản miễn phí để lưu đơn hàng, lịch sử giao dịch và nhận ưu đãi.',
        images: [ogImage],
    },
};

export default function RegisterPage() {
    return <RegisterLayout />;
}

