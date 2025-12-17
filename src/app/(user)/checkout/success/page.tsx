import type { Metadata } from 'next';
import CheckoutSuccessLayout from '@/layout/checkoutSuccess';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: 'Xác nhận thanh toán | TaiKhoanXin',
    description:
        'Cảm ơn bạn đã đặt hàng tại TaiKhoanXin. Vui lòng Xác nhận thanh toán theo hướng dẫn để nhận tài khoản bản quyền nhanh nhất.',
    openGraph: {
        title: 'Xác nhận thanh toán | TaiKhoanXin',
        description:
            'Xem lại thông tin đơn hàng và hướng dẫn chuyển khoản để Xác nhận thanh toán tài khoản bản quyền tại TaiKhoanXin.',
        url: `${siteUrl}/checkout/success`,
        siteName: 'TaiKhoanXin',
        type: 'website',
        locale: 'vi_VN',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'TaiKhoanXin - Xác nhận thanh toán',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Xác nhận thanh toán | TaiKhoanXin',
        description:
            'Trang xác nhận đơn hàng và hướng dẫn thanh toán chi tiết tại TaiKhoanXin.',
        images: [ogImage],
    },
    alternates: {
        canonical: `${siteUrl}/checkout/success`,
    },
};

export default function CheckoutSuccessPage() {
    return <CheckoutSuccessLayout />;
}

