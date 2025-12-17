import type { Metadata } from 'next';
import OrderDetailPageClient from './OrderDetailPageClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: 'Chi tiết đơn hàng | TaiKhoanXin',
    description: 'Xem chi tiết đơn hàng của bạn trên TaiKhoanXin.',
    alternates: {
        canonical: `${siteUrl}/account/orders`,
    },
    openGraph: {
        title: 'Chi tiết đơn hàng | TaiKhoanXin',
        description: 'Xem chi tiết đơn hàng của bạn trên TaiKhoanXin.',
        url: `${siteUrl}/account/orders`,
        siteName: 'TaiKhoanXin',
        locale: 'vi_VN',
        type: 'website',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'TaiKhoanXin - Chi tiết đơn hàng',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Chi tiết đơn hàng | TaiKhoanXin',
        description: 'Xem chi tiết đơn hàng của bạn trên TaiKhoanXin.',
        images: [ogImage],
    },
};
export default function OrderDetailPage() {
    return <OrderDetailPageClient />;
}
