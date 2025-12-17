import type { Metadata } from 'next';
import CheckoutLayout from '@/layout/checkout';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: 'Thanh toán | TaiKhoanXin',
    description:
        'Hoàn tất thanh toán đơn hàng tài khoản bản quyền tại TaiKhoanXin – nhập thông tin nhận tài khoản và phương thức thanh toán an toàn.',
    openGraph: {
        title: 'Thanh toán | TaiKhoanXin',
        description:
            'Bước thanh toán cuối cùng để sở hữu tài khoản Netflix, YouTube Premium, Spotify, Office 365 và nhiều dịch vụ khác tại TaiKhoanXin.',
        url: `${siteUrl}/checkout`,
        siteName: 'TaiKhoanXin',
        type: 'website',
        locale: 'vi_VN',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'TaiKhoanXin - Thanh toán',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Thanh toán | TaiKhoanXin',
        description:
            'Nhập thông tin và thanh toán đơn hàng tài khoản bản quyền của bạn tại TaiKhoanXin.',
        images: [ogImage],
    },
    alternates: {
        canonical: `${siteUrl}/checkout`,
    },
};

export default function CheckoutPage() {
    return <CheckoutLayout />;
}

