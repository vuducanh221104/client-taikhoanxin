import type { Metadata } from 'next';
import CartLayout from '@/layout/cart';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://cdn.taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: 'Giỏ hàng | TaiKhoanXin',
    description:
        'Xem lại giỏ hàng của bạn tại TaiKhoanXin – tổng hợp các tài khoản bản quyền Netflix, YouTube Premium, Spotify, Office 365 và nhiều dịch vụ khác.',
    openGraph: {
        title: 'Giỏ hàng | TaiKhoanXin',
        description:
            'Quản lý giỏ hàng và hoàn tất đơn mua tài khoản bản quyền của bạn tại TaiKhoanXin.',
        url: `${siteUrl}/cart`,
        siteName: 'TaiKhoanXin',
        type: 'website',
        locale: 'vi_VN',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'TaiKhoanXin - Giỏ hàng',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Giỏ hàng | TaiKhoanXin',
        description:
            'Xem và quản lý giỏ hàng tài khoản bản quyền của bạn tại TaiKhoanXin.',
        images: [ogImage],
    },
    alternates: {
        canonical: `${siteUrl}/cart`,
    },
};

export default function CartPage() {
    return <CartLayout />;
}

